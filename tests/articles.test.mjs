// Tests of articles: slugs, the built-in articles as formatted text, and the editor's checks
// (lib/article-store's cleanArticle, loaded without its server-only imports). Run: npm test
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { ARTICLE_ICONS, builtInArticles, readingMinutes, slugify } from "../src/lib/articles.ts";

test("slugs from Czech titles", () => {
  assert.equal(slugify("Zimní pneumatiky: kdy jsou povinné?"), "zimni-pneumatiky-kdy-jsou-povinne");
  assert.equal(slugify("  Škoda Octavia — 4×4!  "), "skoda-octavia-4-4");
  assert.equal(slugify("ŘÍJEN 2026"), "rijen-2026");
  assert.equal(slugify("x".repeat(200)).length, 80);
});

test("built-in articles become formatted text with headings, lists and links", () => {
  assert.ok(builtInArticles.length >= 6);
  for (const a of builtInArticles) {
    assert.equal(typeof a.body, "string");
    assert.ok(a.body.length > 100, a.slug);
    assert.ok(a.icon in ARTICLE_ICONS, `${a.slug}: icon ${a.icon}`);
    assert.ok(Array.isArray(a.sources));
    assert.ok(readingMinutes(a) >= 1);
  }
  const prepis = builtInArticles.find((a) => a.slug === "prepis-vozidla-krok-za-krokem");
  assert.match(prepis.body, /^## /m);
  assert.match(prepis.body, /^- /m);
  assert.match(prepis.body, /\[[^\]]+\]\(\/[^)]+\)/);
});

async function cleanArticle() {
  let source = stripTypeScriptTypes(await readFile(new URL("../src/lib/article-store.ts", import.meta.url), "utf8"));
  const start = source.indexOf("export function cleanArticle");
  const tail = /\r?\n\}\r?\n/.exec(source.slice(start)); // the file may have CRLF line ends
  const end = start + tail.index + tail[0].length;
  const articles = pathToFileURL(new URL("../src/lib/articles.ts", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")).href;
  const mod = `import { ARTICLE_CATEGORIES, ARTICLE_ICONS } from ${JSON.stringify(articles)};\n${source.slice(start, end)}`;
  return (await import(`data:text/javascript;base64,${Buffer.from(mod).toString("base64")}`)).cleanArticle;
}

test("the editor's checks", async () => {
  const clean = await cleanArticle();
  const ok = { title: "Nový článek o autech", perex: "Krátký úvod, který má alespoň dvacet znaků.", category: "Rady", icon: "dokument", date: "2026-11-03", body: "x".repeat(60), sources: [" zdroj ", "", "druhý"] };
  const good = clean(ok);
  assert.equal(typeof good, "object");
  assert.deepEqual(good.sources, ["zdroj", "druhý"]);
  assert.equal(typeof clean({ ...ok, title: "Kr" }), "string");
  assert.equal(typeof clean({ ...ok, category: "Politika" }), "string");
  assert.equal(typeof clean({ ...ok, icon: "neznamy" }), "string");
  assert.equal(typeof clean({ ...ok, date: "3. 11. 2026" }), "string");
  assert.equal(typeof clean({ ...ok, body: "krátký" }), "string");
  assert.equal(clean({ ...ok, title: "T".repeat(500) }).title.length, 160);
});
