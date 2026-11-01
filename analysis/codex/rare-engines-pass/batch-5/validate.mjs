import fs from 'node:fs';import zlib from 'node:zlib';import assert from 'node:assert/strict';import{evidenceProblem,normalizeVariant,powerValues,rejectEngine}from '../../engine-throughput-policy.mjs';
const root='analysis/codex/rare-engines-pass/batch-5',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),base=JSON.parse(zlib.gunzipSync(fs.readFileSync(root+'/baseline.json.gz'))),changes=read(root+'/engine-changes.json'),selected=read(root+'/selection.json'),key=r=>(r.id??r.make+'/'+r.line)+'/'+r.index,affected=new Set(changes.changes.map(key)),targets=new Set(selected.map(key));
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
assert.equal(sourceCards,4753);assert.equal(checked,180);assert.equal(changes.rows,90);assert.equal(changes.generations,57);assert.equal(targets.size,80);
const prior=read('analysis/codex/rare-engines-pass/batch-4/remaining-queue.json'),queue=read(root+'/remaining-queue.json'),market=read('analysis/codex/rare-engines-pass/market-filter.json'),original=read('analysis/codex/rare-engines-pass/queue.json'),index=read('src/data/model-cards-index.json');
assert.deepEqual(selected,prior.nextEuropeanScreenPass.slice(0,80));assert.deepEqual(selected,market.pass.slice(160,240));assert.deepEqual(queue.nextEuropeanScreenPass,prior.nextEuropeanScreenPass.slice(80));assert.deepEqual(queue.nextEuropeanScreenPass,read(root+'/untouched-queue.json'));assert.equal(queue.nextEuropeanScreenPass.length,52);
assert.equal(queue.completed.length,57);assert.equal(queue.deferred.length,23);assert.deepEqual([...queue.completed,...queue.deferred].map(key).sort(),selected.map(key).sort());
assert.deepEqual([...queue.allScreenPassCompleted,...queue.allScreenPassDeferred,...queue.nextEuropeanScreenPass].map(key).sort(),market.pass.map(key).sort());assert.equal(new Set([...queue.allScreenPassCompleted,...queue.allScreenPassDeferred,...queue.nextEuropeanScreenPass].map(key)).size,292);
assert.equal(queue.allScreenPassCompleted.length,193);assert.equal(queue.allScreenPassDeferred.length,47);
for(const r of queue.completed){assert.equal(index[r.make][r.line].generations[r.index].engines.length,r.engineRows);assert(affected.has(key(r)));}
for(const r of queue.deferred){assert.equal(index[r.make][r.line].generations[r.index].engines.length,0);assert(r.reason);}
for(const r of [...market.held,...queue.nextEuropeanScreenPass,...prior.allScreenPassCompleted,...prior.allScreenPassDeferred,...original.registered,...original.zeroDateUnconfirmed,...original.skippedHistorical])assert(!affected.has(key(r)));
for(let i=1;i<selected.length;i++)assert(selected[i-1].makeMatchedFleet>=selected[i].makeMatchedFleet);
assert.equal(original.zeroDateUnconfirmed.length,679);assert.equal(queue.counts.zeroWholePassFilled+queue.counts.zeroWholePassDeferred+queue.nextEuropeanScreenPass.length+market.held.length,1238);
const total=Object.values(index).flatMap(Object.values).flatMap(c=>c.generations).reduce((n,g)=>n+g.engines.length,0);assert.equal(total,12627);
for(const r of changes.changes)assert.deepEqual(r.engines,index[r.id.split('/')[0]][r.id.split('/')[1]].generations[r.index].engines);
const engines=(m,l,i)=>index[m][l].generations[i].engines,powers=(m,l,i)=>engines(m,l,i).map(e=>e.powerKwMin).sort((a,b)=>a-b),capacities=(m,l,i)=>engines(m,l,i).map(e=>e.displacementCc).sort((a,b)=>a-b);
assert.deepEqual(powers('alpina','b8',1),[457]);assert.deepEqual(powers('alpina','b7',1),[373,397]);assert.deepEqual(powers('alpina','b7',2),[447]);
for(const[l,i]of[['d3',2],['d4',1]]){assert.deepEqual(powers('alpina',l,i),[261]);assert.equal(engines('alpina',l,i)[0].fuel,'diesel-mhev');}
assert.deepEqual(powers('lotus','3-eleven',0),[306,321]);assert.deepEqual(powers('lotus','esprit',4),[260]);assert.deepEqual(powers('lotus','evora',0),[206,258]);assert.deepEqual(powers('lotus','evora',1),[298,306,321]);
assert.deepEqual(powers('maxus','mifa-9',0),[180]);assert.deepEqual(powers('maxus','eterron-9-terron-9',0),[325]);assert.deepEqual(powers('voyah','courage-zhiyin',0),[215]);
assert.equal(engines('polestar','1',0)[0].powerKwMin,null);assert.equal(engines('polestar','1',0)[0].displacementLitresNominal,2);
assert.deepEqual(powers('automobili-pininfarina','battista',0),[1400]);assert.deepEqual(powers('brabus','g-class',0),[449,625]);assert.deepEqual(powers('brabus','g-class',1),[588,662]);
assert.equal(engines('morgan','super-3',0)[0].displacementLitresNominal,1.5);assert.equal(engines('morgan','super-3',0)[0].displacementCc,1432);assert.deepEqual(powers('morgan','4-4',0),[92]);
assert.deepEqual(powers('mahindra','kuv100',0),[61,64]);assert.deepEqual(capacities('mahindra','kuv100',0),[1198,1198]);assert.deepEqual(powers('mahindra','xuv500',0),[103]);
assert.deepEqual(powers('abarth','124-spider',0),[125]);assert.deepEqual(powers('abarth','grande-punto',0),[114]);assert.deepEqual(powers('abarth','punto-evo',0),[121]);assert.deepEqual(powers('alpina','roadster-limited-edition',0),[147]);
const result={result:'PASS',baselineFiles:Object.keys(base).length,sourceCards,...queue.counts,totalPublicEngineRows:total,allNonEngineFactsUnchanged:true,allStatsDrawingsAliasesUnchanged:true};fs.writeFileSync(root+'/validation.json',JSON.stringify(result,null,2)+'\n');console.log(result);
