import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const dir='analysis/sweep/codex/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const baseline=read(dir+'TURN-6-BASELINE.json');
const counts={};
for(const [make,b] of Object.entries(baseline)){
 const report=read(dir+make+'.json');
 for(const [key,val] of Object.entries(b.report))if(Array.isArray(val))assert.deepEqual(report[key].slice(0,val.length),val,make+' prior '+key+' changed');
 const cards=structuredClone(b.cards),changes=report.cardFixesApplied.slice(b.report.cardFixesApplied.length);
 for(const change of changes){
  assert(change.sources?.length>=2,make+' new audit needs two source URLs');
  const card=cards.find(c=>c.lineSlug===change.lineSlug);assert(card);
  const keys=change.path.replace(/\[(\d+)\]/g,'.$1').split('.');let obj=card;
  for(const k of keys.slice(0,-1))obj=obj[k];
  assert.deepEqual(obj[keys.at(-1)]??null,change.from,`${make}/${change.lineSlug}/${change.path} before mismatch`);
  obj[keys.at(-1)]=structuredClone(change.to);
 }
 assert.deepEqual(cards,read('src/data/catalog/model-cards/'+make+'.json'),make+' unlogged mutation');
 counts[make]=changes.length;
}
const temp=dir+'turn6-types-check.ts';
fs.writeFileSync(temp,"import type {CatalogModelCard} from '../../../src/data/catalog/types';\n"+Object.keys(baseline).map((m,i)=>`const cards${i}: CatalogModelCard[] = ${fs.readFileSync('src/data/catalog/model-cards/'+m+'.json','utf8')};\n`).join('\n'));
try{
 const result=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','--ignoreConfig','--noEmit','--strict','--skipLibCheck','--target','ES2022','--moduleResolution','bundler','--module','esnext',temp],{encoding:'utf8'});
 if(result.stdout)process.stdout.write(result.stdout);if(result.stderr)process.stderr.write(result.stderr);assert.equal(result.status,0,'Strict types failed');
}finally{fs.unlinkSync(temp);}
console.log(JSON.stringify({priorArraysPreserved:true,exactReplay:true,strictTypedMakes:Object.keys(baseline),newAuditOperations:counts,total:Object.values(counts).reduce((a,b)=>a+b,0)},null,2));
