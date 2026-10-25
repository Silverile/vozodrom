"use client";

import MiniSearch from "minisearch";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ListingRow } from "@/components/ListingRow";
import { ModelSidebar } from "@/components/ModelSidebar";
import { BODY_LABEL, FUEL_LABEL, REGIONS, brands, getBrand, getModel, models } from "@/lib/catalog";
import { OPEN_LOCATION_PICKER, RADII, distanceKm, getCity, withinRadius } from "@/lib/geo";
import { listings } from "@/lib/listings";
import { marketEstimate } from "@/lib/market";
import { savedLocation, savedSearches } from "@/lib/storage";
import type { Body, Fuel, Listing } from "@/lib/types";

const SORTS = {
  nejnovejsi: { label: "Nejnovější", fn: (a: Listing, b: Listing) => b.postedAt.localeCompare(a.postedAt) },
  vyhodne: {
    label: "Nejvýhodnější vůči trhu",
    fn: (a: Listing, b: Listing) => (marketEstimate(a)?.ratio ?? 1) - (marketEstimate(b)?.ratio ?? 1),
  },
  nejlevnejsi: { label: "Nejlevnější", fn: (a: Listing, b: Listing) => a.price - b.price },
  nejdrazsi: { label: "Nejdražší", fn: (a: Listing, b: Listing) => b.price - a.price },
  najezd: { label: "Nejnižší nájezd", fn: (a: Listing, b: Listing) => a.mileageKm - b.mileageKm },
  rok: { label: "Nejmladší", fn: (a: Listing, b: Listing) => b.year - a.year },
} as const;
type SortKey = keyof typeof SORTS | "nejblize";

const nf = new Intl.NumberFormat("cs-CZ");

function buildIndex() {
  const index = new MiniSearch<Listing & { text: string }>({
    fields: ["text"],
    storeFields: ["id"],
    searchOptions: { prefix: true, fuzzy: 0.2, combineWith: "AND" },
  });
  index.addAll(
    listings.map((l) => ({
      ...l,
      text: [
        getBrand(l.brandSlug)?.name,
        getModel(l.brandSlug, l.modelSlug)?.name,
        l.generation,
        l.engine,
        FUEL_LABEL[l.fuel],
        BODY_LABEL[l.body],
        l.transmission,
        l.region,
        getCity(l.city)?.name,
        l.color,
        ...l.features,
      ].join(" "),
    })),
  );
  return index;
}

function distanceTo(l: Listing, center: { lat: number; lon: number }): number {
  const city = getCity(l.city);
  return city ? distanceKm(city, center) : Infinity;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      {children}
    </label>
  );
}

export function SearchClient() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const index = useMemo(buildIndex, []);
  const saved = savedSearches.useValue();
  const stored = savedLocation.useValue();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = params.get("q") ?? "";
  const brand = params.get("znacka") ?? "";
  const model = params.get("model") ?? "";
  const generation = params.get("generace") ?? "";
  const fuel = (params.get("palivo") ?? "") as Fuel | "";
  const body = (params.get("karoserie") ?? "") as Body | "";
  const gearbox = params.get("prevodovka") ?? "";
  const region = params.get("kraj") ?? "";
  const priceMax = Number(params.get("cenaDo") ?? 0);
  const yearFrom = Number(params.get("rokOd") ?? 0);
  const kmMax = Number(params.get("najezdDo") ?? 0);
  const sort = (params.get("razeni") ?? "nejnovejsi") as SortKey;

  // Location comes from the URL (shareable, saved searches) and falls back to the
  // town chosen in the header. "mesto=cr" means the whole country.
  const cityParam = params.get("mesto");
  const center = cityParam ? (cityParam === "cr" ? undefined : getCity(cityParam)) : getCity(stored?.city);
  const rawRadius = Number(cityParam ? params.get("okruh") ?? 0 : stored?.radius ?? 0);
  const radius = (RADII as readonly number[]).includes(rawRadius) ? rawRadius : 0;

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (key === "znacka") { next.delete("model"); next.delete("generace"); }
    if (key === "model") next.delete("generace");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function setLocation(slug: string | null, km: number) {
    savedLocation.write(slug ? { city: slug, radius: km } : null);
    const next = new URLSearchParams(params.toString());
    next.set("mesto", slug ?? "cr");
    if (slug && km) next.set("okruh", String(km));
    else next.delete("okruh");
    if (!slug && next.get("razeni") === "nejblize") next.delete("razeni");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  const results = useMemo(() => {
    const textIds = q.trim() ? new Set(index.search(q).map((r) => r.id as string)) : null;
    return listings
      .filter((l) => (textIds ? textIds.has(l.id) : true))
      .filter((l) => !brand || l.brandSlug === brand)
      .filter((l) => !model || l.modelSlug === model)
      .filter((l) => !generation || l.generation === generation)
      .filter((l) => !fuel || l.fuel === fuel)
      .filter((l) => !body || l.body === body)
      .filter((l) => !gearbox || l.transmission === gearbox)
      .filter((l) => !region || l.region === region)
      .filter((l) => !priceMax || l.price <= priceMax)
      .filter((l) => !yearFrom || l.year >= yearFrom)
      .filter((l) => !kmMax || l.mileageKm <= kmMax)
      .filter((l) => !center || withinRadius(l.city, center, radius))
      .sort(
        sort === "nejblize" && center
          ? (a, b) => distanceTo(a, center) - distanceTo(b, center) || a.price - b.price
          : (SORTS[sort as keyof typeof SORTS] ?? SORTS.nejnovejsi).fn,
      );
  }, [index, q, brand, model, generation, fuel, body, gearbox, region, priceMax, yearFrom, kmMax, sort, center, radius]);

  const selectedModel = brand && model ? getModel(brand, model) : undefined;
  const brandName = getBrand(brand)?.name;
  const heading = selectedModel ? `${brandName} ${selectedModel.name}${generation ? ` ${generation}` : ""}` : brandName ?? "Všechna auta";

  // Removable chips for every active filter, so state stays visible when the panel is collapsed on mobile.
  const chips: [string, string][] = [
    ["q", q && `„${q}“`],
    ["znacka", brandName ?? ""],
    ["model", selectedModel?.name ?? ""],
    ["generace", generation],
    ["palivo", fuel && FUEL_LABEL[fuel]],
    ["karoserie", body && BODY_LABEL[body]],
    ["prevodovka", gearbox],
    ["kraj", region],
    ["cenaDo", priceMax ? `do ${nf.format(priceMax)} Kč` : ""],
    ["rokOd", yearFrom ? `od roku ${yearFrom}` : ""],
    ["najezdDo", kmMax ? `do ${nf.format(kmMax)} km` : ""],
  ].filter(([, label]) => label) as [string, string][];

  const filterQuery = new URLSearchParams([...params.entries()].filter(([k]) => k !== "razeni")).toString();
  const isSaved = saved.some((s) => s.query === filterQuery);

  function toggleSaved() {
    if (isSaved) savedSearches.write(saved.filter((s) => s.query !== filterQuery));
    else savedSearches.write([{ query: filterQuery, label: heading + (chips.length ? ` · ${chips.length} ${chips.length === 1 ? "filtr" : chips.length < 5 ? "filtry" : "filtrů"}` : ""), savedAt: new Date().toISOString().slice(0, 10) }, ...saved]);
  }

  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Prodej: {heading}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-2 md:hidden">
        <button className="pill" data-on={filtersOpen} aria-expanded={filtersOpen} aria-controls="filters" onClick={() => setFiltersOpen((o) => !o)}>
          ⚙ Filtry{chips.length > 0 && ` (${chips.length})`}
        </button>
        <span className="text-sm text-[var(--color-muted)] ml-auto"><b className="text-[var(--color-ink)]">{results.length}</b> aut</span>
      </div>

      <div id="filters" className={`card p-3 mt-3 md:mt-4 gap-2 grid-cols-2 md:grid-cols-4 ${filtersOpen ? "grid" : "hidden md:grid"}`}>
        <Field label="Značka">
          <select className="input" value={brand} onChange={(e) => update("znacka", e.target.value)}>
            <option value="">Všechny značky</option>
            {brands.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
          </select>
        </Field>
        <Field label="Model">
          <select className="input" value={model} disabled={!brand} onChange={(e) => update("model", e.target.value)}>
            <option value="">Všechny modely</option>
            {models.filter((m) => m.brandSlug === brand).map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
          </select>
        </Field>
        <Field label="Generace">
          <select className="input" value={generation} disabled={!selectedModel} onChange={(e) => update("generace", e.target.value)}>
            <option value="">Generace</option>
            {selectedModel?.generations.map((g) => (
              <option key={g.code} value={g.code}>{g.code} ({g.from}–{g.to ?? "dosud"})</option>
            ))}
          </select>
        </Field>
        <Field label="Palivo">
          <select className="input" value={fuel} onChange={(e) => update("palivo", e.target.value)}>
            <option value="">Palivo</option>
            {Object.entries(FUEL_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </Field>
        <Field label="Karoserie">
          <select className="input" value={body} onChange={(e) => update("karoserie", e.target.value)}>
            <option value="">Karoserie</option>
            {Object.entries(BODY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </Field>
        <Field label="Cena do">
          <select className="input" value={priceMax || ""} onChange={(e) => update("cenaDo", e.target.value)}>
            <option value="">Cena do</option>
            {[150000, 200000, 300000, 450000, 600000, 900000].map((p) => <option key={p} value={p}>{nf.format(p)} Kč</option>)}
          </select>
        </Field>
        <Field label="Rok od">
          <select className="input" value={yearFrom || ""} onChange={(e) => update("rokOd", e.target.value)}>
            <option value="">Rok od</option>
            {[2012, 2015, 2018, 2020, 2022, 2024].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </Field>
        <Field label="Nájezd do">
          <select className="input" value={kmMax || ""} onChange={(e) => update("najezdDo", e.target.value)}>
            <option value="">Nájezd do</option>
            {[30000, 60000, 100000, 150000, 200000].map((k) => <option key={k} value={k}>{k / 1000} tis. km</option>)}
          </select>
        </Field>
        <Field label="Převodovka">
          <select className="input" value={gearbox} onChange={(e) => update("prevodovka", e.target.value)}>
            <option value="">Převodovka</option>
            <option value="manuál">Manuál</option>
            <option value="automat">Automat</option>
          </select>
        </Field>
        <Field label="Kraj">
          <select className="input" value={region} onChange={(e) => update("kraj", e.target.value)}>
            <option value="">Celá ČR</option>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
        <div className="col-span-2">
          <Field label="Hledat">
            <input className="input" placeholder="Hledat: výbava, motor, barva…" value={q} onChange={(e) => update("q", e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Místo">
        <button className="pill" data-on={!center} aria-pressed={!center} onClick={() => setLocation(null, 0)}>Celá ČR</button>
        {center ? (
          RADII.map((km) => (
            <button key={km} className="pill" data-on={radius === km} aria-pressed={radius === km} onClick={() => setLocation(center.slug, km)}>
              {km === 0 ? `📍 ${center.name}` : `+${km} km`}
            </button>
          ))
        ) : null}
        <button className="pill" onClick={() => window.dispatchEvent(new Event(OPEN_LOCATION_PICKER))}>
          {center ? "Jiné město" : "📍 Vybrat město"}
        </button>
      </div>

      {chips.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2" aria-label="Aktivní filtry">
          {chips.map(([key, label]) => (
            <button key={key} className="pill" data-on="true" onClick={() => update(key, "")} aria-label={`Zrušit filtr ${label}`}>
              {label} ✕
            </button>
          ))}
          <button className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] px-2" onClick={() => router.replace(pathname, { scroll: false })}>
            Zrušit vše
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] mt-5">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <p className="font-semibold" aria-live="polite">{results.length} inzerátů</p>
            <div className="flex items-center gap-2">
              {chips.length > 0 && (
                <button className="pill" data-on={isSaved} aria-pressed={isSaved} onClick={toggleSaved}>
                  {isSaved ? "★ Uloženo" : "☆ Uložit hledání"}
                </button>
              )}
              <select className="input w-auto" value={sort} onChange={(e) => update("razeni", e.target.value)} aria-label="Řazení">
                {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                {center && <option value="nejblize">Nejblíže</option>}
              </select>
            </div>
          </div>
          {results.length === 0 ? (
            <div className="card p-10 text-center text-[var(--color-muted)]">Žádný inzerát neodpovídá filtrům.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {results.map((l) => <ListingRow key={l.id} listing={l} />)}
            </div>
          )}
        </div>
        <aside className="lg:sticky lg:top-20 h-fit">
          {selectedModel ? (
            <ModelSidebar model={selectedModel} />
          ) : (
            <section className="card p-4 text-sm space-y-3">
              <h3 className="font-bold">Jak číst inzeráty</h3>
              <p className="text-[var(--color-muted)]">
                Cena je vždy <b className="text-[var(--color-ink)]">cena při platbě najednou</b>, bez podmínky financování.
              </p>
              <p className="text-[var(--color-muted)]">
                <b className="text-[var(--color-good)]">Dobrá cena</b> a pruh pod cenou porovnávají vůz s podobnými inzeráty (±2 roky,
                přepočteno na nájezd).
              </p>
              <p className="text-[var(--color-muted)]">
                <b className="text-[var(--color-info)]">STK bez poklesu nájezdu</b> znamená, že mezi technickými kontrolami
                tachometr neklesl. Nepotvrzuje aktuální stav.
              </p>
              <p className="text-[var(--color-muted)]">Vyberte značku a model a uvidíte hodnocení majitelů a nejčastější závady.</p>
            </section>
          )}
        </aside>
      </div>
    </>
  );
}
