import Link from "next/link";
import { type Article, readingMinutes } from "@/lib/articles";
import { formatDate } from "@/lib/format";
import { firstImage } from "@/lib/markup";
import { CategoryIcon } from "./CategoryIcon";

/**
 * Article teaser. "row": compact cover on the left, text on the right (home page, lists);
 * "feature": wide cover above the text (lead article on /novinky/).
 */
export function ArticleCard({ article, variant = "row" }: { article: Article; variant?: "row" | "feature" }) {
  const meta = (
    <p className="text-[13px] text-[var(--color-muted)]">
      <span className="font-semibold text-[var(--color-brand)]">{article.category}</span>
      {" · "}
      {formatDate(article.date)} · {readingMinutes(article)} min čtení
    </p>
  );
  // the article's first photo, else its pictogram
  const photo = firstImage(article.body);
  const cover = (size: string) =>
    photo ? (
      <img src={photo.src} alt="" loading="lazy" className={`h-full w-full object-cover bg-[var(--color-photo)] ${size}`} />
    ) : (
      <div className={`grid place-items-center bg-[var(--color-brand-soft)] ${size}`}>
        <CategoryIcon slug={article.icon} className="w-[60%] text-[var(--color-ink)]" />
      </div>
    );

  if (variant === "feature") {
    return (
      <Link href={`/novinky/${article.slug}/`} className="rounded-[14px] bg-[var(--color-surface)] overflow-hidden grid sm:grid-cols-[280px_1fr] hover:bg-[var(--color-field)] transition-colors">
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
    <Link href={`/novinky/${article.slug}/`} className="rounded-[14px] bg-[var(--color-surface)] overflow-hidden grid grid-cols-[88px_1fr] sm:grid-cols-[112px_1fr] hover:bg-[var(--color-field)] transition-colors">
      {cover("h-full min-h-24")}
      <div className="p-3 min-w-0">
        {meta}
        <h3 className="font-semibold leading-snug mt-1">{article.title}</h3>
        <p className="mt-1 text-sm text-[var(--color-muted)] line-clamp-2">{article.perex}</p>
      </div>
    </Link>
  );
}
