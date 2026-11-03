"use client";

import { useRef, useState } from "react";
import { Markup } from "@/lib/markup";

// A text area with formatting buttons and a preview, for logbook entries, car stories and articles.
// The buttons only insert the marks lib/markup understands (**tučně**, *kurzíva*, ## nadpis, lists,
// quotes, links), so what is stored stays plain, readable text.

type Wrap = { before: string; after?: string; line?: boolean; placeholder: string };

const ACTIONS: { label: string; title: string; wrap: Wrap; className?: string }[] = [
  { label: "B", title: "Tučně (Ctrl+B)", wrap: { before: "**", after: "**", placeholder: "tučný text" }, className: "font-extrabold" },
  { label: "I", title: "Kurzíva (Ctrl+I)", wrap: { before: "*", after: "*", placeholder: "kurzíva" }, className: "italic" },
  { label: "Nadpis", title: "Nadpis", wrap: { before: "## ", line: true, placeholder: "Nadpis" } },
  { label: "• Seznam", title: "Odrážky", wrap: { before: "- ", line: true, placeholder: "položka" } },
  { label: "1. Seznam", title: "Číslovaný seznam", wrap: { before: "1. ", line: true, placeholder: "první krok" } },
  { label: "❝ Citace", title: "Citace", wrap: { before: "> ", line: true, placeholder: "citace" } },
];

export function RichTextEditor({
  id,
  value,
  onChange,
  maxLength,
  placeholder,
  minHeight = "min-h-64",
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  minHeight?: string;
}) {
  const area = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);

  /** Puts marks around the selection (or a placeholder), or at the start of each selected line. */
  function apply({ before, after = "", line, placeholder: hint }: Wrap) {
    const el = area.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);
    let next: string;
    let selStart: number;
    let selEnd: number;
    if (line) {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const block = value.slice(lineStart, end) || hint;
      const marked = block
        .split("\n")
        .map((l, i) => (before === "1. " ? `${i + 1}. ` : before) + l.replace(/^(#{2,3}\s|[-*•]\s|\d+[.)]\s|>\s?)/, ""))
        .join("\n");
      // a block of its own: an empty line before it unless it starts the text
      const gap = lineStart > 0 && value[lineStart - 2] !== "\n" ? "\n" : "";
      next = value.slice(0, lineStart) + gap + marked + value.slice(Math.max(end, lineStart));
      selStart = lineStart + gap.length;
      selEnd = selStart + marked.length;
    } else {
      const text = selected || hint;
      next = value.slice(0, start) + before + text + after + value.slice(end);
      selStart = start + before.length;
      selEnd = selStart + text.length;
    }
    if (maxLength && next.length > maxLength) return;
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(selStart, selEnd);
    });
  }

  function link() {
    const el = area.current;
    if (!el) return;
    const url = window.prompt("Adresa odkazu (https://…)", "https://");
    if (!url || !/^(https?:\/\/\S+|\/\S*)$/.test(url.trim())) return;
    const label = value.slice(el.selectionStart, el.selectionEnd) || "odkaz";
    const md = `[${label}](${url.trim()})`;
    const next = value.slice(0, el.selectionStart) + md + value.slice(el.selectionEnd);
    if (maxLength && next.length > maxLength) return;
    const at = el.selectionStart;
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(at + 1, at + 1 + label.length);
    });
  }

  return (
    <div className="rounded-[10px] bg-[var(--color-field)]">
      <div role="toolbar" aria-label="Formátování textu" className="flex flex-wrap items-center gap-1 p-1.5">
        {ACTIONS.map((a) => (
          <button key={a.label} type="button" title={a.title} disabled={preview} className={`rounded-md px-2.5 py-1 text-sm hover:bg-[var(--color-surface)] disabled:opacity-40 ${a.className ?? ""}`} onClick={() => apply(a.wrap)}>
            {a.label}
          </button>
        ))}
        <button type="button" title="Odkaz" disabled={preview} className="rounded-md px-2.5 py-1 text-sm hover:bg-[var(--color-surface)] disabled:opacity-40" onClick={link}>
          Odkaz
        </button>
        <span className="ml-auto" />
        <button type="button" className="rounded-md px-2.5 py-1 text-sm font-semibold hover:bg-[var(--color-surface)]" aria-pressed={preview} onClick={() => setPreview((p) => !p)}>
          {preview ? "Upravit" : "Náhled"}
        </button>
      </div>
      {preview ? (
        <div className={`${minHeight} rounded-b-[10px] bg-[var(--color-surface)] p-3 text-base leading-relaxed`}>
          {value.trim() ? <Markup text={value} /> : <p className="text-[var(--color-muted)]">Zatím prázdné.</p>}
        </div>
      ) : (
        <textarea
          ref={area}
          id={id}
          className={`input ${minHeight} !rounded-t-none`}
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (!(e.ctrlKey || e.metaKey)) return;
            if (e.key.toLowerCase() === "b") (e.preventDefault(), apply(ACTIONS[0].wrap));
            if (e.key.toLowerCase() === "i") (e.preventDefault(), apply(ACTIONS[1].wrap));
          }}
        />
      )}
      <p className="px-3 py-1.5 text-xs text-[var(--color-muted)]">
        **tučně**, *kurzíva*, ## nadpis, - odrážky, &gt; citace, [odkaz](https://…). Odstavce oddělte prázdným řádkem.
      </p>
    </div>
  );
}
