import Link from "next/link";
import { FUEL_LABEL, getBrand, getModel } from "@/lib/catalog";
import { formatAgo, formatKm, formatPrice } from "@/lib/format";
import { marketEstimate } from "@/lib/market";
import type { Listing } from "@/lib/types";
import { CarImage } from "./CarImage";
import { FavoriteButton } from "./FavoriteButton";
import { StkBadge } from "./StkBadge";
import { PriceMeter, VerdictBadge } from "./VerdictBadge";

/**
 * Search-result card: photo left, specs in the middle, cash price and its market
 * rating on the right. The title link stretches over the whole card so the
 * shortlist button can stay a separate, focusable control.
 */
export function ListingRow({ listing }: { listing: Listing }) {
  const brand = getBrand(listing.brandSlug);
  const model = getModel(listing.brandSlug, listing.modelSlug);
  const estimate = marketEstimate(listing);
  const name = `${brand?.name} ${model?.name}, ${listing.year}`;
  return (
    <article className="card relative grid grid-cols-[112px_1fr] sm:grid-cols-[200px_1fr_auto] gap-x-4 gap-y-2 p-3 hover:border-[var(--color-brand)] focus-within:border-[var(--color-brand)] transition-colors">
      <div className="row-span-2 sm:row-span-1 self-start overflow-hidden rounded-[10px]">
        <CarImage body={listing.body} color={listing.color} className="w-full aspect-[4/3]" />
      </div>
      <div className="min-w-0">
        <h3 className="font-bold leading-tight">
          <Link href={`/inzeraty/${listing.id}/`} className="after:absolute after:inset-0 after:rounded-[14px] focus:outline-none">
            {name}
          </Link>
        </h3>
        <p className="text-sm text-[var(--color-muted)] truncate">{listing.generation} · {listing.engine}</p>
        <p className="text-sm mt-1.5">
          {listing.powerKw} kW · {FUEL_LABEL[listing.fuel].toLowerCase()} · {listing.transmission} · {formatKm(listing.mileageKm)}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {estimate && <VerdictBadge verdict={estimate.verdict} />}
          <StkBadge listing={listing} />
          {listing.battery && (
            <span className="chip bg-[var(--color-info-soft)] text-[var(--color-info)]">🔋 {listing.battery.capacityKwh} kWh</span>
          )}
          {listing.sellerType === "soukromý" && <span className="chip bg-[var(--color-field)] text-[#d5dbe1]">Soukromý prodejce</span>}
        </div>
      </div>
      <div className="col-start-2 sm:col-start-3 flex sm:flex-col items-baseline sm:items-end justify-between gap-1 sm:text-right">
        <span className="text-xl font-extrabold tracking-tight whitespace-nowrap">
          {formatPrice(listing.price)}
          <span className="sr-only"> (cena při platbě v hotovosti)</span>
        </span>
        {estimate && <PriceMeter score={estimate.score} className="hidden sm:inline-flex" />}
        <span className="text-xs text-[var(--color-muted)] sm:mt-auto whitespace-nowrap">{listing.region} · {formatAgo(listing.postedAt)}</span>
      </div>
      <FavoriteButton id={listing.id} label={name} className="absolute left-5 top-5 z-10 !h-8 !w-8 text-base" />
    </article>
  );
}
