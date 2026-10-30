# Car blueprint sources — research checkpoint, 27 October 2026

Three workers researched Russian/Soviet, English, and German/Czech/European
sources. This is research only: **no bulk acquisition, source-asset files,
accounts, purchases or training**. Two small legacy images were inspected in
memory for file dimensions; no image/PDF files were saved. Metadata/HEAD checks
do not establish visual cleanliness or absence of a watermark.

Google and Yandex were explicitly attempted. Yandex redirected to a CAPTCHA;
all workers stopped it. Google returned an inaccessible response or a JavaScript
shell without usable results, and that route was stopped. Discovery continued
with the available web-search tool, whose underlying engine is unspecified.
**This is not a claim of successful Google/Yandex result coverage.** No challenge
was solved and no alternate access method was used to bypass one.

## Classification and ordering

| Group | Source entries | Meaning in this report |
|---|---:|---|
| A | 2 | Identified free licence on specific items; not blanket rights for an archive. |
| B | 5 | Local-training candidates: no explicit reservation found in the checked scope, or positive custom-use permission. |
| C | 6 | Explicit AI/automation exclusion; do not acquire. |
| D | 7 | Access, delivery-host policy or item rights unresolved; do not use yet. |

There are 20 entries including the known 3dcar and Drawingdatabase baselines.
Within groups, measured/estimated side-view yield is ordered high to low;
unmeasured yields follow. C/D sources have no cleared acquisition yield, and
unmeasured inventory is ordered alphabetically. Estimates are **not accepted
training-pair counts** and must not be added together: archives overlap, repeat
variants and mix trucks, parts and other views.

B does not mean that silence establishes the Czech/EU TDM exception, lawful
access or publication rights. It records the requested reservation screen within
the pages/headers actually checked. Targets and originals from B stay local.
The EU-level [Article 4 framework](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX%3A32019L0790)
requires lawful access and respects appropriately reserved rights; a limited
site audit alone does not establish all of those conditions.
The crawl decision remains Claude's; no new source was selected for bulk crawl.

## A — specific freely licensed seeds

### A1. Wikimedia Commons — estimated tens of clean road-car profiles

- **URLs:** [line drawings](https://commons.wikimedia.org/wiki/Category:Line_drawings_of_automobiles),
  [vehicle blueprints](https://commons.wikimedia.org/wiki/Category:Blueprints_of_vehicles).
  **Yield:** three car-side items with individually checked licence metadata;
  perhaps **20–60** useful road-car profiles after wider filtering, low-confidence
  estimate. Live category metadata reports 111 line-drawing files, 249 automobile
  drawing files plus 13 subcategories, and 64 vehicle-blueprint files. Those
  overlapping counts include other views, racing cars, boats and trains.
- **Item evidence:** [Ford Ka](https://commons.wikimedia.org/wiki/File:Ford_ka_blueprint.jpg),
  Franz Blees, own work, worldwide public-domain release; **2432×503**.
  [Cobra side](https://commons.wikimedia.org/wiki/File:Cobra_side.svg), **CC0**,
  based on OpenClipart, nominal **1063×363** SVG.
  [Citroën 2CV](https://commons.wikimedia.org/wiki/File:Citroen-2cv-zianotipo.svg),
  Batix Ezeiza, own work, **CC BY-SA 4.0**, nominal **512×362** SVG.
  CC0's original provenance was not independently reconstructed beyond the
  Commons record. The 2CV description/metadata suggests cyanotype/open-hood
  content, so it may be unsuitable for a closed-body target despite its licence.
- **Policy/headers:** [robots](https://commons.wikimedia.org/robots.txt) HTTP200,
  no named AI-training prohibition or Content-signal found. Ordinary `/wiki/`
  category/file paths are available; general `/w/` and special-page crawling is
  disallowed. Do not treat that as blanket permission to crawl API URLs:
  [Commons API documentation](https://commons.wikimedia.org/wiki/Commons:API)
  separately describes the supported API, and its usage rules must be followed.
  The [reuse guide](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)
  requires verifying each file's licence/provenance; footer text licences do not
  license all media. Checked file/policy responses had no Content-signal,
  X-Robots-Tag or TDM reservation header.
- **Quality/structure:** two scalable SVGs and one wide raster seed; watermarks
  were not visually inspected. Categories → paginated file descriptions →
  original links; retain item author/licence/source chain and share-alike terms.
  Reject deletion/copyright-warning items. Check the original-file host before
  acquisition, or use the documented API under its applicable policy.

### A2. Innerscene — small CC0 CAD seed

- **URL/evidence:** [Vehicle side A3 sheet](https://www.innerscene.com/tools/library/drawings/vehicle-side-a3-sheet-cad-collection-06900b33)
  says **“Public domain (CC0)”**. [Library terms](https://www.innerscene.com/tools/library/terms)
  independently dedicate contributions under CC0 and require contributor rights.
- **Yield/quality:** **1–8 passenger-car sides**, low confidence, within **one
  11-block mixed vehicle sheet**; not eleven proven car profiles. A 48KB DXF with
  millimetre geometry/layers should rasterize cleanly, but actual geometry and
  watermarks were not inspected. Likely generic architectural vehicles rather
  than factory model-specific drawings.
- **Policy/headers:** [robots](https://www.innerscene.com/robots.txt) HTTP200,
  wildcard `Allow: /`, **`Crawl-delay: 3`**, with admin/filter/search restrictions;
  no relevant AI reservation found. Item/library/general terms checked; ordinary
  copyright footer does not override item CC0. Cloudflare HTML responses had no
  Content-signal, TDM reservation or X-Robots-Tag observed. A future crawler must
  respect the three-second delay, not the generic research helper's 1.1 seconds.
- **Structure:** item/category/sitemap discovery; public preview and download
  links under `/api/library/<slug>/...`. Download route was not exercised; verify
  its path policy before acquisition. Source-side CAD rendering will be needed.

## B — scoped local-training candidates

### B1. Findblueprints — potentially hundreds to a few thousand

- **URLs:** [cars](https://findblueprints.com/catalog/cars),
  [Volvo P1800 sample](https://findblueprints.com/catalog/cars/volvo/1961-volvo-p1800-coupe),
  [privacy](https://findblueprints.com/privacy-policy).
  **Yield:** tentative **500–3000** car-side records, very low confidence, not an
  enumeration. Catalogue chips show 518 Chevrolet and 429 Fiat records; a
  16-row Volvo sample contained 12 passenger-car entries with side metadata and
  four trucks. These observations cannot establish the total clean-side yield.
- **Evidence:** sample says **“License: Creative Commons”** but supplies no
  licence variant/version and points only to the CC homepage: **not A**. Footer
  reserves rights; checked privacy/footer pages expose no explicit TDM/AI/scrape
  ban. The Copyrights Notification link is `#`, not a substantive policy.
  B is provisional: original-download access and omitted policies need checking.
- **Robots/headers:** [robots](https://findblueprints.com/robots.txt) HTTP200,
  sign-in/reset/search/filter paths restricted, no AI-bot block/Content-signal
  found. Public category/item HTTP200; nginx HTML headers contained no observed
  TDM or X-Robots-Tag reservation. Image S3 host policy remains unchecked.
- **Quality/structure:** PNG previews and two PNG file records appear in Nuxt
  server state; dimensions/watermarks unverified. Make/model slugs plus sitemap
  and public item links supply metadata. Heavy trucks occur even under `/cars/`.
  Do not invent private endpoints or assume that the visible Download control
  permits anonymous originals. A metadata inventory is the next useful step.

### B2. Car Blueprints / Delta-Shadow — hundreds to low thousands, uncertain

- **URLs:** [archive](https://carblueprints.narod.ru/),
  [GAZ sample](https://carblueprints.narod.ru/gaz.htm).
  **Yield:** hundreds to low thousands of passenger candidate sheets, low-
  confidence extrapolation. Approximately 150 navigation links; sampled GAZ
  page has **35 unique image URLs**, including trucks and duplicates/variants.
- **Evidence/policy:** footer assigns names/images/drawings to their original
  owners; no free licence or separate terms link found. [Robots](https://carblueprints.narod.ru/robots.txt)
  has ordinary admin/query exclusions, including `Disallow: /*?`, and no AI or
  Content-signal reservation found. Root/make/sample HTTP200; checked response
  headers showed no TDM/AI restriction. Host-wide agreements were not audited.
- **Quality/structure:** static `<make>.htm` → `images/<make>/*.gif` or JPEG.
  One in-memory GAZ-21 metadata sample is **496×169**, limiting output detail;
  watermark incidence unknown. Resolve old relative links, deduplicate content,
  exclude truck/ambulance variants. Likely overlaps other legacy archives.

### B3. Bakkirill — approximately 150–250 passenger candidates

- **URLs:** [drawing index](https://bakkirill.narod.ru/Draw.html),
  [VAZ sample](https://bakkirill.narod.ru/Draw_vaz.html),
  [About](https://bakkirill.narod.ru/About.html).
  **Yield:** **150–250** passenger/SUV drawings, low confidence. Published category
  counts include VAZ32, GAZ50, Moskvich11 and foreign115, but contain non-car
  material and stale counts; VAZ sample exposes only **26 direct image links**.
- **Evidence/policy:** noncommercial historical archive, no free licence or
  separate terms exposed. [Robots](https://bakkirill.narod.ru/robots.txt) uses
  ordinary administrative/query restrictions without observed AI signal.
  Public index/VAZ/About/sample HTTP200; no TDM/AI header found. Optional discs
  for sale are irrelevant to the publicly accessible sampled files.
- **Quality/structure:** static `Draw*.html` pages and direct GIF/JPEG links.
  Sample VAZ-2107 sheet **800×730**; its actual side crop is smaller. Watermarks
  unknown. Separate truck/bus/parts sections and duplicate foreign sheets must
  be filtered; filenames and malformed legacy HTML need normalization.

### B4. Draftsperson — approximately 20–60 sides, download-route caveat

- **URLs:** [cars](https://blocks.draftsperson.net/download-category/car/),
  [Cobra side](https://blocks.draftsperson.net/download/cobra-side-view/),
  [licence](https://blocks.draftsperson.net/license/).
  **Yield:** **20–60** passenger-car sides, low confidence; four category pages,
  25 entries on the sampled page, many front/top-only. Not roughly100 verified
  sides. The custom licence permits finished personal/commercial drawings and
  modifications, but is not an A-listed licence.
- **Evidence/policy:** [robots](https://blocks.draftsperson.net/robots.txt) says
  **“AI crawlers and assistants are welcome”**. Licence prohibits **“Re-host the
  files for download on another website”**. Crucially robots disallows
  **`/*?wpdmdl=`**, the visible download-manager route; no use of that route is
  recommended. A permitted direct route or source permission is needed before
  acquiring originals. No Content-signal/TDM header found on checked HTTP200
  robots/category/item/licence pages; server LiteSpeed. Footer links licence.
- **Quality/structure:** 34.56KB sample DWG; vector geometry, mostly AutoCAD2000
  compatibility, about400px PNG thumbnails. Watermarks unverified. WordPress
  category pagination → download item → permitted original route if established;
  rasterize side elevations locally. Positive custom permission is stronger
  than silence but does not remove its redistribution/path restrictions.

### B5. 3dcar.ru — existing baseline, yield not counted here

- **URLs:** [blueprints](https://3dcar.ru/blueprints),
  [robots](https://3dcar.ru/robots.txt), public registration/footer checked in
  the previous checkpoint. Evidence: **`User-agent: *` / `Allow: *`**, no explicit
  AI/TDM reservation found in that inspected scope; footer limits ordinary use
  to familiarization. No separate terms links were exposed; no reservation
  header found then. **Not re-audited this turn**; Claude's selected crawl is
  already running and was not touched.
- **Yield/quality:** no independent passenger-side inventory this turn. The
  800–1500 figure was a target, not a measured archive count. Legacy multiview
  rasters, variable detail/watermarks; earlier metadata described a 1700×1000
  Alfa sheet, not a 1700px side crop.
- **Structure:** `/blueprints/<make>/<model>` →
  `/media/blueprints/full/<make>/<file>`; direct public originals. Deduplicate
  variants, filter non-passenger categories and recheck policy before new runs.

## C — excluded; no cleared yield, archive-side counts unmeasured

### C1. AllDrawings

- **URL:** [Moskvich sample](https://alldrawings.ru/risunki/item/azlk-moskvitch-2140-1970-moskvich-chertezhi-gabarity-risunki-avtomobilya).
  [Agreement](https://alldrawings.ru/blog/item/user-agreement) prohibits automated
  access/copying; short evidence: **“автоматические устройства или эквивалентные
  ручные процессы для доступа, приобретения, копирования”**.
- [Robots](https://alldrawings.ru/robots.txt) permits ordinary root crawling but
  blocks `/media` and download patterns. HTTP200 terms/robots/item, no separate
  AI header found. Terms prohibition determines C regardless of permissive root.
- **Yield/quality/structure:** no usable acquisition under this screen. 45,532
  general drawings is not a car-side count. Sample 44KB GIF, multiview/dimensions,
  pixel resolution/watermark unverified. `/risunki/item/` → image metadata/CDN;
  no crawler or asset fetch recommended.

### C2. Art-Grea

- **URL:** [vehicle category](https://art-grea.ru/downloads/avtotransport).
  [Terms](https://art-grea.ru/polzovatelskoe-soglashenie) say **“не использовать
  скрипты (программы) для автоматизированного сбора информации”**.
  [Robots](https://art-grea.ru/robots.txt) ordinary WP/query restrictions;
  HTTP200 terms/robots/index and no separate TDM header found. Footer links terms.
- **Yield/quality/structure:** 58 mixed vehicle-category pages, actual passenger
  sides unknown; DWG with PNG previews, one whole-sheet preview metadata
  1201×1101, watermark not inspected. WP category pagination → `/download/slug`.
  Explicit automated collection prohibition; do not acquire.

### C3. Drawingdatabase — known exclusion reverified

- **URL/evidence:** [robots](https://drawingdatabase.com/robots.txt), HTTP200:
  **`Content-signal: search=yes, ai-train=no, use=reference`** and named AI bots
  disallowed. No additional pages/terms/assets fetched after this decisive rule.
  LiteSpeed/plaintext; no separate observed reservation header beyond robots.
- **Yield/quality/structure:** not audited after exclusion. No permitted
  acquisition recommendation; a large generic drawing inventory is immaterial.

### C4. Espacenet interactive interface — automation prohibited

- **URL/evidence:** [EPO fair-use charter](https://www.epo.org/en/service-support/ordering/fair-use)
  calls the graphical interfaces **“for human users only”** and says
  **“Automated searches (robots) are not supported”**.
  [Website terms](https://www.epo.org/en/terms-of-use/terms-and-conditions-use-website-european-patent-office)
  point bulk use to the separate services. This C finding is about the GUI
  retrieval route, not a claim that every patent drawing bans training.
- [Robots](https://www.epo.org/robots.txt) HTTP200, one-second delay, ordinary
  search/admin restrictions; checked robots/charter Cloudflare responses have
  no observed Content-signal/TDM header. Terms/footer policy checked through
  official pages. Do not automate Espacenet; separate publication-server REST
  or OPS routes would require their own access/terms and item-rights review.
- **Yield/quality/structure:** car-side yield unmeasured; design patents often
  contain whole-car views but also components, hatching, captions and concepts.
  Publication/figure metadata → document pages; no car patent acquired or
  declared free this turn.

### C5. Tatra Club

- **URL:** [manuals](https://www.tatra-club.com/manuals.php?kols=10).
  [Robots](https://www.tatra-club.com/robots.txt) explicitly groups **GPTBot,
  ClaudeBot, OAI-SearchBot with `Disallow: /`**. HTTP200/nginx; no separate
  Content-signal header needed. Terms route also disallowed, so no further
  terms/document requests after identifying the exclusion.
- **Yield/quality/structure:** search-listed T57 PDFs of 28 and260 pages are
  mostly component material, not verified side-view counts; scan resolution and
  watermarks unknown. Paginated manuals table → document links. Excluded.

### C6. The-Blueprints.com

- **URL/evidence:** [robots](https://www.the-blueprints.com/robots.txt), HTTP200:
  GPTBot, ClaudeBot, Google-Extended, ChatGPT-User and others → **`Disallow: /`**.
  Apache headers, no separate TDM header needed. No subsequent drawing/actual
  terms fetch after exclusion; a prequeued guessed terms URL had returned404.
  Actual [terms link](https://www.the-blueprints.com/information/termsofuse/)
  was identified but not followed further.
- **Yield/quality/structure:** potentially large but uncounted car inventory;
  resolution/watermarks and original routes deliberately not audited. No crawl.

## D — unavailable or unresolved; do not use yet

### D1. Auto Catalog Archive

- **URLs:** [home](https://autocatalogarchive.com/),
  [robots](https://autocatalogarchive.com/robots.txt).
  Both HTTP403 Cloudflare challenges; stopped without bypass. Actual robots,
  terms and footer unavailable. Challenge headers are not underlying permissions.
- **Yield/quality/structure:** 60,000 advertised brochures is not a side-view
  count. Eligible sides unknown; variable PDF scans/diagrams, watermarks unknown.
  Indexed make/model brochure structure only; not a verified crawl route.

### D2. Autoar / Automobile Archive Fund

- **URLs:** [archive](https://autoar.org/arhivnyy-fond/),
  [KIM-10 sample](https://autoar.org/arhivnyy-fond/1/kim-10/),
  [delivery terms](https://autoar.org/info/oplata-i-dostavka/).
  Evidence: **“покупатель должен быть зарегистрированным на сайте”**; paid full
  files delivered to a buyer account. No account or payment attempted.
- [Robots](https://autoar.org/robots.txt) normal account/checkout/query exclusions,
  no observed AI signal; checked pages HTTP200, no TDM header found. Payment
  restriction decides D, regardless of silent AI policy.
- **Yield/quality/structure:** 761 KIM documents/3500 GAZ-A documents are mostly
  parts, not car sides. Cleared public-download yield unknown. Paid TIFF/PNG
  archive, small explicitly watermarked public previews around500×356.
  Model collections → shop/document items; no original crawler recommended.

### D3. ccvision CAR-SPECIAL

- **URLs:** [help](https://www.ccvision.de/en/service/help/car-special.html),
  [terms](https://www.ccvision.de/en/service/gtc.html).
  Evidence: **“After payment you can download them directly.”** Ordinary licence
  is limited to specified internal planning/lettering purposes; broader uses
  need additional rights. Not an identified free licence.
- [Robots](https://www.ccvision.de/robots.txt), help/terms HTTP200; API and many
  original/preview paths restricted, no named AI block/Content-signal found.
  Apache responses had no observed TDM header. Footer/imprint checked.
- **Yield/quality/structure:** many thousands of catalogued vehicle variants
  likely, passenger-side count unverified and not available under this task.
  Scaled vector ZIPs, watermarks not inspected; make/model/year/body codes →
  purchase/login. Do not buy or harvest previews.

### D4. Deutsches Museum Plansammlung

- **URLs:** [collection](https://www.deutsches-museum.de/forschung/archiv/bestaende-des-archivs/plansammlung),
  [imprint/terms](https://www.deutsches-museum.de/museum/impressum).
  Ordinary use described as **“zu nichtkommerziellen, wissenschaftlichen und
  schulischen Zwecken”**; database/Internet republication restricted. Actual
  downloadable car-item rights and availability remain unresolved; not A by age.
- [Robots](https://www.deutsches-museum.de/robots.txt) HTTP200, TYPO3/uploads/query
  restrictions; no explicit AI signal found. Overview/imprint headers had no
  observed TDM/Content-signal reservation; footer terms checked.
- **Yield/quality/structure:** 120,000 sheets covers all engineering fields,
  **zero specific downloadable car-side items verified**. Scan quality and
  watermarks unknown. Finding aids/digital collection → item-specific rights;
  broad collection total is not a training inventory.

### D5. Outlines / GetOutlines

- **URLs:** [home](https://v2.getoutlines.com/),
  [terms](https://v2.getoutlines.com/terms-of-service).
  Evidence: **“Create an account and download free raster blueprint previews”**;
  vectors are sold. No registration or download attempted.
- Robots returned404 HTML, not a permission statement; home/terms HTTP200,
  nginx headers with no observed AI signal, copyright footer. Access gate
  suffices for D; no hidden-asset route recommended.
- **Yield/quality/structure:** potentially large catalogue, eligible anonymous
  originals unestablished; premium vectors/raster previews, pixel quality and
  watermark unverified. Make pages → car items → account/purchase flow.

### D6. Škoda Storyboard technical PDFs — delivery-host audit unresolved

- **URLs:** [Octavia model page](https://www.skoda-storyboard.com/cs/skoda-model/octavia/),
  [2025 specification PDF](https://cdn.skoda-storyboard.com/2025/02/Octavia_EN_ed9ab7ae.pdf),
  [2019 specification PDF](https://cdn.skoda-storyboard.com/2019/12/TD-OCTAVIA-en.pdf).
  Two documents are confirmed by indexed text to contain dimensional side views;
  potential **20–80 distinct shapes**, low-confidence extrapolation across models.
- **Policy decision:** the worker's model-page-only screen was provisionally B,
  but the parent's delivery-host check returned **HTTP403 AccessDenied for
  `cdn.skoda-storyboard.com/robots.txt`**. Under the requested conservative
  classification, **D until delivery-host policy is resolved**, not a cleared B.
  PDF HEAD requests returned200/application-pdf with no TDM signal; no PDF body
  fetched. These headers do not resolve the inaccessible robots policy.
- Model-page robots is ordinarily permissive outside admin paths; footer grants
  a press/news licence, not an A licence. No explicit AI restriction found in
  checked model-page headers/footer, but full company-wide rights remain scoped.
- **Quality/structure:** manufacturer PDF technical outlines, dimensions,
  occupants and some colour; watermark absence/vector extraction not inspected.
  Model/media-kit pages → dated CDN PDF attachments; language/engine/body
  variants heavily duplicate geometry. No acquisition until policy resolution.

### D7. USPTO/patent archives — no blanket public-domain clearance

- **URLs:** [USPTO terms](https://www.uspto.gov/terms-use-uspto-websites),
  [robots](https://www.uspto.gov/robots.txt). Both HTTP200; ordinary image/legacy
  path restrictions, no observed AI/Content-signal/TDM header. Terms retain
  copyright/trademark exceptions and caution excessive access. Separate patent
  content hosts need separate checks. No actual whole-car patent was cleared.
- **Correction to the initial premise:** patent availability/expiration is not
  copyright clearance. The [U.S. Copyright Office, Compendium §717.3](https://www.copyright.gov/comp3/chap700/ch700-literary-works.pdf#page=32)
  explicitly allows copyright claims in patent drawings containing sufficient
  authorship. Thus old/publicly searchable patents are not automatically A;
  verify the actual document, notices, applicable term and retrieval rights.
- **Yield/quality/structure:** car-side count unknown; design patents include
  orthographic monochrome figures, but also components, concepts, hatching and
  figure labels. Use an authorized official data route only after per-item
  rights review, not a guessed bulk search/PDF endpoint.

## Decisions and limits

1. Best free seeds: the three individually licensed Commons files and the small
   Innerscene sheet; inspect actual geometry before treating them as pairs.
2. Best volume leads if Claude selects a pilot: Findblueprints and the two Narod
   archives. First count metadata, verify permitted original routes, then measure
   usable resolution/duplicate rate. Existing 3dcar crawl was not touched.
3. Draftsperson is a useful CAD lead only if a robots-permitted original route
   exists. Do not fetch its blocked download-manager URLs.
4. C stays excluded. D stays on hold. No new bulk-source choice was made here.

The regional reports retain the longer evidence and audit scope:
[Russian](research-ru.md), [English](research-en.md), [European](research-eu.md).
The final classification above supersedes the worker's provisional Storyboard B.
Helpers only print research diagnostics; do not blindly rerun whole URL lists
after a reservation/challenge is discovered. Respect site-specific delays.

## Existing crawler patch review

The peer's three 404 handlers in `crawl.mjs` are **kept unchanged**. A single dead
category, item or image can be skipped; other non-200 errors still propagate to
the stop path. The audit's missing policy pages still stop. `node --check` and
the existing crawler unit checks passed; no live dataset crawl/resume test was
run and Claude's external tools/crawl were untouched.

The copy-location issue is confirmed: `common.mjs` derives its guard root from
its own directory. In-repo it resolves to `C:\Workspace\Projects\CF\vozodrom`;
copied into the external `tools` folder it resolves to `C:\Workspace\Projects`.
Therefore do not overwrite Claude's corrected external copy with this original
relative-root version. No crawler/guard code was changed during this research.

## 27 October 2026 continuation: Commons crawler and additional archives

No real dataset crawl was run. No source image/HTML was saved in the repository.
The following additions are sorted A/B/C/D; estimates are not accepted-pair counts.
Full regional audit and sample evidence: [research-extra.md](research-extra.md).

### A — Commons, now with a crawler

New script: `crawl_commons.mjs`. It enumerates `categorymembers`, follows
continuation tokens, recurses to depth 3, and requests imageinfo in batches of
50 with `iiprop=url|size|extmetadata`, `iiurlwidth=2000`, `maxlag=5`.
Seven seeds include the five requested names plus the existing
`SVG profile drawings of automobiles` and `Drawings of automobiles` categories.
Missing/empty categories simply exhaust. Category membership never grants a
licence: each file needs explicit PD/CC0/CC BY/CC BY-SA metadata. BY entries
also need an author and a matching Creative Commons licence URL/version.
NC/ND, GFDL-only and unspecified licences are skipped. The index retains author,
credit, licence, licence URL/evidence, original URL, source page and category.
Known non-passenger vehicles, components, photographs and renders are filtered.
This is metadata screening, not a guarantee of clean side-view training pairs;
every candidate is marked `sideViewVerified:false`.

Policy checked live: [Commons robots](https://commons.wikimedia.org/robots.txt),
[upload robots](https://upload.wikimedia.org/robots.txt),
[official API guide](https://commons.wikimedia.org/wiki/Commons:API), and
[reuse guidance](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia).
No AI/TDM reservation found on these responses. Commons robots has a generic
`Disallow: /w/`. The script uses a narrow exception for the documented,
expressly requested `/w/api.php?action=query` API; it does not bypass robots for
HTML or media. The action and maxlag values cannot be overridden by callers.
Other refusals, API errors/maxlag, CAPTCHA and reservations stop the run.

Current API SVG thumb URLs use `thumb.wikimedia.org`, whose robots URL returns
301 to the Commons homepage. The identical render path on the official
`upload.wikimedia.org` host returned PNG 200 and is allowed by that host's
robots (`Disallow: /wikipedia/commons/archive/` only). The crawler uses this
verified media route, retaining the API render URL as provenance. A 2000px
request currently selects a **3840px** render; record actual PNG dimensions,
not the API's reported display width. No third-party render service is used.

Latest live dry-run output (5 API queries, 9 total paced requests):

```json
{"source":"commons","dryRun":true,"stop":"Dry-run API query budget","requests":9,"queries":5,"indexed":0,"planned":63,"categoriesRemaining":8,"filesRemaining":11}
```

Ten planned candidates were SVG-to-PNG renders; ten other metadata records were
rejected as non-passenger/components. The 63 candidates are licence-qualified
plans, not 63 unique useful sides or new training pairs. No images were saved.
The useful eventual yield remains unmeasured; earlier 20–60 usable-side estimate
is still only an estimate.

Layout actually inspected in memory:
[Cobra side.svg](https://commons.wikimedia.org/wiki/File:Cobra_side.svg), CC0,
one clean side elevation, front to the **right**, no visible watermark or
dimensions. PNG is **3840×1311 with transparency**: black lines disappear on
a black matte. Flatten alpha onto WHITE before grayscale/threshold extraction;
retain the original untouched in raw. Other Commons candidates include magazine
pages, multi-view sheets and non-side drawings; they require extraction QA.
Numerical check: Cobra PNG alpha extrema are `(0,255)`; direct PIL grayscale
extrema `(0,0)` versus `(0,255)` after white compositing. The current external
`vozodrom-data/tools/bp_pairs.py:54` PIL fallback uses `.convert("L")` directly;
its `read_gray` function needs alpha-aware loading before training on these
renders. That external file was read only and is left for Claude to update.

### B — Modelist-Konstruktor: new crawler, estimated 200–350 potential sheets

[Car section](https://modelist-konstruktor.com/avtosalon),
[about](https://modelist-konstruktor.com/o_proekte),
[robots](https://modelist-konstruktor.com/robots.txt).
Approximately 680–690 car-section articles inferred from 69 category pages;
not all contain drawings. **200–350 potential sheets is a low-confidence planning
estimate**, supported by multiple whole-car drawing captions and two inspected
originals. No minimum accepted yield or uniqueness has been established.

No AI/TDM reservation found in checked robots, headers, footer/about/articles;
ordinary copyright is retained. This is a provisional training-only screen,
not a free licence or legal clearance. Robots blocks `*/page/`, so the crawler
enumerates the public sitemap and direct `/avtosalon/<article>` URLs instead.
It starts with the about page, selects only full original same-host images
with whole-car drawing captions, and excludes parts/photos/trucks/thumbnails.
No disallowed category pagination is requested.

`crawl_modelist_konstruktor.mjs` live dry run, independently rerun by root:

```json
{"source":"modelist-konstruktor","dryRun":true,"stop":"Dry-run page budget","requests":6,"pages":5,"indexed":0,"planned":2}
```

The Mini sheet is 1762×1235, GAZ-12 2233×1292: one car, four orthographic views,
side upper left. Mini has dark filled trim/halftone and dimension annotations;
GAZ has a dense coordinate grid. No prominent watermark in those two samples.
Extractors must handle the grid and filled dark regions. See the regional
report for exact image URLs and evidence.

### C — excluded additions

- [SMCars robots](https://www.smcars.net/robots.txt): explicit
  `Content-Signal: search=yes,ai-train=no,use=reference`, plus named AI-bot
  disallows. Excluded; no crawler or source images acquired.
- [Dimensions legal terms](https://www.dimensions.com/legal): explicit prohibition
  on AI datasets/training and automated extraction. Excluded despite the absence
  of a robots AI block; no crawler or source images acquired.

### D — held additions

- [Carblueprints.info](https://carblueprints.info/eng): thousands of nominal
  entries, no first-party reservation found, but clean-side yield and provenance
  are unresolved. Three samples included one clean Mustang sheet, a 265×204
  photographic Hyundai sheet bearing the excluded The-Blueprints watermark,
  and a large Lada CAD sheet missing wheels. No crawler built; do not treat
  mirrors as a way around an excluded original source.
- [Internet Archive](https://archive.org): robots 200 only disallows `/control/`
  and `/report/`, no AI signal in checked response. Advanced-search query
  `(title:(car blueprints) OR title:(automobile drawings) OR subject:(car blueprints))`
  returned four records: unrelated map, railway vehicle, and two scans of the
  same 1900 Hiscox book. Item metadata for
  [UC scan](https://archive.org/metadata/horselessvehicle00hiscrich) and
  [Toronto scan](https://archive.org/metadata/horselessvehicle00hiscuoft) says
  `possible-copyright-status: NOT_IN_COPYRIGHT`, but has no explicit licence URL.
  Both have 492 scanned pages, not 492 car sides. The live terms route now serves
  a JavaScript-required shell, so the terms/item-rights/usable-yield audit remains
  incomplete. No site-wide A/B classification and no crawler.
- Additional personal sites/mirrors and European leads are held in
  [research-extra.md](research-extra.md); none established ≥200 eligible sides.

A fresh Yandex request returned 302 to `/showcaptcha`. Yandex use stopped;
no CAPTCHA was opened, solved or bypassed. Discovery used the available web
search, not a verified claim of Google coverage. Findblueprints and the running
3dcar crawl were not touched.

### Commands and verification

```powershell
node analysis/codex/blueprints/crawl_commons.mjs --dry-run --pages 5 --limit 100 --max-minutes 2
node analysis/codex/blueprints/crawl_commons.mjs --limit 2500 --max-minutes 18
node analysis/codex/blueprints/crawl_modelist_konstruktor.mjs --dry-run --pages 5 --limit 1000 --max-minutes 2
node analysis/codex/blueprints/crawl_modelist_konstruktor.mjs --limit 1000 --max-minutes 18
```

Defaults write outside the repository to `blueprints-commons` and
`blueprints-modelist-konstruktor` under `C:/Workspace/Projects/CF/vozodrom-data/`.
Only dry runs were executed here. Both share the absolute repository path guard,
serial 1100ms pacing, descriptive User-Agent, per-run policy/header audit,
404 skips and stop-on-other-refusal handling. Commons has its own state queue,
hash-deduplicated index and sidecar recovery; Modelist uses the existing shared
engine. To relocate scripts, copy their `common.mjs` and `crawl_shared.mjs`
dependencies too. The guard remains anchored to the absolute project root.
Focused Commons and Modelist tests and existing source-crawler regression tests
passed. Actual external writes/crash recovery and large-crawl yield remain
unverified. No generator training was performed by this worker.
