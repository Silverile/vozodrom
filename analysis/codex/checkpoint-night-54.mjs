import fs from 'node:fs';
import crypto from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const progress=read('analysis/codex/night-progress.json');
const names=['fiat','fisker','fisker-automotive','force-motors','forthing','fsm','fso','gaz'];
const done=progress.done.filter(d=>names.includes(d.make));
const after=progress.done.reduce((t,d)=>({makes:t.makes+1,cards:t.cards+d.lines,generations:t.generations+d.generations,versions:t.versions+d.versions,photos:t.photos+d.photos}),{makes:0,cards:0,generations:0,versions:0,photos:0});
const checkpoint={startedAt:'2026-10-27T02:35:40Z',finishedAt:new Date().toISOString(),elapsedMinutes:Math.round((Date.now()-Date.parse('2026-10-27T02:35:40Z'))/6000)/10,before:{makes:75,cards:1617,generations:2077,versions:624,photos:445},after,done,photoBackfill:read('analysis/codex/photo-backfill-54/report.json'),next:progress.next,remainingMakes:progress.remaining.length,externallyCovered:progress.externallyCovered,notes:[
 'Three concurrent make researchers plus root photo/review/integration work. No commits, publishing or application-index generation.',
 'Saved coverage is partial; Fiat remains a priority follow-up for full European version tables. Family identity coverage is not completed version coverage.',
 'Fisker Inc. Ocean and Fisker Automotive Karma remain distinct. European Ocean rollout acceleration is not an unqualified standing-start figure; US/EU values are separate.',
 'FSM and FSO periods refer to the named manufacturer/badge, not the complete global Fiat or Daewoo production periods.',
 'Commons and Wikipedia direct requests encountered HTTP429. Cached exact-file metadata and inspected individual thumbnails supplied focused fallback; null photos do not imply absence.',
 'Root added three Ferrari photos, including F40 with the photographer watermark retained. Other tight, rear, detail and insecurely identified images were rejected. Fiat BravoI and PuntoI use explicit4:3 fallback exceptions; GAZ24 has an inspected rear-three-quarter photograph.',
 'Read-only check confirms Claude applied cover threshold1.44–1.75 and unknown-aspect contain in CarPhoto.tsx. Rendered UI was not tested.',
 'Force legacy Viking retained as manufacturer-documented1964LCV, not automatically treated as laterbus/chassis namesake. S7 source-date conflict recorded; launch dates are not guessed production starts.'
],changedFiles:[]};
const md=`# Night checkpoint 54\n\nElapsed ${checkpoint.elapsedMinutes} minutes. NEXT: ${checkpoint.next}; ${checkpoint.remainingMakes} makes remain in the A–Z queue. Saved does not mean complete history or complete version tables.\n\n| Make | Cards | Generation/family records | Selected technical rows | Photos |\n| --- | ---: | ---: | ---: | ---: |\n${done.map(d=>`| ${d.make} | ${d.lines} | ${d.generations} | ${d.versions} | ${d.photos} |`).join('\n')}\n\nCumulative: ${JSON.stringify(checkpoint.before)} → ${JSON.stringify(after)}.\n\n${checkpoint.notes.map(x=>'- '+x).join('\n')}\n\n## Help wanted\n\nFiat requires dedicated follow-up for its many eras without technical versions, historic dimensions/engines and missing generation photographs. The per-make reports name omissions and source conflicts; the live progress table overrides earlier photo totals. Karma still needs a suitable full-car Commons photograph and resolution of the factory2404/2405kg mass discrepancy. Current nulls and HTTP429 gaps are not source-exhaustion claims.\n\nClaude-owned skips: ${progress.externallyCovered.map(x=>x.make).join(', ')||'none'}. Check external files again before starting each next make. No pending worker should continue writing after handoff.\n\nRebuild after review: integrate-night-cards.mjs, merge-photo-patches-54.mjs, night-progress.mjs, write-night-review.mjs; then the catalogue validators. Application index remains Claude-owned.\n`;
fs.writeFileSync('analysis/codex/night-checkpoint-54.md',md);
const baseline=read('analysis/codex/turn-54-baseline.json'),hashes={};
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())walk(p);else hashes[p]=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');}}
walk('analysis/codex');walk('src/data/catalog');
checkpoint.changedFiles=[...new Set([...Object.keys(hashes).filter(p=>hashes[p]!==baseline[p]),...Object.keys(baseline).filter(p=>!(p in hashes)),'analysis/codex/turn-54-checkpoint.json'])].sort();
fs.writeFileSync('analysis/codex/turn-54-checkpoint.json',JSON.stringify(checkpoint,null,2)+'\n');
console.log(JSON.stringify({after,done,next:checkpoint.next,remaining:checkpoint.remainingMakes,elapsedMinutes:checkpoint.elapsedMinutes,changedFiles:checkpoint.changedFiles},null,2));
