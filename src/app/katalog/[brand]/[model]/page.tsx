import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bar } from "@/components/Bar";
import { CarImage } from "@/components/CarImage";
import { ListingRow } from "@/components/ListingRow";
import { OwnerQuestions } from "@/components/OwnerQuestions";
import { CarPhoto } from "@/components/CarPhoto";
import { FrontDrawing, frontDrawingId, newestFrontDrawing } from "@/components/FrontDrawing";
import { RealStats } from "@/components/RealStats";
import { BODY_LABEL, FUEL_LABEL, getBrand, getModel, models } from "@/lib/catalog";
import { formatKm, formatNumber, formatPercent, formatPrice } from "@/lib/format";
import { listingsOf } from "@/lib/listings";
import { MAKES, getMake, modelLinesOf, yearsOf } from "@/lib/makes";
import {
  BODY_NAMES,
  CARD_FUEL,
  DRIVE,
  GEARBOX,
  type CardEngine,
  type CardGeneration,
  type CardTrim,
  cardOf,
  coverOf,
  stagesOf,
  yearsSpan,
} from "@/lib/modelCards";
import { type StatsEntry, lineStats } from "@/lib/stats";
import type { Body } from "@/lib/types";

// One page per model line. Every curated line has one; demo models add owner ratings, STK data,
// prices and listings. Model cards (generations, engines, trims, photos) come from Codex's catalogue.

type Params = Promise<{ brand: string; model: string }>;

const PICTOGRAM: Record<string, Body> = { kupe: "hatchback", kabriolet: "hatchback", pickup: "suv", dodavka: "mpv" };

export function generateStaticParams() {
  const seen = new Set<string>();
  const out: { brand: string; model: string }[] = [];
  const add = (brand: string, model: string) => {
    const key = `${brand}/${model}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push({ brand, model });
    }
  };
  for (const m of models) add(m.brandSlug, m.slug);
  for (const make of MAKES) for (const l of modelLinesOf(make.slug)) add(make.slug, l.slug);
  return out;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { brand, model } = await params;
  const make = getMake(brand);
  const name = cardOf(brand, model)?.name ?? modelLinesOf(brand).find((l) => l.slug === model)?.name ?? getModel(brand, model)?.name;
  return {
    title: make && name ? `${make.name} ${name} — generace, technické údaje a inzeráty` : "Model",
    description: cardOf(brand, model)?.summary ?? getModel(brand, model)?.description,
  };
}

function Section({ title, children, note, id }: { title: string; children: React.ReactNode; note?: string; id?: string }) {
  return (
    <section id={id} className="card min-w-0 p-5 scroll-mt-24">
      <h2 className="font-bold text-lg">{title}</h2>
      <div className="mt-4">{children}</div>
      {note && <p className="text-xs text-[var(--color-muted)] mt-4">{note}</p>}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="card p-3 min-w-0">
      <div className="text-xs text-[var(--color-muted)]">{label}</div>
      <div className="font-bold truncate">{value}</div>
    </div>
  );
}

/** Euro segment letters read as "segment C"; descriptive segments are shown as they are. */
const segmentOf = (s: string | null | undefined) => (s && /^[A-FJMS]$/.test(s) ? `segment ${s}` : s);

const num = (n: number | null | undefined, unit = "") => (n == null ? "—" : `${n.toLocaleString("cs-CZ")}${unit}`);

function engineName(e: CardEngine): string {
  if (e.variant) return e.variant;
  const litres = e.displacementLitresNominal ?? (e.displacementCc ? Math.round(e.displacementCc / 100) / 10 : null);
  return [litres?.toLocaleString("cs-CZ", { minimumFractionDigits: 1 }), e.fuel && CARD_FUEL[e.fuel]].filter(Boolean).join(" ") || "—";
}

function power(e: CardEngine): string {
  if (e.powerKwMin == null && e.powerKwMax == null) return "—";
  if (e.powerKwMin === e.powerKwMax || e.powerKwMax == null) return `${e.powerKwMin} kW`;
  if (e.powerKwMin == null) return `${e.powerKwMax} kW`;
  return `${e.powerKwMin}–${e.powerKwMax} kW`;
}

/** Power range over all engines and trims of a model, or "" when nothing is known. */
function powerRange(gens: CardGeneration[]): string {
  const values = gens.flatMap((g) => [
    ...g.engines.flatMap((e) => [e.powerKwMin, e.powerKwMax]),
    ...g.trims.map((t) => t.engine?.powerKw ?? null),
  ]).filter((v): v is number => typeof v === "number");
  if (!values.length) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? `${min} kW` : `${min}–${max} kW`;
}

/** "4 689 × 1 829 × 1 470 mm" when all three are known, otherwise only the known ones by name. */
function dims(d: { length?: number | null; width?: number | null; height?: number | null } | null | undefined): string | null {
  if (!d || !(d.length || d.width || d.height)) return null;
  if (d.length && d.width && d.height) return `${num(d.length)} × ${num(d.width)} × ${num(d.height)} mm`;
  return [d.length && `délka ${num(d.length)}`, d.width && `šířka ${num(d.width)}`, d.height && `výška ${num(d.height)}`].filter(Boolean).join(", ") + " mm";
}

/** Trim table columns, shown only when at least one trim has a value. */
const TRIM_COLUMNS: { label: string; value: (t: CardTrim) => string | null; tip?: (t: CardTrim) => string | null | undefined }[] = [
  { label: "Karoserie", value: (t) => (t.bodyType ? BODY_NAMES[t.bodyType] ?? t.bodyType : null) },
  { label: "Roky", value: (t) => yearsSpan(t.from ?? null, t.to ?? null, false) || null },
  { label: "Motor", value: (t) => [t.engine?.displacementCc ? `${t.engine.displacementCc} cm³` : null, t.engine?.fuel ? CARD_FUEL[t.engine.fuel] : null].filter(Boolean).join(", ") || null },
  // ISO is the default; other standards (old SAE gross figures, UN GTR 21 for electric cars) are named.
  {
    label: "Výkon",
    value: (t) =>
      t.engine?.powerKw
        ? `${t.engine.powerKw.toLocaleString("cs-CZ")} kW${t.engine.powerStandard && t.engine.powerStandard !== "ISO" ? ` (${t.engine.powerStandard})` : ""}`
        : null,
  },
  { label: "Moment", value: (t) => (t.engine?.torqueNm ? `${t.engine.torqueNm} Nm` : null) },
  { label: "Převodovka", value: (t) => (t.transmission?.type ? `${GEARBOX[t.transmission.type] ?? t.transmission.type}${t.transmission.gears ? ` ${t.transmission.gears}st.` : ""}` : null) },
  { label: "Pohon", value: (t) => (t.drive ? DRIVE[t.drive] ?? t.drive : null) },
  { label: "Rozměry", value: (t) => dims(t.dimensionsMm) },
  // A published minimum (manufacturer gives a range by equipment) reads "od X kg"; the range goes to the tooltip.
  {
    label: "Hmotnost",
    value: (t) => (t.massKg ? `${t.massReference === "published-minimum" ? "od " : ""}${num(t.massKg)} kg` : null),
    tip: (t) =>
      [t.massRangeKg ? `rozpětí ${num(t.massRangeKg.min)}–${num(t.massRangeKg.max)} kg podle výbavy` : null, t.massBasis].filter(Boolean).join(". ") || null,
  },
  { label: "Max. rychlost", value: (t) => (t.topSpeedKmh ? `${t.topSpeedKmh} km/h` : null) },
  { label: "0–100", value: (t) => (t.acceleration0to100s ? `${t.acceleration0to100s.toLocaleString("cs-CZ")} s` : null) },
  {
    label: "Spotřeba",
    value: (t) => {
      const v = t.consumptionL100 ? `${t.consumptionL100.toLocaleString("cs-CZ")} l` : t.consumptionKwh100 ? `${t.consumptionKwh100.toLocaleString("cs-CZ")} kWh` : null;
      return v ? `${v}/100 km` : null;
    },
    tip: (t) => t.consumptionCycle,
  },
  { label: "Dojezd", value: (t) => (t.rangeKm ? `${num(t.rangeKm)} km` : null), tip: (t) => t.rangeCycle ?? t.consumptionCycle },
];

function Photo({ gen, alt, drawing, className = "", eager = false }: { gen: CardGeneration; alt: string; drawing?: string | null; className?: string; eager?: boolean }) {
  if (!gen.photo) {
    if (!drawing) return null;
    return (
      <figure className={`min-w-0 ${className}`}>
        <FrontDrawing id={drawing} alt={alt} className="rounded-xl" />
        <figcaption className="mt-1 text-[11px] text-[var(--color-muted)]">Ilustrační nákres, fotografie zatím chybí</figcaption>
      </figure>
    );
  }
  return (
    <figure className={`min-w-0 ${className}`}>
      {/* 16:10 frame without empty bars (CarPhoto) */}
      <CarPhoto photo={gen.photo} alt={alt} width={960} eager={eager} className="rounded-xl" />
      <figcaption className="mt-1 text-[11px] text-[var(--color-muted)] truncate">
        Foto: <a href={gen.photo.page} rel="noopener" className="underline hover:text-[var(--color-ink)]">{gen.photo.credit}</a>
      </figcaption>
    </figure>
  );
}

function GenerationDetail({ gen, title, id, stats, drawing }: { gen: CardGeneration; title: string; id: string; stats?: StatsEntry; drawing?: string | null }) {
  const facts: [string, string | null][] = [
    ["Výroba", yearsSpan(gen.from, gen.to, gen.current) || null],
    ["Modernizace", gen.facelifts.length ? gen.facelifts.map((f) => (f.name ? `${f.year} (${f.name})` : f.year)).join(", ") : null],
    ["Karoserie", gen.bodyTypes.length ? gen.bodyTypes.map((b) => BODY_NAMES[b] ?? b).join(", ") : null],
    ["Pohon", gen.drivetrains.length ? gen.drivetrains.map((d) => DRIVE[d] ?? d).join(", ") : null],
    [
      "Převodovky",
      gen.transmissions.length
        ? [...new Set(gen.transmissions.map((t) => `${GEARBOX[t.type] ?? t.type}${t.gears ? ` ${t.gears}st.` : ""}`))].join(", ")
        : null,
    ],
    ["Rozměry", dims(gen.dimensionsMm)],
    ["Rozvor", gen.dimensionsMm?.wheelbase ? `${num(gen.dimensionsMm.wheelbase)} mm` : null],
    ["Zavazadelník", gen.trunkL ? `${num(gen.trunkL)} l` : null],
  ];
  const shown = facts.filter(([, v]) => v);
  // facelifts with their own photo get a picture next to the original look
  const faceliftPhotos = stagesOf(gen).slice(1).filter((st) => st.photo);
  const columns = TRIM_COLUMNS.filter((c) => gen.trims.some((t) => c.value(t)));

  return (
    <section id={id} className="card min-w-0 p-5 scroll-mt-24">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-bold text-lg">{title}</h3>
        <span className="text-sm text-[var(--color-muted)]">{yearsSpan(gen.from, gen.to, gen.current)}</span>
      </div>
      {stats && (stats.fleet || stats.stk) && (
        <ul className="mt-2 flex flex-wrap gap-1.5 text-xs">
          {stats.fleet && <li className="chip">V registru ČR {formatNumber(stats.fleet.n)}</li>}
          {stats.stk && <li className="chip">Neprošlo STK {formatPercent(stats.stk.failRate)}</li>}
          {stats.stk?.km.find(([age]) => age === 10) && (
            <li className="chip">Nájezd v 10 letech ~{formatKm(stats.stk.km.find(([age]) => age === 10)![2])}</li>
          )}
        </ul>
      )}
      <div className={`mt-4 grid gap-5 ${gen.photo || drawing ? "md:grid-cols-[minmax(0,22rem)_1fr]" : ""}`}>
        <Photo gen={gen} alt={title} drawing={drawing} />
        <div className="min-w-0">
          {shown.length > 0 && (
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              {shown.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-[var(--color-muted)]">{k}</dt>
                  <dd className="font-medium min-w-0">{v}</dd>
                </div>
              ))}
            </dl>
          )}
          {gen.engines.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-[var(--color-muted)]">
                  <tr>
                    <th className="pb-1.5 font-medium pr-3">Motor</th>
                    <th className="pb-1.5 font-medium pr-3">Palivo</th>
                    <th className="pb-1.5 font-medium pr-3">Objem</th>
                    <th className="pb-1.5 font-medium">Výkon</th>
                  </tr>
                </thead>
                <tbody>
                  {gen.engines.map((e, i) => (
                    <tr key={i} className="border-t border-[var(--color-line)]">
                      <td className="py-1.5 pr-3 font-medium">{engineName(e)}</td>
                      <td className="pr-3">{e.fuel ? CARD_FUEL[e.fuel] : "—"}</td>
                      <td className="pr-3 whitespace-nowrap">{e.displacementCc ? `${num(e.displacementCc)} cm³` : "—"}</td>
                      <td className="whitespace-nowrap">{power(e)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {faceliftPhotos.length > 0 && (
        <div className="mt-5 grid gap-3 grid-cols-2 sm:grid-cols-3">
          {faceliftPhotos.map((st) => (
            <figure key={st.label} className="min-w-0">
              <CarPhoto photo={st.photo!} alt={`${title} ${st.label}`} className="rounded-xl" />
              <figcaption className="mt-1 text-xs">
                <b>{st.label}</b> <span className="text-[var(--color-muted)]">{yearsSpan(st.from, st.to, st.current)}</span>
                <span className="block truncate text-[11px] text-[var(--color-muted)]">
                  Foto: <a href={st.photo!.page} rel="noopener" className="underline hover:text-[var(--color-ink)]">{st.photo!.credit}</a>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      {gen.trims.length > 0 && (
        <div className="mt-5 overflow-x-auto">
          <h4 className="font-semibold text-sm mb-2">Verze a technické údaje</h4>
          <table className="w-full text-sm">
            <thead className="text-left text-[var(--color-muted)]">
              <tr>
                <th className="pb-1.5 pr-3 font-medium">Verze</th>
                {columns.map((c) => (
                  <th key={c.label} className="pb-1.5 pr-3 font-medium whitespace-nowrap">{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gen.trims.map((t, i) => (
                <tr key={i} className="border-t border-[var(--color-line)]">
                  <td className="py-1.5 pr-3 font-medium">{t.name ?? "—"}</td>
                  {columns.map((c) => {
                    const v = c.value(t);
                    const tip = v ? c.tip?.(t) : null;
                    return (
                      <td key={c.label} className="pr-3 whitespace-nowrap" title={tip ?? undefined}>
                        {v ?? "—"}
                        {tip && <span className="ml-0.5 text-[var(--color-muted)] cursor-help" aria-label={tip}>ⓘ</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {columns.some((c) => c.label === "Výkon") && (
            <p className="mt-2 text-xs text-[var(--color-muted)]">
              Výkon podle normy ISO, není-li uvedeno jinak (SAE = starší americká metodika, UN-GTR.21 = výkon elektromobilů). U spotřeby a hmotnosti
              ukazuje ⓘ metodiku měření. Výbavy a trhy se mohou lišit.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

export default async function ModelPage({ params }: { params: Params }) {
  const { brand: brandSlug, model: modelSlug } = await params;
  const make = getMake(brandSlug);
  const line = modelLinesOf(brandSlug).find((l) => l.slug === modelSlug);
  const model = getModel(brandSlug, modelSlug);
  const card = cardOf(brandSlug, modelSlug);
  if (!make || (!line && !model)) notFound();

  const name = card?.name ?? line?.name ?? model!.name;
  const title = `${make.name} ${name}`;
  const gens = card?.generations ?? [];
  const cover = coverOf(card);
  const coverGen = gens.find((g) => g.photo === cover);
  const coverDrawing = newestFrontDrawing(brandSlug, modelSlug);
  const bodies = [...new Set([...(line?.bodyTypes ?? []), ...gens.flatMap((g) => g.bodyTypes)])];
  const years = line ? yearsOf(line) : "";
  const powers = powerRange(gens);
  const offers = model ? listingsOf(brandSlug, modelSlug) : [];
  const demo = getBrand(brandSlug) && model ? model : undefined;
  const real = lineStats(brandSlug, modelSlug);

  const prices = offers.map((l) => l.price);
  const byYear = Object.entries(
    offers.reduce<Record<number, number[]>>((acc, l) => {
      (acc[l.year] ??= []).push(l.price);
      return acc;
    }, {}),
  )
    .map(([year, list]) => ({ year: Number(year), avg: list.reduce((a, b) => a + b, 0) / list.length }))
    .sort((a, b) => b.year - a.year);
  const maxAvg = Math.max(...byYear.map((y) => y.avg), 1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-[var(--color-muted)]">
        <Link href="/katalog/" className="hover:underline">Katalog</Link> /{" "}
        <Link href={`/katalog/${brandSlug}/`} className="hover:underline">{make.name}</Link> / {name}
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] mt-3 items-center">
        <div className="min-w-0">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{title}</h1>
          <p className="text-[var(--color-muted)] mt-1">
            {[segmentOf(card?.segment ?? demo?.segment), years && `vyráběno ${years}`].filter(Boolean).join(" · ")}
          </p>
          {bodies.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {bodies.map((b) => (
                <li key={b} className="chip">{BODY_NAMES[b] ?? b}</li>
              ))}
            </ul>
          )}
          {(card?.summary ?? demo?.description) && <p className="mt-4 max-w-xl">{card?.summary ?? demo?.description}</p>}

          {demo && (
            <div className="card p-3 mt-5 max-w-md flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Link href={`/recenze/${brandSlug}/${modelSlug}/`} className="text-xs text-[var(--color-brand)] hover:underline">Hodnocení majitelů* · recenze →</Link>
                <div className="flex flex-wrap gap-1.5 mt-1 [&>.chip]:max-w-full [&>.chip]:whitespace-normal">
                  {demo.pros.slice(0, 3).map((p) => (
                    <span key={p.label} className="chip bg-[var(--color-good-soft)] text-[var(--color-good)]">{p.label} <b className="opacity-70">{formatNumber(p.count)}</b></span>
                  ))}
                </div>
              </div>
              <span className="shrink-0 rounded-lg bg-[var(--color-brand)] text-[var(--color-brand-ink)] px-2.5 py-1 text-2xl font-extrabold">
                {demo.ownerScore.toLocaleString("cs-CZ", { minimumFractionDigits: 1 })}
              </span>
            </div>
          )}

          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl">
            {(gens.length || line?.generations.length) ? <Stat label="Generace" value={gens.length || line?.generations.length} /> : null}
            {powers && <Stat label="Výkon" value={powers} />}
            {real?.entry.stk ? (
              <Stat label="Neprošlo STK" value={formatPercent(real.entry.stk.failRate)} />
            ) : demo ? (
              <Stat label="Neprošlo STK*" value={formatPercent(demo.stk.failRate)} />
            ) : bodies.length > 1 ? (
              <Stat label="Karoserie" value={bodies.length} />
            ) : null}
            <Stat
              label="Inzeráty"
              value={
                <Link href={`/inzeraty/?znacka=${brandSlug}${model ? `&model=${modelSlug}` : ""}`} className="text-[var(--color-brand)] hover:underline">
                  {offers.length}
                </Link>
              }
            />
          </div>
        </div>
        {cover && coverGen ? (
          <Photo gen={coverGen} alt={title} eager />
        ) : coverDrawing ? (
          <FrontDrawing id={coverDrawing} alt={title} className="rounded-2xl" />
        ) : (
          <CarImage body={demo?.body ?? PICTOGRAM[bodies[0]] ?? ((bodies[0] as Body) || "hatchback")} color="modrá" className="w-full rounded-2xl" />
        )}
      </div>

      {gens.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-10 mb-3">Generace <span className="text-base font-normal text-[var(--color-muted)]">· {gens.length}</span></h2>
          <ol className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {gens.flatMap((g, i) => {
              // the original look, then each facelift that has its own photo, as on Drom
              const stages = stagesOf(g);
              const shown = [stages[0], ...stages.slice(1).filter((st) => st.photo)];
              const base = g.name ?? g.code ?? `${i + 1}. generace`;
              return shown.map((st, k) => (
                <li key={`${i}-${k}`} className="min-w-0">
                  <a href={`#g${i + 1}`} className="card block overflow-hidden hover:shadow-lg transition h-full">
                    {st.photo ? (
                      <CarPhoto photo={st.photo} alt={`${title} ${base} ${st.label}`.trim()} />
                    ) : frontDrawingId(brandSlug, modelSlug, i) ? (
                      <FrontDrawing id={frontDrawingId(brandSlug, modelSlug, i)!} alt={`${title} ${base}`} />
                    ) : (
                      <CarImage body={PICTOGRAM[g.bodyTypes[0]] ?? ((g.bodyTypes[0] as Body) || "hatchback")} color="stříbrná" className="w-full aspect-[16/10]" />
                    )}
                    <div className="p-3">
                      <div className="font-semibold truncate">
                        {base}
                        {st.label && <span className="ml-1.5 text-xs font-medium text-[var(--color-brand)]">{st.label}</span>}
                      </div>
                      <div className="text-xs text-[var(--color-muted)]">
                        {[
                          shown.length > 1 ? yearsSpan(st.from, st.to, st.current) : yearsSpan(g.from, g.to, g.current),
                          k === 0 && g.code && g.name && !g.name.includes(g.code) ? g.code : st.label ? st.code : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                    </div>
                  </a>
                </li>
              ));
            })}
          </ol>
          <div className="mt-4 flex flex-col gap-4">
            {[...gens].reverse().map((g, r) => {
              const i = gens.length - 1 - r;
              return <GenerationDetail key={i} id={`g${i + 1}`} gen={g} drawing={frontDrawingId(brandSlug, modelSlug, i)} stats={real?.gens[String(i)]} title={`${title} ${g.name?.replace(name, "").trim() || g.code || `${i + 1}. generace`}`} />;
            })}
          </div>
        </>
      )}

      {real && <RealStats entry={real.entry} meta={real.meta} title={title} />}

      {!card && line && line.generations.length === 0 && (
        <p className="card p-5 mt-8 text-sm text-[var(--color-muted)]">
          Generace, motory a fotografie tohoto modelu do katalogu teprve doplňujeme.
        </p>
      )}

      {!card && line && line.generations.length > 0 && (
        <Section title="Generace">
          <ul className="text-sm space-y-1">
            {line.generations.map((g, i) => (
              <li key={i}>
                <b>{g.code ?? `${i + 1}. generace`}</b> <span className="text-[var(--color-muted)]">{yearsSpan(g.from, g.to, false)}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {demo && (
        <div className="grid gap-4 mt-8 lg:grid-cols-2">
          {!card && (
            <Section title="Motorizace">
              <table className="w-full table-fixed sm:table-auto text-sm break-words">
                <thead className="text-left text-[var(--color-muted)]">
                  <tr><th className="pb-2 font-medium">Motor</th><th className="pb-2 font-medium">Palivo</th><th className="pb-2 font-medium">Výkon</th><th className="pb-2 font-medium">Spotřeba*</th></tr>
                </thead>
                <tbody>
                  {demo.engines.map((e) => (
                    <tr key={e.code} className="border-t border-[var(--color-line)]">
                      <td className="py-2 font-medium">{e.code}</td>
                      <td>{FUEL_LABEL[e.fuel]}</td>
                      <td>{e.powerKw} kW</td>
                      <td>{e.consumption} {e.fuel === "elektro" ? "kWh" : "l"}/100 km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          )}

          {!real?.entry.stk && (<Section
            title="Nejčastější závady při STK"
            note={`* Testovací data. V ostrém provozu: otevřená data Ministerstva dopravy o technických prohlídkách (${formatNumber(demo.stk.inspections)} prohlídek v ukázce).`}
          >
            <div className="space-y-2.5">
              {demo.stk.defects.map((d) => (
                <Bar key={d.label} label={d.label} value={d.share} max={Math.max(...demo.stk.defects.map((x) => x.share))} display={formatPercent(d.share)} />
              ))}
            </div>
          </Section>)}

          {!real?.entry.stk && (<Section id="najezd" title="Typický nájezd podle stáří" note="* Medián stavu tachometru při STK, testovací data.">
            <div className="space-y-2.5">
              {demo.mileageByAge.map((m) => (
                <Bar key={m.age} label={`${m.age} ${m.age === 1 ? "rok" : m.age < 5 ? "roky" : "let"}`} value={m.km} max={Math.max(...demo.mileageByAge.map((x) => x.km))} display={formatKm(m.km)} />
              ))}
            </div>
          </Section>)}

          {byYear.length > 0 && (
            <Section id="ceny" title="Ceny v inzerátech podle ročníku" note={`Rozpětí: ${formatPrice(Math.min(...prices))} – ${formatPrice(Math.max(...prices))}.`}>
              <div className="space-y-2.5">
                {byYear.map((y) => (
                  <Bar key={y.year} label={String(y.year)} value={y.avg} max={maxAvg} display={formatPrice(Math.round(y.avg / 1000) * 1000)} />
                ))}
              </div>
            </Section>
          )}

          {!real?.entry.fleet && (
            <Section title="V provozu v ČR*" note="* Testovací data. V ostrém provozu: Centrální registr vozidel.">
              <div className="text-3xl font-extrabold">{formatNumber(demo.registered)}</div>
              <p className="text-sm text-[var(--color-muted)] mt-1">registrovaných vozidel</p>
            </Section>
          )}
        </div>
      )}

      {demo && (
        <div className="mt-4">
          <OwnerQuestions model={demo} />
        </div>
      )}

      {offers.length > 0 && (
        <>
          <div className="flex flex-wrap items-end justify-between gap-2 mt-10 mb-4">
            <h2 className="text-xl font-bold">Inzeráty {title}</h2>
            <Link href={`/inzeraty/?znacka=${brandSlug}&model=${modelSlug}`} className="text-sm font-semibold text-[var(--color-brand)]">
              Hledat s filtry →
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {offers.map((l) => (
              <ListingRow key={l.id} listing={l} />
            ))}
          </div>
        </>
      )}

      <p className="mt-10 text-xs text-[var(--color-muted)] max-w-3xl">
        Technické údaje z Wikipedie, Wikidat a materiálů výrobce (fakta, vlastní texty); roky jsou roky výroby. Neznámé údaje necháváme prázdné.
        Fotografie z Wikimedia Commons, autor a licence u každé fotky.
        {demo && " Údaje označené * jsou testovací."}
      </p>
    </div>
  );
}
