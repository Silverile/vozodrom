import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrandLogo, isWide } from "@/components/BrandLogo";
import { CarImage } from "@/components/CarImage";
import { BODY_LABEL, getBrand, modelsOf } from "@/lib/catalog";
import { items } from "@/lib/classifieds";
import { listings, listingsOf } from "@/lib/listings";
import { ViewTabs } from "@/components/ViewTabs";
import { factsOf, historyOf, hostOf } from "@/lib/brandFacts";
import { MAKES, type MakeSection, type ModelLine, getMake, modelLinesOf, resolveMake, yearsOf } from "@/lib/makes";
import { BODY_GROUPS, cardOf } from "@/lib/modelCards";
import { FrontDrawing, newestFrontDrawing } from "@/components/FrontDrawing";
import type { Body } from "@/lib/types";

// Every make has a page. Makes with curated model lines show the whole range as drawing cards,
// grouped by body type, A–Z or by year; each line links to its model page.

type Params = Promise<{ brand: string }>;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const PICTOGRAM: Record<string, Body> = { kupe: "hatchback", kabriolet: "hatchback", liftback: "hatchback", pickup: "suv", dodavka: "mpv" };

function LineGrid({ make, slug, lines }: { make: string; slug: string; lines: ModelLine[] }) {
  return (
    <ul className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {lines.map((l) => {
        const card = cardOf(slug, l.slug);
        const gens = card?.generations.length || l.generations.length;
        // the newest generation that has a drawing; the catalogue shows drawings, not photos
        const drawing = newestFrontDrawing(slug, l.slug);
        return (
          <li key={l.slug} className="min-w-0">
            <Link href={`/katalog/${slug}/${l.slug}/`} className="card block overflow-hidden hover:shadow-lg transition h-full">
              {drawing ? (
                <FrontDrawing id={drawing} alt={`${make} ${l.name}`} />
              ) : (
                slug === "audi" ? <div className="w-full aspect-[16/10] grid place-items-center text-sm text-[var(--color-muted)]">Nákres se ověřuje</div> : <CarImage body={PICTOGRAM[l.bodyTypes[0]] ?? ((l.bodyTypes[0] as Body) || "hatchback")} color="stříbrná" className="w-full aspect-[16/10]" />
              )}
              <div className="p-3">
                <div className="font-semibold truncate">{make} {l.name}</div>
                <div className="text-xs text-[var(--color-muted)]">
                  {[yearsOf(l), gens ? `${gens} ${gens <= 4 ? "generace" : "generací"}` : null].filter(Boolean).join(" · ") || "roky doplníme"}
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

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
  // A model with several body types appears in each of its groups, as on Drom.
  const groups: [string, string, ModelLine[]][] = [
    ...BODY_GROUPS.map(([key, label]) => [key, label, lines.filter((l) => l.bodyTypes.includes(key))] as [string, string, ModelLine[]]),
    ["ostatni", "Ostatní", lines.filter((l) => !l.bodyTypes.some((b) => BODY_GROUPS.some(([k]) => k === b)))] as [string, string, ModelLine[]],
  ].filter(([, , g]) => g.length > 0);
  const byYear = [...lines].sort((a, b) => (b.from ?? 0) - (a.from ?? 0));

  const itemCount = (section: MakeSection) =>
    section === "auto" ? listings.filter((l) => l.brandSlug === slug).length : items.filter((i) => i.section === section && resolveMake(i.make)?.slug === slug).length;

  // Brand fact tiles: only what is known, most useful first, at most six.
  const facts = factsOf(slug);
  const history = historyOf(slug);
  const listingCount = make.sections.reduce((sum, s) => sum + itemCount(s), 0);
  const currentModels = lines.filter((l) => l.current).length;
  const tiles = (
    [
      ["Založeno", facts?.founded ? `${facts.founded}${facts.foundedIn && facts.foundedIn !== facts.hq ? `, ${facts.foundedIn}` : ""}` : null],
      ["Konec výroby", facts?.dissolved ? String(facts.dissolved) : null],
      ["Sídlo", [facts?.hq, make.country].filter(Boolean).join(", ") || null],
      ["Patří pod", facts?.parent ?? null],
      ["Modely v katalogu", lines.length ? `${lines.length}${currentModels ? ` · ${currentModels} vyráběných` : ""}` : null],
      ["Inzeráty", String(listingCount)],
      ["Zakladatelé", facts?.founders.length ? facts.founders.slice(0, 2).join(", ") + (facts.founders.length > 2 ? " a další" : "") : null],
      ["Zaměstnanci", facts?.employees ? `${facts.employees.value.toLocaleString("cs-CZ")}${facts.employees.year ? ` (${facts.employees.year})` : ""}` : null],
    ] as [string, string | null][]
  )
    .filter((t): t is [string, string] => Boolean(t[1]))
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-[var(--color-muted)]">
        <Link href="/katalog/" className="hover:underline">Katalog</Link> / {make.name}
      </nav>
      <div className="card mt-3 p-5 sm:p-6 grid gap-6 lg:grid-cols-[auto_1fr] lg:items-center">
        <div className="flex flex-wrap items-center gap-4 min-w-0">
          {/* wide wordmarks (Škoda, Michelin…) get a wider box instead of shrinking into a square */}
          <span className="grid place-items-center shrink-0 min-w-20 h-20 px-3 rounded-2xl bg-[var(--color-field)]">
            <BrandLogo slug={make.slug} name={make.name} size={56} square={!isWide(make.slug)} />
          </span>
          <div className="min-w-0">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{make.name}</h1>
            <p className="mt-1 text-[var(--color-muted)]">
              {[facts?.description ? capitalize(facts.description) : make.country, (make.defunct || facts?.dissolved) && "značka se už nevyrábí"]
                .filter(Boolean)
                .join(" · ")}
            </p>
            {facts?.website && (
              <a href={facts.website} rel="noopener nofollow" className="inline-block mt-2 text-sm font-semibold text-[var(--color-brand)] hover:underline">
                {hostOf(facts.website)} ↗
              </a>
            )}
          </div>
        </div>
        <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 min-w-0">
          {tiles.map(([label, value]) => (
            <div key={label} className="rounded-xl bg-[var(--color-field)] px-3 py-2.5 min-w-0">
              <dt className="text-xs text-[var(--color-muted)]">{label}</dt>
              <dd className="font-bold leading-snug [overflow-wrap:normal] [word-break:normal] hyphens-auto" lang="cs">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {history.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-bold mb-3">Z historie</h2>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]">
            {history.map((m, i) => (
              <li key={i} className="card p-4 min-w-0 relative">
                <div className="text-2xl font-extrabold text-[var(--color-brand)] tabular-nums">{m.year}</div>
                <p className="mt-1 text-sm leading-snug">{m.text}</p>
              </li>
            ))}
          </ol>
          <details className="mt-2 text-xs text-[var(--color-muted)]">
            <summary className="cursor-pointer hover:text-[var(--color-ink)]">Zdroje</summary>
            <ul className="mt-1 space-y-0.5">
              {[...new Set(history.map((m) => m.source))].map((s) => (
                <li key={s} className="truncate"><a href={s} rel="noopener nofollow" className="underline hover:text-[var(--color-ink)]">{s}</a></li>
              ))}
            </ul>
          </details>
        </section>
      )}

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
          <ViewTabs labels={["Podle karoserie", "Abecedně", "Podle roku"]}>
            <div className="space-y-8">
              {groups.map(([key, label, group]) => (
                <div key={key}>
                  <h3 className="font-bold text-lg mb-3">{label} <span className="text-sm font-normal text-[var(--color-muted)]">· {group.length}</span></h3>
                  <LineGrid make={make.name} slug={slug} lines={group} />
                </div>
              ))}
            </div>
            <LineGrid make={make.name} slug={slug} lines={lines} />
            <LineGrid make={make.name} slug={slug} lines={byYear} />
          </ViewTabs>
          <p className="mt-4 text-xs text-[var(--color-muted)]">
            Modelová řada sestavená z Wikidat, Wikipedie a materiálů výrobců (fakta, ne texty); roky jsou roky výroby, ne prodeje v ČR.
            Neznámé údaje necháváme prázdné. Fotografie z Wikimedia Commons.
          </p>
        </section>
      )}

      {lines.length > 0 ? null : list.length > 0 ? (
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
