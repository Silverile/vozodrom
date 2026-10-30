import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import sharp from 'sharp';
import {Client,Stop,Missing,Budget,links,text,automationBan,sha} from './front_source_client.mjs';
import {catalog,matchGeneration,makeMatch,modelScore,DEFAULT_TARGETS} from './front_catalog.mjs';

export function attrs(tag){return Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*["']([^"']*)["']/g)].map(m=>[m[1].toLowerCase(),m[2].trim().replaceAll('&amp;','&')]));}
export function images(html,base){return [...html.matchAll(/<img\b[^>]*>/g)].flatMap(m=>{const a=attrs(m[0]);try{return[{...a,url:new URL(a.src,base).href}];}catch{return[];}});}
const pageTitle=html=>text(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]||html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||'');
const usableView=t=>!/\b(?:rear|interior|front panel|engine|dashboard|detail|badge|side|three[ -]quarter|3\/4)\b/i.test(t);
export async function run(argv=process.argv.slice(2)){
 const o={out:null,pages:100,maxMinutes:20,maxImages:Infinity,dryRun:false,perGeneration:20,targets:DEFAULT_TARGETS};
 for(let i=0;i<argv.length;i++){
  const k=argv[i];if(k==='--out')o.out=argv[++i];else if(k==='--dry-run')o.dryRun=true;
  else if(k==='--pages')o.pages=Number(argv[++i]);else if(k==='--max-minutes')o.maxMinutes=Number(argv[++i]);
  else if(k==='--max-images')o.maxImages=Number(argv[++i]);else if(k==='--only')o.only=new RegExp(argv[++i]);
  else if(k==='--targets')o.targets=argv[++i];else if(k==='--wave')o.wave=Number(argv[++i]);else if(k==='--list')o.list=true;else if(k==='--per-generation')o.perGeneration=Number(argv[++i]);
  else if(k==='--seed')o.seed=argv[++i];else throw Error('Unknown flag '+k);
 }
 const all=catalog({targets:o.targets,wave:o.wave}),eligible=all.filter(g=>g.eligible&&(!o.only||o.only.test(g.id)));
 if(o.list){console.log(JSON.stringify({source:'carswp',targets:o.targets,wave:o.wave||null,total:eligible.length,sample:eligible.slice(0,5).map(g=>({id:g.id,rank:g.rank,hasCatalogPhoto:g.hasCatalogPhoto}))}));return;}
 if(!o.out||!(o.pages>0)||!(o.maxMinutes>0)||!(o.maxImages>0)||!(o.perGeneration>0&&o.perGeneration<=20))throw Error('Require --out and positive budgets (per-generation <=20)');
 const root=path.resolve(o.out);fs.mkdirSync(root,{recursive:true});
 const testRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'test-out');
 if(root===testRoot||root.startsWith(testRoot+path.sep)){
  fs.writeFileSync(path.join(testRoot,'.gitignore'),'*\n!.gitignore\n');o.maxImages=Math.min(30,o.maxImages);
 }
 const statePath=path.join(root,o.dryRun?'dry-run-state.json':'state.json');
 const indexPath=path.join(root,o.dryRun?'dry-run-candidates.json':'candidates.json');
 const lock=path.join(root,'.crawl.lock');let fd;
 try{fd=fs.openSync(lock,'wx');fs.writeFileSync(fd,String(process.pid));}catch{throw Error('Output already locked; inspect its recorded PID before restarting');}
 const wanted=new Set(eligible.map(g=>g.id));
 const signature=JSON.stringify({source:'carswp',version:2,targets:sha(fs.readFileSync(o.targets)),wave:o.wave||null,only:o.only?.source||null,seed:o.seed||null,perGeneration:o.perGeneration});
 let state={signature,queue:[{url:o.seed||'https://www.carswp.com/allcars',context:null}],seen:[],missing:[],pending:[],mapped:[]};
 let rows=[];const client=new Client({hosts:['www.carswp.com','img.carswp.com'],maxMinutes:o.maxMinutes});
 let pages=0,saved=0,planned=0,stop='page budget',error=null,stateValid=false;
 const atomic=(file,value)=>{fs.writeFileSync(file+'.tmp',JSON.stringify(value,null,2)+'\n');fs.renameSync(file+'.tmp',file);};
 const save=()=>{atomic(indexPath,rows);atomic(statePath,state);};
 const enqueue=(url,context,first=false,rank=Infinity)=>{
  const u=new URL(url);u.hash='';if(u.hostname!=='www.carswp.com'||u.protocol!=='https:')return;
  if(!state.seen.includes(u.href)&&!state.queue.some(q=>q.url===u.href)){const item={url:u.href,context,rank,first};state.queue.push(item);state.queue.sort((a,b)=>Number(!!b.first)-Number(!!a.first)||(a.rank??Infinity)-(b.rank??Infinity));}
 };
 try{
  if(fs.existsSync(statePath))state=JSON.parse(fs.readFileSync(statePath));
  if(state.signature!==signature)throw new Stop('Output state belongs to different source/filter/seed');
  if(fs.existsSync(indexPath))rows=JSON.parse(fs.readFileSync(indexPath));
  if(!Array.isArray(rows)){rows=[];throw new Stop('Invalid candidate index');}
  if(rows.some(r=>!r||typeof r.id!=='string'||!Array.isArray(r.files))){rows=[];throw new Stop('Invalid candidate row');}
  for(const row of rows){
   const keep=[];
   for(const f of row.files){
    if(o.dryRun){keep.push(f);continue;}
    if(!/^cand\/[a-z0-9-]+\/[a-f0-9]{16}\.jpg$/.test(f.local||''))throw new Stop('Unsafe local path');
    const local=path.join(root,f.local);
    if(fs.existsSync(local)&&sha(fs.readFileSync(local))===f.sha256)keep.push(f);
    else state.pending.unshift({...f,generationId:row.id});
   }row.files=keep;
  }
  stateValid=true;
  // Recheck source policy on every invocation. Public policy exposes no automation ban.
  const policy=await client.get('https://www.carswp.com/privacy');
  if(automationBan(policy.body))throw new Stop('Automated access terms changed: '+automationBan(policy.body));
  state.policy={url:policy.url,sha256:policy.sha256,checkedAt:new Date().toISOString(),usage:'Personal-use-only wallpapers; publisher cannot grant third-party republication rights. Input photographs are not publication assets.'};
  while((state.queue.length||state.pending.length)&&saved<o.maxImages&&planned<o.maxImages){
   if(state.pending.length){
    const f=state.pending[0];let row=rows.find(r=>r.id===f.generationId);
    if(!row){const g=all.find(g=>g.id===f.generationId);row={...g,source:'carswp',sourcePage:f.sourcePage,category:null,files:[],reviewRequired:true};rows.push(row);}
    if(row.files.some(x=>x.url===f.url)||row.files.length>=o.perGeneration){state.pending.shift();save();continue;}
    if(o.dryRun){row.files.push({...f,local:null,status:'planned'});planned++;}
    else{
     const image=await client.get(f.url),meta=await sharp(image.data).metadata();
     if(meta.width>=1000){
      const local=`cand/${row.id}/${sha(f.url).slice(0,16)}.jpg`,target=path.join(root,local);fs.mkdirSync(path.dirname(target),{recursive:true});
      const tmp=target+'.tmp.jpg';const info=await sharp(image.data).rotate().resize({width:1600,withoutEnlargement:true}).jpeg({quality:92}).toFile(tmp);fs.renameSync(tmp,target);
      row.files.push({...f,local,width:meta.width,height:meta.height,localWidth:info.width,localHeight:info.height,sha256:sha(fs.readFileSync(target))});saved++;
     }
    }
    state.pending.shift();save();continue;
   }
   if(pages>=o.pages)break;
   const item=state.queue[0];if(state.seen.includes(item.url)){state.queue.shift();continue;}
   let p;try{p=await client.get(item.url);}catch(e){if(e instanceof Missing){state.missing.push(item.url);state.seen.push(item.url);state.queue.shift();save();continue;}throw e;}
   pages++;const title=pageTitle(p.body),ls=links(p.body,p.url),ims=images(p.body,p.url);
   const context=item.context||makeMatch(new URL(p.url).pathname.split('/').filter(Boolean)[0]?.replaceAll('-',' ')||'',eligible);
   const matched=matchGeneration(title,all,context);
   const g=matched.match&&wanted.has(matched.match.id)?matched.match:null;
   const candidates=g?ims.filter(i=>new URL(i.url).hostname==='img.carswp.com'&&Number(i.width)>=1000&&usableView(i.alt||title)):[];
   for(const i of candidates){state.pending.push({generationId:g.id,title:i.alt||title,url:i.url,page:p.url,source:'carswp',sourcePage:p.url,year:matched.years.from,productionYears:matched.years,licence:'unknown/all-rights-reserved',licenceUrl:'https://www.carswp.com/privacy',author:null,evidence:['exact-make-context-or-name','model-alias','unique-production-years-among-all-stages'],frontTitled:/\bfront(?:al)?\b/i.test(i.alt||title),viewStatus:'unverified'});}
   if(g)state.mapped.push({id:g.id,sourcePage:p.url,years:matched.years});
   for(const l of ls){
    const u=new URL(l.url);if(u.hostname!=='www.carswp.com'||u.hash&&u.pathname===new URL(p.url).pathname&&u.search===new URL(p.url).search||/\/download\//.test(u.pathname))continue;
    const make=makeMatch(l.title,eligible);
    if(!context&&make&&u.pathname.split('/').filter(Boolean).length===1){enqueue(l.url,make,false,Math.min(...eligible.filter(g=>g.makeSlug===make).map(g=>g.rank)));continue;}
    const relevant=eligible.filter(target=>modelScore(l.title,target,context)>0),rank=Math.min(...relevant.map(g=>g.rank));
    if(relevant.length&&!/\.htm$/.test(u.pathname))enqueue(l.url,context,/\bfront(?:al)?\b/i.test(l.title),rank);
    if(g&&/Original\s*\(/i.test(l.title)&&/\.htm$/.test(u.pathname))enqueue(l.url,g.makeSlug,true,g.rank);
    if(context&&/^(?:next|\d+|»|›)/i.test(l.title)&&!u.pathname.endsWith('.htm')&&u.pathname.startsWith(new URL(item.url).pathname))enqueue(l.url,context);
   }
   state.seen.push(item.url);state.queue=state.queue.filter(q=>q.url!==item.url);save();
   console.log(JSON.stringify({page:p.url,title,match:g?.id||null,reason:matched.reason,queued:state.queue.length,pending:state.pending.length}));
  }
  stop=saved>=o.maxImages||planned>=o.maxImages?'image budget':state.queue.length||state.pending.length?'page budget':'queue exhausted';
 }catch(e){stop=e.message;if(!(e instanceof Budget)){error=e.message;process.exitCode=1;}}
 finally{
  if(stateValid)save();const report={source:'carswp',dryRun:o.dryRun,stop,error,requests:client.requests,pages,saved,planned,retainedCandidates:rows.reduce((n,r)=>n+r.files.length,0),mappedGenerations:rows.length,eligibleGenerations:eligible.length,queued:state.queue.length,pending:state.pending.length,policies:client.evidence};if(stateValid)atomic(path.join(root,o.dryRun?'dry-run-report.json':'report.json'),report);
  fs.closeSync(fd);fs.unlinkSync(lock);console.log(JSON.stringify(report));
 }
}
if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url)await run();
