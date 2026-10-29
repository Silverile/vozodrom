const fs=require('fs'),assert=require('assert/strict'),{spawnSync}=require('child_process');
const baseline=JSON.parse(fs.readFileSync('analysis/sweep/codex/round7-jf-baseline.json'));
for(const make of ['jaecoo','ferrari']) {
 const cards=JSON.parse(fs.readFileSync('src/data/catalog/model-cards/'+make+'.json'));
 const report=JSON.parse(fs.readFileSync('analysis/sweep/codex/'+make+'.json'));
 const prior=baseline[make],replay=structuredClone(prior.cards);
 for(const [key,value]of Object.entries(prior.report))if(Array.isArray(value))assert.deepEqual(report[key].slice(0,value.length),value,'prior report array '+key);
 const changes=report.cardFixesApplied.slice(prior.report.cardFixesApplied.length);
 for(const e of changes){assert(e.sources.length>=2);const c=replay.find(c=>c.lineSlug===e.lineSlug),keys=e.path.replace(/\[(\d+)\]/g,'.$1').split('.');let o=c;for(const k of keys.slice(0,-1))o=o[k];const key=keys.at(-1);assert.deepEqual(o[key]??null,e.from,make+'/'+e.path);o[key]=structuredClone(e.to);}
 assert.deepEqual(replay,cards,'unlogged card mutation '+make);
 console.log(make+' exact replay PASS: '+changes.length+' entries; prior report arrays preserved');
}
const tmp='analysis/sweep/codex/round7-jf-types.ts';
fs.writeFileSync(tmp,"import type {CatalogModelCard} from '../../../src/data/catalog/types';\n"+['jaecoo','ferrari'].map((m,i)=>`const cards${i}: CatalogModelCard[] = ${fs.readFileSync('src/data/catalog/model-cards/'+m+'.json')};`).join('\n'));
try{const result=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','--ignoreConfig','--noEmit','--strict','--skipLibCheck','--target','ES2022','--moduleResolution','bundler','--module','esnext',tmp],{encoding:'utf8'});process.stdout.write(result.stdout||'');process.stderr.write(result.stderr||'');assert.equal(result.status,0);console.log('Jaecoo and Ferrari strict catalog type check PASS');}finally{fs.unlinkSync(tmp);}
