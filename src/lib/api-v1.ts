import "server-only";
import { and, count, desc, eq, inArray, isNull, lt, or, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { entryComment, entryLike, garageCar, logEntry, user } from "@/db/schema";
import { googleEnabled, signupOpen, STAFF_ROLES } from "./auth";
import { apiSession, ApiError, cursorScope, decodeCursor, encodeCursor, pageSize } from "./api-v1-http";
import { OPEN_SECTIONS } from "./sections";
import { conversationsOf, unreadTotal } from "./chat";
import { getMake, makesIn, modelLinesOf } from "./makes";
import { listingDto, makeDto, lineDto, photoDto } from "./api-v1-dto";
import { userListingPage } from "./user-listings";
import { carsOf } from "./garage-store";
import { carTitle } from "./garage";
import { loadCard } from "./card-store";
import type { CapabilitiesDto, CatalogDto, ConversationsDto, GarageCarDto, ListingDetailDto, MeDto, PageDto, RoleDto, StoryDto } from "./api-v1-contract";

export async function capabilities(): Promise<CapabilitiesDto> {
  return {
    apiVersion: 1, sections: OPEN_SECTIONS.map((s) => s.key),
    auth: { email: true, google: googleEnabled(), apple: false, signup: signupOpen(), bearer: true, expo: true },
    features: { push: false, catalogPublication: "deploy", listingSearch: "sql-substring" },
  };
}
export async function me(request: Request): Promise<MeDto> {
  const { user } = await apiSession(request);
  const staff = STAFF_ROLES.includes(user.role as RoleDto);
  return { id: user.id, name: user.name, email: user.email, emailVerified: user.emailVerified, role: user.role as RoleDto,
    permissions: { moderate: staff, editArticles: staff, editCatalog: user.role === "admin", manageUsers: user.role === "admin" },
    unread: await unreadTotal(user.id) };
}
export async function listingDetail(id: string): Promise<ListingDetailDto> {
  if (!id || id.length > 100) throw new ApiError(404, "not_found", "Inzerát nenalezen.");
  const found = await userListingPage(id);
  // This first public endpoint never becomes a preview endpoint when credentials are supplied.
  if (!found || found.banned || found.row.status !== "published") throw new ApiError(404, "not_found", "Inzerát nenalezen.");
  return { listing: listingDto(found.listing), contact: { phone: found.row.phone, messengers: [...found.row.messengers] }, sellerId: found.row.userId };
}
export async function garage(request: Request): Promise<{ items: GarageCarDto[] }> {
  const session = await apiSession(request);
  const cars = await carsOf(session.user.id);
  return { items: cars.map((car) => ({ id: car.id, title: carTitle(car.data), brand: car.data.brand, model: car.data.model,
    generation: car.data.generation, nickname: car.data.nickname, year: car.data.year, former: car.former,
    hiddenReason: car.hiddenReason, photos: car.photos.map(photoDto), updatedAt: car.updatedAt.toISOString() })) };
}
export async function conversations(request: Request): Promise<ConversationsDto> {
  const session = await apiSession(request);
  const items = await conversationsOf(session.user.id);
  return { items: items.map((c) => ({ id: c.id, kind: c.kind, title: c.title, counterpart: c.counterpart, listingId: c.listingId,
    lastMessageAt: c.lastMessageAt, preview: c.preview, unread: c.unread })), unread: items.reduce((sum, c) => sum + c.unread, 0) };
}
export async function catalogMakes() { return { items: makesIn("auto").map(makeDto) }; }
function catalogMake(slug: string) {
  const make = getMake(slug);
  if (!make || !make.sections.includes("auto")) throw new ApiError(404, "not_found", "Značka nenalezena.");
  return make;
}
export async function catalogLines(make: string) {
  catalogMake(make);
  return { items: modelLinesOf(make).map(lineDto) };
}
export async function catalogLine(make: string, line: string): Promise<CatalogDto> {
  const brand = catalogMake(make);
  const model = modelLinesOf(make).find((item) => item.slug === line);
  if (!model) throw new ApiError(404, "not_found", "Model nenalezen.");
  const card = await loadCard(make, line);
  return { make: makeDto(brand), line: lineDto(model), cardUrl: card ? `/katalog-data/${make}/${line}.json` : null, webUrl: `/katalog/${make}/${line}/` };
}
export async function stories(p: URLSearchParams): Promise<PageDto<StoryDto>> {
  const limit = pageSize(p);
  const scope = cursorScope(p);
  const cursor = decodeCursor(p.get("cursor"), scope);
  // Use epoch text with microsecond precision; JS Date would lose rows created within one ms.
  const key = sql<string>`extract(epoch from ${logEntry.createdAt})::text`;
  const conditions = [isNull(logEntry.hiddenReason), isNull(garageCar.hiddenReason), eq(user.banned, false), eq(garageCar.userId, user.id)];
  for (const [param, column] of [["znacka", garageCar.makeSlug], ["model", garageCar.lineSlug], ["tema", logEntry.category]] as const) {
    const value = p.get(param);
    if (value) {
      if (!/^[a-z0-9-]{1,80}$/.test(value)) throw new ApiError(400, "invalid_query", `Neplatná hodnota ${param}.`);
      conditions.push(eq(column, value));
    }
  }
  if (cursor) {
    if (typeof cursor.key !== "string" || !/^\d{1,12}(\.\d{1,6})?$/.test(cursor.key)) throw new ApiError(400, "invalid_cursor", "Neplatný kurzor stránkování.");
    conditions.push(or(sql`extract(epoch from ${logEntry.createdAt}) < ${cursor.key}::numeric`, and(sql`extract(epoch from ${logEntry.createdAt}) = ${cursor.key}::numeric`, lt(logEntry.id, cursor.id)))!);
  }
  const db = getDb();
  const rows = await db.select({ entry: logEntry, car: garageCar, key }).from(logEntry)
    .innerJoin(garageCar, eq(garageCar.id, logEntry.carId)).innerJoin(user, eq(user.id, logEntry.userId))
    .where(and(...conditions)).orderBy(desc(logEntry.createdAt), desc(logEntry.id)).limit(limit + 1);
  const page = rows.slice(0, limit);
  const ids = page.map(({ entry }) => entry.id);
  const [likes, comments] = ids.length ? await Promise.all([
    db.select({ id: entryLike.entryId, n: count() }).from(entryLike).where(inArray(entryLike.entryId, ids)).groupBy(entryLike.entryId),
    db.select({ id: entryComment.entryId, n: count() }).from(entryComment).where(and(inArray(entryComment.entryId, ids), isNull(entryComment.hiddenReason))).groupBy(entryComment.entryId),
  ]) : [[], []];
  const last = page.at(-1);
  return { items: page.map(({ entry, car }) => {
    const photo = entry.photos[0] ?? car.photos[0];
    return { id: entry.id, carId: car.id, title: entry.title, category: entry.category, costCzk: entry.costCzk,
      mileageKm: entry.mileageKm, happenedOn: entry.happenedOn, photo: photo ? photoDto(photo) : null,
      carTitle: carTitle(car.data), makeSlug: car.makeSlug, lineSlug: car.lineSlug,
      likes: likes.find((row) => row.id === entry.id)?.n ?? 0, comments: comments.find((row) => row.id === entry.id)?.n ?? 0,
      createdAt: entry.createdAt.toISOString() };
  }), nextCursor: rows.length > limit && last ? encodeCursor({ key: last.key, id: last.entry.id, scope }) : null };
}
