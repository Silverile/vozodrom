"use client";

import MiniSearch from "minisearch";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ListingRow } from "@/components/ListingRow";
import { ModelSidebar } from "@/components/ModelSidebar";
import { BODY_LABEL, FUEL_LABEL, REGIONS, getBrand, getModel, models } from "@/lib/catalog";
import { LocationPills, useSearchLocation } from "@/components/LocationPills";
import { EQUIPMENT, EQUIPMENT_GROUPS } from "@/lib/equipment";
import { getCity, nearestDistance, withinAny } from "@/lib/geo";
import { listings } from "@/lib/listings";
import { getMake, makesIn, modelLinesOf } from "@/lib/makes";
import { marketEstimate } from "@/lib/market";
import { savedSearches } from "@/lib/storage";
import { stkSignal } from "@/lib/stk";
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

// All car makes for the brand filter; models exist only for the demo makes in lib/catalog.
const CAR_MAKES = makesIn("auto");
const BRAND_COUNTS = listings.reduce((m, l) => m.set(l.brandSlug, (m.get(l.brandSlug) ?? 0) + 1), new Map<string, number>());

// "Rozšířené vyhledávání": extra filters over data every listing already has. Drive, engine
// size and number of owners are not in the listing data yet, so they are not offered.
const FLAGS: { key: string; label: string; test: (l: Listing) => boolean }[] = [
  { key: "sVin", label: "Jen s VIN", test: (l) => l.vin !== "neuvedeno" },
  { key: "sStk", label: "Jen s historií STK", test: (l) => l.stkHistory.length > 0 },
  { key: "bezPoklesu", label: "Bez poklesu nájezdu", test: (l) => stkSignal(l).kind !== "drop" },
  { key: "sBaterii", label: "Elektromobil s testem baterie", test: (l) => l.battery?.sohPercent != null },
  { key: "dobraCena", label: "Jen dobrá a výborná cena", test: (l) => (marketEstimate(l)?.ratio ?? 1) < 0.95 },
];
const COLORS = [...new Set(listings.map((l) => l.color))].sort((a, b) => a.localeCompare(b, "cs"));
// The equipment dictionary by group, then anything feeds wrote that the dictionary does not know.
const KNOWN = new Set(EQUIPMENT.map((e) => e.label));
const FEATURE_GROUPS: [string, string[]][] = [
  ...EQUIPMENT_GROUPS.map((g): [string, string[]] => [g, EQUIPMENT.filter((e) => e.group === g).map((e) => e.label)]),
  ["Ostatní", [...new Set(listings.flatMap((l) => l.features))].filter((f) => !KNOWN.has(f)).sort((a, b) => a.localeCompare(b, "cs"))] as [string, string[]],
].filter(([, items]) => items.length > 0);
const ADVANCED_KEYS = ["cenaOd", "rokDo", "najezdOd", "vykonOd", "vykonDo", "barva", "prodejce", "vybava", ...FLAGS.map((f) => f.key)];
const list = (value: string | null) => (value ?? "").split(",").filter(Boolean);

function buildIndex(items: Listing[]) {
  const index = new MiniSearch<Listing & { text: string }>({
    fields: ["text"],
    storeFields: ["id"],
    searchOptions: { prefix: true, fuzzy: 0.2, combineWith: "AND" },
  });
  index.addAll(
    items.map((l) => ({
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      {children}
    </label>
  );
}

/** Test and feed listings ship with the page; published user listings are fetched and put first. */
function useAllListings(): Listing[] {
  const [userListings, setUserListings] = useState<Listing[]>([]);
  useEffect(() => {
    fetch("/api/inzeraty/verejne/")
      .then((r): Promise<Listing[]> | Listing[] => (r.ok ? r.json() : []))
      .then(setUserListings)
      .catch(() => {});
  }, []);
  return useMemo(() => [...userListings, ...listings], [userListings]);
}

export function SearchClient() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const all = useAllListings();
  const index = useMemo(() => buildIndex(all), [all]);
  const saved = savedSearches.useValue();
  const { centers, radius } = useSearchLocation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(() => ADVANCED_KEYS.some((k) => params.has(k)));

  const q = params.get("q") ?? "";
  const brand = params.get("znacka") ?? "";
  const model = params.get("model") ?? "";
  const generation = params.get("generace") ?? "";
  const fuel = (params.get("palivo") ?? "") as Fuel | "";
  const body = (params.get("karoserie") ?? "") as Body | "";
  const gearbox = params.get("prevodovka") ?? "";
  const regions = list(params.get("kraj"));
  const priceMax = Number(params.get("cenaDo") ?? 0);
  const yearFrom = Number(params.get("rokOd") ?? 0);
  const kmMax = Number(params.get("najezdDo") ?? 0);
  const sort = (params.get("razeni") ?? "nejnovejsi") as SortKey;
  const priceMin = Number(params.get("cenaOd") ?? 0);
  const yearTo = Number(params.get("rokDo") ?? 0);
  const kmMin = Number(params.get("najezdOd") ?? 0);
  const powerMin = Number(params.get("vykonOd") ?? 0);
  const powerMax = Number(params.get("vykonDo") ?? 0);
  const color = params.get("barva") ?? "";
  const seller = params.get("prodejce") ?? "";
  const features = list(params.get("vybava"));
  const flags = FLAGS.filter((f) => params.get(f.key) === "1");

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (key === "znacka") { next.delete("model"); next.delete("generace"); }
    if (key === "model") next.delete("generace");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const results = useMemo(() => {
    const textIds = q.trim() ? new Set(index.search(q).map((r) => r.id as string)) : null;
    return all
      .filter((l) => (textIds ? textIds.has(l.id) : true))
      .filter((l) => !brand || l.brandSlug === brand)
      .filter((l) => !model || l.modelSlug === model)
      .filter((l) => !generation || l.generation === generation)
      .filter((l) => !fuel || l.fuel === fuel)
      .filter((l) => !body || l.body === body)
      .filter((l) => !gearbox || l.transmission === gearbox)
      .filter((l) => regions.length === 0 || regions.includes(l.region))
      .filter((l) => !priceMax || l.price <= priceMax)
      .filter((l) => !yearFrom || l.year >= yearFrom)
      .filter((l) => !kmMax || l.mileageKm <= kmMax)
      .filter((l) => !priceMin || l.price >= priceMin)
      .filter((l) => !yearTo || l.year <= yearTo)
      .filter((l) => !kmMin || l.mileageKm >= kmMin)
      .filter((l) => !powerMin || l.powerKw >= powerMin)
      .filter((l) => !powerMax || l.powerKw <= powerMax)
      .filter((l) => !color || l.color === color)
      .filter((l) => !seller || (seller === "soukromy" ? l.sellerType === "soukromý" : l.sellerType === "autobazar"))
      .filter((l) => features.every((f) => l.features.includes(f)))
      .filter((l) => flags.every((f) => f.test(l)))
      .filter((l) => centers.length === 0 || withinAny(l.city, centers, radius))
      .sort(
        sort === "nejblize" && centers.length
          ? (a, b) => nearestDistance(a.city, centers) - nearestDistance(b.city, centers) || a.price - b.price
          : (SORTS[sort as keyof typeof SORTS] ?? SORTS.nejnovejsi).fn,
      );
    // The parsed params are rebuilt every render; the query string is the real dependency.
  }, [index, params.toString(), centers.map((c) => c.slug).join(","), radius]);

  const selectedModel = brand && model ? getModel(brand, model) : undefined;
  // Demo makes have catalogue models with data; other makes offer their curated model lines.
  const demoModels = models.filter((m) => m.brandSlug === brand);
  const brandModels = demoModels.length ? demoModels : modelLinesOf(brand);
  const brandName = getMake(brand)?.name ?? getBrand(brand)?.name;
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
    ["kraj", regions.join(", ")],
    ["cenaDo", priceMax ? `do ${nf.format(priceMax)} Kč` : ""],
    ["rokOd", yearFrom ? `od roku ${yearFrom}` : ""],
    ["najezdDo", kmMax ? `do ${nf.format(kmMax)} km` : ""],
    ["cenaOd", priceMin ? `od ${nf.format(priceMin)} Kč` : ""],
    ["rokDo", yearTo ? `do roku ${yearTo}` : ""],
    ["najezdOd", kmMin ? `od ${nf.format(kmMin)} km` : ""],
    ["vykonOd", powerMin ? `od ${powerMin} kW` : ""],
    ["vykonDo", powerMax ? `do ${powerMax} kW` : ""],
    ["barva", color],
    ["prodejce", seller === "soukromy" ? "soukromý prodejce" : seller === "autobazar" ? "autobazar" : ""],
    ["vybava", features.join(", ")],
    ...flags.map((f) => [f.key, f.label.charAt(0).toLowerCase() + f.label.slice(1)]),
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
            <optgroup label="V nabídce">
              {CAR_MAKES.filter((m) => BRAND_COUNTS.has(m.slug)).map((m) => (
                <option key={m.slug} value={m.slug}>{m.name} ({BRAND_COUNTS.get(m.slug)})</option>
              ))}
            </optgroup>
            <optgroup label="Další značky">
              {CAR_MAKES.filter((m) => !BRAND_COUNTS.has(m.slug)).map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
            </optgroup>
          </select>
        </Field>
        <Field label="Model">
          <select className="input" value={model} disabled={!brand} onChange={(e) => update("model", e.target.value)}>
            <option value="">{brand && brandModels.length === 0 ? "Modely doplňujeme" : "Všechny modely"}</option>
            {brandModels.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
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
        <details className="relative">
          <summary className="input cursor-pointer list-none truncate [&::-webkit-details-marker]:hidden">
            {regions.length ? `Kraje: ${regions.join(", ")}` : "Kraje: celá ČR"}
          </summary>
          <fieldset className="card absolute z-20 mt-1 p-2 w-64 max-h-72 overflow-y-auto shadow-2xl">
            <legend className="sr-only">Kraje</legend>
            {REGIONS.map((r) => (
              <label key={r} className="flex gap-2 items-center px-2 py-1 text-sm rounded-md hover:bg-[var(--color-field)]">
                <input
                  type="checkbox"
                  checked={regions.includes(r)}
                  onChange={(e) => update("kraj", (e.target.checked ? [...regions, r] : regions.filter((x) => x !== r)).join(","))}
                />
                {r}
              </label>
            ))}
          </fieldset>
        </details>
        <div className="col-span-2">
          <Field label="Hledat">
            <input className="input" placeholder="Hledat: výbava, motor, barva…" value={q} onChange={(e) => update("q", e.target.value)} />
          </Field>
        </div>
        <div className="col-span-2 md:col-span-4">
          <button
            className="text-sm font-semibold text-[var(--color-brand)] hover:underline"
            aria-expanded={advancedOpen}
            aria-controls="advanced-filters"
            onClick={() => setAdvancedOpen((o) => !o)}
          >
            Rozšířené vyhledávání {advancedOpen ? "▴" : "▾"}
          </button>
        </div>
        {advancedOpen && (
          <div id="advanced-filters" className="col-span-2 md:col-span-4 grid gap-2 grid-cols-2 md:grid-cols-4 border-t border-[var(--color-line)] pt-3">
            <Field label="Cena od">
              <select className="input" value={priceMin || ""} onChange={(e) => update("cenaOd", e.target.value)}>
                <option value="">Cena od</option>
                {[100000, 150000, 200000, 300000, 450000, 600000].map((p) => <option key={p} value={p}>{nf.format(p)} Kč</option>)}
              </select>
            </Field>
            <Field label="Rok do">
              <select className="input" value={yearTo || ""} onChange={(e) => update("rokDo", e.target.value)}>
                <option value="">Rok do</option>
                {[2015, 2018, 2020, 2022, 2024, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </Field>
            <Field label="Nájezd od">
              <select className="input" value={kmMin || ""} onChange={(e) => update("najezdOd", e.target.value)}>
                <option value="">Nájezd od</option>
                {[10000, 30000, 60000, 100000, 150000].map((k) => <option key={k} value={k}>{k / 1000} tis. km</option>)}
              </select>
            </Field>
            <Field label="Prodejce">
              <select className="input" value={seller} onChange={(e) => update("prodejce", e.target.value)}>
                <option value="">Prodejce: všichni</option>
                <option value="soukromy">Soukromý prodejce</option>
                <option value="autobazar">Autobazar</option>
              </select>
            </Field>
            <Field label="Výkon od">
              <select className="input" value={powerMin || ""} onChange={(e) => update("vykonOd", e.target.value)}>
                <option value="">Výkon od</option>
                {[50, 75, 100, 125, 150, 200].map((k) => <option key={k} value={k}>{k} kW</option>)}
              </select>
            </Field>
            <Field label="Výkon do">
              <select className="input" value={powerMax || ""} onChange={(e) => update("vykonDo", e.target.value)}>
                <option value="">Výkon do</option>
                {[75, 100, 125, 150, 200, 300].map((k) => <option key={k} value={k}>{k} kW</option>)}
              </select>
            </Field>
            <Field label="Barva">
              <select className="input" value={color} onChange={(e) => update("barva", e.target.value)}>
                <option value="">Barva</option>
                {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <details className="relative">
              <summary className="input cursor-pointer list-none truncate [&::-webkit-details-marker]:hidden">
                {features.length ? `Výbava: ${features.length}` : "Výbava"}
              </summary>
              <fieldset className="card absolute z-20 mt-1 p-2 w-72 max-h-72 overflow-y-auto shadow-2xl right-0 md:left-0 md:right-auto">
                <legend className="sr-only">Výbava</legend>
                {FEATURE_GROUPS.map(([group, items]) => (
                  <div key={group} role="group" aria-label={group}>
                    <p className="px-2 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">{group}</p>
                    {items.map((f) => (
                      <label key={f} className="flex gap-2 items-center px-2 py-1 text-sm rounded-md hover:bg-[var(--color-field)]">
                        <input
                          type="checkbox"
                          checked={features.includes(f)}
                          onChange={(e) => update("vybava", (e.target.checked ? [...features, f] : features.filter((x) => x !== f)).join(","))}
                        />
                        {f}
                      </label>
                    ))}
                  </div>
                ))}
              </fieldset>
            </details>
            <div className="col-span-2 md:col-span-4 flex flex-wrap gap-x-5 gap-y-2 pt-1">
              {FLAGS.map((f) => (
                <label key={f.key} className="flex gap-2 items-center text-sm">
                  <input type="checkbox" checked={params.get(f.key) === "1"} onChange={(e) => update(f.key, e.target.checked ? "1" : "")} />
                  {f.label}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <LocationPills />

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
                {centers.length > 0 && <option value="nejblize">Nejblíže</option>}
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
