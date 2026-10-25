import Link from "next/link";
import { getBrand, getModel } from "@/lib/catalog";
import { formatKm, formatPrice } from "@/lib/format";
import { marketEstimate } from "@/lib/market";
import type { Listing } from "@/lib/types";
import { CarImage } from "./CarImage";
import { PriceMeter } from "./VerdictBadge";

/** Compact tile for carousels and "similar cars". */
export function ListingCard({ listing }: { listing: Listing }) {
  const brand = getBrand(listing.brandSlug);
  const model = getModel(listing.brandSlug, listing.modelSlug);
  const estimate = marketEstimate(listing);
  return (
    <Link href={`/inzeraty/${listing.id}/`} className="card overflow-hidden flex flex-col hover:border-[var(--color-brand)] transition-colors">
      <CarImage body={listing.body} color={listing.color} className="w-full aspect-[16/10]" />
      <div className="p-3 flex flex-col gap-1 flex-1">
        <h3 className="font-semibold leading-tight">{brand?.name} {model?.name}, {listing.year}</h3>
        <p className="text-xs text-[var(--color-muted)]">{formatKm(listing.mileageKm)} · {listing.region}</p>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="font-extrabold">{formatPrice(listing.price)}</span>
          {estimate && <PriceMeter score={estimate.score} />}
        </div>
      </div>
    </Link>
  );
}
