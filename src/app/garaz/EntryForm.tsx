"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ENTRY_CATEGORIES, type EntryInput, MAX_ENTRY_BODY, cleanEntry, today } from "@/lib/garage";

// A logbook entry: what happened, when, at what mileage and for how much. New entries go to their
// edit page after saving, where photos can be added.

const input = "input mt-1";

export function EntryForm({ carId, entryId, initial }: { carId: string; entryId?: string; initial?: EntryInput }) {
  const router = useRouter();
  const [entry, setEntry] = useState<EntryInput>(initial ?? { title: "", body: "", category: "", costCzk: null, mileageKm: null, happenedOn: today() });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const write = (patch: Partial<EntryInput>) => {
    setEntry((e) => ({ ...e, ...patch }));
    setSaved(false);
  };
  const amount = (v: string) => (v.trim() === "" ? null : Math.round(Number(v.replace(/\s/g, ""))));

  async function save() {
    const checked = cleanEntry(entry);
    if (typeof checked === "string") return setError(checked);
    setBusy(true);
    setError("");
    const response = await fetch(entryId ? `/api/zapisy/${entryId}/` : `/api/garaz/${carId}/zapisy/`, {
      method: entryId ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(checked),
    });
    const result = (await response.json().catch(() => ({}))) as { id?: string; error?: string };
    setBusy(false);
    if (!response.ok) return setError(result.error ?? "Uložení se nepovedlo.");
    if (!entryId && result.id) router.push(`/garaz/zapis/${result.id}/`);
    else {
      setSaved(true);
      router.refresh();
    }
  }

  return (
    <form
      className="card p-5 grid gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <div className="text-sm sm:col-span-2">
        <label htmlFor="z-title">Nadpis</label>
        <input id="z-title" className={input} maxLength={120} placeholder="např. Výměna rozvodů a vodní pumpy" value={entry.title} onChange={(e) => write({ title: e.target.value })} />
      </div>
      <div className="text-sm">
        <label htmlFor="z-category">Téma</label>
        <select id="z-category" className={input} value={entry.category} onChange={(e) => write({ category: e.target.value })}>
          <option value="">Vyberte</option>
          {Object.entries(ENTRY_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <div className="text-sm">
        <label htmlFor="z-date">Datum</label>
        <input id="z-date" className={input} type="date" max={today()} value={entry.happenedOn} onChange={(e) => write({ happenedOn: e.target.value })} />
      </div>
      <div className="text-sm">
        <label htmlFor="z-cost">Cena (Kč)</label>
        <input id="z-cost" className={input} type="number" inputMode="numeric" min={0} value={entry.costCzk ?? ""} onChange={(e) => write({ costCzk: amount(e.target.value) })} />
      </div>
      <div className="text-sm">
        <label htmlFor="z-km">Nájezd (km)</label>
        <input id="z-km" className={input} type="number" inputMode="numeric" min={0} value={entry.mileageKm ?? ""} onChange={(e) => write({ mileageKm: amount(e.target.value) })} />
      </div>
      <div className="text-sm sm:col-span-2">
        <label htmlFor="z-body">Text</label>
        <div className="mt-1">
          <RichTextEditor id="z-body" maxLength={MAX_ENTRY_BODY} placeholder="Co se dělo, co jste měnili, co doporučujete ostatním." value={entry.body} onChange={(body) => write({ body })} />
        </div>
      </div>
      <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-cta" disabled={busy}>{entryId ? "Uložit změny" : "Uložit a přidat fotky"}</button>
        {saved && <span role="status" className="text-sm text-[var(--color-good)]">Uloženo.</span>}
        {error && <span role="alert" className="text-sm text-[var(--color-warn)]">{error}</span>}
      </div>
    </form>
  );
}
