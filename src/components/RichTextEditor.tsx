"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toDom, toMarkup } from "@/lib/markup-dom";

// The visual text editor for logbook entries, car stories and articles: what you format is what you
// see. It edits HTML in the page (contentEditable) through the browser's own editing commands, so
// Ctrl+Z / Ctrl+Y undo and redo every step, and a button pressed again takes its format off. Each
// change is turned into the stored text (lib/markup-dom → lib/markup's Markdown subset), which drops
// anything the subset cannot say; pasted content arrives as plain text. Pictures (articles) go
// through onImage, which uploads one and answers its address.

type State = { bold: boolean; italic: boolean; h2: boolean; ul: boolean; ol: boolean; quote: boolean; link: boolean };
const NONE: State = { bold: false, italic: false, h2: false, ul: false, ol: false, quote: false, link: false };

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function RichTextEditor({
  id,
  value,
  onChange,
  maxLength,
  placeholder,
  minHeight = "min-h-64",
  onImage,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  minHeight?: string;
  /** uploads a picture and answers its site address, or null when it failed (the editor shows why) */
  onImage?: (file: File) => Promise<{ src: string } | { error: string }>;
}) {
  const box = useRef<HTMLDivElement>(null);
  const emitted = useRef<string | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<State>(NONE);
  const [length, setLength] = useState(value.length);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  // the content is built from the text once, and again only when the text changes from outside
  useEffect(() => {
    const el = box.current;
    if (!el || value === emitted.current) return;
    el.replaceChildren(toDom(value, document));
    emitted.current = value;
    setLength(value.length);
  }, [value]);

  const emit = useCallback(() => {
    const el = box.current;
    if (!el) return;
    const md = toMarkup(el);
    emitted.current = md;
    setLength(md.length);
    onChange(md);
  }, [onChange]);

  /** Element of the selection, and the block it is in. */
  const at = () => {
    const sel = window.getSelection();
    const el = box.current;
    if (!sel || !sel.rangeCount || !el || !el.contains(sel.anchorNode)) return null;
    const node: Node | null = sel.anchorNode;
    const up = (tag: string) => {
      for (let n = node; n && n !== el; n = n.parentNode) if (n.nodeName === tag) return n as HTMLElement;
      return null;
    };
    return { up };
  };

  const refresh = useCallback(() => {
    const where = at();
    if (!where) return;
    setState({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      ul: document.queryCommandState("insertUnorderedList"),
      ol: document.queryCommandState("insertOrderedList"),
      h2: !!where.up("H2") || !!where.up("H3"),
      quote: !!where.up("BLOCKQUOTE"),
      link: !!where.up("A"),
    });
  }, []);

  useEffect(() => {
    document.execCommand("defaultParagraphSeparator", false, "p");
    document.addEventListener("selectionchange", refresh);
    return () => document.removeEventListener("selectionchange", refresh);
  }, [refresh]);

  function run(command: string, arg?: string) {
    box.current?.focus();
    document.execCommand(command, false, arg);
    emit();
    refresh();
  }

  const ACTIONS: { key: keyof State | "image"; label: string; title: string; className?: string; act: () => void }[] = [
    { key: "bold", label: "B", title: "Tučně (Ctrl+B)", className: "font-extrabold", act: () => run("bold") },
    { key: "italic", label: "I", title: "Kurzíva (Ctrl+I)", className: "italic font-serif", act: () => run("italic") },
    { key: "h2", label: "Nadpis", title: "Nadpis (znovu = obyčejný text)", act: () => run("formatBlock", state.h2 ? "<p>" : "<h2>") },
    { key: "ul", label: "• Seznam", title: "Odrážky", act: () => run("insertUnorderedList") },
    { key: "ol", label: "1. Seznam", title: "Číslovaný seznam", act: () => run("insertOrderedList") },
    { key: "quote", label: "❝ Citace", title: "Citace (znovu = obyčejný text)", act: () => (state.quote ? run("outdent") : run("formatBlock", "<blockquote>")) },
    {
      key: "link",
      label: "Odkaz",
      title: "Odkaz (znovu = zrušit odkaz)",
      act: () => {
        if (state.link) return run("unlink");
        const sel = window.getSelection();
        const url = window.prompt("Adresa odkazu (https://… nebo /stránka/)", "https://");
        if (!url || !/^(https?:\/\/\S+|\/\S*)$/.test(url.trim())) return;
        if (sel && !sel.isCollapsed) run("createLink", url.trim());
        else run("insertHTML", `<a href="${escapeHtml(url.trim())}">${escapeHtml(url.trim().replace(/^https?:\/\/(www\.)?/, ""))}</a>&nbsp;`);
      },
    },
  ];

  async function addImages(files: File[]) {
    if (!onImage) return;
    for (const f of files.filter((x) => x.type.startsWith("image/"))) {
      setBusy("Nahrávám fotku…");
      setError("");
      try {
        const result = await onImage(f);
        if ("error" in result) {
          setError(result.error);
          continue;
        }
        const alt = window.prompt("Popisek fotky (nepovinný):", "") ?? "";
        run("insertHTML", `<p><img src="${escapeHtml(result.src)}" alt="${escapeHtml(alt.trim())}"></p><p><br></p>`);
      } catch {
        setError("Fotku se nepodařilo nahrát, zkuste to znovu.");
      } finally {
        setBusy("");
      }
    }
  }

  const over = maxLength !== undefined && length > maxLength;
  return (
    <div className="rounded-[10px] bg-[var(--color-field)]">
      <div role="toolbar" aria-label="Formátování textu" aria-controls={id} className="flex flex-wrap items-center gap-1 p-1.5">
        {ACTIONS.map((a) => (
          <button
            key={a.key}
            type="button"
            title={a.title}
            aria-pressed={a.key !== "image" ? state[a.key] : undefined}
            className={`rounded-md px-2.5 py-1 text-sm hover:bg-[var(--color-surface)] aria-pressed:bg-[var(--color-brand)] aria-pressed:text-[var(--color-brand-ink)] ${a.className ?? ""}`}
            // keep the selection in the text while the button is pressed
            onMouseDown={(e) => e.preventDefault()}
            onClick={a.act}
          >
            {a.label}
          </button>
        ))}
        {onImage && (
          <>
            <button type="button" className="rounded-md px-2.5 py-1 text-sm hover:bg-[var(--color-surface)]" onMouseDown={(e) => e.preventDefault()} onClick={() => file.current?.click()} disabled={!!busy}>
              Fotka
            </button>
            <input
              ref={file}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                void addImages(Array.from(e.target.files ?? []));
                e.target.value = "";
              }}
            />
          </>
        )}
      </div>
      <div className="relative">
        {length === 0 && placeholder && <p className="pointer-events-none absolute left-3 top-3 text-[var(--color-muted)]">{placeholder}</p>}
        <div
          ref={box}
          id={id}
          role="textbox"
          aria-multiline="true"
          contentEditable
          suppressContentEditableWarning
          className={`rte input ${minHeight} !rounded-t-none overflow-auto`}
          onInput={emit}
          onBlur={emit}
          onKeyUp={refresh}
          onMouseUp={refresh}
          onPaste={(e) => {
            e.preventDefault();
            const images = Array.from(e.clipboardData.files);
            if (images.length && onImage) return void addImages(images);
            // other content arrives as plain text, so no foreign formatting or markup comes in
            const text = e.clipboardData.getData("text/plain");
            if (text) run("insertText", text);
          }}
          onDrop={(e) => {
            const images = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
            if (!images.length) return;
            e.preventDefault();
            if (onImage) void addImages(images);
          }}
        />
      </div>
      <p className="flex flex-wrap justify-between gap-2 px-3 py-1.5 text-xs text-[var(--color-muted)]">
        <span>{busy || "Ctrl+Z vrátí poslední změnu. Odstavec: Enter, nový řádek v odstavci: Shift+Enter."}</span>
        {maxLength !== undefined && (
          <span className={over ? "font-semibold text-[var(--color-warn)]" : ""}>
            {length.toLocaleString("cs-CZ")} / {maxLength.toLocaleString("cs-CZ")}
          </span>
        )}
      </p>
      {error && <p role="alert" className="px-3 pb-2 text-sm text-[var(--color-warn)]">{error}</p>}
    </div>
  );
}
