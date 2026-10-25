import type { Metadata } from "next";
import Link from "next/link";
import { feedReports } from "@/lib/listings";

export const metadata: Metadata = { title: "Pro prodejce: import inzerátů" };

const EXAMPLE = `{
  "feed": "vas-autobazar",
  "seller": "Váš autobazar s.r.o.",
  "generatedAt": "2026-10-25T06:00:00Z",
  "vehicles": [
    {
      "externalId": "A-123",          // vaše ID vozu, stálé
      "status": "active",             // active | sold
      "updatedAt": "2026-10-25",
      "brand": "skoda", "model": "octavia",
      "year": 2021, "mileageKm": 88000,
      "price": 389000,                // Kč při platbě najednou
      "engine": "2.0 TDI", "fuel": "nafta",
      "transmission": "automat", "powerKw": 110,
      "color": "šedá", "region": "Praha",
      "city": "praha",                // nepovinné, jinak krajské město
      "features": ["Navigace", "Tempomat"],
      "description": "…"
    }
  ]
}`;

export default function DealersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Pro prodejce</h1>
        <p className="text-[var(--color-muted)] mt-1">
          Posílejte nám svůj vlastní sklad jako feed. Inzeráty nikdy nepřebíráme z jiných portálů.
        </p>
      </div>

      <section className="card p-5">
        <h2 className="font-bold text-lg">Jak import funguje</h2>
        <ul className="mt-3 space-y-2 text-sm text-[var(--color-muted)] list-disc pl-5">
          <li><b className="text-[var(--color-ink)]">Opakovaný import nic nerozbije:</b> pro každé <code>externalId</code> platí nejnovější <code>updatedAt</code>.</li>
          <li><b className="text-[var(--color-ink)]">Prodané auto</b> pošlete se stavem <code>sold</code> a z webu zmizí.</li>
          <li><b className="text-[var(--color-ink)]">Chybné záznamy</b> nezobrazíme a v přehledu uvidíte důvod.</li>
          <li><b className="text-[var(--color-ink)]">Cena</b> je vždy cena při platbě najednou. Nabídku financování uvádějte zvlášť.</li>
        </ul>
        <pre className="mt-4 overflow-x-auto rounded-[10px] bg-[var(--color-field)] p-4 text-xs leading-relaxed"><code>{EXAMPLE}</code></pre>
      </section>

      {feedReports.map((r) => (
        <section key={r.feed} className="card p-5">
          <h2 className="font-bold text-lg">Poslední import: {r.seller}</h2>
          <p className="text-xs text-[var(--color-muted)]">Ukázkový testovací feed <code>{r.feed}</code></p>
          <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              ["Přijato záznamů", r.received],
              ["Zobrazeno", r.imported.length],
              ["Sloučeno aktualizací", r.duplicatesMerged],
              ["Prodáno / staženo", r.removed.length],
            ].map(([k, v]) => (
              <div key={k} className="rounded-[10px] bg-[var(--color-field)] p-3">
                <dd className="text-2xl font-extrabold">{v}</dd>
                <dt className="text-xs text-[var(--color-muted)]">{k}</dt>
              </div>
            ))}
          </dl>
          {r.imported.length > 0 && (
            <ul className="mt-4 text-sm space-y-1">
              {r.imported.map((l) => (
                <li key={l.id}>
                  ✓ <Link href={`/inzeraty/${l.id}/`} className="text-[var(--color-brand)] hover:underline">{l.source.kind === "feed" ? l.source.externalId : l.id}</Link>{" "}
                  <span className="text-[var(--color-muted)]">aktualizováno {l.postedAt}</span>
                </li>
              ))}
            </ul>
          )}
          {r.rejected.length > 0 && (
            <div className="mt-4 rounded-[10px] bg-[var(--color-bad-soft)] p-3 text-sm">
              <b className="text-[var(--color-bad)]">Odmítnuto:</b>
              <ul className="mt-1 space-y-1">
                {r.rejected.map((x) => (
                  <li key={x.externalId}>{x.externalId}: {x.reasons.join(", ")}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
