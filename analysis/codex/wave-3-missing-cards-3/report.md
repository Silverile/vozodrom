# Missing-card batch 3 and duplicate consolidation

Baseline 587a8c3d50c45c3d46c9c9378b140ca4712c2a34. Added 9 cards, 12 generation/parallel-period entries and 1 engine row. Removed five duplicate proposals and excluded CX-5e pending identification: the located Mazda trademark is not an announced series-production vehicle. No alias to CX-6e was invented.

## Corrections to previous batches

Retired 26 duplicate cards added in batches 1–2 and merged their sourced facts into 26 existing canonical cards. The complete old-slug → canonical-slug and per-generation mappings, including 13 engine evidence moves, are in deduplication.json. Existing canonical engines, trims and photos are preserved, together with all four facelift events from the retired cards. The 1954 Studebaker 3R stage was restored after aggregation; a full-card projection check proves that only presentation facets changed and all generation matching data stayed identical. Wuling Cortez alias index 0 maps to canonical index 1 (index 0 is its separate 730 stream); other maps are explicitly listed.

- maruti-suzuki/dzire: Dzire I 2008–2012 | Dzire II null–2017 | Dzire III 2017–2024 | Dzire IV 2024–null → Dzire I 2008–2012 | Dzire II 2011–2017 | Dzire III 2017–2024 | Dzire IV 2024–null
- maruti-suzuki/1000-esteem: 1000 (1990–2000) / Esteem (1994–2007) 1990–null → 1000 1990–2000 | Esteem 1994–2008
- maruti-suzuki/kizashi: Kizashi – dovozní nabídka 2011–2014 → Kizashi 2009–2015
- studebaker/r-series-truck: 2R / 3R 1949–1954 → 2R / 3R 1948–1954
- uaz/uaz-69: GAZ-69 / GAZ-69A (výroba UAZ) 1956–1972 → GAZ-69 / GAZ-69A (výroba UAZ) 1954–1973

Maruti 1000/Esteem: old combined index 0 becomes 1000 at index 0, with concurrent Esteem at new index 1. Old alias esteem/0 maps to 1000-esteem/1. No drawings or holds exist on any retired alias or this split. No numeric statistics were summed or copied into a different generation. Raw IS TP + register statistics were rebuilt for Maruti-Suzuki and UAZ; see statistics.json. Microcar M.Go was left intact for explicit photo attribution at the structural pass.

## New-card scope

- moskvic/2315-pickup-on-2140-base (1 entries, 0 engines)
- opel/rocks-e-rocks-electric-model-line-l6e-quadricycle-decide-whether-it-belongs-in-auto (1 entries, 1 engines)
- packard/packard-1958-sedan-hardtop-station-wagon-packardbaker (1 entries, 0 engines)
- plymouth/suburban (3 entries, 0 engines)
- pontiac/strato-chief-canada (1 entries, 0 engines)
- pontiac/wave-canada-rebadged-chevrolet-aveo-t200 (1 entries, 0 engines)
- salmson/al (1 entries, 0 engines)
- santana-motor/santana-cajal (1 entries, 0 engines)
- santana-motor/santana-series-ii-iia-iii-88-109-licensed-land-rover (2 entries, 0 engines)

Packard MY1958 has unknown actual production start and known 1958 end. Salmson AL has known 1921 start and unknown end, not asserted current. Cajal is announcement-only; production is unconfirmed. Opel Rocks is explicitly L6e, so no false M1 body type is assigned. Plymouth Suburban, Pontiac Strato-Chief and Santana II/IIA are explicitly partial/coarse periods pending finer histories. Sources/proofs: plan.mjs, survey.json, report.json, and retained canonical source URLs.

## Validation and listing IDs

Joint validator: node analysis/codex/validate-missing-cards-3.mjs. PASS: 4718 untouched public/source cards unchanged, all 837 drawings present and correctly indexed, 1806 statistics keys valid. All original canonical engines, trims and photos retained; retired alias facts have destination proofs. Rebuilt make totals and all publishable raw cohorts checked before replacement. Drawings and holds unchanged.

Stored listing IDs were not queried or migrated. Old→new slugs and year-ID changes are explicit in deduplication.json. The former combined 1000/Esteem ID needs year/engine disambiguation, not blind replacement. Other year-ID changes cover Dzire II, Kizashi and Studebaker R-series. Codes remain unchanged where an identified generation survives.

The stock new-only validator PASS in the initial phase is superseded by the joint validator after consolidation. Card index delta: -5815 raw bytes / -119 gzip bytes. Build, typecheck, live page rendering and compiled Worker size are for Claude to check.
