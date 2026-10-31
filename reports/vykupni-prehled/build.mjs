// Builds the "Výkupní přehled ojetin" sample: the generation summary Codex prepares in
// analysis/codex/revenue/sample-vykupni-prehled.json, laid out as A4 pages and printed to PDF with
// the locally installed Chrome (headless). Output: reports/vykupni-prehled/out/ (not committed).
//
// Usage: node reports/vykupni-prehled/build.mjs [path to sample json]

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const input = resolve(process.argv[2] ?? join(here, "../../analysis/codex/revenue/sample-vykupni-prehled.json"));
const data = JSON.parse(readFileSync(input, "utf8"));
const out = join(here, "out");
mkdirSync(out, { recursive: true });

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const num = (n) => (n == null ? "—" : Math.round(n).toLocaleString("cs-CZ"));
const pct = (x, digits = 1) => (x == null ? "—" : `${(x * 100).toLocaleString("cs-CZ", { minimumFractionDigits: digits, maximumFractionDigits: digits })} %`);
const km = (n) => (n == null ? "—" : `${Math.round(n / 1000).toLocaleString("cs-CZ")} tis.`);
const years = (g) => `${g.from ?? "?"}–${g.to ?? "dosud"}`;
const czDate = (iso) => (iso ? iso.slice(0, 10).split("-").reverse().map(Number).join(". ") : "—");

const MAKES = { skoda: "Škoda", volkswagen: "Volkswagen", "mercedes-benz": "Mercedes-Benz", bmw: "BMW" };
const makeName = (slug) => MAKES[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1);

// Mileage at up to five of these ages, those the generation has (old ones start later).
const MIN_INSPECTIONS = 200;
const MILEAGE_AGES = [5, 8, 10, 12, 15, 18, 20, 25];

/** Share of inspections with the defect, whichever field the sample uses for it. */
function defectShare(d) {
  return d.inspectionShare ?? d.share ?? d.occurrencesPerInspection ?? null;
}
const defectUnitNote = (lines) => {
  const units = new Set(lines.flatMap((l) => l.generations.flatMap((g) => (g.topDefects ?? []).map((d) => d.unit))).filter(Boolean));
  return [...units].some((u) => u.includes("occurrences"))
    ? "Závady: výskyt kódu závady na prohlídku (může mírně převyšovat podíl prohlídek se závadou)."
    : "Závady: podíl pravidelných prohlídek, při kterých byla závada zjištěna.";
};

function generation(g) {
  // age groups with few inspections are noise, not a rate
  const buckets = (g.ageBuckets ?? []).filter((b) => (b.inspectionCount ?? 0) >= MIN_INSPECTIONS);
  // "Octavia I" + "I (1U)" reads "Octavia I (1U)"
  const last = String(g.name).split(" ").pop();
  const code = g.code && !String(g.name).includes(g.code) ? (g.code.startsWith(last + " ") ? g.code.slice(last.length + 1) : g.code) : "";
  const mileage = MILEAGE_AGES.map((age) => (g.mileageByExactAge ?? []).find((m) => m.age === age)).filter(Boolean).slice(0, 5);
  const defects = (g.topDefects ?? []).slice(0, 5);
  const maxFail = Math.max(0.01, ...buckets.map((b) => b.failureShareApprox ?? 0));
  return `
  <section class="gen">
    <header>
      <h3>${esc(g.name)}${code ? ` <span class="code">${esc(code)}</span>` : ""}</h3>
      <span class="years">${esc(years(g))}</span>
    </header>
    <div class="facts">
      <div><span>V registru ČR</span><b>${num(g.fleetCount)}</b></div>
      <div><span>Prohlídek ve vzorku</span><b>${num(g.inspectionCount)}</b></div>
      <div><span>Neprošlo STK (celkem)</span><b>${pct(g.overallFailureShare)}</b></div>
      <div><span>Z toho nezpůsobilé</span><b>${pct(g.overallUnfitShare)}</b></div>
    </div>
    <div class="cols">
      <div>
        <h4>Neprošlo STK podle stáří</h4>
        ${buckets.length ? `<table class="bars">${buckets
          .map(
            (b) => `<tr><th>${esc(b.label)} let</th><td><i style="width:${Math.round(((b.failureShareApprox ?? 0) / maxFail) * 100)}%"></i></td><td class="n">${pct(b.failureShareApprox)}</td><td class="s">${num(b.inspectionCount)}×</td></tr>`,
          )
          .join("")}</table>` : `<p class="muted">Málo prohlídek pro spolehlivé číslo.</p>`}
      </div>
      <div>
        <h4>Běžný nájezd</h4>
        ${mileage.length ? `<table class="km"><tr><th></th><th>čtvrtina vozů pod</th><th>medián</th><th>čtvrtina vozů nad</th></tr>${mileage
          .map((m) => `<tr><th>${m.age} let</th><td>${km(m.p25Km)}</td><td><b>${km(m.medianKm)}</b></td><td>${km(m.p75Km)}</td></tr>`)
          .join("")}</table>` : `<p class="muted">Bez dostatku odečtů tachometru.</p>`}
      </div>
    </div>
    ${defects.length ? `<h4>Nejčastější závady při STK — na co se při výkupu podívat</h4>
    <ol class="defects">${defects.map((d) => `<li><span>${esc(d.label ?? d.code)} <em>(${esc(d.code)})</em></span><b>${pct(defectShare(d))}</b></li>`).join("")}</ol>` : ""}
  </section>`;
}

const meta = data.lines[0]?.sourceMeta ?? {};
const html = `<!doctype html>
<html lang="cs"><head><meta charset="utf-8"><title>${esc(data.title)}</title>
<style>
  @page { size: A4; margin: 14mm 14mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: "Segoe UI", Arial, sans-serif; color: #14181d; font-size: 9.5pt; line-height: 1.35; margin: 0; }
  .cover { height: 260mm; display: flex; flex-direction: column; justify-content: space-between; page-break-after: always; }
  .brand { font-weight: 800; font-size: 14pt; color: #0f9d7a; letter-spacing: .02em; }
  .cover h1 { font-size: 30pt; line-height: 1.05; margin: 40mm 0 6mm; }
  .cover .lead { font-size: 12pt; max-width: 150mm; color: #3a4350; }
  .cover ul { font-size: 10.5pt; color: #3a4350; padding-left: 5mm; }
  .tag { display: inline-block; background: #fff3cd; color: #7a5a00; padding: 1.5mm 3mm; border-radius: 2mm; font-size: 9pt; }
  h2 { font-size: 17pt; margin: 0 0 4mm; border-bottom: 1.2pt solid #0f9d7a; padding-bottom: 1.5mm; }
  .line { page-break-before: always; }
  .gen { border: .6pt solid #d4dae1; border-radius: 3mm; padding: 4mm 5mm; margin: 0 0 4mm; page-break-inside: avoid; }
  .gen header { display: flex; justify-content: space-between; align-items: baseline; }
  h3 { font-size: 12.5pt; margin: 0; } .code { color: #6b7684; font-weight: 500; font-size: 10pt; }
  .years { color: #6b7684; }
  h4 { font-size: 9.5pt; margin: 3mm 0 1.5mm; color: #3a4350; }
  .facts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2mm; margin-top: 2.5mm; }
  .facts div { background: #f2f5f8; border-radius: 2mm; padding: 1.8mm 2.5mm; }
  .facts span { display: block; font-size: 7.5pt; color: #6b7684; } .facts b { font-size: 11pt; }
  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; }
  table { border-collapse: collapse; width: 100%; }
  .bars th { text-align: left; font-weight: 500; width: 20mm; padding: .7mm 0; white-space: nowrap; }
  .bars td { padding: .7mm 1mm; } .bars td:nth-child(2) { width: 100%; }
  .bars i { display: block; height: 2.6mm; background: #0f9d7a; border-radius: 1.3mm; min-width: 1mm; }
  .bars .n { text-align: right; white-space: nowrap; font-weight: 600; } .bars .s { color: #8a94a1; white-space: nowrap; font-size: 7.5pt; }
  .km th, .km td { padding: .7mm 1mm; text-align: right; } .km th:first-child { text-align: left; font-weight: 500; }
  .km tr:first-child th { font-size: 7pt; color: #6b7684; font-weight: 500; }
  .defects { margin: 0; padding-left: 5mm; } .defects li { padding: .5mm 0; }
  .defects li { display: list-item; } .defects span { display: inline-block; width: 150mm; } .defects em { color: #8a94a1; font-style: normal; }
  .defects b { float: right; }
  .muted { color: #8a94a1; }
  .method { page-break-before: always; } .method li { margin-bottom: 1.8mm; }
  footer.src { margin-top: 6mm; font-size: 8pt; color: #6b7684; }
</style></head><body>
  <section class="cover">
    <div class="brand">vozodrom.cz</div>
    <div>
      <span class="tag">Ukázka</span>
      <h1>Výkupní přehled ojetin</h1>
      <p class="lead">STK a nájezdy <b>po jednotlivých generacích</b> — ne jen po modelových řadách. Z otevřených dat
      Ministerstva dopravy (pravidelné technické prohlídky a registr vozidel).</p>
      <ul>
        <li>Kolik vozů dané generace jezdí v ČR</li>
        <li>Jaký podíl neprošel STK v daném stáří</li>
        <li>Běžný nájezd podle stáří vozu</li>
        <li>Nejčastější závady při STK — kontrolní seznam pro příjem vozu</li>
      </ul>
      <p class="lead">V ukázce: ${data.lines.map((l) => esc(l.name)).join(", ")} — ${data.lines.reduce((n, l) => n + l.generations.length, 0)} generací.
      Na objednávku pro modely, které vykupujete nejčastěji.</p>
    </div>
    <div class="muted">Data: technické prohlídky ${czDate(meta.stk?.from)} – ${czDate(meta.stk?.to)} · registr vozidel · připraveno ${czDate(data.createdOn)}</div>
  </section>
  ${data.lines
    .map(
      (l) => `<section class="line"><h2>${esc(makeName(l.makeSlug))} ${esc(l.name)}</h2>${l.generations
        .filter((g) => g.inspectionCount || g.fleetCount)
        .map(generation)
        .join("")}</section>`,
    )
    .join("")}
  <section class="method">
    <h2>Metodika a omezení</h2>
    <ol>${(data.methodologyCs ?? []).map((m) => `<li>${esc(m)}</li>`).join("")}</ol>
    <p>${esc(defectUnitNote(data.lines))}</p>
    <footer class="src">Zdroj: Ministerstvo dopravy ČR, otevřená data — Informační systém technických prohlídek (IS TP) a Registr silničních
    vozidel. Zpracování a výpočty: vozodrom.cz. Údaje popisují soubor vozidel, ne konkrétní vůz; nejsou oceněním ani zárukou.</footer>
  </section>
</body></html>`;

const htmlPath = join(out, "vykupni-prehled-ukazka.html");
writeFileSync(htmlPath, html);

const chrome = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
].find((p) => p && existsSync(p));
if (!chrome) {
  console.log(`HTML: ${htmlPath} (Chrome nenalezen, PDF vytiskněte z prohlížeče)`);
} else {
  const pdfPath = join(out, "vykupni-prehled-ukazka.pdf");
  execFileSync(chrome, ["--headless=new", "--disable-gpu", "--no-pdf-header-footer", `--print-to-pdf=${pdfPath}`, pathToFileURL(htmlPath).href], { stdio: "ignore" });
  console.log(`PDF: ${pdfPath}`);
}
