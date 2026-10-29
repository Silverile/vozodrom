import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const dir = 'analysis/sweep/codex/';
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const baseline = read(dir + 'TURN-3-BASELINE.json');
const names = Object.keys(baseline.originalCardJson);
const reports = names.map(make => read(dir + make + '.json'));
const backlog = read(dir + 'BACKLOG.json');
assert.equal(names.length, 69);
assert.equal(backlog.untouchedMakes.length, 0);
assert.equal(backlog.partialPassMakes.length, 125);
const sum = field => reports.reduce((n, r) => n + (r[field]?.length ?? 0), 0);
const fixes = reports.flatMap(r => r.cardFixesApplied);
const factual = fixes.filter(f => !['sources', 'needsReview'].includes(f.path.split('.').at(-1)));
const changed = [];
for (const folder of [dir.slice(0, -1), 'src/data/catalog/model-cards']) {
  for (const name of fs.readdirSync(folder)) {
    const path = folder + '/' + name;
    if (!fs.statSync(path).isFile() || (folder.includes('model-cards') && !/^[a-l]/.test(name))) continue;
    const hash = crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex');
    if (hash !== baseline.files[path]) changed.push(path);
  }
}
const summaryPath = dir + 'TURN-3-SUMMARY.json';
if (!changed.includes(summaryPath)) changed.push(summaryPath);
const summary = {
  checkedAt: new Date().toISOString(),
  coverage: 'Partial source-backed breadth passes only. No make is certified fully verified; no new visual photo review.',
  newPartialPassMakes: names,
  newMakeCount: names.length,
  totalPartialPassMakes: backlog.partialPassMakes.length,
  remainingUnstartedMakes: backlog.untouchedMakes,
  fullPerModelVerificationStillRequiredForMakes: 125,
  newInventoriedCards: reports.reduce((n, r) => n + r.reviewScope.catalogCardsInventoried, 0),
  newInventoriedRawModels: reports.reduce((n, r) => n + r.reviewScope.rawModelsInventoried, 0),
  newInventoriedGenerationRows: reports.reduce((n, r) => n + r.reviewScope.generationRowsInventoried, 0),
  catalogCardFilesModified: changed.filter(p => p.startsWith('src/')).length,
  newLoggedCardChangesIncludingMetadata: fixes.length,
  newFactualCardFieldChanges: factual.length,
  newProvenanceAndReviewMetadataChanges: fixes.length - factual.length,
  newMakeFieldProposals: sum('makeFixes'),
  newModelFieldProposals: sum('modelFixes'),
  newModelExclusionProposals: sum('removeModels'),
  newMissingModelProposals: sum('missingModels'),
  independentReview: [
    'All 69 card arrays replayed from the captured original JSON through every logged change; final arrays match, including before-values and unchanged data.',
    'Six additional raw-model eligibility exclusions: Cadillac Cien/Sixteen/Provoq/Urban Luxury Concept, De Tomaso P900 track programme and Fisker Atlantic prototype.',
    'Raw Karma belongs to Fisker Automotive; curated line/card already has the correct attribution. Shared raw-row correction proposed.',
    'Jensen Museum early-Interceptor end-year disagreement retained explicitly; Horch 1940 deliveries not substituted for production endpoint.',
    'DS/CUPRA/Dangel dates distinguish independent brand/company from earlier product-line/founder activity; no unconditional shared rewrite.',
    'GAZ production-start note repaired to preserve Czech Unicode and remove stale claim that from remains null.'
  ],
  integration: 'Claude must review/apply shared proposals and rebuild the shared card index. No shared catalogue files or indexes changed by Codex. Original 56 reports and cards were preserved.',
  changedFiles: changed.sort()
};
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify({ newMakes: summary.newMakeCount, totalMakes: summary.totalPartialPassMakes, unstarted: 0, cardsInventoried: summary.newInventoriedCards, cardFilesModified: summary.catalogCardFilesModified, loggedChanges: fixes.length, factualChanges: factual.length, makeProposals: summary.newMakeFieldProposals, modelProposals: summary.newModelFieldProposals, exclusions: summary.newModelExclusionProposals, changedFiles: changed.length }));
