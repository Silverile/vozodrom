import fs from 'node:fs';
import assert from 'node:assert/strict';
const dir = 'analysis/sweep/codex/';
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const baseline = read(dir + 'TURN-3-BASELINE.json');
const metadata = new Set(['sources', 'needsReview']);
let makes = 0, loggedChanges = 0, factualChanges = 0;
const missingReports = [];
for (const [make, original] of Object.entries(baseline.originalCardJson)) {
  const reportPath = dir + make + '.json';
  if (!fs.existsSync(reportPath)) { missingReports.push(make); continue; }
  const report = read(reportPath);
  assert.equal(report.make, make);
  assert.equal(report.reviewScope.status, 'partial');
  assert(report.reviewScope.externalChecks.length > 0, make + ': no recorded external check');
  const replay = structuredClone(original);
  for (const change of report.cardFixesApplied) {
    assert(change.sources.length > 0, make + ': unsourced change');
    for (const source of change.sources) assert(/^https?:\/\//.test(source), make + ': invalid source');
    const card = replay.find(c => c.lineSlug === change.lineSlug);
    assert(card, make + '/' + change.lineSlug + ': missing original identity');
    const keys = change.path.replace(/\[(\d+)\]/g, '.$1').split('.');
    let parent = card;
    for (const key of keys.slice(0, -1)) parent = parent[key];
    const key = keys.at(-1);
    assert.deepEqual(parent[key] ?? null, change.from, make + '/' + change.lineSlug + '/' + change.path + ': before-value mismatch');
    parent[key] = structuredClone(change.to);
    loggedChanges++;
    if (!metadata.has(key)) factualChanges++;
  }
  assert.deepEqual(read('src/data/catalog/model-cards/' + make + '.json'), replay, make + ': unlogged card changes');
  for (const card of replay) for (const generation of card.generations) {
    assert(!(generation.productionStatus === 'current' && generation.to !== null), make + '/' + card.lineSlug + ': current with end year');
  }
  makes++;
}
console.log(JSON.stringify({ makes, missingReports, loggedChanges, factualChanges, metadataChanges: loggedChanges - factualChanges }, null, 2));
assert.equal(missingReports.length, 0, 'All 69 assigned reports must exist before handoff');
