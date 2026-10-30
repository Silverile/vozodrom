/** Local-only blueprint acquisition. No source HTML/images are written in the repo. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
export const UA='vozodrom-research/0.1 (https://vozodrom.cz)';
export const ORIGIN='https://3dcar.ru';
const REPO=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export const clean=s=>s.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n)).replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
export function outsideRepo(input){
  const target=path.resolve(input);let ancestor=target,tail=[];
  while(!fs.existsSync(ancestor)){tail.unshift(path.basename(ancestor));const p=path.dirname(ancestor);if(p===ancestor)throw Error('No existing ancestor');ancestor=p;}
  const resolved=path.join(fs.realpathSync(ancestor),...tail);
  const rel=path.relative(fs.realpathSync(REPO),resolved);
  if(!rel||(!rel.startsWith('..'+path.sep)&&rel!=='..'&&!path.isAbsolute(rel)))throw Error('Dataset output must stay outside the repository');
  return resolved;
}
export function links(html,base){return [...html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map(m=>({url:new URL(m[1].replace(/&amp;/g,'&'),base).href,title:clean(m[2])}));}
export function reservations(html,headers={}){
  const hits=[];const text=clean(html);
  if(/(?:noai|noimageai|notrain|tdm-reservation\s*[=:]\s*["']?1)/i.test(html))hits.push('machine-readable reservation');
  for(const tag of html.match(/<meta\b[^>]*>/gi)||[]){
    const attrs=Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*["']([^"']*)["']/g)].map(m=>[m[1].toLowerCase(),m[2]]));
    if(attrs.name?.toLowerCase()==='tdm-reservation'&&attrs.content?.trim()==='1')hits.push('TDM reservation meta');
    if(attrs.name?.toLowerCase()==='tdm-policy')hits.push('TDM policy requires review');
  }
  for(const [k,v]of Object.entries(headers))if(/tdm-reservation/i.test(k)&&String(v).trim()!=='0')hits.push('TDM reservation header');
  if(Object.entries(headers).some(([k,v])=>/tdm-policy/i.test(k)&&String(v).trim()))hits.push('TDM policy requires review');
  const patterns=[/(?:prohibit|forbid|not\s+(?:allowed|permitted)|must\s+not|may\s+not|do\s+not|no\s+use|reserved)[^.]{0,180}(?:training|machine.learning|artificial.intelligence|text.and.data.mining|\bTDM\b)/i,/(?:training|machine.learning|artificial.intelligence|text.and.data.mining|\bTDM\b)[^.]{0,180}(?:prohibit|forbid|not\s+(?:allowed|permitted)|reservation|reserved)/i,/(?:запрещ|нельзя|не\s+допуска|не\s+разреш)[^.]{0,180}(?:обучен|нейросет|искусственн|интеллект|анализ[ау]?\s+данных)/i,/(?:нейросет|искусственн|машинн\w*\s+обучен)[^.]{0,180}(?:запрещ|не\s+разреш|сохран\w*\s+прав)/i];
  if(patterns.some(p=>p.test(text)))hits.push('explicit training/TDM restriction');
  return hits;
}
export function passengerCategory(slug){return !['tanks','zil','other'].includes(slug);}
export function excludedTitle(title){return /\b(truck|lorry|bus|coach|aircraft|airplane|helicopter|ship|boat|tractor|tank|motorcycle|motorbike|sprinter|actros|atego|canter|unimog|transit|ducato|jumper|boxer|crafter|daily|fuso|cargo|kamaz|gazelle|gazon)\b|грузов|автобус|самол[её]т|вертол[её]т|корабл|танк|трактор|мотоцикл|газель|газон/i.test(title);}
export function robotRules(text){
 const groups=[];let agents=[],rules=[],seen=false;
 const flush=()=>{if(agents.length)groups.push({agents,rules});agents=[];rules=[];seen=false;};
 for(let line of text.split(/\r?\n/)){
  line=line.replace(/#.*/,'').trim();const m=line.match(/^([^:]+):\s*(.*)$/);if(!m)continue;
  const key=m[1].toLowerCase(),value=m[2].trim();
  if(key==='user-agent'){if(seen)flush();agents.push(value.toLowerCase());}
  else if(['allow','disallow'].includes(key)){seen=true;rules.push({allow:key==='allow',pattern:value});}
 }
 flush();let best=-1,result=[];
 for(const group of groups){const matches=group.agents.filter(g=>g==='*'||UA.toLowerCase().startsWith(g));if(!matches.length)continue;
  const specificity=Math.max(...matches.map(g=>g==='*'?0:g.length));
  if(specificity>best){best=specificity;result=group.rules;}else if(specificity===best)result.push(...group.rules);
 }
 return result;
}
export function allowed(url,rules){let p=new URL(url).pathname;let matches=rules.filter(r=>r.pattern&&new RegExp('^'+r.pattern.split('*').map(s=>s.replace(/[.+?^${}()|[\]\\]/g,'\\$&')).join('.*').replace(/\\\$$/,'$')).test(p));matches.sort((a,b)=>b.pattern.length-a.pattern.length||Number(b.allow)-Number(a.allow));return !matches.length||matches[0].allow;}
export class PacedClient{
  constructor(){this.last=0;this.requests=0;this.rules=null;}
  async get(url,{binary=false,maxBytes=25*1024*1024}={}){
    for(let redirects=0;redirects<5;redirects++){
      let u=new URL(url);if(u.origin!==ORIGIN||u.username||u.password)throw Error('Off-origin URL rejected');
      if(this.rules&&!allowed(url,this.rules))throw Error('robots restriction: '+u.pathname);
      await new Promise(r=>setTimeout(r,Math.max(0,1100-(Date.now()-this.last))));this.last=Date.now();this.requests++;
      const r=await fetch(url,{headers:{'User-Agent':UA},redirect:'manual',signal:AbortSignal.timeout(25000)});
      if([301,302,303,307,308].includes(r.status)){url=new URL(r.headers.get('location'),url).href;await r.body?.cancel();continue;}
      if(r.status!==200){await r.body?.cancel();throw Error('HTTP '+r.status+'; stopped, no retries');}
      if(+r.headers.get('content-length')>maxBytes){await r.body?.cancel();throw Error('response too large');}
      const chunks=[];let size=0;for await(const chunk of r.body){size+=chunk.length;if(size>maxBytes)throw Error('response too large');chunks.push(chunk);}
      const data=Buffer.concat(chunks);let body=binary?data:data.toString('utf8');const headers=Object.fromEntries(r.headers);
      const reserved=reservations(binary?'':body,headers);if(reserved.length)throw Error('RESERVATION: '+reserved.join(', '));
      return {body,url,headers,size,hash:sha(data)};
    }throw Error('Too many redirects');
  }
}
export async function audit(client){
  const robots=await client.get(ORIGIN+'/robots.txt');client.rules=robotRules(robots.body);
  if(!allowed(ORIGIN+'/blueprints',client.rules)||!allowed(ORIGIN+'/media/blueprints/full/example.jpg',client.rules))throw Error('Robots prohibits blueprint acquisition');
  const home=await client.get(ORIGIN+'/blueprints');
  const termLinks=links(home.body,home.url).filter(l=>new URL(l.url).origin===ORIGIN&&/terms|policy|agreement|copyright|rules|услов|правил|соглашен|политик/i.test(l.url+' '+l.title));
  // Public registration page can expose terms links without submitting anything.
  const registration=await client.get(ORIGIN+'/registration');termLinks.push(...links(registration.body,registration.url).filter(l=>new URL(l.url).origin===ORIGIN&&/terms|policy|agreement|copyright|rules|услов|правил|соглашен|политик/i.test(l.url+' '+l.title)));
  const checks=[{url:robots.url,sha256:robots.hash},{url:home.url,sha256:home.hash},{url:registration.url,sha256:registration.hash}];
  for(const url of [...new Set(termLinks.map(l=>l.url))].slice(0,20)){const p=await client.get(url);checks.push({url:p.url,sha256:p.hash});}
  return {home:home.body,report:{checkedAt:new Date().toISOString(),checks,explicitReservationFound:false,termsLinksFound:termLinks.length,scope:'Only checked public pages and response headers; not a legal conclusion. Footer has familiarization-only wording.',userAgent:UA,minIntervalMs:1100}};
}
export function atomic(file,value){const tmp=file+'.tmp';fs.writeFileSync(tmp,value);fs.renameSync(tmp,file);}
