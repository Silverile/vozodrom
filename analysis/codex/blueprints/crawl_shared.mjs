import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {UA,sha,atomic,reservations,robotRules} from './common.mjs';

export const REPO=path.resolve('C:/Workspace/Projects/CF/vozodrom');
export class Stop extends Error{}
export class Missing extends Error{}
export class Budget extends Error{}
export function decodeHtml(bytes,headers={}){
  const raw=Buffer.from(bytes),utf=new TextDecoder('utf-8').decode(raw);
  // uCoz can advertise UTF-8 while the legacy HTML declares a different charset.
  const declared=raw.toString('latin1').match(/<meta[^>]+charset\s*=\s*["']?([\w-]+)/i)?.[1];
  const charset=declared||headers['content-type']?.match(/charset=([\w-]+)/i)?.[1]||'utf-8';
  let text;try{text=new TextDecoder(charset).decode(raw);}catch{text=utf;}
  try{const valid=new TextDecoder('utf-8',{fatal:true}).decode(raw);if(/[А-Яа-яЁё]/.test(valid))text=valid;}catch{}
  // Some migrated pages contain UTF-8 bytes interpreted as CP1251 then re-encoded.
  if((text.match(/Р[А-Яа-яЁё]/g)||[]).length>15){
    const table=new Map();const decoder=new TextDecoder('windows-1251');for(let n=0;n<256;n++)table.set(decoder.decode(Uint8Array.of(n)),n);
    if([...text].every(c=>table.has(c))){const repaired=new TextDecoder('utf-8').decode(Uint8Array.from([...text].map(c=>table.get(c))));if(!repaired.includes('\ufffd'))text=repaired;}
  }
  return text;
}
export function text(s){return s.replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n)).replace(/\s+/g,' ').trim();}
export function anchors(html,base){
  const out=[];for(const m of html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)){
    try{const u=new URL(m[1].replace(/&amp;/g,'&'),base);if(['http:','https:'].includes(u.protocol)&&!u.username&&!u.password){u.hash='';out.push({url:u.href,title:text(m[2])});}}catch{}
  }return out;
}
export function aiReservation(body,headers={}){
  if(/(?:ai-train|train-ai|ai_training)\s*[=:]\s*(?:no|false|0)\b/i.test(body+'\n'+Object.entries(headers).map(([k,v])=>k+': '+v).join('\n')))return 'Content-signal ai-train denial';
  const known=/(?:GPTBot|ClaudeBot|Claude-User|anthropic-ai|Google-Extended|CCBot|OAI-SearchBot|ChatGPT-User|Bytespider|meta-externalagent)/i;
  let group=[],hasRule=false;
  for(let line of body.split(/\r?\n/)){const m=line.replace(/#.*/,'').trim().match(/^([^:]+):\s*(.*)$/);if(!m)continue;
    if(m[1].toLowerCase()==='user-agent'){if(hasRule){group=[];hasRule=false;}group.push(m[2]);}
    else if(/^(allow|disallow)$/i.test(m[1])){hasRule=true;if(m[1].toLowerCase()==='disallow'&&m[2].trim()&&group.some(g=>known.test(g)))return 'Named AI crawler restriction';}
  }
  const found=reservations(body,headers);return found.length?found.join(', '):null;
}
export function robotAllows(url,rules){
  const u=new URL(url),p=u.pathname+u.search;const matched=[];
  for(const r of rules){if(!r.pattern)continue;let expression=r.pattern.split('*').map(s=>s.replace(/[.+?^${}()|[\]\\]/g,'\\$&')).join('.*');expression=expression.replace(/\\\$$/,'$');if(new RegExp('^'+expression).test(p))matched.push(r);}
  matched.sort((a,b)=>b.pattern.length-a.pattern.length||Number(b.allow)-Number(a.allow));return !matched.length||matched[0].allow;
}
export function outputRoot(input){
  let p=path.resolve(input),ancestor=p,tail=[];while(!fs.existsSync(ancestor)){tail.unshift(path.basename(ancestor));const next=path.dirname(ancestor);if(next===ancestor)throw new Stop('No existing output ancestor');ancestor=next;}
  p=path.join(fs.realpathSync(ancestor),...tail);const repo=fs.realpathSync(REPO);const rel=path.relative(repo,p);
  if(!rel||(!rel.startsWith('..'+path.sep)&&rel!=='..'&&!path.isAbsolute(rel)))throw new Stop('Output is inside the absolute repository root');return p;
}
export function args(argv,source){
  const o={limit:source.defaultLimit,maxMinutes:18,dryRun:false,pages:5,dataDir:`C:/Workspace/Projects/CF/vozodrom-data/blueprints-${source.id}`};
  for(let i=0;i<argv.length;i++){const a=argv[i];if(a==='--dry-run')o.dryRun=true;else if(a==='--limit')o.limit=Number(argv[++i]);else if(a==='--max-minutes')o.maxMinutes=Number(argv[++i]);else if(a==='--data-dir')o.dataDir=argv[++i];else if(a==='--pages')o.pages=Number(argv[++i]);else throw new Stop('Unknown argument '+a);}
  if(!Number.isInteger(o.limit)||o.limit<1||o.limit>(source.maxLimit||100000)||!Number.isFinite(o.maxMinutes)||o.maxMinutes<=0||o.maxMinutes>20||!Number.isInteger(o.pages)||o.pages<3||o.pages>10)throw new Stop('Invalid limit/minutes/pages');return o;
}
export function passenger(title,make=''){
  const t=(make+' '+title).replace(/[_-]/g,' ');
  if(/\b(truck|lorry|bus|buses|coach|tractor|motorcycle|motorbike|aircraft|airplane|helicopter|ship|boat|tank|pickup|pick\s*up|van|ambulance|fire|commercial|gazelle|gazon|kamaz|canter|sprinter|actros|atego|unimog|transit|ducato|boxer|jumper|crafter|fuso|econoline|delica|hiace|townace|caravan|trafic|master|movano|vivaro|lt\s*\d+|porter|elf)\b|грузов|автобус|самол[её]т|вертол|корабл|танк|трактор|мотоцикл|газель|пикап|фургон|скор[аяой]+\s+помощ/i.test(t))return false;
  if(/^(?:gaz|газ)$/i.test(make)&&!/(?:\b(?:12|13|14|20|21|22|24|61|64|67|69|72|3102|31029|3110|31105)\b|volga|volg|chaika|zim|волг|чайк|зим|m20|m72)/i.test(t))return false;
  if(/^(?:uaz|уаз)$/i.test(make)&&!/(?:\b(?:469|3151|3160|3162|3163)\b|hunter|patriot)/i.test(t))return false;
  if(/^(?:zil|zis|зил|зис)$/i.test(make)&&!/(?:\b(?:101|110|111|114|115|117|4104\d*)\b)/i.test(t))return false;
  if(/\b(?:f\s*[1-9]\d\d|silverado|sierra|ranger|hilux|navara|l200|dmax|d\s*max|transporter|caravelle|barkas|visvaz)\b|formula\s*(?:one|1)|\bf1\b/i.test(t))return false;
  if(/(?:luaz|луаз)\s*967|тпк|военн|military|\bparts\b|узл[ыа]|агрегат/i.test(t))return false;
  if(/mercedes|мерседес/i.test(make)&&/(?:^|\s)(?:l|lk|lp|o)\s*\d{3,4}\b/i.test(t))return false;
  if(/volvo|вольво/i.test(make)&&/(?:^|\s)(?:fh|fm|fl|f|n|b)\s*\d{1,4}\b/i.test(t))return false;
  return true;
}
export class Client{
  constructor(source,options={}){this.source=source;this.pages=0;this.requests=0;this.last=new Map();this.lastAny=0;this.policies=new Map();this.maxPages=options.dryRun?options.pages:Infinity;this.deadline=Date.now()+(options.maxMinutes||18)*60000;}
  async raw(url,{method='GET',maxBytes=30*1024*1024}={}){
    if(Date.now()>=this.deadline)throw new Budget('Checkpoint deadline');
    const u=new URL(url);if(!['http:','https:'].includes(u.protocol)||u.username||u.password||!this.source.allowedHost(u.hostname))throw new Stop('Unexpected URL host/scheme');
    const key=u.hostname.toLowerCase();const policy=this.policies.get(u.origin);const gap=Math.max(1100,policy?.delay||0);
    await new Promise(r=>setTimeout(r,Math.max(0,gap-(Date.now()-(this.last.get(key)||0)),1100-(Date.now()-this.lastAny))));this.lastAny=Date.now();this.last.set(key,this.lastAny);this.requests++;
    const r=await fetch(url,{method,redirect:'manual',headers:{'User-Agent':UA},signal:AbortSignal.timeout(25000)});
    const headers=Object.fromEntries(r.headers);
    if(r.status===404){await r.body?.cancel();throw new Missing('HTTP 404');}
    if([301,302,303,307,308].includes(r.status)){const location=r.headers.get('location');await r.body?.cancel();return {redirect:new URL(location,url).href,headers,status:r.status};}
    if(r.status!==200){await r.body?.cancel();throw new Stop('HTTP '+r.status+' '+u.origin+u.pathname);}
    if(Number(headers['content-length'])>maxBytes){await r.body?.cancel();throw new Stop('Response too large');}
    let chunks=[],size=0;for await(const chunk of r.body||[]){size+=chunk.length;if(size>maxBytes)throw new Stop('Response too large');chunks.push(chunk);}
    const data=Buffer.concat(chunks),isText=/text|json|xml|javascript/i.test(headers['content-type']||'');const body=isText?decodeHtml(data,headers):'';
    if(/(?:<title[^>]*>[^<]*(?:captcha|are you (?:a|not a) robot|just a moment|access denied)|cf-chl-|g-recaptcha-response|id=["']captcha|\/showcaptcha)/i.test(body))throw new Stop('CAPTCHA/challenge page');
    const denied=aiReservation(body,headers);if(denied)throw new Stop('RESERVATION: '+denied);
    return {url,data,body,headers,size,sha256:sha(data),status:r.status};
  }
  async policy(origin){
    if(this.policies.has(origin))return;
    const r=await this.raw(origin+'/robots.txt',{maxBytes:512*1024});if(r.redirect)throw new Stop('Robots redirect requires inspection');
    if(!/text\/plain/i.test(r.headers['content-type']||'')||!r.body.match(/user-agent\s*:/i))throw new Stop('Robots response is not a valid policy');
    const delay=Math.max(0,...[...r.body.matchAll(/^crawl-delay\s*:\s*([\d.]+)/gim)].map(m=>Number(m[1])*1000));
    const normalized=r.body.replace(/\s+(?=(?:Disallow|Allow|User-agent|Content-signal|Crawl-delay):)/gi,'\n');
    this.policies.set(origin,{rules:robotRules(normalized),delay});
  }
  async get(url,{page=false,...options}={}){
    if(page&&this.pages>=this.maxPages)throw new Budget('Dry-run page budget');if(page)this.pages++;
    for(let n=0;n<6;n++){
      const u=new URL(url);await this.policy(u.origin);const p=this.policies.get(u.origin);if(!robotAllows(url,p.rules))throw new Stop('Robots disallow '+u.pathname+u.search);
      const r=await this.raw(url,options);if(!r.redirect)return r;
      const denied=aiReservation('',r.headers);if(denied)throw new Stop('RESERVATION: '+denied);url=r.redirect;
    }throw new Stop('Too many redirects');
  }
}
function imageExt(b){if(b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return'png';if(b[0]===255&&b[1]===216)return'jpg';if(/^GIF8[79]a/.test(b.toString('ascii',0,6)))return'gif';if(b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP')return'webp';if(b.toString('ascii',0,2)==='BM')return'bmp';return null;}
export async function run(source,options){
  const root=outputRoot(options.dataDir),client=new Client(source,options);let fd,lock,state={version:1,source:source.id,queue:[source.start],seen:[],pending:[],downloaded:0},stop='checkpoint';
  const log=(event)=>{console.log(JSON.stringify(event));if(!options.dryRun)fs.appendFileSync(path.join(root,'crawl-log.jsonl'),JSON.stringify(event)+'\n');};
  const save=()=>{if(!options.dryRun)atomic(path.join(root,'state.json'),JSON.stringify(state,null,2));};
  if(!options.dryRun){fs.mkdirSync(path.join(root,'raw'),{recursive:true});lock=path.join(root,'.crawl.lock');fd=fs.openSync(lock,'wx');fs.writeFileSync(fd,String(process.pid));}
  const existing=new Map(),hashes=new Set();let planned=0,stateValid=options.dryRun||!fs.existsSync(path.join(root,'state.json'));
  try{
    if(!options.dryRun&&fs.existsSync(path.join(root,'state.json')))state=JSON.parse(fs.readFileSync(path.join(root,'state.json'),'utf8'));
    if(state.source!==source.id||!Array.isArray(state.queue)||!Array.isArray(state.pending)||!Array.isArray(state.seen))throw new Stop('State belongs to a different source or schema');
    stateValid=true;
    await client.policy(source.origin);
    // Inspect the actual entry and its linked public terms before acquisitions.
    const first=await client.get(source.start,{page:true});const terms=anchors(first.body,first.url).filter(a=>a.url!==first.url&&new URL(a.url).origin===source.origin&&/terms|privacy|copyright|license|agreement|правил|соглашен|услов/i.test(a.url+' '+a.title));
    for(const t of [...new Map(terms.map(a=>[a.url,a])).values()].slice(0,3)){try{await client.get(t.url,{page:true});}catch(e){if(e instanceof Missing)log({type:'skip',url:t.url,reason:'terms-link-404'});else throw e;}}
    if(!options.dryRun){
      const index=path.join(root,'index.jsonl');
      if(fs.existsSync(index)){const content=fs.readFileSync(index,'utf8');let parts=content.split('\n'),valid='';for(let i=0;i<parts.length;i++){if(!parts[i].trim())continue;let row;try{row=JSON.parse(parts[i]);}catch(e){if(i!==parts.length-1||content.endsWith('\n'))throw new Stop('Corrupt middle index line');atomic(path.join(root,'index-partial-'+Date.now()+'.txt'),parts[i]);break;}valid+=parts[i]+'\n';if(!/^raw\/[a-f0-9]{24}\.(png|jpg|gif|webp|bmp)$/.test(row.file))throw new Stop('Unsafe index filename');let f=path.join(root,row.file);if(fs.existsSync(f)&&sha(fs.readFileSync(f))===row.sha256){existing.set(row.url,row);hashes.add(row.sha256);}}if(valid!==content)atomic(index,valid);}
      for(const name of fs.readdirSync(path.join(root,'raw')).filter(n=>/^[a-f0-9]{24}\.(png|jpg|gif|webp|bmp)\.json$/.test(n))){const row=JSON.parse(fs.readFileSync(path.join(root,'raw',name),'utf8'));if(!/^raw\/[a-f0-9]{24}\.(png|jpg|gif|webp|bmp)$/.test(row.file||'')||existing.has(row.url)||hashes.has(row.sha256))continue;const file=path.join(root,row.file);if(fs.existsSync(file)&&sha(fs.readFileSync(file))===row.sha256){fs.appendFileSync(index,JSON.stringify(row)+'\n');existing.set(row.url,row);hashes.add(row.sha256);}}
    }
    let initial=first;
    while((state.queue.length||state.pending.length)&&(options.dryRun?planned:existing.size)<options.limit){
      if(Date.now()>=client.deadline)throw new Budget('Checkpoint deadline');
      if(state.pending.length){
        const item=state.pending[0];
        if(!passenger(item.title,item.make)){log({type:'skip',url:item.url,reason:'non-passenger-or-ambiguous'});state.pending.shift();save();continue;}
        if(existing.has(item.url)){state.pending.shift();save();continue;}
        if(options.dryRun){log({type:'would-save',...item,file:'raw/'+sha(item.url).slice(0,24)+'.<verified-image-extension>',usage:'local-training-only; never publish, commit, trace or serve'});planned++;state.pending.shift();continue;}
        try{
          const r=await client.get(item.url);const ext=imageExt(r.data);if(!ext)throw new Stop('Original is not supported image bytes');
          if(hashes.has(r.sha256)){log({type:'skip',url:item.url,reason:'duplicate-sha256'});state.pending.shift();save();continue;}
          const file='raw/'+sha(item.url).slice(0,24)+'.'+ext;
          const row={url:item.url,sourcePage:item.sourcePage,make:item.make,model:item.model,title:item.title,size:r.size,file,sha256:r.sha256,usage:'local-training-only; never publish, commit, trace or serve'};
          atomic(path.join(root,file),r.data);atomic(path.join(root,file+'.json'),JSON.stringify(row,null,2));fs.appendFileSync(path.join(root,'index.jsonl'),JSON.stringify(row)+'\n');existing.set(item.url,row);hashes.add(r.sha256);state.downloaded++;log({type:'saved',count:existing.size,make:item.make,size:r.size});
        }catch(e){if(e instanceof Missing)log({type:'skip',url:item.url,reason:'http-404'});else throw e;}
        state.pending.shift();save();continue;
      }
      const url=state.queue[0];if(state.seen.includes(url)){state.queue.shift();continue;}
      let page;try{page=initial?.url===url?initial:await client.get(url,{page:true});initial=null;}catch(e){if(e instanceof Missing){log({type:'skip',url,reason:'http-404'});state.seen.push(url);state.queue.shift();save();continue;}throw e;}
      const found=await source.parse(page,{client,options});
      state.seen.push(url);state.queue.shift();for(const u of found.pages||[])if(!state.seen.includes(u)&&!state.queue.includes(u))state.queue.push(u);
      state.pending.push(...(found.images||[]));save();log({type:'page',url,queued:state.queue.length,originals:(found.images||[]).length});
    }
    stop=(options.dryRun?planned:existing.size)>=options.limit?'target reached':'queue exhausted';
  }catch(e){stop=e.message;if(!(e instanceof Budget))throw e;}
  finally{if(!options.dryRun){if(stateValid)save();atomic(path.join(root,'crawl-status.json'),JSON.stringify({stop,requests:client.requests,pages:client.pages,indexed:existing.size},null,2));if(fd!==undefined){fs.closeSync(fd);fs.unlinkSync(lock);}}console.log(JSON.stringify({source:source.id,dryRun:options.dryRun,stop,requests:client.requests,pages:client.pages,indexed:existing.size,planned}));}
}
export function launch(source){run(source,args(process.argv.slice(2),source)).catch(e=>{console.error('STOP:',e.message);process.exitCode=1;});}
export function entry(source,meta){if(pathToFileURL(path.resolve(process.argv[1]||'')).href===meta)launch(source);}
