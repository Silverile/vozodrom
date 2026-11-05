// Writes the model cards the site reads, one JSON file per model line, to
// public/katalog-data/<make>/<line>.json: the cards index without the evidence fields the site never
// shows (sources, scopes, field sources). The files are static assets, so the Worker does not bundle
// the catalogue (it did, twice, and its cold starts were slow and its size near the 64 MiB limit);
// lib/card-store reads them at build time from disk and in the Worker through ASSETS. The full
// index stays the catalogue's own record for its checks. Runs before dev, build and typecheck.
//
// Admins' edits (src/data/catalog-edits.json, fetched from the site on CI) are replayed here
// (lib/catalog-ops), so the files carry them. An edited line also gets <line>.base.json, the card as
// the data files have it, for the editor. Every edited line is listed in src/data/catalog-built.json:
// for each generation the index it came from in the data files (front drawings and STK statistics
// are keyed by it), the drawings with the edited years, and the generations' codes and years for
// the listing form and its checks, and facelifts' own drawings by their years (lib/makes reads them instead of the model lines index).
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { applyOps, generationSummary, rowToOp } from "../src/lib/catalog-ops.ts";

const DROP = new Set(["sources", "sourceScope", "fieldSources", "generationEvidence", "specificationScope", "engineCoverage"]);
const SOURCE = new URL("../src/data/model-cards-index.json", import.meta.url);
const EDITS = new URL("../src/data/catalog-edits.json", import.meta.url);
const DRAWINGS = new URL("../src/data/front-drawings.json", import.meta.url);
const REVIEW = new URL("../src/data/front-drawing-review.json", import.meta.url);
const TARGET = new URL("../public/katalog-data/", import.meta.url);
const BUILT = new URL("../src/data/catalog-built.json", import.meta.url);
const REVIEWS = new URL("../src/data/catalog-review/", import.meta.url);

const strip = (value) =>
  Array.isArray(value)
    ? value.map(strip)
    : value && typeof value === "object"
      ? Object.fromEntries(Object.entries(value).filter(([key]) => !DROP.has(key)).map(([key, v]) => [key, strip(v)]))
      : value;

const index = JSON.parse(readFileSync(SOURCE, "utf8"));
const drawings = JSON.parse(readFileSync(DRAWINGS, "utf8"));
const review = JSON.parse(readFileSync(REVIEW, "utf8"));

// operations per line, in the order they were saved
const opsByLine = new Map();
const rows = JSON.parse(readFileSync(EDITS, "utf8")).edits ?? [];
rows.forEach((row, n) => {
  const op = rowToOp(row, n);
  if (!op) return;
  const key = `${op.makeSlug}--${op.lineSlug}`;
  opsByLine.set(key, [...(opsByLine.get(key) ?? []), op]);
});

// Bulk review (scripts/catalog-review): operations made the same way as an admin's "Vložit JSON",
// kept per make in src/data/catalog-review/<make>.json and replayed before admins' edits. The
// reviewed card is the editor's base (<line>.base.json), so admins edit on top of it.
const reviewByLine = new Map();
for (const file of existsSync(REVIEWS) ? readdirSync(REVIEWS).filter((f) => f.endsWith(".json")) : []) {
  const make = file.slice(0, -5);
  for (const [line, { ops }] of Object.entries(JSON.parse(readFileSync(new URL(file, REVIEWS), "utf8")))) {
    if (ops.length) reviewByLine.set(`${make}--${line}`, ops.map((op, n) => ({ id: `review-${n}`, makeSlug: make, lineSlug: line, op, createdAt: "" })));
  }
}

/** Drawings of an edited line by its generations: [index, first year, last year or null, site path]. */
function drawingsOf(key, card, applied) {
  const own = new Map((drawings[key] ?? []).map(([i]) => [i, true]));
  const out = [];
  card.generations.forEach((g, i) => {
    const set = applied.drawings[i];
    const origin = applied.origins[i];
    let src = null;
    if (typeof set === "string") src = set;
    else if (set === undefined && origin !== null && own.has(origin) && !(key in review) && !(`${key}--${origin}` in review)) src = `/front/${key}--${origin}.webp`;
    if (src) out.push([i, g.from ?? null, g.current ? null : (g.to ?? null), src]);
  });
  return out;
}

/** Facelifts' own drawings (uploaded in the editor), by the years of their look (as lib/modelCards stagesOf). */
function faceliftDrawingsOf(card) {
  const out = [];
  card.generations.forEach((g, i) => {
    const fl = [...(g.facelifts ?? [])].sort((a, b) => a.year - b.year);
    fl.forEach((f, k) => {
      if (typeof f.drawing !== "string" || !/^\/foto\/katalog\/[a-z0-9-]+\.webp$/.test(f.drawing)) return;
      const last = k === fl.length - 1;
      const to = f.to ?? (last ? (g.current ? null : (g.to ?? null)) : fl[k + 1].year);
      out.push([i, f.year ?? null, to, f.drawing]);
    });
  });
  return out;
}

rmSync(TARGET, { recursive: true, force: true });
const built = { lines: {}, conflicts: {} };
let count = 0;
let edited = 0;
for (const [make, lines] of Object.entries(index)) {
  mkdirSync(new URL(`${make}/`, TARGET), { recursive: true });
  for (const [line, raw] of Object.entries(lines)) {
    const card = strip(raw);
    const key = `${make}--${line}`;
    const ops = opsByLine.get(key);
    const reviewOps = reviewByLine.get(key);
    let out = card;
    if (ops || reviewOps) {
      // review first, admins' edits on the reviewed card; origins and drawings composed back to
      // the data files' generations
      const reviewed = reviewOps ? applyOps(card, reviewOps) : null;
      const base = reviewed ? reviewed.card : card;
      const admin = applyOps(base, ops ?? []);
      const applied = reviewed
        ? {
            ...admin,
            origins: admin.origins.map((o) => (o === null ? null : reviewed.origins[o])),
            drawings: admin.drawings.map((d, i) => (d !== undefined || admin.origins[i] === null ? d : reviewed.drawings[admin.origins[i]])),
          }
        : admin;
      out = applied.card;
      writeFileSync(new URL(`${make}/${line}.base.json`, TARGET), JSON.stringify(base));
      // admin: whether admins edited the line (the publication overview lists only those)
      built.lines[key] = { origins: applied.origins, drawings: drawingsOf(key, out, applied), faceliftDrawings: faceliftDrawingsOf(out), generations: generationSummary(out), admin: !!ops };
      const conflicts = [...(reviewed?.conflicts ?? []), ...admin.conflicts];
      if (conflicts.length) built.conflicts[key] = conflicts;
      edited++;
    }
    writeFileSync(new URL(`${make}/${line}.json`, TARGET), JSON.stringify(out));
    count++;
  }
}
writeFileSync(BUILT, `${JSON.stringify(built)}\n`);
console.log(`model cards: ${count} files in public/katalog-data/, ${edited} with admins' edits or review (${reviewByLine.size} reviewed)`);
for (const [key, list] of Object.entries(built.conflicts)) {
  for (const c of list) console.warn(`  edit ${c.id} of ${key} skipped: ${c.reason}`);
}
