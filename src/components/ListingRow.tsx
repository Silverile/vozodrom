import Link from "next/link";
import { FUEL_LABEL, getBrand, getModel } from "@/lib/catalog";
import { getMake, modelLinesOf } from "@/lib/makes";
import { formatAgo, formatKm, formatPrice, listingHref } from "@/lib/format";
import { photoUrl } from "@/lib/listing-status";
import { marketEstimate } from "@/lib/market";
import type { Listing } from "@/lib/types";
import { CarImage } from "./CarImage";
import { FrontDrawing, frontDrawingFor } from "./FrontDrawing";
import { FavoriteButton } from "./FavoriteButton";
import { Place } from "./Place";
import { StkBadge } from "./StkBadge";
import { PriceMeter, VerdictBadge } from "./VerdictBadge";

/**
 * Search-result card: photo left, specs in the middle, cash price and its market
 * rating on the right. The title link stretches over the whole card so the
 * shortlist button can stay a separate, focusable control.
 */
/** compact: the two-column phone layout at any width, for narrow places such as the form preview. */
export function ListingRow({ listing, drawing: given, compact = false }: { listing: Listing; drawing?: string | null; compact?: boolean }) {
  const brand = getBrand(listing.brandSlug);
  const model = getModel(listing.brandSlug, listing.modelSlug);
  const estimate = marketEstimate(listing);
  // modelSlug is a demo-catalogue model, a model line slug (user listings) or a typed name.
  const modelName = model?.name ?? modelLinesOf(listing.brandSlug).find((l) => l.slug === listing.modelSlug)?.name ?? listing.modelSlug;
  const name = `${brand?.name ?? getMake(listing.brandSlug)?.name ?? ""} ${modelName}, ${listing.year}`;
  // no seller photos yet: the generation's front drawing, else the body-type pictogram
  const drawing = given !== undefined ? given : frontDrawingFor(listing.brandSlug, listing.modelSlug, listing.year);
  return (
    <article className={`card relative min-w-0 grid grid-cols-[112px_minmax(0,1fr)] ${compact ? "" : "sm:grid-cols-[200px_minmax(0,1fr)_auto]"} gap-x-4 gap-y-2 p-3 hover:border-[var(--color-brand)] focus-within:border-[var(--color-brand)] transition-colors`}>
      <div className="self-start overflow-hidden rounded-[10px]">
        {listing.photos?.[0] ? (
          <img src={photoUrl(listing.photos[0].key)} alt={name} className="w-full aspect-[4/3] object-cover bg-[var(--color-photo)]" loading="lazy" />
        ) : drawing ? (
          <FrontDrawing id={drawing} alt={name} aspect="aspect-[4/3]" />
        ) : (
          <CarImage body={listing.body} color={listing.color} className="w-full aspect-[4/3]" />
        )}
      </div>
      <div className="min-w-0">
        <h3 className="font-bold leading-tight">
          <Link href={listingHref(listing)} className="after:absolute after:inset-0 after:rounded-[14px] focus:outline-none">
            {name}
          </Link>
        </h3>
        <p className="text-sm text-[var(--color-muted)] truncate">{listing.generation} · {listing.engine}</p>
        <p className="text-sm mt-1.5">
          {listing.powerKw} kW · {FUEL_LABEL[listing.fuel].toLowerCase()} · {listing.transmission} · {formatKm(listing.mileageKm)}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-2 [&>.chip]:max-w-full [&>.chip]:whitespace-normal">
          {estimate && <VerdictBadge verdict={estimate.verdict} />}
          <StkBadge listing={listing} />
          {listing.battery && (
            <span className="chip bg-[var(--color-info-soft)] text-[var(--color-info)]">🔋 {listing.battery.capacityKwh} kWh</span>
          )}
          {listing.sellerType === "soukromý" && <span className="chip bg-[var(--color-field)] text-[var(--color-ink-soft)]">Soukromý prodejce</span>}
        </div>
      </div>
      <div className={compact ? "col-span-2 min-w-0 flex flex-col items-start gap-1" : "col-span-2 sm:col-span-1 sm:col-start-3 min-w-0 flex flex-col items-start sm:items-end gap-1 sm:text-right"}>
        <div className={`flex w-full items-center justify-between gap-3 ${compact ? "" : "sm:w-auto"}`}>
          <span className="text-xl font-extrabold tracking-tight whitespace-nowrap">
            {formatPrice(listing.price)}
            <span className="sr-only"> (cena při platbě v hotovosti)</span>
          </span>
          <FavoriteButton id={listing.id} label={name} className="relative z-10 shrink-0 !h-8 !w-8 text-base" />
        </div>
        {estimate && !compact && <span className="hidden sm:inline-flex"><PriceMeter score={estimate.score} /></span>}
        <span className={`text-xs text-[var(--color-muted)] ${compact ? "" : "sm:mt-auto"}`}><Place city={listing.city} fallback={listing.region} /> · {formatAgo(listing.postedAt)}</span>
      </div>
    </article>
  );
}
