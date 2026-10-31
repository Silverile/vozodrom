import fs from 'node:fs';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root='analysis/codex/structure-pass-5',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
const fingerprint=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const inputs=read(`${root}/rebuild-inputs.json`);for(const [p,h]of Object.entries(inputs.sha256))assert.equal(fingerprint(p),h,`Matcher/catalogue changed during raw rebuild: ${p}`);
const rsv=read(`${root}/staged/aggregates/rsv-agg.json`),istp=read(`${root}/staged/aggregates/istp-agg.json`),stage=`${root}/staged/stats`,minN=30;
assert.equal(istp.meta.days,1094);assert.equal(istp.meta.from,'2023-10-12');assert.equal(istp.meta.to,'2026-10-11');
const cards=read('src/data/model-cards-index.json'),lineIndex=read('src/data/model-lines-index.json'),raw=new Map();
for(const [key,value]of Object.entries(rsv.keys)){const [make,line,gen]=key.split('|'),id=`${make}/${line}`;if(!raw.has(id))raw.set(id,{fleet:[],stk:[]});if(gen!=='')raw.get(id).fleet.push({gen,n:value.n});else raw.get(id).unmatched=value;}
for(const [key,value]of Object.entries(istp.keys)){const [make,line,gen]=key.split('|'),id=`${make}/${line}`;if(!raw.has(id))raw.set(id,{fleet:[],stk:[]});if(gen!=='')raw.get(id).stk.push({gen,n:Object.values(value.ages).reduce((n,row)=>n+row[0],0)});}
const staged=new Map(),exceptions=[],lineChanges=[];let nonempty=0,eligible=0;
for(const make of inputs.makes){
 const p=`${stage}/${make}.json`,oldPath=`src/data/stats/${make}.json`;
 if(!fs.existsSync(p)){assert(!fs.existsSync(oldPath),`Existing make missing from complete staged output: ${make}`);continue;}
 const data=read(p),before=fs.existsSync(oldPath)?read(oldPath):null;
 if(before){assert.deepEqual(data.meta,before.meta);assert.equal(data._?.fleet?.n,before._?.fleet?.n,`Make fleet total changed: ${make}`);assert.equal(data._?.stk?.inspections,before._?.stk?.inspections,`Make inspection total changed: ${make}`);}
 for(const [line,value]of Object.entries(data)){
  if(line==='meta'||line==='_')continue;
  const identity=`${make}/${line}`,gs=cards[make]?.[line]?.generations??lineIndex[make]?.find(l=>l.slug===line)?.generations??[];
  for(const i of Object.keys(value.gens??{}))assert(gs[Number(i)],`Staged statistics key out of range: ${identity}/${i}`);
  if(before?.[line]?.fleet?.n!==value.fleet?.n||before?.[line]?.stk?.inspections!==value.stk?.inspections)lineChanges.push({id:identity,beforeFleet:before?.[line]?.fleet?.n??null,afterFleet:value.fleet?.n??null,beforeInspections:before?.[line]?.stk?.inspections??null,afterInspections:value.stk?.inspections??null});
  if(!value.fleet?.n)continue;eligible++;
  if(Object.keys(value.gens??{}).length){nonempty++;continue;}
  const groups=raw.get(identity)??{fleet:[],stk:[]};
  assert(!groups.fleet.some(g=>g.n>=minN)&&!groups.stk.some(g=>g.n>=minN),`Publishable raw generation group was lost: ${identity}`);
  const matched=groups.fleet.reduce((n,g)=>n+g.n,0)+groups.stk.reduce((n,g)=>n+g.n,0);
  const dated=gs.filter(g=>g.from&&g.dateBasis!=='announcement');
  const unmatchedYears=groups.unmatched?.years??{};
  if(!matched)for(const [year,n]of Object.entries(unmatchedYears))assert(!dated.some(g=>Number(year)>=g.from&&(g.to==null||Number(year)<=g.to)),`Matchable vehicle year left unassigned: ${identity}/${year}/${n}`);
  exceptions.push({id:identity,fleet:value.fleet.n,cause:matched?'Each matched generation group is below the privacy minimum of 30':!dated.length?'No dated produced generation exists':'Raw years are missing or outside the documented production periods',matchedFleet:groups.fleet.reduce((n,g)=>n+g.n,0),matchedInspections:groups.stk.reduce((n,g)=>n+g.n,0),unmatchedFleetYears:unmatchedYears});
 }
 if(before)for(const [line,value]of Object.entries(before))if(line!=='_'&&line!=='meta'&&!data[line])lineChanges.push({id:`${make}/${line}`,beforeFleet:value.fleet?.n??null,afterFleet:null,beforeInspections:value.stk?.inspections??null,afterInspections:null,reason:'No remaining publishable line group after dated-bound matching'});
 staged.set(make,data);
}
const previousInputs=read('analysis/codex/structure-pass-4/rebuild-inputs.json');assert.equal(fingerprint('scripts/stats/match.py'),previousInputs.sha256['scripts/stats/match.py'],'Matcher differs from previous make rebuild');
const covered=new Set([...inputs.previousNewMatcherMakes,...inputs.makes]);for(const make of inputs.allMakes)assert(covered.has(make),'Global matcher coverage missing '+make);
for(const make of inputs.previousNewMatcherMakes.filter(m=>!inputs.makes.includes(m))){const file='src/data/stats/'+make+'.json';if(!fs.existsSync(file))continue;const committed=JSON.parse(cp.execFileSync('git',['show','82ff28c:'+file],{maxBuffer:20e6}));assert.deepEqual(read(file),committed,'Previously rebuilt make changed without another raw rebuild: '+make);}
const globalMatcherCoverage={inventoryMakes:inputs.allMakes.length,coveredMakes:covered.size,reusedMakes:inputs.previousNewMatcherMakes.filter(m=>!inputs.makes.includes(m)),previousMatcherFingerprintVerified:true};
// Publish only after checking every staged make and every empty generation group.
for(const [make,data]of staged)fs.writeFileSync(`src/data/stats/${make}.json`,JSON.stringify(data));
const globalIndex=read('src/data/stats/index.json'),partialIndex=read(`${stage}/index.json`);assert.deepEqual(globalIndex.meta,partialIndex.meta);for(const [make,value]of Object.entries(partialIndex.makes))globalIndex.makes[make]=value;fs.writeFileSync('src/data/stats/index.json',JSON.stringify(globalIndex));
cp.execFileSync('node',['scripts/listing-stats-index.mjs'],{stdio:'inherit'});
const pass3=read(`${root}/report.json`),pending=pass3.pendingStatistics;
const coverage=pending.map(id=>{const [make,line]=id.split('/'),value=staged.get(make)?.[line];return {id,fleet:value?.fleet?.n??null,generationKeys:Object.keys(value?.gens??{}),exception:exceptions.find(e=>e.id===id)?.cause??null};});
const result={status:'complete',requestedMakes:inputs.makes.length,recomputedMakes:staged.size,sourcePeriod:{register:rsv.meta,stk:istp.meta,minN},catalogueAndMatcherFingerprintsVerified:true,makeTotalsPreserved:true,globalMatcherCoverage,fleetLinesChecked:eligible,nonemptyGenerationLines:nonempty,emptyGenerationExceptions:exceptions,lineMatchingChanges:lineChanges,batchCoverage:coverage,publishedOutputSha256:Object.fromEntries([...staged.keys()].map(make=>`src/data/stats/${make}.json`).concat(['src/data/stats/index.json','src/data/listing-stats.json']).map(p=>[p,fingerprint(p)])),inputAggregates:['rsv-agg.json','istp-agg.json'].map(name=>({name,sha256:fingerprint(`${root}/staged/aggregates/${name}`)}))};
write(`${root}/statistics-rebuild.json`,result);pass3.statisticsStatus='rebuilt';pass3.statisticsReport=`${root}/statistics-rebuild.json`;write(`${root}/report.json`,pass3);
const progress=read('analysis/codex/catalog-sweep-progress.json');progress.pendingStatisticsRebuild=null;progress.lastRawStatisticsRebuild={report:`${root}/statistics-rebuild.json`,makes:inputs.makes,coveredPasses:[4,5]};write('analysis/codex/catalog-sweep-progress.json',progress);
console.log(JSON.stringify({status:result.status,requestedMakes:result.requestedMakes,recomputedMakes:result.recomputedMakes,fleetLinesChecked:eligible,nonemptyGenerationLines:nonempty,exceptions:exceptions.length,pendingLines:pending.length,emptyPending:coverage.filter(x=>x.fleet&&!x.generationKeys.length)}));
