import fs from 'node:fs';import zlib from 'node:zlib';import assert from 'node:assert/strict';import{evidenceProblem,normalizeVariant,powerValues,rejectEngine}from '../../engine-throughput-policy.mjs';
const root='analysis/codex/rare-engines-pass/batch-3',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),base=JSON.parse(zlib.gunzipSync(fs.readFileSync(root+'/baseline.json.gz'))),changes=read(root+'/engine-changes.json'),selected=read(root+'/selection.json'),key=r=>(r.id??r.make+'/'+r.line)+'/'+r.index,affected=new Set(changes.changes.map(key)),targets=new Set(selected.map(key));
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
assert.equal(sourceCards,4753);assert.equal(checked,200);assert.equal(changes.rows,100);assert.equal(changes.generations,63);assert.equal(targets.size,80);
const market=read('analysis/codex/rare-engines-pass/market-filter.json'),prior=read('analysis/codex/rare-engines-pass/zero-market-queue.json'),original=read('analysis/codex/rare-engines-pass/queue.json'),queue=read(root+'/remaining-queue.json'),index=read('src/data/model-cards-index.json');
assert.equal(market.pass.length,292);assert.equal(market.held.length,926);assert.equal(market.byMake.filter(r=>r.pass>0).length,75);
assert.deepEqual([...market.pass,...market.held].map(key).sort(),prior.pending.map(key).sort());assert.equal(new Set([...market.pass,...market.held].map(key)).size,1218);
assert.deepEqual(selected,market.pass.slice(0,80));assert.deepEqual(queue.nextEuropeanScreenPass,market.pass.slice(80));assert.deepEqual(read(root+'/untouched-queue.json'),market.pass.slice(80));
for(const a of [market.pass,market.held])for(let i=1;i<a.length;i++)assert(a[i-1].makeMatchedFleet>=a[i].makeMatchedFleet);
for(const r of market.byMake){const p=market.pass.filter(x=>x.make===r.make).length,h=market.held.filter(x=>x.make===r.make).length;assert.equal(r.pass,p);assert.equal(r.held,h);assert.equal(r.total,p+h);}
assert.equal(queue.completed.length,63);assert.equal(queue.deferred.length,17);assert.deepEqual([...queue.completed,...queue.deferred].map(key).sort(),selected.map(key).sort());
for(const r of queue.completed){assert.equal(index[r.make][r.line].generations[r.index].engines.length,r.engineRows);assert(affected.has(key(r)));}
for(const r of queue.deferred){assert.equal(index[r.make][r.line].generations[r.index].engines.length,0);assert(r.reason);}
for(const r of [...market.held,...queue.nextEuropeanScreenPass,...prior.confirmed,...original.registered,...original.zeroDateUnconfirmed,...original.skippedHistorical])assert(!affected.has(key(r)));
assert.equal(original.zeroDateUnconfirmed.length,679);
const total=Object.values(index).flatMap(Object.values).flatMap(c=>c.generations).reduce((n,g)=>n+g.engines.length,0);assert.equal(total,12418);
for(const r of changes.changes)assert.deepEqual(r.engines,index[r.id.split('/')[0]][r.id.split('/')[1]].generations[r.index].engines);
const engines=(m,l,i)=>index[m][l].generations[i].engines,powers=(m,l,i)=>engines(m,l,i).map(e=>e.powerKwMin).sort((a,b)=>a-b);
assert.deepEqual(powers('lexus','rx',3),[230]);assert.deepEqual(powers('lexus','rx',4),[230]);assert.deepEqual(powers('lexus','rx',5),[184,227,273]);
assert.deepEqual(powers('honda','nsx',1),[427]);assert.deepEqual(powers('lexus','es',7),[144,165,182,252]);
assert.equal(engines('mg','mg5',2).length,0);assert.deepEqual(index.mg.mg5.generations[2].bodyTypes,['sedan']);assert(engines('mg','gs',0).every(e=>e.powerKwMin===null));
assert.deepEqual(powers('ds-automobiles','ds-5',0),[88,110,121,133,155]);assert(engines('ds-automobiles','ds-5',0).every(e=>e.displacementCc!==1751));
for(const l of ['mc20','mcpura'])for(const i of [0,1])assert.deepEqual(powers('maserati',l,i),[463]);assert.deepEqual(powers('maserati','gt2-stradale',0),[471]);assert.deepEqual(powers('chevrolet','volt',0),[111]);
const result={result:'PASS',baselineFiles:Object.keys(base).length,sourceCards,...queue.counts,totalPublicEngineRows:total,allNonEngineFactsUnchanged:true,allStatsDrawingsAliasesUnchanged:true};fs.writeFileSync(root+'/validation.json',JSON.stringify(result,null,2)+'\n');console.log(result);
