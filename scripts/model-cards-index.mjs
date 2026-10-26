// Builds src/data/model-cards-index.json: the model cards (generations, trims, photos) for the
// model pages, keyed by make and line. Source: src/data/catalog/model-cards/*.json (curated in
// analysis/codex/). Review metadata is dropped; sources and photo credits are kept.
//
// Run after the model cards change: node scripts/model-cards-index.mjs

import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const dir = new URL("../src/data/catalog/model-cards/", import.meta.url);
const index = {};
let count = 0;

for (const name of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
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
          ? { url: g.photo.url, page: g.photo.filePageUrl, credit: g.photo.credit, licence: g.photo.licence, licenceUrl: g.photo.licenceUrl ?? null }
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
