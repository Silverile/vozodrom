"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { REGIONS } from "@/lib/catalog";
import { CITIES, OPEN_LOCATION_PICKER, citiesIn, getCity, nearestCity } from "@/lib/geo";
import { sectionOf } from "@/lib/sections";
import { useSearchLocation } from "./LocationPills";

// Header control for the visitor's towns, like Drom's city switch, but several towns can be
// chosen at once. "Use my location" asks the browser for a position and adds the nearest
// town on the device; coordinates are never stored or sent anywhere, only town names.

const TITLE: Record<string, string> = {
  auto: "Kde hledáte auto?",
  technika: "Kde hledáte techniku?",
  moto: "Kde hledáte motorku?",
  dily: "Kde hledáte díly?",
  pneu: "Kde hledáte pneumatiky?",
};

export function LocationPicker() {
  const { centers, radius, setLocation } = useSearchLocation();
  const section = sectionOf(usePathname());
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  function open() {
    setSelected(centers.map((c) => c.slug));
    setQuery("");
    setStatus(null);
    dialog.current?.showModal();
    // Focus the dialog itself: focusing the first button made WebKit draw a square ring on ✕.
    dialog.current?.focus();
  }

  useEffect(() => {
    window.addEventListener(OPEN_LOCATION_PICKER, open);
    return () => window.removeEventListener(OPEN_LOCATION_PICKER, open);
  });

  const toggle = (slug: string) => setSelected((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));

  function apply(cities: string[]) {
    setLocation(cities, cities.length ? radius : 0);
    dialog.current?.close();
  }

  function useMyPosition() {
    if (!("geolocation" in navigator)) {
      setStatus("Prohlížeč polohu nepodporuje. Vyberte místo ze seznamu.");
      return;
    }
    setStatus("Zjišťuji polohu…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const town = nearestCity({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setSelected((s) => (s.includes(town.slug) ? s : [...s, town.slug]));
        setStatus(`Přidáno: ${town.name}`);
      },
      () => setStatus("Polohu se nepodařilo zjistit nebo jste ji nepovolili. Vyberte místo ze seznamu."),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  }

  const needle = query.trim().toLocaleLowerCase("cs");
  const matches = needle ? CITIES.filter((c) => c.name.toLocaleLowerCase("cs").includes(needle)) : null;
  const first = centers[0];
  const townButton = "text-sm px-2.5 py-1 rounded-md hover:bg-[var(--color-field)] data-[on=true]:bg-[var(--color-brand-soft)] data-[on=true]:text-[var(--color-brand)] data-[on=true]:font-semibold";

  return (
    <>
      <button
        onClick={open}
        className="flex items-center gap-1 px-2 py-2 rounded-lg text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-field)] whitespace-nowrap"
        aria-label={`Místo: ${centers.length ? centers.map((c) => c.name).join(", ") : "celá ČR"}. Změnit`}
      >
        <span aria-hidden="true">📍</span>
        <span className="hidden min-[400px]:inline max-w-24 sm:max-w-32 truncate">{first ? first.name : "Celá ČR"}</span>
        {centers.length > 1 && <span>+{centers.length - 1}</span>}
        {first && radius > 0 && <span className="hidden sm:inline">· {radius} km</span>}
      </button>

      <dialog
        ref={dialog}
        tabIndex={-1}
        aria-labelledby="location-title"
        className="card m-auto w-[min(640px,calc(100vw-32px))] max-h-[85vh] p-0 text-[var(--color-ink)] backdrop:bg-black/60 focus:outline-none"
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      >
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 id="location-title" className="text-xl font-bold">{TITLE[section?.key ?? ""] ?? "Vyberte místo"}</h2>
            <button
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-field)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
              aria-label="Zavřít"
              onClick={() => dialog.current?.close()}
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-[var(--color-muted)]">Vyberte jedno nebo více měst. Okruh nastavíte ve výsledcích hledání.</p>
          <div className="flex flex-wrap gap-2">
            <button className="pill" onClick={useMyPosition}>📍 Použít mou polohu</button>
            {selected.map((slug) => (
              <button key={slug} className="pill" data-on="true" aria-label={`Odebrat ${getCity(slug)?.name}`} onClick={() => toggle(slug)}>
                {getCity(slug)?.name} ✕
              </button>
            ))}
          </div>
          {status && <p role="status" className="text-sm text-[var(--color-warn)]">{status}</p>}
          <input
            className="input"
            placeholder="Hledat město…"
            aria-label="Hledat město"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="max-h-[38vh] overflow-y-auto pr-1">
            {matches ? (
              matches.length ? (
                <ul className="flex flex-wrap gap-1">
                  {matches.map((c) => (
                    <li key={c.slug}>
                      <button className={townButton} data-on={selected.includes(c.slug)} aria-pressed={selected.includes(c.slug)} onClick={() => toggle(c.slug)}>{c.name}</button>
                    </li>
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
                          <button className={townButton} data-on={selected.includes(c.slug)} aria-pressed={selected.includes(c.slug)} onClick={() => toggle(c.slug)}>
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
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-line)] pt-4">
            <button className="pill" onClick={() => apply([])}>Celá ČR</button>
            <button className="btn-cta text-sm" onClick={() => apply(selected)}>
              {selected.length ? `Použít (${selected.length})` : "Hledat v celé ČR"}
            </button>
          </div>
          <p className="text-xs text-[var(--color-muted)]">
            Poloha se zjišťuje jen ve vašem prohlížeči a slouží k výběru nejbližšího města. Ukládáme jen zvolená města, nikoli souřadnice.
          </p>
        </div>
      </dialog>
    </>
  );
}
