import fs from 'node:fs';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {isDeepStrictEqual as equal} from 'node:util';
import {evidenceProblem,powerValues,balancedBrackets,normalizeVariant} from './engine-throughput-policy.mjs';
import {loadEngineBatchSet} from './engine-batch-set.mjs';
const root='analysis/codex/second-source-engines',number=Number(process.argv.find(x=>x.startsWith('--batch='))?.slice(8)??6),read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const selected=loadEngineBatchSet(root),batch=selected.batch,baseline=batch.baselineRevision,old=p=>JSON.parse(cp.execFileSync('git',['show',baseline+':'+p],{maxBuffer:80e6}));
const migration=selected.numbers.length===1&&selected.number===6?read(root+'/wave-2-structure/migration.json'):{changes:[]},fixes=new Map(migration.changes.map(f=>[f.make+'/'+f.line,f])),results=new Map(batch.results.map(r=>[`${r.make}/${r.line}/${r.index}`,r])),evidence=selected.evidence;
const touched=new Set([...batch.results.filter(r=>r.enginesAdded).map(r=>r.make+'/'+r.line),...fixes.keys()]);
let untouched=0,engineCount=0;
for(const directory of ['src/data/catalog/model-cards','src/data/model-cards'])for(const file of fs.readdirSync(directory).filter(f=>f.endsWith('.json'))){
 const path=directory+'/'+file,before=old(path),after=read(path);assert.equal(after.length,before.length);
 for(let j=0;j<before.length;j++){
  const b=before[j],a=after[j],id=b.makeSlug+'/'+b.lineSlug;assert.equal(a.makeSlug+'/'+a.lineSlug,id);assert.equal(a.generations.length,b.generations.length);
  if(!touched.has(id)){assert(equal(a,b),`Untouched source card ${id}`);untouched++;continue;}
  const engineView=structuredClone(a),fix=fixes.get(id);
  if(fix){const g=engineView.generations[fix.index];assert.equal(g.from,fix.from);assert.equal(g.to,fix.to);assert.equal(g.dateNote,fix.note);assert.equal(g.productionStatus,'ended');assert(g.sources.includes(fix.source));
   for(const [k,v]of Object.entries(fix.sourceBefore))if(v.exists)g[k]=structuredClone(v.value);else delete g[k];engineView.sources=structuredClone(fix.cardSourcesBefore);
  }
  const restored=structuredClone(engineView);restored.sources=b.sources;
  for(let i=0;i<b.generations.length;i++){
   const r=results.get(`${id}/${i}`),g=engineView.generations[i],og=b.generations[i];
   if(!r?.enginesAdded){assert(equal(g,og),`Non-engine generation changed ${id}/${i}`);continue;}
   assert.equal(hash(g),r.afterHash);assert.equal(hash(og),r.beforeHash);assert.equal(g.engines.length,r.enginesAdded);
   const keys=new Set();for(const e of g.engines){const proof=evidence.filter(p=>p.make+'/'+p.line+'/'+p.index===id+'/'+i&&p.publicEngineHash===hash(e));assert.equal(proof.length,1);assert.equal(evidenceProblem(a.generations[i],i,{...e,sourceScope:proof[0].sourceScope}),null,`${id}/${i}/${e.variant}`);assert.equal(normalizeVariant(e.variant),e.variant);assert(e.variant.length<=40&&balancedBrackets(e.variant));assert.deepEqual(powerValues(e),[e.powerKwMin]);assert.equal(e.powerKwMin,e.powerKwMax);assert.equal(e.powerRangeCoverage,'documented-versions-only');assert.equal(e.sources.length,1);const key=e.variant.toLowerCase()+'|'+e.powerKwMin;assert(!keys.has(key));keys.add(key);engineCount++;}
   for(const key of ['engines','engineCoverage','sources'])if(Object.hasOwn(og,key))restored.generations[i][key]=structuredClone(og[key]);else delete restored.generations[i][key];
  }
  assert(equal(restored,b),`Non-authorized card change ${id}`);
 }
}
assert.equal(engineCount,batch.summary.enginesAdded);assert.equal(evidence.length,engineCount);
const cards=read('src/data/model-cards-index.json'),oldCards=old('src/data/model-cards-index.json');let publicUnchanged=0;
assert.deepEqual(Object.keys(cards),Object.keys(oldCards));
for(const [make,lines]of Object.entries(oldCards)){assert.deepEqual(Object.keys(cards[make]),Object.keys(lines));for(const [line,b]of Object.entries(lines)){
 const id=make+'/'+line,a=cards[make][line];if(!touched.has(id)){assert(equal(a,b),`Untouched generated card ${id}`);publicUnchanged++;continue;}
 const restored=structuredClone(a);restored.sources=b.sources;assert.equal(a.generations.length,b.generations.length);
 for(let i=0;i<b.generations.length;i++){const g=restored.generations[i],og=b.generations[i],r=results.get(`${id}/${i}`),f=fixes.get(id);if(r?.enginesAdded)for(const key of ['engines','sources'])if(Object.hasOwn(og,key))g[key]=structuredClone(og[key]);else delete g[key];if(f&&f.index===i)for(const key of ['from','to','current','dateNote'])if(Object.hasOwn(og,key))g[key]=structuredClone(og[key]);else delete g[key];}
 assert(equal(restored,b),`Unexpected generated fields ${id}`);
}}
const autoPath='src/data/catalog/model-lines-auto.json',auto=read(autoPath),beforeAuto=old(autoPath);assert.equal(auto.length,beforeAuto.length);for(let i=0;i<auto.length;i++){const line=auto[i],fix=fixes.get(line.makeSlug+'/'+line.slug);if(!fix){assert(equal(line,beforeAuto[i]));continue;}const expected=structuredClone(fix.lineBefore);expected.from=fix.from;expected.to=fix.to;expected.productionStatus='ended';expected.productionPeriods=[{from:fix.from,to:fix.to}];expected.sources=[...new Set([...expected.sources,fix.source])];Object.assign(expected.generations[0],{from:fix.from,to:fix.to,productionStatus:'ended',sources:[...new Set([...expected.generations[0].sources,fix.source])]});assert(equal(line,expected));assert.equal(fix.listingIdBefore,fix.listingIdAfter);}
const selectors=read('src/data/model-lines-index.json'),oldSelectors=old('src/data/model-lines-index.json');assert.deepEqual(Object.keys(selectors),Object.keys(oldSelectors));
for(const [make,lines]of Object.entries(oldSelectors)){assert.equal(selectors[make].length,lines.length);for(let i=0;i<lines.length;i++){const a=structuredClone(selectors[make][i]),b=lines[i],fix=fixes.get(make+'/'+b.slug);assert.equal(a.slug,b.slug);if(fix){for(const k of ['from','to','productionStatus','productionPeriods'])if(Object.hasOwn(b,k))a[k]=b[k];else delete a[k];assert.equal(a.generations.length,b.generations.length);for(let j=0;j<b.generations.length;j++)for(const k of ['from','to','productionStatus'])if(Object.hasOwn(b.generations[j],k))a.generations[j][k]=b.generations[j][k];else delete a.generations[j][k];}assert(equal(a,b),`Unexpected selector change ${make}/${b.slug}`);}}
const drawingPath='src/data/front-drawings.json',drawings=read(drawingPath),beforeDrawings=old(drawingPath),expectedDrawings=structuredClone(beforeDrawings);for(const f of fixes.values())for(const entry of expectedDrawings[f.make+'--'+f.line]??[])if(entry[0]===f.index){entry[1]=f.from;entry[2]=f.to;}assert.deepEqual(drawings,expectedDrawings);
let drawingCount=0;for(const [key,entries]of Object.entries(drawings)){const [make,line]=key.split('--');for(const [i]of entries){assert(cards[make]?.[line]?.generations[i]);assert(fs.existsSync(`public/front/${key}--${i}.webp`));drawingCount++;}}
assert.equal(cp.execFileSync('git',['diff','--name-only',baseline,'--','public/front','src/data/front-drawing-review.json','src/data/catalog/model-line-additions.json'],{encoding:'utf8'}).trim(),'');
for(const f of fs.readdirSync('src/data/stats').filter(f=>f.endsWith('.json')&&f!=='index.json')){const make=f.slice(0,-5);for(const [line,data]of Object.entries(read('src/data/stats/'+f)))for(const i of Object.keys(data.gens??{}))assert(cards[make]?.[line]?.generations[+i]??selectors[make]?.find(l=>l.slug===line)?.generations?.[+i],`Stats generation ${make}/${line}/${i}`);}
if(fixes.size){assert.equal(migration.statisticsStatus,'complete');const stats=read(root+'/wave-2-structure/statistics.json');for(const [p,sha]of Object.entries(stats.outputSha256))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),sha);const statChanged=cp.execFileSync('git',['diff','--name-only',baseline,'--','src/data/stats'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);assert(statChanged.every(p=>['src/data/stats/alfa-romeo.json','src/data/stats/index.json'].includes(p)));}
else assert.equal(cp.execFileSync('git',['diff','--name-only',baseline,'--','src/data/stats','src/data/listing-stats.json'],{encoding:'utf8'}).trim(),'','Engine-only batch changed statistics');
const output={result:'PASS',baseline,batchNumbers:selected.numbers,untouchedSourceCards:untouched,untouchedPublicCards:publicUnchanged,enginesValidated:engineCount,dateFixes:migration.changes.map(f=>({id:f.make+'/'+f.line,indexMapping:f.indexMapping,listingIdChanged:f.listingIdBefore!==f.listingIdAfter})),drawingFilesVerified:drawingCount,allStatsKeysInRange:true,statisticsRebuildVerified:fixes.size>0};fs.writeFileSync(root+`/final-validation-${selected.label}.json`,JSON.stringify(output,null,2)+'\n');console.log(JSON.stringify(output));
