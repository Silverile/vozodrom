import fs from 'node:fs';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {isDeepStrictEqual as equal} from 'node:util';
import {normalizeVariant,powerValues,evidenceProblem,rejectEngine,balancedBrackets} from './engine-throughput-policy.mjs';
import {compactEngineRows} from './short-engine-labels.mjs';
const root='analysis/codex/second-source-engines',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n'),hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const batchArg=process.argv.indexOf('--batch'),batchNumber=batchArg<0?1:Number(process.argv[batchArg+1]);assert(Number.isInteger(batchNumber)&&batchNumber>0);
const candidates=process.argv.includes('--apply')?read(root+`/staged/candidates-${batchNumber}.json`):(()=>{const b=read(root+`/batch-${batchNumber}.json`);return {baselineRevision:b.baselineRevision,complete:true,generations:b.results};})(),baseline=candidates.baselineRevision;
assert(candidates.complete&&candidates.generations.length>0&&candidates.generations.length<=100,'Research incomplete');
const old=p=>JSON.parse(cp.execFileSync('git',['show',`${baseline}:${p}`],{maxBuffer:80e6}));
const sources=new Map(),locations=new Map();
for(const d of ['src/data/catalog/model-cards','src/data/model-cards'])for(const f of fs.readdirSync(d).filter(f=>f.endsWith('.json'))){const p=d+'/'+f,data=read(p);sources.set(p,data);for(const card of data)locations.set(`${card.makeSlug}/${card.lineSlug}`,{p,card});}
function problem(g,i,e){
 return normalizeVariant(e.variant)!==e.variant?'Malformed variant':!balancedBrackets(e.variant)?'Unbalanced bracket':e.variant.length>75?'Annotated/long name':rejectEngine('', '',e)||evidenceProblem(g,i,e)||(!Number.isFinite(e.powerKwMin)||e.powerKwMin<5||e.powerKwMin>1500?'Invalid kW':null);
}
function covered(rows,e){return rows.some(r=>r.variant?.toLowerCase()===e.variant.toLowerCase()&&powerValues(r).includes(e.powerKwMin)||r.fuel===e.fuel&&powerValues(r).includes(e.powerKwMin)&&(e.fuel==='electric'||r.displacementCc&&r.displacementCc===e.displacementCc||r.displacementLitresNominal&&e.displacementLitresNominal&&Math.abs(r.displacementLitresNominal-e.displacementLitresNominal)<0.051));}
if(process.argv.includes('--apply')){
 if(process.argv.includes('--repair')){
  const previous=read(root+`/batch-${batchNumber}.json`),baselines=new Map();
  for(const r of previous.results.filter(r=>r.enginesAdded)){
   const {p,card}=locations.get(`${r.make}/${r.line}`),g=card.generations[r.index];assert.equal(hash(g),r.afterHash,'Concurrent generation edit; repair refused');
   if(!baselines.has(p))baselines.set(p,old(p));
   const before=baselines.get(p).find(c=>c.makeSlug===r.make&&c.lineSlug===r.line),oldg=before.generations[r.index];
   for(const f of ['engines','engineCoverage','sources'])if(Object.hasOwn(oldg,f))g[f]=structuredClone(oldg[f]);else delete g[f];
   card.sources=structuredClone(before.sources);
  }
 }
 const results=[],changed=new Set();
 for(const r of candidates.generations){
  const {p,card}=locations.get(`${r.make}/${r.line}`),g=card.generations[r.generationIndex],beforeHash=hash(g),added=[],excluded=[];
  assert(!(g.engines??[]).length,'Queued generation acquired engines concurrently');
  for(const original of r.engines){
   const e=compactEngineRows([original])[0];if(!e){excluded.push({variant:original.variant,reason:'Explicit non-European market/header row'});continue;}
   const why=rejectEngine(r.make,r.line,e)||problem(g,r.generationIndex,e)||(e.variant.length>40?'Name exceeds 40 characters':null)||(r.make==='mercedes-benz'&&/^[A-Z]{1,3}$/.test(e.variant)?'Class header instead of engine badge':null);
   if(why){excluded.push({variant:e.variant,reason:why});continue;}
   if(covered(g.engines??[],e))continue;
   g.engines=[...(g.engines??[]),e];added.push(e);
  }
  if(added.length){g.engineCoverage='representative-documented-versions';g.sources=[...new Set([...(g.sources??[]),...added.flatMap(e=>e.sources)])];card.sources=[...new Set([...(card.sources??[]),...added.flatMap(e=>e.sources)])];changed.add(p);}
  results.push({make:r.make,line:r.line,index:r.generationIndex,name:g.name,code:g.code,from:g.from,to:g.to,sourceFile:p,beforeHash,afterHash:hash(g),enginesAdded:added.length,status:added.length?'engines-added':'no-source',reason:added.length?null:r.reason??'All candidate rows rejected by source/naming checks.',excluded,sources:r.attempts});
 }
 const summary={generationsVisited:results.length,generationsFilled:results.filter(r=>r.enginesAdded).length,enginesAdded:results.reduce((n,r)=>n+r.enginesAdded,0),linesTouched:new Set(results.filter(r=>r.enginesAdded).map(r=>r.make+'/'+r.line)).size,generationsAdded:0,generationsRemoved:0,faceliftsAdded:0,statsRebuildRequired:false};
 for(const p of changed)write(p,sources.get(p));write(root+`/batch-${batchNumber}.json`,{baselineRevision:baseline,summary,results});
 cp.execFileSync('node',['scripts/model-cards-index.mjs'],{stdio:'inherit'});
 console.log(JSON.stringify(summary));
}else{
 const batch=read(root+`/batch-${batchNumber}.json`),touched=new Set(batch.results.filter(r=>r.enginesAdded).map(r=>`${r.make}/${r.line}`)),byGen=new Map(batch.results.map(r=>[`${r.make}/${r.line}/${r.index}`,r]));
 let unchanged=0,unchangedGenerations=0,total=0;
 for(const [p,after]of sources){
  const before=old(p);assert.equal(before.length,after.length);
  for(let j=0;j<before.length;j++){
   const a=after[j],b=before[j],id=`${b.makeSlug}/${b.lineSlug}`;assert.equal(`${a.makeSlug}/${a.lineSlug}`,id);
   if(!touched.has(id)){assert(equal(a,b),`Untouched card changed: ${id}`);unchanged++;continue;}
   assert.equal(a.generations.length,b.generations.length);const restored=structuredClone(a);restored.sources=b.sources;
   for(let i=0;i<b.generations.length;i++){
    const report=byGen.get(`${id}/${i}`),g=a.generations[i],oldg=b.generations[i];
    if(!report?.enginesAdded){assert(equal(g,oldg),`Untouched generation changed: ${id}/${i}`);unchangedGenerations++;continue;}
    assert.equal(hash(oldg),report.beforeHash);assert.equal(hash(g),report.afterHash);assert.equal(g.engines.length,report.enginesAdded);assert(!(oldg.engines??[]).length);
    const keys=new Set();for(const e of g.engines){assert.equal(problem(g,i,e),null,`${id}/${i}/${e.variant}`);assert.equal(rejectEngine(b.makeSlug,b.lineSlug,e),null);if(b.makeSlug==='mercedes-benz')assert(!/^[A-Z]{1,3}$/.test(e.variant),'Class header instead of engine badge');assert.deepEqual(e.availablePowerKw,[e.powerKwMin]);assert.equal(e.powerKwMax,e.powerKwMin);assert.equal(e.powerRangeCoverage,'documented-versions-only');assert.equal(e.sources.length,1);assert(/^https:\/\/(?:en|de|cs)\.wikipedia\.org\//.test(e.sources[0]));assert(e.fuel==='electric'||e.displacementCc>0||e.displacementLitresNominal>0);const k=e.variant.toLowerCase()+'|'+e.powerKwMin;assert(!keys.has(k));keys.add(k);total++;}
    for(const f of ['engines','engineCoverage','sources'])if(Object.hasOwn(oldg,f))restored.generations[i][f]=oldg[f];else delete restored.generations[i][f];
   }
   assert(equal(restored,b),`Non-engine card facts changed: ${id}`);
  }
 }
 const beforeIndex=old('src/data/model-cards-index.json'),afterIndex=read('src/data/model-cards-index.json');let untouchedPublic=0;
 assert.deepEqual(Object.keys(afterIndex).sort(),Object.keys(beforeIndex).sort());
 for(const [make,lines]of Object.entries(beforeIndex)){
  assert.deepEqual(Object.keys(afterIndex[make]).sort(),Object.keys(lines).sort());
  for(const [line,b]of Object.entries(lines)){
   const a=afterIndex[make][line],id=make+'/'+line;if(!touched.has(id)){assert(equal(a,b),`Untouched public card changed: ${id}`);untouchedPublic++;continue;}
   const restored=structuredClone(a);restored.sources=b.sources;
   for(let i=0;i<b.generations.length;i++){const r=byGen.get(`${id}/${i}`);if(r?.enginesAdded){restored.generations[i].engines=b.generations[i].engines;restored.generations[i].sources=b.generations[i].sources;}}
   assert(equal(restored,b),`Non-engine generated fields changed: ${id}`);
  }
 }
 const protectedDiff=cp.execFileSync('git',['diff','--name-only',baseline,'--','public/front','src/data/front-drawings.json','src/data/front-drawing-review.json','src/data/stats','src/data/listing-stats.json','src/data/model-lines-index.json'],{encoding:'utf8'}).trim();assert.equal(protectedDiff,'','Coupled assets/statistics changed');
 assert.equal(total,batch.summary.enginesAdded);
 const result={result:'PASS',baseline,untouchedSourceCards:unchanged,untouchedGenerationsOnTouchedCards:unchangedGenerations,untouchedPublicCards:untouchedPublic,enginesValidated:total,onlyEngineFactsChanged:true,coupledAssetsAndStatisticsUnchanged:true};write(root+`/validation-${batchNumber}.json`,result);console.log(JSON.stringify(result));
}
