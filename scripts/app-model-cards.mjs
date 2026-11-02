// Writes the model cards the site reads, one JSON file per model line, to
// public/katalog-data/<make>/<line>.json: the cards index without the evidence fields the site never
// shows (sources, scopes, field sources). The files are static assets, so the Worker does not bundle
// the catalogue (it did, twice, and its cold starts were slow and its size near the 64 MiB limit);
// lib/card-store reads them at build time from disk and in the Worker through ASSETS. The full
// index stays the catalogue's own record for its checks. Runs before dev, build and typecheck.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const DROP = new Set(["sources", "sourceScope", "fieldSources", "generationEvidence", "specificationScope", "engineCoverage"]);
const SOURCE = new URL("../src/data/model-cards-index.json", import.meta.url);
const TARGET = new URL("../public/katalog-data/", import.meta.url);

const strip = (value) =>
  Array.isArray(value)
    ? value.map(strip)
    : value && typeof value === "object"
      ? Object.fromEntries(Object.entries(value).filter(([key]) => !DROP.has(key)).map(([key, v]) => [key, strip(v)]))
      : value;

const index = JSON.parse(readFileSync(SOURCE, "utf8"));
rmSync(TARGET, { recursive: true, force: true });
let count = 0;
for (const [make, lines] of Object.entries(index)) {
  mkdirSync(new URL(`${make}/`, TARGET), { recursive: true });
  for (const [line, card] of Object.entries(lines)) {
    writeFileSync(new URL(`${make}/${line}.json`, TARGET), JSON.stringify(strip(card)));
    count++;
  }
}
console.log(`model cards: ${count} files in public/katalog-data/`);
