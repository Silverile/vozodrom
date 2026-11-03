"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type CatalogOp, type EditRow, type Path, type StoredOp, applyOps, getAt, identityOf, rowToOp, same } from "@/lib/catalog-ops";
import type { CardGeneration, ModelCard } from "@/lib/modelCards";
import { DrawingField } from "./DrawingField";
import { FIELDS, OPTIONAL_FIELDS, OPTIONAL_GENERATION_FIELDS, kindOf, labelOf, newGeneration } from "./fields";

// The catalogue editor, opened from a model page by an admin. It loads the card as the data files
// have it and the line's saved edits (/api/admin/katalog), shows the card with them, and turns every
// change into an operation (lib/catalog-ops). Changes wait in the panel until "Uložit"; the page
// itself shows them after "Publikovat na web" (a deploy rebuilds the static catalogue).

type Emit = (op: CatalogOp) => void;
type Row = EditRow & { id: string; createdAt: string };

/** Nullable object fields: what "Doplnit" puts in. */
const OBJECT_TEMPLATES: Record<string, () => unknown> = {
  dimensionsMm: () => ({ length: null, width: null, height: null, wheelbase: null }),
  engine: () => ({ fuel: "petrol", displacementCc: null, powerKw: null, torqueNm: null }),
  transmission: () => ({ type: "manual", gears: null }),
  massRangeKg: () => ({ min: 0, max: 0 }),
  photo: () => ({ url: "", page: "", credit: "", licence: "", licenceUrl: null }),
};
const HIDDEN = new Set(["sources", "availabilityEvidence"]);

const short = (v: unknown) => {
  const text = typeof v === "string" ? v : JSON.stringify(v);
  return text.length > 60 ? `${text.slice(0, 57)}…` : text;
};

function pathLabel(path: Path): string {
  return path
    .map((k, i) => (path[i - 1] === "generations" && typeof k === "number" ? `${k + 1}. generace` : k === "generations" ? null : labelOf(k)))
    .filter(Boolean)
    .join(" › ");
}

export function describeOp(op: CatalogOp): string {
  switch (op.op) {
    case "set":
      return `${pathLabel(op.path)}: ${short(op.value)}`;
    case "reset":
      return `${pathLabel(op.path)}: vráceno na data katalogu`;
    case "insert":
      return op.path.length === 2 && op.path[0] === "generations"
        ? `Přidána generace ${(op.value as CardGeneration).name || (op.value as CardGeneration).code || ""} na ${(op.path[1] as number) + 1}. místo`
        : `${pathLabel(op.path.slice(0, -1))}: přidána položka`;
    case "remove":
      return op.path.length === 2 && op.path[0] === "generations" ? `Smazána ${(op.path[1] as number) + 1}. generace` : `${pathLabel(op.path)}: smazáno`;
    case "move":
      return `${pathLabel(op.path) || "Generace"}: přesun z ${op.from + 1}. na ${op.to + 1}. místo`;
    case "drawing":
      return `${op.index + 1}. generace: ${op.src ? "nový nákres" : "bez nákresu"}`;
  }
}

// ---------------------------------------------------------------------------------------------
// One field

function Primitive({ path, keyName, parentKey, value, emit }: { path: Path; keyName: string | number; parentKey?: string; value: unknown; emit: Emit }) {
  const kind = kindOf(keyName, value, parentKey);
  const spec = typeof keyName === "string" ? FIELDS[keyName] : parentKey ? undefined : undefined;
  const options = typeof keyName === "number" && parentKey ? FIELDS[parentKey]?.itemOptions : spec?.options;
  const shown = value === null || value === undefined ? "" : String(value);
  const [draft, setDraft] = useState(shown);
  useEffect(() => setDraft(shown), [shown]);

  const commit = (raw: string) => {
    let next: unknown = raw;
    if (kind === "number" || kind === "year") {
      if (raw.trim() === "") next = null;
      else {
        const n = Number(raw.replace(",", "."));
        if (!Number.isFinite(n)) return setDraft(shown);
        next = n;
      }
    } else if (raw === "" && value === null) next = null;
    if (!same(next, value)) emit({ op: "set", path, value: next, expect: value ?? null });
  };

  const id = `f-${path.join("-")}`;
  if (kind === "bool")
    return <input id={id} type="checkbox" checked={value === true} onChange={(e) => emit({ op: "set", path, value: e.target.checked, expect: value ?? null })} />;
  if (kind === "enum" && options) {
    const known = shown in options;
    return (
      <select id={id} className="input !py-1.5" value={shown} onChange={(e) => commit(e.target.value)}>
        <option value="">—</option>
        {!known && shown && <option value={shown}>{shown}</option>}
        {Object.entries(options).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
    );
  }
  if (kind === "long")
    return <textarea id={id} className="input min-h-24" value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={() => commit(draft)} />;
  return (
    <input
      id={id}
      className="input !py-1.5"
      inputMode={kind === "number" || kind === "year" ? "decimal" : undefined}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => commit(draft)}
      onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
    />
  );
}

/** A field or a whole subtree: objects as groups of fields, arrays as lists with add, move and remove. */
function Node({ path, keyName, parentKey, value, baseValue, emit, depth }: { path: Path; keyName: string | number; parentKey?: string; value: unknown; baseValue: unknown; emit: Emit; depth: number }) {
  const changed = !same(value, baseValue);
  const name = typeof keyName === "string" ? keyName : parentKey;
  const label = labelOf(keyName);
  const reset = changed && baseValue !== undefined ? (
    <button type="button" className="text-xs text-[var(--color-brand)] hover:underline" title="Vrátit hodnotu z dat katalogu" onClick={() => emit({ op: "reset", path })}>
      ↺ původní
    </button>
  ) : null;
  const mark = changed ? <span className="ml-1 inline-block h-2 w-2 rounded-full bg-[var(--color-accent)] align-middle" title="Upraveno" /> : null;

  if (Array.isArray(value)) {
    const spec = typeof keyName === "string" ? FIELDS[keyName] : undefined;
    const add = () => {
      const fresh = spec?.item ? spec.item() : value.length ? blank(value[value.length - 1]) : "";
      emit({ op: "insert", path: [...path, value.length], value: fresh });
    };
    return (
      <fieldset className={`rounded-[10px] ${depth ? "bg-[var(--color-field)]/40" : ""} p-2`}>
        <legend className="px-1 text-sm font-semibold">{label}{mark} <span className="font-normal text-[var(--color-muted)]">{value.length}</span> {reset}</legend>
        <ol className="space-y-2">
          {value.map((item, i) => (
            <li key={i} className="flex gap-2 items-start">
              <div className="min-w-0 flex-1">
                <Node path={[...path, i]} keyName={i} parentKey={name} value={item} baseValue={Array.isArray(baseValue) ? baseValue[i] : undefined} emit={emit} depth={depth + 1} />
              </div>
              <span className="flex shrink-0 gap-1 pt-1">
                <button type="button" className="pill !px-2 !py-0.5 text-xs" disabled={i === 0} title="Nahoru" onClick={() => emit({ op: "move", path, from: i, to: i - 1, expect: item })}>↑</button>
                <button type="button" className="pill !px-2 !py-0.5 text-xs" disabled={i === value.length - 1} title="Dolů" onClick={() => emit({ op: "move", path, from: i, to: i + 1, expect: item })}>↓</button>
                <button type="button" className="pill !px-2 !py-0.5 text-xs text-[var(--color-warn)]" title="Smazat" onClick={() => emit({ op: "remove", path: [...path, i], expect: item })}>✕</button>
              </span>
            </li>
          ))}
        </ol>
        <button type="button" className="mt-2 text-sm text-[var(--color-brand)] hover:underline" onClick={add}>+ Přidat</button>
      </fieldset>
    );
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).filter(([k]) => !HIDDEN.has(k));
    return (
      <fieldset className="rounded-[10px] border border-[var(--color-line)] p-2">
        {typeof keyName === "string" && <legend className="px-1 text-sm font-semibold">{label}{mark} {reset}</legend>}
        <div className="grid gap-2 sm:grid-cols-2">
          {entries.map(([k, v]) => {
            const wide = Array.isArray(v) || (v !== null && typeof v === "object") || kindOf(k, v) === "long";
            return (
              <div key={k} className={wide ? "sm:col-span-2" : ""}>
                <Node path={[...path, k]} keyName={k} value={v} baseValue={getAt(baseValue, [k])} emit={emit} depth={depth + 1} />
              </div>
            );
          })}
        </div>
        {(() => {
          const context = typeof keyName === "number" ? parentKey : keyName;
          const missing = Object.keys((context && OPTIONAL_FIELDS[context]) ?? {}).filter((k) => !(k in (value as object)));
          return missing.length ? (
            <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[var(--color-muted)]">Přidat pole:</span>
              {missing.map((k) => (
                <button key={k} type="button" className="pill !px-2 !py-0.5 text-xs" onClick={() => emit({ op: "set", path: [...path, k], value: OPTIONAL_FIELDS[context!][k](), expect: null })}>
                  {labelOf(k)}
                </button>
              ))}
            </p>
          ) : null;
        })()}
        {typeof keyName === "number" && reset && <p className="mt-1">{reset}</p>}
      </fieldset>
    );
  }

  // null object field: offer to fill it in
  if (value === null && typeof keyName === "string" && OBJECT_TEMPLATES[keyName]) {
    return (
      <div className="text-sm">
        <span className="font-semibold">{label}</span>{mark}{" "}
        <button type="button" className="text-[var(--color-brand)] hover:underline" onClick={() => emit({ op: "set", path, value: OBJECT_TEMPLATES[keyName](), expect: null })}>+ Doplnit</button> {reset}
      </div>
    );
  }

  return (
    <label className="block text-sm" htmlFor={`f-${path.join("-")}`}>
      <span className="flex items-center gap-2"><span>{typeof keyName === "number" ? label : label}{mark}</span>{reset}</span>
      <span className="mt-0.5 block"><Primitive path={path} keyName={keyName} parentKey={parentKey} value={value} emit={emit} /></span>
    </label>
  );
}

/** A copy of an item with its plain values emptied, as a template for a new one. */
function blank(item: unknown): unknown {
  if (Array.isArray(item)) return [];
  if (item && typeof item === "object") return Object.fromEntries(Object.entries(item).map(([k, v]) => [k, blank(v)]));
  return typeof item === "boolean" ? false : typeof item === "string" ? "" : null;
}

// ---------------------------------------------------------------------------------------------
// A generation

function GenerationEditor({
  index,
  count,
  gen,
  baseGen,
  drawing,
  open,
  setOpen,
  emit,
  makeSlug,
  lineSlug,
}: {
  index: number;
  count: number;
  gen: CardGeneration;
  baseGen: CardGeneration | undefined;
  drawing: string | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  emit: Emit;
  makeSlug: string;
  lineSlug: string;
}) {
  const path: Path = ["generations", index];
  const missing = Object.keys(OPTIONAL_GENERATION_FIELDS).filter((k) => !(k in gen));
  const title = gen.name || gen.code || `${index + 1}. generace`;
  const years = [gen.from ?? "?", gen.current ? "dosud" : (gen.to ?? "?")].join("–");
  const identity = identityOf(gen);
  return (
    <section id={`editor-g${index}`} className="rounded-[14px] bg-[var(--color-surface)] scroll-mt-4">
      <header className="flex flex-wrap items-center gap-2 p-3">
        <button type="button" className="min-w-0 flex-1 text-left" onClick={() => setOpen(!open)} aria-expanded={open}>
          <span className="font-bold">{index + 1}. {title}</span> <span className="text-sm text-[var(--color-muted)]">{years}{baseGen ? "" : " · nová"}</span>
        </button>
        <button type="button" className="pill !px-2 !py-1 text-xs" disabled={index === 0} title="Posunout dřív" onClick={() => emit({ op: "move", path: ["generations"], from: index, to: index - 1, expect: gen })}>↑</button>
        <button type="button" className="pill !px-2 !py-1 text-xs" disabled={index === count - 1} title="Posunout později" onClick={() => emit({ op: "move", path: ["generations"], from: index, to: index + 1, expect: gen })}>↓</button>
        <button type="button" className="pill !px-2 !py-1 text-xs" title="Přidat generaci za tuto" onClick={() => emit({ op: "insert", path: ["generations", index + 1], value: newGeneration(gen.to) })}>+ za</button>
        <button
          type="button"
          className="pill !px-2 !py-1 text-xs text-[var(--color-warn)]"
          onClick={() => window.confirm(`Smazat generaci ${title}? Smaže se i s nákresem; vrátit to jde smazáním úpravy v historii.`) && emit({ op: "remove", path, expect: gen })}
        >
          Smazat
        </button>
      </header>
      {open && (
        <div className="space-y-3 px-3 pb-4">
          <DrawingField
            makeSlug={makeSlug}
            lineSlug={lineSlug}
            current={drawing}
            title={title}
            onUploaded={(src) => emit({ op: "drawing", index, src, expect: identity })}
            onRemove={() => emit({ op: "drawing", index, src: null, expect: identity })}
          />
          <Node path={path} keyName={index} value={gen} baseValue={baseGen} emit={emit} depth={0} />
          {missing.length > 0 && (
            <p className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-[var(--color-muted)]">Přidat pole:</span>
              {missing.map((k) => (
                <button key={k} type="button" className="pill !px-2 !py-0.5 text-xs" onClick={() => emit({ op: "set", path: [...path, k], value: OPTIONAL_GENERATION_FIELDS[k](), expect: null })}>
                  {labelOf(k)}
                </button>
              ))}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------------------------
// The panel

export default function CatalogEditorPanel({
  makeSlug,
  lineSlug,
  title,
  focus,
  dataDrawing,
  onClose,
}: {
  makeSlug: string;
  lineSlug: string;
  title: string;
  /** generation to open first, or null */
  focus: number | null;
  /** site path of the data files' drawing of a generation (by its index there), or null */
  dataDrawing: (index: number) => string | null;
  onClose: () => void;
}) {
  const [base, setBase] = useState<ModelCard | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [pending, setPending] = useState<CatalogOp[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState<Set<number>>(() => new Set(focus === null ? [] : [focus]));
  const [tab, setTab] = useState<"karta" | "historie">("karta");
  const dirty = useRef(false);
  dirty.current = pending.length > 0;

  const load = useCallback(async () => {
    setError("");
    try {
      const r = await fetch(`/api/admin/katalog/?znacka=${makeSlug}&model=${lineSlug}`);
      const data = (await r.json().catch(() => ({}))) as { base?: ModelCard; rows?: Row[]; error?: string };
      if (!r.ok || !data.base) return setError(data.error ?? "Editor se nepodařilo načíst.");
      setBase(data.base);
      setRows(data.rows ?? []);
    } catch {
      setError("Editor se nepodařilo načíst (spojení). Zavřete ho a otevřete znovu.");
    }
  }, [makeSlug, lineSlug]);
  useEffect(() => void load(), [load]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  useEffect(() => {
    if (focus !== null) document.getElementById(`editor-g${focus}`)?.scrollIntoView({ block: "start" });
  }, [focus, base]);

  const saved: StoredOp[] = useMemo(() => rows.map((r, n) => rowToOp(r, n)).filter((o): o is StoredOp => o !== null), [rows]);
  const view = useMemo(() => {
    if (!base) return null;
    const fresh = pending.map((op, n) => ({ id: `new-${n}`, makeSlug, lineSlug, op, createdAt: "" }));
    return applyOps(base, [...saved, ...fresh]);
  }, [base, saved, pending, makeSlug, lineSlug]);

  // an operation that does not apply to what the editor shows is refused at once, not at saving;
  // one inside a generation carries the generation's identity, so it keeps to that generation
  const emit: Emit = useCallback(
    (raw) => {
      if (!base || !view) return;
      const op: CatalogOp =
        raw.op !== "drawing" && raw.path[0] === "generations" && typeof raw.path[1] === "number" && raw.path.length > 1
          ? { ...raw, gen: identityOf(view.card.generations[raw.path[1]]) }
          : raw;
      const fresh = [...pending, op].map((o, n) => ({ id: `new-${n}`, makeSlug, lineSlug, op: o, createdAt: "" }));
      const check = applyOps(base, [...saved, ...fresh]);
      const bad = check.conflicts.find((c) => c.id === `new-${pending.length}`);
      if (bad) return setError(`Tuto změnu nelze provést: ${bad.reason}.`);
      setError("");
      setNotice("");
      setPending((p) => [...p, op]);
    },
    [base, view, pending, saved, makeSlug, lineSlug],
  );

  async function save() {
    // what this save sends; changes made while it is on its way stay pending
    const sent = pending;
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/admin/katalog/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ makeSlug, lineSlug, ops: sent }),
      });
      const data = (await r.json().catch(() => ({}))) as { rows?: Row[]; error?: string };
      if (!r.ok || !data.rows) return setError(data.error ?? "Uložení se nepovedlo.");
      setRows(data.rows);
      setPending((p) => p.slice(sent.length));
      setNotice("Uloženo. Na webu se změny objeví po „Publikovat na web“ a dokončení nasazení.");
    } catch {
      setError("Uložení se nepovedlo (spojení). Změny zůstaly v editoru, zkuste to znovu.");
    } finally {
      setBusy(false);
    }
  }

  async function removeRow(id: string) {
    if (!window.confirm("Smazat tuto úpravu z historie? Pozdější úpravy, které na ní stojí, se pak nemusí dát použít.")) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/katalog/?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!r.ok) return setError(((await r.json().catch(() => ({}))) as { error?: string }).error ?? "Smazání se nepovedlo.");
      await load();
    } catch {
      setError("Smazání se nepovedlo (spojení), zkuste to znovu.");
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (pending.length && !window.confirm("Máte neuložené změny; publikují se jen uložené. Pokračovat?")) return;
    setBusy(true);
    try {
      const r = await fetch("/api/admin/katalog/publikovat/", { method: "POST" });
      if (!r.ok) return setError(((await r.json().catch(() => ({}))) as { error?: string }).error ?? "Publikování se nepovedlo.");
      setNotice("Nasazení spuštěno. Změny se na webu objeví po jeho úspěšném dokončení (asi 5–7 minut).");
    } catch {
      setError("Publikování se nepovedlo (spojení), zkuste to znovu.");
    } finally {
      setBusy(false);
    }
  }

  function close() {
    if (pending.length && !window.confirm(`Zavřít a zahodit ${pending.length} neuložených změn?`)) return;
    onClose();
  }

  const conflicts = view?.conflicts.filter((c) => !c.id.startsWith("new-")) ?? [];
  const toggle = (i: number) => (on: boolean) => setOpen((s) => {
    const next = new Set(s);
    if (on) next.add(i);
    else next.delete(i);
    return next;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" role="dialog" aria-modal="true" aria-label={`Úpravy katalogu: ${title}`}>
      <div className="flex h-full w-full max-w-3xl flex-col bg-[var(--color-bg)] shadow-2xl">
        <header className="flex flex-wrap items-center gap-2 border-b border-[var(--color-line)] p-3">
          <h2 className="min-w-0 basis-full truncate text-lg font-bold sm:basis-0 sm:flex-1">Upravit: {title}</h2>
          <button type="button" className="btn-cta !py-1.5 text-sm disabled:opacity-50" disabled={busy || !pending.length} onClick={save}>
            Uložit{pending.length ? ` (${pending.length})` : ""}
          </button>
          <button type="button" className="pill text-sm" disabled={busy || !pending.length} onClick={() => setPending((p) => p.slice(0, -1))} title="Vrátit poslední neuloženou změnu">↶ Zpět</button>
          <button type="button" className="pill text-sm" disabled={busy} onClick={publish}>Publikovat na web</button>
          <button type="button" className="pill text-sm" onClick={close} aria-label="Zavřít">✕</button>
        </header>
        <nav className="flex gap-1 px-3 pt-2 text-sm">
          {(["karta", "historie"] as const).map((t) => (
            <button key={t} type="button" className="pill !py-1" data-on={tab === t} onClick={() => setTab(t)}>
              {t === "karta" ? "Karta modelu" : `Historie úprav (${rows.length})`}
            </button>
          ))}
        </nav>
        {(error || notice || conflicts.length > 0) && (
          <div className="space-y-1 px-3 pt-2 text-sm">
            {error && <p role="alert" className="text-[var(--color-warn)]">{error}</p>}
            {notice && <p role="status" className="text-[var(--color-good)]">{notice}</p>}
            {conflicts.length > 0 && (
              <p className="text-[var(--color-warn)]">
                {conflicts.length} uložených úprav se už nedá použít (data katalogu se mezitím změnila); najdete je v historii.
              </p>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3">
          {!view ? (
            <p className="text-[var(--color-muted)]">{error ? "" : "Načítám…"}</p>
          ) : tab === "historie" ? (
            <ol className="space-y-2 text-sm">
              {rows.length === 0 && <li className="text-[var(--color-muted)]">Zatím žádné uložené úpravy.</li>}
              {[...rows].reverse().map((r) => {
                const op = rowToOp(r);
                const conflict = conflicts.find((c) => c.id === r.id);
                return (
                  <li key={r.id} className="flex items-start gap-2 rounded-[10px] bg-[var(--color-surface)] p-2">
                    <span className="min-w-0 flex-1">
                      {op ? describeOp(op.op) : `${r.field}: ${short(r.value)}`}
                      <span className="block text-xs text-[var(--color-muted)]">{new Date(r.createdAt).toLocaleString("cs-CZ")}{conflict && <b className="text-[var(--color-warn)]"> · nedá se použít: {conflict.reason}</b>}</span>
                    </span>
                    <button type="button" className="pill !px-2 !py-0.5 text-xs text-[var(--color-warn)]" disabled={busy} onClick={() => removeRow(r.id)}>Smazat</button>
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="space-y-4">
              <section className="rounded-[14px] bg-[var(--color-surface)] p-3 space-y-2">
                <h3 className="font-bold">Model</h3>
                {Object.entries(view.card)
                  .filter(([k]) => k !== "generations" && !HIDDEN.has(k))
                  .map(([k, v]) => (
                    <Node key={k} path={[k]} keyName={k} value={v} baseValue={base ? getAt(base, [k]) : undefined} emit={emit} depth={0} />
                  ))}
              </section>
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Generace <span className="font-normal text-[var(--color-muted)]">{view.card.generations.length}</span></h3>
                <button type="button" className="pill text-sm" onClick={() => emit({ op: "insert", path: ["generations", 0], value: newGeneration() })}>+ Přidat na začátek</button>
              </div>
              {view.card.generations.map((g, i) => {
                const origin = view.origins[i];
                const set = view.drawings[i];
                const drawing = typeof set === "string" ? set : set === null ? null : origin === null ? null : dataDrawing(origin);
                return (
                  <GenerationEditor
                    key={`${origin ?? "n"}-${i}`}
                    index={i}
                    count={view.card.generations.length}
                    gen={g}
                    baseGen={origin === null || !base ? undefined : base.generations[origin]}
                    drawing={drawing}
                    open={open.has(i)}
                    setOpen={toggle(i)}
                    emit={emit}
                    makeSlug={makeSlug}
                    lineSlug={lineSlug}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
