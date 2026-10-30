import fs from 'node:fs';
import path from 'node:path';
import {Client,links,allowed,Stop,reservation} from './front_source_client.mjs';
import {attrs} from './crawl_front_carswp.mjs';
const root='analysis/codex/lineart/test-out/angle-research',input=JSON.parse(fs.readFileSync('analysis/codex/lineart/angle-research-20261028.json'));
const jobs=[];
const skodaHtml=fs.readFileSync(path.join(root,'skoda-0.html'),'utf8');
const module=skodaHtml.match(/data-module="vizualizer2-module"[^>]+/)[0],props=JSON.parse(attrs('<div '+module+'>')['data-props'].replaceAll('&quot;','"'));
jobs.push({site:'skoda-visualizer',url:new URL(props.viewModel.sourceUrl,props.viewModel.baseUrl).href,publishedBy:input.find(x=>x.site==='skoda').pages[0].url});
for(const name of ['skoda','toyota','kia','dacia','ford','audi']){
 const p=input.find(x=>x.site===name)?.pages[0];if(!p)continue;
 const link=p.links.find(x=>name==='toyota'?/corolla-sedan\/konfigurator$/.test(x.url):name==='dacia'?/sandero\/konfigurator/.test(x.url):name==='ford'?/osobni-vozy$/.test(x.url):true);
 if(link)jobs.push({site:name+'-config',url:link.url,publishedBy:p.url});
}
const filter=process.argv.slice(2),results=[];
for(const job of jobs.filter(j=>!filter.length||filter.includes(j.site))){
 const c=new Client({hosts:[new URL(job.url).hostname],maxMinutes:3,maxRequests:12,maxResponseBytes:128e6}),row={...job,redirects:[]};
 try{
  let url=job.url,p;
  for(let i=0;i<5;i++){
   c.hosts.add(new URL(url).hostname);const policy=await c.policy(new URL(url).origin);
   if(!allowed(url,policy.rules)||policy.aiRules.some(r=>!allowed(url,r)))throw new Stop('Robots disallow '+url);
   p=await c.raw(url,policy);if(!p.redirect)break;
   const denied=reservation('',p.headers);if(denied)throw new Stop(denied);
   row.redirects.push({from:url,to:p.redirect});url=p.redirect;
  }
  if(p.redirect)throw new Stop('Redirect budget');
  const file=path.join(root,job.site+'.txt');fs.writeFileSync(file,p.body);row.finalUrl=p.url;row.local=file;row.bytes=p.data.length;row.sha256=p.sha256;
  const html=p.body.replaceAll('&quot;','"').replaceAll('&#34;','"').replaceAll('&amp;','&').replaceAll('\\/','/');
  row.contexts=[...html.matchAll(/.{0,100}(?:vext|front1080|day-exterior-|imageSequence|frameCount|viewName|angle[sA-Z]|visualizer|configurator|360.{0,15}(?:image|frame)|exterior.{0,12}(?:image|frame)).{0,220}/gi)].slice(0,90).map(x=>x[0]);
  row.links=links(p.body,p.url).filter(l=>/config|konfigur|model|build/i.test(l.url+' '+l.title)).slice(0,20);
  row.scripts=[...p.body.matchAll(/<script\b[^>]*>/gi)].map(m=>attrs(m[0])).filter(a=>a.src).map(a=>new URL(a.src,p.url).href);
 }catch(e){row.stop=e.message;}
 row.policies=c.evidence;row.requests=c.requests;results.push(row);fs.writeFileSync('analysis/codex/lineart/configurator-probes-20261028.json',JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify({site:job.site,stop:row.stop,bytes:row.bytes,requests:c.requests,contexts:row.contexts?.length,finalUrl:row.finalUrl}));
}
