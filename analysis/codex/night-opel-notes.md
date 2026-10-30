# Opel — delivery 80

**Partial checkpoint, not a finished high-volume make.** Thirty existing slugs preserved in immutable `opel-evidence/base-lines.json`; twenty-two historic passenger/LCV families added. No root registry/progress edits. Historic race/rocket-only studies, modern concepts and heavy trucks/buses excluded. Earlier model-year/body/export transitions remain incomplete.

Corsa A–F, Astra F–L, Vectra A–C, Insignia A/B, Zafira A–C, Meriva A/B, Mokka A/B, Grandland I/II have explicit generation records. Astra snapshot codes and production bounds are preserved, not newly certified for every global market. Other imported families still use overview records, so 98 records are not 98 fully curated physical generations. The prewar Kadett is added to the same Kadett card, not a second conflicting slug. Olympia Rekord is under Rekord; Kapitän/Admiral/Diplomat remain separate badges. Regionally rebadged Chevrolet/Vauxhall/Holden cars are not automatically new Opel generations.

Technical rows: eight Astra K facelift-2019 petrol configurations (four stated engine/gearbox combinations, explicitly applicable to both five-door and Sports Tourer); nineteen current CZ price-list configurations across Astra L hatchback, Corsa F, Mokka B and Grandland II. These are useful selected rows, **not full version tables**. Vectra/Insignia/Zafira/Meriva/Crossland and older Astra/Corsa tables remain high-priority work. Rows use OEM sources, not marketplace databases.

Current Czech PDFs are explicitly dated 10/2026 and valid from 10.10.2026. Their internal model-year labels K0/G0/70/D0 are retained in scope notes rather than invented numeric model years. Production from/to remains null at version level. Engine power/torque for hybrids are deliberately combustion-engine values; system output is separately named in row title/scope. Thus 100kW combustion plus a 107kW system is not silently combined with a system torque. EV values are complete electric-system values. For Astra PHEV and Grandland PHEV, engine and system moments remain explicitly distinct.

Pohotovostní hmotnost uses the source's label; driver/fill details are not inferred. Grandland hybrid1570kg specifically excludes the optional factory towbar; its alternative1600kg is explained. WLTP consumption intervals stay null scalars with interval in scope. EV published maximum range is explicitly labelled as a maximum, not every wheel/trim configuration. Gear counts are null for electric rows described as bezestupňová; this wording is not proof of an e-CVT or an actual count. Astra K CVT is represented by schema type automatic, with CVT retained in its name. No imperial or hp conversion.

Source-quality issues: the Mokka CZ ICE/hybrid page labels its 5.6/4.9 consumption row as kWh/100km; values are withheld rather than silently correcting the PDF. Astra diesel's1498cm³ is taken literally from this specific Czech price list; exact engine-family displacement reconciliation remains open. Current diagrams contain unlabelled extraction numbers; complete dimensions were not guessed from text order. Source PDF screenshot retrieval was attempted, but diagrams still require reliable visual transcription. The Irish Corsa2019 price list is indexed but returns404; no older technical row is based solely on that unavailable file.

Commons exact-file author/licence metadata retained, individually inspected whole-car preferred-aspect photos selected. Misindexed generation matches were remapped; e.g. postwar Olympia is not the1935 record, and Kapitän A is not the1938 record. Unfilled photographs are unfinished research, not proved unavailable. Preview binaries/type fixtures removed before freeze.

Offline rebuild:

1. `node analysis/codex/night-opel-build.mjs`
2. `node analysis/codex/night-opel-versions.mjs`
3. `node analysis/codex/night-opel-photos/finalize.mjs`
4. `node analysis/codex/night-opel-validate.mjs`

Run the build first: the versions script appends rows. Report contains proposedLines, sources and an exact per-generation version/photo matrix. All nulls indexed for review. Further sourcing is clearly possible; this turn does not claim source exhaustion.

Final corrections: Mokka B's source infobox says production2020– while its narrative says assembly began January2021; start remains null with a specific indexed conflict review. Three custom Commons Attribution-only images (Astra F/J, Corsa C) have no standard licence URL in imageinfo. Exact current file wikitext revisions were fetched and inspected for `{{self|Attribution}}`; permission-revisions.json preserves the evidence and photo.licenceUrl points to the corresponding immutable file-page revision. No Creative Commons licence was invented for these images. The online permissions script is not an offline rebuild prerequisite.
