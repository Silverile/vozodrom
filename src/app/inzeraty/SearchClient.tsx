"use client";

import MiniSearch from "minisearch";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ListingCard } from "@/components/ListingCard";
import { BODY_LABEL, FUEL_LABEL, REGIONS, brands, getBrand, getModel, models } from "@/lib/catalog";
import { listings } from "@/lib/listings";
import type { Body, Fuel, Listing } from "@/lib/types";

const SORTS = {
  nejnovejsi: { label: "Nejnovější", fn: (a: Listing, b: Listing) => b.postedAt.localeCompare(a.postedAt) },
  nejlevnejsi: { label: "Nejlevnější", fn: (a: Listing, b: Listing) => a.price - b.price },
  nejdrazsi: { label: "Nejdražší", fn: (a: Listing, b: Listing) => b.price - a.price },
  najezd: { label: "Nejnižší nájezd", fn: (a: Listing, b: Listing) => a.mileageKm - b.mileageKm },
  rok: { label: "Nejmladší", fn: (a: Listing, b: Listing) => b.year - a.year },
} as const;
type SortKey = keyof typeof SORTS;

function buildIndex() {
  const index = new MiniSearch<Listing & { text: string }>({
    fields: ["text"],
    storeFields: ["id"],
    searchOptions: { prefix: true, fuzzy: 0.2 },
  });
  index.addAll(
    listings.map((l) => ({
      ...l,
      text: [
        getBrand(l.brandSlug)?.name,
        getModel(l.brandSlug, l.modelSlug)?.name,
        l.generation,
        FUEL_LABEL[l.fuel],
        l.transmission,
        l.region,
        l.color,
        ...l.features,
      ].join(" "),
    })),
  );
  return index;
}

export function SearchClient() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const index = useMemo(buildIndex, []);

  const q = params.get("q") ?? "";
  const brand = params.get("znacka") ?? "";
  const model = params.get("model") ?? "";
  const fuel = (params.get("palivo") ?? "") as Fuel | "";
  const body = (params.get("karoserie") ?? "") as Body | "";
  const region = params.get("kraj") ?? "";
  const priceMax = Number(params.get("cenaDo") ?? 0);
  const yearFrom = Number(params.get("rokOd") ?? 0);
  const kmMax = Number(params.get("najezdDo") ?? 0);
  const sort = (params.get("razeni") ?? "nejnovejsi") as SortKey;

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (key === "znacka") next.delete("model");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  const results = useMemo(() => {
    const textIds = q.trim() ? new Set(index.search(q).map((r) => r.id as string)) : null;
    return listings
      .filter((l) => (textIds ? textIds.has(l.id) : true))
      .filter((l) => !brand || l.brandSlug === brand)
      .filter((l) => !model || l.modelSlug === model)
      .filter((l) => !fuel || l.fuel === fuel)
      .filter((l) => !body || l.body === body)
      .filter((l) => !region || l.region === region)
      .filter((l) => !priceMax || l.price <= priceMax)
      .filter((l) => !yearFrom || l.year >= yearFrom)
      .filter((l) => !kmMax || l.mileageKm <= kmMax)
      .sort((SORTS[sort] ?? SORTS.nejnovejsi).fn);
  }, [index, q, brand, model, fuel, body, region, priceMax, yearFrom, kmMax, sort]);

  const activeFilters = [...params.keys()].filter((k) => k !== "razeni").length;

  return (
    <div className="grid gap-6 lg:grid-cols-[17rem_1fr] mt-6">
      <aside className="card p-4 h-fit lg:sticky lg:top-4 space-y-3">
        <label className="block text-sm font-medium">
          Hledat
          <input
            className="input mt-1"
            placeholder="např. Octavia kombi Praha"
            defaultValue={q}
            onChange={(e) => update("q", e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium">
          Značka
          <select className="input mt-1" value={brand} onChange={(e) => update("znacka", e.target.value)}>
            <option value="">Všechny</option>
            {brands.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Model
          <select className="input mt-1" value={model} disabled={!brand} onChange={(e) => update("model", e.target.value)}>
            <option value="">Všechny</option>
            {models.filter((m) => m.brandSlug === brand).map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="block text-sm font-medium">
            Palivo
            <select className="input mt-1" value={fuel} onChange={(e) => update("palivo", e.target.value)}>
              <option value="">Vše</option>
              {Object.entries(FUEL_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Karoserie
            <select className="input mt-1" value={body} onChange={(e) => update("karoserie", e.target.value)}>
              <option value="">Vše</option>
              {Object.entries(BODY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
        </div>
        <label className="block text-sm font-medium">
          Cena do
          <select className="input mt-1" value={priceMax || ""} onChange={(e) => update("cenaDo", e.target.value)}>
            <option value="">Bez omezení</option>
            {[150000, 250000, 400000, 600000, 900000, 1200000].map((p) => (
              <option key={p} value={p}>{new Intl.NumberFormat("cs-CZ").format(p)} Kč</option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="block text-sm font-medium">
            Rok od
            <select className="input mt-1" value={yearFrom || ""} onChange={(e) => update("rokOd", e.target.value)}>
              <option value="">—</option>
              {[2012, 2015, 2018, 2020, 2022, 2024].map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Nájezd do
            <select className="input mt-1" value={kmMax || ""} onChange={(e) => update("najezdDo", e.target.value)}>
              <option value="">—</option>
              {[30000, 60000, 100000, 150000, 200000].map((k) => <option key={k} value={k}>{k / 1000} tis.</option>)}
            </select>
          </label>
        </div>
        <label className="block text-sm font-medium">
          Kraj
          <select className="input mt-1" value={region} onChange={(e) => update("kraj", e.target.value)}>
            <option value="">Celá ČR</option>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        {activeFilters > 0 && (
          <button className="text-sm font-semibold text-[var(--color-brand)]" onClick={() => router.replace(pathname, { scroll: false })}>
            Zrušit filtry ({activeFilters})
          </button>
        )}
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <p className="text-sm text-[var(--color-muted)]">
            Nalezeno <strong className="text-[var(--color-ink)]">{results.length}</strong> inzerátů
          </p>
          <select className="input w-auto" value={sort} onChange={(e) => update("razeni", e.target.value)} aria-label="Řazení">
            {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        {results.length === 0 ? (
          <div className="card p-10 text-center text-[var(--color-muted)]">Žádný inzerát neodpovídá filtrům.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </div>
    </div>
  );
}
