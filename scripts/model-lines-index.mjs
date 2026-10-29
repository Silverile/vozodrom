// Builds src/data/model-lines-index.json, a small per-make list of curated car model lines
// (slug, name, years, body types, generation count) for the browser. Source:
// src/data/catalog/model-lines-auto.json (curated in analysis/codex/, see its review report), plus
// lines that exist only as model cards (src/data/model-cards/, researched by Claude's agents).
//
// Run after the model lines change: node scripts/model-lines-index.mjs

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";

const lines = JSON.parse(readFileSync(new URL("../src/data/catalog/model-lines-auto.json", import.meta.url), "utf8"));
// Reviewed additions may not yet be materialized in the source-generated auto file.
const additions = JSON.parse(readFileSync(new URL("../src/data/catalog/model-line-additions.json", import.meta.url), "utf8"));
const lineKeys = new Set(lines.map(l => `${l.makeSlug}/${l.slug}`));
for (const line of additions) if (!lineKeys.has(`${line.makeSlug}/${line.slug}`)) {
  lines.push(line);
  lineKeys.add(`${line.makeSlug}/${line.slug}`);
}

const index = {};
for (const l of lines) {
  (index[l.makeSlug] ??= []).push({
    slug: l.slug,
    name: l.name,
    from: l.from,
    // null end means "still made" only when the source says so; otherwise the end is unknown
    to: l.to,
    current: l.productionStatus === "current",
    bodyTypes: l.bodyTypes ?? [],
    generations: (l.generations ?? []).map((g) => ({ code: g.code, from: g.from, to: g.to })),
  });
}
// Lines known only from a model card: years, status and body types come from its generations.
const known = new Set(lines.map((l) => `${l.makeSlug}/${l.slug}`));
let fromCards = 0;
for (const dir of ["../src/data/catalog/model-cards/", "../src/data/model-cards/"].map((d) => new URL(d, import.meta.url))) {
  for (const f of existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".json")) : []) {
    for (const card of JSON.parse(readFileSync(new URL(f, dir), "utf8"))) {
      const key = `${card.makeSlug}/${card.lineSlug}`;
      if (known.has(key)) continue;
      known.add(key);
      const gens = card.generations ?? [];
      const current = gens.some((g) => g.productionStatus === "current");
      const froms = gens.map((g) => g.from).filter(Number.isFinite);
      const tos = gens.map((g) => g.to).filter(Number.isFinite);
      (index[card.makeSlug] ??= []).push({
        slug: card.lineSlug,
        name: card.name,
        from: froms.length ? Math.min(...froms) : null,
        to: current || !tos.length ? null : Math.max(...tos),
        current,
        bodyTypes: [...new Set(gens.flatMap((g) => g.bodyTypes ?? []))],
        generations: gens.map((g) => ({ code: g.code ?? null, from: g.from ?? null, to: g.to ?? null })),
      });
      fromCards++;
    }
  }
}
for (const list of Object.values(index)) list.sort((a, b) => a.name.localeCompare(b.name, "cs", { numeric: true }));

writeFileSync(new URL("../src/data/model-lines-index.json", import.meta.url), `${JSON.stringify(index)}\n`);
console.log(`${lines.length} + ${fromCards} card-only model lines for ${Object.keys(index).length} makes`);
