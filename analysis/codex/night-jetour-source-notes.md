# Jetour initial pass — 2026-10-27

8 sourced production families and15 scoped records: X70/X70Plus, X90, X95, Dashing, T1, T2, X70L and explicitly labelled ZonghengG700. PHEV branches are kept separate from petrol; introduction dates are not substituted for unknown actual production starts. Newly launched derivatives and every trim/facelift are not exhaustively covered.

The three selected T2 rows come from the manufacturer's [global specification](https://cms.jetourglobal.com/T2/specificationt2en/):1.5TD7DCT,2.0TD7DCTComfort,2.0TD7DCTLux. They are explicitly global/export specifications, **not Czech homologation**. Length includes the spare-wheel cover. The exact meaning and kerb/dry/driver/fuel convention of the weight row were not independently confirmed; massKg and massBasis therefore remain null, with scope/review notes. Differing South African outputs are not merged into these rows. No unverified0–100 or consumption was added.

The global model page and individual model histories support family identity; the evidence snapshots preserve source URLs. G700 is identified as JetourZongheng, without treating all Chery holding-company brands as Jetour. Most PHEV detail and photos still require follow-up.

## Offline rebuild

Use the exact eight-command order recorded in `night-kia-source-notes.md` under **Offline rebuild order**. In particular, `night-jetour-build.mjs` creates the initial six families; `night-kia-refine.mjs` then adds X70L and G700 to Jetour while refining Kia. The shared retained photo finalizer applies batches001–003 to both makes only after all card builders and scope corrections. No API/download, sheet or photo-selection script is required. Final validators can be run independently without rebuilding the cards. The final combined rebuild sequence was documented after freeze and was not rerun as a single verification.
