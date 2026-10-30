import fs from'node:fs';
const audit=JSON.parse(fs.readFileSync('analysis/codex/photo-root-audit-48.json'));
for(const make of ['dkw','delorean']){const path=`analysis/codex/${make}-photos/selected.json`;let selected=JSON.parse(fs.readFileSync(path));
// The near-square Junior candidate is too close to the card's crop boundary.
if(make==='dkw')selected=selected.filter(p=>p.lineSlug!=='junior');
for(const p of selected){const r=audit.results.find(r=>r.make===make&&r.requestedTitle===p.photo.file);if(!r)throw Error('Missing exact audit '+p.photo.file);Object.assign(p.photo,r.commons);p.photo.credit=`${p.photo.author} / Wikimedia Commons / ${p.photo.licence}`;}
fs.writeFileSync(path,JSON.stringify(selected,null,2)+'\n');}
audit.resolution={appliedAt:new Date().toISOString(),decision:'Use exact-file Commons preferred licence consistently; f11 CC BY-SA3.0 selected instead of alternativeGFDL. Junior1.305aspect candidate removed for framing; no claim that a suitable replacement does not exist.'};
fs.writeFileSync('analysis/codex/photo-root-audit-48.json',JSON.stringify(audit,null,2)+'\n');
console.log('Applied preferred exact-file credits; removed near-square Junior candidate.');
