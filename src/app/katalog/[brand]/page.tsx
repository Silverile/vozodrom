import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { CarImage } from "@/components/CarImage";
import { BODY_LABEL, getBrand, modelsOf } from "@/lib/catalog";
import { items } from "@/lib/classifieds";
import { listings, listingsOf } from "@/lib/listings";
import { MAKES, type MakeSection, getMake, modelLinesOf, resolveMake, yearsOf } from "@/lib/makes";

// Every make has a page. The demo makes show their model lines with technical data; the
// others show what is known about the make and links to its listings by section.

type Params = Promise<{ brand: string }>;

const BODY_NAMES: Record<string, string> = {
  hatchback: "hatchback",
  kombi: "kombi",
  sedan: "sedan",
  suv: "SUV",
  mpv: "MPV",
  kupe: "kupé",
  kabriolet: "kabriolet",
  pickup: "pick-up",
  dodavka: "dodávka",
};

const SECTION_LINKS: Record<MakeSection, { label: string; href: string }> = {
  auto: { label: "Osobní auta", href: "/inzeraty/" },
  moto: { label: "Motorky", href: "/moto/" },
  technika: { label: "Užitkové a stroje", href: "/technika/" },
  pneu: { label: "Pneumatiky", href: "/pneumatiky/" },
};

export function generateStaticParams() {
  return MAKES.map((m) => ({ brand: m.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { brand } = await params;
  const make = getMake(brand);
  return { title: make ? `${make.name} — značka v katalogu` : "Značka" };
}

export default async function BrandPage({ params }: { params: Params }) {
  const { brand: slug } = await params;
  const make = getMake(slug);
  if (!make) notFound();
  const demo = getBrand(slug);
  const list = demo ? modelsOf(slug) : [];
  const lines = modelLinesOf(slug);
  const itemCount = (section: MakeSection) =>
    section === "auto" ? listings.filter((l) => l.brandSlug === slug).length : items.filter((i) => i.section === section && resolveMake(i.make)?.slug === slug).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-[var(--color-muted)]">
        <Link href="/katalog/" className="hover:underline">Katalog</Link> / {make.name}
      </nav>
      <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight mt-2">
        <BrandLogo slug={make.slug} name={make.name} size={44} />
        {make.name}
      </h1>
      <p className="mt-1 text-[var(--color-muted)]">
        {[make.country, make.defunct && "značka se už nevyrábí"].filter(Boolean).join(" · ")}
      </p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {make.sections.map((s) => {
          const n = itemCount(s);
          return (
            <li key={s}>
              <Link href={`${SECTION_LINKS[s].href}?znacka=${make.slug}`} className="pill">
                {SECTION_LINKS[s].label} · {n} {n === 1 ? "inzerát" : n >= 2 && n <= 4 ? "inzeráty" : "inzerátů"}
              </Link>
            </li>
          );
        })}
      </ul>

      {lines.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-3">Modelová řada <span className="text-base font-normal text-[var(--color-muted)]">· {lines.length} modelů</span></h2>
          <ul className="card divide-y divide-[var(--color-line)]">
            {lines.map((l) => {
              const detail = list.some((m) => m.slug === l.slug);
              return (
                <li key={l.slug} className="px-4 py-3 grid gap-1 sm:grid-cols-[minmax(0,14rem)_8rem_1fr] sm:items-baseline">
                  {detail ? (
                    <Link href={`/katalog/${slug}/${l.slug}/`} className="font-semibold text-[var(--color-brand)] hover:underline">{make.name} {l.name}</Link>
                  ) : (
                    <span className="font-semibold">{make.name} {l.name}</span>
                  )}
                  <span className="text-sm text-[var(--color-muted)]">{yearsOf(l) || "roky doplníme"}</span>
                  <span className="text-sm text-[var(--color-muted)]">
                    {l.bodyTypes.map((b) => BODY_NAMES[b] ?? b).join(", ")}
                    {l.generations.length > 0 && <> · generace {l.generations.map((g) => g.code).filter(Boolean).join(", ")}</>}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-xs text-[var(--color-muted)]">
            Modelová řada sestavená z Wikidat a Wikipedie (fakta, ne texty); roky jsou roky výroby, ne prodeje v ČR. Neznámé údaje necháváme prázdné.
          </p>
        </section>
      )}

      {list.length > 0 ? (
        <div className="grid gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((m) => (
            <Link key={m.slug} href={`/katalog/${slug}/${m.slug}/`} className="card overflow-hidden hover:shadow-lg transition">
              <CarImage body={m.body} color="stříbrná" className="w-full aspect-[16/9]" />
              <div className="p-4">
                <div className="font-semibold">{make.name} {m.name}</div>
                <div className="text-sm text-[var(--color-muted)]">{m.segment} · {BODY_LABEL[m.body]}</div>
                <div className="text-sm mt-2">{listingsOf(slug, m.slug).length} inzerátů</div>
              </div>
            </Link>
          ))}
        </div>
      ) : lines.length > 0 ? null : (
        <p className="card p-5 mt-6 text-sm text-[var(--color-muted)]">
          Modelovou řadu této značky do katalogu teprve doplňujeme. Inzeráty najdete přes odkazy výše.
        </p>
      )}

      <p className="mt-8 text-xs text-[var(--color-muted)]">
        Údaje o značce: <a href={`https://www.wikidata.org/wiki/${make.qid}`} className="underline hover:text-[var(--color-ink)]" rel="noopener">Wikidata</a> (CC0).
      </p>
    </div>
  );
}
