import fs from 'node:fs';
import {selection,additionalPages} from './model-line-selection.mjs';
const out='analysis/codex/model-line-evidence.json';
const saved=fs.existsSync(out)?JSON.parse(fs.readFileSync(out)):{retrievedAt:new Date().toISOString(),endpoint:'https://en.wikipedia.org/w/api.php',pages:{},redirects:{},requests:[]};
const titles=[...new Set([...Object.values(selection).flatMap(s=>s.split('\n').map(r=>r.split('|')[1])),...Object.values(additionalPages).flat()])];
function clean(s='') {return s.replace(/<ref\b[^>]*>[\s\S]*?<\/ref\s*>/gi,'').replace(/<ref\b[^>]*\/\s*>/gi,'').replace(/<!--[^]*?-->/g,'').replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g,'$2').replace(/\[\[([^\]]+)\]\]/g,'$1').replace(/\{\{(?:start date|end date|dts)(?: and age)?\|(?:df=yes\|)?(\d{4})[^}]*\}\}/gi,'$1').replace(/\{\{(?:ubl|unbulleted list|plainlist|plain list|hlist|flatlist|nowrap|small|smalllist|collapsible list)\s*\|/gi,'').replace(/\{\{[a-z _-]+\|/gi,'').replace(/\{\{|\}\}/g,'').replace(/<br\s*\/?\s*>|\n\s*\*|\|/gi,'; ').replace(/<[^>]+>/g,'').replace(/&nbsp;|&#160;/g,' ').replace(/&ndash;|&#8211;/g,'–').replace(/&amp;/g,'&').replace(/'{2,}/g,'').replace(/\s+/g,' ').replace(/;\s*;/g,';').trim();}
function boxes(text) {
 text=text.replace(/<!--[\s\S]*?-->/g,'').replace(/<ref\b[^>]*\/\s*>/gi,'').replace(/<ref\b[^>]*>[\s\S]*?<\/ref\s*>/gi,'').replace(/\{\{(?:ndash|mdash|spaced ndash|spaced en dash)\}\}/gi,'–');
 const result=[]; const re=/\{\{Infobox\s+(?:automobile|car|electric vehicle)\b/gi; let m;
 while((m=re.exec(text))){let depth=0,end=m.index,link=0,parts=[],start=null;
  for(let i=m.index;i<text.length-1;i++){
   const pair=text.slice(i,i+2);
   if(pair==='{{'){depth++;i++;continue;}if(pair==='}}'){depth--;if(depth===0){if(start!==null)parts.push(text.slice(start,i));end=i+2;break;}i++;continue;}
   if(pair==='[['){link++;i++;continue;}if(pair===']]'){link--;i++;continue;}
   if(text[i]==='|'&&depth===1&&link===0){if(start!==null)parts.push(text.slice(start,i));start=i+1;}
  }
  if(end===m.index){result.push({heading:'',parseError:'Unbalanced infobox template; facts require manual review'});break;}
  const fields={};for(const p of parts){const eq=p.indexOf('=');if(eq<0)continue;const k=p.slice(0,eq).trim().toLowerCase().replace(/ /g,'_');if(['name','production','body_style','class','model_code','modelcode','aka'].includes(k))fields[k]=clean(p.slice(eq+1));}
  const headings=[...text.slice(0,m.index).matchAll(/^={2,4}\s*([^\n]*?)\s*={2,4}\s*$/gm)];
  result.push({heading:clean(headings.at(-1)?.[1]||''),...fields});re.lastIndex=end;
 }
 return result;
}
const pending=titles.filter(t=>{let n=t;const seen=new Set();while(saved.redirects[n]&&!seen.has(n)){seen.add(n);n=saved.redirects[n];}return process.argv.includes('--refresh')||saved.pages[n]?.parserVersion!==3;});
for(let i=0;i<pending.length;i+=30){const batch=pending.slice(i,i+30);const url='https://en.wikipedia.org/w/api.php?'+new URLSearchParams({action:'query',format:'json',formatversion:'2',redirects:'1',prop:'revisions|pageprops',ppprop:'wikibase_item',rvprop:'ids|timestamp|content',rvslots:'main',titles:batch.join('|')});
 for(let attempt=0;attempt<3;attempt++)try{
  const response=await fetch(url,{signal:AbortSignal.timeout(60000),headers:{'User-Agent':'VozodromCatalogueResearch/1.0 (vehicle facts research)'}});if(!response.ok)throw Error('HTTP '+response.status);const data=await response.json();if(data.error)throw Error(JSON.stringify(data.error));
  saved.requests.push({retrievedAt:new Date().toISOString(),titles:batch,status:response.status});
  for(const r of [...(data.query.normalized||[]),...(data.query.redirects||[])])saved.redirects[r.from]=r.to;
  for(const p of data.query.pages){const r=p.revisions?.[0],text=r?.slots.main.content||'';saved.pages[p.title]={parserVersion:3,title:p.title,missing:!!p.missing,url:'https://en.wikipedia.org/wiki/'+encodeURIComponent(p.title.replaceAll(' ','_')),revisionId:r?.revid??null,revisionAt:r?.timestamp??null,wikidataQid:p.pageprops?.wikibase_item??null,infoboxes:boxes(text),linkedModelPages:[...new Set([...text.matchAll(/\[\[((?:BMW|Toyota|Volvo|Opel|Fiat|Renault|Volkswagen|Tesla|Mini|Škoda)[^\]|#\n]+)(?:[\]|#])/g)].map(m=>m[1]))].slice(0,60),marketMentions:['Europe','European','United Kingdom','Germany','Czech','France','Italy','Poland'].filter(w=>text.includes(w))};}
  fs.writeFileSync(out,JSON.stringify(saved,null,2)+'\n');console.log('Retrieved',Math.min(i+30,pending.length)+'/'+pending.length);break;
 }catch(e){console.error('batch',i,'attempt',attempt,e.message);if(attempt===2)throw e;await new Promise(r=>setTimeout(r,e.message.includes('429')?30000:5000));}
 await new Promise(r=>setTimeout(r,6500));
}
console.log('Pages',Object.keys(saved.pages).length,'missing',Object.values(saved.pages).filter(p=>p.missing).map(p=>p.title));
