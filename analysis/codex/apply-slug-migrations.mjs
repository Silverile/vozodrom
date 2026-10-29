import fs from 'node:fs';
import {applySlugMigrations, slugMigrations} from './slug-migrations.mjs';

const changed = [];
function save(file, data) {
  const before = fs.readFileSync(file, 'utf8');
  if (JSON.stringify(JSON.parse(before)) === JSON.stringify(data)) return;
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  changed.push(file);
}
const catalogFiles = ['models-auto', 'model-lines-auto', 'model-line-additions'].map(n => `src/data/catalog/${n}.json`);
const cardFiles = ['src/data/model-cards', 'src/data/catalog/model-cards'].flatMap(d => fs.readdirSync(d).filter(n => n.endsWith('.json')).map(n => `${d}/${n}`));
const files = [...catalogFiles, ...cardFiles];
// Check every target before any mutation. An already-migrated record is allowed on reruns.
for (const m of slugMigrations) {
  const records = files.flatMap(f => JSON.parse(fs.readFileSync(f)).map(r => ({file: f, ...r})));
  const old = records.filter(r => r.makeSlug === m.make && (r.slug ?? r.lineSlug) === m.old);
  const target = records.filter(r => r.makeSlug === m.make && (r.slug ?? r.lineSlug) === m.slug);
  if (old.length && target.length) throw Error(`Collision ${m.make}/${m.slug}: ${target.map(r => r.file)}`);
}
for (const file of catalogFiles) save(file, applySlugMigrations(JSON.parse(fs.readFileSync(file))));
for (const file of cardFiles) {
  const cards = JSON.parse(fs.readFileSync(file));
  for (const c of cards) {
    const m = slugMigrations.find(m => c.makeSlug === m.make && [m.old, m.slug].includes(c.lineSlug));
    if (!m) continue;
    c.lineSlug = m.slug;
    c.aliases = [...new Set([...(c.aliases ?? []), m.old])];
    if (m.name) c.name = m.name;
  }
  save(file, cards);
}
const registryFile = 'analysis/codex/slug-registry.json';
const registry = JSON.parse(fs.readFileSync(registryFile));
const models = JSON.parse(fs.readFileSync(catalogFiles[0]));
for (const m of slugMigrations) {
  const model = models.find(r => r.makeSlug === m.make && r.slug === m.slug);
  if (model) registry.auto[model.qid] = m.slug;
}
save(registryFile, registry);
console.log(JSON.stringify({changed}, null, 2));
