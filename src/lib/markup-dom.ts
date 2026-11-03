import { type InlineToken, inlineTokens, parseBlocks, safeHref, safeImage } from "./markup";

// The visual editor (components/RichTextEditor) edits formatted HTML in the browser; the site stores
// the Markdown subset of lib/markup. These two functions convert between them. toMarkup reads only
// what the subset can say (headings, lists, quotes, pictures, bold, italic, links, line breaks) and
// drops everything else pasted or typed in, so whatever the browser produces, the stored text is clean.
// It works on a minimal node interface, so tests can run it without a browser.

export interface MiniNode {
  nodeType: number; // 1 element, 3 text
  nodeName: string;
  textContent: string | null;
  childNodes: ArrayLike<MiniNode>;
  getAttribute?(name: string): string | null;
}

const BLOCKS = new Set(["P", "DIV", "H1", "H2", "H3", "H4", "H5", "H6", "UL", "OL", "LI", "BLOCKQUOTE", "FIGURE", "PRE", "TABLE", "SECTION", "ARTICLE", "HEADER", "FOOTER"]);
const children = (n: MiniNode) => Array.from(n.childNodes);
const isBlock = (n: MiniNode) => n.nodeType === 1 && BLOCKS.has(n.nodeName);

/** Inline Markdown of a node's content: marks go round the text, spaces stay outside them. */
function inlineOf(node: MiniNode): string {
  let out = "";
  for (const n of children(node)) {
    if (n.nodeType === 3) {
      out += (n.textContent ?? "").replace(/ /g, " ").replace(/[ \t\r\n]+/g, " ");
      continue;
    }
    if (n.nodeType !== 1) continue;
    const tag = n.nodeName;
    if (tag === "BR") out += "\n";
    else if (tag === "IMG") continue; // pictures are blocks, handled by toMarkup
    else if (tag === "B" || tag === "STRONG") out += wrap(inlineOf(n), "**");
    else if (tag === "I" || tag === "EM") out += wrap(inlineOf(n), "_");
    else if (tag === "A") {
      const href = safeHref(n.getAttribute?.("href") ?? "");
      const label = inlineOf(n);
      out += href && label.trim() ? `${lead(label)}[${label.trim()}](${href})${trail(label)}` : label;
    } else out += inlineOf(n);
  }
  return out;
}

const lead = (s: string) => s.match(/^\s*/)![0];
const trail = (s: string) => s.match(/\s*$/)![0];
/** "**word** " rather than "**word **": edge spaces outside, empty marks dropped. */
function wrap(text: string, mark: string): string {
  if (!text.trim()) return text;
  return `${lead(text)}${mark}${text.trim()}${mark}${trail(text)}`;
}

/** One line of block text: line breaks kept inside paragraphs, trimmed at the ends. */
const clean = (s: string) =>
  s
    .split("\n")
    .map((l) => l.replace(/ +/g, " ").trim())
    .join("\n")
    .replace(/^\n+|\n+$/g, "");

/** Pictures inside a node, as Markdown lines. */
function images(node: MiniNode): string[] {
  const out: string[] = [];
  for (const n of children(node)) {
    if (n.nodeType !== 1) continue;
    if (n.nodeName === "IMG") {
      const src = safeImage(n.getAttribute?.("src") ?? "");
      if (src) out.push(`![${(n.getAttribute?.("alt") ?? "").replace(/[[\]\n]/g, " ").trim()}](${src})`);
    } else out.push(...images(n));
  }
  return out;
}

/** The editor's HTML as stored text. */
export function toMarkup(root: MiniNode): string {
  const blocks: string[] = [];
  let loose: MiniNode[] = []; // inline nodes directly under a block container
  const push = (s: string) => {
    if (s.trim()) blocks.push(s);
  };
  const flushLoose = () => {
    if (!loose.length) return;
    const fake: MiniNode = { nodeType: 1, nodeName: "P", textContent: null, childNodes: loose };
    push(clean(inlineOf(fake)));
    blocks.push(...images(fake));
    loose = [];
  };
  const walk = (container: MiniNode) => {
    for (const n of children(container)) {
      if (!isBlock(n) && !(n.nodeType === 1 && n.nodeName === "IMG")) {
        loose.push(n);
        continue;
      }
      flushLoose();
      if (n.nodeName === "IMG") {
        blocks.push(...images({ nodeType: 1, nodeName: "P", textContent: null, childNodes: [n] }));
        continue;
      }
      switch (n.nodeName) {
        case "H1":
        case "H2":
        case "H3":
        case "H4":
        case "H5":
        case "H6": {
          const text = clean(inlineOf(n)).replace(/\n/g, " ");
          push(text ? `${n.nodeName === "H1" || n.nodeName === "H2" ? "##" : "###"} ${text}` : "");
          break;
        }
        case "UL":
        case "OL": {
          const items = listItems(n).filter(Boolean);
          push(items.map((t, i) => (n.nodeName === "OL" ? `${i + 1}. ${t}` : `- ${t}`)).join("\n"));
          break;
        }
        case "BLOCKQUOTE": {
          const inner = toMarkup(n);
          push(inner.split("\n").filter((l) => l.trim()).map((l) => `> ${l.replace(/^(#{2,3}|[-*•]|\d+[.)]|>)\s+/, "")}`).join("\n"));
          break;
        }
        default: {
          // a paragraph, or a container (div) that holds blocks of its own
          if (children(n).some((c) => isBlock(c))) walk(n);
          else {
            push(clean(inlineOf(n)));
            blocks.push(...images(n));
          }
        }
      }
    }
    flushLoose();
  };
  walk(root);
  return blocks.join("\n\n");
}

/** Items of a list (nested lists flattened into it), as single lines. */
function listItems(list: MiniNode): string[] {
  const out: string[] = [];
  for (const li of children(list)) {
    if (li.nodeType !== 1) continue;
    if (li.nodeName === "UL" || li.nodeName === "OL") {
      out.push(...listItems(li));
      continue;
    }
    const own: MiniNode = { nodeType: 1, nodeName: "LI", textContent: null, childNodes: children(li).filter((c) => !(c.nodeName === "UL" || c.nodeName === "OL")) };
    out.push(clean(inlineOf(own)).replace(/\n/g, " "));
    for (const sub of children(li)) if (sub.nodeName === "UL" || sub.nodeName === "OL") out.push(...listItems(sub));
  }
  return out;
}

/** Builds the editor's HTML for stored text, with DOM methods only (no HTML parsing of the text). */
export function toDom(source: string, doc: Document): DocumentFragment {
  const frag = doc.createDocumentFragment();
  const fill = (parent: Node, tokens: InlineToken[]) => {
    for (const t of tokens) {
      if (t.t === "text") parent.appendChild(doc.createTextNode(t.v));
      else if (t.t === "br") parent.appendChild(doc.createElement("br"));
      else {
        const el = doc.createElement(t.t === "strong" ? "b" : t.t === "em" ? "i" : "a");
        if (t.t === "a") el.setAttribute("href", t.href);
        fill(el, t.c);
        parent.appendChild(el);
      }
    }
  };
  const el = (tag: string, text?: string) => {
    const e = doc.createElement(tag);
    if (text !== undefined) fill(e, inlineTokens(text));
    return e;
  };
  for (const b of parseBlocks(source)) {
    if (b.type === "ul" || b.type === "ol") {
      const list = el(b.type);
      for (const item of b.items) list.appendChild(el("li", item));
      frag.appendChild(list);
    } else if (b.type === "img") {
      const p = el("p");
      const img = doc.createElement("img");
      img.setAttribute("src", b.src);
      img.setAttribute("alt", b.alt);
      p.appendChild(img);
      frag.appendChild(p);
    } else frag.appendChild(el(b.type === "quote" ? "blockquote" : b.type, "text" in b ? b.text : ""));
  }
  // an empty paragraph needs a line break to have a height the cursor can go into
  if (!frag.childNodes.length) frag.appendChild(el("p")).appendChild(doc.createElement("br"));
  return frag;
}
