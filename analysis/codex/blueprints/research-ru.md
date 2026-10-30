# Russian/Soviet blueprint source research

Checked 2026-10-27. Research only: a few public pages and two image headers/byte metadata samples; no images or HTML persisted. Direct requests used `vozodrom-research/0.1 (https://vozodrom.cz)` and were paced at least 1.1 seconds apart. Group B means no explicit TDM/AI/automation reservation **found in the checked material**, not a legal conclusion or a free licence. No candidate here qualifies for A on the evidence checked.

## Engine access

Yandex was explicitly attempted at `https://yandex.com/search/?text=...` for Russian “car drawings”. The web tool could not access it; a direct request redirected to `/showcaptcha`, HTTP 200, title “Are you not a robot?”. Stopped using Yandex immediately: no CAPTCHA solving, alternate domain retry or bypass. Subsequent discovery used the available web search tool; its underlying engine is not identified, so this worker cannot claim Google coverage. Query examples: “чертежи автомобилей вид сбоку архив blueprints”, “чертежи советских автомобилей скачать чертежи автомобиль архив”, “чертежи автомобилей blueprints ru”.

## B — local training candidates, provisional

### 1. Car Blueprints / Delta-Shadow archive

- URL: <https://carblueprints.narod.ru/>; sample make: <https://carblueprints.narod.ru/gaz.htm>.
- Evidence: [robots](https://carblueprints.narod.ru/robots.txt) has `User-agent: *`, ordinary admin/query exclusions (`Disallow: /*?`) and no `Content-signal`, named AI-bot exclusion or blanket content denial. Root, make page and one image returned HTTP 200. Checked response headers contain no AI/TDM reservation. Footer: “All names, trademarks, logos, photos and blueprints belong to their original owners.” No separate terms link exposed on the root/make pages. A request to click advertising appears; no ad click was performed.
- Estimated yield: **hundreds to low thousands of candidate passenger-car sheets** (low-confidence extrapolation, not a count). Root has about 150 HTML navigation links. GAZ sample has 36 named image links, 35 unique URLs, including trucks and repeated variants; eligible passenger/SUV subset requires filtering. Do not multiply the GAZ count into a claimed total.
- Quality: GIF/JPEG-style legacy scans; sample `images/gaz/gaz-21-volga.gif` is **496×169, 16,239 bytes**, so some single-view drawings are too small for clean 480px targets. Watermark incidence not established; several entries credit the scanning copyright holder. Not a free-licence source.
- Structure: static `<make>.htm` index tables, labels model/year, direct relative `images/<make>/<slug>.gif` original links. Relative URLs easy to normalize; deduplicate by image URL/content, exclude trucks/ambulances if inappropriate. Broad static archive may overlap 3dcar/other historical archives.
- Policy scope: checked robots, root, GAZ page footer and response headers, one image headers. No hidden/global hosting agreement or all-item copyright provenance audited.

### 2. Bakkirill — “Шедевры отечественного автопрома”

- URL: <https://bakkirill.narod.ru/Draw.html>; sample <https://bakkirill.narod.ru/Draw_vaz.html>; context <https://bakkirill.narod.ru/About.html>.
- Evidence: [robots](https://bakkirill.narod.ru/robots.txt) is the same normal uCoz administrative/query exclusion pattern, no AI/TDM signal or named AI blocks. Index, drawing index, VAZ and About pages returned HTTP 200. Headers contain no reservation. About describes a noncommercial retrospective-car resource; no licensing/terms link exposed in checked pages. The archive offers optional higher-quality discs for sale, but the sampled direct image was publicly accessible without registration. No purchase needed or attempted.
- Estimated yield: **roughly 150–250 passenger/SUV candidate drawings**, low confidence, not extracted side-view count. Drawing index explicitly lists VAZ 32, GAZ 50, ZAZ/LuAZ 13, AZLK/Moskvich 11, UAZ 19, ZIL/ZIS passenger 6, other domestic 22 and foreign 115; counts include mixed styles, pickups and duplicates and may be stale. Separate truck/bus/military and parts/NIИAT sections must be skipped or filtered. Sample VAZ page has **26 direct image links**, so even published category count is not a current verified file total.
- Quality: mixed scans GIF/JPEG. Sample `VAZ-2107.gif` is **800×730, 69,395 bytes**; likely multiview sheet, but side-view crop resolution and watermark incidence not certified. Quality varies; dimensions may dominate. No image display or image-data saving was done.
- Structure: static `Draw.html` → `Draw_vaz.html`, `Draw_gaz.html`, `Draw_inomarki_<make>.html` → direct relative `*.gif`/`*.jpg`. Some links use other extensions or capitalization and raw HTML is old/occasionally malformed. Resolve safely and deduplicate; the general index includes engineering parts and non-passenger vehicles.
- Policy scope: checked robots, root, Draw, VAZ, About and sample image headers. No explicit automation/TDM reservation found there; original-source permissions remain separate and not a free licence.

## C — excluded

### AllDrawings

- URL: <https://alldrawings.ru/risunki/item/azlk-moskvitch-2140-1970-moskvich-chertezhi-gabarity-risunki-avtomobilya>.
- [User agreement](https://alldrawings.ru/blog/item/user-agreement), “Пользователю запрещается”: “Использовать любые устройства, программы, процедуры, алгоритмы и методы, автоматические устройства или эквивалентные ручные процессы для доступа, приобретения, копирования или отслеживания содержания Платформы”. This explicitly prohibits automated access/copying. **Exclude; no acquisition.**
- [Robots](https://alldrawings.ru/robots.txt) has `Allow: /` but forbids query paths, `/media` and `/*/item/*/start-download`; no AI names/Content-signal found. Permissive general crawl line does not supersede terms. Root/item/terms response headers checked: no separate AI reservation; HTTP 200.
- Yield: unknown passenger count. Header “Всего: 45532” on drawing item includes other categories and is **not a car-side-view count**. Sample dated 2014 lists a 44KB GIF and eight related Moskvich drawings. Potential large archive, excluded regardless.
- Quality/structure: model/year slug under `/risunki/item/`, image element `#main-image` with `data-src` original URL on `media.alldrawings.ru`; sample GIF multiple views and dimensions, actual pixel resolution/watermark not inspected. No CDN traversal or downloads attempted after terms restriction.

### Art-Grea

- URL: <https://art-grea.ru/downloads/avtotransport>.
- [Terms](https://art-grea.ru/polzovatelskoe-soglashenie) obligation: “не использовать скрипты (программы) для автоматизированного сбора информации и/или взаимодействия с Сайтом и его Сервисами.” **Exclude** for explicit automated collection restriction.
- [Robots](https://art-grea.ru/robots.txt) has normal WordPress exclusions plus query denial, no named AI bots/Content-signal. Index/terms/robots HTTP 200; headers contain no AI signal. Footer links terms. No downloads after restriction found.
- Yield: category shows **58 pagination pages**, mixed cars/trucks/excavators/front/top-only collections; passenger side-view count unknown, potentially dozens to hundreds but unverified.
- Quality/structure: WordPress category `/downloads/avtotransport/page/N`, detail `/download/<slug>`, DWG downloads and PNG previews. Sample preview metadata says 1201×1101 (whole sheet), so side-view resolution lower. Actual watermarks not inspected. CAD rendering/conversion and separating generic symbols from accurate blueprints would be necessary even if permitted.

## D — paid/login or insufficient availability

### Automobile Archive Fund / autoar

- URL: <https://autoar.org/arhivnyy-fond/>; sample <https://autoar.org/arhivnyy-fond/1/kim-10/>.
- [Payment/delivery](https://autoar.org/info/oplata-i-dostavka/) states downloads appear in the buyer account after payment and that registration is required. Quote: “Для доступа к файлам покупатель должен быть зарегистрированным на сайте”. **D, do not use or register.**
- [Robots](https://autoar.org/robots.txt) blocks accounts/checkout/query variants, allows image crawlers, no Content-signal/named AI denial observed. Sample/payment/robots returned 200 and no AI/TDM headers. Public sample footer links privacy; no standalone TDM terms link exposed. Payment gate alone decides D, so no need to investigate commercial access.
- Yield: **unknown usable free side views**. KIM-10 catalogue says 761 documents, mostly chassis/body parts, not 761 car drawings. GAZ-A collection advertised about 3,500 technical documents likewise not full-vehicle side-view count. Public previews few, full collection paid.
- Quality/structure: high-detail archive TIFF/PNG originals behind purchase; public sample images under `/images/watermarked/...`, explicitly watermarked, dimensions in main decorative sample 500×356. Hierarchy `/arhivnyy-fond/1/<model>/` for Soviet passenger vehicles; shop categories/products separate general views from parts. No purchase, account or image acquisition.

## Recommendation

If Claude selects sources, pilot the two static Narod archives locally first with strict deduplication and passenger filtering. Require per-source policy recheck immediately before acquisition. They are supplemental legacy scans, not substitutes for verified free-licensed data, and no permissive copyright licence was found. Archive duplication and small side-view crops are likely major yield reducers. Never count navigation/category totals as accepted side-view pairs.
