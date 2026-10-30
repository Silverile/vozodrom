# MINI, delivery 74

Final checkpoint: 9 cards, 26 generation/family records, 28 selected versions, 24 individually inspected Commons photographs. Full offline rebuild and strict validator PASS. Zero preview binaries retained. Missing illustrations are classic MkII and grouped F65/F66/F67; search is incomplete, not a claim of unavailability.

Source-backed partial production catalogue. All eight existing slugs are preserved; Clubvan is added as a separate modern LCV line. Classic Mini has seven mark records plus separately labelled Traveller/Countryman estate, classic Clubman/1275GT, Van/95 and Pick-up branches. These parallel body branches are not claimed to be chronological successor generations.

Brand boundaries: the classic vehicle began as Austin and Morris, used Mini as its own marque from 1969, and later belonged to Rover. The card explains this historical umbrella rather than attributing 1959 cars to BMW-era MINI. Riley Elf, Wolseley Hornet, Innocenti and Moke identities are not automatically reassigned. Rocketman, Urbanaut, Vision and other concepts/race-only vehicles are excluded.

28 selected technical rows: original One/Cooper/Cooper S three; R56 early Cooper/Cooper S two; F56 three engines × manual/automatic six; F55 three engines × manual/automatic six; J01 Cooper SE one; Aceman E/SE two; U25 Countryman E/SE two; Clubvan three standard manuals; Roadster Cooper/S/SD three. Exact per-generation matrix is in the JSON report. This is not complete engine/trim coverage: classic motor tables, Coupé/Paceman/Clubman, older Countryman, modern F65/F66/F67 and many later facelifts still need work.

Per-row market, publication date and body scope are explicit. The global BMW 2013 F56 release provides different length for Cooper S; it is not copied into five-door or convertible rows. F55 data use the global September2014 sheet; six-speed gearboxes are independently confirmed in the contemporaneous UK manufacturer press folder. No imperial acceleration, power or consumption was converted. The known erroneous-looking Cooper SD cylinder/cc summary in that global sheet was not used.

Clubvan dimensions and three standard-manual performance/consumption configurations are explicitly stated in the 23 June2012 manufacturer release. Optional diesel automatic performance is not inferred. All displacement numbers given only as rounded litres remain null. A modern website-wide WLTP footer is not retroactively applied to a 2012 release; consumption cycle retains the original wording “EU test cycle average”. Electric range uses the exact publication scope; Aceman range is expressly the maximum of the manufacturer's stated WLTP interval. Configuration-range consumption remains null instead of a guessed average. Power standards remain null where not explicit.

Original Cooper top speed remains null because the 2001 factory text says200km/h while a later OEM retrospective says197km/h without settling the configuration difference. Torque and exact body/year comparisons are not invented. All nulls have indexed review reasons. Existing snapshot production bounds remain imports, not a new verification of every body or market.

Photos: individually inspected Commons files with exact imageinfo author/licence metadata. All accepted ratios meet1.4–1.7. Roadster side view and Clubvan rear-three-quarter are explicit angle fallbacks; tight views, concepts and wrong-generation search hits were rejected. A photo is a generation-family illustration, not evidence for the listed technical engine/trim. Missing photos are not proof that Commons has no suitable image.

Offline rebuild order:

1. `node analysis/codex/night-mini-build.mjs`
2. `node analysis/codex/night-mini-versions.mjs`
3. `node analysis/codex/night-mini-legacy.mjs`
4. `node analysis/codex/night-mini-photos/finalize.mjs`
5. `node analysis/codex/night-mini-validate.mjs`

The builder reads immutable `mini-evidence/base-lines.json` (eight original identities), so subsequent shared-registry integration of Clubvan does not create a duplicate on rebuilding. The finalizer recalculates counts, proposed lines, sources and remaining version/photo matrix. Only the isolated MINI card and evidence were written. Temporary preview binaries are removed after inspection; offline rebuilding does not fetch or require those images.

The original Cooper speed conflict is traceable to the Tokyo2001 source in its row and the later OEM retrospective: https://www.press.bmwgroup.com/usa/article/detail/T0359872EN_US/the-mini-cooper-the-synonym-for-driving-fun-for-over-60-years?language=en_US . The latter says197km/h while the former says200km/h; the field stays null rather than selecting one without identifying the configuration difference.
