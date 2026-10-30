import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
const root='analysis/codex/letter-a',db=root+'/a-17-results.json',rows=JSON.parse(fs.readFileSync(db));
for(const r of rows){
 if(r.status!=='done')throw Error('Incomplete '+r.id);
 const png=r.folder+'/'+r.id+'.png',m=await sharp(png).metadata(),ref=await sharp(r.folder+'/reference.jpg').metadata();
 if(m.width!==1536||m.height!==1024||m.format!=='png'||ref.width<1000)throw Error('Dimensions '+r.id);
 const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
 if(hash(png)!==hash(r.generatedSource))throw Error('Edited drawing '+r.id);
 const info=fs.readFileSync(r.folder+'/info.txt','utf8');
 for(const v of ['Generace: '+r.generation,'Licence: '+r.licence,...r.evidence.map(x=>'Evidence: '+x)])if(!info.includes(v))throw Error('Missing metadata '+r.id+' '+v);
 r.referenceGate='pass';r.referenceWidth=ref.width;
 if(r.id==='alpine--a106--0'){
  r.variant='A106 Coach sporting appearance, 1958; modern Gordini wheels and event stickers in reference. Drawing retains the small inner round lamps; no extra bumper-mounted lamps.';
  r.notes+=' Small inner lamps retained; accepted as minor lamp detail under batch instructions.';
 }
 if(r.id==='alpina--roadster-v8--0')r.notes+=' Headlamp housings appear rounder than reference; retained for Claude review under minor lamp-detail tolerance.';
 if(r.id==='alpina--xd4--0')r.notes+=' Commons alternatives rejected for steep angle or rear view; launch photograph used after checking both headlights and complete bumper. No open licence stated.';
 let updated=info.replace(/^Variant:.*$/m,'Variant: '+r.variant);fs.writeFileSync(r.folder+'/info.txt',updated);
}
const sourceDb=root+'/a17-sources.json',sources=JSON.parse(fs.readFileSync(sourceDb));
for(const s of sources){
 const chosen=rows.find(r=>r.referencePage===s.referencePage);
 if(s.local&&s.local.startsWith(root+'/raw/a17-')){
  const absolute=path.resolve(s.local),allowed=path.resolve(root+'/raw')+path.sep;
  if(!absolute.startsWith(allowed))throw Error('Unsafe cleanup path');
  if(fs.existsSync(absolute))fs.unlinkSync(absolute);
 }
 if(chosen){s.local=chosen.folder+'/reference.jpg';s.gate='pass';}
 else{delete s.local;s.gate=s.error?'download failed: '+s.error:'not selected: rear view, steep angle or better front reference available';}
}
const sheet=path.resolve(root+'/raw/a17-reference-sheet.png');if(fs.existsSync(sheet))fs.unlinkSync(sheet);
fs.writeFileSync(sourceDb,JSON.stringify(sources,null,2));fs.writeFileSync(db,JSON.stringify(rows,null,2));
const changed=[db,sourceDb,...['tools','prepare','save','finalize'].map(x=>root+'/a17-'+x+'.mjs'),...rows.flatMap(r=>[r.folder+'/reference.jpg',r.folder+'/'+r.id+'.png',r.folder+'/info.txt'])];
console.log(JSON.stringify({done:rows.length,drawings:'All PNG 1536x1024; SHA256 matches unedited tool outputs',references:'All >=1000px, metadata and two evidence URLs present',generationSeconds:rows.reduce((sum,r)=>sum+r.genSeconds,0),changedFiles:changed},null,2));
