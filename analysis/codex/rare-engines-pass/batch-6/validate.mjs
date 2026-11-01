import fs from 'node:fs';import zlib from 'node:zlib';import assert from 'node:assert/strict';import{evidenceProblem,normalizeVariant,powerValues,rejectEngine}from '../../engine-throughput-policy.mjs';
const root='analysis/codex/rare-engines-pass/batch-6',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),base=JSON.parse(zlib.gunzipSync(fs.readFileSync(root+'/baseline.json.gz'))),changes=read(root+'/engine-changes.json'),selected=read(root+'/selection.json'),key=r=>(r.id??r.make+'/'+r.line)+'/'+r.index,affected=new Set(changes.changes.map(key)),targets=new Set(selected.map(key));
assert(changes.changes.every(r=>targets.has(key(r))));let sourceCards=0,checked=0;
function compareCard(a,b,id){
 if(id==='brabus/g-class'){
  const expected=structuredClone(a),[trim]=expected.generations[0].trims.splice(2,1);assert.equal(trim.name,'G V12 900 One of Ten');expected.generations[1].trims.push(trim);
  for(const r of expected.needsReview??[])if(r.field==='generations[0].trims[2]'||r.field?.startsWith('generations[0].trims[2].'))r.field=r.field.replace('generations[0].trims[2]','generations[1].trims[1]');
  for(const source of trim.sources??[])if(!expected.generations[1].sources.includes(source))expected.generations[1].sources.push(source);
  assert.deepEqual(b,expected,'Only exact Brabus trim relocation is allowed');return;
 }

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
assert.equal(sourceCards,4753);assert.equal(checked,118);assert.equal(changes.rows,59);assert.equal(changes.generations,46);assert.equal(targets.size,52);
const prior=read('analysis/codex/rare-engines-pass/batch-5/remaining-queue.json'),queue=read(root+'/remaining-queue.json'),market=read('analysis/codex/rare-engines-pass/market-filter.json'),original=read('analysis/codex/rare-engines-pass/queue.json'),index=read('src/data/model-cards-index.json');
assert.deepEqual(selected,prior.nextEuropeanScreenPass);assert.deepEqual(selected,market.pass.slice(240));assert.deepEqual(queue.nextEuropeanScreenPass,[]);assert.deepEqual(queue.nextEuropeanScreenPass,read(root+'/untouched-queue.json'));
assert.equal(queue.completed.length,46);assert.equal(queue.deferred.length,6);assert.deepEqual([...queue.completed,...queue.deferred].map(key).sort(),selected.map(key).sort());
assert.deepEqual([...queue.allScreenPassCompleted,...queue.allScreenPassDeferred].map(key).sort(),market.pass.map(key).sort());assert.equal(new Set([...queue.allScreenPassCompleted,...queue.allScreenPassDeferred].map(key)).size,292);
assert.equal(queue.allScreenPassCompleted.length,239);assert.equal(queue.allScreenPassDeferred.length,53);
for(const r of queue.completed){assert.equal(index[r.make][r.line].generations[r.index].engines.length,r.engineRows);assert(affected.has(key(r)));}
for(const r of queue.deferred){assert.equal(index[r.make][r.line].generations[r.index].engines.length,0);assert(r.reason);}
for(const r of [...market.held,...prior.allScreenPassCompleted,...prior.allScreenPassDeferred,...original.registered,...original.zeroDateUnconfirmed,...original.skippedHistorical])assert(!affected.has(key(r)));
for(let i=1;i<selected.length;i++)assert(selected[i-1].makeMatchedFleet>=selected[i].makeMatchedFleet);
assert.equal(original.zeroDateUnconfirmed.length,679);assert.equal(queue.counts.zeroWholePassFilled+queue.counts.zeroWholePassDeferred+market.held.length,1238);
const deferred=read('analysis/codex/rare-engines-pass/deferred.json');assert.equal(deferred.registered1To99.length,72);assert.equal(deferred.zeroMatchedFleet.length,56);assert.equal(deferred.counts.total,128);assert.equal(new Set([...deferred.registered1To99,...deferred.zeroMatchedFleet].map(key)).size,128);assert([...deferred.registered1To99,...deferred.zeroMatchedFleet].every(r=>r.reason));
const total=Object.values(index).flatMap(Object.values).flatMap(c=>c.generations).reduce((n,g)=>n+g.engines.length,0);assert.equal(total,12686);
for(const r of changes.changes)assert.deepEqual(r.engines,index[r.id.split('/')[0]][r.id.split('/')[1]].generations[r.index].engines);
const engines=(m,l,i)=>index[m][l].generations[i].engines,powers=(m,l,i)=>engines(m,l,i).map(e=>e.powerKwMin).sort((a,b)=>a-b);
assert.deepEqual(powers('nio','es8',0),[400]);assert.deepEqual(powers('nio','es8',1),[480]);assert.deepEqual(powers('nio','et5-touring',0),[360]);
assert.deepEqual(powers('bugatti-automobiles','eb110',0),[411,450]);assert.deepEqual(powers('bugatti-automobiles','centodieci',0),[1177]);assert.deepEqual(powers('bugatti-automobiles','veyron',0),[736]);
assert.deepEqual(powers('koenigsegg','agera',1),[null]);assert.deepEqual(powers('koenigsegg','agera',2),[null]);assert.deepEqual(powers('koenigsegg','agera',3),[865]);
assert.equal(engines('koenigsegg','gemera',0)[0].displacementLitresNominal,5);assert.equal(engines('koenigsegg','gemera',0)[0].fuel,'petrol-phev');assert.deepEqual(powers('koenigsegg','gemera',0),[null]);assert.deepEqual(powers('koenigsegg','regera',0),[null]);
assert.deepEqual(powers('fisker-automotive','karma',0),[300]);assert.equal(engines('fisker-automotive','karma',0)[0].displacementCc,1998);assert.equal(engines('fisker-automotive','karma',0)[0].sourceScope.powerBasis,'system');
assert.deepEqual(powers('maybach','landaulet',0),[463]);assert.equal(engines('maybach','landaulet',0)[0].displacementCc,5980);
assert.equal(engines('bristol-cars','fighter',0)[0].displacementCc,7996);assert.deepEqual(powers('bristol-cars','fighter',0),[null]);assert.equal(engines('ginetta','f400',0)[0].displacementLitresNominal,3);assert.equal(engines('ginetta','g60',0)[0].displacementLitresNominal,3.7);
assert.deepEqual(powers('pagani','huayra',0),[544]);assert.deepEqual(powers('pagani','huayra',1),[561]);assert.deepEqual(powers('pagani','utopia',0),[635]);
for(const l of ['126p','cinquecento'])for(const g of index.fsm[l].generations)if(affected.has('fsm/'+l+'/'+index.fsm[l].generations.indexOf(g)))assert(g.engines.every(e=>e.displacementLitresNominal===null));
const brabus=index.brabus['g-class'];assert.equal(brabus.generations[0].trims.length,2);assert.equal(brabus.generations[1].trims.length,2);assert(brabus.generations[0].trims.every(t=>!t.name.includes('900')));assert.equal(brabus.generations[1].trims[1].name,'G V12 900 One of Ten');assert.equal(brabus.generations[1].trims[1].engine.powerKw,662);
const batches=[1,2,3,4,5,6].map(n=>read('analysis/codex/rare-engines-pass/batch-'+n+'/engine-changes.json'));assert.equal(batches.reduce((n,b)=>n+b.rows,0),547);assert.equal(batches.reduce((n,b)=>n+b.generations,0),319);assert.equal(total-547,12139);
const result={result:'PASS',baselineFiles:Object.keys(base).length,sourceCards,...queue.counts,totalPublicEngineRows:total,allNonEngineFactsUnchangedExceptBrabusTrimMove:true,brabusTrimFactsUnchanged:true,allStatsDrawingsAliasesUnchanged:true,consolidatedDeferred:128};fs.writeFileSync(root+'/validation.json',JSON.stringify(result,null,2)+'\n');console.log(result);
