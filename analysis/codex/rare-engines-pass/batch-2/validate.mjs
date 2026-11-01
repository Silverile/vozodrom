import fs from 'node:fs';import zlib from 'node:zlib';import assert from 'node:assert/strict';import{evidenceProblem,normalizeVariant,powerValues,rejectEngine}from '../../engine-throughput-policy.mjs';
const root='analysis/codex/rare-engines-pass/batch-2',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),base=JSON.parse(zlib.gunzipSync(fs.readFileSync(root+'/baseline.json.gz'))),changes=read(root+'/engine-changes.json'),selected=read(root+'/selection.json'),key=r=>(r.id??r.make+'/'+r.line)+'/'+r.index,affected=new Set(changes.changes.map(key)),targets=new Set(selected.map(key));
assert(changes.changes.every(r=>targets.has(key(r))));let sourceCards=0,checked=0;
function compareCard(a,b,id){
 if(![...affected].some(k=>k.startsWith(id+'/'))){assert.deepEqual(b,a,id);return;}
 const touched=a.generations.map((_,i)=>i).filter(i=>affected.has(id+'/'+i)),otherReview=r=>!touched.some(i=>r.field===`generations[${i}].engines`||r.field?.startsWith(`generations[${i}].engines[`));
 assert.deepEqual((b.needsReview??[]).filter(otherReview),(a.needsReview??[]).filter(otherReview),'Unrelated review notes changed '+id);
 assert((a.sources??[]).every(s=>b.sources.includes(s)),'Source removed '+id);
 const x=structuredClone(a),y=structuredClone(b);for(const p of['sources','needsReview']){delete x[p];delete y[p];}assert.equal(x.generations.length,y.generations.length);
 for(let i=0;i<x.generations.length;i++)if(affected.has(id+'/'+i)){
  const before=x.generations[i],after=y.generations[i];assert(!(before.engines?.length));
  assert.deepEqual([...after.sources].sort(),[...new Set([...before.sources,...after.engines.flatMap(e=>e.sources)])].sort(),'Generation sources differ '+id+'/'+i);
  for(const e of after.engines){assert(e.variant.length<=40);assert.equal(normalizeVariant(e.variant),e.variant);assert.equal(e.sources.length,1);assert.equal(evidenceProblem(after,i,e),null,id+'/'+i+'/'+e.variant);assert.equal(rejectEngine(...id.split('/'),e),null);for(const v of powerValues(e))assert(Number.isFinite(v)&&v>0);if(e.fuel==='electric'){assert.equal(e.displacementCc,null);assert.equal(e.displacementLitresNominal,null);}checked++;}
  for(const f of['engines','engineCoverage','sources']){delete before[f];delete after[f];}
 }
 assert.deepEqual(y,x,'Other facts changed '+id);
}
for(const[p,a]of Object.entries(base)){const b=read(p);if(/^src\/data\/(?:catalog\/)?model-cards\//.test(p)){assert.equal(a.length,b.length);for(let i=0;i<a.length;i++){compareCard(a[i],b[i],a[i].makeSlug+'/'+a[i].lineSlug);sourceCards++;}}else if(p==='src/data/model-cards-index.json'){assert.deepEqual(Object.keys(b),Object.keys(a));for(const[m,lines]of Object.entries(a)){assert.deepEqual(Object.keys(b[m]),Object.keys(lines));for(const[l,c]of Object.entries(lines))compareCard(c,b[m][l],m+'/'+l);}}else assert.deepEqual(b,a,p+' must remain unchanged');}
assert.equal(sourceCards,4753);assert.equal(checked,158);assert.equal(changes.rows,79);assert.equal(changes.generations,36);assert.equal(targets.size,65);
const original=read('analysis/codex/rare-engines-pass/queue.json'),queue=read(root+'/remaining-queue.json'),market=read('analysis/codex/rare-engines-pass/zero-market-queue.json'),index=read('src/data/model-cards-index.json');
assert.deepEqual(selected.slice(0,45),read('analysis/codex/rare-engines-pass/batch-1/remaining-queue.json').nextRegistered1To99);assert.deepEqual(selected.slice(45),read(root+'/zero-selection.json').map(r=>({...r,queueGroup:'zero-matched-fleet-european'})));
assert.equal(queue.completed.length,36);assert.equal(queue.deferred.length,29);assert.equal(queue.counts.registeredFilled,19);assert.equal(queue.counts.registeredRows,34);assert.equal(queue.counts.registeredDeferred,26);assert.equal(queue.counts.zeroEuropeanFilled,17);assert.equal(queue.counts.zeroEuropeanRows,45);assert.equal(queue.counts.zeroEuropeanEngineDeferred,3);assert.equal(queue.nextRegistered1To99.length,0);
assert.deepEqual([...queue.completed,...queue.deferred].map(key).sort(),selected.map(key).sort());
assert.deepEqual([...queue.allRegisteredCompleted,...queue.allRegisteredDeferred].map(key).sort(),original.registered.map(key).sort());assert.equal(queue.allRegisteredCompleted.length,63);assert.equal(queue.allRegisteredDeferred.length,72);
for(const r of queue.completed){assert.equal(index[r.make][r.line].generations[r.index].engines.length,r.engineRows);assert(affected.has(key(r)));}
for(const r of queue.deferred){assert.equal(index[r.make][r.line].generations[r.index].engines.length,0);assert(r.reason);}
assert.equal(market.confirmed.length,20);assert.equal(market.pending.length,1218);assert.deepEqual([...market.confirmed,...market.pending].map(key).sort(),original.zeroModernCandidates.map(key).sort());
for(const r of market.confirmed)assert(r.marketEvidence.url&&r.marketEvidence.note);
for(const a of [market.confirmed,market.pending])for(let i=1;i<a.length;i++)assert(a[i-1].makeMatchedFleet>=a[i].makeMatchedFleet,'Make fleet order lost');
for(const r of [...market.pending,...original.zeroDateUnconfirmed,...original.skippedHistorical])assert(!affected.has(key(r)));
const total=Object.values(index).flatMap(Object.values).flatMap(c=>c.generations).reduce((n,g)=>n+g.engines.length,0);assert.equal(total,12318);
for(const r of changes.changes)assert.deepEqual(r.engines,index[r.id.split('/')[0]][r.id.split('/')[1]].generations[r.index].engines);
// Protect the source distinctions uncovered during this chunk.
const engines=(m,l,i)=>index[m][l].generations[i].engines;
assert.equal(engines('baic','bj30',1)[0].powerKwMin,209);assert.equal(engines('baic','bj30',1)[0].fuel,'petrol-hev');assert.equal(engines('baic','bj30',1)[0].displacementCc,null);
assert.equal(engines('lynk-co','08',0)[0].powerKwMin,257);assert.equal(engines('lamborghini','urus',0).find(e=>e.fuel==='petrol-phev').powerKwMin,588);
assert(!engines('caterham','seven',1).some(e=>/CSR/.test(e.variant)));assert.equal(engines('caterham','seven',1).find(e=>/170/.test(e.variant)).displacementLitresNominal,0.66);
assert(engines('caterham','seven',3).every(e=>/CSR/.test(e.variant)));assert(!engines('chevrolet','rezzo',0).some(e=>e.powerKwMin===108||e.variant.startsWith('1.8')));
assert.deepEqual(engines('lancia','zeta',0).filter(e=>e.variant==='2.0 16V').map(e=>e.powerKwMin),[100,97.4]);assert(!engines('audi','a6-e-tron',0).some(e=>/S6/.test(e.variant)||[240,280,340,370,405].includes(e.powerKwMin)));
assert.equal(engines('citroen','ami',0)[0].powerKwMin,6);assert.equal(engines('mercedes-benz','amg-one',0)[0].powerKwMin,782);assert.equal(engines('isuzu','gemini',1).find(e=>e.variant==='1.6 GTI').powerKwMin,99);
const result={result:'PASS',baselineFiles:Object.keys(base).length,sourceCards,newRows:79,generationsFilled:36,generationsReviewed:65,deferred:29,registeredUnreviewed:0,registeredWholePassFilled:63,registeredWholePassDeferred:72,registeredWholePassRows:134,zeroEuropeanReviewed:20,zeroEuropeanFilled:17,zeroEuropeanRows:45,zeroMarketReviewPending:1218,undatedHeld:679,totalPublicEngineRows:total,allNonEngineFactsUnchanged:true,allStatsDrawingsAliasesUnchanged:true};fs.writeFileSync(root+'/validation.json',JSON.stringify(result,null,2)+'\n');console.log(result);
