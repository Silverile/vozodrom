import {sweep} from './sweep-lib.mjs';

const cases = [
['duesenberg','https://www.indyautomuseum.org/explore/articles/duesenberg-sign','Model A 1921–1926 museum account and Model X transition checked; existing null endpoint retained against museum-listed 1927 surviving car.',['Model A production/model-year conflict remains unresolved: Savoy Museum displays a 1927 Model A while Indiana historical article dates manufacture through 1926.']],
['e-go-mobile','https://www.sec.gov/Archives/edgar/data/1942808/000121390024020867/ea020137801ex99-1_nextego.htm','March2024 insolvency application checked from issuer filing; this alone does not establish dissolution or the exact Life production end.',['2015 original e.GO Mobile and 2020 Next.e.GO legal successors need entity policy before assigning insolvency/dissolution to canonical make.']],
['estrima','https://www.estrima.com/','OEM confirms Italian identity and continuing Birò design/manufacturing business after April2025 52% acquisition by Zetronic.',['Individual Birò generation production dates and B2211 homologation still require evidence.']],
['exeed','https://www.exeedcars.com/','Chinese OEM current range includes EX7, ET5, ET, ES, Lanyue, Yaoguang and Lingyun; these correspond to locally catalogued families.',['ET/EX7 are displayed separately by OEM; current combined ET generation structure needs independent architecture/identity evidence before restructuring.','EXEED brand reveal2017 vs commercial launch2018 vs TX/TXL2019 is a scope distinction; foundedYear not changed.']],
['facel-vega','https://www.amicale-facel-vega.fr/production-facel-vega/production/','Marque club production register corroborates all seven local road-family ranges (FV1955–1958 through Facel61964).',['1939 industrial FACEL company foundation vs1954/1955 automotive marque needs policy; existing1939 retained.']],
['faw','https://downloads.ctfassets.net/mt8w0y3iajsh/67TRXorMrhNqClznN5QzXe/bd400c1044688064a5fed4566ea95df7/ESG.pdf','FAW sustainability report confirms1953 origin,1956 industrial operations and separate Hongqi/Bestune/Jiefang marques.',['29 local families include pickups and vans; group ownership does not prove current FAW-badge status or justify moving Hongqi/Bestune entries.']],
['fisker','https://www.magna.com/docs/default-source/2024-news---press-releases/magna-2024-q3-pr-w-fs-mda.pdf?sfvrsn=6f5dbb0a_3','Contract manufacturer Q32024 filing verifies Ocean manufacturing agreement termination, corroborating existing2024/ended card.',['Bankruptcy filing is distinct from corporate dissolution; canonical make status requires final legal outcome.']],
['fisker-automotive','https://www.deb.uscourts.gov/sites/deb/files/opinions/fah-fisker-warn-act-combined_0.pdf','Bankruptcy court finding confirms Karma stopped July2012 and never restarted; existing2011–2012 original Karma scope retained.',['Original Fisker Automotive must remain distinct from2016 Fisker Inc and subsequent Karma Automotive manufacturer.']],
['force-motors','https://www.forcemotors.com/MEDIA_PAGE_PDF/Press_Release/2024/gurkhapr.pdf','OEM May2024 release identifies separate Gurkha3-door4-seat and5-door7-seat versions;320Nm verified.',['Gurkha newer family starts2021;2024 upgrade must not replace its family start. Exact current production status remains unverified.']],
['forthing','https://www.forthingmotor.com/s7/','OEM explicitly identifies Forthing as Dongfeng Liuzhou passenger marque in China and lists S7, U-Tour, Friday and V9.',['S7 Israeli153/154kW-range export version must not overwrite China200kW650km version already in card. Production/SOP not inferred from sales page.']],
['fsm','https://www.media.stellantis.com/pl-pl/fiat/press/10-000-000-samochod%C3%B3w-wyprodukowa%C5%82y-zak%C5%82ady-dawnej-fsm-i-fiat-auto-poland','Successor OEM history corroborates Polish126 production1973; discusses Syrena early1971 assembly.',['1971 initial Syrena assemblies vs1972 formal FSM transfer and1948 predecessor origin vs1972 FSM legal foundation require reconciliation; no automatic date correction.']],
['fso','https://www.fso-sa.com.pl/kim-jestesmy-rozszerzenie/','OEM history corroborates Warszawa1951–1973,125p final29June1991 and Polonez production1978.',['FSO remains a legal operating company with property rentals per official site; do not label defunct solely because automobile assembly stopped.']],
['gaz','https://www.zr.ru/archive/zr/1997/01/sobytiie','Contemporary January1997 reporting directly describes start of Volga3110 production.',['Exact3102/31105 manufacturing end not established by accessible OEM history; existing unknowns retained.']],
['geely','https://newsroom.geely.com/geely-auto-sales-2025','OEM2025 year-end report explicitly confirms Indonesian mass production of EX5 and EX5 EM-i and Egyptian Coolray/Emgrand assembly.',['Production occurred in2025 but does not alone certify October2026 current status.1986 holding-group origin vs auto-company foundation remains policy issue.']],
['ginetta','https://www.ginetta.com/our-cars/','OEM separates road Akula/GTR/G10 from G56 race cars and LMP prototypes.',['GTR and remastered G10 are curated coverage candidates; exact SOP and duplication with historical G10 need review. No race-car blanket exclusion for road-homologated G40R.']],
['gmc','https://www.gmc.com/byo-vc/client/en/US/gmc/terrain/2026/terrain/trims/features/468997','OEM2026 Terrain distinguishes FWD CVT184lb-ft from AWD8AT203lb-ft with175hp; exact production start remains unknown.',['Do not assign AWD torque/transmission to all TerrainIII vehicles. Raw list includes commercial trucks and a motorhome requiring section policy.']],
['great-wall','https://www.gwm.cr/poer-medio-millon','GWM importer chronology corroborates POER2019 manufacturing debut and subsequent500000th unit.',['Great Wall/GWM umbrella, Haval marque and POER subbrand overlap needs canonical policy; pre-Haval Hover models must not be blindly removed as duplicates.']],
['grecav','https://www.zebraminicars.nl/media/update2011.pdf','Original2011 Sonique importer brochure distinguishes505cc FOCS18Nm and440cc DCI20Nm, both4kW; search extraction retrieved, direct open502.',['Marketing engine name442 is not displacement. Exact DCI series start retained2010;2011 brochure alone does not prove first production.']],
['gumpert','https://libdoc.whz.de/opus4/files/9951/Diplomarbeit_Apollo_ECU1.pdf','Vehicle-electronics engineering thesis on Apollo N describes2005/2006 production transition and earlier legal entities.',['Apollo OEM site returned no readable body.2005/2006 uncertainty means existing2005 start not independently resolved;2012 insolvency does not by itself prove final marque end.']],
['haval','https://www.gwm.com.cn/history.html','GWM history ties H6 introduction to Tianjin base opening25August2011;2013 marque independence is separate.',['H6 first-generation SOP year not inferred solely from launch event; null retained. Overlapping generations and H6GT bodies need market-specific ends.']],
['hillman','https://nationalmotormuseum.org.uk/collections/vehicles/hillman-imp/','National Motor Museum confirms Imp1963 origin and final1976 manufacture; existing family dates retained.',['Imp phase boundaries and prewar models are not independently verified by whole-family range.']],
['hindustan-motors','https://www.hindmotor.com/Files/HM-AR-2023-24.pdf','OEM annual report states Uttarpara work suspended24May2014, corroborating Ambassador final family endpoint2014.',['Suspended factory does not establish legal dissolution; no defunct make proposal. Mark I1957/1958 start remains unresolved.']],
['hongqi','https://www.hongqi-auto.com/pages/history/history.html','OEM history confirms1958 first sedan, CA72 after prototype development, CA770 derivatives and Century Star2000 production.',['CA72 prototype1958 versus series1959 must remain explicitly scoped; local representative family currently includes prototype period. CA771 two-seater wording means seating rows in OEM translation, not safely passenger count.']]
];

for(const [make,source,scope,questions] of cases){
 const s=sweep(make);
 s.checked.push({scope,sources:[source]});
 s.report.openQuestions.push(...questions);
 s.report.openQuestions.push('Photos were inventoried by existing filename only; this pass performed no new visual verification.');
 s.report.localIdentityInventory={raw:s.raw.map(x=>({slug:x.slug,name:x.name})),lines:s.lines.map(x=>({slug:x.slug,name:x.name})),additions:s.additions.map(x=>({slug:x.slug,name:x.name})),cards:s.cards.map(c=>({lineSlug:c.lineSlug,name:c.name,generations:c.generations.map(g=>({name:g.name,code:g.code,from:g.from,to:g.to,productionStatus:g.productionStatus,photoFile:g.photo?.file??null}))}))};
 if(make==='estrima'){
  s.makeFix('country','Itálie',[source],'OEM Italian registered address and business identity.');
  s.makeFix('countryQid','Q38',[source],'Italian country identifier.');
  s.makeFix('countries',[{qid:'Q38',name:'Itálie'}],[source],'Replace missing country list with verified Italian origin.');
 }
 if(make==='forthing'){
  s.makeFix('country','Čína',[source],'OEM identifies Chinese Dongfeng Liuzhou manufacturer.');
  s.makeFix('countryQid','Q148',[source],'Chinese country identifier.');
  s.makeFix('countries',[{qid:'Q148',name:'Čína'}],[source],'Verified Chinese marque origin.');
 }
 if(make==='grecav'){
  for(const [i,torque] of [[0,18],[1,20]])s.set('sonique',`generations[${i}].trims[0].engine.torqueNm`,torque,[source],'Original importer brochure separates FOCS and DCI.');
  for(const p of ['generations[1].engines[0].displacementCc','generations[1].trims[0].engine.displacementCc'])s.set('sonique',p,440,[source],'Original brochure specifies440cm3;442 is engine model designation.');
  for(const p of ['generations[1].engines[0].powerKwMin','generations[1].engines[0].powerKwMax','generations[1].trims[0].engine.powerKw'])s.set('sonique',p,4,[source],'Original brochure power figure, no PS conversion.');
  s.set('sonique','generations[1].trims[0].name','Sonique DCI – 440 cm³',[source],'Remove obsolete claim that exact volume is unknown.');
  for(const i of [0,1]){const before=s.cards.find(c=>c.lineSlug==='sonique').generations[i].trims[0].sources;s.set('sonique',`generations[${i}].trims[0].sources`,[...new Set([...before,source])],[source],'Attach exact trim brochure evidence.');}
 }
 if(make==='gaz'){
  s.set('gaz-3110','generations[0].from',1997,[source],'Contemporary January1997 report explicitly describes production start.');
  s.set('gaz-3110','generations[0].marketNotesCs','Dobová zpráva Za volantem z ledna 1997 výslovně popisuje zahájení výroby GAZ-3110. Údaj 1996 v jiných přehledech není zde vykládán jako potvrzená sériová výroba. Konec 2004 platí pro sedan; samostatný rozsah kombi zůstává k ověření.',[source],'Reconcile stale unknown-start note with dated contemporary production report.');
 }
 if(make==='force-motors'){
  const template={name:null,kind:'technical-version',from:null,to:null,bodyType:'suv',engine:{fuel:'diesel',displacementCc:null,cylinders:null,powerKw:null,powerStandard:null,torqueNm:320},transmission:{type:null,gears:null},drive:null,dimensionsMm:{length:null,width:null,height:null,wheelbase:null},massKg:null,massBasis:null,topSpeedKmh:null,acceleration0to100s:null,consumptionL100:null,consumptionCycle:null,consumptionKwh100:null,rangeKm:null,rangeCycle:null,specificationScope:{market:'India',modelYear:2024,noteCs:'Specifikace verze představené výrobcem 2. května 2024; nejde o ověřené datum zahájení výroby. Výkon 140 PS není přepočítán na kW. Třídveřová verze má čtyři místa, pětidveřová sedm.'},sources:[source]};
  const trims=['3-door 4-seat – specifikace2024','5-door 7-seat – specifikace2024'].map(name=>({...structuredClone(template),name}));
  s.set('gurkha','generations[1].trims',trims,[source],'Preserve separately identified bodies and source320Nm without extrapolating production dates.');
 }
 if(make==='fso')s.checked.push({scope:'Company established1August1948 and still operates rental business; car-production cessation is not company dissolution.',sources:['https://www.fso-sa.com.pl/']});
 s.finish(`Partial breadth pass: ${scope} All local identities inventoried; remaining specifications, histories, generation codes, photos and current production are not certified.`);
}
