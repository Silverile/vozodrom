# Additional blueprint sources — 27 October 2026

Research only, except for the new crawler implementation and its dry run.
No source image was saved to the repository or external data directories.
Five originals were examined in memory (three carblueprints.info sheets and
two Modelist sheets); the Lada original was fetched twice because its first
large preview could not be displayed. No bulk acquisition was performed.

Discovery used the available web search across Russian, English and German
queries. This is not a claim of Google coverage. The parent worker's fresh
Yandex request reached `/showcaptcha`; no further Yandex use was made here.

## B — provisional first-party reservation screen, local training only

### Modelist-Konstruktor.com — estimated 200–350 potential sheets, low confidence

- URLs: [car section](https://modelist-konstruktor.com/avtosalon),
  [about](https://modelist-konstruktor.com/o_proekte),
  [robots](https://modelist-konstruktor.com/robots.txt),
  [sitemap](https://modelist-konstruktor.com/sitemap.xml).
- Robots HTTP 200, text/plain. No AI-bot blocks or Content-Signal/TDM reservation
  in the returned file. Relevant rules are `Disallow: */page/`,
  `Disallow: /wp-`, and `Allow: */uploads`.
  Ordinary article URLs, `/img/` originals, sitemaps and the specifically
  allowed uploads are usable subject to recheck. The crawler never requests
  category pagination, which is disallowed.
- The homepage, car category, about page, Mini and GAZ articles returned 200.
  The visible footer is ordinary copyright, `МОДЕЛИСТ-КОНСТРУКТОР © 2026`.
  The about page describes providing technical drawings and information;
  no AI/TDM, scraping prohibition or free content licence was found there.
  No separate terms link appeared in the checked navigation/footer.
  B records only this limited screen; it is not a legal clearance or a licence.
- Response headers on checked HTML and image responses had no TDM reservation,
  `Content-Signal`, `noai`, `notrain` or AI-specific X-Robots-Tag. HTML was
  `text/html; charset=UTF-8`; originals `image/jpeg`; `x-content-type-options`
  was `nosniff`.
- The car category shows **69 pages**, ten articles on the sampled page:
  approximately 680–690 articles, not drawings. Some articles are adverts,
  trams or photo histories. Search additionally found separate whole-car
  drawing captions for GAZ-12, GAZ-M20, Mini Cooper S, Peugeot 307,
  Moskvich-403, Wartburg 1.3, Fiat 600 and GAZ M-1. On that evidence,
  **200–350 potential sheets is a low-confidence planning estimate**; the
  accepted-pair yield, uniqueness and a minimum of 200 are unverified.
- Structure: WordPress public sitemap index → 15 `post-sitemap*.xml` files →
  direct `/avtosalon/<article>` URLs. Images are in `/img/<id>/<n>.jpg` on older
  posts or `/wp-content/uploads/...` on newer posts. The crawler selects only
  full original URLs whose own IMG alt says a whole-car geometric/overall
  drawing, and excludes parts, photos without such captions, commercial
  vehicles, reduced-size image suffixes and all external hosts. Missing or
  unrecognised captions are deliberately skipped.
- Originals actually checked in memory:
  - [Mini article](https://modelist-konstruktor.com/avtosalon/vozvrashhenie-mini),
    `/img/8104/2.jpg`: **1762×1235**, **479272 bytes**, HTTP 200.
    One car per sheet; four orthographic views; side upper left. Dark filled
    windows/trim and halftone texture, dimension arrows and text. No prominent
    watermark observed.
  - [GAZ-12 article](https://modelist-konstruktor.com/avtosalon/mashina-dlya-nomenklatury),
    `/img/4414/4.jpg`: **2233×1292**, **302107 bytes**, HTTP 200.
    One car per sheet; four views, side upper left. Dense square coordinate
    grid crosses the car and must be removed during pair extraction. No
    prominent watermark observed. These two examples do not establish a
    sitewide watermark policy.

New crawler: `crawl_modelist_konstruktor.mjs`, using the existing paced,
resume-safe `crawl_shared.mjs` client with absolute outside-repo path guard,
robots/header recheck, 404 skip and stop on 403/429/5xx/CAPTCHA.

```powershell
node analysis/codex/blueprints/crawl_modelist_konstruktor.mjs --dry-run --pages 5 --limit 5 --max-minutes 2
node analysis/codex/blueprints/crawl_modelist_konstruktor.mjs --limit 1000 --max-minutes 18
```

Default output is `C:/Workspace/Projects/CF/vozodrom-data/blueprints-modelist-konstruktor/`.
The real crawl was not run in this sandbox. Dry-run final output:

```json
{"source":"modelist-konstruktor","dryRun":true,"stop":"Dry-run page budget","requests":6,"pages":5,"indexed":0,"planned":2}
```

It planned the Mini and GAZ originals above and discovered 15 post sitemaps.
`node --check .../crawl_modelist_konstruktor.mjs` passed. The focused test
`node analysis/codex/blueprints/test_modelist_konstruktor.mjs` passed sitemap
CDATA enumeration, article boundary, caption filtering, non-passenger rejection,
same-origin originals and thumbnail rejection. Real writes, resume/recovery,
and large-crawl yield remain unverified for this source.

### Carblueprints.info — first-party B screen, acquisition held (D quality/provenance)

- [robots](https://carblueprints.info/robots.txt) HTTP 200:
  `User-agent: *`, sitemap, no Disallow or AI/Content-Signal reservation.
  [homepage](https://carblueprints.info/eng),
  [about](https://carblueprints.info/eng/about), Hyundai and BMW make pages,
  and three detail pages were HTTP 200. No AI/TDM prohibition in those
  headers, about text or checked footer. Footer retains original-owner rights.
- Catalogue advertises BMW 395, Citroen 358, Toyota 467, Ford 965, etc.
  Those are catalogue entries and include racing/commercial vehicles,
  duplicates, photographs and low-quality material. A clean-side yield is
  **not established**, despite the much larger nominal inventory.
- Structure is convenient: `/eng/marks/<make>` →
  `/eng/prints/<make>/<slug>` → original anchor `/blueprints/<make>/<slug>.<ext>`.
  `/eng/preview/` is a thumbnail and must not be acquired as an original.
  Detail report forms contain a four-digit confirmation-code image; that is
  a report-submission form, not an access challenge. No form was submitted.
- Three same-host originals fetched without login, inspected only in memory:
  - Ford Mustang 4-Door Wagon 1965: **831×501**, **59603 bytes**, JPEG 200.
    Clean black line sheet: front/rear above, side below; no prominent watermark.
  - Hyundai i30 2011: **265×204**, **36101 bytes**, PNG 200. Photographic views,
    low resolution, visible `www.the-blueprints.com` watermark. Reject this
    item for quality and hold provenance; do not launder an excluded source
    through a mirror.
  - Lada 2106 1975: **2613×1246**, **1176779 bytes**, JPEG 200. Coloured CAD
    sheet with side, top, front and rear, but the side has **no wheels**;
    unsuitable for the requested silhouette-plus-wheel pairing without repair.
- Decision: **no crawler built**. One clean example out of three is insufficient
  to claim ≥200 usable sides with resolved provenance. Do not confuse the
  first-party robots screen with item-rights clearance or source quality.

## C — excluded

### SMCars.net

[robots](https://www.smcars.net/robots.txt) HTTP 200 explicitly contains:

```text
User-agent: *
Content-Signal: search=yes,ai-train=no,use=reference
Allow: /
User-agent: ClaudeBot
Disallow: /
User-agent: GPTBot
Disallow: /
```

The reservation alone excludes it. A homepage request was also made by the
initial diagnostic loop before that output was reviewed; it now returned
unrelated Indonesian gaming material rather than a usable blueprint archive.
No further source access, images or crawler. Current blueprint yield unknown.

### Dimensions.com

[robots](https://www.dimensions.com/robots.txt) HTTP 200 lists only a sitemap;
that is insufficient. [Legal terms](https://www.dimensions.com/legal), as
returned by web search, explicitly state:

> may not be used in datasets for, in the development of, or as inputs to generative A.I. software/programs

The same page prohibits AI training/fine-tuning/evaluation and automated
extraction. Homepage HTTP 200 and headers had no contrary grant. Excluded;
no image acquisition and no crawler. Vehicle catalogue quantity not counted.

## D — unresolved, below threshold or inaccessible

### MK-archive.narod.ru

- [robots](https://mk-archive.narod.ru/robots.txt),
  [home](https://mk-archive.narod.ru/),
  [year index](https://mk-archive.narod.ru/mk-year.htm),
  [model index](https://mk-archive.narod.ru/model.htm) HTTP 200.
  Generic uCoz robots blocks query URLs, auth/admin paths; no AI/Content-Signal
  or TDM reservation observed in the checked text or headers.
- Year index explicitly reports **375 scanned issues of 728**, with page-by-page
  JPEG. This is not 375 car blueprints. Model index mixes aircraft, ships,
  weapons and racing models and offers only sparse car pointers. Its linked
  `mk-avtoModel.htm` returned 404; skipped, no retry.
- Footer says author rights are respected, copyright ReSim Laboratory;
  no free licence or explicit TDM reservation found. Passenger-side yield
  and reliable car-only discovery remain unverified. No crawler without a
  credible ≥200-car estimate. Structure otherwise `/mkYY/mkYYMM/` article/page
  HTML and JPEG scan links; no originals inspected.

### Progiavto.ucoz.ru Vector_Cars_CDR collection

- [robots](https://progiavto.ucoz.ru/robots.txt), homepage and
  [collection article](https://progiavto.ucoz.ru/news/skachat_vector_cars_cdr/2011-02-07-1498)
  HTTP 200. No AI/Content-Signal reservation in the retrieved robots/headers.
- Article claims **1459 CDR drawings across 64 makes**, including trucks and
  buses, five views per car. These are unverified publisher claims, not a
  passenger count or a demonstrated accessible archive. The rendered article
  says download links but the returned anchors did not expose an archive.
  Footer is all-rights-reserved; separate rules/rights pages were not resolved.
  D: delivery and rights screen incomplete, no archive fetch, no crawler.

### Inspired Cakes by Amy — low yield, not a bulk candidate

- [robots](https://www.inspiredcakesbyamy.com/robots.txt) HTTP 200 allows root,
  blocks PetalBot but no named AI-training agents/Content-Signal reservation.
  [library](https://www.inspiredcakesbyamy.com/blueprints) HTTP 200 lists
  **16 distinct named car/ute models**, some duplicate paper sizes, linked PDFs.
- Explicit free library for compatible cake structures, ordinary copyright
  footer; full terms and file permissions not completed because clearly below
  200. D pending complete screen; no PDFs downloaded or crawler built.
  Sheet resolution, watermark and whether all views are usable unverified.

### Legacy referrals

- `https://www.onnovanbraam.com/robots.txt` returned **503**, maintenance HTML;
  stopped immediately, no homepage or asset requests. D.
- `https://www.suurland.com/robots.txt` returned **404**; no policy established,
  stopped under the existing crawler's conservative robots requirement. D.

Archive.org was separately investigated by the parent worker. No new freely
licensed ≥200-passenger-side source was established in this worker's scope.
