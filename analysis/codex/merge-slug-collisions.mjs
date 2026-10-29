import fs from 'node:fs';
import assert from 'node:assert/strict';
import {applySelectorExclusions} from '../sweep/selector-exclusions.mjs';

export const pairs = [
  ['mahindra-electric', 'mahindra-e2o', 'e2o', 'Q12061442', 'https://en.wikipedia.org/wiki/Mahindra_e2o'],
  ['mahindra-electric', 'mahindra-e2o-plus', 'e2o-plus', 'Q65122328', 'https://en.wikipedia.org/wiki/Mahindra_e2o_Plus'],
  ['mahindra-electric', 'revai', 'reva', 'Q2092926', 'https://en.wikipedia.org/wiki/REVAi'],
  ['morgan', '4-q6911571', 'plus-4', 'Q6911571', 'https://en.wikipedia.org/wiki/Morgan_%2B4'],
  ['morgan', '4-q6911573', 'plus-4-plus', 'Q6911573', 'https://en.wikipedia.org/wiki/Morgan_%2B4%2B'],
  ['moskvic', 'moskvich-8', '8', 'Q135642307', 'https://www.wikidata.org/wiki/Q135642307'],
  ['neta-auto', 'neta-gt', 'gt', 'Q115852634', 'https://www.wikidata.org/wiki/Q115852634'],
  ['rolls-royce', 'rolls-royce-cullinan', 'cullinan', 'Q30972583', 'https://www.wikidata.org/wiki/Q30972583'],
  ['xpeng', 'p7-q65064122', 'p7', 'Q65064122', 'https://en.wikipedia.org/wiki/XPeng_P7'],
  ['xpeng', 'p7-q130527663', 'p7-plus', 'Q130527663', 'https://en.wikipedia.org/wiki/XPeng_P7%2B'],
];
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const changed = [];
const save = (f, data) => {
  const text = JSON.stringify(data, null, 2) + '\n';
  if (fs.existsSync(f) && JSON.stringify(read(f)) === JSON.stringify(data)) return;
  fs.writeFileSync(f, text); changed.push(f);
};
const rawFile = 'src/data/catalog/models-auto.json';
const autoFile = 'src/data/catalog/model-lines-auto.json';
const additionsFile = 'src/data/catalog/model-line-additions.json';
const exclusionsFile = 'analysis/sweep/selector-exclusions.json';
const auditFile = 'analysis/sweep/codex/slug-collision-merges.json';
const raw = read(rawFile), auto = read(autoFile), additions = read(additionsFile);
const exclusions = read(exclusionsFile);
const cards = new Map(['src/data/model-cards', 'src/data/catalog/model-cards'].flatMap(d =>
  fs.readdirSync(d).filter(f => f.endsWith('.json')).map(f => [`${d}/${f}`, read(`${d}/${f}`)])));
const audit = [];
// Validate all identities and available bounds before writing any catalog data.
for (const [make, old, slug, qid, source] of pairs) {
  const prior = exclusions.find(e => e.file === 'models-auto' && e.makeSlug === make && e.slug === old && e.qid === qid);
  const sourceRow = raw.find(r => r.makeSlug === make && r.slug === old) ?? prior?.before;
  assert.equal(sourceRow?.qid, qid, `${make}/${old}: raw identity`);
  const targets = [...auto, ...additions].filter(r => r.makeSlug === make && r.slug === slug);
  const targetCards = [...cards.values()].flat().filter(r => r.makeSlug === make && r.lineSlug === slug);
  assert(targetCards.length, `${make}/${slug}: missing card`);
  for (const t of targets) {
    assert(!t.wikidataQid || t.wikidataQid === qid, `${make}/${slug}: conflicting QID`);
    for (const [rawKey, lineKey] of [['productionStart','from'], ['productionEnd','to']]) {
      assert(sourceRow[rawKey] == null || t[lineKey] == null || sourceRow[rawKey] === t[lineKey], `${make}/${slug}: conflicting dates`);
    }
  }
  audit.push({makeSlug: make, oldSlug: old, targetSlug: slug, qid, source,
    decision: 'duplicate', before: sourceRow,
    identityEvidence: 'Source entity label/sitelink matches the exact existing model family. Existing target QID was null; raw production bounds are null, so no contradictory dates. REVA includes REVAi; P7 and P7+ remain separate families; classic Morgan +4 remains separate from Plus Four.',
    targetGenerations: targetCards[0].generations.map(g => ({code:g.code, from:g.from, to:g.to})),
    rawUsefulData: {qid, bodyTypes:sourceRow.bodyTypes, codes:sourceRow.codes}});
}
for (const [make, old, slug, qid, source] of pairs) {
  const item = audit.find(a => a.makeSlug === make && a.oldSlug === old);
  const targetCards = [...cards.values()].flat().filter(r => r.makeSlug === make && r.lineSlug === slug);
  for (const c of targetCards) {
    c.aliases = [...new Set([...(c.aliases ?? []), old])];
    c.sources = [...new Set([...(c.sources ?? []), source, `https://www.wikidata.org/wiki/${qid}`])];
    c.needsReview = (c.needsReview ?? []).filter(r => r.field !== 'lineSlug');
  }
  if (!additions.some(r => r.makeSlug === make && r.slug === slug)) {
    const c = targetCards[0], gs = c.generations;
    const starts = gs.map(g => g.from).filter(Number.isFinite), ends = gs.map(g => g.to).filter(Number.isFinite);
    const current = gs.some(g => g.productionStatus === 'current');
    additions.push({slug, name:c.name, makeSlug:make, aliases:[], bodyTypes:[...new Set(gs.flatMap(g => g.bodyTypes ?? []))],
      from:starts.length ? Math.min(...starts) : null, to:current || !ends.length ? null : Math.max(...ends),
      productionStatus:current ? 'current' : gs.every(g => g.productionStatus === 'ended') ? 'ended' : 'unknown',
      dateScope:'source-production', productionPeriods:null,
      generations:gs.map(g => ({code:g.code ?? null, from:g.from ?? null, to:g.to ?? null, productionStatus:g.productionStatus, bodyTypes:g.bodyTypes, sources:g.sources})),
      wikidataQid:qid, sources:c.sources, needsReview:[], additionReason:'Reviewed raw duplicate merged into sourced card identity'});
  }
  for (const t of [...auto, ...additions].filter(r => r.makeSlug === make && r.slug === slug)) {
    t.wikidataQid = qid;
    t.aliases = [...new Set([...(t.aliases ?? []), old])];
    t.sources = [...new Set([...t.sources, source, `https://www.wikidata.org/wiki/${qid}`])];
    t.needsReview = t.needsReview.filter(r => r.field !== 'wikidataQid');
    if (!t.bodyTypes?.length && item.before.bodyTypes?.length) t.bodyTypes = item.before.bodyTypes;
    for (const [rawKey, key] of [['productionStart','from'], ['productionEnd','to']]) {
      if (t[key] == null && item.before[rawKey] != null) t[key] = item.before[rawKey];
    }
  }
  if (!auto.some(r => r.makeSlug === make && r.slug === slug)) auto.push(structuredClone(additions.find(r => r.makeSlug === make && r.slug === slug)));
  if (!exclusions.some(e => e.file === 'models-auto' && e.makeSlug === make && e.slug === old && e.qid === qid)) {
    exclusions.push({file:'models-auto', makeSlug:make, slug:old, qid, reason:`Reviewed duplicate of ${make}/${slug}; source identity retained on canonical model line; old slug retained as alias.`, sources:[source, `https://www.wikidata.org/wiki/${qid}`], before:item.before});
  }
}
save(exclusionsFile, exclusions);
save(rawFile, applySelectorExclusions('models-auto', raw));
save(autoFile, auto);
save(additionsFile, additions);
for (const [file, rows] of cards) save(file, rows);
save(auditFile, audit);
console.log(JSON.stringify({merged:pairs.length, changed}, null, 2));
