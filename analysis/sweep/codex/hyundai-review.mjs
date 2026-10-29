import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const base='src/data/catalog/';
const make=read(base+'makes.json').find(x=>x.slug==='hyundai');
const cards=read('src/data/model-cards/hyundai.json');
const official='https://www.hyundai.com/worldwide/en/newsroom/detail/0000001280';
const country='https://www.hyundai.com/content/dam/hyundai/kr/ko/data/company-report/2025/07/07/hmc-sr-en-2024.pdf';
const inster='https://www.hyundai.com/worldwide/en/footer/corporate/vehicle-history/2024/inster';
const tucson=cards.find(c=>c.lineSlug==='tucson');
const report={make:'hyundai',checkedAt:'2026-10-29',by:'codex',
  reviewScope:{status:'partial',catalogCardsInspected:4,winningCardsInspected:28,externallyChecked:['Corporate identity and foundation','Cortina aggregate 1968–1983','Excel X1 1985–1989 and X2 1989–1994','Pony first production 1975 and second body series 1982','Stellar aggregate 1983–1997','INSTER 2024 introduction','IONIQ 9 2025 launch','NEXO second generation 2025','Tucson fifth-generation unveiling and market rollout','INITIUM and Intrado concept classification'],notChecked:['Complete individual engine/trim/dimension reconciliation','All raw-model identities and missing production models','Photo depiction and licence verification','All generation codes and 2026 start/end dates']},
  makeFixes:[
    {field:'countries',from:make.countries,to:[{qid:'Q884',name:'Jižní Korea'}],sources:[country],confidence:'high',reason:'Canonical Hyundai Motor Company is a Korean manufacturer headquartered in Seoul. German operations do not make this a German-origin make.'},
    {field:'country',from:make.country,to:'Jižní Korea',sources:[country],confidence:'high'},
    {field:'countryQid',from:make.countryQid,to:'Q884',sources:[country],confidence:'high'}
  ],
  modelFixes:[{file:'model-lines-auto',slug:'inster',field:'from',from:null,to:2024,sources:[inster],confidence:'high'}],
  removeModels:[
    {file:'models-auto',slug:'initium',reason:'Concept preview of production NEXO; exclude from buyable production-model catalogue.',sources:['https://www.hyundaimotorgroup.com/en/amp/CONT0000000000163715']},
    {file:'models-auto',slug:'intrado',reason:'Manufacturer explicitly identifies Intrado as a 2014 concept car.',sources:['https://www.hyundai.com/worldwide/ko/company/innovation/design/concept-car/2014/intrado']}
  ],missingModels:[],cardFixesApplied:[],cardsAdded:[],
  cardFixesProposed:[
    {file:'src/data/model-cards/hyundai.json',lineSlug:'tucson',path:'generations[0].marketNotesCs',from:tucson.generations[0].marketNotesCs,to:'Světová premiéra proběhla 1. října 2026 v New Yorku. Výrobce plánuje uvedení v Koreji do konce roku 2026 a v Evropě, Severní Americe a dalších regionech v roce 2027; evropská sériová výroba ani zde uvedené rozměry krátké verze zatím nejsou tímto zdrojem potvrzeny.',sources:[official],confidence:'high'},
    {file:'src/data/model-cards/hyundai.json',lineSlug:'tucson',path:'generations[1].marketNotesCs',from:tucson.generations[1].marketNotesCs,to:'Evropská verze čtvrté generace s krátkým rozvorem 2680 mm se vyrábí v Nošovicích (HMMC); delší verze je určena pro jiné trhy. Pátá generace byla představena v říjnu 2026 a její evropské uvedení výrobce plánuje na rok 2027.',sources:[official],confidence:'high',reason:'Correct only fifth-generation launch claim; retain existing fourth-generation production context.'}
  ],
  conflicts:[
    {where:'Stellar aggregate end vs regular passenger-car end',values:{'Hyundai official vehicle history':1997,'Wikipedia regular passenger-car description':1992},kept:1997,reason:'Existing card explicitly distinguishes extended Korean taxi production; do not truncate whole-family end to 1992.'},
    {where:'INSTER body classification',values:{'winning card':'hatchback','model line and manufacturer marketing':'suv'},kept:'hatchback',reason:'Tall hatchback morphology vs marketed SUV is not enough to declare an objective error; reconcile catalogue policy before applying a change.'}
  ],
  openQuestions:[
    'Tucson NX5 is marked current with Europe scope despite official European launch planned for 2027. Confirm SOP and market-specific availability before retaining current status; unveiling is not SOP.',
    'Tucson NX5 SWB dimensions 4560/1900/2720 are not corroborated by the official launch release, which publishes LWB dimensions only. Obtain SWB primary evidence or clear these fields after review.',
    'Tucson summary states fifth-generation Czech production as established; official launch release does not substantiate it. Verify with HMMC.',
    'Accent card stops at MC (2010 end) although family line is current; check European-market scope before adding later global generations.',
    'Elantra CN8 and i20 BC4 2026 production claims need manufacturer SOP checks; this pass does not validate them.',
    'raw model list contains further apparent concepts, trucks and generation-level duplicates; only INITIUM and Intrado classification verified in this pass.',
    'NEXO uses hydrogen fuel-cell propulsion, absent from CatalogFuel. Do not encode hydrogen as ordinary battery-electric without an agreed shared type change.'
  ],
  sourcesChecked:[
    {url:'https://www.hyundai.com/worldwide/en/footer/corporate/vehicle-history/1960/cortina',supports:'1968–1983 Korean family dates'},
    {url:'https://www.hyundai.com/worldwide/en/footer/corporate/vehicle-history/1980/pony-excel',supports:'1985–1989 X1 family dates'},
    {url:'https://www.hyundai.com/worldwide/en/footer/corporate/vehicle-history/1980/excel',supports:'1989–1994 X2 family dates'},
    {url:'https://www.hyundai.com/worldwide/en/footer/corporate/vehicle-history/1970/pony',supports:'1975–1990 family; Pony2 introduced 1982'},
    {url:'https://motorstudio.hyundai.com/itg/download/220107_ReflectionsInMotion.pdf',supports:'Pony first production December 1975 vs first sale February 1976'},
    {url:'https://www.hyundai.com/worldwide/en/footer/corporate/vehicle-history/1980/stellar',supports:'1983–1997 aggregate dates'},
    {url:'https://www.hyundai.com/worldwide/en/newsroom/detail/0000000927',supports:'Second-generation NEXO unveiled April 2025'},
    {url:'https://www.hyundaimotorgroup.com/ko/news/CONT0000000000178385',supports:'Second-generation NEXO Korean sales began June 2025'},
    {url:'https://www.hmgma.com/our-products/',supports:'IONIQ 9 plant production began March 2025'}
  ],
  summary:'Partial source-backed audit: four historic cards retain manufacturer-supported aggregate dates; propose Korean make identity, INSTER start year, exclusion of two concepts, and two Tucson launch-note corrections in the winning Claude-owned copy. No direct card modifications; technical variants and full raw-model reconciliation remain open.'
};
fs.writeFileSync('analysis/sweep/codex/hyundai.json',JSON.stringify(report,null,2)+'\n');
console.log('Wrote Hyundai partial audit: 4 make/model field proposals, 2 concept exclusions, 2 winning-copy note proposals; no direct card changes.');
