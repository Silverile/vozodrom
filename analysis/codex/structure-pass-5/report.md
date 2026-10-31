# Structure pass 5 and global statistics consistency

Reviewed the final 29 original candidates plus Mahindra CJ: 23 lines changed, seven parallel families retained. Added seven generation records (six Pontiac Grand Prix periods and RX5 Max); merged twelve body/update records. Made 25 date edits, added 5 facelift stages and enriched 4 existing stages. Five duplicate engine rows consolidated; scoped engine evidence retained. No new engines; 7,023 public rows remain.

Pontiac Grand Prix now has all eight families; Roewe RX5 Max is inserted between I and III. TVR Griffith 2017 and Spyker Preliator 2016/XXV 2026 are explicitly announcement-only where series production is not established. Pagani Utopia starts 2023 for customer-series cars, rather than its 2022 prototype reveal. Known simultaneous-production families retain open ends. Karmann Ghia Typ 34 is already a separate line and was not duplicated.

## Remaps

| Line | Before → after | Old → new index |
|---|---|---|
| mahindra/cj | 9 → 9 | 0→0, 1→1, 2→2, 3→3, 4→4, 5→5, 6→6, 7→7, 8→8 |
| mclaren/600lt | 2 → 1 | 0→0, 1→0 |
| mclaren/720s | 2 → 1 | 0→0, 1→0 |
| mclaren/artura | 2 → 1 | 0→0, 1→0 |
| mg/mg5 | 3 → 3 | 0→0, 1→1, 2→2 |
| microcar/rj49 | 2 → 1 | 0→0, 1→0 |
| nash/advanced-six | 2 → 2 | 0→0, 1→1 |
| nsu/6-10-6-18 | 4 → 4 | 0→0, 1→1, 2→2, 3→3 |
| omoda/5 | 2 → 1 | 0→0, 1→0 |
| pagani/utopia | 2 → 1 | 0→0, 1→0 |
| polestar/4 | 2 → 1 | 0→0, 1→0 |
| pontiac/grand-prix | 2 → 8 | 0→0, 1→7 |
| pontiac/vibe | 2 → 2 | 0→0, 1→1 |
| ram/700 | 2 → 2 | 0→0, 1→1 |
| volkswagen/karmann-ghia | 2 → 1 | 0→0, 1→0 |
| roewe/rx5 | 2 → 3 | 0→0, 1→2 |
| spyker/c8 | 4 → 4 | 0→0, 1→1, 2→2, 3→3 |
| tvr/griffith | 3 → 3 | 0→0, 1→1, 2→2 |
| wanderer/w11 | 2 → 1 | 0→0, 1→0 |
| wolseley-motors/hornet | 4 → 2 | 0→0, 1→1, 2→1, 3→1 |
| wolseley-motors/1100-1300 | 2 → 1 | 0→0, 1→0 |
| wuling-motors/rongguang | 2 → 2 | 0→0, 1→1 |
| wuling-motors/hongguang-mini-ev | 2 → 2 | 0→0, 1→1 |

Full names, years, codes, sources and listing IDs are in report.json. Duplicate engine rows share name/fuel/power; original scoped records are preserved in variantEvidence and body/trim references. No image files moved or retired. All 841 live drawings and review holds reference valid generations; changed drawing date ranges were refreshed. Validator proves 4,625 untouched source cards and all untouched public cards unchanged.

Also aligned 112 listing-selector records from passes 2–5 in model-line-additions.json. Earlier scripts updated only model-lines-auto.json, leaving addition-backed selectors stale. Full before/after IDs and remaps are recorded separately in listing-generation-alignment.json. Surviving codes remain; only previously approved Caterham 170/340/485 FE retire into S3. All unrelated addition records and listing lines are validated unchanged. The matcher reads cards directly, so this source alignment does not invalidate the raw rebuild.

## Sources and uncertainty

One source per fact. Source research and compact web evidence are adjacent JSON files. Some specialist Mahindra pages currently return Private Site directly; accessible source pages and search snapshots identify Indian starts/CJ4/CJ4A periods. Unknown ends remain absent and are not labelled current. Successor boundaries are explicit estimates. McLaren 600LT uses the chosen German infobox 2018–2021; individual-body production periods can differ. NSU 6/14 uses the production infobox start 1910, with conflicting 1909 prose noted.

Reviewed with Indian specialist history: CJ2A/CJ3A starts and CJ4 1967–1974 established; CJ3B end only early 1990s, CJ4A/CJ640 end only late 1990s, CJ540 end unknown. Exact years remain absent. Unknown ends are not labelled current.

## Whole-site matcher consistency

Requested 405 remaining/touched makes; 244 have publishable output. Combined with pass 4, all 432 known makes are covered by the identical new matcher. Reused make files are compared to commit 82ff28c. Every matcher output slug is inside this inventory. IS TP: all 1,094 days, 2023-10-12–2026-10-11. RSV snapshot: vypisvozidel.csv, built 2026-10-31. Make totals preserved; listing statistics regenerated.

Checked 951 fleet lines in this rebuild; 840 have generation aggregates. All 111 empty cases were checked against raw counts/dates; no eligible raw group of 30+ was dropped. Per-line count changes and disappeared published groups are listed in statistics-rebuild.json. Strict date exclusions retain records in make totals; individual exclusions were not manually reviewed. Undated catalogue generations remain a real coverage limitation.

Important alias follow-up: synthetic BMW 320D (2015) selects the historic 320 candidate and is then rejected; the existing series-3 normalization does not win the longest-name match. Historic 320 loses its false 22,258-car population, but the records are not reassigned to rada-3. This existing alias issue is recorded in matcher-followups.json, together with the largest fleet deltas. A corrected routing policy needs another raw rebuild. Explicit Suzuki SX4 S-CROSS (2017) was tested and correctly matches s-cross; its fleet delta alone does not prove an alias defect.

## Next publishable point

Original structure queue remaining: zero, with Mahindra exact-end follow-up above. This does not certify global historical completeness. Next is the fleet-ordered wave-1 second-source engine queue (523 generations without engines, excluding announcement-only records), then wave 2. Full application build/browser review/publication belongs to Claude. No commit or publication performed. Duplicated staged statistics files were removed after comparison; all 246 published output hashes are stored in statistics-rebuild.json, so validation does not depend on ignored temporary files. Raw aggregates remain local ignored artifacts, not files to commit.
