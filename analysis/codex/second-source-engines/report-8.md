# Wave 2 batch 8 and three family migrations

Visited **150** queued generations; added **102 engine rows to 57 generations across 51 lines**. Specification fallback contributed 41 rows. Family work added another **10 engines**, **6 generations** and **4 facelift stages**. Combined: **112 engine rows across 54 lines**. Catalogue engine rows 9517 → 9629; generations with engines 2401 → 2463.

## Family structure

| Line | Before | After (index, code, production years) |
|---|---|---|
| fiat/palio | 1996–2018 | 0: 178 1996–2020; 1: 326 2011–2018 |
| cadillac/escalade | 1998–present | 0: GMT400 1998–2000; 1: GMT800 2001–2006; 2: GMT900 2006–2014; 3: GMTK2XX 2014–2019; 4: GMTT1XX 2020–present |
| bmw/ix3 | 2020–present | 0: G08 2020–2025; 1: NA5 2025–present |

Production dates use the cited infoboxes, not model-year headings. Palio 178 includes Weekend through 2020 (hatchback ended 2016); 326 is marked Brazil/Argentina and has no inferred European engines. Escalade IV production is 2014–2019 despite model years 2015–2020. G08 ends 2025; NA5 production starts October 2025. Sources and engine facts: families-8/research.json.

Mapping: Palio old 0 → [0,1], its four engines → 0; Escalade old 0 → [0,1,2,3,4], its existing 306 kW engine → 4 (the source identifies a 2021–2022 GMTT1XX version); iX3 old 0 → [0,1], its 210 kW engine → 0. Six old engine rows are preserved. The old evidence-7 Escalade proof is reindexed and its actual generation heading retained.

No affected drawing entries or holds existed. Drawing files/maps/holds are unchanged. The existing 2022 iX3 photograph now belongs to the 2021 G08 facelift and is not copied onto NA5. Palio facelift stages: 2000/2004/2007; G08: 2021. Escalade's facelift model year 2025 still needs a precise production-stage date.

Former family listing IDs require chassis/year/body fallback:

- fiat/palio: 1996–2018 → 178 / 326.
- cadillac/escalade: 1998–? → GMT400 / GMT800 / GMT900 / GMTK2XX / GMTT1XX.
- bmw/ix3: 2020–? → G08 / NA5.

No stored listings were queried or rewritten. There is no safe blanket one-to-one rewrite of these family IDs.

## Raw statistics

BMW, Cadillac and Fiat were rebuilt from all 1,094 IS TP days and the register. Frozen-input hashes and every publishable raw cohort were checked. Global make totals are preserved. Only the three make entries were merged into the global index; no partial global index was published.

| Line | Fleet before → after | Inspections before → after | Generation cohorts after |
|---|---:|---:|---|
| bmw/ix3 | 319 → 319 | 74 → 74 | 0: fleet 147, STK 74; 1: fleet 172, STK below threshold/unmatched |
| cadillac/escalade | 390 → 390 | 876 → 876 | 0: fleet below threshold/unmatched, STK below threshold/unmatched; 1: fleet below threshold/unmatched, STK 77; 2: fleet 155, STK 393; 3: fleet 109, STK 315; 4: fleet 96, STK 88 |
| fiat/palio | 506 → 506 | 496 → 496 | 0: fleet 506, STK 496; 1: fleet below threshold/unmatched, STK below threshold/unmatched |

Palio 326 requires an explicit 326 type-code prefix; an overlapping year alone keeps the European 178/Weekend cohort. This scoped matcher change affects only Fiat/Palio. Other overlapping years retain the existing type-code/latest-start fallback, so generation totals are estimates rather than VIN-certified chassis identification. All cohorts below n=30 remain suppressed.

## Engine batch lines

| Line | Generation index | Rows added |
|---|---:|---:|
| lancia/dedra | 0 | 1 |
| ds-automobiles/ds-4 | 1 | 1 |
| nissan/gt-r | 0 | 5 |
| alfa-romeo/155 | 0 | 10 |
| lancia/y | 0 | 1 |
| mazda/xedos-9 | 0 | 1 |
| hummer/h3 | 0 | 3 |
| jeep/gladiator | 1 | 2 |
| maserati/granturismo | 0 | 4 |
| maserati/granturismo | 1 | 3 |
| austin-motor-company/allegro | 0 | 4 |
| fiat/strada | 0 | 11 |
| alfa-romeo/75 | 0 | 2 |
| kia/ev9 | 0 | 4 |
| opel/senator | 0 | 1 |
| fiat/124-spider | 1 | 2 |
| jaguar/i-pace | 0 | 1 |
| audi/rs-q3 | 0 | 3 |
| audi/rs-q3 | 1 | 1 |
| byd/atto-2 | 0 | 1 |
| bentley/bentayga | 0 | 1 |
| mazda/xedos-6 | 0 | 1 |
| bmw/ix2 | 0 | 1 |
| porsche/924 | 0 | 1 |
| opel/manta | 1 | 1 |
| honda/stream | 0 | 2 |
| jaguar/xjs | 1 | 1 |
| honda/insight | 0 | 1 |
| daewoo/leganza | 0 | 1 |
| lancia/ypsilon | 1 | 1 |
| lancia/ypsilon | 2 | 1 |
| kia/clarus | 0 | 1 |
| leapmotor/c10 | 0 | 1 |
| daewoo/kalos | 0 | 1 |
| kia/pv5 | 0 | 1 |
| kia/pv5 | 1 | 1 |
| kia/seltos | 0 | 1 |
| mitsubishi/space-runner | 0 | 1 |
| mitsubishi/space-runner | 1 | 1 |
| opel/monterey | 0 | 1 |
| peugeot/4008 | 0 | 1 |
| nissan/prairie | 0 | 1 |
| infiniti/q50 | 0 | 1 |
| lancia/thesis | 0 | 1 |
| mitsubishi/3000-gt | 0 | 1 |
| maserati/grecale | 0 | 1 |
| alpine/a110 | 1 | 4 |
| lincoln/navigator | 0 | 1 |
| lincoln/navigator | 4 | 1 |
| dacia/solenza | 0 | 1 |
| nissan/serena | 0 | 1 |
| daihatsu/applause | 0 | 1 |
| infiniti/qx70 | 0 | 1 |
| alfa-romeo/junior | 0 | 1 |
| mitsubishi/space-gear | 0 | 1 |
| cadillac/srx | 0 | 1 |
| bentley/flying-spur | 0 | 1 |

## Gaps and validation

93 visited gaps remain (24 undated). They are in unresolved-8.json; another 201 original queued generations are unvisited. The new regional Palio 326 engine gap is separate.

Use **node analysis/codex/validate-family-batch.mjs** for the final tree. It proves 4594 untouched source/public cards unchanged, reconstructs the exact three sourced transformations, validates selectors/evidence moves, checks 837 drawing files and all statistics keys, and verifies completed statistics hashes. The engine-only validation-8.json is a historical pre-structure snapshot. Global engine audit and matcher regressions also pass.

Card-index raw delta 40993 bytes; gzip delta 5116 bytes. This is not a Worker bundle measurement. No commit, build or deployment performed.

Next: research-wave-2.py --batch 9 --size 150, followed by spec-site-engines.py --batch 9.
