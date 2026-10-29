# Hyundai depth pass — 2026-10-29

Partial pass. Inventoried all 28 winning cards (70 generations, 380 trim entries) in `src/data/model-cards/hyundai.json`; this inventory is not external verification. No winning card files edited: Claude owns that path. Existing breadth findings remain in `hyundai.json`.

## Results

- Appended one proposal to `modelFixes`: IONIQ 9 Long Range AWD `generations[0].trims[1].engine.powerKw`, null → 226. [Czech Hyundai technical sheet](https://autocentrhudec.hyundai.cz/files/download/model/ioniq-9/ioniq-9-td.pdf) and the [ADAC generation table](https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/hyundai/ioniq-9/1generation/) agree. Apply only to this European AWD trim, not the Performance trim.
- Two new conflicts preserve nulls: IONIQ 9 Performance output and INSTER trim mass. Manufacturer European market PDFs give Performance 314 kW, ADAC gives 315 kW, generic Hyundai Europe gives 304.6 kW. The last page also misstates IONIQ 9 width as 1790 mm; card's existing 1980 mm is supported by manufacturer launch/market sheets. Do not propagate webpage errors into the card. See the exact source URLs in the appended report conflict.
- INSTER: manufacturer Europe technical page and [ADAC test's manufacturer-data table](https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/hyundai/hyundai-inster/) agree on torque 147 Nm, FWD, 0–100 11.7/10.6 seconds and maximum speed 140/150 km/h. Existing card values retained. Output 71.1/84.5 kW is rounded to 71/85 by ADAC; not an error. Existing mass nulls retained because manufacturer ranges and ADAC EU masses have different scope/definitions.
- i20 BC4: [Hyundai corporate Q3/YTD 2026 release](https://org.hyundai.com/worldwide/en/newsroom/detail/0000001299) confirms Brazilian i20 production at Piracicaba and sales beginning July 2026. Retain 2026/current Brazil entry. This resolves only the production-existence part of the earlier open question; code, debut day, engines and dimensions still require primary technical corroboration. Do not read this as verification of every i20 generation.
- IONIQ 9 photo: [Commons file page](https://commons.wikimedia.org/wiki/File:Hyundai_Ioniq_9,_Haarlemmermeer_(20250802-LRM_20250802_210751).jpg) description, structured depicts and category all identify Hyundai Ioniq 9; author Matti Blume and chosen CC BY-SA 4.0 licence agree with card. Metadata review only; pixels not visually inspected, so `visualReview` remains pending. INSTER Commons page fetch failed (cache miss); no licence/photo approval claimed.

## Coverage and remaining work

Technical cross-checks cover INSTER AX1's two trim performance/torque/drive values and IONIQ 9 ME's three trim output conflicts; these do not verify all generation dates, facelifts or engine ranges. i20 BC4 production existence checked against manufacturer corporate reporting. No full make depth completion claimed.

Remaining: complete two-source generation/date/facelift/status reconciliation for all 70 generations; all combustion and hybrid trim families; exact variant mass conventions; full Commons photo review; summaries beyond these limited checks; Elantra CN8 SOP; Tucson NX5 previously logged concerns. The 28-card inventory also contains ended generations with null `to` (Galloper, Sonata LF/Y, Terracan), which remain leads rather than verified corrections.

Validation: PowerShell `ConvertFrom-Json` parses the amended report; 2 modelFixes total (1 existing + 1 new), 4 conflicts total (2 existing + 2 new). Two Python invocation attempts failed because executables were unavailable; all local inspection and validation used PowerShell. No application build was warranted for report-only edits.
