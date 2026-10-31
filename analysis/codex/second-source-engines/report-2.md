# Second-source engines, batch 2

Visited the next 100 generations (original snapshot positions 100–199). Added **459 rows to 58 generations across 36 lines**. 42 attempted generations remain empty; source attempts/reasons are in unresolved-2.json and batch-2.json.

| Line | Generations visited | Filled | Rows added |
|---|---:|---:|---:|
| kia/rio | 4 | 1 | 3 |
| fiat/panda | 2 | 0 | 0 |
| mazda/cx-5 | 3 | 3 | 8 |
| mercedes-benz/trida-v | 2 | 2 | 15 |
| peugeot/3008 | 2 | 2 | 11 |
| bmw/rada-1 | 4 | 4 | 48 |
| opel/vectra | 3 | 2 | 32 |
| citroen/c5 | 1 | 1 | 17 |
| citroen/xsara-picasso | 1 | 1 | 5 |
| mercedes-benz/glc | 1 | 0 | 0 |
| mg/zs | 2 | 1 | 5 |
| skoda/octavia-1959 | 1 | 0 | 0 |
| jeep/grand-cherokee | 4 | 3 | 26 |
| dacia/jogger | 1 | 1 | 1 |
| mercedes-benz/trida-b | 1 | 0 | 0 |
| mitsubishi/outlander | 4 | 2 | 6 |
| opel/crossland | 1 | 1 | 10 |
| mini/cooper | 4 | 0 | 0 |
| opel/movano | 1 | 1 | 6 |
| audi/q5 | 2 | 2 | 21 |
| lada/2103 | 1 | 0 | 0 |
| fiat/125 | 1 | 0 | 0 |
| kia/picanto | 3 | 0 | 0 |
| peugeot/306 | 1 | 1 | 19 |
| nissan/x-trail | 4 | 2 | 6 |
| skoda/1203 | 1 | 0 | 0 |
| opel/combo | 1 | 1 | 22 |
| fiat/500 | 2 | 1 | 4 |
| fiat/tipo | 1 | 0 | 0 |
| mercedes-benz/trida-s | 4 | 2 | 29 |
| kia/stonic | 1 | 1 | 9 |
| kia/sorento | 4 | 4 | 18 |
| chevrolet/aveo | 2 | 0 | 0 |
| peugeot/rifter | 1 | 1 | 6 |
| audi/a5 | 1 | 1 | 20 |
| dacia/lodgy | 1 | 1 | 10 |
| cupra/formentor | 1 | 1 | 9 |
| mercedes-benz/gls | 2 | 2 | 13 |
| nissan/micra | 5 | 2 | 12 |
| fiat/bravo | 1 | 0 | 0 |
| bmw/rada-7 | 1 | 1 | 7 |
| kia/venga | 1 | 1 | 3 |
| citroen/xsara | 1 | 1 | 15 |
| mazda/cx-3 | 1 | 1 | 5 |
| honda/jazz | 4 | 2 | 5 |
| audi/q3 | 2 | 2 | 15 |
| bmw/x6 | 1 | 1 | 8 |
| peugeot/106 | 1 | 0 | 0 |
| chevrolet/spark | 2 | 0 | 0 |
| nissan/juke | 2 | 2 | 10 |
| mitsubishi/l200 | 2 | 0 | 0 |

## Names

Found 110 names over 40 characters in the current catalogue. Shortened labels retain the original annotation in noteCs; the reusable cleanup merges colliding name/power rows and preserves their source URLs. Removed 9 explicitly non-European rows. The catalogue-wide audit now enforces 40 characters. Technical powers and engine sizes are preserved by presentation cleanup. Details: labels-40.json.

## BMW generations

X5: one 1999–open family → E53 1999–2006, E70 2006–2013, F15 2013–2018, G05 2018–2026, G65 2026–open. X3: one 2003–open family → E83 2003–2010, F25 2010–2017, G01 2017–2024, G45 2024–open. Added 7 generation records, 6 facelift stages and 43 additional engine rows beyond the batch.

G65 is included because the current source records series production from August 2026, corroborating BMW's announced production start; model year 2027 is not used as production year. Sources: [BMW announcement](https://www.bmwgroup.com/en/news/general/2026/the-new-bmw-x5.html), [G65 production record](https://en.wikipedia.org/wiki/BMW_X5_(G65)). G01 uses the European 2024 end; the longer Chinese G08 production does not extend it. G65 and G45 engine gaps remain because ambiguous hybrid/combined tables were not imported.

Old index 0 splits to X5 [0,1,2,3,4] and X3 [0,1,2,3]. Old family statistics were discarded and rebuilt from all raw BMW inspections/register records; no sums of the old family aggregate were invented. New selectors use the real chassis codes. Old year-only IDs 1999–? and 2003–? have one-to-many mappings; use chassis/year fallback, not a blanket rewrite. Existing F15 and facelifted F25 photographs moved to those generations. The two legacy white alpha drawing masks could not be attributed visually: their live front-drawings entries were retired and files kept unchanged on disk; no misleading E53/E83 hold was created. Migration and mappings: bmw-x/migration.json.

## Validation and next step

Full validator: node analysis/codex/validate-second-source-batch-2.mjs. Public engine audit: node analysis/codex/audit-engine-throughput.mjs. Engine-only phase validation is saved in validation-2.json; final validation includes the subsequent name cleanup and BMW migration.

Catalogue engine rows: 7757 → 8250; generations with engines: 2092 → 2155. BMW make and X5/X3 line fleet/inspection totals are preserved. Transition years and missing production year proxies remain limitations of per-generation assignment.

Next queue: 326 original unvisited generations plus 2 newly introduced structural engine gaps. 200 original generations visited across both batches; 69 visited gaps remain separately documented. Resume the original snapshot at offset 200, with new BMW gaps tracked in queue.json; then wave 2. No commit or publication performed.
