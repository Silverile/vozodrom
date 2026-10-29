import fs from 'node:fs';
import assert from 'node:assert/strict';
import {applySelectorExclusions} from '../sweep/selector-exclusions.mjs';
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const audit = read('analysis/sweep/codex/slug-collision-merges.json');
const raw = read('src/data/catalog/models-auto.json');
const auto = read('src/data/catalog/model-lines-auto.json');
const additions = read('src/data/catalog/model-line-additions.json');
const lineIndex = read('src/data/model-lines-index.json');
const cardIndex = read('src/data/model-cards-index.json');
const front = read('src/data/front-drawings.json');
const cardFiles = ['src/data/model-cards', 'src/data/catalog/model-cards'].flatMap(d => fs.readdirSync(d).filter(f => f.endsWith('.json')).map(f => `${d}/${f}`));
const cards = cardFiles.flatMap(read);
const routes = [];
for (const a of audit) {
  const {makeSlug:make, oldSlug:old, targetSlug:slug, qid} = a;
  assert(!raw.some(r => r.makeSlug === make && r.slug === old));
  for (const rows of [auto, additions]) {
    const t = rows.filter(r => r.makeSlug === make && r.slug === slug);
    assert.equal(t.length, 1, `${make}/${slug}: canonical line count`);
    assert.equal(t[0].wikidataQid, qid);
    assert(t[0].aliases.includes(old));
    assert(!rows.some(r => r.makeSlug === make && r.slug === old));
  }
  const targetCards = cards.filter(c => c.makeSlug === make && c.lineSlug === slug);
  assert(targetCards.length);
  assert(targetCards.every(c => c.aliases.includes(old)));
  assert(!cards.some(c => c.makeSlug === make && c.lineSlug === old));
  assert(!lineIndex[make].some(l => l.slug === old));
  assert.equal(lineIndex[make].filter(l => l.slug === slug).length, 1);
  assert(!Object.hasOwn(cardIndex[make], old));
  assert(Object.hasOwn(cardIndex[make], slug));
  assert(!Object.hasOwn(front, `${make}--${old}`));
  assert(!fs.readdirSync('public/front').some(f => f.startsWith(`${make}--${old}--`)));
  // Exercise the real rebuild exclusion helper and its same-QID preservation boundary.
  const canonical = {...a.before, slug};
  assert.deepEqual(applySelectorExclusions('models-auto', [a.before, canonical]), [canonical]);
  const exists = s => fs.existsSync(`out/katalog/${make}/${s}.html`) || fs.existsSync(`out/katalog/${make}/${s}/index.html`);
  if (process.argv.includes('--routes')) {
    assert(!exists(old), `${make}/${old}: obsolete static route`);
    assert(exists(slug), `${make}/${slug}: missing static route`);
    routes.push(`${make}/${slug}`);
  }
}
console.log(JSON.stringify({merged: audit.length, identitiesAliasesIndexesDrawings:'passed', durableExclusionCases:audit.length * 2, staticRoutes:routes}, null, 2));
