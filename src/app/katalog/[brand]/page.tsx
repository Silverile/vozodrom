import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { CarImage } from "@/components/CarImage";
import { BODY_LABEL, getBrand, modelsOf } from "@/lib/catalog";
import { items } from "@/lib/classifieds";
import { listings, listingsOf } from "@/lib/listings";
import { MAKES, type MakeSection, getMake, resolveMake } from "@/lib/makes";

// Every make has a page. The demo makes show their model lines with technical data; the
// others show what is known about the make and links to its listings by section.

type Params = Promise<{ brand: string }>;

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
      ) : (
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
