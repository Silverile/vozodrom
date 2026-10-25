"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type City, OPEN_LOCATION_PICKER, RADII, SEARCH_PAGE, parseCityList } from "@/lib/geo";
import { savedLocation } from "@/lib/storage";

// Location state shared by the header picker and every search page. On search pages the
// towns live in the URL (shareable, saved searches: ?mesto=brno,olomouc&okruh=50; "cr" is
// the whole country); elsewhere, and as the default, the towns chosen in the header apply.

export function useSearchLocation() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const stored = savedLocation.useValue();
  const onSearchPage = SEARCH_PAGE.test(pathname);

  const cityParam = onSearchPage ? params.get("mesto") : null;
  const centers: City[] = cityParam ? (cityParam === "cr" ? [] : parseCityList(cityParam)) : parseCityList(stored?.cities.join(","));
  const rawRadius = Number(cityParam ? params.get("okruh") ?? 0 : stored?.radius ?? 0);
  const radius = (RADII as readonly number[]).includes(rawRadius) ? rawRadius : 0;

  /** Saves the towns for next visits and, on a search page, puts them in the URL. */
  function setLocation(cities: string[], km: number, extra: Record<string, string> = {}) {
    savedLocation.write(cities.length ? { cities, radius: km } : null);
    if (!onSearchPage) return;
    const next = new URLSearchParams(params.toString());
    next.set("mesto", cities.length ? cities.join(",") : "cr");
    if (cities.length && km) next.set("okruh", String(km));
    else next.delete("okruh");
    if (!cities.length && next.get("razeni") === "nejblize") next.delete("razeni");
    for (const [key, value] of Object.entries(extra)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  return { centers, radius, setLocation };
}

/** "Celá ČR · 📍 Brno ✕ · 📍 Olomouc ✕ · jen města · +25 km … · Přidat město" pills above results. */
export function LocationPills() {
  const { centers, radius, setLocation } = useSearchLocation();
  const slugs = centers.map((c) => c.slug);
  const openPicker = () => window.dispatchEvent(new Event(OPEN_LOCATION_PICKER));
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Místo">
      <button className="pill" data-on={centers.length === 0} aria-pressed={centers.length === 0} onClick={() => setLocation([], 0)}>
        Celá ČR
      </button>
      {centers.map((c) => (
        <button
          key={c.slug}
          className="pill"
          data-on="true"
          aria-label={`Odebrat ${c.name}`}
          onClick={() => setLocation(slugs.filter((s) => s !== c.slug), radius)}
        >
          📍 {c.name} ✕
        </button>
      ))}
      {centers.length > 0 &&
        RADII.map((km) => (
          <button key={km} className="pill" data-on={radius === km} aria-pressed={radius === km} onClick={() => setLocation(slugs, km)}>
            {km === 0 ? (centers.length > 1 ? "jen tato města" : "jen město") : `+${km} km`}
          </button>
        ))}
      <button className="pill" onClick={openPicker}>{centers.length ? "+ Přidat město" : "📍 Vybrat město"}</button>
    </div>
  );
}
