import fs from 'node:fs';
import crypto from 'node:crypto';
import cp from 'node:child_process';
import assert from 'node:assert/strict';
import {isDeepStrictEqual} from 'node:util';
import {changes,wiki} from './research.mjs';
const root='analysis/codex/catalog-wave-1-batch-1';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=x=>crypto.createHash('sha256').update(typeof x==='string'?x:JSON.stringify(x)).digest('hex');
const base=read(`${root}/baseline.json`),report=read(`${root}/report.json`),index=read('src/data/model-cards-index.json');
const lines=read('src/data/model-lines-index.json'),allowed=new Set(changes.map(c=>`${c.make}/${c.line}`));
const sourceCards={};
for(const dir of ['src/data/catalog/model-cards','src/data/model-cards'])for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.json')))for(const card of read(`${dir}/${file}`))sourceCards[`${dir}/${file}#${card.makeSlug}/${card.lineSlug}`]=hash(card);
let unchangedSources=0,unchangedPublic=0;
for(const [key,h]of Object.entries(base.sourceCards)){
 const identity=key.split('#')[1];assert(sourceCards[key],`Source card removed: ${key}`);
 if(!allowed.has(identity)){assert.equal(sourceCards[key],h,`Untouched source card changed: ${key}`);unchangedSources++;}
}
for(const key of Object.keys(sourceCards))if(!(key in base.sourceCards))assert(allowed.has(key.split('#')[1]),`Unexpected new card ${key}`);
for(const [key,h]of Object.entries(base.publicCards)){
 const [make,line]=key.split('/');assert(index[make]?.[line],`Public card removed: ${key}`);
 if(!allowed.has(key)){assert.equal(hash(index[make][line]),h,`Untouched generated card changed: ${key}`);unchangedPublic++;}
}
const oldIndex=JSON.parse(cp.execFileSync('git',['show',`${base.baselineRevision}:src/data/model-cards-index.json`],{encoding:'utf8',maxBuffer:60e6}));
const oldLines=JSON.parse(cp.execFileSync('git',['show',`${base.baselineRevision}:src/data/model-lines-index.json`],{encoding:'utf8',maxBuffer:20e6}));
for(const [make,list]of Object.entries(oldLines))for(const l of list)if(!allowed.has(`${make}/${l.slug}`))assert(isDeepStrictEqual(lines[make].find(x=>x.slug===l.slug),l),`Untouched line index changed ${make}/${l.slug}`);
const oldSourceLines=JSON.parse(cp.execFileSync('git',['show',`${base.baselineRevision}:src/data/catalog/model-lines-auto.json`],{encoding:'utf8',maxBuffer:30e6}));
const sourceLines=read('src/data/catalog/model-lines-auto.json');
for(const l of oldSourceLines)if(!allowed.has(`${l.makeSlug}/${l.slug}`))assert(isDeepStrictEqual(sourceLines.find(x=>x.makeSlug===l.makeSlug&&x.slug===l.slug),l),`Untouched source line changed ${l.makeSlug}/${l.slug}`);
let engineRowsAdded=0,faceliftsAdded=0,generationsAdded=0;
const bodies=new Set(['hatchback','kombi','sedan','suv','mpv','kupe','kabriolet','pickup','dodavka']);
for(const c of changes){
 const card=index[c.make][c.line],prior=oldIndex[c.make]?.[c.line];
 const line=lines[c.make].find(l=>l.slug===c.line);assert(line);
 if(!prior){assert(c.create);generationsAdded+=card.generations.length;}
 else{
  assert.equal(card.generations.length,prior.generations.length);
  for(let i=0;i<prior.generations.length;i++)assert.equal(card.generations[i].code,prior.generations[i].code,'Existing listing id changed');
 }
 for(const [i,g]of card.generations.entries()){
  const old=prior?.generations[i];assert(g.from!=null&&g.from<=(g.to??9999));assert(g.bodyTypes.length&&g.bodyTypes.every(b=>bodies.has(b)));
  if(old){
   assert(isDeepStrictEqual(g.engines.slice(0,old.engines.length),old.engines),'Existing engine rows changed');
   assert(isDeepStrictEqual(g.photo,old.photo),'Existing photo changed');
   assert(isDeepStrictEqual(g.trims,old.trims),'Existing technical versions changed');
   if((old.drawingStage??0)>0)assert.equal(g.facelifts[(g.drawingStage??0)-1]?.year,old.facelifts[old.drawingStage-1]?.year,'Drawing stage changed its depicted facelift');
  }
  assert(g.engines.length,`No engines ${c.make}/${c.line}/${i}`);
  engineRowsAdded+=g.engines.length-(old?.engines.length??0);faceliftsAdded+=g.facelifts.length-(old?.facelifts.length??0);
  assert((g.drawingStage??0)>=0&&(g.drawingStage??0)<=g.facelifts.length);
  for(const row of g.engines.slice(old?.engines.length??0)){
   assert(row.sources?.length&&row.sources.every(u=>Object.values(wiki).includes(u)));
   assert(row.powerKwMin>0&&row.powerKwMax>=row.powerKwMin);
   assert.equal(row.powerRangeCoverage,'documented-versions-only');
   assert.equal(Math.min(...row.availablePowerKw),row.powerKwMin);assert.equal(Math.max(...row.availablePowerKw),row.powerKwMax);
   if(row.fuel==='electric')assert.equal(row.displacementCc,null);
  }
 }
 for(const g of line.generations)assert(typeof(g.code??`${g.from}–${g.to}`)==='string');
}
// No ordinal migration took place. Drawing assets and holds must remain exactly the same;
// only year envelopes for touched generation entries may change.
const front=read('src/data/front-drawings.json');
const oldFront=JSON.parse(cp.execFileSync('git',['show',`${base.baselineRevision}:src/data/front-drawings.json`],{encoding:'utf8',maxBuffer:20e6}));
for(const [key,rows]of Object.entries(front)){
 if(!allowed.has(key.replace('--','/')))assert(isDeepStrictEqual(rows,oldFront[key]),`Untouched drawing entry changed ${key}`);
 else{assert.deepEqual(rows.map(r=>r[0]),oldFront[key].map(r=>r[0]));for(const [i,from,to]of rows){const g=index[key.split('--')[0]][key.split('--')[1]].generations[i];assert(g);assert.equal(from,g.from);assert.equal(to,g.to);}}
 for(const row of rows)assert(fs.existsSync(`public/front/${key}--${row[0]}.webp`),`Missing drawing ${key}/${row[0]}`);
}
assert.equal(hash(fs.readFileSync('src/data/front-drawing-review.json','utf8')),base.protectedFiles['src/data/front-drawing-review.json']);
for(const [file,h]of Object.entries(base.protectedFiles))if(file.startsWith('src/data/stats/')&&!['src/data/stats/peugeot.json','src/data/stats/dacia.json'].includes(file))assert.equal(hash(fs.readFileSync(file,'utf8')),h,`Untouched stats changed ${file}`);
const run=read(`${root}/stats-run.json`);assert.equal(run.state,'complete','Wait for complete statistics before handing off');
for(const {source,sha256}of run.promoted)assert.equal(hash(fs.readFileSync(source,'utf8')),sha256);
const listing=read('src/data/listing-stats.json');
report.statisticsChanges=[];
for(const [make,line]of [['peugeot','boxer'],['peugeot','expert'],['peugeot','308'],['dacia','duster']]){
 const before=JSON.parse(cp.execFileSync('git',['show',`${base.baselineRevision}:src/data/stats/${make}.json`],{encoding:'utf8',maxBuffer:20e6}))[line];
 const after=read(`src/data/stats/${make}.json`)[line];
 const rows=s=>Object.entries(s.gens??{}).map(([i,g])=>({index:Number(i),fleet:g.fleet?.n??null,inspections:g.stk?.inspections??null}));
 for(const [i,g]of Object.entries(after.gens??{}))assert.equal(g.fleet?.n,listing.makes[make][line].gens?.[i]?.n,'Listing statistics mismatch');
 report.statisticsChanges.push({make,line,before:rows(before),after:rows(after)});
}
const counts=read('analysis/codex/catalog-completeness-audit.json').counts;
const result={result:'PASS',untouchedSourceCardsUnchanged:unchangedSources,untouchedGeneratedCardsUnchanged:unchangedPublic,linesTouched:changes.length,
 newCards:changes.filter(c=>c.create).length,generationsAdded,generationsRemoved:0,engineRowsAdded,faceliftsAdded,
 existingListingIdsUnchanged:true,existingGenerationIndexesUnchanged:true,drawingFiles:'all front-drawings entries exist',holds:'unchanged',
 statisticsRecomputed:['peugeot','dacia'],otherStatisticsByteIdentical:true,before:base.counts,after:counts};
report.validation=result;fs.writeFileSync(`${root}/report.json`,JSON.stringify(report,null,2)+'\n');
fs.writeFileSync(`${root}/validation.json`,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
