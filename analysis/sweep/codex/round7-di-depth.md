# Round 7 Daihatsu / Isuzu depth slice

2026-10-29. This is a bounded technical slice, not certification of either entire make.

## Applied

- Daihatsu Copen first generation: appended one European 1.3 petrol / 1298 cc / four-cylinder / 64 kW / 120 Nm / five-speed manual / front-wheel-drive technical version with 180 km/h top speed, 1475 mm width, 1245 mm height and 2225 mm wheelbase. Existing Japanese 47 kW versions preserved. Three logged mutations: trim array and two source arrays.
- Isuzu D-Max third generation: filled eight existing MY2026 2.2 diesel variants' cylinder counts with four. Eleven logged mutations: eight facts, two source arrays, one review-marker cleanup. Manufacturer release directly confirms the European 2.2 four-cylinder engine; ADAC independently corroborates engine identity and cylinder count.

## Checked sources

- https://www.autoweek.nl/autotests/artikel/daihatsu-copen-roadster-13-16v-dvvt-2006/ — original road test of 2006 Copen, published February 2007; opened successfully. Distinguishes measured 10.6 seconds from manufacturer 9.0 seconds.
- https://www.rupteur.ch/fr/targa/1db139 — search-indexed Swiss homologation 1DB139 / L881LK-KMVFW data, attributed by publisher to OFROU. Engine/transmission/drive/top speed and width/height/wheelbase agree with original test. Direct open returned cache miss. This is a third-party rendering of primary type-approval data, not direct OFROU access.
- https://www.anwb.nl/auto/informatie/daihatsu/copen/i/975753c4-25e8-df11-a731-000c29d2a1e4 — independent search-indexed catalogue confirms 1298 cc, four cylinders, 64 kW, 120 Nm, five-speed manual and 180 km/h. Direct open returned cache miss; the named ANWB trim is Two Tone, so equipment or production dates were not transferred.
- https://isuzu-germany-newsroom.prezly.com/neuer-isuzu-d-max-mit-22-liter-mehr-leistung-fur-den-arbeitsalltag — manufacturer release dated May 6, 2026 confirms four-cylinder 2.2 diesel at 120 kW/400 Nm in Germany, Austria, Czechia and Slovakia.
- https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/isuzu/d-max/3generation-facelift-2/351003/ — MY2026 Double Cab LS 8AT, RZ4F, 2164 cc, four cylinders, 120 kW/400 Nm.
- https://www.isuzu-motors.sk/pdfs/d-max_katalog_sk.pdf — opened original current 34-page brochure, confirming existing European 2.2 specifications and eight body/transmission combinations; it does not supply cylinder count in extracted text.

## Deliberately unresolved

Copen manufacturer brochure archive returned 403; no bypass attempted. The applied European trim therefore uses an original road test plus independent catalogue/type-approval reproduction, not a newly accessed manufacturer brochure. Copen length differs 3395/3440 mm and mass differs 850/925–935 kg across checked sources; both remain null. Acceleration remains null rather than conflating measured and manufacturer values. All trim production bounds remain null.

D-Max 2WD rear axle has only one explicit checked source, so drive remains null. The Single Cab 2WD automatic consumption conflict within the manufacturer brochure remains unresolved, despite ADAC agreeing with one listed value. No generation production dates, facelift years, photos, status or summaries were certified or changed. Sirion, Terios, Trooper and historic lines still require depth work; Copen II SOP and D-Max historic global production overlaps remain open.

## Verification

`node analysis/sweep/codex/round7-di-verify.cjs` passed exact baseline replay of all 14 logged mutations, preservation of every prior report array entry, at least two source URLs per mutation, and strict TypeScript assignment against CatalogModelCard for both complete card files. This check validates structure and logging, not the truth or independence of URLs automatically.
