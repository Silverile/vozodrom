import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { GarageCarImage } from "@/components/GarageCarImage";
import { ListingCard } from "@/components/ListingCard";
import { PhotoGallery } from "@/components/PhotoGallery";
import { getSession } from "@/lib/auth";
import { FUEL_LABEL } from "@/lib/catalog";
import { formatDate, formatKm, formatPrice } from "@/lib/format";
import { CAR_DRIVES, ENTRY_CATEGORIES, carLine, carName, carTitle, paragraphs } from "@/lib/garage";
import { carPage } from "@/lib/garage-store";
import { BODY_KEYS } from "@/lib/listing-catalog";
import { listings as testListings } from "@/lib/listings";
import { getMake } from "@/lib/makes";
import type { Fuel, Listing } from "@/lib/types";
import { publishedUserListings } from "@/lib/user-listings";
import { Reaction, ReportContent } from "../LogbookClient";

// A car's public page: photos, the owner's story, the technical basics and its logbook, with likes
// and follows. Below it, listings of the same model, so readers who like the car can find one.

type Params = Promise<{ carId: string }>;

async function load(carId: string) {
  await connection();
  const viewer = await getSession();
  const page = await carPage(carId, viewer);
  return page && { ...page, signedIn: Boolean(viewer) };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const page = await load((await params).carId);
  if (!page) return { title: "Deník auta" };
  return {
    title: `${carTitle(page.car.data)} — deník majitele`,
    description: page.car.data.story.slice(0, 160) || `Deník ${carName(page.car.data)}: opravy, servis a úpravy podle majitele.`,
    ...(page.car.hiddenReason && { robots: { index: false } }),
  };
}

/** Up to four listings of the same model line, then of the make. */
async function forSale(make: string, line: string): Promise<Listing[]> {
  const pool = [...(await publishedUserListings()), ...testListings].filter((l) => l.brandSlug === make);
  return [...pool.filter((l) => l.modelSlug === line), ...pool.filter((l) => l.modelSlug !== line)].slice(0, 4);
}

export default async function CarLogbookPage({ params }: { params: Params }) {
  const { carId } = await params;
  const page = await load(carId);
  if (!page) notFound();
  const { car, entries, counts, viewer, ownerName, otherCars, signedIn } = page;
  const data = car.data;
  const title = carTitle(data);
  const line = carLine(data);
  const make = getMake(data.brand);
  const here = `/deniky/${carId}/`;
  const listings = await forSale(data.brand, line?.slug ?? "");

  const facts: [string, string | null][] = [
    ["Rok výroby", data.year ? String(data.year) : null],
    ["V garáži od", data.purchaseYear ? String(data.purchaseYear) : null],
    ["Motor", data.engine || null],
    ["Palivo", data.fuel ? FUEL_LABEL[data.fuel as Fuel] ?? data.fuel : null],
    ["Výkon", data.powerKw ? `${data.powerKw} kW` : null],
    ["Převodovka", data.transmission || null],
    ["Pohon", data.drive ? CAR_DRIVES[data.drive] : null],
    ["Karoserie", data.body ? BODY_KEYS[data.body] : null],
    ["Barva", data.color || null],
    ["SPZ", data.plateVisible && data.plate ? data.plate : null],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-sm text-[var(--color-muted)]">
        <Link href="/deniky/" className="hover:text-[var(--color-brand)]">Deníky</Link>
        {" / "}
        <Link href={`/deniky/?znacka=${data.brand}`} className="hover:text-[var(--color-brand)]">{make?.name ?? data.brand}</Link>
        {line && (
          <>
            {" / "}
            <Link href={`/deniky/?znacka=${data.brand}&model=${line.slug}`} className="hover:text-[var(--color-brand)]">{line.name}</Link>
          </>
        )}
      </p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{title}</h1>
        {viewer.owner && <Link href={`/garaz/${carId}/`} className="pill">Upravit v garáži</Link>}
      </div>
      {car.former && <p className="mt-1 text-sm text-[var(--color-muted)]">Bývalé auto majitele</p>}
      {car.hiddenReason && <p className="mt-3 card p-4 text-sm bg-[var(--color-warn-soft)] text-[var(--color-warn)]">Skryto moderátorem: {car.hiddenReason}</p>}

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_300px] items-start">
        <div className="min-w-0 space-y-6">
          {car.photos.length ? <PhotoGallery photos={car.photos} title={title} /> : <GarageCarImage car={data} alt={title} className="rounded-[14px]" />}

          {data.story && (
            <section className="card p-5">
              <h2 className="font-bold text-lg mb-2">O autě</h2>
              <div className="space-y-3 text-[0.95rem] leading-relaxed">
                {paragraphs(data.story).map((p, i) => <p key={i} className="whitespace-pre-line">{p}</p>)}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-xl font-bold mb-3">Deník <span className="text-[var(--color-muted)] font-normal">{counts.entries}</span></h2>
            {entries.length === 0 ? (
              <p className="card p-5 text-sm text-[var(--color-muted)]">Majitel zatím nic nenapsal.</p>
            ) : (
              <ul className="space-y-3">
                {entries.map((e) => (
                  <li key={e.id}>
                    <Link href={`/deniky/${carId}/${e.id}/`} className="card flex gap-4 p-3 hover:border-[var(--color-brand)]">
                      {e.photos[0] ? (
                        <img src={`/foto/${e.photos[0].key}`} alt="" className="w-28 sm:w-36 aspect-[4/3] shrink-0 rounded-[10px] object-cover bg-[var(--color-photo)]" loading="lazy" />
                      ) : (
                        <span className="w-28 sm:w-36 aspect-[4/3] shrink-0 rounded-[10px] bg-[var(--color-field)]" />
                      )}
                      <span className="min-w-0">
                        <span className="block font-semibold">{e.title}</span>
                        <span className="block text-sm text-[var(--color-muted)]">{ENTRY_CATEGORIES[e.category]}</span>
                        <span className="mt-1 block text-xs text-[var(--color-muted)]">
                          {[formatDate(e.happenedOn), e.costCzk != null ? formatPrice(e.costCzk) : null, e.mileageKm != null ? formatKm(e.mileageKm) : null, `♥ ${e.likes}`, `${e.comments} kom.`]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                        {e.hiddenReason && <span className="mt-1 chip bg-[var(--color-warn-soft)] text-[var(--color-warn)]">skryto</span>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="min-w-0 space-y-4">
          <div className="card p-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              <Reaction what="car-like" id={carId} initialOn={viewer.liked} initialCount={counts.likes} signedIn={signedIn} next={here} own={viewer.owner} />
              <Reaction what="follow" id={carId} initialOn={viewer.following} initialCount={counts.followers} signedIn={signedIn} next={here} own={viewer.owner} />
            </div>
            <p className="text-xs text-[var(--color-muted)]">Sledující dostanou zprávu o každém novém zápisu.</p>
          </div>
          <div className="card p-4 text-sm space-y-1">
            <p className="text-[var(--color-muted)]">Majitel</p>
            <p className="font-semibold">{ownerName}</p>
            {otherCars.length > 0 && (
              <p className="text-[var(--color-muted)]">
                Další auta:{" "}
                {otherCars.map((c, i) => (
                  <span key={c.id}>
                    {i > 0 && ", "}
                    <Link href={`/deniky/${c.id}/`} className="text-[var(--color-brand)] hover:underline">{carTitle(c.data)}</Link>
                    {c.former && " (bývalé)"}
                  </span>
                ))}
              </p>
            )}
            <p className="text-xs text-[var(--color-muted)] pt-1">V garáži od {formatDate(car.createdAt.toISOString())}</p>
          </div>
          {facts.some(([, v]) => v) && (
            <div className="card p-4">
              <h2 className="font-bold mb-2">Údaje</h2>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                {facts.filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-[var(--color-muted)]">{k}</dt>
                    <dd className="font-medium min-w-0">{v}</dd>
                  </div>
                ))}
              </dl>
              {line && (
                <Link href={`/katalog/${data.brand}/${line.slug}/`} className="mt-3 inline-block text-sm text-[var(--color-brand)] hover:underline">
                  {carName(data)} v katalogu →
                </Link>
              )}
            </div>
          )}
          {!viewer.owner && (
            <div className="px-1">
              <ReportContent kind="car" id={carId} signedIn={signedIn} next={here} />
            </div>
          )}
        </aside>
      </div>

      {listings.length > 0 && (
        <section className="mt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
            <h2 className="text-xl font-bold">{line ? `${carName(data)} na prodej` : `${make?.name ?? ""} na prodej`}</h2>
            <Link href={`/inzeraty/?znacka=${data.brand}${line ? `&model=${line.slug}` : ""}`} className="text-sm text-[var(--color-brand)] hover:underline">Všechny inzeráty →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </section>
      )}
    </div>
  );
}
