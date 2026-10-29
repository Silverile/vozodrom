import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const dir='analysis/sweep/codex/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const {cards,report}=read(dir+'round8-cadillac-baseline.json').cadillac;
const actual=read('src/data/catalog/model-cards/cadillac.json'), after=read(dir+'cadillac.json');
for(const [k,v] of Object.entries(report)) if(Array.isArray(v))assert.deepEqual(after[k].slice(0,v.length),v,'Preserved report array '+k);
const changes=after.cardFixesApplied.slice(report.cardFixesApplied.length);
for(const ch of changes){
 assert(ch.sources.length>=2);
 let p=cards.find(c=>c.lineSlug===ch.lineSlug);const keys=ch.path.replace(/\[(\d+)\]/g,'.$1').split('.');
 for(const key of keys.slice(0,-1))p=p[key];const key=keys.at(-1);
 assert.deepEqual(p[key]??null,ch.from,ch.lineSlug+'/'+ch.path);p[key]=structuredClone(ch.to);
}
assert.deepEqual(cards,actual,'No unlogged changes');
const temp=dir+'round8-cadillac-types.tmp.ts';
fs.writeFileSync(temp,"import type {CatalogModelCard} from '../../../src/data/catalog/types';\nconst cards:CatalogModelCard[]="+JSON.stringify(actual)+';\n');
try{
 const result=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','--ignoreConfig','--noEmit','--strict','--skipLibCheck','--target','ES2022','--moduleResolution','bundler','--module','esnext',temp],{encoding:'utf8'});
 if(result.stdout)process.stdout.write(result.stdout);if(result.stderr)process.stderr.write(result.stderr);assert.equal(result.status,0);
}finally{fs.unlinkSync(temp);}
console.log(JSON.stringify({replayedOperations:changes.length,allPriorReportArraysPreserved:true,strictCatalogTypes:true,lines:actual.length,generations:actual.reduce((n,c)=>n+c.generations.length,0)}));
