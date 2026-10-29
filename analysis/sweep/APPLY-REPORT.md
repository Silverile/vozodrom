# Catalog sweep integration — 2026-10-29

Applied the reviewed proposals from 217 per-make sweep files. No commits, pushes, source fetching, publishing or paid operations. Pre-existing card research is preserved. Review the diff before committing.

## Applied

- 2,319 checked field corrections (including 70 make-field proposals).
- 513 raw/line records removed using durable exclusions with the complete original record retained as the before snapshot.
- 384 sourced model-line additions: 382 in the initial pass, then Rover 200 and SEAT 850 as card-backed line identities. Their rejected *missing raw model* proposals remain rejected; their separate model-line records were absent and were required to link the researched cards.
- 2,652 legacy trim kinds normalized from "version" to "technical-version".
- One derived Wikidata source URL updated after its QID correction (TVR M-Series).
- Three SsangYong/KGM generation arrays completed with required schema keys. Missing body data stays null; null ends stay unknown unless the proposal explicitly establishes current production. See generation-schema-normalization.json.

There were 5,866 applied actions, 142 skipped actions and 176 exclusions on the first pass; three additional actions followed. Some skipped items already had the requested value; they are not all conflicts. Counts are actions, not distinct cars or individual scalar writes.

## Counts by target

The skipped/excluded columns describe the first pass. Supplemental applied actions are separate to retain an exact audit trail. The final repeat run classified 3,256 actions as skipped and 173 as excluded, with **zero catalog file changes**. The later counts differ because already-removed entries/additions are skipped, type normalizations have disappeared, and the two new card links were resolved.

| Target | Initially applied | Supplementally applied | Initially skipped | Initially excluded |
| --- | ---: | ---: | ---: | ---: |
| src/data/catalog/model-lines-auto.json | 1408 | 0 | 26 | 39 |
| src/data/catalog/model-line-additions.json | 674 | 2 | 97 | 27 |
| src/data/catalog/makes.json | 70 | 0 | 18 | 6 |
| src/data/catalog/models-auto.json | 1042 | 1 | 1 | 104 |
| src/data/model-cards/ford.json | 516 | 0 | 0 | 0 |
| src/data/model-cards/hyundai.json | 381 | 0 | 0 | 0 |
| src/data/model-cards/subaru.json | 194 | 0 | 0 | 0 |
| src/data/model-cards/tata-motors.json | 120 | 0 | 0 | 0 |
| src/data/model-cards/toyota.json | 289 | 0 | 0 | 0 |
| src/data/model-cards/uaz.json | 51 | 0 | 0 | 0 |
| src/data/model-cards/vinfast.json | 28 | 0 | 0 | 0 |
| src/data/model-cards/volkswagen.json | 619 | 0 | 0 | 0 |
| src/data/model-cards/wanderer.json | 63 | 0 | 0 | 0 |
| src/data/model-cards/wey.json | 49 | 0 | 0 | 0 |
| src/data/model-cards/willys.json | 42 | 0 | 0 | 0 |
| src/data/model-cards/wolseley-motors.json | 91 | 0 | 0 | 0 |
| src/data/model-cards/wuling-motors.json | 85 | 0 | 0 | 0 |
| src/data/model-cards/xpeng.json | 62 | 0 | 0 | 0 |
| src/data/model-cards/zaz.json | 38 | 0 | 0 | 0 |
| src/data/model-cards/zeekr.json | 44 | 0 | 0 | 0 |

## Types and runtime

CatalogBody now accepts liftback. CatalogFuel now accepts diesel-mhev and hydrogen, matching the runtime CardFuel union. Generation/trim transmissions now accept cvt and e-cvt and null gear counts. Runtime body/transmission fields already accept strings; runtime trim projection does not constrain kind. Legacy kind "version" was canonicalized in the card data to the existing "technical-version" spelling rather than extending the canonical enum.

No photos were added or replaced in this integration, so photo-sizes was not regenerated. Existing photo coverage/aspect gaps are unchanged.

## Durable rebuild behavior

Run `node analysis/sweep/apply-proposals.mjs` from the repository root. Each field correction checks its before-value; mismatches are skipped and logged. Compound edits are atomic. Unsupported prose instructions, unsafe slugs, withdrawn/rejected/reverted proposals, unsourced entries, and low-confidence entries without an independent second source are excluded. Missing optional card values may match a null before-value. Removals check the unique make/slug and any supplied QID, then save the full before snapshot.

selector-exclusions.json is a durable input, not the old generated excluded-models-auto.json audit output. Both source rebuilders import selector-exclusions.mjs. It checks make + slug + QID when supplied, preserving the canonical TVR M-Series record even though it now shares its QID with the removed duplicate. All 513 saved snapshots were tested against that helper. Full source-data rebuilds were not run: they touch unrelated curated/frozen research. After any future source rebuild, rerun apply-proposals.mjs, then the three index scripts. Applied-field proposals also remain durable inputs to that integration step.

model-lines-index.mjs now consumes model-line-additions.json directly as well as model-lines-auto.json, deduplicating identities with auto-file precedence. New additions therefore reach the UI without rewriting all existing curated lines. Final indexes contain 4,616 card records for 217 makes (duplicate-folder keys retain existing precedence), 4,375 explicit model lines plus 404 card-only lines, and 432 makes across all sections (217 auto).

## Human decisions

The complete machine-readable queue is [integration-decisions.json](integration-decisions.json), including every excluded/mismatched proposal, 82 conflicts whose recorded kept value is null, all 871 open research questions, and the remaining new-card exception. Unknown values were retained; no numeric resolution was invented.

### Slug migrations: 5 applied, 10 stopped on occupied targets

The human approved pre-launch renames without redirect stubs on 2026-10-29. The collision check covered models-auto, model-lines-auto, model-line-additions and both card folders. Five unused targets were migrated: Mercedes-Benz rady-107 to r107 (R107 / C107), type-204 to w204 (W204), Rolls-Royce phantom-q1130591 to phantom-vii (Phantom VII, 2003–2017, sedan), phantom-q33657874 to phantom-viii (Phantom VIII, 2017–unknown end, sedan), and Willys willys-overland-jeepster to jeepster. Old slugs are retained in raw-model aliases and the Willys card aliases. Both builders import analysis/codex/slug-migrations.mjs; the raw slug registry is updated. The migration script is idempotent.

The following ten renames were **not applied**, following the explicit stop-on-collision instruction: Mahindra Electric mahindra-e2o to e2o, mahindra-e2o-plus to e2o-plus, revai to reva; Morgan 4-q6911571 to plus-4 and 4-q6911573 to plus-4-plus; Moskvič moskvich-8 to 8; Neta neta-gt to gt; Rolls-Royce rolls-royce-cullinan to cullinan; XPeng p7-q65064122 to p7 and p7-q130527663 to p7-plus. Mahindra/Morgan/Moskvič/Neta targets already exist in both line files and their catalog cards; Cullinan exists in additions and its runtime card; both XPeng targets exist in runtime cards. No target identities were merged, and Cullinan field changes remain deferred with its rename.

Verification: all three index scripts completed, TypeScript passed, and npm run build exported 5,638 pages successfully. All five applied old routes are absent from out/. The new Willys jeepster page exists. The two Mercedes and two Phantom identities have no model-line/card records, so neither old nor new routes are generated for those four; this migration does not add researched model lines or pages. No matching old front-drawing files or source references outside aliases remained for the five applied migrations. Full raw source rebuilds were not run; isolated override checks pass for old and registry-preserved slugs. Run node analysis/codex/verify-slug-migrations.mjs after a build to repeat these checks.

Original requested migration list (the five applied entries above are complete; the other ten remain deferred):

- mahindra-electric/mahindra-e2o: slug → "e2o"
- mahindra-electric/mahindra-e2o-plus: slug → "e2o-plus"
- mahindra-electric/revai: slug → "reva"
- mercedes-benz/rady-107: slug/name → "r107 / \"R107 / C107\""
- mercedes-benz/type-204: slug/name → "w204 / \"W204\""
- morgan/4-q6911571: slug → "plus-4"
- morgan/4-q6911573: slug → "plus-4-plus"
- moskvic/moskvich-8: slug → "8"
- neta-auto/neta-gt: slug → "gt"
- rolls-royce/phantom-q1130591: slug/name/productionStart/productionEnd/bodyTypes → ["phantom-vii","Phantom VII",2003,2017,["sedan"]]
- rolls-royce/phantom-q33657874: slug/name/productionStart/productionEnd/bodyTypes → ["phantom-viii","Phantom VIII",2017,null,["sedan"]]
- rolls-royce/rolls-royce-cullinan: slug/name/productionStart/bodyTypes → ["cullinan","Cullinan",2018,["suv"]]
- willys/willys-overland-jeepster: slug → "jeepster"
- xpeng/p7-q65064122: slug → "p7"
- xpeng/p7-q130527663: slug → "p7-plus"

### Make identity/status/schema decisions

- panhard: foundedYear — rejected/reverted/withdrawn verification. Proposed: 1887
- rolls-royce: foundedYear — rejected/reverted/withdrawn verification. Proposed: 1906
- santana-motor: status — canonical company/brand identity decision. Proposed: null
- tata-motors: qid — canonical company/brand identity decision. Proposed: "Q7687819"
- wiesmann: status/dissolvedYear — value not supported by schema. Proposed: ["note: insolvency 2013–2014, revived as Wiesmann Automotive 2015; keep active",null]
- zotye-auto: dissolvedYear — rejected/reverted/withdrawn verification. Proposed: null

- abarth: 500 family end year remains null despite official ended status; avoid converting sell-out dates into manufacturing dates.
- acura: Original RSX coupe must remain separate from revived electric RSX; historic ended status applies only original2002-2006MY.
- aiways: Make dissolution/status not inferred from financial difficulties or planned corporate merger.
- alpina: Do not mark ALPINA defunct just because rights transferred to BMW; separate canonical company identity from the continuing marque.
- amc: AMC acquisition1987 does not by itself invalidate canonical legal-entity dissolution1988; no make change proposed.
- arcfox: Partial external review: remaining generation chronology/status/engines/photos unverified.
- arcfox: GT and GT Race Edition prototype/production status needs model-specific evidence before raw removal.
- artega: Primary/dealer identity and end-year checks only; exact production start, current company status, specifications and photo remain incomplete.
- aston-martin: Current Vantage and DBS generation splitting needs reconciliation with 2024/2025 refresh names; no broad current-status assumptions applied.
- audi: Partial coverage: unlisted generations, current status in October 2026, engines, trims, dimensions, facelift stages and photos still need independent verification.
- audi: DEPTH: Q6 production from late 2023 is directly OEM-supported; independent second start-of-production source still required. Current production status remains unknown pending explicit corroboration.
- automobili-pininfarina: PininfarinaSpA is distinct from AutomobiliPininfarina; design-house financial statements do not establish this marque status.
- avatr-technology: 06T current status uses April2026 manufacturer assertion of launch with immediate delivery, with September2026 edition activity; 07L uses actual August2026 first handovers. Neither is inferred from preorder or reveal alone.
- avions-voisin: 1905 aircraft-business foundation vs1919 automobile marque requires canonical company evidence; no foundation correction established.
- bellier: Specialist report27September2026 says B8/Docker production will not resume; primary manufacturer confirmation and exact last-build date not found. Status stays unknown with attributed market caveat.
- borgward: Canonical old-company QID and related modern Chinese-company QID must remain distinguished; no blanket defunct/status propagation.
- brilliance: Canonical Q917192 must be mapped to holding company vs Brilliance vehicle marque before changing foundation/status or model attribution.
- bristol-cars: Dissolved2020 describes later company liquidation, not necessarily canonical-company dissolution or lasting marque end; verify company register and current rights-holder.
- bugatti-automobiles: Modern Bugatti Automobiles entity founded2000 vs1998 brand re-establishment requires company-register proof before changing foundedYear.
- bugatti-automobiles: Historic Types and EB110 attribution span predecessor companies; current card make is commercial marque umbrella while canonical make QID is modern legal entity. Decide policy before moves.
- bugatti-automobiles: W16 Mistral exact production start/end and2026 status remain unknown.
- chrysler: Pacifica minivan production began 29 February 2016, independently explicit in OEM manufacturing story; hybrid followed December2016. Its current status has direct Windsor manufacturing corroboration in December2025.
- cupra: Foundation1996 is SEAT performance-subbrand lineage;2018 is independent marque creation. Canonical entity scope must decide which date is displayed.
- cupra: DEPTH round6: 3 facelift fields verified using OEM and ADAC; none is a new platform generation. Existing Cupra dates were not changed in earlier Codex sweep reports (0 prior card fixes). Full seven-line engine/photos/current-status audit remains open; Tavascan 2023 versus 2024 SOP needs explicit series-production reconciliation, so its null start stays null.
- daewoo: Do not automatically add GM Korea Q497193 to relatedQids without brand/time constraints: the company also manufactures Chevrolet cars, and indiscriminate attribution would create wrong-brand models.
- daihatsu: DEPTH-7: Copen II SOP/end/status and full European Sirion/Terios generation splits remain unresolved. Copen 1.3 dates, acceleration and mass require exact market/basis reconciliation. Manufacturer brochure archive returned 403; not bypassed.
- de-tomaso: Defunct legacy legal company versus revived brand must be separated before status clearing.
- deepal: Founded2008 is unsupported by retrieved OEM history;2017 legal predecessor and2022 brand are different entities. Resolve canonical QID before replacing.
- delage: Legacy company defunct status and modern revived D12 brand need entity separation.
- dodge: New-generation Charger status uses explicit Windsor production-launch evidence, not just European orders; 2026 European manufacturer press material corroborates present availability.
- ds-automobiles: Current founded2009 describes Citroen DS product lineage, whereas independent marque2014 is explicit. Canonical scope must preserve both.
- e-go-mobile: 2015 original e.GO Mobile and 2020 Next.e.GO legal successors need entity policy before assigning insolvency/dissolution to canonical make.
- faw: 29 local families include pickups and vans; group ownership does not prove current FAW-badge status or justify moving Hongqi/Bestune entries.
- fiat: DEPTH: Panda production-through-2027 announcement is a plan, not October 2026 production evidence; current status left unknown.
- fisker: Bankruptcy filing is distinct from corporate dissolution; canonical make status requires final legal outcome.
- force-motors: Gurkha newer family starts2021;2024 upgrade must not replace its family start. Exact current production status remains unverified.
- ford: No generation-status changes made from contemporary sales or order opening alone.
- fso: FSO remains a legal operating company with property rentals per official site; do not label defunct solely because automobile assembly stopped.
- geely: Production occurred in2025 but does not alone certify October2026 current status.1986 holding-group origin vs auto-company foundation remains policy issue.
- great-wall: Great Wall/GWM umbrella, Haval marque and POER subbrand overlap needs canonical policy; pre-Haval Hover models must not be blindly removed as duplicates.
- hindustan-motors: Suspended factory does not establish legal dissolution; no defunct make proposal. Mark I1957/1958 start remains unresolved.
- honda: Partial external checks only; remaining generation chronology, production status, engines, dimensions and photos unverified.
- honda: DEPTH-R5: Civic/Jazz facelift years and selected CR-V VI launch powertrains only. Older generation codes, full engine ranges, production status as of October 2026, and all Commons photographs remain unchecked this pass. No existing photo review was repeated.
- horch: Partial evidence pass: remaining model histories, specifications, photos and present production status need individual external verification. Photo filenames inventoried; images were not visually re-reviewed.
- hotchkiss: Partial evidence pass: remaining model histories, specifications, photos and present production status need individual external verification. Photo filenames inventoried; images were not visually re-reviewed.
- hudson: Partial evidence pass: remaining model histories, specifications, photos and present production status need individual external verification. Photo filenames inventoried; images were not visually re-reviewed.
- hummer: Partial evidence pass: remaining model histories, specifications, photos and present production status need individual external verification. Photo filenames inventoried; images were not visually re-reviewed.
- hyundai: Tucson NX5 is marked current with Europe scope despite official European launch planned for 2027. Confirm SOP and market-specific availability before retaining current status; unveiling is not SOP.
- innocenti: Partial evidence pass: remaining model histories, specifications, photos and present production status need individual external verification. Photo filenames inventoried; images were not visually re-reviewed.
- international-harvester: Partial evidence pass: remaining model histories, specifications, photos and present production status need individual external verification. Photo filenames inventoried; images were not visually re-reviewed.
- iveco: Partial evidence pass: remaining model histories, specifications, photos and present production status need individual external verification. Photo filenames inventoried; images were not visually re-reviewed.
- izh: Partial evidence pass: remaining model histories, specifications, photos and present production status need individual external verification. Photo filenames inventoried; images were not visually re-reviewed.
- jac: Partial evidence pass: remaining model histories, specifications, photos and present production status need individual external verification. Photo filenames inventoried; images were not visually re-reviewed.
- jaecoo: Partial evidence pass: remaining model histories, specifications, photos and present production status need individual external verification. Photo filenames inventoried; images were not visually re-reviewed.
- jeep: Shared Gladiator line has generations:null and begins2019; historical SJ generation requires a separate reviewed addition, not index0 status mutation.
- jeep: DEPTH round5: Compass150 DDCT MY2020 remains without displacement/cylinders/gears pending exact independent MY2020 corroboration; facelift MY2021 evidence was not silently transferred. All complete generation/status/engine/photo checks remain open.
- jensen-motors: Partial evidence pass: remaining model histories, specifications, photos and present production status need individual external verification. Photo filenames inventoried; images were not visually re-reviewed.
- jetour: Partial evidence pass: remaining model histories, specifications, photos and present production status need individual external verification. Photo filenames inventoried; images were not visually re-reviewed.
- kia: Modern Kia generation end/status claims (including Ceed, K9, Telluride) require current manufacturer evidence; no guessed changes.
- koenigsegg: Partial evidence pass: remaining model histories, specifications, photos and present production status need individual external verification. Photo filenames inventoried; images were not visually re-reviewed.
- lada: Partial evidence pass: remaining model histories, specifications, photos and present production status need individual external verification. Photo filenames inventoried; images were not visually re-reviewed.
- land-rover: Current production status as of October 2026 not established; unknown retained.
- land-rover: DEPTH round5: Land Rover selected cards have no photos; no Commons replacement or pixel review performed. All engine ranges, full chronology/status and other generations remain incomplete.
- landwind: Partial evidence pass: remaining model histories, specifications, photos and present production status need individual external verification. Photo filenames inventoried; images were not visually re-reviewed.
- leapmotor: Partial evidence pass: remaining model histories, specifications, photos and present production status need individual external verification. Photo filenames inventoried; images were not visually re-reviewed.
- leapmotor: Round9: A05/A10/B01/B05/C01/C11/D19/D99/S01/T03 production codes, exact series endpoints and exterior updates still need independent primary chronology. Current issuer on-sale list is not sufficient to close their production-status fields. No full Leapmotor make/model depth completion.
- lexus: Partial external review only; remaining chronology, October 2026 status, trim specifications and photos unverified.
- li-auto: Partial evidence pass: remaining model histories, specifications, photos and present production status need individual external verification. Photo filenames inventoried; images were not visually re-reviewed.
- lifan: Partial evidence pass: remaining model histories, specifications, photos and present production status need individual external verification. Photo filenames inventoried; images were not visually re-reviewed.
- ligier: Partial evidence pass: remaining model histories, specifications, photos and present production status need individual external verification. Photo filenames inventoried; images were not visually re-reviewed.
- lincoln: Partial evidence pass: remaining model histories, specifications, photos and present production status need individual external verification. Photo filenames inventoried; images were not visually re-reviewed.
- lotus: Lotus raw list contains many race cars and duplicate type/marketing names; no blanket exclusions without inspecting homologation/road status.
- luaz: Partial evidence pass: remaining model histories, specifications, photos and present production status need individual external verification. Photo filenames inventoried; images were not visually re-reviewed.
- lucid-motors: Partial evidence pass: remaining model histories, specifications, photos and present production status need individual external verification. Photo filenames inventoried; images were not visually re-reviewed.
- lynk-co: Partial evidence pass: remaining model histories, specifications, photos and present production status need individual external verification. Photo filenames inventoried; images were not visually re-reviewed.
- mazda: cx-8: Japanese production ended December 2023 but Malaysian assembly continues to at least 2026; status left unknown.
- mercedes-benz: citan W420 and trida-t W420: en.wikipedia (oldid 1380904683) gives production 2021–2026. Left to=null/status unchanged; it is unclear whether production actually ended by 2026-10.
- mercedes-benz: eqa, eqb, trida-b W247: en.wikipedia gives production ending 2026 (replaced by the new electric GLA/GLB, CLA family). Set to=2026, status ended, medium confidence: confirm with a Mercedes press release.
- mercury: monterey-minivan is a separate models-auto entry while the line/card keeps it as generations[1] of monterey; decide which shape is canonical.
- mini: Engines, dimensions and trims of most Mini generations are still null; only years, status and facelifts were filled.
- mitsubishi: Pajero Sport III status 2026-10: Australian sales ended 2025 (replaced by Pajero V); Thai production unverified, kept unknown.
- mitsubishi: Eclipse Cross I status: Australia ended 2025; Japanese production unverified.
- moskvic: Moskvich 3e: status after 2024 unclear; left unknown.
- noble: M600 status: wiki says production stopped 2018, but the maker still lists it.
- nsu: make status: NSU Motorenwerke merged into Audi NSU Auto Union AG in 1969 (dissolvedYear 1969 is correct), but the NSU brand stayed on cars until the Ro 80 ended in 1977; consider whether the brand end should be 1977.
- opel: Most generations still have null dimensions, engines and trims; this pass fixed years, status, body types and facelifts.
- panhard: Panhard brand continued in defence until Arquus (2018); status defunct / dissolvedYear 1967 refers to car production only.
- pontiac: Cards carry isAddition:true while every line is also in model-lines-auto.json (and mirrored in model-line-additions.json). Which file is canonical for pontiac?
- proton: Persona BH (2016–) is reported to end production in 2026 (Wikipedia, pcauto.com/my, paultan); still being registered in 2026. Status left unknown until an end date is published.
- proton: Chancellor production years were not found in an independent source (only the Proton 2006 annual report on launch); left null with status ended.
- renault: Clio V end of production after the Clio VI start (Sept 2025) is not documented; the card keeps to null and status unknown.
- sono-motors: Sono Motors never sold a car; after the 2023 insolvency it became a solar-integration supplier (Solar Bus Kit). Consider removing "auto" from its sections or hiding the make.
- spyker: Status značky: bankrot 2021, prodej ochranné známky 8/2025 vs. dohoda Mullera se správcem 10/2025 a představení C8 Preliator XXV 8/2026 – makes.json status ponechán null (aktivní); ověřit, zda XXV skutečně jde do výroby.
- sunbeam: makes.json sunbeam (Q2165627, Sunbeam Motor Car Co.) has dissolvedYear 1934, but the Sunbeam brand was used by Rootes/Chrysler until 1976 and most cards (Alpine, Rapier, Tiger, Imp Sport, Stiletto) are post-1935. Keep company dates or switch to brand dates?
- tvr: Make entry (status null, founded 1946) is correct, but no TVR has been built since 2006; brand owned by Charge Holdings since Nov 2025 (topgear.com, carmagazine.co.uk). Decide whether status should say dormant.
- venturi: Venturi od roku 2015 nevyrábí sériové silniční vozy (fr Wikipedie) – status v makes.json je null; zvážit „defunct“ pro sekci auto.
- zaz: ZAZ stopped passenger-car production in 2017 and now builds buses; make status could be flagged as no longer a car maker.

### Conflicts kept unresolved

These are the recorded conflict locations, not a fresh assertion that every field currently contains null. Exact values, evidence and scope are in integration-decisions.json and the per-make source files.

- aixam: DEPTH round9 A721 exact final assembly year
- alpine: A106 OEM production endpoint
- artega: GT production start
- aston-martin: Rapide aggregate scope
- aston-martin: Aggregate VH V8/V12 Vantage endpoint
- audi: q6-e-tron quattro torque
- autobianchi: stellina.generations[0].from
- baic: round9 BJ30 I production end / series-production start
- bentley: 8Litre production end
- bentley: round8 Bentayga original W12 dimensions and mass
- bmw: 3-20 production end
- bristol-cars: 400 start
- bristol-cars: 405 start
- chrysler: Crossfire selected Roadster automatic massKg
- citroen: C3 Pluriel production total
- daihatsu: copen.generations[0].European 1.3 trim length and mass
- ds-automobiles: DEPTH round9 DS9 exact production interval
- ferrari: 288-gto generations[0].to
- honda: DEPTH-R5 CR-V VI Advance AWD massKg
- hyundai: DEPTH IONIQ 9 European Performance AWD total output; generations[0].trims[2].engine.powerKw
- hyundai: DEPTH INSTER trim massKg fields
- infiniti: Q70L first production
- iveco: massif.generations[0].to
- jaguar: e-type.generations[2].from
- jeep: Compass MY2020 130 manual width
- lada: niva.generations[0].trims[1].dimensionsMm.wheelbase
- lamborghini: Jarama production end
- lamborghini: Countach LP400 production start
- lexus: CT 200h European specification scope
- maruti-suzuki: alto generations[1].to (Alto 800 end)
- maruti-suzuki: baleno generations[0].to (sedan)
- maruti-suzuki: 1000-esteem generations[0].to (series-production fill 2026-10-29)
- matra: rancho productionUnits
- maxus: d90 production end
- maxus: v70 production end
- maxus: v70 generations[0].from (series-production fill 2026-10-29)
- mazda: cx-4 end of production
- mclaren: 12c power
- mclaren: 720s generations[0].to and generations[1].to (series-production fill 2026-10-29)
- mercedes-benz: amg-gt generations[0].to (series-production fill 2026-10-29)
- mercedes-benz: sl generations[5].from R232 (series-production fill 2026-10-29)
- mercedes-benz: slr-mclaren generations[0].to (series-production fill 2026-10-29)
- mercedes-benz: trida-g generations[0].to W460 (series-production fill 2026-10-29)
- moskvic: 2142 from
- moskvic: 8 length
- moskvic: 427 generations[0].from (series-production fill 2026-10-29)
- nissan: micra/K13 generations[3].to
- nissan: nv400 start
- nissan: prairie/M10 start
- nissan: almera/N16 end
- nissan: almera generations[1].to N16 (series-production fill 2026-10-29)
- nsu: ro-80 kerb mass
- perodua: kembara end of production
- perodua: qv-e model code
- pontiac: g8 trims[1] G8 GT powerKw
- roewe: rx8 power
- rolls-royce: spectre Series II torque
- skoda: felicia-fun from/to
- skoda: vos from
- skoda: 860 to
- skoda: 422 from
- sono-motors: sono-sion length
- spyker: c8 Aileron konec výroby
- spyker: c8 Preliator max. rychlost
- sunbeam: vogue generations[0].from (series-production fill 2026-10-29)
- tagaz: tager generations[0].to
- talbot: rancho end
- talbot: murena end
- talbot: 1510 end
- tatra: tatra/80 production units
- tatra: tatra/700 production units
- tatra: tatra/700 700-2 displacement
- triumph: 13-35 generations[0].to and trims[0].to (series-production fill 2026-10-29)
- tvr: cerbera generations[0].to
- tvr: tasmin generations[0].to
- tvr: 350i generations[0].to
- tvr: 390se generations[0].to
- uaz: bars engine power
- venturi: atlantique 300 Biturbo moment
- wartburg: 1.3 length/width
- wey: macchiato generations[0].to (series-production fill 2026-10-29)
- wiesmann: GT MF4 introduction

### New-card exception

Sono Sion was explicitly removed from the raw selector because the sweep documents prototypes only and cancelled series production. Its explanatory card remains, with unknown production dates, and was not promoted to a series-production model-line addition. The existing index fallback still exposes card-only identities; decide whether to hide the make/card or retain the explanation. The other 18 newly covered makes have every card lineSlug represented in auto/additions. There remain 404 card-only records overall; the wider pre-existing card-only fallback was not converted wholesale.

## Validation

- `node scripts/model-cards-index.mjs`, `node scripts/model-lines-index.mjs`, `node scripts/makes-index.mjs`: passed, counts above.
- `node analysis/sweep/apply-proposals.mjs` repeated on final catalog: zero changed catalog files; append-only audit log only.
- `node analysis/sweep/validate-integration.mjs`: passed; zero duplicate identities, missing make references, reversed year ranges, missing required line-generation date/status keys, unsupported enum values, or resurfaced excluded records. One new-card line exception (Sion), retained explicitly above.
- `node --check analysis/codex/build-catalog.mjs` and `node --check analysis/codex/build-model-lines.mjs`: passed.
- Exclusion-helper assertions: all 513 original snapshots excluded; canonical TVR record sharing a QID retained.
- `npx tsc --noEmit --incremental false`: passed after the final catalog/index changes.
- `npm run build`: passed, all 5,638 static pages generated. A final repeat build is recorded in the bridge reply.

The initial validation caught a helper matching duplicate removals by QID alone. It was fixed to match the reviewed slug as well, then the validator passed. No current validation failures. This was an integration of existing reviewed evidence, not a fresh independent fact-check of every cited page. Full source rebuilds, browser visual review and URL/redirect migration remain unverified. Ignore .next build churn.

Changed-file manifest: [changed-files.json](changed-files.json). Detailed first-pass audit: [apply-log-90dd9c8c7d5e.json](apply-log-90dd9c8c7d5e.json). Final idempotence audit: [apply-log-4c3809d4c189.json](apply-log-4c3809d4c189.json).

## Supplemental merge of ten occupied slug targets (2026-10-29)

Confirmed all ten raw entries as duplicate identities of existing sourced lines/cards. All target line QIDs were null; no conflicting QID existed. All ten raw production bounds were null and their code arrays empty, so there were no additional production dates or codes to transfer. Existing target chronology and generation data remain intact. The Cullinan raw SUV body type was already present on its canonical line. QIDs and their source links were retained on the canonical lines, and each old slug is now an alias on both line and card. Raw metadata is retained in the exclusion snapshots.

| Make | Removed raw slug | Canonical slug | Retained QID / source identity |
| --- | --- | --- | --- |
| mahindra-electric | mahindra-e2o | e2o | [Q12061442](https://www.wikidata.org/wiki/Q12061442) |
| mahindra-electric | mahindra-e2o-plus | e2o-plus | [Q65122328](https://www.wikidata.org/wiki/Q65122328) |
| mahindra-electric | revai | reva | [REVAi / Q2092926](https://en.wikipedia.org/wiki/REVAi) |
| morgan | 4-q6911571 | plus-4 | [Q6911571](https://www.wikidata.org/wiki/Q6911571) |
| morgan | 4-q6911573 | plus-4-plus | [Morgan +4+ / Q6911573](https://en.wikipedia.org/wiki/Morgan_%2B4%2B) |
| moskvic | moskvich-8 | 8 | [Q135642307](https://www.wikidata.org/wiki/Q135642307) |
| neta-auto | neta-gt | gt | [Q115852634](https://www.wikidata.org/wiki/Q115852634) |
| rolls-royce | rolls-royce-cullinan | cullinan | [Q30972583](https://www.wikidata.org/wiki/Q30972583) |
| xpeng | p7-q65064122 | p7 | [Q65064122](https://www.wikidata.org/wiki/Q65064122) |
| xpeng | p7-q130527663 | p7-plus | [XPeng P7+ / Q130527663](https://en.wikipedia.org/wiki/XPeng_P7%2B) |

Wikidata labels, descriptions and sitelinks were checked online; three direct entity fetches failed (REVAi, Morgan +4+, P7+), so their Wikipedia pages and Wikidata item-link destinations established the matching QIDs. REVA/REVAi is already one canonical family. The classic Morgan +4 and +4+ remain distinct, as do XPeng P7 and P7+. No different-car exception was found. This identity merge does not revalidate every historical date or specification on the existing cards.

Ten durable `models-auto` selector exclusions were added with exact make/slug/QID matching. P7 and P7+ were promoted from existing cards to model-line additions. Cullinan's existing addition and these two additions were materialized into model-lines-auto, replacing card-only fallback without creating new card identities. The totals are now 4,377 explicit lines plus 402 card-only lines; 4,616 cards; 432 makes. Three indexes rebuilt successfully. No old card identity, front-drawing key/asset, index identity or exported catalog route points to the removed slugs. All ten canonical catalog routes exist after the build.

Validation:

- `node analysis/codex/merge-slug-collisions.mjs`: ten merges; repeat returned `changed: []`.
- `node scripts/model-cards-index.mjs`, `node scripts/model-lines-index.mjs`, `node scripts/makes-index.mjs`: passed.
- `node analysis/sweep/validate-integration.mjs`: zero issues; pre-existing Sion exception unchanged.
- `node analysis/codex/verify-slug-collisions.mjs --routes`: passed canonical QIDs/aliases, indexes, cards, drawings, 20 exclusion-helper boundary cases and ten canonical/removed route pairs.
- `node analysis/codex/verify-slug-migrations.mjs`: passed the previous five migrations.
- `npx tsc --noEmit --incremental false`: passed.
- `npm run build`: passed, all 5,638 static pages generated.

Audit snapshots and target generation bounds: [slug-collision-merges.json](codex/slug-collision-merges.json). Full source rebuilds and browser visual review were not run. No commit or push was performed.
