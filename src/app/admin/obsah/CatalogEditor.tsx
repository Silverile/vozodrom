"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CATALOG_EDIT_FIELDS, type CardTexts, type CatalogEdit, type CatalogEditField } from "@/lib/catalog-edits";

// One editable catalogue text: shows the catalogue's own value, saves a correction at once (it
// reaches the public page with the next deploy). An empty field returns to the catalogue's text.

export function EditField({ makeSlug, lineSlug, genIndex, field, label, source, current, long }: {
  makeSlug: string;
  lineSlug: string;
  genIndex: number | null;
  field: string;
  label: string;
  source: string;
  current: string | null;
  long: boolean;
}) {
  const [value, setValue] = useState(current ?? source);
  const [saved, setSaved] = useState(current ?? source);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const id = `e-${genIndex ?? "l"}-${field}`;
  const changed = value !== saved;

  async function save(next: string) {
    setBusy(true);
    setError("");
    const response = await fetch("/api/admin/katalog/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ makeSlug, lineSlug, genIndex, field, value: next === source ? "" : next }),
    });
    setBusy(false);
    if (!response.ok) return setError(((await response.json().catch(() => ({}))) as { error?: string }).error ?? "Uložení se nepovedlo.");
    setValue(next);
    setSaved(next);
  }

  return (
    <div className="text-sm space-y-1">
      <label htmlFor={id} className="font-medium">{label}</label>
      {long ? (
        <textarea id={id} className="input min-h-28" value={value} onChange={(e) => setValue(e.target.value)} />
      ) : (
        <input id={id} className="input" value={value} onChange={(e) => setValue(e.target.value)} />
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="pill" disabled={busy || !changed} onClick={() => save(value)}>Uložit</button>
        {saved !== source && (
          <button type="button" className="text-xs text-[var(--color-muted)] hover:text-[var(--color-warn)]" disabled={busy} onClick={() => save(source)}>
            Vrátit text katalogu
          </button>
        )}
        {saved !== source && !changed && <span className="chip bg-[var(--color-brand-soft)] text-[var(--color-brand)]">upraveno</span>}
        {error && <span role="alert" className="text-xs text-[var(--color-warn)]">{error}</span>}
      </div>
    </div>
  );
}

export function PublishButton() {
  const [state, setState] = useState<"" | "busy" | "done">("");
  const [error, setError] = useState("");
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        className="btn-cta text-sm"
        disabled={state === "busy"}
        onClick={async () => {
          setState("busy");
          setError("");
          const response = await fetch("/api/admin/katalog/publikovat/", { method: "POST" });
          if (response.ok) return setState("done");
          setState("");
          setError(((await response.json().catch(() => ({}))) as { error?: string }).error ?? "Nasazení se nepodařilo spustit.");
        }}
      >
        Publikovat na web
      </button>
      {state === "done" && <span role="status" className="text-sm text-[var(--color-good)]">Nasazení spuštěno, změny budou na webu asi za 5–7 minut.</span>}
      {error && <span role="alert" className="text-sm text-[var(--color-warn)]">{error}</span>}
    </div>
  );
}

/** The editable texts of one model line: its description, then each generation's name and note. */
export function CatalogTexts({ makeSlug, lineSlug, makeName, edits }: { makeSlug: string; lineSlug: string; makeName: string; edits: CatalogEdit[] }) {
  const [card, setCard] = useState<CardTexts | null | undefined>(undefined);
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/katalog/${makeSlug}/${lineSlug}/?texty=1`)
      .then((r): Promise<{ card: CardTexts | null }> | { card: null } => (r.ok ? r.json() : { card: null }))
      .then((data) => !cancelled && setCard(data.card))
      .catch(() => !cancelled && setCard(null));
    return () => {
      cancelled = true;
    };
  }, [makeSlug, lineSlug]);
  if (card === undefined) return <p className="text-sm text-[var(--color-muted)]">Načítám…</p>;
  if (card === null) return <div className="card p-6 text-sm text-[var(--color-muted)]">Tento model nemá v katalogu kartu s generacemi.</div>;

  const field = (genIndex: number | null, name: CatalogEditField, source: string | null) => (
    <EditField
      key={`${genIndex}-${name}`}
      makeSlug={makeSlug}
      lineSlug={lineSlug}
      genIndex={genIndex}
      field={name}
      label={CATALOG_EDIT_FIELDS[name].label}
      source={source ?? ""}
      current={edits.find((e) => e.genIndex === genIndex && e.field === name)?.value || null}
      long={CATALOG_EDIT_FIELDS[name].long}
    />
  );
  return (
    <>
      <section className="card p-5 space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-bold text-lg">{makeName} {card.name}</h2>
          <Link href={`/katalog/${makeSlug}/${lineSlug}/`} className="text-sm text-[var(--color-brand)] hover:underline">Stránka v katalogu →</Link>
        </div>
        {field(null, "summary", card.summary)}
      </section>
      {card.generations.map((g, i) => (
        <section key={i} className="card p-5 space-y-4">
          <h2 className="font-bold">{i + 1}. generace{g.code ? ` · ${g.code}` : ""}{g.from ? ` · ${g.from}–${g.to ?? "dosud"}` : ""}</h2>
          {field(i, "name", g.name)}
          {field(i, "dateNote", g.dateNote)}
        </section>
      ))}
    </>
  );
}
