// A facelift's own front drawing (src/lib/modelCards.ts stagesOf): only an uploaded drawing's path
// is used, on that facelift's look. Run: npm test
import assert from "node:assert/strict";
import { test } from "node:test";

const { stagesOf } = await import(new URL("../src/lib/modelCards.ts", import.meta.url).href);

const gen = (facelifts) => ({ code: "II", name: "Fabia II", from: 2007, to: 2014, current: false, facelifts, photo: null });
const fl = (year, drawing) => ({ year, to: null, name: null, code: null, note: null, photo: null, drawing });

test("a facelift's uploaded drawing goes to its own look only", () => {
  const st = stagesOf(gen([fl(2010, "/foto/katalog/skoda--fabia--abc123.webp")]));
  assert.equal(st[0].drawing, undefined);
  assert.equal(st[1].drawing, "/foto/katalog/skoda--fabia--abc123.webp");
});

test("anything but an uploaded drawing is ignored", () => {
  for (const bad of ["https://evil.example/x.webp", "/foto/katalog/../x.webp", "x) ; background:url(y", "", null, undefined, 3])
    assert.equal(stagesOf(gen([fl(2010, bad)]))[1].drawing, null);
});

test("facelifts in year order keep their own drawings", () => {
  const st = stagesOf(gen([fl(2012, "/foto/katalog/b.webp"), fl(2010, "/foto/katalog/a.webp")]));
  assert.deepEqual(st.map((s) => s.drawing), [undefined, "/foto/katalog/a.webp", "/foto/katalog/b.webp"]);
});
