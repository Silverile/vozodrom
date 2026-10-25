# Curated car model lines — first 20 makes

Delivered **520 manually selected model-line entries across 20 makes**, with **283 sourced generation entries**. The ten demo makes were handled first, followed by the remaining queue order through **Volvo**. All **25 exact demo slugs** are preserved, including **volkswagen/id4**, not id-4. No routes or application code were changed.

**This is not complete factual enrichment of all 20 makes.** 95 lines retain unresolved production intervals, 36 have bodyTypes=null, 436 have generations=null, and 38 have no unique line-level Wikidata match. There are 1143 explicit needsReview items, including indexed generation fields; all are listed below. Missing generations mean unreviewed/incomplete, not that the car has no generations. The remaining 20 makes were not processed.

| Make | Slug | Lines | Known start | Known body set | Generation entries | Lines needing review |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Škoda | skoda | 16 | 16 | 16 | 15 | 12 |
| Volkswagen | volkswagen | 31 | 26 | 27 | 23 | 29 |
| Hyundai | hyundai | 28 | 26 | 27 | 18 | 27 |
| Kia | kia | 27 | 22 | 27 | 17 | 26 |
| Toyota | toyota | 36 | 28 | 35 | 22 | 33 |
| Ford | ford | 32 | 29 | 30 | 19 | 32 |
| Dacia | dacia | 13 | 12 | 11 | 9 | 13 |
| BMW | bmw | 32 | 26 | 28 | 6 | 32 |
| Tesla | tesla | 5 | 5 | 5 | 0 | 5 |
| Renault | renault | 36 | 28 | 34 | 22 | 36 |
| Audi | audi | 27 | 21 | 26 | 36 | 24 |
| Mercedes-Benz | mercedes-benz | 36 | 29 | 35 | 17 | 35 |
| Peugeot | peugeot | 35 | 27 | 31 | 13 | 35 |
| Citroën | citroen | 39 | 30 | 35 | 11 | 38 |
| Opel | opel | 30 | 22 | 27 | 8 | 30 |
| Fiat | fiat | 37 | 28 | 33 | 6 | 36 |
| SEAT | seat | 16 | 15 | 15 | 15 | 15 |
| Cupra | cupra | 6 | 4 | 6 | 0 | 6 |
| MINI | mini | 8 | 8 | 6 | 8 | 8 |
| Volvo | volvo | 30 | 23 | 30 | 18 | 30 |

## Scope and grouping rules

The selection targets European/Czech used and new vehicle families overlapping approximately 1990–2026. Nameplate origins can predate 1990. Commercial vans and pickups are included where buyers encounter them under these makes; their presence does not change the existing makes' section flags. A dealer feed can still contain legitimate omitted models: this file is not an allow-list for rejecting listings.

Names and family boundaries were selected manually. Source chronology/body/code facts were extracted from individual Wikipedia infobox fields, then conservative rules and recorded decisions rejected ambiguous values. Only names, dates, codes, body/class labels and reference metadata were retained; no article paragraphs, images or full tables were copied. The original Wikidata CC0 snapshot provided the starting inventory and exact-name QID candidates. This is not an automated promotion of the 7,470 raw records into model lines.

Trims, powertrain labels, facelifts and body/length derivatives are merged into their parent families: RS/GTI/AMG engine grades, Stepway, Grand Scénic, ProCeed, SEAT pre-marque Cupra variants, etc. Separately marketed engineered families such as BMW 2 Active Tourer, Toyota Corolla Verso, Mercedes AMG GT, BMW XM or Ford Mustang Mach-E remain separate. Names reused for unrelated eras retain explicit sources and productionPeriods; those periods are not an assertion that the cars form an engineering generation sequence. Historic Citroën DS badges remain listed with unresolved badge-phase dates rather than being assigned modern DS production dates.

## Date and null semantics

- from/to describe production evidence, not model years, Czech registration dates or guaranteed local on-sale years. dateScope=europe is used only for an explicitly European source interval; source-production can include global production of a European-sold nameplate. Neither productionStatus=current nor a null end promises current Czech availability.
- **to=null means still produced only when productionStatus=current.** With productionStatus=unknown, null is unresolved and has a matching needsReview entry. This distinction implements the instruction to keep uncertain ends null without falsely calling them current. Closed ranges have year precision; ended means the source reports an end year, not independent day-level confirmation.
- Multiple incompatible regional/badge windows become null unless an explicit recorded source interval was selected. Global/current Asian successors are not automatically European generations. Source-mentioned generations beginning in 2026 or later are deferred pending production/European-market corroboration.
- Early generations known to end before 1990 are omitted. A family may contain additional omitted or unresolved generations. Facelifts such as Tesla Highland/Juniper are not invented as new generations. Null generation.code means no defensible European code was established; the existing demo objects are not treated as evidence.
- bodyTypes uses hatchback/kombi/sedan/suv/mpv/kupe/kabriolet/pickup/dodavka. Liftbacks map to hatchback; estates/shooting brakes to kombi. Body sets are limited to the editorial European selection. Uncorroborated sets become null; quadricycles Ami/Twizy/Topolino are not guessed as hatchbacks.
- Manufacturer production facts can differ from familiar launch/model-year boundaries. For example Octavia III has a sourced production start in 2012; the demo's 2013 boundary was not copied into this dataset.

## Manufacturer checks and source conflicts

- [Škoda Auto: skoda-octavia-2026](https://www.skoda-auto.cz/novinky/novinky-detail/2026-08-27-skoda-octavia-slavi-30-let-tri-dekady-ikonickeho-modelu) — factual chronology/current-market checks recorded in model-line-primary-facts.json.
- [Škoda Auto: skoda-production-2024](https://reporting.skoda-auto.com/archive/2024/production) — factual chronology/current-market checks recorded in model-line-primary-facts.json.
- [Škoda Auto: skoda-epiq-2026](https://www.skoda-auto.cz/novinky/novinky-detail/2026-10-06-skoda-epiq-prichazi-na-cesky-trh-za-doporucene-prodejni-ceny-od-619-000-kc) — factual chronology/current-market checks recorded in model-line-primary-facts.json.
- [BMW Group: bmw-3-production-2025](https://www.press.bmwgroup.com/global/article/detail/T0454448EN/50-years-of-bmw-3-series-production-%20-an-international-success-story) — factual chronology/current-market checks recorded in model-line-primary-facts.json.

Octavia III uses **2012–2020** from Škoda’s 2026 history instead of the retrieved Wikipedia field ending in 2019. BMW’s manufacturing history corroborates production starts earlier than familiar launch years (for example E46 in 1997 versus its 1998 market introduction). Its global sixth-generation range is not substituted for an unresolved European body/market end date. Epiq is included after checking Škoda’s October 2026 Czech-market announcement. These targeted checks do not independently certify all remaining Wikipedia facts.

## Evidence and reproduction

- model-line-selection.mjs: manual family list, Czech names, body proposals, aliases and fixed demo slugs.
- model-line-decisions.mjs: manual range/identity decisions, reviewed generation families and excluded/merged/deferred groups.
- model-line-evidence.json: retrieved factual fields, source article titles, revision IDs, Wikidata page properties and request timestamps. Source URLs appear in every output line and generation; Wikipedia uses fixed oldid revisions, with manufacturer URLs where checked.
- model-line-decisions.json: per-line resolved articles, source production facts and generation labels used.
- model-line-exclusions.json: machine-readable per-make decisions. A regional exclusion is an editorial boundary, not a claim that private imports never occur.

Rebuild offline with node analysis/codex/build-model-lines.mjs, then node analysis/codex/write-model-lines-review.mjs. Validate with node analysis/codex/validate-model-lines.mjs. Live evidence refresh is optional and separate: fetch-model-line-evidence.mjs uses Wikipedia's API with revision IDs and rate-limit retries. No marketplace database was used.

The validation script checks UTF-8 JSON, ordering, make/scoped-slug references, all 25 demo routes' slugs, source retrievals, date values appearing in the retained evidence, generation/source references, body enum values and explicit unknown-field flags. It does **not** prove historical accuracy of every Wikipedia fact or completeness of every model range.

## Where this turn stops

Next: **Saab**. Remaining queue: saab, honda, mazda, nissan, mitsubishi, subaru, suzuki, lexus, chevrolet, daewoo, daihatsu, ssangyong-kgm, land-rover, jaguar, porsche, jeep, alfa-romeo, lancia, smart, mg. Metadata reconciliation for the delivered 20, especially shared vans, Citroën/DS phases, reused BMW i3/iX3/Volvo names and region-specific generation boundaries, remains explicitly outstanding. Late-2026 programmes without checked production evidence were not silently added.

## Škoda (skoda) — 16 lines

Citigo, Elroq, Enyaq, Epiq, Fabia, Favorit, Felicia, Kamiq, Karoq, Kodiaq, Octavia, Rapid, Roomster, Scala, Superb, Yeti.

### Excluded, merged or deferred

- **Octavia RS / Scout** — merged: trim or performance/body derivative; merged into Octavia.
- **Octavia (1959)** — excluded: pre-1990 historical line, distinct from modern Octavia.
- **Vision concepts** — excluded: concept vehicles.
- **Peaq** — deferred: not admitted without confirmed production/delivery evidence in this pass.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| Citigo (citigo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Elroq (elroq) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Enyaq (enyaq) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Epiq (epiq) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Favorit (favorit) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Felicia (felicia) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Kamiq (kamiq) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Kodiaq (kodiaq) | generations[0].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Kodiaq (kodiaq) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Kodiaq (kodiaq) | generations[1].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Rapid (rapid) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Roomster (roomster) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Scala (scala) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Yeti (yeti) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Volkswagen (volkswagen) — 31 lines

Amarok, Arteon, Beetle, Caddy, CC, Corrado, Eos, Fox, Golf, ID. Buzz, ID.3, ID.4, ID.5, ID.7, Jetta, Lupo, Multivan, Passat, Phaeton, Polo, Scirocco, Sharan, T-Cross, T-Roc, Taigo, Tayron, Tiguan, Touareg, Touran, Transporter, up!.

### Excluded, merged or deferred

- **Golf GTI / R / GTE / Alltrack** — merged: performance, drivetrain or equipment derivatives; merged into Golf.
- **Tiguan Allspace** — merged: long-wheelbase derivative; merged into Tiguan.
- **Lavida / Lamando / Sagitar / Phideon / ID.6** — excluded: regional-market lines outside the selected Europe-focused inventory.
- **Gol / Saveiro / Virtus / Tera** — excluded: regional-market lines outside this pass.
- **Tayron I** — deferred: Chinese-market first generation; European range/date boundary remains in needsReview.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| Amarok (amarok) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Arteon (arteon) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Beetle (beetle) | productionPeriods | Reused/renamed badge or multiple production runs; periods are not a claim of continuous production or generation equivalence. |
| Beetle (beetle) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Beetle (beetle) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Caddy (caddy) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Caddy (caddy) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| CC (cc) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Corrado (corrado) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Eos (eos) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Fox (fox) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Golf (golf) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Golf (golf) | generations[0].to | End/current status unresolved; null does not assert current production. |
| Golf (golf) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Golf (golf) | generations[1].to | End/current status unresolved; null does not assert current production. |
| Golf (golf) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Golf (golf) | generations[2].to | End/current status unresolved; null does not assert current production. |
| Golf (golf) | generations[3].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Golf (golf) | generations[3].to | End/current status unresolved; null does not assert current production. |
| Golf (golf) | generations[4].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Golf (golf) | generations[4].to | End/current status unresolved; null does not assert current production. |
| Golf (golf) | generations[5].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Golf (golf) | generations[5].to | End/current status unresolved; null does not assert current production. |
| ID. Buzz (id-buzz) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| ID.3 (id-3) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| ID.5 (id-5) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| ID.5 (id-5) | from | No single defensible production interval for the selected line in the retained facts. |
| ID.5 (id-5) | to | End year/current production not established. Null here does not confirm ongoing production. |
| ID.5 (id-5) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| ID.7 (id-7) | from | No single defensible production interval for the selected line in the retained facts. |
| ID.7 (id-7) | to | End year/current production not established. Null here does not confirm ongoing production. |
| ID.7 (id-7) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Jetta (jetta) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Jetta (jetta) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Lupo (lupo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Multivan (multivan) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Multivan (multivan) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Multivan (multivan) | from | No single defensible production interval for the selected line in the retained facts. |
| Multivan (multivan) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Multivan (multivan) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Passat (passat) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Passat (passat) | generations[2].to | End/current status unresolved; null does not assert current production. |
| Phaeton (phaeton) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Polo (polo) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Polo (polo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Scirocco (scirocco) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Scirocco (scirocco) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Sharan (sharan) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Sharan (sharan) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| T-Cross (t-cross) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| T-Roc (t-roc) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Taigo (taigo) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Taigo (taigo) | from | No single defensible production interval for the selected line in the retained facts. |
| Taigo (taigo) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Taigo (taigo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Tayron (tayron) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Tayron (tayron) | from | No single defensible production interval for the selected line in the retained facts. |
| Tayron (tayron) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Tayron (tayron) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Touareg (touareg) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Touran (touran) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Touran (touran) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Touran (touran) | generations[1].to | End/current status unresolved; null does not assert current production. |
| Touran (touran) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Transporter (transporter) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| up! (up) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Hyundai (hyundai) — 28 lines

Accent, Atos, Coupé, Elantra, Galloper, Getz, Grandeur, H-1, i10, i20, i30, i40, Inster, Ioniq, Ioniq 5, Ioniq 6, Ioniq 9, ix20, Kona, Matrix, Nexo, Santa Fe, Sonata, Staria, Terracan, Trajet, Tucson, Veloster.

### Excluded, merged or deferred

- **i30 N / N Line** — merged: performance/equipment derivatives; merged into i30.
- **Tucson ix35** — merged: European renamed generation; merged into Tucson.
- **Creta / Alcazar / Venue / Mufasa / Custo** — excluded: regional-market lines outside the reviewed European selection.
- **Genesis sedan / Genesis Coupe** — merged: historical Hyundai/Genesis badge assignment deferred; not silently merged with the Genesis make.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| Accent (accent) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Atos (atos) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Coupé (coupe) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Elantra (elantra) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Galloper (galloper) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Getz (getz) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Grandeur (grandeur) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| H-1 (h-1) | from | No single defensible production interval for the selected line in the retained facts. |
| H-1 (h-1) | to | End year/current production not established. Null here does not confirm ongoing production. |
| H-1 (h-1) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| i10 (i10) | generations | The source-current model line has no reviewed current generation; the sequence is incomplete. |
| i10 (i10) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| i10 (i10) | generations[2].to | End/current status unresolved; null does not assert current production. |
| i20 (i20) | generations | A source mentions a generation starting in 2026 or later; actual production/European availability needs corroboration before inclusion. |
| i20 (i20) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| i20 (i20) | generations[0].to | End/current status unresolved; null does not assert current production. |
| i40 (i40) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Inster (inster) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Inster (inster) | from | No single defensible production interval for the selected line in the retained facts. |
| Inster (inster) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Inster (inster) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Ioniq (ioniq) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Ioniq 5 (ioniq-5) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Ioniq 6 (ioniq-6) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Ioniq 9 (ioniq-9) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| ix20 (ix20) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Kona (kona) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Matrix (matrix) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Nexo (nexo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Santa Fe (santa-fe) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Santa Fe (santa-fe) | generations[0].to | End/current status unresolved; null does not assert current production. |
| Santa Fe (santa-fe) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Santa Fe (santa-fe) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Santa Fe (santa-fe) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Santa Fe (santa-fe) | generations[2].to | End/current status unresolved; null does not assert current production. |
| Santa Fe (santa-fe) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| Santa Fe (santa-fe) | generations[3].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Santa Fe (santa-fe) | generations[3].to | End/current status unresolved; null does not assert current production. |
| Santa Fe (santa-fe) | generations[3].bodyTypes | No explicit generation-specific body mapping. |
| Santa Fe (santa-fe) | generations[4].bodyTypes | No explicit generation-specific body mapping. |
| Sonata (sonata) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Staria (staria) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Terracan (terracan) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Trajet (trajet) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Tucson (tucson) | generations | A source mentions a generation starting in 2026 or later; actual production/European availability needs corroboration before inclusion. |
| Tucson (tucson) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Tucson (tucson) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Tucson (tucson) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| Tucson (tucson) | generations[3].bodyTypes | No explicit generation-specific body mapping. |
| Veloster (veloster) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Veloster (veloster) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Kia (kia) — 27 lines

Carens, Carnival, Ceed, Cerato, Clarus, EV3, EV4, EV5, EV6, EV9, Joice, Niro, Opirus, Optima, Picanto, Pride, PV5, Retona, Rio, Sephia / Shuma, Sorento, Soul, Sportage, Stinger, Stonic, Venga, XCeed.

### Excluded, merged or deferred

- **GT / GT-Line** — merged: performance/equipment derivatives.
- **ProCeed** — merged: Ceed hatchback/shooting-brake derivative; merged into Ceed with alias.
- **K3 / K5 / K7 / K8 / K9 / Telluride / Sonet / Seltos** — deferred: regional model/badge ranges not admitted without European variant review.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| Carens (carens) | from | No single defensible production interval for the selected line in the retained facts. |
| Carens (carens) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Carens (carens) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Carnival (carnival) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Cerato (cerato) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Clarus (clarus) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| EV3 (ev3) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| EV4 (ev4) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| EV5 (ev5) | from | No single defensible production interval for the selected line in the retained facts. |
| EV5 (ev5) | to | End year/current production not established. Null here does not confirm ongoing production. |
| EV5 (ev5) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| EV6 (ev6) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| EV9 (ev9) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Joice (joice) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Niro (niro) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Niro (niro) | generations[0].to | End/current status unresolved; null does not assert current production. |
| Niro (niro) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Niro (niro) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Opirus (opirus) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Optima (optima) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Optima (optima) | from | No single defensible production interval for the selected line in the retained facts. |
| Optima (optima) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Optima (optima) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Picanto (picanto) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Picanto (picanto) | generations[1].to | End/current status unresolved; null does not assert current production. |
| Pride (pride) | from | No single defensible production interval for the selected line in the retained facts. |
| Pride (pride) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Pride (pride) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| PV5 (pv5) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Retona (retona) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Rio (rio) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Sephia / Shuma (sephia) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Sorento (sorento) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Sorento (sorento) | generations[0].to | End/current status unresolved; null does not assert current production. |
| Sorento (sorento) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Sorento (sorento) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Sorento (sorento) | generations[1].to | End/current status unresolved; null does not assert current production. |
| Sorento (sorento) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Sorento (sorento) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Sorento (sorento) | generations[2].to | End/current status unresolved; null does not assert current production. |
| Sorento (sorento) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| Sorento (sorento) | generations[3].bodyTypes | No explicit generation-specific body mapping. |
| Soul (soul) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Sportage (sportage) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Sportage (sportage) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| Sportage (sportage) | generations[3].bodyTypes | No explicit generation-specific body mapping. |
| Sportage (sportage) | generations[4].bodyTypes | No explicit generation-specific body mapping. |
| Stinger (stinger) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Stonic (stonic) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Venga (venga) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| XCeed (xceed) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| XCeed (xceed) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| XCeed (xceed) | from | No single defensible production interval for the selected line in the retained facts. |
| XCeed (xceed) | to | End year/current production not established. Null here does not confirm ongoing production. |
| XCeed (xceed) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Toyota (toyota) — 36 lines

4Runner, Auris, Avensis, Aygo, Aygo X, bZ4X, C-HR, Camry, Carina, Celica, Corolla, Corolla Verso, GR86, GT86, Highlander, Hilux, iQ, Land Cruiser, Mirai, MR2, Paseo, Picnic, Previa, Prius, Prius+, Proace, Proace City, Proace Max, RAV4, Starlet, Supra, Urban Cruiser, Verso, Verso-S, Yaris, Yaris Cross.

### Excluded, merged or deferred

- **GR Yaris / GR Corolla** — merged: performance derivatives; Yaris retained; regional GR Corolla not admitted.
- **RAV4 EV** — merged: regional powertrain derivative.
- **Yaris Cross AC200** — excluded: regional design distinct from European XP210.
- **Urban Cruiser (2020/2023) / Taisor** — merged: India/other regional badge usages; not merged into the European XP110/BEV selection.
- **Corolla Axio / Fielder / Altis / Levin** — excluded: regional names/variants; not separate European lines.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| 4Runner (4runner) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Aygo (aygo) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Aygo (aygo) | from | No single defensible production interval for the selected line in the retained facts. |
| Aygo (aygo) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Aygo (aygo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Aygo X (aygo-x) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| bZ4X (bz4x) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| C-HR (c-hr) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Camry (camry) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Carina (carina) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Celica (celica) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Corolla (corolla) | generations | The source-current model line has no reviewed current generation; the sequence is incomplete. |
| Corolla (corolla) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Corolla (corolla) | generations[0].to | End/current status unresolved; null does not assert current production. |
| Corolla (corolla) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Corolla (corolla) | generations[1].to | End/current status unresolved; null does not assert current production. |
| Corolla (corolla) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Corolla (corolla) | generations[2].to | End/current status unresolved; null does not assert current production. |
| Corolla (corolla) | generations[3].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Corolla (corolla) | generations[3].to | End/current status unresolved; null does not assert current production. |
| Corolla (corolla) | generations[4].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Corolla (corolla) | generations[4].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Corolla (corolla) | generations[4].to | End/current status unresolved; null does not assert current production. |
| Corolla (corolla) | generations[5].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Corolla (corolla) | generations[5].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Corolla (corolla) | generations[5].to | End/current status unresolved; null does not assert current production. |
| Corolla (corolla) | generations[6].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Corolla (corolla) | generations[6].to | End/current status unresolved; null does not assert current production. |
| Corolla Verso (corolla-verso) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| GR86 (gr86) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| GT86 (gt86) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Highlander (highlander) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Hilux (hilux) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| iQ (iq) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Land Cruiser (land-cruiser) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Mirai (mirai) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| MR2 (mr2) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Paseo (paseo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Picnic (picnic) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Picnic (picnic) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Picnic (picnic) | from | No single defensible production interval for the selected line in the retained facts. |
| Picnic (picnic) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Picnic (picnic) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Previa (previa) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Prius (prius) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Prius+ (prius-plus) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Proace (proace) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Proace (proace) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Proace (proace) | from | No single defensible production interval for the selected line in the retained facts. |
| Proace (proace) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Proace (proace) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Proace (proace) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Proace City (proace-city) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Proace City (proace-city) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Proace City (proace-city) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Proace City (proace-city) | from | No single defensible production interval for the selected line in the retained facts. |
| Proace City (proace-city) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Proace City (proace-city) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Proace Max (proace-max) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Proace Max (proace-max) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Proace Max (proace-max) | from | No single defensible production interval for the selected line in the retained facts. |
| Proace Max (proace-max) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Proace Max (proace-max) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Proace Max (proace-max) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Starlet (starlet) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Supra (supra) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Urban Cruiser (urban-cruiser) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Urban Cruiser (urban-cruiser) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Urban Cruiser (urban-cruiser) | from | No single defensible production interval for the selected line in the retained facts. |
| Urban Cruiser (urban-cruiser) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Urban Cruiser (urban-cruiser) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Urban Cruiser (urban-cruiser) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Verso (verso) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Verso-S (verso-s) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Verso-S (verso-s) | from | No single defensible production interval for the selected line in the retained facts. |
| Verso-S (verso-s) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Verso-S (verso-s) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Yaris (yaris) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Yaris (yaris) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Yaris (yaris) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| Yaris Cross (yaris-cross) | from | No single defensible production interval for the selected line in the retained facts. |
| Yaris Cross (yaris-cross) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Yaris Cross (yaris-cross) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Ford (ford) — 32 lines

B-Max, Bronco, C-Max, Capri, Cougar, EcoSport, Edge, Escort, Explorer, Fiesta, Focus, Fusion, Galaxy, GT, Ka, Kuga, Mondeo, Mustang, Mustang Mach-E, Probe, Puma, Ranger, S-Max, Scorpio, Sierra, Tourneo Connect, Tourneo Courier, Tourneo Custom, Transit, Transit Connect, Transit Courier, Transit Custom.

### Excluded, merged or deferred

- **ST / RS / Vignale** — merged: performance/equipment derivatives.
- **Orion / Ka+** — merged: name/body derivatives retained as Escort/Ka aliases.
- **F-150 / Taurus / Crown Victoria** — excluded: grey-import/regional ranges outside this Europe-focused pass.
- **Explorer regional generations** — deferred: no unreviewed global generation is asserted European; chronology needsReview.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| B-Max (b-max) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Bronco (bronco) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| C-Max (c-max) | generations[0].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| C-Max (c-max) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| C-Max (c-max) | generations[1].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| C-Max (c-max) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| C-Max (c-max) | generations[1].to | End/current status unresolved; null does not assert current production. |
| C-Max (c-max) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Capri (capri) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Cougar (cougar) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| EcoSport (ecosport) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Edge (edge) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Escort (escort) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Explorer (explorer) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Fiesta (fiesta) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Fiesta (fiesta) | generations[1].to | End/current status unresolved; null does not assert current production. |
| Fiesta (fiesta) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Fiesta (fiesta) | generations[2].to | End/current status unresolved; null does not assert current production. |
| Focus (focus) | generations[0].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Focus (focus) | generations[1].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Focus (focus) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Focus (focus) | generations[1].to | End/current status unresolved; null does not assert current production. |
| Focus (focus) | generations[3].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Focus (focus) | generations[3].to | End/current status unresolved; null does not assert current production. |
| Fusion (fusion) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Galaxy (galaxy) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Galaxy (galaxy) | generations[1].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Galaxy (galaxy) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Galaxy (galaxy) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| GT (gt) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Ka (ka) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Kuga (kuga) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Kuga (kuga) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Kuga (kuga) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| Mondeo (mondeo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Mustang (mustang) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Mustang Mach-E (mustang-mach-e) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Probe (probe) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Probe (probe) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Puma (puma) | productionPeriods | Reused/renamed badge or multiple production runs; periods are not a claim of continuous production or generation equivalence. |
| Puma (puma) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Puma (puma) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Ranger (ranger) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| S-Max (s-max) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| S-Max (s-max) | generations[0].to | End/current status unresolved; null does not assert current production. |
| S-Max (s-max) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| S-Max (s-max) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Scorpio (scorpio) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Sierra (sierra) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Tourneo Connect (tourneo-connect) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Tourneo Connect (tourneo-connect) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Tourneo Connect (tourneo-connect) | from | No single defensible production interval for the selected line in the retained facts. |
| Tourneo Connect (tourneo-connect) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Tourneo Connect (tourneo-connect) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Tourneo Courier (tourneo-courier) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Tourneo Courier (tourneo-courier) | from | No single defensible production interval for the selected line in the retained facts. |
| Tourneo Courier (tourneo-courier) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Tourneo Courier (tourneo-courier) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Tourneo Courier (tourneo-courier) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Tourneo Custom (tourneo-custom) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Tourneo Custom (tourneo-custom) | from | No single defensible production interval for the selected line in the retained facts. |
| Tourneo Custom (tourneo-custom) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Tourneo Custom (tourneo-custom) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Tourneo Custom (tourneo-custom) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Transit (transit) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Transit Connect (transit-connect) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Transit Courier (transit-courier) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Transit Custom (transit-custom) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Dacia (dacia) — 13 lines

1300 / 1310, Bigster, Dokker, Duster, Jogger, Lodgy, Logan, Nova, Pick-Up, Sandero, Solenza, Spring, SuperNova.

### Excluded, merged or deferred

- **Stepway** — merged: equipment/crossover-look derivative; merged into Sandero.
- **1100** — excluded: production ended before the target window.
- **500 Lăstun** — excluded: rare historical microcar outside the ordinary-market selection; scope omission acknowledged.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| 1300 / 1310 (1300) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| 1300 / 1310 (1300) | from | No single defensible production interval for the selected line in the retained facts. |
| 1300 / 1310 (1300) | to | End year/current production not established. Null here does not confirm ongoing production. |
| 1300 / 1310 (1300) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Bigster (bigster) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Dokker (dokker) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Dokker (dokker) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Duster (duster) | generations | The source-current model line has no reviewed current generation; the sequence is incomplete. |
| Duster (duster) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Duster (duster) | generations[0].to | End/current status unresolved; null does not assert current production. |
| Duster (duster) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Duster (duster) | generations[1].to | End/current status unresolved; null does not assert current production. |
| Duster (duster) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Duster (duster) | generations[2].to | End/current status unresolved; null does not assert current production. |
| Jogger (jogger) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Lodgy (lodgy) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Logan (logan) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Logan (logan) | generations | The source-current model line has no reviewed current generation; the sequence is incomplete. |
| Logan (logan) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Logan (logan) | generations[0].to | End/current status unresolved; null does not assert current production. |
| Logan (logan) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Logan (logan) | generations[1].to | End/current status unresolved; null does not assert current production. |
| Logan (logan) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Logan (logan) | generations[2].to | End/current status unresolved; null does not assert current production. |
| Nova (nova) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Pick-Up (pick-up) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Sandero (sandero) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Sandero (sandero) | generations[0].to | End/current status unresolved; null does not assert current production. |
| Sandero (sandero) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Sandero (sandero) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Sandero (sandero) | generations[1].to | End/current status unresolved; null does not assert current production. |
| Sandero (sandero) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Sandero (sandero) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| Solenza (solenza) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Spring (spring) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| SuperNova (supernova) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## BMW (bmw) — 32 lines

i3, i4, i5, i7, i8, iX, iX1, iX2, iX3, Řada 1, Řada 2, Řada 2 Active Tourer, Řada 2 Gran Tourer, Řada 3, Řada 4, Řada 5, Řada 6, Řada 6 Gran Turismo, Řada 7, Řada 8, X1, X2, X3, X4, X5, X6, X7, XM, Z1, Z3, Z4, Z8.

### Excluded, merged or deferred

- **M2 / M3 / M4 / M5 / M6 / M8 / Competition / CS** — merged: performance derivatives of numbered lines; XM is a separately marketed model.
- **3 GT / 5 GT** — merged: body derivatives under corresponding numbered line; 6 GT retained as independently named successor.
- **i3 NA0 / G28** — excluded: new/reused or regional i3 identities are not conflated with the I01 city hatchback.
- **future G50 3 Series** — excluded: future generation, not a production generation in this pass.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| i3 (i3) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| i3 (i3) | scope | This entry is the I01 city hatchback; newer/regional i3 name reuse is not asserted to be its next generation. |
| i4 (i4) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| i5 (i5) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| i5 (i5) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| i5 (i5) | from | No single defensible production interval for the selected line in the retained facts. |
| i5 (i5) | to | End year/current production not established. Null here does not confirm ongoing production. |
| i5 (i5) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| i7 (i7) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| i7 (i7) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| i7 (i7) | from | No single defensible production interval for the selected line in the retained facts. |
| i7 (i7) | to | End year/current production not established. Null here does not confirm ongoing production. |
| i7 (i7) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| i8 (i8) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| iX (ix) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| iX1 (ix1) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| iX1 (ix1) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| iX1 (ix1) | from | No single defensible production interval for the selected line in the retained facts. |
| iX1 (ix1) | to | End year/current production not established. Null here does not confirm ongoing production. |
| iX1 (ix1) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| iX2 (ix2) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| iX2 (ix2) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| iX2 (ix2) | from | No single defensible production interval for the selected line in the retained facts. |
| iX2 (ix2) | to | End year/current production not established. Null here does not confirm ongoing production. |
| iX2 (ix2) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| iX2 (ix2) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| iX3 (ix3) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| iX3 (ix3) | from | No single defensible production interval for the selected line in the retained facts. |
| iX3 (ix3) | to | End year/current production not established. Null here does not confirm ongoing production. |
| iX3 (ix3) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Řada 1 (rada-1) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Řada 1 (rada-1) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Řada 2 (rada-2) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Řada 2 (rada-2) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Řada 2 Active Tourer (rada-2-active-tourer) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Řada 2 Gran Tourer (rada-2-gran-tourer) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Řada 2 Gran Tourer (rada-2-gran-tourer) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Řada 2 Gran Tourer (rada-2-gran-tourer) | from | No single defensible production interval for the selected line in the retained facts. |
| Řada 2 Gran Tourer (rada-2-gran-tourer) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Řada 2 Gran Tourer (rada-2-gran-tourer) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Řada 2 Gran Tourer (rada-2-gran-tourer) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Řada 3 (rada-3) | generations | F30/G20 family end dates need European body/market reconciliation; global full-plant dates and source closed ranges are not interchangeable. |
| Řada 3 (rada-3) | generations | The source-current model line has no reviewed current generation; the sequence is incomplete. |
| Řada 3 (rada-3) | generations[4].to | End/current status unresolved; null does not assert current production. |
| Řada 3 (rada-3) | generations[5].to | End/current status unresolved; null does not assert current production. |
| Řada 4 (rada-4) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Řada 5 (rada-5) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Řada 6 (rada-6) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Řada 6 (rada-6) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Řada 6 Gran Turismo (rada-6-gran-turismo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Řada 7 (rada-7) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Řada 8 (rada-8) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| X1 (x1) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| X2 (x2) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| X3 (x3) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| X4 (x4) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| X5 (x5) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| X6 (x6) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| X7 (x7) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| XM (xm) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Z1 (z1) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Z3 (z3) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Z3 (z3) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Z4 (z4) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Z4 (z4) | productionPeriods | Reused/renamed badge or multiple production runs; periods are not a claim of continuous production or generation equivalence. |
| Z4 (z4) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Z4 (z4) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Z8 (z8) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Tesla (tesla) — 5 lines

Model 3, Model S, Model X, Model Y, Roadster.

### Excluded, merged or deferred

- **Cybertruck** — deferred: not admitted to the Europe-focused ordinary-market range.
- **Roadster (second generation)** — excluded: announced/future vehicle; no verified production interval.
- **Highland / Juniper / Plaid / Performance** — merged: facelifts or performance derivatives, not invented generations.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| Model 3 (model-3) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Model S (model-s) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Model X (model-x) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Model Y (model-y) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Roadster (roadster) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Renault (renault) — 36 lines

11, 19, 21, 25, 4, 5, 9, Arkana, Austral, Avantime, Captur, Clio, Espace, Express, Fluence, Kadjar, Kangoo, Koleos, Laguna, Latitude, Master, Mégane, Mégane E-Tech, Modus, Rafale, Safrane, Scénic, Spider, Symbioz, Talisman, Trafic, Twingo, Twizy, Vel Satis, Wind, Zoe.

### Excluded, merged or deferred

- **RS / Gordini / GT** — merged: performance/equipment derivatives.
- **Grand Scénic / Grand Modus / Grand Espace** — merged: length/body derivatives merged into base families.
- **Kwid / Kiger / Triber / Duster Renault regional badge** — excluded: regional model/badge ranges outside this pass.
- **18** — excluded: European production ended before 1990; kept only if later source scope explicitly warrants it.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| 11 (11) | from | No single defensible production interval for the selected line in the retained facts. |
| 11 (11) | to | End year/current production not established. Null here does not confirm ongoing production. |
| 11 (11) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 19 (19) | from | No single defensible production interval for the selected line in the retained facts. |
| 19 (19) | to | End year/current production not established. Null here does not confirm ongoing production. |
| 19 (19) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 21 (21) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| 21 (21) | from | No single defensible production interval for the selected line in the retained facts. |
| 21 (21) | to | End year/current production not established. Null here does not confirm ongoing production. |
| 21 (21) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 25 (25) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 4 (4) | productionPeriods | Reused/renamed badge or multiple production runs; periods are not a claim of continuous production or generation equivalence. |
| 4 (4) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| 4 (4) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 5 (5) | productionPeriods | Reused/renamed badge or multiple production runs; periods are not a claim of continuous production or generation equivalence. |
| 5 (5) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 9 (9) | from | No single defensible production interval for the selected line in the retained facts. |
| 9 (9) | to | End year/current production not established. Null here does not confirm ongoing production. |
| 9 (9) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Arkana (arkana) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Austral (austral) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Avantime (avantime) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Captur (captur) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Captur (captur) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Captur (captur) | generations[1].to | End/current status unresolved; null does not assert current production. |
| Captur (captur) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Captur (captur) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| Clio (clio) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Clio (clio) | generations[0].to | End/current status unresolved; null does not assert current production. |
| Clio (clio) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Clio (clio) | generations[1].to | End/current status unresolved; null does not assert current production. |
| Clio (clio) | generations[3].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Clio (clio) | generations[3].to | End/current status unresolved; null does not assert current production. |
| Espace (espace) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Espace (espace) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Espace (espace) | generations[1].to | End/current status unresolved; null does not assert current production. |
| Espace (espace) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Espace (espace) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| Espace (espace) | generations[3].bodyTypes | No explicit generation-specific body mapping. |
| Espace (espace) | generations[4].bodyTypes | No explicit generation-specific body mapping. |
| Espace (espace) | generations[5].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Espace (espace) | generations[5].bodyTypes | No explicit generation-specific body mapping. |
| Express (express) | from | No single defensible production interval for the selected line in the retained facts. |
| Express (express) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Express (express) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Fluence (fluence) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Kadjar (kadjar) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Kangoo (kangoo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Koleos (koleos) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Laguna (laguna) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Latitude (latitude) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Master (master) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Mégane (megane) | from | No single defensible production interval for the selected line in the retained facts. |
| Mégane (megane) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Mégane (megane) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Mégane (megane) | generations[0].to | End/current status unresolved; null does not assert current production. |
| Mégane (megane) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Mégane (megane) | generations[1].to | End/current status unresolved; null does not assert current production. |
| Mégane E-Tech (megane-e-tech) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Mégane E-Tech (megane-e-tech) | from | No single defensible production interval for the selected line in the retained facts. |
| Mégane E-Tech (megane-e-tech) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Mégane E-Tech (megane-e-tech) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Mégane E-Tech (megane-e-tech) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Modus (modus) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Rafale (rafale) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Safrane (safrane) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Scénic (scenic) | productionPeriods | Reused/renamed badge or multiple production runs; periods are not a claim of continuous production or generation equivalence. |
| Scénic (scenic) | generations | The source-current model line has no reviewed current generation; the sequence is incomplete. |
| Scénic (scenic) | generations[0].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Scénic (scenic) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Scénic (scenic) | generations[0].to | End/current status unresolved; null does not assert current production. |
| Scénic (scenic) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Scénic (scenic) | generations[1].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Scénic (scenic) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Scénic (scenic) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| Scénic (scenic) | generations[3].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Scénic (scenic) | generations[3].bodyTypes | No explicit generation-specific body mapping. |
| Spider (spider) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Symbioz (symbioz) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Talisman (talisman) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Trafic (trafic) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Twingo (twingo) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Twingo (twingo) | from | No single defensible production interval for the selected line in the retained facts. |
| Twingo (twingo) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Twingo (twingo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Twizy (twizy) | bodyTypes | Quadricycle/body style does not fit the passenger-car enum; do not label it a hatchback. |
| Twizy (twizy) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Vel Satis (vel-satis) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Wind (wind) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Zoe (zoe) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Audi (audi) — 27 lines

100, 200, 80, 90, A1, A2, A3, A4, A5, A6, A6 e-tron, A7, A8, Cabriolet, Coupé, e-tron GT, Q2, Q3, Q4 e-tron, Q5, Q6 e-tron, Q7, Q8, Q8 e-tron, R8, TT, V8.

### Excluded, merged or deferred

- **S / RS variants** — merged: performance derivatives merged into numbered/Q lines.
- **allroad / Sportback** — merged: body/drive derivatives, not separate lines.
- **A4L / A6L / Q5L / Q6 China** — excluded: regional long-wheelbase or unrelated Chinese-market products.
- **AUDI E5** — merged: separate Chinese AUDI brand; not silently merged with Audi.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| 100 (100) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 200 (200) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| 200 (200) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| 200 (200) | from | No single defensible production interval for the selected line in the retained facts. |
| 200 (200) | to | End year/current production not established. Null here does not confirm ongoing production. |
| 200 (200) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 80 (80) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 90 (90) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| 90 (90) | from | No single defensible production interval for the selected line in the retained facts. |
| 90 (90) | to | End year/current production not established. Null here does not confirm ongoing production. |
| 90 (90) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| A2 (a2) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| A3 (a3) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| A3 (a3) | generations[2].to | End/current status unresolved; null does not assert current production. |
| A4 (a4) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| A6 (a6) | from | No single defensible production interval for the selected line in the retained facts. |
| A6 (a6) | to | End year/current production not established. Null here does not confirm ongoing production. |
| A6 (a6) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| A6 (a6) | generations[0].to | End/current status unresolved; null does not assert current production. |
| A6 (a6) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| A6 (a6) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| A6 (a6) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| A6 (a6) | generations[2].to | End/current status unresolved; null does not assert current production. |
| A6 (a6) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| A6 (a6) | generations[3].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| A6 (a6) | generations[3].to | End/current status unresolved; null does not assert current production. |
| A6 (a6) | generations[4].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| A6 (a6) | generations[4].to | End/current status unresolved; null does not assert current production. |
| A6 (a6) | generations[4].bodyTypes | No explicit generation-specific body mapping. |
| A6 (a6) | generations[5].bodyTypes | No explicit generation-specific body mapping. |
| A6 e-tron (a6-e-tron) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| A7 (a7) | from | No single defensible production interval for the selected line in the retained facts. |
| A7 (a7) | to | End year/current production not established. Null here does not confirm ongoing production. |
| A7 (a7) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| A8 (a8) | from | No single defensible production interval for the selected line in the retained facts. |
| A8 (a8) | to | End year/current production not established. Null here does not confirm ongoing production. |
| A8 (a8) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| A8 (a8) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| A8 (a8) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| A8 (a8) | generations[2].to | End/current status unresolved; null does not assert current production. |
| A8 (a8) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| A8 (a8) | generations[3].bodyTypes | No explicit generation-specific body mapping. |
| Cabriolet (cabriolet) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Cabriolet (cabriolet) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Cabriolet (cabriolet) | from | No single defensible production interval for the selected line in the retained facts. |
| Cabriolet (cabriolet) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Cabriolet (cabriolet) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Coupé (coupe) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| e-tron GT (e-tron-gt) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Q2 (q2) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Q4 e-tron (q4-e-tron) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Q5 (q5) | generations | The source-current model line has no reviewed current generation; the sequence is incomplete. |
| Q5 (q5) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Q5 (q5) | generations[1].to | End/current status unresolved; null does not assert current production. |
| Q5 (q5) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Q5 (q5) | generations[2].to | End/current status unresolved; null does not assert current production. |
| Q6 e-tron (q6-e-tron) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Q7 (q7) | generations | The source-current model line has no reviewed current generation; the sequence is incomplete. |
| Q7 (q7) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Q7 (q7) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Q7 (q7) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Q7 (q7) | generations[2].to | End/current status unresolved; null does not assert current production. |
| Q7 (q7) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| Q8 (q8) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Q8 e-tron (q8-e-tron) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| R8 (r8) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| TT (tt) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| TT (tt) | generations[0].to | End/current status unresolved; null does not assert current production. |
| TT (tt) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| TT (tt) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| TT (tt) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| V8 (v8) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Mercedes-Benz (mercedes-benz) — 36 lines

190, AMG GT, AMG GT 4-Door, Citan, CL, CLA, CLC, CLE, CLK, CLS, EQA, EQB, EQC, EQE, EQE SUV, EQS, EQS SUV, GLA, GLB, GLC, GLE, GLS, SL, SLK / SLC, Třída A, Třída B, Třída C, Třída E, Třída G, Třída R, Třída S, Třída T, Třída V, Třída X, Vaneo, Vito.

### Excluded, merged or deferred

- **AMG engine variants / Maybach trims** — merged: performance/luxury derivatives; AMG GT standalone retained.
- **GLK / ML / GL / SLC** — merged: renamed families retained as GLC/GLE/GLS/SLK aliases.
- **EQV / eVito** — merged: powertrain derivatives of V-Class/Vito.
- **Vision concepts / Project One** — excluded: concept or exceptional limited-production hypercar outside ordinary-market selection.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| 190 (190) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| AMG GT (amg-gt) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| AMG GT 4-Door (amg-gt-4-door) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Citan (citan) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| CL (cl) | from | No single defensible production interval for the selected line in the retained facts. |
| CL (cl) | to | End year/current production not established. Null here does not confirm ongoing production. |
| CL (cl) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| CLA (cla) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| CLA (cla) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| CLA (cla) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| CLC (clc) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| CLC (clc) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| CLC (clc) | from | No single defensible production interval for the selected line in the retained facts. |
| CLC (clc) | to | End year/current production not established. Null here does not confirm ongoing production. |
| CLC (clc) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| CLE (cle) | from | No single defensible production interval for the selected line in the retained facts. |
| CLE (cle) | to | End year/current production not established. Null here does not confirm ongoing production. |
| CLE (cle) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| CLK (clk) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| CLS (cls) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| EQA (eqa) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| EQB (eqb) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| EQC (eqc) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| EQE (eqe) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| EQE SUV (eqe-suv) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| EQS (eqs) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| EQS SUV (eqs-suv) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| GLA (gla) | generations | A source mentions a generation starting in 2026 or later; actual production/European availability needs corroboration before inclusion. |
| GLA (gla) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| GLA (gla) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| GLB (glb) | generations | A source mentions a generation starting in 2026 or later; actual production/European availability needs corroboration before inclusion. |
| GLB (glb) | generations | The source-current model line has no reviewed current generation; the sequence is incomplete. |
| GLC (glc) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| GLE (gle) | from | No single defensible production interval for the selected line in the retained facts. |
| GLE (gle) | to | End year/current production not established. Null here does not confirm ongoing production. |
| GLE (gle) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| GLS (gls) | from | No single defensible production interval for the selected line in the retained facts. |
| GLS (gls) | to | End year/current production not established. Null here does not confirm ongoing production. |
| GLS (gls) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| SL (sl) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| SLK / SLC (slk) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Třída A (trida-a) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Třída A (trida-a) | generations[0].to | End/current status unresolved; null does not assert current production. |
| Třída A (trida-a) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Třída A (trida-a) | generations[2].to | End/current status unresolved; null does not assert current production. |
| Třída B (trida-b) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Třída B (trida-b) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Třída E (trida-e) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Třída E (trida-e) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Třída G (trida-g) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Třída R (trida-r) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Třída S (trida-s) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Třída T (trida-t) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Třída T (trida-t) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Třída T (trida-t) | from | No single defensible production interval for the selected line in the retained facts. |
| Třída T (trida-t) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Třída T (trida-t) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Třída T (trida-t) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Třída V (trida-v) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Třída V (trida-v) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Třída V (trida-v) | from | No single defensible production interval for the selected line in the retained facts. |
| Třída V (trida-v) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Třída V (trida-v) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Třída V (trida-v) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Třída X (trida-x) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Vaneo (vaneo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Vito (vito) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Peugeot (peugeot) — 35 lines

1007, 106, 107, 108, 2008, 205, 206, 207, 208, 3008, 301, 306, 307, 308, 309, 4007, 4008, 405, 406, 407, 408, 5008, 508, 605, 607, 806, 807, Bipper, Boxer, Expert, iOn, Partner, RCZ, Rifter, Traveller.

### Excluded, merged or deferred

- **GT / GTi / SW / CC derivatives** — merged: equipment, performance or body variants merged into families.
- **206+** — merged: facelift derivative.
- **408 Chinese saloon** — excluded: not the European crossover selected here.
- **Landtrek / Pick Up** — excluded: regional-market pickups outside this pass.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| 1007 (1007) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 106 (106) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 107 (107) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 108 (108) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| 108 (108) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 2008 (2008) | generations | The source-current model line has no reviewed current generation; the sequence is incomplete. |
| 2008 (2008) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| 2008 (2008) | generations[0].to | End/current status unresolved; null does not assert current production. |
| 2008 (2008) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| 2008 (2008) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| 2008 (2008) | generations[1].to | End/current status unresolved; null does not assert current production. |
| 2008 (2008) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| 205 (205) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 206 (206) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 207 (207) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 208 (208) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| 208 (208) | generations[0].to | End/current status unresolved; null does not assert current production. |
| 3008 (3008) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| 3008 (3008) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| 3008 (3008) | generations[0].to | End/current status unresolved; null does not assert current production. |
| 3008 (3008) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| 3008 (3008) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| 3008 (3008) | generations[1].to | End/current status unresolved; null does not assert current production. |
| 3008 (3008) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| 301 (301) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 306 (306) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 307 (307) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 308 (308) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| 308 (308) | generations[0].to | End/current status unresolved; null does not assert current production. |
| 309 (309) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 4007 (4007) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 4008 (4008) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 405 (405) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 406 (406) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 407 (407) | from | No single defensible production interval for the selected line in the retained facts. |
| 407 (407) | to | End year/current production not established. Null here does not confirm ongoing production. |
| 407 (407) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 408 (408) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 5008 (5008) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| 5008 (5008) | generations[1].to | End/current status unresolved; null does not assert current production. |
| 508 (508) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 605 (605) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 607 (607) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 806 (806) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 807 (807) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Bipper (bipper) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Bipper (bipper) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Bipper (bipper) | from | No single defensible production interval for the selected line in the retained facts. |
| Bipper (bipper) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Bipper (bipper) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Boxer (boxer) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Boxer (boxer) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Boxer (boxer) | from | No single defensible production interval for the selected line in the retained facts. |
| Boxer (boxer) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Boxer (boxer) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Expert (expert) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Expert (expert) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Expert (expert) | from | No single defensible production interval for the selected line in the retained facts. |
| Expert (expert) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Expert (expert) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| iOn (ion) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| iOn (ion) | from | No single defensible production interval for the selected line in the retained facts. |
| iOn (ion) | to | End year/current production not established. Null here does not confirm ongoing production. |
| iOn (ion) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Partner (partner) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Partner (partner) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Partner (partner) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Partner (partner) | from | No single defensible production interval for the selected line in the retained facts. |
| Partner (partner) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Partner (partner) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| RCZ (rcz) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Rifter (rifter) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Rifter (rifter) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Rifter (rifter) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Rifter (rifter) | from | No single defensible production interval for the selected line in the retained facts. |
| Rifter (rifter) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Rifter (rifter) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Rifter (rifter) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Traveller (traveller) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Traveller (traveller) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Traveller (traveller) | from | No single defensible production interval for the selected line in the retained facts. |
| Traveller (traveller) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Traveller (traveller) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Citroën (citroen) — 39 lines

Ami, AX, Berlingo, BX, C-Crosser, C-Elysée, C-Zero, C1, C15, C2, C25, C3, C3 Aircross, C3 Picasso, C3 Pluriel, C4, C4 Aircross, C4 Cactus, C4 Picasso / SpaceTourer, C4 X, C5, C5 Aircross, C5 X, C6, C8, DS3, DS4, DS5, Evasion, Jumper, Jumpy, Nemo, Saxo, SpaceTourer, Xantia, XM, Xsara, Xsara Picasso, ZX.

### Excluded, merged or deferred

- **Grand C4 Picasso / Grand SpaceTourer** — merged: length variants merged into C4 Picasso / SpaceTourer.
- **Fukang / Chinese C-Elysée ZX / C6 China** — excluded: regional variants not conflated with the European cars.
- **DS3/DS4/DS5 badge migration** — deferred: lines retained but dates/QIDs require historic Citroën versus DS verification.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| Ami (ami) | bodyTypes | Quadricycle/body style does not fit the passenger-car enum; do not label it a hatchback. |
| Ami (ami) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| AX (ax) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Berlingo (berlingo) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Berlingo (berlingo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| BX (bx) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| C-Crosser (c-crosser) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| C-Elysée (c-elysee) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| C-Zero (c-zero) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| C15 (c15) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| C2 (c2) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| C25 (c25) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| C25 (c25) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| C25 (c25) | from | No single defensible production interval for the selected line in the retained facts. |
| C25 (c25) | to | End year/current production not established. Null here does not confirm ongoing production. |
| C25 (c25) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| C25 (c25) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| C3 (c3) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| C3 (c3) | generations[0].to | End/current status unresolved; null does not assert current production. |
| C3 (c3) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| C3 (c3) | generations[1].to | End/current status unresolved; null does not assert current production. |
| C3 (c3) | generations[3].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| C3 Aircross (c3-aircross) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| C3 Picasso (c3-picasso) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| C3 Pluriel (c3-pluriel) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| C3 Pluriel (c3-pluriel) | from | No single defensible production interval for the selected line in the retained facts. |
| C3 Pluriel (c3-pluriel) | to | End year/current production not established. Null here does not confirm ongoing production. |
| C3 Pluriel (c3-pluriel) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| C4 (c4) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| C4 Aircross (c4-aircross) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| C4 Cactus (c4-cactus) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| C4 Cactus (c4-cactus) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| C4 Picasso / SpaceTourer (c4-picasso) | generations[0].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| C4 Picasso / SpaceTourer (c4-picasso) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| C4 Picasso / SpaceTourer (c4-picasso) | generations[0].to | End/current status unresolved; null does not assert current production. |
| C4 Picasso / SpaceTourer (c4-picasso) | generations[1].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| C4 Picasso / SpaceTourer (c4-picasso) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| C4 Picasso / SpaceTourer (c4-picasso) | generations[1].to | End/current status unresolved; null does not assert current production. |
| C4 X (c4-x) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| C4 X (c4-x) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| C4 X (c4-x) | from | No single defensible production interval for the selected line in the retained facts. |
| C4 X (c4-x) | to | End year/current production not established. Null here does not confirm ongoing production. |
| C4 X (c4-x) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| C5 (c5) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| C5 (c5) | generations[1].to | End/current status unresolved; null does not assert current production. |
| C5 Aircross (c5-aircross) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| C5 X (c5-x) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| C6 (c6) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| C8 (c8) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| DS3 (ds3) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| DS3 (ds3) | from | No single defensible production interval for the selected line in the retained facts. |
| DS3 (ds3) | to | End year/current production not established. Null here does not confirm ongoing production. |
| DS3 (ds3) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| DS4 (ds4) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| DS4 (ds4) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| DS4 (ds4) | from | No single defensible production interval for the selected line in the retained facts. |
| DS4 (ds4) | to | End year/current production not established. Null here does not confirm ongoing production. |
| DS4 (ds4) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| DS4 (ds4) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| DS5 (ds5) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| DS5 (ds5) | from | No single defensible production interval for the selected line in the retained facts. |
| DS5 (ds5) | to | End year/current production not established. Null here does not confirm ongoing production. |
| DS5 (ds5) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| DS5 (ds5) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Evasion (evasion) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Jumper (jumper) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Jumper (jumper) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Jumper (jumper) | from | No single defensible production interval for the selected line in the retained facts. |
| Jumper (jumper) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Jumper (jumper) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Jumpy (jumpy) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Nemo (nemo) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Nemo (nemo) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Nemo (nemo) | from | No single defensible production interval for the selected line in the retained facts. |
| Nemo (nemo) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Nemo (nemo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Saxo (saxo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| SpaceTourer (spacetourer) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| SpaceTourer (spacetourer) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| SpaceTourer (spacetourer) | from | No single defensible production interval for the selected line in the retained facts. |
| SpaceTourer (spacetourer) | to | End year/current production not established. Null here does not confirm ongoing production. |
| SpaceTourer (spacetourer) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Xantia (xantia) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| XM (xm) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Xsara (xsara) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Xsara Picasso (xsara-picasso) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| ZX (zx) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Opel (opel) — 30 lines

Adam, Agila, Ampera, Ampera-e, Antara, Astra, Calibra, Cascada, Combo, Corsa, Crossland, Frontera, Grandland, Insignia, Kadett, Karl, Meriva, Mokka, Monterey, Movano, Omega, Senator, Signum, Sintra, Speedster, Tigra, Vectra, Vivaro, Zafira, Zafira Life.

### Excluded, merged or deferred

- **OPC / GSi / Line trims** — excluded: performance/equipment variants.
- **Vauxhall names** — excluded: separate make identities, not additional Opel lines.
- **Frontera regional generations** — excluded: new European crossover and older 4x4 require separate source windows; not blindly treated as one generation.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| Adam (adam) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Agila (agila) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Ampera (ampera) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Ampera (ampera) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Ampera (ampera) | from | No single defensible production interval for the selected line in the retained facts. |
| Ampera (ampera) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Ampera (ampera) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Ampera-e (ampera-e) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Ampera-e (ampera-e) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Ampera-e (ampera-e) | from | No single defensible production interval for the selected line in the retained facts. |
| Ampera-e (ampera-e) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Ampera-e (ampera-e) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Ampera-e (ampera-e) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Antara (antara) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Astra (astra) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Astra (astra) | generations[1].to | End/current status unresolved; null does not assert current production. |
| Astra (astra) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Astra (astra) | generations[2].to | End/current status unresolved; null does not assert current production. |
| Astra (astra) | generations[3].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Astra (astra) | generations[3].to | End/current status unresolved; null does not assert current production. |
| Calibra (calibra) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Cascada (cascada) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Combo (combo) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Combo (combo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Corsa (corsa) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Crossland (crossland) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Frontera (frontera) | from | No single defensible production interval for the selected line in the retained facts. |
| Frontera (frontera) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Frontera (frontera) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Frontera (frontera) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Grandland (grandland) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Insignia (insignia) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Kadett (kadett) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Kadett (kadett) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Karl (karl) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Meriva (meriva) | generations[0].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Meriva (meriva) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Meriva (meriva) | generations[0].to | End/current status unresolved; null does not assert current production. |
| Meriva (meriva) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Meriva (meriva) | generations[1].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Meriva (meriva) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Mokka (mokka) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Monterey (monterey) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Monterey (monterey) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Monterey (monterey) | from | No single defensible production interval for the selected line in the retained facts. |
| Monterey (monterey) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Monterey (monterey) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Monterey (monterey) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Movano (movano) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Movano (movano) | from | No single defensible production interval for the selected line in the retained facts. |
| Movano (movano) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Movano (movano) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Omega (omega) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Senator (senator) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Signum (signum) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Sintra (sintra) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Speedster (speedster) | from | No single defensible production interval for the selected line in the retained facts. |
| Speedster (speedster) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Speedster (speedster) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Tigra (tigra) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Vectra (vectra) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Vivaro (vivaro) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Vivaro (vivaro) | from | No single defensible production interval for the selected line in the retained facts. |
| Vivaro (vivaro) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Vivaro (vivaro) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Vivaro (vivaro) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Zafira (zafira) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Zafira Life (zafira-life) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Zafira Life (zafira-life) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Zafira Life (zafira-life) | from | No single defensible production interval for the selected line in the retained facts. |
| Zafira Life (zafira-life) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Zafira Life (zafira-life) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Zafira Life (zafira-life) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Fiat (fiat) — 37 lines

124 Spider, 500, 500L, 500X, 600, Albea, Barchetta, Bravo / Brava, Cinquecento, Coupé, Croma, Doblò, Ducato, Fiorino, Freemont, Fullback, Grande Panda, Idea, Linea, Marea, Multipla, Palio, Panda, Punto, Qubo, Scudo, Sedici, Seicento, Siena, Stilo, Strada, Talento, Tempra, Tipo, Topolino, Ulysse, Uno.

### Excluded, merged or deferred

- **Abarth 500 / 595 / 695 / 124** — excluded: separate Abarth badge; not ordinary Fiat trims.
- **Punto Evo / Grande Punto** — merged: renamed/facelift family under Punto.
- **Egea** — excluded: regional Tipo name.
- **Toro / Cronos / Argo / Pulse / Fastback / Mobi** — excluded: regional-market lines outside this pass.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| 124 Spider (124-spider) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 500 (500) | productionPeriods | Reused/renamed badge or multiple production runs; periods are not a claim of continuous production or generation equivalence. |
| 500 (500) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| 500 (500) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 500L (500l) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 500X (500x) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 600 (600) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Albea (albea) | from | No single defensible production interval for the selected line in the retained facts. |
| Albea (albea) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Albea (albea) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Barchetta (barchetta) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Bravo / Brava (bravo) | productionPeriods | Reused/renamed badge or multiple production runs; periods are not a claim of continuous production or generation equivalence. |
| Bravo / Brava (bravo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Cinquecento (cinquecento) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Coupé (coupe) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Croma (croma) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Doblò (doblo) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Doblò (doblo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Ducato (ducato) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Fiorino (fiorino) | from | No single defensible production interval for the selected line in the retained facts. |
| Fiorino (fiorino) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Fiorino (fiorino) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Freemont (freemont) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Freemont (freemont) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Freemont (freemont) | from | No single defensible production interval for the selected line in the retained facts. |
| Freemont (freemont) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Freemont (freemont) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Freemont (freemont) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Fullback (fullback) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Grande Panda (grande-panda) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Grande Panda (grande-panda) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Idea (idea) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Linea (linea) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Marea (marea) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Multipla (multipla) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Palio (palio) | from | No single defensible production interval for the selected line in the retained facts. |
| Palio (palio) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Palio (palio) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Punto (punto) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Punto (punto) | generations[1].to | End/current status unresolved; null does not assert current production. |
| Punto (punto) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Punto (punto) | generations[2].to | End/current status unresolved; null does not assert current production. |
| Qubo (qubo) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Qubo (qubo) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Qubo (qubo) | from | No single defensible production interval for the selected line in the retained facts. |
| Qubo (qubo) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Qubo (qubo) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Qubo (qubo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Scudo (scudo) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Scudo (scudo) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Scudo (scudo) | from | No single defensible production interval for the selected line in the retained facts. |
| Scudo (scudo) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Scudo (scudo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Sedici (sedici) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Seicento (seicento) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Siena (siena) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Stilo (stilo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Strada (strada) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Talento (talento) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Talento (talento) | from | No single defensible production interval for the selected line in the retained facts. |
| Talento (talento) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Talento (talento) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Talento (talento) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Tempra (tempra) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Tipo (tipo) | productionPeriods | Reused/renamed badge or multiple production runs; periods are not a claim of continuous production or generation equivalence. |
| Tipo (tipo) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Tipo (tipo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Topolino (topolino) | bodyTypes | Quadricycle/body style does not fit the passenger-car enum; do not label it a hatchback. |
| Topolino (topolino) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Topolino (topolino) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Topolino (topolino) | from | No single defensible production interval for the selected line in the retained facts. |
| Topolino (topolino) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Topolino (topolino) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Topolino (topolino) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Ulysse (ulysse) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Ulysse (ulysse) | from | No single defensible production interval for the selected line in the retained facts. |
| Ulysse (ulysse) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Ulysse (ulysse) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Uno (uno) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## SEAT (seat) — 16 lines

Alhambra, Altea, Arona, Arosa, Ateca, Córdoba, Exeo, Ibiza, Inca, Leon, Málaga, Marbella, Mii, Tarraco, Terra, Toledo.

### Excluded, merged or deferred

- **Cupra performance trims before marque separation** — merged: merged into base SEAT family; independent Cupra make handled separately.
- **Ronda / Fura** — excluded: production ended before the target period.
- **Altea XL / Freetrack** — merged: length/equipment derivatives under Altea.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| Alhambra (alhambra) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Alhambra (alhambra) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Altea (altea) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Arona (arona) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Arosa (arosa) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Ateca (ateca) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Córdoba (cordoba) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Exeo (exeo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Ibiza (ibiza) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Ibiza (ibiza) | generations[0].to | End/current status unresolved; null does not assert current production. |
| Inca (inca) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Leon (leon) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Leon (leon) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Leon (leon) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| Leon (leon) | generations[3].bodyTypes | No explicit generation-specific body mapping. |
| Málaga (malaga) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Marbella (marbella) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Mii (mii) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Mii (mii) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Tarraco (tarraco) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Terra (terra) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Terra (terra) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Terra (terra) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Terra (terra) | from | No single defensible production interval for the selected line in the retained facts. |
| Terra (terra) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Terra (terra) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Terra (terra) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Cupra (cupra) — 6 lines

Ateca, Born, Formentor, Leon, Tavascan, Terramar.

### Excluded, merged or deferred

- **GT / VZ / VZ5** — excluded: powertrain/equipment variants.
- **Raval / DarkRebel / UrbanRebel / Tindaya** — deferred: not admitted without verified production-market evidence; concepts/future programmes remain outside this pass.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| Ateca (ateca) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Ateca (ateca) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Ateca (ateca) | from | No single defensible production interval for the selected line in the retained facts. |
| Ateca (ateca) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Ateca (ateca) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Ateca (ateca) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Born (born) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Formentor (formentor) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Leon (leon) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Leon (leon) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Leon (leon) | from | No single defensible production interval for the selected line in the retained facts. |
| Leon (leon) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Leon (leon) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Tavascan (tavascan) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Terramar (terramar) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## MINI (mini) — 8 lines

Aceman, Classic, Clubman, Cooper, Countryman, Coupé, Paceman, Roadster.

### Excluded, merged or deferred

- **John Cooper Works / Cooper S / SE / One** — merged: equipment/performance/powertrain derivatives.
- **Convertible** — merged: body derivative merged into Cooper.
- **Vision concepts** — excluded: concepts.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| Aceman (aceman) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Aceman (aceman) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Classic (classic) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Classic (classic) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Clubman (clubman) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Cooper (cooper) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Cooper (cooper) | generations[0].to | End/current status unresolved; null does not assert current production. |
| Cooper (cooper) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Cooper (cooper) | generations[1].to | End/current status unresolved; null does not assert current production. |
| Cooper (cooper) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Cooper (cooper) | generations[2].to | End/current status unresolved; null does not assert current production. |
| Countryman (countryman) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Countryman (countryman) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Countryman (countryman) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| Coupé (coupe) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Coupé (coupe) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Paceman (paceman) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Roadster (roadster) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Roadster (roadster) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Volvo (volvo) — 30 lines

240, 340 / 360, 440, 460, 480, 740, 760, 780, 850, 940, 960, C30, C70, EC40, ES90, EX30, EX90, S40, S60, S70, S80, S90, V40, V60, V70, V90, XC40, XC60, XC70, XC90.

### Excluded, merged or deferred

- **Cross Country variants of V40/V60/V90** — merged: body/equipment derivatives; XC70 historic name retained.
- **EX40** — merged: electric XC40 rename retained as alias.
- **XC70 (2025) / EM90 / S80L / S90L** — deferred: regional-only or regional long-wheelbase variants not admitted to this Europe-focused pass.
- **Polestar 1/2/3/4** — excluded: separate make.
- **EX60** — deferred: not admitted without a separately checked current production source in this pass.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| 240 (240) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 340 / 360 (340-360) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 440 (440) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| 440 (440) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 460 (460) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 480 (480) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 740 (740) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 760 (760) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 780 (780) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 850 (850) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 940 (940) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 960 (960) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| 960 (960) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| C30 (c30) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| C70 (c70) | from | No single defensible production interval for the selected line in the retained facts. |
| C70 (c70) | to | End year/current production not established. Null here does not confirm ongoing production. |
| C70 (c70) | generations[0].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| C70 (c70) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| C70 (c70) | generations[0].to | End/current status unresolved; null does not assert current production. |
| C70 (c70) | generations[1].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| EC40 (ec40) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| EC40 (ec40) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| ES90 (es90) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| EX30 (ex30) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| EX90 (ex90) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| S40 (s40) | from | No single defensible production interval for the selected line in the retained facts. |
| S40 (s40) | to | End year/current production not established. Null here does not confirm ongoing production. |
| S40 (s40) | generations[0].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| S40 (s40) | generations[1].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| S60 (s60) | generations[0].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| S60 (s60) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| S60 (s60) | generations[1].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| S60 (s60) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| S60 (s60) | generations[2].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| S60 (s60) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| S60 (s60) | generations[2].to | End/current status unresolved; null does not assert current production. |
| S60 (s60) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| S70 (s70) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| S80 (s80) | from | No single defensible production interval for the selected line in the retained facts. |
| S80 (s80) | to | End year/current production not established. Null here does not confirm ongoing production. |
| S80 (s80) | generations[0].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| S80 (s80) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| S80 (s80) | generations[1].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| S80 (s80) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| S80 (s80) | generations[1].to | End/current status unresolved; null does not assert current production. |
| S80 (s80) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| S90 (s90) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| S90 (s90) | from | No single defensible production interval for the selected line in the retained facts. |
| S90 (s90) | to | End year/current production not established. Null here does not confirm ongoing production. |
| S90 (s90) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| V40 (v40) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| V40 (v40) | from | No single defensible production interval for the selected line in the retained facts. |
| V40 (v40) | to | End year/current production not established. Null here does not confirm ongoing production. |
| V40 (v40) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| V40 (v40) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| V60 (v60) | generations[0].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| V60 (v60) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| V60 (v60) | generations[1].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| V60 (v60) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| V70 (v70) | generations[0].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| V70 (v70) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| V70 (v70) | generations[0].to | End/current status unresolved; null does not assert current production. |
| V70 (v70) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| V70 (v70) | generations[1].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| V70 (v70) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| V70 (v70) | generations[2].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| V70 (v70) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| V90 (v90) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| V90 (v90) | from | No single defensible production interval for the selected line in the retained facts. |
| V90 (v90) | to | End year/current production not established. Null here does not confirm ongoing production. |
| V90 (v90) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| XC40 (xc40) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| XC60 (xc60) | generations[0].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| XC60 (xc60) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| XC60 (xc60) | generations[1].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| XC60 (xc60) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| XC70 (xc70) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| XC70 (xc70) | from | No single defensible production interval for the selected line in the retained facts. |
| XC70 (xc70) | to | End year/current production not established. Null here does not confirm ongoing production. |
| XC70 (xc70) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| XC90 (xc90) | generations[0].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| XC90 (xc90) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| XC90 (xc90) | generations[0].to | End/current status unresolved; null does not assert current production. |
| XC90 (xc90) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| XC90 (xc90) | generations[1].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.
