// Apply the same conservative badge/concept exclusions to earlier importer runs.
import fs from 'node:fs';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {rejectEngine} from './engine-throughput-policy.mjs';
const root='analysis/codex/engine-throughput',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const revision=read(`${root}/session.json`).baselineRevision;
const sha=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const oldFiles=new Map(),files=new Map();let removed=0;
for(const reportFile of fs.readdirSync(root).filter(f=>/^batch-\d+\.json$/.test(f))){
 const report=read(`${root}/${reportFile}`);
 for(const row of report.lines){
  if(!row.enginesAdded)continue;
  const file=row.sourceFile;
  if(!files.has(file)){files.set(file,read(file));oldFiles.set(file,JSON.parse(cp.execFileSync('git',['show',`${revision}:${file}`],{encoding:'utf8',maxBuffer:30e6})));}
  const card=files.get(file).find(c=>c.makeSlug===row.make&&c.lineSlug===row.line);
  const before=oldFiles.get(file).find(c=>c.makeSlug===row.make&&c.lineSlug===row.line);
  assert.equal(sha(card),row.afterHash,'Concurrent card edit');
  const rejected=row.added.filter(e=>rejectEngine(row.make,row.line,e));if(!rejected.length)continue;
  removed+=rejected.length;
  row.qaExcluded=[...(row.qaExcluded??[]),...rejected.map(e=>({...e,reason:rejectEngine(row.make,row.line,e)}))];
  row.added=row.added.filter(e=>!rejectEngine(row.make,row.line,e));row.enginesAdded=row.added.length;
  for(const [i,g]of card.generations.entries()){
   const old=before.generations[i],extra=(g.engines??[]).slice(old.engines?.length??0).filter(e=>!rejectEngine(row.make,row.line,e));
   if(extra.length){g.engines=[...(old.engines??[]),...extra];g.sources=[...new Set([...(old.sources??[]),...extra.flatMap(e=>e.sources)])];}
   else for(const field of ['engines','engineCoverage','sources']){if(Object.hasOwn(old,field))g[field]=old[field];else delete g[field];}
  }
  card.sources=[...new Set([...(before.sources??[]),...row.added.flatMap(e=>e.sources)])];
  if(!row.enginesAdded){for(const key of Object.keys(card))delete card[key];Object.assign(card,structuredClone(before));row.status='no-source';row.reason='Usable extracted rows belonged to excluded sibling/experimental badges.';}
  row.afterHash=sha(card);
 }
 report.summary.touched=report.lines.filter(r=>r.enginesAdded).length;report.summary.enginesAdded=report.lines.reduce((n,r)=>n+r.enginesAdded,0);
 report.summary.noSource=report.lines.filter(r=>r.status==='no-source').length;report.summary.alreadyCovered=report.lines.filter(r=>r.status==='already-covered').length;
 fs.writeFileSync(`${root}/${reportFile}`,JSON.stringify(report,null,2)+'\n');
}
for(const [file,cards]of files)fs.writeFileSync(file,JSON.stringify(cards,null,2)+'\n');
console.log(JSON.stringify({excludedSiblingOrExperimentalRows:removed}));
