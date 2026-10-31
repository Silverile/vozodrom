import fs from 'node:fs';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {isDeepStrictEqual as equal} from 'node:util';
import {rejectEngine,normalizeEngineRows,normalizeVariant,powerValues,evidenceProblem} from './engine-throughput-policy.mjs';
const root='analysis/codex/engine-throughput';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const session=read(`${root}/session.json`),revision=session.baselineRevision;
const git=p=>JSON.parse(cp.execFileSync('git',['show',`${revision}:${p}`],{encoding:'utf8',maxBuffer:80e6}));
const hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const reports=fs.readdirSync(root).filter(f=>/^batch-\d+\.json$/.test(f)).map(f=>({file:f,data:read(`${root}/${f}`)})).sort((a,b)=>a.data.batch-b.data.batch);
assert(reports.length,'No completed batch report');
const latest=reports.at(-1),touched=new Map();
for(const {data}of reports)for(const row of data.lines)if(row.enginesAdded){assert(!touched.has(`${row.make}/${row.line}`),'A line was processed twice');touched.set(`${row.make}/${row.line}`,row);}
const sourceDirs=['src/data/catalog/model-cards','src/data/model-cards'];
const oldSources={},currentSources={},effective=new Map();
for(const directory of sourceDirs){
 const oldFiles=cp.execFileSync('git',['ls-tree','--name-only',`${revision}:${directory}`],{encoding:'utf8'}).trim().split(/\r?\n/).filter(f=>f.endsWith('.json'));
 assert.deepEqual(fs.readdirSync(directory).filter(f=>f.endsWith('.json')).sort(),oldFiles.sort(),'Source file inventory changed');
 for(const file of oldFiles){const p=`${directory}/${file}`;for(const c of git(p))oldSources[`${p}#${c.makeSlug}/${c.lineSlug}`]=c;for(const c of read(p)){currentSources[`${p}#${c.makeSlug}/${c.lineSlug}`]=c;effective.set(`${c.makeSlug}/${c.lineSlug}`,c);}}
}
assert.deepEqual(Object.keys(currentSources).sort(),Object.keys(oldSources).sort(),'Source card inventory changed');
let untouched=0,added=0,baselineCardsNormalized=0,baselineOnlyNormalized=0;
for(const [source,rawBefore]of Object.entries(oldSources)){
 const before=structuredClone(rawBefore);for(const g of before.generations)g.engines=normalizeEngineRows(g.engines);
 if(!equal(before,rawBefore))baselineCardsNormalized++;
 const after=currentSources[source],identity=source.split('#')[1],row=touched.get(identity);
 if(!row||source!==`${row.sourceFile}#${identity}`){assert(equal(after,before),`Untouched source card changed: ${source}`);if(equal(before,rawBefore))untouched++;else baselineOnlyNormalized++;continue;}
 assert([hash(before),hash(rawBefore)].includes(row.beforeHash),`Before fingerprint mismatch ${identity}`);
 assert.equal(hash(after),row.afterHash,`After fingerprint mismatch ${identity}`);
 assert.equal(after.generations.length,before.generations.length);
 const restored=structuredClone(after);restored.sources=before.sources;restored.needsReview=before.needsReview;
 for(const [i,g]of after.generations.entries()){
  const old=before.generations[i];assert(equal((g.engines??[]).slice(0,old.engines?.length??0),old.engines??[]),'Existing engine rows changed');
  const seen=new Set();
  for(const e of g.engines??[]){
   assert.equal(normalizeVariant(e.variant),e.variant,'Malformed engine variant name');
   for(const kw of powerValues(e))if(e.variant){const k=`${e.variant.toLowerCase()}|${kw}`;assert(!seen.has(k),`Duplicate engine name/power: ${identity}/${i}/${k}`);seen.add(k);}
  }
  for(const e of (g.engines??[]).slice(old.engines?.length??0)){
   assert.equal(rejectEngine(row.make,row.line,e),null,'Excluded sibling/concept row');
   added++;assert(Number.isFinite(e.powerKwMin)&&e.powerKwMin>=5&&e.powerKwMin<=1500);assert.equal(e.powerKwMax,e.powerKwMin);
   assert.deepEqual(e.availablePowerKw,[e.powerKwMin]);assert.equal(e.powerRangeCoverage,'documented-versions-only');
   assert(e.sources?.length&&e.sources.every(u=>/^https:\/\/(en|de|cs)\.wikipedia\.org\//.test(u)));
   assert(['petrol','diesel','electric','petrol-cng','petrol-lpg','petrol-mhev','petrol-phev'].includes(e.fuel));
   if(e.fuel==='electric')assert.equal(e.displacementCc,null);
   else assert(e.displacementCc>0||e.displacementLitresNominal>0);
   assert(e.sourceScope?.tableIndex>0&&typeof e.sourceScope.tableSection==='string');
   assert.equal(evidenceProblem(g,i,e),null,'Invalid source generation/market/name evidence');
  }
  for(const field of ['engines','engineCoverage','sources']){
   if(Object.hasOwn(old,field))restored.generations[i][field]=old[field];else delete restored.generations[i][field];
  }
 }
 assert(equal(restored,before),`Non-engine facts changed: ${identity}`);
}
assert.equal(added,reports.reduce((n,r)=>n+r.data.summary.enginesAdded,0));
const oldIndex=git('src/data/model-cards-index.json'),index=read('src/data/model-cards-index.json');
let untouchedPublic=0;
assert.deepEqual(Object.keys(index).sort(),Object.keys(oldIndex).sort());
for(const [make,lines]of Object.entries(oldIndex)){
 assert.deepEqual(Object.keys(index[make]).sort(),Object.keys(lines).sort());
 for(const [line,original]of Object.entries(lines)){
  const c=structuredClone(original);for(const g of c.generations)g.engines=normalizeEngineRows(g.engines);
  const identity=`${make}/${line}`,after=index[make][line];
  if(!touched.has(identity)){assert(equal(after,c),`Untouched generated card changed: ${identity}`);if(equal(c,original))untouchedPublic++;continue;}
  const restored=structuredClone(after);restored.sources=c.sources;
  for(const [i,g]of after.generations.entries()){
   assert(equal(g.engines,effective.get(identity).generations[i].engines??[]),'Generated engine rows differ from source');
   restored.generations[i].engines=c.generations[i].engines;restored.generations[i].sources=c.generations[i].sources;
  }
  assert(equal(restored,c),`Non-engine public fields changed: ${identity}`);
 }
}
// All ordinal-coupled data must stay byte-identical in an engine-only batch.
const changed=cp.execFileSync('git',['diff','--name-only',revision,'--','src/data/stats','src/data/listing-stats.json','src/data/catalog/model-lines-auto.json','src/data/model-lines-index.json','src/data/front-drawings.json','src/data/front-drawing-review.json','public/front'],{encoding:'utf8'}).trim();
assert.equal(changed,'','A protected identity/statistics/drawing file changed');
const front=read('src/data/front-drawings.json');let drawingEntries=0,statsKeys=0;
for(const [key,rows]of Object.entries(front))for(const [i]of rows){assert(fs.existsSync(`public/front/${key}--${i}.webp`));drawingEntries++;}
for(const identity of touched.keys()){
 const [make,line]=identity.split('/'),file=`src/data/stats/${make}.json`;if(!fs.existsSync(file))continue;
 for(const i of Object.keys(read(file)[line]?.gens??{})){assert(index[make][line].generations[i],`Invalid stats key ${identity}/${i}`);statsKeys++;}
}
const counts=read('analysis/codex/catalog-completeness-audit.json').counts;
const result={result:'PASS',batches:reports.map(r=>r.data.batch),attemptedLines:reports.reduce((n,r)=>n+r.data.lines.length,0),
 touchedLines:touched.size,engineRowsAdded:added,baselineCardsNormalized,baselineOnlyNormalized,untouchedSourceCardsUnchanged:untouched,untouchedGeneratedCardsUnchanged:untouchedPublic,
 generationStructureDatesBodiesFaceliftsPhotos:'unchanged',listingIds:'unchanged',drawingsHoldsStatistics:'byte-identical',drawingEntriesChecked:drawingEntries,affectedStatisticsKeysChecked:statsKeys,
 countsAfter:counts};
for(const report of reports){report.data.validationScope='whole-current-session';report.data.validation=result;fs.writeFileSync(`${root}/${report.file}`,JSON.stringify(report.data,null,2)+'\n');}
fs.writeFileSync(`${root}/validation.json`,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
