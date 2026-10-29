# Turn 5 — partial depth increments, 2026-10-29

Seven makes, 16 selected model lines, 95 new audit entries. Three parallel workers covered Honda, Lada/Alfa Romeo and Iveco/Chevrolet; root covered Land Rover/Jeep and integration. All 125 owned makes remain depth-incomplete. No commits, pushes or other Git writes.

| Make | Selected lines | New audit entries | Main result |
| --- | --- | ---: | --- |
| Honda | Civic, Jazz, CR-V | 10 | European 2025/2023 facelift events; three 2023 CR-V VI technical versions |
| Lada | 2101, Niva | 11 | 2101 family end 1988/status ended; ordinary Niva Legend 1.7 trim |
| Iveco | Massif, eMoovy | 17 | 2008 Massif start, selected powertrain fills; eMoovy launch/delivery distinction |
| Chevrolet | Volt | 4 | Split aggregate row into 2010–2015 and 2015–2019; US/import MY2016 trim |
| Land Rover | Discovery, Discovery Sport, Velar | 16 | Discovery 3 end corrected to 2009; L550/L560 codes; 2019/2023 facelifts |
| Jeep | Renegade, Compass | 21 | 2018/2021 facelifts; eight MY2020 Compass130 manual technical null fills |
| Alfa Romeo | 147, 156, Giulietta | 16 | 937 code, seven dated 147 engine versions, four exterior update events |
| Total | 16 lines | 95 | Five new technical trims and seven selected engine-list versions |

Counts include provenance, review maintenance, grouped arrays and one status reversal. They are not counts of independently verified specifications. Two grouped Chevrolet operations cover many nested fields; Iveco metadata corrections were appended after integration review. The net eMoovy production status is **unknown**: product availability does not prove ongoing factory production in October 2026. Its temporary upgrade and reversal remain explicitly audited.

Notable substantive findings:

- Discovery 3 incorrectly ended in 2010; manufacturer heritage chronology and ADAC agree on 2009.
- Volt's single 2010–2019 row hid the second generation. Both generations are now separate; the new trim explicitly labels 111 kW/398 Nm electric-drive output, avoiding combustion-engine/system-output confusion.
- The ordinary Niva Legend trim is distinct from Bronto. The new ordinary version uses 142 km/h; the existing Bronto data were preserved. Its disputed wheelbase remains null.
- CR-V VI lacked all technical trims. Three continental-European launch variants now preserve separate powertrain/drive/performance scopes; 135 kW and 335 Nm are traction-motor figures, not sums of engine and motor outputs.
- Compass MY2020 130 manual now has 1332 cc, four cylinders, six gears, length4394/height1629/wheelbase2636 mm, 192 km/h and 10.3 s. Folded-mirror width was not copied into body width.
- Alfa Giulietta MY2014 update is recorded in presentation/sales year 2013, separate from 2016. Exact 147 engine capacities remain null where only marketing litres were corroborated.

Conflicts retained: Honda Civic1798/1799 cc; CR-V Advance AWD mass1821/1875 kg under different source tables; Niva wheelbase2220/2200 mm; Massif end2010/2011/application dates; Alfa156 whole-family endpoint2007 versus retrospective1997–2005 summary; Discovery I/II model-year versus calendar-cycle dates. See per-make reports and depth notes for source URLs and exact retained values.

## Verification

- `node analysis/sweep/codex/validate-turn5.mjs`: PASS strict CatalogModelCard[] checks for all seven changed make files; exact baseline replay and prior report-array preservation for Lada11/LandRover16/Jeep21/Alfa16; latest logged fields match all seven cards.
- `node analysis/sweep/codex/iveco-chevrolet-audit.cjs`: PASS whole-file semantic replay from HEAD plus existing audited uncommitted changes for Iveco17 cumulative / Chevrolet18 cumulative; idempotent final run adds zero entries. This is read-only with respect to Git.
- `node analysis/sweep/codex/validate.mjs`: PASS125 reports /763 cumulative entries, compared with668 before this turn.
- Honda worker additionally checked its three review-array before-values and preserved nine prior report entries. Lada/Alfa workers ran dedicated replay checks. No temporary type-check file or tsbuildinfo left behind.
- No application-wide build, fresh image pixel review or comprehensive model-by-model source certification. Manufacturer Honda pages returned403, so indexed release excerpts were used alongside accessible ADAC evidence; INL/Valeo and selected OEM PDFs also had indexed-text-only limitations. No bypass attempted. Root Velar release direct fetch timed out; indexed text was available.

## Handoff and remaining work

All edits are in owned catalog card files; no Ford/Hyundai winning-file or shared-index proposals were added this turn. Prior round proposals remain separate. DEPTH-BACKLOG.json refreshes structural counts for the seven changed makes, records the selected round5 scope, and keeps every card depthComplete=false. TURN-5-COUNTS.json gives machine-readable counts.

Next untouched makes by existing local fleet ranking: Cupra26517, Chrysler18875, Lexus15623, Dodge14859, Jaguar13692, Daewoo11562, Lancia9176. Earlier makes still need complete generation chronology/code/status/facelift review, complete European engines/trims and exact technical conventions, Commons description/licence/pixel checks, summaries and shared-file reconciliation. Even the 16 selected lines above received bounded field checks, not full depth completion. User-visible progress was provided throughout in commentary; PROGRESS.md contains seven DEPTH lines.
