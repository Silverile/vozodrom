import fs from 'node:fs';
import cp from 'node:child_process';
import assert from 'node:assert/strict';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),root='analysis/codex/structure-pass-5',file='src/data/catalog/model-line-additions.json',cards=read('src/data/model-cards-index.json');
const plans=new Map();for(const batch of [2,3,4,5])for(const row of read(`analysis/codex/structure-pass-${batch}/report.json`).lines.filter(r=>r.status==='changed')){const previous=plans.get(row.id),map=previous?Object.fromEntries(Object.entries(previous.map).map(([i,j])=>[i,row.oldToNew[j]??j])):row.oldToNew;plans.set(row.id,{batch,map});}
const before=read(file),after=structuredClone(before),changes=[],gid=g=>g.code??`${g.from??'?'}\u2013${g.to??'?'}`;
for(const l of after){const id=`${l.makeSlug}/${l.slug}`;if(!plans.has(id))continue;const gs=cards[l.makeSlug]?.[l.slug]?.generations;assert(gs);const signature=a=>a.map(g=>[g.code??null,g.from??null,g.to??null]);if(JSON.stringify(signature(l.generations??[]))===JSON.stringify(signature(gs)))continue;
 const oldGens=structuredClone(l.generations??[]),source=read(read(`analysis/codex/structure-pass-${plans.get(id).batch}/report.json`).lines.find(r=>r.id===id).sourceFile).find(c=>`${c.makeSlug}/${c.lineSlug}`===id);
 l.generations=source.generations.map(g=>({code:g.code??null,from:g.from??null,to:g.to??null,productionStatus:g.productionStatus,bodyTypes:g.bodyTypes??[],sources:g.sources??[],...(g.dateBasis?{dateBasis:g.dateBasis}:{})}));
 changes.push({id,oldToNew:plans.get(id).map,before:oldGens.map(g=>({code:g.code??null,from:g.from??null,to:g.to??null})),after:l.generations.map(g=>({code:g.code,from:g.from,to:g.to})),idChanges:oldGens.flatMap((g,i)=>{const j=plans.get(id).map[i];return j!=null&&l.generations[j]&&gid(g)!==gid(l.generations[j])?[{oldIndex:i,newIndex:j,from:gid(g),to:gid(l.generations[j])}]:[]})});
}
fs.writeFileSync(file,JSON.stringify(after,null,2)+'\n');cp.execFileSync('node',['scripts/model-lines-index.mjs'],{stdio:'inherit'});
const index=read('src/data/model-lines-index.json');for(const row of changes){const [make,line]=row.id.split('/');assert.deepEqual(index[make].find(l=>l.slug===line).generations,cards[make][line].generations.map(g=>({code:g.code??null,from:g.from??null,to:g.to??null})));}
fs.writeFileSync(`${root}/listing-generation-alignment.json`,JSON.stringify({reason:'Previous migrations missed model-line-additions.json, which precedes card-only fallback in model-lines-index.mjs. Matcher reads cards, so these selector corrections do not invalidate raw statistics.',lines:changes},null,2)+'\n');console.log(JSON.stringify({alignedAdditionalLines:changes.length}));
