Six selected facelift JD configurations, sourced from Kia's 31 August 2015 European technical appendices. Patch targets: ceed generation3 hatchback (3 rows), generation4 SW (1), generation5 pro_cee’d (2). Append rows only after matching expectedGenerationName. Root should merge needsReview using the resulting generation/trim indices.

Every row has sourced mass, acceleration and combined consumption; four have complete dimensions. The two pro_cee’d lengths remain null because the source contradicts its own wheelbase/overhang dimensions. Conflicting torque statements remain null. Cycle is recorded as combined with the protocol unspecified, rather than assuming NEDC. This is a small selection, not all JD versions or confirmed Czech fitment.

Rebuild: `node analysis/codex/kia-versions-66/build.mjs`; validate: `node analysis/codex/kia-versions-66/validate.mjs`. No Kia product card is edited by these scripts.

Merged by apply.mjs. Rebuild after make pipelines, before integrate-night-cards.mjs and merge-photo-patches-66.mjs. Unknown powerStandard is null in merged rows; the original publication note is retained in specificationScope.
