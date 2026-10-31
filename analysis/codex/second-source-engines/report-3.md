# Second-source engines, batch 3

Visited 100 queued generations, including G65/G45 and 98 original queue entries. Added **286 engine rows to 46 generations across 26 lines**. Catalogue engine rows: 8250 → 8536; generations with engines: 2155 → 2201. No generation identities, dates, facelifts, drawings, selectors or statistics changed.

| Line | Generations visited | Filled | Rows added |
|---|---:|---:|---:|
| bmw/x5 | 1 | 0 | 0 |
| bmw/x3 | 1 | 1 | 5 |
| mitsubishi/l200 | 4 | 2 | 4 |
| dacia/1300 | 2 | 0 | 0 |
| opel/kadett | 5 | 3 | 15 |
| peugeot/508 | 1 | 1 | 11 |
| mitsubishi/colt | 5 | 1 | 2 |
| honda/accord | 9 | 1 | 4 |
| mercedes-benz/cla | 1 | 1 | 4 |
| land-rover/freelander | 3 | 2 | 11 |
| bmw/rada-4 | 1 | 1 | 12 |
| land-rover/discovery | 4 | 2 | 13 |
| fiat/stilo | 1 | 1 | 9 |
| mazda/5 | 2 | 1 | 5 |
| fiat/uno | 1 | 0 | 0 |
| porsche/911 | 8 | 5 | 43 |
| mazda/mx-5 | 4 | 4 | 13 |
| mazda/323 | 7 | 1 | 9 |
| honda/hr-v | 3 | 3 | 7 |
| citroen/saxo | 1 | 1 | 8 |
| seat/arona | 1 | 1 | 7 |
| mitsubishi/lancer | 9 | 2 | 5 |
| porsche/cayenne | 4 | 4 | 22 |
| mitsubishi/pajero | 4 | 1 | 2 |
| opel/omega | 1 | 0 | 0 |
| mercedes-benz/gla | 1 | 0 | 0 |
| opel/agila | 1 | 1 | 6 |
| peugeot/107 | 1 | 0 | 0 |
| mazda/cx-30 | 1 | 1 | 3 |
| audi/q8 | 1 | 1 | 8 |
| dacia/bigster | 1 | 0 | 0 |
| lada/2105 | 1 | 0 | 0 |
| chrysler/voyager | 2 | 0 | 0 |
| audi/a8 | 3 | 3 | 34 |
| peugeot/205 | 1 | 1 | 24 |
| peugeot/405 | 1 | 0 | 0 |
| jeep/cherokee | 3 | 0 | 0 |

54 attempted generations remain empty. Sources, fetch failures and rejection reasons are recorded in batch-3.json and unresolved-3.json. G45 has five variants using explicit system power, never a sum of component outputs. Regional and future month-dated revisions are excluded. G65 stays unfilled because the available variant table starts in November/December 2026; no current availability or iX5 sibling power is assumed. Porsche numeric chassis articles can identify a generation even when production overlaps its successor.

## Data size

Public engine rows contain technical facts and source URLs only. Detailed table/generation evidence and annotations are stored in evidence-3.json under analysis; each public engine has a checked hash linking to that evidence. No research metadata was added to these public rows. Existing public metadata was left unchanged.

Generated model-card index: 16636954 → 16714671 raw bytes (delta 77717); 1687568 → 1693896 gzip bytes (delta 6328). This measures the JSON index, not the deployed Worker.

## Validation and next step

Run node analysis/codex/second-source-engines.mjs --batch 3 and node analysis/codex/audit-engine-throughput.mjs. The batch validator compares every source/public card to e136b674ff81aa79577aac1d48c55b53efe949f5, proves untouched cards unchanged and protected generation-coupled files unchanged, checks the 40-character limit and verifies external research evidence for every new row.

228 unvisited generations remain in queue.json. The 54 visited gaps are documented separately; G65 is one of them. Continue with --batch 4 --queue analysis/codex/second-source-engines/queue.json --size 100, then wave 2 after this queue. No commit or publication performed.
