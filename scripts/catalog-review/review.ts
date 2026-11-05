// Bulk review of model cards with the editor's "Kopírovat pro AI" prompt (components/catalog-editor/
// json-diff aiPrompt), done by AI agents over the whole catalogue. The result is the same as an admin
// pasting the corrected card back with "Vložit JSON": operations (lib/catalog-ops), here kept in
// src/data/catalog-review/<make>.json and replayed by scripts/app-model-cards.mjs before admins' edits.
//
//   npx tsx scripts/catalog-review/review.ts prep <workdir> <make> [line…]
//     writes <workdir>/RULES.md (the prompt without the card) and, per line still to review,
//     <workdir>/<make>/<line>.orig.json and <line>.card.json (the card to correct in place)
//   npx tsx scripts/catalog-review/review.ts apply <workdir> <make>
//     turns every corrected card (and its <line>.changes.md) into operations in the review file
//   npx tsx scripts/catalog-review/review.ts lines
//     makes with their line counts, lines with admins' edits (src/data/catalog-edits.json or
//     $CATALOG_EDITS) and lines already reviewed
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { type CatalogOp, applyOps, identityOf } from "@/lib/catalog-ops";
import { aiPrompt, diffCard, parseCard } from "@/components/catalog-editor/json-diff";
import { BODY_NAMES, CARD_FUEL, DRIVE, GEARBOX, type ModelCard } from "@/lib/modelCards";

const ROOT = new URL("../../", import.meta.url);
const read = (rel: string) => JSON.parse(readFileSync(new URL(rel, ROOT), "utf8"));
const DROP = new Set(["sources", "sourceScope", "fieldSources", "generationEvidence", "specificationScope", "engineCoverage"]);
const strip = (v: unknown): unknown =>
  Array.isArray(v) ? v.map(strip) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).filter(([k]) => !DROP.has(k)).map(([k, x]) => [k, strip(x)])) : v;

const index = read("src/data/model-cards-index.json") as Record<string, Record<string, ModelCard>>;
const makes = new Map((read("src/data/makes-index.json") as { slug: string; name: string }[]).map((m) => [m.slug, m.name]));
const editsFile = process.env.CATALOG_EDITS ?? new URL("src/data/catalog-edits.json", ROOT).pathname;
const adminLines = new Set((JSON.parse(readFileSync(editsFile, "utf8")).edits ?? []).map((r: { makeSlug: string; lineSlug: string }) => `${r.makeSlug}--${r.lineSlug}`));
const reviewPath = (make: string) => new URL(`src/data/catalog-review/${make}.json`, ROOT);
type Review = Record<string, { ops: CatalogOp[]; changes: string }>;
const reviewOf = (make: string): Review => (existsSync(reviewPath(make)) ? JSON.parse(readFileSync(reviewPath(make), "utf8")) : {});
const cardOf = (make: string, line: string) => strip(index[make][line]) as ModelCard;
const titleOf = (make: string, line: string) => `${makes.get(make) ?? make} ${index[make][line].name}`;

const [cmd, work, make, ...only] = process.argv.slice(2);

if (cmd === "lines") {
  for (const [m, lines] of Object.entries(index)) {
    const names = Object.keys(lines);
    const admin = names.filter((l) => adminLines.has(`${m}--${l}`)).length;
    const done = Object.keys(reviewOf(m)).length;
    console.log(`${m}\t${names.length}\tadmin ${admin}\treviewed ${done}`);
  }
} else if (cmd === "prep") {
  if (!index[make]) throw new Error(`unknown make ${make}`);
  const dir = join(work, make);
  mkdirSync(dir, { recursive: true });
  const rules = aiPrompt({ generations: [] } as unknown as ModelCard, "{MODEL}").split("KARTA (na jednom řádku")[0];
  writeFileSync(join(work, "RULES.md"), rules);
  const done = reviewOf(make);
  const lines = (only.length ? only : Object.keys(index[make])).filter((l) => !adminLines.has(`${make}--${l}`) && !(l in done));
  for (const line of lines) {
    const card = JSON.stringify({ _title: titleOf(make, line), ...cardOf(make, line) }, null, 1);
    writeFileSync(join(dir, `${line}.orig.json`), card);
    if (!existsSync(join(dir, `${line}.card.json`))) writeFileSync(join(dir, `${line}.card.json`), card);
  }
  console.log(`${make}: ${lines.length} lines to review in ${dir}`);
} else if (cmd === "apply") {
  const dir = join(work, make);
  const review = reviewOf(make);
  const bad: string[] = [];
  let changed = 0;
  let unchanged = 0;
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".card.json"))) {
    const line = file.slice(0, -".card.json".length);
    if (!index[make][line] || adminLines.has(`${make}--${line}`)) continue;
    const changesFile = join(dir, `${line}.changes.md`);
    if (!existsSync(changesFile)) continue; // not reviewed yet
    const parsed = parseCard(readFileSync(join(dir, file), "utf8"));
    if (typeof parsed === "string") {
      bad.push(`${line}: ${parsed}`);
      continue;
    }
    const { _title, ...next } = parsed as ModelCard & { _title?: string };
    const problems = check(next as ModelCard);
    if (problems.length) {
      bad.push(`${line}: ${problems.slice(0, 5).join("; ")}`);
      continue;
    }
    const base = cardOf(make, line);
    const raw = diffCard(base, next as ModelCard);
    const changes = readFileSync(changesFile, "utf8").trim();
    if (!raw.length) {
      unchanged++;
      review[line] = { ops: [], changes };
      continue;
    }
    // as the editor does: each operation inside a generation carries that generation's identity,
    // and a new generation a token, so the operations find their generation after a data refresh
    const ops: CatalogOp[] = [];
    const stored = (list: CatalogOp[]) => list.map((op, n) => ({ id: `r-${n}`, makeSlug: make, lineSlug: line, op, createdAt: "" }));
    let failed = "";
    for (const r of raw) {
      let op = r;
      if (op.op !== "drawing" && op.path[0] === "generations" && typeof op.path[1] === "number" && op.path.length > 1) {
        const before = applyOps(base, stored(ops));
        const id = identityOf(before.card.generations[op.path[1]]);
        const token = before.tokens[op.path[1]];
        if (id) op = { ...op, gen: token ? { ...id, token } : id };
      }
      if (op.op === "insert" && op.path.length === 2 && op.path[0] === "generations" && !op.token) op = { ...op, token: `rv${line}${ops.length}`.replace(/[^a-z0-9]/g, "").slice(0, 16) };
      ops.push(op);
    }
    const result = applyOps(base, stored(ops));
    if (result.conflicts.length) failed = result.conflicts.map((c) => c.reason).join("; ");
    if (failed) {
      bad.push(`${line}: ${failed}`);
      continue;
    }
    review[line] = { ops, changes };
    changed++;
  }
  const sorted = Object.fromEntries(Object.entries(review).sort(([a], [b]) => a.localeCompare(b)));
  mkdirSync(new URL("src/data/catalog-review/", ROOT), { recursive: true });
  writeFileSync(reviewPath(make), `${JSON.stringify(sorted, null, 1)}\n`);
  console.log(`${make}: ${changed} lines with corrections, ${unchanged} confirmed unchanged, ${bad.length} refused`);
  for (const b of bad) console.log(`  refused ${b}`);
} else {
  console.error("usage: review.ts prep|apply <workdir> <make> [line…] | lines");
  process.exit(1);
}

/** Values the site does not know, and the lists every generation must have. */
function check(card: ModelCard): string[] {
  const out: string[] = [];
  const body = new Set(Object.keys(BODY_NAMES));
  const drive = new Set(Object.keys(DRIVE));
  const gear = new Set(Object.keys(GEARBOX));
  const fuel = new Set(Object.keys(CARD_FUEL));
  const year = (v: unknown, at: string) => {
    if (v !== null && v !== undefined && !(Number.isInteger(v) && (v as number) >= 1880 && (v as number) <= 2030)) out.push(`${at}: rok ${JSON.stringify(v)}`);
  };
  card.generations.forEach((g, i) => {
    const at = `gen ${i + 1}`;
    year(g.from, `${at}.from`);
    year(g.to, `${at}.to`);
    if (g.from && g.to && g.to < g.from) out.push(`${at}: to < from`);
    for (const b of g.bodyTypes) if (!body.has(b)) out.push(`${at}: bodyType ${b}`);
    for (const d of g.drivetrains) if (!drive.has(d)) out.push(`${at}: drive ${d}`);
    for (const t of g.transmissions) if (t.type && !gear.has(t.type)) out.push(`${at}: gearbox ${t.type}`);
    for (const e of g.engines) {
      if (e.fuel && !fuel.has(e.fuel)) out.push(`${at}: fuel ${e.fuel}`);
      for (const k of ["displacementCc", "powerKwMin", "powerKwMax", "displacementLitresNominal"] as const)
        if (e[k] !== null && e[k] !== undefined && typeof e[k] !== "number") out.push(`${at}: engine.${k} není číslo`);
    }
    for (const f of g.facelifts) year(f.year, `${at}.facelift`);
    for (const t of g.trims) {
      if (t.bodyType && !body.has(t.bodyType)) out.push(`${at}: trim bodyType ${t.bodyType}`);
      if (t.drive && !drive.has(t.drive)) out.push(`${at}: trim drive ${t.drive}`);
      if (t.transmission?.type && !gear.has(t.transmission.type)) out.push(`${at}: trim gearbox ${t.transmission.type}`);
      if (t.engine?.fuel && !fuel.has(t.engine.fuel)) out.push(`${at}: trim fuel ${t.engine.fuel}`);
    }
    const dims = g.dimensionsMm as Record<string, unknown> | null;
    if (dims) for (const [k, v] of Object.entries(dims)) if (v !== null && (typeof v !== "number" || v < 300 || v > 20000)) out.push(`${at}: dimensionsMm.${k} ${JSON.stringify(v)}`);
  });
  return out;
}
