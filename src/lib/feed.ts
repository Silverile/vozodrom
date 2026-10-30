import { FUEL_LABEL, REGIONS, generationMatch, getModel } from "./catalog";
import { equipmentLabel } from "./equipment";
import { getCity, regionCapital } from "./geo";
import type { Fuel, Listing, Transmission } from "./types";

// Dealer feed import: dealers send their own stock as JSON (format on /pro-prodejce).
// Import is idempotent: the newest record per externalId wins, "sold" removes the car,
// and invalid records are rejected with a reason instead of being shown. Nothing in a
// feed is trusted: every field is type-checked before use and validation never throws.

export interface FeedVehicle {
  externalId: string;
  status: "active" | "sold";
  updatedAt: string;
  brand: string;
  model: string;
  year: number;
  mileageKm: number;
  price: number;
  engine: string;
  fuel: string;
  transmission: string;
  powerKw: number;
  color: string;
  region: string;
  /** optional town slug (lib/geo); defaults to the regional capital */
  city?: string;
  features: string[];
  description: string;
}

export interface Feed {
  feed: string;
  seller: string;
  generatedAt: string;
  vehicles: unknown[];
}

export interface ImportReport {
  feed: string;
  seller: string;
  received: number;
  imported: Listing[];
  removed: string[];
  duplicatesMerged: number;
  rejected: { externalId: string; reasons: string[] }[];
}

const CURRENT_YEAR = 2026;
const ID_PATTERN = /^[A-Za-z0-9._-]{1,64}$/;
/** ISO date (2026-10-25) or ISO date-time with zone (2026-10-25T08:30:00Z / +02:00). */
const TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:\d{2}))?$/;

const isString = (v: unknown): v is string => typeof v === "string";
const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export function parseTimestamp(value: unknown): number | null {
  if (!isString(value) || !TIMESTAMP_PATTERN.test(value)) return null;
  const ms = Date.parse(value.length === 10 ? `${value}T00:00:00Z` : value);
  return Number.isNaN(ms) ? null : ms;
}

/** Checks the fields a listing needs; the form uses the same rules as the feed. */
export function validateVehicle(v: Record<string, unknown>): string[] {
  const reasons: string[] = [];
  const model = isString(v.brand) && isString(v.model) ? getModel(v.brand, v.model) : undefined;
  if (!model) reasons.push("neznámá značka nebo model");
  if (!isNumber(v.year) || !Number.isInteger(v.year) || v.year < 1950 || v.year > CURRENT_YEAR + 1) {
    reasons.push("neplatný rok výroby");
  } else if (model && !generationMatch(model, v.year)) {
    reasons.push(`rok ${v.year} nespadá do žádné generace v katalogu`);
  }
  if (!isNumber(v.mileageKm) || v.mileageKm < 0 || v.mileageKm > 1_500_000) reasons.push("neplatný nájezd");
  if (!isNumber(v.price) || v.price < 1000) reasons.push("neplatná cena (Kč, při platbě najednou)");
  if (!isString(v.engine) || !v.engine.trim()) reasons.push("chybí motor");
  if (!isNumber(v.powerKw) || v.powerKw <= 0 || v.powerKw > 1500) reasons.push("neplatný výkon (kW)");
  if (!isString(v.fuel) || !(v.fuel in FUEL_LABEL)) reasons.push("neznámé palivo");
  if (v.transmission !== "manuál" && v.transmission !== "automat") reasons.push("převodovka musí být manuál nebo automat");
  if (!isString(v.region) || !REGIONS.includes(v.region)) reasons.push("neznámý kraj");
  if (v.city !== undefined && !(isString(v.city) && getCity(v.city)?.region === v.region)) reasons.push("město nepatří do uvedeného kraje");
  if (v.color !== undefined && !isString(v.color)) reasons.push("barva musí být text");
  if (v.description !== undefined && !isString(v.description)) reasons.push("popis musí být text");
  if (v.features !== undefined && !(Array.isArray(v.features) && v.features.every(isString))) reasons.push("výbava musí být seznam textů");
  return reasons;
}

export function importFeed(feed: Feed): ImportReport {
  const report: ImportReport = {
    feed: feed.feed,
    seller: feed.seller,
    received: Array.isArray(feed.vehicles) ? feed.vehicles.length : 0,
    imported: [],
    removed: [],
    duplicatesMerged: 0,
    rejected: [],
  };
  if (!isString(feed.feed) || !ID_PATTERN.test(feed.feed) || !isString(feed.seller) || !Array.isArray(feed.vehicles)) {
    report.rejected.push({ externalId: "(celý feed)", reasons: ["neplatná hlavička feedu (feed, seller, vehicles)"] });
    return report;
  }

  // Envelope checks per record: identity, status and timestamp decide which record wins.
  const latest = new Map<string, { record: Record<string, unknown>; at: number; id: string }>();
  for (const raw of feed.vehicles) {
    const record = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
    const id = isString(record.externalId) ? record.externalId.trim() : "";
    const reasons: string[] = [];
    if (!ID_PATTERN.test(id)) reasons.push("externalId smí obsahovat jen písmena, číslice, tečku, pomlčku a podtržítko");
    if (record.status !== "active" && record.status !== "sold") reasons.push("status musí být active nebo sold");
    const at = parseTimestamp(record.updatedAt);
    if (at === null) reasons.push("updatedAt musí být datum ISO 8601");
    if (reasons.length) {
      report.rejected.push({ externalId: id || "(bez ID)", reasons });
      continue;
    }
    // IDs are case-insensitive, so "A-1" and "a-1" are the same car.
    const key = id.toLowerCase();
    const prev = latest.get(key);
    if (prev) report.duplicatesMerged++;
    if (!prev || at! >= prev.at) latest.set(key, { record, at: at!, id });
  }

  for (const [key, { record, id }] of latest) {
    if (record.status === "sold") {
      report.removed.push(id);
      continue;
    }
    const reasons = validateVehicle(record);
    if (reasons.length) {
      report.rejected.push({ externalId: id, reasons });
      continue;
    }
    const v = record as unknown as FeedVehicle;
    const model = getModel(v.brand, v.model)!;
    report.imported.push({
      id: `fd-${feed.feed.toLowerCase()}-${key}`,
      source: { kind: "feed", feed: feed.feed, externalId: id, updatedAt: v.updatedAt },
      brandSlug: v.brand,
      modelSlug: v.model,
      generation: generationMatch(model, v.year)!.code,
      year: v.year,
      mileageKm: v.mileageKm,
      price: v.price,
      engine: v.engine.trim(),
      fuel: v.fuel as Fuel,
      transmission: v.transmission as Transmission,
      powerKw: v.powerKw,
      body: model.body,
      color: v.color ?? "neuvedeno",
      region: v.region,
      city: v.city ?? regionCapital(v.region)!.slug,
      sellerType: "autobazar",
      sellerName: feed.seller,
      // Dealer feeds carry no VIN in this prototype; the vehicle check shows that honestly.
      vin: "neuvedeno",
      stkHistory: [],
      postedAt: v.updatedAt.slice(0, 10),
      // the dictionary's label when the feed's wording is known, so the equipment filter finds it
      features: [...new Set((v.features ?? []).map(equipmentLabel))],
      description: v.description ?? "",
    });
  }
  return report;
}
