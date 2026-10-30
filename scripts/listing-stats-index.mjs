// Builds src/data/listing-stats.json: a small slice of the real register and STK statistics
// (src/data/stats/<make>.json) for the pages of user listings. Those pages render per request in the
// Worker, which cannot read the full files from disk, so only what a buyer needs for one car is kept:
// how many are registered, STK failure rate by age, usual mileage by age, top defects and rollbacks.
//
// Run after the statistics change: node scripts/listing-stats-index.mjs

import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const dir = new URL("../src/data/stats/", import.meta.url);
const round = (x, digits = 4) => Math.round(x * 10 ** digits) / 10 ** digits;

function slim(entry) {
  if (!entry || (!entry.fleet && !entry.stk)) return undefined;
  const { fleet, stk } = entry;
  return {
    n: fleet?.n ?? null,
    failRate: stk ? round(stk.failRate) : null,
    // [age, fail rate]
    byAge: stk?.byAge.map(([age, , rate]) => [age, round(rate)]) ?? [],
    // [age, p25, median, p75] km
    km: stk?.km ?? [],
    defects: stk?.defects.slice(0, 5).map((d) => [d.label ?? d.code, round(d.share, 3)]) ?? [],
    rollback: stk?.rollback ? round(stk.rollback.share) : null,
  };
}

const index = {};
let meta = null;
for (const name of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const file = JSON.parse(readFileSync(new URL(name, dir), "utf8"));
  meta ??= { stkFrom: file.meta.stk.from, stkTo: file.meta.stk.to };
  const make = {};
  for (const [line, entry] of Object.entries(file)) {
    if (line === "meta" || line === "_") continue;
    const base = slim(entry);
    if (!base) continue;
    const gens = Object.fromEntries(Object.entries(entry.gens ?? {}).map(([i, g]) => [i, slim(g)]).filter(([, g]) => g));
    make[line] = Object.keys(gens).length ? { ...base, gens } : base;
  }
  if (Object.keys(make).length) index[name.replace(/\.json$/, "")] = make;
}

writeFileSync(new URL("../src/data/listing-stats.json", import.meta.url), JSON.stringify({ meta, makes: index }));
console.log(`listing-stats.json: ${Object.keys(index).length} makes`);
