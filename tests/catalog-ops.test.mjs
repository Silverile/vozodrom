// Tests of the catalogue edit operations (src/lib/catalog-ops.ts). Run: npm test
import assert from "node:assert/strict";
import { test } from "node:test";
import { applyOps, changesGenerations, getAt, parseOp, rowToOp, same } from "../src/lib/catalog-ops.ts";

const gen = (code, from, extra = {}) => ({
  code,
  name: `Model ${code}`,
  from,
  to: from + 6,
  current: false,
  facelifts: [],
  bodyTypes: ["hatchback"],
  engines: [{ variant: "1.0", fuel: "benzin" }],
  drivetrains: ["fwd"],
  transmissions: [],
  dimensionsMm: { length: 4000, width: 1700, height: 1450, wheelbase: 2500 },
  trunkL: 300,
  markets: [],
  trims: [],
  ...extra,
});
const base = () => ({ name: "Model", segment: "B", summary: "Původní popis.", generations: [gen("I", 1990), gen("II", 1997), gen("III", 2004)] });
let n = 0;
const op = (o) => ({ id: `t${++n}`, makeSlug: "m", lineSlug: "l", createdAt: "", op: o });

test("set changes a nested field and leaves the input untouched", () => {
  const b = base();
  const r = applyOps(b, [op({ op: "set", path: ["generations", 1, "engines", 0, "variant"], value: "1.4", expect: "1.0" })]);
  assert.equal(r.card.generations[1].engines[0].variant, "1.4");
  assert.equal(b.generations[1].engines[0].variant, "1.0");
  assert.deepEqual(r.conflicts, []);
  assert.deepEqual(r.origins, [0, 1, 2]);
});

test("set adds a field that is missing", () => {
  const r = applyOps(base(), [op({ op: "set", path: ["generations", 0, "dateNote"], value: "Poznámka", expect: null })]);
  assert.equal(r.card.generations[0].dateNote, "Poznámka");
});

test("set with a stale expectation is skipped and reported", () => {
  const r = applyOps(base(), [op({ op: "set", path: ["summary"], value: "Nový", expect: "Jiný starý text" })]);
  assert.equal(r.card.summary, "Původní popis.");
  assert.equal(r.conflicts.length, 1);
});

test("set into a missing parent is a conflict, not a crash", () => {
  const r = applyOps(base(), [op({ op: "set", path: ["generations", 9, "name"], value: "x" })]);
  assert.equal(r.conflicts.length, 1);
});

test("a whole generation cannot be overwritten by set", () => {
  const r = applyOps(base(), [op({ op: "set", path: ["generations", 0], value: gen("X", 1) })]);
  assert.equal(r.conflicts.length, 1);
  assert.equal(r.card.generations[0].code, "I");
});

test("insert of a generation tracks origins and drawings", () => {
  const r = applyOps(base(), [op({ op: "insert", path: ["generations", 1], value: gen("Ib", 1994) })]);
  assert.deepEqual(r.card.generations.map((g) => g.code), ["I", "Ib", "II", "III"]);
  assert.deepEqual(r.origins, [0, null, 1, 2]);
  assert.deepEqual(r.drawings, [undefined, undefined, undefined, undefined]);
});

test("remove of a generation shifts origins", () => {
  const b = base();
  const r = applyOps(b, [op({ op: "remove", path: ["generations", 0], expect: b.generations[0] })]);
  assert.deepEqual(r.card.generations.map((g) => g.code), ["II", "III"]);
  assert.deepEqual(r.origins, [1, 2]);
});

test("remove with a changed generation is a conflict", () => {
  const r = applyOps(base(), [op({ op: "remove", path: ["generations", 0], expect: gen("I", 1991) })]);
  assert.equal(r.card.generations.length, 3);
  assert.equal(r.conflicts.length, 1);
});

test("move reorders generations with their origins and drawings", () => {
  const r = applyOps(base(), [
    op({ op: "drawing", index: 2, src: "/foto/katalog/m--l--abc.webp", expect: { code: "III", name: "Model III", from: 2004 } }),
    op({ op: "move", path: ["generations"], from: 2, to: 0 }),
  ]);
  assert.deepEqual(r.card.generations.map((g) => g.code), ["III", "I", "II"]);
  assert.deepEqual(r.origins, [2, 0, 1]);
  assert.deepEqual(r.drawings, ["/foto/katalog/m--l--abc.webp", undefined, undefined]);
});

test("reset follows the generation's origin after a move", () => {
  const r = applyOps(base(), [
    op({ op: "set", path: ["generations", 2, "name"], value: "Upraveno" }),
    op({ op: "move", path: ["generations"], from: 2, to: 0 }),
    op({ op: "reset", path: ["generations", 0, "name"] }),
  ]);
  assert.equal(r.card.generations[0].code, "III");
  assert.equal(r.card.generations[0].name, "Model III");
});

test("reset of an added generation is a conflict", () => {
  const r = applyOps(base(), [op({ op: "insert", path: ["generations", 0], value: gen("0", 1980) }), op({ op: "reset", path: ["generations", 0, "name"] })]);
  assert.equal(r.conflicts.length, 1);
});

test("reset of a field missing in the data removes it", () => {
  const r = applyOps(base(), [op({ op: "set", path: ["generations", 0, "dateNote"], value: "x" }), op({ op: "reset", path: ["generations", 0, "dateNote"] })]);
  assert.equal("dateNote" in r.card.generations[0], false);
});

test("nested arrays: insert, move and remove engines", () => {
  const r = applyOps(base(), [
    op({ op: "insert", path: ["generations", 0, "engines", 1], value: { variant: "1.6", fuel: "nafta" } }),
    op({ op: "move", path: ["generations", 0, "engines"], from: 1, to: 0 }),
    op({ op: "remove", path: ["generations", 0, "engines", 1] }),
  ]);
  assert.deepEqual(r.card.generations[0].engines, [{ variant: "1.6", fuel: "nafta" }]);
  assert.deepEqual(r.origins, [0, 1, 2]);
});

test("drawing on a generation that changed is a conflict", () => {
  const r = applyOps(base(), [op({ op: "drawing", index: 0, src: null, expect: { code: "X", name: null, from: 1 } })]);
  assert.equal(r.conflicts.length, 1);
  assert.deepEqual(r.drawings, [undefined, undefined, undefined]);
});

test("drawing null hides a generation's drawing", () => {
  const r = applyOps(base(), [op({ op: "drawing", index: 1, src: null })]);
  assert.deepEqual(r.drawings, [undefined, null, undefined]);
});

test("insert past the end is a conflict", () => {
  const r = applyOps(base(), [op({ op: "insert", path: ["generations", 7], value: gen("X", 1) })]);
  assert.equal(r.conflicts.length, 1);
  assert.equal(r.card.generations.length, 3);
});

test("parseOp refuses bad paths, prototype keys, oversized values and foreign drawing paths", () => {
  assert.equal(typeof parseOp({ op: "set", path: ["__proto__", "x"], value: 1 }), "string");
  assert.equal(typeof parseOp({ op: "set", path: [], value: 1 }), "string");
  assert.equal(typeof parseOp({ op: "set", path: ["generations", -1, "name"], value: 1 }), "string");
  assert.equal(typeof parseOp({ op: "set", path: ["summary"] }), "string");
  assert.equal(typeof parseOp({ op: "set", path: ["summary"], value: "x".repeat(300_000) }), "string");
  assert.equal(typeof parseOp({ op: "insert", path: ["generations", "a"], value: {} }), "string");
  assert.equal(typeof parseOp({ op: "drawing", index: 0, src: "https://evil.example/x.webp" }), "string");
  assert.equal(typeof parseOp({ op: "drawing", index: 0, src: "/foto/katalog/../x.webp" }), "string");
  assert.equal(typeof parseOp({ op: "nope" }), "string");
  assert.deepEqual(parseOp({ op: "drawing", index: 1, src: "/foto/katalog/skoda--octavia--a1b2.webp" }), { op: "drawing", index: 1, src: "/foto/katalog/skoda--octavia--a1b2.webp", expect: undefined });
});

test("legacy text edits become set and reset operations", () => {
  const set = rowToOp({ makeSlug: "m", lineSlug: "l", genIndex: 1, field: "name", value: "Jméno" });
  assert.deepEqual(set.op, { op: "set", path: ["generations", 1, "name"], value: "Jméno" });
  const reset = rowToOp({ makeSlug: "m", lineSlug: "l", genIndex: null, field: "summary", value: "" });
  assert.deepEqual(reset.op, { op: "reset", path: ["summary"] });
  assert.equal(rowToOp({ makeSlug: "m", lineSlug: "l", genIndex: null, field: "name", value: "x" }), null);
  assert.equal(rowToOp({ makeSlug: "m", lineSlug: "l", genIndex: null, field: "op", value: "{not json" }), null);
  const stored = rowToOp({ id: "o-1", makeSlug: "m", lineSlug: "l", genIndex: null, field: "op", value: JSON.stringify({ op: "reset", path: ["summary"] }) });
  assert.equal(stored.id, "o-1");
});

test("changesGenerations sees structural and drawing edits only", () => {
  assert.equal(changesGenerations([op({ op: "set", path: ["summary"], value: "x" })]), false);
  assert.equal(changesGenerations([op({ op: "insert", path: ["generations", 0, "engines", 0], value: {} })]), false);
  assert.equal(changesGenerations([op({ op: "insert", path: ["generations", 0], value: gen("x", 1) })]), true);
  assert.equal(changesGenerations([op({ op: "drawing", index: 0, src: null })]), true);
});

test("same treats a missing field as null and compares deeply", () => {
  assert.equal(same(undefined, null), true);
  assert.equal(same({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }], c: null }), true);
  assert.equal(same([1, 2], [2, 1]), false);
  assert.equal(getAt({ a: [{ b: 3 }] }, ["a", 0, "b"]), 3);
});

test("a long history replays the same way twice", () => {
  const ops = [
    op({ op: "insert", path: ["generations", 3], value: gen("IV", 2011) }),
    op({ op: "set", path: ["generations", 3, "current"], value: true, expect: false }),
    op({ op: "remove", path: ["generations", 0] }),
    op({ op: "move", path: ["generations"], from: 0, to: 1 }),
    op({ op: "set", path: ["summary"], value: "Nový popis.", expect: "Původní popis." }),
  ];
  const a = applyOps(base(), ops);
  const b = applyOps(base(), ops);
  assert.deepEqual(a, b);
  assert.deepEqual(a.card.generations.map((g) => g.code), ["III", "II", "IV"]);
  assert.deepEqual(a.origins, [2, 1, null]);
  assert.equal(a.card.summary, "Nový popis.");
  assert.deepEqual(a.conflicts, []);
});
