import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const d='analysis/sweep/codex/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const baseline=Object.assign({},...['di','jf','gb'].map(tag=>read(d+`round7-${tag}-baseline.json`)));
const counts={};
for(const [make,b] of Object.entries(baseline)){
 const report=read(d+make+'.json'),cards=structuredClone(b.cards);
 for(const [key,val] of Object.entries(b.report))if(Array.isArray(val))assert.deepEqual(report[key].slice(0,val.length),val,make+' old '+key);
 const changes=report.cardFixesApplied.slice(b.report.cardFixesApplied.length);
 for(const change of changes){
  assert(change.sources?.length>=2,make+' two URLs missing');
  const card=cards.find(c=>c.lineSlug===change.lineSlug);assert(card);
  const keys=change.path.replace(/\[(\d+)\]/g,'.$1').split('.');let parent=card;
  for(const k of keys.slice(0,-1))parent=parent[k];
  assert.deepEqual(parent[keys.at(-1)]??null,change.from,make+' before mismatch');
  parent[keys.at(-1)]=structuredClone(change.to);
 }
 assert.deepEqual(cards,read('src/data/catalog/model-cards/'+make+'.json'),make+' unlogged mutation');
 counts[make]={auditEntries:changes.length,lines:[...new Set(changes.map(x=>x.lineSlug))]};
}
const root=read(d+'TURN-7-ROOT-BASELINE.json'),audi=read(d+'audi.json');
for(const [key,val] of Object.entries(root.audi))if(Array.isArray(val))assert.deepEqual(audi[key].slice(0,val.length),val,'Audi prior '+key);
assert.equal(audi.cardFixesApplied.length,root.audi.cardFixesApplied.length);
const years=read(d+'TURN-6-YEAR-RECHECK.json');
assert.equal(years.entries.length,root.year.entries.length);
for(let i=0;i<years.entries.length;i++){
 const old=root.year.entries[i],now=years.entries[i];
 if(old.make==='audi'&&old.lineSlug==='a3'&&old.path==='generations[2].from'){
  assert.equal(now.recheckStatus,'closed-series-production-year-two-publishers');
  assert.deepEqual(now.recheckHistory.at(-1),{round:6,status:old.recheckStatus,note:old.recheckNote,sources:old.recheckSources});
 }else assert.deepEqual(now,old,'Unrelated year disposition mutated');
}
const temp=d+'turn7-types-check.ts';
fs.writeFileSync(temp,"import type {CatalogModelCard} from '../../../src/data/catalog/types';\n"+Object.keys(baseline).map((m,i)=>`const c${i}: CatalogModelCard[] = ${fs.readFileSync('src/data/catalog/model-cards/'+m+'.json','utf8')};\n`).join('\n'));
try{
 const r=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','--ignoreConfig','--noEmit','--strict','--skipLibCheck','--target','ES2022','--moduleResolution','bundler','--module','esnext',temp],{encoding:'utf8'});
 process.stdout.write(r.stdout||'');process.stderr.write(r.stderr||'');assert.equal(r.status,0,'strict types failed');
}finally{fs.unlinkSync(temp);}
console.log(JSON.stringify({exactReplay:true,priorArraysPreserved:true,strictTypes:true,counts,totalAuditEntries:Object.values(counts).reduce((s,x)=>s+x.auditEntries,0)},null,2));
