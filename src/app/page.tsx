import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { ArticleCard } from "@/components/ArticleCard";
import { brands, models } from "@/lib/catalog";
import { articles } from "@/lib/articles";
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

const brandModels = [...brands]
  .sort((a, b) => a.name.localeCompare(b.name, "cs"))
  .map((brand) => ({ brand, top: models.filter((m) => m.brandSlug === brand.slug).slice(0, 3) }));

export default function HomePage() {
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
        <HomeSearch />
        <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-base">
          {QUICK.map((q) => (
            <Link key={q.label} href={`/inzeraty/?${q.query}`} className="underline underline-offset-4 decoration-[var(--color-muted)] hover:text-[var(--color-brand)]">
              {q.label}
            </Link>
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
        <LatestListings count={8} />
      </section>

      <section className="mx-auto max-w-6xl px-4 mt-24 sm:mt-32">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <h2 className="reveal text-3xl sm:text-4xl font-extrabold tracking-tight">Katalog podle značky</h2>
          <Link href="/katalog/" className="text-base font-semibold text-[var(--color-brand)]">Všechny značky a modely →</Link>
        </div>
        {/* Brands as a list: logo, name, then some of their models. */}
        <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {brandModels.map(({ brand, top }) => (
            <li key={brand.slug} className="flex items-start gap-4">
              <Link href={`/katalog/${brand.slug}/`} className="shrink-0" aria-hidden="true" tabIndex={-1}>
                <BrandLogo slug={brand.slug} name={brand.name} size={44} />
              </Link>
              <span className="min-w-0">
                <Link href={`/katalog/${brand.slug}/`} className="block text-xl font-bold leading-tight hover:text-[var(--color-brand)]">
                  {brand.name}
                </Link>
                <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-base">
                  {top.map((model) => (
                    <Link key={model.slug} href={`/katalog/${brand.slug}/${model.slug}/`} className="text-[var(--color-muted)] hover:text-[var(--color-brand)]">
                      {model.name}
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
          <h2 className="reveal text-3xl sm:text-4xl font-extrabold tracking-tight">Novinky a rady</h2>
          <Link href="/novinky/" className="text-base font-semibold text-[var(--color-brand)]">Všechny články →</Link>
        </div>
        <ul className="grid gap-3 lg:grid-cols-3">
          {articles.slice(0, 3).map((a) => (
            <li key={a.slug}><ArticleCard article={a} /></li>
          ))}
        </ul>
      </section>
    </>
  );
}
