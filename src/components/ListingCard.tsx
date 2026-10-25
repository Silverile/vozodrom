import Link from "next/link";
import { FUEL_LABEL, getBrand, getModel } from "@/lib/catalog";
import { formatKm, formatPrice } from "@/lib/format";
import { marketEstimate } from "@/lib/market";
import type { Listing } from "@/lib/types";
import { CarImage } from "./CarImage";
import { VerdictBadge } from "./VerdictBadge";

export function ListingCard({ listing }: { listing: Listing }) {
  const brand = getBrand(listing.brandSlug);
  const model = getModel(listing.brandSlug, listing.modelSlug);
  const estimate = marketEstimate(listing);
  return (
    <Link
      href={`/inzeraty/${listing.id}/`}
      className="card overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition"
    >
      <CarImage body={listing.body} color={listing.color} className="w-full aspect-[16/9]" />
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">
            {brand?.name} {model?.name}
            <span className="block text-sm font-normal text-[var(--color-muted)]">{listing.generation}</span>
          </h3>
          {estimate && <VerdictBadge verdict={estimate.verdict} />}
        </div>
        <p className="text-sm text-[var(--color-muted)]">
          {listing.year} · {formatKm(listing.mileageKm)} · {FUEL_LABEL[listing.fuel]} · {listing.transmission}
        </p>
        <div className="mt-auto flex items-end justify-between">
          <span className="text-xl font-bold">{formatPrice(listing.price)}</span>
          <span className="text-xs text-[var(--color-muted)]">{listing.region}</span>
        </div>
      </div>
    </Link>
  );
}
