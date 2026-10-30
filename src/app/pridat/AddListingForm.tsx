"use client";

import { useEffect, useMemo, useState } from "react";
import { ListingRow } from "@/components/ListingRow";
import { frontDrawingFor, newestFrontDrawing } from "@/components/FrontDrawing";
import { FUEL_LABEL, REGIONS } from "@/lib/catalog";
import { citiesIn, getCity } from "@/lib/geo";
import { BODY_KEYS, type FormEngine, type FormGeneration, pictogramBody } from "@/lib/listing-catalog";
import {
  EMPTY_LOCAL_DRAFT, type LocalDraft, draftProblems, generationId, generationsForYear, isDraft, lineOf,
} from "@/lib/listing-draft";
import { makesIn, modelLinesOf, yearsOf } from "@/lib/makes";
import { createStore } from "@/lib/storage";
import type { Listing } from "@/lib/types";
import { SubmitListing } from "./SubmitListing";

// Car listing form driven by the catalogue: make → model line → year → generation → body →
// engine. Choosing a catalogue engine fills fuel and power; anything the catalogue lacks can be
// typed. The draft is kept in this browser until it is saved to the account.

// Drafts saved before `generation` existed are still accepted; a missing serverId reads as a new listing.
export const draftStore = createStore<LocalDraft>("vozodrom.listingDraft", EMPTY_LOCAL_DRAFT, (v): v is LocalDraft => isDraft(v));

const CAR_MAKES = makesIn("auto");
const CUSTOM = "__jiny";
const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[\s-]+/g, "");

/** Catalogue generations (bodies, engines, gearboxes, photo) of a model line, fetched per line. */
function useCardGenerations(make: string, line: string | undefined): FormGeneration[] {
  const [state, setState] = useState<{ key: string; generations: FormGeneration[] }>({ key: "", generations: [] });
  const key = line ? `${make}/${line}` : "";
  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    fetch(`/api/katalog/${key}/`)
      .then((r) => (r.ok ? (r.json() as Promise<{ generations: FormGeneration[] }>) : { generations: [] }))
      .then((data) => !cancelled && setState({ key, generations: data.generations }))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [key]);
  return state.key === key ? state.generations : [];
}

const powerHint = (e: FormEngine) =>
  e.kwMin && e.kwMax ? (e.kwMin === e.kwMax ? `${e.kwMin} kW` : `${e.kwMin}–${e.kwMax} kW`) : null;

const engineOption = (e: FormEngine) => [e.label, e.fuel ? FUEL_LABEL[e.fuel].toLowerCase() : null, powerHint(e)].filter(Boolean).join(" · ");

export function AddListingForm() {
  const draft = draftStore.useValue();
  const write = (changes: Partial<LocalDraft>) => draftStore.write({ ...draftStore.read(), ...changes });
  const [modelQuery, setModelQuery] = useState("");
  const [customModel, setCustomModel] = useState(false);
  const [customEngine, setCustomEngine] = useState(false);

  const lines = useMemo(() => [...modelLinesOf(draft.brand)].sort((a, b) => a.name.localeCompare(b.name, "cs")), [draft.brand]);
  const line = lineOf(draft);
  const isCustomModel = customModel || (draft.model !== "" && !line);
  const query = fold(modelQuery);
  const shownLines = query ? lines.filter((l) => fold(l.name).includes(query) || l.slug.includes(query) || l.slug === draft.model) : lines;

  const cardGenerations = useCardGenerations(draft.brand, line?.slug);
  const { dated, matching } = generationsForYear(draft);
  const generationChoices = draft.year ? matching : dated;
  const chosenId = draft.generation || (matching.length === 1 ? generationId(matching[0]) : "");
  const cardGen = cardGenerations.find((g) => g.code === chosenId);
  const bodies = (cardGen?.bodies.length ? cardGen.bodies : line?.bodyTypes.length ? line.bodyTypes : Object.keys(BODY_KEYS)).filter((b) => b in BODY_KEYS);
  const engines = cardGen?.engines ?? [];
  // The same displacement can exist as petrol and diesel, so the fuel tells them apart.
  const sameLabel = (e: FormEngine) => e.label === draft.engine;
  const engineIndex = Math.max(engines.findIndex((e) => sameLabel(e) && e.fuel === draft.fuel), engines.findIndex(sameLabel));
  const showEngineFields = customEngine || engines.length === 0 || (draft.engine !== "" && engineIndex === -1);
  const chosenEngine = engineIndex >= 0 ? engines[engineIndex] : undefined;

  // Fill what the catalogue makes unambiguous: the only generation for the year, the only body,
  // the only gearbox type. The seller can still change bodies and gearboxes afterwards.
  useEffect(() => {
    const changes: Partial<LocalDraft> = {};
    if (!draft.generation && matching.length === 1) changes.generation = generationId(matching[0]);
    if (!draft.body && bodies.length === 1) changes.body = bodies[0];
    if (!draft.transmission && cardGen?.gearboxes.length === 1) changes.transmission = cardGen.gearboxes[0];
    if (Object.keys(changes).length) write(changes);
  }, [draft.generation, draft.body, draft.transmission, matching.length, bodies.join(), cardGen?.code]);

  const problems = draftProblems(draft);
  const drawing = line ? (frontDrawingFor(draft.brand, line.slug, draft.year) ?? newestFrontDrawing(draft.brand, line.slug)) : null;
  const preview: Listing | null =
    draft.brand && draft.model.trim()
      ? {
          id: "nahled",
          source: { kind: "user" },
          brandSlug: draft.brand,
          modelSlug: line?.slug ?? draft.model,
          generation: chosenId || "generace neurčena",
          year: draft.year || new Date().getFullYear(),
          mileageKm: Math.max(draft.mileageKm, 0),
          price: Math.max(draft.price, 0),
          engine: draft.engine || "motor neuveden",
          fuel: (draft.fuel in FUEL_LABEL ? draft.fuel : "benzin") as Listing["fuel"],
          transmission: draft.transmission === "automat" ? "automat" : "manuál",
          powerKw: draft.powerKw,
          body: pictogramBody(draft.body),
          color: draft.color || "stříbrná",
          region: draft.region || "kraj neuveden",
          city: draft.city,
          sellerType: "soukromý",
          sellerName: "Vy",
          vin: draft.vin || "neuvedeno",
          stkHistory: [],
          postedAt: new Date().toISOString().slice(0, 10),
          features: [],
          description: draft.description,
        }
      : null;

  const input = "input mt-1";
  const heading = "sm:col-span-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)] pt-2";
  const number = (value: string) => (value === "" ? 0 : Number(value));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px] mt-6 items-start">
      <form className="card p-4 grid gap-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()} noValidate>
        <h2 className={heading}>Vůz</h2>
        <label className="text-sm">Značka
          <select
            className={input}
            value={draft.brand}
            onChange={(e) => {
              setCustomModel(false);
              setModelQuery("");
              write({ brand: e.target.value, model: "", generation: "", body: "", engine: "" });
            }}
          >
            <option value="">Vyberte</option>
            {CAR_MAKES.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
          </select>
        </label>

        {isCustomModel || (draft.brand && lines.length === 0) ? (
          <label className="text-sm">Model
            <input className={input} placeholder="např. Astra Sports Tourer" value={draft.model} disabled={!draft.brand} onChange={(e) => write({ model: e.target.value, generation: "" })} />
            {lines.length > 0 && (
              <button type="button" className="text-xs text-[var(--color-brand)] hover:underline" onClick={() => { setCustomModel(false); write({ model: "", generation: "" }); }}>
                Vybrat ze seznamu
              </button>
            )}
          </label>
        ) : (
          <label className="text-sm">Model
            {lines.length > 12 && (
              <input className={input} aria-label="Hledat model" placeholder="Hledat model…" value={modelQuery} onChange={(e) => setModelQuery(e.target.value)} />
            )}
            <select
              className={input}
              value={line?.slug ?? ""}
              disabled={!draft.brand}
              onChange={(e) => {
                setCustomEngine(false);
                if (e.target.value === CUSTOM) {
                  setCustomModel(true);
                  return write({ model: "", generation: "", body: "", engine: "" });
                }
                write({ model: e.target.value, generation: "", body: "", engine: "" });
              }}
            >
              <option value="">Vyberte</option>
              {shownLines.map((l) => <option key={l.slug} value={l.slug}>{l.name}{yearsOf(l) ? ` (${yearsOf(l)})` : ""}</option>)}
              <option value={CUSTOM}>Jiný model…</option>
            </select>
          </label>
        )}

        <label className="text-sm">Rok výroby
          <input className={input} type="number" inputMode="numeric" placeholder="např. 2018" value={draft.year || ""} onChange={(e) => write({ year: number(e.target.value), generation: "" })} />
          {line && yearsOf(line) && <span className="text-xs text-[var(--color-muted)]">{line.name}: {yearsOf(line)}</span>}
        </label>
        <label className="text-sm">Karoserie
          <select className={input} value={draft.body} onChange={(e) => write({ body: e.target.value })}>
            <option value="">Vyberte</option>
            {bodies.map((b) => <option key={b} value={b}>{BODY_KEYS[b]}</option>)}
          </select>
        </label>

        {line && generationChoices.length > 0 && (
          <fieldset className="sm:col-span-2">
            <legend className="text-sm">Generace{draft.year ? ` pro rok ${draft.year}` : ""}</legend>
            <div className="mt-1 grid gap-2 grid-cols-2 sm:grid-cols-3">
              {generationChoices.map((g) => {
                const id = generationId(g);
                const card = cardGenerations.find((c) => c.code === id);
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={chosenId === id}
                    onClick={() => write({ generation: id })}
                    className="card overflow-hidden text-left text-sm aria-pressed:border-[var(--color-brand)] aria-pressed:ring-2 aria-pressed:ring-[var(--color-brand)]"
                  >
                    {card?.photo ? (
                      <img src={card.photo} alt="" className="w-full aspect-[16/10] object-cover bg-[var(--color-photo)]" loading="lazy" />
                    ) : (
                      <span className="block w-full aspect-[16/10] bg-[var(--color-field)]" />
                    )}
                    <span className="block p-2">
                      <span className="block font-semibold">{g.code ?? line.name}</span>
                      <span className="text-xs text-[var(--color-muted)]">{yearsOf({ from: g.from, to: g.to, current: g.to === null })}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            {!draft.year && <p className="text-xs text-[var(--color-muted)] mt-1">Vyplňte rok výroby, nabídneme jen generace z toho roku.</p>}
            {draft.year > 0 && matching.length > 1 && <p className="text-xs text-[var(--color-muted)] mt-1">V roce {draft.year} se prodávalo víc generací, vyberte tu svoji.</p>}
          </fieldset>
        )}

        <h2 className={heading}>Motor a převodovka</h2>
        {engines.length > 0 && (
          <label className="text-sm sm:col-span-2">Motor z katalogu
            <select
              className={input}
              value={showEngineFields ? CUSTOM : engineIndex >= 0 ? String(engineIndex) : ""}
              onChange={(e) => {
                if (e.target.value === CUSTOM) {
                  setCustomEngine(true);
                  return write({ engine: "" });
                }
                setCustomEngine(false);
                const engine = engines[Number(e.target.value)];
                if (!engine) return write({ engine: "" });
                write({
                  engine: engine.label,
                  ...(engine.fuel && { fuel: engine.fuel }),
                  ...(engine.kwMin && engine.kwMin === engine.kwMax && { powerKw: engine.kwMin }),
                });
              }}
            >
              <option value="">Vyberte</option>
              {engines.map((e, i) => <option key={`${e.label}-${i}`} value={i}>{engineOption(e)}</option>)}
              <option value={CUSTOM}>Jiný motor…</option>
            </select>
          </label>
        )}
        {showEngineFields && (
          <label className="text-sm">Motor
            <input className={input} placeholder="např. 1.6 TDI" value={draft.engine} onChange={(e) => write({ engine: e.target.value })} />
          </label>
        )}
        <label className="text-sm">Palivo
          <select className={input} value={draft.fuel} onChange={(e) => write({ fuel: e.target.value })}>
            <option value="">Vyberte</option>
            {Object.entries(FUEL_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="text-sm">Výkon (kW)
          <input className={input} type="number" inputMode="numeric" value={draft.powerKw || ""} onChange={(e) => write({ powerKw: number(e.target.value) })} />
          {chosenEngine && powerHint(chosenEngine) && <span className="text-xs text-[var(--color-muted)]">V katalogu {powerHint(chosenEngine)}; uveďte výkon svého vozu.</span>}
        </label>
        <label className="text-sm">Převodovka
          <select className={input} value={draft.transmission} onChange={(e) => write({ transmission: e.target.value })}>
            <option value="">Vyberte</option>
            <option value="manuál">Manuální</option>
            <option value="automat">Automatická</option>
          </select>
        </label>

        <h2 className={heading}>Stav a cena</h2>
        <label className="text-sm">Najeto (km)
          <input className={input} type="number" inputMode="numeric" value={draft.mileageKm || ""} onChange={(e) => write({ mileageKm: number(e.target.value) })} />
        </label>
        <label className="text-sm">Cena při platbě najednou (Kč)
          <input className={input} type="number" inputMode="numeric" value={draft.price || ""} onChange={(e) => write({ price: number(e.target.value) })} />
        </label>
        <label className="text-sm">Barva
          <input className={input} placeholder="např. šedá metalíza" value={draft.color} onChange={(e) => write({ color: e.target.value })} />
        </label>
        <label className="text-sm">VIN (doporučeno)
          <input className={input} value={draft.vin} maxLength={17} onChange={(e) => write({ vin: e.target.value.toUpperCase() })} aria-describedby="vin-help" />
          <span id="vin-help" className="text-xs text-[var(--color-muted)]">S VIN ukážeme kupujícím historii STK.</span>
        </label>

        <h2 className={heading}>Místo a popis</h2>
        <label className="text-sm sm:col-span-2">Místo
          <select className={input} value={draft.city} onChange={(e) => write({ city: e.target.value, region: getCity(e.target.value)?.region ?? "" })}>
            <option value="">Vyberte</option>
            {REGIONS.map((r) => (
              <optgroup key={r} label={r}>
                {citiesIn(r).map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
        <label className="text-sm sm:col-span-2">Popis
          <textarea className={`${input} min-h-28`} placeholder="Stav, servisní historie, výbava, důvod prodeje…" value={draft.description} onChange={(e) => write({ description: e.target.value })} />
        </label>
        <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3">
          <button type="button" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]" onClick={() => draftStore.write(EMPTY_LOCAL_DRAFT)}>
            {draft.serverId ? "Zahodit změny" : "Smazat rozpracovaný inzerát"}
          </button>
          <SubmitListing draft={{ ...draft, generation: chosenId }} complete={problems.length === 0} />
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
            <div inert><ListingRow listing={preview} drawing={drawing} compact /></div>
          ) : (
            <p className="card p-4 text-sm text-[var(--color-muted)]">Vyberte značku a model.</p>
          )}
        </section>
      </aside>
    </div>
  );
}
