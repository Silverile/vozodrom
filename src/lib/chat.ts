import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { generateRandomString } from "better-auth/crypto";
import { and, count, desc, eq, gt, inArray, isNull, lt, ne, or } from "drizzle-orm";
import { getDb } from "@/db";
import { conversation, conversationMember, listing, message, user } from "@/db/schema";
import { STAFF_ROLES, type Session } from "./auth";
import { draftTitle } from "./listing-draft";
import { ListingError } from "./listing-store";

// Chats between buyer and seller about a listing, and each user's "Vozodrom" thread that carries
// notifications. Every new message is pushed to the members' open tabs through their Inbox
// Durable Object (worker/index.ts); the database stays the source of truth.

export const MAX_MESSAGE = 2000;
/** Messages one user may send in ten minutes, against spam. */
const PER_TEN_MINUTES = 30;

export type ChatEvent =
  | { type: "message"; conversationId: string; message: ChatMessage }
  | { type: "unread"; total: number };

export interface ChatMessage {
  id: string;
  senderId: string | null;
  body: string;
  link: string | null;
  createdAt: string;
}

export interface ConversationSummary {
  id: string;
  kind: "listing" | "system";
  title: string;
  /** the other person in a listing chat */
  counterpart: string | null;
  listingId: string | null;
  lastMessageAt: string;
  preview: string;
  unread: number;
}

const toMessage = (m: typeof message.$inferSelect): ChatMessage => ({
  id: m.id,
  senderId: m.senderId,
  body: m.body,
  link: m.link,
  createdAt: m.createdAt.toISOString(),
});

/**
 * Runs work after the response has been sent (pushes, unread counts), so the sender does not wait
 * for other people's sockets. Outside Workers it simply runs now.
 */
function later(work: Promise<unknown>) {
  try {
    getCloudflareContext().ctx.waitUntil(work.catch((error) => console.error("[chat]", error)));
  } catch {
    work.catch((error) => console.error("[chat]", error));
  }
}

/** Sends an event to every open tab of the users. Delivery is best effort: the page reloads from the database. */
async function push(userIds: string[], event: ChatEvent) {
  let env: CloudflareEnv;
  try {
    env = getCloudflareContext().env;
    if (!env.INBOX) return;
  } catch {
    return;
  }
  const body = JSON.stringify(event);
  await Promise.all(
    userIds.map((id) =>
      env.INBOX.get(env.INBOX.idFromName(id))
        .fetch("https://inbox/push", { method: "POST", body })
        .catch(() => {}),
    ),
  );
}

async function pushUnread(userIds: string[]) {
  await Promise.all(userIds.map(async (id) => push([id], { type: "unread", total: await unreadTotal(id) })));
}

/** Unread messages across a user's conversations (messages from others after the user last read). */
export async function unreadTotal(userId: string): Promise<number> {
  const [row] = await getDb()
    .select({ n: count() })
    .from(message)
    .innerJoin(conversationMember, and(eq(conversationMember.conversationId, message.conversationId), eq(conversationMember.userId, userId)))
    .where(
      and(
        or(isNull(message.senderId), ne(message.senderId, userId)),
        or(isNull(conversationMember.lastReadAt), gt(message.createdAt, conversationMember.lastReadAt)),
      ),
    );
  return row?.n ?? 0;
}

async function insertMessage(conversationId: string, senderId: string | null, body: string, link: string | null, memberIds: string[]): Promise<ChatMessage> {
  const db = getDb();
  const row = { id: `m-${generateRandomString(16, "a-z", "0-9")}`, conversationId, senderId, body, link, createdAt: new Date() };
  await db.insert(message).values(row);
  // The bookkeeping and the pushes do not change what the sender sees, so they run after the response.
  later(
    (async () => {
      await db
        .update(conversation)
        .set({ lastMessageAt: row.createdAt, lastMessagePreview: body.slice(0, 140) })
        .where(eq(conversation.id, conversationId));
      if (senderId) {
        await db
          .update(conversationMember)
          .set({ lastReadAt: row.createdAt })
          .where(and(eq(conversationMember.conversationId, conversationId), eq(conversationMember.userId, senderId)));
      }
      await push(memberIds, { type: "message", conversationId, message: toMessage(row) });
      await pushUnread(memberIds.filter((id) => id !== senderId));
    })(),
  );
  return toMessage(row);
}

// ---------------------------------------------------------------------------------------------
// Notifications ("Vozodrom" thread)

/** Adds a notification to the user's Vozodrom thread (created on first use). Never throws. */
export async function notify(userId: string, body: string, link?: string) {
  try {
    const db = getDb();
    const id = `s-${userId}`;
    await db.insert(conversation).values({ id, kind: "system" }).onConflictDoNothing();
    await db.insert(conversationMember).values({ conversationId: id, userId, role: "owner" }).onConflictDoNothing();
    await insertMessage(id, null, body, link ?? null, [userId]);
  } catch (error) {
    // A notification must never break the action that caused it.
    console.error("[notify]", error);
  }
}

/** Notifies every moderator and admin. */
export async function notifyStaff(body: string, link?: string) {
  try {
    const staff = await getDb().select({ id: user.id }).from(user).where(and(inArray(user.role, [...STAFF_ROLES]), eq(user.banned, false)));
    await Promise.all(staff.map((s) => notify(s.id, body, link)));
  } catch (error) {
    console.error("[notifyStaff]", error);
  }
}

// ---------------------------------------------------------------------------------------------
// Listing chats

/** The buyer's chat about a published listing, created on the first "Napsat prodejci". */
export async function openListingChat(session: Session, listingId: string): Promise<string> {
  const db = getDb();
  const [target] = await db.select().from(listing).where(eq(listing.id, listingId)).limit(1);
  if (!target || target.status !== "published") throw new ListingError(404, "Inzerát nenalezen.");
  if (target.userId === session.user.id) throw new ListingError(409, "Vlastnímu inzerátu psát nelze.");
  const id = `l-${listingId}-${session.user.id}`;
  await db.insert(conversation).values({ id, kind: "listing", listingId }).onConflictDoNothing();
  await db
    .insert(conversationMember)
    .values([
      { conversationId: id, userId: session.user.id, role: "buyer" },
      { conversationId: id, userId: target.userId, role: "seller" },
    ])
    .onConflictDoNothing();
  return id;
}

async function membership(session: Session, conversationId: string) {
  // One query for the conversation and its members.
  const rows = await getDb()
    .select({ conv: conversation, userId: conversationMember.userId })
    .from(conversation)
    .innerJoin(conversationMember, eq(conversationMember.conversationId, conversation.id))
    .where(eq(conversation.id, conversationId));
  if (!rows.some((r) => r.userId === session.user.id)) throw new ListingError(404, "Konverzace nenalezena.");
  return { conv: rows[0].conv, members: rows.map((r) => ({ userId: r.userId })) };
}

export async function sendMessage(session: Session, conversationId: string, text: string): Promise<ChatMessage> {
  const body = text.trim().slice(0, MAX_MESSAGE);
  if (!body) throw new ListingError(422, "Napište zprávu.");
  const { conv, members } = await membership(session, conversationId);
  if (conv.kind === "system") throw new ListingError(409, "Na oznámení se neodpovídá.");
  const db = getDb();
  const [recent] = await db
    .select({ n: count() })
    .from(message)
    .where(and(eq(message.senderId, session.user.id), gt(message.createdAt, new Date(Date.now() - 600_000))));
  if ((recent?.n ?? 0) >= PER_TEN_MINUTES) throw new ListingError(429, "Posíláte zprávy příliš rychle, chvíli počkejte.");
  return insertMessage(conversationId, session.user.id, body, null, members.map((m) => m.userId));
}

export async function markRead(session: Session, conversationId: string) {
  await membership(session, conversationId);
  await getDb()
    .update(conversationMember)
    .set({ lastReadAt: new Date() })
    .where(and(eq(conversationMember.conversationId, conversationId), eq(conversationMember.userId, session.user.id)));
  await pushUnread([session.user.id]);
}

/** Up to 50 messages before the given time (newest last), for the thread view and "older" paging. */
export async function messagesOf(session: Session, conversationId: string, before?: Date): Promise<ChatMessage[]> {
  await membership(session, conversationId);
  const rows = await getDb()
    .select()
    .from(message)
    .where(and(eq(message.conversationId, conversationId), before ? lt(message.createdAt, before) : undefined))
    .orderBy(desc(message.createdAt))
    .limit(50);
  return rows.reverse().map(toMessage);
}

export async function conversationsOf(userId: string): Promise<ConversationSummary[]> {
  const db = getDb();
  const mine = await db
    .select({ conv: conversation, lastReadAt: conversationMember.lastReadAt })
    .from(conversationMember)
    .innerJoin(conversation, eq(conversation.id, conversationMember.conversationId))
    .where(eq(conversationMember.userId, userId))
    .orderBy(desc(conversation.lastMessageAt));
  if (!mine.length) return [];
  const ids = mine.map((m) => m.conv.id);
  const [others, listings, unread] = await Promise.all([
    db
      .select({ conversationId: conversationMember.conversationId, name: user.name })
      .from(conversationMember)
      .innerJoin(user, eq(user.id, conversationMember.userId))
      .where(and(inArray(conversationMember.conversationId, ids), ne(conversationMember.userId, userId))),
    db
      .select({ id: listing.id, data: listing.data })
      .from(listing)
      .where(inArray(listing.id, mine.map((m) => m.conv.listingId).filter((x): x is string => Boolean(x)))),
    db
      .select({ conversationId: message.conversationId, n: count() })
      .from(message)
      .innerJoin(conversationMember, and(eq(conversationMember.conversationId, message.conversationId), eq(conversationMember.userId, userId)))
      .where(
        and(
          inArray(message.conversationId, ids),
          or(isNull(message.senderId), ne(message.senderId, userId)),
          or(isNull(conversationMember.lastReadAt), gt(message.createdAt, conversationMember.lastReadAt)),
        ),
      )
      .groupBy(message.conversationId),
  ]);
  return mine.map(({ conv }) => {
    const l = listings.find((x) => x.id === conv.listingId);
    return {
      id: conv.id,
      kind: conv.kind,
      title: conv.kind === "system" ? "Vozodrom" : l ? draftTitle(l.data) : "Smazaný inzerát",
      counterpart: conv.kind === "listing" ? (others.find((o) => o.conversationId === conv.id)?.name.split(/\s+/)[0] ?? null) : null,
      listingId: conv.listingId,
      lastMessageAt: conv.lastMessageAt.toISOString(),
      preview: conv.lastMessagePreview,
      unread: unread.find((u) => u.conversationId === conv.id)?.n ?? 0,
    };
  });
}
