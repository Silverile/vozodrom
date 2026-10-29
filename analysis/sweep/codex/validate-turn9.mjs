import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const d='analysis/sweep/codex/',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const makes=['ds-automobiles','aixam','baic','infiniti','hummer','leapmotor','dongfeng'],counts=[];
for(const make of makes){
 const old=read(d+`round9-baseline-${make}-report.json`),r=read(d+make+'.json'),cards=read(d+`round9-baseline-${make}-card.json`);
 for(const [k,v]of Object.entries(old))if(Array.isArray(v))assert.deepEqual(r[k].slice(0,v.length),v,make+' prior '+k);
 const fixes=r.cardFixesApplied.slice(old.cardFixesApplied.length);
 for(const f of fixes){assert(f.sources?.length>=2,make+' two URLs missing '+f.path);const c=cards.find(c=>c.lineSlug===f.lineSlug);assert(c);const keys=f.path.replace(/\[(\d+)\]/g,'.$1').split('.');let o=c;for(const k of keys.slice(0,-1))o=o[k];const k=keys.at(-1);assert.deepEqual(o[k]??null,f.from,make+' before '+f.path);o[k]=structuredClone(f.to);}
 assert(JSON.stringify(cards)===JSON.stringify(read('src/data/catalog/model-cards/'+make+'.json')),make+' unlogged card changes');
 counts.push({make,auditEntries:fixes.length,changedLines:[...new Set(fixes.map(f=>f.lineSlug))]});
}
const temp=d+'turn9-types-check.ts';
fs.writeFileSync(temp,"import type {CatalogModelCard} from '../../../src/data/catalog/types';\n"+makes.map((m,i)=>`const c${i}: CatalogModelCard[] = ${fs.readFileSync('src/data/catalog/model-cards/'+m+'.json','utf8')};\n`).join('\n'));
try{const x=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','--ignoreConfig','--noEmit','--strict','--skipLibCheck','--target','ES2022','--moduleResolution','bundler','--module','esnext',temp],{encoding:'utf8'});process.stdout.write(x.stdout??'');process.stderr.write(x.stderr??'');assert.equal(x.status,0,'Strict CatalogModelCard type check');}finally{fs.unlinkSync(temp);}
console.log(JSON.stringify({exactReplay:true,oldArraysPreserved:true,twoUrlsPerOperation:true,strictTypes:true,counts,totalAuditEntries:counts.reduce((s,c)=>s+c.auditEntries,0)},null,2));
