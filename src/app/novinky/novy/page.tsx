import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { canEditArticles } from "@/lib/article-store";
import { getSession } from "@/lib/auth";
import { ArticleEditor } from "../ArticleEditor";

export const metadata: Metadata = { title: "Nový článek", robots: { index: false } };

// A new article, for moderators and admins.
export default async function NewArticlePage() {
  await connection();
  if (!canEditArticles(await getSession())) notFound();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav className="text-sm text-[var(--color-muted)]">
        <Link href="/novinky/" className="hover:text-[var(--color-ink)]">Novinky a rady</Link> / Nový článek
      </nav>
      <h1 className="mt-1 mb-6 text-2xl sm:text-3xl font-extrabold tracking-tight">Nový článek</h1>
      <ArticleEditor />
    </div>
  );
}
