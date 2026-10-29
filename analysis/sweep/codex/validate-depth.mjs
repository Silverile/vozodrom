import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const base='analysis/sweep/codex/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const baseline=read(base+'AUDI-DEPTH-BASELINE.json');
const audiReport=read(base+'audi.json');
for(const [key,value] of Object.entries(baseline.report)) {
 if(Array.isArray(value)) assert.deepEqual(audiReport[key].slice(0,value.length),value,'Existing Audi report array replaced: '+key);
}
const replay=structuredClone(baseline.cards);
const newChanges=audiReport.cardFixesApplied.slice(baseline.report.cardFixesApplied.length);
for(const x of newChanges){
 assert(x.sources.length>0);
 const c=replay.find(c=>c.lineSlug===x.lineSlug);
 const keys=x.path.replace(/\[(\d+)\]/g,'.$1').split('.');let p=c;
 for(const k of keys.slice(0,-1))p=p[k];
 const key=keys.at(-1);assert.deepEqual(p[key]??null,x.from,'Before-value mismatch: '+x.path);
 p[key]=structuredClone(x.to);
}
assert.deepEqual(read('src/data/catalog/model-cards/audi.json'),replay,'Unlogged Audi edit');
const daciaBaseline=read(base+'DACIA-DEPTH-BASELINE.json');
const daciaReport=read(base+'dacia.json');
const daciaReplay=structuredClone(daciaBaseline.cards);
for(const [key,value] of Object.entries(daciaBaseline.report))if(Array.isArray(value))assert.deepEqual(daciaReport[key].slice(0,value.length),value,'Existing Dacia report entries replaced: '+key);
const daciaChanges=daciaReport.cardFixesApplied.slice(daciaBaseline.report.cardFixesApplied.length);
for(const x of daciaChanges){
 const c=daciaReplay.find(c=>c.lineSlug===x.lineSlug),keys=x.path.replace(/\[(\d+)\]/g,'.$1').split('.');let p=c;
 for(const k of keys.slice(0,-1))p=p[k];const key=keys.at(-1);
 assert.deepEqual(p[key]??null,x.from);p[key]=structuredClone(x.to);assert(x.sources.length>=2);
}
assert.deepEqual(read('src/data/catalog/model-cards/dacia.json'),daciaReplay,'Unlogged Dacia edit');
let proposals=0;
for(const make of ['ford','hyundai']){
 const r=read(base+make+'.json'),cards=read('src/data/model-cards/'+make+'.json');
 const depth=r.modelFixes.filter(x=>x.passType==='DEPTH'||x.pass==='DEPTH 2026-10-29');
 for(const p of depth){
  const c=cards.find(c=>c.lineSlug===p.slug);assert(c);
  const val=p.field.replace(/\[(\d+)\]/g,'.$1').split('.').reduce((a,k)=>a?.[k],c);
  assert.deepEqual(val??null,p.from,make+'/'+p.slug+'/'+p.field+' stale proposal');
  assert(p.sources.length>=2,make+' proposal missing corroborating URLs');proposals++;
 }
}
const makes=['audi','kia','bmw','citroen','fiat','dacia'];
const temp=base+'depth-types-check.ts';
const text="import type {CatalogModelCard} from '../../../src/data/catalog/types';\n"+makes.map((m,i)=>`const cards${i}: CatalogModelCard[] = ${fs.readFileSync('src/data/catalog/model-cards/'+m+'.json','utf8')};\n`).join('\n');
fs.writeFileSync(temp,text);
try{
 const result=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','--ignoreConfig','--noEmit','--strict','--skipLibCheck','--target','ES2022','--moduleResolution','bundler','--module','esnext',temp],{encoding:'utf8'});
 if(result.stdout)process.stdout.write(result.stdout);if(result.stderr)process.stderr.write(result.stderr);
 assert.equal(result.status,0,'Depth cards fail strict catalogue types');
}finally{fs.unlinkSync(temp);}
console.log(JSON.stringify({audiChangesReplayed:newChanges.length,daciaChangesReplayed:daciaChanges.length,priorAudiAndDaciaReportEntriesPreserved:true,winningFileProposalsChecked:proposals,strictlyTypedMakeFiles:makes},null,2));
