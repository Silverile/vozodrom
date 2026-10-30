import fs from 'node:fs';
import {Client} from './front_source_client.mjs';
const root='analysis/codex/lineart/test-out/angle-research',probes=JSON.parse(fs.readFileSync('analysis/codex/lineart/configurator-probes-20261028.json'));
const skodaJs=fs.readFileSync(root+'/skoda-visualizer.txt','utf8');
if(!skodaJs.includes('this.target,this.baseName,"api"')||!skodaJs.includes('uf("data",{slug:e})'))throw Error('Skoda published route builder changed');
const page=JSON.parse(fs.readFileSync('analysis/codex/lineart/angle-research-20261028.json')).find(x=>x.site==='skoda').pages[0];
const config=new URL(page.links[0].url),base='https://visualizer.skoda-auto.com';
const jobs=[{site:'skoda-data',url:base+'/'+config.searchParams.get('bid')+'/'+config.searchParams.get('culture')+'/api/data?slug=fabia',derivation:'Published visualizer JS: path(target, webAppRoute, bid, culture, dealer, api), loadModelData -> data?slug; bid/culture/slug from model-page module and configurator link.'}];
if(fs.existsSync(root+'/skoda-data.txt')){
 const d=JSON.parse(fs.readFileSync(root+'/skoda-data.txt'));
 if(!skodaJs.includes('uf("exteriorImages",e)'))throw Error('Published exterior route changed');
 const u=new URL('exteriorImages',jobs[0].url.replace(/data\?.*/,''));
 for(const [k,v]of Object.entries({device:'desktop',scene:d.scene,salesGroup:d.salesgroup,mbvCode:d.mbvCode,colorPrCode:d.colors[0].prCode,wheelPrCode:d.wheels[0].prCode}))u.searchParams.set(k,v);
 jobs.push({site:'skoda-frames',url:u.href,derivation:'Published loadExteriorImages builder and React effect parameter names; values from published model data, no guessed frame URL.'});
}
for(const name of ['toyota','kia','audi']){
 const p=probes.find(x=>x.site===name+'-config');
 const script=p?.scripts?.find(u=>name==='toyota'?/car-config-toyota.*\.js/.test(u):name==='kia'?/carConfiguratorClienlib/.test(u):/main-.*\.js/.test(u));
 if(script)jobs.push({site:name+'-angle-js',url:script,derivation:'Literal script src on published configurator page'});
}
const toyotaHtml=fs.readFileSync(root+'/toyota-config.txt','utf8'),toyotaRequire=toyotaHtml.match(/require\(\["(https:\/\/[^"\s]+car-config-toyota[^"\s]+\.js)"\]/)?.[1];
if(toyotaRequire)jobs.push({site:'toyota-angle-js',url:toyotaRequire,derivation:'Literal require URL in configurator HTML'});
const filter=process.argv.slice(2),results=[];
for(const job of jobs.filter(j=>!filter.length||filter.includes(j.site))){
 const c=new Client({hosts:[new URL(job.url).hostname],maxMinutes:2,maxRequests:4,maxResponseBytes:128e6}),r={...job};
 try{const p=await c.get(job.url);r.local=root+'/'+job.site+'.txt';fs.writeFileSync(r.local,p.body);r.url=p.url;r.bytes=p.data.length;r.sha256=p.sha256;r.contexts=[...p.body.matchAll(/.{0,110}(?:vext|front1080|day-exterior|exteriorImages|frameCount|angles:|angles=|imageSequence|frontAngle|startAngle|spinAngles).{0,220}/gi)].slice(0,65).map(m=>m[0]);}catch(e){r.stop=e.message;}
 r.policies=c.evidence;r.requests=c.requests;results.push(r);fs.writeFileSync('analysis/codex/lineart/angle-data-probes-20261028.json',JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify({site:r.site,bytes:r.bytes,stop:r.stop,contexts:r.contexts?.slice(0,4)}));
}
