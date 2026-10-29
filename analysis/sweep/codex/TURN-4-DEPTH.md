# Turn 4 — partial depth increments, 2026-10-29

Eight makes received bounded source checks; none is fully deep-verified. Three parallel workers handled Ford/BMW, Hyundai/Citroën and Kia/Fiat; root handled Audi/Dacia, integration and validation. No commits or Git writes. Winning Ford/Hyundai files remained untouched.

| Make | Source-check focus | Direct audit entries appended | Winning-file proposals appended |
| --- | --- | ---: | ---: |
| Ford | B-Max engines; Puma Gen-E launch output/dimensions | 0 | 15 |
| Hyundai | INSTER performance; IONIQ 9 outputs; i20 BC4 existence | 0 | 1 |
| Citroën | Berlingo code/status and selected facelifts | 10 | 0 |
| BMW | 3 Series E90 launch-sedan widths and acceleration | 30 | 0 |
| Fiat | Ducato, Punto and Doblò codes/selected facelifts | 20 | 0 |
| Audi | A3, A4, Q6 selected chronology/technical version | 30 | 0 |
| Dacia | Duster 2013/2021 facelift records | 8 | 0 |
| Kia | Ceed, Picanto, Sportage, XCeed codes/selected facelifts | 57 | 0 |
| Total | 13 directly changed cards; one added technical trim | 155 | 16 |

Audit-entry counts include sources, field provenance, partial-coverage metadata and review-task maintenance. They are not counts of independently verified specifications. Ford's exact Puma 123.5 kW is independently corroborated only at ADAC's rounded 124 kW precision; the explicit rounding note must accompany application. Some corroborating Ford parts-catalogue evidence was indexed text rather than a downloaded full document.

Most consequential corrections: A4 B8 start 2008→2007; BMW E90 missing width resolved at 1817 mm (earlier source conflict had 1871); B-Max EcoBoost maximum 88→103 kW proposed and 1.6 TDCi 70 kW null fills proposed; IONIQ 9 European Long Range AWD 226 kW proposed. Q6 performance non-boost data is 225 kW/485 Nm/6.7 s, explicitly separated from Launch Control 240 kW/6.6 s. No mass numbers were guessed across driver-inclusive and DIN conventions.

## Handoff to Claude

Apply the 15 newly appended `modelFixes` marked `passType=DEPTH` in `ford.json` and the one `pass=DEPTH 2026-10-29` in `hyundai.json` to your winning `src/data/model-cards/` copies after reviewing their scope. Root validator confirmed all 16 before-values match the current winning files. Preserve exact market/model-year scope, attach cited sources and the Puma precision note; do not blindly transfer 2026 range onto the 2025 Gen-E launch trim. The existing four Ford proposals and one earlier Hyundai proposal are preserved, separate from this count.

See `FORD-DEPTH.md`, `HYUNDAI-DEPTH.md`, `CITROEN-DEPTH.md`, `BMW-DEPTH.md`, `FIAT-DEPTH.md`, `AUDI-DEPTH.md`, `DACIA-DEPTH.md`, `KIA-DEPTH.md` for exact scope and sources. `DEPTH-BACKLOG.json` inventories all 125 owned makes / 2,673 winning cards with gap counts and every card explicitly incomplete. Ford/Hyundai winning inventories contain 32/28 cards; their shadow catalogue files are not the winning copies.

Fleet order computed from local stats: Ford988381, Hyundai599739, Citroën459867, BMW444840, Fiat370779, Audi330416, Dacia318345, Kia307884, Honda268914, Lada213914, Iveco65276, Chevrolet53213. These are sums of top-level per-model `fleet.n`, including an unresolved `_` bucket when present; model prioritization excludes that bucket. They are inventory-derived rankings, not independently audited national totals.

## Validation and limits

- `node analysis/sweep/codex/validate-depth.mjs`: passed exact Audi30/Dacia8 edit replays and prior report-array preservation, all16 winning-file proposal before-values, strict `CatalogModelCard[]` type checks for six changed make files. Temporary compiler file removed; no tsbuildinfo touched.
- `node analysis/sweep/codex/validate.mjs`: PASS125 reports /668 cumulative logged changes, all final logged fields match disk. This is513 pre-existing +155 new direct entries.
- `node analysis/sweep/codex/validate-turn3.mjs`: passed its older69-make baseline /43 logged changes. This older validator covers a different subset.
- Broader application build and fresh pixel-level photo review were not performed. No photos changed. Checked photo descriptions/licences remain partial and are not visual certification.
- The supplied optional bridge progress Python executable was unavailable; that send command failed without sending. Progress was shown through conversation commentary. Dacia global media returned429; respected it and used accessible German primary releases without bypass.

Remaining work is substantial across all125 makes: complete every generation's two-source dates/codes/status/facelifts, full European engine/trim coverage and model-year scope, all Commons metadata/pixel checks, summaries and shared-file proposals. Next untouched high-fleet makes include Honda/Lada, while every make above still has an explicit depth backlog. Do not present this turn as eight completed make audits.
