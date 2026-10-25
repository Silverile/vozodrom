import type { Metadata } from "next";
import Link from "next/link";
import { FORUM_CATEGORIES, lastActivity, threads, threadsIn } from "@/lib/forum";
import { formatAgo, formatNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "Fórum motoristů",
  description: "Otázky a odpovědi o výběru auta, opravách, elektromobilech, úřadech a pneumatikách.",
};

export default function ForumPage() {
  const latest = [...threads].sort((a, b) => lastActivity(b).localeCompare(lastActivity(a))).slice(0, 5);
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Fórum</h1>
          <p className="mt-1 text-[var(--color-muted)] max-w-2xl">
            Ptejte se lidí, kteří stejné auto mají nebo stejnou situaci řešili. V prototypu jsou vlákna testovací.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/forum/pravidla/" className="pill">Pravidla fóra</Link>
          <button className="pill" disabled aria-disabled="true">✎ Nové téma (po spuštění účtů)</button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] mt-6 items-start">
        <div className="space-y-6">
          {FORUM_CATEGORIES.map((c) => (
            <section key={c.slug} className="card overflow-hidden">
              <header className="px-4 py-3 border-b border-[var(--color-line)]">
                <h2 className="font-bold">{c.label}</h2>
                <p className="text-sm text-[var(--color-muted)]">{c.description}</p>
              </header>
              <ul className="divide-y divide-[var(--color-line)]">
                {threadsIn(c.slug).map((t) => (
                  <li key={t.slug} className="px-4 py-3 flex items-center justify-between gap-4 hover:bg-[var(--color-field)]">
                    <div className="min-w-0">
                      <Link href={`/forum/${t.slug}/`} className="font-semibold hover:text-[var(--color-brand)]">{t.title}</Link>
                      <p className="text-xs text-[var(--color-muted)] mt-0.5">
                        {t.posts[0].author} · poslední příspěvek {formatAgo(lastActivity(t))}
                        {t.posts.some((p) => p.solution) && <span className="ml-2 text-[var(--color-good)]">✓ vyřešeno</span>}
                      </p>
                    </div>
                    <div className="text-right text-xs text-[var(--color-muted)] shrink-0">
                      <p><b className="text-[var(--color-ink)]">{t.posts.length - 1}</b> odpovědí</p>
                      <p>{formatNumber(t.views)} zobrazení*</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <aside className="space-y-4 lg:sticky lg:top-28">
          <section className="card p-4">
            <h2 className="font-bold">Nejnovější aktivita</h2>
            <ul className="mt-2 space-y-2 text-sm">
              {latest.map((t) => (
                <li key={t.slug}>
                  <Link href={`/forum/${t.slug}/`} className="hover:text-[var(--color-brand)]">{t.title}</Link>
                  <p className="text-xs text-[var(--color-muted)]">{formatAgo(lastActivity(t))}</p>
                </li>
              ))}
            </ul>
          </section>
          <section className="card p-4 text-sm text-[var(--color-muted)]">
            <p>
              Fórum bude moderované. Každý příspěvek půjde nahlásit; o nahlášení rozhodneme a autorovi sdělíme důvod.{" "}
              <Link href="/forum/pravidla/" className="text-[var(--color-brand)] hover:underline">Pravidla</Link>
            </p>
          </section>
        </aside>
      </div>
      <p className="mt-8 text-xs text-[var(--color-muted)]">* Počty zobrazení jsou v prototypu smyšlené.</p>
    </div>
  );
}
