import Link from "next/link";
import { ListingCard } from "@/components/ListingCard";
import { REGIONS, brands, models } from "@/lib/catalog";
import { formatNumber } from "@/lib/format";
import { itemsOf } from "@/lib/classifieds";
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

const SECTION_ICON = { technika: "🚛", moto: "🏍️", dily: "⚙️", pneu: "🛞" } as const;
const OTHER_SECTIONS = SECTIONS.filter((s) => s.key !== "auto").map((s) => {
  const key = s.key as keyof typeof SECTION_ICON;
  return { href: s.href, label: s.label, icon: SECTION_ICON[key], count: itemsOf(key).length };
});

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
                <span className="text-2xl" aria-hidden="true">{s.icon}</span>
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
        <h2 className="text-xl font-bold mb-4">Hledat podle značky</h2>
        <div className="card p-4 grid gap-x-6 gap-y-1 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {brands.map((b) => (
            <Link key={b.slug} href={`/inzeraty/?znacka=${b.slug}`} className="flex justify-between rounded-lg px-2 py-2 hover:bg-[var(--color-field)]">
              <span className="font-medium">{b.name}</span>
              <span className="text-[var(--color-muted)] text-sm">{listings.filter((l) => l.brandSlug === b.slug).length}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 mt-12">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl font-bold">Nejlépe hodnocené modely</h2>
          <Link href="/katalog/" className="text-sm font-semibold text-[var(--color-brand)]">Celý katalog →</Link>
        </div>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          {[...models].sort((a, b) => b.ownerScore - a.ownerScore).slice(0, 8).map((m) => (
            <Link key={`${m.brandSlug}-${m.slug}`} href={`/katalog/${m.brandSlug}/${m.slug}/`} className="card p-4 flex items-center justify-between gap-3 hover:border-[var(--color-brand)] transition-colors">
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
    </>
  );
}
