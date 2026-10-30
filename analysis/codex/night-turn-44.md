# Bridge delivery44 checkpoint

Updated: 2026-10-27T01:20:24.985Z. Scope: night-shift files only; protected Skoda and Claude-owned card files excluded. Saved coverage is partial, not complete global history or a complete table for every generation.

| Measure | Before | After |
| --- | ---: | ---: |
| makes | 40 | 49 |
| cards | 667 | 1025 |
| generationRecords | 909 | 1315 |
| versions | 243 | 338 |
| photoReferences | 114 | 203 |

| Newly saved make | Cards | Generation/family records | Versions | Photo references |
| --- | ---: | ---: | ---: | ---: |
| byd | 51 | 52 | 14 | 8 |
| cadillac | 49 | 52 | 1 | 3 |
| casalini | 12 | 14 | 2 | 2 |
| caterham | 2 | 8 | 4 | 3 |
| changan | 30 | 30 | 5 | 3 |
| chery | 29 | 39 | 6 | 3 |
| chevrolet | 76 | 84 | 29 | 15 |
| chrysler | 45 | 52 | 2 | 4 |
| citroen | 64 | 75 | 32 | 7 |

## Version coverage and Help wanted

Chevrolet: selected29 European engine/gearbox combinations in76 model-line cards; most historical and non-European version tables remain unfinished. Citroen: selected32 versions, including current Czech C3/C4; C5I, BerlingoII, Xantia and Xsara still need technical tables. BYD: selected14 European EV/PHEV variants, regional aliases grouped; latest China-only launches and full generation boundaries need work. These are useful additions, not the requested eventual full coverage.

Chery: six Czech configurations, source-market scopes and mass/consumption basis explicit. Tiggo7PHEV web/PDF disagree on engine output/torque and0–100; those disputed fields staynull. Casalini550:698kg gross mass was not entered as kerb mass;7.1s0–40 was not entered as0–100. Caterham: variants remain under Seven; PS/bhp source ambiguity was not converted into inventedkW. Per-make reports list exact omitted models and fields.

## Photo credits and reproducible rebuild

An audit found incorrect earlier Audi/BMW licence labels inferred from general HTML links. Exact-file Commons imageinfo/extmetadata evidence is saved in photo-credit-audit-44.json and photo-credit-rest-audit-44.json; corrections were applied to cards and stored patch batches. The integrator now reapplies verified credit evidence after make builders. Non-credit card fields were hashed immediately before and after corrections. BMW version preservation validation permits only these documented credit changes. BYD/Chevrolet builders were independently corrected; Citroen credit audit matched3/3exactfiles.

Rebuild order: make builders; bmw-versions-42/apply.mjs for BMW supplements; integrate-night-cards.mjs; merge-photo-patches-44.mjs (includes prior42batches); apply-photo-credit-evidence-44.mjs; validators. Do not regenerate application indexes before review. Claude owns scripts/model-cards-index.mjs and application integration. No commits or publishing. Temporary source-document and image binaries were removed after use.

1112 records still lack selected images. This is incomplete search/selection, not proof that no suitable Commons photograph exists. Photo backfill44 reports exact inspected selections and partially searched groups. Some reviewed images use rear3/4 or roomy4:3 with an explicit scope note; preferred3:2 front3/4 replacements remain useful.

Runtime: root plus three concurrent workers. All workers finish before handoff. NEXT: **cupra**; 167 makes remain on the queue.
