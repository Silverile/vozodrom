import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const REPO=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
export const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const words=s=>norm(s).split(' ').filter(Boolean);
const contains=(hay,needle)=>(' '+norm(hay)+' ').includes(' '+norm(needle)+' ');
export function chassisTokens(g){return [...new Set(((g.code||'')+' '+(g.gen||'')).match(/\b[A-Z0-9][A-Z0-9-]{1,7}\b/g)||[])].filter(s=>/[A-Z]/.test(s)&&!/^(?:I|II|III|IV|V|VI|VII|VIII|IX|MK|GT|GTI|RS|SUV|PHEV|HEV|EV)$/.test(s)).map(norm);}
export function ordinal(g){return ((g.code||'')+' '+(g.gen||'')).match(/\b(?:Mk\s*)?(VIII|VII|VI|IV|III|II|IX|V|I)\b/)?.[1]||null;}
export function identityEvidence(label,g){
 const tokens=chassisTokens(g);if(tokens.some(c=>contains(label,c)))return 'generation-code';
 const n=ordinal(g);if(n&&new RegExp('\\b'+n.toLowerCase()+'\\b').test(norm(label)))return 'generation-ordinal';
 return null;
}
export const DEFAULT_TARGETS='C:/Workspace/Projects/CF/vozodrom-data/front-photos/seznam.csv';
export function parseTargets(csv){
 const records=[];let row=[],cell='',quoted=false;
 for(let i=0;i<csv.length;i++){
  const c=csv[i];if(c==='"'){if(quoted&&csv[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}
  else if(!quoted&&(c===';'||c==='\n')){row.push(cell.replace(/\r$/,''));cell='';if(c==='\n'){records.push(row);row=[];}}
  else cell+=c;
 }
 if(quoted)throw Error('Unterminated CSV quote');if(cell||row.length){row.push(cell.replace(/\r$/,''));records.push(row);}
 const header=records.shift()?.map(x=>x.replace(/^\uFEFF/,''));if(!header?.includes('id')||!header.includes('no')||!header.includes('wave'))throw Error('Invalid targets CSV header');
 const rows=records.filter(r=>r.some(Boolean)).map(r=>Object.fromEntries(header.map((h,i)=>[h,r[i]||'']))).map(r=>({...r,rank:Number(r.no),wave:Number(r.wave),registeredCz:Number(r.registered_cz)}));
 if(rows.some(r=>!/^[-a-z0-9]+--[-a-z0-9]+--\d+$/.test(r.id)||!Number.isInteger(r.rank)||r.rank<1||![1,2,3].includes(r.wave))||new Set(rows.map(r=>r.id)).size!==rows.length||new Set(rows.map(r=>r.rank)).size!==rows.length)throw Error('Invalid/duplicate target rows');
 return rows.sort((a,b)=>a.rank-b.rank);
}
export function catalog({repo=REPO,targets=DEFAULT_TARGETS,wave=null}={}){
 const makes=new Map(JSON.parse(fs.readFileSync(path.join(repo,'src/data/catalog/makes.json'))).filter(m=>m.sections?.includes('auto')).map(m=>[m.slug,m]));
 const aliases=new Map(JSON.parse(fs.readFileSync(path.join(repo,'src/data/catalog/model-lines-auto.json'))).map(l=>[l.makeSlug+'--'+l.slug,l.aliases||[]]));
 const targetRows=targets===null?[]:parseTargets(fs.readFileSync(targets,'utf8')),targetMap=new Map(targetRows.map(t=>[t.id,t]));
 const index=JSON.parse(fs.readFileSync(path.join(repo,'src/data/model-cards-index.json'))),all=[];
 for(const [makeSlug,lines] of Object.entries(index))for(const [lineSlug,l] of Object.entries(lines)){
  const m=makes.get(makeSlug);if(!m)continue;
  l.generations.forEach((g,i)=>{
   const id=`${makeSlug}--${lineSlug}--${i}`,target=targetMap.get(id);
   all.push({id,makeSlug,make:m.name,makeAliases:m.aliases||[],line:l.name,lineSlug,aliases:[l.name,...l.name.split(/\s+\/\s+/),...(aliases.get(makeSlug+'--'+lineSlug)||[])],gen:g.name||g.code||'',code:g.code,from:g.from,to:g.to,current:g.current===true,body:g.bodyTypes||[],dims:g.dimensionsMm||{},facelifts:g.facelifts||[],siblings:l.generations.length,hasCatalogPhoto:!!g.photo,catalogPhotoPage:g.photo?.page||null,rank:target?.rank??null,wave:target?.wave??null,registeredCz:target?.registeredCz??null,target:!!target,eligible:targets===null||!!target&&(!wave||target.wave===Number(wave))});
  });
 }
 const ids=new Set(all.map(g=>g.id));const missing=targetRows.filter(t=>!ids.has(t.id));if(missing.length)throw Error('Target IDs absent from merged index: '+missing.map(t=>t.id).join(', '));
 return all.sort((a,b)=>(a.rank??Infinity)-(b.rank??Infinity)||a.id.localeCompare(b.id));
}
export function productionYears(title){
 // Captions/model headings only: never feed surrounding navigation, publish dates or EXIF.
 const m=title.match(/\b((?:18|19|20)\d{2})(?:\s*[-–—]\s*(?:(?:\d{1,2}\.)?((?:18|19|20)\d{2}|\d{2})|present|current|now|н\.в\.|\?+))?/i);
 if(!m)return null;
 const from=Number(m[1]);let to=from;
 if(m[2]){to=Number(m[2]);if(m[2].length===2){to=Math.floor(from/100)*100+to;if(to<from)to+=100;}}
 else if(/[-–—]/.test(m[0]))to=null;
 return{from,to};
}
export function modelScore(label,g,makeContext=null){
 if(makeContext&&makeContext!==g.makeSlug)return 0;
 // These separate Toyota lines are not yet present in the merged index.
 if(g.makeSlug==='toyota'&&['corolla','yaris'].includes(norm(g.line))&&contains(label,g.line+' Cross'))return 0;
 if(!makeContext&&![g.make,...g.makeAliases].some(a=>contains(label,a)))return 0;
 if(/\b(?:concept|prototype|racing|rally|tuning|engine|interior|front panel|badge|dashboard)\b/i.test(label))return 0;
 const score=Math.max(0,...g.aliases.filter(a=>contains(label,a)).map(a=>words(a).length*100+norm(a).length));
 return score;
}
export function matchGeneration(label,all,makeContext=null){
 const years=productionYears(label);
 const scored=all.filter(g=>[g.make,...g.makeAliases].some(a=>contains(label,a))).map(g=>({g,score:modelScore(label,g,makeContext)})).filter(x=>x.score);
 const max=Math.max(0,...scored.map(x=>x.score));
 let models=scored.filter(x=>x.score===max).map(x=>x.g);
 const named=models.filter(g=>identityEvidence(label,g));if(named.length)models=named;
 if(!years&&!named.length)return{match:null,reason:'missing-model-years'};
 const possible=models.filter(g=>!years||g.from&&years.from>=g.from&&years.from<=(g.to||new Date().getUTCFullYear())&&(years.to===null?!g.to:years.to<=(g.to||new Date().getUTCFullYear())));
 if(possible.length!==1)return{match:null,reason:possible.length?'ambiguous-generation-or-facelift':'outside-known-generation-years',ids:possible.map(g=>g.id),years};
 return{match:possible[0].eligible?possible[0]:null,reason:possible[0].eligible?(identityEvidence(label,possible[0])||'unique-model-production-years'):'outside-target-list',years};
}
export function makeMatch(label,all){
 const names=new Map();for(const g of all)for(const name of [g.make,...g.makeAliases])if(norm(name)===norm(label))names.set(g.makeSlug,g.makeSlug);
 return names.size===1?[...names.values()][0]:null;
}
