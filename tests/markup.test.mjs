// Tests of the text formatting (src/lib/markup.tsx): parsing, rendering, and that text can never
// inject markup. The .tsx file is compiled with esbuild here (a build dependency), as Node cannot strip JSX. Run: npm test
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { transformSync } from "esbuild";

const require = createRequire(import.meta.url);
const source = await readFile(new URL("../src/lib/markup.tsx", import.meta.url), "utf8");
const js = transformSync(source, { loader: "tsx", jsx: "automatic", format: "esm", target: "es2022" }).code
  .replace(/from "react\/jsx-runtime"/, `from ${JSON.stringify(pathToFileURL(require.resolve("react/jsx-runtime")).href)}`)
  .replace(/from "react"/, `from ${JSON.stringify(pathToFileURL(require.resolve("react")).href)}`);
const { Markup, parseBlocks, plainText, safeHref } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const { renderToStaticMarkup } = await import(pathToFileURL(require.resolve("react-dom/server")).href);
const { createElement } = await import(pathToFileURL(require.resolve("react")).href);
const html = (text) => renderToStaticMarkup(createElement(Markup, { text }));

test("plain text keeps its paragraphs and line breaks", () => {
  assert.deepEqual(parseBlocks("První odstavec.\nDruhý řádek.\n\nDruhý odstavec."), [
    { type: "p", text: "První odstavec.\nDruhý řádek." },
    { type: "p", text: "Druhý odstavec." },
  ]);
  assert.match(html("a\nb"), /<p>a<br\/>b<\/p>/);
});

test("headings, lists and quotes", () => {
  const blocks = parseBlocks("## Nákup\n- první\n- druhá\n\n1. krok\n2. krok\n> citace\n> dál\n### Menší");
  assert.deepEqual(blocks.map((b) => b.type), ["h2", "ul", "ol", "quote", "h3"]);
  assert.deepEqual(blocks[1].items, ["první", "druhá"]);
  assert.equal(blocks[3].text, "citace\ndál");
  const out = html("## Nákup\n- první\n- druhá");
  assert.match(out, /<h2[^>]*>Nákup<\/h2>/);
  assert.match(out, /<ul[^>]*><li>první<\/li><li>druhá<\/li><\/ul>/);
});

test("bold, italic and links", () => {
  const out = html("To je **důležité** a *trochu* méně, viz [návod](https://example.cz/a) nebo [stránku](/katalog/).");
  assert.match(out, /<strong>důležité<\/strong>/);
  assert.match(out, /<em>trochu<\/em>/);
  assert.match(out, /<a href="https:\/\/example.cz\/a"[^>]*rel="nofollow ugc noopener noreferrer"[^>]*>návod<\/a>/);
  assert.match(out, /<a href="\/katalog\/"[^>]*>stránku<\/a>/);
});

test("bare addresses become links without trailing punctuation", () => {
  const out = html("Zdroj: https://www.mdcr.cz/Dokumenty.");
  assert.match(out, /<a href="https:\/\/www.mdcr.cz\/Dokumenty"[^>]*>mdcr.cz\/Dokumenty<\/a>\./);
});

test("a multiplication sign or lone asterisk is not italic", () => {
  assert.doesNotMatch(html("rozměry 4 * 2 * 1 m"), /<em>/);
  assert.doesNotMatch(html("cena* platí"), /<em>/);
});

test("text cannot inject markup", () => {
  for (const evil of [
    "<script>alert(1)</script>",
    "<img src=x onerror=alert(1)>",
    "[klik](javascript:alert(1))",
    "[klik](//evil.example/x)",
    "[klik](data:text/html;base64,PHNjcmlwdD4=)",
    '[klik](https://a.cz/" onmouseover="alert(1))',
    "**<b>x</b>**",
  ]) {
    const out = html(evil);
    // no real tags or event attributes; the text itself may appear, escaped
    assert.doesNotMatch(out, /<script|<img|<b>|<[^>]*\son\w+=|href="(javascript:|\/\/|data:)/i, out);
  }
  assert.equal(safeHref("javascript:alert(1)"), null);
  assert.equal(safeHref("//evil.example"), null);
  assert.equal(safeHref("/pribehy/"), "/pribehy/");
});

test("plainText drops the marks", () => {
  assert.equal(plainText("## Nákup\n**Tučně** a [odkaz](https://a.cz)\n- a\n- b"), "Nákup Tučně a odkaz a, b");
});

test("pictures: only photos stored on the site, as figures with captions", () => {
  const out = html("Úvod\n\n![Motor po opravě](/foto/novinky/abc123.webp)\n\nZávěr");
  assert.match(out, /<figure[^>]*><img src="\/foto\/novinky\/abc123.webp" alt="Motor po opravě"[^>]*\/><figcaption[^>]*>Motor po opravě<\/figcaption><\/figure>/);
  for (const src of ["https://evil.example/x.png", "javascript:alert(1)", "/foto/novinky/../../x.webp", "/foto/inzeraty/u-1/a.webp"]) {
    assert.doesNotMatch(html(`![x](${src})`), /<img/, src);
  }
});

test("underscore italics", () => {
  assert.match(html("To je _kurzíva_ a **_obojí_**."), /<em>kurzíva<\/em>.*<strong><em>obojí<\/em><\/strong>/);
  assert.doesNotMatch(html("soubor_nazev_test.txt"), /<em>/);
});
