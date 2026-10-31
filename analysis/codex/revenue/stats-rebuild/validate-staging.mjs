import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import cp from 'node:child_process';
import assert from 'node:assert/strict';
import {isDeepStrictEqual} from 'node:util';

const root='analysis/codex/revenue/stats-rebuild',stage=`${root}/staged`;
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const run=read(`${root}/run.json`);
assert(['staged-complete','promoted'].includes(run.state),'Full staging run must finish first');
for(const {file,sha256}of run.catalog)assert.equal(sha(file),sha256,`Catalogue changed: ${file}`);
const current=run.state==='promoted'?'src/data/stats':`${stage}/stats`;
const cards=read('src/data/model-cards-index.json');
const lines=read('src/data/catalog/model-lines-auto.json');
const beforeFiles=cp.execFileSync('git',['ls-tree','--name-only',`${run.baselineRevision}:src/data/stats`],{encoding:'utf8'}).trim().split(/\r?\n/);
const old={};
for(const name of beforeFiles.filter(f=>f.endsWith('.json')))old[name.replace('.json','')]=JSON.parse(cp.execFileSync('git',['show',`${run.baselineRevision}:src/data/stats/${name}`],{encoding:'utf8',maxBuffer:20e6}));
const next={};
for(const name of fs.readdirSync(current).filter(f=>f.endsWith('.json')))next[name.replace('.json','')]=read(`${current}/${name}`);
const report={baselineRevision:run.baselineRevision,defectMetric:'regular-inspections-with-distinct-code; maximum-severity-per-inspection',
 changedMakes:[],appearedLines:[],disappearedLines:[],appearedGenerations:[],disappearedGenerations:[],coverageChanges:[],nonDefectChanges:[],examples:[],migratedLines:{},validation:{}};
let groups=0,defects=0,changedDefects=0;
const stripDefects=v=>{const c=structuredClone(v);if(c?.stk)delete c.stk.defects;return c;};
const identical=isDeepStrictEqual;
const allMakes=new Set([...Object.keys(old),...Object.keys(next)]);allMakes.delete('index');
const descriptor=(make,line,index)=>{const g=cards[make]?.[line]?.generations?.[index];return {make,line,index:Number(index),code:g?.code??null,name:g?.name??null};};
for(const make of [...allMakes].sort()){
 const b=old[make]??{},a=next[make]??{};
 if(!identical(b,a))report.changedMakes.push(make);
 for(const line of new Set([...Object.keys(b),...Object.keys(a)])){
  if(line==='meta')continue;
  if(!b[line])report.appearedLines.push({make,line});
  if(!a[line])report.disappearedLines.push({make,line});
  if(!a[line])continue;
  const lineGens=cards[make]?.[line]?.generations??lines.find(l=>l.makeSlug===make&&l.slug===line)?.generations??[];
  for(const [index,g]of Object.entries(a[line].gens??{}))assert(Number(index)>=0&&Number(index)<lineGens.length,`Out-of-range ${make}/${line}/${index}`);
  for(const index of new Set([...Object.keys(b[line]?.gens??{}),...Object.keys(a[line]?.gens??{})])){
   if(!b[line]?.gens?.[index])report.appearedGenerations.push(descriptor(make,line,index));
   if(!a[line]?.gens?.[index])report.disappearedGenerations.push(descriptor(make,line,index));
  }
  for(const [index,entry]of [['line',a[line]],...Object.entries(a[line].gens??{})]){
   const prior=index==='line'?b[line]:b[line]?.gens?.[index];
   const {gens,...base}=entry;
   const priorBase=prior?Object.fromEntries(Object.entries(prior).filter(([k])=>k!=='gens')):null;
   if(prior&&!!prior.stk!==!!entry.stk)report.coverageChanges.push({make,line,index,kind:'stk',before:!!prior.stk,after:!!entry.stk});
   if(prior&&!!prior.fleet!==!!entry.fleet)report.coverageChanges.push({make,line,index,kind:'fleet',before:!!prior.fleet,after:!!entry.fleet});
   if(prior&&!identical(stripDefects(priorBase),stripDefects(base)))report.nonDefectChanges.push({make,line,index,beforeFleet:prior.fleet?.n??null,afterFleet:entry.fleet?.n??null,beforeInspections:prior.stk?.inspections??null,afterInspections:entry.stk?.inspections??null});
   if(!entry.stk)continue;
   groups++;
   for(const d of entry.stk.defects){assert(d.share>=0&&d.share<=1);assert(d.severe>=0&&d.severe<=1);defects++;const prev=prior?.stk?.defects.find(x=>x.code===d.code);if(prev&&!identical(prev,d))changedDefects++;}
  }
 }
}
const aggregate=read(`${stage}/out/istp-agg.json`);
const totals=data=>Object.entries(data).filter(([make])=>make!=='index').reduce((s,[,make])=>({fleet:s.fleet+(make._?.fleet?.n??0),inspections:s.inspections+(make._?.stk?.inspections??0)}),{fleet:0,inspections:0});
report.publishedMakeTotals={before:totals(old),after:totals(next),note:'Current matcher/catalogue changes affect coverage; these totals exclude unpublished small/unmatched make groups.'};
assert.equal(aggregate.meta.days,run.rawDays);
let inspected=0,rawDefects=0;
for(const a of Object.values(aggregate.keys)){
 const n=Object.values(a.ages).reduce((s,row)=>s+row[0],0);inspected+=n;
 for(const row of Object.values(a.defects)){assert(row.every(x=>x>=0));assert(row[0]<=n);assert(row.slice(1).reduce((s,x)=>s+x,0)<=row[0]);rawDefects++;}
}
for(const [make,line,index]of [['skoda','octavia',2],['skoda','fabia',1],['volkswagen','golf',6]]){
 const b=old[make][line].gens[index].stk,a=next[make][line].gens[index].stk;
 report.examples.push({...descriptor(make,line,index),beforeInspections:b.inspections,afterInspections:a.inspections,defects:a.defects.slice(0,5).map(d=>{const p=b.defects.find(x=>x.code===d.code);return {code:d.code,label:d.label,beforeShare:p?.share??null,afterShare:d.share,changePercentagePoints:p?Number(((d.share-p.share)*100).toFixed(4)):null};})});
}
for(const [make,line]of [['hyundai','tucson'],['kia','ceed'],['volkswagen','caddy'],['bmw','rada-5']])report.migratedLines[`${make}/${line}`]=Object.entries(next[make][line].gens??{}).map(([i,g])=>({...descriptor(make,line,i),fleet:g.fleet?.n??null,inspections:g.stk?.inspections??null}));
assert(!next.hyundai.tucson.gens?.[0],'Announced-only Tucson V must not receive statistics');
report.validation={result:'PASS',days:aggregate.meta.days,sourcePeriod:{from:aggregate.meta.from,to:aggregate.meta.to},rawCanonicalGroups:Object.keys(aggregate.keys).length,regularInspections:inspected,rawDefectRowsValidated:rawDefects,statisticGroups:groups,displayDefectRowsValidated:defects,changedSharedDisplayDefectRows:changedDefects,generationKeys:'all in current card/source ranges',announcementOnlyTucson:'excluded'};
fs.writeFileSync(`${root}/comparison.json`,JSON.stringify(report,null,2)+'\n');
const pct=x=>x==null?'not in previous top ten':`${(x*100).toFixed(2)}%`;
const md=['# STK defect rebuild comparison','',`Baseline: ${run.baselineRevision}. Full source period: ${aggregate.meta.from}–${aggregate.meta.to}, ${aggregate.meta.days} daily files.`,
 '', 'Each three-level defect code is now counted once per regular inspection, with its maximum severity retained. Year/type matching uses current cards and ignores announced-only generation start dates. Register was reaggregated as well, so restored/moved cohorts are reported separately from the defect-only correction.',
 '',`Validated ${groups} STK statistic groups and ${defects} published defect rows; ${changedDefects} shared published rows differ (including severity proportions).`,
 '',`Line entries appeared/disappeared: ${report.appearedLines.length}/${report.disappearedLines.length}. Generation entries appeared/disappeared: ${report.appearedGenerations.length}/${report.disappearedGenerations.length}. Existing group non-defect changes: ${report.nonDefectChanges.length}. See comparison.json for every key and coverage transition.`,''];
for(const e of report.examples){md.push(`## ${e.name}`,'',`Inspections before/after: ${e.beforeInspections} / ${e.afterInspections}.`,'','| Code | Czech label | Before | After | Change pp |','|---|---|---:|---:|---:|');for(const d of e.defects)md.push(`| ${d.code} | ${d.label} | ${pct(d.beforeShare)} | ${pct(d.afterShare)} | ${d.changePercentagePoints??'—'} |`);md.push('');}
md.push('## Station feasibility','', 'Raw inspection XML contains Stanice with Cislo, Kraj, ORP and Obec children (verified structurally on a raw record). Station-level analyses are technically possible; the current aggregate intentionally drops station dimensions. Separate aggregation, station/reference-history reconciliation, denominator and case-mix review are required. No station ranking was produced.',
 '', '## Consumer guide data','', 'The shared sample retains its existing hierarchy and adds topDefects[].share, fixed-age mileageForGuide (5/8/10/12/15), facelifts, engines and technicalSources. Missing ages stay null. occurrencesPerInspection remains only as a deprecated numeric alias. Corrected rates describe inspection prevalence, not failure prediction for an individual car.');
fs.writeFileSync(`${root}/comparison.md`,md.join('\n')+'\n');
console.log(JSON.stringify(report.validation));
console.log(JSON.stringify({appearedLines:report.appearedLines.length,disappearedLines:report.disappearedLines.length,appearedGenerations:report.appearedGenerations.length,disappearedGenerations:report.disappearedGenerations.length,nonDefectChanges:report.nonDefectChanges.length}));
if(process.argv.includes('--promote')){
 assert.equal(run.state,'staged-complete');
 // Verify absolute paths before moving the directory; both destinations stay inside this workspace.
 const workspace=path.resolve('.'),production=path.resolve('src/data/stats'),replacement=path.resolve(`${stage}/stats`),backup=path.resolve(`${stage}/prior-stats`);
 for(const p of [production,replacement,backup])assert(p.startsWith(workspace+path.sep));
 assert.equal(production,path.join(workspace,'src','data','stats'));
 assert(!fs.existsSync(backup),'Backup already exists; do not overwrite');
 for(const name of fs.readdirSync(production).filter(f=>f.endsWith('.json')))assert(identical(read(`${production}/${name}`),old[name.replace('.json','')]),`Source stats edited since baseline: ${name}`);
 fs.renameSync(production,backup);
 try{fs.renameSync(replacement,production);}catch(error){fs.renameSync(backup,production);throw error;}
 run.state='promoted';run.validationReport=`${root}/comparison.json`;fs.writeFileSync(`${root}/run.json`,JSON.stringify(run,null,2)+'\n');
 console.log('Promoted complete validated statistics directory. Previous source files retained in ignored staging backup.');
}
