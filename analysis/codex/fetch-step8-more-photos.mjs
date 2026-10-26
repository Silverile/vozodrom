import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const cards=JSON.parse(fs.readFileSync('src/data/catalog/model-cards/skoda.json','utf8'));
const rows=JSON.parse(fs.readFileSync('analysis/codex/skoda-step8-photo-candidates.json','utf8'));
const next=cards.flatMap(c=>c.generations.map((g,i)=>({lineSlug:c.lineSlug,generationIndex:i,file:g.photo?.file,url:g.photo?.url,status:g.photo?.visualReview}))).filter(g=>g.status==='pending').slice(10,18);
for(const p of next){try{const r=await fetch(p.url,{signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error('HTTP '+r.status);const local=path.join(os.tmpdir(),'vozodrom-step8-'+p.lineSlug+'-'+p.generationIndex+'.jpg');fs.writeFileSync(local,Buffer.from(await r.arrayBuffer()));p.downloaded=true;console.log(p.lineSlug,p.generationIndex,local);}catch(e){p.error=e.message;rows.push(p);break;}rows.push(p);await new Promise(r=>setTimeout(r,2500));}
fs.writeFileSync('analysis/codex/skoda-step8-photo-candidates.json',JSON.stringify(rows,null,2)+'\n');
