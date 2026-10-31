// Ordinary wave research is staged separately from mutations. One root per batch.
import fs from 'node:fs';import cp from 'node:child_process';import crypto from 'node:crypto';import assert from 'node:assert/strict';
import {normalizeVariant,powerValues,evidenceProblem,balancedBrackets,labelFromStoredFacts,rejectEngine} from './engine-throughput-policy.mjs';
const root=process.argv.find(a=>a.startsWith('--root='))?.slice(7)??'analysis/codex/wave-3/batch-1';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n'),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const queue=read(root+'/queue.json'),research=read(root+'/research.json'),index=read('src/data/model-cards-index.json');
assert(research.complete&&!research.rateLimited,'Research not finished');assert.equal(research.lines.length,queue.lines.length);assert.equal(new Set(research.lines.map(x=>x.id)).size,queue.lines.length);
const overrides=fs.existsSync(root+'/review.json')?read(root+'/review.json'):{};
const files=new Map(),owners=new Map();
for(const dir of ['src/data/catalog/model-cards','src/data/model-cards'])for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.json'))){const path=dir+'/'+f,rows=read(path);files.set(path,rows);for(const c of rows)owners.set(c.makeSlug+'/'+c.lineSlug,{path,card:c});}
const lines=[],rejected=[],proofs=[],aliasChanges=[];const gid=g=>g.code??`${g.from??'?'}\u2013${g.to??'?'}`;
for(const r of research.lines){const [make,line]=r.id.split('/'),owner=owners.get(r.id),before=index[make][line];assert(owner);const c=owner.card,changes=[];
 for(const candidate of r.generations){const i=candidate.index,g=c.generations[i],old=before.generations[i];assert(g);assert.deepEqual(candidate.before,{from:old.from,to:old.to,bodyTypes:old.bodyTypes});const decision=overrides[r.id+'/'+i]??{};
  if(candidate.changes.dates&&!decision.skipDates){
   // Fill gaps only: introduction/prototype years and family envelopes must never replace known dates.
   const dates=[g.from??candidate.changes.dates[0],g.to??candidate.changes.dates[1]],e=candidate.dateEvidence;
   const generic=/^(?:contents|inhalt|inhaltsverzeichnis)?$/i.test(e?.heading??'');
   if((c.generations.length>1&&generic)||g.dateBasis==='announcement'||candidate.prototypeStartCaution&&g.from==null||!e||dates[0]==null||dates[1]!=null&&dates[1]<dates[0])rejected.push({id:r.id,index:i,kind:'dates',reason:'Uncertain production start, announcement or whole-family envelope',candidate: candidate.changes.dates});
   else if(g.from!==dates[0]||g.to!==dates[1]){const prior={code:g.code,from:g.from,to:g.to};g.from=dates[0];g.to=dates[1];if(g.to!=null)g.productionStatus='ended';else if(/present|seit|current/i.test(e.productionText))g.productionStatus='current';g.sources=[...new Set([...(g.sources??[]),e.url])];changes.push({index:i,kind:'dates',before:[old.from,old.to],after:dates,evidence:e});if(gid(prior)!==gid(g))aliasChanges.push({makeSlug:make,lineSlug:line,from:gid(prior),to:gid(g)});}
  }
  if(candidate.changes.bodyTypes&&!g.bodyTypes?.length&&!decision.skipBodies){
   if(r.id==='arcfox/alpha-s'){rejected.push({id:r.id,index:i,kind:'bodies',reason:'Infobox SUV claim conflicts with model identity; leave absent pending explicit liftback source'});}
   else{assert(candidate.bodyEvidence?.url);g.bodyTypes=decision.bodyTypes??candidate.changes.bodyTypes;g.sources=[...new Set([...(g.sources??[]),candidate.bodyEvidence.url])];changes.push({index:i,kind:'bodyTypes',after:g.bodyTypes,evidence:candidate.bodyEvidence});}
  }
  const seen=new Set((g.engines??[]).flatMap(e=>powerValues(e).map(kw=>e.variant.toLowerCase()+'|'+kw)));
  for(const raw of candidate.engines){let e=structuredClone(raw);e.variant=normalizeVariant(e.variant);if(!e.variant||e.variant.length>40||!balancedBrackets(e.variant)||/^(?:Hardtop|Softtop)$|\b(?:Limousine|Touring)$/i.test(e.variant))e.variant=labelFromStoredFacts(e);if(!e.variant||e.variant.length>40||!balancedBrackets(e.variant)){rejected.push({id:r.id,index:i,kind:'engine',reason:'No short technical name'});continue;}
   const reason=evidenceProblem(g,i,e)??rejectEngine(make,line,e);if(reason){rejected.push({id:r.id,index:i,kind:'engine',variant:e.variant,reason});continue;}
   // Infobox fallback must contain a single explicit vehicle output and recorded fuel evidence.
   const scope=e.sourceScope;
   if(scope?.powerHeader==='Power output'){
    const kw=[...new Set([...scope.powerText.matchAll(/(\d+(?:[.,]\d+)?)\s*kW\b/g)].map(m=>Number(m[1].replace(',','.'))))];assert.deepEqual(kw,[e.powerKwMin]);assert.equal(e.powerKwMin,e.powerKwMax);
    if(e.fuel==='electric')assert(scope.electricMotorText&&!scope.engineText);else assert(scope.fuelEvidence&&scope.engineText);
   }
   const fresh=powerValues(e).filter(kw=>!seen.has(e.variant.toLowerCase()+'|'+kw));if(!fresh.length)continue;e.availablePowerKw=fresh;e.powerKwMin=Math.min(...fresh);e.powerKwMax=Math.max(...fresh);e.powerRangeCoverage='documented-versions-only';assert(e.sources?.length);
   const {sourceScope,...pub}=e;(g.engines??=[]).push(pub);fresh.forEach(kw=>seen.add(e.variant.toLowerCase()+'|'+kw));proofs.push({id:r.id,index:i,engine:pub,sourceScope});changes.push({index:i,kind:'engine',variant:e.variant,kw:fresh,sources:e.sources});
  }
 }
 if(changes.length)lines.push({id:r.id,sourceFile:owner.path,changes,oldToNew:Object.fromEntries(c.generations.map((g,i)=>[i,i]))});
}
// Plan is reviewable before anything public is written.
write(root+'/plan.json',{baselineRevision:queue.baselineRevision,visited:research.lines.length,lines,rejected,aliases:aliasChanges,engineProofs:proofs});
if(!process.argv.includes('--apply')){console.log(JSON.stringify({mode:'plan',lines:lines.length,changes:lines.reduce((n,l)=>n+l.changes.length,0),rejected:rejected.length}));process.exit(0);}
const baselineHashes={};for(const path of files.keys())baselineHashes[path]=hash(path);write(root+'/baseline-hashes.json',{baselineRevision:queue.baselineRevision,sha256:baselineHashes});
for(const path of new Set(lines.map(r=>r.sourceFile)))write(path,files.get(path));
// Both selector sources can contain the same line. Keep every copy aligned.
for(const path of ['src/data/catalog/model-lines-auto.json','src/data/catalog/model-line-additions.json']){
 const ls=read(path);let touched=false;for(const l of ls){const change=lines.find(r=>r.id===l.makeSlug+'/'+l.slug);if(!change||!change.changes.some(c=>['dates','bodyTypes'].includes(c.kind)))continue;const gs=owners.get(change.id).card.generations;
  l.generations=gs.map((g,i)=>({...l.generations?.[i],code:g.code??null,from:g.from??null,to:g.to??null,productionStatus:g.productionStatus,bodyTypes:g.bodyTypes??[],sources:g.sources??[],...(g.dateBasis?{dateBasis:g.dateBasis}:{})}));
  const starts=gs.map(g=>g.from).filter(Number.isFinite),ends=gs.map(g=>g.to).filter(Number.isFinite);l.from=starts.length?Math.min(...starts):null;l.to=gs.some(g=>g.to==null)?null:ends.length?Math.max(...ends):null;l.bodyTypes=[...new Set(gs.flatMap(g=>g.bodyTypes??[]))];l.productionStatus=gs.some(g=>g.productionStatus==='current')?'current':'ended';touched=true;
 }if(touched)write(path,ls);
}
const aliasFile='src/data/catalog/generation-id-aliases.json',aliases=read(aliasFile);
for(const a of aliasChanges){for(const old of aliases.aliases)if(old.makeSlug===a.makeSlug&&old.lineSlug===a.lineSlug&&old.to===a.from)old.to=a.to;const existing=aliases.aliases.find(x=>x.makeSlug===a.makeSlug&&x.lineSlug===a.lineSlug&&x.from===a.from);if(existing)existing.to=a.to;else aliases.aliases.push(a);}if(aliasChanges.length)write(aliasFile,aliases);
const drawingFile='src/data/front-drawings.json',drawings=read(drawingFile);let drawingUpdates=0;
for(const l of lines.filter(r=>r.changes.some(c=>c.kind==='dates'))){const [make,line]=l.id.split('/');for(const row of drawings[make+'--'+line]??[]){const g=owners.get(l.id).card.generations[row[0]];if(row[1]!==g.from||row[2]!==g.to){row[1]=g.from;row[2]=g.to;drawingUpdates++;}}}if(drawingUpdates)write(drawingFile,drawings);
for(const script of ['scripts/model-cards-index.mjs','scripts/model-lines-index.mjs'])cp.execFileSync('node',[script],{stdio:'inherit'});
const makes=[...new Set(lines.filter(l=>l.changes.some(c=>c.kind==='dates')).map(l=>l.id.split('/')[0]).filter(m=>fs.existsSync('src/data/stats/'+m+'.json')))].sort();
const report={baselineRevision:queue.baselineRevision,visited:research.lines.length,changedLines:lines.length,generationsAdded:0,generationsRemoved:0,enginesAdded:proofs.length,productionDatesFilled:lines.reduce((n,l)=>n+l.changes.filter(c=>c.kind==='dates').length,0),bodiesAdded:lines.reduce((n,l)=>n+l.changes.filter(c=>c.kind==='bodyTypes').length,0),faceliftsAdded:0,listingIdChanges:aliasChanges,drawingsRedated:drawingUpdates,rawRebuildMakes:makes,statisticsStatus:makes.length?'pending':'unchanged',lines,rejected};write(root+'/report.json',report);
if(makes.length){const paths=['src/data/model-cards-index.json','src/data/model-lines-index.json','scripts/stats/match.py','scripts/stats/istp-stats.py','scripts/stats/rsv-stats.py','scripts/stats/build-stats.py'];write(root+'/rebuild-inputs.json',{baselineRevision:queue.baselineRevision,makes,sha256:Object.fromEntries(paths.map(p=>[p,hash(p)]))});}
console.log(JSON.stringify({...report,lines:undefined,rejected:rejected.length}));
