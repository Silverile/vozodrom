import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { CarImage } from "@/components/CarImage";
import { FavoriteButton } from "@/components/FavoriteButton";
import { FrontDrawing } from "@/components/FrontDrawing";
import { ListingCard } from "@/components/ListingCard";
import { ModelSidebar } from "@/components/ModelSidebar";
import { PhotoGallery } from "@/components/PhotoGallery";
import { Place } from "@/components/Place";
import { PriceMeter, VerdictBadge } from "@/components/VerdictBadge";
import { STAFF_ROLES, getSession, hasRole } from "@/lib/auth";
import { BODY_LABEL, FUEL_LABEL, getModel } from "@/lib/catalog";
import { formatDate, formatKm, formatPrice } from "@/lib/format";
import { regionLabel } from "@/lib/geo";
import { BODY_KEYS } from "@/lib/listing-catalog";
import { draftTitle } from "@/lib/listing-draft";
import { listingContext } from "@/lib/listing-context";
import { listings as testListings } from "@/lib/listings";
import { getMake } from "@/lib/makes";
import { STATUS_LABEL } from "@/lib/listing-status";
import { marketEstimate } from "@/lib/market";
import type { Listing } from "@/lib/types";
import { publishedUserListings, userListingPage } from "@/lib/user-listings";
import { CzechData, GenerationCard } from "./CatalogContext";
import { PhoneReveal } from "./PhoneReveal";
import { ReportListing } from "./ReportListing";
import { WriteSeller } from "./WriteSeller";

// Listings placed by users, rendered on every request so approvals and withdrawals show at once.
// Test and dealer-feed listings stay prerendered at /inzeraty/[id].

type Params = Promise<{ id: string }>;

async function load(id: string) {
  await connection();
  const found = await userListingPage(id);
  if (!found) return null;
  if (found.row.status === "published" && !found.banned) return { ...found, preview: false };
  // Anything else is visible only to its owner and to staff, marked as a preview.
  const session = await getSession();
  const allowed = session && (session.user.id === found.row.userId || hasRole(session, STAFF_ROLES));
  return allowed ? { ...found, preview: true } : null;
}

/** Up to three other cars of the same model (then make), closest in year and price first. */
async function similarTo(listing: Listing): Promise<Listing[]> {
  const pool = [...(await publishedUserListings()), ...testListings].filter((l) => l.id !== listing.id && l.brandSlug === listing.brandSlug);
  const distance = (l: Listing) =>
    (l.modelSlug === listing.modelSlug ? 0 : 100) + Math.abs(l.year - listing.year) + Math.abs(l.price - listing.price) / Math.max(listing.price, 1) * 5;
  return pool.sort((a, b) => distance(a) - distance(b)).slice(0, 3);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const found = await load((await params).id);
  if (!found) return { title: "Inzerát" };
  return { title: `${draftTitle(found.row.data)} — ${formatPrice(found.listing.price)}`, ...(found.preview && { robots: { index: false } }) };
}

export default async function UserListingPage({ params }: { params: Params }) {
  const found = await load((await params).id);
  if (!found) notFound();
  const { listing, row, preview } = found;
  const viewer = await getSession();
  const title = draftTitle(row.data);
  const model = getModel(listing.brandSlug, listing.modelSlug);
  const estimate = marketEstimate(listing);
  const context = listingContext(listing, row.data);
  const makeName = getMake(listing.brandSlug)?.name ?? listing.brandSlug;
  const similar = preview ? [] : await similarTo(listing);
  const generationName = context ? context.gen.name ?? context.gen.code : model ? listing.generation : null;

  const specs: [string, React.ReactNode][] = [
    ["Rok výroby", listing.year],
    ["Najeto", formatKm(listing.mileageKm)],
    ["Motor", listing.engine],
    ["Výkon", `${listing.powerKw} kW`],
    ["Palivo", FUEL_LABEL[listing.fuel]],
    ["Převodovka", listing.transmission],
    ["Karoserie", BODY_KEYS[row.data.body] ?? BODY_LABEL[listing.body]],
    ["Barva", listing.color],
    ...(generationName ? [["Generace", generationName] as [string, React.ReactNode]] : []),
    ["VIN", listing.vin],
    ["Místo", <Place key="m" city={listing.city} fallback={listing.region} region={listing.region === "Praha" ? undefined : regionLabel(listing.region)} />],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {preview && (
        <p className="card p-3 mb-4 text-sm text-[var(--color-warn)]">
          Náhled: inzerát je ve stavu „{STATUS_LABEL[row.status]}“ a veřejnost ho nevidí.{" "}
          <Link href={`/ucet/inzerat/${row.id}/`} className="underline">Spravovat</Link>
        </p>
      )}
      <nav className="text-sm text-[var(--color-muted)]">
        <Link href="/inzeraty/" className="hover:text-[var(--color-ink)]">Inzeráty</Link> /{" "}
        <Link href={`/inzeraty/?znacka=${listing.brandSlug}`} className="hover:text-[var(--color-ink)]">{makeName}</Link>
      </nav>
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">{title}</h1>

      <div className={`grid gap-5 lg:grid-cols-[1fr_340px] ${model ? "xl:grid-cols-[1fr_340px_300px]" : ""} mt-5 items-start`}>
        <div className="space-y-4 min-w-0">
          {listing.photos?.length ? (
            <PhotoGallery photos={listing.photos} title={title} />
          ) : context?.drawing ? (
            <div className="card overflow-hidden"><FrontDrawing id={context.drawing} alt={title} /></div>
          ) : (
            <div className="card overflow-hidden"><CarImage body={listing.body} color={listing.color} className="w-full aspect-[16/10]" /></div>
          )}
          {listing.description && (
            <section className="card p-4">
              <h2 className="font-bold">Popis prodejce</h2>
              <p className="mt-1 text-[var(--color-muted)] whitespace-pre-line">{listing.description}</p>
            </section>
          )}
          {listing.features.length > 0 && (
            <section className="card p-4">
              <h2 className="font-bold">Výbava</h2>
              <ul className="mt-2 flex flex-wrap gap-1.5 text-sm">
                {listing.features.map((f) => <li key={f} className="chip bg-[var(--color-field)] text-[var(--color-ink-soft)]">{f}</li>)}
              </ul>
            </section>
          )}
          {context && <GenerationCard context={context} makeName={makeName} brandSlug={listing.brandSlug} />}
          {context && <CzechData context={context} listing={listing} makeName={makeName} />}
        </div>

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
                <p className="mt-1.5 text-[var(--color-muted)]">Odhad {formatPrice(estimate.median)} z {estimate.comparables} podobných inzerátů.</p>
              </div>
            )}
            <p className="mt-1 text-xs text-[var(--color-muted)]">Cena při platbě najednou.</p>
            <h2 className="mt-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Údaje od prodejce</h2>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              {specs.map(([k, v]) => (
                <div key={k} className="contents"><dt className="text-[var(--color-muted)]">{k}</dt><dd className="font-medium">{v}</dd></div>
              ))}
            </dl>
          </section>
          <section className="card p-4 space-y-3">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-field)] text-lg" aria-hidden="true">👤</span>
              <div>
                <div className="font-semibold">{listing.sellerName}</div>
                <div className="text-xs text-[var(--color-muted)]">Soukromý prodejce · vloženo {formatDate(listing.postedAt)}</div>
              </div>
            </div>
            {row.phone ? <PhoneReveal phone={row.phone} messengers={row.messengers} /> : <p className="text-sm text-[var(--color-muted)]">Prodejce neuvedl telefon.</p>}
            {!preview && viewer?.user.id !== row.userId && <WriteSeller listingId={row.id} signedIn={Boolean(viewer)} />}
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm">Přidat do výběru</span>
              <FavoriteButton id={listing.id} label={title} />
            </div>
          </section>
          {/* Sellers cannot report their own listing; they manage it in the account instead. */}
          {!preview && viewer?.user.id !== row.userId && (
            <section className="card p-4">
              <ReportListing listingId={row.id} name={viewer?.user.name ?? ""} email={viewer?.user.email ?? ""} />
            </section>
          )}
        </div>

        {model && (
          <aside className="lg:col-span-2 xl:col-span-1">
            <ModelSidebar model={model} />
          </aside>
        )}
      </div>

      {similar.length > 0 && (
        <section className="mt-10">
          <div className="flex items-end justify-between gap-3 mb-4">
            <h2 className="text-xl font-bold">Podobná auta</h2>
            <Link href={`/inzeraty/?znacka=${listing.brandSlug}`} className="text-sm font-semibold text-[var(--color-brand)]">
              Všechny {makeName} →
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
