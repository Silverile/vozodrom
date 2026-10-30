import fs from 'node:fs';import path from 'node:path';import {fileURLToPath}from'node:url';
import {ORIGIN,PacedClient,audit,links,sha,atomic,outsideRepo,passengerCategory,excludedTitle,clean}from'./common.mjs';
export function parseArgs(args){let o={dataDir:'C:/Workspace/Projects/CF/vozodrom-data/blueprints',limit:1000,maxMinutes:18,auditOnly:false};for(let i=0;i<args.length;i++){if(args[i]==='--audit-only')o.auditOnly=true;else if(args[i]==='--data-dir')o.dataDir=args[++i];else if(args[i]==='--limit')o.limit=+args[++i];else if(args[i]==='--max-minutes')o.maxMinutes=+args[++i];else throw Error('Unknown argument '+args[i]);}if(!Number.isInteger(o.limit)||o.limit<1||o.limit>1500||!Number.isFinite(o.maxMinutes)||o.maxMinutes<=0||o.maxMinutes>20)throw Error('limit 1..1500, max-minutes >0..20');return o;}
export function itemImages(html,base){return [...new Set([...html.matchAll(/(?:href|src)\s*=\s*["']([^"']*\/media\/blueprints\/full\/[^"']+)["']/gi)].map(m=>new URL(m[1],base).href))];}
export function parseIndex(text){
 const rows=[],parts=text.split('\n');let valid='',partial=null;
 for(let i=0;i<parts.length;i++){
  if(!parts[i].trim())continue;
  try{rows.push(JSON.parse(parts[i]));valid+=parts[i]+'\n';}
  catch{if(i===parts.length-1&&!text.endsWith('\n'))partial=parts[i];else throw Error('Invalid index.jsonl line '+(i+1));}
 }
 return {rows,valid,partial};
}
function passenger(make,title){if(excludedTitle(title)||/\b(van|pickup|pick-up|commercial)\b/i.test(title))return false;if(make==='gaz'&&!/\b(12|13|14|20|21|22|24|67|69|3102|31029|3110|31105)\b|volga|chaika|zim|волг|чайк/i.test(title.replace(/[_-]/g,' ')))return false;if(make==='uaz'&&!/\b(469|3151|3160|3162|3163)\b|hunter|patriot/i.test(title.replace(/[_-]/g,' ')))return false;return true;}
export async function crawl(options){
 const client=new PacedClient(),started=Date.now();
 if(options.auditOnly){const a=await audit(client);console.log(JSON.stringify(a.report,null,2));return;}
 const root=outsideRepo(options.dataDir);
 // Verify storage before any source or image requests. No in-repo fallback.
 fs.mkdirSync(path.join(root,'raw'),{recursive:true});
 const lock=path.join(root,'.crawl.lock');let fd;try{fd=fs.openSync(lock,'wx');fs.writeFileSync(fd,JSON.stringify({pid:process.pid,startedAt:new Date().toISOString()}));}catch{throw Error('Crawler lock exists; inspect its PID before removing it manually');}
 let state={categories:[],categoryIndex:0,items:[],itemIndex:0,downloaded:0,skipped:0},stopReason=null;
 const statePath=path.join(root,'state.json'),indexPath=path.join(root,'index.jsonl');
 let stateReady=!fs.existsSync(statePath);
 const save=()=>{if(stateReady)atomic(statePath,JSON.stringify(state,null,2));};
 try{
  if(fs.existsSync(statePath))state=JSON.parse(fs.readFileSync(statePath,'utf8'));
  stateReady=true;
  const checked=await audit(client);atomic(path.join(root,'access-audit.json'),JSON.stringify(checked.report,null,2));
  if(!state.categories.length){state.categories=links(checked.home,ORIGIN+'/blueprints').filter(l=>/^\/blueprints\/[^/]+$/.test(new URL(l.url).pathname)).map(l=>({...l,make:new URL(l.url).pathname.split('/')[2]})).filter(l=>passengerCategory(l.make));state.categories=[...new Map(state.categories.map(c=>[c.url,c])).values()];save();}
  const existing=new Map(),hashes=new Set();
  if(fs.existsSync(indexPath)){
   const parsed=parseIndex(fs.readFileSync(indexPath,'utf8'));
   if(parsed.partial!==null){atomic(path.join(root,'partial-index-line-'+Date.now()+'.txt'),parsed.partial);atomic(indexPath,parsed.valid);}
   else if(!fs.readFileSync(indexPath,'utf8').endsWith('\n'))atomic(indexPath,parsed.valid);
   for(const row of parsed.rows){if(!/^[a-f0-9]{24}\.(?:png|jpg|gif|webp)$/.test(path.basename(row.file||'')))throw Error('Unsafe raw index path');let p=path.join(root,'raw',path.basename(row.file));if(fs.existsSync(p)&&sha(fs.readFileSync(p))===row.sha256){existing.set(row.url,row);hashes.add(row.sha256);}}
  }
  // Recover an image/sidecar completed immediately before a process interruption.
  for(const name of fs.readdirSync(path.join(root,'raw')).filter(n=>/^[a-f0-9]{24}\.(png|jpg|gif|webp)\.json$/.test(n))){
   const row=JSON.parse(fs.readFileSync(path.join(root,'raw',name),'utf8'));
   if(existing.has(row.url)||!row.file||!/^raw\/[a-f0-9]{24}\.(png|jpg|gif|webp)$/.test(row.file))continue;
   const file=path.join(root,row.file);
   if(fs.existsSync(file)&&sha(fs.readFileSync(file))===row.sha256&&!hashes.has(row.sha256)){
    fs.appendFileSync(indexPath,JSON.stringify(row)+'\n');existing.set(row.url,row);hashes.add(row.sha256);
   }
  }
  const deadline=started+options.maxMinutes*60000;
  while(Date.now()<deadline&&existing.size<options.limit){
   if(state.itemIndex>=state.items.length){if(state.categoryIndex>=state.categories.length){stopReason='catalogue exhausted';break;}let cat=state.categories[state.categoryIndex];let page;try{page=await client.get(cat.url);}catch(e){if(!/^HTTP 404/.test(e.message))throw e;state.categoryIndex++;save();continue;}state.items=links(page.body,page.url).filter(l=>new URL(l.url).pathname.startsWith('/blueprints/'+cat.make+'/')).map(l=>({...l,make:cat.make,makeName:cat.title}));state.items=[...new Map(state.items.map(c=>[c.url,c])).values()];state.itemIndex=0;state.categoryIndex++;save();if(!state.items.length)continue;}
   const item=state.items[state.itemIndex];
   if(!passenger(item.make,item.title)){state.skipped++;fs.appendFileSync(path.join(root,'crawl-skips.jsonl'),JSON.stringify({url:item.url,reason:'non-passenger-or-ambiguous-title'})+'\n');state.itemIndex++;save();continue;}
   let detail;try{detail=await client.get(item.url);}catch(e){if(!/^HTTP 404/.test(e.message))throw e;fs.appendFileSync(path.join(root,'crawl-skips.jsonl'),JSON.stringify({url:item.url,reason:'http-404'})+'\n');state.itemIndex++;save();continue;}const title=clean(detail.body.match(/<h[14]\b[^>]*>([\s\S]*?)<\/h[14]>/i)?.[1]||item.title);const images=itemImages(detail.body,detail.url);
   for(const url of images){if(existing.size>=options.limit||Date.now()>=deadline)break;if(existing.has(url))continue;
    let image;try{image=await client.get(url,{binary:true});}catch(e){if(!/^HTTP 404/.test(e.message))throw e;fs.appendFileSync(path.join(root,'crawl-skips.jsonl'),JSON.stringify({url,reason:'http-404'})+'\n');continue;} /* a dead link skips one file; any other refusal still stops */const b=image.body;let ext=b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))?'png':b[0]===255&&b[1]===216?'jpg':b.toString('ascii',0,3)==='GIF'?'gif':b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP'?'webp':null;
    if(!ext)throw Error('Expected image bytes; stopped without persisting response');
    if(hashes.has(image.hash)){fs.appendFileSync(path.join(root,'crawl-skips.jsonl'),JSON.stringify({url,reason:'duplicate-raw-sha256'})+'\n');continue;}
    const file=sha(url).slice(0,24)+'.'+ext;atomic(path.join(root,'raw',file),b);
    const row={url,sourcePage:detail.url,make:item.make,makeName:item.makeName,model:new URL(detail.url).pathname.split('/').at(-1),title,size:b.length,file:'raw/'+file,sha256:image.hash,downloadedAt:new Date().toISOString(),usage:'local-training-only; never publish, commit, trace or serve'};
    // Sidecar permits recovering an image written immediately before an index append.
    atomic(path.join(root,'raw',file+'.json'),JSON.stringify(row,null,2));fs.appendFileSync(indexPath,JSON.stringify(row)+'\n');existing.set(url,row);hashes.add(image.hash);state.downloaded++;save();console.log(JSON.stringify({downloaded:existing.size,make:item.make,requests:client.requests}));
   }
   if(images.length===0)fs.appendFileSync(path.join(root,'crawl-skips.jsonl'),JSON.stringify({url:item.url,reason:'no-full-blueprint-image'})+'\n');
   // If interrupted mid-page, revisit it: indexed image URLs are skipped.
   if(Date.now()>=deadline)break;state.itemIndex++;save();
  }
  stopReason??=existing.size>=options.limit?'target reached':'checkpoint deadline';
 }catch(e){stopReason=String(e.message);atomic(path.join(root,'STOP.json'),JSON.stringify({time:new Date().toISOString(),reason:stopReason,requests:client.requests},null,2));throw e;}
 finally{save();atomic(path.join(root,'crawl-status.json'),JSON.stringify({time:new Date().toISOString(),stopReason,requests:client.requests,state},null,2));fs.closeSync(fd);fs.unlinkSync(lock);}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))crawl(parseArgs(process.argv.slice(2))).catch(e=>{console.error(e.message);process.exitCode=1;});
