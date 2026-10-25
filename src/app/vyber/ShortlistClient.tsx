"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Place } from "@/components/Place";
import { BODY_LABEL, FUEL_LABEL, getBrand, getModel } from "@/lib/catalog";
import { formatDate, formatKm, formatPrice } from "@/lib/format";
import { getListing } from "@/lib/listings";
import { marketEstimate } from "@/lib/market";
import { stkSignal } from "@/lib/stk";
import { MAX_COMPARE, savedSearches, shortlist } from "@/lib/storage";
import type { Listing } from "@/lib/types";

const MISSING = <span className="text-[var(--color-muted)] italic">neuvedeno</span>;

interface Row {
  label: string;
  value: (l: Listing) => React.ReactNode;
  /** numeric key used to highlight the best car in the row */
  best?: { key: (l: Listing) => number | null; prefer: "min" | "max" };
}

const ROWS: Row[] = [
  { label: "Cena", value: (l) => <b>{formatPrice(l.price)}</b>, best: { key: (l) => l.price, prefer: "min" } },
  {
    label: "Cena vůči trhu",
    value: (l) => marketEstimate(l)?.verdict ?? MISSING,
    best: { key: (l) => marketEstimate(l)?.ratio ?? null, prefer: "min" },
  },
  { label: "Rok", value: (l) => l.year, best: { key: (l) => l.year, prefer: "max" } },
  { label: "Najeto", value: (l) => formatKm(l.mileageKm), best: { key: (l) => l.mileageKm, prefer: "min" } },
  { label: "Motor", value: (l) => l.engine },
  { label: "Výkon", value: (l) => `${l.powerKw} kW`, best: { key: (l) => l.powerKw, prefer: "max" } },
  { label: "Palivo", value: (l) => FUEL_LABEL[l.fuel] },
  { label: "Převodovka", value: (l) => l.transmission },
  { label: "Karoserie", value: (l) => BODY_LABEL[l.body] },
  { label: "Generace", value: (l) => l.generation },
  {
    label: "STK (datované záznamy)",
    value: (l) => {
      const s = stkSignal(l);
      if (s.kind === "none") return 2026 - l.year < 4 ? "zatím bez STK (mladší 4 let)" : "záznamy nejsou k dispozici";
      if (s.kind === "drop") return <span className="text-[var(--color-bad)]">⚠ pokles nájezdu</span>;
      return `${s.count}× bez poklesu`;
    },
  },
  {
    label: "Baterie",
    value: (l) =>
      l.battery
        ? `${l.battery.capacityKwh} kWh${l.battery.sohPercent ? `, SoH ${l.battery.sohPercent} % (${formatDate(l.battery.testedAt!)})` : ", bez testu"}`
        : "—",
  },
  { label: "Prodejce", value: (l) => l.sellerName },
  { label: "Místo", value: (l) => <Place city={l.city} fallback={l.region} /> },
];

function bestIds(row: Row, cars: Listing[]): Set<string> {
  if (!row.best || cars.length < 2) return new Set();
  const values = cars.map((c) => ({ id: c.id, v: row.best!.key(c) })).filter((x) => x.v !== null) as { id: string; v: number }[];
  if (values.length < 2) return new Set();
  const target = row.best.prefer === "min" ? Math.min(...values.map((x) => x.v)) : Math.max(...values.map((x) => x.v));
  return new Set(values.filter((x) => x.v === target).map((x) => x.id));
}

export function ShortlistClient() {
  const params = useSearchParams();
  const pathname = usePathname();
  const stored = shortlist.useValue();
  const searches = savedSearches.useValue();
  const sharedIds = params.get("ids")?.split(",").filter(Boolean) ?? null;
  const ids = sharedIds ?? stored;
  const cars = ids.map(getListing).filter((l): l is Listing => Boolean(l));
  // The manual selection belongs to one context (a shared link or my own shortlist);
  // switching context falls back to the first cars of the new list.
  const context = sharedIds ? `shared:${sharedIds.join(",")}` : "mine";
  const [selection, setSelection] = useState<{ context: string; ids: string[] } | null>(null);
  const selected = selection?.context === context ? selection.ids : null;
  const setSelected = (ids: string[]) => setSelection({ context, ids });
  const compared = (selected ?? cars.slice(0, MAX_COMPARE).map((c) => c.id))
    .map((id) => cars.find((c) => c.id === id))
    .filter((c): c is Listing => Boolean(c));
  const [copied, setCopied] = useState(false);

  function toggleCompare(id: string) {
    const current = compared.map((c) => c.id);
    if (current.includes(id)) setSelected(current.filter((x) => x !== id));
    else if (current.length < MAX_COMPARE) setSelected([...current, id]);
  }

  async function share() {
    const url = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${pathname}?ids=${compared.map((c) => c.id).join(",")}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt("Zkopírujte odkaz:", url);
    }
  }

  return (
    <div className="mt-6 space-y-8">
      {sharedIds && (
        <p className="card p-3 text-sm text-[var(--color-muted)]">
          Prohlížíte sdílené porovnání. <Link href="/vyber/" className="text-[var(--color-brand)]">Zobrazit můj výběr</Link>
        </p>
      )}

      {cars.length === 0 ? (
        <div className="card p-8 text-center text-[var(--color-muted)]">
          Zatím nic. U inzerátu klikněte na ☆ a auto se objeví tady.{" "}
          <Link href="/inzeraty/" className="text-[var(--color-brand)]">Přejít na inzeráty</Link>
        </div>
      ) : (
        <section>
          <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
            <h2 className="text-xl font-bold">Porovnání ({compared.length} z max. {MAX_COMPARE})</h2>
            {compared.length >= 2 && (
              <button onClick={share} className="pill">{copied ? "Odkaz zkopírován ✓" : "Sdílet porovnání"}</button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Auta v porovnání">
            {cars.map((c) => {
              const on = compared.some((x) => x.id === c.id);
              const full = !on && compared.length >= MAX_COMPARE;
              return (
                <button key={c.id} className="pill" data-on={on} disabled={full} aria-pressed={on} onClick={() => toggleCompare(c.id)}>
                  {getBrand(c.brandSlug)?.name} {getModel(c.brandSlug, c.modelSlug)?.name} {c.year}
                </button>
              );
            })}
          </div>
          <div className="card relative overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="text-left align-top">
                  <th className="p-3 w-40 font-medium text-[var(--color-muted)]">Vůz</th>
                  {compared.map((c) => (
                    <th key={c.id} className="p-3 font-semibold">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/inzeraty/${c.id}/`} className="hover:text-[var(--color-brand)]">
                          {getBrand(c.brandSlug)?.name} {getModel(c.brandSlug, c.modelSlug)?.name}, {c.year}
                        </Link>
                        {!sharedIds && <FavoriteButton id={c.id} label={c.id} className="!h-7 !w-7 text-sm shrink-0" />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => {
                  const best = bestIds(row, compared);
                  return (
                    <tr key={row.label} className="border-t border-[var(--color-line)]">
                      <th scope="row" className="p-3 text-left font-normal text-[var(--color-muted)]">{row.label}</th>
                      {compared.map((c) => (
                        <td key={c.id} className={`p-3 ${best.has(c.id) ? "text-[var(--color-good)] font-semibold" : ""}`}>
                          {row.value(c)}
                          {best.has(c.id) && <span className="sr-only"> (nejlepší)</span>}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[var(--color-muted)] mt-2">Zeleně nejlepší hodnota v řádku. Údaje o voze uvádí prodejce; STK jsou datované záznamy.</p>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-3">Uložená hledání</h2>
        {searches.length === 0 ? (
          <p className="text-[var(--color-muted)] text-sm">Ve vyhledávání klikněte na „Uložit hledání“.</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {searches.map((s) => (
              <li key={s.query} className="card p-3 flex items-center justify-between gap-3">
                <Link href={`/inzeraty/?${s.query}`} className="min-w-0">
                  <span className="block font-semibold truncate">{s.label}</span>
                  <span className="text-xs text-[var(--color-muted)]">uloženo {formatDate(s.savedAt)}</span>
                </Link>
                <button
                  className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                  aria-label={`Smazat hledání ${s.label}`}
                  onClick={() => savedSearches.write(searches.filter((x) => x.query !== s.query))}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-[var(--color-muted)] mt-2">Upozornění e-mailem na nová auta přidáme spolu s účty.</p>
      </section>
    </div>
  );
}
