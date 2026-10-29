# Round 9 targeted depth: Infiniti and Hummer

Date: 2026-10-29. Scope remains **partial**, not a full-make depth signoff.

Infiniti: 23 cards / 45 generation rows inventoried; targeted changes on Q50, QX50, QX55, QX60, QX80 (5 rows). Eight substantive changes: missing Q50 2017 facelift; missing QX60 2025 facelift (MY2026); QX50 J55 and QX55 end years/statuses set to 2025/ended; QX60 L51 and QX80 Z63 status current. Plus 16 source/review maintenance entries. One missing-model proposal: QX65, now an official production-model offering, with production commencement left null pending factory evidence.

Hummer: 4 cards / 4 generation rows inventoried. Targeted H3T end year/status set to 2010/ended (2 substantive changes, 3 maintenance entries). GM August 2010 production table explicitly records 321 H3T units produced in calendar 2010, while contemporary KSLA reporting confirms closure in May. Existing H1/H2/H3 dates were inventoried without a new comprehensive two-source verification claim.

Photo metadata checks: Commons H1 description explicitly identifies H1 and matches its credit/license; H3 description explicitly identifies 2007–2008 H3 Luxury and matches Fir0002/GFDL. H2/H3T exact files occur in the respective model categories; direct description fetches failed. Infiniti Q50 Geneva 1079 occurs in Q50 category, but its direct file description failed; QX55 China(5) description also failed. No mismatches established, no photos changed, no new visual inspection claimed. Remaining Infiniti photos not rechecked in this targeted pass.

All changed substantive values have manufacturer/GM plus independent secondary corroboration. Manufacturer QX50/QX55 discontinued pages, contemporary Car and Driver reporting, and MotorTrend's January 2026 retrospective support the 2025 endpoints; dealership inventory is not treated as new production. Old report arrays were preserved exactly.

Validation: `node analysis/sweep/codex/round9-infiniti-hummer-validate.cjs` passed exact baseline replay for 29 logged edits, report-prefix preservation and strict CatalogModelCard TypeScript checking of both card files. No application build run. Python commands attempted initially failed because neither `python` nor the bridge-advertised Python path exists in this runtime; Node used successfully.

Root review adjustment: appended two further logged corrections to the Q50 and QX60 facelift objects, setting `productionYear` to null. Their reveal years remain 2017 and 2025; documented launch/sales dates do not establish factory switchover dates. Final validation passes 31 logged edits (26 Infiniti, 5 Hummer), including these two corrective operations; all old report entries remain intact. The ten substantive facts/fields described above remain the scope, with factory facelift timing explicitly unknown.

Remaining: all exact generation codes, unresolved historical Infiniti start/end dates and first-generation QX50 regional overlaps; complete European engines/trims; fuller Commons descriptions and visual identity review. QX80 earlier facelifts still need reconciliation (2014 and 2017 stages); not filled partially here.
