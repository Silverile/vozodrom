import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrand, getModel } from "@/lib/catalog";
import { FORUM_CATEGORIES, getThread, threads, threadsIn } from "@/lib/forum";
import { formatDate, formatNumber } from "@/lib/format";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return threads.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const thread = getThread((await params).slug);
  return { title: thread ? `${thread.title} — fórum` : "Fórum" };
}

export default async function ThreadPage({ params }: { params: Params }) {
  const thread = getThread((await params).slug);
  if (!thread) notFound();
  const category = FORUM_CATEGORIES.find((c) => c.slug === thread.category)!;
  const brand = thread.model && getBrand(thread.model.brand);
  const model = thread.model && getModel(thread.model.brand, thread.model.model);
  const related = threadsIn(thread.category).filter((t) => t.slug !== thread.slug);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <nav className="text-sm text-[var(--color-muted)]">
        <Link href="/forum/" className="hover:text-[var(--color-ink)]">Fórum</Link> / {category.label}
      </nav>
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">{thread.title}</h1>
      <p className="text-sm text-[var(--color-muted)] mt-1">
        {thread.posts.length - 1} odpovědí · {formatNumber(thread.views)} zobrazení*
        {brand && model && (
          <>
            {" · "}
            <Link href={`/katalog/${thread.model!.brand}/${thread.model!.model}/`} className="text-[var(--color-brand)] hover:underline">
              {brand.name} {model.name} v katalogu
            </Link>
          </>
        )}
      </p>

      <ol className="mt-6 space-y-3">
        {thread.posts.map((p, i) => (
          <li key={i} className={`card p-4 ${p.solution ? "!border-[var(--color-good)]" : ""}`}>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <p>
                <b>{p.author}</b>
                {i === 0 && <span className="ml-2 chip bg-[var(--color-field)] text-[var(--color-ink-soft)]">autor tématu</span>}
                {p.solution && <span className="ml-2 chip bg-[var(--color-good-soft)] text-[var(--color-good)]">✓ pomohlo autorovi</span>}
              </p>
              <span className="text-xs text-[var(--color-muted)]">{formatDate(p.date)}</span>
            </div>
            <p className="mt-2">{p.text}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-[var(--color-muted)]">
              <span className="chip bg-[var(--color-warn-soft)] text-[var(--color-warn)]">testovací příspěvek</span>
              <button className="ml-auto hover:text-[var(--color-ink)] disabled:opacity-60" disabled title="Po spuštění účtů">⚑ Nahlásit</button>
            </div>
          </li>
        ))}
      </ol>

      <div className="card p-4 mt-4 text-sm text-[var(--color-muted)]">
        Odpovídat půjde po spuštění účtů. Před psaním si přečtěte <Link href="/forum/pravidla/" className="text-[var(--color-brand)] hover:underline">pravidla fóra</Link>.
      </div>

      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="font-bold mb-2">Další v kategorii {category.label}</h2>
          <ul className="space-y-1">
            {related.map((t) => (
              <li key={t.slug}><Link href={`/forum/${t.slug}/`} className="hover:text-[var(--color-brand)]">{t.title}</Link></li>
            ))}
          </ul>
        </section>
      )}
      <p className="mt-8 text-xs text-[var(--color-muted)]">* Počty zobrazení jsou v prototypu smyšlené.</p>
    </div>
  );
}
