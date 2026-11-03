import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArticleCard } from "@/components/ArticleCard";
import { allArticles, canEditArticles, findArticle } from "@/lib/article-store";
import { readingMinutes } from "@/lib/articles";
import { getSession } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { Markup } from "@/lib/markup";
import { ArticleAdmin } from "./ArticleAdmin";

// An article. Rendered on request, since staff change articles on the site (lib/article-store);
// moderators and admins see "Upravit" and "Smazat" above it.

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  await connection();
  const article = await findArticle((await params).slug);
  return article ? { title: article.title, description: article.perex } : {};
}

export default async function ArticlePage({ params }: { params: Params }) {
  await connection();
  const article = await findArticle((await params).slug);
  if (!article) notFound();
  const [all, session] = await Promise.all([allArticles(), getSession()]);
  const more = all.filter((a) => a.slug !== article.slug).slice(0, 3);

  const content = (
    <article>
      <p className="text-xs uppercase tracking-wide text-[var(--color-brand)]">{article.category} · {formatDate(article.date)} · {readingMinutes(article)} min čtení</p>
      <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1 leading-tight">{article.title}</h1>
      <p className="mt-3 text-lg text-[var(--color-muted)]">{article.perex}</p>
      <Markup text={article.body} className="mt-6 leading-relaxed" />
      {article.sources.length > 0 && (
        <p className="mt-8 text-xs text-[var(--color-muted)]">Zdroje: {article.sources.join("; ")}. Informace jsou orientační, nenahrazují právní radu.</p>
      )}
    </article>
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav className="mb-3 text-sm text-[var(--color-muted)]">
        <Link href="/novinky/" className="hover:text-[var(--color-ink)]">Novinky a rady</Link> / {article.category}
      </nav>
      {canEditArticles(session) ? <ArticleAdmin article={article}>{content}</ArticleAdmin> : content}
      {more.length > 0 && (
        <section className="mt-10">
          <h2 className="font-bold mb-3">Další články</h2>
          <ul className="grid gap-3">
            {more.map((a) => (
              <li key={a.slug}><ArticleCard article={a} /></li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
