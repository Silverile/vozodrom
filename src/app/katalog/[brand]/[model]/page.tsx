import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bar } from "@/components/Bar";
import { CarImage } from "@/components/CarImage";
import { ListingRow } from "@/components/ListingRow";
import { BODY_LABEL, FUEL_LABEL, getBrand, getModel, models } from "@/lib/catalog";
import { formatKm, formatNumber, formatPercent, formatPrice } from "@/lib/format";
import { listingsOf } from "@/lib/listings";

type Params = Promise<{ brand: string; model: string }>;

export function generateStaticParams() {
  return models.map((m) => ({ brand: m.brandSlug, model: m.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { brand, model } = await params;
  const b = getBrand(brand);
  const m = getModel(brand, model);
  return {
    title: b && m ? `${b.name} ${m.name} — technické údaje, STK a inzeráty` : "Model",
    description: m?.description,
  };
}

function Section({ title, children, note, id }: { title: string; children: React.ReactNode; note?: string; id?: string }) {
  return (
    <section id={id} className="card p-5 scroll-mt-24">
      <h2 className="font-bold text-lg">{title}</h2>
      <div className="mt-4">{children}</div>
      {note && <p className="text-xs text-[var(--color-muted)] mt-4">{note}</p>}
    </section>
  );
}

export default async function ModelPage({ params }: { params: Params }) {
  const { brand: brandSlug, model: modelSlug } = await params;
  const brand = getBrand(brandSlug);
  const model = getModel(brandSlug, modelSlug);
  if (!brand || !model) notFound();

  const offers = listingsOf(brandSlug, modelSlug);
  const prices = offers.map((l) => l.price);
  const maxDefect = Math.max(...model.stk.defects.map((d) => d.share));
  const maxKm = Math.max(...model.mileageByAge.map((m) => m.km));
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
        <Link href={`/katalog/${brandSlug}/`} className="hover:underline">{brand.name}</Link> / {model.name}
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] mt-3 items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{brand.name} {model.name}</h1>
          <p className="text-[var(--color-muted)] mt-1">{model.segment} · {BODY_LABEL[model.body]}</p>
          <p className="mt-4 max-w-xl">{model.description}</p>
          <div className="mt-5 grid grid-cols-3 gap-3 max-w-md">
            <div className="card p-3 col-span-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs text-[var(--color-muted)]">Hodnocení majitelů*</div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {model.pros.slice(0, 3).map((p) => (
                    <span key={p.label} className="chip bg-[var(--color-good-soft)] text-[var(--color-good)]">{p.label} <b className="opacity-70">{formatNumber(p.count)}</b></span>
                  ))}
                </div>
              </div>
              <span className="rounded-lg bg-[var(--color-brand)] text-[var(--color-brand-ink)] px-2.5 py-1 text-2xl font-extrabold">
                {model.ownerScore.toLocaleString("cs-CZ", { minimumFractionDigits: 1 })}
              </span>
            </div>
            <div className="card p-3">
              <div className="text-xs text-[var(--color-muted)]">V provozu*</div>
              <div className="font-bold">{formatNumber(model.registered)}</div>
            </div>
            <div className="card p-3">
              <div className="text-xs text-[var(--color-muted)]">Neprošlo STK*</div>
              <div className="font-bold">{formatPercent(model.stk.failRate)}</div>
            </div>
            <div className="card p-3">
              <div className="text-xs text-[var(--color-muted)]">Inzeráty</div>
              <div className="font-bold">{offers.length}</div>
            </div>
          </div>
        </div>
        <CarImage body={model.body} color="modrá" className="w-full rounded-2xl" />
      </div>

      <div className="grid gap-4 mt-8 lg:grid-cols-2">
        <Section title="Generace">
          <ol className="relative border-l-2 border-[var(--color-line)] ml-2 space-y-4">
            {model.generations.map((g) => (
              <li key={g.code} className="pl-4">
                <span className="absolute -left-[7px] mt-1.5 w-3 h-3 rounded-full bg-[var(--color-brand)]" />
                <div className="font-semibold">{g.code}</div>
                <div className="text-sm text-[var(--color-muted)]">{g.from} – {g.to ?? "dosud"}</div>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Motorizace">
          <table className="w-full text-sm">
            <thead className="text-left text-[var(--color-muted)]">
              <tr><th className="pb-2 font-medium">Motor</th><th className="pb-2 font-medium">Palivo</th><th className="pb-2 font-medium">Výkon</th><th className="pb-2 font-medium">Spotřeba*</th></tr>
            </thead>
            <tbody>
              {model.engines.map((e) => (
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

        <Section
          title="Nejčastější závady při STK"
          note={`* Testovací data. V ostrém provozu: otevřená data Ministerstva dopravy o technických prohlídkách (${formatNumber(model.stk.inspections)} prohlídek v ukázce).`}
        >
          <div className="space-y-2.5">
            {model.stk.defects.map((d) => (
              <Bar key={d.label} label={d.label} value={d.share} max={maxDefect} display={formatPercent(d.share)} />
            ))}
          </div>
        </Section>

        <Section id="najezd" title="Typický nájezd podle stáří" note="* Medián stavu tachometru při STK, testovací data.">
          <div className="space-y-2.5">
            {model.mileageByAge.map((m) => (
              <Bar key={m.age} label={`${m.age} ${m.age === 1 ? "rok" : m.age < 5 ? "roky" : "let"}`} value={m.km} max={maxKm} display={formatKm(m.km)} />
            ))}
          </div>
        </Section>

        {byYear.length > 0 && (
          <Section id="ceny" title="Ceny v inzerátech podle ročníku" note={`Rozpětí: ${formatPrice(Math.min(...prices))} – ${formatPrice(Math.max(...prices))}.`}>
            <div className="space-y-2.5">
              {byYear.map((y) => (
                <Bar key={y.year} label={String(y.year)} value={y.avg} max={maxAvg} display={formatPrice(Math.round(y.avg / 1000) * 1000)} />
              ))}
            </div>
          </Section>
        )}
      </div>

      <div className="flex items-end justify-between mt-10 mb-4">
        <h2 className="text-xl font-bold">Inzeráty {brand.name} {model.name}</h2>
        <Link href={`/inzeraty/?znacka=${brandSlug}&model=${modelSlug}`} className="text-sm font-semibold text-[var(--color-brand)]">
          Hledat s filtry →
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {offers.map((l) => (
          <ListingRow key={l.id} listing={l} />
        ))}
      </div>
    </div>
  );
}
