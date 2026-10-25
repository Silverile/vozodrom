# Curated car model lines — 30 makes

Delivered **746 manually selected model-line entries across 30 makes**, with **433 sourced generation entries**. The ten demo makes were handled first, followed by the remaining queue order through **Daewoo**. All **25 exact demo slugs** are preserved, including **volkswagen/id4**, not id-4. No routes or application code were changed.

**This is not complete factual enrichment of all 30 makes.** 199 lines retain unresolved production intervals, 47 have bodyTypes=null, 612 have generations=null, and 54 have no unique line-level Wikidata match. There are 2081 explicit needsReview items, including indexed generation fields; all are listed below. Missing generations mean unreviewed/incomplete, not that the car has no generations. The remaining 10 makes were not processed. Batch 1 added Saab, Honda, Mazda, Nissan and Mitsubishi. Batch 2 adds Subaru, Suzuki, Lexus, Chevrolet and Daewoo; all 644 prior entries are preserved exactly against SHA-256 baselines.

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
| Saab | saab | 5 | 5 | 5 | 6 | 5 |
| Honda | honda | 23 | 16 | 20 | 17 | 23 |
| Mazda | mazda | 31 | 24 | 31 | 18 | 31 |
| Nissan | nissan | 43 | 16 | 38 | 18 | 43 |
| Mitsubishi | mitsubishi | 22 | 15 | 22 | 12 | 22 |
| Subaru | subaru | 19 | 9 | 18 | 26 | 19 |
| Suzuki | suzuki | 21 | 8 | 19 | 8 | 21 |
| Lexus | lexus | 17 | 12 | 17 | 29 | 17 |
| Chevrolet | chevrolet | 31 | 14 | 31 | 16 | 31 |
| Daewoo | daewoo | 14 | 3 | 14 | 0 | 14 |

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

- [Nissan Europe: nissan-cube-europe-2008](https://europe.nissannews.com/en-GB/releases/nissan-cube-comes-to-europe) — factual chronology/current-market checks recorded in model-line-primary-facts.json.
- [Mazda UK: mazda-6e-europe-2025](https://uk.mazda-press.com/news/2025/all-new-mazda6e-unveiled-at-brussels-motor-show/) — factual chronology/current-market checks recorded in model-line-primary-facts.json.
- [Honda Europe: honda-prelude-europe-2025](https://hondanews.eu/gb/en/cars/media/pressreleases/553584/honda-welcomes-back-iconic-prelude-nameplate-as-hybrid-sports-coupe-returns-to-europe-after-25-years) — factual chronology/current-market checks recorded in model-line-primary-facts.json.
- [Mitsubishi Motors: mitsubishi-grandis-europe-2025](https://www.mitsubishi-motors.com/en/newsroom/newsrelease/2025/20250702_1.html?intcid3=FBen_20250702_b) — factual chronology/current-market checks recorded in model-line-primary-facts.json.
- [Škoda Auto: skoda-octavia-2026](https://www.skoda-auto.cz/novinky/novinky-detail/2026-08-27-skoda-octavia-slavi-30-let-tri-dekady-ikonickeho-modelu) — factual chronology/current-market checks recorded in model-line-primary-facts.json.
- [Škoda Auto: skoda-production-2024](https://reporting.skoda-auto.com/archive/2024/production) — factual chronology/current-market checks recorded in model-line-primary-facts.json.
- [Škoda Auto: skoda-epiq-2026](https://www.skoda-auto.cz/novinky/novinky-detail/2026-10-06-skoda-epiq-prichazi-na-cesky-trh-za-doporucene-prodejni-ceny-od-619-000-kc) — factual chronology/current-market checks recorded in model-line-primary-facts.json.
- [BMW Group: bmw-3-production-2025](https://www.press.bmwgroup.com/global/article/detail/T0454448EN/50-years-of-bmw-3-series-production-%20-an-international-success-story) — factual chronology/current-market checks recorded in model-line-primary-facts.json.
- [Subaru Europe: subaru-crosstrek-europe-2023](https://www.subaru.eu/media/subaru-launches-all-new-crosstrek-in-europe) — factual chronology/current-market checks recorded in model-line-primary-facts.json.
- [Subaru Europe: subaru-bev-europe-2025](https://www.subaru.eu/media/subaru-confirms-new-electric-range-for-europe) — factual chronology/current-market checks recorded in model-line-primary-facts.json.
- [Suzuki Motor Corporation: suzuki-toyota-supply-2021](https://www.globalsuzuki.com/ir/library/annualreport/pdf/2021/2021.pdf) — factual chronology/current-market checks recorded in model-line-primary-facts.json.
- [Suzuki Motor Corporation: suzuki-e-vitara-report-2025](https://www.globalsuzuki.com/ir/library/annualreport/pdf/2025/2025.pdf) — factual chronology/current-market checks recorded in model-line-primary-facts.json.
- [Suzuki Motor Corporation: suzuki-europe-results-2026](https://www.globalsuzuki.com/ir/library/financialresults/pdf/2025/financial_presentation_s.pdf) — factual chronology/current-market checks recorded in model-line-primary-facts.json.
- [Lexus UK: lexus-lbx-europe-2023](https://media.lexus.co.uk/world-premiere-of-the-all-new-lexus-lbx/) — factual chronology/current-market checks recorded in model-line-primary-facts.json.
- [Lexus UK: lexus-lm-europe](https://media.lexus.co.uk/vehicles/lm-2023-current/) — factual chronology/current-market checks recorded in model-line-primary-facts.json.
- [Lexus Europe: lexus-europe-million-2020](https://newsroom.lexus.eu/lexus-records-one-million-sales-in-europe/) — factual chronology/current-market checks recorded in model-line-primary-facts.json.

Octavia III uses **2012–2020** from Škoda’s 2026 history instead of the retrieved Wikipedia field ending in 2019. BMW’s manufacturing history corroborates production starts earlier than familiar launch years (for example E46 in 1997 versus its 1998 market introduction). Its global sixth-generation range is not substituted for an unresolved European body/market end date. Epiq is included after checking Škoda’s October 2026 Czech-market announcement. These targeted checks do not independently certify all remaining Wikipedia facts.

## Evidence and reproduction

- model-line-selection.mjs: manual family list, Czech names, body proposals, aliases and fixed demo slugs.
- model-line-decisions.mjs: manual range/identity decisions, reviewed generation families and excluded/merged/deferred groups.
- model-line-evidence.json: retrieved factual fields, source article titles, revision IDs, Wikidata page properties and request timestamps. Source URLs appear in every output line and generation; Wikipedia uses fixed oldid revisions, with manufacturer URLs where checked.
- model-line-decisions.json: per-line resolved articles, source production facts and generation labels used.
- model-line-exclusions.json: machine-readable per-make decisions. A regional exclusion is an editorial boundary, not a claim that private imports never occur.

Rebuild offline with node analysis/codex/build-model-lines.mjs, then node analysis/codex/write-model-lines-review.mjs. Validate with node analysis/codex/validate-model-lines.mjs. Live evidence refresh is optional and separate: fetch-model-line-evidence.mjs uses Wikipedia's API with revision IDs and rate-limit retries. No marketplace database was used.

The validation script checks UTF-8 JSON, ordering, make/scoped-slug references, all 25 demo routes' slugs, source retrievals, date values appearing in the retained evidence, generation/source references, body enum values and explicit unknown-field flags. It does **not** prove historical accuracy of every Wikipedia fact or completeness of every model range.

## Batch 1 review

The five added makes contain Saab 5, Honda 23, Mazda 31, Nissan 43 and Mitsubishi 22 lines. These are editorial European-market selections, not complete global inventories. The original 520 line objects are unchanged. In particular:

- Grandis includes the historic MPV and acknowledged 2025 European SUV name reuse; chronology remains unresolved. The Mitsubishi manufacturer source confirms the new programme, but donor Renault dates are not substituted.
- Space Star acknowledges the older MPV and later Mirage-derived hatchback. Space Gear/L300 and other shared badges retain unknown chronology rather than inheriting global Delica production.
- Honda Accord, Integra, Legend, City and Insight do not inherit later non-European generations as current European cars. Jazz/CR-V source sequences are partial, with mixed regional codes left unresolved. Prelude revival is corroborated by Honda Europe.
- Mazda 2 Hybrid, 5, 6e, 121 and 929 have unresolved badge-specific windows. Mazda6e European identity/body is checked with Mazda; on-sale years are not assigned as production dates.
- Nissan Cube is retained following the manufacturer European launch source. Almera Tino, Bluebird and Prairie are included. Renault-based vans retain separate European badges with unresolved phase dates; older/current Japanese Serena/Note/Maxima successors are not declared European.
- Published source-production intervals may extend beyond European sale or import windows. Regional/late programmes omitted from generation arrays remain outside the reviewed sequence.

The generation arrays are sorted by known production start within the added batch; null dates do not imply a complete chronological sequence. Every outstanding field-level review item is listed by make below.

## Batch 2 review

Added Subaru 19, Suzuki 21, Lexus 17, Chevrolet 31 and Daewoo 14 lines. All 644 prior line objects remain unchanged. Chevrolet is a lean European/global-import selection, not a complete North-American truck catalogue.

- Chevrolet Kalos/Sonic, Matiz and Nubira are merged as aliases of Aveo, Spark and Lacetti respectively; Tacuma is merged into Rezzo. Daewoo-badge lines remain separate by make. SS/Z06/ZR1/engine grades and special truck derivatives are not separate lines.
- Subaru XV is retained as a Crosstrek alias, with the manufacturer-confirmed rename. The 2011 European XV launch differs from retained global production fields starting in 2012; exact line chronology stays unresolved. Uncharted and E-Outback are acknowledged European programmes with planned 2026 launches; production dates are not inferred from announcements.
- Suzuki Across and Swace identities are manufacturer-confirmed Toyota supply programmes. Donor RAV4/Corolla production dates do not establish Suzuki badge dates. The e Vitara is separately included following checked manufacturer production/European launch evidence. Suzuki confirms European Jimny/Ignis sales discontinuation; a global current flag is not local availability.
- Lexus GX/LX are retained as global/import lines, corroborated in Lexus eastern-European reporting; current Czech official sale is not asserted. LM and LBX European identities have manufacturer sources. ES generation review omits early non-European generations. RX starts in 1998 from explicit Lexus-badge production, not the parent Toyota Harrier start in 1997.
- Lexus GS chronology remains null because the extracted source fields contain unexpanded snd separators. Its sourced generation codes are retained without guessing date ranges.
- Daewoo badge phases are not assigned extended Chevrolet/Uzbek/licence-built successor dates. Lanos and Leganza retain explicitly selected Daewoo/European source windows; Musso/Korando/Lublin exact Daewoo phases remain unresolved. Polonez is deferred because Daewoo corporate ownership alone does not establish a unique Daewoo model identity.

All null fields and scope/generation limitations are listed in the per-make tables below. Selected manufacturer checks corroborate particular facts; they do not certify the entire dataset.

## Where this turn stops

Next: **Daihatsu**. Remaining queue: daihatsu, ssangyong-kgm, land-rover, jaguar, porsche, jeep, alfa-romeo, lancia, smart, mg. Metadata reconciliation for the delivered 30, especially shared vans, Citroën/DS phases, reused BMW i3/iX3/Volvo names and region-specific generation boundaries, remains explicitly outstanding. Late-2026 programmes without checked production evidence were not silently added.

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

## Saab (saab) — 5 lines

9-3, 9-4X, 9-5, 900, 9000.

### Excluded, merged or deferred

- **Aero / Viggen / Griffin / Turbo X** — merged: equipment/performance derivatives merged into their parent lines.
- **9-2X / 9-7X** — excluded: North-American badge programmes outside this ordinary European-market selection.
- **92 / 93 / 95 / 96 / 99 / Sonett / 90** — excluded: production ended before the approximately 1990 target window.
- **9-X / Aero X / PhoeniX** — excluded: concept vehicles.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| 9-3 (9-3) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| 9-3 (9-3) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| 9-3 (9-3) | generations[0].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| 9-4X (9-4x) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 9-4X (9-4x) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| 9-5 (9-5) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| 9-5 (9-5) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| 9-5 (9-5) | to | Parent source ends in 2012 but retained generation facts end in 2011; source-production bound requires reconciliation. |
| 9-5 (9-5) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| 9-5 (9-5) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| 900 (900) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| 900 (900) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| 900 (900) | generations[0].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| 900 (900) | generations[1].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| 9000 (9000) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 9000 (9000) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Honda (honda) — 23 lines

Accord, City, Civic, Concerto, CR-V, CR-Z, CRX, CRX del Sol, e, e:Ny1, FR-V, HR-V, Insight, Integra, Jazz, Legend, Logo, NSX, Prelude, S2000, Shuttle, Stream, ZR-V.

### Excluded, merged or deferred

- **Type R / Type S / Mugen / Si** — merged: performance/equipment variants merged into base model lines.
- **Fit** — merged: regional name retained as Jazz alias.
- **Civic Aerodeck / Accord Tourer** — excluded: body variants under Civic/Accord.
- **Pilot / Passport / Ridgeline / Crosstour / Element / Acura badges** — excluded: regional or separate-marque programmes outside this ordinary European-market selection.
- **N-Box / N-One / Beat / S660** — excluded: regional kei-car programmes outside this pass.
- **Quintet** — excluded: production ended before the target period.
- **Prologue / 0 Series / concepts** — excluded: European production-market presence not established in this pass.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| Accord (accord) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Accord (accord) | from | No single defensible production interval for the selected line in the retained facts. |
| Accord (accord) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Accord (accord) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Accord (accord) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| City (city) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| City (city) | from | No single defensible production interval for the selected line in the retained facts. |
| City (city) | to | End year/current production not established. Null here does not confirm ongoing production. |
| City (city) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| City (city) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Civic (civic) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Civic (civic) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Concerto (concerto) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Concerto (concerto) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| CR-V (cr-v) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| CR-V (cr-v) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| CR-V (cr-v) | generations[0].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| CR-V (cr-v) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| CR-V (cr-v) | generations[1].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| CR-V (cr-v) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| CR-V (cr-v) | generations[3].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| CR-V (cr-v) | generations[4].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| CR-V (cr-v) | generations[5].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| CR-Z (cr-z) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| CR-Z (cr-z) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| CR-Z (cr-z) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| CRX (crx) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| CRX (crx) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| CRX (crx) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| CRX (crx) | generations[0].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| CRX (crx) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| CRX del Sol (crx-del-sol) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| CRX del Sol (crx-del-sol) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| e (e) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| e (e) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| e:Ny1 (e-ny1) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| e:Ny1 (e-ny1) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| e:Ny1 (e-ny1) | from | No single defensible production interval for the selected line in the retained facts. |
| e:Ny1 (e-ny1) | to | End year/current production not established. Null here does not confirm ongoing production. |
| e:Ny1 (e-ny1) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| e:Ny1 (e-ny1) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| e:Ny1 (e-ny1) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| FR-V (fr-v) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| FR-V (fr-v) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| HR-V (hr-v) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| HR-V (hr-v) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| HR-V (hr-v) | generations | The source-current model line has no reviewed current generation; the sequence is incomplete. |
| Insight (insight) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Insight (insight) | from | No single defensible production interval for the selected line in the retained facts. |
| Insight (insight) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Insight (insight) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Insight (insight) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Insight (insight) | scope | Name reuse/new European programme requires badge-specific chronology; donor-platform dates or a global current flag must not imply one continuous European generation. |
| Integra (integra) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Integra (integra) | from | No single defensible production interval for the selected line in the retained facts. |
| Integra (integra) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Integra (integra) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Integra (integra) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Jazz (jazz) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Jazz (jazz) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| Jazz (jazz) | generations[0].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Jazz (jazz) | generations[1].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Jazz (jazz) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| Jazz (jazz) | generations[3].bodyTypes | No explicit generation-specific body mapping. |
| Legend (legend) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Legend (legend) | from | No single defensible production interval for the selected line in the retained facts. |
| Legend (legend) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Legend (legend) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Legend (legend) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Logo (logo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Logo (logo) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| NSX (nsx) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| NSX (nsx) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| NSX (nsx) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Prelude (prelude) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Prelude (prelude) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| S2000 (s2000) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| S2000 (s2000) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Shuttle (shuttle) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Shuttle (shuttle) | from | No single defensible production interval for the selected line in the retained facts. |
| Shuttle (shuttle) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Shuttle (shuttle) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Shuttle (shuttle) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Stream (stream) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Stream (stream) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| ZR-V (zr-v) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| ZR-V (zr-v) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Mazda (mazda) — 31 lines

121, 2, 2 Hybrid, 3, 323, 5, 6, 626, 6e, 929, B-Series, BT-50, CX-3, CX-30, CX-5, CX-60, CX-7, CX-80, Demio, E-Series, MPV, MX-3, MX-30, MX-5, MX-6, Premacy, RX-7, RX-8, Tribute, Xedos 6, Xedos 9.

### Excluded, merged or deferred

- **MPS / Mazdaspeed / GT / Sport** — merged: performance/equipment derivatives.
- **Axela / Atenza / Familia / Capella** — excluded: regional names; corresponding European lines retained.
- **CX-9 / CX-8 / CX-50 / CX-70 / CX-90** — excluded: regional-market programmes outside this Europe-focused pass; private imports can exist.
- **CX-6e / Iconic SP / concepts** — deferred: not admitted without checked European production evidence.
- **RX-9 / MX-5 special editions** — merged: unverified future programmes or edition derivatives.
- **MPV third generation / late Japanese Bongo successors** — excluded: regional-only successors not asserted to be European.
- **Cosmo / Autozam AZ-1 / Carol / Scrum** — excluded: regional low-volume or kei programmes outside this pass.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| 121 (121) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| 121 (121) | from | No single defensible production interval for the selected line in the retained facts. |
| 121 (121) | to | End year/current production not established. Null here does not confirm ongoing production. |
| 121 (121) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 121 (121) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| 2 (2) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 2 (2) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| 2 Hybrid (2-hybrid) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| 2 Hybrid (2-hybrid) | from | No single defensible production interval for the selected line in the retained facts. |
| 2 Hybrid (2-hybrid) | to | End year/current production not established. Null here does not confirm ongoing production. |
| 2 Hybrid (2-hybrid) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 2 Hybrid (2-hybrid) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| 3 (3) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| 3 (3) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| 3 (3) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| 3 (3) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| 3 (3) | generations[2].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| 3 (3) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| 3 (3) | generations[3].bodyTypes | No explicit generation-specific body mapping. |
| 323 (323) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 323 (323) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| 5 (5) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| 5 (5) | from | No single defensible production interval for the selected line in the retained facts. |
| 5 (5) | to | End year/current production not established. Null here does not confirm ongoing production. |
| 5 (5) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 5 (5) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| 6 (6) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| 6 (6) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| 6 (6) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| 626 (626) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 626 (626) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| 6e (6e) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| 6e (6e) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| 6e (6e) | from | No single defensible production interval for the selected line in the retained facts. |
| 6e (6e) | to | End year/current production not established. Null here does not confirm ongoing production. |
| 6e (6e) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| 6e (6e) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 6e (6e) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| 929 (929) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| 929 (929) | from | No single defensible production interval for the selected line in the retained facts. |
| 929 (929) | to | End year/current production not established. Null here does not confirm ongoing production. |
| 929 (929) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 929 (929) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| B-Series (b-series) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| B-Series (b-series) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| BT-50 (bt-50) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| BT-50 (bt-50) | from | No single defensible production interval for the selected line in the retained facts. |
| BT-50 (bt-50) | to | End year/current production not established. Null here does not confirm ongoing production. |
| BT-50 (bt-50) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| BT-50 (bt-50) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| CX-3 (cx-3) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| CX-3 (cx-3) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| CX-30 (cx-30) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| CX-30 (cx-30) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| CX-5 (cx-5) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| CX-5 (cx-5) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| CX-5 (cx-5) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| CX-5 (cx-5) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| CX-5 (cx-5) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| CX-60 (cx-60) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| CX-60 (cx-60) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| CX-7 (cx-7) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| CX-7 (cx-7) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| CX-80 (cx-80) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| CX-80 (cx-80) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Demio (demio) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Demio (demio) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| E-Series (e-series) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| E-Series (e-series) | from | No single defensible production interval for the selected line in the retained facts. |
| E-Series (e-series) | to | End year/current production not established. Null here does not confirm ongoing production. |
| E-Series (e-series) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| E-Series (e-series) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| MPV (mpv) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| MPV (mpv) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| MX-3 (mx-3) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| MX-3 (mx-3) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| MX-30 (mx-30) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| MX-30 (mx-30) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| MX-5 (mx-5) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| MX-5 (mx-5) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| MX-6 (mx-6) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| MX-6 (mx-6) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| MX-6 (mx-6) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| MX-6 (mx-6) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Premacy (premacy) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Premacy (premacy) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| RX-7 (rx-7) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| RX-7 (rx-7) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| RX-8 (rx-8) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| RX-8 (rx-8) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Tribute (tribute) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Tribute (tribute) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Xedos 6 (xedos-6) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Xedos 6 (xedos-6) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Xedos 9 (xedos-9) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Xedos 9 (xedos-9) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Nissan (nissan) — 43 lines

100 NX, 200 SX, 300 ZX, 350 Z, 370 Z, Almera, Almera Tino, Ariya, Atleon, Bluebird, Cabstar, Cube, GT-R, Interstar, Juke, Kubistar, Leaf, Maxima, Micra, Murano, Navara, Note, NV200, NV250, NV300, NV400, Pathfinder, Patrol, Pick Up, Pixo, Prairie, Primastar, Primera, Pulsar, Qashqai, Serena, Sunny, Terrano, Tiida, Townstar, Trade, Vanette, X-Trail.

### Excluded, merged or deferred

- **Nismo / Tekna / DIG-T / dCi** — excluded: performance, equipment and engine variants.
- **Qashqai+2 / Evalia / e-NV200** — merged: length, passenger or powertrain derivatives merged into corresponding families.
- **Rogue / Sentra / Altima / Armada / Titan / Kicks / Quest / Elgrand** — excluded: regional programmes outside this ordinary European-market pass.
- **Skyline / Silvia Japanese badge / Figaro / Pao / Z RZ34** — excluded: regional badges or grey-import lines outside the European-name selection; European 200 SX retained.
- **Terrano D10** — excluded: regional Duster-based badge, not the European Terrano II.
- **Primastar / NV300 and Interstar / NV400 badge phases** — excluded: separately listed European sales names; exact phase dates need badge-specific evidence.
- **Nissan Z Proto / IDx / concepts** — excluded: concept or future programmes.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| 100 NX (100-nx) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 100 NX (100-nx) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| 200 SX (200-sx) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| 200 SX (200-sx) | from | No single defensible production interval for the selected line in the retained facts. |
| 200 SX (200-sx) | to | End year/current production not established. Null here does not confirm ongoing production. |
| 200 SX (200-sx) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 200 SX (200-sx) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| 300 ZX (300-zx) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 300 ZX (300-zx) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| 350 Z (350-z) | from | No single defensible production interval for the selected line in the retained facts. |
| 350 Z (350-z) | to | End year/current production not established. Null here does not confirm ongoing production. |
| 350 Z (350-z) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 350 Z (350-z) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| 370 Z (370-z) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 370 Z (370-z) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Almera (almera) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Almera (almera) | from | No single defensible production interval for the selected line in the retained facts. |
| Almera (almera) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Almera (almera) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Almera (almera) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Almera Tino (almera-tino) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Almera Tino (almera-tino) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Ariya (ariya) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Ariya (ariya) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Atleon (atleon) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Atleon (atleon) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Atleon (atleon) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Bluebird (bluebird) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Bluebird (bluebird) | from | No single defensible production interval for the selected line in the retained facts. |
| Bluebird (bluebird) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Bluebird (bluebird) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Bluebird (bluebird) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Cabstar (cabstar) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Cabstar (cabstar) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Cabstar (cabstar) | from | No single defensible production interval for the selected line in the retained facts. |
| Cabstar (cabstar) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Cabstar (cabstar) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Cabstar (cabstar) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Cabstar (cabstar) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Cube (cube) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Cube (cube) | from | No single defensible production interval for the selected line in the retained facts. |
| Cube (cube) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Cube (cube) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Cube (cube) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| GT-R (gt-r) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| GT-R (gt-r) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Interstar (interstar) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Interstar (interstar) | from | No single defensible production interval for the selected line in the retained facts. |
| Interstar (interstar) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Interstar (interstar) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Interstar (interstar) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Juke (juke) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Juke (juke) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| Juke (juke) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Juke (juke) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Kubistar (kubistar) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Kubistar (kubistar) | from | No single defensible production interval for the selected line in the retained facts. |
| Kubistar (kubistar) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Kubistar (kubistar) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Kubistar (kubistar) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Kubistar (kubistar) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Leaf (leaf) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Leaf (leaf) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Maxima (maxima) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Maxima (maxima) | from | No single defensible production interval for the selected line in the retained facts. |
| Maxima (maxima) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Maxima (maxima) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Maxima (maxima) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Micra (micra) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Micra (micra) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| Murano (murano) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Murano (murano) | from | No single defensible production interval for the selected line in the retained facts. |
| Murano (murano) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Murano (murano) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Murano (murano) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Navara (navara) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Navara (navara) | from | No single defensible production interval for the selected line in the retained facts. |
| Navara (navara) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Navara (navara) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Navara (navara) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Note (note) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Note (note) | from | No single defensible production interval for the selected line in the retained facts. |
| Note (note) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Note (note) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Note (note) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| NV200 (nv200) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| NV200 (nv200) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| NV200 (nv200) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| NV250 (nv250) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| NV250 (nv250) | from | No single defensible production interval for the selected line in the retained facts. |
| NV250 (nv250) | to | End year/current production not established. Null here does not confirm ongoing production. |
| NV250 (nv250) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| NV250 (nv250) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| NV250 (nv250) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| NV300 (nv300) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| NV300 (nv300) | from | No single defensible production interval for the selected line in the retained facts. |
| NV300 (nv300) | to | End year/current production not established. Null here does not confirm ongoing production. |
| NV300 (nv300) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| NV300 (nv300) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| NV400 (nv400) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| NV400 (nv400) | from | No single defensible production interval for the selected line in the retained facts. |
| NV400 (nv400) | to | End year/current production not established. Null here does not confirm ongoing production. |
| NV400 (nv400) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| NV400 (nv400) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Pathfinder (pathfinder) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Pathfinder (pathfinder) | from | No single defensible production interval for the selected line in the retained facts. |
| Pathfinder (pathfinder) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Pathfinder (pathfinder) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Pathfinder (pathfinder) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Patrol (patrol) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Patrol (patrol) | from | No single defensible production interval for the selected line in the retained facts. |
| Patrol (patrol) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Patrol (patrol) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Patrol (patrol) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Pick Up (pick-up) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Pick Up (pick-up) | from | No single defensible production interval for the selected line in the retained facts. |
| Pick Up (pick-up) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Pick Up (pick-up) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Pick Up (pick-up) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Pixo (pixo) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Pixo (pixo) | from | No single defensible production interval for the selected line in the retained facts. |
| Pixo (pixo) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Pixo (pixo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Pixo (pixo) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Prairie (prairie) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Prairie (prairie) | from | No single defensible production interval for the selected line in the retained facts. |
| Prairie (prairie) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Prairie (prairie) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Prairie (prairie) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Primastar (primastar) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Primastar (primastar) | from | No single defensible production interval for the selected line in the retained facts. |
| Primastar (primastar) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Primastar (primastar) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Primastar (primastar) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Primera (primera) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Primera (primera) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| Primera (primera) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Primera (primera) | generations[2].to | End/current status unresolved; null does not assert current production. |
| Pulsar (pulsar) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Pulsar (pulsar) | from | No single defensible production interval for the selected line in the retained facts. |
| Pulsar (pulsar) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Pulsar (pulsar) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Pulsar (pulsar) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Qashqai (qashqai) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Qashqai (qashqai) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| Qashqai (qashqai) | generations | The source-current model line has no reviewed current generation; the sequence is incomplete. |
| Qashqai (qashqai) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Qashqai (qashqai) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Qashqai (qashqai) | generations[1].to | End/current status unresolved; null does not assert current production. |
| Qashqai (qashqai) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Qashqai (qashqai) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Qashqai (qashqai) | generations[2].to | End/current status unresolved; null does not assert current production. |
| Qashqai (qashqai) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| Serena (serena) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Serena (serena) | from | No single defensible production interval for the selected line in the retained facts. |
| Serena (serena) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Serena (serena) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Serena (serena) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Sunny (sunny) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Sunny (sunny) | from | No single defensible production interval for the selected line in the retained facts. |
| Sunny (sunny) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Sunny (sunny) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Sunny (sunny) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Terrano (terrano) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Terrano (terrano) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Tiida (tiida) | from | No single defensible production interval for the selected line in the retained facts. |
| Tiida (tiida) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Tiida (tiida) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Tiida (tiida) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Townstar (townstar) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Townstar (townstar) | from | No single defensible production interval for the selected line in the retained facts. |
| Townstar (townstar) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Townstar (townstar) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Townstar (townstar) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Trade (trade) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Trade (trade) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Vanette (vanette) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Vanette (vanette) | from | No single defensible production interval for the selected line in the retained facts. |
| Vanette (vanette) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Vanette (vanette) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Vanette (vanette) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| X-Trail (x-trail) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| X-Trail (x-trail) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| X-Trail (x-trail) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| X-Trail (x-trail) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| X-Trail (x-trail) | generations[1].to | End/current status unresolved; null does not assert current production. |
| X-Trail (x-trail) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| X-Trail (x-trail) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| X-Trail (x-trail) | generations[2].to | End/current status unresolved; null does not assert current production. |
| X-Trail (x-trail) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| X-Trail (x-trail) | generations[3].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| X-Trail (x-trail) | generations[3].to | End/current status unresolved; null does not assert current production. |
| X-Trail (x-trail) | generations[3].bodyTypes | No explicit generation-specific body mapping. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Mitsubishi (mitsubishi) — 22 lines

3000 GT, ASX, Carisma, Colt, Eclipse, Eclipse Cross, Galant, Grandis, i-MiEV, L200, L300, Lancer, Outlander, Pajero, Pajero Pinin, Pajero Sport, Sapporo, Sigma, Space Gear, Space Runner, Space Star, Space Wagon.

### Excluded, merged or deferred

- **Evolution / Ralliart / GT / special editions** — merged: performance/equipment derivatives of base lines.
- **Mirage / Shogun / Montero / Triton / GTO** — merged: regional names retained as aliases of European lines.
- **L400** — merged: commercial derivative retained under Space Gear family.
- **Starion / Cordia / Tredia** — excluded: production ended before the target window.
- **Fuso Canter** — excluded: separate commercial marque identity; not added under Mitsubishi passenger make.
- **Xpander / Xforce / Attrage / Delica D:5 / Minicab / regional Pajero Mini** — excluded: regional-market programmes outside this ordinary European-market pass.
- **Engelberg / eX / Mi-Tech** — excluded: concept vehicles.
- **Grandis revived crossover / regional ASX successors** — deferred: name reuse acknowledged; exact European production phases remain needsReview rather than inheriting Renault donor dates.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| 3000 GT (3000-gt) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| 3000 GT (3000-gt) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| 3000 GT (3000-gt) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| ASX (asx) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| ASX (asx) | from | No single defensible production interval for the selected line in the retained facts. |
| ASX (asx) | to | End year/current production not established. Null here does not confirm ongoing production. |
| ASX (asx) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| ASX (asx) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| ASX (asx) | scope | Name reuse/new European programme requires badge-specific chronology; donor-platform dates or a global current flag must not imply one continuous European generation. |
| Carisma (carisma) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Carisma (carisma) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Colt (colt) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Colt (colt) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Eclipse (eclipse) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Eclipse (eclipse) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Eclipse Cross (eclipse-cross) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Eclipse Cross (eclipse-cross) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Eclipse Cross (eclipse-cross) | scope | Name reuse/new European programme requires badge-specific chronology; donor-platform dates or a global current flag must not imply one continuous European generation. |
| Galant (galant) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Galant (galant) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Grandis (grandis) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Grandis (grandis) | from | No single defensible production interval for the selected line in the retained facts. |
| Grandis (grandis) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Grandis (grandis) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Grandis (grandis) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Grandis (grandis) | scope | Name reuse/new European programme requires badge-specific chronology; donor-platform dates or a global current flag must not imply one continuous European generation. |
| i-MiEV (i-miev) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| i-MiEV (i-miev) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| L200 (l200) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| L200 (l200) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| L300 (l300) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| L300 (l300) | from | No single defensible production interval for the selected line in the retained facts. |
| L300 (l300) | to | End year/current production not established. Null here does not confirm ongoing production. |
| L300 (l300) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| L300 (l300) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Lancer (lancer) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Lancer (lancer) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Outlander (outlander) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Outlander (outlander) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| Outlander (outlander) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Outlander (outlander) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Outlander (outlander) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| Outlander (outlander) | generations[3].bodyTypes | No explicit generation-specific body mapping. |
| Pajero (pajero) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Pajero (pajero) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| Pajero Pinin (pajero-pinin) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Pajero Pinin (pajero-pinin) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Pajero Sport (pajero-sport) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Pajero Sport (pajero-sport) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Sapporo (sapporo) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Sapporo (sapporo) | from | No single defensible production interval for the selected line in the retained facts. |
| Sapporo (sapporo) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Sapporo (sapporo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Sapporo (sapporo) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Sigma (sigma) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Sigma (sigma) | from | No single defensible production interval for the selected line in the retained facts. |
| Sigma (sigma) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Sigma (sigma) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Sigma (sigma) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Space Gear (space-gear) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Space Gear (space-gear) | from | No single defensible production interval for the selected line in the retained facts. |
| Space Gear (space-gear) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Space Gear (space-gear) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Space Gear (space-gear) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Space Runner (space-runner) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Space Runner (space-runner) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| Space Runner (space-runner) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Space Runner (space-runner) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Space Star (space-star) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Space Star (space-star) | from | No single defensible production interval for the selected line in the retained facts. |
| Space Star (space-star) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Space Star (space-star) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Space Star (space-star) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Space Wagon (space-wagon) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Space Wagon (space-wagon) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| Space Wagon (space-wagon) | generations[0].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Space Wagon (space-wagon) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Space Wagon (space-wagon) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Space Wagon (space-wagon) | generations[1].to | End/current status unresolved; null does not assert current production. |
| Space Wagon (space-wagon) | generations[1].bodyTypes | No explicit generation-specific body mapping. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Subaru (subaru) — 19 lines

BRZ, Crosstrek, E-Outback, Forester, Impreza, Justy, Legacy, Leone, Levorg, Libero, Outback, Rex, Solterra, SVX, Trezia, Tribeca, Uncharted, Vivio, WRX.

### Excluded, merged or deferred

- **STI / Spec B / turbo / special editions** — merged: performance/equipment derivatives merged into base lines; standalone WRX retained.
- **XV** — merged: rename retained as Crosstrek alias.
- **Baja / Ascent / Exiga / Sambar / Pleo / R1 / R2 / Stella** — excluded: regional-market programmes outside this European/common-import selection.
- **Rex modern SUV** — excluded: regional name reuse not conflated with the historic European hatchback.
- **Performance-B STI concepts** — excluded: concept vehicles.
- **Uncharted / E-Outback production chronology** — deferred: European programmes included following manufacturer announcement; exact badge production dates remain deferred.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| BRZ (brz) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| BRZ (brz) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| BRZ (brz) | from | No single defensible production interval for the selected line in the retained facts. |
| BRZ (brz) | to | End year/current production not established. Null here does not confirm ongoing production. |
| BRZ (brz) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| BRZ (brz) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Crosstrek (crosstrek) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Crosstrek (crosstrek) | from | No single defensible production interval for the selected line in the retained facts. |
| Crosstrek (crosstrek) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Crosstrek (crosstrek) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Crosstrek (crosstrek) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| Crosstrek (crosstrek) | from,to | Subaru Europe dates the original XV launch to 2011, while retained global production fields begin in 2012. Production, launch and rename phases require reconciliation. |
| Crosstrek (crosstrek) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Crosstrek (crosstrek) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Crosstrek (crosstrek) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Crosstrek (crosstrek) | generations[2].to | End/current status unresolved; null does not assert current production. |
| Crosstrek (crosstrek) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| E-Outback (e-outback) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| E-Outback (e-outback) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| E-Outback (e-outback) | from | No single defensible production interval for the selected line in the retained facts. |
| E-Outback (e-outback) | to | End year/current production not established. Null here does not confirm ongoing production. |
| E-Outback (e-outback) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| E-Outback (e-outback) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| E-Outback (e-outback) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| E-Outback (e-outback) | scope | European E-Outback and global Trailseeker names share a programme. Planned Q1 2026 European launch is not used as a production date. |
| Forester (forester) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Forester (forester) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| Forester (forester) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Forester (forester) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Forester (forester) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| Forester (forester) | generations[3].bodyTypes | No explicit generation-specific body mapping. |
| Forester (forester) | generations[4].bodyTypes | No explicit generation-specific body mapping. |
| Forester (forester) | generations[5].bodyTypes | No explicit generation-specific body mapping. |
| Impreza (impreza) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Impreza (impreza) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| Justy (justy) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Justy (justy) | from | No single defensible production interval for the selected line in the retained facts. |
| Justy (justy) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Justy (justy) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Justy (justy) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Legacy (legacy) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Legacy (legacy) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| Leone (leone) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Leone (leone) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Levorg (levorg) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Levorg (levorg) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Libero (libero) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Libero (libero) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Libero (libero) | from | No single defensible production interval for the selected line in the retained facts. |
| Libero (libero) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Libero (libero) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Libero (libero) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Outback (outback) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Outback (outback) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| Outback (outback) | generations | The source-current model line has no reviewed current generation; the sequence is incomplete. |
| Rex (rex) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Rex (rex) | from | No single defensible production interval for the selected line in the retained facts. |
| Rex (rex) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Rex (rex) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Rex (rex) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Solterra (solterra) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Solterra (solterra) | from | No single defensible production interval for the selected line in the retained facts. |
| Solterra (solterra) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Solterra (solterra) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Solterra (solterra) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| SVX (svx) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| SVX (svx) | from | No single defensible production interval for the selected line in the retained facts. |
| SVX (svx) | to | End year/current production not established. Null here does not confirm ongoing production. |
| SVX (svx) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| SVX (svx) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Trezia (trezia) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Trezia (trezia) | from | No single defensible production interval for the selected line in the retained facts. |
| Trezia (trezia) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Trezia (trezia) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Trezia (trezia) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Tribeca (tribeca) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Tribeca (tribeca) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Uncharted (uncharted) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Uncharted (uncharted) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Uncharted (uncharted) | from | No single defensible production interval for the selected line in the retained facts. |
| Uncharted (uncharted) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Uncharted (uncharted) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Uncharted (uncharted) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Uncharted (uncharted) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Uncharted (uncharted) | scope | Manufacturer announcement establishes a European programme with planned Q1 2026 sales; exact Subaru-badge production/current local availability is unresolved. |
| Vivio (vivio) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Vivio (vivio) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| WRX (wrx) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| WRX (wrx) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Suzuki (suzuki) — 21 lines

Across, Alto, Baleno, Cappuccino, Carry, Celerio, e Vitara, Grand Vitara, Ignis, Jimny, Kizashi, Liana, S-Cross, Samurai, Splash, Swace, Swift, SX4, Vitara, Wagon R+, X-90.

### Excluded, merged or deferred

- **Sport / GTi / Boosterjet / AllGrip** — excluded: performance, engine or drive variants.
- **SJ410 / SJ413 / Santana** — excluded: Samurai-related codes/manufacturing variants retained under Samurai, not extra lines.
- **Maruti / Indian Dzire / Ertiga / XL6 / Fronx / Invicto / Jimny 5-door** — excluded: regional badges/body programmes not silently promoted into the European line list.
- **Vitara Brezza / Grand Vitara 2022 India** — excluded: regional programmes outside this European-name selection; e Vitara is independently included as a distinct BEV.
- **Twin / Lapin / Hustler / Spacia / Every** — excluded: regional kei programmes.
- **Cervo / Cara** — excluded: regional low-volume programmes outside this pass.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| Across (across) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Across (across) | from | No single defensible production interval for the selected line in the retained facts. |
| Across (across) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Across (across) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Across (across) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Alto (alto) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Alto (alto) | from | No single defensible production interval for the selected line in the retained facts. |
| Alto (alto) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Alto (alto) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Alto (alto) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Baleno (baleno) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Baleno (baleno) | from | No single defensible production interval for the selected line in the retained facts. |
| Baleno (baleno) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Baleno (baleno) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Baleno (baleno) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Cappuccino (cappuccino) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Cappuccino (cappuccino) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Carry (carry) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| Carry (carry) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Carry (carry) | from | No single defensible production interval for the selected line in the retained facts. |
| Carry (carry) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Carry (carry) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Carry (carry) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Celerio (celerio) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Celerio (celerio) | from | No single defensible production interval for the selected line in the retained facts. |
| Celerio (celerio) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Celerio (celerio) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Celerio (celerio) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| e Vitara (e-vitara) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| e Vitara (e-vitara) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Grand Vitara (grand-vitara) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Grand Vitara (grand-vitara) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Grand Vitara (grand-vitara) | from | No single defensible production interval for the selected line in the retained facts. |
| Grand Vitara (grand-vitara) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Grand Vitara (grand-vitara) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Grand Vitara (grand-vitara) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Grand Vitara (grand-vitara) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Ignis (ignis) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Ignis (ignis) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| Ignis (ignis) | scope | Suzuki 2026 European results report discontinued European sales; retained global production bounds are separate. |
| Jimny (jimny) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Jimny (jimny) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| Jimny (jimny) | scope | Suzuki 2026 European results report discontinued European sales. Global continuing production does not indicate current Czech official availability. |
| Jimny (jimny) | generations[0].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Jimny (jimny) | generations[1].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Kizashi (kizashi) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Kizashi (kizashi) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| Liana (liana) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Liana (liana) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| S-Cross (s-cross) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| S-Cross (s-cross) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| S-Cross (s-cross) | from | No single defensible production interval for the selected line in the retained facts. |
| S-Cross (s-cross) | to | End year/current production not established. Null here does not confirm ongoing production. |
| S-Cross (s-cross) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| S-Cross (s-cross) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Samurai (samurai) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Samurai (samurai) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Samurai (samurai) | from | No single defensible production interval for the selected line in the retained facts. |
| Samurai (samurai) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Samurai (samurai) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Samurai (samurai) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Splash (splash) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Splash (splash) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Swace (swace) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Swace (swace) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Swace (swace) | from | No single defensible production interval for the selected line in the retained facts. |
| Swace (swace) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Swace (swace) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Swace (swace) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Swift (swift) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Swift (swift) | from | No single defensible production interval for the selected line in the retained facts. |
| Swift (swift) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Swift (swift) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Swift (swift) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| Swift (swift) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| Swift (swift) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| Swift (swift) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| Swift (swift) | generations[3].bodyTypes | No explicit generation-specific body mapping. |
| SX4 (sx4) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| SX4 (sx4) | from | No single defensible production interval for the selected line in the retained facts. |
| SX4 (sx4) | to | End year/current production not established. Null here does not confirm ongoing production. |
| SX4 (sx4) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| SX4 (sx4) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Vitara (vitara) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Vitara (vitara) | from | No single defensible production interval for the selected line in the retained facts. |
| Vitara (vitara) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Vitara (vitara) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Vitara (vitara) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Wagon R+ (wagon-r) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Wagon R+ (wagon-r) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Wagon R+ (wagon-r) | from | No single defensible production interval for the selected line in the retained facts. |
| Wagon R+ (wagon-r) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Wagon R+ (wagon-r) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Wagon R+ (wagon-r) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Wagon R+ (wagon-r) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| X-90 (x-90) | bodyTypes | European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style. |
| X-90 (x-90) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| X-90 (x-90) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Lexus (lexus) — 17 lines

CT, ES, GS, GX, IS, LBX, LC, LFA, LM, LS, LX, NX, RC, RX, RZ, SC, UX.

### Excluded, merged or deferred

- **F / F Sport / hybrid powertrain suffixes** — merged: performance, equipment or engine derivatives merged into their parent lines.
- **HS / TX** — excluded: regional programmes outside this European/common-import selection.
- **GX / LX** — excluded: retained as common import/global SUV lines; current Czech official availability not asserted.
- **LF / UX concept / Electrified Sport concepts** — excluded: concept vehicles.
- **IS SportCross / RX L** — merged: body/length derivatives under IS/RX.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| CT (ct) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| CT (ct) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| ES (es) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| ES (es) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| GS (gs) | from | No single defensible production interval for the selected line in the retained facts. |
| GS (gs) | to | End year/current production not established. Null here does not confirm ongoing production. |
| GS (gs) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| GS (gs) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| GS (gs) | from,to | Retained production fields contain an unexpanded snd separator from source-template extraction; chronology stays null pending source/parser reconciliation. |
| GS (gs) | generations[0].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| GS (gs) | generations[0].to | End/current status unresolved; null does not assert current production. |
| GS (gs) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| GS (gs) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| GS (gs) | generations[1].to | End/current status unresolved; null does not assert current production. |
| GS (gs) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| GS (gs) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| GS (gs) | generations[2].to | End/current status unresolved; null does not assert current production. |
| GS (gs) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| GS (gs) | generations[3].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| GS (gs) | generations[3].to | End/current status unresolved; null does not assert current production. |
| GS (gs) | generations[3].bodyTypes | No explicit generation-specific body mapping. |
| GX (gx) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| GX (gx) | from | No single defensible production interval for the selected line in the retained facts. |
| GX (gx) | to | End year/current production not established. Null here does not confirm ongoing production. |
| GX (gx) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| GX (gx) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| IS (is) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| IS (is) | from | No single defensible production interval for the selected line in the retained facts. |
| IS (is) | to | End year/current production not established. Null here does not confirm ongoing production. |
| IS (is) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| IS (is) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| LBX (lbx) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| LBX (lbx) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| LC (lc) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| LC (lc) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| LFA (lfa) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| LFA (lfa) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| LM (lm) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| LM (lm) | from | No single defensible production interval for the selected line in the retained facts. |
| LM (lm) | to | End year/current production not established. Null here does not confirm ongoing production. |
| LM (lm) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| LM (lm) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| LS (ls) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| LS (ls) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| LS (ls) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| LS (ls) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| LS (ls) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| LS (ls) | generations[3].bodyTypes | No explicit generation-specific body mapping. |
| LS (ls) | generations[4].bodyTypes | No explicit generation-specific body mapping. |
| LX (lx) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| LX (lx) | from | No single defensible production interval for the selected line in the retained facts. |
| LX (lx) | to | End year/current production not established. Null here does not confirm ongoing production. |
| LX (lx) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| LX (lx) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| NX (nx) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| NX (nx) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| NX (nx) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| NX (nx) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| RC (rc) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| RC (rc) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| RX (rx) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| RX (rx) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| RX (rx) | from | 1998 is the explicit Lexus RX first-generation production start; the parent 1997 start includes Toyota Harrier and is not substituted. |
| RX (rx) | generations[0].bodyTypes | No explicit generation-specific body mapping. |
| RX (rx) | generations[1].bodyTypes | No explicit generation-specific body mapping. |
| RX (rx) | generations[2].bodyTypes | No explicit generation-specific body mapping. |
| RX (rx) | generations[4].bodyTypes | No explicit generation-specific body mapping. |
| RZ (rz) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| RZ (rz) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| SC (sc) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| SC (sc) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| UX (ux) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| UX (ux) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Chevrolet (chevrolet) — 31 lines

Alero, Astro, Avalanche, Aveo, Blazer, Bolt, Camaro, Captiva, Colorado, Corvette, Cruze, Epica, Equinox, Evanda, Express, HHR, Lacetti, Lumina, Malibu, Orlando, Rezzo, S-10, Silverado, Spark, Suburban, Tahoe, Tracker, TrailBlazer, Trans Sport, Trax, Volt.

### Excluded, merged or deferred

- **SS / ZL1 / Z06 / ZR1 / LT / RS / engine suffixes** — merged: performance/equipment derivatives merged into parent lines.
- **GMC / Cadillac / Buick / Opel / Holden badges** — excluded: separate makes, not extra Chevrolet lines.
- **Sonic / Kalos** — merged: alternate names merged into Aveo.
- **Matiz / Nubira** — merged: Chevrolet badge phases merged as Spark/Lacetti aliases; Daewoo lines remain separate by make.
- **Rezzo / Tacuma** — excluded: same European model family; consolidated under Rezzo with Tacuma alias.
- **Bolt EUV** — merged: body derivative under Bolt; exact body/generation chronology remains reviewable.
- **Silverado HD / Silverado EV / Suburban special lengths** — merged: truck derivatives; kept lean under parent family.
- **Traverse / Impala / Monte Carlo / Cavalier / Cobalt / Caprice / City Express / N-series** — excluded: regional/import or historical ranges omitted from this lean European/common-import pass; not a complete global inventory.
- **Onix / Sail / Spin / Montana / Agile / Celta / Corsa / Niva** — excluded: regional programmes outside this pass.
- **Chevrolet concept cars** — excluded: concepts.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| Alero (alero) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Alero (alero) | from | No single defensible production interval for the selected line in the retained facts. |
| Alero (alero) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Alero (alero) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Alero (alero) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Astro (astro) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Astro (astro) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Avalanche (avalanche) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Avalanche (avalanche) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Aveo (aveo) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Aveo (aveo) | from | No single defensible production interval for the selected line in the retained facts. |
| Aveo (aveo) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Aveo (aveo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Aveo (aveo) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Blazer (blazer) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Blazer (blazer) | from | No single defensible production interval for the selected line in the retained facts. |
| Blazer (blazer) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Blazer (blazer) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Blazer (blazer) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Blazer (blazer) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Bolt (bolt) | from | No single defensible production interval for the selected line in the retained facts. |
| Bolt (bolt) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Bolt (bolt) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Bolt (bolt) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Camaro (camaro) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Camaro (camaro) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| Camaro (camaro) | generations[0].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Camaro (camaro) | generations[1].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Camaro (camaro) | generations[2].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Camaro (camaro) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Camaro (camaro) | generations[2].to | End/current status unresolved; null does not assert current production. |
| Captiva (captiva) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Captiva (captiva) | from | No single defensible production interval for the selected line in the retained facts. |
| Captiva (captiva) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Captiva (captiva) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Captiva (captiva) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Colorado (colorado) | from | No single defensible production interval for the selected line in the retained facts. |
| Colorado (colorado) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Colorado (colorado) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Colorado (colorado) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Corvette (corvette) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Corvette (corvette) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| Corvette (corvette) | generations[1].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Corvette (corvette) | generations[1].to | End/current status unresolved; null does not assert current production. |
| Corvette (corvette) | generations[2].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Corvette (corvette) | generations[2].to | End/current status unresolved; null does not assert current production. |
| Corvette (corvette) | generations[3].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Corvette (corvette) | generations[3].to | End/current status unresolved; null does not assert current production. |
| Corvette (corvette) | generations[4].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Corvette (corvette) | generations[4].to | End/current status unresolved; null does not assert current production. |
| Cruze (cruze) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Cruze (cruze) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| Cruze (cruze) | generations | Only the first Europe-relevant generation is reviewed; later global/Chinese successors are not asserted European. |
| Epica (epica) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Epica (epica) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Equinox (equinox) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Equinox (equinox) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Evanda (evanda) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Evanda (evanda) | from | No single defensible production interval for the selected line in the retained facts. |
| Evanda (evanda) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Evanda (evanda) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Evanda (evanda) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Express (express) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Express (express) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| HHR (hhr) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| HHR (hhr) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Lacetti (lacetti) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Lacetti (lacetti) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Lacetti (lacetti) | from | No single defensible production interval for the selected line in the retained facts. |
| Lacetti (lacetti) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Lacetti (lacetti) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Lacetti (lacetti) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Lacetti (lacetti) | aliases | Chevrolet Nubira naming is consolidated into Lacetti; the older Daewoo Nubira line remains separate. |
| Lumina (lumina) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Lumina (lumina) | from | No single defensible production interval for the selected line in the retained facts. |
| Lumina (lumina) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Lumina (lumina) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Lumina (lumina) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Malibu (malibu) | from | No single defensible production interval for the selected line in the retained facts. |
| Malibu (malibu) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Malibu (malibu) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Malibu (malibu) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Orlando (orlando) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Orlando (orlando) | from | No single defensible production interval for the selected line in the retained facts. |
| Orlando (orlando) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Orlando (orlando) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Orlando (orlando) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Rezzo (rezzo) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Rezzo (rezzo) | from | No single defensible production interval for the selected line in the retained facts. |
| Rezzo (rezzo) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Rezzo (rezzo) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Rezzo (rezzo) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| S-10 (s-10) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| S-10 (s-10) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Silverado (silverado) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Silverado (silverado) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Spark (spark) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Spark (spark) | from | No single defensible production interval for the selected line in the retained facts. |
| Spark (spark) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Spark (spark) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Spark (spark) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Spark (spark) | aliases | Matiz is consolidated as a Chevrolet badge-phase alias; Daewoo Matiz remains a separate make entry. |
| Suburban (suburban) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Suburban (suburban) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Tahoe (tahoe) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Tahoe (tahoe) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| Tahoe (tahoe) | generations[0].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Tahoe (tahoe) | generations[1].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Tahoe (tahoe) | generations[2].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Tahoe (tahoe) | generations[3].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Tahoe (tahoe) | generations[4].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Tahoe (tahoe) | generations[4].from | Production dates are absent or contain unresolved region/body-specific ranges. |
| Tahoe (tahoe) | generations[4].to | End/current status unresolved; null does not assert current production. |
| Tracker (tracker) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Tracker (tracker) | from | No single defensible production interval for the selected line in the retained facts. |
| Tracker (tracker) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Tracker (tracker) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Tracker (tracker) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Tracker (tracker) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| TrailBlazer (trailblazer) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| TrailBlazer (trailblazer) | from | No single defensible production interval for the selected line in the retained facts. |
| TrailBlazer (trailblazer) | to | End year/current production not established. Null here does not confirm ongoing production. |
| TrailBlazer (trailblazer) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| TrailBlazer (trailblazer) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Trans Sport (trans-sport) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Trans Sport (trans-sport) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Trans Sport (trans-sport) | from | No single defensible production interval for the selected line in the retained facts. |
| Trans Sport (trans-sport) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Trans Sport (trans-sport) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Trans Sport (trans-sport) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Trans Sport (trans-sport) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Trax (trax) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Trax (trax) | from | No single defensible production interval for the selected line in the retained facts. |
| Trax (trax) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Trax (trax) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Trax (trax) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Volt (volt) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Volt (volt) | generations | Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation. |
| Volt (volt) | generations[0].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |
| Volt (volt) | generations[1].code | Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.

## Daewoo (daewoo) — 14 lines

Espero, Evanda, Kalos, Korando, Lacetti, Lanos, Leganza, Lublin, Matiz, Musso, Nexia, Nubira, Tacuma, Tico.

### Excluded, merged or deferred

- **SX / CDX / SE / engine suffixes** — merged: equipment/engine derivatives.
- **Chevrolet successor badge phases** — excluded: separate make; not treated as continuing Daewoo production.
- **LeMans / Cielo / Magnus / Rezzo** — merged: regional names retained as Nexia/Evanda/Tacuma aliases.
- **Musso / Korando** — excluded: short Daewoo badge phases retained with unresolved dates; SsangYong donor production is not inherited.
- **Polonez** — deferred: deferred: Daewoo corporate ownership alone does not establish a unique Daewoo make/model identity; FSO badge needs review.
- **Lublin** — excluded: Daewoo badge phase retained with unresolved chronology; later FSC/Intrall/DZT production not inherited.
- **Damas / Labo / Prince / Super Salon / Chairman / Winstorm / Tosca / Gentra** — excluded: regional badge/production programmes outside this European selection.

### Every outstanding needsReview item

| Line | Field | Reason |
| --- | --- | --- |
| Espero (espero) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Espero (espero) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Evanda (evanda) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Evanda (evanda) | from | No single defensible production interval for the selected line in the retained facts. |
| Evanda (evanda) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Evanda (evanda) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Evanda (evanda) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Kalos (kalos) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Kalos (kalos) | from | No single defensible production interval for the selected line in the retained facts. |
| Kalos (kalos) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Kalos (kalos) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Kalos (kalos) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Korando (korando) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Korando (korando) | from | No single defensible production interval for the selected line in the retained facts. |
| Korando (korando) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Korando (korando) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Korando (korando) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Lacetti (lacetti) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Lacetti (lacetti) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Lacetti (lacetti) | from | No single defensible production interval for the selected line in the retained facts. |
| Lacetti (lacetti) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Lacetti (lacetti) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Lacetti (lacetti) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Lacetti (lacetti) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Lanos (lanos) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Lanos (lanos) | from | No single defensible production interval for the selected line in the retained facts. |
| Lanos (lanos) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Lanos (lanos) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Lanos (lanos) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Leganza (leganza) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Leganza (leganza) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Lublin (lublin) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Lublin (lublin) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Lublin (lublin) | from | No single defensible production interval for the selected line in the retained facts. |
| Lublin (lublin) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Lublin (lublin) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Lublin (lublin) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Lublin (lublin) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Matiz (matiz) | from,to | Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established. |
| Matiz (matiz) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Matiz (matiz) | from | No single defensible production interval for the selected line in the retained facts. |
| Matiz (matiz) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Matiz (matiz) | wikidataQid | No unique line-level match; a family/shared-platform QID is not substituted. |
| Matiz (matiz) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Matiz (matiz) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Musso (musso) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Musso (musso) | from | No single defensible production interval for the selected line in the retained facts. |
| Musso (musso) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Musso (musso) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Musso (musso) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Nexia (nexia) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Nexia (nexia) | from | No single defensible production interval for the selected line in the retained facts. |
| Nexia (nexia) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Nexia (nexia) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Nexia (nexia) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Nubira (nubira) | from,to | Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates. |
| Nubira (nubira) | from | No single defensible production interval for the selected line in the retained facts. |
| Nubira (nubira) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Nubira (nubira) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Nubira (nubira) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Tacuma (tacuma) | from | No single defensible production interval for the selected line in the retained facts. |
| Tacuma (tacuma) | to | End year/current production not established. Null here does not confirm ongoing production. |
| Tacuma (tacuma) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Tacuma (tacuma) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |
| Tico (tico) | generations | Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations. |
| Tico (tico) | scope | European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability. |

Coverage: this is an editorial European-market selection, not a certified complete historical manufacturer's inventory. All variants and late-2026 additions have not been independently reconciled. Shared source articles do not establish every badge's dates or generation codes.
