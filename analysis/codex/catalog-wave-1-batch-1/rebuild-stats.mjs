import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import cp from 'node:child_process';
import assert from 'node:assert/strict';
const root='analysis/codex/catalog-wave-1-batch-1',stage=`${root}/staged`;
const raw=path.resolve('../vozodrom-data'),python='C:/Program Files/FreeCAD 1.0/bin/python.exe';
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const baseline=read(`${root}/baseline.json`);
const inputs=['src/data/makes-index.json','src/data/catalog/model-lines-auto.json','src/data/model-cards-index.json','scripts/stats/match.py'];
const fingerprints=Object.fromEntries(inputs.map(p=>[p,sha(p)]));
assert(!fs.existsSync(`${root}/stats-run.json`),'Do not overwrite a previous run');
fs.mkdirSync(`${stage}/out`,{recursive:true});fs.mkdirSync(`${stage}/stats`,{recursive:true});
const manifest={state:'running',inputs:fingerprints,rawDays:fs.readdirSync(`${raw}/istp/days`).filter(f=>f.endsWith('.xml.gz')).length,jobs:{}};
const save=()=>fs.writeFileSync(`${root}/stats-run.json`,JSON.stringify(manifest,null,2)+'\n');save();
const run=(name,args)=>new Promise((resolve,reject)=>{
 const log=fs.openSync(`${stage}/${name}.log`,'w');
 const child=cp.spawn(python,['-B',...args],{env:{...process.env,PYTHONDONTWRITEBYTECODE:'1',PYTHONUNBUFFERED:'1'},stdio:['ignore',log,log],windowsHide:true});
 manifest.jobs[name]={args,pid:child.pid,state:'running'};save();console.log(`${name}: pid ${child.pid}`);
 child.on('error',reject);child.on('exit',code=>{fs.closeSync(log);manifest.jobs[name].state=code===0?'complete':'failed';manifest.jobs[name].exitCode=code;save();code===0?resolve():reject(Error(`${name} failed: ${code}`));});
});
await Promise.all([
 run('istp',['scripts/stats/istp-stats.py',raw,'--out-dir',`${stage}/out`,'--workers','16','--skip-unmatched-output']),
 run('rsv',['scripts/stats/rsv-stats.py',raw,'--out-dir',`${stage}/out`])
]);
for(const [p,h]of Object.entries(fingerprints))assert.equal(sha(p),h,`Input changed during run ${p}`);
await run('build',['scripts/stats/build-stats.py',raw,'--aggregates-dir',`${stage}/out`,'--out-dir',`${stage}/stats`]);
const current=read('src/data/model-cards-index.json'),validated=[];
for(const make of ['peugeot','dacia']){
 const file=`src/data/stats/${make}.json`,next=read(`${stage}/stats/${make}.json`);
 assert.equal(sha(file),baseline.protectedFiles[file],`Concurrent source statistics edit ${file}`);
 for(const [line,s]of Object.entries(next)){
  if(line==='meta'||line==='_')continue;
  for(const [index,g]of Object.entries(s.gens??{})){
   const generation=current[make]?.[line]?.generations?.[index];assert(generation,`Invalid statistics key ${make}/${line}/${index}`);
   for(const [year]of g.fleet?.years??[])assert(year>=generation.from,`Fleet year before production ${make}/${line}/${index}/${year}`);
   for(const d of g.stk?.defects??[])assert(d.share>=0&&d.share<=1);
  }
 }
 validated.push({make,source:file,sha256:sha(`${stage}/stats/${make}.json`),meta:next.meta});
}
// Publish only makes whose generation definitions changed. Other makes remain byte-identical.
for(const make of ['peugeot','dacia'])fs.copyFileSync(`${stage}/stats/${make}.json`,`src/data/stats/${make}.json`);
manifest.state='complete';manifest.promoted=validated;save();console.log('Complete recalculation promoted for Peugeot and Dacia only.');
