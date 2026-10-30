import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {markUnknowns} from './night-card-helpers.mjs';
execFileSync(process.execPath,['analysis/codex/merge-photo-patches-58.mjs'],{stdio:'inherit'});
let changed=0;
const dir='analysis/codex/photo-backfill-60';
for(const file of fs.readdirSync(dir).filter(f=>/^batch-\d+\.json$/.test(f))){
 for(const p of JSON.parse(fs.readFileSync(dir+'/'+file,'utf8'))){
  const path=`src/data/catalog/model-cards/${p.makeSlug}.json`,cards=JSON.parse(fs.readFileSync(path,'utf8'));
  const c=cards.find(c=>c.lineSlug===p.lineSlug),g=c?.generations[p.generationIndex];
  assert(g&&g.name===p.expectedGenerationName,'Stale generation');
  assert(p.photo.source==='commons'&&p.photo.visualReview==='reviewed'&&p.photo.author&&p.photo.licence&&p.photo.filePageUrl);
  if(g.photo?.url===p.photo.url&&JSON.stringify(g.photo)===JSON.stringify(p.photo))continue;
  assert(!g.photo||g.photo.url===p.photo.url,'Existing different photo must not be overwritten');
  g.photo=p.photo;
  const key=`generations[${p.generationIndex}].photo`;
  c.needsReview=c.needsReview.filter(r=>r.field!==key&&!r.field.startsWith(key+'.'));
  markUnknowns(c);
  fs.writeFileSync(path,JSON.stringify(cards,null,2)+'\n');changed++;
 }
}
console.log(changed+' turn60 photos merged.');
