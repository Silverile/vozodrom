"use client";

import { ListingRow } from "@/components/ListingRow";
import { BODY_LABEL, FUEL_LABEL, REGIONS, brands, generationFor, getModel, models } from "@/lib/catalog";
import { type FeedVehicle, validateVehicle } from "@/lib/feed";
import { createStore } from "@/lib/storage";
import type { Listing } from "@/lib/types";

type Draft = Omit<FeedVehicle, "externalId" | "status" | "updatedAt" | "features"> & { vin: string };

const EMPTY: Draft = {
  brand: "", model: "", year: 2020, mileageKm: 0, price: 0, engine: "", fuel: "benzin", transmission: "manuál",
  powerKw: 0, color: "", region: "", description: "", vin: "",
};

const draftStore = createStore<Draft>("vozodrom.listingDraft", EMPTY);

function vinProblem(vin: string): string | null {
  if (!vin) return null;
  if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) return "VIN má 17 znaků a neobsahuje písmena I, O, Q";
  return null;
}

export function AddListingForm() {
  const draft = draftStore.useValue();
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    draftStore.write({ ...draft, [key]: value, ...(key === "brand" ? { model: "" } : {}) });

  const problems = [
    ...validateVehicle({ ...draft, externalId: "draft", status: "active", updatedAt: "2026-10-25", features: [] }),
    ...(vinProblem(draft.vin) ? [vinProblem(draft.vin)!] : []),
  ];
  const model = getModel(draft.brand, draft.model);
  const preview: Listing | null = model
    ? {
        id: "nahled",
        source: { kind: "test" },
        brandSlug: draft.brand,
        modelSlug: draft.model,
        generation: generationFor(model, draft.year).code,
        year: draft.year,
        mileageKm: Math.max(draft.mileageKm, 0),
        price: Math.max(draft.price, 0),
        engine: draft.engine || "motor neuveden",
        fuel: (draft.fuel in FUEL_LABEL ? draft.fuel : "benzin") as Listing["fuel"],
        transmission: draft.transmission === "automat" ? "automat" : "manuál",
        powerKw: draft.powerKw,
        body: model.body,
        color: draft.color || "stříbrná",
        region: draft.region || "kraj neuveden",
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
            {brands.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
          </select>
        </label>
        <label className="text-sm">Model
          <select className={input} value={draft.model} disabled={!draft.brand} onChange={(e) => set("model", e.target.value)} required>
            <option value="">Vyberte</option>
            {models.filter((m) => m.brandSlug === draft.brand).map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
          </select>
        </label>
        <label className="text-sm">Rok výroby
          <input className={input} type="number" inputMode="numeric" value={draft.year} onChange={(e) => set("year", Number(e.target.value))} />
        </label>
        <label className="text-sm">Najeto (km)
          <input className={input} type="number" inputMode="numeric" value={draft.mileageKm || ""} onChange={(e) => set("mileageKm", Number(e.target.value))} />
        </label>
        <label className="text-sm">Cena při platbě najednou (Kč)
          <input className={input} type="number" inputMode="numeric" value={draft.price || ""} onChange={(e) => set("price", Number(e.target.value))} />
        </label>
        <label className="text-sm">Kraj
          <select className={input} value={draft.region} onChange={(e) => set("region", e.target.value)}>
            <option value="">Vyberte</option>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
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
            <div className="pointer-events-none" aria-hidden="true"><ListingRow listing={preview} /></div>
          ) : (
            <p className="card p-4 text-sm text-[var(--color-muted)]">Vyberte značku a model.</p>
          )}
          {model && <p className="text-xs text-[var(--color-muted)] mt-2">Karoserie podle katalogu: {BODY_LABEL[model.body]}.</p>}
        </section>
      </aside>
    </div>
  );
}
