import fs from 'node:fs';
import {step9Evidence,step9Sources} from './skoda-step9.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
const before=read('analysis/codex/skoda-step9-baseline.json'),cards=read('src/data/catalog/model-cards/skoda.json');
const trims=cs=>cs.flatMap(c=>c.generations.flatMap((g,i)=>(g.trims||[]).map(t=>({lineSlug:c.lineSlug,generationIndex:i,...t}))));
const old=trims(before.cards),now=trims(cards),id=t=>[t.lineSlug,t.generationIndex,t.name].join('/'),at=(o,p)=>p.split('.').reduce((v,k)=>v?.[k],o);
if(old.some(t=>!now.some(n=>id(n)===id(t))))throw Error('Original version lost');
const transitions=step9Evidence.flatMap(w=>(w.patches||[]).flatMap(p=>{const t=old.find(t=>t.lineSlug===p.lineSlug&&t.generationIndex===p.generationIndex&&t.name===p.trimName);return Object.entries(p.fields).map(([field,after])=>({lineSlug:p.lineSlug,name:p.trimName,field,before:at(t,field)??null,after}));}));
const generationTransitions=step9Evidence.flatMap(w=>(w.generationPatches||[]).flatMap(p=>Object.entries(p.fields).map(([field,after])=>({lineSlug:p.lineSlug,generationIndex:p.generationIndex,field,before:at(before.cards.find(c=>c.lineSlug===p.lineSlug).generations[p.generationIndex],field)??null,after}))));
const additions=now.filter(n=>!old.some(t=>id(t)===id(n)));
const fields=['massKg','acceleration0to100s','consumptionL100','consumptionKwh100','rangeKm'];
const stats=cs=>{const ts=trims(cs),gs=cs.flatMap(c=>c.generations);return {versions:ts.length,counts:Object.fromEntries(fields.map(f=>[f,ts.filter(t=>t[f]!=null).length])),completeDimensions:ts.filter(t=>Object.values(t.dimensionsMm).every(v=>v!==null)).length,photos:gs.filter(g=>g.photo).length,reviewed:gs.filter(g=>g.photo?.visualReview==='reviewed').length,pending:gs.filter(g=>g.photo?.visualReview==='pending').length};};
const elapsedMinutes=+((Date.now()-Date.parse(before.startedAt))/60000).toFixed(1),beforeStats=stats(before.cards),afterStats=stats(cards);
const report={generatedAt:new Date().toISOString(),elapsedMinutes,before:beforeStats,after:afterStats,transitions,generationTransitions,additions,workers:step9Evidence,photoCandidate:read('analysis/codex/skoda-step9-4r-photo-review.json'),decision:'Close broad Škoda research loop after this targeted pass. Remaining issues require exact source documents or catalogue-compatible photo permission, not repeating these six URLs.'};
write('analysis/codex/skoda-step9-review.json',report);
write('analysis/codex/skoda-step9-evidence.json',{retrievedDate:'2026-10-26',sources:step9Sources,transitions,generationTransitions,additions,workers:step9Evidence,photoCandidate:report.photoCandidate});
function section(p,text){let s=fs.readFileSync(p,'utf8');const start='<!-- skoda-step9:start -->',end='<!-- skoda-step9:end -->',a=s.indexOf(start),b=s.indexOf(end);if(a>=0&&b>=0)s=s.slice(0,a)+s.slice(b+end.length);fs.writeFileSync(p,s.trimEnd()+'\n\n'+start+'\n'+text+'\n'+end+'\n');}
const urls=['https://motomuseum-hostalek.cz/index.php?grhead=2&nav=01&id_group=47&t=_art_print&id_art=1049','https://www.skoda-storyboard.com/cs/tiskove-zpravy-archiv/zaklad-sportovnich-uspechu-skoda-110-r-erko-1971/','https://ru.scribd.com/document/81802893/Manual-Skoda-Octavia-1-8-92kW','https://www.auto.cz/test-skoda-fabia-junior-cena-jako-zaklinadlo-1181','https://skodaroomster.eu/tech-udaje.html','https://www.skoda-storyboard.com/cs/09-skoda-4r-limousina/'];
section('analysis/codex/model-lines-review.md',`## Škoda step 9 — six human-supplied sources

Targeted pass completed by three workers and root in ${elapsedMinutes} minutes. No broad search. Existing ${old.length} version identities retained; ${additions.length} separately identified version added. Total ${now.length}. Detailed per-field before/after and source access limits: skoda-step9-review.json.

1. **Hošťálek:** supplied URL is about **1201**, not 440/445/450. It reports own weight 1050 kg for the closed passenger body and 1220 kg for ambulance, plus period consumption without a protocol. This does not settle the earlier kerb-weight definitions/configurations or supply 440-series specifications. Existing mass nulls retained.
2. **110 R Storyboard:** massBasis null → period kerb, driver/load convention unspecified; existing 880 kg unchanged. Length, width, height and power corroborated. No acceleration or consumption figure on this supplied page; 18.5/19.0 s remains unresolved.
3. **Octavia manual:** readable canonical Scribd copy is an engine-repair manual, not a vehicle performance sheet. The 10.9 occurrences identify bolt strength grades. Acceleration null → null; no guessed gearbox/body performance.
4. **Auto.cz Junior:** test is the separate **1.2 HTP, 1198 cm³, 3 cylinders, 40 kW**. The 1010 kg figure does not resolve the existing 1.0 MPI mass. Added a separately scoped pre-facelift test sample with its documented mass, dimensions, torque, speed, acceleration and combined consumption; year, driver inclusion, gearbox and drive unknown. Direct page returned403; indexed technical passages inspected. No claim of full-page direct access.
5. **Roomster microsite:** body 4214×1684×1607 mm corroborated; 2620 mm wheelbase still conflicts with 2621 in the original May2011 brochure. Exact TSI wheelbase null → null. Earlier 2007 dimensions retained under their own dated scope.
6. **4R Storyboard:** version drive null → rwd; generation drivetrains null → [rwd]; productionUnits absent → **975** for the whole model family, not surviving cars or advertisements. Existing 1928–1930 dates corroborated. No mass, dimensions or performance in caption. Optional productionUnits type and validation added.

### 4R photograph

Original manufacturer image visually passed: whole vehicle in frame with margin. Publisher is Škoda Auto; individual photographer not established. Footer permits adequate press/news use subject to stated conditions, but does not expressly grant permanent commercial-catalogue reuse. **Public card photo remains null**, with URL, publisher, terms, visual decision and usage uncertainty preserved in skoda-step9-4r-photo-review.json. This is not a Commons/free-content licence. No binary stored in repository. Existing photo review remains ${afterStats.reviewed} reviewed / ${afterStats.pending} pending.

### Closing the Škoda research loop / Help wanted

These six leads are processed. Close broad research now; remaining gaps are explicit and should await specific new evidence: original 440-series and body-specific1201 weight documents; Junior1.0 mass/homologation; earlyAGN vehicle performance sheet;110R acceleration protocol; Roomster wheelbase correction; licensed full-car replacements or explicit permission covering catalogue reuse of the4R photo. Existing tables remain partial and do not claim all versions are documented.

Rebuild: build-skoda-cards.mjs, write-skoda-step9-review.mjs; run model-card and model-line validators.`);
section('src/data/catalog/SOURCES.md',`## Škoda targeted sources step 9 — 26 October 2026

Only six human-supplied URLs, the equivalent public canonical Scribd address and already-held Roomster manufacturer evidence were inspected. Facts individually structured; source prose, complete tables and image binaries not copied. Detailed source decisions, before/after values and access limits: analysis/codex/skoda-step9-review.json and worker-step9-*.json. A separate Junior1.2HTP technical sample is distinguished from Junior1.0MPI. ProductionUnits is a source-published historical total, not fabricated market statistics.

${urls.map(u=>'- '+u).join('\n')}

Scribd canonical equivalent: https://www.scribd.com/document/81802893/Manual-Skoda-Octavia-1-8-92kW . Auto.cz direct access403; indexed technical excerpts used, not a claim of unrestricted page access. 4R original candidate and terms: skoda-step9-4r-photo-review.json. Its whole-car framing passes, but catalogue reuse permission is unconfirmed, so the photo is not in the public card. No free licence inferred from press/news permission.`);
console.log(JSON.stringify({before:beforeStats,after:afterStats,transitions,generationTransitions,added:additions.map(t=>t.name),elapsedMinutes},null,2));
