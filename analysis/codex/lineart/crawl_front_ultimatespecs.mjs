import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import sharp from 'sharp';
import {Client,Stop,Missing,Budget,links,text,automationBan,sha} from './front_source_client.mjs';
import {catalog,matchGeneration,makeMatch,modelScore,DEFAULT_TARGETS} from './front_catalog.mjs';
import {images} from './crawl_front_carswp.mjs';

export function modelYears(body){
 const t=text(body),m=t.match(/Production years:\s*from\s*((?:18|19|20)\d{2})\s+to\s*((?:18|19|20)\d{2}|present)/i);
 return m?`${m[1]}–${m[2]}`:null;
}
export async function run(argv=process.argv.slice(2)){
 const o={pages:20,maxMinutes:20,maxImages:Infinity,dryRun:false,perGeneration:20,targets:DEFAULT_TARGETS};
 for(let i=0;i<argv.length;i++){
  const k=argv[i];if(k==='--out')o.out=argv[++i];else if(k==='--dry-run')o.dryRun=true;else if(k==='--only')o.only=new RegExp(argv[++i]);
  else if(k==='--seed')o.seed=argv[++i];else if(k==='--pages')o.pages=Number(argv[++i]);else if(k==='--max-images')o.maxImages=Number(argv[++i]);else if(k==='--max-minutes')o.maxMinutes=Number(argv[++i]);else if(k==='--targets')o.targets=argv[++i];else if(k==='--wave')o.wave=Number(argv[++i]);else if(k==='--list')o.list=true;else if(k==='--per-generation')o.perGeneration=Number(argv[++i]);else throw Error('Unknown argument '+k);
 }
 const all=catalog({targets:o.targets,wave:o.wave}),eligible=all.filter(g=>g.eligible&&(!o.only||o.only.test(g.id))),wanted=new Set(eligible.map(g=>g.id));
 if(o.list){console.log(JSON.stringify({source:'ultimatespecs',targets:o.targets,wave:o.wave||null,total:eligible.length,sample:eligible.slice(0,5).map(g=>({id:g.id,rank:g.rank,hasCatalogPhoto:g.hasCatalogPhoto}))}));return;}
 if(!o.out||!(o.pages>0)||!(o.maxMinutes>0)||!(o.maxImages>0)||!(o.perGeneration>0&&o.perGeneration<=20))throw Error('Require --out and positive budgets (per-generation <=20)');
 const root=path.resolve(o.out);fs.mkdirSync(root,{recursive:true});const testRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'test-out');
 if(root===testRoot||root.startsWith(testRoot+path.sep)){fs.writeFileSync(path.join(testRoot,'.gitignore'),'*\n!.gitignore\n');o.maxImages=Math.min(30,o.maxImages);}
 const prefix=o.dryRun?'dry-run-':'',statePath=path.join(root,prefix+'state.json'),indexPath=path.join(root,prefix+'candidates.json');
 const signature=JSON.stringify({source:'ultimatespecs',version:2,targets:sha(fs.readFileSync(o.targets)),wave:o.wave||null,only:o.only?.source||null,seed:o.seed||null,perGeneration:o.perGeneration});
 let state={signature,queue:[{url:o.seed||'https://www.ultimatespecs.com/car-specs'}],seen:[],pending:[],rejected:[]},rows=[],valid=false;
 const lock=path.join(root,'.crawl.lock'),fd=fs.openSync(lock,'wx');fs.writeFileSync(fd,String(process.pid));
 const client=new Client({hosts:['www.ultimatespecs.com'],maxMinutes:o.maxMinutes});
 let pages=0,saved=0,planned=0,stop='page budget';
 const atomic=(f,v)=>{fs.writeFileSync(f+'.tmp',JSON.stringify(v,null,2)+'\n');fs.renameSync(f+'.tmp',f);};
 const save=()=>{atomic(indexPath,rows);atomic(statePath,state);};
 const enqueue=(item)=>{const u=new URL(item.url);u.hash='';if(u.hostname!=='www.ultimatespecs.com'||u.protocol!=='https:')return;item.url=u.href;if(!state.seen.includes(item.url)&&!state.queue.some(q=>q.url===item.url)){state.queue.push(item);state.queue.sort((a,b)=>(a.rank??Infinity)-(b.rank??Infinity)||Number(!!b.gallery)-Number(!!a.gallery));}};
 try{
  if(fs.existsSync(statePath))state=JSON.parse(fs.readFileSync(statePath));
  if(state.signature!==signature)throw new Stop('Output state belongs to a different filter/source');
  if(fs.existsSync(indexPath))rows=JSON.parse(fs.readFileSync(indexPath));
  if(!Array.isArray(rows)){rows=[];throw new Stop('Invalid candidate index');}
  if(rows.some(r=>!r||typeof r.id!=='string'||!Array.isArray(r.files))){rows=[];throw new Stop('Invalid candidate row');}
  for(const row of rows){const keep=[];for(const f of row.files){
   if(o.dryRun){keep.push(f);continue;}
   if(!/^cand\/[a-z0-9-]+\/[a-f0-9]{16}\.jpg$/.test(f.local||''))throw new Stop('Unsafe local path');
   const local=path.join(root,f.local);if(fs.existsSync(local)&&sha(fs.readFileSync(local))===f.sha256)keep.push(f);else state.pending.unshift({...f,generationId:row.id});
  }row.files=keep;}
  valid=true;
  const p=await client.get('https://www.ultimatespecs.com/privacy-policy');if(automationBan(p.body))throw new Stop('Automated access terms changed: '+automationBan(p.body));
  state.policy={url:p.url,sha256:p.sha256,checkedAt:new Date().toISOString(),automatedAccessBanFound:false};
  while((state.queue.length||state.pending.length)&&saved<o.maxImages&&planned<o.maxImages){
   if(state.pending.length){
    const f=state.pending[0];let row=rows.find(r=>r.id===f.generationId);
    if(!row){row={...all.find(g=>g.id===f.generationId),source:'ultimatespecs',sourcePage:f.sourcePage,category:null,files:[],reviewRequired:true};rows.push(row);}
    if(row.files.length>=o.perGeneration||row.files.some(x=>x.url===f.url)){state.pending.shift();save();continue;}
    if(o.dryRun){row.files.push({...f,local:null,status:'planned'});planned++;}
    else{const p=await client.get(f.url),m=await sharp(p.data).metadata();if(m.width>=1000){const local=`cand/${row.id}/${sha(f.url).slice(0,16)}.jpg`,target=path.join(root,local);fs.mkdirSync(path.dirname(target),{recursive:true});const tmp=target+'.tmp.jpg';const info=await sharp(p.data).rotate().resize({width:1600,withoutEnlargement:true}).jpeg({quality:92}).toFile(tmp);fs.renameSync(tmp,target);row.files.push({...f,local,width:m.width,height:m.height,localWidth:info.width,localHeight:info.height,sha256:sha(fs.readFileSync(target))});saved++;}}
    state.pending.shift();save();continue;
   }
   if(pages>=o.pages)break;
   const item=state.queue[0];let p;try{p=await client.get(item.url);}catch(e){if(e instanceof Missing){state.seen.push(item.url);state.queue.shift();save();continue;}throw e;}
   pages++;const title=text(p.body.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]||p.body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||'');
   const ls=links(p.body,p.url),years=modelYears(p.body),matched=item.generationId?{match:all.find(g=>g.id===item.generationId),years:item.years,reason:'inherited-validated-model-gallery'}:matchGeneration(title+(years?' '+years:''),all);
   const g=matched.match&&wanted.has(matched.match.id)?matched.match:null;
   if(years&&!g)state.rejected.push({url:p.url,title,productionYears:years,reason:matched.reason,ids:matched.ids||[]});
   if(g&&item.gallery){
    // Fetch only URLs actually exposed as full-size gallery links/data attributes.
    const urls=new Set(ls.filter(l=>/\/cargallery\/.*\.(?:jpg|jpeg|png)(?:\?|$)/i.test(l.url)).map(l=>l.url));
    for(const image of images(p.body,p.url))if(/\/cargallery\/.*\.(?:jpg|jpeg|png)(?:\?|$)/i.test(image.url)&&!/^w\d+_/i.test(new URL(image.url).pathname.split('/').pop()))urls.add(image.url);
    for(const m of p.body.matchAll(/data-(?:src|full|original)=["']([^"']+)["']/g)){const u=new URL(m[1].replaceAll('&amp;','&'),p.url);if(/\/cargallery\/.*\.(?:jpg|jpeg|png)$/i.test(u.href))urls.add(u.href);}
    for(const url of urls){if(new URL(url).hostname!=='www.ultimatespecs.com')continue;state.pending.push({generationId:g.id,title:item.label||title,url,page:p.url,source:'ultimatespecs',sourcePage:p.url,modelPage:item.modelPage,year:item.years?.from,productionYears:item.years,licence:'unknown/all-rights-reserved',licenceUrl:null,author:null,evidence:['make-model-heading','explicit-production-years','unique-generation-among-all-stages'],frontTitled:false,viewStatus:'unverified'});}
   }
   for(const l of ls){
    const u=new URL(l.url);if(u.hostname!=='www.ultimatespecs.com'||u.hash)continue;
    if(/^\/car-specs\/[^/]+-models$/.test(u.pathname)){const make=makeMatch(l.title,eligible);if(make)enqueue({url:l.url,context:make,rank:Math.min(...eligible.filter(g=>g.makeSlug===make).map(g=>g.rank))});}
    if(/^\/car-specs\/[^/]+\/M\d+\//.test(u.pathname)){const relevant=eligible.filter(g=>modelScore(l.title,g,item.context)>0);if(relevant.length)enqueue({url:l.url,context:item.context,rank:Math.min(...relevant.map(g=>g.rank))});}
    if(g&&/^\/gallery\//.test(u.pathname))enqueue({url:l.url,gallery:true,generationId:g.id,label:title,years:matched.years,modelPage:p.url,rank:g.rank});
   }
   state.seen.push(item.url);state.queue=state.queue.filter(q=>q.url!==item.url);save();console.log(JSON.stringify({page:p.url,title,years,match:g?.id||null,reason:matched.reason,queued:state.queue.length,pending:state.pending.length}));
  }
  stop=saved>=o.maxImages||planned>=o.maxImages?'image budget':state.queue.length||state.pending.length?'page budget':'queue exhausted';
 }catch(e){stop=e.message;if(!(e instanceof Budget))process.exitCode=1;}
 finally{if(valid)save();const report={source:'ultimatespecs',dryRun:o.dryRun,stop,requests:client.requests,pages,saved,planned,mappedGenerations:rows.length,retainedCandidates:rows.reduce((n,r)=>n+r.files.length,0),eligibleGenerations:eligible.length,queued:state.queue.length,pending:state.pending.length,policies:client.evidence};if(valid)atomic(path.join(root,prefix+'report.json'),report);fs.closeSync(fd);fs.unlinkSync(lock);console.log(JSON.stringify(report));}
}
if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url)await run();
