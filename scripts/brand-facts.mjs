// Builds src/data/brand-facts.json: facts about every make for its brand page, from Wikidata (CC0).
// Founded/dissolved years, founders, founding place, headquarters, parent company or owner (current
// claims only), official website, employees, short description and Wikipedia links.
// Values that fail review are listed in OVERRIDES (null = hide); see the review notes there.
//
// Run when the makes change: node scripts/brand-facts.mjs   (network; ~1 minute)

import { readFileSync, writeFileSync } from "node:fs";

const makes = JSON.parse(readFileSync(new URL("../src/data/makes-index.json", import.meta.url), "utf8"));
const UA = { "User-Agent": "vozodrom-prototype/0.1 (https://vozodrom.cz; brand facts)" };

// Hand review of Wikidata values that describe a later legal entity, not the brand.
const OVERRIDES = JSON.parse(readFileSync(new URL("./brand-facts-overrides.json", import.meta.url), "utf8"));

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

writeFileSync(new URL("../src/data/brand-facts.json", import.meta.url), `${JSON.stringify(facts, null, 1)}\n`);
const n = (k) => Object.values(facts).filter((f) => f[k] != null && !(Array.isArray(f[k]) && !f[k].length)).length;
console.log(`${Object.keys(facts).length} makes; founded ${n("founded")}, founders ${n("founders")}, hq ${n("hq")}, parent ${n("parent")}, website ${n("website")}, employees ${n("employees")}, cs description ${n("description")}`);
