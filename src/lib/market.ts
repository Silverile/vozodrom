import { listings } from "./listings";
import type { Listing } from "./types";

export type PriceVerdict = "výborná cena" | "dobrá cena" | "odpovídá trhu" | "nad trhem" | "vysoko nad trhem";

export interface MarketEstimate {
  median: number;
  comparables: number;
  /** listing price divided by the estimated market price */
  ratio: number;
  /** 1–5, 5 = cheapest relative to the market */
  score: number;
  verdict: PriceVerdict;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

const BANDS: [number, number, PriceVerdict][] = [
  [0.88, 5, "výborná cena"],
  [0.95, 4, "dobrá cena"],
  [1.05, 3, "odpovídá trhu"],
  [1.12, 2, "nad trhem"],
  [Infinity, 1, "vysoko nad trhem"],
];

/**
 * Compares a listing with others of the same model within two model years,
 * adjusting for mileage. Returns null when there are too few comparables.
 */
export function marketEstimate(listing: Listing): MarketEstimate | null {
  const comparables = listings.filter(
    (l) =>
      l.id !== listing.id &&
      l.brandSlug === listing.brandSlug &&
      l.modelSlug === listing.modelSlug &&
      Math.abs(l.year - listing.year) <= 2,
  );
  if (comparables.length < 2) return null;
  const adjusted = comparables.map((l) => {
    // Same depreciation curve as the test data: ~14 % per year, mileage up to 35 %.
    const yearFactor = Math.pow(0.86, l.year - listing.year);
    const kmFactor = 1 - (listing.mileageKm - l.mileageKm) / 400000;
    return l.price * yearFactor * kmFactor;
  });
  const m = median(adjusted);
  const ratio = listing.price / m;
  const [, score, verdict] = BANDS.find(([limit]) => ratio < limit)!;
  return { median: Math.round(m / 1000) * 1000, comparables: comparables.length, ratio, score, verdict };
}

/**
 * A coarser price for the automatic listing review: same model within five model years, same
 * adjustments, at least two comparables. Used when marketEstimate has too few close matches.
 */
export function roughMarketPrice(listing: Listing): number | null {
  const comparables = listings.filter(
    (l) => l.id !== listing.id && l.brandSlug === listing.brandSlug && l.modelSlug === listing.modelSlug && Math.abs(l.year - listing.year) <= 5,
  );
  if (comparables.length < 2) return null;
  return median(comparables.map((l) => l.price * Math.pow(0.86, l.year - listing.year) * (1 - (listing.mileageKm - l.mileageKm) / 400000)));
}
