# Turn 6 — partial depth and series-production year recheck

Seven makes, 11 updated model lines, **65 new audit entries**. Three parallel workers covered Cupra/Chrysler, Lexus/Dodge, and Jaguar/Daewoo/Lancia; root rechecked earlier year edits and integrated verification. All 125 owned makes remain depth-incomplete. No Git writes.

| Make | Updated lines | Audit entries | Main result |
| --- | --- | ---: | --- |
| Cupra | Born, Formentor, Leon | 12 | Missing 2026/2024/2024 facelift events |
| Chrysler | Crossfire | 10 | ZH code; series production 2003–2007; selected German Roadster automatic |
| Lexus | CT, LC | 17 | CT 200h technical row; both LC body variants ended/2026 |
| Dodge | Caliber | 9 | Three European engine summaries; independent corroboration for existing rows |
| Jaguar | E-type | 4 | Earlier 1965 first-build date replaced with null pending series-production resolution |
| Daewoo | Kalos | 5 | European 1.4 61 kW five-speed manual technical row and hatchback dimensions |
| Lancia | Lybra, Ypsilon | 8 | Series starts 1999/2003; four Ypsilon launch-engine summaries |
| Total | 11 updated lines | 65 | Three technical rows and eight engine-summary rows |

Counts include source arrays, review cleanup and scope notes; they are not counts of independently verified specifications. Individual fields inside grouped row insertions are not counted separately. Source URLs and before/after values are in each make report. Worker details are in `round6-lexus-dodge-notes.md`, `ROUND6-JDL-NOTES.md`, and `round6-cupra-chrysler.cjs`.

## Series-production convention

`TURN-6-YEAR-RECHECK.json` inventories **58 prior explicit applied/proposed operations, representing 39 distinct generation starts**, plus four grouped-generation operations. Every inventory entry has a recheck disposition; this does **not** mean every date now has independent two-source certification.

- Reversed E-type Series 1 2+2 **1965 → null**: JDHT first numbered builds and JCNA chassis chronology do not securely establish the same series start. A new superseding shared-file proposal explicitly withdraws the earlier 1965 proposal; leave null if it was never applied, restore null if it was. Earlier audit history is preserved.
- BMW i5 2023, i7 2022, iX1 2022, iX2 2023, iX3 2020 remain consistent with actual factory production evidence. Pacifica 2016, Lexus LC Convertible 2020 and RX L 2017 are likewise supported by production statements/indexes.
- Alfasud 1972, AC 3000ME 1979, Bertone X1/9 1982, Bellel 1962 and Aprilia 1937 remain distinct from their earlier presentation dates.
- Bugatti Divo 2019 remains tied to an explicit December2019 OEM small-series production statement; April2020 development/delivery language is recorded as a conflict, not silently treated as proof of a 2020 production start.
- Ford Capri's **1968 proposal** remains supported by an indexed OEM chronology (December production ramp-up, January1969 premiere). Direct Ford PDF retrieval timed out; no Claude-owned winning file was edited.
- Audi A3/A4/Cabriolet, Acadiane, C4 Picasso, Lexus IS SportCross and Jaguar XF Sportbrake retain cycle/retail evidence but still need exact factory-SOP corroboration. Volt's second-generation 2015 introduction is confirmed by the issuer filing; exact SOP certification remains open.

The inventory covers previously logged explicit operations and four identified grouped operations. It is not a new certification of every existing catalogue year or an audit of all originally added cards.

## Substantive findings and limits

Cupra's three missing facelifts are supported by manufacturer releases and ADAC. Crossfire's new selected German Roadster automatic row has 3199 cc, 160 kW, 310 Nm, five-speed automatic, rear-wheel drive, 250 km/h and 6.9 s; mass remains null because the OEM publishes a configuration range.

CT 200h distinguishes **73 kW combustion-engine output from 100 kW hybrid-system output**. Its dimension/weight disagreements are retained as conflicts instead of merging facelift and mass conventions. The two LC rows now end in 2026: Lexus Japan marks sales ended, the current factory-delivery list omits LC, and Road & Track reports direct Lexus confirmation plus the August2026 production schedule. A last-unit factory certificate was not obtained.

Kalos technical data come from independently published ADAC and ANWB club tables labelled manufacturer figures, not two original Daewoo brochures. ANWB was accessible as indexed text; direct open failed. EU/empty/running masses were not merged. Selected hatchback dimensions are not generalized to the sedan.

No photo was replaced. Workers checked selected CT, Caliber and Kalos description/licence evidence; no new pixel review was performed. Full image identity checks, complete engine/trim ranges, summaries and all other model lines remain open. No make or model is marked fully depth-complete.

## Verification

- `node analysis/sweep/codex/validate-turn6.mjs`: PASS exact replay of all 65 mutations against the captured baseline; prior report arrays preserved; each new operation has at least two source URLs; all seven complete card arrays pass strict `CatalogModelCard[]` checks.
- `node analysis/sweep/codex/validate.mjs`: PASS 125 reports / 828 cumulative sourced audit entries, compared with 763 before this turn.
- The broader validator initially rejected a valid later nested Kalos edit because it compared an earlier parent-array snapshot directly with the final object. It now applies subsequent descendant operations and recognizes superseding ancestor operations. The independent full baseline replay also passes; catalogue history was preserved.
- `node analysis/sweep/codex/finalize-year-recheck.cjs`: PASS 58 explicit operations and four grouped operations inventoried, zero entries left without a disposition. Open SOP/conflict statuses remain explicit.
- Worker verifiers additionally passed exact replay and strict types for their files. No application build, runtime UI test or comprehensive source certification was run. Temporary typecheck files were removed; tsconfig.tsbuildinfo was not touched.

## Handoff

All catalogue edits are in the seven owned a–l make files. No shared index or Ford/Hyundai winning-file edit was made. Seven DEPTH progress lines and refreshed structural backlog entries are recorded. Remaining work is comprehensive generation/code/status/facelift/European specifications/photo/summary depth across these and earlier makes, the explicitly open production-boundary checks, and untouched lower-fleet makes. Shared-file proposals still require separate reconciliation. Continue with fleet ranking; selected checks in these seven makes do not exhaust them.
