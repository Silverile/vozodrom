import fs from 'node:fs';
const path='analysis/codex/generation-migration-2026-10-31.json';
const r=JSON.parse(fs.readFileSync(path,'utf8'));
r.sourcesChecked=[
  {url:'https://www.hyundai.com/kr/ko/brand/brandstory/model/tucson-history',supports:'Official historical launches in 2004, 2009, 2015 and 2020; launch history does not establish every market-specific production end.'},
  {url:'https://www.hyundaimotorgroup.com/ko/news/hyundai-motor-company-all-new-tucson-debut',supports:'Manufacturer explicitly identifies fifth generation, September 2026 reveal.'},
  {url:'https://www.hyundai.news/uk/articles/press-releases/all-new-hyundai-tucson-october-2026.html',supports:'European announcement in October 2026; specifications subject to homologation.'},
  {url:'https://prod2-press.kia.com/eu/en/home/media-resouces/press-releases/2021/Kia-Ceed-range-gets-extensive-design-tech-and-powertrain-upgrades.html',supports:'Third generation, facelift 2021; hatchback, Sportswagon and shooting brake are bodies of the same family.'},
  {url:'https://www.kia.com/content/dam/kwcms/kme/hu/hu/assets/contents/utility/Brochure/price-list/kia-k4-arlista.pdf',supports:'Official January 2026 K4 price list names replacement of Ceed trim lines; supports retaining ended status rather than marking current. Exact end remains the existing source-backed 2026 bound.'},
  {url:'https://www.volkswagen-newsroom.com/en/caddy-i-19821992-19678',supports:'European Caddy I 1982–1992; earlier US Rabbit introduction in 1979.'},
  {url:'https://www.volkswagen-comerciales.es/comunicacion/2021/02/05/el-nuevo-caddy-presenta-la-gama-mas-completa-para-uso-profesional-y-de-ocio-e-introduce-asistentes-a-la-conduccion-ineditos-en-su-segmento/',supports:'Manufacturer generation convention: II 1995–2003, III from 2003, IV 2015–2020, V from 2020.'},
  {url:'https://cdn.uc.assets.prezly.com/4a57e91b-6e4e-4312-9415-d90b14923bdb/-/inline/no/new-caddy-datasheet-for-press-drive-munich-october-2020-en.pdf',supports:'Manufacturer press sheet distinguishes Caddy III facelift from Caddy IV and notes South African I through 2007.'},
  {url:'https://cs.wikipedia.org/wiki/BMW_%C5%99ady_5',supports:'Requested eight-generation structure, inclusive sedan/Touring periods. E28 heading conflicts with its own infobox; use 1981–1988 infobox interval, corroborated by manufacturer search extract.'},
  {url:'https://www.bmw.co.uk/content/bmw/marketGB/bmw_co_uk/en/all-models/bmw-5-series-overview.html',supports:'Eight-generation manufacturer history, launch years and documented facelift years. E28 end differs (1987); G30/G31 end not given on the still-partly-stale page.'},
  {url:'https://www.press.bmwgroup.com/slovenia/article/attachment/T0264861SL/373560',supports:'Search-indexed official historical extract gives E28 end June 1988.',limitation:'Direct open redirects to BMW global newsroom; PDF contents not downloaded or independently inspected.'},
  {url:'https://cs.wikipedia.org/wiki/Audi_A6',supports:'Human reference for C4 onward; fetched Czech article does not yet cover C9.'},
  {url:'https://www.audi.pl/pl/stories/technologia/audi-a6-rozwoj-i-ewolucja-kultowego-modelu/',supports:'Official six-generation C4–C9 history and year intervals; simplified C5 table ends 2004.'},
  {url:'https://www.presseportal.de/pm/6730/642581',supports:'Audi AG January 2005 press release confirms new C6 Avant production only began that January; old C5 2005 end retained from existing sourced record.'},
  {url:'https://www.servicesolutions.mahle.com/media/service-solutions-eu/product-lines/topnews/topnews-mahle_en-4.pdf',supports:'Primary diagnostic-tool manufacturer publication explicitly lists A6 [2025] (4L), separately from A6 e-tron.'}
];
r.unverified=[
  'No website build or browser rendering was run; Claude owns page review/publishing.',
  'Tucson V exact series-production start, Czech availability and NX4 end remain unverified. Old placeholder dimensions and stale August reveal note were removed.',
  'BMW family drawing could not be assigned confidently; original file remains unchanged on disk without an active drawing entry or review key. The former index 0 now belongs to E12 and must not carry the retired drawing review flag.',
  'BMW G31 exact final-production date remains unresolved; 2017–2023 follows the requested Czech series overview, with an explicit review note.',
  'All engine values inherited from prior cards were preserved, not independently re-researched. New historical BMW cards intentionally leave technical gaps empty.',
  'Drawing-stage assignments are visual review judgments; no newly generated images or image-generation credits were used.'
];
r.validation=JSON.parse(fs.readFileSync('analysis/codex/generation-migration-validation.json','utf8'));
r.validation.typecheck='npm run typecheck: PASS';
r.validation.whitespace='git diff --check: PASS (line-ending notices only)';
fs.writeFileSync(path,JSON.stringify(r,null,2)+'\n');
console.log('Added checked sources, explicit limitations and validation results to report.');
