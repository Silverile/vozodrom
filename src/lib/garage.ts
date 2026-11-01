import type { ListingPhoto } from "@/db/schema";
import { BODY_KEYS } from "./listing-catalog";
import { type ModelLine, getMake, makesIn, modelLinesOf } from "./makes";

// A car in an owner's garage and its logbook entries. The same checks run in the browser and on
// the server. Make, model line and generation come from the catalogue like in the listing form;
// VIN and plate are optional and private unless the owner shows the plate.

export interface CarData {
  brand: string;
  /** model line slug, or the typed name of a model the catalogue does not have */
  model: string;
  /** generation id (listing-draft generationId), "" when unknown */
  generation: string;
  /** what the owner calls the car: "Zelenka", "2.0 turbo" */
  nickname: string;
  /** year of manufacture, 0 when not given */
  year: number;
  /** year the owner bought it, 0 when not given */
  purchaseYear: number;
  color: string;
  /** BODY_KEYS key or "" */
  body: string;
  engine: string;
  /** listing fuel key or "" */
  fuel: string;
  powerKw: number;
  /** "manuál" | "automat" | "" */
  transmission: string;
  /** DRIVE key (fwd, rwd, awd) or "" */
  drive: string;
  /** private: shown only to the owner */
  vin: string;
  plate: string;
  plateVisible: boolean;
  /** the owner's story of the car: how they got it, impressions */
  story: string;
}

export const EMPTY_CAR: CarData = {
  brand: "", model: "", generation: "", nickname: "", year: 0, purchaseYear: 0, color: "", body: "", engine: "", fuel: "",
  powerKw: 0, transmission: "", drive: "", vin: "", plate: "", plateVisible: false, story: "",
};

export const MAX_STORY = 25_000;
export const MAX_ENTRY_BODY = 25_000;
export const MAX_COMMENT = 2_000;
export const MAX_GARAGE_PHOTOS = 20;
export const MAX_ENTRY_PHOTOS = 20;

export const CAR_DRIVES: Record<string, string> = { fwd: "přední", rwd: "zadní", awd: "4×4" };

/** Logbook entry topics, in the order the form offers them. */
export const ENTRY_CATEGORIES: Record<string, string> = {
  servis: "Servis a údržba",
  oprava: "Oprava",
  upravy: "Úpravy a tuning",
  pneu: "Kola a pneumatiky",
  pece: "Péče a kosmetika",
  stk: "STK a emise",
  cesta: "Cesty a výlety",
  nakup: "Koupě a prodej",
  jine: "Jiné",
};

const CURRENT_YEAR = new Date().getFullYear();

export function isCarData(v: unknown): v is CarData {
  if (!v || typeof v !== "object") return false;
  const record = v as Record<string, unknown>;
  return Object.entries(EMPTY_CAR).every(([k, x]) => typeof record[k] === typeof x);
}

/** Keeps exactly the CarData fields, with text trimmed and capped, so nothing extra is stored. */
export function cleanCarData(v: CarData): CarData {
  const text = (s: string, max: number) => s.trim().slice(0, max);
  return {
    brand: text(v.brand, 64), model: text(v.model, 80), generation: text(v.generation, 80), nickname: text(v.nickname, 60),
    year: v.year, purchaseYear: v.purchaseYear, color: text(v.color, 40), body: v.body in BODY_KEYS ? v.body : "",
    engine: text(v.engine, 80), fuel: text(v.fuel, 20), powerKw: v.powerKw, transmission: v.transmission === "manuál" || v.transmission === "automat" ? v.transmission : "",
    drive: v.drive in CAR_DRIVES ? v.drive : "", vin: text(v.vin, 17).toUpperCase(), plate: text(v.plate, 12).toUpperCase(),
    plateVisible: v.plateVisible === true, story: text(v.story, MAX_STORY),
  };
}

const whole = (n: number, min: number, max: number) => Number.isInteger(n) && n >= min && n <= max;

/** Problems by field; only make and model are required, the rest is checked when given. */
export function carProblems(car: CarData): Partial<Record<keyof CarData, string>> {
  const problems: Partial<Record<keyof CarData, string>> = {};
  if (!makesIn("auto").some((m) => m.slug === car.brand)) problems.brand = "vyberte značku";
  if (!car.model.trim()) problems.model = "vyberte model";
  if (car.year && !whole(car.year, 1900, CURRENT_YEAR + 1)) problems.year = "neplatný rok výroby";
  if (car.purchaseYear && !whole(car.purchaseYear, 1900, CURRENT_YEAR)) problems.purchaseYear = "neplatný rok koupě";
  else if (car.purchaseYear && car.year && car.purchaseYear < car.year) problems.purchaseYear = "koupeno před výrobou?";
  if (car.powerKw && !whole(car.powerKw, 1, 1500)) problems.powerKw = "neplatný výkon";
  if (car.vin && !/^[A-HJ-NPR-Z0-9]{17}$/.test(car.vin)) problems.vin = "VIN má 17 znaků a neobsahuje písmena I, O, Q";
  return problems;
}

/** The car's model line: by slug, or by name for a typed model. */
export function carLine(car: Pick<CarData, "brand" | "model">): ModelLine | undefined {
  const lines = modelLinesOf(car.brand);
  return lines.find((l) => l.slug === car.model) ?? lines.find((l) => l.name === car.model);
}

/** "Škoda Octavia" */
export function carName(car: Pick<CarData, "brand" | "model">): string {
  return `${getMake(car.brand)?.name ?? car.brand} ${carLine(car)?.name ?? car.model}`;
}

/** "Škoda Octavia „Zelenka“" */
export function carTitle(car: Pick<CarData, "brand" | "model" | "nickname">): string {
  return car.nickname ? `${carName(car)} „${car.nickname}“` : carName(car);
}

export interface EntryInput {
  title: string;
  body: string;
  category: string;
  costCzk: number | null;
  mileageKm: number | null;
  /** YYYY-MM-DD */
  happenedOn: string;
}

export const today = () => new Date().toISOString().slice(0, 10);

/** Trimmed and capped fields of a logbook entry, or the problem with them. */
export function cleanEntry(v: unknown): EntryInput | string {
  const b = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  const text = (x: unknown, max: number) => (typeof x === "string" ? x.trim().slice(0, max) : "");
  const amount = (x: unknown, max: number) => (x === null || x === "" || x === undefined ? null : Number.isInteger(x) && (x as number) >= 0 && (x as number) <= max ? (x as number) : NaN);
  const entry = {
    title: text(b.title, 120),
    body: text(b.body, MAX_ENTRY_BODY),
    category: text(b.category, 20),
    costCzk: amount(b.costCzk, 100_000_000),
    mileageKm: amount(b.mileageKm, 3_000_000),
    happenedOn: text(b.happenedOn, 10),
  };
  if (entry.title.length < 3) return "Napište nadpis zápisu.";
  if (!(entry.category in ENTRY_CATEGORIES)) return "Vyberte téma zápisu.";
  if (Number.isNaN(entry.costCzk)) return "Neplatná cena.";
  if (Number.isNaN(entry.mileageKm)) return "Neplatný nájezd.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.happenedOn) || entry.happenedOn > today() || entry.happenedOn < "1900-01-01") return "Neplatné datum.";
  return entry;
}

/** Short paragraphs of plain text, for owner stories and entries (no markup is stored). */
export const paragraphs = (text: string) => text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

/** A logbook entry in feeds: the feed page and the "Deníky majitelů" block of catalogue pages. */
export interface FeedItem {
  id: string;
  carId: string;
  title: string;
  category: string;
  costCzk: number | null;
  mileageKm: number | null;
  happenedOn: string;
  photo: ListingPhoto | null;
  carTitle: string;
  makeSlug: string;
  lineSlug: string;
  likes: number;
  comments: number;
  createdAt: string;
}
