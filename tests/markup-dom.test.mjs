// Tests of the visual editor's conversion (src/lib/markup-dom.ts) between the editor's HTML and the
// stored text, on a tiny fake DOM. Bundled with esbuild (it imports the .tsx markup). Run: npm test
import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { buildSync } from "esbuild";

const entry = fileURLToPath(new URL("../src/lib/markup-dom.ts", import.meta.url));
const code = buildSync({ entryPoints: [entry], bundle: true, format: "esm", write: false, platform: "node", jsx: "automatic" }).outputFiles[0].text;
const { toMarkup, toDom } = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);

// --- a fake DOM: elements with attributes and children, text nodes, fragments
class Node {
  constructor(type, name) {
    this.nodeType = type;
    this.nodeName = name;
    this.childNodes = [];
    this.attrs = {};
  }
  appendChild(c) {
    if (c.nodeType === 11) this.childNodes.push(...c.childNodes);
    else this.childNodes.push(c);
    return c;
  }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  getAttribute(k) { return this.attrs[k] ?? null; }
  get textContent() { return this.nodeType === 3 ? this.text : this.childNodes.map((c) => c.textContent).join(""); }
}
const doc = {
  createElement: (t) => new Node(1, t.toUpperCase()),
  createTextNode: (s) => Object.assign(new Node(3, "#text"), { text: s }),
  createDocumentFragment: () => new Node(11, "#fragment"),
};
const h = (tag, attrs, ...kids) => {
  const n = doc.createElement(tag);
  for (const [k, v] of Object.entries(attrs ?? {})) n.setAttribute(k, v);
  for (const k of kids) n.appendChild(typeof k === "string" ? doc.createTextNode(k) : k);
  return n;
};
const root = (...kids) => h("div", null, ...kids);
const roundTrip = (md) => {
  const r = doc.createElement("div");
  r.appendChild(toDom(md, doc));
  return toMarkup(r);
};

test("stored text survives the editor unchanged", () => {
  for (const md of [
    "Jen obyčejný text.",
    "První odstavec.\nŘádek pod ním.\n\nDruhý odstavec.",
    "## Nákup\n\nText s **tučným**, _kurzívou_ a [odkazem](https://example.cz/a).",
    "- jedna\n- dvě\n\n1. krok\n2. krok",
    "> citace\n> dál",
    "**_tučná kurzíva_** a **tučné s [odkazem](/katalog/)**",
    "Úvod\n\n![Motor po opravě](/foto/novinky/abc123.webp)\n\nZávěr",
    "### Menší nadpis",
  ]) assert.equal(roundTrip(md), md, md);
});

test("old plain text with asterisk italics is kept readable", () => {
  assert.equal(roundTrip("To je *důležité*."), "To je _důležité_.");
});

test("what browsers produce while typing: divs, spans, nbsp, empty lines", () => {
  const html = root(
    h("div", null, "První řádek"),
    h("div", null, h("br")),
    h("div", null, h("span", { style: "color:red" }, "Druhý "), h("b", null, "tučně "), "konec"),
    h("p", null, h("strong", null, "  ")),
  );
  assert.equal(toMarkup(html), "První řádek\n\nDruhý **tučně** konec");
});

test("pasted foreign HTML is reduced to what the text can say", () => {
  const html = root(
    h("h1", null, "Velký nadpis"),
    h("table", null, h("tr", null, h("td", null, "buňka"))),
    h("p", null, h("a", { href: "javascript:alert(1)" }, "zlý odkaz"), " a ", h("a", { href: "https://ok.cz" }, "dobrý")),
    h("p", null, h("img", { src: "https://evil.example/x.png", alt: "cizí" })),
    h("ul", null, h("li", null, "a", h("ul", null, h("li", null, "vnořená"))), h("li", null, "b")),
    h("blockquote", null, h("p", null, "řádek 1"), h("p", null, "řádek 2")),
  );
  assert.equal(toMarkup(html), "## Velký nadpis\n\nbuňka\n\nzlý odkaz a [dobrý](https://ok.cz)\n\n- a\n- vnořená\n- b\n\n> řádek 1\n> řádek 2");
});

test("toDom never parses the text as HTML", () => {
  const r = doc.createElement("div");
  r.appendChild(toDom("<img src=x onerror=alert(1)> **<b>x</b>**", doc));
  const p = r.childNodes[0];
  assert.equal(p.nodeName, "P");
  assert.equal(p.childNodes[0].nodeType, 3);
  assert.equal(p.childNodes[0].textContent, "<img src=x onerror=alert(1)> ");
  assert.equal(p.childNodes[1].nodeName, "B");
  assert.equal(p.childNodes[1].childNodes[0].nodeType, 3);
});

test("empty text gives one empty paragraph to type into", () => {
  const r = doc.createElement("div");
  r.appendChild(toDom("", doc));
  assert.equal(r.childNodes.length, 1);
  assert.equal(r.childNodes[0].nodeName, "P");
});
