# Sources and schema

Retrieved **2026-10-25 UTC** from [Wikidata Query Service](https://query.wikidata.org/sparql). Structured Wikidata data is [CC0 1.0](https://www.wikidata.org/wiki/Wikidata:Licensing); attribution is appreciated but not required. Suggested credit: “Vehicle identities from Wikidata contributors, retrieved 2026-10-25, CC0.” Editorial selection, display-name normalisation and field mapping were performed for Vozodrom. No marketplace database, Wikipedia prose or image asset is included. The licence statement applies to structured facts; it does not license logos or trademarks.

## Exact queries and evidence

- [All exact SPARQL queries, including probes](../../../analysis/codex/queries.md).
- [Compressed JSON snapshot: queries, results and HTTP retrieval log](../../../analysis/codex/wikidata-snapshot.json.gz). The endpoint uses its standard wd:, wdt:, p:, ps:, pq:, bd:, wikibase:, mwapi:, rdfs:, skos: and schema: prefixes.
- [Selection and explicit identity overrides](../../../analysis/codex/selection.mjs).
- [Coverage counts](../../../analysis/codex/coverage.json) and [analysis/integration proposal](../../../analysis/codex/makes-models.md).
- [Type definitions](./types.ts).

The snapshot contains 59 query/result entries. Key queries: makes-auto (broad discovery, not directly published), makes-direct, selected-labels-*, selected-aliases-*, selected-defaults-*, selected-search-* (identity resolution), selected-facts-* (country/foundation/dissolution), models-auto/moto (direct model and series classes), dates-auto/moto, production-auto/moto (manufacturer qualifiers), explicit-generations and model-brand-identities. Supplemental probes are retained for audit and do not automatically become catalogue records.

## Files

- makes.json: canonical commercial make selector entries, sorted by slug. Sections are **auto, moto, technika, pneu**; a make may appear in several. country/countryQid are null unless P17 gives one distinct country. countries preserves all source P17 values, including historical countries. qid identifies the canonical brand/manufacturer entity; relatedQids are reviewed source identifiers for model attribution and are not legal-entity equivalences. status is defunct only when canonical P576 exists, otherwise null. foundedYear uses unique P571; conflicting/missing years are null. Activity of a surviving commercial brand is not inferred from a manufacturer's corporate status.
- models-auto.json and models-moto.json: identity records sorted by slug, with makeSlug, qid, kind, body, productionStart/End, inceptionYear, discontinuedYear, manufacturerPeriods, codes, seriesQids, generations and raw class/brand/manufacturer QIDs. Model slugs are unique **within a make**, so route/cache keys must include makeSlug or use qid. Names prefer Czech then English source labels, with a redundant make prefix removed where matched.

## Extraction rules and limits

Models are discovered through **direct** P31 membership of car model Q3231690 / car model series Q59773381, or motorcycle model Q23866334 / series Q71310524. This misses models classified only through other classes. Brand P1716 takes precedence over manufacturer P176. An explicit unmapped brand is not silently replaced by its parent manufacturer. Unknown/ambiguous make matches and unreadable QID-only labels are excluded; their IDs and reasons are preserved in analysis/codex/excluded-models-*.json. Explicit concept/competition classes are filtered conservatively; unclassified variants may remain. Counts include models, variants, generations and series, and are **not** complete model-line counts.

Body maps exact P279 class labels to hatchback/kombi/sedan/suv/mpv/**kupe/kabriolet/pickup/dodavka**. Crossovers map to suv. A source size/market segment is not a body type. body=null when no single mapped body exists; bodyTypes preserves multiple alternatives. Motorcycle body is null rather than forced into a passenger-car body enum.

ProductionStart/End preserve unique direct P580/P582 year bounds, which need context review before treating them as authoritative global production periods. Manufacturer-specific P176 qualifiers are retained separately in manufacturerPeriods. P571 is preserved only as inceptionYear; P2669 only as discontinuedYear. Creative-work P2754 is unused. A null productionEnd is unknown, **not** an assertion of ongoing production. Missing or conflicting scalar values are null.

Generations require a same-make P179 parent relationship and an explicit generation description in the saved source. code is the unique P528 code if available, otherwise null; from/to use the same conservative direct date rules. P179 alone is not sufficient to infer a generation. Empty/unavailable generations are null. Raw seriesQids remain available even if their parent was not included.

No prices, sales volumes, registrations, STK outcomes, review counts, listing counts, engines or other statistics were invented. Active/defunct status and field coverage are incomplete; see the analysis before displaying these data as production-ready catalogue facts. Slug stability is maintained by analysis/codex/slug-registry.json; QID is the durable identity.

When a source model label explicitly starts with another selected make, a conflicting brand/manufacturer attribution is excluded as label-make-conflict. For example, a Daewoo-labelled shared model is not silently shown as a Chevrolet model. No brand is inferred solely from the label.

## Offline reproduction

Run node analysis/codex/resolve.mjs, then node analysis/codex/build-catalog.mjs, then node analysis/codex/validate-catalog.mjs from the repository root. All read the saved snapshot; network is not required.

<!-- model-lines-curation:start -->
## Curated European model-line layer (35 makes)

model-lines-auto.json is a separate manually selected layer containing 801 lines and 500 generation entries for the ten demo makes plus Audi, Mercedes-Benz, Peugeot, Citroën, Opel, Fiat, SEAT, Cupra, MINI, Volvo, Saab, Honda, Mazda, Nissan, Mitsubishi, Subaru, Suzuki, Lexus, Chevrolet, Daewoo, Daihatsu, SsangYong/KGM, Land Rover, Jaguar and Porsche. Its CatalogModelLine type is in types.ts. The 432-make identity dataset and raw model files remain unchanged.

Additional factual sources are individual **English Wikipedia model articles**, retrieved through https://en.wikipedia.org/w/api.php with exact revision IDs. Each model and generation lists permanent oldid source URLs. Full source URLs, request titles/timestamps and selected factual fields are in [model-line-evidence.json](../../../analysis/codex/model-line-evidence.json); manual grouping and all unresolved fields are in [model-lines-review.md](../../../analysis/codex/model-lines-review.md). No marketplace data, article prose, images or entire tables were reproduced. Wikipedia facts were not all independently confirmed with manufacturers. The earlier CC0 designation refers to Wikidata structured identities; it is not a blanket licence assertion for Wikipedia pages.

Dates retain source production bounds, not inferred Czech on-sale years. **to=null indicates continuing production only if productionStatus=current**; unknown ends also remain null with needsReview. dateScope distinguishes explicit Europe intervals from general source production. Shared-platform and renamed-badge dates are not inherited automatically. productionPeriods can describe separated runs or body variants and do not imply continuity. All 25 demo model slugs are preserved, notably volkswagen/id4. Missing generations/codes/body sets are null and require review; a nonzero generation array is not proof of a complete European sequence.

Offline validation: node analysis/codex/validate-model-lines.mjs. The 35 makes' selection is delivered; the remaining 5 and unresolved factual enrichment are not complete. Batch 1 added 124 lines. Batch 2 added 102 lines. Batch 3 adds 55 lines for Daihatsu, SsangYong/KGM, Land Rover, Jaguar and Porsche. All 746 prior entries are checked unchanged by per-make SHA-256 baselines in model-lines-batch-3-baseline.json.
Batch 3 corporate/consumer rename distinctions and a source-date conflict are recorded in [model-line-brand-notes.json](../../../analysis/codex/model-line-brand-notes.json).

Targeted manufacturer checks and factual corrections are recorded in [model-line-primary-facts.json](../../../analysis/codex/model-line-primary-facts.json):

- [Nissan Europe: nissan-cube-europe-2008](https://europe.nissannews.com/en-GB/releases/nissan-cube-comes-to-europe)
- [Mazda UK: mazda-6e-europe-2025](https://uk.mazda-press.com/news/2025/all-new-mazda6e-unveiled-at-brussels-motor-show/)
- [Honda Europe: honda-prelude-europe-2025](https://hondanews.eu/gb/en/cars/media/pressreleases/553584/honda-welcomes-back-iconic-prelude-nameplate-as-hybrid-sports-coupe-returns-to-europe-after-25-years)
- [Mitsubishi Motors: mitsubishi-grandis-europe-2025](https://www.mitsubishi-motors.com/en/newsroom/newsrelease/2025/20250702_1.html?intcid3=FBen_20250702_b)
- [Škoda Auto: skoda-octavia-2026](https://www.skoda-auto.cz/novinky/novinky-detail/2026-08-27-skoda-octavia-slavi-30-let-tri-dekady-ikonickeho-modelu)
- [Škoda Auto: skoda-production-2024](https://reporting.skoda-auto.com/archive/2024/production)
- [Škoda Auto: skoda-epiq-2026](https://www.skoda-auto.cz/novinky/novinky-detail/2026-10-06-skoda-epiq-prichazi-na-cesky-trh-za-doporucene-prodejni-ceny-od-619-000-kc)
- [BMW Group: bmw-3-production-2025](https://www.press.bmwgroup.com/global/article/detail/T0454448EN/50-years-of-bmw-3-series-production-%20-an-international-success-story)
- [Subaru Europe: subaru-crosstrek-europe-2023](https://www.subaru.eu/media/subaru-launches-all-new-crosstrek-in-europe)
- [Subaru Europe: subaru-bev-europe-2025](https://www.subaru.eu/media/subaru-confirms-new-electric-range-for-europe)
- [Suzuki Motor Corporation: suzuki-toyota-supply-2021](https://www.globalsuzuki.com/ir/library/annualreport/pdf/2021/2021.pdf)
- [Suzuki Motor Corporation: suzuki-e-vitara-report-2025](https://www.globalsuzuki.com/ir/library/annualreport/pdf/2025/2025.pdf)
- [Suzuki Motor Corporation: suzuki-europe-results-2026](https://www.globalsuzuki.com/ir/library/financialresults/pdf/2025/financial_presentation_s.pdf)
- [Lexus UK: lexus-lbx-europe-2023](https://media.lexus.co.uk/world-premiere-of-the-all-new-lexus-lbx/)
- [Lexus UK: lexus-lm-europe](https://media.lexus.co.uk/vehicles/lm-2023-current/)
- [Lexus Europe: lexus-europe-million-2020](https://newsroom.lexus.eu/lexus-records-one-million-sales-in-europe/)
- [Daihatsu Motor Co.: daihatsu-europe-end-2013](https://www.daihatsu.com/news/2011/11011401.html)
- [KGM Motors UK: kgm-uk-lineup-2026](https://www.kgm-motors.co.uk/)
- [KGM Motors UK: kgm-uk-history](https://www.kgm-motors.co.uk/blog/kgm-heritage-70-years-one-story/)
- [JLR: jlr-brand-identity-2023](https://www.jlr.com/news/2023/06/jaguar-land-rover-unveils-new-jlr-corporate-identity-it-accelerates-modern-luxury)
- [Porsche AG: porsche-production-end-2025](https://newsroom.porsche.com/en/annual-sustainability-report/combined-management-report/business-development/)

In particular, the manufacturer’s 2012–2020 Octavia III interval supersedes the retrieved Wikipedia end year; Epiq’s Czech-market presence was checked in an October 2026 Škoda announcement. Manufacturer source URLs supplement the permanent Wikipedia revisions; not every field has manufacturer corroboration.

<!-- model-lines-curation:end -->
