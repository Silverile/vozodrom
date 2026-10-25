"use client";

import { ListingRow } from "@/components/ListingRow";
import { BODY_LABEL, FUEL_LABEL, REGIONS, generationMatch, getModel, models } from "@/lib/catalog";
import { makesIn } from "@/lib/makes";
import { citiesIn, getCity } from "@/lib/geo";
import { type FeedVehicle, validateVehicle } from "@/lib/feed";
import { createStore } from "@/lib/storage";
import type { Body, Listing } from "@/lib/types";

/** For makes without catalogue models, `model` holds the typed model name and `body` is chosen by hand. */
export type Draft = Omit<FeedVehicle, "externalId" | "status" | "updatedAt" | "features" | "city"> & { city: string; vin: string; body: string };

const CAR_MAKES = makesIn("auto");

const EMPTY: Draft = {
  brand: "", model: "", year: 2020, mileageKm: 0, price: 0, engine: "", fuel: "benzin", transmission: "manuál",
  powerKw: 0, color: "", region: "", city: "", description: "", vin: "", body: "",
};

const isDraft = (v: unknown): v is Draft =>
  !!v &&
  typeof v === "object" &&
  (Object.keys(EMPTY) as (keyof Draft)[]).every((k) => typeof (v as Record<string, unknown>)[k] === typeof EMPTY[k]);

export const draftStore = createStore<Draft>("vozodrom.listingDraft", EMPTY, isDraft);

function vinProblem(vin: string): string | null {
  if (!vin) return null;
  if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) return "VIN má 17 znaků a neobsahuje písmena I, O, Q";
  return null;
}

export function AddListingForm() {
  const draft = draftStore.useValue();
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    draftStore.write({ ...draft, [key]: value, ...(key === "brand" ? { model: "" } : {}) });

  const catalogModels = models.filter((m) => m.brandSlug === draft.brand);
  const inCatalog = catalogModels.length > 0;
  // Catalogue makes are checked exactly like dealer feeds; other makes cannot be checked
  // against model data yet, so model and generation checks are replaced by plain presence checks.
  const vehicleProblems = validateVehicle({ ...draft, city: draft.city || undefined, features: [] });
  const problems = [
    ...(inCatalog || !draft.brand
      ? vehicleProblems
      : [
          ...vehicleProblems.filter((p) => p !== "neznámá značka nebo model" && !p.includes("generace")),
          ...(draft.model.trim() ? [] : ["chybí model"]),
          ...(draft.body ? [] : ["vyberte karoserii"]),
        ]),
    ...(vinProblem(draft.vin) ? [vinProblem(draft.vin)!] : []),
  ];
  const model = getModel(draft.brand, draft.model);
  const preview: Listing | null = model || (draft.brand && draft.model.trim())
    ? {
        id: "nahled",
        source: { kind: "test" },
        brandSlug: draft.brand,
        modelSlug: draft.model,
        generation: (model && generationMatch(model, draft.year)?.code) ?? "generace neurčena",
        year: draft.year,
        mileageKm: Math.max(draft.mileageKm, 0),
        price: Math.max(draft.price, 0),
        engine: draft.engine || "motor neuveden",
        fuel: (draft.fuel in FUEL_LABEL ? draft.fuel : "benzin") as Listing["fuel"],
        transmission: draft.transmission === "automat" ? "automat" : "manuál",
        powerKw: draft.powerKw,
        body: model?.body ?? ((draft.body in BODY_LABEL ? draft.body : "hatchback") as Body),
        color: draft.color || "stříbrná",
        region: draft.region || "kraj neuveden",
        city: draft.city,
        sellerType: "soukromý",
        sellerName: "Vy",
        vin: draft.vin || "neuvedeno",
        stkHistory: [],
        postedAt: "2026-10-25",
        features: [],
        description: draft.description,
      }
    : null;

  const input = "input mt-1";
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px] mt-6 items-start">
      <form className="card p-4 grid gap-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()} noValidate>
        <label className="text-sm">Značka
          <select className={input} value={draft.brand} onChange={(e) => set("brand", e.target.value)} required>
            <option value="">Vyberte</option>
            {CAR_MAKES.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
          </select>
        </label>
        {inCatalog || !draft.brand ? (
          <label className="text-sm">Model
            <select className={input} value={draft.model} disabled={!draft.brand} onChange={(e) => set("model", e.target.value)} required>
              <option value="">Vyberte</option>
              {catalogModels.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
            </select>
          </label>
        ) : (
          <>
            <label className="text-sm">Model
              <input className={input} placeholder="např. Astra Sports Tourer" value={draft.model} onChange={(e) => set("model", e.target.value)} required />
            </label>
            <label className="text-sm">Karoserie
              <select className={input} value={draft.body} onChange={(e) => set("body", e.target.value)}>
                <option value="">Vyberte</option>
                {Object.entries(BODY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
          </>
        )}
        <label className="text-sm">Rok výroby
          <input className={input} type="number" inputMode="numeric" value={draft.year} onChange={(e) => set("year", Number(e.target.value))} />
        </label>
        <label className="text-sm">Najeto (km)
          <input className={input} type="number" inputMode="numeric" value={draft.mileageKm || ""} onChange={(e) => set("mileageKm", Number(e.target.value))} />
        </label>
        <label className="text-sm">Cena při platbě najednou (Kč)
          <input className={input} type="number" inputMode="numeric" value={draft.price || ""} onChange={(e) => set("price", Number(e.target.value))} />
        </label>
        <label className="text-sm">Místo
          <select
            className={input}
            value={draft.city}
            onChange={(e) => draftStore.write({ ...draft, city: e.target.value, region: getCity(e.target.value)?.region ?? "" })}
          >
            <option value="">Vyberte</option>
            {REGIONS.map((r) => (
              <optgroup key={r} label={r}>
                {citiesIn(r).map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
        <label className="text-sm">Palivo
          <select className={input} value={draft.fuel} onChange={(e) => set("fuel", e.target.value)}>
            {Object.entries(FUEL_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="text-sm">Převodovka
          <select className={input} value={draft.transmission} onChange={(e) => set("transmission", e.target.value)}>
            <option value="manuál">Manuál</option>
            <option value="automat">Automat</option>
          </select>
        </label>
        <label className="text-sm">Motor
          <input className={input} placeholder="např. 1.5 TSI" value={draft.engine} onChange={(e) => set("engine", e.target.value)} />
        </label>
        <label className="text-sm">Výkon (kW)
          <input className={input} type="number" inputMode="numeric" value={draft.powerKw || ""} onChange={(e) => set("powerKw", Number(e.target.value))} />
        </label>
        <label className="text-sm">Barva
          <input className={input} value={draft.color} onChange={(e) => set("color", e.target.value)} />
        </label>
        <label className="text-sm">VIN (doporučeno)
          <input className={input} value={draft.vin} maxLength={17} onChange={(e) => set("vin", e.target.value.toUpperCase())} aria-describedby="vin-help" />
          <span id="vin-help" className="text-xs text-[var(--color-muted)]">S VIN ukážeme kupujícím historii STK.</span>
        </label>
        <label className="text-sm sm:col-span-2">Popis
          <textarea className={`${input} min-h-28`} value={draft.description} onChange={(e) => set("description", e.target.value)} />
        </label>
        <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3">
          <button type="button" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]" onClick={() => draftStore.write(EMPTY)}>
            Smazat rozpracovaný inzerát
          </button>
          <span className="text-sm text-[var(--color-muted)]">Odeslání bude dostupné s účty.</span>
        </div>
      </form>

      <aside className="space-y-4 lg:sticky lg:top-20">
        <section className="card p-4" aria-live="polite">
          <h2 className="font-bold">Kontrola inzerátu</h2>
          {problems.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--color-good)]">✓ Inzerát je kompletní.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-[var(--color-warn)]">
              {problems.map((p) => <li key={p}>• {p}</li>)}
            </ul>
          )}
        </section>
        <section>
          <h2 className="font-bold mb-2">Náhled ve výsledcích</h2>
          {preview ? (
            // inert: the preview's link and ☆ button must not be focusable or clickable.
            <div inert><ListingRow listing={preview} /></div>
          ) : (
            <p className="card p-4 text-sm text-[var(--color-muted)]">Vyberte značku a model.</p>
          )}
          {model && <p className="text-xs text-[var(--color-muted)] mt-2">Karoserie podle katalogu: {BODY_LABEL[model.body]}.</p>}
        </section>
      </aside>
    </div>
  );
}
