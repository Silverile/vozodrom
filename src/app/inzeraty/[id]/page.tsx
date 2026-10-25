import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CarImage } from "@/components/CarImage";
import { ListingCard } from "@/components/ListingCard";
import { VerdictBadge } from "@/components/VerdictBadge";
import { BODY_LABEL, FUEL_LABEL, getBrand, getModel } from "@/lib/catalog";
import { formatDate, formatKm, formatPercent, formatPrice } from "@/lib/format";
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
  const expectedKm = model.mileageByAge.reduce((prev, cur) =>
    Math.abs(cur.age - (2026 - listing.year)) < Math.abs(prev.age - (2026 - listing.year)) ? cur : prev,
  );

  const specs: [string, string][] = [
    ["Rok výroby", String(listing.year)],
    ["Najeto", formatKm(listing.mileageKm)],
    ["Palivo", FUEL_LABEL[listing.fuel]],
    ["Převodovka", listing.transmission],
    ["Výkon", `${listing.powerKw} kW`],
    ["Karoserie", BODY_LABEL[listing.body]],
    ["Generace", listing.generation],
    ["Barva", listing.color],
    ["Kraj", listing.region],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-[var(--color-muted)]">
        <Link href="/inzeraty/" className="hover:underline">Inzeráty</Link> /{" "}
        <Link href={`/katalog/${brand.slug}/${model.slug}/`} className="hover:underline">{brand.name} {model.name}</Link>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] mt-3">
        <div className="space-y-4">
          <div className="card overflow-hidden">
            <CarImage body={listing.body} color={listing.color} className="w-full aspect-[16/9]" />
            <div className="grid grid-cols-4 gap-1 p-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/3] rounded-md bg-[var(--color-brand-soft)] opacity-60" aria-hidden="true" />
              ))}
            </div>
          </div>

          <section className="card p-5">
            <h2 className="font-bold text-lg">Parametry</h2>
            <dl className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
              {specs.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-[var(--color-muted)]">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <h3 className="font-semibold mt-5">Výbava</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {listing.features.map((f) => (
                <li key={f} className="chip bg-[var(--color-brand-soft)] text-[var(--color-brand)]">{f}</li>
              ))}
            </ul>
            <h3 className="font-semibold mt-5">Popis</h3>
            <p className="mt-1 text-[var(--color-muted)]">{listing.description}</p>
          </section>

          <section className="card p-5">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-bold text-lg">Historie technických kontrol</h2>
              <span className="text-xs text-[var(--color-muted)] font-mono">VIN {listing.vin}</span>
            </div>
            {listing.stkHistory.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--color-muted)]">Vůz je mladší než 4 roky, první STK ho teprve čeká.</p>
            ) : (
              <table className="w-full text-sm mt-3">
                <thead className="text-left text-[var(--color-muted)]">
                  <tr><th className="pb-2 font-medium">Datum</th><th className="pb-2 font-medium">Stav tachometru</th><th className="pb-2 font-medium">Výsledek</th></tr>
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
            <p className="text-xs text-[var(--color-muted)] mt-3">
              Datované záznamy z prohlídek. Neověřují aktuální stav tachometru a nevylučují stočení mezi prohlídkami.
              Pro úplnou historii doporučujeme placenou prověrku VIN. (V prototypu smyšlená data.)
            </p>
          </section>
        </div>

        <aside className="space-y-4 order-first lg:order-none">
          <div className="card p-5 lg:sticky lg:top-4">
            <h1 className="text-2xl font-extrabold leading-tight">{brand.name} {model.name}</h1>
            <p className="text-[var(--color-muted)]">{listing.generation} · {listing.year} · {formatKm(listing.mileageKm)}</p>
            <div className="text-3xl font-extrabold mt-4">{formatPrice(listing.price)}</div>

            {estimate && (
              <div className="mt-4 rounded-xl bg-[var(--color-bg)] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Cena vs. trh</span>
                  <VerdictBadge verdict={estimate.verdict} />
                </div>
                <p className="text-sm text-[var(--color-muted)] mt-2">
                  Odhad tržní ceny {formatPrice(estimate.median)} podle {estimate.comparables} podobných inzerátů
                  (±2 roky, přepočteno na nájezd).
                </p>
              </div>
            )}

            <div className="mt-4 rounded-xl bg-[var(--color-bg)] p-4 text-sm">
              <span className="font-semibold">Nájezd vs. typický vůz tohoto stáří</span>
              <p className="text-[var(--color-muted)] mt-1">
                Typicky {formatKm(expectedKm.km)} po {expectedKm.age} letech · tento vůz{" "}
                {formatPercent(listing.mileageKm / Math.max(expectedKm.km, 1))} typické hodnoty.
              </p>
            </div>

            <div className="mt-5 border-t border-[var(--color-line)] pt-4">
              <div className="text-sm text-[var(--color-muted)]">{listing.sellerType === "autobazar" ? "Prodejce" : "Soukromý prodej"}</div>
              <div className="font-semibold">{listing.sellerName}</div>
              <div className="text-sm text-[var(--color-muted)]">Vloženo {formatDate(listing.postedAt)}</div>
              <button
                disabled
                className="mt-4 w-full rounded-xl bg-[var(--color-accent)] text-white font-semibold py-3 opacity-60 cursor-not-allowed"
                title="V prototypu není kontakt aktivní"
              >
                Napsat prodejci
              </button>
            </div>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-10 mb-4">Podobné inzeráty</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </>
      )}
    </div>
  );
}
