import fs from 'node:fs';
const dir='analysis/sweep/codex/';
const file=dir+'PROGRESS.md';
const old=fs.readFileSync(file,'utf8');
const seen=new Set([...old.matchAll(/^\d{4}-\d\d-\d\dT\d\d:\d\dZ ([a-z-]+) /gm)].map(m=>m[1]));
const stamp=new Date().toISOString().slice(0,16)+'Z';
const added=[];
for(const name of fs.readdirSync(dir).filter(f=>/^[a-z-]+\.json$/.test(f))){
 const r=JSON.parse(fs.readFileSync(dir+name,'utf8'));if(!r.make||seen.has(r.make))continue;
 added.push(`${stamp} ${r.make} — PARTIAL: ${(r.makeFixes?.length??0)+(r.modelFixes?.length??0)} shared-field proposals, ${r.removeModels?.length??0} exclusions proposed, ${r.cardFixesApplied?.length??0} logged card changes including provenance/review metadata, ${r.missingModels?.length??0} missing-model proposals. Full per-model verification remains open.`);
}
if(added.length)fs.appendFileSync(file,'\n'+added.join('\n')+'\n');
console.log(`Appended ${added.length} make progress lines.`);
