"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CATEGORIES, type ItemSection, TYRE_OPTIONS, categoryOf, itemsOf } from "@/lib/classifieds";
import { nearestDistance, withinAny } from "@/lib/geo";
import { CategoryIcon } from "./CategoryIcon";
import { ItemRow } from "./ItemRow";
import { LocationPills, useSearchLocation } from "./LocationPills";

// Search for the non-car sections: category tiles with counts, the same town + radius
// pills as car search, a compact filter bar and, for tyres, the size and count filters
// Drom users expect. All state lives in the URL so results can be shared.

const PRICE_STEPS: Record<ItemSection, number[]> = {
  technika: [200_000, 500_000, 1_000_000, 2_000_000, 4_000_000],
  moto: [50_000, 100_000, 200_000, 350_000],
  dily: [1_000, 3_000, 5_000, 10_000],
  pneu: [2_000, 5_000, 10_000, 20_000],
};

const nf = new Intl.NumberFormat("cs-CZ");
const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function SectionSearch({ section }: { section: ItemSection }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { centers, radius } = useSearchLocation();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = params.get("q") ?? "";
  const category = params.get("kategorie") ?? "";
  const condition = params.get("stav") ?? "";
  const priceMax = Number(params.get("cenaDo") ?? 0);
  const sort = params.get("razeni") ?? "nejnovejsi";
  const width = Number(params.get("sirka") ?? 0);
  const profile = Number(params.get("profil") ?? 0);
  const rim = Number(params.get("prumer") ?? 0);
  const count = Number(params.get("kusy") ?? 0);

  function update(changes: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const all = useMemo(() => itemsOf(section), [section]);
  const needle = fold(q.trim());
  const base = all
    .filter((i) => !needle || fold([i.title, i.make, ...(i.fits ?? []), ...i.specs.map((s) => s[1])].join(" ")).includes(needle))
    .filter((i) => !condition || (condition === "nove" ? i.condition === "nové" : i.condition === "použité"))
    .filter((i) => !priceMax || i.price <= priceMax)
    .filter((i) => !width || i.tyre?.width === width)
    .filter((i) => !profile || i.tyre?.profile === profile)
    .filter((i) => !rim || i.tyre?.rim === rim)
    .filter((i) => !count || i.tyre?.count === count)
    .filter((i) => centers.length === 0 || withinAny(i.city, centers, radius));
  // Category counts reflect every other filter, so the tiles say how many results a click gives.
  const counts = new Map(CATEGORIES[section].map((c) => [c.slug, base.filter((i) => i.category === c.slug).length]));
  const results = base
    .filter((i) => !category || i.category === category)
    .sort((a, b) =>
      sort === "nejlevnejsi" ? a.price - b.price
        : sort === "nejdrazsi" ? b.price - a.price
          : sort === "nejblize" && centers.length ? nearestDistance(a.city, centers) - nearestDistance(b.city, centers)
            : b.postedAt.localeCompare(a.postedAt),
    );

  const activeCategory = categoryOf(section, category);
  const hasFilters = [q, category, condition, priceMax, width, profile, rim, count].some(Boolean);

  return (
    <>
      <ul className={`mt-6 grid gap-3 grid-cols-2 ${CATEGORIES[section].length > 4 ? "sm:grid-cols-3 lg:grid-cols-4" : "sm:grid-cols-4"}`}>
        {CATEGORIES[section].map((c) => {
          const on = c.slug === category;
          return (
            <li key={c.slug}>
              <button
                onClick={() => update({ kategorie: on ? "" : c.slug })}
                aria-pressed={on}
                className={`card w-full h-full p-4 text-left flex items-center justify-between gap-3 hover:border-[var(--color-brand)] ${on ? "!border-[var(--color-brand)] bg-[var(--color-brand-soft)]" : ""}`}
              >
                <span>
                  <span className="block font-semibold leading-tight">{c.label}</span>
                  <span className="block text-sm text-[var(--color-muted)] mt-0.5">{counts.get(c.slug)}</span>
                </span>
                <CategoryIcon slug={c.slug} className="w-14 shrink-0 text-[var(--color-ink)]" />
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-2">
        <LocationPills />
      </div>

      <div className="mt-3 flex items-center gap-2 md:hidden">
        <button className="pill" data-on={filtersOpen} aria-expanded={filtersOpen} aria-controls="section-filters" onClick={() => setFiltersOpen((o) => !o)}>
          ⚙ Filtry
        </button>
      </div>
      <div id="section-filters" className={`card p-3 mt-3 gap-2 grid-cols-2 md:grid-cols-4 ${filtersOpen ? "grid" : "hidden md:grid"}`}>
        <label className="col-span-2">
          <span className="sr-only">Hledat</span>
          <input
            className="input"
            placeholder={section === "dily" ? "Díl, výrobce nebo model auta…" : section === "pneu" ? "Značka nebo dezén…" : "Značka, model…"}
            value={q}
            onChange={(e) => update({ q: e.target.value })}
          />
        </label>
        <label>
          <span className="sr-only">Stav</span>
          <select className="input" value={condition} onChange={(e) => update({ stav: e.target.value })}>
            <option value="">Nové i použité</option>
            <option value="nove">Nové</option>
            <option value="pouzite">Použité</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Cena do</span>
          <select className="input" value={priceMax || ""} onChange={(e) => update({ cenaDo: e.target.value })}>
            <option value="">Cena do</option>
            {PRICE_STEPS[section].map((p) => <option key={p} value={p}>{nf.format(p)} Kč</option>)}
          </select>
        </label>
        {section === "pneu" && (
          <>
            {([["sirka", "Šířka", TYRE_OPTIONS.width, width], ["profil", "Profil", TYRE_OPTIONS.profile, profile], ["prumer", "Průměr", TYRE_OPTIONS.rim, rim]] as const).map(
              ([key, label, options, value]) => (
                <label key={key}>
                  <span className="sr-only">{label}</span>
                  <select className="input" value={value || ""} onChange={(e) => update({ [key]: e.target.value })}>
                    <option value="">{label}</option>
                    {options.map((o) => <option key={o} value={o}>{key === "prumer" ? `R${o}` : o}</option>)}
                  </select>
                </label>
              ),
            )}
            <div className="flex gap-1" role="group" aria-label="Počet kusů">
              {[1, 2, 4].map((k) => (
                <button key={k} className="pill flex-1" data-on={count === k} aria-pressed={count === k} onClick={() => update({ kusy: count === k ? "" : String(k) })}>
                  {k} ks
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 mb-3">
        <p className="font-semibold" aria-live="polite">
          {activeCategory ? `${activeCategory.label}: ` : ""}{results.length} inzerátů
          {hasFilters && (
            <button className="ml-3 text-sm font-normal text-[var(--color-muted)] hover:text-[var(--color-ink)]" onClick={() => router.replace(pathname, { scroll: false })}>
              Zrušit filtry
            </button>
          )}
        </p>
        <select className="input w-auto" value={sort} onChange={(e) => update({ razeni: e.target.value })} aria-label="Řazení">
          <option value="nejnovejsi">Nejnovější</option>
          <option value="nejlevnejsi">Nejlevnější</option>
          <option value="nejdrazsi">Nejdražší</option>
          {centers.length > 0 && <option value="nejblize">Nejblíže</option>}
        </select>
      </div>
      {results.length === 0 ? (
        <div className="card p-10 text-center text-[var(--color-muted)]">Žádný inzerát neodpovídá filtrům.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {results.map((i) => <ItemRow key={i.id} item={i} />)}
        </div>
      )}
    </>
  );
}
