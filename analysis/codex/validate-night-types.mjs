import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const root='analysis/codex/';
const reports=fs.readdirSync(root).filter(f=>/^night-.*-report\.json$/.test(f));
const files=reports.map(f=>`src/data/catalog/model-cards/${f.replace(/^night-|\-report\.json$/g,'')}.json`);
const check=path.resolve(root,'night-types-check.ts');
const header="import type {CatalogModelCard, CatalogModelLine} from '../../src/data/catalog/types';\n";
const additions=JSON.parse(fs.readFileSync('src/data/catalog/model-line-additions.json','utf8'));
// Bound compiler union inference while checking every entry against the same strict type.
const additionChunks=[];for(let i=0;i<additions.length;i+=100)additionChunks.push(`const additions${i/100}: (CatalogModelLine & {additionReason?: string})[] = ${JSON.stringify(additions.slice(i,i+100))};\n`);
const text=header+files.map((p,i)=>`const cards${i}: CatalogModelCard[] = ${fs.readFileSync(p,'utf8')};\n`).join('\n')+additionChunks.join('\n');
fs.writeFileSync(check,text);
try {
 const result=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','--ignoreConfig','--noEmit','--strict','--skipLibCheck','--target','ES2022','--moduleResolution','bundler','--module','esnext',check],{encoding:'utf8'});
 if(result.stdout)process.stdout.write(result.stdout);
 if(result.stderr)process.stderr.write(result.stderr);
 if(result.status!==0)throw Error('Strict catalogue type validation failed, exit '+result.status);
 console.log(`PASS: ${files.length} make files and all model-line additions satisfy strict catalogue types.`);
}finally{fs.unlinkSync(check);}
