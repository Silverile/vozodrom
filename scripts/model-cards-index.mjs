// Builds src/data/model-cards-index.json: the model cards (generations, trims, photos) for the
// model pages, keyed by make and line. Sources: src/data/catalog/model-cards/*.json (Codex, curated in
// analysis/codex/) and src/data/model-cards/*.json (researched by Claude's agents, same shape).
// Review metadata is dropped; sources and photo credits are kept.
//
// Run after the model cards change: node scripts/model-cards-index.mjs

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";

const sizesFile = new URL("../src/data/photo-sizes.json", import.meta.url);
const sizes = existsSync(sizesFile) ? JSON.parse(readFileSync(sizesFile, "utf8")) : {};
const aspectOf = (size) => (size ? Math.round((size[0] / size[1]) * 100) / 100 : null);
const dirs = ["../src/data/catalog/model-cards/", "../src/data/model-cards/"].map((d) => new URL(d, import.meta.url));
const index = {};
let count = 0;

for (const [dir, name] of dirs.flatMap((dir) => (existsSync(dir) ? readdirSync(dir) : []).filter((f) => f.endsWith(".json")).map((f) => [dir, f]))) {
  for (const card of JSON.parse(readFileSync(new URL(name, dir), "utf8"))) {
    (index[card.makeSlug] ??= {})[card.lineSlug] = {
      name: card.name,
      segment: card.segment ?? null,
      summary: card.summaryCs ?? null,
      generations: (card.generations ?? []).map((g) => ({
        code: g.code ?? null,
        name: g.name ?? null,
        from: g.from ?? null,
        to: g.to ?? null,
        current: g.productionStatus === "current",
        facelifts: (g.facelift ?? []).map((f) => ({ year: f.year, note: f.note ?? null })),
        bodyTypes: g.bodyTypes ?? [],
        engines: g.engines ?? [],
        drivetrains: g.drivetrains ?? [],
        transmissions: g.transmissions ?? [],
        dimensionsMm: g.dimensionsMm ?? null,
        trunkL: g.trunkL ?? null,
        markets: g.markets ?? [],
        trims: g.trims ?? [],
        photo: g.photo
          ? {
              url: g.photo.url.split("?")[0], // drop the utm tracking the Commons API appends
              page: g.photo.filePageUrl,
              credit: g.photo.credit,
              licence: g.photo.licence,
              licenceUrl: g.photo.licenceUrl ?? null,
              aspect: aspectOf(sizes[g.photo.url.split("?")[0]]),
            }
          : null,
        sources: g.sources ?? [],
      })),
      sources: card.sources ?? [],
    };
    count++;
  }
}

writeFileSync(new URL("../src/data/model-cards-index.json", import.meta.url), `${JSON.stringify(index)}\n`);
console.log(`${count} model cards for ${Object.keys(index).length} makes`);
