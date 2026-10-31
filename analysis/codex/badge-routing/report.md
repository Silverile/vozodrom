# Badge routing repair

BMW modern numeric badges now reach their dated series rather than an expired historic model. M/performance, X/Z/i and explicit chassis labels are recognized; genuine historic numeric models remain matched in their own periods. Saab 93/95 spellings similarly select historic 93/95 or modern 9-3/9-5 by year. Mercedes compact class names (C200/E220/CLA200/ML270 etc.), explicit chassis labels, 190E and reverse class notation are recognized. Bare 220 no longer proves W220/S-Class. Volvo aliases such as 144/245 use existing catalogue aliases/factory codes. Audi and Peugeot numeric cases are covered by positive/negative regressions.

167 synthetic cases pass, including year-order cache and four hash seeds. 29,371 lookups across 211 other model namespaces match baseline 00206d5; their matcher names/generations are identical. No catalogue generations, dates, listing IDs, drawings or holds were edited. Explicit BMW/Mercedes chassis codes also disambiguate overlapping generation years (e.g. E46 vs E90 in 2004). Shared Mercedes van codes retain the existing declared Vito convention; other ambiguous chassis do not pick a family alphabetically. Explicit canonical classes with unknown dates can contribute line totals while generation figures remain absent.

| Line | Fleet before | Fleet after |
|---|---:|---:|
| bmw/rada-1 | 11315 | 11716 |
| bmw/rada-2 | 3950 | 2463 |
| bmw/rada-2-active-tourer | — | 1675 |
| bmw/rada-2-gran-tourer | — | 1151 |
| bmw/rada-3 | 32702 | 60225 |
| bmw/rada-4 | 3374 | 5207 |
| bmw/rada-5 | 38026 | 39413 |
| bmw/rada-6 | 2393 | 2606 |
| bmw/rada-7 | 6073 | 6270 |
| mercedes-benz/trida-c | 21190 | 22028 |
| mercedes-benz/trida-e | 25553 | 27444 |
| mercedes-benz/trida-s | 7251 | 7764 |
| saab/9-3 | 2320 | 2328 |
| saab/9-5 | 1589 | 1601 |
| volvo/240 | 105 | 300 |

Complete raw IS TP rerun: all 1,094 days from 2023-10-12 through 2026-10-11. Register snapshot: vypisvozidel.csv, built 2026-10-31. Only Audi/BMW/Mercedes-Benz/Peugeot/Saab/Volvo rebuilt. Make fleet and inspection totals preserved; 45 line-level metrics changed. Every raw generation cohort meeting minimum 30 checked against output; 21 empty fleet-line generation groups are recorded with their reasons. Statistics and listing indexes regenerated; every other make's statistics and index entries are unchanged.

BMW 2 decreases because explicit Active Tourer and Gran Tourer badges now reach their separate existing catalogue lines; these rows are shown above. Those lines use their existing date evidence, so an undated generation still has no invented generation aggregate.

All before/after line metrics are in statistics-rebuild.json; per-generation BMW 3 populations are in report.json. Null in comparisons means absent/below publication threshold, not a claimed zero.

Bare Mercedes 300/350 outside documented historic periods remains ambiguous between several classes; no model is guessed. This repair does not eliminate incomplete catalogue periods, year-proxy limitations, or all register spelling problems. No VINs or individual vehicle records are included in reports.

Ready for Claude build/browser review/publication; no commit or publication here. Next: 526 wave-1 generations without engines in wave-1-second-source-queue.json, then wave 2. Hand off this publishable matcher/statistics point before engine edits.
