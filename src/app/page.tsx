import Link from "next/link";
import { ListingCard } from "@/components/ListingCard";
import { brands, models } from "@/lib/catalog";
import { listings } from "@/lib/listings";
import { formatNumber } from "@/lib/format";
import { HomeSearch } from "./HomeSearch";

export default function HomePage() {
  const latest = listings.slice(0, 6);
  const popular = [...models].sort((a, b) => b.registered - a.registered).slice(0, 8);
  return (
    <>
      <section className="bg-[var(--color-brand)] text-[var(--color-brand-ink)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-2xl">
            Najděte auto a zjistěte o něm všechno na jednom místě
          </h1>
          <p className="mt-3 max-w-xl opacity-90">
            Inzeráty, katalog modelů, data z technických kontrol a porovnání ceny s trhem.
          </p>
          <HomeSearch brands={brands} models={models.map((m) => ({ slug: m.slug, brandSlug: m.brandSlug, name: m.name }))} />
          <p className="mt-4 text-sm opacity-80">{formatNumber(listings.length)} testovacích inzerátů · {models.length} modelů v katalogu</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 mt-10">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl font-bold">Nejnovější inzeráty</h2>
          <Link href="/inzeraty/" className="text-sm font-semibold text-[var(--color-brand)]">Všechny inzeráty →</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 mt-12">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl font-bold">Nejrozšířenější modely</h2>
          <Link href="/katalog/" className="text-sm font-semibold text-[var(--color-brand)]">Celý katalog →</Link>
        </div>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          {popular.map((m) => {
            const brand = brands.find((b) => b.slug === m.brandSlug);
            return (
              <Link key={`${m.brandSlug}-${m.slug}`} href={`/katalog/${m.brandSlug}/${m.slug}/`} className="card p-4 hover:shadow-md transition">
                <div className="text-xs text-[var(--color-muted)]">{brand?.name}</div>
                <div className="font-semibold">{m.name}</div>
                <div className="text-xs text-[var(--color-muted)] mt-1">{formatNumber(m.registered)} v provozu*</div>
              </Link>
            );
          })}
        </div>
        <p className="text-xs text-[var(--color-muted)] mt-2">* testovací čísla</p>
      </section>
    </>
  );
}
