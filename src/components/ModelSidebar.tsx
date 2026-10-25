import Link from "next/link";
import { getBrand } from "@/lib/catalog";
import { formatNumber, formatPercent } from "@/lib/format";
import type { Model } from "@/lib/types";
import { Bar } from "./Bar";

/** Owner rating, opinion chips and STK defects for one model, shown next to search results and listings. */
export function ModelSidebar({ model, showLinks = true }: { model: Model; showLinks?: boolean }) {
  const brand = getBrand(model.brandSlug);
  const href = `/katalog/${model.brandSlug}/${model.slug}/`;
  const top = model.stk.defects.slice(0, 3);
  const maxDefect = Math.max(...top.map((d) => d.share));
  return (
    <div className="flex flex-col gap-3">
      <section className="card p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={href} className="font-bold hover:text-[var(--color-brand)]">{brand?.name} {model.name}</Link>
            <Link href={`/recenze/${model.brandSlug}/${model.slug}/`} className="block text-xs text-[var(--color-muted)] hover:text-[var(--color-brand)]">Hodnocení majitelů · {formatNumber(model.reviews)} recenzí* →</Link>
          </div>
          <span className="rounded-lg bg-[var(--color-brand)] text-[var(--color-brand-ink)] px-2 py-0.5 text-xl font-extrabold">
            {model.ownerScore.toLocaleString("cs-CZ", { minimumFractionDigits: 1 })}
          </span>
        </div>
        <h4 className="text-xs font-semibold text-[var(--color-muted)] mt-3">Co majitelé chválí</h4>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {model.pros.map((p) => (
            <span key={p.label} className="chip bg-[var(--color-good-soft)] text-[var(--color-good)]">
              {p.label} <b className="opacity-70">{formatNumber(p.count)}</b>
            </span>
          ))}
        </div>
        <h4 className="text-xs font-semibold text-[var(--color-muted)] mt-3">Co vadí</h4>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {model.cons.map((p) => (
            <span key={p.label} className="chip bg-[var(--color-warn-soft)] text-[var(--color-warn)]">
              {p.label} <b className="opacity-70">{formatNumber(p.count)}</b>
            </span>
          ))}
        </div>
      </section>

      <section className="card p-4">
        <h3 className="font-bold text-sm">Nejčastější závady při STK</h3>
        <p className="text-xs text-[var(--color-muted)]">Neprošlo {formatPercent(model.stk.failRate)} prohlídek*</p>
        <div className="space-y-2 mt-3">
          {top.map((d) => (
            <Bar key={d.label} label={d.label} value={d.share} max={maxDefect} display={formatPercent(d.share)} />
          ))}
        </div>
      </section>

      {showLinks && (
        <nav className="card p-2 text-sm">
          {[
            [href, "Technické údaje a generace"],
            [`${href}#ceny`, "Ceny podle ročníku"],
            [`${href}#najezd`, "Typický nájezd podle stáří"],
          ].map(([to, label]) => (
            <Link key={label} href={to} className="flex justify-between px-2 py-2 rounded-lg hover:bg-[var(--color-field)]">
              {label} <span className="text-[var(--color-muted)]">→</span>
            </Link>
          ))}
        </nav>
      )}
      <p className="text-[11px] text-[var(--color-muted)] px-1">* Testovací data. V ostrém provozu: recenze uživatelů a otevřená data MD ČR o STK.</p>
    </div>
  );
}
