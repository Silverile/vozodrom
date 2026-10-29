# Turn 9 — seven-make partial depth pass

Three parallel workers and root reviewed **DS Automobiles, Aixam, BAIC, Infiniti, Hummer, Leapmotor and Dongfeng**. Their local inventory contains **107 model cards and 136 generation rows after the pass**; that inventory is not external verification of every row. Selected changes affect **21 model lines**, recorded as **101 sequential audit operations**, including source arrays, review maintenance and four conservative follow-up corrections. Audit operations are not independent fact counts.

| Make | Changed lines | Audit operations | Selected findings |
| --- | ---: | ---: | --- |
| DS Automobiles | 5 | 26 | DS4 I/DS5 end 2018; DS3 crossover start 2019; DS4 II start 2021, D41 and N°4 facelift 2025; DS7 start 2017 and facelift 2022; N°8 start 2025 |
| Aixam | 2 | 6 | A721/A741 ended; exact factory endpoints remain unknown |
| BAIC | 2 | 11 | BJ30 separated into two generations, II from 2024 with China-scoped dimensions; X7 from 2020, facelift 2023 |
| Infiniti | 5 | 26 | QX50 J55/QX55 end 2025; Q50 facelift 2017; QX60 facelift 2025 and current status; QX80 current status |
| Hummer | 1 | 5 | H3T end 2010, ended status |
| Leapmotor | 3 | 12 | C10/C16 series production from 2024 and Chinese facelifts in 2026; C10/B10 current production |
| Dongfeng | 3 | 15 | eπ 007/eπ 008/Box series production from 2024 |

Every changed value has source URLs in its per-make report. The validator enforces at least two URLs per operation, which does **not** prove independent provenance: the DS3 facelift uses two OEM pages from one source family. Independent corroboration is stronger for the other selected chronology fields but remains incomplete for the full model histories. Wikipedia revision URLs record the revisions exposed by retrieved live pages; direct revision retrieval was not universally successful.

H3T's 2010 endpoint uses GM's production table (321 calendar-2010 H3T units) and contemporary factory-closure reporting. QX50/QX55 use OEM discontinued histories plus independent reporting; unsold stock does not imply ongoing production. B10 current status includes the 16 October 2026 Zaragoza SOP announcement and a factory-attending industry reporter. One **QX65 missing-model proposal** was appended to the Infiniti report; no shared model indexes were edited, and its exact production start remains unknown.

## Conservative chronology decisions

Root review removed facelift `productionYear` inferences for DS4, DS7, Q50 and QX60: reveal years remain populated but sales/delivery dates alone do not establish the factory switchover. X7 retains productionYear 2023 because the German chronology explicitly says the revised version has been built since March 2023 and separates production periods at that boundary; the OEM corroborates the update year.

Leapmotor's Chinese facelift years are populated, with productionYear null and no assumed European timing. C10 exact event dates conflict (English article June 4 versus issuer June 16 launch); only common year 2026 was applied. The issuer's August 2026 interim statement was read as an original issuer PDF served by a report mirror, not counted as independent editorial corroboration. DS9 endpoints, BJ30 I boundaries, military/civilian BJ80 chronology and Aixam exact factory endpoints remain open. Historical production reports alone were not used to set October 2026 current status for BAIC/Dongfeng.

## Photos and technical limits

No photo was replaced or removed; **zero fresh visual certifications**. Existing historical reviewed flags were preserved and do not represent a new pixel inspection. DS checked three existing Commons descriptions/categories/credits. Hummer H1/H3 descriptions match; H2/H3T category checks support family identity but direct descriptions failed. Two Infiniti file descriptions were inaccessible. Dongfeng Box metadata matches; AX7/S30 descriptions failed. Leapmotor retrieved four of six existing-file descriptions (A10/B05/B10/C10), with C01/T03 retrieval failures. C10's November 2023 and B10's November 2024 exhibition images predate series production; exact production-body equivalence remains unresolved. Aixam/BAIC photo slots remain null.

This round adds no engine/trim sample rows. BJ30 II receives manufacturer-sourced China dimensions; full European powertrain ranges and trim specifications, codes, summaries and actual visual identity comparisons remain unfinished. **All 125 makes remain depth-incomplete.**

## Verification and handoff

- `node analysis/sweep/codex/validate-turn9.mjs`: PASS, exact replay of all 101 operations from baseline cards; old report-array prefixes preserved; at least two URLs per operation; strict CatalogModelCard types across all seven full card files.
- `node analysis/sweep/codex/validate.mjs`: PASS, 125 reports and 1,022 cumulative sourced audit operations match final card fields (previously 921).
- `node analysis/sweep/codex/finalize-turn9.mjs`: updates seven structural backlog entries, TURN-9-COUNTS.json and seven DEPTH progress lines; no make marked complete. The finalizer is repeatable; worker update scripts generally append reports and should not be rerun.

No application build/runtime test run. No Git writes, shared index edits or changes to Ford/Hyundai winning copies. The optional bridge progress helper failed because the configured Python executable was unavailable; progress was provided in conversation commentary and persisted in PROGRESS.md.

Next fleet-ranked makes after Dongfeng: **Lamborghini, Ligier, Lifan, Austin Motor Company, Aston Martin, Lincoln, GMC, Daimler Company, Forthing, DKW, Lynk & Co**. Earlier makes still require additional depth passes; this round does not close the each-model task.
