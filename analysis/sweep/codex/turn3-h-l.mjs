import {sweep} from './sweep-lib.mjs';

// Retrieved manufacturer, archive, museum and homologation evidence. This is a
// selected evidence pass, not certification of every inventoried catalogue row.
const evidence = {
 'horch':['https://www.audi-mediacenter.com/en/publications/more/audi-tradition-anniversary-dates-2025-1565/download','Audi Tradition: Horch 853 family introduced in 1935; 1,023 Sport Cabriolets delivered between 1935 and 1940.'],
 'hotchkiss':['https://pop.culture.gouv.fr/notice/palissy/PM68002071','French heritage record confirms Hotchkiss-Grégoire, Chapron coachwork, front drive and 1951 museum specimen; narrative says small-series production began in 1950.'],
 'hudson':['https://www.thehenryford.org/collections/explore/artifact/366820','Henry Ford museum identifies Hudson Hornet as 1951–1957 full-size car family, distinct from AMC and Dodge namesakes.'],
 'hummer':['https://news.gm.com/home.detail.html/Pages/news/us/en/2021/dec/1217-hummer.html','GM confirms December 2021 production/customer delivery launch of GMC HUMMER EV Pickup. GMC branding must not silently extend historic Hummer marque production.'],
 'innocenti':['https://www.press.bmwgroup.com/italy/article/attachment/T0077341IT/114040','BMW MINI press entry list documents Innocenti Mini Cooper 1300 examples dated 1972, 1973 and 1974; identity is distinct from Bertone-bodied Mini.'],
 'international-harvester':['https://www.scoutmotors.com/','Scout Motors history associates original International Harvester Scout with 1961, while new Traveler/Terra target 2027 and belong to the new marque.'],
 'iveco':['https://www.iveco.com/global/Press/PressReleases/2018/IVECO-Daily-celebrates-40-years-of-success','IVECO dates Daily launch to 1978, second construction generation to 1999; confirms truck-derived rear-drive chassis and 1984 4x4 introduction.'],
 'izh':['https://www.ladaizhevsk.ru/Index.php?r=staticContent&uri=modelsHistory','Izhevsk factory history gives IZH 2126 Oda production 1990–2005 and identifies rear-drive hatchback platform.'],
 'jac':['https://jacen.jac.com.cn/models/j7/','Manufacturer J7 page confirms 1.5 turbo and six-speed manual/CVT offerings, with 520–1510 litre cargo description; no values transferred to differently scoped trims.'],
 'jaecoo':['https://jaecoo.ru/jaecoo/brand/news/marka-jaecoo-ob-iavliaet-komplektatsii-i-start-predvaritel-nykh-zakazov-na-krossover-jaecoo-j7/','Russian manufacturer release schedules J7 sales for late September 2023, petrol 1.6 turbo, 7DCT and front/all-wheel drive; sales timing is not established production timing.'],
 'jensen-motors':['https://www.jensenmuseum.org/early-interceptor-engine-bay/','Jensen Museum describes early Austin-six Interceptor production as 1950–1958 and Italian-designed namesake from 1966. Local early-family endpoint is 1957.'],
 'jetour':['https://jetourglobal.com/history/','Manufacturer history records brand launch January 2018, T2 international launch Dubai January 2024 and T2 i-DM global launch December 2024.'],
 'koenigsegg':['https://www.koenigsegg.com/model/gemera','Current Gemera manufacturer page confirms four seats, HV8/Dark Matter, 9-speed LSTT, 2300 hp and 2750 Nm. Existing card correctly separates old TFG concept data.'],
 'lada':['https://mintrans.gov.ru/press-center/branch-news/9231','Russian transport ministry reports start of series production of modernized Niva Legend 1.8 on 20 July 2026.'],
 'landwind':['https://cdn.euroncap.com/media/7107/euroncap_landwind_cv9_2009_2stars.pdf','Euro NCAP identifies tested CV9 2.0 as five-door MPV, 1420 kg; report published 2010 despite 2009 in filename, with European import intended early 2011.'],
 'leapmotor':['https://www.stellantis.com/en/news/press-releases/2024/september/leapmotor-international-opens-orders-in-europe-for-affordable-high-tech-t03-city-car-and-c10-suv-electric-vehicles','Stellantis opened European T03/C10 orders 30 September 2024; T03 is five-door A-segment, C10 D-segment SUV. Europe launch is not China production start.'],
 'li-auto':['https://ir.lixiang.com/news-releases/news-release-details/li-auto-inc-june-2022-delivery-update','Manufacturer confirms L9 six-seat range-extender SUV unveiled June 2022, with deliveries then scheduled August; ONE debut 2019.'],
 'lifan':['https://lifan-car.ru/cars/x60','Russian manufacturer X60 page gives later 4405 mm body length, 2600 mm wheelbase, 1794 cc, manual/CVT and front drive. Distinct Chilean 4325 mm trim remains market-specific.'],
 'ligier':['https://www.ligier.fr/wp-content/uploads/2023/11/FICHE-%C3%89QUIP.LIGIER-MYLI-2023.11.01.pdf','Manufacturer November 2023 Myli sheet confirms light quadricycle category, two seats, 45 km/h, diesel and electric versions.'],
 'lincoln':['https://media.lincoln.com/content/dam/lincolnmedia/lna/us/product/2025/navigator/2025-Lincoln-Navigator-Technical-Specs.pdf','Manufacturer 2025 Navigator sheet confirms separate standard/L wheelbase variants, twin-turbo 3.5 V6, 10-speed automatic and four-wheel drive.'],
 'luaz':['https://automuuseum.ee/collection','Museum collection identifies a 1990 LuAZ 969M and separate 1987 967M; a dated specimen does not establish a full production range.'],
 'lucid-motors':['https://ir.lucidmotors.com/static-files/5de2c8b5-d90f-458e-af65-ae00b254b740','Lucid fourth-quarter 2024 earnings release confirms Gravity production and initial deliveries in December 2024; local 2024 beginning retained.'],
 'lynk-co':['https://press.lynkco.com/en-WW/242073-lynk-co-introduces-the-all-electric-02-its-first-ev-for-europe-arrives-with-445-km-range-and-premium-features/','Manufacturer October 2024 release confirms European all-electric 02 is named Z20 in China; local separation from original combustion 02 retained.'],
};

for (const [make,[url,note]] of Object.entries(evidence)) {
 if(process.argv[2] && make!==process.argv[2])continue;
 const s=sweep(make), sources=[url];
 s.checked.push({topic:'Selected chronology / model identity / specification scope',sources,result:note});
 s.report.localInventory={
  make:s.makeEntry,
  rawModels:s.raw.map(x=>({slug:x.slug,name:x.name})),
  modelLines:s.lines.map(x=>({slug:x.slug,name:x.name})),
  additions:s.additions.map(x=>({slug:x.slug,name:x.name})),
  cards:s.cards.map(c=>({lineSlug:c.lineSlug,name:c.name,generations:c.generations.map(g=>({name:g.name,code:g.code,from:g.from,to:g.to,productionStatus:g.productionStatus,photoFile:g.photo?.file??null}))}))
 };
 s.report.openQuestions.push('Partial evidence pass: remaining model histories, specifications, photos and present production status need individual external verification. Photo filenames inventoried; images were not visually re-reviewed.');
 if(make==='horch') {
  s.report.openQuestions.push('Combined 853/853 A card correctly leaves production end null: Audi Tradition gives deliveries through 1940 but says production continued to the first year of World War II. Delivery year alone must not become production end. Base 853 versus 853 A also needs distinct chronology.');
 }
 if(make==='hotchkiss') {
  s.report.conflicts.push({where:'Grégoire first small-series production / commercial delivery / last production',values:{'French heritage record':1950,'Existing card / first delivery':1951,'Lane Motor Museum production end':1953,'Club Hotchkiss adventure ended':1954},kept:'Card from 1951 retained as existing delivery-oriented boundary; to remains null pending production definition reconciliation.',sources:[url,'https://www.lanemotormuseum.org/collection/cars/item/hotchkiss-gregoire-1951/','https://www.club-hotchkiss.fr/en/la-production-mob-gb/vehicule-de-tourisme-gb/gregoire']});
 }
 if(make==='hudson')s.report.openQuestions.push('Hornet card begins 1950 while museum describes family as 1951–1957. Calendar-year production versus model-year convention needs an explicit primary production record before changing 1950.');
 if(make==='international-harvester')s.report.openQuestions.push('Scout card starts 1960; manufacturer heritage highlights 1961. Resolve late-1960 production versus 1961 model introduction before changing the boundary.');
 if(make==='innocenti')s.report.openQuestions.push('Trademark-owner archive contains internally inconsistent ranges (Mini begins 1965/1966; Koral 1991–1993/1990–1992). It was not used to overwrite production years.');
 if(make==='jensen-motors')s.report.conflicts.push({where:'early-interceptor.generations[0].to',values:{'Existing card':1957,'Jensen Museum engine-bay article':1958},kept:1957,sources:[url],reason:'Existing card cites production-figures page; attempted retrieval timed out. Reconcile last completion/delivery before overwriting.'});
 if(make==='koenigsegg') {
  s.checked.push({topic:'Gemera production uncertainty',sources:['https://koenigsegg-cdn-g7eehhd6f0ewcaff.z02.azurefd.net/drupal/2025-08/Annual%20Report%202024_unofficial%20translation%20ENG.pdf'],result:'2024 annual report describes manufacturing first examples but does not settle prototype versus customer series start; null retained.'});
 }
 if(make==='lada')s.set('niva','summaryCs',s.cards.find(c=>c.lineSlug==='niva').summaryCs+' V červenci 2026 začala sériová výroba modernizované Nivy Legend s motorem 1,8 litru.',sources,'Add dated series-production modernization; no unverified technical figures or new generation boundary.');
 if(make==='ligier')s.set('myli','summaryCs','Myli je dvoumístná lehká čtyřkolka s elektrickým nebo dieselovým pohonem a nejvyšší rychlostí 45 km/h. Technické verze v této kartě se vztahují k listu výrobce z listopadu 2023.',sources,'Clarify homologation category, seats and speed from the exact existing technical sheet.');
 s.finish('Partial breadth pass: all local identities and generation rows inventoried. '+note+' Only listed external checks verified; no full-model certification.');
}
