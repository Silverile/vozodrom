# Configurator frames and Toyota size limit (#28)

The manufacturer collector now prioritizes published Skoda and Toyota 360-frame sources. These are additional candidates, not automatic selector acceptance. Use fresh output folders so already-seen model pages are revisited:

```powershell
node analysis/codex/lineart/crawl_front_manufacturer.mjs --site skoda --out C:/Workspace/Projects/CF/vozodrom-data/front-collect/manufacturer-skoda-360 --configurator-only --per-generation 20 --pages 100 --max-minutes 20
node analysis/codex/lineart/crawl_front_manufacturer.mjs --site toyota --out C:/Workspace/Projects/CF/vozodrom-data/front-collect/manufacturer-toyota-360 --configurator-only --per-generation 20 --pages 100 --max-minutes 20 --max-response-mb 128
```

Omit/add `--wave 1` as needed. `--configurator-only` excludes ordinary page photos and uses a separate resume signature. This keeps the Toyota SDK collection away from the previously denied Scene7 source. The manufacturer response cap defaults to 128 MB (was 35 MB), configurable to 1–256 MB. Reads remain streamed with a bounded buffer; Content-Length and actual streamed bytes are checked. Declared oversized responses are cancelled. Errors now include URL and limit. Tests accept a 40 MB streamed fixture and reject/cancel oversize bodies. Other collectors retain their 35 MB default.

| Source | Published angle encoding / discovery | Verified result |
| --- | --- | --- |
| Skoda visualizer | Model HTML publishes `vizualizer2-module` baseUrl/sourceUrl/slug. That literal JS builds `/<bid>/<culture>/api/data?slug=...` and `exteriorImages` with device/scene/salesGroup/mbvCode/colorPrCode/wheelPrCode. Values come from the linked configurator and model-data response. `exteriorImages` returns an explicit 36-URL list ending `img.0000.jpg` … `img.0035.jpg`; URLs are used exactly as listed | Fabia IV frame **33** looks frontal in visual review; source 1920×1080. 16 exploratory frames inspected, then integrated collector downloaded frame 33 first. Camera height/selector acceptance remain unverified. Do not assume this index proves the angle for every Skoda model |
| Toyota configurator | Model page links `/konfigurator`; its embedded JSON contains current model/car/colour IDs and model token. Literal `require` URL publishes SDK `getCarImage` plus a 36-frame spin range. Reproduce the published default URL builder, `.../day-exterior-<integer>_<colour>.jpg`, for integers 0–35; no downloaded JS is executed | Corolla XII Sedan frame **0** is visibly straight-front, frame 9 is side, 18 rear, 27 opposite side. Four SDK frames downloaded, 1140×426; current collector prioritizes 0 then nearby front angles. Selector acceptance unverified |
| VW Newsroom | Tested source is a press archive, not the national configurator | No configurator frame mapping established; national-site work remains |
| Hyundai News | Tested source is a newsroom, with exterior photo filenames | No 360 frame mapping established; national configurator remains |
| Kia CZ | Published configurator and its Angular bundle inspected | No verified angle list/straight-front index yet |
| Dacia CZ | Linked Sandero configurator publishes design-picture JSON and renderer references | No verified straight-front frame yet |
| Ford CZ | Linked passenger-car showroom inspected | No verified frame list yet |
| Audi CZ | Linked public configuration redirect reaches `konfigurator.audi.cz`; shell and literal main bundle fetched | Further runtime chunks needed; no verified frame mapping |
| Other previously passed brands | Not investigated further within this bounded turn | Renault/Seat/Cupra/MG/BYD angle work remains |

Each published backend/image origin receives independent robots/Content-Signal checks. Observed Skoda visualizer/image and Toyota SDK/image robots returned 404; no prohibitions were inferred from their absence. The Skoda configurator redirect chain returned an unrecognized robots document and was stopped; it was not bypassed. The separate visualizer is explicitly published on the public model page.

Important live-state observation: the existing external Toyota report now says **HTTP 403**, not Response too large. Its pending URL is a Scene7 image containing unresolved `%7Bviewport%7D`. No request to that failed URL was repeated. Unexpanded `{...}` image templates are now rejected before requesting, including old pending entries. Keep the denied run stopped; the new SDK/image source has separate policy evidence. The original oversized URL cannot be established from the overwritten report.

Evidence: `angle-research-20261028.json`, `configurator-probes-20261028.json`, `angle-data-probes-20261028.json`, `frame-sample-report.json`, ignored `test-out/angle-research/`, `test-out/skoda-360-v1/`, and `test-out/toyota-360-v1/`. Known sample paths:

- Toyota frame 0: `test-out/toyota-360-v1/cand/toyota--corolla--11/62a79e9e42cdb948.jpg`.
- Skoda frame 33: `test-out/skoda-360-v1/cand/skoda--fabia--3/d272f56f46941d94.jpg`.

`front_configurator.mjs` records builder URL/hash, configuration page, frame number, and (for Skoda) exact frame-list URL/hash. Numeric frames keep `frontTitled:false`; visual selection remains required. Research scripts preserve page/resource evidence under the ignored test folder. No photos or catalog files are published/modified.

---

# Current collectors: 500 fleet-ranked generations (#25/#26)

Updated 2026-10-28. This section supersedes the archived photo-null scope below. All collectors now read `src/data/model-cards-index.json` and `C:/Workspace/Projects/CF/vozodrom-data/front-photos/seznam.csv`. Verified: 500 target IDs, wave 1 = 100, 430 targets already have photos. Matching considers all 6,392 indexed car generations. Short chassis codes and Roman generation ordinals are supported; ambiguous model/year overlaps remain unassigned. Any facelift inside the indexed generation is acceptable.

User-authorized use restrictions are recorded without disabling sources. Access restrictions still bind. Honest User-Agent, minimum 1.1-second request spacing, robots/Content-Signal checks, stop on 403/429/CAPTCHA, no login or paid APIs. UltimateSpecs has a 30-second Crawl-delay. Each newly observed image CDN gets its own policy check.

## Current commands

Run from repo root. Omit `--wave 1` to collect all 500. Add `--dry-run` for metadata-only collection into a separate dry-run index. `--list` does not access the network. `--targets <csv>` overrides the fleet CSV. Claude runs these external-output commands; this sandbox tested only inside the repo.

```powershell
node analysis/codex/lineart/find_front.mjs --out C:/Workspace/Projects/CF/vozodrom-data/front-collect/commons --wave 1 --per-generation 20 --max-minutes 20
node analysis/codex/lineart/crawl_front_carswp.mjs --out C:/Workspace/Projects/CF/vozodrom-data/front-collect/carswp --wave 1 --per-generation 20 --pages 500 --max-minutes 20
node analysis/codex/lineart/crawl_front_ultimatespecs.mjs --out C:/Workspace/Projects/CF/vozodrom-data/front-collect/ultimatespecs --wave 1 --per-generation 20 --pages 100 --max-minutes 20
node analysis/codex/lineart/crawl_front_manufacturer.mjs --site skoda --out C:/Workspace/Projects/CF/vozodrom-data/front-collect/manufacturer-skoda --wave 1 --per-generation 20 --pages 100 --max-minutes 20
node analysis/codex/lineart/crawl_front_manufacturer.mjs --site toyota --out C:/Workspace/Projects/CF/vozodrom-data/front-collect/manufacturer-toyota --wave 1 --per-generation 20 --pages 100 --max-minutes 20
```

Use fresh outputs for this new scope, then resume the same selection in the same directory. CarsWP/UltimateSpecs/manufacturer signatures reject changed filters/target lists. Commons version-2 records skip completed IDs and retry partial generations. Image URLs are deduplicated; source crawlers repair missing local images using checksum validation. Never run concurrent processes into one output. Denial/challenge stops must not be automatically retried.

Output rows retain `id` and generation evidence; file fields include `title`, `local`, `source`, `sourcePage`, `frontTitled`, URL, attribution/licence. Unknown rights use `unknown/all-rights-reserved`. JPEGs are resized to at most 1600 px. `frontTitled` is only text ranking. Photos remain ignored test/input artifacts, never site assets.

## Commons access change

Current [Commons robots](https://commons.wikimedia.org/robots.txt) excludes `/w/`, including the old API route. Default mode now uses permitted `/wiki/Category:` and `/wiki/File:` HTML, seeded by catalog-photo categories and generation-specific guesses. Front/body/facelift/year subcategories are checked. Disallowed `/w/index.php` pagination is never followed, reducing completeness. API mode remains explicit and currently stops on robots denial.

Published original links on `upload.wikimedia.org` are downloaded and resized locally. The thumbnail host's robots redirects to the Commons homepage; the client conservatively refuses cross-origin robots redirects. No API or thumbnail-policy bypass is attempted.

## Wave-1 results

| Collector | Bounded live dry run | Actual download pilot |
| --- | --- | --- |
| Commons HTML | 20 candidates, Fabia I; 1 generation | 6 files, Fabia I |
| CarsWP | 2 planned files, Fabia III; 10 pages | 3 files, Fabia III; 12 pages |
| UltimateSpecs | 0 planned in first 4 pages; root/Skoda/historic models | No live image; deterministic gallery/download/resume fixture passes |
| Skoda CZ | 3 planned, Fabia IV; 2 pages | 2 files from Fabia/Fabia Monte Carlo pages |
| Toyota CZ | 19 planned, Corolla XII; 2 pages; final rerun excludes embedded Corolla Cross | 8 raw files |
| VW / Hyundai / Kia / Ford / Dacia / Audi | 0 planned in 1–2-page pilots | None; deeper discovery/extraction remains unverified |
| Renault / Seat / Cupra / MG / BYD | No eligible wave-1 IDs in supplied list | Later-wave extraction untested |

Visual contact-sheet review of all **19 raw photos found zero strict head-on shots**. Three-quarter studio renders, interiors and scene images occur. Review found Corolla Cross embedded on the Corolla page although Cross is absent from the merged index; explicit Toyota model guards, strongest-model binding and Czech interior-caption filters were added. Commons now rejects airbags/garages. Raw earlier samples remain auditable; do not treat them as a selected set. `current-sample-audit.json` records sample sources and review. Existing ignored test folders can predate the final filtering fixes.

Known interiors, the Corolla Cross, and irrelevant garage scenes in the raw sample have been moved from `files` to `rejectedFiles`; do not feed `rejectedFiles` to selection. Original raw JPEGs remain for audit. Historical download reports count raw downloads, not the filtered retained list.

Evidence: `manufacturer-access-20261028.json`, `skoda-cz-access-20261028.json`, `manufacturer-wave1-dry-runs.json`, and ignored per-run reports/state/indexes. Latest metadata pilots: `test-out/commons-final/`, `test-out/manufacturer-toyota-final2/`.

## Manufacturer access matrix

No prohibiting Content-Signal was observed in the successful checked responses. This is per response, not a site-wide certification. Robots were HTTP 200 except the entries noted below. Linked terms URLs and page hashes are retained in audit JSON. No explicit automation prohibition was detected in checked terms; absence of a discovered general terms page remains unverified.

| Site | Access / terms evidence | Extraction status |
| --- | --- | --- |
| [Skoda CZ](https://www.skoda-auto.cz/) | Public home/model paths allowed; no general terms discovered | Embedded JSON extractor/download works; CDN robots 400/404 unavailable |
| [Skoda Storyboard](https://www.skoda-storyboard.com/en/) | Public pages allowed; copyright checked, use restrictions recorded | Archive requires explicit generation/year, no latest-generation fallback |
| [VW Newsroom](https://www.volkswagen-newsroom.com/en/models-3493) | Public paths allowed; terms-of-service checked | Pilot 0; Touran II has `current:false`, end 2026 in index, so current-model fallback refuses it. No catalog change |
| [Hyundai News CZ](https://www.hyundai.news/cz/) | Public home/models allowed; terms redirect destination robots-disallowed, not fetched | Initial audit stop was terms redirect, not home denial. Later public pilot works; archive matching needs explicit generation |
| [Kia CZ](https://www.kia.com/cz/) | Public home allowed; linked sales terms checked, general terms unverified | Pilot queued no targeted model link; deeper discovery unfinished |
| [Toyota CZ](https://www.toyota.cz/) | Public home/models allowed; linked legal/privacy pages checked | Extraction/download works; scene7 CDN robots 404 |
| [Ford CZ](https://www.ford.cz/) | Public home allowed; no terms discovered | No directly matched target-model links; model-index discovery unfinished |
| [Dacia CZ](https://www.dacia.cz/) | Public paths allowed; legal notice checked | Pilot 0; current models must not bind to older targeted generations |
| [Renault CZ](https://www.renault.cz/) | Public paths allowed; legal notice checked | No wave-1 targets |
| [Peugeot CZ](https://www.peugeot.cz/), [Citroen CZ](https://www.citroen.cz/), [Opel CZ](https://www.opel.cz/) | Each robots fetch HTTP 403; stopped before content | Disabled this run; no alternate access |
| [Seat CZ](https://www.seat.cz/) | Public paths allowed; legal terms checked | No wave-1 targets |
| [Cupra CZ](https://www.cupraofficial.cz/) | Public home allowed; no terms discovered | No wave-1 targets |
| [BMW CZ](https://www.bmw.cz/cs/index.html) | Robots timeout; policy unknown, stopped | No content/images fetched |
| [Mercedes CZ](https://www.mercedes-benz.cz/) | Robots HTTP 403, stopped | No content/images fetched |
| [Audi CZ](https://www.audi.cz/) | Public paths allowed; usage terms checked | Pilot 0; deeper extraction unverified |
| [MG CZ](https://www.mgmotor-czech.cz/) | Public home allowed; no terms discovered | No wave-1 targets |
| [BYD CZ](https://www.byd.com/cz) | Robots 404, public home readable; no terms discovered | No wave-1 targets |

Other passed site keys use the same manufacturer command with separate output: `skoda-storyboard`, `volkswagen`, `hyundai`, `kia`, `ford`, `dacia`, `renault`, `seat`, `cupra`, `audi`, `mg`, `byd`. Only Skoda CZ and Toyota demonstrated actual downloads. Config entries for blocked sites are not authorization to crawl them.

Robots 400/404/410 without challenge are treated as unavailable per [RFC 9309 section 2.3.1.3](https://www.rfc-editor.org/rfc/rfc9309.html#section-2.3.1.3). Client behavior is stricter for 401/403/429, challenges, server/network errors and cross-origin robots redirects. Explicit AI-agent/path exclusions and ai-input/noai reservations remain binding. `ai-train=no` alone does not prohibit this task because no model training occurs.

Remaining: broader prioritized collection, manufacturer-specific current/archive mapping, deeper model-index discovery, then Claude's head-on selector. No defensible accepted-coverage percentage exists for these 500 IDs. Brand overlap or page counts must not be represented as usable head-on coverage.

---

# Archived research: former photo-null scope (superseded)

# Front-photo sources — 28 October 2026

Two exploratory crawlers are implemented: CarsWP (formerly FavCars) and
UltimateSpecs. Neither is a demonstrated high-yield source for strictly head-on
photos. Nine real downloaded test photos were visually inspected: **zero pass**.
Do not infer viewing-angle acceptance from a model match or from robots access.

Evidence is recorded in `source-policy-probes.json`, `source-*-inspection.json`,
the specific site inspection JSON files, and ignored `test-out/*/report.json`.
All requests used an identifying User-Agent. No search-engine image queries,
login, paid service, CAPTCHA bypass, commits or publishing were used.

## Sources and access decisions

“No signal observed” means neither a Content-Signal response header nor a relevant
directive in the checked robots/page response was observed. It does not certify
every page, CDN, or future response. The crawlers recheck policy on each run.

| Source | Robots / actual access | Content-Signal | Terms checked | Coverage and view evidence | Decision |
| --- | --- | --- | --- | --- | --- |
| [Carsized](https://www.carsized.com/robots.txt) | `*` excludes `/cdn-cgi/`; first direct legal-page GET returned **403**, then stopped | None in robots; content not acquired directly | [Legal page](https://www.carsized.com/en/legal/) was readable through the research browser before that denial; no automation prohibition found there | Public description says controlled, consistent real-car viewpoints and current/historical models; street perspective can differ from elevation drawings. No direct photo sample acquired | Best apparent geometry, **not available to this crawler**; no alternate access route attempted |
| [NetCarShow](https://www.netcarshow.com/robots.txt) | Direct robots request timed out. Research-browser copy explicitly disallows GPTBot, ChatGPT-User, ClaudeBot, Claude-User and claude-code | Unknown | Content/terms not crawled after denial evidence | Likely broad press galleries; head-on yield unverified | Excluded |
| [UltimateSpecs](https://www.ultimatespecs.com/robots.txt) | Public specs/galleries allowed, **Crawl-delay 30 seconds**; excludes `/includes/`, `/lang/`, comparator sitemap paths | None observed | Home/footer and [privacy policy](https://www.ultimatespecs.com/privacy-policy) checked; no automated-access ban detected in checked text; no broad content-reuse permission inferred | Specs cover current and older models, including some Chinese makes. Gallery inspected: Abarth Punto Evo, one image; viewpoint unverified. Original image URLs are exposed by gallery HTML | Slow exploratory crawler implemented |
| [CarsWP / FavCars](https://www.carswp.com/robots.txt) | `Allow: /`; image host also allows `/`. FavCars robots redirects to CarsWP | None observed | [Policy](https://www.carswp.com/privacy): no automation ban found; wallpapers for personal use, third-party copyrights; site cannot grant republication permission | Public index reports 694 manufacturers and 354,523 wallpapers. Chinese makes listed. **BX5 absent from checked Borgward model page**; historic Borgwards present. Nine inspected images mix side/rear/interior/three-quarter/high-front shots; zero strict head-on | Broadest tested accessible pool; exploratory crawler implemented |
| [WheelsAge / AutoWP](https://en.wheelsage.org/robots.txt) | Checked robots has no AI-agent disallow; 1-second delay. Public model lists readable. Read-only `Pictures/GetPictures` returned **gRPC status 7, permission denied**; stopped | None observed | [Terms](https://en.wheelsage.org/tos) allow automated access within the published API/robots rules, while restricting bulk use beyond them; preserve credits/watermarks | Broad historic and Chinese catalog. BX5 caption explicitly 03.2017–21. Published [API schema](https://github.com/autowp/autowp/blob/master/spec.proto) has front-perspective ordering. SSR previews are only 350/635 px despite originals being larger | Promising catalog and perspective metadata; full-photo API **unavailable without permission**. Experimental API reader retained, not a recommended crawler |
| [Caricos](https://www.caricos.com/robots.txt) | Explicit GPTBot and ClaudeBot root denial | None observed in robots | Content/terms not crawled | Press-gallery geometry/coverage unverified | Excluded |
| [Openverse API](https://api.openverse.org/robots.txt) | `*` disallows `/v1/images/`; GPTBot and ChatGPT-User also denied at root. Documentation host also denies these agents | None observed in robots | API documentation was initially discovered; no endpoint request made after inspecting robots | Flickr/CC pool is potentially broad, but head-on yield unknown | **No API exception assumed.** General API availability does not override the explicit endpoint and agent exclusions under this run's rules |
| [Škoda Storyboard](https://www.skoda-storyboard.com/robots.txt) | Public pages allowed; admin excluded | None observed on checked home/copyright page | [Copyright](https://www.skoda-storyboard.com/en/copyright/) restricts duplication/distribution; footer grants limited news use for two years, with territory exclusions | Current studio/location sets plus historic coverage. Individual front views not sampled. Only three queue records belong to Škoda | Use restrictions recorded; not selected for bulk input crawler |
| [Mazda newsroom](https://newsroom.mazda.com/robots.txt) | `/apis/`, `/assets/`, language info paths disallowed | None observed on checked home | Home presents download agreement: copyrighted materials for journalists/media editorial use only, other purposes prohibited | Modern studio/press images; head-on share unverified | Agreement and asset restrictions; no download crawler |
| [Hyundai News](https://www.hyundai.news/robots.txt) | Public pages generally allowed; search, baskets, archives and terms/privacy paths explicitly excluded | None in robots | Terms paths were **not fetched**, because robots excludes them | Modern press coverage likely; individual fronts unverified; five queue records total | Policy incomplete; not enabled |
| [Toyota Global](https://global.toyota/robots.txt) | Robots redirects to `/robots.txt/`; redirected response not examined in this research | Unknown | Not examined | Historic/current coverage unverified; 21 Toyota queue records | Not enabled |
| [Toyota UK media](https://media.toyota.co.uk/robots.txt) | Public paths allowed | None observed | [Legal notice](https://media.toyota.co.uk/legal-notice/) limits site use to personal purposes without written consent for commercial use | Historic/modern UK media archive; individual fronts not sampled | Restrictions recorded; not selected |
| [Toyota US pressroom](https://pressroom.toyota.com/robots.txt) | Robots returned **403 / Cloudflare challenge**; stopped | Unknown | Not fetched | Unverified | Excluded from this run |
| [Volkswagen Newsroom](https://www.volkswagen-newsroom.com/robots.txt) | Public paths allowed | None observed on checked home/terms | [Terms](https://www.volkswagen-newsroom.com/en/terms-of-service-35): press material limited to personal/editorial purposes; commercial image uses restricted; no explicit scraping ban found in checked text | Extensive current and classic model navigation, but **zero Volkswagen records in this photo-null queue** | No useful queue coverage; no crawler needed for this task |
| [BYD Global](https://www.bydglobal.com/robots.txt) | Robots returned 404; no blanket robots restriction inferred from absence | Unknown | Home/terms/media gallery not yet examined | 44 BYD queue records, but source model/stage coverage unknown | Not enabled; no coverage claim |
| [Geely Global](https://global.geely.com/robots.txt) / [newsroom](https://newsroom.geely.com/robots.txt) | Global robots allows public paths; newsroom excludes language-master and 404 paths | None observed in checked global home / robots | No terms link found among checked global home links; newsroom terms not examined | Global home links current EX5/EX5 EM-i/EX2/Coolray configurators; precise photo years and historic coverage unverified | Incomplete policy/year evidence; not enabled |
| [ChinaMobil](https://www.chinamobil.ru/robots.txt) | Crawl-delay 10, but explicit GPTBot/ClaudeBot/anthropic-ai root denial | None observed in robots | Content not crawled | Chinese coverage plausible, not inspected | Excluded |
| [Automobile Dimension](https://www.automobiledimension.com/robots.txt) | Public robots allows paths | None observed in robots | Home/terms not examined | View geometry/model-year/photo resolution unverified | Research lead only |
| [Cars-Data](https://www.cars-data.com/robots.txt) | Robots redirects to non-www host; destination not examined | Unknown | Not examined | Unverified | Research lead only |

The permission boundary is per source. A denial from one source did not stop
independent policy research on other sources. No denied host was retried with a
different identity, authenticated session, proxy, or alternative media endpoint.

## Coverage: measured ceilings, not expected head-on yield

Inventory is still **3,721** `photo: null` car generations. Only **2,368 (63.6%)**
have a known starting year. Matching considers *all* catalog stages, including
those that already have photos, so overlapping years cannot silently assign a
photo to the remaining empty stage.

| Source | Catalog makes matched by observed source index | Queue records under those makes | With known starting year | Demonstrated strict head-on coverage |
| --- | ---: | ---: | ---: | --- |
| CarsWP | 120 | 3,280 / 88.1% | 2,090 / **56.2%** | **0 / 3,721**; nine test photos across two generations all fail visual head-on inspection |
| UltimateSpecs | 51 in observed home navigation | 1,869 / 50.2% | 1,265 / **34.0%** | Not established; live mapping/gallery dry runs only |
| WheelsAge | 151 | 3,485 / 93.7% | 2,210 / 59.4% | **0 acquired**; full-image API denied |

These are loose upper bounds for the current strict matcher, not estimates of
photos actually present. CarsWP's 88.1% brand overlap emphatically does not imply
BX5 coverage: its inspected Borgward page contains historic models only.
There is no statistically supportable “likely usable share” yet. Any narrower
percentage would be invented from this sample. A representative multi-make pilot
with the head-on selector is needed before scheduling a full crawl.

Manufacturer-only ceilings are: Škoda 3 (0.08%), Mazda 50 (1.34%), Hyundai 5
(0.13%), Toyota 21 (0.56%), VW 0, BYD 44 (1.18%), Geely 51 (1.37%). Actual archive
coverage can be substantially smaller, particularly for discontinued Chinese cars.
These figures are also saved in `front-source-coverage.json`.

## Crawlers and continuation commands

Both crawlers require `--out`, use an exclusive output lock, persist a page queue
and pending images, save by temporary file plus rename, and skip completed image
URLs. Missing/corrupt local images are requeued after checksum validation. A
different filter/seed requires a different output folder. Never run two processes
against the same output. Do not automatically retry a denied/challenged source.

Default runs scan all eligible makes. Use a small dry run first:

```powershell
node analysis/codex/lineart/crawl_front_carswp.mjs --out C:/Workspace/Projects/CF/vozodrom-data/lineart-front-carswp --dry-run --pages 20 --max-minutes 20
node analysis/codex/lineart/crawl_front_carswp.mjs --out C:/Workspace/Projects/CF/vozodrom-data/lineart-front-carswp --pages 100 --max-minutes 20

node analysis/codex/lineart/crawl_front_ultimatespecs.mjs --out C:/Workspace/Projects/CF/vozodrom-data/lineart-front-ultimatespecs --dry-run --pages 10 --max-minutes 20
node analysis/codex/lineart/crawl_front_ultimatespecs.mjs --out C:/Workspace/Projects/CF/vozodrom-data/lineart-front-ultimatespecs --pages 20 --max-minutes 20
```

Dry runs write separate `dry-run-*` metadata, without image requests, and do not
mark real images acquired. Images are written under `cand/<id>/<hash>.jpg`,
resized to at most 1,600 px with original aspect ratio. Actual image width must
be at least 1,000 px. Output keeps the earlier generation/file shape plus
`source`, `sourcePage`, `year`, production-year evidence and
`licence: "unknown/all-rights-reserved"`. No source photo is a publication asset.

Matching requires an explicit make/model caption or heading and production-year
evidence. A caption range must fit one catalog generation/stage without a one-year
tolerance. Missing years, unknown catalog starts, overlapping stages and conflicting
ranges are left unassigned. This intentionally sacrifices recall. Variant names
are retained, and exact trim/body geometry still needs visual review.

## Tests and dry-run results

- CarsWP Abarth dry run: 8 pages, 10 requests, one planned photo, no image download.
- CarsWP Punto Evo acquisition: 12 pages, 20 requests, five JPEGs, one mapped generation.
- CarsWP Isabella acquisition: 16 pages, 23 requests, four JPEGs, one mapped generation.
- CarsWP BX5 test: Borgward model page has no BX5; zero candidate downloads. This was checked again after correcting cross-page fragment handling.
- UltimateSpecs Punto Evo: source range **2009–2014** conflicts with the catalog's starting year; left unassigned rather than weakening the boundary check.
- UltimateSpecs Grande Punto: source **2007–2010** maps uniquely; gallery dry-run continuation is recorded in `test-out/ultimatespecs-grande/`.
- `node analysis/codex/lineart/test_front_sources.mjs` checks robots merging/delays, denial/challenge stops, make/model identity, ambiguous facelift years, actual download/queue/resume behavior, missing-file recovery and UltimateSpecs gallery extraction using deterministic fixtures.

Real test images and contact sheets are under `test-out/`, ignored by its own
`.gitignore`. There are nine source images and two contact sheets; none were
added to git. The contact sheets show the failed angles explicitly.

Content-Signal `ai-input=no` and AI/TDM reservations stop acquisition. An
`ai-train=no` directive does not authorize training; these crawlers do no training.
Robots denials for the executing AI-agent families are not bypassed with the
project's custom User-Agent. Every media/CDN host must pass its own policy check.
