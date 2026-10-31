import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const r=read('analysis/codex/popular-batch2-review.json');
const expected=['volkswagen/golf','volkswagen/passat','ford/focus','hyundai/i30','volkswagen/transporter','renault/megane','skoda/rapid','skoda/karoq','volkswagen/touran','ford/transit','hyundai/tucson','volkswagen/caddy','ford/mondeo','kia/ceed','skoda/scala'];
const allowed=new Set(expected);assert.deepEqual(r.targets.map(t=>t.join('/')),expected);
const head=p=>execFileSync('git',['show',`${r.baselineCommit}:${p}`],{encoding:'utf8',maxBuffer:64*1024*1024});
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
function blocks(raw){let q=false,esc=false,depth=0,start;const out=new Map();for(let i=0;i<raw.length;i++){const c=raw[i];if(q){if(esc)esc=false;else if(c==='\\')esc=true;else if(c==='"')q=false;continue;}if(c==='"'){q=true;continue;}if(c==='{'){if(depth++===0)start=i;}else if(c==='}'&&--depth===0){const text=raw.slice(start,i+1),value=JSON.parse(text);out.set(`${value.makeSlug}/${value.lineSlug}`,{text,value});}}return out;}
function preserve(old,now,path,key){
 if(old===null)return;
 if(Array.isArray(old)){assert(Array.isArray(now),`${key}/${path} array removed`);assert(now.length>=old.length,`${key}/${path} truncated`);old.forEach((v,i)=>preserve(v,now[i],`${path}.${i}`,key));return;}
 if(typeof old==='object'){assert(now&&typeof now==='object',`${key}/${path} object removed`);for(const [k,v] of Object.entries(old))preserve(v,now[k],path?`${path}.${k}`:k,key);return;}
 if(old!==now){const c=r.changes.find(c=>c.key===key&&c.path===path);assert(c&&c.before===old&&c.after===now&&c.sources.length,`${key}/${path} unrecorded change`);}
}
const index=read('src/data/model-cards-index.json'),oldIndex=JSON.parse(head('src/data/model-cards-index.json'));
let versions=0,equipment=0,facelifts=0;
for(const path of r.sourceFiles){
 const original=blocks(head(path)),current=blocks(fs.readFileSync(path,'utf8'));
 assert.equal(current.size,original.size,`Source card inserted/removed in ${path}`);
 for(const [key,b] of original){const now=current.get(key);assert(now);
  if(!allowed.has(key)){assert.equal(now.text,b.text,`Unrelated source bytes changed: ${key}`);continue;}
  const old=b.value,c=now.value;assert.equal(hash(c),r.resultHashes[key]);preserve(old,c,'',key);
  assert.deepEqual(c.generations.map(g=>[g.name,g.code,g.from,g.to]),old.generations.map(g=>[g.name,g.code,g.from,g.to]),`Generation indexes/date identities changed: ${key}`);
  const [make,slug]=key.split('/');
  for(const [gi,g] of c.generations.entries()){
   const og=old.generations[gi],pub=index[make][slug].generations[gi];
   assert.equal(g.drawingStage,og.drawingStage,'No appearance inferred');
   assert.deepEqual(pub.engines,g.engines??[]);assert.deepEqual(pub.trims,g.trims??[]);
   assert.deepEqual(pub.equipmentLines??[],g.equipmentLines??[]);
   for(const [ei,e] of (g.engines??[]).entries()){
    if(og.engines?.[ei]?.powerKwMin!=null||e.powerKwMin==null)continue;
    assert(e.powerKwMin<=e.powerKwMax&&e.sources?.length&&e.fieldSources?.powerKwMin?.length&&e.powerRangeCoverage==='documented-versions-only',`${key}/${gi}/${ei} missing power provenance`);
   }
   for(const f of (g.facelift??[]).slice((og.facelift??[]).length)){assert(Number.isInteger(f.year)&&f.note&&f.sources.length);facelifts++;}
   const ids=new Set();for(const t of g.trims??[]){if(t.id){assert(!ids.has(t.id));ids.add(t.id);}
    for(const id of t.equipmentLineIds??[])assert(g.equipmentLines?.some(e=>e.id===id),`Unknown equipment ${key}/${gi}/${id}`);
    if(!t.id?.startsWith('popular-batch2-'))continue;versions++;
    assert(t.sources.length&&t.availabilityEvidence.length&&t.fieldSources['engine.powerKw'].length);
    assert.equal(t.from,null);assert.equal(t.to,null);
    assert(t.engine.powerKw>0&&t.transmission.type);
    assert(t.transmission.gears!=null||t.transmission.type==='e-cvt');
    if(t.engine.powerBasis)assert.equal(t.engine.powerBasis,'system');
    if(t.sources.includes(r.sourceDocuments.golf)||t.sources.includes(r.sourceDocuments.touran))assert.equal(t.specificationScope.modelYear,2026);
    if(t.sources.includes(r.sourceDocuments.i30)||t.sources.includes(r.sourceDocuments.tucson))assert.equal(t.specificationScope.modelYear,2025);
   }
   for(const e of g.equipmentLines??[]){assert(e.sources.length&&e.availabilityEvidence.length);equipment++;
    for(const a of e.availabilityEvidence){assert(a.date||a.observedAt);if(a.date)assert(/^\d{4}(-\d{2}(-\d{2})?)?$/.test(a.date));}
   }
  }
 }
}
for(const [make,lines] of Object.entries(oldIndex))for(const [slug,c] of Object.entries(lines))if(!allowed.has(`${make}/${slug}`))assert.equal(JSON.stringify(index[make][slug]),JSON.stringify(c),`Unrelated indexed card changed: ${make}/${slug}`);
// Existing appearance identities remain intact even for deliberately unusual source layouts.
assert.equal(index.hyundai.tucson.generations[0].code,'NX5');assert.equal(index.hyundai.tucson.generations[0].trims.length,0);
assert.equal(index.hyundai.tucson.generations[1].code,'NX4');
assert.equal(index.kia.ceed.generations.length,9);
assert.equal(index.volkswagen.caddy.generations.length,4);
assert.equal(index.hyundai.i30.generations[1].trims[0].engine.powerKw,73.2);
assert(index.skoda.rapid.generations[0].facelifts.some(f=>f.year===2017));
assert(index.renault.megane.generations[3].facelifts.some(f=>f.year===2020));
assert(index.kia.ceed.generations[0].facelifts.some(f=>f.year===2009));
assert(!index.ford.transit.generations[3].facelifts.some(f=>f.year===2024),'Do not invent an exterior facelift from technical update');
console.log(`PASS batch2: 15 lines, original values retained/source-ledgered, stable generation/drawing identities, unrelated source blocks byte-identical, unrelated indexed cards unchanged; ${versions} new sourced versions, ${equipment} equipment entries, ${facelifts} new facelifts; model years and offer dates separated.`);
