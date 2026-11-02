"use client";

import Link from "next/link";
import { useState } from "react";
import type { PopularLine } from "@/lib/popular-lines";

// "Jaké auto máte?": the visitor picks their car and sees how many owners of the same model keep a
// logbook here already (or that nobody does yet), with a button that opens the garage form with the
// model filled in.

const owners = (n: number) => (n === 1 ? "majitel" : n >= 2 && n <= 4 ? "majitelé" : "majitelů");
/** "píše" with 1 or 5+ owners, "píšou" with 2–4 */
const write = (n: number) => (n >= 2 && n <= 4 ? "píšou" : "píše");
const entries = (n: number) => (n === 1 ? "zápis" : n >= 2 && n <= 4 ? "zápisy" : "zápisů");

export function OwnerPicker({ lines }: { lines: PopularLine[] }) {
  const [picked, setPicked] = useState<PopularLine | null>(null);
  const [counts, setCounts] = useState<{ cars: number; entries: number } | null>(null);

  async function pick(value: string) {
    const line = lines.find((l) => `${l.make}/${l.line}` === value) ?? null;
    setPicked(line);
    setCounts(null);
    if (!line) return;
    const response = await fetch(`/api/deniky/majitele/?znacka=${line.make}&model=${line.line}`).catch(() => null);
    if (response?.ok) setCounts((await response.json()) as { cars: number; entries: number });
  }

  return (
    <div className="rounded-[14px] bg-[var(--color-surface)] p-5 sm:p-6">
      <label htmlFor="moje-auto" className="block text-lg font-semibold">Jaké auto máte?</label>
      <select id="moje-auto" className="input mt-2 !text-base" value={picked ? `${picked.make}/${picked.line}` : ""} onChange={(e) => pick(e.target.value)}>
        <option value="">Vyberte model</option>
        {lines.map((l) => <option key={`${l.make}/${l.line}`} value={`${l.make}/${l.line}`}>{l.name}</option>)}
      </select>
      {picked && (
        <div aria-live="polite" className="mt-4 space-y-3">
          <p className="text-base">
            {counts === null
              ? "Zjišťuji…"
              : counts.cars === 0
                ? `Zatím tu příběh svého auta ${picked.name} nepíše nikdo. Buďte první.`
                : `Příběh svého auta ${picked.name} tu ${write(counts.cars)} ${counts.cars} ${owners(counts.cars)}, zatím ${counts.entries} ${entries(counts.entries)}.`}
          </p>
          <p className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href={`/garaz/nove/?znacka=${picked.make}&model=${picked.line}`} className="btn-cta !px-5 !py-3 text-base">Napsat příběh: {picked.name}</Link>
            {counts !== null && counts.entries > 0 && (
              <Link href={`/pribehy/?znacka=${picked.make}&model=${picked.line}`} className="font-semibold underline underline-offset-4">Číst jejich zápisy</Link>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
