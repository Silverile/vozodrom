# Batches 10-12 and E21 migration

| Batch | Wave | Visited | Enriched | Engine rows | No usable table | Already covered |
|---|---|---|---|---|---|---|
| 10 | 1 | 50 | 13 | 94 | 37 | 0 |
| 11 | 1 | 18 | 1 | 14 | 17 | 0 |
| 12 | 2 | 50 | 8 | 64 | 37 | 5 |

Table pass: 118 lines, 22 enriched, 172 engine rows. Generation source follow-up: Ceed ED +11, Astra F +4, BMW E12 +9; new E21 +9. Total this turn: **205 engine rows**, **1 generation added**, none removed, no facelifts added. No existing production dates changed.

Wave 1 table pass: 478/478 visited. Wave 2: 50/630 visited. Next table batch: 13. Engine-source gaps are still present: see secondary-source-progress.json for the fleet-ordered queue. Three existing lines received supplemental engine data; the second-source pass is not complete. Tucson NX5 remains empty deliberately.

BMW 3 before: E30/E36/E46/E90/F30/G20 plus four undated technical-sheet duplicates. After: E21 (1975-1983) prepended; all ten prior entries retained in their prior order. Old index i maps to i+1 for every i=0..9. Drawings: 0->1, 2->3, 4->5, with byte hashes preserved. Stats: keys 0..5 -> 1..6; values unchanged. No holds existed. Existing listing IDs E30/E36/E46/E90/F30/G20 unchanged; new ID E21 added to model-lines-auto and regenerated model-lines-index. Listing stats regenerated. E21 has **no population or STK aggregate** pending a raw-data rebuild; no values fabricated.

Sources and fact rows: catalogue-overlays.json. That manifest explicitly projects the small sourced additions onto the immutable engine-only baseline so later batches keep exact untouched-card validation. Protected migration files are checked against recorded SHA-256 hashes. Pre-overlay report hashes are retained as preOverlayBeforeHash. Original engine-only batch totals exclude the separately reported 33 supplemental/new-generation rows.

Movano: repaired the broken semicolon/bracket split to `2.2 diesel`; full original annotation remains in noteCs. Global audit now rejects unbalanced brackets. Jumper and 307 are unchanged. Ceed ED source includes production into 2013; existing protected 2006-2012 family dates were deliberately not changed and need a separately agreed review.
