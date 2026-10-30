# Three training-only source crawlers — checkpoint 27 October 2026

Scripts only are in the repo. Dry runs write no state, logs, images or dataset
files. No real acquisition was started here. Two originals were inspected only
in memory for layout; neither was saved to the repository or served on the site.

## Commands

```powershell
node crawl_carblueprints.mjs --dry-run
node crawl_bakkirill.mjs --dry-run
node crawl_findblueprints.mjs --dry-run

node crawl_carblueprints.mjs --max-minutes 18
node crawl_bakkirill.mjs --max-minutes 18
# Findblueprints original delivery is currently BLOCKED; see below.
```

From the repository prepend `analysis/codex/blueprints/` to the filenames.
Each invocation stops within its checkpoint and can be repeated to resume.
`--limit N` caps total indexed originals, not additional files. Narod defaults
to100000 (a practical ceiling for all relevant entries); Findblueprints defaults
to2500 and rejects higher limits. `--max-minutes` must be >0 and <=20. `--pages`
controls dry-run HTML page budget, default5, maximum10. Robots requests are
additional; dry-run summaries separately report HTTP requests and page counts.

Default external output directories:

- `C:\Workspace\Projects\CF\vozodrom-data\blueprints-carblueprints`
- `C:\Workspace\Projects\CF\vozodrom-data\blueprints-bakkirill`
- `C:\Workspace\Projects\CF\vozodrom-data\blueprints-findblueprints`

`--data-dir` can override the external directory. The guard compares resolved
paths against **absolute `C:/Workspace/Projects/CF/vozodrom`**, including existing
junction ancestors. It does not depend on the script's copied location.

For external execution copy the three entry points, `crawl_shared.mjs`,
`crawl_narod_adapters.mjs` and `nuxt_literal.mjs`. They use pure helpers exported
by `common.mjs`; reuse the existing external common file rather than overwriting
Claude's corrected 3dcar copy. A fresh separate tools folder can receive a copy
of common too: these new entry points do not call its relative output guard.
Nuxt parsing uses Next's already-installed Acorn at the absolute repo path via
`createRequire`; the repo and its node_modules must remain available. No new
package installation is required. Narod acquisition itself needs Node only.

## Dry-run observations

- Findblueprints listing dry run: five pages, one original-file plan in the
  initial run; sitemap yielded9963 candidate car-slug URLs before full metadata
  and file-name filtering. These are not verified passenger-car sheets or unique
  accepted pairs. It resolved the published original Download handler, not a
  preview or guessed S3 key. A later code change skips duplicate self-linked
  copyright anchors; this exact final Find listing was not re-fetched after the
  delivery refusal below.
- Carblueprints five-page dry run:24 original plans across AC/Daewoo/Innocenti
  (MG exposed no linked originals in that run). A subsequent fallback also
  recognizes same-make embedded originals. Counts are discovery-only: binary
  duplicates, dead images and actual suitability were not measured.
- Bakkirill five-page dry run:57 original plans, including VAZ, GAZ, ZAZ/LuAZ
  and Moskvich. Cyrillic titles decoded correctly. Brand exceptions such as
  LuAZ inside ZAZ and Chevrolet inside VAZ are normalized. A front/rear-only
  KIM sheet was discovered too; pair extraction must reject sheets without sides.

## Findblueprints delivery blocker — do not bypass

The public, unauthenticated Download implementation publishes
`/api/files/<id>/download`. HEAD checks of two free file IDs returned302 to
`findblueprints-79346592784.s3.us-west-1.amazonaws.com/private/image/png/...`.
These are server-provided original routes, not inferred preview replacements.
The delivery host's `/robots.txt` returned **HTTP403** during the original check.
The check stopped without requesting the original image. The real crawler will
stop there too; it has no option to ignore that refusal. Source-host robots alone
does not resolve this delivery-host issue. No original layout/watermark claim is
made for Findblueprints. Catalogue metadata says PNG/JPEG, sometimes multiple
files per model; the files' actual layouts remain unverified.

## Observed sheet layouts for bp_pairs.py

| Source/sample | Layout and side view | Watermark/detail observations |
|---|---|---|
| Carblueprints GAZ-12 ZIM,750×428 GIF | One vehicle, four views: side upper left, top lower left, narrow front/rear at right. Side faces left; rear tyre partly obscured. | No conspicuous watermark in this sample; strong outlines, few dimensions, roughly600px-wide side crop. This is not an archive-wide guarantee. |
| Bakkirill VAZ-2107,800×730 GIF | One vehicle, side/front/top/rear plus two dashboard/instrument panels. Side upper left, faces left. | No conspicuous watermark in this sample. Dense dimensions, Russian caption, dashed interior/seats, textured scan and large circular dashboard gauges. Gauges must not be mistaken for wheels. Side crop roughly500px wide. |
| Findblueprints originals | Not visually verified: delivery-host policy refused. Multiple file records may represent alternate sheets. | Unknown; do not infer original quality/watermark from a preview or filename. |

Other archive entries can be a single side only, several views, opposite-facing
vehicles, dimensions or parts. Do not assume one consistent template. Many
Narod originals are GIF. The provided `bp_pairs.py` uses `cv2.imread` at line40;
verify GIF support in its actual OpenCV build or decode via Pillow first. That
peer-runtime compatibility was not tested here, and its code was not edited.

## Operational guarantees and limits

- Exact requested User-Agent; sequential requests at least1100ms apart, including
  policy requests/redirects. Larger published crawl delays are respected.
- Before each run robots and Content-signal/AI reservations are rechecked. Public
  entry/linked terms are inspected. Every response is screened for reservation
  headers and challenges. A new delivery host requires its own robots check.
- Item/page/image404 is logged and skipped;403,429,5xx, challenge, policy denial,
  invalid image or unexpected host stops. A missing/unavailable robots policy
  also stops because the required policy recheck could not be completed.
- Same-origin Narod links only; ads, paid Outlines links, forums and trackers are
  excluded. Passenger filtering uses category exclusions plus model/title/file
  heuristics; ambiguous known commercial categories are skipped. Review residual
  misclassification rather than assuming an archive's Cars label is sufficient.
- Findblueprints takes URLs from the public sitemap, evaluates Nuxt data through
  a restrictive AST whitelist (never executes downloaded JS), rejects non-free
  records/non-car files, and uses only the observed public original download
  handler. No login, token guessing, private/admin endpoint or preview harvesting.
- `raw/`, `index.jsonl`, metadata sidecars and `state.json` match the requested
  layout. SHA-256 duplicate checks, existing-file verification, orphan-sidecar
  recovery, partial-last-index recovery and an exclusive PID lock support resume.
  Never remove a live lock or kill processes by name. No retries hide refusals.
- Actual external writes/resume/crash recovery were not exercised because this
  sandbox cannot write the data directory. Disk behavior remains unverified.

Checks: `node test_source_crawlers.mjs` passes mocked refusal/pacing/reservation,
absolute guard, safe Nuxt decoding and passenger-adapter cases. Syntax checks
pass. Listing dry runs do not certify full original retrieval. No training,
commits, external tools edits or bulk downloads were performed.

## Commons and Modelist-Konstruktor additions (27 October)

```powershell
node analysis/codex/blueprints/crawl_commons.mjs --dry-run --pages 5 --limit 100 --max-minutes 2
node analysis/codex/blueprints/crawl_commons.mjs --limit 2500 --max-minutes 18
node analysis/codex/blueprints/crawl_modelist_konstruktor.mjs --dry-run --pages 5 --limit 1000 --max-minutes 2
node analysis/codex/blueprints/crawl_modelist_konstruktor.mjs --limit 1000 --max-minutes 18
```

Defaults: external `vozodrom-data/blueprints-commons/` and
`vozodrom-data/blueprints-modelist-konstruktor/`, with raw/index/state/sidecars.
Copy `common.mjs` and `crawl_shared.mjs` alongside either relocated script.
Dry runs are read-only, fetch metadata/pages only and plan no more than the
specified limit. Commons `--pages` counts API queries; Modelist counts HTML/XML
pages. Policy/terms requests are additional and share the same serial pacing.

Commons supports category continuation/depth 3, batched per-file licence checks,
PNG SVG renders and source attribution. The documented query API is an explicit
narrow exception to Commons' generic `/w/` crawler rule; no HTML/media exception.
See SOURCES.md for the current official upload-host render route and policy
audit. Actual render width may exceed the requested 2000px; PNG dimensions are
read from downloaded bytes. Raw transparent PNGs must be flattened onto white
before grayscale extraction. GIF decoding still needs the existing PIL fallback.

Modelist is provisional B/training-only, not a free-licensed archive. It uses
permitted sitemaps/direct articles, never robots-blocked category pagination.
Caption filtering deliberately misses uncaptained drawings. The 200–350 estimate
is uncertain, and its grids/dimension text need downstream cleanup. No new
training pairs or generator training were produced by these dry runs.

Tests: `node analysis/codex/blueprints/test_commons.mjs`,
`node analysis/codex/blueprints/test_modelist_konstruktor.mjs` and existing
`test_source_crawlers.mjs`. External write/crash-recovery behavior remains
unverified here. SMCars and Dimensions are excluded; Carblueprints.info and
Archive.org are held. Do not crawl them with these scripts.
