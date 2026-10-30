import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import sharp from 'sharp';
import {Client,Missing,Budget,Stop,links,text,automationBan,sha,allowed} from './front_source_client.mjs';
import {catalog,DEFAULT_TARGETS,modelScore,matchGeneration,norm,identityEvidence} from './front_catalog.mjs';
import {sites} from './manufacturer_sites.mjs';
import {attrs} from './crawl_front_carswp.mjs';
import {configuratorFrames} from './front_configurator.mjs';

const angleRank=s=>/head.on|front.view|frontansicht|vue.de.face|zepredu|anteriore/i.test(s)?200:/\bfront\b|\bfrontal\b/i.test(s)?100:0;
const badView=s=>/\b(?:rear|heck|interior|dashboard|engine|side.view|detail|badge|logo|steering|cockpit|360x|icon|volant|displej|displeji|multimedii|carplay|ridic za volantem)\b/i.test(s);
export function imageCandidates(html,base){
 const found=new Map();
 const add=(raw,label='',width=0,origin='img')=>{
  if(!raw)return;try{
   const url=new URL(raw.replaceAll('&amp;','&').replaceAll('\/','/'),base);
   if(/[{}]|%7b|%7d/i.test(url.href))return;
   if(url.protocol!=='https:'||url.username||url.password||url.hostname==='localhost'||/^\d+\.\d+\./.test(url.hostname)||badView(norm(label+' '+url.pathname))||/\/(?:icons|logos|fonts)\//i.test(url.pathname)||/\.svg(?:\?|$)/i.test(url.href))return;
   const item={url:url.href,title:text(label)||decodeURIComponent(url.pathname.split('/').pop()),width:Number(width)||null,rank:angleRank(label+' '+decodeURIComponent(url.pathname)),extraction:origin};
   if(!found.has(item.url)||(found.get(item.url).width||0)<(item.width||0))found.set(item.url,item);
  }catch{}
 };
 for(const m of html.matchAll(/<(?:img|source)\b[^>]*>/gi)){
  const a=attrs(m[0]),label=[a.alt,a.title,a['data-caption']].filter(Boolean).join(' ');
  if(Number(a.width)>0&&Number(a.width)<150)continue;
  add(a['data-src']||a.src,label,a.width);
  for(const srcset of [a.srcset,a['data-srcset']])if(srcset)for(const src of srcset.split(/,(?![^()]*\))/)){const [url,w]=src.trim().split(/\s+/);add(url,label,w?.replace(/w$/,''),'srcset');}
 }
 for(const m of html.matchAll(/<meta\b[^>]*>/gi)){const a=attrs(m[0]);if(/^(?:og:image|twitter:image)$/.test(a.property||a.name||''))add(a.content,'social image',0,'meta');}
 for(const m of html.matchAll(/background-image\s*:\s*url\(["']?([^\s"')]+)["']?\)/gi))add(m[1],'background',0,'css');
 const decodeEntities=s=>s.replaceAll('&quot;','"').replaceAll('&#34;','"').replaceAll('&#39;',"'").replaceAll('&amp;','&').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n)));
 let visited=0;
 const walk=(value,label='',imageContext=false)=>{
  if(!value||typeof value!=='object'||visited++>40000)return;
  const caption=[value.altText,value.alt,value.caption,value.DisplayName,value.name,value.title].filter(v=>typeof v==='string').join(' ')||label;
  if(value.isSVG!==true)for(const [key,child]of Object.entries(value)){
   if(typeof child==='string'&&/^https:\/\//.test(child)&&(/image|picture|thumbnail|poster|background/i.test(key)||imageContext&&/url|src|desktop|mobile/i.test(key)))add(child,caption,value.width||0,'embedded-json');
   else if(child&&typeof child==='object')walk(child,caption,imageContext||/image|picture|thumbnail|poster|background/i.test(key));
  }
 };
 for(const m of html.matchAll(/\bdata-[\w-]+\s*=\s*(["'])([\s\S]*?)\1/g)){
  const decoded=decodeEntities(m[2]);if(!/^[\[{]/.test(decoded.trim()))continue;try{walk(JSON.parse(decoded));}catch{}
 }
 for(const m of html.matchAll(/<script\b[^>]*type=["']application\/(?:ld\+)?json["'][^>]*>([\s\S]*?)<\/script>/gi))try{walk(JSON.parse(m[1]));}catch{}
 return [...found.values()].sort((a,b)=>b.rank-a.rank||(b.width||0)-(a.width||0));
}
export function bindOfficialModel(label,all,make,{archive=false}={}){
 const scoped=all.filter(g=>g.makeSlug===make);
 const explicit=matchGeneration(label+' '+(scoped[0]?.make||make),scoped,make);
 if(explicit.match)return {...explicit,evidence:[explicit.reason]};
 if(explicit.years||scoped.some(g=>identityEvidence(label,g)))return {...explicit,match:null,reason:'explicit-generation-evidence-not-uniquely-targeted'};
 if(archive)return{match:null,reason:'archive-needs-generation-or-model-year'};
 const allScores=scoped.map(g=>({g,score:modelScore(label,g,make)}));
 const strongest=Math.max(0,...allScores.map(x=>x.score));
 const scored=allScores.filter(x=>x.g.current&&x.score===strongest&&x.score>0);
 const max=Math.max(0,...scored.map(x=>x.score)),possible=scored.filter(x=>x.score===max).map(x=>x.g);
 if(possible.length!==1||!possible[0].eligible)return{match:null,reason:'current-official-model-not-unique-or-not-targeted'};
 return{match:possible[0],years:null,evidence:['official-current-model-page','unique-current-generation-in-merged-index'],reason:'official-current-model-page'};
}
export async function run(argv=process.argv.slice(2)){
 const o={targets:DEFAULT_TARGETS,pages:12,maxMinutes:20,maxImages:Infinity,perGeneration:20,maxResponseMb:128,dryRun:false,configuratorOnly:false};
 for(let i=0;i<argv.length;i++){
  const k=argv[i];if(k==='--site')o.site=argv[++i];else if(k==='--out')o.out=argv[++i];else if(k==='--targets')o.targets=argv[++i];else if(k==='--wave')o.wave=Number(argv[++i]);else if(k==='--only')o.only=new RegExp(argv[++i]);else if(k==='--pages')o.pages=Number(argv[++i]);else if(k==='--max-minutes')o.maxMinutes=Number(argv[++i]);else if(k==='--max-images')o.maxImages=Number(argv[++i]);else if(k==='--max-response-mb')o.maxResponseMb=Number(argv[++i]);else if(k==='--per-generation')o.perGeneration=Number(argv[++i]);else if(k==='--configurator-only')o.configuratorOnly=true;else if(k==='--dry-run')o.dryRun=true;else if(k==='--list')o.list=true;else throw Error('Unknown argument '+k);
 }
 const site=sites[o.site];if(!site)throw Error('Choose --site '+Object.keys(sites).join(', '));
 const all=catalog({targets:o.targets,wave:o.wave}),targets=all.filter(g=>g.makeSlug===site.make&&g.eligible&&(!o.only||o.only.test(g.id)));
 if(o.list){console.log(JSON.stringify({site:o.site,targets:targets.length,current:targets.filter(g=>g.current).map(g=>({id:g.id,rank:g.rank})),scope:'current model pages; archive pages require explicit generation evidence'}));return;}
 if(!o.out||!(o.pages>0)||!(o.maxMinutes>0)||!(o.maxImages>0)||!(o.perGeneration>0&&o.perGeneration<=20)||!Number.isInteger(o.maxResponseMb)||o.maxResponseMb<1||o.maxResponseMb>256)throw Error('Require --out, positive budgets and --max-response-mb 1..256');
 const root=path.resolve(o.out);fs.mkdirSync(root,{recursive:true});const testRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'test-out');
 if(root===testRoot||root.startsWith(testRoot+path.sep)){fs.writeFileSync(path.join(testRoot,'.gitignore'),'*\n!.gitignore\n');o.maxImages=Math.min(30,o.maxImages);}
 const prefix=o.dryRun?'dry-run-':'',index=path.join(root,prefix+'candidates.json'),statePath=path.join(root,prefix+'state.json'),lock=path.join(root,'.crawl.lock');
 const fd=fs.openSync(lock,'wx');fs.writeFileSync(fd,String(process.pid));
 const signature=JSON.stringify({site:o.site,targets:sha(fs.readFileSync(o.targets)),wave:o.wave||null,only:o.only?.source||null,perGeneration:o.perGeneration,...(o.configuratorOnly?{configuratorOnly:true}:{})});
 let state={signature,queue:[{url:site.home,kind:'home',rank:0}],seen:[],pending:[],terms:[],rejected:[]},rows=[],valid=false;
 const host=new URL(site.home).hostname,client=new Client({hosts:[host],maxMinutes:o.maxMinutes,maxResponseBytes:o.maxResponseMb*1e6});
 let pages=0,saved=0,planned=0,stop='complete';
 const atomic=(file,value)=>{fs.writeFileSync(file+'.tmp',JSON.stringify(value,null,2)+'\n');fs.renameSync(file+'.tmp',file);};
 const save=()=>{atomic(index,rows);atomic(statePath,state);};
 const enqueue=item=>{const u=new URL(item.url);u.hash='';item.url=u.href;if(u.hostname!==host||u.protocol!=='https:'||state.seen.includes(item.url)||state.queue.some(q=>q.url===item.url))return;state.queue.push(item);state.queue.sort((a,b)=>(a.rank??Infinity)-(b.rank??Infinity));};
 const targetIds=new Set(targets.map(g=>g.id));
 try{
  if(fs.existsSync(statePath))state=JSON.parse(fs.readFileSync(statePath));if(state.signature!==signature)throw new Stop('Output belongs to a different target/site selection');
  if(fs.existsSync(index))rows=JSON.parse(fs.readFileSync(index));if(!Array.isArray(rows)||rows.some(r=>!r||!targetIds.has(r.id)||!Array.isArray(r.files))){rows=[];throw new Stop('Invalid/out-of-target index');}
  for(const row of rows){const keep=[];for(const f of row.files){if(o.dryRun){keep.push(f);continue;}if(!/^cand\/[a-z0-9-]+\/[a-f0-9]{16}\.jpg$/.test(f.local||''))throw new Stop('Unsafe local path');const p=path.join(root,f.local);if(fs.existsSync(p)&&sha(fs.readFileSync(p))===f.sha256)keep.push(f);else state.pending.push({...f,generationId:row.id});}row.files=keep;}
  valid=true;
  // Only access restrictions can disable a source; recorded use restrictions do not.
  for(const url of site.terms){const policy=await client.policy(new URL(url).origin);if(!allowed(url,policy.rules)){state.terms.push({url,status:'robots-disallowed; not requested'});continue;}const p=await client.get(url),ban=automationBan(p.body);state.terms.push({url:p.url,sha256:p.sha256,automatedAccessBan:ban});if(ban)throw new Stop('Automated access terms: '+ban);}
  const existing=rows.reduce((n,r)=>n+r.files.length,0);
  while((state.queue.length||state.pending.length)&&saved+existing<o.maxImages&&planned<o.maxImages){
   if(state.pending.length){
    const f=state.pending[0],g=targets.find(g=>g.id===f.generationId);let row=rows.find(r=>r.id===g.id);if(!row){row={...g,source:'manufacturer-'+o.site,files:[],reviewRequired:true};rows.push(row);}
    if(/[{}]|%7b|%7d/i.test(f.url)){state.rejected.push({url:f.url,reason:'unexpanded-published-template; not requested'});state.pending.shift();save();continue;}
    if(row.files.length>=o.perGeneration||row.files.some(x=>x.url===f.url)){state.pending.shift();save();continue;}
    if(o.dryRun){row.files.push({...f,local:null,status:'planned'});planned++;}
    else{
     client.hosts.add(new URL(f.url).hostname);let p;try{p=await client.get(f.url);}catch(e){if(e instanceof Missing){state.pending.shift();save();continue;}throw e;}
     if(!/^image\/(?:jpeg|png|webp|avif)\b/i.test(p.headers['content-type']||'')){state.pending.shift();save();continue;}
     const m=await sharp(p.data).metadata();if(m.width>=1000){const local=`cand/${g.id}/${sha(f.url).slice(0,16)}.jpg`,target=path.join(root,local);fs.mkdirSync(path.dirname(target),{recursive:true});const tmp=target+'.tmp.jpg',info=await sharp(p.data).rotate().resize({width:1600,withoutEnlargement:true}).jpeg({quality:92}).toFile(tmp);fs.renameSync(tmp,target);row.files.push({...f,local,width:m.width,height:m.height,localWidth:info.width,localHeight:info.height,sha256:sha(fs.readFileSync(target))});saved++;}
    }
    state.pending.shift();save();continue;
   }
   if(pages>=o.pages){stop='page budget';break;}
   const item=state.queue[0];let p;try{p=await client.get(item.url);}catch(e){if(e instanceof Missing){state.seen.push(item.url);state.queue.shift();save();continue;}throw e;}
   pages++;const title=text(p.body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||''),ls=links(p.body,p.url);
   // Model-page binding never applies to a generic home or an archive/tag page.
   if(item.kind==='model'){
    const reviewedCurrent=site.currentModelPaths?.includes(new URL(p.url).pathname);
    const bound=bindOfficialModel(item.label+' '+title,all,site.make,{...site,archive:site.archive&&!reviewedCurrent}),g=bound.match;
    if(g&&targetIds.has(g.id)){
     let images=[...await configuratorFrames(p.body,p.url,g,client),...(o.configuratorOnly?[]:imageCandidates(p.body,p.url))];
     // Keep images whose caption/filename identifies this model, plus shared
     // hero/social images. Do not import named pictures of another model.
     const modelWords=norm(g.line).split(' ').filter(w=>w.length>1),tagged=images.filter(i=>modelWords.some(w=>norm(i.title+' '+new URL(i.url).pathname).split(' ').includes(w)));
     if(tagged.length)images=tagged;
     images=images.filter(image=>{
      const caption=image.title+' '+decodeURIComponent(new URL(image.url).pathname).replaceAll('-',' ').replaceAll('_',' '),own=modelScore(caption,g,site.make);
      if(site.make==='toyota'&&['corolla','yaris'].includes(norm(g.line))&&norm(caption).includes(norm(g.line)+' cross'))return false;
      return !all.some(other=>other.makeSlug===site.make&&other.lineSlug!==g.lineSlug&&modelScore(caption,other,site.make)>own&&modelScore(caption,other,site.make)>0);
     });
     const stems=new Set();
     for(const image of images){const stem=new URL(image.url).hostname+new URL(image.url).pathname.replace(/[-_]\d{2,4}x\d{2,4}(?=\.)/,'');if(stems.has(stem))continue;stems.add(stem);
      if(image.width&&image.width<1000)continue;
      state.pending.push({...image,generationId:g.id,source:'manufacturer-'+o.site,sourcePage:p.url,page:p.url,modelLabel:item.label,year:bound.years?.from||null,productionYears:bound.years||null,licence:'unknown/all-rights-reserved',author:null,frontTitled:image.frontTitled??image.rank>=100,evidence:bound.evidence,viewStatus:'unverified'});
      if(stems.size>=o.perGeneration*2)break;
     }
    }else state.rejected.push({url:p.url,label:item.label,title,reason:bound.reason});
   }
   for(const l of ls){
    const u=new URL(l.url);if(u.hostname!==host||u.hash||u.search||!site.modelPath.test(u.pathname)||/config|konfigur|inventory|nabidka|finance|offer|contact|privacy|podminky/i.test(u.pathname))continue;
    const label=l.title+' '+decodeURIComponent(u.pathname).replaceAll('/',' ').replaceAll('-',' ');
    const matches=targets.filter(g=>modelScore(label,g,site.make)>0);if(matches.length)enqueue({url:l.url,kind:'model',label,rank:Math.min(...matches.map(g=>g.rank))});
   }
   if(item.kind==='home'){
    // Discover linked terms only; never guess or fetch forbidden policy paths.
    for(const t of ls.filter(l=>new URL(l.url).hostname===host&&/terms|copyright|pravni|podminky|legal/i.test(l.url+' '+l.title)).slice(0,2)){
     const policy=await client.policy(new URL(t.url).origin);if(!allowed(t.url,policy.rules)){state.terms.push({url:t.url,status:'robots-disallowed; not requested'});continue;}
     try{const tp=await client.get(t.url),ban=automationBan(tp.body);state.terms.push({url:tp.url,sha256:tp.sha256,automatedAccessBan:ban});if(ban)throw new Stop('Automated access terms: '+ban);}catch(e){if(/^Robots disallow/.test(e.message)){state.terms.push({url:t.url,status:'redirect-to-robots-disallowed; not requested'});}else throw e;}
    }
   }
   state.seen.push(item.url);state.queue=state.queue.filter(q=>q.url!==item.url);save();console.log(JSON.stringify({site:o.site,page:p.url,kind:item.kind,queued:state.queue.length,pending:state.pending.length}));
  }
  if(saved+existing>=o.maxImages||planned>=o.maxImages)stop='image budget';
 }catch(e){stop=e.message;if(!(e instanceof Budget))process.exitCode=1;}
 finally{if(valid)save();const report={site:o.site,dryRun:o.dryRun,targets:o.targets,wave:o.wave||null,eligible:targets.length,stop,pages,saved,planned,retained:rows.reduce((n,r)=>n+r.files.length,0),mappedGenerations:rows.length,requests:client.requests,queue:state.queue.length,pending:state.pending.length,terms:state.terms,policies:client.evidence};if(valid)atomic(path.join(root,prefix+'report.json'),report);fs.closeSync(fd);fs.unlinkSync(lock);console.log(JSON.stringify({...report,policies:report.policies.map(p=>({origin:p.origin,status:p.status,delay:p.delay,aiDenied:p.aiDenied}))}));}
}
if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url)await run();
