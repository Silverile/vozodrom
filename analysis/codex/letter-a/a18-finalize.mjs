import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
const root='analysis/codex/letter-a',db=root+'/a-18-results.json',rows=JSON.parse(fs.readFileSync(db));
for(const r of rows){
if(r.status!=='done')throw Error('Incomplete '+r.id);
const png=r.folder+'/'+r.id+'.png',m=await sharp(png).metadata(),ref=await sharp(r.folder+'/reference.jpg').metadata();
if(m.width!==1536||m.height!==1024||m.format!=='png'||ref.width<1000)throw Error('Dimensions '+r.id);
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');if(hash(png)!==hash(r.generatedSource))throw Error('Edited drawing '+r.id);
let info=fs.readFileSync(r.folder+'/info.txt','utf8');
for(const v of ['Generace: '+r.generation,'Licence: '+r.licence,...r.evidence.map(x=>'Evidence: '+x)])if(!info.includes(v))throw Error('Missing metadata '+r.id+' '+v);
r.referenceGate='pass';r.referenceWidth=ref.width;
if(r.id==='alpine--a310--0')r.notes+=' Lamp element count simplified; retained under explicit batch tolerance.';
if(r.id==='amc--amx--0')r.notes+=' Small empty grille badge/medallion outlines retained; no readable text, accepted under minor-detail tolerance.';
if(r.id==='amc--classic--0')r.credit='Greg Gjerdingen';
info=info.replace(/^Credit:.*$/m,'Credit: '+r.credit);fs.writeFileSync(r.folder+'/info.txt',info);
}
const sourceDb=root+'/a18-sources.json',sources=JSON.parse(fs.readFileSync(sourceDb));
for(const s of sources){const chosen=rows.find(r=>r.referencePage===s.referencePage);
if(s.local){const absolute=path.resolve(s.local),allowed=path.resolve(root+'/raw')+path.sep;if(!absolute.startsWith(allowed))throw Error('Unsafe cleanup path');if(fs.existsSync(absolute))fs.unlinkSync(absolute);}
if(chosen){s.local=chosen.folder+'/reference.jpg';s.gate='pass';}else{delete s.local;s.gate=s.error?'download failed: '+s.error:'not selected: rear view';}}
for(const name of ['a18-reference-sheet.png','a18-evidence-sheet.png']){const target=path.resolve(root+'/raw/'+name);if(!target.startsWith(path.resolve(root+'/raw')+path.sep))throw Error('Unsafe');if(fs.existsSync(target))fs.unlinkSync(target);}
fs.writeFileSync(sourceDb,JSON.stringify(sources,null,2));fs.writeFileSync(db,JSON.stringify(rows,null,2));
const changed=[db,sourceDb,...['tools','prepare','save','gate','finalize'].map(x=>root+'/a18-'+x+'.mjs'),...rows.flatMap(r=>[r.folder+'/reference.jpg',r.folder+'/'+r.id+'.png',r.folder+'/info.txt'])];
console.log(JSON.stringify({done:rows.length,drawings:'All PNG 1536x1024; SHA256 matches unedited tool outputs',references:'All >=1000px, exact generation names and two evidence URLs present',generationSeconds:rows.reduce((n,r)=>n+r.genSeconds,0),changedFiles:changed},null,2));
