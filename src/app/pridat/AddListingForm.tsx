"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { ListingRow } from "@/components/ListingRow";
import { FrontDrawing, frontDrawingFor, newestFrontDrawing } from "@/components/FrontDrawing";
import { FUEL_LABEL, REGIONS } from "@/lib/catalog";
import { formatKm, formatPrice } from "@/lib/format";
import { citiesIn, getCity } from "@/lib/geo";
import { BODY_KEYS, type FormEngine, type FormGeneration, cardGeneration, coversYear, pictogramBody } from "@/lib/listing-catalog";
import {
  type DraftField, EMPTY_LOCAL_DRAFT, type LocalDraft, draftFieldProblems, generationId, generationsForYear, isDraft, lineOf,
} from "@/lib/listing-draft";
import { getMake, makesIn, modelLinesOf, yearsOf } from "@/lib/makes";
import { createStore } from "@/lib/storage";
import type { Listing } from "@/lib/types";
import { CarSearch } from "./CarSearch";
import { SubmitListing } from "./SubmitListing";

// Car listing form driven by the catalogue: make → model line → year → generation → body →
// engine. Choosing a catalogue engine fills fuel and power; anything the catalogue lacks can be
// typed. The draft is kept in this browser until it is saved to the account.
//
// The form is split into steps. One step is open at a time; the others show a one-line summary.
// A problem shows next to its field once the field was touched or the seller tried to continue,
// never all at once on an empty form. Steps organise the form, they do not lock anything: any
// step can be opened at any time.

// Drafts saved before `generation` existed are still accepted; a missing serverId reads as a new listing.
export const draftStore = createStore<LocalDraft>("vozodrom.listingDraft", EMPTY_LOCAL_DRAFT, (v): v is LocalDraft => isDraft(v));

const CAR_MAKES = makesIn("auto");
const CUSTOM = "__jiny";
const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[\s-]+/g, "");

const STEPS: { title: string; fields: DraftField[] }[] = [
  { title: "Vozidlo", fields: ["brand", "model", "year", "generation", "body", "engine", "fuel", "powerKw", "transmission"] },
  { title: "Stav a cena", fields: ["mileageKm", "price", "vin"] },
  { title: "Místo a popis", fields: ["place"] },
];
const LAST = STEPS.length - 1;

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

/** False while rendering on the server and hydrating, so the stored draft is not read too early. */
const useHydrated = () => useSyncExternalStore(() => () => {}, () => true, () => false);

const powerHint = (e: FormEngine) =>
  e.kwMin && e.kwMax ? (e.kwMin === e.kwMax ? `${e.kwMin} kW` : `${e.kwMin}–${e.kwMax} kW`) : null;

/** A labelled control with its problem underneath; the control itself is passed as children. */
function Field({ id, label, error, hint, wide, children, onLeave }: {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  wide?: boolean;
  children: ReactNode;
  onLeave: () => void;
}) {
  return (
    <div className={`text-sm ${wide ? "sm:col-span-2" : ""}`} onBlur={onLeave}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? (
        <p id={`${id}-chyba`} className="mt-1 text-xs text-[var(--color-warn)]">{error.charAt(0).toUpperCase() + error.slice(1)}.</p>
      ) : (
        hint && <p className="mt-1 text-xs text-[var(--color-muted)]">{hint}</p>
      )}
    </div>
  );
}

export function AddListingForm() {
  const draft = draftStore.useValue();
  const hydrated = useHydrated();
  const write = (changes: Partial<LocalDraft>) => draftStore.write({ ...draftStore.read(), ...changes });
  const [modelQuery, setModelQuery] = useState("");
  const [customModel, setCustomModel] = useState(false);
  const [customEngine, setCustomEngine] = useState(false);
  // engine words typed into the quick search ("1.0 tdi"), to put the matching catalogue engines first
  const [engineHint, setEngineHint] = useState("");
  // undefined until the stored draft is read: then the first unfinished step opens; null = all closed.
  const [open, setOpen] = useState<number | null | undefined>(undefined);
  const [touched, setTouched] = useState<Set<DraftField>>(new Set());
  const [tried, setTried] = useState<Set<number>>(new Set());
  const formRef = useRef<HTMLFormElement>(null);

  const lines = useMemo(() => [...modelLinesOf(draft.brand)].sort((a, b) => a.name.localeCompare(b.name, "cs")), [draft.brand]);
  const line = lineOf(draft);
  const isCustomModel = customModel || (draft.model !== "" && !line);
  const query = fold(modelQuery);
  const shownLines = query ? lines.filter((l) => fold(l.name).includes(query) || l.slug.includes(query) || l.slug === draft.model) : lines;

  const cardGenerations = useCardGenerations(draft.brand, line?.slug);
  const { dated, matching } = generationsForYear(draft);
  const generationChoices = draft.year ? matching : dated;
  const chosenId = draft.generation || (matching.length === 1 ? generationId(matching[0]) : "");
  const chosenGeneration = generationChoices.find((g) => generationId(g) === chosenId);
  // The catalogue card's generation: matched to the chosen one, else the one built in the year
  // (some generations of the model list have no years, the cards usually do).
  const cardGen =
    (chosenGeneration && cardGeneration(chosenGeneration, cardGenerations)) ??
    (draft.year ? cardGenerations.filter((g) => g.from !== null && coversYear(g, draft.year)).pop() : undefined);
  const bodies = (cardGen?.bodies.length ? cardGen.bodies : line?.bodyTypes.length ? line.bodyTypes : Object.keys(BODY_KEYS)).filter((b) => b in BODY_KEYS);
  const hintWords = engineHint.toLowerCase().split(/s+/).filter(Boolean);
  const fits = (e: FormEngine) => hintWords.length > 0 && hintWords.every((w) => e.label.toLowerCase().includes(w));
  // Engines the seller already named in the quick search come first.
  const engines = [...(cardGen?.engines ?? [])].sort((a, b) => Number(fits(b)) - Number(fits(a)));
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

  const problems = draftFieldProblems({ ...draft, generation: chosenId });
  const stepDone = STEPS.map((s) => s.fields.every((f) => !problems[f]));
  const firstOpen = stepDone.findIndex((done) => !done);
  const complete = firstOpen === -1;
  const current = open === undefined ? (hydrated ? (complete ? null : firstOpen) : 0) : open;

  // Once the stored draft is read, open its first unfinished step (all closed when it is complete).
  useEffect(() => {
    if (hydrated && open === undefined) setOpen(complete ? null : firstOpen);
  }, [hydrated]);

  const shown = (field: DraftField, step: number) => (touched.has(field) || tried.has(step) ? problems[field] : undefined);
  const touch = (field: DraftField) => setTouched((t) => (t.has(field) ? t : new Set(t).add(field)));
  const invalid = (field: DraftField, step: number) =>
    shown(field, step) ? { "aria-invalid": true, "aria-describedby": `f-${field}-chyba` } : {};

  function reveal(step: number) {
    setOpen(step);
    requestAnimationFrame(() => document.getElementById(`krok-${step}`)?.scrollIntoView({ block: "start", behavior: "smooth" }));
  }

  /** Shows the step's problems and focuses the first one. */
  function showProblems(step: number) {
    setTried((t) => new Set(t).add(step));
    setOpen(step);
    const first = STEPS[step].fields.find((f) => problems[f]);
    requestAnimationFrame(() => {
      const el = formRef.current?.querySelector<HTMLElement>(`#f-${first}, [data-field="${first}"] button`);
      el?.focus();
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }

  function next(step: number) {
    if (!stepDone[step]) return showProblems(step);
    const following = stepDone.findIndex((done, i) => i > step && !done);
    if (following >= 0) reveal(following);
    else if (!complete) showProblems(firstOpen);
    else setOpen(null);
  }

  const makeName = getMake(draft.brand)?.name ?? "";
  const genName = chosenGeneration ? chosenGeneration.code ?? yearsOf({ from: chosenGeneration.from, to: chosenGeneration.to, current: chosenGeneration.to === null }) : "";
  const city = getCity(draft.city);
  const summaries = [
    [
      [makeName, line?.name ?? draft.model, genName].filter(Boolean).join(" "),
      draft.year || null,
      [draft.engine, draft.powerKw ? `${draft.powerKw} kW` : ""].filter(Boolean).join(" "),
      draft.fuel in FUEL_LABEL ? FUEL_LABEL[draft.fuel as Listing["fuel"]].toLowerCase() : null,
      draft.transmission || null,
      BODY_KEYS[draft.body] ?? null,
    ],
    [draft.mileageKm ? formatKm(draft.mileageKm) : null, draft.price ? formatPrice(draft.price) : null, draft.color || null, draft.vin ? `VIN ${draft.vin}` : null],
    [
      city && city.name !== draft.region ? `${city.name}, ${draft.region}` : draft.region || null,
      draft.description.trim() ? `popis ${draft.description.trim().length} znaků` : draft.region ? "bez popisu" : null,
    ],
  ].map((parts) => parts.filter(Boolean).join(" · "));

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

  const input = "input mt-1 aria-[invalid=true]:border-[var(--color-warn)]";
  const number = (value: string) => (value === "" ? 0 : Number(value));
  const submit = (
    <SubmitListing
      draft={{ ...draft, generation: chosenId }}
      complete={complete}
      onIncomplete={() => showProblems(firstOpen)}
    />
  );
  // The main action of the open step: continue, or save once nothing is left.
  const action = (step: number | null) =>
    step === null || (step === LAST && complete) || (complete && stepDone[step]) ? submit : (
      <button type="button" className="btn-cta text-sm" onClick={() => next(step)}>Pokračovat</button>
    );

  const fieldsOf: ReactNode[] = [
    <>
      <CarSearch
        onPick={(pick) => {
          const sameCar =
            pick.brand === draft.brand && pick.model === draft.model && (pick.year ?? draft.year) === draft.year && (pick.generation ?? "") === draft.generation;
          setCustomModel(false);
          setCustomEngine(false);
          setModelQuery("");
          setEngineHint(pick.engineHint);
          write({
            brand: pick.brand,
            model: pick.model,
            generation: pick.generation ?? "",
            ...(pick.year && { year: pick.year }),
            // a different car or generation: engines and gearboxes of the previous one no longer apply
            ...(!sameCar && { body: "", engine: "", fuel: "", powerKw: 0, transmission: "" }),
          });
          (["brand", "model", ...(pick.year ? (["year"] as const) : [])] as DraftField[]).forEach(touch);
        }}
      />
      <p className="sm:col-span-2 flex items-center gap-3 text-xs text-[var(--color-muted)]" aria-hidden="true">
        <span className="h-px flex-1 bg-[var(--color-line)]" />nebo vyberte ručně<span className="h-px flex-1 bg-[var(--color-line)]" />
      </p>
      <Field id="f-brand" label="Značka" error={shown("brand", 0)} onLeave={() => touch("brand")}>
        <select
          id="f-brand"
          className={input}
          value={draft.brand}
          {...invalid("brand", 0)}
          onChange={(e) => {
            setCustomModel(false);
            setModelQuery("");
            write({ brand: e.target.value, model: "", generation: "", body: "", engine: "" });
          }}
        >
          <option value="">Vyberte</option>
          {CAR_MAKES.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
        </select>
      </Field>

      {isCustomModel || (draft.brand && lines.length === 0) ? (
        <Field
          id="f-model"
          label="Model"
          error={shown("model", 0)}
          onLeave={() => touch("model")}
          hint={lines.length > 0 && (
            <button type="button" className="text-[var(--color-brand)] hover:underline" onClick={() => { setCustomModel(false); write({ model: "", generation: "" }); }}>
              Vybrat ze seznamu
            </button>
          )}
        >
          <input id="f-model" className={input} placeholder="např. Astra Sports Tourer" value={draft.model} disabled={!draft.brand} {...invalid("model", 0)} onChange={(e) => write({ model: e.target.value, generation: "" })} />
        </Field>
      ) : (
        <Field id="f-model" label="Model" error={shown("model", 0)} onLeave={() => touch("model")}>
          {lines.length > 12 && (
            <input className={input} aria-label="Hledat model" placeholder="Hledat model…" value={modelQuery} onChange={(e) => setModelQuery(e.target.value)} />
          )}
          <select
            id="f-model"
            className={input}
            value={line?.slug ?? ""}
            disabled={!draft.brand}
            {...invalid("model", 0)}
            onChange={(e) => {
              setCustomEngine(false);
              if (e.target.value === CUSTOM) {
                setCustomModel(true);
                return write({ model: "", generation: "", body: "", engine: "" });
              }
              write({ model: e.target.value, generation: "", body: "", engine: "" });
            }}
          >
            <option value="">{draft.brand ? "Vyberte" : "Nejdřív vyberte značku"}</option>
            {shownLines.map((l) => <option key={l.slug} value={l.slug}>{l.name}{yearsOf(l) ? ` (${yearsOf(l)})` : ""}</option>)}
            <option value={CUSTOM}>Jiný model…</option>
          </select>
        </Field>
      )}

      <Field
        id="f-year"
        label="Rok výroby"
        error={shown("year", 0)}
        onLeave={() => touch("year")}
        hint={line && yearsOf(line) && `${line.name}: ${yearsOf(line)}`}
      >
        <input id="f-year" className={input} type="number" inputMode="numeric" placeholder="např. 2018" value={draft.year || ""} {...invalid("year", 0)} onChange={(e) => write({ year: number(e.target.value), generation: "" })} />
      </Field>
      <Field id="f-body" label="Karoserie" error={shown("body", 0)} onLeave={() => touch("body")}>
        <select id="f-body" className={input} value={draft.body} {...invalid("body", 0)} onChange={(e) => write({ body: e.target.value })}>
          <option value="">Vyberte</option>
          {bodies.map((b) => <option key={b} value={b}>{BODY_KEYS[b]}</option>)}
        </select>
      </Field>

      {line && generationChoices.length > 0 && (
        <fieldset className="sm:col-span-2" data-field="generation" aria-describedby={shown("generation", 0) ? "f-generation-chyba" : undefined}>
          <legend className="text-sm">Generace{draft.year ? ` pro rok ${draft.year}` : ""}</legend>
          <div className="mt-1 grid gap-2 grid-cols-2 sm:grid-cols-3">
            {generationChoices.map((g) => {
              const id = generationId(g);
              const tileDrawing = frontDrawingFor(draft.brand, line.slug, g.from ?? draft.year);
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={chosenId === id}
                  onClick={() => { write({ generation: id }); touch("generation"); }}
                  className="card overflow-hidden text-left text-sm aria-pressed:border-[var(--color-brand)] aria-pressed:ring-2 aria-pressed:ring-[var(--color-brand)]"
                >
                  {tileDrawing ? (
                    <FrontDrawing id={tileDrawing} alt={`${line.name} ${g.code ?? ""}`} />
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
          {shown("generation", 0) ? (
            <p id="f-generation-chyba" className="mt-1 text-xs text-[var(--color-warn)]">Vyberte generaci, v roce {draft.year} se prodávalo víc generací.</p>
          ) : !draft.year ? (
            <p className="text-xs text-[var(--color-muted)] mt-1">Vyplňte rok výroby, nabídneme jen generace z toho roku.</p>
          ) : matching.length > 1 ? (
            <p className="text-xs text-[var(--color-muted)] mt-1">V roce {draft.year} se prodávalo víc generací, vyberte tu svoji.</p>
          ) : (
            matching.length === 1 && <p className="text-xs text-[var(--color-muted)] mt-1">Vybráno podle roku výroby. Jiná generace? Zkontrolujte rok.</p>
          )}
        </fieldset>
      )}

      {engines.length > 0 && (
        <fieldset className="sm:col-span-2" data-field="engine" aria-describedby={!showEngineFields && shown("engine", 0) ? "f-engine-chyba" : undefined}>
          <legend className="text-sm">Motor z katalogu{cardGen?.name ? ` · ${cardGen.name}` : ""}</legend>
          <div className="mt-1 grid gap-2 grid-cols-1 sm:grid-cols-2">
            {engines.map((e, i) => (
              <button
                key={`${e.label}-${e.fuel}-${i}`}
                type="button"
                aria-pressed={!showEngineFields && engineIndex === i}
                onClick={() => {
                  setCustomEngine(false);
                  touch("engine");
                  write({
                    engine: e.label,
                    ...(e.fuel && { fuel: e.fuel }),
                    ...(e.kwMin && e.kwMin === e.kwMax && { powerKw: e.kwMin }),
                  });
                }}
                className="card px-3 py-2 text-left text-sm aria-pressed:border-[var(--color-brand)] aria-pressed:ring-2 aria-pressed:ring-[var(--color-brand)]"
              >
                <span className="block font-semibold">
                  {e.label}
                  {fits(e) && <span className="ml-2 chip text-xs font-normal">podle hledání</span>}
                </span>
                <span className="block text-xs text-[var(--color-muted)]">{[e.fuel ? FUEL_LABEL[e.fuel] : null, powerHint(e)].filter(Boolean).join(" · ") || "údaje neznáme"}</span>
              </button>
            ))}
            <button
              type="button"
              aria-pressed={showEngineFields}
              onClick={() => {
                setCustomEngine(true);
                write({ engine: "" });
              }}
              className="card px-3 py-2 text-left text-sm aria-pressed:border-[var(--color-brand)] aria-pressed:ring-2 aria-pressed:ring-[var(--color-brand)]"
            >
              <span className="block font-semibold">Jiný motor</span>
              <span className="block text-xs text-[var(--color-muted)]">Napíšete ho sami</span>
            </button>
          </div>
          {!showEngineFields && shown("engine", 0) && <p id="f-engine-chyba" className="mt-1 text-xs text-[var(--color-warn)]">Vyberte motor, nebo zvolte Jiný motor.</p>}
        </fieldset>
      )}
      {showEngineFields && (
        <Field
          id="f-engine"
          label="Motor"
          error={shown("engine", 0)}
          onLeave={() => touch("engine")}
          hint={engines.length === 0 && line && "Motory této generace katalog zatím nezná, napište ho."}
        >
          <input id="f-engine" className={input} placeholder="např. 1.6 TDI" value={draft.engine} {...invalid("engine", 0)} onChange={(e) => write({ engine: e.target.value })} />
        </Field>
      )}
      <Field id="f-fuel" label="Palivo" error={shown("fuel", 0)} onLeave={() => touch("fuel")}>
        <select id="f-fuel" className={input} value={draft.fuel} {...invalid("fuel", 0)} onChange={(e) => write({ fuel: e.target.value })}>
          <option value="">Vyberte</option>
          {Object.entries(FUEL_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </Field>
      <Field
        id="f-powerKw"
        label="Výkon (kW)"
        error={shown("powerKw", 0)}
        onLeave={() => touch("powerKw")}
        hint={chosenEngine && powerHint(chosenEngine) && `V katalogu ${powerHint(chosenEngine)}; uveďte výkon svého vozu.`}
      >
        <input id="f-powerKw" className={input} type="number" inputMode="numeric" value={draft.powerKw || ""} {...invalid("powerKw", 0)} onChange={(e) => write({ powerKw: number(e.target.value) })} />
      </Field>
      <Field id="f-transmission" label="Převodovka" error={shown("transmission", 0)} onLeave={() => touch("transmission")}>
        <select id="f-transmission" className={input} value={draft.transmission} {...invalid("transmission", 0)} onChange={(e) => write({ transmission: e.target.value })}>
          <option value="">Vyberte</option>
          <option value="manuál">Manuální</option>
          <option value="automat">Automatická</option>
        </select>
      </Field>
    </>,

    <>
      <Field id="f-mileageKm" label="Najeto (km)" error={shown("mileageKm", 1)} onLeave={() => touch("mileageKm")}>
        <input id="f-mileageKm" className={input} type="number" inputMode="numeric" value={draft.mileageKm || ""} {...invalid("mileageKm", 1)} onChange={(e) => write({ mileageKm: number(e.target.value) })} />
      </Field>
      <Field id="f-price" label="Cena při platbě najednou (Kč)" error={shown("price", 1)} onLeave={() => touch("price")}>
        <input id="f-price" className={input} type="number" inputMode="numeric" value={draft.price || ""} {...invalid("price", 1)} onChange={(e) => write({ price: number(e.target.value) })} />
      </Field>
      <Field id="f-color" label="Barva (nepovinné)" onLeave={() => {}}>
        <input id="f-color" className={input} placeholder="např. šedá metalíza" value={draft.color} onChange={(e) => write({ color: e.target.value })} />
      </Field>
      <Field id="f-vin" label="VIN (doporučeno)" error={shown("vin", 1)} onLeave={() => touch("vin")} hint="S VIN ukážeme kupujícím historii STK.">
        <input id="f-vin" className={input} value={draft.vin} maxLength={17} {...invalid("vin", 1)} onChange={(e) => write({ vin: e.target.value.toUpperCase() })} />
      </Field>
    </>,

    <>
      <Field id="f-place" label="Místo" wide error={shown("place", 2)} onLeave={() => touch("place")}>
        <select id="f-place" className={input} value={draft.city} {...invalid("place", 2)} onChange={(e) => write({ city: e.target.value, region: getCity(e.target.value)?.region ?? "" })}>
          <option value="">Vyberte</option>
          {REGIONS.map((r) => (
            <optgroup key={r} label={r}>
              {citiesIn(r).map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </optgroup>
          ))}
        </select>
      </Field>
      <Field id="f-description" label="Popis (nepovinné)" wide onLeave={() => {}}>
        <textarea id="f-description" className={`${input} min-h-28`} placeholder="Stav, servisní historie, výbava, důvod prodeje…" value={draft.description} onChange={(e) => write({ description: e.target.value })} />
      </Field>
    </>,
  ];

  const progress = (
    <ol className="flex gap-1.5" aria-label="Postup">
      {[...STEPS.map((s) => s.title), "Fotky"].map((title, i) => {
        const done = i < STEPS.length && stepDone[i];
        return (
          <li key={title} className="flex-1 min-w-0">
            <span className={`block h-1.5 rounded-full ${done ? "bg-[var(--color-brand)]" : i === current ? "bg-[var(--color-ink)]/40" : "bg-[var(--color-line)]"}`} />
            <span className={`mt-1 hidden sm:block truncate text-xs ${i === current ? "text-[var(--color-ink)] font-semibold" : "text-[var(--color-muted)]"}`}>
              {done && <span aria-hidden="true">✓ </span>}
              {title}
              {done && <span className="sr-only"> (hotovo)</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] mt-6 items-start pb-24 lg:pb-0">
      <form ref={formRef} className="space-y-3 min-w-0" onSubmit={(e) => e.preventDefault()} noValidate>
        <div className="card p-4">
          <div className="flex items-baseline justify-between gap-3 mb-2 text-sm">
            <span className="font-semibold">{current === null ? "Vše vyplněno" : `Krok ${current + 1} z ${STEPS.length + 1}: ${STEPS[current].title}`}</span>
            <span className="text-xs text-[var(--color-muted)]">Ukládá se v tomto prohlížeči</span>
          </div>
          {progress}
        </div>

        {STEPS.map((step, i) => {
          const isOpen = current === i;
          return (
            <section key={step.title} id={`krok-${i}`} className={`card scroll-mt-24 ${isOpen ? "p-4" : ""}`} aria-labelledby={`krok-${i}-nadpis`}>
              {isOpen ? (
                <>
                  <h2 id={`krok-${i}-nadpis`} className="font-bold text-lg">
                    <span className="text-[var(--color-muted)] font-normal">{i + 1}.</span> {step.title}
                  </h2>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">{fieldsOf[i]}</div>
                  <div className="mt-5 hidden lg:flex items-center justify-end gap-3">{action(i)}</div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => reveal(i)}
                  className="w-full flex items-center gap-3 p-4 text-left rounded-[14px] hover:bg-[var(--color-field)]"
                  aria-expanded="false"
                >
                  <span
                    aria-hidden="true"
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${stepDone[i] ? "bg-[var(--color-brand)] text-white" : "bg-[var(--color-field)] text-[var(--color-muted)]"}`}
                  >
                    {stepDone[i] ? "✓" : i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span id={`krok-${i}-nadpis`} className="block font-semibold">{step.title}</span>
                    {summaries[i] && <span className="block truncate text-sm text-[var(--color-muted)]">{summaries[i]}</span>}
                    {tried.has(i) && !stepDone[i] && <span className="block text-xs text-[var(--color-warn)]">Chybí údaje</span>}
                  </span>
                  <span className="text-sm font-semibold text-[var(--color-brand)]">{stepDone[i] || summaries[i] ? "Upravit" : "Vyplnit"}</span>
                </button>
              )}
            </section>
          );
        })}

        <section className="card flex items-center gap-3 p-4 text-[var(--color-muted)]">
          <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-field)] text-xs font-bold">{STEPS.length + 1}</span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-[var(--color-ink)]">Fotky a zveřejnění</span>
            <span className="block text-sm">Po uložení přidáte fotky a telefon a odešlete inzerát.</span>
          </span>
        </section>

        {current === null && <div className="hidden lg:flex justify-end">{submit}</div>}

        <div className="flex justify-start">
          <button type="button" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]" onClick={() => {
            draftStore.write(EMPTY_LOCAL_DRAFT);
            setTouched(new Set());
            setTried(new Set());
            setOpen(0);
          }}>
            {draft.serverId ? "Zahodit změny" : "Smazat rozpracovaný inzerát"}
          </button>
        </div>

        {/* Phones: the preview sits below the steps; the action stays at the bottom of the screen. */}
        {preview && (
          <section className="lg:hidden">
            <h2 className="font-bold mb-2">Náhled inzerátu</h2>
            <div inert><ListingRow listing={preview} drawing={drawing} compact /></div>
          </section>
        )}
      </form>

      <aside className="hidden lg:block space-y-3 lg:sticky lg:top-20">
        <h2 className="font-bold">Náhled inzerátu</h2>
        {preview ? (
          // inert: the preview's link and ☆ button must not be focusable or clickable.
          <div inert><ListingRow listing={preview} drawing={drawing} compact /></div>
        ) : (
          <p className="card p-4 text-sm text-[var(--color-muted)]">Náhled se objeví, až vyberete značku a model.</p>
        )}
        <p className="text-xs text-[var(--color-muted)]">
          Nákres ukazuje generaci z katalogu, ne váš vůz. Po uložení ho nahradí vaše fotky.
        </p>
      </aside>

      <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-line)] bg-[var(--color-surface)] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <span className="min-w-0 text-sm">
            <span className="block text-xs text-[var(--color-muted)]">{current === null ? "Hotovo" : `Krok ${current + 1} z ${STEPS.length + 1}`}</span>
            <span className="block truncate font-semibold">{current === null ? "Vše vyplněno" : STEPS[current].title}</span>
          </span>
          <span className="shrink-0">{action(current)}</span>
        </div>
      </div>
    </div>
  );
}
