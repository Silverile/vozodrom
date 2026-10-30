# Bridge delivery 42 checkpoint

Updated: 2026-10-27T00:52:51.897Z. Counts cover night-shift cards only; protected Skoda and Claude-owned card files are excluded. Saved does not mean a complete production history.

| Measure | Before | After |
| --- | ---: | ---: |
| makes | 33 | 40 |
| lines | 480 | 667 |
| generations | 675 | 909 |
| versions | 144 | 243 |
| photos | 2 | 114 |

## Newly saved makes

| Make | Lines | Generation/family records | Selected versions | Photos |
| --- | ---: | ---: | ---: | ---: |
| bmw | 59 | 73 | 31 | 7 |
| borgward | 15 | 16 | 10 | 2 |
| brabus | 17 | 32 | 32 | 1 |
| brilliance | 12 | 17 | 1 | 1 |
| bristol-cars | 21 | 24 | 8 | 3 |
| bugatti-automobiles | 20 | 20 | 15 | 1 |
| buick | 43 | 52 | 2 | 2 |

## Photo selection

| Make | Selected photos / records |
| --- | ---: |
| abarth | 3 / 22 |
| ac-cars | 1 / 21 |
| aiways | 1 / 2 |
| alfa-romeo | 24 / 47 |
| alpine | 9 / 10 |
| amc | 1 / 23 |
| aston-martin | 4 / 49 |
| audi | 19 / 72 |
| bmw | 7 / 73 |
| borgward | 2 / 16 |
| brabus | 1 / 32 |
| brilliance | 1 / 17 |
| bristol-cars | 3 / 24 |
| bugatti-automobiles | 1 / 20 |
| buick | 2 / 52 |
| ford | 13 / 33 |
| hyundai | 1 / 6 |
| toyota | 3 / 24 |
| volkswagen | 18 / 18 |

795 records still lack a selected image. This is incomplete selection, not evidence that Commons lacks suitable images. Metadata, inspected candidates, exact targets and patch batches: photo-backfill-42, photo-audi-42 and photo-root-42. Reapply bmw-versions-42/apply.mjs after rebuilding BMW, then merge-photo-patches-42.mjs after rebuilding older make files. Temporary downloaded images and source-document binaries are removed after use.

## Remaining work / Help wanted

- Continue A-Z from **byd**; 176 makes remain on this queue. No makes are declared impossible to source.
- Complete generation boundaries and variants for the saved partial catalogues; per-make night-*-report.json distinguishes family records, evidenced generations and exclusions.
- BMW selected versions are supported by manufacturer technical sheets, but the complete used-market engine/gearbox catalogue remains unfinished. See bmw-versions-42/report.json for exact conflicts, metric-performance gaps and sheet-date scope.
- Prioritise photos for the large remaining null population, including the new makes. Most earlier A-Z makes have not received a full photo search.
- Original technical brochures or museum data for obscure historic models would help; exact model/field gaps are in each make report. No inferred acceleration, power conversions, production years or unlabelled mass values.

## Integration and execution

The runtime permits root plus three concurrent workers, so six workers could not run simultaneously. Workers handled BMW/cards and Audi photos, successive B makes, and dedicated photo backfill; root merged and added the historic VW photos. No commits, publishing or app-index regeneration. Claude should review and run scripts/model-cards-index.mjs using both card folders. Preserve all model-line-additions on future rebuilds.
