# Delivery46 checkpoint

Updated 2026-10-27T01:40:20.882Z. About20minutes, root plus three parallel workers. No commits, publishing or application-index generation.

| Measure | Before | After |
|---|---:|---:|
| makes | 49 | 58 |
| cards | 1025 | 1248 |
| generationRecords | 1315 | 1582 |
| versions | 338 | 439 |
| photoReferences | 203 | 308 |

| New make | Cards | Generation/family records | Selected versions | Photos |
|---|---:|---:|---:|---:|
| cupra | 7 | 7 | 20 | 7 |
| dacia | 20 | 27 | 32 | 18 |
| daewoo | 31 | 35 | 14 | 3 |
| daihatsu | 58 | 66 | 2 | 11 |
| daimler-company | 43 | 52 | 2 | 5 |
| dangel | 13 | 13 | 12 | 3 |
| datsun | 38 | 54 | 11 | 11 |
| de-tomaso | 7 | 7 | 3 | 5 |
| deepal | 6 | 6 | 5 | 5 |

Saved means a source-backed partial catalogue. It does not certify full worldwide history or complete versions tables. Daihatsu includes historical and regional line identities, mostly family records with unresolved generation boundaries. Dacia has32 selected versions, not every version of every generation. Dates of introduction and specimen/model years are kept separate from unknown production periods.

## Integration

New fuel values in CatalogFuel: petrol-lpg and petrol-hev. Claude must add petrol-lpg to CardFuel/display labels in src/lib/modelCards.ts (petrol-hev already exists there). LPG is not CNG. No application-owned file was edited.

Rebuild make builders, then integrate-night-cards.mjs, merge-photo-patches-46.mjs and apply-photo-credit-evidence-44.mjs. Dacia builder imports night-dacia-enrich.mjs. The46merger includes earlier42/44batches. Run validate-night-cards.mjs, validate-night-types.mjs, validate-model-lines.mjs and photo-backfill-46/validate.mjs. The older BMW42 version-specific validator still encodes its original seven-photo snapshot; the current whole-catalogue checks cover new photo additions. Do not treat an old seven-photo assertion as current expected coverage.

## Help wanted / gaps

Dacia: complete historical and engine/gearbox coverage, Spring facelift photo, Striker actual production confirmation. Daewoo: versions outside the selected factory UK sheets and complete dimensions/masses. Daihatsu: full generation splits, European versions, and remaining regional lines; null photos are unfinished searches. Daimler: early model-rating identities, exact production bounds and additional variants. Datsun: historic badge/export boundaries, more versions/photos. Cupra: pre-modernization Formentor and later Leon/Terramar/PHEV versions; Ateca2018 mass conflict1615/1632kg remainsnull. Deepal: SL03/L07 regional identities and full non-European range-extender specifications. DeTomaso: P72 conflicting manufacturer output/torque/mass remainnull. Dangel: historical donor-conversion generations and exact base-engine/body configurations; payload is not kerb mass.

Photo worker46 supplies37 inspected patches: Citroen6, BMW25, Chevrolet6. Root and make workers added references separately. Some roomy4:3 and rear3/4 photos are explicitly recorded exceptions to the preferred front3/4,3:2 composition. CommonsAPI429 responses limited searches; categories and exact-file metadata were used with pauses. Remaining omissions do not establish that no suitable Commons photo exists.

NEXT: delage. Remaining makes: 158.
