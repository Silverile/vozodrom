import "server-only";

import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { favorite, savedSearch } from "@/db/schema";
import type { SavedSearch } from "./storage";

// Server side of the browser stores that follow a signed-in user: the shortlist ("Oblíbené")
// and saved searches ("Hlídací pes"). The browser sends whole lists; the server replaces or merges.

const MAX_FAVORITES = 200;
const MAX_SEARCHES = 50;

export function parseFavorites(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length > MAX_FAVORITES) return null;
  if (!value.every((x) => typeof x === "string" && x.length > 0 && x.length <= 64)) return null;
  return [...new Set(value as string[])];
}

export function parseSearches(value: unknown): SavedSearch[] | null {
  if (!Array.isArray(value) || value.length > MAX_SEARCHES) return null;
  const ok = value.every(
    (s) =>
      s && typeof s === "object" &&
      typeof s.query === "string" && s.query.length <= 1000 &&
      typeof s.label === "string" && s.label.length <= 200 &&
      typeof s.savedAt === "string" && !Number.isNaN(Date.parse(s.savedAt)),
  );
  if (!ok) return null;
  const byQuery = new Map((value as SavedSearch[]).map((s) => [s.query, { query: s.query, label: s.label, savedAt: s.savedAt }]));
  return [...byQuery.values()];
}

export async function readFavorites(userId: string): Promise<string[]> {
  const rows = await getDb().select({ id: favorite.listingId }).from(favorite).where(eq(favorite.userId, userId)).orderBy(favorite.createdAt);
  return rows.map((r) => r.id);
}

export async function writeFavorites(userId: string, ids: string[]): Promise<void> {
  await getDb().transaction(async (tx) => {
    await tx.delete(favorite).where(eq(favorite.userId, userId));
    // Spread the timestamps so the stored order matches the browser's order.
    const now = Date.now();
    if (ids.length) await tx.insert(favorite).values(ids.map((listingId, i) => ({ userId, listingId, createdAt: new Date(now + i) })));
  });
}

export async function readSearches(userId: string): Promise<SavedSearch[]> {
  const rows = await getDb().select().from(savedSearch).where(eq(savedSearch.userId, userId)).orderBy(savedSearch.savedAt);
  return rows.map((r) => ({ query: r.query, label: r.label, savedAt: r.savedAt.toISOString() }));
}

export async function writeSearches(userId: string, searches: SavedSearch[]): Promise<void> {
  await getDb().transaction(async (tx) => {
    // Keep when the watchdog last reported each search, so re-saving the list does not repeat old results.
    const previous = await tx.select({ query: savedSearch.query, notifiedAt: savedSearch.notifiedAt }).from(savedSearch).where(eq(savedSearch.userId, userId));
    const notified = new Map(previous.map((p) => [p.query, p.notifiedAt]));
    await tx.delete(savedSearch).where(eq(savedSearch.userId, userId));
    if (searches.length) {
      await tx.insert(savedSearch).values(
        searches.map((s) => ({ userId, query: s.query, label: s.label, savedAt: new Date(s.savedAt), notifiedAt: notified.get(s.query) ?? null })),
      );
    }
  });
}
