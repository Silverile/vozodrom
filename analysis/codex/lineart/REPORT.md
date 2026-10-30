# Automatic wheel fitting — checkpoint

Experimental candidate; real-photo acceptance is NOT met. `wheels.py` is self-contained apart from NumPy/OpenCV. The shared `scripts/lineart.py` was not edited.

## Integration

```python
from wheels import fit_wheels
wheels = [tuple(round(v) for v in circle) for circle in
          fit_wheels(img, mask, CAR_W, length_mm, wheelbase_mm, tyre_mm)]
ground_y = max(cy + r for _, cy, r in wheels)
```

Preserve each returned centre height and radius. The shared script currently projects both circles onto one ground line after fitting; that changes the detected centres and defeats the perspective fit. The function expects an already cropped/scaled uint8 BGR image, a same-sized mask (or None), front pointing left. It returns float circles sorted left-to-right. Unresolved pairs raise ValueError so callers can retain their existing fallback.

## Method

Hough circles and fitted contour ellipses provide candidates. A concentric rim score anchors centres; visible lower tyre arcs estimate outer radius. The segmentation mask supplies seeds without clipping the search. Physical tyre diameter and wheelbase provide soft priors. Pair search allows different radii and modest vertical displacement. Processing uses a canonical 900-pixel width and maps the result back to input coordinates. No car-specific coordinates or ground-truth labels are read by the fitter.

## Four requested references

**Crop caveat:** the original cached YOLO+BiRefNet masks and original source files were unavailable in this sandbox. Photos were fetched from the linked Commons pages; substitute BiRefNet-general masks use the same morphology, with flip applied before segmentation. The YOLO intersection is missing. In particular GAZ-14 includes tractor pixels, changing its crop. Therefore the following direct comparisons with the supplied 900px labels are diagnostic, not certified acceptance measurements.

| Reference | Front (x,y,r), px | Rear (x,y,r), px | Centre errors / radius, % | Radius errors, % |
|---|---|---|---|---|
| gaz12 | 156.2, 208.8, 56.5 | 686.2, 219.7, 56.3 | 8.3, 4.8 | 2.7, 2.9 |
| gaz13 | 153.9, 220.6, 65.0 | 698.1, 212.6, 50.4 | 5.9, 10.9 | 12.0, 8.4 |
| gaz14 | 181.7, 194.0, 57.9 | 710.7, 180.0, 51.0 | 20.0, 23.6 | 5.1, 2.0 |
| gaz21 | 138.7, 256.2, 59.4 | 653.6, 258.6, 68.5 | 9.9, 5.6 | 5.7, 5.3 |

None of the four direct comparisons meets both 4% centre and 8% radius tolerances. Re-run against the original masks before interpreting the remaining displacement as fitting error. Ropes, trim rings, shadows and partial wheel occlusion remain real failures.

## Additional Commons photos

Six additional era/body-style examples were tried, plus a strongly oblique van stress case. These have no independent wheel annotations, so returned coordinates and visual observations are not accuracy percentages.

| Example | Observation |
|---|---|
| Volkswagen Golf hatchback | Both wheels found; circles tend to fit the rim rather than full tyre. |
| Land Rover Defender SUV | Both wheel regions found and perspective sizes retained; radius/centre accuracy not certified. |
| Volkswagen T2 van, side view | Both wheels found with plausible circles; people partly occlude the body. |
| Delahaye 135 CS, 1930s roadster | Both wheel regions found; visible radius/centre errors, grass occlusion. |
| BMW F35 modern sedan | Rear wheel region found; front circle displaced. |
| Porsche 911 Targa coupé | Both wheel regions found; requires tighter centre/radius validation. |
| VW Transporter, oblique stress view | No plausible pair; raises ValueError rather than returning guessed circles. |

The 1000px run is recorded separately in results-1000-final.json (the first ten cases). Resizing still changes candidate selection on difficult cases, especially the roadster; canonical processing does not make the method scale invariant.

## Verification and reproduction

```text
py -P analysis/codex/lineart/evaluate.py --output results.json
py -P analysis/codex/lineart/evaluate.py --baseline --output results-baseline.json
py -P analysis/codex/lineart/evaluate.py --width 1000 --output results-1000.json
py -P analysis/codex/lineart/test_synthetic.py
```

Three deterministic geometry tests (plain, unequal radii/heights, missing tyre mask plus rope/shadow) pass the requested geometric tolerances. Synthetic success does not establish real-photo success. The evaluation normalizes every numeric result to 900px and never passes labels into the fitter.

Actual local runtime: FreeCAD bundled Python 3.11 with workspace-local OpenCV 4.10 and ONNX Runtime 1.20.1. The stated `py -P` and Python313 paths were inaccessible. Temporary dependency/model downloads were used only for the experiment. Automatic approval review rejected recursive cleanup with blocked by policy; deps/ remains in place; the peer runtime already has NumPy/OpenCV.

## Next work

Obtain the original four cached masks, freeze exact crops, and annotate the six extra crops independently. Improve centre anchoring against partially occluded rims and add a fit-quality rejection score. The current result is a reviewable baseline, not a completed automatic replacement.

Source/author/licence evidence is in commons/sources.json, extras-sources.json and van-sources.json; CREDIT.md lists retained photos. Photo overlays remain derivatives under their respective source licences.
