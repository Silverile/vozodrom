# Current scope (28 October 2026, bridge #25/#26)

The merged index and fleet CSV now select 500 generations, including existing photos. Default mode uses allowed public category/file HTML, up to 20 files per generation. See [FRONT-SOURCES.md](FRONT-SOURCES.md) for current evidence and commands. Omit `--wave 1` for all 500; use a fresh output for this scope. API paths and `/w/index.php` pagination currently fail robots checks and are not fetched by HTML mode.

```powershell
node analysis/codex/lineart/find_front.mjs --list --wave 1
node analysis/codex/lineart/find_front.mjs --out C:/Workspace/Projects/CF/vozodrom-data/front-collect/commons --wave 1 --max-minutes 20 --per-generation 20
```

Claude runs the external-output command. Front titles rank candidates only.

## Archived original scope and results (superseded)

The collector is `find_front.mjs`, adapted from Claude's `lineart-pilot/find3.mjs`.
It reads car-section makes and `photo: null` generations only, prioritizing any
record with a known width or height. The initial inventory was 3,721 generations,
237 in that priority group. No catalog or application files are edited.

Run from the repository root:

```powershell
node analysis/codex/lineart/find_front.mjs --out analysis/codex/lineart/front-output --max-minutes 20
```

The script's default output is the requested sibling directory:

```powershell
node analysis/codex/lineart/find_front.mjs --out C:/Workspace/Projects/CF/vozodrom-data/lineart-front --max-minutes 20
```

The current sandbox cannot write that sibling directory. Claude can copy
`front-output/candidates.json` and `front-output/cand/` there, then use the second
command to resume. Preserve relative `cand/<id>/<n>.jpg` paths. Without the copy,
the external command starts a fresh index. `--only <id-regex>` and `--limit <n>`
are available for smaller runs; `--list` prints the inventory without networking.

An ID with `status: "done"` is skipped on resume, including completed no-match
records. Download/API failures and time checkpoints do not mark the unfinished
ID done. The index is saved by temporary file plus rename after each generation.
Audited rejected matches have `status: "retry"` and are eligible for recollection.
Only `files` is the usable candidate list; `rejectedFiles` and `rejectedCategory`
retain attribution and audit evidence, and must not feed rendering.

The collector uses one sequential client and at least 1,100 ms between request
starts, `maxlag=5`, and the existing project contact in its User-Agent. Any HTTP
failure, challenge, API error or redirect stops it. The trial stopped early on
Commons `cirrussearch-too-busy-error`, while starting `ferrari--enzo--0`; there
was no retry after that stop. This was a service error, not a 20-minute completion.

Category and subcategory file listings follow continuation pages. Only JPEG/PNG
sources at least 1,000 pixels wide with PD/CC0/CC BY/CC BY-SA licence strings are
retained. Front-title matches rank above front descriptions and front categories;
unlabelled views can fill remaining slots up to eight. Rear, side, three-quarter,
interior, engine and detail text is excluded. Visual symmetry and exact variant
checks remain required for every candidate. API licence metadata and author
attribution are retained; the file pages have not been manually audited.

The repository's installed `sharp` writes actual JPEGs at up to 1,600 px width.
Commons may return a 1,920 px bucket for `iiurlwidth=1600`; local normalization
removes that difference. PNG thumbnails also become correctly encoded `.jpg`.

The first live run used an earlier in-memory matcher. The saved output was
audited with the final matcher using:

```powershell
node analysis/codex/lineart/finalize_front.mjs analysis/codex/lineart/front-output
node analysis/codex/lineart/test_find_front.mjs
```

Run the finalizer only when collection has stopped. It preserves rejected
attributions and emits `checkpoint.json` with counts and ten uncertain matches.
The final matcher requires all words of one model alias (preventing Daytona SP3
from matching 365 Daytona), supports numeric generation names, uses catalog make
aliases, restricts chassis-family inference to Toyota, and penalizes individual
serial-number categories. Tests exercise category confusions, view/licence
filters, pagination, denial/challenge/maxlag stops, and resume without requests.

Remaining limitations: localized model names can still miss Commons categories;
model-level categories can contain multiple variants or facelift stages; filename
years may represent photography dates; text does not establish head-on symmetry.
No production-ready image selection or line drawings are claimed.
