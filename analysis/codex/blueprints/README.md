# Local-only blueprint training-data tools

Scripts only belong here. All source images, crops, paired tensors, previews,
indexes and reports belong outside the repository, at:

`C:\Workspace\Projects\CF\vozodrom-data\blueprints`

Both entry points reject dataset paths inside the repository, including paths
whose existing ancestor resolves through a junction into the repository. There
is no fallback directory. No source image is displayed by these tools.

## Run from a terminal that can write the external directory

```powershell
node analysis/codex/blueprints/crawl.mjs --audit-only
node analysis/codex/blueprints/crawl.mjs --limit 1000 --max-minutes 18
py -P analysis/codex/blueprints/build.py --max-minutes 18
```

Repeat the crawl/build commands for subsequent checkpoints. The target is a
total count, not an additional count. Each process exits at its checkpoint;
nothing is left running in the background. Do not run concurrent crawlers.

Dependencies: Node with built-in fetch, and Python with NumPy/OpenCV. No GPU,
torch, model downloads or training are used by this pipeline.

The Codex sandbox used to develop this scaffold cannot create the external
directory. Its allowed writable workspace is only `vozodrom`, and the provided
Python313 executable is inaccessible. Tests used the readable FreeCAD Python
runtime and the already-present local OpenCV dependency directory from the prior
wheel experiment. This does not change the commands for the normal environment.

## Acquisition

- Exact requested User-Agent; starts separated by at least 1,100 ms, including
  redirects and image requests. No parallel HTTP requests or automatic retries.
- Live robots audit and public footer/registration/linked-terms check before
  every run; reservation detection on every response. Refusal, timeout, TDM/AI
  reservation or a policy requiring review stops the run.
- Only same-origin full blueprint image paths are downloaded. Gallery headers,
  avatars, thumbnails and forum images are not selected.
- Non-passenger categories/titles are excluded. Ambiguous truck-heavy GAZ/UAZ
  titles use a passenger-model allowlist. Classification is conservative and
  still needs dataset review.
- Exclusive crawl lock, atomic files/state, SHA-256 deduplication, indexed-file
  verification, orphan-sidecar recovery and partial-last-index-line recovery.
  An invalid middle index line stops for inspection. A stale lock is never
  removed automatically: inspect its recorded PID first; never kill by name.
- `raw/` contains originals and metadata sidecars. `index.jsonl` records image
  URL, source page, make/model/title, byte size, hash and local-only usage.

The last live audit found `Allow: *`, no explicit training/TDM reservation on the
checked public pages/headers, and no additional terms links in the footer or
registration page. The familiarization-only footer wording is recorded as a
limitation. This is a scoped access check, not a legal determination or proof
that no reservation exists elsewhere. A newly detected reservation stops work.

## Extraction and orientation

The CPU extractor thresholds near-black strokes, proposes coherent wide views,
requires two lower wheel circles with angular edge support, and fills a closed
outer contour. Ambiguous/unclosed views are rejected. Dimensions outside the
silhouette are masked away. Pale watermarks are not adaptively enhanced.

The default does **not** silently guess the front. Unresolved orientation is
logged in `processing-log.jsonl` and excluded from pairs. Even a shape-heuristic
candidate is review-only by default. Provide a JSON map keyed by full raw SHA-256
or image URL, with values `front_left` or `front_right`:

```powershell
py -P analysis/codex/blueprints/build.py --orientations C:/path/to/orientations.json
```

`--accept-inferred-orientation` is an explicit experimental option; it accepts
only resolved heuristic candidates and records their provenance. It has not been
calibrated on real blueprints. It should not be confused with reviewed labels.

Accepted targets are white strokes on black, 512×256; the silhouette is 480 px
wide and the tyre contact line is y=220. Tall vehicles that cannot fit at that
width are rejected. Input PNG semantics in RGB order are silhouette, wheels,
outer contour. OpenCV's BGR saving order is explicitly converted.

`pairs.jsonl`, `train.jsonl`, `val.jsonl` and `splits.json` hold the make-based
split. Exact raw/target duplicates are excluded. With fewer than two accepted
makes, there is no validation split. Adding makes can change the deterministic
make allocation; freeze the manifests before training a reproducible run.

`preview.jpg` is local-only, up to 40 seeded random pairs, never displayed by the
script. `REPORT.md` contains counts, skip reasons, make allocation and limitations.
No preview is created if no pairs are accepted. Accepted results and deterministic
rejections are cached against the extractor/configuration to permit continuation.

## Checks

```powershell
node analysis/codex/blueprints/test_crawl.mjs
py -P analysis/codex/blueprints/test_extract.py
```

Seven synthetic Python tests check extraction, pale-stroke suppression, tensor
geometry, flipping, rejection and make isolation. Node tests check pacing,
refusal handling, reservation cases, robots priority, path exclusion and index
recovery parsing. They do not certify real-data yield.

Optional in-memory real-source smoke test (three sheets, no pixel files saved):

```powershell
node analysis/codex/blueprints/smoke.mjs C:/path/to/python.exe
```

The latest smoke test found one side view with unresolved orientation and rejected
two sheets. Real-source accuracy, high extraction yield, disk-resume recovery and
the end-to-end external build remain unverified. No training is started here.
