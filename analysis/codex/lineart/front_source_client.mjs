import crypto from 'node:crypto';
export const UA='VozodromFrontResearch/1.0 (Codex; https://vozodrom.cz)';
export const text=s=>s.replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#0*39;/g,"'").replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
export const links=(html,base)=>[...html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].flatMap(m=>{try{return[{url:new URL(m[1].replaceAll('&amp;','&'),base).href,title:text(m[2])}];}catch{return[];}});
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export class Stop extends Error{}
export class Missing extends Error{}
export class Budget extends Error{}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
export function robots(body,agent=UA){
 const groups=[];let current={agents:[],rules:[],delay:0},seen=false;
 const flush=()=>{if(current.agents.length)groups.push(current);current={agents:[],rules:[],delay:0};seen=false;};
 for(const line of body.split(/\r?\n/)){
  const m=line.replace(/#.*/,'').trim().match(/^([^:]+):\s*(.*)$/);if(!m)continue;
  const k=m[1].toLowerCase(),v=m[2].trim();
  if(k==='user-agent'){if(seen)flush();current.agents.push(v.toLowerCase());}
  else if(k==='allow'||k==='disallow'){seen=true;current.rules.push({allow:k==='allow',pattern:v});}
  else if(k==='crawl-delay'){seen=true;current.delay=Math.max(current.delay,Number(v)*1000||0);}
 }flush();
 const applicable=groups.map(g=>({...g,specificity:Math.max(-1,...g.agents.map(a=>a==='*'?0:agent.toLowerCase().includes(a)?a.length:-1))})).filter(g=>g.specificity>=0);
 const best=Math.max(-1,...applicable.map(g=>g.specificity));
 const chosen=applicable.filter(g=>g.specificity===best);
 const aiRules=groups.filter(g=>g.agents.some(a=>/^(?:gptbot|chatgpt-user|claudebot|claude-user|claude-code|anthropic-ai)$/.test(a))).map(g=>g.rules);
 const aiDenied=aiRules.some(rules=>rules.some(r=>!r.allow&&r.pattern==='/'));
 return {rules:chosen.flatMap(g=>g.rules),delay:Math.max(1100,...chosen.map(g=>g.delay)),aiDenied,aiRules};
}
export function allowed(url,rules){
 const u=new URL(url),p=u.pathname+u.search;
 const matches=rules.filter(r=>r.pattern&&new RegExp('^'+r.pattern.split('*').map(s=>s.replace(/[.+?^${}()|[\]\\]/g,'\\$&')).join('.*').replace(/\\\$$/,'$')).test(p));
 matches.sort((a,b)=>b.pattern.replaceAll('*','').length-a.pattern.replaceAll('*','').length||Number(b.allow)-Number(a.allow));
 return !matches.length||matches[0].allow;
}
export function reservation(body,headers={}){
 const signal=[body,...Object.entries(headers).map(([k,v])=>k+': '+v)].join('\n');
 if(/\bai-input\s*=\s*no\b/i.test(signal))return 'Content-Signal ai-input=no';
 if(/\b(?:noai|noimageai)\b|tdm-reservation\s*[=:]\s*["']?1/i.test(signal)||headers['tdm-reservation']==='1')return 'AI/TDM reservation';
 return null;
}
export function automationBan(html){
 const t=text(html);
 return t.match(/[^.!?]{0,180}(?:must not|may not|prohibit(?:ed)?|forbid(?:den)?|not permitted|not allowed)[^.!?]{0,180}(?:scrap(?:e|ing)|crawl(?:er|ing)?|automated|robot)[^.!?]{0,180}/i)?.[0]||t.match(/[^.!?]{0,180}(?:scrap(?:e|ing)|crawl(?:er|ing)?|automated|robot)[^.!?]{0,180}(?:prohibit(?:ed)?|forbid(?:den)?|not permitted|not allowed)[^.!?]{0,180}/i)?.[0]||null;
}
export class Client{
 constructor({hosts,maxMinutes=20,maxRequests=Infinity,maxResponseBytes=35e6}={}){if(!Number.isSafeInteger(maxResponseBytes)||maxResponseBytes<1||maxResponseBytes>256e6)throw Error('maxResponseBytes must be 1..256000000');this.maxResponseBytes=maxResponseBytes;this.hosts=new Set(hosts);this.deadline=Date.now()+maxMinutes*60000;this.maxRequests=maxRequests;this.requests=0;this.last=0;this.lastHost=new Map();this.policies=new Map();this.evidence=[];this.stopped=false;}
 async raw(url,policy={delay:1100},request={}){
  if(this.stopped)throw new Stop('Client already stopped');
  const u=new URL(url);if(u.protocol!=='https:'||!this.hosts.has(u.hostname)||u.username||u.password)throw new Stop('Unapproved host/scheme '+url);
  const delay=Math.max(0,1100-(Date.now()-this.last),policy.delay-(Date.now()-(this.lastHost.get(u.hostname)||0)));
  if(Date.now()+delay>this.deadline||this.requests>=this.maxRequests)throw new Budget('Checkpoint request/time budget');
  await sleep(delay);this.last=Date.now();this.lastHost.set(u.hostname,this.last);this.requests++;
  let r;try{r=await fetch(url,{...request,headers:{'User-Agent':UA,...request.headers},redirect:'manual',signal:AbortSignal.timeout(20000)});}catch(e){this.stopped=true;throw new Stop('Network failure '+url+': '+e.message);}
  const headers=Object.fromEntries(r.headers);
  if([403,429].includes(r.status)){this.stopped=true;await r.body?.cancel();throw new Stop('HTTP '+r.status+'; no retry');}
  if(request.robotsProbe&&[400,404,410].includes(r.status)){
   const body=await r.text();if(/<title[^>]*>[^<]*(?:captcha|just a moment|access denied)|cf-chl-|g-recaptcha-response/i.test(body)){this.stopped=true;throw new Stop('CAPTCHA/challenge; no retry');}
   const denied=reservation(body,headers);if(denied){this.stopped=true;throw new Stop(denied);}
   const missing=new Missing('Unavailable robots HTTP '+r.status);missing.status=r.status;missing.headers=headers;throw missing;
  }
  if([301,302,303,307,308].includes(r.status)){await r.body?.cancel();return{redirect:new URL(headers.location,url).href,status:r.status,headers};}
  if(r.status===404){await r.body?.cancel();throw new Missing('HTTP 404 '+url);}
  if(!r.ok){this.stopped=true;await r.body?.cancel();throw new Stop('HTTP '+r.status+' '+url);}
  if(Number(headers['content-length'])>this.maxResponseBytes){await r.body?.cancel();throw new Stop(`Response too large (limit ${this.maxResponseBytes} bytes): ${url}`);}
  const parts=[];let bytes=0;for await(const part of r.body){bytes+=part.length;if(bytes>this.maxResponseBytes)throw new Stop(`Response too large (limit ${this.maxResponseBytes} bytes): ${url}`);parts.push(part);}
  const data=Buffer.concat(parts),body=/text|json|xml|javascript/i.test(headers['content-type']||'')?data.toString('utf8'):'';
  if(/<title[^>]*>[^<]*(?:captcha|just a moment|access denied)|cf-chl-|g-recaptcha-response|id=["']captcha/i.test(body)){this.stopped=true;throw new Stop('CAPTCHA/challenge; no retry');}
  const denied=reservation(body,headers);if(denied){this.stopped=true;throw new Stop(denied);}
  return{url,data,body,headers,status:r.status,sha256:sha(data)};
 }
 async policy(origin){
  if(this.policies.has(origin))return this.policies.get(origin);
  let url=origin+'/robots.txt',r;
  for(let i=0;i<4;i++){
   try{r=await this.raw(url,{delay:1100},{robotsProbe:true});}catch(e){if(e instanceof Missing){r={body:'',status:e.status||404,headers:e.headers||{},unavailable:true};break;}throw e;}
   if(!r.redirect)break;
   // A robots redirect must remain on its original origin; inspect domain moves separately.
   if(new URL(r.redirect).origin!==origin)throw new Stop('Cross-origin robots redirect requires separate review');
   url=r.redirect;
  }
  if(r.redirect||!r.unavailable&&!/user-agent\s*:/i.test(r.body))throw new Stop('Unrecognized robots response');
  const p=robots(r.body);p.origin=origin;p.url=url;p.status=r.status;p.body=r.body;p.checkedAt=new Date().toISOString();if(r.unavailable)p.note='Unavailable robots: RFC 9309 section 2.3.1.3; 401/403/429/challenges are still hard stops';
  this.policies.set(origin,p);this.evidence.push(p);
  if(p.aiDenied){this.stopped=true;throw new Stop('Explicit AI-agent robots denial '+origin);}
  return p;
 }
 async get(url,request={}){
  for(let n=0;n<5;n++){
   const p=await this.policy(new URL(url).origin);
   if(!allowed(url,p.rules))throw new Stop('Robots disallow '+url);
   if(p.aiRules.some(rules=>!allowed(url,rules)))throw new Stop('AI-agent robots path disallow '+url);
   const r=await this.raw(url,p,request);if(!r.redirect)return r;
   const denied=reservation('',r.headers);if(denied)throw new Stop(denied);url=r.redirect;
  }throw new Stop('Redirect limit');
 }
}
