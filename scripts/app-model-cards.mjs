// Writes src/data/model-cards-app.json: the model cards index without the evidence fields the site
// never shows (sources, scopes, field sources). The full index stays the catalogue's own record for
// its checks; the site bundles this copy, because the Worker has a 64 MiB uncompressed size limit
// and the cards are bundled more than once. Runs before dev, build and typecheck (package.json).
import { readFileSync, writeFileSync } from "node:fs";

const DROP = new Set(["sources", "sourceScope", "fieldSources", "generationEvidence", "specificationScope", "engineCoverage"]);
const SOURCE = new URL("../src/data/model-cards-index.json", import.meta.url);
const TARGET = new URL("../src/data/model-cards-app.json", import.meta.url);

const strip = (value) =>
  Array.isArray(value)
    ? value.map(strip)
    : value && typeof value === "object"
      ? Object.fromEntries(Object.entries(value).filter(([key]) => !DROP.has(key)).map(([key, v]) => [key, strip(v)]))
      : value;

writeFileSync(TARGET, JSON.stringify(strip(JSON.parse(readFileSync(SOURCE, "utf8")))));
