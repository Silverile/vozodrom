import fs from 'node:fs';import assert from 'node:assert/strict';import sharp from 'sharp';import crypto from 'node:crypto';
const root='analysis/codex/letter-a',rows=JSON.parse(fs.readFileSync(root+'/a-04-results.json','utf8'));
const names=['II — MY2007–2013','III — MY2014–2020','IV — od MY2022','I — MY1991–2005','II — MY2017–2022','I — MY2007–2012','II — MY2013–2018','III — MY2019–2026','I — 3.5RL, MY1996–2004','II — MY2005–2012','RLX — od MY2014','RSX — MY2002–2006'];
assert.equal(rows.length,12);const files=[root+'/a-04-results.json',...['a04.mjs','a04-thumbs.mjs','a04-finalize.mjs','a04-decisions.json','a04-verify.mjs'].map(x=>root+'/'+x)];
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const [i,r] of rows.entries()){
 assert.equal(r.generation,names[i]);assert.ok(r.licence);assert.ok(r.image);assert.ok(r.evidence.length>=2);assert.ok(r.genSeconds>0);assert.ok(['done','failed','no-reference'].includes(r.status));
 const info=fs.readFileSync(r.folder+'/info.txt','utf8');for(const field of ['ID: '+r.id,'Značka: Acura','Generace: '+names[i],'Licence: '+r.licence,'View: ','Variant: '])assert.ok(info.includes(field));
 const ref=await sharp(r.folder+'/reference.jpg').metadata();assert.ok(ref.width>=1000);assert.equal(ref.width,r.referenceWidth);
 files.push(r.folder+'/reference.jpg',r.folder+'/info.txt');
 if(r.status==='done'){const p=r.folder+'/'+r.id+'.png',m=await sharp(p).metadata();assert.equal(m.format,'png');assert.equal(m.width,1536);assert.equal(m.height,1024);assert.equal(hash(p),hash(r.originalOutput));files.push(p);}else assert.equal(fs.existsSync(r.folder+'/'+r.id+'.png'),false);
 for(const a of r.attempts||[]){assert.ok(fs.existsSync(a.file));files.push(a.file);}
}
console.log(JSON.stringify({rows:12,done:rows.filter(r=>r.status==='done').length,failed:rows.filter(r=>r.status==='failed').length,checks:'Exact catalogue strings, all references >=1000px, licences, evidence URLs, info fields, PNG 1536x1024, unedited hashes, failed rows contain no accepted PNG',changed_files:[...new Set(files)].sort()},null,2));
