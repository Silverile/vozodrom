import fs from 'node:fs';
import {Client,links,text,automationBan} from './front_source_client.mjs';
import {sites} from './manufacturer_sites.mjs';
const out='analysis/codex/lineart/manufacturer-access-20261028.json';
const results=fs.existsSync(out)?JSON.parse(fs.readFileSync(out)):[];
for(const name of process.argv.slice(2).length?process.argv.slice(2):Object.keys(sites)){
 if(results.some(r=>r.site===name))continue;
 const site=sites[name],host=new URL(site.home).hostname,client=new Client({hosts:[host],maxMinutes:2,maxRequests:8});
 const result={site:name,make:site.make,home:site.home,checkedAt:new Date().toISOString(),pages:[]};
 try{
  const p=await client.get(site.home),ls=links(p.body,p.url);
  result.pages.push({url:p.url,sha256:p.sha256,contentSignals:Object.fromEntries(Object.entries(p.headers).filter(([k])=>/content-signal|tdm/i.test(k))),title:text(p.body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||''),imageCount:(p.body.match(/<img\b/gi)||[]).length});
  result.modelLinks=[...new Map(ls.filter(l=>new URL(l.url).hostname===host&&site.modelPath.test(l.url)&&l.title).map(l=>[l.url,l])).values()].slice(0,100);
  const terms=[...site.terms,...ls.filter(l=>new URL(l.url).hostname===host&&/terms|copyright|pravni|pravne|podminky|legal/i.test(l.url+' '+l.title)).map(l=>l.url)].filter((v,i,a)=>a.indexOf(v)===i).slice(0,2);
  result.terms=[];
  for(const url of terms){
   const policy=await client.policy(new URL(url).origin);
   const {allowed}=await import('./front_source_client.mjs');if(!allowed(url,policy.rules)){result.terms.push({url,status:'robots-disallowed; not requested'});continue;}
   const t=await client.get(url);result.terms.push({url:t.url,sha256:t.sha256,automationText:automationBan(t.body),useExcerpts:(text(t.body).match(/.{0,80}(?:editorial|non-commercial|commercial|copyright|zpracov|automat|robot|scrap|crawl).{0,150}/gi)||[]).slice(0,5)});
  }
  result.status='public-page-passed';
 }catch(e){result.status='stopped';result.reason=e.message;}
 result.policies=client.evidence;result.requests=client.requests;results.push(result);fs.writeFileSync(out,JSON.stringify(results,null,2)+'\n');
 console.log(JSON.stringify({site:name,status:result.status,reason:result.reason,modelLinks:result.modelLinks?.length,pages:result.pages,requests:client.requests}));
 await new Promise(r=>setTimeout(r,1100));
}
