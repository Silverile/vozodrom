import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { generateRandomString } from "better-auth/crypto";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { type ListingPhoto, type ListingStatus, listing, user } from "@/db/schema";
import { STAFF_ROLES, type Session, hasRole } from "./auth";
import { type Draft, cleanDraft, draftProblems, draftTitle, isDraft } from "./listing-draft";
import { sendMail } from "./mail";

// Server side of user listings: who may do what in which status, and the photos in R2.
//   draft ──submit──▶ pending ──approve──▶ published ──withdraw──▶ withdrawn
//                       │  ▲                  │
//                cancel │  │ edit       reject │ (staff takedown)
//                       ▼  │                  ▼
//                     draft / rejected ◀──────┘
// Editing a pending or published listing sends it back to moderation.

export type ListingRow = typeof listing.$inferSelect;

export const MAX_PHOTOS = 20;
export const MAX_PHOTO_BYTES = 3 * 1024 * 1024;

export class ListingError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const isStaff = (session: Session) => hasRole(session, STAFF_ROLES);

export async function findListing(id: string): Promise<ListingRow | undefined> {
  const [row] = await getDb().select().from(listing).where(eq(listing.id, id)).limit(1);
  return row;
}

/** The listing if the session owns it (or is staff, when allowed); otherwise a 404, so ids cannot be probed. */
export async function listingFor(session: Session, id: string, { staff = false } = {}): Promise<ListingRow> {
  const row = await findListing(id);
  if (!row || (row.userId !== session.user.id && !(staff && isStaff(session)))) throw new ListingError(404, "Inzerát nenalezen.");
  return row;
}

export async function listingsOf(userId: string): Promise<ListingRow[]> {
  return getDb().select().from(listing).where(eq(listing.userId, userId)).orderBy(desc(listing.updatedAt));
}

export function parseDraft(value: unknown): Draft {
  if (!isDraft(value)) throw new ListingError(400, "Neplatná data inzerátu.");
  const draft = cleanDraft(value);
  const problems = draftProblems(draft);
  if (problems.length) throw new ListingError(422, `Inzerát není kompletní: ${problems.join(", ")}.`);
  return draft;
}

export function parsePhone(value: unknown): string | null {
  if (value === null || value === "") return null;
  if (typeof value !== "string") throw new ListingError(400, "Neplatný telefon.");
  const phone = value.replace(/[\s()-]/g, "");
  if (!/^\+?\d{9,15}$/.test(phone)) throw new ListingError(422, "Telefon zadejte jako 9 číslic, případně s předvolbou +420.");
  return phone;
}

export async function createListing(session: Session, data: Draft): Promise<string> {
  // Short, unguessable, URL-safe; the u- prefix keeps user listings apart from test and feed ids.
  const id = `u-${generateRandomString(12, "a-z", "0-9")}`;
  await getDb().insert(listing).values({ id, userId: session.user.id, data });
  return id;
}

export async function updateListing(session: Session, id: string, changes: { data?: Draft; phone?: string | null; order?: string[] }) {
  const row = await listingFor(session, id);
  if (row.status === "withdrawn") throw new ListingError(409, "Stažený inzerát už nelze upravit.");
  let photos = row.photos;
  if (changes.order) {
    const byKey = new Map(photos.map((p) => [p.key, p]));
    if (changes.order.length !== photos.length || !changes.order.every((k) => byKey.has(k))) throw new ListingError(400, "Neplatné pořadí fotek.");
    photos = changes.order.map((k) => byKey.get(k)!);
  }
  // Changed content must be moderated again; a rejected listing becomes an editable draft.
  const contentChanged = changes.data !== undefined || changes.phone !== undefined;
  const status: ListingStatus =
    contentChanged && (row.status === "pending" || row.status === "published") ? "pending" : row.status === "rejected" ? "draft" : row.status;
  await getDb()
    .update(listing)
    .set({
      ...(changes.data && { data: changes.data }),
      ...(changes.phone !== undefined && { phone: changes.phone }),
      photos,
      status,
      ...(status === "pending" && row.status !== "pending" && { submittedAt: new Date() }),
      updatedAt: new Date(),
    })
    .where(eq(listing.id, id));
}

type OwnerAction = "submit" | "cancel" | "withdraw";
type StaffAction = "approve" | "reject";

const OWNER_FROM: Record<OwnerAction, ListingStatus[]> = {
  submit: ["draft", "rejected"],
  cancel: ["pending"],
  withdraw: ["published", "pending"],
};
const STAFF_FROM: Record<StaffAction, ListingStatus[]> = { approve: ["pending"], reject: ["pending", "published"] };

export async function changeStatus(session: Session, id: string, action: string, reason?: string) {
  if (action in OWNER_FROM) {
    const row = await listingFor(session, id);
    if (!OWNER_FROM[action as OwnerAction].includes(row.status)) throw new ListingError(409, "Tuto akci teď nelze provést.");
    if (action === "submit") {
      if (draftProblems(row.data).length) throw new ListingError(422, "Inzerát není kompletní.");
      if (row.photos.length === 0) throw new ListingError(422, "Přidejte alespoň jednu fotku.");
    }
    const status: ListingStatus = action === "submit" ? "pending" : action === "cancel" ? "draft" : "withdrawn";
    await getDb()
      .update(listing)
      .set({ status, updatedAt: new Date(), ...(action === "submit" && { submittedAt: new Date(), rejectReason: null }) })
      .where(eq(listing.id, id));
    return;
  }
  if (action in STAFF_FROM) {
    if (!isStaff(session)) throw new ListingError(404, "Inzerát nenalezen.");
    const row = await listingFor(session, id, { staff: true });
    if (!STAFF_FROM[action as StaffAction].includes(row.status)) throw new ListingError(409, "Inzerát už mezitím změnil stav.");
    const rejectReason = action === "reject" ? reason?.trim().slice(0, 1000) : undefined;
    if (action === "reject" && !rejectReason) throw new ListingError(422, "Uveďte důvod zamítnutí.");
    await getDb()
      .update(listing)
      .set({
        status: action === "approve" ? "published" : "rejected",
        rejectReason: rejectReason ?? null,
        moderatedBy: session.user.id,
        updatedAt: new Date(),
        ...(action === "approve" && { publishedAt: row.publishedAt ?? new Date() }),
      })
      .where(eq(listing.id, id));
    await notifyOwner(row, action === "approve" ? "published" : "rejected", rejectReason);
    return;
  }
  throw new ListingError(400, "Neznámá akce.");
}

async function notifyOwner(row: ListingRow, result: "published" | "rejected", reason?: string) {
  const [owner] = await getDb().select({ email: user.email }).from(user).where(eq(user.id, row.userId)).limit(1);
  if (!owner) return;
  const base = getCloudflareContext().env.BETTER_AUTH_URL;
  const title = draftTitle(row.data);
  const text =
    result === "published"
      ? `Dobrý den,\n\nváš inzerát ${title} jsme zkontrolovali a je zveřejněný:\n${base}/inzerat/${row.id}/\n\nSpravovat ho můžete v účtu: ${base}/ucet/inzerat/${row.id}/`
      : `Dobrý den,\n\nváš inzerát ${title} jsme nemohli zveřejnit.\n\nDůvod: ${reason}\n\nInzerát můžete upravit a odeslat znovu: ${base}/ucet/inzerat/${row.id}/`;
  // A failed notice must not undo the moderation decision; the owner still sees the status in the account.
  await sendMail({ to: owner.email, subject: result === "published" ? `Inzerát zveřejněn: ${title}` : `Inzerát zamítnut: ${title}`, text }).catch(() => {});
}

export async function deleteListing(session: Session, id: string) {
  const row = await listingFor(session, id);
  await getDb().delete(listing).where(eq(listing.id, id));
  const { env } = getCloudflareContext();
  if (row.photos.length) await env.PHOTOS.delete(row.photos.map((p) => p.key));
}

/** Detects the real image type from the first bytes; the browser always sends JPEG or WebP. */
function imageType(bytes: Uint8Array): "image/jpeg" | "image/webp" | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.slice(from, to));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  return null;
}

export async function addPhoto(session: Session, id: string, body: ArrayBuffer, width: number, height: number): Promise<ListingPhoto> {
  const row = await listingFor(session, id);
  if (row.status === "withdrawn") throw new ListingError(409, "Ke staženému inzerátu nelze přidávat fotky.");
  if (row.photos.length >= MAX_PHOTOS) throw new ListingError(409, `Nejvýše ${MAX_PHOTOS} fotek.`);
  if (body.byteLength === 0 || body.byteLength > MAX_PHOTO_BYTES) throw new ListingError(413, "Fotka je příliš velká.");
  const type = imageType(new Uint8Array(body, 0, Math.min(12, body.byteLength)));
  if (!type) throw new ListingError(415, "Nahrajte fotku ve formátu JPEG nebo WebP.");
  if (!(width > 0 && width <= 4096 && height > 0 && height <= 4096)) throw new ListingError(400, "Neplatné rozměry fotky.");
  const photo: ListingPhoto = { key: `inzeraty/${id}/${generateRandomString(16, "a-z", "0-9")}.${type === "image/webp" ? "webp" : "jpg"}`, width, height };
  const { env } = getCloudflareContext();
  await env.PHOTOS.put(photo.key, body, { httpMetadata: { contentType: type, cacheControl: "public, max-age=31536000, immutable" } });
  // Appending in SQL keeps parallel uploads from overwriting each other; the count is checked again there.
  const [updated] = await getDb()
    .update(listing)
    .set({ photos: sql`${listing.photos} || ${JSON.stringify([photo])}::jsonb`, updatedAt: new Date() })
    .where(and(eq(listing.id, id), sql`jsonb_array_length(${listing.photos}) < ${MAX_PHOTOS}`))
    .returning({ id: listing.id });
  if (!updated) {
    await env.PHOTOS.delete(photo.key);
    throw new ListingError(409, `Nejvýše ${MAX_PHOTOS} fotek.`);
  }
  return photo;
}

export async function removePhoto(session: Session, id: string, key: string) {
  const row = await listingFor(session, id);
  if (!row.photos.some((p) => p.key === key)) throw new ListingError(404, "Fotka nenalezena.");
  await getDb()
    .update(listing)
    .set({
      photos: sql`(select coalesce(jsonb_agg(p), '[]'::jsonb) from jsonb_array_elements(${listing.photos}) p where p->>'key' <> ${key})`,
      updatedAt: new Date(),
    })
    .where(eq(listing.id, id));
  await getCloudflareContext().env.PHOTOS.delete(key);
}

/** Moderation queue: oldest submissions first, so nobody waits longest. */
export async function pendingListings(): Promise<ListingRow[]> {
  return getDb().select().from(listing).where(eq(listing.status, "pending")).orderBy(asc(listing.submittedAt));
}

export async function publishedListings(limit = 50): Promise<ListingRow[]> {
  return getDb().select().from(listing).where(eq(listing.status, "published")).orderBy(desc(listing.publishedAt)).limit(limit);
}

/** Maps errors thrown above to JSON responses; anything else is a 500 and is logged. */
export function errorResponse(error: unknown): Response {
  if (error instanceof ListingError) return Response.json({ error: error.message }, { status: error.status });
  console.error(error);
  return Response.json({ error: "Něco se nepovedlo." }, { status: 500 });
}
