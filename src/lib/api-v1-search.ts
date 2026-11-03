import "server-only";
import { and, asc, desc, eq, gt, inArray, lt, or, sql, type SQL } from "drizzle-orm";
import { getDb } from "@/db";
import { listing, user } from "@/db/schema";
import { EQUIPMENT } from "./equipment";
import { CITIES, RADII, nearestDistance, parseCityList, withinAny } from "./geo";
import { ApiError, cursorScope, decodeCursor, encodeCursor, pageSize } from "./api-v1-http";
import { listingDto } from "./api-v1-dto";
import { toListing } from "./user-listings";
import { BODY_LABEL, FUEL_LABEL } from "./catalog";
import { makesIn, modelLinesOf } from "./makes";
import type { PageDto, ListingDto } from "./api-v1-contract";

// Filters stay in PostgreSQL; only limit+1 rows enter Worker memory. The currently empty
// static dealer feed is not a SQL data source. Import future feeds into this table before enabling them.
const text = (field: string) => sql<string>`${listing.data}->>${field}`;
const number = (field: string) => sql<number>`(${listing.data}->>${field})::numeric`;
const split = (value: string | null) => (value ?? "").split(",").filter(Boolean);
const numericKeys = ["cenaOd", "cenaDo", "rokOd", "rokDo", "najezdOd", "najezdDo", "vykonOd", "vykonDo", "okruh"];
export function validateListingQuery(p: URLSearchParams) {
  const filters = new URLSearchParams(p);
  filters.delete("cursor");
  if (filters.toString().length > 3000 || [...filters.values()].some((value) => value.length > 1000) || (p.get("q")?.length ?? 0) > 120)
    throw new ApiError(400, "invalid_query", "Příliš dlouhý dotaz.");
  for (const key of numericKeys) {
    const raw = p.get(key);
    if (raw !== null && (!raw.trim() || !Number.isFinite(Number(raw)) || Number(raw) < 0)) throw new ApiError(400, "invalid_query", `Neplatná hodnota ${key}.`);
  }
  const sort = p.get("razeni") ?? "nejnovejsi";
  if (!["nejnovejsi", "vyhodne", "nejlevnejsi", "nejdrazsi", "najezd", "rok", "nejblize"].includes(sort))
    throw new ApiError(400, "invalid_query", "Neplatné řazení.");
  if (p.has("prodejce") && !["soukromy", "autobazar"].includes(p.get("prodejce")!)) throw new ApiError(400, "invalid_query", "Neplatný prodejce.");
  const slugs = split(p.get("mesto")).filter((s) => s !== "cr");
  if (slugs.length > 10 || slugs.some((slug) => !CITIES.some((city) => city.slug === slug))) throw new ApiError(400, "invalid_query", "Neplatné město.");
  if (p.has("okruh") && !(RADII as readonly number[]).includes(Number(p.get("okruh")))) throw new ApiError(400, "invalid_query", "Neplatný okruh.");
  if (split(p.get("vybava")).length > 40) throw new ApiError(400, "invalid_query", "Příliš mnoho položek výbavy.");
  return sort;
}
export async function searchListings(p: URLSearchParams): Promise<PageDto<ListingDto>> {
  const sort = validateListingQuery(p);
  const limit = pageSize(p);
  const scope = cursorScope(p);
  const cursor = decodeCursor(p.get("cursor"), scope);
  const conditions: SQL[] = [eq(listing.status, "published"), eq(user.banned, false)];
  for (const [param, field] of [["znacka", "brand"], ["generace", "generation"], ["palivo", "fuel"], ["barva", "color"]]) {
    if (p.get(param)) conditions.push(eq(text(field), p.get(param)!));
  }
  if (p.get("model")) {
    const model = p.get("model")!;
    const selectedMake = p.get("znacka");
    const matches = (selectedMake ? [selectedMake] : makesIn("auto").map((m) => m.slug)).flatMap((make) =>
      modelLinesOf(make).filter((line) => line.slug === model).map((line) => and(eq(text("brand"), make), eq(text("model"), line.name))!));
    conditions.push(or(eq(text("model"), model), ...matches)!);
  }
  if (p.get("prevodovka")) conditions.push(eq(sql`case when ${text("transmission")} = 'automat' then 'automat' else 'manuál' end`, p.get("prevodovka")!));
  if (p.get("karoserie")) {
    const body = sql`case when ${text("body")} in ('kombi','sedan','suv','mpv') then ${text("body")} when ${text("body")} in ('kupe','kabriolet') then 'sedan' when ${text("body")} = 'pickup' then 'suv' when ${text("body")} = 'dodavka' then 'mpv' else 'hatchback' end`;
    conditions.push(eq(body, p.get("karoserie")!));
  }
  const regions = split(p.get("kraj"));
  if (regions.length) conditions.push(inArray(text("region"), regions));
  for (const [param, field, min] of [
    ["cenaOd", "price", true], ["cenaDo", "price", false], ["rokOd", "year", true], ["rokDo", "year", false],
    ["najezdOd", "mileageKm", true], ["najezdDo", "mileageKm", false], ["vykonOd", "powerKw", true], ["vykonDo", "powerKw", false],
  ] as const) {
    const value = Number(p.get(param) ?? 0);
    if (value) conditions.push(min ? sql`${number(field)} >= ${value}` : sql`${number(field)} <= ${value}`);
  }
  for (const label of split(p.get("vybava"))) {
    const key = EQUIPMENT.find((e) => e.label === label)?.key;
    conditions.push(key ? sql`coalesce(${listing.data}->'features', '[]'::jsonb) @> ${JSON.stringify([key])}::jsonb` : sql`false`);
  }
  if (p.get("sVin") === "1") conditions.push(sql`coalesce(${text("vin")}, '') <> ''`);
  // toListing currently has no STK history, battery tests, or market comparables for user rows.
  if (p.get("prodejce") === "autobazar" || ["sStk", "sBaterii", "dobraCena"].some((k) => p.get(k) === "1")) conditions.push(sql`false`);
  const centers = parseCityList(p.get("mesto"));
  const radius = Number(p.get("okruh") ?? 0);
  if (centers.length) {
    const cities = CITIES.filter((city) => withinAny(city.slug, centers, radius)).map((city) => city.slug);
    conditions.push(cities.length ? inArray(text("city"), cities) : sql`false`);
  }
  // Case-insensitive substring AND search. Unlike the web MiniSearch index, this does not
  // guess typos. Explicit capability advertises the difference; no unbounded in-memory index.
  const tokens = (p.get("q") ?? "").trim().toLocaleLowerCase("cs").split(/\s+/).filter(Boolean);
  if (tokens.length > 12) throw new ApiError(400, "invalid_query", "Příliš mnoho slov.");
  if (tokens.length) {
    const makeCases = makesIn("auto").map((m) => sql`when ${m.slug} then ${m.name}`);
    const makeName = sql`case ${text("brand")} ${sql.join(makeCases, sql` `)} else ${text("brand")} end`;
    // Model names for the selected make only keep this expression small on broad searches.
    const selected = p.get("znacka");
    const selectedLines = selected ? modelLinesOf(selected).map((l) => sql`when ${l.slug} then ${l.name}`) : [];
    const modelName = selectedLines.length ? sql`case ${text("model")} ${sql.join(selectedLines, sql` `)} else ${text("model")} end` : text("model");
    const labels = (field: string, values: Record<string, string>) => sql`case ${text(field)} ${sql.join(Object.entries(values).map(([key, value]) => sql`when ${key} then ${value}`), sql` `)} else ${text(field)} end`;
    const equipment = sql`concat_ws(' ', ${sql.join(EQUIPMENT.map((e) => sql`case when coalesce(${listing.data}->'features', '[]'::jsonb) @> ${JSON.stringify([e.key])}::jsonb then ${e.label} else '' end`), sql`, `)})`;
    const cityName = sql`case ${text("city")} ${sql.join(CITIES.map((city) => sql`when ${city.slug} then ${city.name}`), sql` `)} else '' end`;
    const haystack = sql`lower(concat_ws(' ', ${makeName}, ${modelName}, ${text("generation")}, ${text("engine")}, ${labels("fuel", FUEL_LABEL)}, ${labels("body", BODY_LABEL)}, ${text("transmission")}, ${text("region")}, ${cityName}, ${text("color")}, ${equipment}))`;
    for (const token of tokens) conditions.push(sql`position(${token} in ${haystack}) > 0`);
  }
  let key: SQL = sql`extract(epoch from coalesce(${listing.publishedAt}, ${listing.updatedAt}))::double precision`;
  let descending = true;
  if (sort === "nejlevnejsi" || sort === "nejdrazsi") { key = number("price"); descending = sort === "nejdrazsi"; }
  if (sort === "najezd") { key = number("mileageKm"); descending = false; }
  if (sort === "rok") key = number("year");
  if (sort === "vyhodne") { key = sql`1::numeric`; descending = false; }
  const nearby = sort === "nejblize" && centers.length > 0;
  if (nearby) {
    key = sql`case ${text("city")} ${sql.join(CITIES.map((city) => sql`when ${city.slug} then ${nearestDistance(city.slug, centers)}::double precision`), sql` `)} else 1000000000::double precision end`;
    descending = false;
  }
  if (cursor) {
    let value: number, price = 0;
    try {
      const parsed = JSON.parse(String(cursor.key));
      if (!Array.isArray(parsed) || parsed.length !== 2 || !parsed.every((n) => typeof n === "number" && Number.isFinite(n))) throw new Error();
      [value, price] = parsed;
    } catch { throw new ApiError(400, "invalid_cursor", "Neplatný kurzor stránkování."); }
    const tie = nearby ? or(gt(number("price"), price), and(eq(number("price"), price), gt(listing.id, cursor.id))) : gt(listing.id, cursor.id);
    conditions.push(or(descending ? lt(key, value) : gt(key, value), and(eq(key, value), tie))!);
  }
  const rows = await getDb().select({ row: listing, name: user.name, sortValue: sql<string | number>`${key}` })
    .from(listing).innerJoin(user, eq(user.id, listing.userId)).where(and(...conditions))
    .orderBy(descending ? desc(key) : asc(key), ...(nearby ? [asc(number("price"))] : []), asc(listing.id)).limit(limit + 1);
  const page = rows.slice(0, limit);
  const last = page.at(-1);
  return { items: page.map(({ row, name }) => listingDto(toListing(row, name))), nextCursor: rows.length > limit && last
    ? encodeCursor({ key: JSON.stringify([Number(last.sortValue), last.row.data.price]), id: last.row.id, scope }) : null };
}
