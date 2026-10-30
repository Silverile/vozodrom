import fs from 'node:fs';
import assert from 'node:assert/strict';
const d='analysis/codex/photo-backfill-80',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const batches=fs.readdirSync(d).filter(f=>/^batch-\d+\.json$/.test(f)).flatMap(f=>read(d+'/'+f));
for(const [make,suffix]of [['mercedes-benz','mercedes'],['nissan','nissan'],['fiat','fiat']]){
 const before=read(d+'/before-'+suffix+'.json'),after=read(`src/data/catalog/model-cards/${make}.json`);
 const clean=cards=>cards.map(c=>({...c,needsReview:[],generations:c.generations.map(g=>({...g,photo:null}))}));
 assert.deepEqual(clean(before),clean(after),'Changed existing technical facts: '+make);
 for(const p of batches.filter(p=>p.makeSlug===make)){
  const c=after.find(c=>c.lineSlug===p.lineSlug),g=c.generations[p.generationIndex];
  assert.equal(g.name,p.expectedGenerationName);assert.deepEqual(g.photo,p.photo);
  assert.equal(before.find(c=>c.lineSlug===p.lineSlug).generations[p.generationIndex].photo,null);
 }
}
for(const make of ['oldsmobile','omoda','opel','ora','packard','pagani'])assert(!fs.existsSync(`src/data/model-cards/${make}.json`),'Concurrent Claude make overlap');
const base=read('analysis/codex/turn-80-baseline.json'),binaries=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())walk(p);else if(!(p in base)&&/\.(jpg|jpeg|png|pdf|webp|ts)$/i.test(p))binaries.push(p);}}
walk('analysis/codex');assert.deepEqual(binaries,[],'Temporary binaries/type fixtures remain');
console.log(`PASS turn80: ${batches.length} keyed photo-only patches; existing Mercedes/Nissan/Fiat technical facts unchanged; no make overlap or temporary binaries.`);
