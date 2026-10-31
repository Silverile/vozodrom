import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import cp from 'node:child_process';

const root='analysis/codex/revenue/stats-rebuild';
const stage=`${root}/staged`;
const raw=path.resolve('../vozodrom-data');
const python='C:/Program Files/FreeCAD 1.0/bin/python.exe';
for(const dir of [root,stage,`${stage}/out`,`${stage}/stats`])fs.mkdirSync(dir,{recursive:true});
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const catalog=['src/data/makes-index.json','src/data/catalog/model-lines-auto.json','src/data/model-cards-index.json'];
let manifest={baselineRevision:cp.execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),python,
  rawInput:raw,rawDays:fs.readdirSync(`${raw}/istp/days`).filter(f=>f.endsWith('.xml.gz')).length,
  catalog:catalog.map(file=>({file,sha256:sha(file)})),state:'running',jobs:{}};
const save=()=>fs.writeFileSync(`${root}/run.json`,JSON.stringify(manifest,null,2)+'\n');
if(fs.existsSync(`${root}/run.json`)){
 if(!process.argv.includes('--resume'))throw new Error('Run manifest exists; use --resume after confirming its jobs stopped.');
 manifest=JSON.parse(fs.readFileSync(`${root}/run.json`,'utf8'));
 if(manifest.state==='promoted')throw new Error('This run is already promoted; do not overwrite its audit trail.');
 for(const {file,sha256}of manifest.catalog)if(sha(file)!==sha256)throw new Error(`Catalogue changed: ${file}; start a separately named staging run.`);
 for(const job of Object.values(manifest.jobs))if(job.status==='running'){
  let alive=false;try{process.kill(job.pid,0);alive=true;}catch{}
  if(alive)throw new Error(`Job pid ${job.pid} is still running; do not start a duplicate.`);
 }
}
save();
const run=(name,args)=>new Promise((resolve,reject)=>{
 if(process.argv.includes('--resume')&&manifest.jobs[name]?.status==='complete'){
  const expected=name==='build'?`${stage}/stats/index.json`:`${stage}/out/${name}-agg.json`;
  JSON.parse(fs.readFileSync(expected,'utf8'));
  console.log(`${name}: reusing completed staged output`);resolve();return;
 }
 const log=fs.openSync(`${stage}/${name}.log`,'w');
 const child=cp.spawn(python,['-B',...args],{cwd:process.cwd(),env:{...process.env,PYTHONDONTWRITEBYTECODE:'1',PYTHONUNBUFFERED:'1'},stdio:['ignore',log,log],windowsHide:true});
 manifest.jobs[name]={pid:child.pid,args,status:'running',log:`${stage}/${name}.log`};save();
 console.log(`${name}: pid ${child.pid}; log ${stage}/${name}.log`);
 child.on('error',reject);
 child.on('exit',code=>{fs.closeSync(log);manifest.jobs[name].status=code===0?'complete':'failed';manifest.jobs[name].exitCode=code;save();code===0?resolve():reject(new Error(`${name} exited ${code}`));});
});
const results=await Promise.allSettled([
 run('istp',['scripts/stats/istp-stats.py',raw,'--out-dir',`${stage}/out`,'--workers','16','--skip-unmatched-output']),
 run('rsv',['scripts/stats/rsv-stats.py',raw,'--out-dir',`${stage}/out`])
]);
if(results.some(x=>x.status==='rejected')){manifest.state='failed';save();throw new Error('A staging aggregation failed; see logs. Site statistics were not replaced.');}
for(const {file,sha256}of manifest.catalog)if(sha(file)!==sha256)throw new Error(`Catalogue changed during aggregation: ${file}; no source stats replaced`);
await run('build',['scripts/stats/build-stats.py',raw,'--aggregates-dir',`${stage}/out`,'--out-dir',`${stage}/stats`]);
manifest.state='staged-complete';save();
console.log('Complete staged result ready for validation. Production JSON has not been changed.');
