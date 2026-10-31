import fs from 'node:fs';
import cp from 'node:child_process';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const root='analysis/codex/structure-pass',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
const report=read(`${root}/batch-1.json`),stage=`${root}/staged/stats`,baseline=report.baseline;
const changes=[],heldAmbiguousLines=[],publish=new Map();
for(const make of report.affectedMakes){
 const path=`src/data/stats/${make}.json`,before=JSON.parse(cp.execFileSync('git',['show',`${baseline}:${path}`],{maxBuffer:30e6})),after=read(`${stage}/${make}.json`);
 assert.deepEqual(after.meta,before.meta,'Incomplete/different source period');
 assert.equal(after._.fleet.n,before._.fleet.n,`Fleet total changed ${make}`);assert.equal(after._.stk.inspections,before._.stk.inspections,`Inspection total changed ${make}`);
 for(const line of new Set([...Object.keys(before),...Object.keys(after)])){
  if(line==='meta'||line==='_')continue;
  if(make==='mercedes-benz'&&['380-500k-540k','mannheim'].includes(line)){
   heldAmbiguousLines.push({make,line,beforeFleet:before[line]?.fleet?.n??null,recomputedFleet:after[line]?.fleet?.n??null,beforeInspections:before[line]?.stk?.inspections??null,recomputedInspections:after[line]?.stk?.inspections??null,decision:'Retain baseline unrelated line: equal-year alias selection is hash-seed dependent. Seeds 0 and 8 map synthetic 380/1935 differently.'});
   if(before[line])after[line]=structuredClone(before[line]);else delete after[line];continue;
  }
  assert.equal(after[line]?.fleet?.n,before[line]?.fleet?.n,`Line fleet total changed ${make}/${line}`);assert.equal(after[line]?.stk?.inspections,before[line]?.stk?.inspections,`Line STK total changed ${make}/${line}`);
  for(const i of new Set([...Object.keys(before[line]?.gens??{}),...Object.keys(after[line]?.gens??{})])){
   const b=before[line]?.gens?.[i],a=after[line]?.gens?.[i];
   if(JSON.stringify(b)!==JSON.stringify(a))changes.push({make,line,index:Number(i),beforeFleet:b?.fleet?.n??null,afterFleet:a?.fleet?.n??null,beforeInspections:b?.stk?.inspections??null,afterInspections:a?.stk?.inspections??null,change:!b?'appeared':!a?'disappeared':'changed'});
  }
 }
 publish.set(make,after);
}
// Verify all staged makes before writing any published statistics file.
for(const make of report.affectedMakes)fs.writeFileSync(`src/data/stats/${make}.json`,JSON.stringify(publish.get(make)));
cp.execFileSync('node',['scripts/listing-stats-index.mjs'],{stdio:'inherit'});
report.stats='full raw-data recomputation completed for affected makes';report.statsReport=`${root}/statistics-rebuild.json`;write(`${root}/batch-1.json`,report);
const bmw=read('src/data/stats/bmw.json')['rada-3'],card=read('src/data/model-cards-index.json').bmw['rada-3'];
const result={status:'complete',sourcePeriod:read(`${stage}/bmw.json`).meta,makes:report.affectedMakes,allMakeAndLineFleetInspectionTotalsPreserved:true,heldAmbiguousLines,changes,bmw:card.generations.map((g,index)=>({index,code:g.code,fleet:bmw.gens[index]?.fleet?.n??null,inspections:bmw.gens[index]?.stk?.inspections??null})),aggregationFiles:['rsv-agg.json','istp-agg.json'].map(name=>({name,sha256:crypto.createHash('sha256').update(fs.readFileSync(`${root}/staged/aggregates/${name}`)).digest('hex')}))};
write(`${root}/statistics-rebuild.json`,result);console.log(JSON.stringify({status:result.status,changedGenerationEntries:changes.length,bmw:result.bmw}));
let md='# Structure pass 1\n\n50 fleet-ordered candidates inspected; source pages fetched for 47. **8 lines changed**, 42 retained for explicit follow-up/scope review. No claim that these 50 lines are now complete. Details and reasons: batch-1.json; fetched production rows: source-triage.json.\n\nBMW 3: 11 -> 7 generations. Mapping: 0->0, 1->1, 2->2, 3->3, 4->4, 5->5, 6->6, 7->6, 8->5, 9->4, 10->3. The first seven are unchanged in position; four undated exact-code technical sheets merge into E46/E90/F30/G20. Trims, equipment, engines and sources are unioned; conflicting scoped metadata and photos survive in specificationReferences. All three BMW drawings stay at 1/3/5; no holds existed for the removed shells. Existing listing codes stay.\n\n86 documented engine rows added across E30-G20 (unknown displacement remains absent); E21 engines retained. Hybrid 320e/330e rows explicitly marked PHEV. No new facelifts.\n\n13 source-backed date edits:\n\n| Line | Index | From | To | Source |\n|---|---:|---:|---:|---|\n';
for(const e of report.edits)md+=`| ${e.make}/${e.line} | ${e.index} | ${e.from} | ${e.to??'open'} | [article](${e.source}) |\n`;
md+='\nStatistics recomputed from the complete raw register and all 1,094 inspection days for the five affected makes. Existing make/line population and inspection totals verified unchanged before copying staged results. Generation aggregates rebuilt, not summed or just rekeyed. The minimum published group remains 30. See statistics-rebuild.json for every changed/appearing/disappearing entry and BMW counts. Listing statistics regenerated.\n\nValidator: `node analysis/codex/structure-pass.mjs --validate` proves all 4,640 untouched source cards and generated public cards unchanged against 4a6100b, exact sourced transforms for eight cards, preservation of merged trims/equipment/sources, drawing identity and valid rebuilt statistics keys. Engine-only session validators are historical during this structural phase; use the new validator until the engine baseline is explicitly reset.\n\nRemaining work: 42 selected candidates need identity/body/market-specific evidence; preserve concurrent regional models, body derivatives and separate electric families. Do not close their production at successor launch. BMW overlap years still use the existing year/type matcher, so aggregates are estimates of generations, not VIN-certified chassis identification.\n';
fs.writeFileSync(`${root}/report.md`,md);
fs.appendFileSync(`${root}/report.md`,'\nException: two unrelated historic Mercedes line aggregates (Mannheim and 380/500K/540K) retain their baseline values. The matcher resolves their shared undated 380 alias differently under different Python hash seeds (verified seeds 0 and 8). Current raw rebuild values are recorded in statistics-rebuild.json; repair the ambiguity and recompute separately. All eight changed catalogue lines use the completed raw rebuild.\n');
