import fs from 'node:fs';
const root='analysis/sweep/',read=p=>JSON.parse(fs.readFileSync(root+p,'utf8'));
const first=read('apply-log-90dd9c8c7d5e.json');
const supplements=['apply-log-963eba7fef73.json','apply-log-3892a9a67090.json'].map(read);
const last=read('apply-log-4c3809d4c189.json');
const applied=[...first.events,...supplements.flatMap(r=>r.events.filter(e=>e.status==='applied'))];
const validation=read('integration-validation.json');
const proposals=[];
for(const who of ['codex','claude'])for(const f of fs.readdirSync(root+who).filter(f=>f.endsWith('.json'))){const p=read(who+'/'+f);if(f===`${p.make}.json`)proposals.push(p);}
const nullConflicts=proposals.flatMap(p=>(p.conflicts??[]).filter(c=>c.kept===null).map(c=>({make:p.make,...c})));
const openQuestions=proposals.flatMap(p=>(p.openQuestions??[]).map(question=>({make:p.make,question})));
const pending=last.events.filter(e=>e.status==='excluded'||(e.status==='skipped'&&e.reason!=='already applied'&&e.reason!=='line already present'&&e.reason!=='record already absent'));
fs.writeFileSync(root+'integration-decisions.json',JSON.stringify({pending,nullConflicts,openQuestions,newCardLineExceptions:validation.newOrphans},null,2)+'\n');
const supplementCounts={};for(const s of supplements)for(const e of s.events.filter(e=>e.status==='applied'))supplementCounts[e.file]=(supplementCounts[e.file]??0)+1;
const rows=Object.entries(first.byFile).map(([file,c])=>`| ${file} | ${c.applied} | ${supplementCounts[file]??0} | ${c.skipped} | ${c.excluded} |`).join('\n');
const slugs=last.events.filter(e=>e.reason.startsWith('slug rename'));
const status=last.events.filter(e=>e.file.endsWith('/makes.json')&&e.status==='excluded');
const statusQuestions=openQuestions.filter(q=>/\bstatus\b|defunct|sections|remove.*auto|canonical|company.*brand|brand.*company/i.test(q.question));
const normalize=s=>String(s).replaceAll('|','/').replaceAll('\n',' ');
const changed=[...new Set([...first.changedFiles,...supplements.flatMap(s=>s.changedFiles),
 'src/data/catalog/types.ts','src/data/model-cards-index.json','src/data/model-lines-index.json','src/data/makes-index.json',
 'scripts/model-lines-index.mjs','analysis/codex/build-catalog.mjs','analysis/codex/build-model-lines.mjs',
 ...fs.readdirSync(root).filter(f=>/^(apply-log-|apply-proposals\.mjs|selector-exclusions\.|generation-schema-normalization\.json|integration-|validate-integration\.mjs|write-apply-report\.mjs)/.test(f)).map(f=>root+f),root+'APPLY-REPORT.md',root+'changed-files.json'])];
fs.writeFileSync(root+'changed-files.json',JSON.stringify(changed.sort(),null,2)+'\n');
const md=`# Catalog sweep integration — 2026-10-29

Applied the reviewed proposals from 217 per-make sweep files. No commits, pushes, source fetching, publishing or paid operations. Pre-existing card research is preserved. Review the diff before committing.

## Applied

- 2,319 checked field corrections (including 70 make-field proposals).
- 513 raw/line records removed using durable exclusions with the complete original record retained as the before snapshot.
- 384 sourced model-line additions: 382 in the initial pass, then Rover 200 and SEAT 850 as card-backed line identities. Their rejected *missing raw model* proposals remain rejected; their separate model-line records were absent and were required to link the researched cards.
- 2,652 legacy trim kinds normalized from \"version\" to \"technical-version\".
- One derived Wikidata source URL updated after its QID correction (TVR M-Series).
- Three SsangYong/KGM generation arrays completed with required schema keys. Missing body data stays null; null ends stay unknown unless the proposal explicitly establishes current production. See generation-schema-normalization.json.

There were 5,866 applied actions, 142 skipped actions and 176 exclusions on the first pass; three additional actions followed. Some skipped items already had the requested value; they are not all conflicts. Counts are actions, not distinct cars or individual scalar writes.

## Counts by target

The skipped/excluded columns describe the first pass. Supplemental applied actions are separate to retain an exact audit trail. The final repeat run classified 3,256 actions as skipped and 173 as excluded, with **zero catalog file changes**. The later counts differ because already-removed entries/additions are skipped, type normalizations have disappeared, and the two new card links were resolved.

| Target | Initially applied | Supplementally applied | Initially skipped | Initially excluded |
| --- | ---: | ---: | ---: | ---: |
${rows}

## Types and runtime

CatalogBody now accepts liftback. CatalogFuel now accepts diesel-mhev and hydrogen, matching the runtime CardFuel union. Generation/trim transmissions now accept cvt and e-cvt and null gear counts. Runtime body/transmission fields already accept strings; runtime trim projection does not constrain kind. Legacy kind \"version\" was canonicalized in the card data to the existing \"technical-version\" spelling rather than extending the canonical enum.

No photos were added or replaced in this integration, so photo-sizes was not regenerated. Existing photo coverage/aspect gaps are unchanged.

## Durable rebuild behavior

Run \`node analysis/sweep/apply-proposals.mjs\` from the repository root. Each field correction checks its before-value; mismatches are skipped and logged. Compound edits are atomic. Unsupported prose instructions, unsafe slugs, withdrawn/rejected/reverted proposals, unsourced entries, and low-confidence entries without an independent second source are excluded. Missing optional card values may match a null before-value. Removals check the unique make/slug and any supplied QID, then save the full before snapshot.

selector-exclusions.json is a durable input, not the old generated excluded-models-auto.json audit output. Both source rebuilders import selector-exclusions.mjs. It checks make + slug + QID when supplied, preserving the canonical TVR M-Series record even though it now shares its QID with the removed duplicate. All 513 saved snapshots were tested against that helper. Full source-data rebuilds were not run: they touch unrelated curated/frozen research. After any future source rebuild, rerun apply-proposals.mjs, then the three index scripts. Applied-field proposals also remain durable inputs to that integration step.

model-lines-index.mjs now consumes model-line-additions.json directly as well as model-lines-auto.json, deduplicating identities with auto-file precedence. New additions therefore reach the UI without rewriting all existing curated lines. Final indexes contain 4,616 card records for 217 makes (duplicate-folder keys retain existing precedence), 4,375 explicit model lines plus 404 card-only lines, and 432 makes across all sections (217 auto).

## Human decisions

The complete machine-readable queue is [integration-decisions.json](integration-decisions.json), including every excluded/mismatched proposal, ${nullConflicts.length} conflicts whose recorded kept value is null, all ${openQuestions.length} open research questions, and the remaining new-card exception. Unknown values were retained; no numeric resolution was invented.

### Slug migrations deferred

No slug changes were applied. A complete URL/registry migration was outside this guarded field-edit pass; these require a reference/redirect decision. The report does not claim every rename would break an existing URL.

${slugs.map(e=>`- ${e.make}/${e.entry.slug}: ${normalize(e.entry.field)} → ${normalize(JSON.stringify(e.entry.to))}`).join('\n')}

### Make identity/status/schema decisions

${status.map(e=>`- ${e.make}: ${normalize(e.entry.field)} — ${normalize(e.reason)}. Proposed: ${normalize(JSON.stringify(e.entry.to))}`).join('\n')}

${statusQuestions.map(q=>`- ${q.make}: ${normalize(q.question)}`).join('\n')}

### Conflicts kept unresolved

These are the recorded conflict locations, not a fresh assertion that every field currently contains null. Exact values, evidence and scope are in integration-decisions.json and the per-make source files.

${nullConflicts.map(c=>`- ${c.make}: ${normalize(c.where)}`).join('\n')}

### New-card exception

Sono Sion was explicitly removed from the raw selector because the sweep documents prototypes only and cancelled series production. Its explanatory card remains, with unknown production dates, and was not promoted to a series-production model-line addition. The existing index fallback still exposes card-only identities; decide whether to hide the make/card or retain the explanation. The other 18 newly covered makes have every card lineSlug represented in auto/additions. There remain 404 card-only records overall; the wider pre-existing card-only fallback was not converted wholesale.

## Validation

- \`node scripts/model-cards-index.mjs\`, \`node scripts/model-lines-index.mjs\`, \`node scripts/makes-index.mjs\`: passed, counts above.
- \`node analysis/sweep/apply-proposals.mjs\` repeated on final catalog: zero changed catalog files; append-only audit log only.
- \`node analysis/sweep/validate-integration.mjs\`: passed; zero duplicate identities, missing make references, reversed year ranges, missing required line-generation date/status keys, unsupported enum values, or resurfaced excluded records. One new-card line exception (Sion), retained explicitly above.
- \`node --check analysis/codex/build-catalog.mjs\` and \`node --check analysis/codex/build-model-lines.mjs\`: passed.
- Exclusion-helper assertions: all 513 original snapshots excluded; canonical TVR record sharing a QID retained.
- \`npx tsc --noEmit --incremental false\`: passed after the final catalog/index changes.
- \`npm run build\`: passed, all 5,638 static pages generated. A final repeat build is recorded in the bridge reply.

The initial validation caught a helper matching duplicate removals by QID alone. It was fixed to match the reviewed slug as well, then the validator passed. No current validation failures. This was an integration of existing reviewed evidence, not a fresh independent fact-check of every cited page. Full source rebuilds, browser visual review and URL/redirect migration remain unverified. Ignore .next build churn.

Changed-file manifest: [changed-files.json](changed-files.json). Detailed first-pass audit: [apply-log-90dd9c8c7d5e.json](apply-log-90dd9c8c7d5e.json). Final idempotence audit: [apply-log-4c3809d4c189.json](apply-log-4c3809d4c189.json).
`;
fs.writeFileSync(root+'APPLY-REPORT.md',md);
console.log(JSON.stringify({report:root+'APPLY-REPORT.md',changedFiles:changed.length,nullConflicts:nullConflicts.length,openQuestions:openQuestions.length,pending:pending.length}));
