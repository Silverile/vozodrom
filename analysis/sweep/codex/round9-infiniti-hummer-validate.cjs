const fs=require('node:fs'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process');
const b='analysis/sweep/codex/',read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
for(const make of ['infiniti','hummer']){
 const baseline=read(b+'round9-baseline-'+make+'-report.json'),r=read(b+make+'.json'),cards=read(b+'round9-baseline-'+make+'-card.json');
 for(const [k,v] of Object.entries(baseline))if(Array.isArray(v))assert.deepEqual(r[k].slice(0,v.length),v,k+' prior entries changed');
 const edits=r.cardFixesApplied.slice(baseline.cardFixesApplied.length);
 for(const edit of edits){assert(edit.sources.length>=2);const keys=edit.path.replace(/\[(\d+)\]/g,'.$1').split('.');let p=cards.find(c=>c.lineSlug===edit.lineSlug);for(const k of keys.slice(0,-1))p=p[k];const k=keys.at(-1);assert.deepEqual(p[k]??null,edit.from);p[k]=structuredClone(edit.to);}
 assert.deepEqual(cards,read('src/data/catalog/model-cards/'+make+'.json'));
 console.log(make,JSON.stringify({loggedEdits:edits.length,substantiveEdits:edits.filter(x=>!x.kind).length,allOldReportArraysPreserved:true,exactReplay:true}));
}
const temp=b+'round9-infiniti-hummer-types.ts';
fs.writeFileSync(temp,"import type { CatalogModelCard } from '../../../src/data/catalog/types';\n"+['infiniti','hummer'].map((m,i)=>`const cards${i}: CatalogModelCard[] = ${JSON.stringify(read('src/data/catalog/model-cards/'+m+'.json'))};`).join('\n'));
try{const result=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','--ignoreConfig','--noEmit','--strict','--skipLibCheck','--target','ES2022','--moduleResolution','bundler','--module','esnext',temp],{encoding:'utf8'});process.stdout.write(result.stdout||'');process.stderr.write(result.stderr||'');assert.equal(result.status,0);console.log('Strict card types PASS');}finally{fs.unlinkSync(temp);}
