import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { brands, models } from "@/lib/catalog";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "Recenze majitelů aut",
  description: "Hodnocení a zkušenosti majitelů podle modelů: spolehlivost, pohodlí, jízda a náklady na provoz.",
};

const score = (v: number) => v.toLocaleString("cs-CZ", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function ReviewsPage() {
  const top = [...models].sort((a, b) => b.ownerScore - a.ownerScore).slice(0, 6);
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Recenze majitelů</h1>
      <p className="mt-1 text-[var(--color-muted)] max-w-2xl">
        Zkušenosti lidí, kteří autem opravdu jezdí. V prototypu jsou recenze testovací; po spuštění účtů je budou psát majitelé
        a každá bude mít uvedeno, jak dlouho a s jakým motorem autor vůz vlastní.
      </p>

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-3">Nejlépe hodnocené</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {top.map((m) => {
            const brand = brands.find((b) => b.slug === m.brandSlug)!;
            return (
              <li key={`${m.brandSlug}-${m.slug}`}>
                <Link href={`/recenze/${m.brandSlug}/${m.slug}/`} className="card p-4 flex items-center justify-between gap-3 hover:border-[var(--color-brand)]">
                  <span>
                    <span className="block font-semibold">{brand.name} {m.name}</span>
                    <span className="block text-sm text-[var(--color-muted)]">{formatNumber(m.reviews)} recenzí*</span>
                    <span className="mt-1.5 flex flex-wrap gap-1">
                      {m.pros.slice(0, 2).map((p) => <span key={p.label} className="chip bg-[var(--color-good-soft)] text-[var(--color-good)]">{p.label}</span>)}
                    </span>
                  </span>
                  <span className="rounded-lg bg-[var(--color-brand)] text-[var(--color-brand-ink)] px-2.5 py-1 text-2xl font-extrabold">{score(m.ownerScore)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold mb-3">Všechny modely</h2>
        <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((b) => (
            <div key={b.slug}>
              <h3 className="flex items-center gap-2 text-sm uppercase tracking-wide text-[var(--color-muted)] mb-1">
                <BrandLogo slug={b.slug} name={b.name} className="h-5 w-5" />
                {b.name}
              </h3>
              <ul>
                {models.filter((m) => m.brandSlug === b.slug).map((m) => (
                  <li key={m.slug}>
                    <Link href={`/recenze/${b.slug}/${m.slug}/`} className="flex justify-between gap-3 py-1 hover:text-[var(--color-brand)]">
                      <span>{m.name}</span>
                      <span className="font-semibold">{score(m.ownerScore)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <p className="mt-8 text-xs text-[var(--color-muted)]">* Počty a hodnocení jsou v prototypu smyšlené.</p>
    </div>
  );
}
