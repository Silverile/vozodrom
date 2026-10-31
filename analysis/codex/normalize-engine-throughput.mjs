// Exact, deterministic name/header/duplicate cleanup; no generation metadata changes.
import fs from 'node:fs';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {isDeepStrictEqual as equal} from 'node:util';
import {normalizeEngineRows,normalizeVariant,enginePresentation} from './engine-throughput-policy.mjs';
import {projectCatalogueBaseline,overlayManifest} from './catalogue-overlays.mjs';
const root='analysis/codex/engine-throughput',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const revision=read(`${root}/session.json`).baselineRevision,hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const reports=fs.readdirSync(root).filter(f=>/^batch-\d+\.json$/.test(f)).map(file=>({file,data:read(`${root}/${file}`)}));
const records=new Map(reports.flatMap(r=>r.data.lines.map(l=>[`${l.make}/${l.line}`,l])));
const cleanup=[],allCards=new Map(),baselineCards=new Map();
for(const dir of ['src/data/catalog/model-cards','src/data/model-cards'])for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.json'))){
 const file=`${dir}/${f}`,cards=read(file),before=projectCatalogueBaseline(file,JSON.parse(cp.execFileSync('git',['show',`${revision}:${file}`],{encoding:'utf8',maxBuffer:30e6})));let dirty=false;
 for(const card of cards){
  const key=`${card.makeSlug}/${card.lineSlug}`,old=before.find(c=>c.makeSlug===card.makeSlug&&c.lineSlug===card.lineSlug),record=records.get(key);
  const normalizedOld=structuredClone(old);for(const g of normalizedOld.generations)g.engines=normalizeEngineRows(g.engines);
  const normalizedCurrent=structuredClone(card);for(const g of normalizedCurrent.generations)g.engines=normalizeEngineRows(g.engines);
  assert(old);if(record?.sourceFile===file)assert.equal(hash(card),record.afterHash,'Concurrent card edit');else assert(equal(card,old)||equal(normalizedCurrent,normalizedOld),'Unrecorded card edit');
  const changes=[];
  for(const [i,g]of card.generations.entries()){
   const normalized=normalizeEngineRows(g.engines);
   if(!equal(g.engines,normalized)){changes.push({generation:i,rowsBefore:g.engines?.length??0,rowsAfter:normalized?.length??0,names:(g.engines??[]).flatMap(e=>{const p=enginePresentation(e);return e.variant!==p?.variant?[{from:e.variant??null,to:p?.variant??null,notePreserved:!!p?.noteCs,labelBasis:p?.labelBasis??null}]:[];})});g.engines=normalized;dirty=true;}
  }
  if(changes.length)cleanup.push({make:card.makeSlug,line:card.lineSlug,sourceFile:file,changes});
  allCards.set(`${file}#${key}`,card);baselineCards.set(`${file}#${key}`,old);
 }
 if(dirty)fs.writeFileSync(file,JSON.stringify(cards,null,2)+'\n');
}
for(const report of reports){
 for(const r of report.data.lines){
  const card=allCards.get(`${r.sourceFile}#${r.make}/${r.line}`),before=baselineCards.get(`${r.sourceFile}#${r.make}/${r.line}`);assert(card&&before);
  r.added=card.generations.flatMap((g,i)=>{
   const old=normalizeEngineRows(before.generations[i].engines)??[];assert(equal((g.engines??[]).slice(0,old.length),old),'Existing engine prefix changed');
   return (g.engines??[]).slice(old.length).map(e=>({generation:i,fuel:e.fuel,cc:e.displacementCc,litres:e.displacementLitresNominal,kw:e.powerKwMin,variant:e.variant,sources:e.sources}));
  });
  r.enginesAdded=r.added.length;r.afterHash=hash(card);
  if(overlayManifest()){const projected=structuredClone(before);for(const g of projected.generations)g.engines=normalizeEngineRows(g.engines);r.preOverlayBeforeHash??=r.beforeHash;r.beforeHash=hash(projected);r.baselineProjection='catalogue-overlays.json';}
  if(!r.enginesAdded&&r.status==='engines-added'){r.status='already-covered';r.reason='Normalized engine/power already present.';}
 }
 report.data.summary.touched=report.data.lines.filter(r=>r.enginesAdded).length;report.data.summary.enginesAdded=report.data.lines.reduce((s,r)=>s+r.enginesAdded,0);
 report.data.summary.alreadyCovered=report.data.lines.filter(r=>r.status==='already-covered').length;
 fs.writeFileSync(`${root}/${report.file}`,JSON.stringify(report.data,null,2)+'\n');
}
const history=fs.existsSync(`${root}/name-cleanup.json`)?read(`${root}/name-cleanup.json`).lines:[];
const merged=new Map([...history,...cleanup].map(c=>[`${c.sourceFile}#${c.make}/${c.line}`,c]));
fs.writeFileSync(`${root}/name-cleanup.json`,JSON.stringify({policy:'Strip duplicate-column suffixes, reject header labels, compact names, deduplicate name/power while preserving real engine codes. Reject explicitly foreign market annotations in new imports only.',lines:[...merged.values()]},null,2)+'\n');
console.log(JSON.stringify({cardsWithNameOrDuplicateCleanup:cleanup.length}));
