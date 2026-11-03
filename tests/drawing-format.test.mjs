// Tests of the browser drawing converter (src/lib/drawing-format.ts), on synthetic drawings.
// Parity with the Python pipeline on real ChatGPT drawings is checked by Codex's harness in
// analysis/codex/drawing-format/ (needs the source images and OpenCV). Run: npm test
import assert from "node:assert/strict";
import { test } from "node:test";
import { toSiteDrawing } from "../src/lib/drawing-format.ts";

/** A canvas-like RGBA image filled with one colour. */
function image(w, h, [r, g, b, a = 255]) {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) data.set([r, g, b, a], i * 4);
  return { width: w, height: h, data };
}
function rect(img, x0, y0, x1, y1, rgba) {
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) img.data.set(rgba, (y * img.width + x) * 4);
}
/** A crude "car" as an outlined box with wheels, plus a ground line and a centre line. */
function blueprint(w = 1536, h = 1024, { ink = [240, 245, 250], bg = [13, 37, 73] } = {}) {
  const img = image(w, h, bg);
  const line = (x0, y0, x1, y1) => rect(img, x0, y0, x1, y1, [...ink, 255]);
  const L = 0.3 * w, R = 0.7 * w, T = 0.35 * h, B = 0.75 * h;
  line(L, T, R, T + 4); line(L, B - 4, R, B); line(L, T, L + 4, B); line(R - 4, T, R, B); // body
  line(L + 30, B, L + 90, B + 60); line(R - 90, B, R - 30, B + 60); // wheels
  line(L + 60, T + 40, R - 60, T + 44); // windscreen edge
  line(0, B + 60, w, B + 63); // ground line across the frame
  line(w / 2 - 1, 0, w / 2 + 2, h); // centre line
  return img;
}
const alphaBox = (out) => {
  let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1;
  for (let y = 0; y < out.height; y++)
    for (let x = 0; x < out.width; x++)
      if (out.data[(y * out.width + x) * 4 + 3] > 64) ((x0 = Math.min(x0, x)), (y0 = Math.min(y0, y)), (x1 = Math.max(x1, x)), (y1 = Math.max(y1, y)));
  return { x0, y0, x1, y1 };
};

test("a white-on-navy blueprint becomes a 960x600 white-in-alpha drawing", () => {
  const out = toSiteDrawing(blueprint());
  assert.ok(out);
  assert.equal(out.width, 960);
  assert.equal(out.height, 600);
  assert.equal(out.data.length, 960 * 600 * 4);
  for (let i = 0; i < out.data.length; i += 4 * 997) assert.deepEqual([...out.data.slice(i, i + 3)], [255, 255, 255]);
  // tyres stand on the ground line at 88 % of the height, the car is centred
  const box = alphaBox(out);
  assert.ok(Math.abs(box.y1 - Math.round(0.88 * 600)) <= 3, `ground at ${box.y1}`);
  assert.ok(Math.abs((box.x0 + box.x1) / 2 - 480) <= 4, `centre at ${(box.x0 + box.x1) / 2}`);
});

test("the input is not changed", () => {
  const src = blueprint(800, 500);
  const copy = new Uint8ClampedArray(src.data);
  toSiteDrawing(src);
  assert.deepEqual(src.data, copy);
});

test("an empty image has no car", () => {
  assert.equal(toSiteDrawing(image(800, 500, [13, 37, 73])), null);
  assert.equal(toSiteDrawing(image(800, 500, [0, 0, 0, 0])), null);
});

test("dark lines on white are inverted and converted too", () => {
  const out = toSiteDrawing(blueprint(1200, 800, { ink: [20, 20, 20], bg: [250, 250, 250] }));
  assert.ok(out);
  const box = alphaBox(out);
  assert.ok(box.x1 > box.x0 && box.y1 > box.y0);
});

test("converting the site's own output again keeps it in place", () => {
  const once = toSiteDrawing(blueprint());
  const twice = toSiteDrawing(once);
  assert.ok(twice);
  assert.deepEqual(alphaBox(twice), alphaBox(once));
});

test("a large input converts quickly", () => {
  const src = blueprint(2400, 1600);
  const t = performance.now();
  toSiteDrawing(src);
  assert.ok(performance.now() - t < 3000);
});
