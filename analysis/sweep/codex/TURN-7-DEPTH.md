# Turn 7 — selected depth and production-year follow-up

Three parallel workers deepened six makes, seven model lines, with **51 appended catalogue audit operations**. Root appended two Audi year reviews and closed one prior year disposition. All 125 owned makes remain depth-incomplete. No Git writes.

| Make | Selected lines | Audit operations | Result |
| --- | --- | ---: | --- |
| Daihatsu | Copen | 3 | Added European 1.3 technical trim, distinct from Japanese 660 cc versions |
| Isuzu | D-Max | 11 | Filled four-cylinder counts for eight existing MY2026 2.2 variants |
| Jaecoo | J7 | 4 | Added Czech SHS-P Exclusive PHEV technical trim |
| Ferrari | 288 GTO | 7 | Filled 496 Nm, 305 km/h and 4.9 s |
| BYD | Atto 3, Dolphin | 20 | Scoped European 150 kW motor summaries/FWD; Dolphin 160 km/h |
| GAZ | GAZ-31105 | 6 | Filled previously null series-production end with 2008 |

Counts include evidence arrays and review maintenance. They are not 51 independently verified specifications. The two new technical trim rows are counted as grouped operations, not individual fields. Full before/after records and source URLs are appended to each make report. Worker notes: `round7-di-depth.md`, `round7-jf-depth.md`, `round7-gb-depth.md`.

## Production years

Audi A3 8V's **2012** start is now closed at calendar-year precision: VW's 2012 annual report explicitly dates production to April2012, while ADAC independently describes manufacture2012–2020. Direct opening of the large annual PDF exceeded the web tool's size limit; its indexed production paragraph was returned. `TURN-6-YEAR-RECHECK.json` preserves the previous disposition in `recheckHistory`; all unrelated entries remain unchanged. No new A3 card mutation was needed.

Audi A4 B8 remains 2007 with exact complete-vehicle SOP unresolved. A contemporary TRUMPF-authored paper establishes early2007 series manufacture of doors, which does not independently establish complete-car SOP. This limitation is recorded rather than closing the question from component evidence. Other open SOP dispositions were not certified in this round.

GAZ-31105 now ends in 2008: the contemporary January2009 NIANN report quotes the GAZ president on December2008 cessation, while Kolesa independently discusses late2008 production and2009 vehicle paperwork. No exact final-build day is claimed. GAZ-3102 remains unresolved.

## Evidence and limits

Copen's selected European trim uses AutoWeek's original road test, Swiss homologation data reproduced by a third party and ANWB indexed catalogue content. The manufacturer brochure returned403; no newly retrieved manufacturer confirmation is claimed. Conflicting length, mass and acceleration remain null. Isuzu's cylinder counts use the May2026 European OEM release plus ADAC.

J7's 105 kW and215 Nm describe the combustion engine, not combined hybrid-system output. Czech manufacturer, Sauto and Cars-Data corroborate the selected fields. Consumption/range discrepancies remain unresolved. Ferrari's official GTO technical PDF was available as indexed text but direct retrieval was blocked; independent auction documentation corroborates the three adopted values. GTO production bounds remain null because endpoint sources conflict.

BYD summaries are explicitly partial European configurations. Dolphin's mass conventions remain unresolved. No photo was changed or newly visually certified. No whole generation, complete engine range, summary or make is certified complete. Ford/Hyundai winning files and shared indexes were not edited.

## Verification

- `node analysis/sweep/codex/validate-turn7.mjs`: PASS exact baseline replay of all51 catalogue mutations, preservation of prior report arrays, at least two source URLs per new operation, strict `CatalogModelCard[]` checks for all six complete card files, and unchanged unrelated prior year dispositions. URL count alone does not prove source independence.
- `node analysis/sweep/codex/validate.mjs`: PASS125 reports and879 cumulative sourced audit operations (828 before round7).
- `node analysis/sweep/codex/finalize-turn7.mjs`: refreshed six structural backlog entries, wrote counts and appended seven DEPTH progress lines. No make marked complete.
- Worker exact replay and strict type checks also passed. No application build or runtime UI test was run. Temporary typecheck files were removed.

An optional bridge progress send failed because the supplied Python executable does not exist in this shell and neither `python` nor `py` resolved. No status message was delivered by that attempt; normal commentary updates were provided. No bridge file was edited directly.

Next fleet-ranked makes after this selected slice: Chery, Barkas, ARO, Cadillac, Bentley, DS Automobiles, Aixam, BAIC, Infiniti and Hummer. Earlier makes still need comprehensive per-generation histories, engine ranges, photos and summaries; production-year questions remain explicit.
