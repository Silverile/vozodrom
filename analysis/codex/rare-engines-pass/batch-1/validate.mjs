import fs from 'node:fs';import zlib from 'node:zlib';import assert from 'node:assert/strict';import{evidenceProblem,normalizeVariant,powerValues,rejectEngine}from '../../engine-throughput-policy.mjs';
const root='analysis/codex/rare-engines-pass/batch-1',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),base=JSON.parse(zlib.gunzipSync(fs.readFileSync(root+'/baseline.json.gz'))),changes=read(root+'/engine-changes.json'),selected=read(root+'/selection.json'),key=r=>(r.id??r.make+'/'+r.line)+'/'+r.index,affected=new Set(changes.changes.map(key)),targets=new Set(selected.map(key));
assert(changes.changes.every(r=>targets.has(key(r))));let sourceCards=0,checked=0;
function compareCard(a,b,id){
 if(![...affected].some(k=>k.startsWith(id+'/'))){assert.deepEqual(b,a,id);return;}
 const touched=a.generations.map((_,i)=>i).filter(i=>affected.has(id+'/'+i)),otherReview=r=>!touched.some(i=>r.field===`generations[${i}].engines`||r.field?.startsWith(`generations[${i}].engines[`));
 assert.deepEqual((b.needsReview??[]).filter(otherReview),(a.needsReview??[]).filter(otherReview),'Unrelated review notes changed '+id);
 assert((a.sources??[]).every(s=>b.sources.includes(s)),'Source removed '+id);
 const x=structuredClone(a),y=structuredClone(b);for(const p of['sources','needsReview']){delete x[p];delete y[p];}assert.equal(x.generations.length,y.generations.length);
 for(let i=0;i<x.generations.length;i++)if(affected.has(id+'/'+i)){
  const before=x.generations[i],after=y.generations[i];assert(!(before.engines?.length));
  assert.deepEqual(after.sources,[...new Set([...before.sources,...after.engines.flatMap(e=>e.sources)])],'Generation sources differ '+id+'/'+i);
  for(const e of after.engines){assert(e.variant.length<=40);assert.equal(normalizeVariant(e.variant),e.variant);assert.equal(e.sources.length,1);assert.equal(evidenceProblem(after,i,e),null,id+'/'+i+'/'+e.variant);assert.equal(rejectEngine(...id.split('/'),e),null);for(const v of powerValues(e))assert(Number.isFinite(v)&&v>0);if(e.fuel==='electric'){assert.equal(e.displacementCc,null);assert.equal(e.displacementLitresNominal,null);}checked++;}
  for(const f of['engines','engineCoverage','sources']){delete before[f];delete after[f];}
 }
 assert.deepEqual(y,x,'Other facts changed '+id);
}
for(const[p,a]of Object.entries(base)){const b=read(p);if(/^src\/data\/(?:catalog\/)?model-cards\//.test(p)){assert.equal(a.length,b.length);for(let i=0;i<a.length;i++){compareCard(a[i],b[i],a[i].makeSlug+'/'+a[i].lineSlug);sourceCards++;}}else if(p==='src/data/model-cards-index.json'){assert.deepEqual(Object.keys(b),Object.keys(a));for(const[m,lines]of Object.entries(a)){assert.deepEqual(Object.keys(b[m]),Object.keys(lines));for(const[l,c]of Object.entries(lines))compareCard(c,b[m][l],m+'/'+l);}}else assert.deepEqual(b,a,p+' must remain unchanged');}
assert.equal(sourceCards,4753);assert.equal(checked,200); // Every new row checked in source and generated index.
assert.equal(changes.rows,100);assert.equal(changes.generations,44);
const original=read('analysis/codex/rare-engines-pass/queue.json'),queue=read(root+'/remaining-queue.json'),index=read('src/data/model-cards-index.json');
assert.equal(original.registered.length,135);assert.equal(new Set(original.registered.map(r=>r.make+'/'+r.line)).size,90);assert.equal(original.skippedHistorical.length,2);
assert.deepEqual(selected,original.registered.slice(0,90));
assert.equal(queue.completed.length,44);assert.equal(queue.deferred.length,46);assert.equal(queue.nextRegistered1To99.length,45);assert.deepEqual(queue.nextRegistered1To99,read(root+'/untouched-queue.json'));
assert.deepEqual([...queue.completed,...queue.deferred,...queue.nextRegistered1To99].map(key).sort(),original.registered.map(key).sort());
for(const r of queue.completed){const g=index[r.make][r.line].generations[r.index];assert.equal(g.engines.length,r.engineRows);assert(affected.has(key(r)));}
for(const r of queue.deferred){assert.equal(index[r.make][r.line].generations[r.index].engines.length,0);assert(r.reason);assert(r.attemptedSources.length);}
assert.equal(original.zeroModernCandidates.length,1238);assert.equal(original.zeroDateUnconfirmed.length,679);assert.equal(original.counts.zeroMatchedFleetEuropeanMarketConfirmed,0);
for(const r of [...original.zeroModernCandidates,...original.zeroDateUnconfirmed,...original.skippedHistorical])assert(!affected.has(key(r)));
const total=Object.values(index).flatMap(Object.values).flatMap(c=>c.generations).reduce((n,g)=>n+g.engines.length,0);assert.equal(total,12239);
// Regressions where nearby source facts belong to a different badge, market, power basis or date.
const engines=(m,l,i)=>index[m][l].generations[i].engines;
assert.deepEqual(engines('mercedes-benz','trida-t',0).map(e=>e.powerKwMin),[70,85,75,96]);
assert.equal(engines('dongfeng','box',0).length,1);
assert.equal(engines('infiniti','ex',0).find(e=>e.variant.startsWith('EX37')).powerKwMin,235);
assert(!engines('infiniti','ex',0).some(e=>e.powerKwMin===239));
assert.equal(engines('opel','ampera',0)[0].fuel,'petrol-phev');assert.equal(engines('opel','ampera',0)[0].powerKwMin,111);
assert(!engines('honda','crx',1).some(e=>/EE6|1\.4/.test(e.variant)));
assert(![0,1,2].flatMap(i=>engines('mazda','rx-7',i)).some(e=>[2293,2616].includes(e.displacementCc)));
assert.deepEqual(engines('mazda','rx-7',0).map(e=>e.displacementLitresNominal),[null,null]);
assert.equal(engines('opel','gt',1)[0].powerKwMin,194);assert.equal(engines('aixam','a741',0)[0].displacementCc,400);
assert(engines('lancia','beta',0).every(e=>e.powerKwMin===null&&e.sourceScope.generationEvidence.method==='row-years'));
assert(engines('chrysler','300m',0).every(e=>e.sourceScope.generationEvidence.method==='row-years'));
const result={result:'PASS',baselineFiles:Object.keys(base).length,sourceCards,newRows:changes.rows,generationsFilled:44,generationsReviewed:90,deferred:46,nextUnreviewed:45,registeredQueueGenerations:135,registeredQueueLines:90,zeroMatchedFleetDatedCandidates:1238,zeroMatchedFleetDateUnconfirmed:679,zeroMatchedFleetEuropeanMarketAdmissions:0,engineEvidenceChecksIncludingIndex:checked,totalPublicEngineRows:total,allNonEngineFactsUnchanged:true,allStatsDrawingsAliasesUnchanged:true};fs.writeFileSync(root+'/validation.json',JSON.stringify(result,null,2)+'\n');console.log(result);
