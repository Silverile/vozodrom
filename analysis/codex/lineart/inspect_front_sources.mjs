import fs from 'node:fs';
import {Client,links,text,automationBan} from './front_source_client.mjs';
const seeds={
 ultimatespecs:'https://www.ultimatespecs.com/',skoda:'https://www.skoda-storyboard.com/en/',mazda:'https://newsroom.mazda.com/en/',
 volkswagen:'https://www.volkswagen-newsroom.com/en',geely:'https://global.geely.com/',toyotauk:'https://media.toyota.co.uk/',
 autowp:'https://www.autowp.ru/',wheelsage:'https://en.wheelsage.org/',carswp:'https://www.carswp.com/'
};
for(const source of process.argv.slice(2)){
 const url=seeds[source];if(!url)throw Error('Unknown source');
 const client=new Client({hosts:[new URL(url).hostname],maxRequests:8,maxMinutes:8});
 const report={source,start:url,checkedAt:new Date().toISOString(),pages:[]};
 try{
  const p=await client.get(url);
  const ls=links(p.body,p.url);
  report.pages.push({url:p.url,sha256:p.sha256,headers:p.headers,automationBan:automationBan(p.body),text:text(p.body).slice(-4500),links:ls,scripts:[...p.body.matchAll(/<script\b[^>]*src=["']([^"']+)/g)].map(m=>m[1]),images:[...p.body.matchAll(/<img\b[^>]*>/g)].slice(0,15).map(m=>m[0])});
  const terms=[...new Map(ls.filter(l=>new URL(l.url).hostname===new URL(url).hostname&&/terms|legal|conditions|copyright|imprint|disclaimer|podmink|условия|правила/i.test(l.url+' '+l.title)).map(l=>[l.url,l])).values()].slice(0,3);
  for(const t of terms){const q=await client.get(t.url);report.pages.push({url:q.url,sha256:q.sha256,automationBan:automationBan(q.body),text:text(q.body).slice(-24000)});}
 }catch(e){report.stop=e.message;}
 report.policies=client.evidence;report.requests=client.requests;
 fs.writeFileSync(`analysis/codex/lineart/source-${source}-inspection.json`,JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({source,requests:report.requests,stop:report.stop,pages:report.pages.map(p=>({url:p.url,automationBan:p.automationBan,text:p.text?.slice(-1800),links:p.links?.filter(l=>/terms|legal|image|photo|gallery|model|brand|catalog|biblio|car-spec|press|media/i.test(l.url+' '+l.title)).slice(0,12),images:p.images?.slice(0,3)}))}));
}
