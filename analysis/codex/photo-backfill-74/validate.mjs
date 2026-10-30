import fs from 'node:fs';
import assert from 'node:assert/strict';
const d='analysis/codex/photo-backfill-74',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const candidates=read(d+'/candidates.json'),keys=new Set();let n=0;
for(const f of fs.readdirSync(d).filter(f=>/^batch-\d+\.json$/.test(f)))for(const p of read(d+'/'+f)){
 const key=[p.makeSlug,p.lineSlug,p.generationIndex].join('/');assert(!keys.has(key));keys.add(key);
 const c=candidates.find(c=>c.ii.url.split('?')[0]===p.photo.url);assert(c);
 assert(c.ii.width/c.ii.height>=1.4&&c.ii.width/c.ii.height<=1.7);
 assert(p.photo.author&&p.photo.licence&&p.photo.licenceUrl&&p.photo.filePageUrl);
 assert.equal(p.photo.visualReview,'reviewed');assert.equal(p.photo.source,'commons');
 const cards=read(`src/data/catalog/model-cards/${p.makeSlug}.json`),g=cards.find(c=>c.lineSlug===p.lineSlug).generations[p.generationIndex];
 assert.equal(g.name,p.expectedGenerationName);assert.equal(g.photo.url,p.photo.url);n++;
}
assert.equal(read(d+'/report.json').selected.length,n);
console.log(`PASS ${n} distinct generation photo patches, framing ratios, explicit credit and merged targets; ${candidates.length} metadata candidates retained.`);
