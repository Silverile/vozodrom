import { REGIONS } from "./catalog";
import { getCity } from "./geo";
import { BODY_KEYS, type ListingFuel, coversYear } from "./listing-catalog";
import { type ModelLine, getMake, makesIn, modelLinesOf } from "./makes";

// The car listing a seller fills in on /pridat/. The same checks run in the browser (live hints)
// and on the server (before saving), so a listing that passes one passes the other. Make, model
// line and generation come from the catalogue (lib/makes); a model it does not know can be typed.

export interface Draft {
  brand: string;
  /** model line slug, or the typed name of a model the catalogue does not have */
  model: string;
  /** generation id (see generationId), "" when the line has none or none is chosen yet */
  generation: string;
  year: number;
  mileageKm: number;
  price: number;
  engine: string;
  fuel: string;
  transmission: string;
  powerKw: number;
  /** body type key from BODY_KEYS */
  body: string;
  color: string;
  region: string;
  city: string;
  description: string;
  vin: string;
}

/** A draft being edited in the browser; serverId is set when it edits a saved listing. */
export type LocalDraft = Draft & { serverId: string };

const CURRENT_YEAR = new Date().getFullYear();
const FUELS: ListingFuel[] = ["benzin", "nafta", "hybrid", "elektro", "lpg"];

export const EMPTY_DRAFT: Draft = {
  brand: "", model: "", generation: "", year: 0, mileageKm: 0, price: 0, engine: "", fuel: "", transmission: "",
  powerKw: 0, body: "", color: "", region: "", city: "", description: "", vin: "",
};

export const EMPTY_LOCAL_DRAFT: LocalDraft = { ...EMPTY_DRAFT, serverId: "" };

/** Drafts saved before `generation` existed are still accepted (it reads as not chosen). */
export function isDraft(v: unknown): v is Draft {
  if (!v || typeof v !== "object") return false;
  const record = v as Record<string, unknown>;
  return Object.entries(EMPTY_DRAFT).every(([k, x]) => typeof record[k] === typeof x || (k === "generation" && record[k] === undefined));
}

/** Keeps exactly the Draft fields, with text trimmed and capped, so nothing extra is stored. */
export function cleanDraft(v: Draft): Draft {
  const text = (s: string, max: number) => s.trim().slice(0, max);
  return {
    brand: text(v.brand, 64), model: text(v.model, 80), generation: text(v.generation ?? "", 80), year: v.year,
    mileageKm: v.mileageKm, price: v.price, engine: text(v.engine, 80), fuel: v.fuel, transmission: v.transmission,
    powerKw: v.powerKw, body: v.body, color: text(v.color, 40), region: v.region, city: v.city,
    description: text(v.description, 5000), vin: text(v.vin, 17).toUpperCase(),
  };
}

/** Stable id of a line's generation: its code, or its years when the catalogue has no code. */
export const generationId = (g: { code: string | null; from: number | null; to: number | null }) => g.code ?? `${g.from ?? "?"}–${g.to ?? "?"}`;

/** The draft's model line: by slug, or by name for listings saved before slugs were stored. */
export function lineOf(draft: Pick<Draft, "brand" | "model">): ModelLine | undefined {
  const lines = modelLinesOf(draft.brand);
  return lines.find((l) => l.slug === draft.model) ?? lines.find((l) => l.name === draft.model);
}

/** Generations of the draft's line that include its year (only those with known years count). */
export function generationsForYear(draft: Pick<Draft, "brand" | "model" | "year">) {
  const line = lineOf(draft);
  const dated = (line?.generations ?? []).filter((g) => g.from !== null);
  return { dated, matching: dated.filter((g) => coversYear(g, draft.year)) };
}

export function vinProblem(vin: string): string | null {
  if (!vin) return null;
  if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) return "VIN má 17 znaků a neobsahuje písmena I, O, Q";
  return null;
}

export function draftProblems(draft: Draft): string[] {
  const problems: string[] = [];
  const whole = (n: number, min: number, max: number) => Number.isInteger(n) && n >= min && n <= max;
  if (!makesIn("auto").some((m) => m.slug === draft.brand)) problems.push("vyberte značku");
  if (!draft.model.trim()) problems.push("vyberte model");
  if (!whole(draft.year, 1950, CURRENT_YEAR + 1)) problems.push("vyplňte rok výroby");
  else if (lineOf(draft)) {
    const { dated, matching } = generationsForYear(draft);
    if (dated.length && !matching.length) problems.push(`model se v roce ${draft.year} nevyráběl`);
    else if (draft.generation && matching.length && !matching.some((g) => generationId(g) === draft.generation)) problems.push("generace nesedí s rokem výroby");
    else if (!draft.generation && matching.length > 1) problems.push("vyberte generaci");
  }
  if (!(draft.body in BODY_KEYS)) problems.push("vyberte karoserii");
  if (!draft.engine.trim()) problems.push("vyberte nebo napište motor");
  if (!FUELS.includes(draft.fuel as ListingFuel)) problems.push("vyberte palivo");
  if (!whole(draft.powerKw, 1, 1500)) problems.push("vyplňte výkon (kW)");
  if (draft.transmission !== "manuál" && draft.transmission !== "automat") problems.push("vyberte převodovku");
  if (!whole(draft.mileageKm, 0, 1_500_000)) problems.push("neplatný nájezd");
  if (!whole(draft.price, 1000, 100_000_000)) problems.push("vyplňte cenu (Kč, při platbě najednou)");
  if (!REGIONS.includes(draft.region)) problems.push("vyberte místo");
  else if (draft.city && getCity(draft.city)?.region !== draft.region) problems.push("město nepatří do kraje");
  const vin = vinProblem(draft.vin);
  if (vin) problems.push(vin);
  return problems;
}

/** "Škoda Octavia, 2019" */
export function draftTitle(draft: Draft): string {
  return `${getMake(draft.brand)?.name ?? draft.brand} ${lineOf(draft)?.name ?? draft.model}, ${draft.year}`;
}
