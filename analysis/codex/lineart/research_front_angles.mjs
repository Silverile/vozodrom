import fs from 'node:fs';
import path from 'node:path';
import {Client,links,sha} from './front_source_client.mjs';
import {sites} from './manufacturer_sites.mjs';
import {attrs} from './crawl_front_carswp.mjs';

const root=path.resolve('analysis/codex/lineart/test-out/angle-research');
fs.mkdirSync(root,{recursive:true});
const requested=process.argv.slice(2),names=requested.length?requested:['skoda','toyota','volkswagen','hyundai','kia','ford','dacia','audi'];
const seeds={skoda:['https://www.skoda-auto.cz/modely/fabia/fabia','https://www.skoda-auto.cz/modely/octavia/octavia'],toyota:['https://www.toyota.cz/nova-auta/corolla-sedan']};
const results=[];
for(const name of names){
 const site=sites[name];if(!site)throw Error('Unknown site '+name);
 const client=new Client({hosts:[new URL(site.home).hostname],maxMinutes:3,maxRequests:15,maxResponseBytes:128e6});
 const row={site:name,pages:[],policies:[]};
 try{
  for(const url of seeds[name]||[site.home]){
   const p=await client.get(url),file=path.join(root,name+'-'+row.pages.length+'.html');fs.writeFileSync(file,p.body);
   const decode=s=>s.replaceAll('&quot;','"').replaceAll('&amp;','&').replaceAll('\\/','/').replaceAll('&#39;',"'");
   const html=decode(p.body),resources=[];
   for(const m of p.body.matchAll(/<(?:script|link|iframe)\b[^>]*>/gi)){
    const a=attrs(m[0]),raw=a.src||a.href;if(raw)try{resources.push({url:new URL(decode(raw),p.url).href,type:m[0].slice(1).split(/\s|>/)[0]});}catch{}
   }
   row.pages.push({url:p.url,bytes:p.data.length,sha256:p.sha256,local:file.replaceAll('\\','/'),links:links(p.body,p.url).filter(l=>/config|konfigur|360|build|custom/i.test(l.url+' '+l.title)),resources,
    angleContexts:[...html.matchAll(/.{0,150}(?:vext_front|360|exterior|frontview|front_view|front1080|spin|rotation|frameCount|imageSequence|viewName).{0,200}/gi)].slice(0,120).map(m=>m[0]),
    renderUrls:[...new Set(html.match(/https?:[^\s"'<>\\]*(?:vext|render|360)[^\s"'<>\\]*/gi)||[])].slice(0,100)});
  }
 }catch(e){row.stop=e.message;}
 row.policies=client.evidence;row.requests=client.requests;results.push(row);fs.writeFileSync('analysis/codex/lineart/angle-research-20261028.json',JSON.stringify(results,null,2)+'\n');
 console.log(JSON.stringify({site:name,requests:client.requests,stop:row.stop,pages:row.pages.map(p=>({url:p.url,bytes:p.bytes,configLinks:p.links.length,contexts:p.angleContexts.length}))}));
}
