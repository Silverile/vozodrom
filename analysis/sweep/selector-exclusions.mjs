import fs from 'node:fs';
// Shared by the source rebuilders and integration validator. Generated audit lists
// are not durable overrides: rebuilds replace them, so keep reviewed exclusions here.
export function applySelectorExclusions(file, rows) {
  const path = new URL('./selector-exclusions.json', import.meta.url);
  const exclusions = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path, 'utf8')) : [];
  return rows.filter(row => !exclusions.some(e => e.file === file &&
    e.makeSlug === row.makeSlug && e.slug === row.slug && (!e.qid || e.qid === row.qid)));
}
