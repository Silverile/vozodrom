import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {stripTypeScriptTypes} from 'node:module';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const head=p=>JSON.parse(execFileSync('git',['show',`HEAD:${p}`],{encoding:'utf8',maxBuffer:64*1024*1024}));
const periodFields=['carsFrom','carsTo','motorcyclesFrom','motorcyclesTo','periodSources','periodNoteCs','periodVerifiedAt'];
const cleanFacts=facts=>Object.fromEntries(Object.entries(facts).map(([slug,f])=>[slug,Object.fromEntries(Object.entries(f).filter(([k])=>!periodFields.includes(k)))]));
assert.deepEqual(cleanFacts(read('src/data/brand-facts.json')),cleanFacts(head('src/data/brand-facts.json')),'Preserve unrelated Wikidata facts');
const periods=read('src/data/catalog/brand-production-periods.json');
for(const make of read('src/data/makes-index.json').filter(m=>m.defunct&&m.sections.includes('auto')))assert(periods[make.slug]?.periodSources.length,`Unreviewed ${make.slug}`);
const beforeCards=head('src/data/catalog/model-cards/skoda.json');
const cards=read('src/data/catalog/model-cards/skoda.json');
const batch=fs.existsSync('analysis/codex/popular-batch1-review.json')?new Set(['octavia','fabia','superb','105-120-125','felicia']):new Set();
const batch2=fs.existsSync('analysis/codex/popular-batch2-review.json')?new Set(read('analysis/codex/popular-batch2-review.json').targets.map(t=>t.join('/'))):new Set();
if(fs.existsSync('analysis/codex/popular-batch3-review.json'))for(const t of read('analysis/codex/popular-batch3-review.json').targets)batch2.add(t.join('/'));
if(batch.size)execFileSync(process.execPath,['analysis/codex/popular-batch1-validate.mjs'],{stdio:'inherit'});
assert.deepEqual(cards.filter(c=>c.lineSlug!=='kodiaq'&&!batch.has(c.lineSlug)&&!batch2.has(`skoda/${c.lineSlug}`)),beforeCards.filter(c=>c.lineSlug!=='kodiaq'&&!batch.has(c.lineSlug)&&!batch2.has(`skoda/${c.lineSlug}`)),'Preserve all other Skoda cards');
const card=cards.find(c=>c.lineSlug==='kodiaq');
assert.equal(card.generations.length,2);
assert.deepEqual(card.generations.map(g=>[g.from,g.to]),[[2016,2024],[2024,null]]);
assert.deepEqual(card.generations[0].facelift.map(f=>f.year),[2021]);
const noObservation=t=>Object.fromEntries(Object.entries(t).filter(([k])=>k!=='availabilityEvidence'));
for(const [i,g] of beforeCards.find(c=>c.lineSlug==='kodiaq').generations.entries())for(const old of g.trims){
  const found=card.generations[i].trims.find(t=>t.name===old.name);
  assert(found,'Existing researched version lost');assert.deepEqual(noObservation(found),noObservation(old),'Existing specifications changed');
}
const index=read('src/data/model-cards-index.json');const oldIndex=head('src/data/model-cards-index.json');
for(const [make,lines] of Object.entries(oldIndex))for(const [slug,c] of Object.entries(lines))if(!batch2.has(`${make}/${slug}`)&&(make!=='skoda'||(slug!=='kodiaq'&&!batch.has(slug))))assert.deepEqual(index[make][slug],c,`Unrelated public card changed: ${make}/${slug}`);
for(const [gi,g] of card.generations.entries()){
  assert(g.engines.every(e=>e.powerKwMin!=null&&e.powerKwMax!=null&&e.powerKwMin<=e.powerKwMax));
  assert.deepEqual(index.skoda.kodiaq.generations[gi].equipmentLines,g.equipmentLines);
  assert.equal(new Set(g.trims.filter(t=>t.id).map(t=>t.id)).size,g.trims.filter(t=>t.id).length);
  const equipment=new Set(g.equipmentLines.map(e=>e.id));
  for(const e of g.equipmentLines){assert(e.sources.length);assert(e.availabilityEvidence.length);assert.equal(e.from,null);assert.equal(e.to,null);}
  for(const t of g.trims){
    for(const id of t.equipmentLineIds??[])assert(equipment.has(id),`Dangling equipment link ${id}`);
    if(!t.id?.startsWith('kodiaq-pilot-'))continue;
    assert(t.sources.length&&t.availabilityEvidence.length);
    assert(t.engine.powerKw>0);
    assert.equal(t.from,null);assert.equal(t.to,null,'Snapshots must not fabricate continuous availability');
    assert(t.fieldSources['engine.powerKw']?.length);
    if(t.engine.fuel==='petrol-phev')assert.equal(t.engine.powerBasis,'system');
  }
}
const enginePowers=card.generations[1].engines.flatMap(e=>e.availablePowerKw);
assert(enginePowers.includes(118)&&enginePowers.includes(200));
// Exercise the actual drawing resolver with a held generation, a valid sibling and a whole-line override.
const drawingCode=stripTypeScriptTypes(fs.readFileSync('src/components/FrontDrawing.tsx','utf8').split('export function FrontDrawing({')[0],{mode:'transform'})
 .replace(/^import .+;$/gm,'').replace(/\bexport /g,'');
function drawingApi(review){
 const exports={};vm.runInNewContext(drawingCode+'\nObject.assign(exports,{drawingPending,frontDrawingId,newestFrontDrawing,frontDrawingFor});',
   {exports,review,lines:{'fixture--model':[[0,2000,2010],[1,2011,2020]]}});return exports;
}
let api=drawingApi({'fixture--model--0':'pending_review'});
assert.equal(api.frontDrawingId('fixture','model',0),null);
assert.equal(api.frontDrawingId('fixture','model',1),'fixture--model--1');
assert.equal(api.newestFrontDrawing('fixture','model'),'fixture--model--1');
assert.equal(api.frontDrawingFor('fixture','model',2005),null);
assert.equal(api.drawingPending('fixture','model',1),false);
api=drawingApi({'fixture--model':'pending_review','fixture--model--0':'pending_review'});
assert.equal(api.frontDrawingId('fixture','model',1),null);
assert.equal(api.newestFrontDrawing('fixture','model'),null);
for(const slug of ['80','100','200','r8','a7']){
 const review=read('src/data/front-drawing-review.json');assert.equal(review[`audi--${slug}--0`],'pending_review');assert.equal(review[`audi--${slug}`],undefined);
}
const audit=read('analysis/codex/catalog-completeness-audit.json');
assert.equal(audit.counts.linesWithoutCard,163);assert.equal(audit.counts.generations,6730);
assert(audit.lines.every(l=>l.fleetN===null||Number.isInteger(l.fleetN)));
console.log('PASS: unchanged unrelated facts/cards/indexes; 2 Kodiaq generations and 2021 facelift; original technical data preserved; sourced equipment links and power basis; generation and line holds; audit counts.');
