import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo, makeSlug } from "./BrandLogo";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { type ItemSection, categoryOf, getItem, itemsOf } from "@/lib/classifieds";
import { formatAgo, formatDate, formatNumber, formatPrice } from "@/lib/format";
import { regionLabel } from "@/lib/geo";
import { SECTIONS } from "@/lib/sections";
import { ItemImage, ItemRow } from "./ItemRow";
import { Place } from "./Place";
import { SectionSearch } from "./SectionSearch";

// Shared pages for the non-car sections; each route folder only picks its section.

const INTRO: Record<ItemSection, { title: string; lead: string }> = {
  technika: { title: "Užitková vozidla a stroje", lead: "Dodávky, nákladní auta, tahače, autobusy, zemědělská a stavební technika." },
  moto: { title: "Motorky a skútry", lead: "Motocykly, skútry, čtyřkolky a moto výbava od soukromníků i prodejců." },
  dily: { title: "Náhradní díly", lead: "Nové i použité díly s uvedením, na které modely pasují. Číslo dílu vždy ověřte podle VIN." },
  pneu: { title: "Pneumatiky", lead: "Letní, zimní a celoroční pneumatiky. Hledejte podle rozměru, sezóny a počtu kusů." },
};

const sectionOf = (key: ItemSection) => SECTIONS.find((s) => s.key === key)!;

export function sectionMetadata(section: ItemSection): Metadata {
  return { title: `${INTRO[section].title} — inzeráty`, description: INTRO[section].lead };
}

export function SectionLanding({ section }: { section: ItemSection }) {
  const total = itemsOf(section).length;
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{INTRO[section].title}</h1>
          <p className="mt-1 text-[var(--color-muted)] max-w-2xl">{INTRO[section].lead}</p>
        </div>
        <p className="text-sm text-[var(--color-muted)]"><b className="text-[var(--color-ink)]">{formatNumber(total)}</b> testovacích inzerátů</p>
      </div>
      <Suspense>
        <SectionSearch section={section} />
      </Suspense>
    </div>
  );
}

export function itemParams(section: ItemSection) {
  return itemsOf(section).map((i) => ({ id: i.id }));
}

export async function itemMetadata(section: ItemSection, params: Promise<{ id: string }>): Promise<Metadata> {
  const item = getItem((await params).id);
  if (!item || item.section !== section) return {};
  return { title: `${item.title} — ${formatPrice(item.price)}`, description: item.description };
}

export async function ItemDetail({ section, params }: { section: ItemSection; params: Promise<{ id: string }> }) {
  const item = getItem((await params).id);
  if (!item || item.section !== section) notFound();
  const sec = sectionOf(section);
  const category = categoryOf(section, item.category);
  const similar = itemsOf(section).filter((i) => i.category === item.category && i.id !== item.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-[var(--color-muted)]">
        <Link href={sec.href} className="hover:text-[var(--color-ink)]">{sec.label}</Link> /{" "}
        <Link href={`${sec.href}?kategorie=${item.category}`} className="hover:text-[var(--color-ink)]">{category?.label}</Link>
      </nav>
      <h1 className="flex items-center gap-3 text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
        {item.make && <BrandLogo slug={makeSlug(item.make)} name={item.make} className="h-8 w-8" />}
        {item.title}
      </h1>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px] mt-5 items-start">
        <div className="space-y-4 min-w-0">
          <div className="card overflow-hidden">
            <ItemImage item={item} className="w-full aspect-[16/9] [&>span]:text-8xl" />
            <p className="px-4 py-2 text-xs text-[var(--color-muted)]">V prototypu bez fotografií.</p>
          </div>
          <section className="card p-4">
            <h2 className="font-bold">Popis prodejce</h2>
            <p className="mt-1 text-[var(--color-muted)]">{item.description}</p>
            {item.fits && (
              <>
                <h2 className="font-bold mt-4">Pasuje na</h2>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {item.fits.map((f) => <li key={f} className="chip bg-[var(--color-field)] text-[var(--color-ink-soft)]">{f}</li>)}
                </ul>
                <p className="mt-2 text-xs text-[var(--color-muted)]">Kompatibilitu vždy ověřte podle VIN a čísla dílu.</p>
              </>
            )}
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28">
          <section className="card p-4">
            <p className="text-3xl font-extrabold tracking-tight">{formatPrice(item.price)}</p>
            {item.tyre && item.tyre.count > 1 && <p className="text-sm text-[var(--color-muted)]">za {item.tyre.count} ks, tj. {formatPrice(Math.round(item.price / item.tyre.count))} / ks</p>}
            <dl className="mt-4 text-sm grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
              {item.specs.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-[var(--color-muted)]">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
              <dt className="text-[var(--color-muted)]">Místo</dt>
              <dd className="font-semibold">
                <Place city={item.city} fallback={item.region} region={item.region === "Praha" ? undefined : regionLabel(item.region)} />
              </dd>
            </dl>
          </section>
          <section className="card p-4 text-sm">
            <p className="font-bold">{item.sellerName}</p>
            <p className="text-[var(--color-muted)]">{item.sellerType === "autobazar" ? "Prodejce · " : ""}vloženo {formatDate(item.postedAt)} ({formatAgo(item.postedAt)})</p>
            <p className="mt-3 text-[var(--color-muted)]">Kontaktování prodejce bude dostupné po spuštění účtů.</p>
          </section>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-10">
          <div className="flex items-end justify-between gap-3 mb-3">
            <h2 className="text-xl font-bold">Další v kategorii {category?.label.toLowerCase()}</h2>
            <Link href={`${sec.href}?kategorie=${item.category}`} className="text-sm text-[var(--color-brand)] hover:underline">Zobrazit vše</Link>
          </div>
          <div className="flex flex-col gap-3">
            {similar.map((i) => <ItemRow key={i.id} item={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
