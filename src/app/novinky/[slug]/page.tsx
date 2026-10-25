import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { articles, getArticle, readingMinutes } from "@/lib/articles";
import { formatDate } from "@/lib/format";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const article = getArticle((await params).slug);
  return article ? { title: article.title, description: article.perex } : {};
}

export default async function ArticlePage({ params }: { params: Params }) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  const more = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav className="text-sm text-[var(--color-muted)]">
        <Link href="/novinky/" className="hover:text-[var(--color-ink)]">Novinky a rady</Link> / {article.category}
      </nav>
      <article className="mt-3">
        <p className="text-xs uppercase tracking-wide text-[var(--color-brand)]">{article.category} · {formatDate(article.date)} · {readingMinutes(article)} min čtení</p>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1 leading-tight">{article.title}</h1>
        <p className="mt-3 text-lg text-[var(--color-muted)]">{article.perex}</p>
        <div className="mt-6 space-y-4 leading-relaxed">
          {article.body.map((b, i) => (
            <div key={i} className="space-y-2">
              {b.heading && <h2 className="text-xl font-bold pt-2">{b.heading}</h2>}
              {b.text && <p>{b.text}</p>}
              {b.list && <ul className="list-disc pl-6 space-y-1">{b.list.map((li) => <li key={li}>{li}</li>)}</ul>}
              {b.link && <Link href={b.link.href} className="pill inline-block">{b.link.label} →</Link>}
            </div>
          ))}
        </div>
        {article.sources && (
          <p className="mt-8 text-xs text-[var(--color-muted)]">Zdroje: {article.sources.join("; ")}. Informace jsou orientační, nenahrazují právní radu.</p>
        )}
      </article>
      <section className="mt-10">
        <h2 className="font-bold mb-3">Další články</h2>
        <ul className="grid gap-3">
          {more.map((a) => (
            <li key={a.slug}><ArticleCard article={a} /></li>
          ))}
        </ul>
      </section>
    </div>
  );
}
