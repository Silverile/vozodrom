/** Dependency-free browser/Node port of tools/front/site_drawings.py.
 * Input pixels are straight (not premultiplied) RGBA, as returned by getImageData().
 * Output is straight RGBA with white RGB, including fully transparent pixels.
 * Detection: alpha < 250 in >= 1% of pixels AND >= 80% of visible pixels are
 * near-white (RGB >= 180, channel spread <= 60) => use the supplied alpha.
 * Otherwise corner grayscale P90 > 160 => invert grayscale (dark ink on paper).
 * Otherwise use the original white-on-navy brightness ramp. Canonical 960x600
 * output with the exact generated ground stroke is copied without re-fitting:
 * that avoids moving/thickening lines on repeated edits. Other inputs re-fit.
 */
export function toSiteDrawing(src: {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}): { width: 960; height: 600; data: Uint8ClampedArray } | null {
  const { width: w, height: h, data } = src;
  if (!Number.isSafeInteger(w) || !Number.isSafeInteger(h) || w <= 0 || h <= 0 ||
      !Number.isSafeInteger(w * h) || data.length !== w * h * 4) return null;
  const n = w * h;
  const gray = new Uint8Array(n);
  let transparent = 0, visible = 0, white = 0;
  for (let i = 0; i < n; i++) {
    const j = i * 4, r = data[j], g = data[j + 1], b = data[j + 2], a = data[j + 3];
    // OpenCV's uint8 RGB -> gray fixed-point coefficients, not floating luma.
    gray[i] = (r * 9798 + g * 19235 + b * 3735 + 16384) >> 15;
    if (a < 250) transparent++;
    if (a > 16) {
      visible++;
      if (Math.min(r, g, b) >= 180 && Math.max(r, g, b) - Math.min(r, g, b) <= 60) white++;
    }
  }
  if (visible === 0) return null;
  const suppliedAlpha = transparent >= n * 0.01 && white >= visible * 0.8;
  const canonical = suppliedAlpha && w === 960 && h === 600 ? canonicalGround(data) : false;
  if (canonical === null) return null;
  if (canonical) {
    const result = new Uint8ClampedArray(data);
    for (let i = 0; i < n; i++) result[i * 4] = result[i * 4 + 1] = result[i * 4 + 2] = 255;
    return { width: 960, height: 600, data: result };
  }
  const invert = !suppliedAlpha && cornerP90(gray, w, h) > 160;
  if (invert) for (let i = 0; i < n; i++) gray[i] = 255 - gray[i];
  const bg = cornerP90(gray, w, h) + 6;
  const a = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    a[i] = suppliedAlpha ? data[i * 4 + 3] / 255 :
      Math.max(0, Math.min(1, (gray[i] - bg) / (235 - bg)));
  }
  erase(a, w, h, true);
  erase(a, w, h, false);
  const box = carBox(a, w, h);
  if (!box) return null;
  const [x0, y0, x1, y1] = box;
  const cw = x1 - x0, ch = y1 - y0;
  const scale = Math.min(420 / ch, 825.6 / cw);
  const dw = Math.max(1, roundEven(cw * scale)), dh = Math.max(1, roundEven(ch * scale));
  const resized = resizeArea(a, w, x0, y0, cw, ch, dw, dh);
  const out = new Float32Array(960 * 600);
  const ox = Math.floor((960 - dw) / 2), oy = 528 - dh;
  for (let y = 0; y < dh; y++) out.set(resized.subarray(y * dw, (y + 1) * dw), (oy + y) * 960 + ox);
  // cv2.line(float32, thickness=2, LINE_AA) falls back to LINE_8. The horizontal
  // stroke is three rows with a one-pixel circular cap, not a 2px canvas stroke.
  const left = Math.max(ox - 58, 0), right = Math.min(ox + dw + 58, 959);
  for (let y = 527; y <= 529; y++) out.fill(0.55, y * 960 + left, y * 960 + right + 1);
  if (left > 0) out[528 * 960 + left - 1] = 0.55;
  if (right < 959) out[528 * 960 + right + 1] = 0.55;
  const rgba = new Uint8ClampedArray(out.length * 4);
  for (let i = 0; i < out.length; i++) {
    const j = i * 4;
    rgba[j] = rgba[j + 1] = rgba[j + 2] = 255;
    // NumPy multiplies float32 planes and truncates when casting to uint8.
    rgba[j + 3] = Math.floor(Math.min(1, Math.fround(out[i] * Math.fround(1.15))) * 255);
  }
  return { width: 960, height: 600, data: rgba };
}

/** The reference ground has alpha 161, three flat rows and one-pixel end caps.
 * Require an exact complete stroke AND real ink above it, not just a ground.
 * A generic transparent 960x600 upload must still go through the normal fit. */
function canonicalGround(data: Uint8ClampedArray): boolean | null {
  let left = -1, right = -1;
  for (let x = 0; x < 960; x++) if (data[(527 * 960 + x) * 4 + 3] === 161) {
    if (left < 0) left = x;
    right = x;
  }
  if (left < 0 || right - left < 250) return false;
  for (let x = 0; x < 960; x++) for (let y = 527; y <= 529; y++) {
    const expected = (x >= left && x <= right) || (y === 528 && (x === left - 1 || x === right + 1)) ? 161 : 0;
    if (data[(y * 960 + x) * 4 + 3] !== expected) return false;
  }
  // The morphology/area cut-off still rejects a bare line or insignificant specks.
  const a = new Float32Array(960 * 527);
  for (let i = 0; i < a.length; i++) a[i] = data[i * 4 + 3] / 255;
  return carBox(a, 960, 527) ? true : null;
}

function roundEven(x: number): number {
  const lo = Math.floor(x), f = x - lo;
  return f === 0.5 ? lo + (lo % 2) : Math.round(x);
}

function cornerP90(g: Uint8Array, w: number, h: number): number {
  // Histogram retains duplicate samples in overlapping corners on small inputs,
  // matching NumPy slicing/concatenation and its linear percentile interpolation.
  const hist = new Uint32Array(256);
  let total = 0;
  for (const [ya, yb] of [[0, Math.min(h, 60)], [Math.max(0, h - 40), h]]) {
    for (const [xa, xb] of [[0, Math.min(w, 60)], [Math.max(0, w - 60), w]]) {
      for (let y = ya; y < yb; y++) for (let x = xa; x < xb; x++) { hist[g[y * w + x]]++; total++; }
    }
  }
  const pos = (total - 1) * 0.9, lo = Math.floor(pos), hi = Math.ceil(pos);
  let count = 0, low = -1;
  for (let v = 0; v < 256; v++) {
    count += hist[v];
    if (low < 0 && count > lo) low = v;
    if (count > hi) return low + (v - low) * (pos - lo);
  }
  return 255;
}

function erase(a: Float32Array, w: number, h: number, rows: boolean): void {
  const n = rows ? h : w, length = rows ? w : h;
  const idx: number[] = [];
  for (let p = 0; p < n; p++) {
    if (!rows && Math.abs(p - w / 2) >= 80) continue;
    let count = 0;
    for (let q = 0; q < length; q++) if (a[rows ? p * w + q : q * w + p] > 0.3) count++;
    if (count / length > (rows ? 0.75 : 0.7)) idx.push(p);
  }
  for (let k = 0; k < idx.length;) {
    const first = idx[k++];
    let last = first;
    while (k < idx.length && idx[k] === last + 1) last = idx[k++];
    const lo = Math.max(0, first - 2), hi = Math.min(n - 1, last + 2);
    // Capture the two endpoints before replacing the run (NumPy RHS is a copy).
    for (let q = 0; q < length; q++) {
      const value = Math.min(a[rows ? lo * w + q : q * w + lo], a[rows ? hi * w + q : q * w + hi]);
      for (let p = lo; p <= hi; p++) a[rows ? p * w + q : q * w + p] = value;
    }
  }
}

/** Binary rectangular morphology, separable rolling sums, OpenCV neutral border. */
function morph(src: Uint8Array, w: number, h: number, size: number, dilate: boolean): Uint8Array {
  const tmp = new Uint8Array(src.length), dst = new Uint8Array(src.length);
  const before = Math.floor(size / 2), after = size - before - 1;
  for (let y = 0; y < h; y++) {
    let sum = 0;
    for (let x = 0; x <= Math.min(w - 1, after); x++) sum += src[y * w + x];
    for (let x = 0; x < w; x++) {
      const valid = Math.min(w - 1, x + after) - Math.max(0, x - before) + 1;
      tmp[y * w + x] = +(dilate ? sum > 0 : sum === valid);
      if (x - before >= 0) sum -= src[y * w + x - before];
      if (x + after + 1 < w) sum += src[y * w + x + after + 1];
    }
  }
  for (let x = 0; x < w; x++) {
    let sum = 0;
    for (let y = 0; y <= Math.min(h - 1, after); y++) sum += tmp[y * w + x];
    for (let y = 0; y < h; y++) {
      const valid = Math.min(h - 1, y + after) - Math.max(0, y - before) + 1;
      dst[y * w + x] = +(dilate ? sum > 0 : sum === valid);
      if (y - before >= 0) sum -= tmp[(y - before) * w + x];
      if (y + after + 1 < h) sum += tmp[(y + after + 1) * w + x];
    }
  }
  return dst;
}

function carBox(a: Float32Array, w: number, h: number): [number, number, number, number] | null {
  let m: Uint8Array = new Uint8Array(a.length);
  for (let i = 0; i < a.length; i++) m[i] = +(a[i] > 0.25);
  m = morph(morph(morph(m, w, h, 2, false), w, h, 2, true), w, h, 9, true);
  const stack = new Int32Array(m.length);
  let bx0 = w, by0 = h, bx1 = 0, by1 = 0;
  for (let i = 0; i < m.length; i++) {
    if (!m[i]) continue;
    let top = 0, area = 0, x0 = w, y0 = h, x1 = 0, y1 = 0;
    stack[top++] = i;
    m[i] = 0;
    while (top) {
      const at = stack[--top], y = Math.floor(at / w), x = at - y * w;
      area++;
      if (x < x0) x0 = x; if (x + 1 > x1) x1 = x + 1;
      if (y < y0) y0 = y; if (y + 1 > y1) y1 = y + 1;
      for (let yy = Math.max(0, y - 1); yy <= Math.min(h - 1, y + 1); yy++) {
        for (let xx = Math.max(0, x - 1); xx <= Math.min(w - 1, x + 1); xx++) {
          const ni = yy * w + xx;
          if (m[ni]) { m[ni] = 0; stack[top++] = ni; }
        }
      }
    }
    if (area > 0.002 * a.length) {
      bx0 = Math.min(bx0, x0); by0 = Math.min(by0, y0);
      bx1 = Math.max(bx1, x1); by1 = Math.max(by1, y1);
    }
  }
  return bx1 > bx0 && by1 > by0 ? [bx0, by0, bx1, by1] : null;
}

/** OpenCV INTER_AREA: actual pixel-area overlap when shrinking; area-mode
 * bilinear emulation when enlarging, with float32 intermediate accumulation. */
function resizeArea(src: Float32Array, stride: number, x0: number, y0: number,
  sw: number, sh: number, dw: number, dh: number): Float32Array {
  const dst = new Float32Array(dw * dh), sx = sw / dw, sy = sh / dh;
  if (sx < 1 || sy < 1) {
    for (let y = 0; y < dh; y++) {
      const iy = Math.floor(y * sy);
      let fy = (y + 1) - (iy + 1) / sy;
      fy = fy <= 0 ? 0 : fy - Math.floor(fy);
      const y1 = Math.min(sh - 1, iy + 1);
      for (let x = 0; x < dw; x++) {
        const ix = Math.floor(x * sx);
        let fx = (x + 1) - (ix + 1) / sx;
        fx = fx <= 0 ? 0 : fx - Math.floor(fx);
        const x1 = Math.min(sw - 1, ix + 1);
        const v0 = src[(y0 + iy) * stride + x0 + ix] * (1 - fx) + src[(y0 + iy) * stride + x0 + x1] * fx;
        const v1 = src[(y0 + y1) * stride + x0 + ix] * (1 - fx) + src[(y0 + y1) * stride + x0 + x1] * fx;
        dst[y * dw + x] = v0 * (1 - fy) + v1 * fy;
      }
    }
    return dst;
  }
  const table = (s: number, d: number) => {
    const cells: { i: number; weight: number }[][] = [];
    const scale = s / d;
    for (let at = 0; at < d; at++) {
      const lo = at * scale, hi = lo + scale;
      const cell: { i: number; weight: number }[] = [];
      for (let i = Math.floor(lo); i < Math.min(s, Math.ceil(hi)); i++) {
        const overlap = Math.min(hi, i + 1) - Math.max(lo, i);
        if (overlap > 1e-3) cell.push({ i, weight: Math.fround(overlap / Math.min(scale, s - lo)) });
      }
      cells.push(cell);
    }
    return cells;
  };
  const xt = table(sw, dw), yt = table(sh, dh);
  const row = new Float32Array(dw);
  for (let y = 0; y < dh; y++) {
    for (const yy of yt[y]) {
      row.fill(0);
      for (let x = 0; x < dw; x++) {
        let sum = 0;
        for (const xx of xt[x]) sum = Math.fround(sum + Math.fround(src[(y0 + yy.i) * stride + x0 + xx.i] * xx.weight));
        row[x] = sum;
      }
      for (let x = 0; x < dw; x++) dst[y * dw + x] = Math.fround(dst[y * dw + x] + Math.fround(row[x] * yy.weight));
    }
  }
  return dst;
}
