# Ford DEPTH, 2026-10-29

Partial pass only. Winning file: src/data/model-cards/ford.json (Claude owned; untouched).

Inventory read: 32 model lines, 103 generations. Targeted source review: B-Max B232 engine range and selected trim fields; Puma crossover Gen-E launch specifications. The other 30 lines and the Puma coupe were inventoried, not source-verified in this pass.

Appended 15 proposals to ford.json modelFixes, preserving all four prior proposals and all other report fields: six B-Max proposals, nine Puma proposals. Zero card edits.

B-Max: increase EcoBoost upper range from 88 to 103 kW; fill three missing 1.6 TDCi power fields with 70 kW; correct aggregated 1.0/1.5 displacement from 999/1498 to 998/1499 cc. ADAC and independent manufacturer parts application catalogues corroborate these. Stark and Motorservice evidence is search-indexed text only; the former full PDF returned cache miss, the latter exceeded fetch size limit. Dipa application-sheet indexed text was inspected; full-document download was not performed.

Puma Gen-E: preserve Ford exact 123.5 kW in three power fields and explain ADAC rounded 124 kW. The exact figure is repeated by two Ford publications; ADAC is independent corroboration at integer precision. Four dimensions agree between Ford launch factsheet and ADAC. Add rangeCycle WLTP and scope existing 376 km range to the launch variant. The 2026 ADAC entry has a different range, so that range was not transferred onto the launch trim.

Photo checked: B-Max Commons description/category identifies B-Max Titanium, dated 2014; M 93 and CC BY-SA 3.0 Germany match the card. No image pixels inspected; visualReview remains pending. Puma photo was not reviewed.

Open checks: every generation boundary, facelift and production status still needs two-source review; no claim of make-wide completion. B-Max 92/103 kW trims and LPG variant remain absent; do not mark engine or trim coverage complete. Resolve B-Max torque discrepancies by market/model year before filling. Ford kerb masses include a 75 kg driver; existing B-Max/Puma trim masses often differ by exactly 75 kg and lack massBasis, so no numerical mass replacement was proposed. Reconcile physical-mass convention first. Puma launch year trim from=2024 remains a separate unresolved application item; earlier report already proposes correcting the summary chronology to deliveries/production in 2025.

## Sources inspected

- [ADAC B-Max technical/history PDF](https://assets.adac.de/Autodatenbank/GWInfo/gw0315-ford-b-max-2012-2017-bericht.pdf)
- [Motorservice manufacturer application catalogue](https://www.ms-motorservice.com/MediaAssets/2486694_pg_50003569_web.pdf) - indexed excerpt only
- [Stark manufacturer application catalogue](https://www.stark-automotive.com/frontend/images/categories/pdf/en/259685.pdf) - indexed excerpt only
- [Dipa Sport application sheet](https://www.sbricambi.it/ProductsResources/8694/ABS-ABS246R_it_sch.pdf?1751743470=) - indexed excerpt only
- [Ford 2025 Gen-E launch factsheet](https://www.fromtheroad.ford.com/content/dam/fordmediasite/eur/en/library/2025/tech-specs/2025%20Go%20Electric%20Puma%20Gen-E%20factsheet%20ENG.pdf) - opened PDF and inspected dimensions, performance and weight footnote
- [Ford Ireland Gen-E price/specification list](https://www.ford.ie/content/dam/guxeu/ie/Documents/Pricelists/Cars/PL-ford_puma_gen-e.pdf) - indexed table
- [Ford Slovenia Gen-E specifications](https://ford.sml.si/media/ford/pricelists/P-2ZE1-2025-2.0.pdf) - indexed table
- [ADAC Gen-E February 2026 entry](https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/ford/puma/ii-facelift/349399/) - opened table
- [B-Max Commons file](https://commons.wikimedia.org/wiki/File:Ford_B-Max_Titanium_%E2%80%93_Frontansicht,_22._Februar_2014,_Ratingen.jpg) - description, category and licence inspected

Validation: Node JSON parse; all 15 proposed from values match winning card baseline (absent rangeCycle treated as null); all have at least two source URLs; prior four modelFixes preserved by deep equality during append. Python was unavailable both via PATH and the supplied absolute path, so Node was used. No commits or Git mutations.
