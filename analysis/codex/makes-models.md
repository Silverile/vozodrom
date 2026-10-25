# Vehicle makes and model records — Wikidata snapshot, 2026-10-25

The delivered CC0 seed contains **432 makes**, **7470 car records** and **1933 motorcycle records**. It is not an exhaustive list of all makes or full production model lines. Individual models, trims, generations and series share the source classes and remain separate QIDs. These counts must not be presented as counts of distinct model lines or vehicles currently sold in Czechia.

| Section | Makes | Model records delivered |
| --- | ---: | ---: |
| auto | 217 | 7470 |
| moto | 91 | 1933 |
| technika | 111 | Not collected |
| pneu | 42 | Not collected |

Makes overlap sections, so their section counts do not sum to 432. Equipment includes commercial vans, trucks, buses, agricultural and construction machinery and trailers. Tyres use the application's existing section key **pneu**. Their list includes tyre brands as well as manufacturers; no tyre patterns or equipment model inventory was collected.

## Evidence and scope

Only Wikidata structured records were imported. [Wikidata's licence policy](https://www.wikidata.org/wiki/Wikidata:Licensing) releases these under CC0. No Sauto, Drom, TipCars, Bazoš or other portal database was copied. No Wikipedia prose, logos or product images are in this dataset.

An initial transitive manufacturer query returned 9,978 distinct entities, including factories and misclassified vehicle models. That was rejected as a make selector. The retained list is an editorial selection, resolved against source labels and descriptions, followed by explicit brand/manufacturer identifier matching. The list is deliberately broader than contemporary Czech passenger-car sales, including historic makes, global imports and specialist makers. Its 217 car makes meet the approximate 200-make breadth but not the approximately 300-make aspiration. Neither completeness nor Czech used-market prevalence has been measured.

The direct car/model-series query returned 13780 distinct entities; 6310 were excluded. The direct motorcycle/model-series query returned 3002; 1069 were excluded. Reasons and all rejected QIDs are retained in excluded-models-auto.json and excluded-models-moto.json. Exclusions include unknown or ambiguous make, missing readable label, and explicitly identified concept/competition classes. Concepts or competition variants without those exact source classes may remain. Models represented only by subclasses or unrelated classes are not discovered by the direct-class queries.

## Suggested first 40 car makes to curate

This is an **editorial work queue, not a verified sales ranking**. It prioritises the existing demo makes, widely recognised European/import marques and legacy brands useful to the intended Czech catalogue. No registration or market-share numbers were fabricated. Full lineage requires a separate review of each range; a nonzero count is not proof of completeness.

| Make | Slug | Imported records | With body | With direct start year | With generation links |
| --- | --- | ---: | ---: | ---: | ---: |
| Škoda | skoda | 138 | 10 | 0 | 0 |
| Volkswagen | volkswagen | 200 | 38 | 32 | 3 |
| Audi | audi | 148 | 13 | 5 | 1 |
| BMW | bmw | 183 | 13 | 2 | 6 |
| Mercedes-Benz | mercedes-benz | 281 | 24 | 11 | 1 |
| Ford | ford | 401 | 34 | 5 | 5 |
| Toyota | toyota | 311 | 77 | 23 | 9 |
| Hyundai | hyundai | 92 | 24 | 2 | 0 |
| Kia | kia | 83 | 21 | 0 | 0 |
| Renault | renault | 328 | 37 | 5 | 1 |
| Dacia | dacia | 35 | 4 | 0 | 0 |
| Peugeot | peugeot | 204 | 9 | 4 | 1 |
| Citroën | citroen | 128 | 13 | 5 | 1 |
| Opel | opel | 147 | 13 | 16 | 2 |
| Fiat | fiat | 192 | 20 | 2 | 1 |
| SEAT | seat | 56 | 9 | 0 | 0 |
| Cupra | cupra | 2 | 0 | 0 | 0 |
| MINI | mini | 11 | 1 | 0 | 1 |
| Volvo | volvo | 76 | 10 | 1 | 0 |
| Saab | saab | 31 | 1 | 0 | 0 |
| Tesla | tesla | 6 | 4 | 0 | 0 |
| Honda | honda | 170 | 25 | 5 | 6 |
| Mazda | mazda | 123 | 19 | 3 | 0 |
| Nissan | nissan | 202 | 51 | 4 | 6 |
| Mitsubishi | mitsubishi | 107 | 28 | 1 | 1 |
| Subaru | subaru | 70 | 9 | 0 | 4 |
| Suzuki | suzuki | 70 | 22 | 3 | 1 |
| Lexus | lexus | 42 | 11 | 0 | 2 |
| Chevrolet | chevrolet | 206 | 22 | 2 | 0 |
| Daewoo | daewoo | 1 | 0 | 0 | 0 |
| Daihatsu | daihatsu | 66 | 11 | 0 | 0 |
| SsangYong / KGM | ssangyong-kgm | 16 | 8 | 0 | 0 |
| Land Rover | land-rover | 19 | 8 | 0 | 0 |
| Jaguar | jaguar | 58 | 5 | 2 | 0 |
| Porsche | porsche | 89 | 2 | 0 | 3 |
| Jeep | jeep | 32 | 15 | 0 | 0 |
| Alfa Romeo | alfa-romeo | 96 | 3 | 1 | 0 |
| Lancia | lancia | 64 | 2 | 0 | 0 |
| smart | smart | 14 | 0 | 0 | 0 |
| MG | mg | 8 | 1 | 0 | 0 |

Historic/local follow-up: Trabant, Wartburg, Lada/VAZ, Moskvič, Tatra, ARO, Avia, Praga, LIAZ, Zetor, Jawa, ČZ and Babetta. Several are represented by a brand, historical manufacturer or model-family entity rather than a uniform corporate entity type.

## Data quality and nulls

| Section | Records | Missing single body | Missing production start | Missing production end | Missing generations |
| --- | ---: | ---: | ---: | ---: | ---: |
| auto | 7470 | 6550 (87.7%) | 7311 (97.9%) | 7359 (98.5%) | 7411 (99.2%) |
| moto | 1933 | 1933 (100.0%) | 1906 (98.6%) | 1912 (98.9%) | 1932 (99.9%) |

Cars contain 278 explicit series entities; motorcycles contain 111. A model not classified as a series can still represent a family. There are 398 car records and 42 motorcycle records with a sourced inception year, stored separately from production dates. P571 is not automatically a start-of-production date. P2754 was explored but is a creative-work production property and is deliberately unused.

ProductionStart/End use unique direct P580/P582 years only. These are source start/end bounds and require contextual review before displaying them as globally authoritative production periods. P176 manufacturer qualifiers are stored separately in manufacturerPeriods; they can cover a specific manufacturer rather than the whole model. Discontinuation P2669 remains separate. Null end does **not** mean still in production. Conflicting scalar values become null; raw statements remain in the snapshot.

Generations are included only where a same-make P179 series relation and an English source description explicitly identifying a generation both exist. P179 alone also describes trims and subseries. No code is extracted from a marketing name: generation.code is the unique P528 catalogue code if present, otherwise null. This conservative method misses real generations; it does not fabricate them.

A body is mapped only from exact recognised P279 labels. New body enum values are **kupe, kabriolet, pickup, dodavka**. Source MPV variants map to mpv and crossovers to suv; broad size classes such as compact car do not imply a body. Multiple mapped bodies set body=null while bodyTypes retains the alternatives. Motorcycle body is null because motorcycle styles do not belong to the car body enum.

For makes, 61 have no unique country, 51 no unique founding year, and 339 have unverified activity status. 93 have a sourced dissolution date. Missing P576 is never treated as evidence of activity: status remains null, so no make is asserted active. Country is source P17, including historical states and multiple countries retained in countries. A defunct manufacturer does not imply its commercial brand is defunct; do not hide such brands using this flag.

Zero imported car records: bellier, dangel, estrima, fsm, grecav, jaecoo, microcar, venturi.

Zero imported motorcycle records: adiva, aeon-motor, arctic-cat, babetta, blata, brixton-motorcycles, bsa, electric-motion, gas-gas, hisun, linhai, livewire, niu-technologies, pgo-scooters, polaris, segway, sherco, stark-future, super-soco, sur-ron, swm, tgb, um-motorcycles, vmoto, voge, zongshen. ATV/scooter and recent electric-motorcycle coverage is especially thin.

Unresolved lookup seeds (not evidence that Wikidata has no relevant entity): Chatenet, Microlino, Tazzari EV, Zontes, Kove Moto, Mash Motors, Benda, Yezdi, Talaria, Access Motor, Goes, Segway Powersports, Motron, Böckmann, Brenderup, Pongratz, Goldhofer, Schwarzmüller Group, Kleber. Their candidates are recorded in unresolved.json. Additional names were deliberately excluded after misleading matches, including unrelated companies with matching names.

When a source model label explicitly starts with another selected make, a conflicting brand/manufacturer attribution is excluded as label-make-conflict. For example, a Daewoo-labelled shared model is not silently shown as a Chevrolet model. No brand is inferred solely from the label.

## Identity, renames and duplicates

QID is the durable identity. Slugs are ASCII and stable through slug-registry.json; model slug uniqueness is scoped to makeSlug. Same-name source records remain distinct and initially use a QID suffix. Do not join models by display name alone.

- Škoda/Skoda and Citroën/Citroen normalise to skoda and citroen. Display accents are preserved.
- Lada is the display make; AvtoVAZ/VAZ are lookup aliases, with brand Q35676 and manufacturer Q2309 retained.
- SsangYong and KGM share one canonical entity/selector entry. The source's rename does not create duplicate models.
- BMW/BMW Motorrad and Kawasaki parent/motorcycle entities feed one commercial make per brand. Triumph cars and Triumph motorcycles remain distinct.
- Corporate manufacturer IDs and explicit commercial-brand IDs both appear in relatedQids for model matching. These IDs are not asserted to denote the same legal entity. Royal Enfield's British and Indian history requires that distinction.
- Same-name unrelated BAC, Ursus, Matador and Ariel entities were excluded from identifier matching. AUDI's separate Chinese brand is not silently merged with Audi. Opel/Vauxhall, Fiat/Abarth, Nissan/Datsun and Citroën/DS remain distinct; rebadged source records with ambiguous ownership are excluded.

## Concrete integration proposal for Claude

1. Import makes.json into a small catalogue adapter and filter sections for auto/moto/technika/pneu selectors. Use types.ts for nullable identity types. Map the existing ten demo brand slugs to these identities; preserve their current routes.
2. Keep the existing lib/catalog.ts 25 demo Model objects as the explicit demo-content overlay. Its Model requires price, registration, STK, engines and reviews; do **not** coerce these JSON records into that type or feed them to the model() statistics generator. All new records are identity-only.
3. Use a distinct CatalogueModel with nullable body/dates plus source metadata. Join the existing rich demo overlay by a reviewed makeSlug/QID mapping. Newly imported identities get no fabricated prices, listing counts, owner scores, STK results, engines, reviews or generated listings. Render unknown fields as “Údaje zatím nejsou k dispozici” or omit the metric.
4. Present car model candidates in a make-scoped searchable selector. Avoid implying each imported variant is a top-level model line; curate series/parent links for the 40-make queue before building navigational model-line pages. Retain a manual “Jiný model” path for absent vehicles.
5. Load models per selected section or at build/server time. The three JSON files total 5.21 MiB; sending both full model arrays to every browser would be wasteful. Makes can be used independently of models.
6. Keep operational statistics in separate provenance-bearing datasets and join only when real evidence exists. Filters and counts must use actual listings, not this model inventory.

No changes to src/lib, application routes, UI, logos, package files, or demo statistics were made by Codex. No app build or browser behaviour was verified because this handoff adds standalone data and analysis only.

## Rebuild and validation

The compressed wikidata-snapshot.json.gz preserves all 59 SPARQL query/results records and HTTP retrieval logs (including failures/retries). queries.md records exact query text, plus exploratory connectivity queries. It is approximately 1 MiB instead of approximately 31 MiB of expanded JSON.

From the repository root:

```powershell
node analysis/codex/resolve.mjs
node analysis/codex/build-catalog.mjs
node analysis/codex/validate-catalog.mjs
```

These commands rebuild from the saved snapshot without network access. Fetching new evidence requires reviewing selection.mjs and rerunning the recorded queries; changes must be reviewed for ambiguous names, source schema drift and completeness. The checked-in slug registry preserves existing slugs. The validator checks UTF-8 JSON, sorting, unique/scoped slugs, QIDs, make/section references, source-backed dates, generation relationships, coverage totals and the absence of demo-statistic fields.
