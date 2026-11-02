import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { ArticleCard } from "@/components/ArticleCard";
import { brands, models } from "@/lib/catalog";
import { formatNumber } from "@/lib/format";
import { articles } from "@/lib/articles";
import { itemsOf } from "@/lib/classifieds";
import { lastActivity, threads } from "@/lib/forum";
import { listings } from "@/lib/listings";
import { SECTIONS } from "@/lib/sections";
import { LatestListings } from "@/components/LatestListings";
import { newestFrontDrawing } from "@/components/FrontDrawing";
import { popularLines } from "@/lib/popular-lines";
import { HomeLogbooks } from "./HomeLogbooks";
import { HomeSearch } from "./HomeSearch";
import { HomeStory } from "./HomeStory";
import { OwnerPicker } from "./OwnerPicker";

const QUICK = [
  { label: "Rodinná kombi", query: "karoserie=kombi" },
  { label: "SUV", query: "karoserie=suv" },
  { label: "Elektro", query: "palivo=elektro" },
  { label: "Hybrid", query: "palivo=hybrid" },
  { label: "Automat", query: "prevodovka=automat" },
  { label: "Do 200 000 Kč", query: "cenaDo=200000" },
];

const OTHER_SECTIONS = SECTIONS.filter((s) => s.group === "market" && s.key !== "auto").map((s) => ({
  href: s.href,
  label: s.label,
  count: itemsOf(s.key as Parameters<typeof itemsOf>[0]).length,
}));

const brandStats = brands
  .map((brand) => {
    const own = listings.filter((l) => l.brandSlug === brand.slug);
    const top = models
      .filter((m) => m.brandSlug === brand.slug)
      .map((model) => ({ model, n: own.filter((l) => l.modelSlug === model.slug).length }))
      .sort((a, b) => b.n - a.n)
      .slice(0, 3);
    return { brand, count: own.length, top };
  })
  .sort((a, b) => b.count - a.count || a.brand.name.localeCompare(b.brand.name, "cs"));

export default function HomePage() {
  const latest = listings.slice(0, 8);
  return (
    <>
      {/* The first screen: owners and their cars' stories, with the way to start one's own. */}
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-4 sm:pt-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-start">
        <div className="min-w-0 space-y-8">
          <div>
            <h1 className="rise text-[clamp(2.6rem,5vw,4.5rem)] font-extrabold tracking-[-0.035em] leading-[0.98]">Každé auto má svůj příběh</h1>
            <p className="rise mt-6 max-w-[34rem] text-lg sm:text-xl leading-relaxed" style={{ "--d": "90ms" } as React.CSSProperties}>
              Pište příběh svého auta: opravy, úpravy, cesty a co všechno stály. A čtěte, co zažívají majitelé stejných aut.
            </p>
            <p className="rise mt-7 flex flex-wrap items-center gap-x-6 gap-y-3" style={{ "--d": "180ms" } as React.CSSProperties}>
              <Link href="/garaz/nove/" className="btn-cta !px-6 !py-4 text-base">Napsat příběh auta</Link>
              <Link href="/pribehy/" className="text-base font-semibold underline underline-offset-4">Číst příběhy</Link>
            </p>
          </div>
          <div className="rise" style={{ "--d": "270ms" } as React.CSSProperties}>
            <OwnerPicker lines={popularLines()} />
          </div>
        </div>
        <div className="rise min-w-0" style={{ "--d": "140ms" } as React.CSSProperties}>
          <HomeStory placeholderDrawing={newestFrontDrawing("mazda", "mx-5") ?? newestFrontDrawing("skoda", "octavia")} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 mt-24 sm:mt-32">
        <h2 className="reveal text-3xl sm:text-4xl font-extrabold tracking-tight">Hledáte auto?</h2>
        <HomeSearch total={listings.length} />
        <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-base">
          {QUICK.map((q) => (
            <Link key={q.label} href={`/inzeraty/?${q.query}`} className="underline underline-offset-4 decoration-[var(--color-muted)] hover:text-[var(--color-brand)]">
              {q.label}
            </Link>
          ))}
        </p>
        <p className="mt-6 text-base text-[var(--color-muted)]">
          Také na Vozodromu:{" "}
          {OTHER_SECTIONS.map((s, i) => (
            <span key={s.href}>
              {i > 0 && " · "}
              <Link href={s.href} className="text-[var(--color-ink)] hover:text-[var(--color-brand)]">{s.label}</Link> {s.count}
            </span>
          ))}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 mt-24 sm:mt-32">
        <h2 className="reveal text-3xl sm:text-4xl font-extrabold tracking-tight mb-8">Poslední zápisy majitelů</h2>
        <HomeLogbooks />
      </section>

      <section className="mx-auto max-w-6xl px-4 mt-24 sm:mt-32">
        <div className="flex items-end justify-between mb-6">
          <h2 className="reveal text-3xl sm:text-4xl font-extrabold tracking-tight">Nejnovější inzeráty</h2>
          <Link href="/inzeraty/" className="text-base font-semibold text-[var(--color-brand)]">Všechny inzeráty →</Link>
        </div>
        <LatestListings listings={latest} count={latest.length} />
      </section>

      <section className="mx-auto max-w-6xl px-4 mt-24 sm:mt-32">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <h2 className="reveal text-3xl sm:text-4xl font-extrabold tracking-tight">Hledat podle značky</h2>
          <Link href="/katalog/" className="text-base font-semibold text-[var(--color-brand)]">Všechny značky a modely →</Link>
        </div>
        {/* Brands by number of listings, as a list: logo, name, count, then the most offered models. */}
        <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {brandStats.map(({ brand, count, top }) => (
            <li key={brand.slug} className="flex items-start gap-4">
              <Link href={`/inzeraty/?znacka=${brand.slug}`} className="shrink-0" aria-hidden="true" tabIndex={-1}>
                <BrandLogo slug={brand.slug} name={brand.name} size={44} />
              </Link>
              <span className="min-w-0">
                <Link href={`/inzeraty/?znacka=${brand.slug}`} className="block text-xl font-bold leading-tight hover:text-[var(--color-brand)]">
                  {brand.name} <span className="text-base font-normal text-[var(--color-muted)]">{count}</span>
                </Link>
                <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-base">
                  {top.map(({ model, n }) => (
                    <Link key={model.slug} href={`/inzeraty/?znacka=${brand.slug}&model=${model.slug}`} className="text-[var(--color-muted)] hover:text-[var(--color-brand)]">
                      {model.name} {n}
                    </Link>
                  ))}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-[var(--color-muted)]">Loga značek jsou ochranné známky jejich vlastníků a slouží jen k označení značky. Grafika: Simple Icons (CC0) a volná díla z Wikimedia Commons.</p>
      </section>

      <section className="mx-auto max-w-6xl px-4 mt-24 sm:mt-32">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <h2 className="reveal text-3xl sm:text-4xl font-extrabold tracking-tight">Nejlépe hodnocené modely</h2>
          <Link href="/recenze/" className="text-base font-semibold text-[var(--color-brand)]">Recenze majitelů →</Link>
        </div>
        {/* A ranking set in large type, two columns: place by position, the score at the right. */}
        <ol className="grid gap-x-12 sm:grid-cols-2">
          {[...models].sort((a, b) => b.ownerScore - a.ownerScore).slice(0, 8).map((m) => (
            <li key={`${m.brandSlug}-${m.slug}`}>
              <Link href={`/recenze/${m.brandSlug}/${m.slug}/`} className="group flex items-baseline justify-between gap-4 py-3">
                <span className="min-w-0">
                  <span className="text-2xl font-bold group-hover:text-[var(--color-brand)]">{brands.find((b) => b.slug === m.brandSlug)?.name} {m.name}</span>
                  <span className="ml-2 text-base text-[var(--color-muted)]">{formatNumber(m.reviews)} recenzí*</span>
                </span>
                <span className="text-2xl font-extrabold tabular-nums text-[var(--color-brand)]">{m.ownerScore.toLocaleString("cs-CZ", { minimumFractionDigits: 1 })}</span>
              </Link>
            </li>
          ))}
        </ol>
        <p className="text-sm text-[var(--color-muted)] mt-3">* testovací data</p>
      </section>

      <section className="mx-auto max-w-6xl px-4 mt-24 sm:mt-32 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
            <h2 className="reveal text-3xl sm:text-4xl font-extrabold tracking-tight">Novinky a rady</h2>
            <Link href="/novinky/" className="text-base font-semibold text-[var(--color-brand)]">Všechny články →</Link>
          </div>
          <ul className="grid gap-3">
            {articles.slice(0, 3).map((a) => (
              <li key={a.slug}><ArticleCard article={a} /></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
            <h2 className="reveal text-3xl sm:text-4xl font-extrabold tracking-tight">Z fóra</h2>
            <Link href="/forum/" className="text-base font-semibold text-[var(--color-brand)]">Fórum →</Link>
          </div>
          <ul className="rounded-[14px] bg-[var(--color-surface)] p-2">
            {[...threads].sort((a, b) => lastActivity(b).localeCompare(lastActivity(a))).slice(0, 4).map((t) => (
              <li key={t.slug} className="p-3">
                <Link href={`/forum/${t.slug}/`} className="font-semibold text-base hover:text-[var(--color-brand)]">{t.title}</Link>
                <p className="text-sm text-[var(--color-muted)]">{t.posts.length - 1} odpovědí</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
