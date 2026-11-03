"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { FUEL_LABEL } from "@/lib/catalog";
import { CAR_DRIVES, type CarData, EMPTY_CAR, MAX_STORY, carLine, carProblems } from "@/lib/garage";
import { BODY_KEYS } from "@/lib/listing-catalog";
import { makesIn, modelLinesOf, yearsOf } from "@/lib/makes";
import { useCardGenerations } from "@/lib/use-card-generations";
import { CarSearch } from "../pridat/CarSearch";
import { RichTextEditor } from "@/components/RichTextEditor";

// The car's details in the garage: make, model and generation from the catalogue (or a typed
// model), what the owner calls it, the technical basics and their story. Only make and model are
// required. VIN and plate stay private unless the owner shows the plate.

const CAR_MAKES = makesIn("auto");
const CUSTOM = "__jiny__";
const input = "input mt-1 aria-[invalid=true]:border-[var(--color-warn)]";

function Field({ id, label, error, hint, wide, children }: { id: string; label: string; error?: string; hint?: ReactNode; wide?: boolean; children: ReactNode }) {
  return (
    <div className={`text-sm ${wide ? "sm:col-span-2" : ""}`}>
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

const number = (v: string) => (v.trim() === "" ? 0 : Math.round(Number(v)) || 0);

export function CarForm({ carId, initial, initialFormer = false }: { carId?: string; initial?: CarData; initialFormer?: boolean }) {
  const router = useRouter();
  const [car, setCar] = useState<CarData>(initial ?? EMPTY_CAR);
  const [former, setFormer] = useState(initialFormer);
  const [customModel, setCustomModel] = useState(Boolean(initial?.model && !carLine(initial)));
  const [tried, setTried] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const write = (patch: Partial<CarData>) => {
    setCar((c) => ({ ...c, ...patch }));
    setSaved(false);
  };
  const lines = car.brand ? modelLinesOf(car.brand) : [];
  const line = carLine(car);
  const generations = useCardGenerations(car.brand, line?.slug);
  const generation = generations.find((g) => g.code === car.generation);
  const problems = carProblems(car);
  const shown = (field: keyof CarData) => (tried ? problems[field] : undefined);
  const invalid = (field: keyof CarData) => ({ "aria-invalid": Boolean(shown(field)), "aria-describedby": shown(field) ? `g-${field}-chyba` : undefined });

  async function save() {
    setTried(true);
    if (Object.keys(problems).length) return;
    setBusy(true);
    setError("");
    const response = await fetch(carId ? `/api/garaz/${carId}/` : "/api/garaz/", {
      method: carId ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ data: car, former }),
    });
    const result = (await response.json().catch(() => ({}))) as { id?: string; error?: string };
    setBusy(false);
    if (!response.ok) return setError(result.error ?? "Uložení se nepovedlo.");
    if (!carId && result.id) router.push(`/garaz/${result.id}/`);
    else {
      setSaved(true);
      router.refresh();
    }
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <section className="card p-5 grid gap-4 sm:grid-cols-2">
        <h2 className="sm:col-span-2 font-bold text-lg">Auto</h2>
        <CarSearch
          label="Jaké auto máte?"
          onPick={(pick) => {
            setCustomModel(false);
            write({ brand: pick.brand, model: pick.model, generation: pick.generation ?? "", ...(pick.year && { year: pick.year }) });
          }}
        />
        <Field id="g-brand" label="Značka" error={shown("brand")}>
          <select id="g-brand" className={input} value={car.brand} {...invalid("brand")} onChange={(e) => write({ brand: e.target.value, model: "", generation: "" })}>
            <option value="">Vyberte</option>
            {CAR_MAKES.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
          </select>
        </Field>
        {customModel || (car.brand && lines.length === 0) ? (
          <Field id="g-model" label="Model" error={shown("model")}>
            <input id="g-model" className={input} placeholder="např. Astra Sports Tourer" value={car.model} disabled={!car.brand} {...invalid("model")} onChange={(e) => write({ model: e.target.value, generation: "" })} />
          </Field>
        ) : (
          <Field id="g-model" label="Model" error={shown("model")}>
            <select
              id="g-model"
              className={input}
              value={line?.slug ?? ""}
              disabled={!car.brand}
              {...invalid("model")}
              onChange={(e) => {
                if (e.target.value === CUSTOM) {
                  setCustomModel(true);
                  return write({ model: "", generation: "" });
                }
                write({ model: e.target.value, generation: "" });
              }}
            >
              <option value="">{car.brand ? "Vyberte" : "Nejdřív vyberte značku"}</option>
              {lines.map((l) => <option key={l.slug} value={l.slug}>{l.name}{yearsOf(l) ? ` (${yearsOf(l)})` : ""}</option>)}
              <option value={CUSTOM}>Jiný model…</option>
            </select>
          </Field>
        )}
        {line && generations.length > 0 && (
          <Field id="g-generation" label="Generace">
            <select id="g-generation" className={input} value={car.generation} onChange={(e) => write({ generation: e.target.value })}>
              <option value="">Nevím</option>
              {generations.map((g) => (
                <option key={g.code} value={g.code}>
                  {g.name ?? g.code}
                  {g.from ? ` (${g.from}–${g.to ?? "dosud"})` : ""}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field id="g-nickname" label="Přezdívka auta" hint="Např. „Zelenka“ nebo „2.0 turbo“. Uvidí ji všichni vedle názvu auta.">
          <input id="g-nickname" className={input} maxLength={60} value={car.nickname} onChange={(e) => write({ nickname: e.target.value })} />
        </Field>
        <Field id="g-year" label="Rok výroby" error={shown("year")}>
          <input id="g-year" className={input} type="number" inputMode="numeric" value={car.year || ""} {...invalid("year")} onChange={(e) => write({ year: number(e.target.value) })} />
        </Field>
        <Field id="g-purchase" label="Rok koupě" error={shown("purchaseYear")}>
          <input id="g-purchase" className={input} type="number" inputMode="numeric" value={car.purchaseYear || ""} {...invalid("purchaseYear")} onChange={(e) => write({ purchaseYear: number(e.target.value) })} />
        </Field>
        <Field id="g-color" label="Barva">
          <input id="g-color" className={input} maxLength={40} value={car.color} onChange={(e) => write({ color: e.target.value })} />
        </Field>
        <Field id="g-body" label="Karoserie">
          <select id="g-body" className={input} value={car.body} onChange={(e) => write({ body: e.target.value })}>
            <option value="">Nevyplněno</option>
            {(generation?.bodies.length ? generation.bodies : Object.keys(BODY_KEYS)).filter((b) => b in BODY_KEYS).map((b) => <option key={b} value={b}>{BODY_KEYS[b]}</option>)}
          </select>
        </Field>
        {carId && (
          <label className="sm:col-span-2 flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-0.5" checked={former} onChange={(e) => { setFormer(e.target.checked); setSaved(false); }} />
            <span>
              Tohle auto už nemám
              <span className="block text-xs text-[var(--color-muted)]">Stránka a příběh zůstanou, auto se ukáže mezi bývalými.</span>
            </span>
          </label>
        )}
      </section>

      <section className="card p-5 grid gap-4 sm:grid-cols-2">
        <h2 className="sm:col-span-2 font-bold text-lg">Technické údaje</h2>
        <Field id="g-engine" label="Motor" hint={generation?.engines.length ? "Vyberte z katalogu nebo napište vlastní." : undefined}>
          <input id="g-engine" className={input} list="g-engines" maxLength={80} value={car.engine} onChange={(e) => {
            const known = generation?.engines.find((x) => x.label === e.target.value);
            write({ engine: e.target.value, ...(known?.fuel && { fuel: known.fuel }), ...(known?.kwMin && known.kwMin === known.kwMax && { powerKw: known.kwMin }) });
          }} />
          <datalist id="g-engines">{generation?.engines.map((x) => <option key={x.label} value={x.label} />)}</datalist>
        </Field>
        <Field id="g-fuel" label="Palivo">
          <select id="g-fuel" className={input} value={car.fuel} onChange={(e) => write({ fuel: e.target.value })}>
            <option value="">Nevyplněno</option>
            {Object.entries(FUEL_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </Field>
        <Field id="g-power" label="Výkon (kW)" error={shown("powerKw")}>
          <input id="g-power" className={input} type="number" inputMode="numeric" value={car.powerKw || ""} {...invalid("powerKw")} onChange={(e) => write({ powerKw: number(e.target.value) })} />
        </Field>
        <Field id="g-gearbox" label="Převodovka">
          <select id="g-gearbox" className={input} value={car.transmission} onChange={(e) => write({ transmission: e.target.value })}>
            <option value="">Nevyplněno</option>
            <option value="manuál">manuál</option>
            <option value="automat">automat</option>
          </select>
        </Field>
        <Field id="g-drive" label="Pohon">
          <select id="g-drive" className={input} value={car.drive} onChange={(e) => write({ drive: e.target.value })}>
            <option value="">Nevyplněno</option>
            {Object.entries(CAR_DRIVES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </Field>
        <Field id="g-vin" label="VIN" error={shown("vin")} hint="Vidíte ho jen vy. Pomůže doplnit údaje z registru.">
          <input id="g-vin" className={input} maxLength={17} autoCapitalize="characters" value={car.vin} {...invalid("vin")} onChange={(e) => write({ vin: e.target.value.toUpperCase() })} />
        </Field>
        <Field id="g-plate" label="SPZ">
          <input id="g-plate" className={input} maxLength={12} autoCapitalize="characters" value={car.plate} onChange={(e) => write({ plate: e.target.value.toUpperCase() })} />
          <label className="mt-1.5 flex items-center gap-2 text-xs">
            <input type="checkbox" checked={car.plateVisible} onChange={(e) => write({ plateVisible: e.target.checked })} />
            Ukázat SPZ všem
          </label>
        </Field>
      </section>

      <section className="card p-5 space-y-2">
        <h2 className="font-bold text-lg">Příběh auta</h2>
        <label htmlFor="g-story" className="text-sm text-[var(--color-muted)]">Jak jste k autu přišli, první dojmy, co plánujete.</label>
        <RichTextEditor id="g-story" minHeight="min-h-48" maxLength={MAX_STORY} value={car.story} onChange={(story) => write({ story })} />
        <p className="text-xs text-[var(--color-muted)] text-right">{car.story.length.toLocaleString("cs-CZ")} / {MAX_STORY.toLocaleString("cs-CZ")}</p>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-cta" disabled={busy}>{carId ? "Uložit změny" : "Přidat do garáže"}</button>
        {saved && <span role="status" className="text-sm text-[var(--color-good)]">Uloženo.</span>}
        {tried && Object.keys(problems).length > 0 && <span className="text-sm text-[var(--color-warn)]">Zkontrolujte označená pole.</span>}
        {error && <span role="alert" className="text-sm text-[var(--color-warn)]">{error}</span>}
      </div>
    </form>
  );
}
