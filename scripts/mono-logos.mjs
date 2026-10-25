// Turns the colour logo files in public/logos/ into one-colour silhouettes in public/logos/mono/,
// so they match the Simple Icons marks (drawn in the text colour). Dark and coloured areas become
// the mark; white areas become holes, even where they are painted over a dark shape (Tatra's
// letters, the Mercedes ring). The page then uses the file as a CSS mask filled with currentColor.
//
// Run: node scripts/mono-logos.mjs

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";

const dir = new URL("../public/logos/", import.meta.url);
const out = new URL("mono/", dir);
mkdirSync(out, { recursive: true });

const luminance = (hex) => {
  const h = hex.length === 4 ? hex.slice(1).split("").map((c) => c + c).join("") : hex.slice(1, 7);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
// In an SVG luminance mask white shows and black hides.
const recolour = (colour) => {
  const c = colour.trim().toLowerCase();
  if (c === "none" || c.startsWith("url(")) return colour;
  // currentColor is the logo's ink, but inside a mask it would resolve to black and hide it.
  if (c === "currentcolor") return "#ffffff";
  const hex = c === "white" ? "#ffffff" : c === "black" ? "#000000" : c;
  if (!/^#[0-9a-f]{3,8}$/.test(hex)) return colour;
  return luminance(hex) > 0.8 ? "#000000" : "#ffffff";
};

for (const name of readdirSync(dir).filter((f) => f.endsWith(".svg"))) {
  const svg = readFileSync(new URL(name, dir), "utf8");
  // Use the viewBox, or the root width and height when a file has none.
  const root = svg.match(/<svg[^>]*>/)?.[0] ?? "";
  const size = (attr) => parseFloat(root.match(new RegExp(`\\s${attr}="([\\d.]+)`))?.[1] ?? "");
  const box = root.match(/viewBox="([^"]+)"/)?.[1] ?? (size("width") && size("height") ? `0 0 ${size("width")} ${size("height")}` : null);
  if (!box) {
    console.warn(`skipped ${name}: needs a viewBox or width and height`);
    continue;
  }
  const [x, y, w, h] = box.trim().split(/[\s,]+/).map(Number);
  const body = svg
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>[\s\S]*$/, "") // drops anything after the root, e.g. trailing comments
    .replace(/<metadata[\s\S]*?<\/metadata>/g, "");
  // Recolour drawing only; masks inside the original file (Harley-Davidson) keep their colours.
  const inner = body
    .split(/(<mask[\s\S]*?<\/mask>)/)
    .map((part) =>
      part.startsWith("<mask")
        ? part
        : part
            .replace(/(fill|stroke|stop-color)="([^"]+)"/g, (_, k, v) => `${k}="${recolour(v)}"`)
            // inline styles and <style> blocks (class-based fills)
            .replace(/(fill|stroke|stop-color):\s*([^;"}\s]+)/g, (_, k, v) => `${k}:${recolour(v)}`),
    )
    .join("");
  // Keep the original namespace declarations (xlink:, inkscape: …) or the file stops being valid XML.
  const namespaces = [...new Set(root.match(/\sxmlns(:[\w-]+)?="[^"]*"/g) ?? [])].filter((n) => !/^\s*xmlns="/.test(n)).join("");
  const mono =
    `<svg xmlns="http://www.w3.org/2000/svg"${namespaces} viewBox="${box}">` +
    // Shapes without a fill default to black, i.e. the mark itself: the group makes that white.
    `<defs><mask id="m" maskUnits="userSpaceOnUse" x="${x}" y="${y}" width="${w}" height="${h}"><g fill="#fff">${inner}</g></mask></defs>` +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#000" mask="url(#m)"/></svg>\n`;
  writeFileSync(new URL(name, out), mono);
  console.log(`mono/${name}`);
}
