import { formatDate, formatKm } from "@/lib/format";
import { stkSignal } from "@/lib/stk";
import type { Listing } from "@/lib/types";

function Item({ state, children }: { state: "ok" | "warn" | "info" | "locked"; children: React.ReactNode }) {
  const icon = { ok: "✓", warn: "⚠", info: "–", locked: "🔒" }[state];
  const color = {
    ok: "text-[var(--color-good)]",
    warn: "text-[var(--color-bad)]",
    info: "text-[var(--color-muted)]",
    locked: "text-[var(--color-muted)] grayscale",
  }[state];
  return (
    <li className={`flex gap-2 ${state === "locked" || state === "info" ? "text-[var(--color-muted)]" : ""}`}>
      <span className={`w-4 shrink-0 font-bold ${color}`} aria-hidden="true">{icon}</span>
      <span>{children}</span>
    </li>
  );
}

/** Free part of the vehicle check (registry + STK data); the full history is a paid partner report. */
export function VehicleCheck({ listing }: { listing: Listing }) {
  const signal = stkSignal(listing);
  const hasVin = listing.vin !== "neuvedeno";
  const age = 2026 - listing.year;
  return (
    <section className="card p-4">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-bold">Prověření vozu</h3>
        <span className="text-[11px] font-mono text-[var(--color-muted)]">VIN {listing.vin}</span>
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        {!hasVin ? (
          <Item state="info">Prodejce neuvedl VIN, vůz nelze porovnat s registrem ani s daty STK</Item>
        ) : (
          <>
            <Item state="ok">Typ, motor a rok výroby sedí s registrem vozidel</Item>
            {signal.kind === "none" &&
              (age < 4 ? (
                <Item state="ok">Vůz je mladší než 4 roky, STK ho teprve čeká</Item>
              ) : (
                <Item state="info">Záznamy STK nejsou k dispozici</Item>
              ))}
            {signal.kind === "ok" && <Item state="ok">{signal.count} technické kontroly, nájezd mezi nimi neklesl</Item>}
            {signal.kind === "drop" && (
              <Item state="warn">
                Pokles nájezdu: {formatKm(signal.fromKm)} → {formatKm(signal.toKm)} při STK {formatDate(signal.date)}
              </Item>
            )}
          </>
        )}
        <Item state="locked">Nehody a pojistné události</Item>
        <Item state="locked">Exekuce, zástavy a leasing</Item>
        <Item state="locked">Historie inzerce a servisní záznamy</Item>
      </ul>
      <p className="mt-3 rounded-[10px] border border-[var(--color-line)] p-2.5 text-xs text-[var(--color-muted)]">
        🔒 Úplnou historii nabídneme přes partnera (placená prověrka). V prototypu zatím není napojená.
      </p>
      <p className="text-[11px] text-[var(--color-muted)] mt-2">
        Záznamy STK jsou datované a nepotvrzují aktuální stav tachometru. Prototyp: smyšlená data.
      </p>
    </section>
  );
}
