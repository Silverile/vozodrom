import fs from 'node:fs';import zlib from 'node:zlib';import assert from 'node:assert/strict';import{evidenceProblem,normalizeVariant,powerValues,rejectEngine}from '../../engine-throughput-policy.mjs';
const root='analysis/codex/rare-engines-pass/batch-4',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),base=JSON.parse(zlib.gunzipSync(fs.readFileSync(root+'/baseline.json.gz'))),changes=read(root+'/engine-changes.json'),selected=read(root+'/selection.json'),key=r=>(r.id??r.make+'/'+r.line)+'/'+r.index,affected=new Set(changes.changes.map(key)),targets=new Set(selected.map(key));
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
assert.equal(sourceCards,4753);assert.equal(checked,238);assert.equal(changes.rows,119);assert.equal(changes.generations,73);assert.equal(targets.size,80);
const prior=read('analysis/codex/rare-engines-pass/batch-3/remaining-queue.json'),queue=read(root+'/remaining-queue.json'),market=read('analysis/codex/rare-engines-pass/market-filter.json'),original=read('analysis/codex/rare-engines-pass/queue.json'),index=read('src/data/model-cards-index.json');
assert.deepEqual(selected,prior.nextEuropeanScreenPass.slice(0,80));assert.deepEqual(selected,market.pass.slice(80,160));assert.deepEqual(queue.nextEuropeanScreenPass,prior.nextEuropeanScreenPass.slice(80));assert.deepEqual(queue.nextEuropeanScreenPass,read(root+'/untouched-queue.json'));assert.equal(queue.nextEuropeanScreenPass.length,132);
assert.equal(queue.completed.length,73);assert.equal(queue.deferred.length,7);assert.deepEqual([...queue.completed,...queue.deferred].map(key).sort(),selected.map(key).sort());
assert.deepEqual([...queue.allScreenPassCompleted,...queue.allScreenPassDeferred,...queue.nextEuropeanScreenPass].map(key).sort(),market.pass.map(key).sort());assert.equal(new Set([...queue.allScreenPassCompleted,...queue.allScreenPassDeferred,...queue.nextEuropeanScreenPass].map(key)).size,292);
assert.equal(queue.allScreenPassCompleted.length,136);assert.equal(queue.allScreenPassDeferred.length,24);
for(const r of queue.completed){assert.equal(index[r.make][r.line].generations[r.index].engines.length,r.engineRows);assert(affected.has(key(r)));}
for(const r of queue.deferred){assert.equal(index[r.make][r.line].generations[r.index].engines.length,0);assert(r.reason);}
for(const r of [...market.held,...queue.nextEuropeanScreenPass,...prior.completed,...prior.deferred,...original.registered,...original.zeroDateUnconfirmed,...original.skippedHistorical])assert(!affected.has(key(r)));
for(let i=1;i<selected.length;i++)assert(selected[i-1].makeMatchedFleet>=selected[i].makeMatchedFleet);
assert.equal(original.zeroDateUnconfirmed.length,679);assert.equal(queue.counts.zeroWholePassFilled+queue.counts.zeroWholePassDeferred+queue.nextEuropeanScreenPass.length+market.held.length,1238);
const total=Object.values(index).flatMap(Object.values).flatMap(c=>c.generations).reduce((n,g)=>n+g.engines.length,0);assert.equal(total,12537);
for(const r of changes.changes)assert.deepEqual(r.engines,index[r.id.split('/')[0]][r.id.split('/')[1]].generations[r.index].engines);
const engines=(m,l,i)=>index[m][l].generations[i].engines,powers=(m,l,i)=>engines(m,l,i).map(e=>e.powerKwMin).sort((a,b)=>a-b),capacities=(m,l,i)=>engines(m,l,i).map(e=>e.displacementCc).sort((a,b)=>a-b);
assert.deepEqual(powers('bentley','brooklands',1),[395]);assert.equal(engines('bentley','brooklands',1)[0].displacementCc,6761);
assert.deepEqual(powers('infiniti','q60',0),[235]);assert.deepEqual(powers('infiniti','q60',1),[155,298]);assert.deepEqual(capacities('infiniti','q60',1),[1991,2997]);
assert.deepEqual(powers('lamborghini','temerario',0),[677]);assert.deepEqual(powers('lamborghini','revuelto',0),[747]);assert.deepEqual(powers('lamborghini','countach',1),[599]);assert.deepEqual(powers('lamborghini','sian',0),[602]);
assert.equal(engines('lamborghini','countach',1)[0].fuel,'petrol-mhev');assert.equal(engines('lamborghini','sian',0)[0].fuel,'petrol-mhev');assert.equal(engines('lamborghini','temerario',0)[0].fuel,'petrol-phev');
for(const l of ['temerario','revuelto','sian'])assert.equal(engines('lamborghini',l,0)[0].sourceScope.powerBasis,'system');assert.equal(engines('lamborghini','countach',1)[0].sourceScope.powerBasis,'system');
assert.deepEqual(capacities('ligier','js-rc',0),[480,505]);assert.deepEqual(capacities('ligier','ixo',0),[null,480]);assert(engines('ligier','ixo',0).every(e=>e.displacementCc!==492));assert.deepEqual(powers('ligier','x-too',0),[4]);assert.equal(engines('ligier','x-too',0)[0].displacementCc,505);
assert.equal(engines('microcar','mc1',0)[0].powerKwMin,null);assert.equal(engines('microcar','mc1',0)[0].displacementCc,505);
assert.deepEqual(powers('alpina','b4',1),[364]);assert.equal(engines('alpina','b4',1)[0].displacementCc,2993);assert.deepEqual(powers('alpina','b7',0),[368]);
assert(engines('alpina','b10',2).some(e=>e.variant==='3.5/1'&&e.displacementLitresNominal===3.5));assert(engines('alpina','b6',2).every(e=>e.variant==='2.8'&&e.powerKwMin===177));
assert.equal(engines('daimler-company','double-six',0).some(e=>e.displacementLitresNominal===6),false);assert(engines('daimler-company','double-six',1).every(e=>e.displacementLitresNominal===6));
assert.equal(engines('microcar','zenn',0).length,0);assert(engines('aston-martin','cygnet',0).every(e=>e.displacementLitresNominal===1.33));assert.deepEqual(powers('aston-martin','vanquish',0),[388]);
const result={result:'PASS',baselineFiles:Object.keys(base).length,sourceCards,...queue.counts,totalPublicEngineRows:total,allNonEngineFactsUnchanged:true,allStatsDrawingsAliasesUnchanged:true};fs.writeFileSync(root+'/validation.json',JSON.stringify(result,null,2)+'\n');console.log(result);
