import fs from 'node:fs';
import {changes} from './research.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const audit=read('analysis/codex/catalog-completeness-audit.json');
const cards=read('src/data/model-cards-index.json');
const batch=read('analysis/codex/catalog-wave-1-batch-1/report.json');
const visited=new Set(changes.map(c=>`${c.make}/${c.line}`));
const followups={
 'citroen/berlingo':'Reconcile European original/First van production after the initial 2008 passenger-model handover; existing generation end remains scoped to the original European offer.',
 'peugeot/307':'Reconcile European hatch/SW versus CC final production dates; existing card ends in 2008 and includes CC. No additional generation should be inferred.',
 'peugeot/206':'Existing engine rows from an Australian brochure remain alongside the newly sourced historical table; market-specific power differences are preserved.',
 'dacia/sandero':'Dacia European chronology was researched; Renault-badged overseas facelifts and special-market engines are outside this pass.',
 'dacia/duster':'Series start corrected to 2024 and raw statistics rebuilt. Overlapping production years still require type/VIN-informed classification for exact generation counts.'
};
for(const line of batch.lines){line.remainingGaps.push('Body-style end years and overseas production require a separate scope review where they differ from the principal European generation interval.');if(followups[`${line.make}/${line.line}`])line.remainingGaps.push(followups[`${line.make}/${line.line}`]);line.remainingGaps=[...new Set(line.remainingGaps)];}
const rows=audit.lines.map(l=>({makeSlug:l.makeSlug,lineSlug:l.lineSlug,fleetN:l.fleetN,
 wave:l.fleetN>=1000?1:l.fleetN>0?2:3,
 status:visited.has(`${l.makeSlug}/${l.lineSlug}`)?'core-fields-enriched-followups-recorded':'not-reviewed-in-sweep',
 batch:visited.has(`${l.makeSlug}/${l.lineSlug}`)?'catalog-wave-1-batch-1':null,
 cardPresent:l.cardPresent,generationCount:l.generationCount,
 announcedOnlyGenerations:(cards[l.makeSlug]?.[l.lineSlug]?.generations??[]).flatMap((g,i)=>g.dateBasis==='announcement'?[i]:[]),
 generationsWithoutEngines:l.generations.filter(g=>g.engineRows===0).map(g=>g.index),
 generationsWithEnginePowerGaps:l.generations.filter(g=>g.engineRowsWithoutPower.length).map(g=>g.index)}));
const result={schemaVersion:1,asOf:'2026-10-31',scope:'Entire existing public catalogue; not a claim of completed historical coverage.',
 policy:{sourceMinimum:'One reasonable linked source per added fact; no invented values.',waves:'Czech fleet >=1000, then 1–999, then absent/unknown fleet.',
 noFleetMeaning:'Missing/unknown fleet is not asserted to be zero.',technicalVersions:'Main documented engine families; no gearbox combination expansion.',equipment:'Only continue equipment research when already started.',
 pausedStructures:['hyundai/tucson','kia/ceed','volkswagen/caddy','bmw/rada-5','audi/a6']},
 counts:{lines:rows.length,byWave:[1,2,3].map(wave=>({wave,lines:rows.filter(r=>r.wave===wave).length,visited:rows.filter(r=>r.wave===wave&&r.batch).length})),
 completeLines:0,linesEnriched:visited.size,unvisited:rows.length-visited.size},
 nextDataTargets:rows.filter(r=>r.wave===1&&!r.batch&&(!r.cardPresent||r.generationsWithEnginePowerGaps.length||r.generationsWithoutEngines.some(i=>!r.announcedOnlyGenerations.includes(i)))).slice(0,30).map(({makeSlug,lineSlug,fleetN})=>({makeSlug,lineSlug,fleetN})),
 batches:[{id:'catalog-wave-1-batch-1',report:'analysis/codex/catalog-wave-1-batch-1/report.json',validation:'analysis/codex/catalog-wave-1-batch-1/validation.json'}],
 rows};
fs.writeFileSync('analysis/codex/catalog-sweep-progress.json',JSON.stringify(result,null,2)+'\n');
fs.writeFileSync('analysis/codex/catalog-wave-1-batch-1/report.json',JSON.stringify(batch,null,2)+'\n');
console.log(JSON.stringify(result.counts));
