# Blueprint dataset checkpoint — 2026-10-27

Dataset work is blocked by filesystem scope, not by a new permission request:
the user authorized the external directory, but this Codex sandbox cannot write
`C:\Workspace\Projects\CF\vozodrom-data\blueprints`. Native directory creation
and the actual crawler entry point both returned access/EPERM errors before
image acquisition. No alternate in-repository data directory was used.

| Result | Count |
|---|---:|
| Persisted raw drawings | 0 |
| Accepted saved training pairs | 0 |
| Saved source previews | 0 |
| Latest in-memory smoke samples | 3 |
| Side views found in that smoke test | 1 |
| Orientations resolved in that smoke test | 0 |
| Other smoke sheets rejected | 2 |
| Passing synthetic Python tests | 7 |

Live access check at 10:40 UTC: robots allowed all paths; checked the blueprint
landing page, public registration page and footer links. No explicit TDM/AI
reservation was found in those pages/headers; no terms links were exposed there.
The footer's familiarization-only limitation is noted. This is not a legal
determination. Sources: https://3dcar.ru/robots.txt,
https://3dcar.ru/blueprints, https://3dcar.ru/registration.

The crawler enforces pacing, same-origin full-image selection, refusal stops,
external output paths and resume records. The CPU extraction/build scaffold
implements conservative view rejection, orientation review, normalized channels,
exact duplicate exclusion, make-based splits, local preview and report output.

NEXT: Claude can run the README commands in a terminal with the external data
directory writable. Crawl a small first batch, inspect the local outputs, label
orientations and improve extraction yield before scaling to 800–1500 originals.
Bulk download, external build/resume behavior, real-source pair accuracy and
training quality have not been verified. No files were committed or published.
