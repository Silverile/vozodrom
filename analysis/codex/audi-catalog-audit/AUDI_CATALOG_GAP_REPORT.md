# Audi catalog audit — 2026-10-30

Status: two correction passes implemented; 76 identities and 102 generation records. Historical completeness, remaining derivative generations and artwork remain under review. This is not an exhaustive Audi master list.

## Repository findings

The site uses JSON source files and generated browser indexes, not a catalog database. The baseline contains 46 Audi cards and 72 generation-shaped records; several records represent an entire model history rather than a generation. No S/RS/SQ/TTS/TT RS identities were present in the source cards or public line index. Audi uses the full line selector in the seller form (it has no demo models in `lib/catalog.ts`). No UI filter was hiding those missing Audi records.

Source cards: `src/data/catalog/model-cards/audi.json`. Model lines: `src/data/catalog/model-lines-auto.json` plus `model-line-additions.json`. Browser data: `src/data/model-cards-index.json` and `model-lines-index.json`. `before.json` preserves the original Audi source rows; `inventory.json` is the resulting inventory. `audi_catalog_gap_report.json` records issues and their statuses.

## Implemented changes

| Area | Result | Evidence |
| --- | --- | --- |
| Public identities | 46 → 76; 30 added, zero merged/deleted; all old model slugs retained | Per-model source URLs in JSON report |
| Performance models | S1, S3–S8, RS 2/3/4/5/6/7, SQ2/5/7/8, RS Q3/Q8, TTS/TT RS | Audi factory report, rescue sheets and official model documents |
| Electric models | S6 e-tron, SQ6 e-tron, SQ8 e-tron, S e-tron GT, RS e-tron GT | Audi/VW official publications |
| allroad | A4 allroad quattro and A6 allroad quattro as related selectable identities | Audi type list |
| A4 | B5 (8D), B6 (8E/8H), B7 (8E/8H), B8 (8K), B9 (8W); existing order preserved; line/card B8 start aligned at 2007 | [Audi A4 history](https://www.audi.pl/pl/stories/styl-zycia/30-lecie-audi-a4-kultowego-modelu-lat-90/) |
| Audi 80 | B1 1972–1978, B2 1978–1986, B3 1986–1991, B4 1991–1996; earlier F103 remains separate | [ADAC generation entries](https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/audi/80/) |
| Audi 100 | C1 1968–1976, C2 1976–1982, C3 1982–1991, C4 1990–1994 | [ADAC](https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/audi/100/) |
| Audi 200 | C2 1979–1982, C3 1983–1991 | [ADAC](https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/audi/200/) |
| R8 | Type 42 and Type 4S; aggregate replaced with two generation records | [Audi history](https://www.audi.com/en/press-releases/the-audi-r8-a-captivating-legend-16374), [rescue sheets](https://www.audi.com/en/information-on-accident-rescue-17123), [type codes](https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/audi/r8/) |
| A7 | C7 (4G), C8 (4K) | [ADAC](https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/audi/a7/), Audi rescue sheets |
| F103 | Removed redundant brand prefix; retained slug and old-name alias | Existing source identity |
| Search | Seller model search accepts RS6 / RS 6 / RS6 Avant; exact resolver distinguishes S line, S, RS and electric identities | Regression checks |
| Artwork | Files retained. Old aggregate mappings for 80/100/200/R8/A7 quarantined; Audi missing artwork shows a text placeholder | `front-drawing-review.json` |

New identities have only model-specific generation evidence, without copied base-model dates or claims of current Czech sales. Family linkage is metadata, not a merger. S4 parent remains unresolved because its historic C4 lineage cannot be represented by a single A4 parent. RS e-tron GT performance remains a derivative to research, not another unrelated top-level model.

## Second correction pass

- Added 21 model-specific generation records: RS 2 (1), RS 3 (3), RS 4 (4), RS 5 (3), RS 6 (4), RS Q3 (2), TT RS (2), S2 (1), S6 plus (1). Sources live beside each generation in `performance.mjs` and in the catalog. Roman numerals are ordinal generation labels, not claimed chassis/type codes.
- [Audi's RS history](https://nieuws.audi.nl/audi-sport-viert-25-jaar-audi-rs-modellen/) supports the historical model introductions and body variants. Their introduction years are explicitly marked as such; unknown ending years stay unknown. RS 4 B5 uses the source's 2000 market-introduction entry rather than its 1999 presentation narrative.
- [RS 3 history](https://www.audi.com/en/media-releases/a-feast-for-the-senses-upgrade-for-the-audi-rs-3-16140) supports launches in 2011/2015/2021, second-generation production through 2020, Sedan arrival in 2017, and upgrades in 2017/2024. Upgrades do not increase generation count.
- [RS 6 history](https://www.audi.com/en/media-releases/20-years-four-generations-audi-rs-6-superior-performance-with-an-everyday-look-14795) and [the development interview](https://www.audi.com/en/media-releases/for-me-the-current-rs-6-is-the-crowning-achievement-of-two-decades-of-rs-history-14760) support C5–C8. Unknown recent ending dates do not inherit C5/C6's historical end or imply current production.
- RS 5 includes the [2026 plug-in hybrid generation](https://www.audi.com/en/media-releases/the-new-audi-rs-5-high-performance-in-a-hybrid-17012), with Sedan and Avant bodies. No new engine specifications are asserted in this pass.
- S2 was added with [manufacturer-documented Coupé production 1990–1995](https://magazine.audi.com.au/article/the-birth-of-s). Sedan/Avant scope remains unverified. S6 plus is a distinct selectable derivative related to S6, based on [Audi's 1996 introduction](https://www.audi.com/en/highlights-from-40-years-of-audi-sport-gmbh-15337/high-performance-models-made-by-quattro-15340); no unsourced end date was filled.
- Audi 920 now ends in 1940, as [Audi explicitly states](https://www.audi.com/en/press-releases/a-new-era-for-the-four-rings-60-years-since-the-first-post-war-audi-16734).
- Original `e-tron` and `e-tron Sportback` resolve to the retained `q8-e-tron` slug. The [2023 renaming/update](https://www.audi.com/en/the-audi-q8-e-tron-until-2025-15069/increased-efficiency-and-range-sharpened-design-the-new-audi-q8-e-tron-15070) is a facelift within one generation. `e-tron GT` remains separate.
- Public details distinguish production dates from model-introduction envelopes and explain that body styles may arrive later. End dates are still incomplete, so this is not yet suitable for strict year-based rejection of seller selections.

## Source conflicts and unresolved work

- ADAC's Audi 80 prose says five generations, but its named entries support four B-series generations plus facelifts. The implementation follows those named entries, not the prose count.
- R8 dates are generation envelopes: premiere 2006, first Coupé rescue coverage from 2007, first Spyder rescue coverage through 2016; second generation 2015–2024. ADAC's German sales entries end in 2023; Audi's manufacturer history ends in 2024. These are not universal body-specific production dates.
- A7 first generation rescue coverage extends to 2018 while ADAC German sales entries end in 2017. The broader envelope is retained. Model years, launch years and production months still need separate fields before precise variant coverage is claimed.
- A4 B6 end 2006 and B9 end 2025 remain inherited broader envelopes; European sedan/Avant references may end earlier. They were not silently converted to universal dates.
- Q7 third generation is [officially confirmed](https://www.audi.com/en/press-releases/third-generation-of-the-successful-suv-new-audi-q7-combines-versatility-and-performance-18004). Existing three-record structure is retained; G8 code and exact variant/year scope still require review.
- 21 of the 30 added identities still have no researched generation rows. All added identities need further engine/market verification; the nine researched lines still have incomplete end dates and body-specific intervals. Shared-platform rescue documents alone do not establish those intervals.
- S2 sedan/Avant, S6 plus ending year, 100 Coupé S and F103 marketed names need deeper verification. Q5 e-tron must be explicitly scoped to its market before inclusion. Historical prewar entries remain incomplete.
- A6 codes/years (including existing `4L` on the newest A6) and A4 → A5 successor links need separate verified corrections.
- Existing Audi artwork other than quarantined aggregate mappings remains pending visual review. No drawing was newly certified or overwritten. Accurate new drawings are still outstanding.
- Seller draft selection works from the public model line index. Dealer-feed import still uses the separate demo catalog and is outside this correction. The seller form is a local draft/preview, not a production publishing backend.
- Generation anchors are ordinal presentation anchors, not persisted database IDs. Old aggregate records are in the snapshot; newly split generations do not inherit their image or statistics identities. Listing data and model slugs were not rewritten.

## Apply, validate and rollback

Run from the repository root:

```powershell
node analysis/codex/audi-catalog-audit.mjs
node scripts/model-lines-index.mjs --make=audi
node scripts/model-cards-index.mjs --make=audi
node analysis/codex/audi-catalog-audit/validate.mjs
npm run typecheck
```

The migration is idempotent and snapshots Audi source rows only on its first run. The make-scoped index build preserves other brands. Do not run the old `night-audi-build.mjs` to regenerate this correction: it is a historical input generator and would discard the audit.

Rollback source data by replacing only Audi rows with `before.json`'s `cards`, `lines` and `additions`, then rebuild Audi indexes. Remove the five review registry keys only if reverting the corresponding split. Revert the search/placeholder changes separately. Do not reset shared files wholesale: the workspace contains unrelated ongoing work.

The old `night-audi-validate.mjs` asserts the historical 46-card snapshot and cannot validate the expanded catalog. Use the new regression check above. Validation results are recorded in `validation-results.txt`.
