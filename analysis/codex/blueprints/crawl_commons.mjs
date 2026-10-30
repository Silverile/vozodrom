import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {Client,Stop,Missing,Budget,args,outputRoot,passenger,text,robotAllows} from './crawl_shared.mjs';
import {atomic,sha} from './common.mjs';

export const source={id:'commons',defaultLimit:2500,maxLimit:100000,origin:'https://commons.wikimedia.org',allowedHost:h=>['commons.wikimedia.org','upload.wikimedia.org','thumb.wikimedia.org'].includes(h)};
export const seeds=['Line drawings of automobiles','Blueprints of vehicles','Technical drawings of automobiles','Side views of automobiles in line art','SVG automobiles in side view','SVG profile drawings of automobiles','Drawings of automobiles'];
// Categories are not licence declarations. Every file must independently pass this check.
export function licence(meta={}){
  const v=k=>text(String(meta[k]?.value||''));
  const name=v('LicenseShortName'),terms=v('UsageTerms'),author=v('Artist'),url=v('LicenseUrl');
  const label=name||terms;
  if(/\b(?:NC|ND)\b|non.?commercial|no.?derivatives/i.test(label))return null;
  if(/^(?:public domain|PD(?:[ -].*)?)$/i.test(label)||/^CC0(?:\s|$)/i.test(label))return {licence:label,licenceUrl:url||null,author:author||'Unknown',credit:v('Credit'),licenceEvidence:{LicenseShortName:name,UsageTerms:terms,Copyrighted:v('Copyrighted')}};
  const cc=label.match(/^CC (BY(?:-SA)?)(?:\s|-)([1-4](?:\.\d)?)(?:\s|$)/i),legal=url.match(/^https?:\/\/creativecommons\.org\/licenses\/(by(?:-sa)?)\/([1-4](?:\.\d)?)(?:\/|$)/i);
  if(cc&&legal&&author&&cc[1].toLowerCase()===legal[1].toLowerCase()&&cc[2]===legal[2])return {licence:label,licenceUrl:url,author,credit:v('Credit'),licenceEvidence:{LicenseShortName:name,UsageTerms:terms,Copyrighted:v('Copyrighted')}};
  return null;
}
const excluded=/\b(?:railways?|trains?|locomotives?|trams?|buses|bus|trucks?|lorries|motorcycles?|bicycles?|aircraft|ships?|boats?|tanks?|racing|racecars?|formula|coloni|benetton|suspension|interior|engines?|gearbox|transmission|chassis|patent apparatus|logos?|car body pillars|automobile body pillars|body pillars|cartoons?|pictograms?|icons?)\b/i;
export function categoryOK(title){return !excluded.test(title)&&passenger(title);}
export function advanceCategory(state,cat,j){
  for(const m of j.query?.categorymembers||[]){
    if(m.ns===14&&cat.depth<3&&categoryOK(m.title)&&!state.categories.some(c=>c.title===m.title)&&!state.seenCategories.includes(m.title))state.categories.push({title:m.title,depth:cat.depth+1});
    else if(m.ns===6&&categoryOK(m.title)&&!state.files.some(f=>f.pageid===m.pageid))state.files.push({...m,category:cat.title});
  }
  if(j.continue)cat.continue=j.continue;else{state.seenCategories.push(cat.title);state.categories.shift();}
}
export function candidate(page,category){
  const ii=page.imageinfo?.[0],meta=ii?.extmetadata||{},rights=licence(meta);
  if(!ii||!rights)return {reason:'missing-or-unapproved-licence'};
  const title=page.title?.replace(/^File:/,'')||'',description=text(meta.ImageDescription?.value||''),cats=text(meta.Categories?.value||'');
  if(!passenger(title)||excluded.test(title+' '+cats))return {reason:'non-passenger-or-component'};
  // Do not mistake photographs of drawings/information boards for clean source sheets.
  if(/\b(?:photograph|photography|photographed|photographs|photo of|3d render|screenshot)\b/i.test(title+' '+description))return {reason:'photograph-or-render'};
  if(!/drawing|blueprint|line art|lineart|technical|side view|sideview|elevation|diagram/i.test(title+' '+category+' '+cats))return {reason:'drawing-not-established'};
  const svg=/\.svg$/i.test(title);let url=svg?ii.thumburl:ii.url;
  if(!url||!/^https:\/\/(?:upload|thumb)\.wikimedia\.org\//.test(url))return {reason:'missing-permitted-image-url'};
  // Current API returns thumb.wikimedia.org; its robots redirects to the Commons
  // homepage rather than a policy. The official upload host serves the identical
  // PNG path and has an explicit robots policy. Use that permitted media route.
  const media=new URL(url);if(media.hostname==='thumb.wikimedia.org')media.hostname='upload.wikimedia.org';
  for(const key of [...media.searchParams.keys()])if(key.startsWith('utm_'))media.searchParams.delete(key);url=media.href;
  if(svg&&!/\.png(?:\?|$)/i.test(url))return {reason:'svg-without-png-render'};
  if(!svg&&!/\.(?:png|jpe?g|gif|webp)$/i.test(new URL(url).pathname))return {reason:'unsupported-raster'};
  const make=title.match(/\b(Alfa Romeo|Aston Martin|Mercedes[- ]Benz|Land Rover|Rolls[- ]Royce|Volkswagen|Chevrolet|Citro[eë]n|Ferrari|Fiat|Ford|GAZ|Honda|Hyundai|Jaguar|Jeep|Kia|Lada|Lancia|Lincoln|Mazda|Mercury|Nissan|Opel|Peugeot|Porsche|Renault|Saab|Seat|Shelby|Škoda|Skoda|Subaru|Suzuki|Toyota|Volvo|BMW|Audi|Buick|Cadillac|Duesenberg|Tatra|ZAZ|ZIL)\b/i)?.[1]||'unknown';
  return {item:{url,sourceOriginalUrl:ii.url,apiRenderUrl:svg?ii.thumburl:null,sourcePage:ii.descriptionurl||'https://commons.wikimedia.org/wiki/'+encodeURIComponent(page.title),make:make.toLowerCase(),model:title,title,category,reportedWidth:svg?ii.thumbwidth:ii.width,reportedHeight:svg?ii.thumbheight:ii.height,originalSize:ii.size,...rights,usage:'local-training-only; never publish, commit, trace or serve; retain per-file attribution',sideViewVerified:false}};
}
export class CommonsClient extends Client{
  async query(params){
    if(this.pages>=this.maxPages)throw new Budget('Dry-run API query budget');
    this.pages++;
    const url=new URL('/w/api.php',source.origin);url.search=new URLSearchParams({...params,action:'query',format:'json',formatversion:'2',maxlag:'5'});
    // This is the expressly requested, documented machine API, not the /w/ HTML
    // crawler route. Audit robots/AI reservations first; never use this exception
    // for HTML, upload URLs, redirects, another action, or another origin.
    await this.policy(source.origin);
    const r=await this.raw(url.href,{maxBytes:8*1024*1024});
    if(r.redirect)throw new Stop('API redirect requires review');
    let j;try{j=JSON.parse(r.body);}catch{throw new Stop('Invalid API JSON');}
    if(j.error)throw new Stop('MediaWiki '+j.error.code+': '+j.error.info);
    return j;
  }
}
function ext(b){if(b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return'png';if(b[0]===255&&b[1]===216)return'jpg';if(/^GIF8[79]a/.test(b.toString('ascii',0,6)))return'gif';if(b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP')return'webp';return null;}
export async function run(options){
  const root=outputRoot(options.dataDir),client=new CommonsClient(source,options);
  let state={version:1,source:'commons',categories:seeds.map(n=>({title:'Category:'+n,depth:0})),seenCategories:[],files:[],pending:[]},valid=false,lock,fd,planned=0,stop='checkpoint';
  const indexed=new Map(),hashes=new Set();
  const log=row=>{console.log(JSON.stringify(row));if(!options.dryRun)fs.appendFileSync(path.join(root,'crawl-log.jsonl'),JSON.stringify(row)+'\n');};
  const save=()=>{if(!options.dryRun&&valid)atomic(path.join(root,'state.json'),JSON.stringify(state,null,2));};
  if(!options.dryRun){fs.mkdirSync(path.join(root,'raw'),{recursive:true});lock=path.join(root,'.crawl.lock');fd=fs.openSync(lock,'wx');fs.writeFileSync(fd,String(process.pid));}
  try{
    if(!options.dryRun&&fs.existsSync(path.join(root,'state.json')))state=JSON.parse(fs.readFileSync(path.join(root,'state.json'),'utf8'));
    if(state.version!==1||state.source!=='commons'||!['categories','seenCategories','files','pending'].every(k=>Array.isArray(state[k])))throw new Stop('Invalid Commons state');valid=true;
    await client.policy(source.origin);
    for(const page of ['Commons:API','Commons:Reusing_content_outside_Wikimedia'])await client.get(source.origin+'/wiki/'+page);
    if(!options.dryRun){
      const index=path.join(root,'index.jsonl');
      // Sidecars recover a crash between writing an original and appending its index.
      const rows=[];
      if(fs.existsSync(index)){const s=fs.readFileSync(index,'utf8'),lines=s.split('\n');let good='';for(let i=0;i<lines.length;i++){if(!lines[i].trim())continue;try{rows.push(JSON.parse(lines[i]));good+=lines[i]+'\n';}catch{if(i!==lines.length-1||s.endsWith('\n'))throw new Stop('Corrupt index line');atomic(path.join(root,'index-partial-'+Date.now()+'.txt'),lines[i]);}}if(good!==s)atomic(index,good);}
      for(const name of fs.readdirSync(path.join(root,'raw')).filter(n=>/^[a-f0-9]{24}\.(png|jpg|gif|webp)\.json$/.test(n)))rows.push(JSON.parse(fs.readFileSync(path.join(root,'raw',name),'utf8')));
      for(const row of rows){if(!/^raw\/[a-f0-9]{24}\.(png|jpg|gif|webp)$/.test(row.file||''))throw new Stop('Unsafe index file');if(indexed.has(row.url)||hashes.has(row.sha256))continue;const f=path.join(root,row.file);if(!fs.existsSync(f)||sha(fs.readFileSync(f))!==row.sha256)continue;indexed.set(row.url,row);hashes.add(row.sha256);}
      atomic(index,[...indexed.values()].map(r=>JSON.stringify(r)+'\n').join(''));
    }
    while(state.categories.length||state.files.length||state.pending.length){
      if(Date.now()>=client.deadline)throw new Budget('Checkpoint deadline');
      if((options.dryRun?planned:indexed.size)>=options.limit){stop='target reached';break;}
      if(state.pending.length){
        const item=state.pending[0];
        if(indexed.has(item.url)){state.pending.shift();save();continue;}
        if(options.dryRun){const origin=new URL(item.url).origin;await client.policy(origin);if(!robotAllows(item.url,client.policies.get(origin).rules))throw new Stop('Robots disallow planned image');log({type:'would-save',...item});planned++;state.pending.shift();continue;}
        try{const r=await client.get(item.url);const extension=ext(r.data);if(!extension)throw new Stop('Unsupported image bytes');if(!hashes.has(r.sha256)){const file='raw/'+sha(item.url).slice(0,24)+'.'+extension,row={...item,width:extension==='png'?r.data.readUInt32BE(16):item.reportedWidth,height:extension==='png'?r.data.readUInt32BE(20):item.reportedHeight,size:r.size,file,sha256:r.sha256};atomic(path.join(root,file),r.data);atomic(path.join(root,file+'.json'),JSON.stringify(row,null,2));fs.appendFileSync(path.join(root,'index.jsonl'),JSON.stringify(row)+'\n');indexed.set(row.url,row);hashes.add(row.sha256);log({type:'saved',title:item.title,count:indexed.size});}}catch(e){if(e instanceof Missing)log({type:'skip',reason:'http-404',url:item.url});else throw e;}
        state.pending.shift();save();continue;
      }
      if(state.files.length){
        const batch=state.files.slice(0,50),j=await client.query({prop:'imageinfo',pageids:batch.map(f=>f.pageid).join('|'),iiprop:'url|size|extmetadata',iiurlwidth:'2000'});
        for(const page of j.query?.pages||[]){const from=batch.find(f=>f.pageid===page.pageid);const result=candidate(page,from?.category||'');if(result.item)state.pending.push(result.item);else log({type:'skip',title:page.title,reason:result.reason});}
        state.files.splice(0,batch.length);save();continue;
      }
      const cat=state.categories[0];
      if(state.seenCategories.includes(cat.title)){state.categories.shift();save();continue;}
      const j=await client.query({list:'categorymembers',cmtitle:cat.title,cmtype:'file|subcat',cmlimit:'50',...(cat.continue||{})});
      advanceCategory(state,cat,j);
      log({type:'category',title:cat.title,depth:cat.depth,members:(j.query?.categorymembers||[]).length,queuedCategories:state.categories.length,files:state.files.length});save();
    }
    if(stop==='checkpoint')stop='queue exhausted';
  }catch(e){stop=e.message;if(!(e instanceof Budget))throw e;}
  finally{save();if(fd!==undefined){fs.closeSync(fd);fs.unlinkSync(lock);}console.log(JSON.stringify({source:'commons',dryRun:options.dryRun,stop,requests:client.requests,queries:client.pages,indexed:indexed.size,planned,categoriesRemaining:state.categories.length,filesRemaining:state.files.length}));}
}
if(pathToFileURL(path.resolve(process.argv[1]||'')).href===import.meta.url)run(args(process.argv.slice(2),source)).catch(e=>{console.error('STOP:',e.message);process.exitCode=1;});
