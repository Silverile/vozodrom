"use client";

import { useState } from "react";
import { ListingRow } from "@/components/ListingRow";
import { frontDrawingFor, newestFrontDrawing } from "@/components/FrontDrawing";
import { BODY_LABEL, FUEL_LABEL, REGIONS, generationMatch, getModel, models } from "@/lib/catalog";
import { makesIn, modelLinesOf, yearsOf } from "@/lib/makes";
import { citiesIn, getCity } from "@/lib/geo";
import { EMPTY_LOCAL_DRAFT, type LocalDraft, draftProblems, isDraft } from "@/lib/listing-draft";
import { createStore } from "@/lib/storage";
import { SubmitListing } from "./SubmitListing";
import type { Body, Listing } from "@/lib/types";

const CAR_MAKES = makesIn("auto");
const CUSTOM = "__jiny";

// Drafts saved before serverId existed are still accepted; a missing serverId reads as a new listing.
export const draftStore = createStore<LocalDraft>("vozodrom.listingDraft", EMPTY_LOCAL_DRAFT, (v): v is LocalDraft => isDraft(v));

export function AddListingForm() {
  const draft = draftStore.useValue();
  const set = <K extends keyof LocalDraft>(key: K, value: LocalDraft[K]) => {
    if (key === "brand") setCustomModel(false);
    draftStore.write({ ...draft, [key]: value, ...(key === "brand" ? { model: "", body: "" } : {}) });
  };

  const catalogModels = models.filter((m) => m.brandSlug === draft.brand);
  const inCatalog = catalogModels.length > 0;
  const lines = modelLinesOf(draft.brand);
  // A typed model name that is not one of the make's lines keeps the free-text field open.
  const [customModel, setCustomModel] = useState(false);
  const showCustom = customModel || (draft.model !== "" && lines.length > 0 && !lines.some((l) => l.name === draft.model));
  const problems = draftProblems(draft);
  const model = getModel(draft.brand, draft.model);
  // catalogue makes store the model's slug, other makes the line's name; drawings are keyed by the
  // line's slug. A year outside the line's generations (still being typed) shows the newest drawing.
  const lineSlug = lines.find((l) => l.slug === draft.model || l.name === draft.model)?.slug;
  const drawing = lineSlug ? (frontDrawingFor(draft.brand, lineSlug, draft.year) ?? newestFrontDrawing(draft.brand, lineSlug)) : null;
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
            {lines.length > 0 && !showCustom ? (
              <label className="text-sm">Model
                <select
                  className={input}
                  value={draft.model}
                  onChange={(e) => {
                    if (e.target.value === CUSTOM) return setCustomModel(true);
                    // A line with a single known body type fills the body in.
                    const line = lines.find((l) => l.name === e.target.value);
                    const bodies = (line?.bodyTypes ?? []).filter((b) => b in BODY_LABEL);
                    draftStore.write({ ...draft, model: e.target.value, ...(bodies.length === 1 ? { body: bodies[0] } : {}) });
                  }}
                  required
                >
                  <option value="">Vyberte</option>
                  {lines.map((l) => <option key={l.slug} value={l.name}>{l.name}{yearsOf(l) ? ` (${yearsOf(l)})` : ""}</option>)}
                  <option value={CUSTOM}>Jiný model…</option>
                </select>
              </label>
            ) : (
              <label className="text-sm">Model
                <input className={input} placeholder="např. Astra Sports Tourer" value={draft.model} onChange={(e) => set("model", e.target.value)} required />
              </label>
            )}
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
          <button type="button" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]" onClick={() => draftStore.write(EMPTY_LOCAL_DRAFT)}>
            {draft.serverId ? "Zahodit změny" : "Smazat rozpracovaný inzerát"}
          </button>
          <SubmitListing draft={draft} complete={problems.length === 0} />
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
            <div inert><ListingRow listing={preview} drawing={drawing} /></div>
          ) : (
            <p className="card p-4 text-sm text-[var(--color-muted)]">Vyberte značku a model.</p>
          )}
          {model && <p className="text-xs text-[var(--color-muted)] mt-2">Karoserie podle katalogu: {BODY_LABEL[model.body]}.</p>}
        </section>
      </aside>
    </div>
  );
}
