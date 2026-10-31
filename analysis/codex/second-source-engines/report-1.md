# Second-source engines, batch 1

Visited the first 100 fleet-ordered generations from the 526-generation snapshot. Added **734 engine rows to 73 generations across 35 lines**. Generation lists, dates, facelifts, listing IDs, drawings, holds and statistics are unchanged; no remap or statistics rebuild is required.

Catalogue generations with engines: 2019 → 2092. Engine rows: 7023 → 7757.

| Line | Generations visited | Filled | Engine rows added |
|---|---:|---:|---:|
| opel/astra | 1 | 1 | 22 |
| renault/clio | 1 | 1 | 1 |
| bmw/rada-5 | 5 | 5 | 76 |
| audi/a6 | 1 | 1 | 11 |
| citroen/c3 | 2 | 1 | 7 |
| kia/sportage | 6 | 3 | 18 |
| opel/corsa | 1 | 0 | 0 |
| mercedes-benz/trida-e | 8 | 7 | 155 |
| mercedes-benz/sprinter | 3 | 1 | 8 |
| dacia/logan | 2 | 1 | 6 |
| citroen/jumper | 1 | 0 | 0 |
| nissan/qashqai | 2 | 2 | 9 |
| peugeot/partner | 2 | 1 | 13 |
| mercedes-benz/trida-c | 5 | 4 | 82 |
| audi/a3 | 2 | 2 | 18 |
| honda/cr-v | 6 | 4 | 12 |
| bmw/x5 | 1 | 1 | 7 |
| peugeot/207 | 1 | 1 | 6 |
| skoda/citigo | 1 | 1 | 3 |
| honda/civic | 11 | 5 | 20 |
| opel/zafira | 3 | 3 | 37 |
| lada/2101 | 1 | 0 | 0 |
| mercedes-benz/gle | 5 | 3 | 31 |
| dacia/dokker | 1 | 1 | 9 |
| citroen/c4-picasso | 2 | 2 | 22 |
| mazda/6 | 3 | 3 | 28 |
| skoda/1000-1100-mb | 1 | 1 | 4 |
| citroen/c4 | 1 | 1 | 11 |
| fiat/doblo | 1 | 1 | 4 |
| peugeot/5008 | 2 | 2 | 6 |
| opel/meriva | 1 | 1 | 11 |
| mitsubishi/asx | 2 | 2 | 9 |
| iveco/daily | 3 | 1 | 7 |
| mercedes-benz/trida-a | 3 | 3 | 31 |
| mazda/3 | 4 | 2 | 10 |
| bmw/x3 | 1 | 1 | 11 |
| seat/alhambra | 2 | 2 | 19 |
| kia/rio | 2 | 2 | 10 |

27 generations remain empty in this batch. Per-generation attempts, URLs, fetch errors and rejected candidates are in batch-1.json; gaps are collected in unresolved-1.json. New rows carry their source URL and table/generation evidence. Sources are German generation or family Wikipedia articles with explicit production/code/heading/row-year evidence; a generic family table alone is insufficient. Experimental, explicitly non-European, sibling-model and ambiguous combined hybrid rows are skipped. This pass does not claim complete model/engine coverage.

Structural follow-ups: BMW X5 and X3 still have one open-ended catalogue family each (new rows document E53/E83 only); Jumper is undated; Sportage NQ5 short/long body entries need body-specific source attribution. No structural edits were made.

Validation: node analysis/codex/second-source-engines.mjs. Compares all source and generated cards with baseline 048344b7ae1059bea2c95fc4063843a197482378; untouched cards must match exactly, touched generations may add engine rows/coverage/source URLs only, and all coupled assets/statistics must remain unchanged. Parser fixtures: python -B analysis/codex/test-second-source-engines.py. Candidate research is local ignored staging, not a baseline committed to the repository.

Resume with the 426 unvisited generations in queue.json (immutable original snapshot offset 100). The 27 visited gaps are separate; do not count them as filled. Then wave 2.
