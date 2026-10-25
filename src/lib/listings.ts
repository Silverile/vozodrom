import deltaFeed from "@/data/feeds/testovaci-autobazar-delta.json";
import { REGIONS, generationFor, models } from "./catalog";
import { type Feed, type ImportReport, importFeed } from "./feed";
import { citiesIn } from "./geo";
import type { Listing, StkRecord, Transmission } from "./types";

// Deterministic generator for fictional test listings: the same build always
// produces the same data. No real vehicles, VINs or sellers.

const LISTINGS_PER_MODEL = 7;
const CURRENT_YEAR = 2026;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Each listing gets its own seeded generator, so the data never depends on
// evaluation order and is identical on the server and in the browser.
let rand = mulberry32(1);
const pick = <T,>(items: readonly T[]): T => items[Math.floor(rand() * items.length)];
const between = (min: number, max: number) => min + rand() * (max - min);

function shuffled<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const COLORS = ["bílá", "černá", "stříbrná", "šedá", "modrá", "červená", "zelená metalíza"];
const FEATURES = [
  "Klimatizace",
  "Navigace",
  "Tempomat",
  "Vyhřívaná sedadla",
  "Parkovací kamera",
  "LED světlomety",
  "Tažné zařízení",
  "Apple CarPlay / Android Auto",
  "Bezklíčové odemykání",
  "Servisní knížka",
];
const BAZAARS = ["Testovací autobazar Alfa", "Testovací autobazar Beta", "Testovací autocentrum Gama"];

function fakeVin(index: number): string {
  // Clearly synthetic: real VINs never contain the letters I, O or Q, and never start with TESTVZD.
  return `TESTVZD${String(index).padStart(10, "0")}`;
}

function stkHistory(year: number, mileageKm: number, firstStkYear: number): StkRecord[] {
  const records: StkRecord[] = [];
  const ageYears = CURRENT_YEAR - year;
  for (let y = firstStkYear; y <= CURRENT_YEAR - 1; y += 2) {
    const share = (y - year) / Math.max(ageYears, 1);
    const roll = rand();
    records.push({
      date: `${y}-${String(1 + Math.floor(rand() * 12)).padStart(2, "0")}-${String(1 + Math.floor(rand() * 27)).padStart(2, "0")}`,
      odometerKm: Math.round((mileageKm * share) / 100) * 100,
      result: roll < 0.85 ? "způsobilé" : roll < 0.97 ? "částečně způsobilé" : "nezpůsobilé",
    });
  }
  // About one in ten test cars gets a suspicious drop between inspections, so the
  // warning state of the UI has something to show.
  if (records.length >= 2 && rand() < 0.1) {
    const last = records[records.length - 1];
    last.odometerKm = Math.round((records[records.length - 2].odometerKm * 0.7) / 100) * 100;
  }
  return records.reverse();
}

/** Town inside the region, from a separate generator so adding towns did not reshuffle the other test data. */
function cityFor(region: string, index: number): string {
  const towns = citiesIn(region);
  // Regional capitals get about half of the listings, like real markets.
  const r = mulberry32(index * 104729 + 17)();
  return (r < 0.5 ? towns[0] : towns[Math.floor(r * towns.length)]).slug;
}

function buildListings(): Listing[] {
  const out: Listing[] = [];
  let index = 1;
  for (const model of models) {
    const firstYear = model.generations[0].from;
    for (let i = 0; i < LISTINGS_PER_MODEL; i++) {
      rand = mulberry32(20261025 + index * 7919);
      const year = Math.round(between(Math.max(firstYear, 2012), CURRENT_YEAR));
      const age = CURRENT_YEAR - year;
      const annualKm = model.mileageByAge[1].km / 3;
      const mileageKm = Math.max(500, Math.round((annualKm * Math.max(age, 0.3) * between(0.6, 1.4)) / 1000) * 1000);
      const engine = pick(model.engines);
      const depreciation = Math.pow(0.86, age) * (1 - Math.min(mileageKm / 400000, 0.35));
      const price = Math.round((model.newPrice * depreciation * between(0.88, 1.12)) / 1000) * 1000;
      const transmission: Transmission =
        engine.fuel === "elektro" || engine.fuel === "hybrid" ? "automat" : rand() < 0.4 ? "automat" : "manuál";
      const sellerType = rand() < 0.55 ? "autobazar" : "soukromý";
      const featureCount = 3 + Math.floor(rand() * 5);
      const features = shuffled(FEATURES).slice(0, featureCount);
      const posted = new Date(Date.UTC(CURRENT_YEAR, 9, 25) - Math.floor(rand() * 40) * 86400000);
      const tested = engine.fuel === "elektro" && rand() < 0.6;
      out.push({
        id: `vz-${String(index).padStart(4, "0")}`,
        source: { kind: "test" },
        brandSlug: model.brandSlug,
        modelSlug: model.slug,
        generation: generationFor(model, year).code,
        year,
        mileageKm,
        price,
        engine: engine.code,
        fuel: engine.fuel,
        transmission,
        powerKw: engine.powerKw,
        body: model.body,
        color: pick(COLORS),
        region: pick(REGIONS),
        city: "",
        sellerType,
        sellerName: sellerType === "autobazar" ? pick(BAZAARS) : "Soukromý prodejce",
        vin: fakeVin(index),
        stkHistory: age >= 4 ? stkHistory(year, mileageKm, year + 4) : [],
        postedAt: posted.toISOString().slice(0, 10),
        features,
        description: `Testovací inzerát. ${model.name} ${engine.code}, ${features.slice(0, 2).join(", ").toLowerCase()}. Vůz je smyšlený a slouží jen k ukázce prototypu.`,
        battery:
          engine.fuel === "elektro"
            ? {
                capacityKwh: Number(engine.code.match(/(\d+) kWh/)?.[1] ?? 75),
                sohPercent: tested ? Math.round(between(86, 98)) : null,
                testedAt: tested ? `${CURRENT_YEAR}-0${1 + Math.floor(rand() * 9)}-15` : null,
                testMethod: tested ? "diagnostika v autorizovaném servisu" : null,
                warrantyUntil: `${year + 8}-12-31`,
              }
            : undefined,
      });
      out[out.length - 1].city = cityFor(out[out.length - 1].region, index);
      index++;
    }
  }
  return out.sort((a, b) => b.postedAt.localeCompare(a.postedAt));
}

export const feedReports: ImportReport[] = [importFeed(deltaFeed as Feed)];

export const listings: Listing[] = [...feedReports.flatMap((r) => r.imported), ...buildListings()].sort((a, b) =>
  b.postedAt.localeCompare(a.postedAt),
);

export function getListing(id: string): Listing | undefined {
  return listings.find((l) => l.id === id);
}

export function listingsOf(brandSlug: string, modelSlug: string): Listing[] {
  return listings.filter((l) => l.brandSlug === brandSlug && l.modelSlug === modelSlug);
}
