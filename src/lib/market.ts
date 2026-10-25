import { listings } from "./listings";
import type { Listing } from "./types";

export type PriceVerdict = "pod trhem" | "odpovídá trhu" | "nad trhem";

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Compares a listing with others of the same model within two model years,
 * adjusting for mileage. Returns null when there are too few comparables.
 */
export function marketEstimate(listing: Listing): { median: number; comparables: number; verdict: PriceVerdict } | null {
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
  const verdict: PriceVerdict = ratio < 0.93 ? "pod trhem" : ratio > 1.07 ? "nad trhem" : "odpovídá trhu";
  return { median: Math.round(m / 1000) * 1000, comparables: comparables.length, verdict };
}
