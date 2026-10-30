# Mercedes-Benz, delivery 72

2026-10-27, roughly 13 minutes of this worker's research/build time. Files are an explicit partial catalogue, not a claim that all historic versions are complete.

72 model cards, 141 generation/family records, 81 selected technical versions across 15 records, 8 individually inspected Commons photographs before the parent's separate A/C/E/S photo pass. All 36 existing catalogue line slugs were preserved. Historic additions use deliberate grouped identities, not one card per engine or coachbuilder. The new rear-engine line contains 130 and 170 H; W30/150 was removed because the checked overview classifies it as a prototype/racing car. `s-ss-ssk` describes W06, not pre-merger Simplex.

Version coverage: C W206 12; E W214 5 and C238/A238 7 (only Coupé rows); A W177 10 (four hatchback, six V177 sedan); S W223 5 (long V223 only); B W247 4; CLA C118 7 (X118 Shooting Brake only); GLA H247 2; GLB X247 5; GLC X254 3; GLE V167 5; V-Class W447 8 (compact body only); Vito W447 6; 190 SL one fabric-roof version; 300 SL one road Coupé version. The complete remaining generation matrix is in `night-mercedes-benz-report.json`.

Field coverage within 81 versions: power 81, specified gearbox type 68, 0–100 km/h 70, mass 9, scalar fuel consumption 8, full dimensions 15. Remaining production periods, power standards, torque, drive and other fields are null with indexed review reasons where not verified. Modern mild-hybrid figures represent combustion engine output, never an invented sum with temporary electric boost. Diesel mild-hybrid systems use the diesel enum with the boost scope described in the source-specific note.

The eight scalar consumption figures are from the original German V-Class brochure with editorial deadline 19 September 2016 (archived copy), pages 64–67, and only compact bodies. The document specifies the statutory German procedure; an unverified NEDC acronym was not assigned. Dimensions are explicitly manufacturer average values for unloaded basic vehicles without roof rails. Mass definition includes 68 kg driver, 7 kg luggage, fluids and 90% fuel. V200/V220 automatic mass is null because the table does not separate the transmission's effect. The GLC200 dimensions/mass/9G entry is independently matched to the Portuguese OEM June 2022 sheet by engine, power, torque and performance; its values are not spread to the other GLC engines.

Vito configurations come from the German OEM 10 March 2020 release. That exact table prints 1951 cm³ for OM654; the records are not mixed with other years/brochures printing 1950 cm³. Its NEDC-correlated configuration intervals remain null as scalar consumption. Unknown body length means no dimensions or mass are borrowed from other configurations. The 124 CDI row is restricted to Tourer/Mixto with passenger registration and does not guess a gearbox.

Photos: exact Commons imageinfo author/licence/file URLs are retained in batch files and final cards. All selected image ratios fall in 1.4–1.7, with the entire vehicle visible and breathing room. R107 is a declared side-view fallback; W447 is a declared straight-front fallback. Tight examples of W120, W114/W115 and 770 were rejected; this does not establish that no suitable image exists. The parent handles modern A/C/E/S photographs separately. Cached previews were for selection only and are removed from the final handoff.

Sources are recorded per generation/version and in the report. Core engine evidence is also mapped in `mercedes-benz-evidence/versions.json`. Factual fields are selected from manufacturer releases and original brochures; all Czech prose was written for this catalogue. The historic production overview supplies identities, not a warrant to reinterpret introduction years as confirmed production periods. Early added identities therefore keep dates and bodies null until individual primary histories are checked. Pre-merger Mercedes/Benz, trucks/buses, military-only specials and concepts are outside this pass. Historical standalone Maybach is separate; later Mercedes-Maybach should eventually become scoped S/GLS versions.

Offline rebuild order (no network calls):

1. `node analysis/codex/night-mercedes-benz-build.mjs`
2. `node analysis/codex/night-mercedes-benz-versions.mjs`
3. `node analysis/codex/night-mercedes-benz-refine.mjs`
4. `node analysis/codex/night-mercedes-benz-historic-lcv.mjs`
5. `node analysis/codex/night-mercedes-benz-early.mjs`
6. `node analysis/codex/night-mercedes-benz-photos/finalize.mjs`
7. `node analysis/codex/night-mercedes-benz-scope.mjs`
8. `node analysis/codex/night-mercedes-benz-validate.mjs`

Any parent photo merge happens after this sequence. Do not rebuild afterward without reapplying that parent's separate photo patches. Validator checks strict CatalogModelCard/CatalogModelLine types, source presence, unique slugs, chronological bounds and an indexed review for every null field.

High-priority follow-up: old C/E/S motor tables, exact historical body/date scopes, AMG and Mercedes-Maybach, G, Sprinter and electric variants; modern mass/dimensions and approved scalar consumption where a precise configuration can be matched. These are unsearched or unfinished, not exhausted sources.
