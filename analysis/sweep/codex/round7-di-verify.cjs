const fs=require('fs'),assert=require('assert/strict'),{spawnSync}=require('child_process');
const baseline=JSON.parse(fs.readFileSync('analysis/sweep/codex/round7-di-baseline.json'));
for(const m of ['daihatsu','isuzu']){
 const cards=JSON.parse(fs.readFileSync(`src/data/catalog/model-cards/${m}.json`)),r=JSON.parse(fs.readFileSync(`analysis/sweep/codex/${m}.json`)),b=baseline[m],replay=structuredClone(b.cards);
 for(const [key,value] of Object.entries(b.report))if(Array.isArray(value))assert.deepEqual(r[key].slice(0,value.length),value,m+' prior '+key);
 const changes=r.cardFixesApplied.slice(b.report.cardFixesApplied.length);
 for(const e of changes){
  assert(e.sources.length>=2);const c=replay.find(x=>x.lineSlug===e.lineSlug),keys=e.path.replace(/\[(\d+)\]/g,'.$1').split('.');let o=c;for(const k of keys.slice(0,-1))o=o[k];const k=keys.at(-1);assert.deepEqual(o[k]??null,e.from);o[k]=structuredClone(e.to);
 }
 assert.deepEqual(cards,replay,m+' unlogged mutation');
 console.log(m+': exact replay '+changes.length+' changes; prior report arrays preserved; >=2 source URLs per change');
}
const tmp='analysis/sweep/codex/round7-di-types.ts';
fs.writeFileSync(tmp,"import type { CatalogModelCard } from '../../../src/data/catalog/types';\n"+['daihatsu','isuzu'].map((m,i)=>`const cards${i}: CatalogModelCard[] = ${fs.readFileSync('src/data/catalog/model-cards/'+m+'.json')};`).join('\n'));
try{
 const r=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','--ignoreConfig','--noEmit','--strict','--skipLibCheck','--target','ES2022','--moduleResolution','bundler','--module','esnext',tmp],{encoding:'utf8'});
 if(r.stdout)process.stdout.write(r.stdout);if(r.stderr)process.stderr.write(r.stderr);assert.equal(r.status,0);console.log('Daihatsu and Isuzu strict catalogue types PASS');
}finally{fs.unlinkSync(tmp);}
