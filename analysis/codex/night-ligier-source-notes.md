# Ligier: delivery 68, 2026-10-27

Partial road-production catalogue. Source list and proposed lines are in `night-ligier-report.json`.

The manufacturer history and Polish dealer chronology distinguish the road JS2 and the subsequent microcars. The French encyclopedia groups JS4/6/8/10/Série5, Série7/Optima/Prima and162/Ambra; this catalogue deliberately retains those families rather than inventing separate production boundaries. Nova has conflicting introduction dates; its from/to remain null. JS50 original from2013 follows the dealer's explicit production statement, rather than the encyclopedia's2012 launch. NewJS50/JS60/Myli/Pulse4 launch dates are not entered as production dates. Null ends do not assert ongoing production.

Selected JS50 engines use the OEM legacy product page. The Myli November2023 technical sheet was readable as a search-index extract, but direct retrieval returned404 on this turn. Its exact URL remains recorded; this limitation is not a claim that the live brochure was downloaded. Dealer-hosted manufacturer product page https://probike.ligier.fr/product/myli/ independently retains the499.8cm³/6kW/26Nm diesel,425kg,2958×1499×1541 dimensions. Electric5.6kW is explicitly an R85 thirty-minute rating; it is not peak power. WMTC63/123/192km are battery-specific published ranges, not calculated from capacity. Electric mass is not mapped across trim/battery combinations. No consumption cycle was inferred.

Photos: category files, subcategory/file-name checks and exact Commons imageinfo metadata. Every chosen thumbnail was inspected. JS2 andJS60 have approximately4:3 framing (1.335/1.333), a documented fallback to the preferred1.4–1.7. JS2 lacks API Artist; file history explicitly records Stahlkocher with source own image, and the API supplies CC BY-SA3.0. No footer licence inference. Rejected: racecars/JS2R, misindexed search matches, tight-bottom Myli shot. Search scope is partial, not proof that missing photographs do not exist.

Offline rebuild order:
1. `node analysis/codex/night-ligier-build.mjs`
2. `node analysis/codex/night-luaz-build.mjs` (needed if replaying the shared two-make photograph patches)
3. `node analysis/codex/night-ligier-finish.mjs` (retained batches, no network; includes explicit4:3 notes)
4. `node analysis/codex/night-ligier-report-finalize.mjs`
5. `node analysis/codex/night-ligier-validate.mjs`
6. `node analysis/codex/night-luaz-validate.mjs`

Search scripts/API caches document research, not mandatory rebuild steps. Re-running builders removes integrated flags/photos; root owns later integration. Do not rebuild after root freeze.

Final aspect fallbacks also include BeUp, Pulse4 andX-Pro (and LuAZ1302), not only JS2/JS60. Each exact aspect is now stated in its individual photograph note and enumerated in the report. The preferred in-range selections are Ambra, Ixo, JS50L, X-TooMax and LuAZ969M. Optimax/Flex surfaced during photograph search but remain a follow-up for independent production identity/specification evidence.
