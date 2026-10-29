import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const base='analysis/sweep/codex/',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const snapshots=read(base+'ROUND6-JDL-BASELINE.json'),counts={};
for(const [m,b] of Object.entries(snapshots)){
 const r=read(base+m+'.json'),cards=read(`src/data/catalog/model-cards/${m}.json`),replay=structuredClone(b.cards);
 for(const [key,v]of Object.entries(b.report))if(Array.isArray(v))assert.deepEqual(r[key].slice(0,v.length),v);
 const changes=r.cardFixesApplied.slice(b.report.cardFixesApplied.length);counts[m]=changes.length;
 for(const x of changes){assert(x.sources.length>=2);const c=replay.find(c=>c.lineSlug===x.lineSlug),keys=x.path.replace(/\[(\d+)\]/g,'.$1').split('.');let p=c;for(const k of keys.slice(0,-1))p=p[k];assert.deepEqual(p[keys.at(-1)]??null,x.from);p[keys.at(-1)]=structuredClone(x.to);}
 assert.deepEqual(cards,replay);
}
const tmp=base+'round6-jdl-typecheck.ts';
fs.writeFileSync(tmp,"import type {CatalogModelCard} from '../../../src/data/catalog/types';\n"+Object.keys(snapshots).map((m,i)=>`const cards${i}:CatalogModelCard[]=${JSON.stringify(read(`src/data/catalog/model-cards/${m}.json`))};`).join('\n'));
try{const r=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','--ignoreConfig','--noEmit','--strict','--skipLibCheck','--target','ES2022','--moduleResolution','bundler','--module','esnext',tmp],{encoding:'utf8'});process.stdout.write(r.stdout||'');process.stderr.write(r.stderr||'');assert.equal(r.status,0);}finally{fs.unlinkSync(tmp);}
console.log(JSON.stringify({counts,reportArraysPreserved:true,allChangesReplayed:true,strictTypes:true}));
