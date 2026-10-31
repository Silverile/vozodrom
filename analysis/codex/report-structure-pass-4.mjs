import fs from 'node:fs';
import cp from 'node:child_process';
const root='analysis/codex/structure-pass-4',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const r=read(`${root}/report.json`),previous=read('analysis/codex/structure-pass-3/next-queue.json'),queue=read(`${root}/queue.json`),statistics=read(`${root}/statistics-rebuild.json`);
const followups={'mahindra/cj':'The accessible Mahindra Jeep source redirects to Major and does not identify the production ends of the Indian CJ2A/CJ3A/CJ3B/CJ4/CJ540/CJ640 variants. Retain identified names and known dates; do not borrow US Willys production dates.'};
const parallel={
 'force-motors/traveller':'Source explicitly lists both 1987 and 2012 families as still in production.',
 'forthing/t5':'Source identifies T5L as a longer parallel body, produced 2019–2021; its end does not end T5.',
 'haval/big-dog':'Source explicitly says the larger second family is sold alongside the original.',
 'hongqi/hs7':'Original remains produced for export after the Chinese-market switch; do not invent a global end.',
 'lynk-co/10':'EV Z10/10 and PHEV 10 EM-P have different platform identifiers E371/P372 and parallel production.',
 'mahindra/bolero-neo':'Neo Plus is a longer parallel body; no source says its introduction discontinued Neo.'
};
for(const row of r.lines)if(row.status!=='changed'){
 row.status=followups[row.id]?'identified-date-followup':'verified-parallel';row.reason=followups[row.id]??parallel[row.id];
}
const publicBefore=JSON.parse(cp.execFileSync('git',['show','4e8a89e:src/data/model-lines-index.json'],{maxBuffer:40e6})),publicAfter=read('src/data/model-lines-index.json'),gid=g=>g.code??`${g.from??'?'}\u2013${g.to??'?'}`;
r.listingIdChanges=[];r.publicListingIdChanges=[];
for(const row of r.lines.filter(x=>x.status==='changed')){
 const [make,line]=row.id.split('/');
 for(const [i,g]of row.before.entries()){const j=row.oldToNew[i];if(gid(g)!==gid(row.after[j]))r.listingIdChanges.push({id:row.id,oldIndex:i,newIndex:j,from:gid(g),to:gid(row.after[j])});}
 const before=publicBefore[make].find(x=>x.slug===line),after=publicAfter[make].find(x=>x.slug===line);
 for(const [i,g]of before.generations.entries()){const j=row.oldToNew[i];if(j!==undefined&&gid(g)!==gid(after.generations[j]))r.publicListingIdChanges.push({id:row.id,oldIndex:i,newIndex:j,from:gid(g),to:gid(after.generations[j])});}
}
const reviewed=new Set(queue.map(x=>`${x.make}/${x.line}`)),next=previous.next.filter(x=>!reviewed.has(`${x.make}/${x.line}`));
write(`${root}/next-queue.json`,{resolvedLineIds:[...new Set([...previous.resolvedLineIds,...reviewed])],remaining:next.length,next,dateFollowups:followups});
const changed=r.lines.filter(x=>x.status==='changed'),fleet=statistics.batchCoverage.filter(x=>x.fleet),empty=fleet.filter(x=>!x.generationKeys.length);
r.summary={reviewed:queue.length,changed:changed.length,retainedParallel:6,identifiedDateFollowups:1,addedGenerations:r.addedGenerations,removedGenerations:r.removedGenerations,dateEdits:changed.reduce((n,x)=>n+x.plan.dates.length,0),engineRowsAdded:0,engineRowsRetained:7028,faceliftsAdded:changed.reduce((n,x)=>n+x.plan.stages.length,0),remainingStructureCandidates:next.length,rawStatistics:{requestedMakes:statistics.requestedMakes,recomputedMakes:statistics.recomputedMakes,coveredFleetLines:fleet.length,coveredFleetLinesWithGenerations:fleet.length-empty.length,emptyCoveredFleetLines:empty},audit:read('analysis/codex/catalog-completeness-audit.json').counts};
r.listingMigration='All existing surviving public code IDs preserved; duplicate FE-3 stage maps into FE-3. Changed year-based IDs and body-variant remaps are listed in publicListingIdChanges; year fallback applies per Claude.';
write(`${root}/report.json`,r);
const progress=read('analysis/codex/catalog-sweep-progress.json');progress.structurePasses=progress.structurePasses.filter(x=>x.batch!==4);progress.structurePasses.push({batch:4,report:`${root}/report.json`,validation:`${root}/validation.json`,...r.summary});progress.activePhase='structure-pass: 29 remaining candidates and Mahindra CJ date follow-up, then wave-1 second-source engines and wave 2';
const auditRows=new Map(read('analysis/codex/catalog-completeness-audit.json').lines.map(x=>[`${x.makeSlug}/${x.lineSlug}`,x]));
for(const row of progress.rows){const id=`${row.makeSlug}/${row.lineSlug}`,a=auditRows.get(id);if(!a)continue;row.fleetN=a.fleetN;row.wave=a.fleetN>=1000?1:a.fleetN>0?2:3;row.generationCount=a.generations.length;row.generationsWithoutEngines=a.generations.filter(g=>g.gaps.includes('no-engine-rows')).map(g=>g.index);row.generationsWithEnginePowerGaps=a.generations.filter(g=>g.gaps.includes('engine-rows-without-power')).map(g=>g.index);const review=r.lines.find(x=>x.id===id);if(review)row.structureReview={batch:4,status:review.status,report:`${root}/report.json`};}
progress.counts.byWave=[1,2,3].map(wave=>({wave,lines:progress.rows.filter(r=>r.wave===wave).length,visited:progress.rows.filter(r=>r.wave===wave&&r.status!=='not-reviewed-in-sweep').length}));
write('analysis/codex/catalog-sweep-progress.json',progress);
const rows=changed.map(x=>`| ${x.id} | ${x.before.length} → ${x.after.length} | ${Object.entries(x.oldToNew).map(([a,b])=>`${a}→${b}`).join(', ')} |`).join('\n');
const d=statistics.matcherDiagnostics;
fs.writeFileSync(`${root}/report.md`,[
 '# Structure pass 4',
 '54 candidates reviewed (next 50 plus all four date follow-ups); 47 lines changed, six parallel families retained, one date follow-up remains. Added 10 generation records, merged 27 pseudo/body/technical records, made 39 date edits and added 12 facelift stages. No new engines; all 7,028 existing rows retained.',
 'Added: Geely Boyue G426, Haval F7 II, announced Hongqi H9 II, and seven missing Lincoln Continental periods by expanding the generic postwar placeholder. Lincoln now has ten chronological families, with first-generation wartime interruption noted; H9 II is explicitly announcement-only and excluded from production matching. The old Lincoln placeholder had no engines/trims/drawing to attribute.',
 'All four previous date follow-ups now have linked evidence: Monomille 1961–1965; Freeclimber I 1989–1992 and II 1992–1993 per chosen Italian source (other catalogues differ); Delage CO E about 1916–1917; Dodge D19 1940–1941 and D22 1941–1942. Approximate production and successor boundaries remain labelled in dateBasis/dateNote. Main-body/calendar boundaries that remain uncertain are explicitly noted, rather than claiming exact months.',
 '## Index remaps',
 '| Line | Before → after generations | Old → new index |\n|---|---|---|\n'+rows,
 'Complete before/after names, years, codes, source URLs and public listing-ID changes are in report.json. Original variant detail is preserved in specificationReferences. No drawing files moved or retired; all 841 live files and every review hold point to valid generations; drawing date ranges were refreshed. Validator proves 4,601 untouched source cards and all untouched public cards unchanged.',
 '## Matcher correction and raw rebuild',
 'A single candidate no longer bypasses dates. Dated generation intervals take precedence over stale model-line bounds (regressions cover Gladiator SJ, modern Commander, Cerato and Baleno). If all generations are dated and none contains the year, the record stays in make totals and is not assigned to that line. Undated families remain a fallback, not an assertion that every year belongs to a generation. Existing multi-candidate deterministic ordering remains unchanged.',
 `Prewar Mercedes 300/350: previously ${d.prewarBeforeFleet} fleet records; now ${d.prewarAfterFleet??'no publishable line group'}. Later badge records are no longer counted as prewar cars. All recomputed make totals remain unchanged. Per-line count changes and disappearances are recorded in statistics-rebuild.json.`,
 `The stricter matcher changes ${statistics.lineMatchingChanges.length} line-level fleet/STK metrics, not only Mercedes. These are date-based exclusions, not reassignment to another model. Catalogue omissions or first-registration year proxies can also put a real vehicle outside recorded production bounds; individual exclusions have not been manually reviewed. Make totals include those records.`,
 `Complete rebuild requested ${statistics.requestedMakes} makes; ${statistics.recomputedMakes} have publishable aggregates. IS TP: all 1,094 days, 2023-10-12–2026-10-11. RSV: vypisvozidel.csv snapshot built 2026-10-31. Every staged statistics key was checked against current generations before publication. Across recomputed makes, ${statistics.fleetLinesChecked} fleet lines were checked, ${statistics.nonemptyGenerationLines} have generation aggregates; all ${statistics.emptyGenerationExceptions.length} empty cases are audited against raw years/sample counts. No eligible raw group of 30+ was dropped. listing-stats.json regenerated. Matcher inputs fingerprinted.`,
 'The first raw run was interrupted after a regression check found stale line-level bounds; only the complete rerun using the corrected generation-first matcher was finalized. Ignored staged/ artifacts are local rebuild output, not files to commit.',
 '## Listing IDs',r.listingMigration,
 '## Remaining work',...Object.entries(followups).map(([id,why])=>`- ${id}: ${why}`),
 '29 original candidates remain in next-queue.json. After them: second-source engines for wave-1 generations still without rows, then wave 2. Application build/browser review/publication belongs to Claude. No commit or publication here.'
 ].join('\n\n')+'\n');
console.log(JSON.stringify(r.summary));
