import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const lines = read('src/data/model-lines-index.json');
const cards = read('src/data/model-cards-index.json');
const output = process.argv.find(a => a.startsWith('--output='))?.slice(9) ?? 'analysis/codex/catalog-completeness-audit.json';
assert(/^analysis\/codex\/[a-z0-9-]+\.json$/.test(output), 'output must be a JSON filename in analysis/codex');
const rows = [];
for (const make of [...new Set([...Object.keys(lines), ...Object.keys(cards)])].sort()) {
  const stats = existsSync(`src/data/stats/${make}.json`) ? read(`src/data/stats/${make}.json`) : {};
  const names = new Map((lines[make] ?? []).map(l => [l.slug, l]));
  for (const slug of new Set([...names.keys(), ...Object.keys(cards[make] ?? {})])) {
    const card = cards[make]?.[slug];
    const lineStats = stats[slug];
    const gaps = [];
    if (!card) gaps.push('no-card');
    if (card && !card.generations.length) gaps.push('no-generation-records');
    const generations = (card?.generations ?? []).map((g, index) => {
      const missingPower = (g.engines ?? []).flatMap((e, i) => e.powerKwMin == null && e.powerKwMax == null ? [i] : []);
      const versions = g.trims ?? [];
      const generationGaps = [];
      if (!g.engines?.length) generationGaps.push('no-engine-rows');
      if (missingPower.length) generationGaps.push('engine-rows-without-power');
      if (!versions.length) generationGaps.push('no-technical-version-rows');
      if (!g.equipmentLines?.length) generationGaps.push('no-equipment-line-records');
      const known = make === 'skoda' && slug === 'kodiaq';
      return {
        index, name:g.name, code:g.code, from:g.from, to:g.to,
        fleetN:lineStats?.gens?.[String(index)]?.fleet?.n ?? null,
        engineRows:g.engines?.length ?? 0, engineRowsWithoutPower:missingPower,
        technicalVersionRows:versions.length,
        technicalVersionRowsWithoutPower:versions.flatMap((v,i) => v.engine?.powerKw == null ? [i] : []),
        equipmentLineRows:g.equipmentLines?.length ?? 0,
        faceliftCount:g.facelifts?.length ?? 0,
        expectedFaceliftCount:known ? (index === 0 ? 1 : 0) : null,
        faceliftComparison:known ? ((g.facelifts?.length ?? 0) === (index === 0 ? 1 : 0) ? 'matches-researched-CZ-EU-stages' : 'mismatch') : 'not-compared-to-historical-sources',
        expectedGenerationCountForLine:known ? 2 : null,
        historicalCompleteness:known ? 'see-kodiaq-pilot-review' : 'not-audited',
        sources:g.sources ?? [], gaps:generationGaps,
      };
    });
    if (generations.some(g => g.gaps.length)) gaps.push('generation-field-gaps');
    rows.push({makeSlug:make,lineSlug:slug,name:card?.name ?? names.get(slug)?.name ?? slug,
      fleetN:lineStats?.fleet?.n ?? null,cardPresent:!!card,generationCount:generations.length,
      historicalCompleteness:'not-established-by-field-presence',gaps,generations});
  }
}
rows.sort((a,b) => (b.fleetN ?? -1)-(a.fleetN ?? -1) || a.makeSlug.localeCompare(b.makeSlug) || a.lineSlug.localeCompare(b.lineSlug));
const gens = rows.flatMap(r => r.generations);
const result = {
  schemaVersion:1,asOf:'2026-10-31',
  scope:'All public line/card identities; structural gaps, not a proof that every historical generation/engine/facelift is present.',
  priority:'Descending Czech fleet.n where supplied; unknown register counts stay null and sort after known counts. No invented zero counts.',
  caveats:['Register generation counts use existing ordinal mappings and are ranking evidence, not verification of historical generation identity.', 'No facelift record is not evidence that a facelift is missing: source comparison is required.', 'Equipment lines are distinct from technical engine/gearbox/drive versions.', 'A model absent from both indexes cannot be discovered by this internal audit.'],
  counts:{lines:rows.length,cards:rows.filter(r=>r.cardPresent).length,linesWithoutCard:rows.filter(r=>!r.cardPresent).length,
    generations:gens.length,generationsWithEngines:gens.filter(g=>g.engineRows).length,
    generationsWithEngineRowsWithoutPower:gens.filter(g=>g.engineRowsWithoutPower.length).length,
    generationsWithTechnicalVersions:gens.filter(g=>g.technicalVersionRows).length,
    generationsWithEquipmentLines:gens.filter(g=>g.equipmentLineRows).length,
    generationsWithFacelifts:gens.filter(g=>g.faceliftCount).length},
  prioritiesByGap:Object.fromEntries(['no-card','no-generation-records','no-engine-rows','engine-rows-without-power','no-technical-version-rows','no-equipment-line-records'].map(gap=>[gap,
    rows.filter(r=>r.gaps.includes(gap)||r.generations.some(g=>g.gaps.includes(gap))).slice(0,20).map(r=>({makeSlug:r.makeSlug,lineSlug:r.lineSlug,fleetN:r.fleetN,generationIndexes:r.generations.filter(g=>g.gaps.includes(gap)).map(g=>g.index)}))])),
  topGaps:rows.filter(r=>r.gaps.length).slice(0,30).map(({generations,...r})=>({...r,generationGaps:generations.map(({index,fleetN,gaps})=>({index,fleetN,gaps}))})),
  lines:rows,
};
writeFileSync(output,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result.counts));
console.log(JSON.stringify(result.topGaps.slice(0,10).map(r=>({make:r.makeSlug,line:r.lineSlug,fleet:r.fleetN,gaps:r.gaps})),null,2));
