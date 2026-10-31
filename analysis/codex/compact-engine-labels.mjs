import fs from 'node:fs';
import cp from 'node:child_process';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {compactEngineRows,explicitlyForeignEngine} from './short-engine-labels.mjs';
const root='analysis/codex/second-source-engines',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n'),hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const paths=['src/data/catalog/model-cards','src/data/model-cards'].flatMap(d=>fs.readdirSync(d).filter(f=>f.endsWith('.json')).map(f=>d+'/'+f));
if(process.argv.includes('--apply')){
 assert(!fs.existsSync(root+'/labels-40.json')||process.argv.includes('--refresh'),'Label pass already applied');
 const prior=process.argv.includes('--refresh')?read(root+'/labels-40.json'):null;
 const changes=[],expected={},counts={longNamesBefore:0,longNamesAfter:0,rowsBefore:0,rowsAfter:0,explicitForeignRowsDropped:0};
 for(const p of paths){const data=read(p);let touched=false;
  for(const c of data){const before=hash(c),gens=[];
   for(const [i,g]of c.generations.entries()){
    const rows=g.engines??[];counts.rowsBefore+=rows.length;counts.longNamesBefore+=rows.filter(e=>(e.variant?.length??0)>40).length;counts.explicitForeignRowsDropped+=rows.filter(explicitlyForeignEngine).length;
    const next=compactEngineRows(g.engines);counts.rowsAfter+=(next??[]).length;counts.longNamesAfter+=(next??[]).filter(e=>(e.variant?.length??0)>40).length;
    if(JSON.stringify(next)!==JSON.stringify(g.engines)){gens.push({index:i,before:rows.length,after:(next??[]).length,renamed:rows.filter(e=>(e.variant?.length??0)>40).map(e=>e.variant),droppedForeign:rows.filter(explicitlyForeignEngine).map(e=>e.variant)});g.engines=next;touched=true;}
   }
   expected[`${p}#${c.makeSlug}/${c.lineSlug}`]=hash(c);if(before!==hash(c))changes.push({sourceFile:p,id:`${c.makeSlug}/${c.lineSlug}`,beforeHash:before,afterHash:hash(c),generations:gens});
  }
  if(touched)write(p,data);
 }
 cp.execFileSync('node',['scripts/model-cards-index.mjs'],{stdio:'inherit'});
 write(root+'/labels-40.json',{counts:prior?{...prior.counts,rowsAfter:counts.rowsAfter,longNamesAfter:counts.longNamesAfter}:counts,changes:[...(prior?.changes??[]),...changes],expectedSourceCardHashes:expected,indexHash:hash(read('src/data/model-cards-index.json'))});console.log(JSON.stringify(counts));
}else{
 const r=read(root+'/labels-40.json'),migration=process.argv.includes('--after-bmw')?read(root+'/bmw-x/migration.json'):null;let checked=0;
 for(const p of paths)for(const c of read(p)){const expected=migration&&c.makeSlug==='bmw'&&['x5','x3'].includes(c.lineSlug)?migration.expectedSourceCardHashes[c.lineSlug]:r.expectedSourceCardHashes[`${p}#${c.makeSlug}/${c.lineSlug}`];assert.equal(hash(c),expected,`Card changed after label validation: ${c.makeSlug}/${c.lineSlug}`);for(const g of c.generations){assert.deepEqual(compactEngineRows(g.engines),g.engines,'Label cleanup is not idempotent');for(const e of g.engines??[])assert(e.variant.length<=40);}checked++;}
 if(!migration)assert.equal(hash(read('src/data/model-cards-index.json')),r.indexHash);console.log(JSON.stringify({result:'PASS',sourceCardsChecked:checked,...r.counts}));
}
