import fs from 'node:fs';
import {step8Evidence,step8Sources,photoReview8} from './skoda-step8.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const cards=read('src/data/catalog/model-cards/skoda.json'),before=read('analysis/codex/skoda-step8-baseline.json');
const versions=cards.flatMap(c=>c.generations.flatMap((g,i)=>(g.trims||[]).map(t=>({lineSlug:c.lineSlug,generationIndex:i,...t}))));
const id=t=>[t.lineSlug,t.generationIndex,t.name].join('/'),at=(o,p)=>p.split('.').reduce((v,k)=>v?.[k],o);
if(versions.length!==before.versions||versions.some(t=>!before.ids.includes(id(t))))throw Error('Unexpected version addition/removal');
const fields=Object.keys(before.counts),counts=Object.fromEntries(fields.map(f=>[f,versions.filter(t=>at(t,f)!=null).length]));
const gs=cards.flatMap(c=>c.generations),photos={references:gs.filter(g=>g.photo).length,reviewed:gs.filter(g=>g.photo?.visualReview==='reviewed').length,pending:gs.filter(g=>g.photo?.visualReview==='pending').length};
const elapsedMinutes=+((Date.now()-Date.parse(before.startedAt))/60000).toFixed(1);
const after={versions:versions.length,counts,completeDimensions:versions.filter(t=>Object.values(t.dimensionsMm).every(v=>v!==null)).length};
const fieldTransitions=read('analysis/codex/skoda-step8-field-transitions.json'),nullFills=fieldTransitions.filter(c=>c.before===null&&c.after!==null).length;
const report={generatedAt:new Date().toISOString(),elapsedMinutes,before,after,nullFills,fieldTransitions,photos,workers:step8Evidence,photoReview:photoReview8,missing:versions.map(t=>({lineSlug:t.lineSlug,generationIndex:t.generationIndex,name:t.name,missing:fields.filter(k=>at(t,k)==null)}))};
write('analysis/codex/skoda-step8-review.json',report);
write('analysis/codex/skoda-step8-evidence.json',{retrievedDate:'2026-10-26',sources:step8Sources,workers:step8Evidence,photoReview:photoReview8,scope:'Existing-version facts only. Source prose/tables not reproduced wholesale. Nominal historic figures retain published tolerances and test-cycle notes.'});
function section(p,text){let s=fs.readFileSync(p,'utf8');const start='<!-- skoda-step8:start -->',end='<!-- skoda-step8:end -->',a=s.indexOf(start),b=s.indexOf(end);if(a>=0&&b>=0)s=s.slice(0,a)+s.slice(b+end.length);fs.writeFileSync(p,s.trimEnd()+'\n\n'+start+'\n'+text+'\n'+end+'\n');}
section('analysis/codex/model-lines-review.md',`## Škoda step 8 — remaining historic consumption and acceleration

All ${versions.length} existing versions retained; no added versions this pass. Three parallel research groups completed. ${nullFills} previously null fields populated, counting individual dimensions, cycle labels and gearbox fields separately. Elapsed ${elapsedMinutes} minutes. Full dimensions ${before.completeDimensions} → ${after.completeDimensions}.

| Field | Before | After |
| --- | ---: | ---: |
${fields.map(f=>`| ${f} | ${before.counts[f]} | ${counts[f]} |`).join('\n')}

Existing Octavia I–III, Superb I–III, Fabia II–III, Roomster, Citigo, European Rapid, Yeti and Kodiaq I version records already had consumption. Workers targeted remaining Felicia/historic fields and exact transmission or dimension gaps. Original source scope and published tolerances remain in each patched record. Nominal manual specifications are not claimed as measured results for every surviving vehicle. Contemporary consumption ranges remain scalar null; no fuel-range minimum selected.

### Photos

${photoReview8.decisions.map(d=>'- '+d.lineSlug+': '+d.decision+' — '+d.noteCs).join('\n')}

References ${before.photos} → ${photos.references}; reviewed ${before.reviewed} → ${photos.reviewed}; pending ${photos.pending}. Rejected images set null. Downloads that returned HTTP429 were not visually approved; no bypass or repeated retry loop. Images viewed only from OS temporary files.

### Help wanted

- Licensed full-car replacements for 1101/1102 and 130/135/136; 4R remains without an approved reference. ${photos.pending} existing references still need review.
- Original Junior homologation/weight sheet and market-specific version identification; existing mass disagreement is unresolved.
- Exact historic acceleration test protocols and editions, especially 110 R 18.5/19.0 s and engine/year/body-specific figures. Do not convert 0–80 or 0–62 mph into 0–100.
- Original prewar and 1950s manuals with consumption protocol, version-specific masses and acceleration; many contemporary descriptions give only maximum speed or approximate fuel consumption.
- Remaining worker-specific gaps, evidence limits and source references are retained in skoda-step8-review.json. Škoda coverage is still partial. This pass demonstrates diminishing returns for already-covered 1990s–2010s consumption; further research should use specific missing documents rather than repeat broad searches.

Rebuild with build-skoda-cards.mjs and write-skoda-step8-review.mjs; run both model validators.`);
section('src/data/catalog/SOURCES.md',`## Škoda specifications step 8 — 26 October 2026

Three research groups checked remaining historic and 1990s–2010s version gaps. Selected manufacturer/manual factual specifications only; own scope notes, no copied prose or entire tables. Exact URLs and measurement definitions retained per field. Manufacturer documents remain copyrighted; Wikidata and Commons licensing unchanged. Worker evidence and limitations: analysis/codex/skoda-step8-evidence.json and skoda-step8-review.json.

${step8Sources.map(u=>'- '+u).join('\n')}

Three existing Commons originals visually inspected. 633 passed whole-car framing; 1101/1102 and 130/135/136 rejected and set null. No new photo files selected or binaries stored. Licence/author metadata retained in skoda-card-photo-evidence.json. Decisions: skoda-step8-photo-review.json; failed requests and pending files: skoda-step8-photo-candidates.json.`);
console.log(JSON.stringify({before:before.counts,after:counts,fullDimensions:after.completeDimensions,photos,elapsedMinutes},null,2));
