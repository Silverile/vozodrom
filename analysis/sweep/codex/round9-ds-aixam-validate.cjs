const fs=require('fs'),assert=require('assert/strict');
const root='analysis/sweep/codex/';
for(const make of ['ds-automobiles','aixam']){
 const before=JSON.parse(fs.readFileSync(root+`round9-baseline-${make}-card.json`,'utf8'));
 const cards=JSON.parse(fs.readFileSync(`src/data/catalog/model-cards/${make}.json`,'utf8'));
 const old=JSON.parse(fs.readFileSync(root+`round9-baseline-${make}-report.json`,'utf8'));
 const report=JSON.parse(fs.readFileSync(root+make+'.json','utf8'));
 assert.equal(cards.length,before.length);
 for(const key of Object.keys(old))if(Array.isArray(old[key]))assert.deepEqual(report[key].slice(0,old[key].length),old[key],`${make} old ${key} prefix preserved`);
 const changes=report.cardFixesApplied.slice(old.cardFixesApplied.length);
 let count=0;
 for(let i=0;i<cards.length;i++){
  assert.equal(cards[i].lineSlug,before[i].lineSlug);
  assert.equal(cards[i].generations.length,before[i].generations.length);
  for(let j=0;j<cards[i].generations.length;j++){
   const g=cards[i].generations[j],b=before[i].generations[j];
   for(const key of Object.keys(g)){
    if(key==='sources')continue;
    if(JSON.stringify(g[key])!==JSON.stringify(b[key])){
     count++;
     const fix=changes.find(x=>x.lineSlug===cards[i].lineSlug&&x.path===`generations[${j}].${key}`);
     assert.ok(fix,`${make} ${cards[i].lineSlug} ${key} logged`);
     assert.deepEqual(fix.from,b[key]);assert.deepEqual(changes.findLast(x=>x.lineSlug===cards[i].lineSlug&&x.path===fix.path).to,g[key]);assert.ok(fix.sources.length>=2);
    }
   }
   assert.deepEqual(g.photo,b.photo,'Photo unchanged; no new visual certification');
   if(g.from!==null&&g.to!==null)assert.ok(g.from<=g.to);
   if(g.facelift!==null)for(const f of g.facelift){assert.ok(Number.isInteger(f.year));assert.ok(f.productionYear===null||Number.isInteger(f.productionYear));assert.ok(f.sources.length>=2);}
  }
 }
 assert.equal(count,new Set(changes.filter(x=>!x.path.endsWith('sources')).map(x=>x.lineSlug+':'+x.path)).size);
 const replay=structuredClone(before);
 for(const fix of changes){
  assert.ok(fix.sources.length>=2);
  let target=replay.find(c=>c.lineSlug===fix.lineSlug);
  const keys=fix.path.replace(/\[(\d+)\]/g,'.$1').split('.');
  for(const key of keys.slice(0,-1))target=target[key];
  assert.deepEqual(target[keys.at(-1)],fix.from);
  target[keys.at(-1)]=fix.to;
 }
 assert.deepEqual(replay,cards);
 console.log(`${make}: PASS ${count} factual field changes, ${changes.length} complete replay operations, all old report array entries preserved, 2+ sources per operation, photo objects unchanged`);
}
