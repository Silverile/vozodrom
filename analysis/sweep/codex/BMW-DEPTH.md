# BMW DEPTH, 2026-10-29

Partial targeted pass: 3 Series E90 launch sedan technical stage (generations[8]), eight technical versions. Inventoried 59 BMW lines and 73 generation/stage entries; briefly inspected 1/3/5 Series, X3 and X5 structure. This is not make-wide verification.

Applied 11 factual null fills: E90 sedan width 1817 mm at generation level and all eight trims; 320i 6MT acceleration 9.0 s; 330i 6MT acceleration 6.3 s. BMW global launch release and independent ADAC technical data agree. These metric acceleration values were sourced directly, not converted from UK 0-62 mph.

Applied 19 metadata edits: source arrays, scope notes and narrowly resolved review flags. Every edit, including metadata, is logged in bmw.json cardFixesApplied. Existing 20 card fixes and all other report content preserved structurally.

The earlier UK overview width 1871 mm conflicts with its 1817 mm technical table. BMW global launch release gives 1817 mm and independent ADAC sedan table corroborates it, so the former unresolved conflict can be narrowed. Existing photo and review status were not changed.

Sources: [BMW global launch release](https://www.press.bmwgroup.com/asia/article/detail/T0048254EN/the-new-bmw-3-series); [ADAC E90 used-car technical PDF](https://assets.adac.de/Autodatenbank/GWInfo/gw0079-bmw-3er-reihe-2005-2013-benziner-bericht.pdf). BMW article opened directly; ADAC opened but PDF text extraction loses digits, so indexed technical-table excerpts supplied numerical corroboration. A screenshot request produced no usable displayed image. UK original attachment uses unsupported application/msword format in web tool.

Remaining: all generation boundaries/codes, facelifts, statuses and photos need systematic two-source coverage. F30 family has body/market-vs-production end-year scope conflicts (BMW historical overview 2019; plant sedan production ends 2018; ADAC wider F30/F31/F34 family reaches 2020); no blind generation-date changes made. 325i ADAC overview table refers to a later 2996 cc motor, unlike launch 2497 cc trim, so its performance was not transferred. Hybrid engine output fields already explicitly distinguish combustion from system output; those were preserved. No claim that the other seven E90 metric performance gaps or remaining BMW engine ranges were verified.

Validation: Node JSON parse and full logged-edit replay against pre-edit card baseline passed; report prior-entry preservation assertions passed; 11 factual fills each cite BMW and independent ADAC. No commits, Git writes, or other file edits.
