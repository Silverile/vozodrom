import fs from 'node:fs';
import {step7Evidence, step7Sources, photoReview7} from './skoda-step7.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const cards=read('src/data/catalog/model-cards/skoda.json');
const before=read('analysis/codex/skoda-step7-baseline.json');
const fields=Object.keys(before.counts);
const versions=cards.flatMap(c=>c.generations.flatMap((g,generationIndex)=>(g.trims||[]).map(t=>({lineSlug:c.lineSlug,generationIndex,...t}))));
const id=t=>[t.lineSlug,t.generationIndex,t.name].join('/');
const renames=step7Evidence.flatMap(w=>(w.patches||[]).filter(p=>p.fields.name).map(p=>({lineSlug:p.lineSlug,generationIndex:p.generationIndex,from:p.trimName,to:p.fields.name})));
const canonical=t=>{const r=renames.find(r=>r.lineSlug===t.lineSlug&&r.generationIndex===t.generationIndex&&r.to===t.name);return r?id({...t,name:r.from}):id(t);};
const oldIds=new Set(before.ids),existing=versions.filter(t=>oldIds.has(canonical(t))),added=versions.filter(t=>!oldIds.has(canonical(t)));
if(existing.length!==before.versions||new Set(existing.map(canonical)).size!==before.versions)throw Error('Original version lost or duplicated');
const at=(o,p)=>p.split('.').reduce((v,k)=>v?.[k],o);
const stats=ts=>({versions:ts.length,counts:Object.fromEntries(fields.map(k=>[k,ts.filter(t=>at(t,k)!=null).length])),completeDimensions:ts.filter(t=>Object.values(t.dimensionsMm).every(v=>v!==null)).length,publishedMassMinima:ts.filter(t=>t.massReference==='published-minimum').length});
const after=stats(versions),existingAfter=stats(existing),gs=cards.flatMap(c=>c.generations);
const photos={before:before.photos,after:gs.filter(g=>g.photo).length,reviewed:gs.filter(g=>g.photo?.visualReview==='reviewed').length,pending:gs.filter(g=>g.photo?.visualReview==='pending').length,decisions:photoReview7.decisions};
const elapsedMinutes=+((Date.now()-Date.parse(before.startedAt))/60000).toFixed(1);
const report={generatedAt:new Date().toISOString(),elapsedMinutes,before,after,existingAfter,added:stats(added),renames,workers:step7Evidence.map(w=>({file:w.file,patches:w.patches?.length||0,additions:w.additions?.length||0})),leadDecisions:step7Evidence.flatMap(w=>(w.leadDecisions||[]).map(d=>({file:w.file,...d}))),helpWanted:step7Evidence.flatMap(w=>(w.helpWanted||[]).map(d=>({file:w.file,detail:d}))),photos,missing:versions.map(t=>({lineSlug:t.lineSlug,generationIndex:t.generationIndex,name:t.name,missing:fields.filter(k=>at(t,k)==null)}))};
write('analysis/codex/skoda-step7-review.json',report);
write('analysis/codex/skoda-step7-evidence.json',{retrievedDate:'2026-10-26',sources:step7Sources,workerFiles:step7Evidence.map(w=>w.file),renames,addedVersions:added,appliedPatches:step7Evidence.flatMap(w=>w.patches||[]),photoReview:photoReview7,policy:'Facts individually sourced, no copied prose or complete source tables. Conflicting different-source values remain null. Minimum mass policy unchanged; no new published-minimum ranges in this step.'});
function section(path,text){let s=fs.readFileSync(path,'utf8');const start='<!-- skoda-step7:start -->',end='<!-- skoda-step7:end -->',a=s.indexOf(start),b=s.indexOf(end);if(a>=0&&b>=0)s=s.slice(0,a)+s.slice(b+end.length);fs.writeFileSync(path,s.trimEnd()+'\n\n'+start+'\n'+text+'\n'+end+'\n');}
const table=fields.map(k=>`| ${k} | ${before.counts[k]} | ${existingAfter.counts[k]} | ${after.counts[k]} |`).join('\n');
section('analysis/codex/model-lines-review.md',`## Škoda step 7 — verified leads and dated version specifications

Current totals supersede earlier snapshots: ${before.versions} → ${versions.length} versions; ${added.length} additions and ${renames.length} deliberate Praktik renames. All ${before.versions} original records retained, with identities mapped through these renames. Full dimensions ${before.completeDimensions} → ${after.completeDimensions}; original records after ${existingAfter.completeDimensions}. Six research groups finished in two waves of three workers. Elapsed ${elapsedMinutes} minutes including merging and validation.

| Populated field | Before | Same original records after | All records after |
| --- | ---: | ---: | ---: |
${table}

### Added and clarified versions

Three Fabia RS records: 2010 RS hatchback and Combi, plus a separately scoped UK May 2006 Euro IV 1.9 TDI RS. Its 5.3 L/100 km combined value is not assigned to the Euro III version (5.4 in that brochure). Whole-hatchback mass ranges are not RS-specific and were not transferred. A 0–62 mph time was not converted into 0–100 km/h.

Three November 2016 Yeti 4×4 combinations and three May 2011 Czech Roomster TSI combinations added. Roomster wheelbase remains null in these records: brochure 2621 mm and manual 2620 mm are unresolved. No Scout or Outdoor dimensions copied across bodies.

Praktik records now identify the 2011 technical versions with specified wheel sizes: HTP/TSI on 14-inch wheels, TDI on standard 15-inch wheels. Exact masses include 75 kg driver. Source market is Estonia/Europe, not proof of Czech standard equipment. Its document gives wheelbase 2608 mm; this is retained only at the source-specific version scope, not propagated to the whole family.

### Human leads checked

- 440: modern historical monograph distinguishes Standard 920 kg and Export 930 kg; no primary corroboration for the proposed heater/year distinction. No new mass assigned.
- 445: 920 kg not verified from an original manual. 450: manufacturer confirms 930 kg; 935 unverified. Different-source figures were not converted into a configuration range.
- 1201: the proposed STW 1120 / van 1090 kg table explicitly describes 1200. It cannot establish 1201 values. Sedan 1050/1060 conflict remains; original body-specific manuals needed.
- 110 R: manufacturer confirms DIN power convention. The 19/18.5-second acceleration disagreement and alleged half-load condition remain unresolved; acceleration stays null.
- Octavia I AGN: exact early manual/automatic and body/year scope of 10.9 versus 10.6/10.7 seconds remains unresolved.
- Fabia Junior: 1035 versus 1010 kg is not proved to be a 1.0/1.2 mix-up. Original homologation needed; no speculative version added.
- Fabia II RS: manufacturer brochure and press material corroborate 6.2 L/100 km NEDC combined. Fabia I RS 5.3 is recorded only for the documented Euro IV sample.

### Photographs

Four replacements passed whole-car framing: 1201 STW, 422, L&K/Škoda 110, and 1203. Existing 105 family image also passed. Photo references ${before.photos} → ${photos.after}; reviewed ${photos.reviewed}, pending ${photos.pending}. The 1203 image depicts an ambulance and is a family illustration, not the delivery-van trim. Exact build year/factory is unconfirmed. The 105 picture depicts the early body, not every later facelift. Author, licence, file page and review notes retained. No binaries in the repository. 4R remains null; no approved licensed full-car candidate found in this pass, not proof that none exists. Commons 429 responses respected.

### Help wanted

- Original 440/445/450 manuals or homologations giving named configuration mass, driver convention and production date; resolve 450 900 versus 930 kg.
- Original 1201 body-specific mass sheets: sedan 1050/1060; STW, van, ambulance, pickup. Avoid transferring 1200 figures.
- 110 R original acceleration test protocol resolving 19.0 versus 18.5 s; Octavia I AGN 92 kW early factory body/gearbox-specific sheet.
- Fabia Junior original engine/weight sheet; Fabia I RS exact kerb mass and driver convention, and primary 0–100 (not 0–62 mph) data.
- Roomster 2011 wheelbase 2620/2621 reconciliation; original Czech Praktik 2011 technical sheet to confirm market differences.
- Licensed full-car 4R photo; ${photos.pending} existing photo references still await visual review.

Detailed field gaps and withheld lead decisions: skoda-step7-review.json. Remaining gaps are partly sourceable; the range and version coverage are not complete. Build: build-skoda-cards.mjs, then write-skoda-step7-review.mjs; validate-model-cards.mjs and validate-model-lines.mjs.`);
const allSources=[...new Set([...step7Sources,...report.leadDecisions.flatMap(d=>d.sources||[])])];
section('src/data/catalog/SOURCES.md',`## Škoda specifications step 7 — 26 October 2026

Six research groups checked manufacturer brochures, original technical sheets, contemporary press materials and historical manual leads. Individually selected factual values, original structure and Czech notes; source prose and tables were not reproduced wholesale. Copyright in brochures remains with their owners; Wikidata CC0 identity licensing is unchanged. Per-field URLs and dated market/body/gearbox scopes are retained in each version.

Fixtures: ${step7Evidence.map(w=>w.file).join(', ')}. Applied changes: analysis/codex/skoda-step7-evidence.json. Rejected/unresolved human leads and remaining gaps: skoda-step7-review.json. Published-minimum mass policy unchanged; no conflation of incompatible sources into ranges.

${allSources.map(s=>'- '+s).join('\n')}

Commons: four replacement files and one existing file visually inspected in original form from temporary storage. Metadata and API query history: skoda-card-photo-evidence.json, skoda-step7-photo-candidates.json. Review decisions: skoda-step7-photo-review.json. Full vehicle visible with margin in approved images; captions limit body/year applicability. ${photos.pending} references remain pending. No image binaries stored in repository.

${photoReview7.decisions.map(d=>'- '+d.lineSlug+': '+d.file).join('\n')}`);
console.log(JSON.stringify({before:before.counts,existingAfter:existingAfter.counts,after:after.counts,versions:versions.length,added:added.length,renamed:renames.length,fullDimensions:after.completeDimensions,photos,elapsedMinutes},null,2));
