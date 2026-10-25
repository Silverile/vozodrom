import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CarImage } from "@/components/CarImage";
import { ListingCard } from "@/components/ListingCard";
import { ModelSidebar } from "@/components/ModelSidebar";
import { PriceMeter, VerdictBadge } from "@/components/VerdictBadge";
import { VehicleCheck } from "@/components/VehicleCheck";
import { BODY_LABEL, FUEL_LABEL, getBrand, getModel } from "@/lib/catalog";
import { formatAgo, formatDate, formatKm, formatPercent, formatPrice } from "@/lib/format";
import { getListing, listings, listingsOf } from "@/lib/listings";
import { marketEstimate } from "@/lib/market";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return listings.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const l = getListing(id);
  if (!l) return { title: "Inzerát" };
  return { title: `${getBrand(l.brandSlug)?.name} ${getModel(l.brandSlug, l.modelSlug)?.name} ${l.year} — ${formatPrice(l.price)}` };
}

const RESULT_STYLE = {
  "způsobilé": "text-[var(--color-good)]",
  "částečně způsobilé": "text-[var(--color-warn)]",
  "nezpůsobilé": "text-[var(--color-bad)]",
} as const;

export default async function ListingPage({ params }: { params: Params }) {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) notFound();
  const brand = getBrand(listing.brandSlug)!;
  const model = getModel(listing.brandSlug, listing.modelSlug)!;
  const estimate = marketEstimate(listing);
  const similar = listingsOf(listing.brandSlug, listing.modelSlug).filter((l) => l.id !== listing.id).slice(0, 3);
  const age = Math.max(2026 - listing.year, 1);
  // mileageByAge is linear in the test data, so the one-year value scales to any age.
  const expectedKm = model.mileageByAge[0].km * age;
  const ageLabel = age === 1 ? "1 rok" : age < 5 ? `${age} roky` : `${age} let`;
  const catalogHref = `/katalog/${brand.slug}/${model.slug}/`;

  const specs: [string, React.ReactNode][] = [
    ["Rok výroby", listing.year],
    ["Najeto", formatKm(listing.mileageKm)],
    ["Motor", listing.engine],
    ["Výkon", `${listing.powerKw} kW`],
    ["Palivo", FUEL_LABEL[listing.fuel]],
    ["Převodovka", listing.transmission],
    ["Karoserie", BODY_LABEL[listing.body]],
    ["Barva", listing.color],
    ["Generace", <Link key="g" href={catalogHref} className="text-[var(--color-brand)] hover:underline">{listing.generation}</Link>],
    ["Kraj", listing.region],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-[var(--color-muted)]">
        <Link href="/inzeraty/" className="hover:text-[var(--color-ink)]">Inzeráty</Link> /{" "}
        <Link href={`/inzeraty/?znacka=${brand.slug}`} className="hover:text-[var(--color-ink)]">{brand.name}</Link> /{" "}
        <Link href={`/inzeraty/?znacka=${brand.slug}&model=${model.slug}`} className="hover:text-[var(--color-ink)]">{model.name}</Link>
      </nav>
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
        {brand.name} {model.name}, {listing.year} <span className="text-[var(--color-muted)] font-semibold">· {listing.region}</span>
      </h1>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_340px_300px] mt-5 items-start">
        {/* photos + details */}
        <div className="space-y-4 min-w-0">
          <div className="card overflow-hidden">
            <CarImage body={listing.body} color={listing.color} className="w-full aspect-[16/10]" />
            <div className="grid grid-cols-5 gap-1 p-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[4/3] rounded-md bg-[var(--color-field)]" aria-hidden="true" />
              ))}
            </div>
          </div>
          <section className="card p-4">
            <h2 className="font-bold">Výbava</h2>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {listing.features.map((f) => <li key={f} className="chip bg-[var(--color-field)] text-[#d5dbe1]">{f}</li>)}
            </ul>
            <h2 className="font-bold mt-4">Popis prodejce</h2>
            <p className="mt-1 text-[var(--color-muted)]">{listing.description}</p>
          </section>
          <section className="card p-4">
            <h2 className="font-bold">Historie technických kontrol</h2>
            {listing.stkHistory.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--color-muted)]">Vůz je mladší než 4 roky, první STK ho teprve čeká.</p>
            ) : (
              <table className="w-full text-sm mt-2">
                <thead className="text-left text-[var(--color-muted)]">
                  <tr><th className="py-1.5 font-medium">Datum</th><th className="font-medium">Tachometr</th><th className="font-medium">Výsledek</th></tr>
                </thead>
                <tbody>
                  {listing.stkHistory.map((r) => (
                    <tr key={r.date} className="border-t border-[var(--color-line)]">
                      <td className="py-2">{formatDate(r.date)}</td>
                      <td className="tabular-nums">{formatKm(r.odometerKm)}</td>
                      <td className={`font-medium ${RESULT_STYLE[r.result]}`}>{r.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>

        {/* price, specs, check, seller */}
        <div className="space-y-4 lg:sticky lg:top-20 order-first lg:order-none">
          <section className="card p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-3xl font-extrabold tracking-tight">{formatPrice(listing.price)}</span>
              {estimate && <VerdictBadge verdict={estimate.verdict} />}
            </div>
            {estimate && (
              <div className="mt-3 rounded-[10px] bg-[var(--color-field)] p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-muted)]">Cena vůči trhu</span>
                  <PriceMeter score={estimate.score} />
                </div>
                <p className="mt-1.5 text-[var(--color-muted)]">
                  Odhad {formatPrice(estimate.median)} z {estimate.comparables} podobných inzerátů (±2 roky, přepočteno na nájezd).
                </p>
              </div>
            )}
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              {specs.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-[var(--color-muted)]">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-[var(--color-muted)]">
              Nájezd: {formatPercent(listing.mileageKm / Math.max(expectedKm, 1))} typické hodnoty pro vůz starý {ageLabel}{" "}
              (typicky {formatKm(expectedKm)})*
            </p>
          </section>
          <VehicleCheck listing={listing} />
          <section className="card p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-field)] text-lg" aria-hidden="true">
                {listing.sellerType === "autobazar" ? "🏢" : "👤"}
              </span>
              <div>
                <div className="font-semibold">{listing.sellerName}</div>
                <div className="text-xs text-[var(--color-muted)]">Vloženo {formatAgo(listing.postedAt)} · {formatDate(listing.postedAt)}</div>
              </div>
            </div>
            <button disabled className="btn-cta mt-4 w-full opacity-60 cursor-not-allowed" title="V prototypu není kontakt aktivní">
              Zobrazit kontakt
            </button>
            <button disabled className="mt-2 w-full rounded-[10px] border border-[var(--color-line)] py-2.5 text-sm font-semibold opacity-60 cursor-not-allowed">
              Napsat zprávu
            </button>
          </section>
        </div>

        {/* model context */}
        <aside className="lg:col-span-2 xl:col-span-1">
          <ModelSidebar model={model} />
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-10">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-xl font-bold">Podobná auta</h2>
            <Link href={`/inzeraty/?znacka=${brand.slug}&model=${model.slug}`} className="text-sm font-semibold text-[var(--color-brand)]">
              Všechny {brand.name} {model.name} →
            </Link>
          </div>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
            {similar.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </section>
      )}
    </div>
  );
}
