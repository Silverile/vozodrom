# English-language blueprint source research — 2026-10-27

Research only: public HTML, robots and policy pages inspected; no drawing binaries downloaded. HTTP observations below came from direct Node fetch with the research User-Agent, not an inferred search-engine cache. Candidate discovery used generic web search, whose engine is unspecified. An explicit [Google query](https://www.google.com/search?q=car+blueprints+side+view+free+drawings) returned a tool accessibility/Internal Error; this path was stopped. No CAPTCHA bypass or login was attempted. Parent reports Yandex CAPTCHA elsewhere in the swarm.

Classifications are scoped evidence triage, not a conclusion that a statutory exception necessarily applies. A requires the specified actual licence; a vague free or Creative Commons label is insufficient. Estimates below concern passenger-car side views, not all vehicles or all archive files.

## A — documented free-licence seed

### Innerscene Free Parts Library — small CC0 seed

- URL: [Vehicle side A3 sheet](https://www.innerscene.com/tools/library/drawings/vehicle-side-a3-sheet-cad-collection-06900b33). Item explicitly labels **“Public domain (CC0)”** and attributes it to Innerscene's original model. [Library terms](https://www.innerscene.com/tools/library/terms) independently give CC0 dedication for contributors and require ownership of all necessary rights.
- Yield: **1–8 passenger-car side profiles, low confidence**, within a single 11-block mixed vehicle sheet. The description says 11 named blocks, while tags include bus, truck, van and car; 11 must not be reported as eleven eligible cars. No large car archive established.
- Quality: vector DXF, 48 KB, full-size millimetre geometry and named layers, A3 print layout. Expected clean rasterization at any needed scale; watermark absence and actual car detail remain unverified because binary was not fetched. Likely generic architectural vehicles, not labelled factory models.
- Crawl shape: ordinary item URL, preview route `/api/library/<slug>/preview`, download `/api/library/<slug>/download`; sitemaps and category pages rather than search query combinations. Public download link visible without registration; not exercised.
- Policy audit: [robots](https://www.innerscene.com/robots.txt) HTTP200, wildcard `Allow: /`, `Crawl-delay: 3`; search/filter URLs under drawings and 3d-parts disallowed. AI agents Applebot-Extended allowed except admin/filter paths; meta-externalagent restricted only under unrelated `/fixtures/`. No Content-signal or training prohibition observed. Item, library terms and [general sale terms](https://www.innerscene.com/terms-and-conditions) HTTP200; footer copyright notice, privacy and copyright links visible. Item-specific CC0 is the applicable positive licence, not the general footer.
- Headers on checked pages: `content-type: text/html; charset=utf-8`, `server: cloudflare`; no X-Robots-Tag, Content-signal, TDM reservation or TDM-policy response header observed.

## B — local training candidates; no explicit reservation found in checked scope

### Findblueprints — potentially largest candidate, ambiguous licence variant

- URLs: [car catalogue](https://findblueprints.com/catalog/cars), [sample P1800](https://findblueprints.com/catalog/cars/volvo/1961-volvo-p1800-coupe).
- Yield: **roughly 500–3,000 car side views, very low confidence extrapolation**, not an enumerated count. Category chips show 518 Chevrolet and 429 Fiat records but include heavy trucks: first 16 Volvo catalogue rows included 12 passenger-car entries with side metadata, four trucks. Model variants and duplicate sheets will reduce distinct yield. Recommend a metadata count before acquisition.
- Evidence: sample says **“License: Creative Commons”**, but links only to creativecommons.org homepage, with no version, BY/NC/ND restriction or named creator. Therefore **not A**. Site footer reserves rights; [privacy policy](https://findblueprints.com/privacy-policy) contains no explicit TDM/AI or scraping restriction. No separate substantive terms link was found. Footer Copyrights Notification points to the current page's `#`, not an available policy; guessed separate path returned404. B is provisional under the requested no-reservation rubric; rights provenance and any omitted policies need review before a crawl decision.
- [Robots](https://findblueprints.com/robots.txt) HTTP200: only sign-in/up/reset and search-list/listType patterns disallowed; no AI-bot block or Content-signal. Car category and sample public HTTP200. No registration performed; a Download control is visible, but whether the actual original download requires sign-in was not exercised.
- Quality: sample PNG preview and two PNG file records exposed in server-rendered Nuxt state, hosted on S3. Actual pixel resolution and watermark not checked; claimed high-quality marketing text is not validation.
- Crawl shape: `/catalog/cars/<make>/<year-model-slug>`; ordinary make links and item pages; server-rendered Nuxt state contains records, preview URL, file IDs and paths. `/sitemap.xml` advertised. Filter heavy trucks, vans and non-car classes explicitly despite `/cars/` path. Do not invent private endpoints from file IDs.
- Headers: `content-type: text/html; charset=utf-8`, `server: nginx/1.18.0 (Ubuntu)`; robots plain text. No X-Robots-Tag, Content-signal or TDM response headers observed on checked responses.

### Draftsperson CAD blocks — explicit custom permission, not a listed A licence

- URLs: [Car catalogue](https://blocks.draftsperson.net/download-category/car/), [Cobra side-view item](https://blocks.draftsperson.net/download/cobra-side-view/), [License & FAQ](https://blocks.draftsperson.net/license/).
- Yield: **20–60 passenger-car side profiles, low confidence** across four car-category pages and adjacent sports-car category; first page lists 25 items but many are top or front view only, so the full roughly100 listed items are not all useful sides. Multi-view collections may add profiles. Only first page and one item inspected.
- Evidence, combined short quotes: robots says **“AI crawlers and assistants are welcome”**; licence forbids **“Re-host the files for download on another website”**. Custom licence permits personal, educational and commercial finished drawings, modification and team sharing, and requires no credit. It is not CC0/BY/BY-SA, so placed B within this project's four-group scheme. This is stronger positive use permission than a silent archive; standalone source-file republication remains prohibited.
- Policy audit: [robots](https://blocks.draftsperson.net/robots.txt) HTTP200, no Content-signal or AI opt-out. It does prohibit `/search/` and `/*?wpdmdl=` download URLs: **a future crawler must not fetch those blocked endpoints**. Public item licences do not automatically override this crawl rule. Obtain a permitted direct-file route or permission before original acquisition. Footer links licence/privacy and says free personal/commercial use.
- Quality: actual DWG geometry, sample 34.56KB, true-proportion detailed Cobra profile; site states mostly AutoCAD2000 compatibility. Vector render can be high resolution. PNG thumbnails around400px are available; originals preferable. No binary watermark verification performed.
- Crawl shape: WordPress categories `/download-category/car/page/2/` etc., item `/download/<slug>/`, WordPress preview images and download-manager controls. Machine-readable `/llms.txt` and `/llms-full.txt` advertised by robots but not fetched. Rasterize eligible side elevations from DWG on CPU after permitted acquisition.
- Headers on robots, category, licence and item: HTTP200, server LiteSpeed; HTML UTF8/plaintext as appropriate; no X-Robots-Tag, Content-signal or TDM reservation headers observed.

## C — exclude

### The-Blueprints.com

- [Robots](https://www.the-blueprints.com/robots.txt) HTTP200 explicitly puts GPTBot, ClaudeBot, Google-Extended, ChatGPT-User, anthropic-ai and many others in a `Disallow: /` group. Stop: do not acquire content for training. No Content-signal needed to establish exclusion under the user's rubric.
- One prequeued guessed terms URL returned404 and exposed [actual terms URL](https://www.the-blueprints.com/information/termsofuse/); actual terms and drawing pages were not subsequently fetched. Footer indicates login, register, legal licences. Headers Apache2.4.66, plaintext robots, no observed TDM header.
- Eligible yield **unknown, not audited**; search tool itself also reported this domain blocked by robots. Known large archive is not a reason to bypass. Quality and crawler route deliberately not investigated further.

### Drawingdatabase.com

- [Robots](https://drawingdatabase.com/robots.txt) HTTP200, exact line **`Content-signal: search=yes, ai-train=no, use=reference`**. Also GPTBot/ClaudeBot/Google-Extended/CCBot and others disallowed. Excluded, no further pages fetched. LiteSpeed, plaintext; no special training header observed beyond robots body.
- Eligible yield and image quality **not audited**; no crawl recommendation.

## D — do not use without resolving access or item rights

### Outlines / GetOutlines

- [Home](https://v2.getoutlines.com/) explicitly says **“Create an account and download free raster blueprint previews”**; vector drawings sold. No account created, no downloads.
- [Terms](https://v2.getoutlines.com/terms-of-service) HTTP200, footer All rights reserved. `/robots.txt` returns404 HTML, not a valid allowance file; no Content-signal/TDM headers observed. Headers nginx1.29.3 HTMLUTF8. D because acquisition is registration/paywall gated, regardless of whether visible previews can technically be fetched.
- Yield: many makes visible, **eligible public-download car-side yield unestablished**. Quality marketed as editable premium vectors, raster preview resolution/watermark unverified. Structure `/car-blueprints/<make>`, item pages and paid vector products; no crawler recommended.

### US patent databases — potentially useful, not a blanket A designation

- [USPTO terms](https://www.uspto.gov/terms-use-uspto-websites) checked live HTTP200. Patents are usually unencumbered but exceptions exist: copyright notices may be retained, and some drawings are privately contributed. The page also reserves international protection for government material, warns on trademarks and cautions excessive database access. No specific car patent plus its copyright page/drawing was verified this pass, so **D pending per-item review**, not A merely because a patent is old or public.
- [Robots](https://www.uspto.gov/robots.txt) HTTP200 disallows `/images/` and some legacy services; no AI/Content-signal reservation observed. Headers Apache HTMLUTF8/plaintext, no TDM response header observed. A separate patent-content host would require its own robots/terms check.
- Yield: **unquantified** until a whole-car design-patent query and side-view filter are audited. Potentially many but design patents include components and unbuilt concepts; patent count is not usable car-side count.
- Quality: typically monochrome PDF drawings with orthographic views, hatching/figure numbers rather than clean factory dimension sheets; actual example not downloaded. Potential crawler should use official bulk/open data rather than excessive interactive search, preserve publication IDs, and inspect copyright notices before admission.

## Verification limits

No image-resolution or watermark claims above are based on downloaded binaries. No full archive was enumerated. Response-header absence is scoped to checked public pages, not every CDN/image host. This report is not permission to crawl B sources before Claude's decision. The helper `research-en.mjs` prints live policy summaries to stdout only; it is not a bulk crawler.
