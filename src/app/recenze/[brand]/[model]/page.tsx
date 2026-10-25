import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bar } from "@/components/Bar";
import { getBrand, getModel, models } from "@/lib/catalog";
import { formatDate, formatKm, formatNumber } from "@/lib/format";
import { listingsOf } from "@/lib/listings";
import { ASPECTS, aspectAverages, reviewsOf } from "@/lib/reviews";

type Params = Promise<{ brand: string; model: string }>;

export function generateStaticParams() {
  return models.map((m) => ({ brand: m.brandSlug, model: m.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { brand, model } = await params;
  const b = getBrand(brand);
  const m = getModel(brand, model);
  return { title: b && m ? `${b.name} ${m.name} — recenze majitelů` : "Recenze" };
}

const score = (v: number) => v.toLocaleString("cs-CZ", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default async function ModelReviewsPage({ params }: { params: Params }) {
  const { brand: brandSlug, model: modelSlug } = await params;
  const brand = getBrand(brandSlug);
  const model = getModel(brandSlug, modelSlug);
  if (!brand || !model) notFound();
  const list = reviewsOf(brandSlug, modelSlug);
  const averages = aspectAverages(list);
  const recommend = list.filter((r) => r.recommends).length;
  const offers = listingsOf(brandSlug, modelSlug).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-[var(--color-muted)]">
        <Link href="/recenze/" className="hover:text-[var(--color-ink)]">Recenze</Link> / {brand.name}
      </nav>
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">{brand.name} {model.name}: recenze majitelů</h1>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr] mt-5 items-start">
        <aside className="space-y-4 lg:sticky lg:top-28">
          <section className="card p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-[var(--color-muted)]">Celkové hodnocení · {formatNumber(model.reviews)} recenzí*</p>
                <p className="text-sm mt-1">{recommend} z {list.length} ukázkových recenzí auto doporučuje</p>
              </div>
              <span className="rounded-lg bg-[var(--color-brand)] text-[var(--color-brand-ink)] px-2.5 py-1 text-3xl font-extrabold">{score(model.ownerScore)}</span>
            </div>
            <div className="mt-4 space-y-2.5">
              {ASPECTS.map((a) => <Bar key={a} label={a} value={averages[a]} max={10} display={score(averages[a])} />)}
            </div>
          </section>
          <section className="card p-4 text-sm space-y-3">
            <div>
              <h2 className="text-xs font-semibold text-[var(--color-muted)]">Co majitelé chválí</h2>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {model.pros.map((p) => <span key={p.label} className="chip bg-[var(--color-good-soft)] text-[var(--color-good)]">{p.label} <b className="opacity-70">{formatNumber(p.count)}</b></span>)}
              </div>
            </div>
            <div>
              <h2 className="text-xs font-semibold text-[var(--color-muted)]">Co vadí</h2>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {model.cons.map((p) => <span key={p.label} className="chip bg-[var(--color-warn-soft)] text-[var(--color-warn)]">{p.label} <b className="opacity-70">{formatNumber(p.count)}</b></span>)}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link href={`/katalog/${brandSlug}/${modelSlug}/`} className="pill">Katalog a STK</Link>
              <Link href={`/inzeraty/?znacka=${brandSlug}&model=${modelSlug}`} className="pill">{offers} v prodeji</Link>
            </div>
          </section>
        </aside>

        <section className="space-y-3 min-w-0">
          <div className="card p-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[var(--color-muted)]">Jezdíte {brand.name} {model.name}? Recenzi půjde napsat po spuštění účtů.</p>
            <button className="pill" disabled aria-disabled="true">✎ Napsat recenzi</button>
          </div>
          {list.map((r) => (
            <article key={r.id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{r.author}</p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {r.year} · {r.engine} · vlastní {r.ownedYears} {r.ownedYears === 1 ? "rok" : r.ownedYears < 5 ? "roky" : "let"} · najeto {formatKm(r.mileageKm)} · {formatDate(r.postedAt)}
                  </p>
                </div>
                <span className="rounded-lg bg-[var(--color-field)] px-2 py-0.5 text-lg font-extrabold">{r.overall}<span className="text-xs text-[var(--color-muted)] font-normal">/10</span></span>
              </div>
              <p className="mt-3">{r.text}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 text-sm">
                <p><b className="text-[var(--color-good)]">+</b> {r.plus.join(", ")}</p>
                <p><b className="text-[var(--color-warn)]">−</b> {r.minus.join(", ")}</p>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted)]">
                <span className="chip bg-[var(--color-warn-soft)] text-[var(--color-warn)]">testovací recenze</span>
                <span>{r.recommends ? "👍 Doporučuje" : "👎 Nedoporučuje"}</span>
                <span className="ml-auto">Nahlásit půjde po spuštění účtů</span>
              </div>
            </article>
          ))}
        </section>
      </div>
      <p className="mt-8 text-xs text-[var(--color-muted)]">* Počty a hodnocení jsou v prototypu smyšlené.</p>
    </div>
  );
}
