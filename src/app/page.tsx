import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ListingCard } from "@/components/ListingCard";
import { REGIONS, brands, models } from "@/lib/catalog";
import { formatNumber } from "@/lib/format";
import { articles } from "@/lib/articles";
import { itemsOf } from "@/lib/classifieds";
import { lastActivity, threads } from "@/lib/forum";
import { listings } from "@/lib/listings";
import { SECTIONS } from "@/lib/sections";
import { HomeSearch } from "./HomeSearch";

const QUICK = [
  { label: "Rodinná kombi", query: "karoserie=kombi" },
  { label: "SUV", query: "karoserie=suv" },
  { label: "Elektro", query: "palivo=elektro" },
  { label: "Hybrid", query: "palivo=hybrid" },
  { label: "Automat", query: "prevodovka=automat" },
  { label: "Do 200 000 Kč", query: "cenaDo=200000" },
];

const SECTION_ICON = { technika: "tahace", moto: "motocykly", dily: "motor", pneu: "letni" } as const;
const OTHER_SECTIONS = SECTIONS.filter((s) => s.group === "market" && s.key !== "auto").map((s) => {
  const key = s.key as keyof typeof SECTION_ICON;
  return { href: s.href, label: s.label, icon: SECTION_ICON[key], count: itemsOf(key).length };
});

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
  const byRegion = (r: string) => listings.filter((l) => l.region === r).length;
  const topRegions = [...REGIONS].sort((a, b) => byRegion(b) - byRegion(a)).slice(0, 3);
  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--color-line)]">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_420px_at_15%_0%,var(--color-hero)_0%,transparent_65%)]" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-10 sm:pt-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-2xl leading-[1.05]">
            Najděte auto, kterému můžete věřit
          </h1>
          <p className="mt-3 max-w-xl text-[var(--color-muted)]">
            Inzeráty, data z technických kontrol a zkušenosti majitelů na jednom místě. Bez reklam přes obsah, analytika jen s vaším souhlasem.
          </p>
          <HomeSearch total={listings.length} />
          <div className="mt-4 flex flex-wrap gap-2">
            {topRegions.map((r) => (
              <Link key={r} href={`/inzeraty/?kraj=${encodeURIComponent(r)}`} className="pill">
                {r} <span className="opacity-60 ml-1">{byRegion(r)}</span>
              </Link>
            ))}
            <Link href="/inzeraty/" className="pill" data-on="true">Celá ČR <span className="opacity-70 ml-1">{listings.length}</span></Link>
            <span className="w-px bg-[var(--color-line)] mx-1" aria-hidden="true" />
            {QUICK.map((q) => (
              <Link key={q.label} href={`/inzeraty/?${q.query}`} className="pill">{q.label}</Link>
            ))}
          </div>
          <nav aria-label="Další sekce" className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-3xl">
            {OTHER_SECTIONS.map((s) => (
              <Link key={s.href} href={s.href} className="card px-3 py-2.5 flex items-center gap-2.5 text-sm hover:border-[var(--color-brand)]">
                <CategoryIcon slug={s.icon} className="w-10 shrink-0 text-[var(--color-ink)]" />
                <span>
                  <span className="block font-semibold leading-tight">{s.label}</span>
                  <span className="block text-xs text-[var(--color-muted)]">{s.count} inzerátů</span>
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 mt-10">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl font-bold">Nejnovější inzeráty</h2>
          <Link href="/inzeraty/" className="text-sm font-semibold text-[var(--color-brand)]">Všechny inzeráty →</Link>
        </div>
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {latest.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 mt-12">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl font-bold">Hledat podle značky</h2>
          <Link href="/katalog/" className="text-sm font-semibold text-[var(--color-brand)]">Všechny značky a modely →</Link>
        </div>
        {/* Brands by number of listings; each tile also offers its most offered models. */}
        <ul className="grid gap-3 grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-5">
          {brandStats.map(({ brand, count, top }) => (
            <li key={brand.slug} className="card p-3 hover:border-[var(--color-brand)] transition-colors">
              <Link href={`/inzeraty/?znacka=${brand.slug}`} className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--color-field)] text-[var(--color-ink)]">
                  <BrandLogo slug={brand.slug} name={brand.name} className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold leading-tight truncate">{brand.name}</span>
                  <span className="block text-xs text-[var(--color-muted)]">{count} {count === 1 ? "inzerát" : count < 5 ? "inzeráty" : "inzerátů"}</span>
                </span>
              </Link>
              <p className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs">
                {top.map(({ model, n }) => (
                  <Link key={model.slug} href={`/inzeraty/?znacka=${brand.slug}&model=${model.slug}`} className="text-[var(--color-muted)] hover:text-[var(--color-brand)]">
                    {model.name} <span className="opacity-70">{n}</span>
                  </Link>
                ))}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-[var(--color-muted)]">Loga značek jsou ochranné známky jejich vlastníků a slouží jen k označení značky. Grafika: Simple Icons (CC0).</p>
      </section>

      <section className="mx-auto max-w-6xl px-4 mt-12">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl font-bold">Nejlépe hodnocené modely</h2>
          <Link href="/recenze/" className="text-sm font-semibold text-[var(--color-brand)]">Recenze majitelů →</Link>
        </div>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          {[...models].sort((a, b) => b.ownerScore - a.ownerScore).slice(0, 8).map((m) => (
            <Link key={`${m.brandSlug}-${m.slug}`} href={`/recenze/${m.brandSlug}/${m.slug}/`} className="card p-4 flex items-center justify-between gap-3 hover:border-[var(--color-brand)] transition-colors">
              <span>
                <span className="block text-xs text-[var(--color-muted)]">{brands.find((b) => b.slug === m.brandSlug)?.name}</span>
                <span className="font-semibold">{m.name}</span>
                <span className="block text-xs text-[var(--color-muted)] mt-0.5">{formatNumber(m.reviews)} recenzí*</span>
              </span>
              <span className="rounded-lg bg-[var(--color-brand)] text-[var(--color-brand-ink)] px-2 py-0.5 font-extrabold">
                {m.ownerScore.toLocaleString("cs-CZ", { minimumFractionDigits: 1 })}
              </span>
            </Link>
          ))}
        </div>
        <p className="text-xs text-[var(--color-muted)] mt-2">* testovací data</p>
      </section>

      <section className="mx-auto max-w-6xl px-4 mt-12 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-xl font-bold">Novinky a rady</h2>
            <Link href="/novinky/" className="text-sm font-semibold text-[var(--color-brand)]">Všechny články →</Link>
          </div>
          <ul className="grid gap-3">
            {articles.slice(0, 3).map((a) => (
              <li key={a.slug}><ArticleCard article={a} /></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-xl font-bold">Z fóra</h2>
            <Link href="/forum/" className="text-sm font-semibold text-[var(--color-brand)]">Fórum →</Link>
          </div>
          <ul className="card divide-y divide-[var(--color-line)]">
            {[...threads].sort((a, b) => lastActivity(b).localeCompare(lastActivity(a))).slice(0, 4).map((t) => (
              <li key={t.slug} className="p-3">
                <Link href={`/forum/${t.slug}/`} className="font-semibold text-sm hover:text-[var(--color-brand)]">{t.title}</Link>
                <p className="text-xs text-[var(--color-muted)]">{t.posts.length - 1} odpovědí</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
