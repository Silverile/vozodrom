import "server-only";

import { generateRandomString } from "better-auth/crypto";
import { and, asc, count, desc, eq, gt, inArray, isNull, lt, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  type CommunityTarget,
  type ListingPhoto,
  carFollow,
  carLike,
  communityReport,
  entryComment,
  entryLike,
  garageCar,
  logEntry,
  user,
} from "@/db/schema";
import { STAFF_ROLES, type Session, hasRole } from "./auth";
import { notify, notifyStaff } from "./chat";
import {
  type CarData,
  type EntryInput,
  type FeedItem,
  MAX_COMMENT,
  MAX_ENTRY_PHOTOS,
  MAX_GARAGE_PHOTOS,
  carLine,
  carProblems,
  carTitle,
  cleanCarData,
  cleanEntry,
  isCarData,
} from "./garage";
import { ListingError } from "./listing-store";
import { deletePhotos, storePhoto } from "./photo-store";
import { isRule, redress, statementOfReasons } from "./statement";

// Server side of garages and logbooks. Cars, entries and comments are public at once; a moderator
// hides what users report (the owner still sees it, with the reason). Owners and staff may edit
// and delete; ids of things a viewer may not see answer 404, so they cannot be probed.

export type CarRow = typeof garageCar.$inferSelect;
export type EntryRow = typeof logEntry.$inferSelect;
export type CommentRow = typeof entryComment.$inferSelect;

const MAX_CARS = 30;
const ENTRIES_PER_DAY = 20;
const COMMENTS_PER_HOUR = 30;
const REPORTS_PER_HOUR = 10;

const isStaff = (session: Session | null) => hasRole(session, STAFF_ROLES);
const newId = (prefix: string) => `${prefix}-${generateRandomString(12, "a-z", "0-9")}`;

/** "Jana N." — public pages show the first name and the initial of the last, not the full name. */
export function publicName(name: string): string {
  const [first, ...rest] = name.trim().split(/\s+/);
  const last = rest.pop();
  return last ? `${first} ${last[0].toUpperCase()}.` : first || "Uživatel";
}

export function parseCar(value: unknown): CarData {
  if (!isCarData(value)) throw new ListingError(400, "Neplatné údaje o autě.");
  const car = cleanCarData(value);
  const problems = Object.values(carProblems(car));
  if (problems.length) throw new ListingError(422, `Zkontrolujte údaje: ${problems.join(", ")}.`);
  return car;
}

// ---------------------------------------------------------------------------------------------
// Cars

async function findCar(id: string): Promise<CarRow | undefined> {
  const [row] = await getDb().select().from(garageCar).where(eq(garageCar.id, id)).limit(1);
  return row;
}

/** The car if the session owns it (or is staff, when allowed); otherwise a 404. */
export async function carFor(session: Session, id: string, { staff = false } = {}): Promise<CarRow> {
  const row = await findCar(id);
  if (!row || (row.userId !== session.user.id && !(staff && isStaff(session)))) throw new ListingError(404, "Auto nenalezeno.");
  return row;
}

export async function carsOf(userId: string): Promise<CarRow[]> {
  return getDb().select().from(garageCar).where(eq(garageCar.userId, userId)).orderBy(asc(garageCar.former), desc(garageCar.updatedAt));
}

const lineSlugOf = (car: CarData) => carLine(car)?.slug ?? "";

export async function createCar(session: Session, data: CarData): Promise<string> {
  const db = getDb();
  const [mine] = await db.select({ n: count() }).from(garageCar).where(eq(garageCar.userId, session.user.id));
  if ((mine?.n ?? 0) >= MAX_CARS) throw new ListingError(409, `V garáži může být nejvýše ${MAX_CARS} aut.`);
  const id = newId("c");
  await db.insert(garageCar).values({ id, userId: session.user.id, makeSlug: data.brand, lineSlug: lineSlugOf(data), data });
  return id;
}

export async function updateCar(session: Session, id: string, data: CarData, former: boolean) {
  await carFor(session, id, { staff: true });
  await getDb()
    .update(garageCar)
    .set({ data, former, makeSlug: data.brand, lineSlug: lineSlugOf(data), updatedAt: new Date() })
    .where(eq(garageCar.id, id));
}

/** Deletes the car with its logbook; the photos of both go from R2. */
export async function deleteCar(session: Session, id: string) {
  const car = await carFor(session, id, { staff: true });
  const db = getDb();
  const entries = await db.select({ photos: logEntry.photos }).from(logEntry).where(eq(logEntry.carId, id));
  await db.delete(garageCar).where(eq(garageCar.id, id));
  await deletePhotos([...car.photos, ...entries.flatMap((e) => e.photos)].map((p) => p.key));
}

// ---------------------------------------------------------------------------------------------
// Photos of cars and entries (same rules as listing photos)

type PhotoTable = typeof garageCar | typeof logEntry;

async function appendPhoto(table: PhotoTable, id: string, folder: string, max: number, body: ArrayBuffer, width: number, height: number) {
  const photo = await storePhoto(folder, body, width, height);
  // Appending in SQL keeps parallel uploads from overwriting each other; the count is checked there.
  const [updated] = await getDb()
    .update(table)
    .set({ photos: sql`${table.photos} || ${JSON.stringify([photo])}::jsonb`, updatedAt: new Date() })
    .where(and(eq(table.id, id), sql`jsonb_array_length(${table.photos}) < ${max}`))
    .returning({ id: table.id });
  if (!updated) {
    await deletePhotos([photo.key]);
    throw new ListingError(409, `Nejvýše ${max} fotek.`);
  }
  return photo;
}

async function dropPhoto(table: PhotoTable, id: string, photos: ListingPhoto[], key: string) {
  if (!photos.some((p) => p.key === key)) throw new ListingError(404, "Fotka nenalezena.");
  await getDb()
    .update(table)
    .set({ photos: sql`(select coalesce(jsonb_agg(p), '[]'::jsonb) from jsonb_array_elements(${table.photos}) p where p->>'key' <> ${key})`, updatedAt: new Date() })
    .where(eq(table.id, id));
  await deletePhotos([key]);
}

async function orderPhotos(table: PhotoTable, id: string, photos: ListingPhoto[], order: unknown) {
  const keys = Array.isArray(order) ? order.filter((k): k is string => typeof k === "string") : [];
  if (keys.length !== photos.length || !photos.every((p) => keys.includes(p.key))) throw new ListingError(400, "Neplatné pořadí fotek.");
  await getDb()
    .update(table)
    .set({ photos: keys.map((k) => photos.find((p) => p.key === k)!), updatedAt: new Date() })
    .where(eq(table.id, id));
}

export type PhotoOwner = "car" | "entry";

/** Photo actions for the owner (or staff) of a car or an entry. */
export async function photoAction(
  session: Session,
  owner: PhotoOwner,
  id: string,
  action: { add: { body: ArrayBuffer; width: number; height: number } } | { remove: string } | { order: unknown },
): Promise<ListingPhoto | null> {
  const row = owner === "car" ? await carFor(session, id, { staff: true }) : await entryFor(session, id, { staff: true });
  const table = owner === "car" ? garageCar : logEntry;
  if ("add" in action) {
    const max = owner === "car" ? MAX_GARAGE_PHOTOS : MAX_ENTRY_PHOTOS;
    if (row.photos.length >= max) throw new ListingError(409, `Nejvýše ${max} fotek.`);
    return appendPhoto(table, id, owner === "car" ? `garaz/${id}` : `deniky/${id}`, max, action.add.body, action.add.width, action.add.height);
  }
  if ("remove" in action) await dropPhoto(table, id, row.photos, action.remove);
  else await orderPhotos(table, id, row.photos, action.order);
  return null;
}

// ---------------------------------------------------------------------------------------------
// Logbook entries

async function findEntry(id: string): Promise<EntryRow | undefined> {
  const [row] = await getDb().select().from(logEntry).where(eq(logEntry.id, id)).limit(1);
  return row;
}

export async function entryFor(session: Session, id: string, { staff = false } = {}): Promise<EntryRow> {
  const row = await findEntry(id);
  if (!row || (row.userId !== session.user.id && !(staff && isStaff(session)))) throw new ListingError(404, "Zápis nenalezen.");
  return row;
}

export function parseEntry(value: unknown): EntryInput {
  const entry = cleanEntry(value);
  if (typeof entry === "string") throw new ListingError(422, entry);
  return entry;
}

export async function createEntry(session: Session, carId: string, input: EntryInput): Promise<string> {
  const car = await carFor(session, carId);
  const db = getDb();
  const [today] = await db
    .select({ n: count() })
    .from(logEntry)
    .where(and(eq(logEntry.userId, session.user.id), gt(logEntry.createdAt, new Date(Date.now() - 86_400_000))));
  if ((today?.n ?? 0) >= ENTRIES_PER_DAY) throw new ListingError(429, "Dnes jste napsali už hodně zápisů, pokračujte zítra.");
  const id = newId("e");
  await db.insert(logEntry).values({ id, carId, userId: session.user.id, ...input });
  await touchCar(carId);

  // Followers hear about the new entry in their Vozodrom thread.
  const followers = await db.select({ userId: carFollow.userId }).from(carFollow).where(eq(carFollow.carId, carId));
  const title = carTitle(car.data);
  await Promise.all(
    followers
      .filter((f) => f.userId !== session.user.id)
      .map((f) => notify(f.userId, `Nový zápis v příběhu auta ${title}: ${input.title}`, `/pribehy/${carId}/${id}/`)),
  );
  return id;
}

const touchCar = (carId: string) => getDb().update(garageCar).set({ updatedAt: new Date() }).where(eq(garageCar.id, carId));

export async function updateEntry(session: Session, id: string, input: EntryInput) {
  await entryFor(session, id, { staff: true });
  await getDb().update(logEntry).set({ ...input, updatedAt: new Date() }).where(eq(logEntry.id, id));
}

export async function deleteEntry(session: Session, id: string) {
  const entry = await entryFor(session, id, { staff: true });
  await getDb().delete(logEntry).where(eq(logEntry.id, id));
  await deletePhotos(entry.photos.map((p) => p.key));
}

// ---------------------------------------------------------------------------------------------
// Public pages

export interface CarCounts {
  likes: number;
  followers: number;
  entries: number;
}

/** What a viewer has done with a car or an entry. */
export interface ViewerState {
  liked: boolean;
  following: boolean;
  owner: boolean;
  staff: boolean;
}

/** May the viewer see a hidden car, entry or comment? Its author and staff may. */
const mayView = (row: { userId: string; hiddenReason: string | null }, viewer: Session | null) =>
  !row.hiddenReason || (viewer !== null && (viewer.user.id === row.userId || isStaff(viewer)));

/** "Jezdí s Škoda Octavia, Ford Focus" lines for comment authors, by user id. */
async function drivesOf(userIds: string[]): Promise<Map<string, string[]>> {
  if (!userIds.length) return new Map();
  const rows = await getDb()
    .select({ userId: garageCar.userId, data: garageCar.data })
    .from(garageCar)
    .where(and(inArray(garageCar.userId, userIds), eq(garageCar.former, false), isNull(garageCar.hiddenReason)))
    .orderBy(desc(garageCar.updatedAt));
  const map = new Map<string, string[]>();
  for (const r of rows) map.set(r.userId, [...(map.get(r.userId) ?? []), carTitle(r.data)]);
  return map;
}

export async function carPage(id: string, viewer: Session | null) {
  const car = await findCar(id);
  if (!car || !mayView(car, viewer)) return null;
  const db = getDb();
  const owner = viewer?.user.id === car.userId;
  const [author] = await db.select({ name: user.name, banned: user.banned }).from(user).where(eq(user.id, car.userId)).limit(1);
  if (author?.banned && !owner && !isStaff(viewer)) return null;
  const entries = (await db.select().from(logEntry).where(eq(logEntry.carId, id)).orderBy(desc(logEntry.happenedOn), desc(logEntry.createdAt))).filter((e) =>
    mayView(e, viewer),
  );
  const [likes, followers, liked, following, otherCars, entryLikes, entryComments] = await Promise.all([
    db.select({ n: count() }).from(carLike).where(eq(carLike.carId, id)),
    db.select({ n: count() }).from(carFollow).where(eq(carFollow.carId, id)),
    viewer ? db.select({ n: count() }).from(carLike).where(and(eq(carLike.carId, id), eq(carLike.userId, viewer.user.id))) : [{ n: 0 }],
    viewer ? db.select({ n: count() }).from(carFollow).where(and(eq(carFollow.carId, id), eq(carFollow.userId, viewer.user.id))) : [{ n: 0 }],
    db
      .select({ id: garageCar.id, data: garageCar.data, former: garageCar.former })
      .from(garageCar)
      .where(and(eq(garageCar.userId, car.userId), isNull(garageCar.hiddenReason))),
    entriesCount(entryLike, entries.map((e) => e.id)),
    entriesCount(entryComment, entries.map((e) => e.id)),
  ]);
  return {
    car,
    ownerName: publicName(author?.name ?? ""),
    otherCars: otherCars.filter((c) => c.id !== id),
    entries: entries.map((e) => ({ ...e, likes: entryLikes.get(e.id) ?? 0, comments: entryComments.get(e.id) ?? 0 })),
    counts: { likes: likes[0]?.n ?? 0, followers: followers[0]?.n ?? 0, entries: entries.length } satisfies CarCounts,
    viewer: { liked: (liked[0]?.n ?? 0) > 0, following: (following[0]?.n ?? 0) > 0, owner, staff: isStaff(viewer) } satisfies ViewerState,
  };
}

/** Number of likes or comments per entry id. */
async function entriesCount(table: typeof entryLike | typeof entryComment, ids: string[]): Promise<Map<string, number>> {
  if (!ids.length) return new Map();
  const where = table === entryComment ? and(inArray(table.entryId, ids), isNull(entryComment.hiddenReason)) : inArray(table.entryId, ids);
  const rows = await getDb().select({ id: table.entryId, n: count() }).from(table).where(where).groupBy(table.entryId);
  return new Map(rows.map((r) => [r.id, r.n]));
}

export interface PublicComment {
  id: string;
  body: string;
  authorId: string;
  authorName: string;
  /** what the author drives, from their garage */
  drives: string[];
  createdAt: Date;
  hiddenReason: string | null;
  mine: boolean;
}

export async function entryPage(carId: string, id: string, viewer: Session | null) {
  const found = await carPage(carId, viewer);
  const entry = found?.entries.find((e) => e.id === id);
  if (!found || !entry) return null;
  const db = getDb();
  const [liked, comments] = await Promise.all([
    viewer ? db.select({ n: count() }).from(entryLike).where(and(eq(entryLike.entryId, id), eq(entryLike.userId, viewer.user.id))) : [{ n: 0 }],
    db
      .select({ id: entryComment.id, body: entryComment.body, userId: entryComment.userId, name: user.name, createdAt: entryComment.createdAt, hiddenReason: entryComment.hiddenReason })
      .from(entryComment)
      .innerJoin(user, eq(user.id, entryComment.userId))
      .where(and(eq(entryComment.entryId, id), eq(user.banned, false)))
      .orderBy(asc(entryComment.createdAt)),
  ]);
  const visible = comments.filter((c) => mayView(c, viewer));
  const drives = await drivesOf([...new Set(visible.map((c) => c.userId))]);
  // Entries are listed newest first; "earlier" is the next one in that list.
  const index = found.entries.indexOf(entry);
  return {
    ...found,
    entry,
    liked: (liked[0]?.n ?? 0) > 0,
    earlier: found.entries[index + 1] ?? null,
    later: found.entries[index - 1] ?? null,
    comments: visible.map(
      (c): PublicComment => ({
        id: c.id,
        body: c.body,
        authorId: c.userId,
        authorName: publicName(c.name),
        drives: drives.get(c.userId) ?? [],
        createdAt: c.createdAt,
        hiddenReason: c.hiddenReason,
        mine: viewer?.user.id === c.userId,
      }),
    ),
  };
}

/** Newest visible entries, optionally of one make, model line or topic; `before` pages back. */
export async function feed({ make, line, category, before, limit = 24 }: { make?: string; line?: string; category?: string; before?: Date; limit?: number }): Promise<FeedItem[]> {
  const conditions = [isNull(logEntry.hiddenReason), isNull(garageCar.hiddenReason), eq(user.banned, false)];
  if (make) conditions.push(eq(garageCar.makeSlug, make));
  if (line) conditions.push(eq(garageCar.lineSlug, line));
  if (category) conditions.push(eq(logEntry.category, category));
  if (before) conditions.push(lt(logEntry.createdAt, before));
  const rows = await getDb()
    .select({ entry: logEntry, car: garageCar })
    .from(logEntry)
    .innerJoin(garageCar, eq(garageCar.id, logEntry.carId))
    .innerJoin(user, eq(user.id, logEntry.userId))
    .where(and(...conditions))
    .orderBy(desc(logEntry.createdAt))
    .limit(Math.min(limit, 60));
  const ids = rows.map((r) => r.entry.id);
  const [likes, comments] = await Promise.all([entriesCount(entryLike, ids), entriesCount(entryComment, ids)]);
  return rows.map(({ entry, car }) => ({
    id: entry.id,
    carId: car.id,
    title: entry.title,
    category: entry.category,
    costCzk: entry.costCzk,
    mileageKm: entry.mileageKm,
    happenedOn: entry.happenedOn,
    photo: entry.photos[0] ?? car.photos[0] ?? null,
    carTitle: carTitle(car.data),
    makeSlug: car.makeSlug,
    lineSlug: car.lineSlug,
    likes: likes.get(entry.id) ?? 0,
    comments: comments.get(entry.id) ?? 0,
    createdAt: entry.createdAt.toISOString(),
  }));
}

/** How many owners keep a car of this model line here, and how many entries they wrote. */
export async function ownersOf(make: string, line: string): Promise<{ cars: number; entries: number }> {
  const db = getDb();
  const visible = and(eq(garageCar.makeSlug, make), eq(garageCar.lineSlug, line), isNull(garageCar.hiddenReason));
  const [[cars], [entries]] = await Promise.all([
    db.select({ n: count() }).from(garageCar).where(visible),
    db
      .select({ n: count() })
      .from(logEntry)
      .innerJoin(garageCar, eq(garageCar.id, logEntry.carId))
      .where(and(visible, isNull(logEntry.hiddenReason))),
  ]);
  return { cars: cars?.n ?? 0, entries: entries?.n ?? 0 };
}

// ---------------------------------------------------------------------------------------------
// Owner profiles

export interface ProfileCar {
  id: string;
  data: CarData;
  photo: ListingPhoto | null;
  former: boolean;
  entries: number;
  likes: number;
}

/** The public cars of an owner (current first), each with its entry and like counts. */
async function publicCarsOf(userId: string): Promise<ProfileCar[]> {
  const db = getDb();
  const cars = await db
    .select()
    .from(garageCar)
    .where(and(eq(garageCar.userId, userId), isNull(garageCar.hiddenReason)))
    .orderBy(asc(garageCar.former), desc(garageCar.updatedAt));
  if (!cars.length) return [];
  const ids = cars.map((c) => c.id);
  const [entries, likes] = await Promise.all([
    db.select({ id: logEntry.carId, n: count() }).from(logEntry).where(and(inArray(logEntry.carId, ids), isNull(logEntry.hiddenReason))).groupBy(logEntry.carId),
    db.select({ id: carLike.carId, n: count() }).from(carLike).where(inArray(carLike.carId, ids)).groupBy(carLike.carId),
  ]);
  const entriesOf = new Map(entries.map((r) => [r.id, r.n]));
  const likesOf = new Map(likes.map((r) => [r.id, r.n]));
  return cars.map((c) => ({ id: c.id, data: c.data, photo: c.photos[0] ?? null, former: c.former, entries: entriesOf.get(c.id) ?? 0, likes: likesOf.get(c.id) ?? 0 }));
}

/** What the seller box of a listing shows: the seller's current garage cars. */
export async function sellerCars(userId: string): Promise<ProfileCar[]> {
  return (await publicCarsOf(userId)).filter((c) => !c.former).slice(0, 3);
}

/** An owner's public page: name, since when, cars, newest entries and counts; null for unknown or blocked users. */
export async function profilePage(userId: string) {
  const db = getDb();
  const [owner] = await db.select({ name: user.name, banned: user.banned, createdAt: user.createdAt }).from(user).where(eq(user.id, userId)).limit(1);
  if (!owner || owner.banned) return null;
  const cars = await publicCarsOf(userId);
  const ids = cars.map((c) => c.id);
  const [followers] = ids.length ? await db.select({ n: count() }).from(carFollow).where(inArray(carFollow.carId, ids)) : [{ n: 0 }];
  const entries = ids.length
    ? await db
        .select({ entry: logEntry, car: garageCar })
        .from(logEntry)
        .innerJoin(garageCar, eq(garageCar.id, logEntry.carId))
        .where(and(eq(logEntry.userId, userId), isNull(logEntry.hiddenReason), isNull(garageCar.hiddenReason)))
        .orderBy(desc(logEntry.happenedOn), desc(logEntry.createdAt))
        .limit(12)
    : [];
  return {
    name: publicName(owner.name),
    since: owner.createdAt,
    cars,
    followers: followers?.n ?? 0,
    entries: entries.map(({ entry, car }) => ({ ...entry, carTitle: carTitle(car.data), photo: entry.photos[0] ?? car.photos[0] ?? null })),
  };
}

// ---------------------------------------------------------------------------------------------
// Likes, follows, comments

/** A viewer may react to what they can see, but not to their own car or entry. */
async function visibleCar(carId: string) {
  const car = await findCar(carId);
  if (!car || car.hiddenReason) throw new ListingError(404, "Auto nenalezeno.");
  return car;
}

async function visibleEntry(entryId: string) {
  const entry = await findEntry(entryId);
  if (!entry || entry.hiddenReason) throw new ListingError(404, "Zápis nenalezen.");
  return entry;
}

/** Sets a like or follow on or off; returns the new count. */
export async function toggle(session: Session, what: "car-like" | "follow" | "entry-like", id: string, on: boolean): Promise<number> {
  const db = getDb();
  const userId = session.user.id;
  if (what === "entry-like") {
    const entry = await visibleEntry(id);
    if (entry.userId === userId) throw new ListingError(409, "Vlastní zápis označit nelze.");
    if (on) await db.insert(entryLike).values({ userId, entryId: id }).onConflictDoNothing();
    else await db.delete(entryLike).where(and(eq(entryLike.userId, userId), eq(entryLike.entryId, id)));
    const [n] = await db.select({ n: count() }).from(entryLike).where(eq(entryLike.entryId, id));
    return n?.n ?? 0;
  }
  const car = await visibleCar(id);
  if (car.userId === userId) throw new ListingError(409, "Vlastní auto označit nelze.");
  const table = what === "car-like" ? carLike : carFollow;
  if (on) await db.insert(table).values({ userId, carId: id }).onConflictDoNothing();
  else await db.delete(table).where(and(eq(table.userId, userId), eq(table.carId, id)));
  const [n] = await db.select({ n: count() }).from(table).where(eq(table.carId, id));
  return n?.n ?? 0;
}

export async function addComment(session: Session, entryId: string, text: string): Promise<string> {
  const body = text.trim().slice(0, MAX_COMMENT);
  if (body.length < 2) throw new ListingError(422, "Napište komentář.");
  const entry = await visibleEntry(entryId);
  const db = getDb();
  const [recent] = await db
    .select({ n: count() })
    .from(entryComment)
    .where(and(eq(entryComment.userId, session.user.id), gt(entryComment.createdAt, new Date(Date.now() - 3_600_000))));
  if ((recent?.n ?? 0) >= COMMENTS_PER_HOUR) throw new ListingError(429, "Píšete příliš rychle, zkuste to za chvíli.");
  const id = newId("k");
  await db.insert(entryComment).values({ id, entryId, userId: session.user.id, body });
  if (entry.userId !== session.user.id) {
    await notify(entry.userId, `Nový komentář u zápisu ${entry.title}: ${body.slice(0, 120)}`, `/pribehy/${entry.carId}/${entryId}/#komentare`);
  }
  return id;
}

export async function deleteComment(session: Session, id: string) {
  const db = getDb();
  const [row] = await db.select().from(entryComment).where(eq(entryComment.id, id)).limit(1);
  if (!row || (row.userId !== session.user.id && !isStaff(session))) throw new ListingError(404, "Komentář nenalezen.");
  await db.delete(entryComment).where(eq(entryComment.id, id));
}

// ---------------------------------------------------------------------------------------------
// Reports and moderation

const TARGET_TABLES = { car: garageCar, entry: logEntry, comment: entryComment } as const;
const TARGET_LABEL: Record<CommunityTarget, string> = { car: "auto v garáži", entry: "zápis v příběhu auta", comment: "komentář" };

export async function reportContent(session: Session, kind: CommunityTarget, targetId: string, reason: string, goodFaith: boolean) {
  const text = reason.trim().slice(0, 1000);
  if (!goodFaith) throw new ListingError(422, "Potvrďte, že hlášení podáváte v dobré víře.");
  if (text.length < 10) throw new ListingError(422, "Popište, co je v nepořádku (alespoň 10 znaků).");
  const table = TARGET_TABLES[kind];
  if (!table) throw new ListingError(400, "Neplatné hlášení.");
  const db = getDb();
  const [target] = await db.select({ userId: table.userId }).from(table).where(eq(table.id, targetId)).limit(1);
  if (!target) throw new ListingError(404, "Obsah nenalezen.");
  if (target.userId === session.user.id) throw new ListingError(409, "Vlastní obsah nahlásit nelze.");
  const [recent] = await db
    .select({ n: count() })
    .from(communityReport)
    .where(and(eq(communityReport.userId, session.user.id), gt(communityReport.createdAt, new Date(Date.now() - 3_600_000))));
  if ((recent?.n ?? 0) >= REPORTS_PER_HOUR) throw new ListingError(429, "Odeslali jste příliš mnoho hlášení, zkuste to později.");
  await db.insert(communityReport).values({ id: newId("h"), kind, targetId, userId: session.user.id, reason: text });
  await notifyStaff(`Nahlášen obsah: ${TARGET_LABEL[kind]}`, "/admin/komunita/");
}

export type CommunityReportRow = typeof communityReport.$inferSelect;

/** Open reports with what they point at, oldest first. */
export async function openCommunityReports() {
  const db = getDb();
  const reports = await db.select().from(communityReport).where(eq(communityReport.status, "open")).orderBy(asc(communityReport.createdAt));
  return Promise.all(
    reports.map(async (r) => {
      const table = TARGET_TABLES[r.kind];
      const [target] = await db.select().from(table).where(eq(table.id, r.targetId)).limit(1);
      return { report: r, target: (target ?? null) as CarRow | EntryRow | CommentRow | null };
    }),
  );
}

/** Hides (with a reason the author sees) or restores content, and closes its open reports. */
/** Where reported content lives, for the author's statement of reasons. */
async function contentPath(kind: CommunityTarget, targetId: string): Promise<string | undefined> {
  const db = getDb();
  if (kind === "car") return `/pribehy/${targetId}/`;
  if (kind === "entry") {
    const [e] = await db.select({ carId: logEntry.carId }).from(logEntry).where(eq(logEntry.id, targetId)).limit(1);
    return e && `/pribehy/${e.carId}/${targetId}/`;
  }
  const [c] = await db
    .select({ entryId: entryComment.entryId, carId: logEntry.carId })
    .from(entryComment)
    .innerJoin(logEntry, eq(logEntry.id, entryComment.entryId))
    .where(eq(entryComment.id, targetId))
    .limit(1);
  return c && `/pribehy/${c.carId}/${c.entryId}/#komentare`;
}

export async function moderate(session: Session, kind: CommunityTarget, targetId: string, action: "hide" | "restore" | "dismiss", reason = "", rule?: unknown) {
  if (!isStaff(session)) throw new ListingError(403, "Jen pro moderátory.");
  const table = TARGET_TABLES[kind];
  if (!table) throw new ListingError(400, "Neplatný obsah.");
  const db = getDb();
  const [target] = await db.select({ userId: table.userId }).from(table).where(eq(table.id, targetId)).limit(1);
  if (!target) throw new ListingError(404, "Obsah nenalezen.");
  if (action === "hide") {
    const text = reason.trim().slice(0, 500);
    if (text.length < 5) throw new ListingError(422, "Napište důvod skrytí, uvidí ho autor.");
    if (!isRule(rule)) throw new ListingError(422, "Vyberte porušené pravidlo.");
    const [reported] = await db
      .select({ n: count() })
      .from(communityReport)
      .where(and(eq(communityReport.kind, kind), eq(communityReport.targetId, targetId), eq(communityReport.status, "open")));
    await db.update(table).set({ hiddenReason: text }).where(eq(table.id, targetId));
    await notify(
      target.userId,
      statementOfReasons({
        what: `Váš obsah (${TARGET_LABEL[kind]})`,
        link: await contentPath(kind, targetId),
        action: "jsme skryli; ostatní ho nevidí, vy ho vidíte i s důvodem",
        reason: text,
        rule,
        flaggedBy: (reported?.n ?? 0) > 0 ? "hlášením uživatelů" : "vlastní kontrolou moderátora",
        decidedBy: "moderátor",
      }),
    );
  } else if (action === "restore") {
    await db.update(table).set({ hiddenReason: null }).where(eq(table.id, targetId));
  }
  // Everyone who reported it learns the outcome (DSA art. 16(5)).
  const notifiers = await db
    .update(communityReport)
    .set({ status: action === "hide" ? "hidden" : "dismissed", decidedBy: session.user.id, decidedAt: new Date() })
    .where(and(eq(communityReport.kind, kind), eq(communityReport.targetId, targetId), eq(communityReport.status, "open")))
    .returning({ userId: communityReport.userId });
  const outcome = action === "hide" ? "obsah jsme skryli" : "obsah po posouzení ponecháváme zveřejněný";
  await Promise.all(
    [...new Set(notifiers.map((n) => n.userId))].map((userId) =>
      notify(userId, `Výsledek vašeho hlášení (${TARGET_LABEL[kind]}): ${outcome}. ${redress()}`),
    ),
  );
}
