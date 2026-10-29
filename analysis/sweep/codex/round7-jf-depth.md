# Round 7: selected Ferrari and Jaecoo depth

Checked 2026-10-29. Partial depth, not certification of either make.

## Applied

- Ferrari `288-gto`: filled torque 496 Nm, maximum speed 305 km/h, acceleration 0–100 km/h 4.9 s. Evidence: [Ferrari 2024 GTO technical specification](https://www.ferrari.com/content/dam/ferrari-fcom/old/pdf/CS_Ferrari_GTO_Legacy_Tour_2024_gbr.pdf) and [RM Sotheby's Paris 2026 description](https://backoffice.rmsothebys.com/auctions/pa26/lots/r0071-1985-ferrari-288-gto/). Ferrari's table was returned as a search-index extract; direct opening returned the robot challenge. The independent auction description was retrieved, lines 75/84. These are manufacturer claims, not measured test results. No endpoint was changed.
- Jaecoo `j7`: appended one Czech SHS-P Exclusive PHEV trim, preserving the existing Czech petrol row. [Czech manufacturer table](https://omoda-jaecoo.cz/jaecoo/jaecoo-j7-phev) and [Sauto technical catalogue](https://www.sauto.cz/katalog-modelu/352-jaecoo/3608-7/10437-7/53992-shs-15-tgdi-plug-in-hybrid-dht) agree on 1499 cc, 105 kW, 215 Nm, 4500/1865/1670 mm, wheelbase 2672 mm, kerb mass 1795 kg, 180 km/h and 8.5 s. [Cars-Data's Czech Exclusive row](https://cars-data.com/cs/jaecoo/7/2025/shs-exclusive--110779) also corroborates four cylinders, automatic and FWD. The engine fields describe the combustion engine. No combined system power is placed in that field. Each group of numeric fields has sources in `fieldSources`.

## Kept unresolved

- GTO end year: [Autozine](https://www.autozine.org/Archive/Ferrari/classic/288GTO.html) and [Ultimatecarpage](https://www.ultimatecarpage.com/spec/169/Ferrari-288-GTO.html) give 1986, whereas [Italpassion](https://www.italpassion.fr/en/cars/ferrari-288-gto/) gives 1987. Both production bounds remain null pending better direct production evidence; a two-site majority does not resolve the conflicting endpoint.
- Jaecoo PHEV consumption and EV range vary between sources; no value was selected. Sauto's family-level 2023 start was not applied to the Czech PHEV row. Gear count, production bounds, model year and range fields remain null.
- J8 UK official evidence was found, but no J8 trim was added in this pass. J5/J6/J8 specifications and all photos remain unverified in depth. Ferrari's other 48 cards remain outside this selected scope. No image metadata was changed.

## Validation

`node analysis/sweep/codex/round7-jf-verify.cjs` passed exact baseline replay for all 11 appended audit records (Jaecoo 4, Ferrari 7), verified preservation of all prior report arrays, and compiled both complete card arrays against `CatalogModelCard[]` under strict TypeScript with no emit. Three Ferrari numeric fields and one Jaecoo trim are data changes; the other seven audit entries concern sources/review metadata. Baseline and deterministic apply/verify scripts are retained alongside this note. No repository-wide typecheck was run; no build cache was touched intentionally.
