import { Fragment, type ReactNode } from "react";

// Formatted text of logbook entries, car stories and articles: a small Markdown subset. People see
// it formatted while they write (components/RichTextEditor turns the editor's formatting into this
// text and back); what is stored stays plain, readable text.
//
//   ## Nadpis / ### Menší nadpis      - položka / 1. položka      > citace
//   **tučně**  _kurzíva_ (or *kurzíva*)  [odkaz](https://…)  https://… (becomes a link)
//   ![popisek](/foto/novinky/…)      a picture on its own line (articles)
//
// Paragraphs are separated by an empty line; a single line break stays a line break, so plain text
// written before formatting existed looks as it did. Output is React elements only (no HTML from
// the text is ever inserted), so the text cannot inject markup or scripts; links go only to http(s)
// addresses or to paths on this site, pictures only to photos stored on this site.

export type MarkupBlock =
  | { type: "p"; text: string }
  | { type: "h2" | "h3"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "img"; src: string; alt: string };

/** A link target the text may use: http(s) addresses and paths on this site only. */
export function safeHref(href: string): string | null {
  const h = href.trim();
  if (/^https?:\/\/[^\s<>"']+$/i.test(h)) return h;
  if (/^\/(?!\/)[^\s<>"']*$/.test(h)) return h;
  return null;
}

/** A picture the text may show: photos stored on this site for articles. */
export function safeImage(src: string): string | null {
  return /^\/foto\/novinky\/[a-z0-9]+\.(webp|jpg)$/.test(src.trim()) ? src.trim() : null;
}

const IMAGE_LINE = /^\s*!\[([^\]\n]*)\]\(([^)\s]+)\)\s*$/;

/** Splits text into blocks: headings, lists, quotes, pictures and paragraphs. */
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
    else if ((m = line.match(IMAGE_LINE)) && safeImage(m[2])) {
      flush();
      blocks.push({ type: "img", alt: m[1].trim(), src: safeImage(m[2])! });
    } else if ((m = line.match(/^\s*(#{2,3})\s+(.+)$/))) {
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

/** Inline content of a block: text, line breaks, bold, italic and links (nested). */
export type InlineToken =
  | { t: "text"; v: string }
  | { t: "br" }
  | { t: "strong" | "em"; c: InlineToken[] }
  | { t: "a"; href: string; c: InlineToken[] };

const INLINE =
  /\*\*(.+?)\*\*|(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])|(?<![\p{L}\p{N}_])_(?!\s)(.+?)(?<!\s)_(?![\p{L}\p{N}_])|\[([^\]\n]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s<>"')]+[^\s<>"').,;:!?])/gu;

export function inlineTokens(text: string): InlineToken[] {
  const out: InlineToken[] = [];
  let at = 0;
  const plain = (s: string) =>
    s.split("\n").forEach((part, i) => {
      if (i) out.push({ t: "br" });
      if (part) out.push({ t: "text", v: part });
    });
  for (const m of text.matchAll(INLINE)) {
    plain(text.slice(at, m.index));
    if (m[1] !== undefined) out.push({ t: "strong", c: inlineTokens(m[1]) });
    else if (m[2] !== undefined) out.push({ t: "em", c: inlineTokens(m[2]) });
    else if (m[3] !== undefined) out.push({ t: "em", c: inlineTokens(m[3]) });
    else if (m[4] !== undefined) {
      const href = safeHref(m[5]);
      if (href) out.push({ t: "a", href, c: inlineTokens(m[4]) });
      else plain(m[0]);
    } else if (m[6] !== undefined) out.push({ t: "a", href: m[6], c: [{ t: "text", v: m[6].replace(/^https?:\/\/(www\.)?/, "") }] });
    at = (m.index ?? 0) + m[0].length;
  }
  plain(text.slice(at));
  return out;
}

function renderTokens(tokens: InlineToken[], key: string): ReactNode[] {
  return tokens.map((tok, i) => {
    const k = `${key}-${i}`;
    switch (tok.t) {
      case "text":
        return <Fragment key={k}>{tok.v}</Fragment>;
      case "br":
        return <br key={k} />;
      case "strong":
        return <strong key={k}>{renderTokens(tok.c, k)}</strong>;
      case "em":
        return <em key={k}>{renderTokens(tok.c, k)}</em>;
      case "a": {
        const external = tok.href.startsWith("http");
        return (
          <a key={k} href={tok.href} className="underline underline-offset-2 hover:text-[var(--color-brand)]" {...(external ? { target: "_blank", rel: "nofollow ugc noopener noreferrer" } : {})}>
            {renderTokens(tok.c, k)}
          </a>
        );
      }
    }
  });
}

/** Bold, italic and links within one block of text; line breaks become <br>. */
export const inline = (text: string, key = "i"): ReactNode[] => renderTokens(inlineTokens(text), key);

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
          case "img":
            return (
              <figure key={k} className="my-2">
                <img src={b.src} alt={b.alt} loading="lazy" className="w-full rounded-[10px] bg-[var(--color-photo)]" />
                {b.alt && <figcaption className="mt-1 text-sm text-[var(--color-muted)]">{b.alt}</figcaption>}
              </figure>
            );
          default:
            return <p key={k}>{inline(b.text, k)}</p>;
        }
      })}
    </div>
  );
}

/** The first picture of a text, e.g. as an article's cover. */
export function firstImage(source: string): { src: string; alt: string } | null {
  const img = parseBlocks(source).find((b) => b.type === "img");
  return img && img.type === "img" ? { src: img.src, alt: img.alt } : null;
}

/** The text without formatting marks, for descriptions and previews. */
export function plainText(source: string): string {
  const text = (tokens: InlineToken[]): string => tokens.map((t) => (t.t === "text" ? t.v : t.t === "br" ? " " : text(t.c))).join("");
  return parseBlocks(source)
    .map((b) => (b.type === "img" ? "" : "items" in b ? b.items.map((i) => text(inlineTokens(i))).join(", ") : text(inlineTokens(b.text))))
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
