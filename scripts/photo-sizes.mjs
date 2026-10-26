// Records the pixel size of every Commons photo used in the model cards, so the pages can fill a 3:2
// box edge to edge (object-cover) when the photo is close to 3:2, and fit it whole otherwise.
// Writes src/data/photo-sizes.json { url: [width, height] }; keeps sizes already known.
//
// Run after the model cards change: node scripts/photo-sizes.mjs   (network)

import { existsSync, readFileSync, writeFileSync } from "node:fs";

const out = new URL("../src/data/photo-sizes.json", import.meta.url);
const sizes = existsSync(out) ? JSON.parse(readFileSync(out, "utf8")) : {};
const cards = JSON.parse(readFileSync(new URL("../src/data/model-cards-index.json", import.meta.url), "utf8"));
const urls = new Set();
for (const make of Object.values(cards)) for (const card of Object.values(make)) for (const g of card.generations) if (g.photo?.url) urls.add(g.photo.url);

const todo = [...urls].filter((u) => !sizes[u] && u.startsWith("https://upload.wikimedia.org/"));
const UA = { "User-Agent": "vozodrom-prototype/0.1 (https://vozodrom.cz; photo sizes)" };
for (let i = 0; i < todo.length; i += 40) {
  const batch = todo.slice(i, i + 40);
  const titles = batch.map((u) => "File:" + decodeURIComponent(u.split("/").pop()).replace(/_/g, " "));
  const q = new URLSearchParams({ action: "query", prop: "imageinfo", iiprop: "size|url", format: "json", titles: titles.join("|") });
  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${q}`, { headers: UA });
  const pages = (await res.json()).query?.pages ?? {};
  for (const p of Object.values(pages)) {
    const ii = p.imageinfo?.[0];
    if (!ii) continue;
    const clean = ii.url.split("?")[0]; // the API appends utm tracking parameters
    const url = batch.find((u) => decodeURIComponent(u) === decodeURIComponent(clean)) ?? clean;
    sizes[url] = [ii.width, ii.height];
  }
  await new Promise((r) => setTimeout(r, 1000));
}
writeFileSync(out, `${JSON.stringify(sizes)}\n`);
console.log(`${Object.keys(sizes).length} photo sizes (${todo.length} looked up)`);
