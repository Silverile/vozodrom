# Chery depth pass, round 8 — partial

2026-10-29. One of 29 model lines deepened (A1, one generation); all three existing non-null photos checked against Commons description/categories/credits. Ten replayable card operations: seven specification/coverage changes, two source appends and one review-list reconciliation. Exact before/after values and source URLs are appended to `chery.json`; earlier arrays remain intact. The pre-edit cards/report are in `round8-chery-baseline.json`. No shared files touched.

A1 now has regional 1.3-litre engine entries, front-wheel drive, length/width/wheelbase and one explicitly South African J1 1.3 TE five-speed-manual technical trim. This is historical export evidence, not a claim about Czech availability. Other European variants remain unresolved.

## Evidence and conflicts

- [Archived Chery International A1 specification](https://web.archive.org/web/20110803064452/http://www.cheryinternational.com/specifications/en/a1.html): 1297 cc, 62 kW/122 Nm, 3700 × 1578 × 1527 (1564) mm, 2390 mm wheelbase, 1040 kg MT/1049 kg AMT. [German Wikipedia revision](https://de.wikipedia.org/w/index.php?title=Chery_A1&oldid=269463549) independently corroborates 62 kW and the dimensions used.
- [Chery South Africa J1 specification](https://cheryauto.co.za/models/j1/): 1297 cc, four cylinders, 61 kW/114 Nm, FWD, five-speed manual. [English Wikipedia revision](https://en.wikipedia.org/w/index.php?title=Chery_A1&oldid=1360505393) corroborates the engine output/capacity and drive layout; [Auto-data Kimo specification](https://www.auto-data.net/en/chery-kimo-a1-1.3i-83hp-13963) corroborates capacity/torque/manual drive details. The 61 and 62 kW specifications are kept separate by market/source scope.
- Exact trim mass remains null: South African page publishes 1404 kg versus international 1040 kg MT and Auto-data 1070 kg. No typo correction inferred. Family height stays null due to 1527/1564 mm OEM alternatives; selected South African trim is explicitly 1527 mm. Top speed and acceleration stay null for that exact trim.
- 2007–2015 production boundaries unchanged: English/German Wikipedia agree, but do not count as two independent sources. Auto-data starts in 2006; series-production timing still needs reconciliation.
- J3 preliminary sources expose 87 kW/147 Nm versus 93 kW/160 Nm powertrain updates: [old OEM brochure](https://cheryauto.co.za/wp-content/themes/chery/library/brochures/j3.pdf), [OEM model page](https://cheryauto.co.za/models/j3/), [Chery release](https://www.mediawire.co.za/news/release/d410f996-85e0-11ed-9e8c-049226d40405/d5440056-85e0-11ed-9e8c-049226d40405). No A3 edits made because European variant and production scope is not reconciled.

## Photo metadata identity checks

No new visual inspection performed. Existing prior visual-review fields retained unchanged; no image swaps made.

| Card | Commons file | Identity/credit result |
|---|---|---|
| A1 | [2010 Chery A1, front 8.5.18.jpg](https://commons.wikimedia.org/w/index.php?title=File:2010_Chery_A1,_front_8.5.18.jpg&oldid=750591626) | Description 2010 A1 in Luoyang, category Chery A1; Kevauto, CC BY-SA 4.0 matches card. |
| Fulwin generation 1 (A15 branch) | [Car in Syria.jpg](https://commons.wikimedia.org/w/index.php?title=File:Car_in_Syria.jpg&oldid=1053726070) | Description Amulet in Syria (2009), Amulet/liftback categories; High Contrast, CC BY 3.0 Germany matches card. |
| Tiggo7 aggregate family | [Chery Tiggo 7 II 001.jpg](https://commons.wikimedia.org/w/index.php?title=File:Chery_Tiggo_7_II_001.jpg&oldid=960528301) | Explicit second generation, Auto Guangzhou 25 November 2019; Jengtingchen, CC BY-SA 4.0 matches card. Exhibition photograph does not prove series-production timing or Czech 2026 variant identity. |

## Verification and remaining scope

`node analysis/sweep/codex/round8-chery.mjs` passed: 10 operations, 7 specification/coverage changes. Node strict-assert replay passed: all operations reproduce the current cards exactly, all carry at least two source URLs, and all prior report arrays retain their original prefix. JSON parses successfully. An initial inline replay invocation failed because PowerShell expanded `$1` in the regex replacement; single-quoted here-string rerun passed. Python command unavailable; no Python verification claimed. No full app typecheck/build run for this data-only pass.

Still incomplete: 28 other Chery model lines; A1 generation code/facelift, complete European engines/trims, independently reconciled series-production boundaries, exact trim mass/performance; new visual inspection of all photos. This pass must not mark Chery fully deepened.
