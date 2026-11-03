import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { ArticleCard } from "@/components/ArticleCard";
import { allArticles, canEditArticles } from "@/lib/article-store";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Novinky a rady pro motoristy",
  description: "Praktické rady k nákupu a prodeji auta, přepisu, pneumatikám a elektromobilům.",
};

// The article list, newest first; rendered on request because staff add and change articles here.
export default async function NewsPage() {
  await connection();
  const [articles, session] = await Promise.all([allArticles(), getSession()]);
  const [lead, ...rest] = articles;
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Novinky a rady</h1>
          <p className="mt-1 text-[var(--color-muted)] max-w-2xl">Praktické rady k nákupu, prodeji a provozu auta. Bez clickbaitu a se zdroji.</p>
        </div>
        {canEditArticles(session) && <Link href="/novinky/novy/" className="btn-cta text-sm">+ Nový článek</Link>}
      </div>

      {lead ? (
        <>
          <div className="mt-6">
            <ArticleCard article={lead} variant="feature" />
          </div>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {rest.map((a) => (
              <li key={a.slug}><ArticleCard article={a} /></li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-6 text-[var(--color-muted)]">Zatím tu není žádný článek.</p>
      )}
    </div>
  );
}
