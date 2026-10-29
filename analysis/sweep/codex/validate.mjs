import fs from 'node:fs';
import assert from 'node:assert/strict';
const dir='analysis/sweep/codex/';
const reports=fs.readdirSync(dir).filter(f=>/^[a-z-]+\.json$/.test(f));
let changes=0;
for(const f of reports){
 const r=JSON.parse(fs.readFileSync(dir+f,'utf8'));
 if(!r.make)continue;
 assert.equal(r.by,'codex');
 const p=`src/data/catalog/model-cards/${r.make}.json`;
 const cards=JSON.parse(fs.readFileSync(p,'utf8'));
 assert.equal(new Set(cards.map(c=>c.lineSlug)).size,cards.length,`${r.make} duplicate identity`);
 for(const c of cards)for(const g of c.generations){
  assert(['current','ended','unknown'].includes(g.productionStatus));
  if(g.from!=null&&g.to!=null)assert(g.from<=g.to,`${r.make}/${c.lineSlug} date range`);
 }
 const last=new Map();
 const tokens=p=>p.replace(/\[(\d+)\]/g,'.$1').split('.');
 const prefix=(a,b)=>a.length<=b.length&&a.every((key,i)=>key===b[i]);
 for(const [index,x] of r.cardFixesApplied.entries()){assert(x.sources?.length,`${r.make} unsourced fix`);last.set(x.lineSlug+'|'+x.path,{...x,index});changes++;}
 for(const x of last.values()){
  const c=cards.find(c=>c.lineSlug===x.lineSlug);assert(c,`${r.make}/${x.lineSlug} missing`);
  const keys=tokens(x.path),later=r.cardFixesApplied.slice(x.index+1).filter(y=>y.lineSlug===x.lineSlug);
  // A subsequent parent replacement supersedes this earlier child audit.
  if(later.some(y=>prefix(tokens(y.path),keys)))continue;
  // Child edits legitimately update an earlier whole-object/array replacement.
  const expected=structuredClone(x.to);
  for(const y of later){const child=tokens(y.path);if(!prefix(keys,child))continue;const relative=child.slice(keys.length);let parent=expected;for(const k of relative.slice(0,-1))parent=parent[k];parent[relative.at(-1)]=structuredClone(y.to);}
  const value=keys.reduce((a,k)=>a?.[k],c);
  assert.deepEqual(value,expected,`${r.make}/${x.lineSlug}/${x.path} logged result differs`);
 }
 for(const key of ['makeFixes','modelFixes','removeModels','missingModels'])for(const x of r[key]??[])assert(x.sources?.length,`${r.make}/${key} missing sources`);
 console.log(`${r.make}: ${cards.length} cards; ${r.cardFixesApplied.length} sourced logged changes match final fields`);
}
console.log(`PASS: ${reports.length} reports; ${changes} logged changes.`);
