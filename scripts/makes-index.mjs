// Builds src/data/makes-index.json, the small list of makes the site ships to the browser:
// slug, display name, sections, country, a few aliases for matching free-text make names, and
// whether a logo exists. Source: src/data/catalog/makes.json (Wikidata, CC0), maintained by
// the catalogue pipeline in analysis/codex/.
//
// Run after the catalogue or the logo map changes: node scripts/makes-index.mjs

import { readFileSync, writeFileSync } from "node:fs";

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
const makes = read("../src/data/catalog/makes.json");
const logos = { ...read("../src/data/brand-logos.json"), ...read("../src/data/brand-logo-files.json") };

// Company names in Wikidata carry legal or corporate suffixes; listings show the brand.
const DISPLAY = {
  "yale-materials-handling-corporation": "Yale",
  "alliance-tire-company": "Alliance",
  "tvs-motor-company": "TVS",
  "daimler-company": "Daimler",
  "saic-motor": "SAIC",
  "man-truck-bus": "MAN",
  "hitachi-construction-machinery": "Hitachi",
  "iveco-bus": "Iveco Bus",
  "nokian-tyres": "Nokian",
};
// Hand corrections of catalogue records whose Wikidata match was a namesake or a subsidiary.
// qid null = no matching Wikidata item (facts then come only from brand-facts-overrides.json).
const CORRECTIONS = {
  jcb: { country: "Spojené království", qid: "Q1542317" }, // was the Japanese credit-card company
  blata: { country: "Česko", qid: null, keys: ["blata"] }, // was the Spreewald region in Germany
  same: { defunct: false }, // the tractor brand still exists within SDF
  "hitachi-construction-machinery": { country: "Japonsko" }, // was the Dutch European subsidiary
  "austin-motor-company": { country: "Spojené království" }, // was Morocco
};

const SUFFIX = / (Motor Company|Automobiles|Technology|Motors|Motor|Company|Group|AG|GmbH|Corporation)$/;
const display = (m) => DISPLAY[m.slug] ?? m.name.replace(SUFFIX, "");

const fold = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

const index = makes
  .map((m) => {
    const name = display(m);
    const keys = [...new Set([m.name, name, ...m.aliases].filter((a) => a && a.length <= 30).map(fold))].slice(0, 6);
    return {
      slug: m.slug,
      name,
      sections: m.sections,
      country: m.country,
      defunct: m.status === "defunct",
      logo: Boolean(logos[m.slug]),
      qid: m.qid,
      keys,
      ...CORRECTIONS[m.slug],
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name, "cs"));

writeFileSync(new URL("../src/data/makes-index.json", import.meta.url), `${JSON.stringify(index)}\n`);
const bySection = {};
for (const m of index) for (const s of m.sections) bySection[s] = (bySection[s] ?? 0) + 1;
console.log(`${index.length} makes (${Object.entries(bySection).map(([s, n]) => `${s} ${n}`).join(", ")}), ${index.filter((m) => m.logo).length} with logo`);
