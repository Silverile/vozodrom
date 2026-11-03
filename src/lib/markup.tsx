import { Fragment, type ReactNode } from "react";

// Formatted text of logbook entries, car stories and articles: a small Markdown subset that people
// type or get from the editor's buttons (components/RichTextEditor).
//
//   ## Nadpis / ### Menší nadpis      - položka / 1. položka      > citace
//   **tučně**  *kurzíva*  [odkaz](https://…)  https://… (sám se stane odkazem)
//
// Paragraphs are separated by an empty line; a single line break stays a line break, so plain text
// written before formatting existed looks as it did. Output is React elements only (no HTML from
// the text is ever inserted), so the text cannot inject markup or scripts; links go only to http(s)
// addresses or to paths on this site.

export type MarkupBlock =
  | { type: "p"; text: string }
  | { type: "h2" | "h3"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "quote"; text: string };

/** Splits text into blocks: headings, lists, quotes and paragraphs. */
export function parseBlocks(source: string): MarkupBlock[] {
  const blocks: MarkupBlock[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) blocks.push({ type: "p", text: para.join("\n") });
    para = [];
  };
  for (const raw of source.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trimEnd();
    const last = blocks[blocks.length - 1];
    let m: RegExpMatchArray | null;
    if (!line.trim()) flush();
    else if ((m = line.match(/^\s*(#{2,3})\s+(.+)$/))) {
      flush();
      blocks.push({ type: m[1].length === 2 ? "h2" : "h3", text: m[2].trim() });
    } else if ((m = line.match(/^\s*[-*•]\s+(.+)$/))) {
      flush();
      if (last?.type === "ul" && !para.length) last.items.push(m[1]);
      else blocks.push({ type: "ul", items: [m[1]] });
    } else if ((m = line.match(/^\s*\d{1,3}[.)]\s+(.+)$/))) {
      flush();
      if (last?.type === "ol" && !para.length) last.items.push(m[1]);
      else blocks.push({ type: "ol", items: [m[1]] });
    } else if ((m = line.match(/^\s*>\s?(.*)$/))) {
      flush();
      if (last?.type === "quote") last.text += `\n${m[1]}`;
      else blocks.push({ type: "quote", text: m[1] });
    } else para.push(line);
  }
  flush();
  return blocks;
}

/** A link target the text may use: http(s) addresses and paths on this site only. */
export function safeHref(href: string): string | null {
  const h = href.trim();
  if (/^https?:\/\/[^\s<>"']+$/i.test(h)) return h;
  if (/^\/(?!\/)[^\s<>"']*$/.test(h)) return h;
  return null;
}

const INLINE = /\*\*(.+?)\*\*|(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])|\[([^\]\n]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s<>"')]+[^\s<>"').,;:!?])/g;

/** Bold, italic and links within one block of text; line breaks become <br>. */
export function inline(text: string, key = "i"): ReactNode[] {
  const out: ReactNode[] = [];
  let at = 0;
  let n = 0;
  const plain = (s: string) =>
    s.split("\n").forEach((part, i) => {
      if (i) out.push(<br key={`${key}-br${n++}`} />);
      if (part) out.push(part);
    });
  for (const m of text.matchAll(INLINE)) {
    plain(text.slice(at, m.index));
    const k = `${key}-${n++}`;
    if (m[1] !== undefined) out.push(<strong key={k}>{inline(m[1], k)}</strong>);
    else if (m[2] !== undefined) out.push(<em key={k}>{inline(m[2], k)}</em>);
    else if (m[3] !== undefined) {
      const href = safeHref(m[4]);
      out.push(href ? <Link key={k} href={href}>{inline(m[3], k)}</Link> : <Fragment key={k}>{m[0]}</Fragment>);
    } else if (m[5] !== undefined) out.push(<Link key={k} href={m[5]}>{m[5].replace(/^https?:\/\/(www\.)?/, "")}</Link>);
    at = (m.index ?? 0) + m[0].length;
  }
  plain(text.slice(at));
  return out;
}

function Link({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a href={href} className="underline underline-offset-2 hover:text-[var(--color-brand)]" {...(external ? { target: "_blank", rel: "nofollow ugc noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}

/** Formatted text as the site shows it. */
export function Markup({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {parseBlocks(text).map((b, i) => {
        const k = `b${i}`;
        switch (b.type) {
          case "h2":
            return <h2 key={k} className="pt-2 text-xl font-bold">{inline(b.text, k)}</h2>;
          case "h3":
            return <h3 key={k} className="pt-1 text-lg font-bold">{inline(b.text, k)}</h3>;
          case "ul":
            return <ul key={k} className="list-disc space-y-1 pl-6">{b.items.map((t, j) => <li key={j}>{inline(t, `${k}-${j}`)}</li>)}</ul>;
          case "ol":
            return <ol key={k} className="list-decimal space-y-1 pl-6">{b.items.map((t, j) => <li key={j}>{inline(t, `${k}-${j}`)}</li>)}</ol>;
          case "quote":
            return <blockquote key={k} className="border-l-4 border-[var(--color-brand)] pl-4 text-[var(--color-ink-soft)]">{inline(b.text, k)}</blockquote>;
          default:
            return <p key={k}>{inline(b.text, k)}</p>;
        }
      })}
    </div>
  );
}

/** The text without formatting marks, for descriptions and previews. */
export function plainText(source: string): string {
  return parseBlocks(source)
    .map((b) => ("items" in b ? b.items.join(", ") : b.text))
    .join(" ")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
