import { Bar } from "@/components/Bar";
import { formatKm, formatNumber, formatPercent } from "@/lib/format";
import { FUEL_NAMES, type StatsEntry, type StatsMeta, czDate } from "@/lib/stats";

// Real fleet and STK statistics for a make, model line or generation (src/lib/stats.ts).

const capitalize = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

function Card({ title, children, note }: { title: string; children: React.ReactNode; note?: string }) {
  return (
    <section className="card min-w-0 p-5">
      <h3 className="font-bold text-lg">{title}</h3>
      <div className="mt-4">{children}</div>
      {note && <p className="text-xs text-[var(--color-muted)] mt-4">{note}</p>}
    </section>
  );
}

function Tile({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="rounded-xl bg-[var(--color-field)] px-3 py-2.5 min-w-0">
      <div className="text-xs text-[var(--color-muted)]">{label}</div>
      <div className="text-xl font-extrabold">{value}</div>
      {hint && <div className="text-xs text-[var(--color-muted)]">{hint}</div>}
    </div>
  );
}

export function RealStats({ entry, meta, title }: { entry: StatsEntry; meta: StatsMeta; title: string }) {
  const { fleet, stk } = entry;
  const maxYear = Math.max(...(fleet?.years.map(([, n]) => n) ?? [1]));
  const recentYears = fleet?.years.slice(-20) ?? [];
  const maxFail = Math.max(...(stk?.byAge.map(([, , r]) => r) ?? [0.01]), 0.01);
  const maxDefect = Math.max(...(stk?.defects.map((d) => d.share) ?? [0.01]), 0.01);
  const maxKm = Math.max(...(stk?.km.map((k) => k[3] ?? 0) ?? [1]), 1);

  return (
    <div>
      <h2 className="text-xl font-bold mt-10 mb-3">Skutečná data z ČR <span className="text-base font-normal text-[var(--color-muted)]">· {title}</span></h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {fleet && <Tile label="Jezdí v Česku" value={formatNumber(fleet.n)} hint="vozidel v provozu" />}
        {fleet?.avgAge != null && <Tile label="Průměrné stáří" value={`${fleet.avgAge.toLocaleString("cs-CZ")} let`} />}
        {fleet && <Tile label="Dovezeno ojeté" value={formatPercent(fleet.imported)} hint={fleet.countries[0] ? `nejčastěji ${fleet.countries[0][0]}` : undefined} />}
        {stk && <Tile label="Neprošlo STK" value={formatPercent(stk.failRate)} hint={`z ${formatNumber(stk.inspections)} prohlídek`} />}
      </div>

      <div className="grid gap-4 mt-4 lg:grid-cols-2">
        {stk && stk.byAge.length > 0 && (
          <Card title="Neprošlo STK podle stáří" note="Podíl pravidelných prohlídek s výsledkem „částečně způsobilé“ nebo „nezpůsobilé“. Stáří = rok prohlídky minus rok první registrace.">
            <div className="space-y-2">
              {stk.byAge.filter(([age]) => age >= 2 && age <= 25).map(([age, n, rate]) => (
                <Bar key={age} label={`${age} ${age < 5 ? "roky" : "let"}`} value={rate} max={maxFail} display={`${formatPercent(rate)} · ${formatNumber(n)}×`} />
              ))}
            </div>
          </Card>
        )}

        {stk && stk.defects.length > 0 && (
          <Card title="Nejčastější závady při STK" note="Podíl pravidelných prohlídek, při kterých byla závada zjištěna. Číslo v závorce je kód podle vyhlášky 211/2018 Sb.">
            <div className="space-y-2">
              {stk.defects.slice(0, 8).map((d) => (
                <Bar key={d.code} label={`${d.label ?? "Závada"} (${d.code})`} value={d.share} max={maxDefect} display={formatPercent(d.share)} />
              ))}
            </div>
          </Card>
        )}

        {stk && stk.km.length > 0 && (
          <Card title="Nájezd podle stáří" note={`Medián stavu tachometru při STK; v závorce rozmezí, ve kterém je polovina vozů.${stk.rollback ? ` Stočený tachometr (stav nižší než při předchozí prohlídce): ${formatPercent(stk.rollback.share)} z ${formatNumber(stk.rollback.vehicles)} vozů s více prohlídkami.` : ""}`}>
            <div className="space-y-2">
              {stk.km.filter(([age]) => age >= 2 && age <= 20 && age % 2 === 0).map(([age, p25, p50, p75]) => (
                <Bar key={age} label={`${age} let`} value={p50} max={maxKm} display={`${formatKm(p50)} (${Math.round(p25 / 1000)}–${Math.round(p75 / 1000)} tis.)`} />
              ))}
            </div>
          </Card>
        )}

        {fleet && (
          <Card title="Vozy v provozu">
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(fleet.fuel).map(([k, v]) => (
                <span key={k} className="chip">{FUEL_NAMES[k] ?? k} {formatPercent(v)}</span>
              ))}
            </div>
            {recentYears.length > 0 && (
              <div className="mt-4 flex items-end gap-0.5 h-24" aria-label="Počet vozů podle roku výroby">
                {recentYears.map(([y, n]) => (
                  <div key={y} className="flex-1 min-w-0 rounded-t bg-[var(--color-brand)]/70" style={{ height: `${Math.max(3, (n / maxYear) * 100)}%` }} title={`${y}: ${formatNumber(n)}`} />
                ))}
              </div>
            )}
            {recentYears.length > 0 && (
              <div className="flex justify-between text-xs text-[var(--color-muted)] mt-1">
                <span>{recentYears[0][0]}</span>
                <span>rok výroby</span>
                <span>{recentYears[recentYears.length - 1][0]}</span>
              </div>
            )}
            {fleet.colors.length > 0 && (
              <p className="text-sm mt-4">
                <span className="text-[var(--color-muted)]">Nejčastější barvy: </span>
                {fleet.colors.slice(0, 5).map(([c, s]) => `${capitalize(c)} ${formatPercent(s)}`).join(", ")}
              </p>
            )}
            {fleet.countries.length > 0 && (
              <p className="text-sm mt-1">
                <span className="text-[var(--color-muted)]">Dovoz ojetých hlavně z: </span>
                {fleet.countries.slice(0, 4).map(([c, s]) => `${c} ${formatPercent(s)}`).join(", ")}
              </p>
            )}
          </Card>
        )}
      </div>
      <p className="mt-3 text-xs text-[var(--color-muted)] max-w-3xl">
        Zdroj: Ministerstvo dopravy ČR, otevřená data – Registr silničních vozidel (výpis {meta.register.built.slice(0, 7)}) a technické prohlídky
        z IS TP ({czDate(meta.stk.from)} – {czDate(meta.stk.to)}). Zveřejňujeme jen souhrny skupin s alespoň {meta.minN} vozidly nebo prohlídkami.
      </p>
    </div>
  );
}
