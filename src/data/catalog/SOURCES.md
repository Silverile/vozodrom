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
## Curated European model-line layer (40 makes)

model-lines-auto.json is a separate manually selected layer containing 926 lines and 548 generation entries for the ten demo makes plus Audi, Mercedes-Benz, Peugeot, Citroën, Opel, Fiat, SEAT, Cupra, MINI, Volvo, Saab, Honda, Mazda, Nissan, Mitsubishi, Subaru, Suzuki, Lexus, Chevrolet, Daewoo, Daihatsu, SsangYong/KGM, Land Rover, Jaguar, Porsche, Jeep, Alfa Romeo, Lancia, smart and MG. Its CatalogModelLine type is in types.ts. The 432-make identity dataset and raw model files remain unchanged.

Additional factual sources are individual **English Wikipedia model articles**, retrieved through https://en.wikipedia.org/w/api.php with exact revision IDs. Each model and generation lists permanent oldid source URLs. Full source URLs, request titles/timestamps and selected factual fields are in [model-line-evidence.json](../../../analysis/codex/model-line-evidence.json); manual grouping and all unresolved fields are in [model-lines-review.md](../../../analysis/codex/model-lines-review.md). No marketplace data, article prose, images or entire tables were reproduced. Wikipedia facts were not all independently confirmed with manufacturers. The earlier CC0 designation refers to Wikidata structured identities; it is not a blanket licence assertion for Wikipedia pages.

Dates retain source production bounds, not inferred Czech on-sale years. **to=null indicates continuing production only if productionStatus=current**; unknown ends also remain null with needsReview. dateScope distinguishes explicit Europe intervals from general source production. Shared-platform and renamed-badge dates are not inherited automatically. productionPeriods can describe separated runs or body variants and do not imply continuity. All 25 demo model slugs are preserved, notably volkswagen/id4. Missing generations/codes/body sets are null and require review; a nonzero generation array is not proof of a complete European sequence.

Offline validation: node analysis/codex/validate-model-lines.mjs. All 40 makes in the agreed queue are represented; unresolved factual enrichment remains incomplete. Batch 1 added 124 lines. Batch 2 added 102 lines. Batch 3 added 55 lines. Batch 4 adds 82 lines for Jeep, Alfa Romeo, Lancia, smart and MG. All 801 prior entries are checked unchanged by per-make SHA-256 baselines in model-lines-batch-4-baseline.json.
Corporate/consumer rename distinctions, a source-date conflict and the historic/SAIC MG split are recorded in [model-line-brand-notes.json](../../../analysis/codex/model-line-brand-notes.json).

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
- [MG Motor Europe: mg-europe-range-2026](https://www.mgmotor.eu/)
- [MG Motor Europe: mg-s5-europe-2025](https://news.mgmotor.eu/press/mgs-electrifying-five-star/)
- [MG Motor Europe: mg-s6-europe](https://www.mgmotor.eu/model/mgs6)
- [smart Europe: smart-5-europe-2025](https://media.smart.com/en-CEU/260574-the-most-spacious-versatile-and-technologically-advanced-smart-redefines-its-segment/)
- [MG Motor France: mg-saic-history-2024](https://news.mgmotor.eu/wp-content/uploads/2024/03/CP-MG-Motor-partenaire-central-du-Festival-of-Speed-de-Goodwood-2024-1.pdf)
- [Alfa Romeo / Stellantis: alfa-junior-name-2024](https://www.media.stellantis.com/uk-en/alfa-romeo/press/alfa-romeo-milano-name-is-not-okay-junior-then)
- [Alfa Romeo: alfa-mito-end-series](https://www.alfaromeo.com/end-of-series/mito)
- [Skoda Auto: skoda-peaq-production-2026](https://www.skoda-storyboard.com/en/press-releases/skoda-auto-launches-production-of-the-new-peaq-in-mlada-boleslav/)
- [Škoda Auto / official importer: undefined](https://www.skoda-auto.com/world/timeline)
- [Škoda Auto / official importer: undefined](https://www.skoda-storyboard.com/cs/historicke-vozy-cs/skoda-garde-pred-40-lety-zamirila-do-bratislavy/)
- [Škoda Auto / official importer: undefined](https://www.skoda-storyboard.com/en/press-releases/skoda-110-r-1970-1980-elegant-coupe-and-basis-for-many-sporting-successes/)
- [Škoda Auto / official importer: undefined](https://www.skoda-storyboard.com/cs/tiskove-zpravy-archiv/125-let-skoda-auto-pribehy-mene-znamych-modelu-skoda-felicia-fun/)
- [Škoda Auto / official importer: undefined](https://www.skoda-storyboard.com/en/press-releases/90th-anniversary-of-the-skoda-product-family-with-steel-backbone/)
- [Škoda Auto / official importer: undefined](https://cdn.skoda-storyboard.com/2023/01/CZ_Skoda-Auto-Rok-2023-je-plny-zajimavych-vyroci_d8526d74.pdf)
- [Škoda Auto / official importer: undefined](https://webapps.skoda-auto.sk/Cenniky-a-katalogy/techdata/Skoda_Fabia_technickeudaje.pdf?202410241043=)
- [Škoda Auto / official importer: undefined](https://www.skoda-storyboard.com/en/press-kits/skoda-scala-and-skoda-kamiq-media-launch-press-kit/powertrains-even-more-efficient-tsi-petrol-engines-from-the-latest-evo2-generation/)
- [Škoda Auto / official importer: undefined](https://www.skoda-storyboard.com/en/press-kits/the-all-skoda-superb-press-kit-2/powertrains-debut-of-mild-hybrid-plug-in-hybrid-with-up-to-120-kilometres-of-electric-range/)
- [Škoda Auto / official importer: undefined](https://cdn.skoda-storyboard.com/2024/04/05_Tiskova_mapa_Skoda_Kodiaq_Media_launch_Pohonne_jednotky_675cec68.pdf)
- [Škoda Auto / official importer: undefined](https://cdn.skoda-storyboard.com/2025/06/Skoda_Elroq_Technical_data_d5686460.pdf)
- [Škoda Auto / official importer: undefined](https://www.skoda-storyboard.com/en/press-kits/skoda-octavia-media-launch-press-kit/powertrains-four-petrol-and-two-diesel-engines-as-well-as-two-mild-hybrid-options/)
- [Škoda Auto / official importer: undefined](https://www.skoda-storyboard.com/en/09-skoda-4r-limousina/)
- [Škoda Auto / official importer: undefined](https://www.skoda.hr/svijet-marke/povijest-marke-skoda/skoda-vremenska-lenta)
- [Škoda Auto / official importer: undefined](https://cdn.skoda-storyboard.com/2016/05/skoda-auto-annual-report-2011.pdf)
- [Škoda Auto / official importer: undefined](https://cdn.skoda-storyboard.com/2022/04/SKODA_KAROQ_ML_Motory-SK.pdf)
- [Škoda Auto / official importer: undefined](https://webapps.skoda-auto.sk/Magazin/skoda_magazin_zima_2012.pdf)

In particular, the manufacturer’s 2012–2020 Octavia III interval supersedes the retrieved Wikipedia end year; Epiq’s Czech-market presence was checked in an October 2026 Škoda announcement. Manufacturer source URLs supplement the permanent Wikipedia revisions; not every field has manufacturer corroboration.

<!-- model-lines-curation:end -->

<!-- skoda-cards:start -->
## Skoda structured model-card pilot

The pilot covers 17 modern model lines and 27 generation records. One Drom make-level checklist page was manually viewed: https://www.drom.ru/catalog/skoda/. No Drom images, prose or bulk page downloads were used; specification facts were checked through Wikipedia/Wikidata/manufacturer sources. Historical and regional omissions are explicit in analysis/codex/skoda-card-scope-review.json.

Factual Wikipedia infobox fields and fixed revisions are in analysis/codex/skoda-card-evidence.json. Selected OEM facts and dated PDF scopes are in analysis/codex/skoda-card-manufacturer-facts.json. Commons author/licence/file metadata and retrieval requests are in analysis/codex/skoda-card-photo-evidence.json. Every generation carries source URLs; every photo carries its file-page URL, author, licence and credit. File-specific Commons licences apply to photos; neither their images nor their licence obligations become CC0 through this dataset. No image binary was copied into the repository. Visual/facelift correspondence is pending.

Exact displacement in cc is not calculated from nominal marketing litres. A null electric displacement means not applicable; other unknown values are listed in needsReview. Specification scope distinguishes selected model year, market and variant from the entire generation. Engine/facelift lists remain partial. Peaq is isolated in model-line-additions.json with its manufacturer source; the original 883 lines remain unchanged.

Manufacturer specification/facelift URLs used by the cards:
- https://cdn.skoda-storyboard.com/2025/06/Skoda_Elroq_Technical_data_d5686460.pdf
- https://cdn.skoda-storyboard.com/2025/06/TD-Octavia-en_3066a520.pdf
- https://www.skoda-storyboard.com/en/press-kits/skoda-octavia-media-launch-press-kit/skoda-octavia-refreshing-the-brands-best-seller/
- https://www.skoda-storyboard.com/en/press-kits/skoda-scala-and-skoda-kamiq-press-kit/skoda-scala-and-kamiq-comprehensive-update-for-the-successful-compact-models/
- https://www.skoda-storyboard.com/en/press-releases/skoda-auto-launches-production-of-upgraded-scala-and-kamiq/
- https://cdn.skoda-storyboard.com/2017/09/170915-%C5%A0KODA-FAVORIT-Entering-an-era-of-success-30-years-ago.pdf
- https://cdn.skoda-storyboard.com/2019/10/191015-Anniversary-25-years-of-the-%C5%A0KODA-FELICIA.pdf

Photo metadata endpoint: https://commons.wikimedia.org/w/api.php. Reuse guidance: https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia.
<!-- skoda-cards:end -->

<!-- skoda-range-step2:start -->
## Škoda range and selected technical versions — step 2

Retrieved 2026-10-26. The original 17-card pilot is extended to 59 cards, 70 generation/family records and 90 selected technical/engine versions. This supersedes the pilot's historical/regional omissions, without claiming an exhaustive inventory. New line objects are isolated in model-line-additions.json; original 883 line objects are unchanged.

Factual Wikipedia infobox snapshots (English/Czech), revision IDs and API requests: analysis/codex/skoda-card-evidence.json. Commons metadata/requests: analysis/codex/skoda-card-photo-evidence.json. Only facts and reference metadata retained, no prose or image binaries. Selected manufacturer/version facts: analysis/codex/skoda-trim-facts.mjs; source chronology overrides: analysis/codex/model-line-primary-facts.json. Nulls, rejected combinations, scope conflicts and missing work: analysis/codex/skoda-range-review.json and model-lines-review.md.

Wikidata identity data remain CC0. Wikipedia prose/tables have not been copied; Czech summaries are independently written. Photo licences are file-specific and must be honoured when an image is displayed; keep the credit and file-page link. All photo visual reviews remain pending.

Additional manufacturer/reference URLs checked for selected facts:

- https://www.skoda-auto.com/world/timeline
- https://www.skoda-storyboard.com/cs/historicke-vozy-cs/skoda-garde-pred-40-lety-zamirila-do-bratislavy/
- https://www.skoda-storyboard.com/en/press-releases/skoda-110-r-1970-1980-elegant-coupe-and-basis-for-many-sporting-successes/
- https://www.skoda-storyboard.com/cs/tiskove-zpravy-archiv/125-let-skoda-auto-pribehy-mene-znamych-modelu-skoda-felicia-fun/
- https://www.skoda-storyboard.com/en/press-releases/90th-anniversary-of-the-skoda-product-family-with-steel-backbone/
- https://cdn.skoda-storyboard.com/2023/01/CZ_Skoda-Auto-Rok-2023-je-plny-zajimavych-vyroci_d8526d74.pdf
- https://webapps.skoda-auto.sk/Cenniky-a-katalogy/techdata/Skoda_Fabia_technickeudaje.pdf?202410241043=
- https://www.skoda-storyboard.com/en/press-kits/skoda-scala-and-skoda-kamiq-media-launch-press-kit/powertrains-even-more-efficient-tsi-petrol-engines-from-the-latest-evo2-generation/
- https://www.skoda-storyboard.com/en/press-kits/the-all-skoda-superb-press-kit-2/powertrains-debut-of-mild-hybrid-plug-in-hybrid-with-up-to-120-kilometres-of-electric-range/
- https://cdn.skoda-storyboard.com/2024/04/05_Tiskova_mapa_Skoda_Kodiaq_Media_launch_Pohonne_jednotky_675cec68.pdf
- https://cdn.skoda-storyboard.com/2025/06/Skoda_Elroq_Technical_data_d5686460.pdf
- https://www.skoda-storyboard.com/en/press-kits/skoda-octavia-media-launch-press-kit/powertrains-four-petrol-and-two-diesel-engines-as-well-as-two-mild-hybrid-options/
- https://cdn.skoda-storyboard.com/2022/04/SKODA_KAROQ_ML_Motory-SK.pdf
- https://www.skoda.hr/svijet-marke/povijest-marke-skoda/skoda-vremenska-lenta
- https://www.skoda-storyboard.com/en/09-skoda-4r-limousina/
- https://cdn.skoda-storyboard.com/2016/05/skoda-auto-annual-report-2011.pdf
- https://webapps.skoda-auto.sk/Magazin/skoda_magazin_zima_2012.pdf

The official importer Fabia PDF returned different revision values than its indexed search excerpt (height 1464 mm versus 1459 mm); structured records use the opened PDF and identify the scope. Manufacturer conflicts for 422/860/VOS/Felicia Fun and related-model contamination in the Indian Rapid source are explicitly retained for review. The list-of-vehicles page was used only as a coverage checklist: https://en.wikipedia.org/wiki/List_of_%C5%A0koda_vehicles . No new Drom pages or photos were used in this step.
<!-- skoda-range-step2:end -->

<!-- skoda-specs-step3:start -->
## Škoda specifications step 3 — 26 October 2026

Selected named-version facts and explicit conflicts are retained in analysis/codex/skoda-specs-step3.mjs and the final applied skoda-specs-step3-evidence.json. Factual English/Czech Wikipedia revisions and manufacturer publications were used; no marketplace database or Drom page was used. Old step-2 counts above are historical; current output has 113 selected version records, not an exhaustive set.

Every newly mapped populated field uses `fieldSources`; power standards are explicit where known. Differing measurement standards are identified, and unresolved body/year/value conflicts stay null. Exact capacities are never computed from nominal litre labels. Facts were independently structured, with no copied source prose or complete tables. Existing Wikidata CC0 identity licensing and file-specific Commons photo licences remain unchanged.

Sources checked for selected specifications:

- https://cs.wikipedia.org/w/index.php?oldid=26216420
- https://cs.wikipedia.org/w/index.php?oldid=26245159
- https://cs.wikipedia.org/w/index.php?oldid=26255881
- https://cs.wikipedia.org/w/index.php?oldid=26136151
- https://cs.wikipedia.org/w/index.php?oldid=26326808
- https://cs.wikipedia.org/w/index.php?oldid=26215791
- https://www.skoda-storyboard.com/en/press-kits/classic-days-2026-press-kit/skoda-favorit-136-l-1988-1994/
- https://www.skoda-storyboard.com/en/skoda-world/heritage/happy-birthday-dear-favorit/
- https://www.skoda-storyboard.com/en/press-releases/celebrating-30-years-of-the-skoda-felicia-the-brands-first-model-under-the-vw-groups-wing/
- https://cdn.skoda-storyboard.com/2016/09/160905-Series-production-of-best-selling-%C5%A0KODA-OCTAVIA-began-20-years-ago.pdf
- https://www.skoda-storyboard.com/en/press-kits/classic-days-2026-press-kit/skoda-octavia-1959-1964/
- https://www.skoda-storyboard.com/en/press-kits/classic-days-2026-press-kit/skoda-felicia-1959-1964/
- https://www.skoda-storyboard.com/en/press-kits/classic-days-2026-press-kit/skoda-1100-mbx-1967-1969/
- https://www.skoda-storyboard.com/en/press-kits/classic-days-2026-press-kit/the-skoda-1101-tudor-celebrates-its-80th-anniversary/
- https://www.skoda-storyboard.com/en/press-kits/classic-days-2026-press-kit/skoda-popular-monte-carlo-1936-1939/
- https://www.skoda-storyboard.com/en/press-kits/classic-days-2026-press-kit/skoda-superb-3000-ohv-1938-1949/
- https://cs.wikipedia.org/w/index.php?oldid=26165769
- https://cs.wikipedia.org/w/index.php?oldid=25452147
- https://cs.wikipedia.org/w/index.php?oldid=25082854
- https://www.skoda-storyboard.com/en/press-releases/55-years-of-the-skoda-1000-mb-the-first-czech-mass-produced-car-celebrates-its-anniversary/
- https://cs.wikipedia.org/w/index.php?oldid=26215787
- https://www.skoda-storyboard.com/cs/tiskove-zpravy-archiv/veterany-na-upati-alp-vozy-skoda-na-startu-rally-bodensee-klassik/
- https://webapps.skoda-auto.sk/Magazin/skoda_magazin_leto_2013.pdf
- https://www.skoda-storyboard.com/en/press-releases/20-years-of-skoda-octavia-jubilee-for-the-heart-of-the-brand/
- https://cdn.skoda-storyboard.com/2025/06/Skoda_Elroq_Technical_data_d5686460.pdf

Photo addition: https://commons.wikimedia.org/wiki/File:%C5%A0KODA_1203.JPG — author Kelovy, public-domain metadata from Commons API; original URL/file-page/author/licence retained in the photo record. Visual review is pending. No image binary downloaded. 4R remains unresolved. Detailed omissions and source conflicts are in model-lines-review.md and skoda-specs-step3-review.json.
<!-- skoda-specs-step3:end -->

<!-- skoda-specs-step4:start -->
## Škoda version specifications step 4 — 26 October 2026

Selected facts checked via general web search, original manufacturer releases, a mirrored 1999 manufacturer brochure, AZNP 1987 manual (printed pp.6–7), Andrt/Malina service book (printed p.13) and Czech Wikipedia. Facts independently structured; no wholesale prose/tables or image binaries retained. Period documents are **not CC0**; Wikidata CC0 applies only to the original identity data. Photo licences remain file-specific.

Fixture: analysis/codex/skoda-specs-step4.mjs; applied facts: skoda-specs-step4-evidence.json; omissions/conflicts: skoda-specs-step4-review.json. Every added populated field has URL provenance. Cycles and mass definitions must remain visible when rendered.

- https://cdn.skoda-storyboard.com/2025/06/Skoda_Elroq_Technical_data_d5686460.pdf
- https://www.skoda-storyboard.com/cs/historicke-vozy-cs/skoda-garde-pred-40-lety-zamirila-do-bratislavy/
- https://www.skoda-storyboard.com/cs/tiskove-zpravy-archiv/125-let-skoda-auto-pribehy-mene-znamych-modelu-skoda-felicia-fun/
- https://cs.wikipedia.org/w/index.php?oldid=26215791
- https://cs.wikipedia.org/wiki/%C5%A0koda_Felicia
- https://skodafeliciafun.co.uk/March_1999_Skoda_Felicia_Fun_Sales_Brochure_GermanWP.pdf
- https://auta5p.eu/zkusenosti/skoda_125/skoda-105-136-navod.pdf
- https://skoda120.inetbox.sk/_temp/favorit_andrt_malina.pdf
- https://cdn.skoda-storyboard.com/2018/09/180914-50-years-of-the-%C5%A0KODA-1203-Reliable-all-round-van-with-cult-status.pdf
- https://www.skoda-storyboard.com/en/press-releases/70-years-of-the-skoda-1200-all-steel-body-refined-in-the-wind-tunnel/
- https://www.skoda-storyboard.com/en/press-releases/skoda-popular-monte-carlo-1936-1939-the-elegant-model-with-rally-dna/

Whole-car photo framing is now required. Existing references are pending visual review, not approved under this rule. No new photo references this turn.


Parallel research merged: worker-historic-step4.json, worker-octavia-step4.json, worker-fabia-step4.json (6 patches). Octavia I adds body/engine/gearbox-scoped masses and consumption; the 1.6 technical sample was tested in 1998 and its note distinguishes it from the 1996 launch. Junior gains period-test acceleration/consumption and original hatchback dimensions. 450's 900/930 kg conflict is null. Octavia 1.8's 10.7/10.9 s conflict is null. RS consumption revision, Junior displacement, and Octavia height/source-access limitations remain explicit in worker evidence and scope review notes.

Additional Help wanted: 440/450 original year/equipment mass pages; 1201 sedan 1050/1060 kg reconciliation; Octavia I 1.8 homologated 0–100 value; Fabia Junior exact kerb mass and 966/997 cc reconciliation; exact RS brochure revision mapping 5.1/5.4 litres and cycle.

Worker source references:

- https://www.automobilrevue.cz/rubriky/testy/predstavujeme/automobil-01-1957-hity-1-rocniku_44657.html
- https://cdn.skoda-storyboard.com/2017/09/170925-Jubileum-modelu-%C5%A0KODA-450.pdf
- https://www.spartaky.cz/Content/pid=17.html.html
- https://webapps.skoda-auto.sk/Magazin/skoda_magazin_zima_2012.pdf
- https://www.for-veteran.eu/skoda-1201-navod-k-obsluze
- https://www.auto.cz/test-skoda-octavia-1-6-55-kw-24
- https://www.auto.cz/test-skoda-octavia-1-8-20v-slx-4
- https://www.automobile-catalog.com/car/1996/3134330/skoda_octavia_1_8_20v.html
- https://www.motorsdb.com/fiche-technique/auto/32560/Skoda-Octavia-1-8-1996-1999.html
- https://www.automobile-catalog.com/car/1996/3134375/skoda_octavia_1_9_tdi_90.html
- https://www.auto.cz/skoda-octavia-1u-1996-2010-prvni-moderni-generace-vydrzela-ve-vyrobe-14-let-131885
- https://www.skoda-storyboard.com/en/press-releases/20-years-of-skoda-octavia-jubilee-for-the-heart-of-the-brand/
- https://hnonline.sk/dennik/servisne-prilohy/28306-test-skoda-fabia-junior-1-0-mpi
- https://www.skoda-storyboard.com/en/skoda-world/heritage/birthdays-for-the-felicia-and-fabia/

<!-- skoda-specs-step4:end -->

<!-- skoda-step5:start -->
## Škoda specifications step 5 — 26 October 2026

Primary manufacturer technical sheets and original brochures, including mirrored copies, were independently read by six worker tasks and the merge owner. Only selected facts were structured; no source prose, complete tables or photo binaries copied. Original brochures are not CC0. Wikidata CC0 identity licensing and per-file Commons photo licences remain unchanged.

Worker evidence: worker-step5-compacts.json, worker-step5-electric.json, worker-step5-enyaq-early.json, worker-step5-fabia-older.json, worker-step5-octavia.json, worker-step5-roomster-yeti-rapid.json, worker-step5-superb-suv.json. Applied factual snapshot: analysis/codex/skoda-step5-evidence.json. All added or patched populated technical fields have URL provenance. Scoped body, document date, transmission, base-weight definition and consumption/range cycles must remain visible. Historical sources and old counts above are retained as dated snapshots.

- https://cdn.skoda-storyboard.com/2024/01/TD-Scala-en_8e7b3fcc.pdf
- https://cdn.skoda-storyboard.com/2024/01/TD-Kamiq-en_e3841ce1.pdf
- https://webapps.skoda-auto.sk/Cenniky-a-katalogy/techdata/Skoda_Fabia_technickeudaje.pdf?202410241043=
- https://cdn.skoda-storyboard.com/2025/05/TD-Enyaq-en_0308de7f.pdf
- https://cdn.skoda-storyboard.com/2026/08/TD_Skoda_Epiq_en_69592937.pdf
- https://cdn.skoda-storyboard.com/2021/03/TD-ENYAQ-iV-EN.pdf
- https://www.allcarcentral.com/Skoda_pdf/Skoda_Fabia_Catalogue_ENG_2008.pdf
- https://cdn.skoda-storyboard.com/2018/08/TD-FABIA-petrol_EN.pdf
- https://cdn.skoda-storyboard.com/2024/05/Octavia_technical_data_EN_842ba18d.pdf
- https://www.aastaauto.ee/files/modelfiles/Octavia_kataloog_2011_ENG.pdf
- https://cdn.skoda-storyboard.com/2017/03/170307-Geneva-2017-Press-Kit.pdf
- https://www.skodaclub.bg/forum/applications/core/interface/file/attachment.php?id=62542
- https://cdn.skoda-storyboard.com/2016/12/TD_YETI_en.pdf
- https://cdn.skoda-storyboard.com/2016/05/RAPID-en.pdf
- https://cdn.skoda-storyboard.com/2022/03/TD-KAROQ-petrol-en.pdf
- https://cdn.skoda-storyboard.com/2024/11/TD-Kodiaq-en_83435dd3.pdf
- https://skoda.metrotehnica.ro/files/3117/1222/0129/TD-Superb-en_87b42ad4.pdf
- https://static.cream.sk/araver.sk/webroots/www/content/mediagallery/araver_system/file/article/file/11172.pdf
- https://cdn.skoda-storyboard.com/2016/05/TD-SUPERB-en.pdf

Four existing Commons references visually checked: three passed whole-car framing; the 1203 frontal close-up was rejected and removed. Decisions/file identities and Czech notes: analysis/codex/skoda-step5-photo-review.json. Licences/author credits of retained photographs are unchanged. Remaining photographs are pending review; no downloaded image binaries are retained in the project.
<!-- skoda-step5:end -->

<!-- skoda-step6:start -->
## Škoda specifications step 6 — 26 October 2026

General web and manufacturer/archive research continued. Selected facts independently structured; no source prose or complete tables reproduced. Source PDFs remain copyrighted; this does not change Wikidata CC0 identity licensing or Commons photo licences. Explicit instruction #27 permits the minimum of a published mass range; massRangeKg retains the original interval, massReference labels it published-minimum, and massBasis preserves driver/load convention and configuration uncertainty. Fuel-consumption ranges remain scalar null.

Worker/root fixtures: worker-step6-compacts.json, worker-step6-current-suv.json, worker-step6-electric.json, worker-step6-felicia-citigo.json, worker-step6-historic-mass.json, worker-step6-octavia-current.json, worker-step6-octavia-one.json, worker-step6-older-mainstream.json. Applied facts and source maps: analysis/codex/skoda-step6-evidence.json; omissions/conflicts: skoda-step6-review.json.

- https://cdn.skoda-storyboard.com/2024/01/TD-Scala-en_8e7b3fcc.pdf
- https://cdn.skoda-storyboard.com/2024/01/TD-Kamiq-en_e3841ce1.pdf
- https://webapps.skoda-auto.sk/Cenniky-a-katalogy/techdata/Skoda_Fabia_technickeudaje.pdf?202410241043=
- https://skoda.metrotehnica.ro/files/3117/1222/0129/TD-Superb-en_87b42ad4.pdf
- https://cdn.skoda-storyboard.com/2022/03/TD-KAROQ-petrol-en.pdf
- https://cdn.skoda-storyboard.com/2024/11/TD-Kodiaq-en_83435dd3.pdf
- https://cdn.skoda-storyboard.com/2016/08/TD-KODIAQ-en.pdf
- https://cdn.skoda-storyboard.com/2021/03/TD-ENYAQ-iV-EN.pdf
- https://cdn.skoda-storyboard.com/2025/05/TD-Enyaq-en_0308de7f.pdf
- https://cdn.skoda-storyboard.com/2025/06/Skoda_Elroq_Technical_data_d5686460.pdf
- https://cdn.skoda-storyboard.com/2026/08/TD_Skoda_Epiq_en_69592937.pdf
- https://docar.cz/navody-k-obsluze/Skoda/navod-k-obsluze-skoda-felicia.pdf
- https://cdn.skoda-storyboard.com/2017/03/170307-Geneva-2017-Press-Kit.pdf
- https://auta5p.eu/zkusenosti/skoda_125/skoda-125-test.php
- https://cdn.skoda-storyboard.com/2024/05/Octavia_technical_data_EN_842ba18d.pdf
- https://www.allcarcentral.com/Skoda_pdf/Skoda_OctaviaTour_Catalogue_2009.pdf
- https://manualzz.com/doc/5858171/skoda-superb--2007-05--manuale-del-proprietario
- https://xr793.com/wp-content/uploads/2022/09/2004-Skoda-Superb-UK.pdf
- https://www.auto.cz/test-skoda-fabia-combi-1-4-16v-55-kw-optimalni-volba-04-2001-163

Five original Commons photographs visually inspected from temporary storage:1200 and1202 passed whole-car framing;1201,422 andL&K/Škoda110 rejected. Decisions and filenames: analysis/codex/skoda-step6-photo-review.json. Retained author/licence metadata unchanged; no image binaries stored in repository. 60 remaining references still require review.
<!-- skoda-step6:end -->
