const fs=require('fs'),assert=require('assert/strict'),{spawnSync}=require('child_process');
const baseline=JSON.parse(fs.readFileSync('analysis/sweep/codex/TURN-6-BASELINE.json'));
for(const m of ['lexus','dodge']) {
 const path='src/data/catalog/model-cards/'+m+'.json',rp='analysis/sweep/codex/'+m+'.json';
 const cards=JSON.parse(fs.readFileSync(path)),r=JSON.parse(fs.readFileSync(rp));
 const c=cards.find(c=>c.lineSlug===(m==='lexus'?'ct':'caliber'));
 const filled=['generations[0].engines',...(m==='lexus'?['generations[0].trims','generations[0].drivetrains']:[])];
 const prior=structuredClone(c.needsReview);c.needsReview=c.needsReview.filter(x=>!filled.includes(x.field));
 if(JSON.stringify(prior)!==JSON.stringify(c.needsReview)) {
  r.cardFixesApplied.push({lineSlug:c.lineSlug,path:'needsReview',from:prior,to:c.needsReview,sources:c.generations[0].sources.slice(-2),kind:'maintenance',round:'depth-6'});
  fs.writeFileSync(path,JSON.stringify(cards,null,2)+'\n');fs.writeFileSync(rp,JSON.stringify(r,null,2)+'\n');
 }
 const b=baseline[m],replay=structuredClone(b.cards);
 for(const [k,v] of Object.entries(b.report))if(Array.isArray(v))assert.deepEqual(r[k].slice(0,v.length),v,m+' prior array '+k);
 const changes=r.cardFixesApplied.slice(b.report.cardFixesApplied.length);
 for(const e of changes) {
  assert(e.sources.length>=2);const c=replay.find(c=>c.lineSlug===e.lineSlug),keys=e.path.replace(/\[(\d+)\]/g,'.$1').split('.');
  let obj=c;for(const k of keys.slice(0,-1))obj=obj[k];const key=keys.at(-1);assert.deepEqual(obj[key]??null,e.from,m+'/'+e.path);obj[key]=structuredClone(e.to);
 }
 assert.deepEqual(cards,replay,m+' unlogged mutation');console.log(m+' exact replay '+changes.length+'; all prior report arrays preserved');
}
const tmp='analysis/sweep/codex/round6-lexus-dodge-types.ts';
fs.writeFileSync(tmp,"import type {CatalogModelCard} from '../../../src/data/catalog/types';\n"+['lexus','dodge'].map((m,i)=>`const cards${i}: CatalogModelCard[] = ${fs.readFileSync('src/data/catalog/model-cards/'+m+'.json')};`).join('\n'));
try {
 const result=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','--ignoreConfig','--noEmit','--strict','--skipLibCheck','--target','ES2022','--moduleResolution','bundler','--module','esnext',tmp],{encoding:'utf8'});
 if(result.stdout)process.stdout.write(result.stdout);if(result.stderr)process.stderr.write(result.stderr);assert.equal(result.status,0);console.log('Lexus and Dodge strict catalogue types PASS');
} finally {fs.unlinkSync(tmp);}
