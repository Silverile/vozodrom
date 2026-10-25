"use client";

import { getCity, nearestDistance, parseCityList } from "@/lib/geo";
import { savedLocation } from "@/lib/storage";

/** Town of a listing, plus the distance to the nearest of the visitor's chosen towns. */
export function Place({ city, fallback, region }: { city: string; fallback: string; region?: string }) {
  const location = savedLocation.useValue();
  const here = getCity(city);
  const centers = parseCityList(location?.cities.join(","));
  if (!here) return <>{fallback}</>;
  const nearest = nearestDistance(here.slug, centers);
  const km = Number.isFinite(nearest) && nearest > 0 ? Math.round(nearest) : null;
  return (
    <>
      {here.name}
      {region && `, ${region}`}
      {km !== null && <span className="text-[var(--color-muted)]"> · {km} km</span>}
    </>
  );
}
