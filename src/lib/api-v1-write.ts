import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getAuth } from "./auth";
import { and, desc, eq, lt, or, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { logEntry } from "@/db/schema";
import { apiSession, ApiError, readBytes, readJson, pageSize, cursorScope, encodeCursor, decodeCursor } from "./api-v1-http";
import { createListing, deleteListing, listingFor, listingsOf, parseDraft, parseMessengers, parsePhone, updateListing, changeStatus, addPhoto, removePhoto, type ListingRow } from "./listing-store";
import { carFor, createCar, deleteCar, updateCar, entryFor, createEntry, updateEntry, deleteEntry, parseCar, parseEntry, photoAction, toggle, addComment, deleteComment, reportContent, type CarRow, type EntryRow } from "./garage-store";
import { markRead, messagesOf, openListingChat, sendMessage, unreadTotal, type ChatMessage } from "./chat";
import { parseNotice, submitNotice } from "./reports";
import { MAX_PHOTO_BYTES } from "./photo-store";
import { photoDto } from "./api-v1-dto";
import { createWsToken } from "./ws-token";
import { stripPhotoMetadata } from "./photo-metadata";
import type { CommunityKindDto, EntryDetailDto, GarageDetailDto, ListingInputDto, OwnerListingDto, RealtimeTokenDto } from "./api-v1-contract";

export const ok = () => ({ ok: true as const });
export function requiredText(value: unknown, name: string, max = 200) {
  if (typeof value !== "string" || !value.trim() || value.length > max) throw new ApiError(400, "invalid_input", `Neplatná hodnota ${name}.`);
  return value;
}
export function kindOf(value: unknown): CommunityKindDto {
  if (value !== "car" && value !== "entry" && value !== "comment") throw new ApiError(400, "invalid_kind", "Neplatný druh obsahu.");
  return value;
}
const managedPhoto = (photo: { key: string; width: number; height: number }) => ({ key: photo.key, ...photoDto(photo) });
function draftDto(data: ListingInputDto): ListingInputDto {
  return { brand: data.brand, model: data.model, generation: data.generation, year: data.year, mileageKm: data.mileageKm,
    price: data.price, engine: data.engine, fuel: data.fuel, transmission: data.transmission, powerKw: data.powerKw,
    body: data.body, color: data.color, region: data.region, city: data.city, description: data.description, vin: data.vin, features: [...(data.features ?? [])] };
}
export function ownerListingDto(row: ListingRow): OwnerListingDto {
  return { id: row.id, data: draftDto(row.data), status: row.status, phone: row.phone, messengers: [...row.messengers],
    photos: row.photos.map(managedPhoto), rejectReason: row.rejectReason, moderationFlags: [...row.moderationFlags],
    createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString(), submittedAt: row.submittedAt?.toISOString() ?? null, publishedAt: row.publishedAt?.toISOString() ?? null };
}
function carDto(row: CarRow): GarageDetailDto {
  const d = row.data;
  return { id: row.id, data: { brand: d.brand, model: d.model, generation: d.generation, nickname: d.nickname, year: d.year,
    purchaseYear: d.purchaseYear, color: d.color, body: d.body, engine: d.engine, fuel: d.fuel, powerKw: d.powerKw,
    transmission: d.transmission, drive: d.drive, vin: d.vin, plate: d.plate, plateVisible: d.plateVisible, story: d.story },
    former: row.former, hiddenReason: row.hiddenReason, photos: row.photos.map(managedPhoto), updatedAt: row.updatedAt.toISOString() };
}
function entryDto(row: EntryRow): EntryDetailDto {
  return { id: row.id, carId: row.carId, title: row.title, body: row.body, category: row.category, costCzk: row.costCzk,
    mileageKm: row.mileageKm, happenedOn: row.happenedOn, hiddenReason: row.hiddenReason, photos: row.photos.map(managedPhoto), updatedAt: row.updatedAt.toISOString() };
}
export async function myListings(request: Request) {
  const session = await apiSession(request);
  return { items: (await listingsOf(session.user.id)).map(ownerListingDto) };
}
export async function newListing(request: Request) {
  const session = await apiSession(request), body = await readJson(request);
  return { id: await createListing(session, parseDraft(body.data)) };
}
export async function patchListing(request: Request, id: string) {
  const session = await apiSession(request);
  await listingFor(session, id);
  const body = await readJson(request);
  await updateListing(session, id, {
    ...(body.data !== undefined && { data: parseDraft(body.data) }),
    ...(body.phone !== undefined && { phone: parsePhone(body.phone) }),
    ...(body.messengers !== undefined && { messengers: parseMessengers(body.messengers) }),
  });
  return ownerListingDto(await listingFor(session, id));
}
export async function removeListing(request: Request, id: string) { await deleteListing(await apiSession(request), id); return ok(); }
export async function listingAction(request: Request, id: string) {
  const session = await apiSession(request), body = await readJson(request);
  const action = requiredText(body.action, "action", 20);
  if (!["submit", "cancel", "withdraw", "approve", "reject", "takedown"].includes(action)) throw new ApiError(400, "invalid_action", "Neplatná akce.");
  await changeStatus(session, id, action === "takedown" ? "reject" : action, typeof body.reason === "string" ? body.reason : undefined, { rule: body.rule });
  return ownerListingDto(await listingFor(session, id, { staff: true }));
}
function parseOrder(order: unknown, keys: string[]) {
  if (!Array.isArray(order) || !order.every((v) => typeof v === "string") || order.length !== keys.length || new Set(order).size !== order.length || !order.every((key) => keys.includes(key)))
    throw new ApiError(400, "invalid_order", "Neplatné pořadí fotek.");
  return order as string[];
}
export async function listingPhotos(request: Request, id: string) {
  const session = await apiSession(request), row = await listingFor(session, id);
  const query = new URL(request.url).searchParams;
  if (request.method === "POST") {
    const bytes = stripPhotoMetadata(await readBytes(request, MAX_PHOTO_BYTES));
    return managedPhoto(await addPhoto(session, id, bytes, Number(query.get("w")), Number(query.get("h"))));
  }
  if (request.method === "DELETE") await removePhoto(session, id, requiredText(query.get("key"), "key", 500));
  else await updateListing(session, id, { order: parseOrder((await readJson(request)).order, row.photos.map((p) => p.key)) });
  return ok();
}
export async function newCar(request: Request) {
  const session = await apiSession(request), body = await readJson(request);
  return { id: await createCar(session, parseCar(body.data)) };
}
export async function garageDetail(request: Request, id: string) {
  const session = await apiSession(request);
  const row = await carFor(session, id, { staff: true });
  if (request.method === "DELETE") { await deleteCar(session, id); return ok(); }
  if (request.method === "PATCH") {
    const body = await readJson(request);
    if (body.former !== undefined && typeof body.former !== "boolean") throw new ApiError(400, "invalid_input", "Neplatná hodnota former.");
    await updateCar(session, id, parseCar(body.data), body.former === undefined ? row.former : body.former);
    return carDto(await carFor(session, id, { staff: true }));
  }
  return carDto(row);
}
export async function newEntry(request: Request, carId: string) {
  const session = await apiSession(request);
  await carFor(session, carId);
  return { id: await createEntry(session, carId, parseEntry(await readJson(request))) };
}
/** Private list also includes hidden entries, so their owner can find and edit them. */
export async function garageEntries(request: Request, carId: string) {
  await carFor(await apiSession(request), carId, { staff: true });
  const params = new URL(request.url).searchParams, limit = pageSize(params), scope = `garage:${carId}:${cursorScope(params)}`;
  const cursor = decodeCursor(params.get("cursor"), scope), conditions = [eq(logEntry.carId, carId)];
  if (cursor) {
    if (typeof cursor.key !== "string" || !/^\d{1,12}(\.\d{1,6})?$/.test(cursor.key)) throw new ApiError(400, "invalid_cursor", "Neplatný kurzor stránkování.");
    conditions.push(or(sql`extract(epoch from ${logEntry.createdAt}) < ${cursor.key}::numeric`, and(sql`extract(epoch from ${logEntry.createdAt}) = ${cursor.key}::numeric`, lt(logEntry.id, cursor.id)))!);
  }
  const rows = await getDb().select({ row: logEntry, key: sql<string>`extract(epoch from ${logEntry.createdAt})::text` }).from(logEntry)
    .where(and(...conditions)).orderBy(desc(logEntry.createdAt), desc(logEntry.id)).limit(limit + 1);
  const page = rows.slice(0, limit), last = page.at(-1);
  return { items: page.map(({ row }) => entryDto(row)), nextCursor: rows.length > limit && last ? encodeCursor({ key: last.key, id: last.row.id, scope }) : null };
}
export async function entryDetail(request: Request, id: string) {
  const session = await apiSession(request), row = await entryFor(session, id, { staff: true });
  if (request.method === "DELETE") { await deleteEntry(session, id); return ok(); }
  if (request.method === "PATCH") { await updateEntry(session, id, parseEntry(await readJson(request))); return entryDto(await entryFor(session, id, { staff: true })); }
  return entryDto(row);
}
export async function garagePhotos(request: Request, id: string, owner: "car" | "entry") {
  const session = await apiSession(request);
  const row = owner === "car" ? await carFor(session, id, { staff: true }) : await entryFor(session, id, { staff: true });
  const query = new URL(request.url).searchParams;
  if (request.method === "POST") {
    const body = stripPhotoMetadata(await readBytes(request, MAX_PHOTO_BYTES));
    const photo = await photoAction(session, owner, id, { add: { body, width: Number(query.get("w")), height: Number(query.get("h")) } });
    return managedPhoto(photo!);
  }
  if (request.method === "DELETE") await photoAction(session, owner, id, { remove: requiredText(query.get("key"), "key", 500) });
  else await photoAction(session, owner, id, { order: parseOrder((await readJson(request)).order, row.photos.map((p) => p.key)) });
  return ok();
}
export async function reaction(request: Request, id: string, what: "car-like" | "entry-like" | "follow") {
  const session = await apiSession(request);
  // Also enforce the parent/author visibility that the public v1 feed uses.
  const { visibleCommunityTarget } = await import("./api-v1-visibility");
  await visibleCommunityTarget(what === "entry-like" ? "entry" : "car", id);
  return { count: await toggle(session, what, id, request.method === "PUT") };
}
export async function newComment(request: Request, id: string) {
  const session = await apiSession(request), body = await readJson(request);
  const { visibleCommunityTarget } = await import("./api-v1-visibility");
  await visibleCommunityTarget("entry", id);
  return { id: await addComment(session, id, requiredText(body.body, "body", 2000)) };
}
export async function removeComment(request: Request, id: string) { await deleteComment(await apiSession(request), id); return ok(); }
export async function communityReport(request: Request) {
  const session = await apiSession(request), body = await readJson(request);
  const kind = kindOf(body.kind), id = requiredText(body.id, "id", 100);
  const { visibleCommunityTarget } = await import("./api-v1-visibility");
  await visibleCommunityTarget(kind, id);
  await reportContent(session, kind, id, requiredText(body.reason, "reason", 1000), body.goodFaith === true);
  return ok();
}
export async function listingReport(request: Request) {
  const existing = await getAuth().api.getSession({ headers: request.headers, query: { disableCookieCache: true } });
  const session = existing ? await apiSession(request) : null;
  const notice = parseNotice(await readJson(request));
  const { userListingPage } = await import("./user-listings");
  const found = await userListingPage(notice.listingId);
  if (!found || found.banned || found.row.status !== "published") throw new ApiError(404, "not_found", "Inzerát nenalezen.");
  await submitNotice(notice, session); return ok();
}
export async function newConversation(request: Request) {
  const session = await apiSession(request), body = await readJson(request);
  const listingId = requiredText(body.listingId, "listingId", 100);
  const { listingDetail } = await import("./api-v1");
  await listingDetail(listingId);
  return { id: await openListingChat(session, listingId) };
}
const messageDto = (message: ChatMessage) => ({ id: message.id, senderId: message.senderId, body: message.body, link: message.link, createdAt: message.createdAt });
export async function conversationMessages(request: Request, id: string) {
  const session = await apiSession(request);
  if (request.method === "POST") return messageDto(await sendMessage(session, id, requiredText((await readJson(request)).body, "body", 2000)));
  const raw = new URL(request.url).searchParams.get("before"), before = raw ? new Date(raw) : undefined;
  if (before && Number.isNaN(before.getTime())) throw new ApiError(400, "invalid_query", "Neplatné datum.");
  const items = (await messagesOf(session, id, before)).map(messageDto);
  return { items, nextBefore: items.length === 50 ? items[0].createdAt : null };
}
export async function readConversation(request: Request, id: string) { await markRead(await apiSession(request), id); return ok(); }
export async function realtimeToken(request: Request): Promise<RealtimeTokenDto> {
  const session = await apiSession(request);
  return { token: await createWsToken(session.user.id, getCloudflareContext().env.BETTER_AUTH_SECRET), unread: await unreadTotal(session.user.id), path: "/ws/zpravy" };
}
