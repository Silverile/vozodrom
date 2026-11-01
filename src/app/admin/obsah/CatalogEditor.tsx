"use client";

import { useState } from "react";

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
