import { FUEL_LABEL, REGIONS, generationFor, getModel } from "./catalog";
import type { Fuel, Listing, Transmission } from "./types";

// Dealer feed import: dealers send their own stock as JSON (format on /pro-prodejce).
// Import is idempotent: the newest record per externalId wins, "sold" removes the car,
// and invalid records are rejected with a reason instead of being shown.

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
  features: string[];
  description: string;
}

export interface Feed {
  feed: string;
  seller: string;
  generatedAt: string;
  vehicles: FeedVehicle[];
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

export function validateVehicle(v: Partial<FeedVehicle>): string[] {
  const reasons: string[] = [];
  if (!v.externalId) reasons.push("chybí externalId");
  if (!v.brand || !v.model || !getModel(v.brand, v.model)) reasons.push("neznámá značka nebo model");
  if (!Number.isInteger(v.year) || v.year! < 1950 || v.year! > CURRENT_YEAR + 1) reasons.push("neplatný rok výroby");
  if (typeof v.mileageKm !== "number" || v.mileageKm < 0 || v.mileageKm > 1_500_000) reasons.push("neplatný nájezd");
  if (typeof v.price !== "number" || v.price < 1000) reasons.push("neplatná cena (Kč, při platbě najednou)");
  if (!v.engine?.trim()) reasons.push("chybí motor");
  if (typeof v.powerKw !== "number" || v.powerKw <= 0 || v.powerKw > 1500) reasons.push("neplatný výkon (kW)");
  if (!v.fuel || !(v.fuel in FUEL_LABEL)) reasons.push("neznámé palivo");
  if (v.transmission !== "manuál" && v.transmission !== "automat") reasons.push("převodovka musí být manuál nebo automat");
  if (!v.region || !REGIONS.includes(v.region)) reasons.push("neznámý kraj");
  return reasons;
}

export function importFeed(feed: Feed): ImportReport {
  // Newest update per vehicle wins, so re-sending the same feed changes nothing.
  const latest = new Map<string, FeedVehicle>();
  for (const v of feed.vehicles) {
    const prev = latest.get(v.externalId);
    if (!prev || v.updatedAt >= prev.updatedAt) latest.set(v.externalId, v);
  }
  const report: ImportReport = {
    feed: feed.feed,
    seller: feed.seller,
    received: feed.vehicles.length,
    imported: [],
    removed: [],
    duplicatesMerged: feed.vehicles.length - latest.size,
    rejected: [],
  };
  for (const v of latest.values()) {
    if (v.status === "sold") {
      report.removed.push(v.externalId);
      continue;
    }
    const reasons = validateVehicle(v);
    if (reasons.length) {
      report.rejected.push({ externalId: v.externalId, reasons });
      continue;
    }
    const model = getModel(v.brand, v.model)!;
    report.imported.push({
      id: `fd-${feed.feed}-${v.externalId}`.toLowerCase(),
      source: { kind: "feed", feed: feed.feed, externalId: v.externalId, updatedAt: v.updatedAt },
      brandSlug: v.brand,
      modelSlug: v.model,
      generation: generationFor(model, v.year).code,
      year: v.year,
      mileageKm: v.mileageKm,
      price: v.price,
      engine: v.engine,
      fuel: v.fuel as Fuel,
      transmission: v.transmission as Transmission,
      powerKw: v.powerKw,
      body: model.body,
      color: v.color,
      region: v.region,
      sellerType: "autobazar",
      sellerName: feed.seller,
      // Dealer feeds carry no VIN in this prototype; the vehicle check shows that honestly.
      vin: "neuvedeno",
      stkHistory: [],
      postedAt: v.updatedAt,
      features: v.features,
      description: v.description,
    });
  }
  return report;
}
