import "server-only";

import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { listing, user } from "@/db/schema";
import { FUEL_LABEL, generationMatch, getModel } from "./catalog";
import { equipmentLabels } from "./equipment";
import { regionCapital } from "./geo";
import { pictogramBody } from "./listing-catalog";
import { lineOf } from "./listing-draft";
import type { ListingRow } from "./listing-store";
import type { Fuel, Listing } from "./types";

// Published user listings in the same Listing shape as test and feed listings, so search,
// cards and the shortlist treat them alike. Contact details are not part of this shape.

/** Only the first name is shown publicly. */
const publicName = (name: string) => name.trim().split(/\s+/)[0] || "Soukromý prodejce";

export function toListing(row: ListingRow, sellerName: string): Listing {
  const d = row.data;
  // modelSlug is the line slug, which is also the demo catalogue's model slug (used for price estimates).
  const line = lineOf(d);
  const model = getModel(d.brand, line?.slug ?? d.model);
  return {
    id: row.id,
    source: { kind: "user" },
    brandSlug: d.brand,
    modelSlug: line?.slug ?? d.model,
    generation: d.generation || (model && generationMatch(model, d.year)?.code) || "generace neuvedena",
    year: d.year,
    mileageKm: d.mileageKm,
    price: d.price,
    engine: d.engine,
    fuel: (d.fuel in FUEL_LABEL ? d.fuel : "benzin") as Fuel,
    transmission: d.transmission === "automat" ? "automat" : "manuál",
    powerKw: d.powerKw,
    body: pictogramBody(d.body),
    color: d.color || "neuvedena",
    region: d.region,
    city: d.city || regionCapital(d.region)?.slug || "",
    sellerType: "soukromý",
    sellerName: publicName(sellerName),
    vin: d.vin || "neuvedeno",
    // STK records will come from the VIN lookup once it exists; until then none are shown.
    stkHistory: [],
    postedAt: (row.publishedAt ?? row.updatedAt).toISOString().slice(0, 10),
    features: equipmentLabels(d.features),
    description: d.description,
    photos: row.photos,
  };
}

export async function publishedUserListings(): Promise<Listing[]> {
  const rows = await getDb()
    .select({ row: listing, name: user.name })
    .from(listing)
    .innerJoin(user, eq(user.id, listing.userId))
    .where(and(eq(listing.status, "published"), eq(user.banned, false)))
    .orderBy(desc(listing.publishedAt));
  return rows.map(({ row, name }) => toListing(row, name));
}

/** Everything the listing page needs; the page decides who may see a listing that is not published. */
export async function userListingPage(id: string): Promise<{ listing: Listing; row: ListingRow; banned: boolean } | null> {
  const [found] = await getDb()
    .select({ row: listing, name: user.name, banned: user.banned })
    .from(listing)
    .innerJoin(user, eq(user.id, listing.userId))
    .where(eq(listing.id, id))
    .limit(1);
  if (!found) return null;
  return { listing: toListing(found.row, found.name), row: found.row, banned: found.banned };
}
