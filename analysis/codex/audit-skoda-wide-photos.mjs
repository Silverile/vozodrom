import fs from 'node:fs';
const cards=JSON.parse(fs.readFileSync('src/data/catalog/model-cards/skoda.json','utf8')),sizes=JSON.parse(fs.readFileSync('src/data/photo-sizes.json','utf8')),e=JSON.parse(fs.readFileSync('analysis/codex/skoda-card-photo-evidence.json','utf8'));
const rows=cards.flatMap(c=>c.generations.map((g,i)=>{const p=g.photo,s=p?(sizes[p.url]||[e.files[p.file]?.width,e.files[p.file]?.height]):null;return {lineSlug:c.lineSlug,generationIndex:i,name:g.name,from:g.from,to:g.to,file:p?.file??null,url:p?.url??null,width:s?.[0]??null,height:s?.[1]??null,aspect:s?.[0]&&s[1]?s[0]/s[1]:null};}));
const report={startedAt:new Date().toISOString(),targets:rows.filter(r=>r.aspect!==null&&(r.aspect>1.75||r.aspect<1.3)),missing:rows.filter(r=>!r.file),unknownSize:rows.filter(r=>r.file&&r.aspect===null)};
fs.writeFileSync('analysis/codex/skoda-wide-photos-baseline.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
