import "server-only";

import { and, eq, gt } from "drizzle-orm";
import { getDb } from "@/db";
import { listing, savedSearch, user } from "@/db/schema";
import { notify } from "./chat";
import type { Listing } from "./types";
import { toListing } from "./user-listings";

// Hlídací pes: once a day (cron in worker/index.ts) every saved search is checked against user
// listings published since the previous run; the user gets one chat message per search with
// new results. The filters mirror the search page's URL parameters (/inzeraty/?…).

const num = (p: URLSearchParams, key: string) => Number(p.get(key) ?? 0) || 0;
const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function matchesSearch(l: Listing, query: string): boolean {
  const p = new URLSearchParams(query);
  const regions = (p.get("kraj") ?? "").split(",").filter(Boolean);
  const checks: [boolean, boolean][] = [
    [p.has("znacka"), l.brandSlug === p.get("znacka")],
    [p.has("model"), l.modelSlug === p.get("model")],
    [p.has("generace"), l.generation === p.get("generace")],
    [p.has("palivo"), l.fuel === p.get("palivo")],
    [p.has("karoserie"), l.body === p.get("karoserie")],
    [p.has("prevodovka"), l.transmission === p.get("prevodovka")],
    [regions.length > 0, regions.includes(l.region)],
    [num(p, "cenaDo") > 0, l.price <= num(p, "cenaDo")],
    [num(p, "cenaOd") > 0, l.price >= num(p, "cenaOd")],
    [num(p, "rokOd") > 0, l.year >= num(p, "rokOd")],
    [num(p, "rokDo") > 0, l.year <= num(p, "rokDo")],
    [num(p, "najezdDo") > 0, l.mileageKm <= num(p, "najezdDo")],
    [num(p, "najezdOd") > 0, l.mileageKm >= num(p, "najezdOd")],
    [num(p, "vykonOd") > 0, l.powerKw >= num(p, "vykonOd")],
    [num(p, "vykonDo") > 0, l.powerKw <= num(p, "vykonDo")],
    [Boolean(p.get("q")?.trim()), fold(`${l.brandSlug} ${l.modelSlug} ${l.engine} ${l.description}`).includes(fold(p.get("q") ?? ""))],
  ];
  return checks.every(([applies, ok]) => !applies || ok);
}

/** Runs the watchdog; returns how many searches got a message. */
export async function runWatchdog(now = new Date()): Promise<number> {
  const db = getDb();
  const searches = await db
    .select({ search: savedSearch })
    .from(savedSearch)
    .innerJoin(user, and(eq(user.id, savedSearch.userId), eq(user.banned, false)));
  if (!searches.length) return 0;
  // Listings published since the oldest point any search still waits for (at most a week back).
  const oldest = new Date(Math.max(now.getTime() - 7 * 86_400_000, Math.min(...searches.map((s) => (s.search.notifiedAt ?? s.search.savedAt).getTime()))));
  const fresh = (
    await db
      .select({ row: listing, name: user.name })
      .from(listing)
      .innerJoin(user, and(eq(user.id, listing.userId), eq(user.banned, false)))
      .where(and(eq(listing.status, "published"), gt(listing.publishedAt, oldest)))
  ).map(({ row, name }) => ({ at: row.publishedAt!, listing: toListing(row, name) }));
  let sent = 0;
  for (const { search } of searches) {
    const since = search.notifiedAt ?? search.savedAt;
    const hits = fresh.filter((f) => f.at > since && matchesSearch(f.listing, search.query));
    if (hits.length) {
      const word = hits.length === 1 ? "nový inzerát" : hits.length < 5 ? "nové inzeráty" : "nových inzerátů";
      await notify(search.userId, `Hlídací pes „${search.label}“: ${hits.length} ${word}.`, `/inzeraty/?${search.query}`);
      sent++;
    }
    await db
      .update(savedSearch)
      .set({ notifiedAt: now })
      .where(and(eq(savedSearch.userId, search.userId), eq(savedSearch.query, search.query)));
  }
  return sent;
}
