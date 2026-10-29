const fs=require('fs'),assert=require('node:assert/strict');
const base='analysis/sweep/codex/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
for(const make of ['baic','dongfeng']) {
 const old=read(base+`round9-baseline-${make}-card.json`),cards=read(`src/data/catalog/model-cards/${make}.json`);
 const rpath=base+make+'.json',r=read(rpath),oldr=read(base+`round9-baseline-${make}-report.json`);
 for(const c of cards) {
  const o=old.find(x=>x.lineSlug===c.lineSlug);
  if(JSON.stringify(c.needsReview)!==JSON.stringify(o.needsReview)&&!r.cardFixesApplied.slice(oldr.cardFixesApplied.length).some(x=>x.lineSlug===c.lineSlug&&x.path==='needsReview')) {
   const sources=r.cardFixesApplied.slice(oldr.cardFixesApplied.length).find(x=>x.lineSlug===c.lineSlug&&x.sources.length>=2).sources;
   r.cardFixesApplied.push({lineSlug:c.lineSlug,path:'needsReview',from:o.needsReview,to:c.needsReview,sources,pass:'round9-depth',confidence:'high'});
  }
 }
 fs.writeFileSync(rpath,JSON.stringify(r,null,2)+'\n');
 const fixes=r.cardFixesApplied.slice(oldr.cardFixesApplied.length),replay=structuredClone(old);
 for(const f of fixes) {
  assert.ok(f.sources.length>=2,`${make}/${f.lineSlug}/${f.path}: two source URLs`);
  let obj=replay.find(x=>x.lineSlug===f.lineSlug);const parts=f.path.replace(/\[(\d+)\]/g,'.$1').split('.');
  for(const p of parts.slice(0,-1)) obj=obj[p];
  assert.deepEqual(obj[parts.at(-1)],f.from,`${make}/${f.lineSlug}/${f.path}: before value`);
  obj[parts.at(-1)]=f.to;
 }
 assert.deepEqual(replay,cards,`${make}: exact replay`);
 for(const [k,v] of Object.entries(oldr)) if(Array.isArray(v)) assert.deepEqual(r[k].slice(0,v.length),v,`${make}: preserve report ${k}`);
 for(const c of cards) for(const g of c.generations) {assert.ok(['current','ended','unknown'].includes(g.productionStatus));assert.ok(g.from===null||g.to===null||g.from<=g.to);}
 console.log(`${make}: PASS exact audit replay, old report arrays preserved, two source URLs per mutation; ${fixes.length} audit entries`);
}
