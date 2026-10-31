import fs from 'node:fs';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root=process.argv.find(a=>a.startsWith('--root='))?.slice(7)??'analysis/codex/second-source-engines/wave-2-structure',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n'),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const inputs=read(root+'/rebuild-inputs.json'),migration=read(root+'/migration.json');for(const [p,sha]of Object.entries(inputs.sha256))assert.equal(hash(p),sha,`Input changed during rebuild: ${p}`);
const stk=read(root+'/staged/aggregates/istp-agg.json'),fleet=read(root+'/staged/aggregates/rsv-agg.json'),cards=read('src/data/model-cards-index.json'),selectors=read('src/data/model-lines-index.json'),index=read('src/data/stats/index.json'),partial=read(root+'/staged/stats/index.json');
assert.equal(stk.meta.days,1094);
const reports=[],publish=new Map();
for(const make of inputs.makes){
 const path=`src/data/stats/${make}.json`,before=JSON.parse(cp.execFileSync('git',['show',inputs.baselineRevision+':'+path],{maxBuffer:40e6})),after=read(root+`/staged/stats/${make}.json`);
 assert.deepEqual(after.meta,before.meta);assert.equal(after._.fleet.n,before._.fleet.n);assert.equal(after._.stk.inspections,before._.stk.inspections);
 let fleetCohorts=0,inspectionCohorts=0;
 for(const [key,v]of Object.entries(fleet.keys)){const [m,line,i]=key.split('|');if(m!==make||i===''||v.n<30)continue;assert.equal(after[line]?.gens?.[i]?.fleet?.n,v.n,key);fleetCohorts++;}
 for(const [key,v]of Object.entries(stk.keys)){const [m,line,i]=key.split('|'),n=Object.values(v.ages).reduce((s,a)=>s+a[0],0);if(m!==make||i===''||n<30)continue;assert.equal(after[line]?.gens?.[i]?.stk?.inspections,n,key);inspectionCohorts++;}
 for(const [line,d]of Object.entries(after))for(const i of Object.keys(d.gens??{}))assert(cards[make]?.[line]?.generations[+i]??selectors[make]?.find(l=>l.slug===line)?.generations?.[+i],`${make}/${line}/${i}`);
 for(const [line,d]of Object.entries(before))if(d.fleet?.n>0&&Object.keys(d.gens??{}).length&&after[line]?.fleet?.n>0)assert(Object.keys(after[line].gens??{}).length,`Existing generation cohorts lost: ${make}/${line}`);
 const lines=migration.changes.filter(f=>f.make===make).map(f=>({id:make+'/'+f.line,fleetBefore:before[f.line]?.fleet?.n??null,fleetAfter:after[f.line]?.fleet?.n??null,inspectionsBefore:before[f.line]?.stk?.inspections??null,inspectionsAfter:after[f.line]?.stk?.inspections??null,generations:cards[make][f.line].generations.map((g,i)=>({index:i,from:g.from,to:g.to,fleet:after[f.line]?.gens?.[i]?.fleet?.n??null,inspections:after[f.line]?.gens?.[i]?.stk?.inspections??null}))}));
 for(const l of lines)assert(l.generations.some(g=>g.fleet>0),`Generation population lost: ${l.id}`);
 publish.set(path,after);index.makes[make]=partial.makes[make];reports.push({make,makeFleet:after._.fleet.n,makeInspections:after._.stk.inspections,fleetCohorts,inspectionCohorts,lines});
}
for(const [path,after]of publish)fs.writeFileSync(path,JSON.stringify(after));
fs.writeFileSync('src/data/stats/index.json',JSON.stringify(index));cp.execFileSync('node',['scripts/listing-stats-index.mjs'],{stdio:'inherit'});
const outputs=[...inputs.makes.map(m=>`src/data/stats/${m}.json`),'src/data/stats/index.json','src/data/listing-stats.json'];write(root+'/statistics.json',{status:'complete',sourcePeriod:{stk:stk.meta,register:fleet.meta},rawAggregateSha256:Object.fromEntries(['istp-agg.json','rsv-agg.json'].map(p=>[p,hash(root+'/staged/aggregates/'+p)])),makeTotalsPreserved:true,allPublishableRawCohortsVerified:true,noPreviouslyPopulatedLineLostAllGenerationCohorts:true,reports,outputSha256:Object.fromEntries(outputs.map(p=>[p,hash(p)]))});migration.statisticsStatus='complete';migration.statisticsReport=root+'/statistics.json';write(root+'/migration.json',migration);console.log(JSON.stringify(reports));
