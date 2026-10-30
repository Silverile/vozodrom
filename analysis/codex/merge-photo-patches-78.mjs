import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {markUnknowns} from './night-card-helpers.mjs';
execFileSync(process.execPath,['analysis/codex/merge-photo-patches-76.mjs'],{stdio:'inherit'});
const d='analysis/codex/photo-backfill-78',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const patches=fs.readdirSync(d).filter(f=>/^batch-\d+\.json$/.test(f)).flatMap(f=>read(d+'/'+f));
if(fs.existsSync('analysis/codex/mazda-photos-78/batch001.json'))patches.push(...read('analysis/codex/mazda-photos-78/batch001.json'));
const keys=new Set();let added=0;
for(const make of new Set(patches.map(p=>p.makeSlug))){
 const path=`src/data/catalog/model-cards/${make}.json`,cards=read(path);
 for(const p of patches.filter(p=>p.makeSlug===make)){
  const key=[make,p.lineSlug,p.generationIndex].join('/');assert(!keys.has(key));keys.add(key);
  const c=cards.find(c=>c.lineSlug===p.lineSlug),g=c?.generations[p.generationIndex];
  assert.equal(g?.name,p.expectedGenerationName,'Generation identity changed: '+key);
  assert(p.photo.author&&p.photo.licence&&p.photo.licenceUrl&&p.photo.visualReview==='reviewed');
  assert(!g.photo||g.photo.url===p.photo.url,'Different existing photograph: '+key);
  if(!g.photo)added++;g.photo=p.photo;
  c.needsReview=c.needsReview.filter(r=>!r.field.startsWith(`generations[${p.generationIndex}].photo`));markUnknowns(c);
 }
 fs.writeFileSync(path,JSON.stringify(cards,null,2)+'\n');
}
console.log(`Turn78: ${added} newly filled photographs / ${patches.length} distinct selected references.`);
