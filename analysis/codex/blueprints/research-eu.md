# European blueprint source audit — 2026-10-27

Research only. No source images downloaded or displayed. Live Node fetches used `vozodrom-research/0.1 (https://vozodrom.cz)`; page requests were spaced at least 1.1 seconds per site. Class B means only that this small audit found no explicit AI/TDM reservation, **not** that the TDM exception has been legally established. Age, a government host, and a generic “Creative Commons” badge do not independently establish group A.

## Search coverage

- Tried Google `https://www.google.com/search?q=Autobauplan+Seitenansicht+Auto`: HTTP 200, redirected to the same query with `ucbcb=1`, title Google Search, JavaScript redirect shell; no usable results extracted. Did not claim a successful Google search.
- Tried Yandex `https://yandex.com/search/?text=Autobauplan%20Seitenansicht%20Auto`: redirected to `/showcaptcha`, title “Are you not a robot?” Stopped Yandex; no challenge interaction or bypass.
- Discovery then used the generic web search tool with German/Czech queries and direct primary-source checks. German/Czech searches produced many false positives (railway drawings, chassis parts, architectural plans); these are excluded from yield estimates.

## A — verified freely licensed item

### Wikimedia Commons: Citroën 2CV side blueprint

- Item: https://commons.wikimedia.org/wiki/File:Citroen-2cv-zianotipo.svg
- Category leads: https://commons.wikimedia.org/wiki/Category:Citro%C3%ABn_2CV_drawings and https://commons.wikimedia.org/wiki/Category:Blueprints_of_vehicles
- Evidence: **“Attribution-Share Alike 4.0 International”**. The individual file records Batix Ezeiza, own work, 7 May 2020; https://creativecommons.org/licenses/by-sa/4.0/ . This is an item-level A finding, not blanket certification of either category.
- Yield: **one verified side view**. The Citroën drawings category reports 27 files, but these are not 27 proven distinct technical side views; duplicates/other views need filtering. Wider European clean-side blueprint yield unmeasured.
- Quality: SVG, nominal 512×362, 1.58MB; description explicitly side technical drawing in cyanotype style; scalable preview up to 3840×2715. Open hood and cyanotype styling may require rejection/normalization for a closed-body black-line target. No source pixels were visually checked this turn, so watermark absence is unverified.
- Structure: Commons category pagination → File pages → original-file links; imageinfo/extmetadata can supply original URL, author and licence. Retain per-file provenance, attribution and SA obligations.
- Audit: robots and item HTTP200; Terms HTTP200 at https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use . robots inspected in full in memory; no AI-training/Content-signal block found; ordinary special-path restrictions apply. Terms prohibit abusive/disruptive automated use, rather than all automated acquisition. Item footer states file licences are on description pages. Headers on both robots/item contain no Content-signal or explicit AI restriction; robots has `Content-Type: text/plain`, server ATS; item is text/html.

## B — scoped training-only candidate

### Škoda Storyboard: manufacturer technical specifications/dimensional drawings

- Index: https://www.skoda-storyboard.com/cs/skoda-model/octavia/
- Confirmed side-view sheet: https://cdn.skoda-storyboard.com/2025/02/Octavia_EN_ed9ab7ae.pdf ; older generation specification set: https://cdn.skoda-storyboard.com/2019/12/TD-OCTAVIA-en.pdf . The web extractor describes front/side/rear dimension drawings in these PDFs, including side-view wheelbase/overhangs and interior occupants.
- Evidence: robots generic policy **`Disallow: /wp/wp-admin/`**, then empty generic Disallow; no named AI bot blocks or Content-signal. No explicit AI/TDM reservation found on model page or its footer.
- Important limitation: footer grants an ordinary licence for press/news use and limits conflict with legitimate interests. It does **not** grant a free licence or expressly authorize training. This B classification follows the task's reservation screen only; do not publish these training targets as source drawings. Footnote/rights and CDN policy should be rechecked before any crawl; CDN headers/robots were **not** audited this turn.
- Yield: **2 PDF documents confirmed to contain side-view drawings**, covering multiple body/trim sheets. Rough unique-shape opportunity **20–80** across current/recent Škoda models/derivatives, low confidence, not counted by a crawl; engine/language editions heavily duplicate drawings.
- Quality: manufacturer PDFs with fine technical outlines and many dimensions, interior seats/occupants and some colour. Potential vector extraction; exact raster resolution/watermark absence not checked. Dimension/occupant removal needed.
- Structure: model pages expose technical-data download-PDF links; media kits and dated `cdn.skoda-storyboard.com/YYYY/MM/*.pdf` attachments. Discover only actual attachment links, deduplicate PDF drawing/geometry hashes, not engine pages.
- Audit: robots + model page HTTP200; X-Robots-Tag `noindex, follow` on robots only (indexing, not AI reservation). Model page response had Content-Type text/html, Permissions-Policy and nosniff; neither response had Content-signal/AI licence headers. Footer checked directly; no separate terms link exposed by its minimal link-label extractor, so full company-wide rights coverage is not certified.

## C — excluded by explicit bot reservation

### Tatra Club technical manuals

- Discovery URL: https://www.tatra-club.com/manuals.php?kols=10 ; robots: https://www.tatra-club.com/robots.txt
- Evidence: **`User-agent: GPTBot` / `Disallow: /`**, plus ClaudeBot and OAI-SearchBot blocked. The task explicitly treats AI bot exclusions as C. Stop: no downloads or further terms fetches.
- Yield: search discovery lists `T57 tech vykresy.pdf` (28 pages) and `T57 soubor vykresu.pdf` (260 pages), but **0 usable under this screen**. These page counts are mainly component drawings, not verified whole-car side-view counts. Current page contents differ from cached search indexing; no claim that both files remain at the sampled pagination URL.
- Quality: PDF scans, files described as 9MB and 128MB; whole-car side-view resolution/watermarks unverified.
- Structure: paginated manuals table with model/year/document/size/page-count, document detail links. Do not implement a crawl of this source.
- Audit: robots HTTP200 text/plain UTF8, server nginx, no Content-signal header; listing also HTTP200 text/html. Footer links terms at `/pravidla`; robots itself disallows `/pravidla`, `/rules` and `/legal.php`, so terms were not fetched. Robots AI exclusion is sufficient to exclude regardless of ordinary terms. Listing was fetched solely for classification in the same initial audit batch; no image/document acquired.

## D — do not use / insufficient access or rights

### ccvision CAR-SPECIAL (Germany)

- URLs: https://www.ccvision.de/en/service/help/car-special.html ; https://www.ccvision.de/en/service/gtc.html ; example model result https://www.ccvision.de/en/car-special-cloud/Skod_085
- Evidence: **“After payment you can download them directly.”** The ordinary licence restricts vehicle drawings to internal planning/lettering; any other scope requires a special licence. Do not buy, register or harvest previews. D because paid full-access/rights clearance needed; no explicit AI term was found, so not mislabelled as an AI reservation.
- Yield: many thousands of professionally catalogued vehicles likely, but **0 available for this task**; true passenger-car side-view count not verified. Example Octavia page lists multiple model/facelift/body variants; commercial vehicles must be filtered out.
- Quality: clean scaled vector files; help describes ZIP downloads and vector editing. Preview watermarks/resolution not checked.
- Structure: manufacturer → model → year/body/facelift code (`Skod_...`) with technical dimensions and purchase/login flow. Do not crawl full assets.
- Audit: robots/help/terms HTTP200. Robots denies generic `/api/` and many original preview/image paths, permitting only specified test-preview patterns. No Content-signal/named AI block found in full robots. Headers: Apache, text/plain robots; HTML text/html, no Content-signal/AI rights headers. Help/terms/footer checked. Prohibitions on software/template incorporation are also material; no assumption that an ordinary purchase permits model training.

### Deutsches Museum archive Plansammlung (Germany)

- URLs: https://www.deutsches-museum.de/forschung/archiv/bestaende-des-archivs/plansammlung ; terms https://www.deutsches-museum.de/museum/impressum
- Evidence: **“zu nichtkommerziellen, wissenschaftlichen und schulischen Zwecken”** — site terms restrict ordinary use and prohibit publication in databases/Internet without permission. No explicit AI/TDM text found, but commercial research scope and digitized-item availability unresolved. **D, not A merely because works may be old or museum-held.**
- Yield: collection advertises roughly120,000 sheets **across all technical fields**; confirmed downloadable passenger-car side views in audited pages **0**. Do not report120,000 car blueprints. Most example figures concern engines/railways/aircraft.
- Quality: archival scans potentially high resolution; exact car-side scan quality unverified.
- Structure: archive collection overview → online finding aids / digital collection / item rights; most collection count is not a ready image download inventory. Needs a distinct actual car-item search, then per-item licence/author/date check.
- Audit: robots/overview/imprint HTTP200. Generic exclusions for TYPO3, `/uploads/*` and certain query patterns, no Content-signal or named AI block found. HTML/text headers no AI rights signal, nosniff present. Footer imprint checked; no login attempted.

### Auto Catalog Archive (European/international brochures)

- URL https://autocatalogarchive.com/ ; robots https://autocatalogarchive.com/robots.txt
- Evidence: both live responses HTTP403, Cloudflare **“Enable JavaScript and cookies to continue”** challenge. Stopped; no challenge interaction. D, do not infer permissive robots from search results.
- Yield: search-indexed front page claims over60,000 brochures, **not60,000 side views**. Clean line side-view yield unknown; usable current-task count0 without access/rights audit.
- Quality: brochure PDF diagrams may be useful, often dimensions and small multi-view illustrations; source scans vary and no resolution/watermark check completed.
- Structure inferred only from indexed description: make/model brochure library, likely PDF documents. Live page/terms/footer unavailable, so not a crawl-ready recommendation.
- Audit headers: server cloudflare; content-type text/html; challenge server-timing; no actual robots body or terms available. No Content-signal observed on challenge responses, which proves nothing about underlying policy.

## Recommended next steps

1. Use the verified Commons item as an attribution/normalization test and inspect vehicle-blueprint category members individually; reject licences lacking an identified allowed licence or clear PD basis.
2. If training-only sources remain desired, audit Škoda CDN policy and general terms before a small technical-PDF extraction trial. Expect dozens of distinct shapes, not thousands.
3. Exclude Tatra Club; do not spend time on paid ccvision, inaccessible ACA or general archival sheet totals as though they were car-side-view datasets.
