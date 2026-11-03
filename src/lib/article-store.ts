import "server-only";

import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { article } from "@/db/schema";
import { ARTICLE_CATEGORIES, ARTICLE_ICONS, type Article, builtInArticles, slugify } from "./articles";
import { STAFF_ROLES, type Session, hasRole } from "./auth";
import { ListingError } from "./listing-store";

// Articles as the site shows them: the built-in ones (lib/articles) with staff's stored articles on
// top. A stored article replaces a built-in one with the same slug; a deleted one hides it. Staff
// (moderators and admins) write them on the article pages.

type Row = typeof article.$inferSelect;

const toArticle = (r: Row): Article => ({
  slug: r.slug,
  category: r.category,
  title: r.title,
  perex: r.perex,
  date: r.publishedOn,
  icon: r.icon,
  body: r.body,
  sources: r.sources,
});

/** All articles, newest first. */
export async function allArticles(): Promise<Article[]> {
  const rows = await getDb().select().from(article);
  const stored = new Map(rows.map((r) => [r.slug, r]));
  const list = [
    ...builtInArticles.filter((a) => !stored.has(a.slug)),
    ...rows.filter((r) => !r.deleted).map(toArticle),
  ];
  return list.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "cs"));
}

export async function findArticle(slug: string): Promise<Article | undefined> {
  const [row] = await getDb().select().from(article).where(eq(article.slug, slug)).limit(1);
  if (row) return row.deleted ? undefined : toArticle(row);
  return builtInArticles.find((a) => a.slug === slug);
}

export const canEditArticles = (session: Session | null) => hasRole(session, STAFF_ROLES);

export interface ArticleInput {
  title: string;
  perex: string;
  category: string;
  icon: string;
  date: string;
  body: string;
  sources: string[];
}

/** Checks an article from the editor; the reason it is refused, or the clean article. */
export function cleanArticle(raw: unknown): ArticleInput | string {
  const b = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const input: ArticleInput = {
    title: text(b.title, 160),
    perex: text(b.perex, 400),
    category: text(b.category, 40),
    icon: text(b.icon, 40),
    date: text(b.date, 10),
    body: text(b.body, 40_000),
    sources: (Array.isArray(b.sources) ? b.sources : []).map((s) => text(s, 300)).filter(Boolean).slice(0, 20),
  };
  if (input.title.length < 5) return "Napište nadpis (alespoň 5 znaků).";
  if (input.perex.length < 20) return "Napište úvod (alespoň 20 znaků).";
  if (input.body.length < 50) return "Text je příliš krátký (alespoň 50 znaků).";
  if (!(ARTICLE_CATEGORIES as readonly string[]).includes(input.category)) return "Vyberte rubriku.";
  if (!(input.icon in ARTICLE_ICONS)) return "Vyberte obrázek.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || Number.isNaN(Date.parse(input.date))) return "Zadejte datum.";
  return input;
}

/** Saves an article: a new one (slug null) gets a slug from its title; an existing one keeps its slug. */
export async function saveArticle(session: Session | null, slug: string | null, raw: unknown): Promise<string> {
  if (!canEditArticles(session)) throw new ListingError(403, "Jen pro redakci.");
  const input = cleanArticle(raw);
  if (typeof input === "string") throw new ListingError(422, input);
  const db = getDb();
  const now = new Date();
  const values = {
    category: input.category,
    title: input.title,
    perex: input.perex,
    body: input.body,
    icon: input.icon,
    sources: input.sources,
    publishedOn: input.date,
    deleted: false,
    updatedBy: session!.user.id,
    updatedAt: now,
  };

  if (slug) {
    const exists = (await findArticle(slug)) !== undefined;
    if (!exists) throw new ListingError(404, "Článek nenalezen.");
    await db
      .insert(article)
      .values({ slug, ...values, authorId: session!.user.id })
      .onConflictDoUpdate({ target: article.slug, set: values });
    return slug;
  }

  // a new article: its slug from the title, made unique against built-in and stored ones
  const base = slugify(input.title) || "clanek";
  // "novy" is the address of the new-article page
  const taken = new Set(["novy", ...builtInArticles.map((a) => a.slug), ...(await db.select({ slug: article.slug }).from(article)).map((r) => r.slug)]);
  let fresh = base;
  for (let n = 2; taken.has(fresh); n++) fresh = `${base}-${n}`;
  await db.insert(article).values({ slug: fresh, ...values, authorId: session!.user.id, createdAt: now });
  return fresh;
}

/** Deletes an article: a stored one is marked deleted (and so is a built-in one, by a stored mark). */
export async function deleteArticle(session: Session | null, slug: string) {
  if (!canEditArticles(session)) throw new ListingError(403, "Jen pro redakci.");
  const current = await findArticle(slug);
  if (!current) throw new ListingError(404, "Článek nenalezen.");
  const now = new Date();
  await getDb()
    .insert(article)
    .values({
      slug,
      category: current.category,
      title: current.title,
      perex: current.perex,
      body: current.body,
      icon: current.icon,
      sources: current.sources,
      publishedOn: current.date,
      deleted: true,
      authorId: session!.user.id,
      updatedBy: session!.user.id,
      updatedAt: now,
    })
    .onConflictDoUpdate({ target: article.slug, set: { deleted: true, updatedBy: session!.user.id, updatedAt: now } });
}
