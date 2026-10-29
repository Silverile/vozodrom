import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const d='analysis/sweep/codex/',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const chery=read(d+'round8-chery-baseline.json');
const baseline={chery:chery.chery??chery,...read(d+'round8-barkas-aro-baseline.json'),...read(d+'round8-cadillac-baseline.json'),...read(d+'round8-bentley-baseline.json')};
const counts=[];
for(const [make,b]of Object.entries(baseline)){
 const report=read(d+make+'.json'),cards=structuredClone(b.cards);
 for(const [key,value]of Object.entries(b.report))if(Array.isArray(value))assert.deepEqual(report[key].slice(0,value.length),value,make+' old '+key);
 const changes=report.cardFixesApplied.slice(b.report.cardFixesApplied.length);
 for(const c of changes){
  assert(c.sources?.length>=2,make+' two evidence URLs missing');
  const card=cards.find(x=>x.lineSlug===c.lineSlug);assert(card);
  const keys=c.path.replace(/\[(\d+)\]/g,'.$1').split('.');let parent=card;
  for(const k of keys.slice(0,-1))parent=parent[k];
  assert.deepEqual(parent[keys.at(-1)]??null,c.from,make+' before mismatch '+c.path);
  parent[keys.at(-1)]=structuredClone(c.to);
 }
 assert.deepEqual(cards,read('src/data/catalog/model-cards/'+make+'.json'),make+' unlogged card mutation');
 const addedReviews=[...(report.photoReviews??[]).slice(b.report.photoReviews?.length??0),...(report.photoChecks??[]).slice(b.report.photoChecks?.length??0).flatMap(x=>x.checks??[])];
 counts.push({make,auditEntries:changes.length,changedLines:[...new Set(changes.map(x=>x.lineSlug))],photoReviewEntries:addedReviews.length});
}
const temp=d+'turn8-types-check.ts';
fs.writeFileSync(temp,"import type {CatalogModelCard} from '../../../src/data/catalog/types';\n"+Object.keys(baseline).map((m,i)=>`const c${i}: CatalogModelCard[] = ${fs.readFileSync('src/data/catalog/model-cards/'+m+'.json','utf8')};\n`).join('\n'));
try{
 const result=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','--ignoreConfig','--noEmit','--strict','--skipLibCheck','--target','ES2022','--moduleResolution','bundler','--module','esnext',temp],{encoding:'utf8'});
 process.stdout.write(result.stdout??'');process.stderr.write(result.stderr??'');assert.equal(result.status,0,'Strict catalogue types failed');
}finally{fs.unlinkSync(temp);}
console.log(JSON.stringify({exactReplay:true,priorArraysPreserved:true,twoUrlsPerOperation:true,strictTypes:true,counts,totalAuditEntries:counts.reduce((s,c)=>s+c.auditEntries,0)},null,2));
