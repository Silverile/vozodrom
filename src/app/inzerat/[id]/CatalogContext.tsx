import Link from "next/link";
import { FrontDrawing } from "@/components/FrontDrawing";
import { formatDate, formatKm, formatNumber, formatPercent } from "@/lib/format";
import { type ListingContext, atAge, statsPeriod } from "@/lib/listing-context";
import { BODY_NAMES, CARD_FUEL, DRIVE, GEARBOX, yearsSpan } from "@/lib/modelCards";
import type { Listing } from "@/lib/types";

// What the catalogue and the public register know about the car of a user listing: its generation
// with the matching engine, and how cars of that generation fare in the Czech Republic.

const num = (n: number | null | undefined, unit = "") => (n == null ? null : `${n.toLocaleString("cs-CZ")}${unit}`);
/** "po 1 roce", "po 7 letech" */
const years = (age: number) => `${age} ${age === 1 ? "roce" : "letech"}`;

function Facts({ rows }: { rows: [string, string | null | undefined][] }) {
  const shown = rows.filter(([, v]) => v);
  if (!shown.length) return null;
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm content-start">
      {shown.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-[var(--color-muted)]">{k}</dt>
          <dd className="font-medium min-w-0">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function GenerationCard({ context, makeName, brandSlug }: { context: ListingContext; makeName: string; brandSlug: string }) {
  const { gen, card, engine, trim, stage, drawing } = context;
  const genName = gen.name?.replace(card.name, "").trim() || gen.code || `${context.genIndex + 1}. generace`;
  const title = `${makeName} ${card.name} ${genName}`;
  const d = gen.dimensionsMm;
  const gearbox = trim?.transmission?.type
    ? `${GEARBOX[trim.transmission.type] ?? trim.transmission.type}${trim.transmission.gears ? ` ${trim.transmission.gears}st.` : ""}`
    : null;
  const consumption = trim?.consumptionL100
    ? `${num(trim.consumptionL100)} l/100 km`
    : trim?.consumptionKwh100
      ? `${num(trim.consumptionKwh100)} kWh/100 km`
      : null;

  return (
    <section className="card p-4 sm:p-5 min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-bold text-lg">{title}</h2>
        <span className="text-sm text-[var(--color-muted)]">
          {yearsSpan(gen.from, gen.to, gen.current)}
          {stage && ` · ${stage}`}
        </span>
      </div>
      {card.summary && <p className="mt-1 text-sm text-[var(--color-muted)]">{card.summary}</p>}
      <div className={`mt-4 grid gap-5 ${drawing ? "sm:grid-cols-[minmax(0,15rem)_1fr]" : ""}`}>
        {drawing && <FrontDrawing id={drawing} alt={title} className="rounded-xl self-start" />}
        <Facts
          rows={[
            ["Karoserie", gen.bodyTypes.map((b) => BODY_NAMES[b] ?? b).join(", ")],
            ["Rozměry", d?.length && d.width && d.height ? `${num(d.length)} × ${num(d.width)} × ${num(d.height)} mm` : null],
            ["Rozvor", num(d?.wheelbase, " mm")],
            ["Zavazadelník", num(gen.trunkL, " l")],
            ["Pohon", gen.drivetrains.map((x) => DRIVE[x] ?? x).join(", ")],
            ["Motory", gen.engines.length ? gen.engines.map((e) => e.variant).filter(Boolean).join(", ") : null],
          ]}
        />
      </div>

      {(engine || trim) && (
        <div className="mt-5 rounded-[10px] bg-[var(--color-field)] p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Motor podle katalogu</h3>
          <p className="mt-1 font-semibold">
            {engine?.variant ?? trim?.name ?? "—"}
            {engine?.fuel && <span className="font-normal text-[var(--color-muted)]"> · {CARD_FUEL[engine.fuel]}</span>}
          </p>
          {trim && (
            <div className="mt-2">
              <Facts
                rows={[
                  ["Objem", num(trim.engine?.displacementCc, " cm³")],
                  ["Výkon", num(trim.engine?.powerKw, " kW")],
                  ["Točivý moment", num(trim.engine?.torqueNm, " Nm")],
                  ["Převodovka", gearbox],
                  ["Hmotnost", trim.massKg ? `${trim.massReference === "published-minimum" ? "od " : ""}${num(trim.massKg)} kg` : null],
                  ["0–100 km/h", num(trim.acceleration0to100s, " s")],
                  ["Max. rychlost", num(trim.topSpeedKmh, " km/h")],
                  ["Spotřeba", consumption && `${consumption}${trim.consumptionCycle ? ` (${trim.consumptionCycle})` : ""}`],
                ]}
              />
            </div>
          )}
          <p className="mt-2 text-xs text-[var(--color-muted)]">
            Verze z katalogu, která odpovídá palivu, výkonu a roku výroby z inzerátu. Přesnou verzi a výbavu ověřte u prodejce.
          </p>
        </div>
      )}

      <Link href={`/katalog/${brandSlug}/${context.lineSlug}/#g${context.genIndex + 1}`} className="mt-4 inline-block text-sm font-semibold text-[var(--color-brand)]">
        Vše o {makeName} {card.name} →
      </Link>
    </section>
  );
}

function Tile({ label, value, hint }: { label: string; value: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-[var(--color-field)] px-3 py-2.5 min-w-0">
      <div className="text-xs text-[var(--color-muted)]">{label}</div>
      <div className="text-xl font-extrabold">{value}</div>
      {hint && <div className="text-xs text-[var(--color-muted)]">{hint}</div>}
    </div>
  );
}

export function CzechData({ context, listing, makeName }: { context: ListingContext; listing: Listing; makeName: string }) {
  const { stats, age } = context;
  if (!stats) return null;
  const fail = atAge(stats.byAge, age);
  const km = atAge(stats.km, age);
  const maxDefect = Math.max(...stats.defects.map(([, s]) => s), 0.01);
  const mileage =
    km && listing.mileageKm > 0
      ? listing.mileageKm < km[1]
        ? "méně než většina"
        : listing.mileageKm > km[3]
          ? "více než většina"
          : "obvyklý nájezd"
      : null;
  const scope = context.statsOfGeneration ? "této generace" : `${makeName} ${context.lineName} (všechny generace)`;

  return (
    <section className="card p-4 sm:p-5 min-w-0">
      <h2 className="font-bold text-lg">Skutečná data z ČR</h2>
      <p className="mt-1 text-sm text-[var(--color-muted)]">Vozy {scope} v registru a při technických prohlídkách.</p>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.n != null && <Tile label="V registru ČR" value={formatNumber(stats.n)} hint="vozidel v provozu" />}
        {fail && (
          <Tile
            label={`Neprošlo STK po ${years(fail[0])}`}
            value={formatPercent(fail[1])}
            hint={stats.failRate != null ? `všechna stáří ${formatPercent(stats.failRate)}` : undefined}
          />
        )}
        {km && (
          <Tile
            label={`Obvyklý nájezd po ${years(km[0])}`}
            value={formatKm(km[2])}
            hint={
              <>
                polovina vozů {Math.round(km[1] / 1000)}–{Math.round(km[3] / 1000)} tis. km
                {mileage && <b className="block font-semibold text-[var(--color-ink)]">Tento vůz: {mileage}</b>}
              </>
            }
          />
        )}
      </div>
      {stats.defects.length > 0 && (
        <div className="mt-5">
          <h3 className="font-semibold">Nejčastější závady při STK</h3>
          <ol className="mt-3 space-y-3">
            {stats.defects.map(([label, share]) => (
              <li key={label} className="text-sm">
                <div className="flex justify-between gap-3">
                  <span className="min-w-0">{label}</span>
                  <b className="shrink-0">{formatPercent(share)}</b>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-[var(--color-field)]">
                  <div className="h-full rounded-full bg-[var(--color-brand)]" style={{ width: `${(share / maxDefect) * 100}%` }} />
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-2 text-xs text-[var(--color-muted)]">Na co se při prohlídce vozu zaměřit. Podíl prohlídek, při kterých byla závada zjištěna.</p>
        </div>
      )}
      {stats.rollback != null && stats.rollback > 0 && (
        <p className="mt-4 text-sm">
          Stočený tachometr (nižší stav než při předchozí STK) měl <b>{formatPercent(stats.rollback)}</b> vozů. Historii nájezdu
          ověřte podle VIN.
        </p>
      )}
      <p className="mt-4 text-xs text-[var(--color-muted)]">
        Zdroj: Ministerstvo dopravy ČR, otevřená data — Registr silničních vozidel a technické prohlídky ({formatDate(statsPeriod.stkFrom)} –{" "}
        {formatDate(statsPeriod.stkTo)}). Jde o souhrn všech vozů, ne o tento konkrétní vůz.
      </p>
    </section>
  );
}
