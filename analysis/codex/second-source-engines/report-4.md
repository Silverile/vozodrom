# Second-source engines, batch 4

Visited 100 queued generations. Added **396 engine rows to 53 generations across 34 lines**. Catalogue engine rows: 8536 → 8932; generations with engines: 2201 → 2254. No generation identities, dates, facelifts, drawings, selectors or statistics changed.

| Line | Generations visited | Filled | Rows added |
|---|---:|---:|---:|
| jeep/cherokee | 2 | 0 | 0 |
| nissan/almera | 2 | 2 | 14 |
| moskvic/408 | 1 | 0 | 0 |
| audi/80 | 3 | 2 | 22 |
| mercedes-benz/glb | 1 | 0 | 0 |
| mazda/626 | 6 | 2 | 14 |
| lada/2102 | 1 | 0 | 0 |
| fiat/freemont | 1 | 0 | 0 |
| fiat/600 | 2 | 1 | 4 |
| land-rover/defender | 4 | 0 | 0 |
| kia/carens | 3 | 3 | 15 |
| lada/niva | 1 | 0 | 0 |
| jeep/compass | 3 | 3 | 19 |
| mitsubishi/space-star | 2 | 1 | 3 |
| nissan/note | 2 | 1 | 6 |
| nissan/navara | 3 | 1 | 4 |
| jeep/wrangler | 4 | 3 | 13 |
| peugeot/807 | 1 | 1 | 10 |
| bmw/x7 | 1 | 1 | 9 |
| bmw/i3 | 1 | 0 | 0 |
| fiat/croma | 1 | 1 | 16 |
| land-rover/range-rover-sport | 1 | 1 | 15 |
| chevrolet/cruze | 2 | 0 | 0 |
| hyundai/elantra | 1 | 0 | 0 |
| alfa-romeo/156 | 1 | 1 | 18 |
| mercedes-benz/slk | 3 | 3 | 24 |
| bmw/z4 | 1 | 1 | 8 |
| land-rover/range-rover-evoque | 3 | 2 | 8 |
| opel/grandland | 2 | 2 | 9 |
| fiat/fiorino | 4 | 0 | 0 |
| nissan/primera | 3 | 0 | 0 |
| audi/tt | 1 | 1 | 9 |
| mg/hs | 2 | 2 | 7 |
| bmw/rada-6 | 1 | 1 | 13 |
| land-rover/range-rover | 3 | 0 | 0 |
| fiat/850 | 1 | 0 | 0 |
| cupra/leon | 1 | 1 | 15 |
| citroen/c4-cactus | 1 | 1 | 8 |
| citroen/c8 | 1 | 1 | 10 |
| bmw/rada-2 | 1 | 1 | 11 |
| mercedes-benz/trida-g | 2 | 1 | 1 |
| moskvic/2140 | 1 | 0 | 0 |
| mercedes-benz/cls | 2 | 2 | 14 |
| mercedes-benz/glk | 1 | 1 | 11 |
| citroen/c2 | 1 | 1 | 7 |
| chevrolet/captiva | 2 | 0 | 0 |
| peugeot/309 | 1 | 1 | 2 |
| chevrolet/orlando | 2 | 0 | 0 |
| fiat/126 | 1 | 0 | 0 |
| mercedes-benz/clk | 1 | 1 | 8 |
| peugeot/301 | 2 | 1 | 4 |
| lada/2106 | 1 | 0 | 0 |
| mercedes-benz/sl | 5 | 5 | 45 |

47 attempted generations remain empty. Sources, failed leads and rejection reasons are in batch-4.json and unresolved-4.json. Unknown/undated families, ambiguous shared-body attribution and unusable tables remain absent rather than guessed. Existing broad BMW Z4/6/2 family cards were kept; their sourced early chassis engines do not claim complete generation histories. Follow-ups are listed in report-4.json.

## Public data size

New public rows contain engine facts and source URLs only; detailed evidence/notes stay in evidence-4.json under analysis and are hash-checked by the validator and global audit. Existing public metadata was left unchanged.

Model-card index raw bytes: 16714671 → 16823296 (delta 108625); gzip bytes: 1693896 → 1702143 (delta 8247). This measures the JSON index, not the deployed Worker.

## Validation and next step

Run node analysis/codex/second-source-engines.mjs --batch 4, then node analysis/codex/audit-engine-throughput.mjs. The batch validator compares all source/public cards with a8a6405ca95c12dcb2ad06e55639521f344980aa, proves untouched cards and all generation-coupled files unchanged, checks the 40-character cap and verifies external evidence for each new row.

128 unvisited generations remain in queue.json. Continue with --batch 5 --queue analysis/codex/second-source-engines/queue.json --size 100; after wave 1 is visited, continue wave 2 (fleet 1–999). Visited gaps remain separately documented. No commit or publication performed.
