import fs from 'node:fs';import assert from 'node:assert/strict';
const root='analysis/codex/rare-engines-pass/batch-2',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n'),path='src/data/catalog/model-cards/lancia.json',cards=read(path),c=cards.find(c=>c.lineSlug==='zeta'),g=c.generations[0],changes=read(root+'/engine-changes.json'),change=changes.changes.find(r=>r.id==='lancia/zeta'&&r.index===0);
assert.deepEqual(g.engines,change.engines,'Public row changed since this batch wrote it');
const position=g.engines.findIndex(e=>e.variant==='2.0 16V'&&e.powerKwMin===100);assert.equal(g.engines[position].displacementCc,1997);
const replacements=read(root+'/curated-engines.json').filter(r=>r.id==='lancia/zeta'&&r.engine.variant==='2.0 16V').map(r=>r.engine);assert.equal(replacements.length,2);
g.engines.splice(position,1,...replacements);for(const e of replacements){g.sources=[...new Set([...g.sources,...e.sources])];c.sources=[...new Set([...c.sources,...e.sources])];}
// Rebuild only this generation's missing-value notes after inserting the additional variant.
c.needsReview=(c.needsReview??[]).filter(r=>!r.field.startsWith('generations[0].engines'));
for(const[i,e]of g.engines.entries())for(const field of['displacementCc','displacementLitresNominal','powerKwMin','powerKwMax'])if(e[field]===null)c.needsReview.push({field:`generations[0].engines[${i}].${field}`,reason:'Tato hodnota nebyla pro konkrétní provedení ověřena; bez přepočtu a bez přenášení z jiné generace.'});
change.engines=g.engines;changes.rows=changes.changes.reduce((n,r)=>n+r.engines.length,0);write(path,cards);write(root+'/engine-changes.json',changes);console.log({result:'revised',zetaRows:g.engines.length,batchRows:changes.rows});
