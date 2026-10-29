import fs from 'node:fs';
import assert from 'node:assert/strict';
import {applySlugMigrations, slugMigrations} from './slug-migrations.mjs';
const models = JSON.parse(fs.readFileSync('src/data/catalog/models-auto.json'));
const routes = [];
for (const m of slugMigrations) {
  assert(!models.some(r => r.makeSlug === m.make && r.slug === m.old));
  const model = models.find(r => r.makeSlug === m.make && r.slug === m.slug);
  assert(model.aliases.includes(m.old));
  for (const slug of [m.old, m.slug]) {
    const rebuilt = {...model, slug, aliases: []};
    applySlugMigrations([rebuilt]);
    assert.equal(rebuilt.slug, m.slug);
    assert(rebuilt.aliases.includes(m.old));
  }
  for (const field of ['name', 'productionStart', 'productionEnd', 'bodyTypes']) {
    if (field in m) assert.deepEqual(model[field], m[field]);
  }
  const exists = slug => fs.existsSync(`out/katalog/${m.make}/${slug}.html`) || fs.existsSync(`out/katalog/${m.make}/${slug}/index.html`);
  assert(!exists(m.old), `Old route exists: ${m.make}/${m.old}`);
  const exported = exists(m.slug);
  assert.equal(exported, m.make === 'willys');
  routes.push({make: m.make, old: m.old, slug: m.slug, oldRoute: false, newRoute: exported, scope: exported ? 'card-backed page' : 'raw identity only; no model line/card generates a page'});
}
console.log(JSON.stringify({identities: 5, aliases: 'passed', rebuildOverrideCases: 10, routes}, null, 2));
