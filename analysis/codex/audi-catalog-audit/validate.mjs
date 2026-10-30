import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { stripTypeScriptTypes } from 'node:module';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const before=read('analysis/codex/audi-catalog-audit/before.json');
const cards=read('src/data/catalog/model-cards/audi.json');
const lines=read('src/data/model-lines-index.json').audi;
const index=read('src/data/model-cards-index.json').audi;
const review=read('src/data/front-drawing-review.json');
assert.equal(cards.length,76);
assert.equal(new Set(cards.map(c=>c.lineSlug)).size,cards.length);
assert(before.cards.every(c=>cards.some(x=>x.lineSlug===c.lineSlug)));
for(const slug of ['s3','rs3','s4','rs4','s6','rs6','sq5','sq7','rs-q3','rs-q8','tts','tt-rs']){
  assert(lines.some(l=>l.slug===slug)); assert(index[slug]);
  if(['s3','s4','s6','sq5','sq7','rs-q8','tts'].includes(slug))assert.equal(index[slug].generations.length,0,'Unresearched derivative must not inherit base generations');
}
for(const [slug,count] of Object.entries({rs2:1,rs3:3,rs4:4,rs5:3,rs6:4,'rs-q3':2,'tt-rs':2,s2:1,'s6-plus':1})){
  assert.equal(index[slug].generations.length,count,slug);
  assert.equal(lines.find(l=>l.slug===slug).generations.length,count,slug+' index alignment');
}
assert.equal(index.rs3.generations[0].from,2011);
assert.equal(index.rs5.generations[2].from,2026);
assert.equal(index.rs3.generations[2].facelifts[0].year,2024);
assert.equal(index['tt-rs'].generations[1].from,2016);
assert(index.rs6.generations.slice(2).every(g=>g.to===null&&!g.current));
assert.equal(lines.find(l=>l.slug==='rs6').to,null,'Partial historical end dates cannot end the whole line');
assert.deepEqual(index.a4.generations.map(g=>g.code),['B5 (8D)','B6 (8E/8H)','B7 (8E/8H)','B8 (8K)','B9 (8W)']);
for(const [slug,count] of Object.entries({'80':4,'100':4,'200':2,r8:2,a7:2,q7:3})) assert.equal(index[slug].generations.length,count);
assert.equal(index.f103.name,'F103');
assert.equal(index['920'].generations[0].to,1940);
assert.equal(index['q8-e-tron'].generations.length,1);
assert.equal(index['q8-e-tron'].generations[0].facelifts[0].year,2023);
for(const c of cards) for(const g of c.generations){
  assert(g.from==null||g.to==null||g.from<=g.to);
  assert(g.sources.length);
}
for(const slug of ['80','100','200','r8','a7']) assert.equal(review[`audi--${slug}`],'pending_review');
// Execute the actual TypeScript resolver against the actual generated browser index.
const exports={};
const source=stripTypeScriptTypes(fs.readFileSync('src/lib/makes.ts','utf8'))
  .replace(/^import .+;$/gm,'').replace(/\bexport /g,'');
vm.runInNewContext(source+'\nexports.resolveModelLine=resolveModelLine;', {exports,index:read('src/data/makes-index.json'),lineIndex:read('src/data/model-lines-index.json')});
for(const name of ['RS6','RS 6','RS6 Avant','RS 6 Avant']) assert.equal(exports.resolveModelLine('audi',name)?.slug,'rs6');
assert.equal(exports.resolveModelLine('audi','S line'),undefined);
assert.notEqual(exports.resolveModelLine('audi','SQ8')?.slug,exports.resolveModelLine('audi','RS Q8')?.slug);
assert.equal(exports.resolveModelLine('audi','TT RS')?.slug,'tt-rs');
assert.equal(exports.resolveModelLine('audi','RS6 e-tron'),undefined);
assert.equal(exports.resolveModelLine('audi','e-tron')?.slug,'q8-e-tron');
assert.equal(exports.resolveModelLine('audi','e-tron GT')?.slug,'e-tron-gt');
console.log('PASS: 76 unique identities, 46 old slugs preserved, model-specific performance generations, RS5 2026, facelifts not generations, unknown end dates not current, aliases and artwork quarantine.');
