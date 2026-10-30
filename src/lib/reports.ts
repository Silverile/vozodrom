import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { generateRandomString } from "better-auth/crypto";
import { and, asc, count, eq, gt } from "drizzle-orm";
import { getDb } from "@/db";
import { REPORT_CATEGORIES, type ReportCategory, listing, report } from "@/db/schema";
import type { Session } from "./auth";
import { draftTitle } from "./listing-draft";
import { REPORT_CATEGORY_LABEL as CATEGORY_LABEL } from "./listing-status";
import { ListingError, changeStatus, findListing } from "./listing-store";
import { sendMail } from "./mail";

// Notices about listings and how they are decided (DSA art. 16 and 17):
// - anyone can report a published listing, with a reason, name and e-mail, in good faith;
// - the notifier gets a confirmation and later the decision;
// - three open notices hide a listing until a moderator looks at it;
// - removing a listing shows its author the reasons in the account (no e-mail, to save the quota).

/** Open notices that hide a listing until a moderator decides. */
const HIDE_AT = 3;
/** Notices one e-mail address may send per hour, against flooding. */
const PER_HOUR = 5;

export type ReportRow = typeof report.$inferSelect;

export interface NoticeInput {
  listingId: string;
  category: string;
  explanation: string;
  name: string;
  email: string;
  goodFaith: boolean;
}

export function parseNotice(body: unknown): NoticeInput {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const notice = {
    listingId: text(b.listingId, 64),
    category: text(b.category, 20),
    explanation: text(b.explanation, 3000),
    name: text(b.name, 120),
    email: text(b.email, 200).toLowerCase(),
    goodFaith: b.goodFaith === true,
  };
  if (!REPORT_CATEGORIES.includes(notice.category as ReportCategory)) throw new ListingError(422, "Vyberte důvod hlášení.");
  if (notice.explanation.length < 20) throw new ListingError(422, "Popište, co je s inzerátem v nepořádku (alespoň 20 znaků).");
  if (!notice.name) throw new ListingError(422, "Uveďte své jméno.");
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(notice.email)) throw new ListingError(422, "Uveďte platný e-mail, pošleme na něj výsledek.");
  if (!notice.goodFaith) throw new ListingError(422, "Potvrďte, že hlášení podáváte v dobré víře.");
  return notice;
}

export async function submitNotice(notice: NoticeInput, session: Session | null): Promise<void> {
  const db = getDb();
  const target = await findListing(notice.listingId);
  if (!target || target.status !== "published") throw new ListingError(404, "Inzerát nenalezen.");
  if (session && target.userId === session.user.id) throw new ListingError(409, "Vlastní inzerát nahlásit nelze.");
  const [recent] = await db
    .select({ n: count() })
    .from(report)
    .where(and(eq(report.notifierEmail, notice.email), gt(report.createdAt, new Date(Date.now() - 3_600_000))));
  if ((recent?.n ?? 0) >= PER_HOUR) throw new ListingError(429, "Odeslali jste příliš mnoho hlášení, zkuste to později.");

  await db.insert(report).values({
    id: `r-${generateRandomString(12, "a-z", "0-9")}`,
    listingId: target.id,
    category: notice.category as ReportCategory,
    explanation: notice.explanation,
    notifierName: notice.name,
    notifierEmail: notice.email,
    userId: session?.user.id ?? null,
  });

  const title = draftTitle(target.data);
  await sendMail({
    to: notice.email,
    subject: `Hlášení přijato: ${title}`,
    text: `Dobrý den,\n\nděkujeme, vaše hlášení k inzerátu ${title} jsme přijali a posoudíme ho. O výsledku vás budeme informovat e-mailem.\n\nDůvod: ${CATEGORY_LABEL[notice.category as ReportCategory]}\n${notice.explanation}`,
  }).catch(() => {});

  const [open] = await db.select({ n: count() }).from(report).where(and(eq(report.listingId, target.id), eq(report.status, "open")));
  if ((open?.n ?? 0) >= HIDE_AT) {
    // Hidden, not removed: the listing waits in the moderation queue with the reason.
    await db
      .update(listing)
      .set({ status: "pending", moderationFlags: [...new Set([...target.moderationFlags, "opakovaně nahlášeno uživateli"])], updatedAt: new Date() })
      .where(and(eq(listing.id, target.id), eq(listing.status, "published")));
  }
}

export async function openReports(): Promise<ReportRow[]> {
  return getDb().select().from(report).where(eq(report.status, "open")).orderBy(asc(report.createdAt));
}

/**
 * A moderator's decision on all open notices of one listing: "remove" takes the listing down
 * (its author gets the reasons), "dismiss" keeps or restores it. Every notifier gets the outcome.
 */
export async function decideReports(session: Session, listingId: string, decision: "remove" | "dismiss", reason: string) {
  const text = reason.trim().slice(0, 1000);
  if (!text) throw new ListingError(422, "Napište zdůvodnění rozhodnutí.");
  const db = getDb();
  const target = await findListing(listingId);
  if (!target) throw new ListingError(404, "Inzerát nenalezen.");
  const notices = await db.select().from(report).where(and(eq(report.listingId, listingId), eq(report.status, "open")));
  if (!notices.length) throw new ListingError(409, "K inzerátu už nejsou otevřená hlášení.");

  if (decision === "remove" && (target.status === "published" || target.status === "pending")) {
    await changeStatus(session, listingId, "reject", text);
  } else if (decision === "dismiss" && target.status === "pending" && target.moderationFlags.includes("opakovaně nahlášeno uživateli")) {
    // Hidden only because of the notices: put it back online.
    await db
      .update(listing)
      .set({ status: "published", moderationFlags: target.moderationFlags.filter((f) => f !== "opakovaně nahlášeno uživateli"), updatedAt: new Date() })
      .where(eq(listing.id, listingId));
  }

  await db
    .update(report)
    .set({ status: decision === "remove" ? "removed" : "dismissed", decision: text, decidedBy: session.user.id, decidedAt: new Date() })
    .where(and(eq(report.listingId, listingId), eq(report.status, "open")));

  const title = draftTitle(target.data);
  const base = getCloudflareContext().env.BETTER_AUTH_URL;
  const outcome =
    decision === "remove"
      ? `Inzerát jsme stáhli z webu.`
      : `Inzerát jsme posoudili a ponecháváme ho zveřejněný: ${base}/inzerat/${listingId}/`;
  for (const n of notices) {
    await sendMail({
      to: n.notifierEmail,
      subject: `Výsledek hlášení: ${title}`,
      text: `Dobrý den,\n\nděkujeme za hlášení k inzerátu ${title}.\n\n${outcome}\nZdůvodnění: ${text}\n\nS rozhodnutím nesouhlasíte? Pošlete nové hlášení s doplňujícími informacemi; obrátit se můžete také na soud.`,
    }).catch(() => {});
  }
}
