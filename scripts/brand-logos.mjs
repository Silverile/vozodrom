// Builds src/data/brand-logos.json: monochrome brand marks for vehicle makes, taken from
// Simple Icons (CC0-1.0, https://simpleicons.org). Only the marks we need are copied, so the
// site does not ship the whole icon set. Logos are trademarks of their owners and are used
// only to identify the make of a listed vehicle.
//
// The map is curated by hand: Simple Icons titles are matched exactly, and look-alike entries
// that belong to other companies (Proton Mail, Lucid software, Alpine Linux…) are left out.
// Makes without a mark here fall back to a typographic badge in the UI.
//
// Run: node scripts/brand-logos.mjs

import { writeFileSync } from "node:fs";
import * as icons from "simple-icons";

/** make slug (as in src/data/catalog/makes.json) → Simple Icons title */
const MAP = {
  // cars
  "acura": "Acura",
  "aston-martin": "Aston Martin",
  "audi": "Audi",
  "bentley": "Bentley",
  "bmw": "BMW",
  "bugatti-automobiles": "Bugatti",
  "cadillac": "Cadillac",
  "chevrolet": "Chevrolet",
  "chrysler": "Chrysler",
  "citroen": "Citroën",
  "dacia": "Dacia",
  "ds-automobiles": "DS Automobiles",
  "ferrari": "Ferrari",
  "fiat": "Fiat",
  "ford": "Ford",
  "honda": "Honda",
  "hyundai": "Hyundai",
  "infiniti": "INFINITI",
  "jeep": "Jeep",
  "kia": "Kia",
  "koenigsegg": "Koenigsegg",
  "lada": "LADA",
  "lamborghini": "Lamborghini",
  "mahindra": "Mahindra",
  "maserati": "Maserati",
  "mazda": "Mazda",
  "mclaren": "McLaren",
  "mg": "MG",
  "mini": "Mini",
  "mitsubishi": "Mitsubishi",
  "nissan": "Nissan",
  "opel": "Opel",
  "peugeot": "Peugeot",
  "polestar": "Polestar",
  "porsche": "Porsche",
  "ram": "Ram",
  "renault": "Renault",
  "rolls-royce": "Rolls-Royce",
  "seat": "SEAT",
  "smart": "smart",
  "subaru": "Subaru",
  "suzuki": "Suzuki",
  "tata-motors": "Tata",
  "tesla": "Tesla",
  "toyota": "Toyota",
  "volkswagen": "Volkswagen",
  "volvo": "Volvo",
  // utility vehicles and machinery
  "caterpillar": "Caterpillar",
  "daf": "DAF",
  "hitachi-construction-machinery": "Hitachi",
  "iveco": "IVECO",
  "john-deere": "John Deere",
  "man-truck-bus": "MAN",
  "scania": "Scania",
  // motorcycles and scooters
  "ducati": "Ducati",
  "ktm": "KTM",
  "piaggio": "Piaggio Group",
  "vespa": "Vespa",
  "yamaha": "Yamaha Motor Corporation",
};

const byTitle = new Map(Object.values(icons).filter((i) => i && i.title).map((i) => [i.title, i]));
const out = {};
const missing = [];
for (const [slug, title] of Object.entries(MAP)) {
  if (!title) continue;
  const icon = byTitle.get(title);
  if (!icon) {
    missing.push(`${slug} (${title})`);
    continue;
  }
  out[slug] = { title: icon.title, path: icon.path };
}
writeFileSync(new URL("../src/data/brand-logos.json", import.meta.url), `${JSON.stringify(out, null, 1)}\n`);
console.log(`${Object.keys(out).length} logos written${missing.length ? `; not found: ${missing.join(", ")}` : ""}`);
