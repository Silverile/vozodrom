import type { ImportReport } from "./feed";
import type { Listing } from "./types";

// Car listings that ship with the site: dealer feeds once a dealer is connected (lib/feed.ts).
// None yet; the listings people add themselves come from the database (lib/user-listings.ts).

/** Small seeded random generator, for code that needs repeatable sequences. */
export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const feedReports: ImportReport[] = [];

export const listings: Listing[] = [];

export function getListing(id: string): Listing | undefined {
  return listings.find((l) => l.id === id);
}

export function listingsOf(brandSlug: string, modelSlug: string): Listing[] {
  return listings.filter((l) => l.brandSlug === brandSlug && l.modelSlug === modelSlug);
}
