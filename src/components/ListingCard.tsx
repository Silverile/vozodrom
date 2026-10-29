import Link from "next/link";
import { getBrand, getModel } from "@/lib/catalog";
import { formatKm, formatPrice } from "@/lib/format";
import { marketEstimate } from "@/lib/market";
import type { Listing } from "@/lib/types";
import { CarImage } from "./CarImage";
import { FrontDrawing, frontDrawingFor } from "./FrontDrawing";
import { FavoriteButton } from "./FavoriteButton";
import { Place } from "./Place";
import { PriceMeter } from "./VerdictBadge";

/** Compact tile for carousels and "similar cars". */
export function ListingCard({ listing }: { listing: Listing }) {
  const brand = getBrand(listing.brandSlug);
  const model = getModel(listing.brandSlug, listing.modelSlug);
  const estimate = marketEstimate(listing);
  const name = `${brand?.name} ${model?.name}, ${listing.year}`;
  const drawing = frontDrawingFor(listing.brandSlug, listing.modelSlug, listing.year);
  return (
    <article className="card relative min-w-0 overflow-hidden flex flex-col hover:border-[var(--color-brand)] focus-within:border-[var(--color-brand)] transition-colors">
      {drawing ? (
        <FrontDrawing id={drawing} alt={name} />
      ) : (
        <CarImage body={listing.body} color={listing.color} className="w-full aspect-[16/10]" />
      )}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <h3 className="font-semibold leading-tight">
          <Link href={`/inzeraty/${listing.id}/`} className="after:absolute after:inset-0 focus:outline-none">{name}</Link>
        </h3>
        <p className="text-xs text-[var(--color-muted)]">{formatKm(listing.mileageKm)} · <Place city={listing.city} fallback={listing.region} /></p>
        <div className="mt-auto pt-2 flex flex-col items-start gap-2">
          <div className="flex w-full items-center justify-between gap-3">
            <span className="font-extrabold whitespace-nowrap">{formatPrice(listing.price)}</span>
            <FavoriteButton id={listing.id} label={name} className="relative z-10 shrink-0 !h-8 !w-8 text-base" />
          </div>
          {estimate && <PriceMeter score={estimate.score} />}
        </div>
      </div>
    </article>
  );
}
