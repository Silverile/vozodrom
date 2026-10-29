const fs = require('fs'), assert = require('assert/strict');
const base = 'analysis/sweep/codex/';
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const write = (p, d) => fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n');
assert(!fs.existsSync(base + 'round7-gb-baseline.json'), 'Do not apply twice');
const baseline = {};
for (const make of ['byd', 'gaz']) baseline[make] = {
  cards: read('src/data/catalog/model-cards/' + make + '.json'), report: read(base + make + '.json')
};
write(base + 'round7-gb-baseline.json', baseline);
for (const make of ['byd', 'gaz']) {
  const cards = structuredClone(baseline[make].cards), report = structuredClone(baseline[make].report);
  const edits = [];
  function set(card, path, value, sources, reason, category = 'metadata') {
    const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
    let target = card; for (const k of keys.slice(0, -1)) target = target[k];
    const key = keys.at(-1), old = target[key] ?? null;
    if (JSON.stringify(old) === JSON.stringify(value)) return;
    edits.push({lineSlug: card.lineSlug, path, from: structuredClone(old), to: structuredClone(value), sources, reason, confidence: 'high', pass: 'DEPTH round 7', category});
    target[key] = structuredClone(value);
  }
  function sourceList(card, path, sources) {
    const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
    const prior = keys.reduce((v, k) => v?.[k], card) ?? [];
    set(card, path, [...new Set([...prior, ...sources])], sources, 'Attach independently corroborated sources for this depth pass.');
  }
  function fieldSources(card, prefix, fields, sources) {
    const keys = prefix.replace(/\[(\d+)\]/g, '.$1').split('.');
    const obj = keys.reduce((v, k) => v[k], card);
    const map = structuredClone(obj.fieldSources ?? {});
    for (const field of fields) map[field] = [...new Set([...(map[field] ?? []), ...sources])];
    set(card, prefix + '.fieldSources', map, sources, 'Field-level provenance; manufacturer and independent publisher.');
  }
  if (make === 'byd') {
    const groups = [
      ['atto-3', ['https://www.byd.com/content/dam/byd-site/eu/product/atto3/BYD%20ATTO%203%20Leaflet.pdf', 'https://ev-database.org/de/pkw/1782/BYD-ATTO-3'], '60.48 kWh FWD — evropská specifikace 10/2022'],
      ['dolphin', ['https://www.bydauto.ie/assets/1/product-guides/my25/my25q3_dolphin.pdf', 'https://ev-database.org/car/3297/BYD-DOLPHIN-604-kWh'], 'Comfort / Design 60.4 kWh — evropská specifikace 2025']
    ];
    for (const [slug, sources, variant] of groups) {
      const c = cards.find(c => c.lineSlug === slug);
      set(c, 'generations[0].engines', [{fuel: 'electric', displacementCc: null, displacementLitresNominal: null, powerKwMin: 150, powerKwMax: 150, variant}], sources, 'Selected European technical version only; not a worldwide engine inventory.', 'specification');
      set(c, 'generations[0].engineCoverage', 'partial', sources, 'One scoped European motor version is now documented.', 'coverage');
      set(c, 'generations[0].drivetrains', ['fwd'], sources, 'Both publishers specify front-wheel drive for the scoped European versions.', 'specification');
      fieldSources(c, 'generations[0]', ['engines', 'drivetrains'], sources);
      const resolved = ['generations[0].engines', 'generations[0].drivetrains'];
      if (slug === 'dolphin') {
        for (let i = 0; i < c.generations[0].trims.length; i++) {
          const p = `generations[0].trims[${i}]`;
          set(c, p + '.topSpeedKmh', 160, sources, 'MY25 Irish manufacturer guide and EV Database MY25 both state 160 km/h.', 'specification');
          fieldSources(c, p, ['topSpeedKmh'], sources);
          sourceList(c, p + '.sources', sources);
          resolved.push(p + '.topSpeedKmh');
        }
      }
      sourceList(c, 'generations[0].sources', sources);
      sourceList(c, 'sources', sources);
      set(c, 'needsReview', c.needsReview.filter(x => !resolved.includes(x.field)), sources, 'Remove only review placeholders resolved by this pass.');
    }
    report.conflicts.push({where: 'dolphin generations[0].trunkL; EU 2025 scope', values: {'Irish MY25 Q3 manufacturer guide, seats up/down': '364/1329 L', 'EV Database MY25 and UK manufacturer media, seats up/down': '345/1310 L'}, kept: 345, sources: ['https://www.bydauto.ie/assets/1/product-guides/my25/my25q3_dolphin.pdf', 'https://ev-database.org/car/3297/BYD-DOLPHIN-604-kWh', 'https://bydukmedia.com/en/models/byd-dolphin.html?highlight=2025'], reason: 'Unchanged prior value remains supported by independent publisher plus UK manufacturer; Irish regional specification conflicts. Regional or measurement-basis reconciliation unresolved.'});
    report.openQuestions.push('Round 7: Dolphin mass remains null: manufacturer kerb mass and EV Database EU unladen mass use different conventions; no arithmetic reconciliation applied. Worldwide motor ranges, all facelift/SOP boundaries and photos remain incomplete.');
  } else {
    const c = cards.find(c => c.lineSlug === 'gaz-31105');
    const sources = ['https://www.niann.ru/?id=344764', 'https://www.kolesa.ru/article/barzha-105-kak-i-pochemu-gaz-31105-stal-poslednej-nastoyashhej-volgoj'];
    set(c, 'generations[0].to', 2008, sources, 'Contemporary 26 January 2009 report attributes December 2008 cessation directly to GAZ president Nikolai Pugin. Independent Kolesa history confirms late-2008 cessation and explains 2009 paperwork.', 'production');
    set(c, 'generations[0].marketNotesCs', 'Sériová výroba skončila v roce 2008: dobová zpráva z ledna 2009 cituje prezidenta GAZ o ukončení v prosinci 2008. Historie Kolesa vysvětluje rok 2009 v dokladech posledních vozů; nejde o doložené pokračování sériové výroby. Přesný měsíc není v katalogu sjednocován.', sources, 'Resolve the prior 2008/2009 discrepancy using direct contemporary manufacturer statement plus independent historical account.');
    fieldSources(c, 'generations[0]', ['to'], sources);
    sourceList(c, 'generations[0].sources', sources);
    sourceList(c, 'sources', sources);
    set(c, 'needsReview', c.needsReview.filter(x => x.field !== 'generations[0].to'), sources, 'Production end-year is now corroborated.');
    report.conflicts.push({where: 'gaz-31105 generations[0].to', values: {'prior catalog and some databases': 2009, 'NIANN contemporary GAZ-president statement and Kolesa history': 2008}, kept: 2008, sources, reason: '2009 paperwork is distinguished from series production. No assertion of an exact final-build day.'});
    report.openQuestions.push('Round 7 disposition: the earlier combined 3102/31105 question is closed for 31105 only (2008); 3102 still needs an independently corroborated direct production endpoint. Existing old questions retained for audit history.');
  }
  report.cardFixesApplied.push(...edits);
  report.reviewScope.externalChecks.push({scope: 'DEPTH round 7: ' + (make === 'byd' ? 'selected Atto 3 EU 2022 and Dolphin EU 2025 technical versions; no worldwide completeness claim.' : '31105 final series-production year; explicit separation from 2009 paperwork.'), sources: [...new Set(edits.flatMap(e => e.sources))]});
  write('src/data/catalog/model-cards/' + make + '.json', cards);
  write(base + make + '.json', report);
  console.log(make, edits.length, 'audit entries;', edits.filter(e => e.category !== 'metadata').length, 'non-metadata field changes');
}
