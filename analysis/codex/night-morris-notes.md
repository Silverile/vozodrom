# Morris — delivery 76

Partial historic passenger/LCV catalogue, not a complete trim or engine database. External Claude card file was absent and no pre-existing Morris line slugs were present when work started. Root integrates the proposed line identities; this worker does not edit registries.

Identity sources: Morris Register history, Morris Register Auckland model checklist, Oxford museum and BMW Group's Oxford manufacturing history; Oxford/Minor generation distinctions additionally checked against the cited Wikipedia pages. British and Australian Major/Moke branches are separate. Mini-Minor/Cooper is scoped to Morris badging, not every later classic Mini; Austin, Hindustan and modern BMW MINI are not additional Morris generations. Shared ADO16/ADO17 bodies do not establish a Morris-specific end year. Oxford F-Type's museum prototype is not treated as a production technical configuration.

Technical rows come from nine individual British Motor Museum collection records. They describe the specific exhibited car/year/body, not every version in its family. Museum model year is in specificationScope.modelYear; production from/to stays null where not established. Published bhp is recorded in the scope note and is **not** converted to kW. No guessed transmission, drive, mass, consumption cycle or acceleration. Museum's metric top speeds are reproduced as factual figures, not calculated from mph. Six records have exhibit-specific length/width/height; wheelbase remains unknown. Cowley, Eight and MO dimensions were withheld pending stronger verification. Thus none of these rows claims a complete dimensional set.

Data-quality warnings:

- The museum's 1929 Minor record (row_id=76417800298) prints 948 cm³/37 bhp/117 km/h, apparently transposed from a later Minor 1000 record. Those technical values were rejected entirely.
- Museum Ital record row_id=76417800314 says final car/end 1983; Morris Register says 1984. Family end stays null with ended status and an indexed conflict note.
- Museum describes its 1952 MO in terms that risk conflating later Oxford/Indian derivatives. Its dimensions are not used. Oxford III first year needs further reconciliation (1956 in Oxford history versus 1957 in museum narrative).
- Cowley museum 1550 cm³ is not silently replaced by a rounded/nominal alternative. Ital 1695 cm³ versus application-catalogue 1698 is not reconciled by guess; both engine displacements remain null.
- Oxford named Sixteen/Twenty and separate numeric Morris identities remain an identity-level taxonomy review item, not a claim of independent nonoverlapping platforms. Early tax-horsepower names need model-specific factory evidence.

Photo selection uses exact Commons imageinfo author/licence metadata and individually viewed thumbnails. Query matches that were actually Isis, Cowley or Oxford IV were remapped to the correct card; Hindustan/Ambassador lookalikes, cropped cars, bonnets open and obstructed vehicles were rejected. Missing photographs mean unfinished time-bounded search, not proof none exist. Photographs illustrate a body/generation, not the engine configuration in a table.

Offline rebuild (no requests):

1. `node analysis/codex/night-morris-build.mjs`
2. `node analysis/codex/night-morris-versions.mjs`
3. `node analysis/codex/night-morris-photos/finalize.mjs`
4. `node analysis/codex/night-morris-validate.mjs`

The search/sheet/choose scripts are optional online evidence tools, not offline prerequisites. Reviewed selections are in batch JSON; cached image binaries are removed before handoff. Final machine report records counts, source URLs, proposedLines and version/photo matrix. Remaining work includes almost all engines/gearboxes, wheelbases, mass, 0–100 and consumption; early subseries and regional boundaries; unresolved Morris Metro/Princess badge periods and additional light commercials. Race-only cars, prototypes, military-only specials and heavy Morris Commercial vehicles are excluded. No source-exhaustion claim.
