// Builds src/data/model-lines-index.json, a small per-make list of curated car model lines
// (slug, name, years, body types, generation count) for the browser. Source:
// src/data/catalog/model-lines-auto.json (curated in analysis/codex/, see its review report).
//
// Run after the model lines change: node scripts/model-lines-index.mjs

import { readFileSync, writeFileSync } from "node:fs";

const lines = JSON.parse(readFileSync(new URL("../src/data/catalog/model-lines-auto.json", import.meta.url), "utf8"));

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
for (const list of Object.values(index)) list.sort((a, b) => a.name.localeCompare(b.name, "cs"));

writeFileSync(new URL("../src/data/model-lines-index.json", import.meta.url), `${JSON.stringify(index)}\n`);
console.log(`${lines.length} model lines for ${Object.keys(index).length} makes`);
