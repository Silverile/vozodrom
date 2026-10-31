# Second-source engines, batch 5

Visited 128 queued generations. Added **243 engine rows to 44 generations across 40 lines**. Catalogue engine rows: 8932 → 9206; generations with engines: 2254 → 2304. The engine-only phase preserved generation-coupled data. The subsequent BMW migration is documented below.

| Line | Generations visited | Filled | Rows added |
|---|---:|---:|---:|
| mercedes-benz/sl | 1 | 1 | 3 |
| bmw/x4 | 1 | 1 | 7 |
| citroen/c5-aircross | 1 | 1 | 6 |
| skoda/felicia-1959 | 1 | 0 | 0 |
| daewoo/matiz | 3 | 1 | 2 |
| nissan/patrol | 1 | 0 | 0 |
| nissan/pathfinder | 1 | 1 | 3 |
| ram/1500 | 2 | 1 | 7 |
| skoda/440-445-450 | 1 | 0 | 0 |
| audi/100 | 4 | 1 | 10 |
| skoda/1202 | 1 | 0 | 0 |
| fiat/marea | 1 | 1 | 12 |
| citroen/c-elysee | 1 | 1 | 4 |
| lada/2107 | 1 | 0 | 0 |
| fiat/127 | 1 | 0 | 0 |
| mitsubishi/eclipse-cross | 2 | 1 | 2 |
| citroen/bx | 1 | 1 | 4 |
| fiat/sedici | 1 | 1 | 2 |
| kia/k4 | 1 | 0 | 0 |
| land-rover/discovery-sport | 1 | 1 | 13 |
| nissan/terrano | 1 | 1 | 5 |
| cupra/ateca | 1 | 1 | 8 |
| moskvic/412 | 1 | 0 | 0 |
| bmw/rada-2-active-tourer | 1 | 1 | 11 |
| dodge/durango | 3 | 1 | 4 |
| kia/niro | 1 | 0 | 0 |
| cupra/terramar | 1 | 1 | 3 |
| fiat/500l | 1 | 0 | 0 |
| mercedes-benz/190 | 1 | 0 | 0 |
| fiat/seicento | 1 | 1 | 2 |
| mazda/cx-60 | 1 | 1 | 4 |
| dodge/challenger | 3 | 0 | 0 |
| nissan/sunny | 1 | 1 | 5 |
| mercedes-benz/trida-r | 1 | 0 | 0 |
| fiat/ulysse | 3 | 3 | 17 |
| alfa-romeo/stelvio | 1 | 1 | 9 |
| alfa-romeo/giulietta | 2 | 1 | 1 |
| citroen/c-crosser | 1 | 1 | 1 |
| bmw/x2 | 1 | 1 | 8 |
| mitsubishi/galant | 9 | 0 | 0 |
| porsche/panamera | 1 | 0 | 0 |
| mini/countryman | 2 | 0 | 0 |
| nissan/nv200 | 1 | 1 | 3 |
| moskvic/2138 | 1 | 0 | 0 |
| nissan/leaf | 3 | 0 | 0 |
| opel/rekord | 8 | 2 | 6 |
| citroen/zx | 1 | 1 | 16 |
| porsche/macan | 1 | 1 | 5 |
| bmw/z3 | 1 | 1 | 10 |
| nissan/cabstar | 1 | 0 | 0 |
| jaguar/xf | 5 | 0 | 0 |
| opel/ascona | 3 | 1 | 4 |
| fiat/500x | 1 | 1 | 10 |
| fiat/ritmo | 1 | 0 | 0 |
| opel/tigra | 1 | 1 | 2 |
| opel/antara | 1 | 1 | 7 |
| fiat/talento | 2 | 0 | 0 |
| bmw/rada-2-gran-tourer | 1 | 0 | 0 |
| peugeot/4007 | 1 | 1 | 2 |
| chevrolet/camaro | 1 | 0 | 0 |
| daewoo/lanos | 1 | 0 | 0 |
| bmw/rada-8 | 1 | 1 | 6 |
| peugeot/607 | 1 | 1 | 4 |
| lancia/delta | 3 | 0 | 0 |
| fiat/128 | 1 | 0 | 0 |
| isuzu/d-max | 3 | 0 | 0 |
| alfa-romeo/giulia | 1 | 0 | 0 |
| kia/carnival | 4 | 2 | 5 |
| chevrolet/corvette | 1 | 0 | 0 |
| land-rover/range-rover-velar | 1 | 1 | 10 |
| toyota/prius | 1 | 0 | 0 |
| chrysler/300 | 4 | 0 | 0 |
| lada/samara | 1 | 0 | 0 |
| porsche/boxster | 4 | 0 | 0 |
| chrysler/pt-cruiser | 1 | 0 | 0 |
| lada/2104 | 1 | 0 | 0 |

84 attempted generations remain empty. Sources, failed leads and rejection reasons are in batch-5.json and unresolved-5.json. Unknown/undated families, ambiguous shared-body attribution and unusable tables remain absent rather than guessed. Existing broad BMW Z4/6/2 family cards were kept; their sourced early chassis engines do not claim complete generation histories. Follow-ups are listed in report-5.json.

## Public data size

New public rows contain engine facts and source URLs only; detailed evidence/notes stay in evidence-5.json under analysis and are hash-checked by the validator and global audit. Existing public metadata was left unchanged.

Model-card index raw bytes: 16823296 → 16902821 (delta 79525); gzip bytes: 1702143 → 1709033 (delta 6890). This measures the JSON index, not the deployed Worker.

## Validation and next step

Run node analysis/codex/second-source-engines.mjs --batch 5, then node analysis/codex/audit-engine-throughput.mjs. The batch validator compares all source/public cards with 670120d51fb0ceafc6cdb60bf81bbca7d400ee14, proves untouched cards and all generation-coupled files unchanged, checks the 40-character cap and verifies external evidence for each new row.

0 unvisited generations remain in queue.json. Continue with --batch 6 --queue analysis/codex/second-source-engines/queue.json --size 100; after wave 1 is visited, continue wave 2 (fleet 1–999). Visited gaps remain separately documented. No commit or publication performed.

## BMW structural migration and statistics

Z4: E85/E86 2002–2008, E89 2009–2016, G29 2018–2026. Řada 6 coupé/cabriolet: E24 1976–1989, E63/E64 2003–2010, F12/F13/F06 2011–2018. Existing Řada 6 Gran Turismo remains separate: G32 2017–2023. Řada 2: F22/F23 2013–2021 and G42 2021–open; Active/Gran Tourer remain separate lines.

Added 5 generation records, 9 facelift stages and 31 engine rows beyond the 243-row queue pass. G32 was not duplicated inside the coupé/cabriolet line, which would split/double-count its catalogue and statistics identity. Generic post-2018 6xx badges now use the documented G32 GT production window; overlap years still need explicit chassis evidence.

Mappings: old index 0 → [0,1,2] for Z4 and 6 coupé/cabriolet, → [0,1] for 2, → [0] with code G32 on GT. Old year-only listing IDs require chassis/year fallback, not a blanket rewrite. The E85 photograph stays on E85/E86, supported by its Commons depicts metadata. Unattributed family drawing entries were retired; files remain unchanged on disk and no misleading hold was assigned to a new first generation.

All BMW raw IS TP and register statistics were rebuilt. Make totals preserved. Per-line and generation populations: bmw-series/statistics.json. 514 vehicles now have a dedicated G32 GT line; the 6 coupé/cabriolet fleet changes from 2606 to 2059. The raw combined difference is explained by 34 records in the 1990–2002 production gap and one newly matched 1978 record (cohort-delta.json). Z4 retains 2867 vehicles; 2 Series changes 2463 → 2464 with its corrected 2013 production start. Manufacture/first-registration year proxies and transition-year overlap remain limitations.

Final validator: node analysis/codex/validate-second-source-batch-5.mjs. It validates the engine phase plus all four BMW card migrations, selector/drawing mappings, all source cards, frozen rebuild inputs, complete publishable raw cohorts and unaffected statistics.

The original wave-1 second-source queue is now fully visited, with unresolved attempts retained in unresolved-1.json through unresolved-5.json. This is not a claim of complete catalogue coverage. Wave 2 is prepared in wave-2-queue.json: 615 fleet lines and 651 empty engine generations. 67 wave-2 generations with existing incomplete-power rows are listed separately. Start the next batch from that file; public wave-2 edits have not started.
