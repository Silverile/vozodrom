# Checkpoint 82 ? Panhard, Perodua, Peugeot

Saved partial catalogues, not full make or technical coverage. Three researchers plus root photo worker, then bounded Panhard/Peugeot photo passes.

| Make | Lines | Records | Versions | Photos |
| --- | ---: | ---: | ---: | ---: |
| Panhard | 9 | 9 | 16 | 3 |
| Perodua | 15 | 19 | 23 | 0 |
| Peugeot | 52 | 62 | 34 | 3 |

Opel: 10 photo-only additions (17?27/98); Meriva A still null after strict-margin rejection. Original Opel technical data unchanged. Photos/batches and exact custom Zafira B attribution grant are in photo-backfill-82. Reapply merge-photo-patches-82.mjs after aggregate rebuild.

Cumulative: 161 saved makes, 3533 lines/cards, 4900 generation/family records, 1482 selected technical rows, 1297 photos. 44 new model-line identities registered this checkpoint; 926 original line objects and protected Skoda/Claude files preserved. 30 Claude-owned makes skipped; 25 absent makes remain.

Help wanted: Peugeot has only selected dated versions and 3/62 photos; full 3008 I/II, all 5008 and older 206/207/306/307/308 I/405/406/407 matrices need brochures. Porsche, Renault and Seat are still high-priority forthcoming makes and need full sourced engine/power/gearbox/year tables, metrics where sourced, and every-generation photo. Perodua has 0/19 photos, no inferred production-start bounds, and historic versions missing. Panhard has 6/9 photos missing, pre-1930 chassis range and 6DS/8DS absent; questionable museum scalars excluded. Opel Meriva A and other 71 records lack photos; Mercedes, Nissan, Fiat and Mazda also remain partial.

Corrections: Peugeot snapshot years removed from trim production bounds; unlabelled RCZ consumption nulled; no undeclared enginePowerScope properties. Independent peer review sampled 308/3008 OEM technical sources.

Rebuild Panhard: night-panhard-build.mjs ? night-panhard-photo-apply.mjs ? night-panhard-validate.mjs. Photo evidence is night-panhard-photo-audit.json (NOT a *-report.json: report glob treats those as makes). Rebuild Peugeot: night-peugeot-build.mjs preserves keyed photos; night-peugeot-photos/apply.mjs deterministically restores them. Root integration and full structural/strict validation passed. No app index/build, commit or publish performed.

NEXT: plymouth. Continue polestar, pontiac, porsche, proton, ram, renault?; finish Peugeot priority follow-up alongside the queue.
