"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { REGIONS } from "@/lib/catalog";
import { CITIES, OPEN_LOCATION_PICKER, citiesIn, getCity, nearestCity } from "@/lib/geo";
import { savedLocation } from "@/lib/storage";

// Header control for the visitor's town, like Drom's city switch. "Use my location"
// asks the browser for a position and maps it to the nearest town on the device;
// coordinates are never stored or sent anywhere, only the chosen town is kept.

export function LocationPicker() {
  const location = savedLocation.useValue();
  const city = getCity(location?.city);
  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const open = () => dialog.current?.showModal();
    window.addEventListener(OPEN_LOCATION_PICKER, open);
    return () => window.removeEventListener(OPEN_LOCATION_PICKER, open);
  }, []);

  function choose(slug: string | null) {
    const radius = location?.radius ?? 0;
    savedLocation.write(slug ? { city: slug, radius } : null);
    // On the search page the location lives in the URL, so update it there too.
    if (/^\/inzeraty\/?$/.test(pathname)) {
      const next = new URLSearchParams(params.toString());
      next.set("mesto", slug ?? "cr");
      if (slug && radius) next.set("okruh", String(radius));
      else next.delete("okruh");
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    }
    setQuery("");
    setStatus(null);
    dialog.current?.close();
  }

  function useMyPosition() {
    if (!("geolocation" in navigator)) {
      setStatus("Prohlížeč polohu nepodporuje. Vyberte místo ze seznamu.");
      return;
    }
    setStatus("Zjišťuji polohu…");
    navigator.geolocation.getCurrentPosition(
      (pos) => choose(nearestCity({ lat: pos.coords.latitude, lon: pos.coords.longitude }).slug),
      () => setStatus("Polohu se nepodařilo zjistit nebo jste ji nepovolili. Vyberte místo ze seznamu."),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  }

  const needle = query.trim().toLocaleLowerCase("cs");
  const matches = needle ? CITIES.filter((c) => c.name.toLocaleLowerCase("cs").includes(needle)) : null;

  return (
    <>
      <button
        onClick={() => dialog.current?.showModal()}
        className="flex items-center gap-1 px-2 py-2 rounded-lg text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-field)] whitespace-nowrap"
        aria-label={`Místo: ${city?.name ?? "celá ČR"}. Změnit`}
      >
        <span aria-hidden="true">📍</span>
        <span className="max-w-20 sm:max-w-28 truncate">{city ? city.name : "Celá ČR"}</span>
        {city && location!.radius > 0 && <span className="hidden sm:inline">+{location!.radius} km</span>}
      </button>

      <dialog
        ref={dialog}
        aria-labelledby="location-title"
        className="card m-auto w-[min(640px,calc(100vw-32px))] max-h-[85vh] p-0 text-[var(--color-ink)] backdrop:bg-black/60"
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      >
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 id="location-title" className="text-xl font-bold">Kde hledáte auto?</h2>
            <button className="text-[var(--color-muted)] hover:text-[var(--color-ink)] text-lg" aria-label="Zavřít" onClick={() => dialog.current?.close()}>✕</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="pill" onClick={useMyPosition}>📍 Použít mou polohu</button>
            <button className="pill" data-on={!city} onClick={() => choose(null)}>Celá ČR</button>
          </div>
          {status && <p role="status" className="text-sm text-[var(--color-warn)]">{status}</p>}
          <input
            className="input"
            placeholder="Hledat město…"
            aria-label="Hledat město"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="max-h-[45vh] overflow-y-auto pr-1">
            {matches ? (
              matches.length ? (
                <ul className="flex flex-wrap gap-2">
                  {matches.map((c) => (
                    <li key={c.slug}><button className="pill" data-on={c.slug === city?.slug} onClick={() => choose(c.slug)}>{c.name}</button></li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--color-muted)]">Takové město v seznamu nemáme. Zkuste nejbližší větší město.</p>
              )
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {REGIONS.map((r) => (
                  <div key={r}>
                    <h3 className="text-xs uppercase tracking-wide text-[var(--color-muted)] mb-1">{r}</h3>
                    <ul className="flex flex-wrap gap-1">
                      {citiesIn(r).map((c) => (
                        <li key={c.slug}>
                          <button
                            className="text-sm px-2 py-1 rounded-md hover:bg-[var(--color-field)] data-[on=true]:text-[var(--color-brand)]"
                            data-on={c.slug === city?.slug}
                            onClick={() => choose(c.slug)}
                          >
                            {c.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-[var(--color-muted)]">
            Poloha se zjišťuje jen ve vašem prohlížeči a slouží k výběru nejbližšího města. Ukládáme jen zvolené město, nikoli souřadnice.
          </p>
        </div>
      </dialog>
    </>
  );
}
