import { formatDate } from "@/lib/format";
import type { Battery } from "@/lib/types";

/** EV battery facts, separating what the seller declares from what a dated test shows. */
export function BatteryPanel({ battery }: { battery: Battery }) {
  return (
    <section className="card p-4">
      <h2 className="font-bold">🔋 Baterie</h2>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
        <dt className="text-[var(--color-muted)]">Kapacita</dt>
        <dd className="font-medium">{battery.capacityKwh} kWh <span className="text-[var(--color-muted)] font-normal">(uvádí prodejce)</span></dd>
        <dt className="text-[var(--color-muted)]">Stav (SoH)</dt>
        <dd className="font-medium">
          {battery.sohPercent !== null && battery.testedAt ? (
            <>
              {battery.sohPercent} % <span className="text-[var(--color-muted)] font-normal">· test {formatDate(battery.testedAt)}, {battery.testMethod}</span>
            </>
          ) : (
            <span className="text-[var(--color-warn)]">Prodejce nedodal test baterie</span>
          )}
        </dd>
        {battery.warrantyUntil && (
          <>
            <dt className="text-[var(--color-muted)]">Záruka baterie</dt>
            <dd className="font-medium">do {formatDate(battery.warrantyUntil)} <span className="text-[var(--color-muted)] font-normal">(podle výrobce, ověřte podmínky)</span></dd>
          </>
        )}
      </dl>
      <p className="text-[11px] text-[var(--color-muted)] mt-3">
        Stav baterie neodhadujeme z registru ani z nájezdu. Bez testu chybí údaj, ne odhad. Prototyp: smyšlená data.
      </p>
    </section>
  );
}
