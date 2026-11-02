import { boolean, index, integer, jsonb, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import type { CarData } from "@/lib/garage";
import type { Draft } from "@/lib/listing-draft";
import type { Messenger } from "@/lib/listing-status";

// Tables and columns used by Better Auth (core + admin plugin). Names follow its defaults,
// so the adapter needs no field mapping.

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  /** user | dealer | moderator | admin */
  role: text("role").notNull().default("user"),
  banned: boolean("banned").notNull().default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires", { withTimezone: true }),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  (t) => [index("session_user_idx").on(t.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("account_user_idx").on(t.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);

/** Listings starred by a signed-in user; mirrors the browser shortlist. */
export const favorite = pgTable(
  "favorite",
  {
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    listingId: text("listing_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.listingId] })],
);

/** Saved listing searches ("hlídací pes"); query is the URL search string. */
export const savedSearch = pgTable(
  "saved_search",
  {
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    query: text("query").notNull(),
    label: text("label").notNull(),
    savedAt: timestamp("saved_at", { withTimezone: true }).notNull().defaultNow(),
    /** last time the daily watchdog run reported new listings for this search */
    notifiedAt: timestamp("notified_at", { withTimezone: true }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.query] })],
);

/** A photo stored in R2 under key; width and height after the browser resized it. */
export interface ListingPhoto {
  key: string;
  width: number;
  height: number;
}

export const LISTING_STATUSES = ["draft", "pending", "published", "rejected", "withdrawn"] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

/** Car listings placed by users. The vehicle fields stay one JSON object, checked by draftProblems. */
export const listing = pgTable(
  "listing",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    status: text("status").$type<ListingStatus>().notNull().default("draft"),
    data: jsonb("data").$type<Draft>().notNull(),
    photos: jsonb("photos").$type<ListingPhoto[]>().notNull().default([]),
    phone: text("phone"),
    /** messengers reachable on the same phone number: whatsapp | telegram | viber */
    messengers: jsonb("messengers").$type<Messenger[]>().notNull().default([]),
    rejectReason: text("reject_reason"),
    /** reasons the automatic review sent the listing to a moderator (lib/moderation) */
    moderationFlags: jsonb("moderation_flags").$type<string[]>().notNull().default([]),
    moderatedBy: text("moderated_by").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
  },
  (t) => [index("listing_user_idx").on(t.userId), index("listing_status_idx").on(t.status, t.submittedAt)],
);

/** "deti": sexual abuse or exploitation of children (directive 2011/93/EU art. 3-7); such a notice
 *  may be sent without a name and e-mail (DSA art. 16(2)(c)). */
export const REPORT_CATEGORIES = ["podvod", "nezakonny", "nepravdive", "deti", "jine"] as const;
export type ReportCategory = (typeof REPORT_CATEGORIES)[number];

/**
 * Notices about listings (DSA art. 16): who reported what and why, and the decision. Kept after
 * the decision as the record of how each notice was handled.
 */
export const report = pgTable(
  "report",
  {
    id: text("id").primaryKey(),
    listingId: text("listing_id").notNull().references(() => listing.id, { onDelete: "cascade" }),
    category: text("category").$type<ReportCategory>().notNull(),
    explanation: text("explanation").notNull(),
    /** empty for an anonymous notice (category "deti") */
    notifierName: text("notifier_name").notNull(),
    notifierEmail: text("notifier_email").notNull(),
    /** set when the notifier was signed in */
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    /** open | removed (listing taken down) | dismissed */
    status: text("status").$type<"open" | "removed" | "dismissed">().notNull().default("open"),
    decision: text("decision"),
    decidedBy: text("decided_by").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    decidedAt: timestamp("decided_at", { withTimezone: true }),
  },
  (t) => [index("report_listing_idx").on(t.listingId), index("report_status_idx").on(t.status, t.createdAt)],
);

/**
 * A chat: buyer and seller about one listing (id l-<listing>-<buyer>), or a user's "Vozodrom"
 * system thread with notifications (id s-<user>). Deterministic ids make creation idempotent.
 */
export const conversation = pgTable(
  "conversation",
  {
    id: text("id").primaryKey(),
    kind: text("kind").$type<"listing" | "system">().notNull(),
    listingId: text("listing_id").references(() => listing.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true }).notNull().defaultNow(),
    lastMessagePreview: text("last_message_preview").notNull().default(""),
  },
  (t) => [index("conversation_listing_idx").on(t.listingId)],
);

export const conversationMember = pgTable(
  "conversation_member",
  {
    conversationId: text("conversation_id").notNull().references(() => conversation.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    /** buyer | seller in listing chats, owner of a system thread */
    role: text("role").$type<"buyer" | "seller" | "owner">().notNull(),
    lastReadAt: timestamp("last_read_at", { withTimezone: true }),
  },
  (t) => [primaryKey({ columns: [t.conversationId, t.userId] }), index("conversation_member_user_idx").on(t.userId)],
);

export const message = pgTable(
  "message",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id").notNull().references(() => conversation.id, { onDelete: "cascade" }),
    /** null for notifications from Vozodrom */
    senderId: text("sender_id").references(() => user.id, { onDelete: "set null" }),
    body: text("body").notNull(),
    /** optional site path a notification points to, e.g. /admin/hlaseni/ */
    link: text("link"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("message_conversation_idx").on(t.conversationId, t.createdAt)],
);

// ---------------------------------------------------------------------------------------------
// Garage and logbooks: owners keep a page for each of their cars and write what they repaired,
// changed or spent. Public at once; moderators hide what is reported.

/** A car in its owner's garage. The vehicle fields stay one JSON object, checked by cleanCarData. */
export const garageCar = pgTable(
  "garage_car",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    /** copies of data.brand and data.model, for the logbook feed's filters */
    makeSlug: text("make_slug").notNull(),
    lineSlug: text("line_slug").notNull(),
    data: jsonb("data").$type<CarData>().notNull(),
    photos: jsonb("photos").$type<ListingPhoto[]>().notNull().default([]),
    /** a car the owner had before; it keeps its page and logbook */
    former: boolean("former").notNull().default(false),
    /** hidden by a moderator; the owner still sees it, with the reason */
    hiddenReason: text("hidden_reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("garage_car_user_idx").on(t.userId), index("garage_car_line_idx").on(t.makeSlug, t.lineSlug)],
);

/** One logbook entry about a car: a repair, a service, a change, a trip. */
export const logEntry = pgTable(
  "log_entry",
  {
    id: text("id").primaryKey(),
    carId: text("car_id").notNull().references(() => garageCar.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    body: text("body").notNull().default(""),
    /** ENTRY_CATEGORIES key */
    category: text("category").notNull(),
    /** what it cost in CZK, as the owner states it */
    costCzk: integer("cost_czk"),
    mileageKm: integer("mileage_km"),
    /** the day it happened, YYYY-MM-DD */
    happenedOn: text("happened_on").notNull(),
    photos: jsonb("photos").$type<ListingPhoto[]>().notNull().default([]),
    hiddenReason: text("hidden_reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("log_entry_car_idx").on(t.carId, t.happenedOn), index("log_entry_created_idx").on(t.createdAt)],
);

export const entryComment = pgTable(
  "entry_comment",
  {
    id: text("id").primaryKey(),
    entryId: text("entry_id").notNull().references(() => logEntry.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    hiddenReason: text("hidden_reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("entry_comment_entry_idx").on(t.entryId, t.createdAt)],
);

/** Likes of logbook entries. */
export const entryLike = pgTable(
  "entry_like",
  {
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    entryId: text("entry_id").notNull().references(() => logEntry.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.entryId] }), index("entry_like_entry_idx").on(t.entryId)],
);

/** Likes of cars ("líbí se"). */
export const carLike = pgTable(
  "car_like",
  {
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    carId: text("car_id").notNull().references(() => garageCar.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.carId] }), index("car_like_car_idx").on(t.carId)],
);

/** Followers of a car get a notification about each new logbook entry. */
export const carFollow = pgTable(
  "car_follow",
  {
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    carId: text("car_id").notNull().references(() => garageCar.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.carId] }), index("car_follow_car_idx").on(t.carId)],
);

export const COMMUNITY_TARGETS = ["car", "entry", "comment"] as const;
export type CommunityTarget = (typeof COMMUNITY_TARGETS)[number];

/** Reports of garage cars, logbook entries and comments by signed-in users; moderators hide or dismiss. */
export const communityReport = pgTable(
  "community_report",
  {
    id: text("id").primaryKey(),
    kind: text("kind").$type<CommunityTarget>().notNull(),
    targetId: text("target_id").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    reason: text("reason").notNull(),
    /** open | hidden (the content was hidden) | dismissed */
    status: text("status").$type<"open" | "hidden" | "dismissed">().notNull().default("open"),
    decidedBy: text("decided_by").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    decidedAt: timestamp("decided_at", { withTimezone: true }),
  },
  (t) => [index("community_report_status_idx").on(t.status, t.createdAt), index("community_report_target_idx").on(t.kind, t.targetId)],
);

// ---------------------------------------------------------------------------------------------
// Catalogue edits by admins. The catalogue is built from files into static pages; an edit is
// stored here at once and reaches the pages with the next deploy (the build fetches them).

export const catalogEdit = pgTable(
  "catalog_edit",
  {
    id: text("id").primaryKey(),
    makeSlug: text("make_slug").notNull(),
    lineSlug: text("line_slug").notNull(),
    /** index of the generation in the model card; null for the model line itself */
    genIndex: integer("gen_index"),
    /** CATALOG_EDIT_FIELDS key */
    field: text("field").notNull(),
    value: text("value").notNull(),
    authorId: text("author_id").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("catalog_edit_line_idx").on(t.makeSlug, t.lineSlug, t.createdAt)],
);
