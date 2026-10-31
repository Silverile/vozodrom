# Structure pass 2

50 candidates resolved: **39 changed**, 11 identified parallel/announced families retained. **3 generations added, 13 pseudo-generations removed, 2 stages added. No engine rows added; one W461 engine row moved out of W460.** All fact URLs and before/after lists are in report.json.

BMW 1: old generic family becomes E81/E82/E87/E88 (2004-2013); insert F20/F21 (2011-2019), F40 (2019-2024), retain F70 (2024-). Old indexes 0->0, 1->3. Cruze: old family corrected to J300 (2008-2016), J300 technical sheets merged 1/2->0, J400 (2016-2019 main production) added at 1. Later Argentine production is noted. Generic family drawings for these two lines are unindexed and retained on disk because their depicted generation is unattributed. No other drawing file moves were needed; dates/holds follow each oldToNew map.

Other merges: Defender L663 90/110/130; Range Rover wheelbases within L405/L460; Kia K4 bodies; Optima JF Sportswagon; Nubira J100/J150 modernization; Seal U EV/PHEV; JS50 technical/new-look shell; Lynk 01 European MY25. Distinct dated W463 families and concurrently produced EV/ICE or regional lines stay separate.

Spring II is announced 2026, based on Dacia’s dated September 2026 release describing a separate platform; production is not asserted. Q7 G8 is likewise marked announced. Main-body and successor-derived period notes are exposed through dateBasis/dateNote; successor-boundary entries are explicitly estimates.

## Listing IDs: application handoff required

Use report.json **listingMigration** for authoritative IDs removed from the actual model-line index, and listingIdChanges for per-card index mappings. Existing canonical catalogue codes are preserved. Card-only old family IDs for BMW 1/Cruze were not offered by the old listing index, so they need no stored-ID migration. Unknown ?–? placeholders were excluded by the dated-generation selector. Actual removed date IDs are explicitly flagged requiresStoredListingMigration.

- barkas/b1000: removed 1961–?; now 1961–1990, 1990–1991.
- byd/seal-u: removed ?–?; now 2020–?.
- chrysler/pacifica: removed ?–?; now 2003–2007, 2016–?.
- dacia/spring: removed ?–?; now 2020–?, 2026–?.
- dodge/caravan: removed 2000–?; now 1983–1990, 1990–1995, 1995–2000, 2000–2007, 2007–2020.
- kia/k4: removed ?–?; now 2024–?.
- land-rover/range-rover: removed 1969–1996; now 1970–1996, P38A, L322, L405, L460.
- ligier/js50: removed ?–?; now 2013–?.
- lynk-co/01: removed ?–?; now 2017–?.

## Statistics and continuation

Raw statistics are intentionally rebuilt once at the end of the structure pass. For the 39 changed lines, stale generation aggregates are empty in stats and listing-stats; all line/make totals and unrelated entries are unchanged. This prevents showing a population on the wrong new/merged generation. The deterministic matcher fix prefers dated bounds containing the year, then latest start and stable slug; undated aliases are fallback. Six hash seeds and synthetic ranking cases pass.

4,609 untouched source cards and their public cards are unchanged against 52685b1. See validation.json. Overall audit: 6722 generations, 2034 with engines. 129 unprocessed structural candidates remain in next-queue.json. Continue these before engine pass/wave 2.
