import fs from'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),r=read('analysis/codex/skoda-wide-photos-review.json'),cards=read('src/data/catalog/model-cards/skoda.json'),e=read('analysis/codex/skoda-card-photo-evidence.json');
const gs=cards.flatMap(c=>c.generations),counts={photos:gs.filter(g=>g.photo).length,reviewed:gs.filter(g=>g.photo?.visualReview==='reviewed').length,pending:gs.filter(g=>g.photo?.visualReview==='pending').length};
function section(path,text){let s=fs.readFileSync(path,'utf8');const start='<!-- skoda-wide-photos:start -->',end='<!-- skoda-wide-photos:end -->',a=s.indexOf(start),b=s.indexOf(end);if(a>=0&&b>=0)s=s.slice(0,a)+s.slice(b+end.length);fs.writeFileSync(path,s.trimEnd()+'\n\n'+start+'\n'+text+'\n'+end+'\n');}
const table=r.replaced.map(d=>`| ${d.lineSlug} / generation ${d.generationIndex+1} | ${d.oldAspect.toFixed(3)} | ${d.newAspect.toFixed(3)} |`).join('\n');
section('analysis/codex/model-lines-review.md',`## Škoda photo aspect and margin pass — 26 October 2026

Human instructions #37–38 supersede previous framing preferences: whole vehicle, approximately5% minimum margin on every side, front three-quarter; prefer1.4–1.7 aspect. Audit used Claude-owned src/data/photo-sizes.json plus existing Commons metadata. ${r.targets} photographs were outside1.3–1.75; ${r.replaced.length} replaced and ${r.kept.length} retained after candidate checks. Three parallel researchers plus root; ${r.elapsedMinutes} minutes to merge. No commits or image editing. No image binaries in repository.

| Line / generation | Old aspect | New aspect |
| --- | ---: | ---: |
${table}

Popular and Epiq are explicitly documented4:3 fallbacks within the display fill band, with unusually ample vertical margin to withstand16:10 cover. Other replacements are close to3:2. Approved images were inspected as originals or published proportional960px previews; method and exact file licence/author are in worker evidence. Reviewed status does not certify specific trim/year/originality. FabiaIII changes facelift phase within the generation. OctaviaIV changes the illustration from liftback toCombi within the same generation. The Praktik car is relatively small against a harbour background; all parts remain visible.

### Retained targets

${r.kept.map(d=>'- '+d.lineSlug+' / generation '+(d.generationIndex+1)+': '+(d.reasonCs||d.reason)).join('\n')}

Retained does not mean newly approved framing. No suitable inspected replacement was accepted in this pass; this is not proof that no other suitable Commons file exists. API/original requests returned429; API calls stopped, available published previews and cached file pages were used, without repeatedly retrying blocked originals.

### Missing and integration

Still missing: ${r.stillMissing.map(d=>d.lineSlug).join(', ')}. Total ${counts.photos} photo references, ${counts.reviewed} reviewed and ${counts.pending} pending. Existing reviewed status predates this stricter margin rule unless included in this pass; it is not a certification of all existing photos under the new rule.

Claude must merge **analysis/codex/skoda-wide-photo-size-additions.json** into its **src/data/photo-sizes.json** so display aspect lookup uses the new URLs. Codex did not modify that Claude-owned file. Specifications and all172 versions unchanged, verified by SHA256 comparison of version, engine and dimensions data.

Evidence: skoda-wide-photos-review.json, skoda-step10-photo-review.json, worker-wide-*.json. Rebuild: merge-skoda-wide-photos.mjs then build-skoda-cards.mjs; validate-skoda-wide-photos.mjs and validate-model-cards.mjs. Do not rerun the baseline audit on the updated catalogue when reproducing this pass.`);
section('src/data/catalog/SOURCES.md',`## Škoda photo framing replacements — 26 October 2026

Commons photo references only; no image binaries copied into repository. Author, licence URL and source file page retained for each selected photo. Visual decisions recorded in analysis/codex/skoda-step10-photo-review.json and worker-wide-*.json. ${r.replaced.length} replaced / ${r.kept.length} retained from ${r.targets} aspect outliers. Sources viewed as original files or proportional published previews; metadata read through API where available or rendered/cached Commons file pages. New policy prefers entire vehicle, approximately5%margin, front three-quarter, aspect near3:2. Popular/Epiq4:3 fallbacks have ample vertical margin. No local image cropping/editing. Commons CC licences unchanged.

${r.replaced.map(d=>{const p=e.files[d.newFile];return '- ['+d.newFile+']('+p.filePageUrl+') — '+p.authorHtml+'; '+p.licence+'; '+p.width+'×'+p.height+'.';}).join('\n')}

Full ratio and kept/missing report: analysis/codex/skoda-wide-photos-review.json. Size-registry handoff: analysis/codex/skoda-wide-photo-size-additions.json. Existing versions/specifications unchanged. This pass does not finish all remaining photo reviews.`);
console.log(JSON.stringify(counts));
