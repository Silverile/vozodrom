# Turn 8 — selected depth and photo identity metadata

Three parallel reviewers and root reviewed selected data for **Chery, Barkas, ARO, Cadillac and Bentley**. Four card files changed, with **42 appended audit operations across six model lines**. Barkas received report-only findings. All125 a–l makes remain depth-incomplete; this round does not fulfil the full each-model depth backlog.

| Make | Selected work | Card audit operations |
| --- | --- | ---: |
| Chery | A1 regional engine specifications, one scoped South African J1 technical sample |10|
| Barkas | B1000/1000-1 chronology and body-specific specification conflicts, no justified card mutation |0|
| ARO | One1971 M461C technical sample, seven corroborated technical scalars |4|
| Cadillac | XLR European technical sample, STS/SLS China scope, Series61 photo uncertainty |17|
| Bentley | Bentayga original W12 five specification fields and2020 facelift event |11|

Counts include whole trim objects, source arrays and review maintenance;42 operations is not42 independently verified specifications. Three selected technical trim rows were added. Full before/after evidence is appended to per-make reports; worker/root notes are round8-chery.md, round8-barkas-aro.md, round8-cadillac.md and round8-bentley.md.

## Main corrections and unresolved conflicts

Chery A1 export specifications differ by region:61kW/114Nm and62kW/122Nm remain separate. South African manufacturer mass1404kg conflicts with international1040kg MT and another1070kg listing; no inferred typo fix. A1 production endpoints still lack reconciled independent sources. The newly added South African trim does not establish European or Czech availability.

ARO M461C gains2512cc petrol/four-cylinder, manual four-speed, selectable4x4 and100km/h sample facts. Output and mass remain null where methodology or published values disagree. Barkas two-stroke endpoint1989/1990 and V901/2 badge timing remain unresolved; fire-engine body data was not applied to a passenger van.

Cadillac XLR gets a scoped European sample; torque, mass and some dimensions remain null. The suspected STS2013 endpoint mistake was **rejected** after full context: the card explicitly includes Chinese SLS. The actual corrected gap was missing China market scope; combined-family2013 endpoint retained, not independently recertified. Series61 photo was withdrawn conservatively due to conflicting source caption/structured identification versus filename/category, not a conclusively proven wrong model.

Bentayga W12 gains5950cc, eight-speed automatic,1998mm width and4.1s0–100. Facelift production2020 is corroborated, rather than inferred from unveiling. Original/facelift/EWB remains an aggregate family; OEM's second-generation label is an explicit unresolved grouping question. Length5141/5140mm, wheelbase2992/2995mm and mass methods remain unresolved.

## Photos

**16 metadata attempts:11 retrieved, five failed.** These include two candidate photos for already-null Barkas/ARO slots; neither establishes the required subgeneration and neither was installed. Nine existing-image file descriptions/categories/credits were retrieved across Chery, Cadillac and Bentley. One Cadillac image was nulled because identity provenance conflicts; eight were retained in their existing family/generation scope. Five additional Bentley file-page retrievals failed and remain unverified.

No fresh visual inspection or certification was performed. Existing historical visual-review fields on retained images were preserved, not recertified. Bentley thumbnail/original retrieval failed too. Commons URL count does not establish source independence: the Series61 withdrawal uses two same-provenance Commons URLs and represents uncertainty management.

## Verification

- `node analysis/sweep/codex/validate-turn8.mjs`: exact replay of all42 card operations, old report-array prefix preservation, at least two URLs per new operation, and strict CatalogModelCard types for all five complete files. Two URLs are an evidence-presence check, not proof of independence.
- `node analysis/sweep/codex/validate.mjs`:125 reports and921 cumulative sourced audit operations match final card fields, up from879.
- `node analysis/sweep/codex/finalize-turn8.mjs`: updates five structural backlog entries, writes TURN-8-COUNTS.json, appends five DEPTH progress lines. No make marked complete.

Initial checks caught two invalid Cadillac fuel enum strings and a missing Bentley facelift year; these were corrected before passing final checks. New ARO prose encoding was repaired and replay rechecked. No application build/runtime UI test run. No Git writes; shared files, Ford/Hyundai winning copies and tsconfig.tsbuildinfo untouched by Codex.

Next fleet-ranked makes: DS Automobiles, Aixam, BAIC, Infiniti, Hummer, Leapmotor and Dongfeng. Earlier makes still need full generation histories, European engine ranges, summaries and actual visual checks; selected improvements here do not certify whole models or makes.
