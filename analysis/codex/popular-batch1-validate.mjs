import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const report=read('analysis/codex/popular-batch1-review.json');
const head=p=>execFileSync('git',['show',`${report.baselineCommit}:${p}`],{encoding:'utf8',maxBuffer:64*1024*1024});
const file='src/data/catalog/model-cards/skoda.json';
const original=JSON.parse(head(file)),cards=read(file),index=read('src/data/model-cards-index.json');
const allowed=new Set(['octavia','fabia','superb','105-120-125','felicia','kodiaq']);
// Later batches validate their own target changes from a fixed commit baseline.
const batch2=fs.existsSync('analysis/codex/popular-batch2-review.json')?new Set(read('analysis/codex/popular-batch2-review.json').targets.map(t=>t.join('/'))):new Set();
if(batch2.size)execFileSync(process.execPath,['analysis/codex/popular-batch2-validate.mjs'],{stdio:'inherit'});
function preserve(old,now,path,slug){
 if(old===null)return;
 if(Array.isArray(old)){assert(Array.isArray(now),`${slug}/${path} array removed`);assert(now.length>=old.length,`${slug}/${path} truncated`);old.forEach((v,i)=>preserve(v,now[i],`${path}.${i}`,slug));return;}
 if(typeof old==='object'){assert(now&&typeof now==='object',`${slug}/${path} removed`);for(const [k,v] of Object.entries(old))preserve(v,now[k],path?`${path}.${k}`:k,slug);return;}
 if(old!==now){const change=report.changes.find(c=>c.slug===slug&&c.path===path);assert(change?.sources.length&&change.before===old&&change.after===now,`${slug}/${path} unrecorded change ${old} -> ${now}`);}
}
for(const old of original){
 if(batch2.has(`skoda/${old.lineSlug}`))continue;
 const now=cards.find(c=>c.lineSlug===old.lineSlug);assert(now);
 if(!allowed.has(old.lineSlug)){assert.deepEqual(now,old);continue;}
 assert.equal(now.generations.length,old.generations.length);
 assert.deepEqual(now.generations.map(g=>[g.name,g.code,g.from,g.to]),old.generations.map(g=>[g.name,g.code,g.from,g.to]),`Generation identity changed: ${old.lineSlug}`);
 preserve(old,now,'',old.lineSlug);
 assert.equal(createHash('sha256').update(JSON.stringify(now)).digest('hex'),report.resultHashes[old.lineSlug]);
 for(const [gi,g] of now.generations.entries()){
  assert.equal(index.skoda[old.lineSlug].generations[gi].from,g.from);
  const before=old.generations[gi];
  for(const [ei,e] of (g.engines??[]).entries()){
   if(e.powerKwMin==null||e.powerKwMax==null)continue;
   assert(e.powerKwMin<=e.powerKwMax);
   if(before.engines?.[ei]?.powerKwMin!=null)continue;
   assert(e.sources?.length&&e.fieldSources?.powerKwMin?.length&&e.powerRangeCoverage,`Missing engine provenance ${old.lineSlug}/${gi}/${ei}`);
  }
  for(const t of g.trims??[]){
   if(!t.id?.startsWith('popular-batch1-'))continue;
   assert(t.sources.length&&t.availabilityEvidence.length&&t.fieldSources['engine.powerKw'].length);
   assert.equal(t.from,null);assert.equal(t.to,null);
   assert(t.engine.powerKw>0&&t.transmission.gears&&t.drive);
   if(t.engine.fuel==='petrol-phev')assert.equal(t.engine.powerBasis,'system');
   for(const id of t.equipmentLineIds??[])assert(g.equipmentLines.some(e=>e.id===id));
  }
  for(const e of g.equipmentLines??[]){assert(e.sources.length&&e.availabilityEvidence.length);for(const observation of e.availabilityEvidence)assert(observation.date||observation.observedAt);}
  if(g.equipmentLines?.length)assert.deepEqual(index.skoda[old.lineSlug].generations[gi].equipmentLines,g.equipmentLines);
  assert.equal(new Set((g.trims??[]).filter(t=>t.id).map(t=>t.id)).size,(g.trims??[]).filter(t=>t.id).length);
 }
}
// Source raw blocks of unrelated cards remain byte-identical, including formatting.
function rawCards(raw){let q=false,escape=false,depth=0,start;const out=new Map();for(let i=0;i<raw.length;i++){const c=raw[i];if(q){if(escape)escape=false;else if(c==='\\')escape=true;else if(c==='"')q=false;continue;}if(c==='"'){q=true;continue;}if(c==='{'){if(depth++===0)start=i;}else if(c==='}'&&--depth===0){const value=raw.slice(start,i+1);out.set(JSON.parse(value).lineSlug,value);}}return out;}
const oldRaw=rawCards(head(file)),newRaw=rawCards(fs.readFileSync(file,'utf8'));
for(const [slug,raw] of oldRaw)if(!allowed.has(slug)&&!batch2.has(`skoda/${slug}`))assert.equal(newRaw.get(slug),raw,`Unrelated source bytes changed: ${slug}`);
const oldIndex=JSON.parse(head('src/data/model-cards-index.json'));
for(const [make,lines] of Object.entries(oldIndex))for(const [slug,card] of Object.entries(lines))if(!batch2.has(`${make}/${slug}`)&&(make!=='skoda'||!allowed.has(slug)))assert.equal(JSON.stringify(index[make][slug]),JSON.stringify(card),`Unrelated indexed card changed: ${make}/${slug}`);
assert.equal(index.skoda.kodiaq.generations[0].drawingStage,0);
for(const make of ['volkswagen','ford','hyundai']){
 if(batch2.size)continue; // Whole-file equality superseded by batch2's unrelated raw-block equality.
 const path=`src/data/model-cards/${make}.json`;
 assert.equal(fs.readFileSync(path,'utf8'),head(path),`Source outside ownership changed: ${path}`);
}
console.log('PASS: generation indexes/dates unchanged; original values retained or source-ledgered; unrelated source blocks/index cards unchanged; new versions/equipment/engine powers sourced; Kodiaq drawingStage=0 exported.');
