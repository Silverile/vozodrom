# Kia Soul II / PS: four selected European2014 versions

Primary source: https://press.kia.com/content/kiapress/eu/en/home/models/soul/soul-2014.html — Kia Motors Europe,17March2014, technical specification explicitly labelled EUROPE.

Patch target: `soul`, generationIndex1, expectedGenerationName `PS`, operation `append-trims`. It adds petrol1.6GDI97kW and diesel1.6CRDi94kW, each with6MT/6AT. Directly published kW/Nm/km/h and0–100 only. No US data or imperial conversions.

Mass uses the published minimum with the full kerb-weight configuration range and qualified basis. No particular trim/wheels/driver loading convention is invented. Combined consumption is provided for the two automatic rows only; the two manuals retain null because the document gives unresolved ranges. It calls the cycle combined/based onEuro5, not explicitly NEDC. Power measurement standard stays null. Height stays null because the source has1593–1618mm dependent on wheels/roof bars and a1600mm narrative; no exact equipment combination was established. The other three dimensions are documented for all four rows. Actual version production dates remain null;2014 is recorded as modelYear.

Rebuild offline:
1. `node analysis/codex/kia-versions-68/build.mjs`
2. `node analysis/codex/kia-versions-68/validate.mjs`

The validator records its result in `evidence.json`; no extra output file is created. Parent merges and reindexes reviews. Neither this script nor this worker changes the Kia card. MY2016/2017 and full trim-market coverage remain future work.
