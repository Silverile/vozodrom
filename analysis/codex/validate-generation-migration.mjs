import fs from 'node:fs';
import cp from 'node:child_process';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
// Fixed pre-migration revision: HEAD advances after the migration is committed.
const baseline='55a0e70d1cd8e836ea85ab925feb705c99f45891';
const head=p=>cp.execFileSync('git',['show',`${baseline}:${p}`],{maxBuffer:50e6});
const report=read('analysis/codex/generation-migration-2026-10-31.json');
const cards=read('src/data/model-cards-index.json');
const lines=read('src/data/model-lines-index.json');
const drawings=read('src/data/front-drawings.json');
const review=read('src/data/front-drawing-review.json');
const listing=read('src/data/listing-stats.json');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
let files=0, moved=0, preservedStats=0, versions=0;
for(const [key,rows]of Object.entries(drawings)) for(const [i]of rows) {
  assert(fs.existsSync(`public/front/${key}--${i}.webp`),`Missing drawing ${key}--${i}`);files++;
}
for(const [key,r]of Object.entries(report.lines)){
  const [make,line]=key.split('/'),card=cards[make][line],selector=lines[make].find(x=>x.slug===line);
  assert.deepEqual(selector.generations,card.generations.map(({code,from,to})=>({code,from,to})),`Selector mismatch ${key}`);
  const stats=read(`src/data/stats/${make}.json`)[line];
  const oldStats=JSON.parse(head(`src/data/stats/${make}.json`))[line];
  for(const i of Object.keys(stats.gens??{}))assert(Number(i)>=0&&Number(i)<card.generations.length,`Invalid stats key ${key}/${i}`);
  for(const move of r.statsMoves){
    if(move.to===null)continue;
    assert.deepEqual(stats.gens[move.to],oldStats.gens[move.from],`Changed statistic payload ${key}`);preservedStats++;
  }
  const noGens=x=>Object.fromEntries(Object.entries(x).filter(([k])=>k!=='gens'));
  assert.deepEqual(noGens(stats),noGens(oldStats),`Line totals changed ${key}`);
  assert.deepEqual(Object.keys(listing.makes[make][line].gens??{}),Object.keys(stats.gens??{}),`Listing stats mismatch ${key}`);
  const prefix=`${make}--${line}`;
  for(const [i,from,to]of drawings[prefix]??[]){
    const g=card.generations[i];assert(g,`Removed generation drawing ${key}/${i}`);
    assert.equal(from,g.from);assert.equal(to,g.to);
    assert(Number.isInteger(g.drawingStage??0));
    assert((g.drawingStage??0)<=g.facelifts.length,`Invalid drawing stage ${key}/${i}`);
  }
  for(const move of r.drawingMoves){
    if(move.to===null){
      const retired=`public/front/${prefix}--${move.from}.webp`;
      assert.equal(review[`${prefix}--${move.from}`],undefined,'Retired family drawing must not flag the replacement generation');
      assert(!(drawings[prefix]??[]).some(([i])=>i===move.from));
      assert.equal(hash(fs.readFileSync(retired)),hash(head(retired)),'Retired drawing must remain unchanged on disk');
      continue;
    }
    assert.equal(hash(fs.readFileSync(`public/front/${prefix}--${move.to}.webp`)),hash(head(`public/front/${prefix}--${move.from}.webp`)),`Wrong drawing content ${key}`);moved++;
  }
  const before=r.beforeCard.generations.flatMap(g=>g.trims??[]);
  const after=card.generations.flatMap(g=>g.trims??[]);
  assert.equal(after.length,before.length,`Lost technical versions ${key}`);
  const sorted=a=>a.map(JSON.stringify).sort();
  assert.deepEqual(sorted(after),sorted(before),`Changed version/body attribution ${key}`);versions+=after.length;
  const genId=g=>g.code??`${g.from??'?'}–${g.to??'?'}`;
  for(const old of r.beforeSelector)assert(selector.generations.some(g=>genId(g)===genId(old)),`Lost listing id ${key}`);
}
assert.equal(cards.kia.ceed.generations.length,3);
assert.equal(cards.volkswagen.caddy.generations.length,5);
assert.equal(cards.bmw['rada-5'].generations.length,8);
assert.equal(cards.audi.a6.generations.length,6);
assert.equal(cards.hyundai.tucson.generations.length,5);
for(const move of report.renamed){
  const card=cards[move.file.split('/').at(-1).replace('.json','')][move.line];
  assert.equal(card.generations[move.index].name,move.after);
}
const result={drawingFilesChecked:files,targetDrawingHashesChecked:moved,preservedStatsPayloadsChecked:preservedStats,technicalVersionsPreserved:versions,renamedLabelsChecked:report.renamed.length,selectorAlignment:'5/5',existingListingIds:'all preserved',result:'PASS'};
fs.writeFileSync('analysis/codex/generation-migration-validation.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
