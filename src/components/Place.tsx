"use client";

import { distanceKm, getCity } from "@/lib/geo";
import { savedLocation } from "@/lib/storage";

/** Town of a listing, plus the distance from the visitor's chosen town when there is one. */
export function Place({ city, fallback, region }: { city: string; fallback: string; region?: string }) {
  const location = savedLocation.useValue();
  const here = getCity(city);
  const center = getCity(location?.city);
  if (!here) return <>{fallback}</>;
  const km = center && center.slug !== here.slug ? Math.round(distanceKm(here, center)) : null;
  return (
    <>
      {here.name}
      {region && `, ${region}`}
      {km !== null && <span className="text-[var(--color-muted)]"> · {km} km</span>}
    </>
  );
}
