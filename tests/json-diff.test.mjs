// Tests of "Vložit JSON" (src/components/catalog-editor/json-diff.ts): the difference between two
// cards as operations, which replayed on the first card must give the second. Run: npm test
import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { buildSync } from "esbuild";

const bundle = (file) => {
  const code = buildSync({ entryPoints: [fileURLToPath(new URL(file, import.meta.url))], bundle: true, format: "esm", write: false, platform: "node", alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) } }).outputFiles[0].text;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
};
const { diffCard, parseCard } = await bundle("../src/components/catalog-editor/json-diff.ts");
const { applyOps } = await import("../src/lib/catalog-ops.ts");

const gen = (code, from, extra = {}) => ({ code, name: `Model ${code}`, from, to: from + 6, current: false, facelifts: [], bodyTypes: ["sedan"], engines: [{ variant: "1.0", powerKwMin: 40 }], drivetrains: ["fwd"], transmissions: [], dimensionsMm: { length: 4000, width: 1700, height: 1450, wheelbase: 2500 }, trunkL: 300, markets: [], trims: [], photo: null, ...extra });
const card = () => ({ name: "Model", segment: "B", summary: "Popis.", generations: [gen("I", 1990), gen("II", 1997), gen("III", 2004)] });
const replay = (a, ops) => applyOps(a, ops.map((op, n) => ({ id: `j${n}`, makeSlug: "m", lineSlug: "l", createdAt: "", op })));
const clone = (v) => structuredClone(v);

function check(a, b) {
  const ops = diffCard(a, b);
  const r = replay(a, ops);
  assert.deepEqual(r.conflicts, []);
  assert.deepEqual(r.card, b);
  return { ops, r };
}

test("no change, no operations", () => {
  assert.deepEqual(diffCard(card(), card()), []);
});

test("field edits, added and removed fields", () => {
  const b = clone(card());
  b.summary = "Nový popis.";
  b.generations[1].trunkL = 380;
  b.generations[1].engines[0].powerKwMin = 44;
  b.generations[2].dateNote = "Poznámka";
  delete b.generations[0].trunkL; // a missing field equals null, so take one with a value
  const { ops } = check(card(), b);
  assert.ok(ops.every((o) => o.op === "set" || o.op === "remove"));
});

test("removed, added and reordered generations keep their origins", () => {
  const a = card();
  const b = clone(a);
  b.generations = [gen("IV", 2011), clone(a.generations[2]), clone(a.generations[0])];
  b.generations[1].trunkL = 999;
  const { ops, r } = check(a, b);
  assert.deepEqual(r.origins, [null, 2, 0]);
  assert.ok(ops.some((o) => o.op === "remove"));
  assert.ok(ops.some((o) => o.op === "insert"));
});

test("whole lists replaced, required lists only emptied", () => {
  const b = clone(card());
  b.generations[0].engines = [{ variant: "1.3", powerKwMin: 50 }, { variant: "1.6", powerKwMin: 70 }];
  b.generations[1].trims = [];
  check(card(), b);
});

test("a card from the editor's own copy, with duplicate codes", () => {
  const a = card();
  a.generations[2].code = "I";
  const b = clone(a);
  b.generations[2].name = "Druhé I";
  check(a, b);
});

test("pasted text is checked", () => {
  assert.equal(typeof parseCard("{ nope"), "string");
  assert.equal(typeof parseCard("[]"), "string");
  assert.equal(typeof parseCard('{"name":"x"}'), "string");
  assert.equal(typeof parseCard('{"generations":[{"code":"I"}]}'), "string");
  assert.equal(typeof parseCard(JSON.stringify(card())), "object");
});
