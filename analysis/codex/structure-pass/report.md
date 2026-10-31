# Structure pass 1

50 fleet-ordered candidates inspected; source pages fetched for 47. **8 lines changed**, 42 retained for explicit follow-up/scope review. No claim that these 50 lines are now complete. Details and reasons: batch-1.json; fetched production rows: source-triage.json.

BMW 3: 11 -> 7 generations. Mapping: 0->0, 1->1, 2->2, 3->3, 4->4, 5->5, 6->6, 7->6, 8->5, 9->4, 10->3. The first seven are unchanged in position; four undated exact-code technical sheets merge into E46/E90/F30/G20. Trims, equipment, engines and sources are unioned; conflicting scoped metadata and photos survive in specificationReferences. All three BMW drawings stay at 1/3/5; no holds existed for the removed shells. Existing listing codes stay.

86 documented engine rows added across E30-G20 (unknown displacement remains absent); E21 engines retained. Hybrid 320e/330e rows explicitly marked PHEV. No new facelifts.

13 source-backed date edits:

| Line | Index | From | To | Source |
|---|---:|---:|---:|---|
| bmw/rada-3 | 5 | 2011 | 2020 | [article](https://en.wikipedia.org/wiki/BMW_3_Series_(F30)) |
| mercedes-benz/trida-e | 4 | 2009 | 2017 | [article](https://en.wikipedia.org/wiki/Mercedes-Benz_E-Class_(C207)) |
| mercedes-benz/trida-e | 6 | 2016 | 2023 | [article](https://en.wikipedia.org/wiki/Mercedes-Benz_E-Class_(C238)) |
| audi/q5 | 1 | 2016 | 2025 | [article](https://en.wikipedia.org/wiki/Audi_Q5) |
| audi/q5 | 2 | 2024 | open | [article](https://en.wikipedia.org/wiki/Audi_Q5) |
| audi/a8 | 2 | 2009 | 2017 | [article](https://en.wikipedia.org/wiki/Audi_A8) |
| mercedes-benz/cls | 0 | 2003 | 2010 | [article](https://en.wikipedia.org/wiki/Mercedes-Benz_CLS-Class_(C219)) |
| mercedes-benz/cls | 1 | 2011 | 2017 | [article](https://en.wikipedia.org/wiki/Mercedes-Benz_CLS-Class_(C218)) |
| mercedes-benz/sl | 5 | 2022 | open | [article](https://en.wikipedia.org/wiki/Mercedes-Benz_SL-Class_(R232)) |
| alfa-romeo/giulietta | 0 | 1954 | 1965 | [article](https://en.wikipedia.org/wiki/Alfa_Romeo_Giulietta_(1954)) |
| alfa-romeo/giulietta | 1 | 1977 | 1985 | [article](https://en.wikipedia.org/wiki/Alfa_Romeo_Giulietta_(1977)) |
| hyundai/sonata | 1 | 2014 | 2023 | [article](https://en.wikipedia.org/wiki/Hyundai_Sonata) |
| hyundai/sonata | 7 | 1985 | 1988 | [article](https://en.wikipedia.org/wiki/Hyundai_Sonata) |

Statistics recomputed from the complete raw register and all 1,094 inspection days for the five affected makes. Existing make/line population and inspection totals verified unchanged before copying staged results. Generation aggregates rebuilt, not summed or just rekeyed. The minimum published group remains 30. See statistics-rebuild.json for every changed/appearing/disappearing entry and BMW counts. Listing statistics regenerated.

Validator: `node analysis/codex/structure-pass.mjs --validate` proves all 4,640 untouched source cards and generated public cards unchanged against 4a6100b, exact sourced transforms for eight cards, preservation of merged trims/equipment/sources, drawing identity and valid rebuilt statistics keys. Engine-only session validators are historical during this structural phase; use the new validator until the engine baseline is explicitly reset.

Remaining work: 42 selected candidates need identity/body/market-specific evidence; preserve concurrent regional models, body derivatives and separate electric families. Do not close their production at successor launch. BMW overlap years still use the existing year/type matcher, so aggregates are estimates of generations, not VIN-certified chassis identification.

Exception: two unrelated historic Mercedes line aggregates (Mannheim and 380/500K/540K) retain their baseline values. The matcher resolves their shared undated 380 alias differently under different Python hash seeds (verified seeds 0 and 8). Current raw rebuild values are recorded in statistics-rebuild.json; repair the ambiguity and recompute separately. All eight changed catalogue lines use the completed raw rebuild.

Six front-drawing index rows now carry the corrected generation date ranges; drawing image bytes and generation positions are unchanged.
