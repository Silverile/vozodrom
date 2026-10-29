import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const base='analysis/sweep/codex/', read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const makes=['honda','lada','iveco','chevrolet','land-rover','jeep','alfa-romeo'];
const replays={};
for(const make of ['lada','land-rover','jeep','alfa-romeo']){
 const b=read(base+make.toUpperCase()+'-DEPTH-BASELINE.json'),r=read(base+make+'.json');
 for(const [k,v] of Object.entries(b.report))if(Array.isArray(v))assert.deepEqual(r[k].slice(0,v.length),v,`${make} prior ${k} changed`);
 const replay=structuredClone(b.cards),changes=r.cardFixesApplied.slice(b.report.cardFixesApplied.length);
 for(const x of changes){assert(x.sources.length>=2);const c=replay.find(c=>c.lineSlug===x.lineSlug),keys=x.path.replace(/\[(\d+)\]/g,'.$1').split('.');let o=c;for(const k of keys.slice(0,-1))o=o[k];assert.deepEqual(o[keys.at(-1)]??null,x.from,`${make}/${x.path} before mismatch`);o[keys.at(-1)]=structuredClone(x.to);}
 assert.deepEqual(read('src/data/catalog/model-cards/'+make+'.json'),replay,make+' unlogged mutation');replays[make]=changes.length;
}
const temp=base+'turn5-types-check.ts';
fs.writeFileSync(temp,"import type {CatalogModelCard} from '../../../src/data/catalog/types';\n"+makes.map((m,i)=>`const cards${i}: CatalogModelCard[] = ${fs.readFileSync('src/data/catalog/model-cards/'+m+'.json','utf8')};\n`).join('\n'));
try{const result=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','--ignoreConfig','--noEmit','--strict','--skipLibCheck','--target','ES2022','--moduleResolution','bundler','--module','esnext',temp],{encoding:'utf8'});if(result.stdout)process.stdout.write(result.stdout);if(result.stderr)process.stderr.write(result.stderr);assert.equal(result.status,0,'Strict types failed');}finally{fs.unlinkSync(temp);}
for(const m of makes){const r=read(base+m+'.json'),c=read('src/data/catalog/model-cards/'+m+'.json'),last=new Map();for(const x of r.cardFixesApplied){assert(x.sources.length);last.set(x.lineSlug+'|'+x.path,x);}for(const x of last.values()){const val=x.path.replace(/\[(\d+)\]/g,'.$1').split('.').reduce((o,k)=>o?.[k],c.find(c=>c.lineSlug===x.lineSlug));assert.deepEqual(val,x.to,m+'/'+x.path);}}
console.log(JSON.stringify({exactReplays:replays,priorArraysPreserved:true,strictTypedMakeFiles:makes,allSelectedLatestLoggedFieldsMatch:true},null,2));
