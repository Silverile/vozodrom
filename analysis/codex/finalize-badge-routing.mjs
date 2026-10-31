import fs from 'node:fs';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root='analysis/codex/badge-routing',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n'),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const baselineStats=make=>JSON.parse(cp.execFileSync('git',['show',`00206d5:src/data/stats/${make}.json`],{maxBuffer:30e6}));
const inputs=read(root+'/rebuild-inputs.json');for(const [p,sha]of Object.entries(inputs.sha256))assert.equal(hash(p),sha,`Input changed during rebuild: ${p}`);
const stk=read(root+'/staged/aggregates/istp-agg.json'),fleet=read(root+'/staged/aggregates/rsv-agg.json'),cards=read('src/data/model-cards-index.json'),lines=read('src/data/model-lines-index.json'),stage=root+'/staged/stats';
assert.equal(stk.meta.days,1094);assert.equal(stk.meta.from,'2023-10-12');assert.equal(stk.meta.to,'2026-10-11');
const files=new Map(),deltas=[],empty=[],rawGroups=new Map();
for(const [key,v]of Object.entries(fleet.keys)){const [make,line,gen]=key.split('|');if(gen!=='')rawGroups.set(key,{fleet:v.n});}
for(const [key,v]of Object.entries(stk.keys)){const [make,line,gen]=key.split('|');if(gen!=='')rawGroups.set(key,{...rawGroups.get(key),stk:Object.values(v.ages).reduce((n,r)=>n+r[0],0)});}
for(const make of inputs.makes){const before=baselineStats(make),after=read(`${stage}/${make}.json`);assert.deepEqual(after.meta,before.meta);assert.equal(after._?.fleet?.n,before._?.fleet?.n,`Make fleet changed: ${make}`);assert.equal(after._?.stk?.inspections,before._?.stk?.inspections,`Make inspection total changed: ${make}`);
 for(const line of new Set([...Object.keys(before),...Object.keys(after)])){if(line==='meta'||line==='_')continue;const a=before[line],b=after[line];if(a?.fleet?.n!==b?.fleet?.n||a?.stk?.inspections!==b?.stk?.inspections)deltas.push({id:`${make}/${line}`,beforeFleet:a?.fleet?.n??null,afterFleet:b?.fleet?.n??null,beforeInspections:a?.stk?.inspections??null,afterInspections:b?.stk?.inspections??null});if(!b)continue;
  const gs=cards[make]?.[line]?.generations??lines[make]?.find(l=>l.slug===line)?.generations??[];for(const g of Object.keys(b.gens??{}))assert(gs[Number(g)],`Invalid generation key: ${make}/${line}/${g}`);
  if(b.fleet?.n&&!Object.keys(b.gens??{}).length){const matched=[...rawGroups].filter(([k])=>k.startsWith(`${make}|${line}|`));assert(!matched.some(([,v])=>(v.fleet??0)>=30||(v.stk??0)>=30));empty.push({id:`${make}/${line}`,fleet:b.fleet.n,reason:matched.length?'All generation cohorts below minimum 30':'No matched dated generation in raw aggregates'});}
 }files.set(make,after);
}
for(const [key,v]of rawGroups){const [make,line,gen]=key.split('|'),out=files.get(make)?.[line]?.gens?.[gen];if((v.fleet??0)>=30)assert.equal(out?.fleet?.n,v.fleet,`Lost raw fleet cohort ${key}`);if((v.stk??0)>=30)assert.equal(out?.stk?.inspections,v.stk,`Lost raw inspection cohort ${key}`);}
const bmwBefore=baselineStats('bmw');assert(files.get('bmw')['rada-3'].fleet.n>bmwBefore['rada-3'].fleet.n,'BMW 3 fleet did not recover');
// No public statistics are replaced until every make and raw cohort passes.
for(const [make,data]of files)fs.writeFileSync(`src/data/stats/${make}.json`,JSON.stringify(data));const global=read('src/data/stats/index.json'),partial=read(stage+'/index.json');assert.deepEqual(global.meta,partial.meta);for(const [make,data]of Object.entries(partial.makes))global.makes[make]=data;fs.writeFileSync('src/data/stats/index.json',JSON.stringify(global));cp.execFileSync('node',['scripts/listing-stats-index.mjs'],{stdio:'inherit'});
const paths=[...files.keys()].map(m=>`src/data/stats/${m}.json`).concat(['src/data/stats/index.json','src/data/listing-stats.json']);
const result={status:'complete',baseline:inputs.baseline,affectedMakes:inputs.makes,sourcePeriod:{stk:stk.meta,register:fleet.meta,minN:30},makeTotalsPreserved:true,everyPublishableRawGenerationCohortVerified:true,emptyGenerationExceptions:empty,lineChanges:deltas,publishedOutputSha256:Object.fromEntries(paths.map(p=>[p,hash(p)])),inputAggregates:['istp-agg.json','rsv-agg.json'].map(f=>({name:f,sha256:hash(root+'/staged/aggregates/'+f)}))};write(root+'/statistics-rebuild.json',result);console.log(JSON.stringify({status:result.status,makes:inputs.makes.length,lineChanges:deltas.length,emptyGenerationExceptions:empty.length,bmw3Before:bmwBefore['rada-3'].fleet.n,bmw3After:files.get('bmw')['rada-3'].fleet.n}));
