# Structure pass 3

50 candidates reviewed; 43 lines changed; 3 parallel families retained; 4 identified lines need date follow-up. One generation added (Coronet III split from II), 23 pseudo/body/technical generations merged, 54 date edits, one facelift added (Cowin 2). No new engines: all 7,028 existing rows retained. Atom 3.5 keeps its existing 2012 launch stage instead of a duplicate 2013 stage.

One source per change; source URLs, before/after generations, old-to-new indexes and scoped date assumptions are in report.json and the research JSON files. Successor boundaries and base-chassis periods are explicitly labelled; they are not asserted as exact European tuning/derivative production dates.

## Index remaps

| Line | Generations before → after | Old → new index |
|---|---|---|
| abarth/ot-1000 | 2 → 1 | 0→0, 1→0 |
| acura/integra | 4 → 4 | 0→0, 1→1, 2→2, 3→3 |
| adler/vis-a-vis | 2 → 2 | 0→0, 1→1 |
| alfa-romeo/20-30-hp | 2 → 2 | 0→0, 1→1 |
| alpina/b4 | 2 → 2 | 0→0, 1→1 |
| alpina/b5 | 3 → 3 | 0→0, 1→1, 2→2 |
| alpina/b7 | 3 → 3 | 0→0, 1→1, 2→2 |
| arcfox/alpha-t5 | 2 → 1 | 0→0, 1→0 |
| arcfox/kaola | 2 → 1 | 0→0, 1→0 |
| ariel/atom | 4 → 4 | 0→0, 1→1, 2→2, 3→3 |
| ariel/nomad | 2 → 2 | 0→0, 1→1 |
| aston-martin/vantage | 3 → 3 | 0→0, 1→1, 2→2 |
| audi/rs-q3 | 2 → 2 | 0→0, 1→1 |
| audi/rs4 | 4 → 4 | 0→0, 1→1, 2→2, 3→3 |
| audi/tt-rs | 2 → 2 | 0→0, 1→1 |
| bac/mono | 5 → 4 | 0→0, 1→1, 2→2, 3→3, 4→3 |
| baic/bj30 | 2 → 2 | 0→0, 1→1 |
| bentley/derby | 2 → 2 | 0→0, 1→1 |
| brabus/190-w201 | 2 → 1 | 0→0, 1→0 |
| brabus/g-class | 4 → 2 | 0→0, 1→0, 2→0, 3→1 |
| brabus/sl-r129 | 2 → 1 | 0→0, 1→0 |
| caterham/seven | 7 → 4 | 0→0, 1→1, 2→2, 3→3, 4→1, 5→1, 6→1 |
| chery/fulwin | 2 → 2 | 0→0, 1→1 |
| daihatsu/copen | 2 → 2 | 0→0, 1→1 |
| daihatsu/rocky | 2 → 2 | 0→0, 1→1 |
| daimler-company/sovereign | 4 → 4 | 0→0, 1→1, 2→2, 3→3 |
| delage/d6 | 10 → 10 | 0→0, 1→1, 2→2, 3→3, 4→4, 5→5, 6→6, 7→7, 8→8, 9→9 |
| delage/d8 | 8 → 8 | 0→0, 1→1, 2→2, 3→3, 4→4, 5→5, 6→6, 7→7 |
| dkw/f12 | 2 → 1 | 0→0, 1→0 |
| dkw/f2 | 2 → 2 | 0→0, 1→1 |
| dodge/30-35 | 3 → 3 | 0→0, 1→1, 2→2 |
| dodge/coronet | 6 → 7 | 0→0, 1→1, 2→3, 3→4, 4→5, 5→6 |
| dodge/magnum | 3 → 3 | 0→0, 1→1, 2→2 |
| dodge/ramcharger | 3 → 3 | 0→0, 1→1, 2→2 |
| donkervoort/d8 | 4 → 1 | 0→0, 1→0, 2→0, 3→0 |
| donkervoort/s8 | 3 → 1 | 0→0, 1→0, 2→0 |
| ds-automobiles/ds-3 | 2 → 2 | 0→0, 1→1 |
| infiniti/g | 7 → 4 | 0→0, 1→1, 2→2, 3→2, 4→3, 5→3, 6→3 |
| jeep/gladiator | 2 → 2 | 0→0, 1→1 |
| kia/clarus | 2 → 1 | 0→0, 1→0 |
| kia/ev5 | 2 → 1 | 0→0, 1→0 |
| kia/seltos | 2 → 2 | 0→0, 1→1 |
| microcar/m-go | 2 → 1 | 0→0, 1→0 |

## Drawings and holds

Three duplicate merged-body drawings were retired without changing bytes: abarth--ot-1000--1, arcfox--alpha-t5--1, arcfox--kaola--1 → corresponding --retired-1.webp. They have no live manifest entry. All 841 live drawings and all review holds point to existing generations. No new images. Full source-card equality validation proves 4,605 untouched cards unchanged; all untouched public cards are unchanged.

## Statistics

Complete IS TP raw rebuild: 1,094 days, 2023-10-12–2026-10-11; RSV snapshot vypisvozidel.csv, built 2026-10-31. Requested all 48 makes from passes 2+3 plus Mercedes; 42 have publishable aggregates. Make fleet/STK totals preserved. Rebuilt listing-stats.json. Inputs are fingerprinted; the final Atom facelift-only correction was checked to leave every matcher-consumed name/code/date unchanged.

53 of 54 changed lines with fleet totals now have generation aggregates. Exception: Mercedes 300/350 prewar line has 1,328 loosely badge-matched records, manufacturing years 1939–2010, outside its 1926–1930 generation bounds. No generation group is invented. This is an existing badge-to-model alias problem (match.py line 122 accepts a sole line without a year bound), requiring a separate matcher correction and raw rebuild. Do not describe the 1,328 as verified prewar cars.

Across all 659 fleet lines in recomputed makes, 549 have generation aggregates; all 110 empty cases are audited in statistics-rebuild.json: undated generations, out-of-period/unknown years, or all matched groups below the privacy minimum of 30. No eligible raw group of 30+ was dropped. Many are pre-existing catalogue gaps outside this batch. Mercedes ambiguous-name matching is now deterministic; per-line changes are recorded under lineMatchingChanges.

## Listing IDs

Existing surviving code IDs preserved. Intentional Caterham variant IDs 170/340/485 FE merge into S3. Year IDs and merged-body IDs listed separately; Claude confirms year fallback and no stored-listing migration required.

## Date follow-ups

- abarth/1000: Coachbuilt derivatives are identified; exact Monomille production bounds not recovered from the source. Retain separate variants.

- bertone/freeclimber: Freeclimber and Freeclimber II are identified; source redirect does not establish all Bertone-specific production bounds.

- delage/type-co: CO/CO2/COE identified; exact COE end not established by the accessible source.

- dodge/custom: D19/D22 identified; archived reference PDF could not be fetched (response-size limit). Exact production dates remain absent.

## Next

79 candidates remain in next-queue.json, plus the four date follow-ups above. Then resume the wave-1 second-source engine pass and wave 2. Full application build/publish belongs to Claude; no commit or publication performed here.
