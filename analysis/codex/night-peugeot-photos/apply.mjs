import fs from 'node:fs';
import assert from 'node:assert/strict';
const d='analysis/codex/night-peugeot-photos';
const patches=JSON.parse(fs.readFileSync(d+'/batch-001.json','utf8'));
const cards=JSON.parse(fs.readFileSync('src/data/catalog/model-cards/peugeot.json','utf8'));
for(const p of patches){const g=cards.find(c=>c.lineSlug===p.lineSlug).generations[p.generationIndex];assert.equal(g.name,p.expectedGenerationName);assert.ok(p.photo.author&&p.photo.licenceUrl);g.photo=p.photo;}
for(const c of cards)c.needsReview=c.needsReview.filter(r=>!/^generations\[\d+\]\.photo$/.test(r.field)||!c.generations[Number(r.field.match(/\[(\d+)\]/)[1])].photo);
fs.writeFileSync('src/data/catalog/model-cards/peugeot.json',JSON.stringify(cards,null,2)+'\n');
const r=JSON.parse(fs.readFileSync('analysis/codex/night-peugeot-report.json','utf8'));
r.counts.photos=cards.flatMap(c=>c.generations).filter(g=>g.photo).length;
for(const l of r.generationCoverage){const c=cards.find(c=>c.lineSlug===l.lineSlug);l.generations.forEach((g,i)=>g.hasPhoto=!!c.generations[i].photo);}
r.gaps=r.gaps.filter(g=>g!=='Photos all pending Commons visual/licence review.');
const gap='3 priority photographs reviewed: 208 II, 308 III, 2008 I. Other 59 generation photographs pending; 35 bounded search candidates do not exhaust Commons.';
if(!r.gaps.includes(gap))r.gaps.push(gap);
r.rebuildOrder=['node analysis/codex/night-peugeot-build.mjs','node analysis/codex/night-peugeot-photos/apply.mjs','node analysis/codex/night-peugeot-validate.mjs'];
fs.writeFileSync('analysis/codex/night-peugeot-report.json',JSON.stringify(r,null,2)+'\n');
console.log('Applied '+patches.length+' keyed reviewed photos; total '+r.counts.photos);
