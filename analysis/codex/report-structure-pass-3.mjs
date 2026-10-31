import fs from 'node:fs';
import cp from 'node:child_process';
const root='analysis/codex/structure-pass-3',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const r=read(`${root}/report.json`),previous=read('analysis/codex/structure-pass-2/next-queue.json'),queue=read(`${root}/queue.json`),statistics=read(`${root}/statistics-rebuild.json`);
const dateFollowups={
 'abarth/1000':'Coachbuilt derivatives are identified; exact Monomille production bounds not recovered from the source. Retain separate variants.',
 'bertone/freeclimber':'Freeclimber and Freeclimber II are identified; source redirect does not establish all Bertone-specific production bounds.',
 'delage/type-co':'CO/CO2/COE identified; exact COE end not established by the accessible source.',
 'dodge/custom':'D19/D22 identified; archived reference PDF could not be fetched (response-size limit). Exact production dates remain absent.'
};
for(const row of r.lines)if(row.status!=='changed'){
 row.status=dateFollowups[row.id]?'identified-date-followup':'verified-parallel';
 row.reason=dateFollowups[row.id]??'Source identifies concurrent regional/body families; no forced chronological end year or merge.';
}
const publicBefore=JSON.parse(cp.execFileSync('git',['show','3523521:src/data/model-lines-index.json'],{maxBuffer:40e6})),publicAfter=read('src/data/model-lines-index.json');
const gid=g=>g.code??`${g.from??'?'}\u2013${g.to??'?'}`;
r.listingIdChanges=[];r.publicListingIdChanges=[];
for(const row of r.lines.filter(x=>x.status==='changed')){
 const [make,line]=row.id.split('/');
 for(const [i,g]of row.before.entries()){const j=row.oldToNew[i];if(gid(g)!==gid(row.after[j]))r.listingIdChanges.push({id:row.id,oldIndex:i,newIndex:j,from:gid(g),to:gid(row.after[j])});}
 const before=publicBefore[make].find(x=>x.slug===line),after=publicAfter[make].find(x=>x.slug===line);
 for(const [i,g]of before.generations.entries()){const j=row.oldToNew[i];if(j!==undefined&&gid(g)!==gid(after.generations[j]))r.publicListingIdChanges.push({id:row.id,oldIndex:i,newIndex:j,from:gid(g),to:gid(after.generations[j])});}
}
const reviewed=new Set(queue.map(x=>`${x.make}/${x.line}`)),next=previous.next.filter(x=>!reviewed.has(`${x.make}/${x.line}`));
write(`${root}/next-queue.json`,{resolvedLineIds:[...new Set([...previous.resolvedLineIds,...reviewed])],remaining:next.length,next,dateFollowups});
const changed=r.lines.filter(x=>x.status==='changed'),coverage=statistics.passes2and3Coverage,fleet=coverage.filter(x=>x.fleet),empty=fleet.filter(x=>!x.generationKeys.length);
r.summary={reviewed:queue.length,changed:changed.length,retainedParallel:3,identifiedDateFollowups:4,addedGenerations:r.addedGenerations,removedGenerations:r.removedGenerations,dateEdits:changed.reduce((n,x)=>n+x.plan.dates.length,0),engineRowsAdded:0,engineRowsRetained:7028,faceliftsAdded:1,remainingStructureCandidates:next.length,rawStatistics:{requestedMakes:48,recomputedMakes:42,coveredFleetLines:fleet.length,coveredFleetLinesWithGenerations:fleet.length-empty.length,emptyCoveredFleetLines:empty}};
r.listingMigration='Existing surviving code IDs preserved. Intentional Caterham variant IDs 170/340/485 FE merge into S3. Year IDs and merged-body IDs listed separately; Claude confirms year fallback and no stored-listing migration required.';
write(`${root}/report.json`,r);
const progress=read('analysis/codex/catalog-sweep-progress.json');progress.structurePasses=progress.structurePasses.filter(x=>x.batch!==3);progress.structurePasses.push({batch:3,report:`${root}/report.json`,validation:`${root}/validation.json`,...r.summary});progress.activePhase='structure-pass: 79 remaining candidates, then wave-1 second-source engines and wave 2';write('analysis/codex/catalog-sweep-progress.json',progress);
const sourceNote='One source per change; source URLs, before/after generations, old-to-new indexes and scoped date assumptions are in report.json and the research JSON files. Successor boundaries and base-chassis periods are explicitly labelled; they are not asserted as exact European tuning/derivative production dates.';
const rows=changed.map(x=>`| ${x.id} | ${x.before.length} → ${x.after.length} | ${Object.entries(x.oldToNew).map(([a,b])=>`${a}→${b}`).join(', ')} |`).join('\n');
fs.writeFileSync(`${root}/report.md`,[
 '# Structure pass 3',
 '50 candidates reviewed; 43 lines changed; 3 parallel families retained; 4 identified lines need date follow-up. One generation added (Coronet III split from II), 23 pseudo/body/technical generations merged, 54 date edits, one facelift added (Cowin 2). No new engines: all 7,028 existing rows retained. Atom 3.5 keeps its existing 2012 launch stage instead of a duplicate 2013 stage.',
 sourceNote,
 '## Index remaps',
 '| Line | Generations before → after | Old → new index |\n|---|---|---|\n'+rows,
 '## Drawings and holds',
 'Three duplicate merged-body drawings were retired without changing bytes: abarth--ot-1000--1, arcfox--alpha-t5--1, arcfox--kaola--1 → corresponding --retired-1.webp. They have no live manifest entry. All 841 live drawings and all review holds point to existing generations. No new images. Full source-card equality validation proves 4,605 untouched cards unchanged; all untouched public cards are unchanged.',
 '## Statistics',
 'Complete IS TP raw rebuild: 1,094 days, 2023-10-12–2026-10-11; RSV snapshot vypisvozidel.csv, built 2026-10-31. Requested all 48 makes from passes 2+3 plus Mercedes; 42 have publishable aggregates. Make fleet/STK totals preserved. Rebuilt listing-stats.json. Inputs are fingerprinted; the final Atom facelift-only correction was checked to leave every matcher-consumed name/code/date unchanged.',
 '53 of 54 changed lines with fleet totals now have generation aggregates. Exception: Mercedes 300/350 prewar line has 1,328 loosely badge-matched records, manufacturing years 1939–2010, outside its 1926–1930 generation bounds. No generation group is invented. This is an existing badge-to-model alias problem (match.py line 122 accepts a sole line without a year bound), requiring a separate matcher correction and raw rebuild. Do not describe the 1,328 as verified prewar cars.',
 'Across all 659 fleet lines in recomputed makes, 549 have generation aggregates; all 110 empty cases are audited in statistics-rebuild.json: undated generations, out-of-period/unknown years, or all matched groups below the privacy minimum of 30. No eligible raw group of 30+ was dropped. Many are pre-existing catalogue gaps outside this batch. Mercedes ambiguous-name matching is now deterministic; per-line changes are recorded under lineMatchingChanges.',
 '## Listing IDs',r.listingMigration,
 '## Date follow-ups',...Object.entries(dateFollowups).map(([id,why])=>`- ${id}: ${why}`),
 '## Next',
 '79 candidates remain in next-queue.json, plus the four date follow-ups above. Then resume the wave-1 second-source engine pass and wave 2. Full application build/publish belongs to Claude; no commit or publication performed here.'
 ].join('\n\n')+'\n');
console.log(JSON.stringify(r.summary));
