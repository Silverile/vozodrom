import fs from 'node:fs';
import assert from 'node:assert/strict';
const dir='analysis/codex/photo-root-42';
const batches=fs.readdirSync(dir).filter(f=>/^batch-\d+\.json$/.test(f));
const patches=batches.flatMap(f=>JSON.parse(fs.readFileSync(`${dir}/${f}`,'utf8')));
const candidates=fs.readdirSync(dir).filter(f=>f==='candidates.json'||/^wave\d+-candidates\.json$/.test(f)).flatMap(f=>JSON.parse(fs.readFileSync(`${dir}/${f}`,'utf8')));
const seen=new Set();
for(const p of patches){
  const key=`${p.makeSlug}/${p.lineSlug}/${p.generationIndex}`;
  assert(!seen.has(key),`Duplicate ${key}`);seen.add(key);
  const cards=JSON.parse(fs.readFileSync(`src/data/catalog/model-cards/${p.makeSlug}.json`,'utf8'));
  const generation=cards.find(c=>c.lineSlug===p.lineSlug).generations[p.generationIndex];
  assert.equal(generation.name,p.expectedGenerationName);
  assert.equal(generation.photo.url,p.photo.url,`Patch not merged: ${key}`);
  const c=candidates.find(c=>(c.ii?.url||c.imageinfo?.[0]?.url)===p.photo.url);
  assert(c,`No retrieved metadata: ${key}`);
  const info=c.ii||c.imageinfo[0],aspect=info.width/info.height;
  assert(aspect>=1.3&&aspect<=1.75,`Outside UI fill band: ${key}`);
  assert(p.photo.author&&p.photo.licence&&p.photo.filePageUrl.startsWith('https://commons.wikimedia.org/'));
  assert.equal(p.photo.visualReview,'reviewed');
}
console.log(`PASS: ${patches.length} root-selected Commons photos merged, unique targets, retrieved metadata and UI aspect band. Framing was checked during selection.`);
