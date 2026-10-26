import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const c=JSON.parse(fs.readFileSync('src/data/catalog/model-cards/skoda.json','utf8'));
const ts=c.flatMap(c=>c.generations.flatMap((g,i)=>(g.trims||[]).map(t=>({lineSlug:c.lineSlug,generationIndex:i,...t}))));
const fields=['massKg','acceleration0to100s','consumptionL100','consumptionKwh100','rangeKm','dimensionsMm.length','dimensionsMm.width','dimensionsMm.height','dimensionsMm.wheelbase'];
const b={startedAt:'2026-10-26T22:23:45Z',versions:ts.length,ids:ts.map(t=>[t.lineSlug,t.generationIndex,t.name].join('/')),counts:Object.fromEntries(fields.map(k=>[k,ts.filter(t=>k.split('.').reduce((v,k)=>v?.[k],t)!=null).length])),completeDimensions:ts.filter(t=>Object.values(t.dimensionsMm).every(v=>v!==null)).length,photos:c.flatMap(c=>c.generations).filter(g=>g.photo).length,reviewed:c.flatMap(c=>c.generations).filter(g=>g.photo?.visualReview==='reviewed').length};
if(!fs.existsSync('analysis/codex/skoda-step8-baseline.json'))fs.writeFileSync('analysis/codex/skoda-step8-baseline.json',JSON.stringify(b,null,2)+'\n');
const pending=c.flatMap(c=>c.generations.map((g,i)=>({lineSlug:c.lineSlug,generationIndex:i,file:g.photo?.file,url:g.photo?.url,status:g.photo?.visualReview}))).filter(g=>g.status==='pending').slice(0,10);
for(const p of pending){p.localPath=path.join(os.tmpdir(),'vozodrom-step8-'+p.lineSlug+'-'+p.generationIndex+'.jpg');try{const r=await fetch(p.url,{signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error('HTTP '+r.status);fs.writeFileSync(p.localPath,Buffer.from(await r.arrayBuffer()));p.downloaded=true;}catch(e){p.error=e.message;}await new Promise(r=>setTimeout(r,1100));}
fs.writeFileSync('analysis/codex/skoda-step8-photo-candidates.json',JSON.stringify(pending.map(({localPath,...p})=>p),null,2)+'\n');
console.log(JSON.stringify(pending,null,2));
