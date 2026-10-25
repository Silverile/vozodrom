import { formatDate, formatKm } from "@/lib/format";
import { stkSignal } from "@/lib/stk";
import type { Listing } from "@/lib/types";

function Item({ state, children }: { state: "ok" | "warn" | "locked"; children: React.ReactNode }) {
  const icon = state === "ok" ? "✓" : state === "warn" ? "⚠" : "🔒";
  const color = state === "ok" ? "text-[var(--color-good)]" : state === "warn" ? "text-[var(--color-bad)]" : "text-[var(--color-muted)] grayscale";
  return (
    <li className={`flex gap-2 ${state === "locked" ? "text-[var(--color-muted)]" : ""}`}>
      <span className={`w-4 shrink-0 font-bold ${color}`}>{icon}</span>
      <span>{children}</span>
    </li>
  );
}

/** Free part of the vehicle check (registry + STK data); the full history is a paid partner report. */
export function VehicleCheck({ listing }: { listing: Listing }) {
  const signal = stkSignal(listing);
  return (
    <section className="card p-4">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-bold">Prověření vozu</h3>
        <span className="text-[11px] font-mono text-[var(--color-muted)]">VIN {listing.vin}</span>
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        <Item state="ok">Typ, motor a rok výroby sedí s registrem vozidel</Item>
        {signal.kind === "none" && <Item state="ok">Vůz je mladší než 4 roky, STK ho teprve čeká</Item>}
        {signal.kind === "ok" && <Item state="ok">{signal.count} technické kontroly, nájezd mezi nimi neklesl</Item>}
        {signal.kind === "drop" && (
          <Item state="warn">
            Pokles nájezdu: {formatKm(signal.fromKm)} → {formatKm(signal.toKm)} při STK {formatDate(signal.date)}
          </Item>
        )}
        <Item state="locked">Nehody a pojistné události</Item>
        <Item state="locked">Exekuce, zástavy a leasing</Item>
        <Item state="locked">Historie inzerce a servisní záznamy</Item>
      </ul>
      <button disabled className="mt-4 w-full rounded-[10px] border border-[var(--color-line)] py-2.5 text-sm font-semibold opacity-60 cursor-not-allowed">
        Úplná historie u partnera
      </button>
      <p className="text-[11px] text-[var(--color-muted)] mt-2">
        Záznamy STK jsou datované a nepotvrzují aktuální stav tachometru. Prototyp: smyšlená data.
      </p>
    </section>
  );
}
