// Builds src/data/brand-facts.json: facts about every make for its brand page, from Wikidata (CC0).
// Founded/dissolved years, founders, founding place, headquarters, parent company or owner (current
// claims only), official website, employees, short description and Wikipedia links.
// Values that fail review are listed in OVERRIDES (null = hide); see the review notes there.
//
// Run when the makes change: node scripts/brand-facts.mjs   (network; ~1 minute)
// Reviewed passenger-car/motorcycle bounds: src/data/catalog/brand-production-periods.json.
// Reapply only these: node scripts/brand-facts.mjs --periods-only (offline).
// Validate provenance and generated parity: node scripts/brand-facts.mjs --check-periods.

import { readFileSync, writeFileSync } from "node:fs";

const makes = JSON.parse(readFileSync(new URL("../src/data/makes-index.json", import.meta.url), "utf8"));
const UA = { "User-Agent": "vozodrom-prototype/0.1 (https://vozodrom.cz; brand facts)" };

// Hand review of Wikidata values that describe a later legal entity, not the brand.
const OVERRIDES = JSON.parse(readFileSync(new URL("./brand-facts-overrides.json", import.meta.url), "utf8"));

// Curated production bounds are independent of corporate incorporation/dissolution.
// A missing endpoint is unknown, not an assertion that production continues.
const periods = JSON.parse(readFileSync(new URL("../src/data/catalog/brand-production-periods.json", import.meta.url), "utf8"));
const periodFields = ["carsFrom", "carsTo", "motorcyclesFrom", "motorcyclesTo", "periodSources", "periodNoteCs", "periodVerifiedAt"];
for (const [slug, p] of Object.entries(periods)) {
  if (!makes.some((m) => m.slug === slug)) throw new Error(`Unknown production-period make: ${slug}`);
  if (Object.keys(p).some((key) => !periodFields.includes(key))) throw new Error(`Unknown production-period field: ${slug}`);
  for (const key of periodFields.slice(0, 4)) {
    if (key in p && (!Number.isInteger(p[key]) || p[key] < 1800 || p[key] > new Date().getUTCFullYear())) throw new Error(`Invalid ${slug}.${key}`);
  }
  for (const kind of ["cars", "motorcycles"]) {
    if (p[`${kind}From`] > p[`${kind}To`]) throw new Error(`Reversed ${slug}.${kind} period`);
  }
  if (!periodFields.slice(0, 4).some((key) => key in p) || !p.periodSources?.length || !p.periodSources.every((url) => /^https:\/\//.test(url)) || !/^\d{4}-\d{2}-\d{2}$/.test(p.periodVerifiedAt)) throw new Error(`Missing production provenance: ${slug}`);
}
function withPeriods(facts) {
  for (const [slug, factsForMake] of Object.entries(facts)) {
    for (const key of periodFields) delete factsForMake[key];
    Object.assign(factsForMake, periods[slug] ?? {});
  }
  for (const slug of Object.keys(periods)) if (!facts[slug]) throw new Error(`Missing brand facts: ${slug}`);
  return facts;
}
const output = new URL("../src/data/brand-facts.json", import.meta.url);
// Reapply reviewed periods without refreshing unrelated Wikidata facts.
// --check-periods validates the same contract without writing any files.
if (process.argv.includes("--periods-only") || process.argv.includes("--check-periods")) {
  const original = readFileSync(output, "utf8");
  const expected = `${JSON.stringify(withPeriods(JSON.parse(original)), null, 1)}\n`;
  if (process.argv.includes("--check-periods")) {
    if (original !== expected) throw new Error("Brand production periods are stale; run --periods-only");
  } else writeFileSync(output, expected);
  const scope = makes.filter((m) => m.defunct && m.sections.includes("auto"));
  const complete = scope.filter((m) => periods[m.slug]?.carsFrom != null && periods[m.slug]?.carsTo != null).length;
  const partial = scope.filter((m) => periods[m.slug] && !(periods[m.slug].carsFrom != null && periods[m.slug].carsTo != null)).length;
  console.log(`Defunct auto production periods: ${complete} complete, ${partial} partial, ${scope.length - complete - partial} unknown / ${scope.length}; ${Object.keys(periods).length} makes with reviewed bounds overall`);
  process.exit(0);
}

async function api(params) {
  const url = `https://www.wikidata.org/w/api.php?${new URLSearchParams({ ...params, format: "json" })}`;
  for (let i = 0; i < 6; i++) {
    const res = await fetch(url, { headers: UA });
    if (res.ok) return res.json();
    await new Promise((r) => setTimeout(r, 5000 * (i + 1)));
  }
  throw new Error(`Wikidata failed: ${url}`);
}

const entities = {};
const ids = makes.map((m) => m.qid).filter(Boolean);
for (let i = 0; i < ids.length; i += 50) {
  const d = await api({ action: "wbgetentities", ids: ids.slice(i, i + 50).join("|"), props: "claims|descriptions|sitelinks", languages: "cs|en" });
  Object.assign(entities, d.entities);
}

const current = (claims = []) =>
  claims.filter((c) => c.rank !== "deprecated" && !c.qualifiers?.P582 && c.mainsnak.datavalue);
const preferred = (claims) => {
  const list = current(claims);
  const pref = list.filter((c) => c.rank === "preferred");
  return pref.length ? pref : list;
};
const year = (c) => {
  const t = c?.mainsnak.datavalue.value.time;
  return t ? Number(t.slice(1, 5)) * (t[0] === "-" ? -1 : 1) : null;
};
const item = (c) => c.mainsnak.datavalue.value.id;

// Labels of every referenced item (people, places, companies), Czech first.
const refs = new Set();
const P = { founder: "P112", foundedIn: "P740", hq: "P159", parent: "P749" };
for (const e of Object.values(entities)) for (const p of Object.values(P)) for (const c of current(e.claims?.[p])) refs.add(item(c));
const labels = {};
const refIds = [...refs];
for (let i = 0; i < refIds.length; i += 50) {
  const d = await api({ action: "wbgetentities", ids: refIds.slice(i, i + 50).join("|"), props: "labels", languages: "cs|en" });
  for (const [id, e] of Object.entries(d.entities)) labels[id] = e.labels?.cs?.value ?? e.labels?.en?.value ?? null;
}
const names = (claims, max = 4) => [...new Set(preferred(claims).map((c) => labels[item(c)]).filter(Boolean))].slice(0, max);

const facts = {};
for (const m of makes) {
  const e = entities[m.qid];
  if (!e?.claims) continue;
  const c = e.claims;
  const emp = preferred(c.P1128).sort((a, b) => (a.qualifiers?.P585?.[0]?.datavalue?.value.time ?? "").localeCompare(b.qualifiers?.P585?.[0]?.datavalue?.value.time ?? "")).pop();
  const empYear = emp?.qualifiers?.P585?.[0]?.datavalue?.value.time;
  facts[m.slug] = {
    founded: year(preferred(c.P571)[0]),
    dissolved: year(preferred(c.P576)[0]),
    founders: names(c.P112),
    foundedIn: names(c.P740, 1)[0] ?? null,
    hq: names(c.P159, 1)[0] ?? null,
    parent: names(c.P749, 1)[0] ?? null,
    website: preferred(c.P856)[0]?.mainsnak.datavalue.value ?? null,
    employees: emp ? { value: Math.round(Number(emp.mainsnak.datavalue.value.amount)), year: empYear ? Number(empYear.slice(1, 5)) : null } : null,
    description: e.descriptions?.cs?.value ?? null,
    wikiCs: e.sitelinks?.cswiki?.title ?? null,
    wikiEn: e.sitelinks?.enwiki?.title ?? null,
    ...(OVERRIDES[m.slug] ?? {}),
  };
}

writeFileSync(output, `${JSON.stringify(withPeriods(facts), null, 1)}\n`);
const n = (k) => Object.values(facts).filter((f) => f[k] != null && !(Array.isArray(f[k]) && !f[k].length)).length;
console.log(`${Object.keys(facts).length} makes; founded ${n("founded")}, founders ${n("founders")}, hq ${n("hq")}, parent ${n("parent")}, website ${n("website")}, employees ${n("employees")}, cs description ${n("description")}`);
