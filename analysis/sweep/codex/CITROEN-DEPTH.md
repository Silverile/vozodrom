# Citroën partial depth pass — 2026-10-29

Inventory: 64 cards and 75 generation rows. Fleet order from top-level `fleet.n` in `src/data/stats/citroen.json`, excluding `_` (unresolved models): Berlingo 54,245; C3 32,704; Jumper 23,777; C4 Picasso 19,016; C4 17,177; C5 10,667; Xsara Picasso 10,472. The `_` bucket contains 231,185 vehicles and is not a model line. Generation inventories for Berlingo, C3, C4 and C5 were inspected; external depth work in this bounded pass concentrated on Berlingo.

Five factual fields changed directly in `src/data/catalog/model-cards/citroen.json`, all logged as new `cardFixesApplied` entries in `citroen.json`:

- Added partial facelift arrays: Berlingo I 2002, Berlingo II 2015, Berlingo III 2024. The [manufacturer's 2026 retrospective](https://www.media.stellantis.com/uk-en/citroen/press/citroen-celebrates-30-years-of-berlingo-with-new-collection-trim-announced) and [TÜV-Verband 2025 report, printed page 20](https://www.tuev-verband.de/fileadmin/user_upload/Content_local/2025_TUEV-Report_Nutzfahrzeuge.pdf) agree on those years. These arrays intentionally do not claim completeness. ADAC lists additional 2005/2012 changes; obtain vehicle-manufacturer corroboration before adding those.
- Berlingo III code null → K9. [Manufacturer service handbook index](https://service.citroen.com/ddb/index.html) identifies `berlingo.k9` and [Audatex's own application list](https://ftptic.audatex.es/AudatexDocBase/Actual/lista.pdf) identifies K9 Berlingo/ë-Berlingo Combi from 2018. Manufacturer index data was available through search extraction; direct open returned an empty body.
- Berlingo III productionStatus unknown → current. Manufacturer July 2026 release identifies the 2018 generation as today's model and current production plants; [ADAC](https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/citroen/berlingo/) identifies the same generation's 2024 facelift as ongoing. No end year inferred.

Five maintenance fields changed and logged separately: three generation source arrays, card source array, and needsReview. Code review marker removed only for the corroborated K9 field; facelift review markers retained with an explicit completeness caveat. Every other review entry was preserved.

Existing Berlingo 1996/2008/2018 generation starts agree with manufacturer chronology. The first row is explicitly the original European range ending 2008; this pass does not overwrite it with later Berlingo First continuation. The existing technical trims are UK 2023 N1 configurations; newer German passenger-version ADAC figures are not substituted into them. No engine numeric fills were made.

Remaining: complete every Berlingo engine/trim field and photo; facelift completeness; C3, Jumper and other high-fleet lines; C5 second-generation missing dates; all other generation codes/statuses. No whole-make completion claimed. The previous breadth report's entries and metadata remain intact, with the new depth pass appended. No shared catalogue file or PROGRESS.md edited.

Validation: both JSON files parsed with Node and PowerShell. Node checked all ten appended change records against actual card field values, verified the five factual field expectations, and confirmed card/generation counts remain 64/75. Report-only documentation does not verify the wider application build.
