import Link from "next/link";
import { type Article, readingMinutes } from "@/lib/articles";
import { formatDate } from "@/lib/format";
import { CategoryIcon } from "./CategoryIcon";

/**
 * Article teaser. "row": compact cover on the left, text on the right (home page, lists);
 * "feature": wide cover above the text (lead article on /novinky/).
 */
export function ArticleCard({ article, variant = "row" }: { article: Article; variant?: "row" | "feature" }) {
  const meta = (
    <p className="text-xs text-[var(--color-muted)]">
      <span className="font-semibold uppercase tracking-wide text-[var(--color-brand)]">{article.category}</span>
      {" · "}
      {formatDate(article.date)} · {readingMinutes(article)} min čtení
    </p>
  );
  const cover = (size: string) => (
    <div className={`grid place-items-center bg-[var(--color-photo)] bg-[radial-gradient(circle_at_50%_45%,var(--color-brand-soft)_0%,transparent_65%)] ${size}`}>
      <CategoryIcon slug={article.icon} className="w-[60%] text-[var(--color-ink)]" />
    </div>
  );

  if (variant === "feature") {
    return (
      <Link href={`/novinky/${article.slug}/`} className="card overflow-hidden grid sm:grid-cols-[280px_1fr] hover:border-[var(--color-brand)] transition-colors">
        {cover("aspect-[16/9] sm:aspect-auto sm:min-h-44")}
        <div className="p-5">
          {meta}
          <h2 className="text-xl sm:text-2xl font-bold mt-1 leading-snug">{article.title}</h2>
          <p className="mt-2 text-[var(--color-muted)]">{article.perex}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/novinky/${article.slug}/`} className="card overflow-hidden grid grid-cols-[88px_1fr] sm:grid-cols-[112px_1fr] hover:border-[var(--color-brand)] transition-colors">
      {cover("h-full min-h-24")}
      <div className="p-3 min-w-0">
        {meta}
        <h3 className="font-semibold leading-snug mt-1">{article.title}</h3>
        <p className="mt-1 text-sm text-[var(--color-muted)] line-clamp-2">{article.perex}</p>
      </div>
    </Link>
  );
}
