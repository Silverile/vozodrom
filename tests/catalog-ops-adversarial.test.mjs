// Regression expectations for the adversarial review. Failing tests identify bugs,
// rather than accepting the current broken behaviour. Run: npm test
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { performance } from 'node:perf_hooks';
import { applyOps, parseOp, rowToOp, changesGenerations, identityOf } from '../src/lib/catalog-ops.ts';

const generation = (code, from, extra = {}) => ({ code, name: code, from, to: from + 5,
  current: false, engines: [{ variant: 'A', powerKwMin: 50 }, { variant: 'B', powerKwMin: 70 }],
  bodyTypes: [], facelifts: [], transmissions: [], drivetrains: [], markets: [], trims: [],
  dimensionsMm: null, trunkL: null, photo: null, ...extra });
const card = () => ({ name: 'Model', summary: 'original', segment: null,
  generations: [generation('I', 1990), generation('II', 2000), generation('III', 2010)] });
const stored = (op, n) => ({ id: `adversarial-${n}`, makeSlug: 'make', lineSlug: 'line', op, createdAt: '' });
const replay = (base, ...ops) => applyOps(base, ops.map(stored));

test('adversarial: repeated generation moves carry origins, uploaded drawings and explicit removals', () => {
  const b = card();
  const r = replay(b,
    { op: 'drawing', index: 0, src: '/foto/katalog/i.webp', expect: identityOf(b.generations[0]) },
    { op: 'drawing', index: 2, src: null, expect: identityOf(b.generations[2]) },
    { op: 'move', path: ['generations'], from: 2, to: 0, expect: b.generations[2] },
    { op: 'move', path: ['generations'], from: 1, to: 2, expect: b.generations[0] },
    { op: 'insert', path: ['generations', 1], value: generation('new', 2005) },
    { op: 'remove', path: ['generations', 0], expect: b.generations[2] });
  assert.deepEqual(r.conflicts, []);
  assert.deepEqual(r.card.generations.map(g => g.code), ['new', 'II', 'I']);
  assert.deepEqual(r.origins, [null, 1, 0]);
  assert.deepEqual(r.drawings, [undefined, undefined, '/foto/katalog/i.webp']);
  assert.equal(b.generations[0].code, 'I');
});

test('adversarial: remove then reset an existing field follows the surviving generation', () => {
  const r = replay(card(), { op: 'remove', path: ['generations', 0] },
    { op: 'set', path: ['generations', 0, 'name'], value: 'edited' },
    { op: 'reset', path: ['generations', 0, 'name'] });
  assert.equal(r.card.generations[0].name, 'II');
  assert.deepEqual(r.origins, [1, 2]);
  assert.deepEqual(r.conflicts, []);
});

test('adversarial: index zero insertion into an empty generation list is supported', () => {
  const b = { ...card(), generations: [] };
  const r = replay(b, { op: 'insert', path: ['generations', 0], value: generation('new', 2020) },
    { op: 'drawing', index: 0, src: '/foto/katalog/new.webp' });
  assert.equal(r.card.generations[0].code, 'new');
  assert.deepEqual(r.origins, [null]);
  assert.deepEqual(r.drawings, ['/foto/katalog/new.webp']);
});

test('adversarial: set at a nested array length appends without changing generation mappings', () => {
  const r = replay(card(), { op: 'set', path: ['generations', 0, 'engines', 2], value: { variant: 'C' }, expect: null });
  assert.equal(r.card.generations[0].engines.length, 3);
  assert.deepEqual(r.origins, [0, 1, 2]);
  const rejected = replay(card(), { op: 'set', path: ['generations', 3], value: generation('IV', 2020) });
  assert.equal(rejected.conflicts.length, 1);
});

test('adversarial: a nested property named generations is an ordinary array', () => {
  const b = card();
  b.generations[0].custom = { generations: ['x', 'y'] };
  const r = replay(b, { op: 'move', path: ['generations', 0, 'custom', 'generations'], from: 0, to: 1 },
    { op: 'insert', path: ['generations', 0, 'custom', 'generations', 0], value: 'z' });
  assert.deepEqual(r.card.generations[0].custom.generations, ['z', 'y', 'x']);
  assert.deepEqual(r.origins, [0, 1, 2]);
  assert.equal(changesGenerations([stored({ op: 'move', path: ['generations', 0, 'custom', 'generations'], from: 0, to: 1 }, 1)]), false);
});

test('adversarial: a deep null parent conflicts, but later independent operations still apply', () => {
  const r = replay(card(), { op: 'set', path: ['generations', 0, 'dimensionsMm', 'width'], value: 1800 },
    { op: 'set', path: ['summary'], value: 'later', expect: 'original' });
  assert.equal(r.conflicts.length, 1);
  assert.equal(r.card.summary, 'later');
});

test('adversarial: prototype-named keys inside a value survive JSON as data without global pollution', () => {
  const value = JSON.parse('{"__proto__":{"catalogPolluted":true},"constructor":{"prototype":{"catalogPolluted":true}}}');
  const parsed = parseOp(JSON.parse(JSON.stringify({ op: 'set', path: ['custom'], value })));
  assert.notEqual(typeof parsed, 'string');
  const r = replay(card(), parsed);
  const roundtrip = JSON.parse(JSON.stringify(r.card));
  assert.equal(Object.hasOwn(roundtrip.custom, '__proto__'), true);
  assert.equal(roundtrip.custom.__proto__.catalogPolluted, true);
  assert.equal(Object.prototype.catalogPolluted, undefined);
  assert.equal({}.catalogPolluted, undefined);
});

test('REGRESSION: field expectations must not silently target a different generation after upstream reorder', () => {
  const b = card(), refreshed = card();
  refreshed.generations.reverse();
  // operations inside a generation carry its identity (the editor adds it); a generation that is
  // gone or ambiguous after the refresh is a conflict
  const op = parseOp({ op: 'set', path: ['generations', 0, 'trunkL'], value: 500, expect: b.generations[0].trunkL,
    gen: { code: b.generations[0].code, name: b.generations[0].name, from: b.generations[0].from } });
  refreshed.generations = refreshed.generations.filter(g => g.code !== 'I');
  const r = replay(refreshed, op);
  assert.equal(r.card.generations.find(g => g.code === 'III').trunkL, null,
    'the unrelated generation III must not inherit a correction made to I');
  assert.equal(r.conflicts.length, 1);
});

test('REGRESSION: resetting the whole generation from the UI restores its original fields', () => {
  const b = card();
  const r = replay(b, { op: 'set', path: ['generations', 0, 'name'], value: 'edited' },
    { op: 'reset', path: ['generations', 0] });
  assert.deepEqual(r.conflicts, []);
  assert.deepEqual(r.card.generations[0], b.generations[0]);
  assert.deepEqual(r.origins, [0, 1, 2]);
});

test('REGRESSION: nested item reset must not copy a removed engine into the surviving engine', () => {
  const b = card();
  const r = replay(b, { op: 'remove', path: ['generations', 0, 'engines', 0] },
    { op: 'set', path: ['generations', 0, 'engines', 0, 'powerKwMin'], value: 71, expect: 70 },
    { op: 'reset', path: ['generations', 0, 'engines', 0, 'powerKwMin'] });
  assert.equal(r.card.generations[0].engines[0].variant, 'B');
  assert.equal(r.card.generations[0].engines[0].powerKwMin, 70,
    'reset on B must restore B, not the removed A (50 kW)');
});

test('REGRESSION: removing the generations container must be refused rather than create an invalid card', () => {
  const op = parseOp({ op: 'remove', path: ['generations'] });
  const r = replay(card(), op);
  assert.ok(Array.isArray(r.card.generations));
  assert.equal(r.conflicts.length, 1);
});

test('REGRESSION: inserting a non-object generation must be rejected', () => {
  const op = parseOp({ op: 'insert', path: ['generations', 0], value: null });
  if (typeof op === 'string') return;
  const r = replay(card(), op);
  assert.equal(r.conflicts.length, 1);
  assert.ok(r.card.generations.every(g => g && typeof g === 'object'));
});

test('REGRESSION: inherited Object.prototype fields are not resettable catalogue fields', () => {
  const op = parseOp({ op: 'reset', path: ['toString'] });
  if (typeof op === 'string') return;
  let r;
  assert.doesNotThrow(() => { r = replay(card(), op); });
  assert.equal(r.conflicts.length, 1);
});

test('REGRESSION: resetting a newly appended array item must not leave a JSON-null hole', () => {
  const r = replay(card(), { op: 'insert', path: ['generations', 0, 'engines', 2], value: { variant: 'C' } },
    { op: 'reset', path: ['generations', 0, 'engines', 2] });
  assert.ok(JSON.parse(JSON.stringify(r.card)).generations[0].engines.every(Boolean));
});

test('adversarial: legacy first-deploy rows without IDs/timestamps retain the old field corrections', () => {
  const rows = [{ makeSlug: 'make', lineSlug: 'line', genIndex: null, field: 'summary', value: 'legacy' },
    { makeSlug: 'make', lineSlug: 'line', genIndex: 1, field: 'name', value: 'Legacy II' },
    { makeSlug: 'make', lineSlug: 'line', genIndex: 0, field: 'dateNote', value: '' }];
  const r = applyOps(card(), rows.map(rowToOp));
  assert.equal(r.card.summary, 'legacy'); assert.equal(r.card.generations[1].name, 'Legacy II');
  assert.deepEqual(r.conflicts, []);
});

test('adversarial: 5000 checked operations replay deterministically without mutating the base', t => {
  const b = card(), before = structuredClone(b);
  const ops = Array.from({ length: 5000 }, (_, i) => stored({ op: 'set', path: ['summary'],
    expect: i ? `value-${i - 1}` : 'original', value: `value-${i}` }, i));
  const start = performance.now(), a = applyOps(b, ops), ms = performance.now() - start;
  assert.equal(a.card.summary, 'value-4999'); assert.equal(a.conflicts.length, 0);
  assert.deepEqual(a, applyOps(b, ops)); assert.deepEqual(b, before);
  t.diagnostic(`5000 operations: ${ms.toFixed(2)} ms`);
  assert.ok(ms < 2000, 'five thousand simple operations should fit a two-second local budget');
});
