// Selected facts only. Consumption labels preserve the original test conditions.
import {urls} from './skoda-trim-facts.mjs';
import {specSources} from './skoda-specs-step3.mjs';
export const step4Sources={
 elroq:specSources.elroq2025,
 garde:urls.garde,
 fun:urls.fun,
 fabia:specSources.fabia,
 felicia:'https://cs.wikipedia.org/wiki/%C5%A0koda_Felicia',
 funBrochure:'https://skodafeliciafun.co.uk/March_1999_Skoda_Felicia_Fun_Sales_Brochure_GermanWP.pdf',
 manual1987:'https://auta5p.eu/zkusenosti/skoda_125/skoda-105-136-navod.pdf',
 favoritBook:'https://skoda120.inetbox.sk/_temp/favorit_andrt_malina.pdf',
 van:'https://cdn.skoda-storyboard.com/2018/09/180914-50-years-of-the-%C5%A0KODA-1203-Reliable-all-round-van-with-cult-status.pdf',
 sedan:'https://www.skoda-storyboard.com/en/press-releases/70-years-of-the-skoda-1200-all-steel-body-refined-in-the-wind-tunnel/',
 monte:'https://www.skoda-storyboard.com/en/press-releases/skoda-popular-monte-carlo-1936-1939-the-elegant-model-with-rally-dna/'
};
export const step4Conflicts=[
 {lineSlug:'110-r',field:'acceleration0to100s',reason:'Existing Czech summary gives 18.5 s; manufacturer Garde/110 R retrospective gives 19 s. Exact test/tyre/year scope is unresolved; scalar withheld.',sources:[specSources.s100,urls.garde]},
 {lineSlug:'130-135-136',field:'135/136 topSpeedKmh',reason:'1987 factory manual quotes 145 km/h for 135 and 150 for 136; previous summary gives 148/153. Values are withheld pending year/test-scope reconciliation.',sources:[specSources.s742,'https://auta5p.eu/zkusenosti/skoda_125/skoda-105-136-navod.pdf']},
 {lineSlug:'1101-1102',field:'massKg / consumptionL100',reason:'Manufacturer Czech article describes approximately 940 kg and approximately eight litres; these are not exact version specifications. No approximate scalar introduced.',sources:['https://www.skoda-storyboard.com/cs/tiskove-zpravy-archiv/75-let-vsestranne-legendy-skoda-1101-tudor/']}
];
function assign(t,values,source,note){
 t.fieldSources??={};
 for(const [k,v]of Object.entries(values)){
  if(k==='dimensionsMm'){for(const [d,n]of Object.entries(v)){t.dimensionsMm[d]=n;t.fieldSources['dimensionsMm.'+d]=[source];}}
  else {t[k]=v;t.fieldSources[k]=[source];}
 }
 if(!t.sources.includes(source))t.sources.push(source);
 if(note)t.specificationScope.noteCs+=' '+note;
}
export function enrichStep4(card,g,index){
 for(const t of g.trims||[]){
  for(const k of ['consumptionCycle','consumptionKwh100','rangeKm','rangeCycle','massBasis'])t[k]=null;
  if(card.lineSlug==='105-120-125'&&['105 L','120 L'].includes(t.name)){
   assign(t,{massKg:875,massBasis:'historical pohotovostni (ready-to-drive); distinct from 825 kg own weight',consumptionL100:t.name==='105 L'?6.3:6.4,consumptionCycle:'EHK constant speed 90 km/h; four-speed manual'},step4Sources.manual1987,'Tovární návod AZNP, XVIII. vydání 1987, tištěné s. 6–7; hmotnost i spotřeba výslovně pro L, nikoli S/GLS. Spotřeba pro čtyřstupňovou převodovku, nikoli pětistupňovou verzi.');
   t.specificationScope.modelYear=1987;
  }
  if(card.lineSlug==='130-135-136'){
   assign(t,{massKg:t.name.endsWith('GL')?890:885,massBasis:'historical pohotovostni (ready-to-drive); not own/dry weight',consumptionL100:t.name.startsWith('136')?5.7:6,consumptionCycle:'EHK constant speed 90 km/h; five-speed manual'},step4Sources.manual1987,'AZNP návod, XVIII. vydání 1987, tištěné s. 6–7. Hmotnost rozlišuje L/GL; spotřeba při 90 km/h, pětistupňová převodovka. Nejde o kombinovaný cyklus.');
   t.specificationScope.modelYear=1987;
   if(t.name==='130 GL'){t.consumptionL100=null;t.consumptionCycle=null;delete t.fieldSources.consumptionL100;delete t.fieldSources.consumptionCycle;t.specificationScope.noteCs+=' Pro 130 GL není z indexovaného řádku bezpečně přiřazena spotřeba; údaj 130 L není automaticky zkopírován.';}
   if(!t.name.startsWith('130')){t.topSpeedKmh=null;delete t.fieldSources.topSpeedKmh;}
  }
  if(card.lineSlug==='favorit'&&['135 L','136 L'].includes(t.name))assign(t,{massKg:840,massBasis:'nominal historical kerb through July 1991; source tolerance ±5 percent'},step4Sources.favoritBook,'Andrt/Malina, Údržba a opravy, tištěná s. 13: hmotnost L do 7/1991, nominálně 840 kg s tolerancí ±5 %. Není použita vyšší hodnota po změně od 8/1991 ani hmotnost výbavy LS/GLX.');
  if(card.lineSlug==='elroq'){
   const row={'Elroq 50':[15.7,377],'Elroq 60':[15.7,430],'Elroq 85':[15.2,574],'Elroq RS':[16.2,549]}[t.name];
   if(row)assign(t,{consumptionKwh100:row[0],consumptionCycle:'WLTP combined',rangeKm:row[1],rangeCycle:'WLTP',massBasis:'kerb including 75 kg driver; only a configuration-dependent interval published'},step4Sources.elroq,'Spotřeba elektřiny a dojezd dle listu 5. 5. 2025; neplatí pro Sportline. Dojezd 85 platí pro výrobu od června 2025. Nejde o garantovaný reálný dojezd.');
  }
  if(card.lineSlug==='garde')assign(t,{consumptionL100:6.5,consumptionCycle:'EHK constant speed 90 km/h',massBasis:'historical kerb; driver inclusion not specified'},urls.garde,'6,5 l/100 km je ustálených 90 km/h podle dobové metodiky EHK, nikoli kombinovaný cyklus.');
  if(card.lineSlug==='110-r'){
   assign(t,{consumptionL100:8.5,consumptionCycle:'historical average; test cycle not specified'},urls.garde,'Dobový průměr 8,5 l/100 km bez určení cyklu; nelze přímo srovnávat s WLTP. Zrychlení 18,5/19 s zůstává sporné.');
   t.acceleration0to100s=null;delete t.fieldSources.acceleration0to100s;
  }
  if(card.lineSlug==='1203')assign(t,{dimensionsMm:{length:4520,width:1800,height:1900},topSpeedKmh:90,consumptionL100:11,consumptionCycle:'constant speed 60 km/h',massBasis:'unladen; driver inclusion not specified'},step4Sources.van,'Rozměry, rychlost a spotřeba původní dvoumístné skříňové dodávky z roku 1968; spotřeba při stálých 60 km/h, nikoli minibus nebo pozdější TAZ.');
  if(card.lineSlug==='1200')assign(t,{bodyType:'sedan',massKg:1050,massBasis:'historical kerb; driver inclusion not specified',topSpeedKmh:105,consumptionL100:10,consumptionCycle:'historical reported consumption; test cycle not specified'},step4Sources.sedan,'Údaje původního pětimístného sedanu 1200; hmotnost se nepřenáší na STW, sanitku či 1201. Zdroj neurčuje jízdní cyklus spotřeby.');
  if(card.lineSlug==='popular'&&t.name.includes('Monte Carlo')&&t.bodyType==='kupe')assign(t,{massKg:960,massBasis:'manufacturer reported vehicle weight; loading/driver convention unspecified',dimensionsMm:{length:4200,width:1500,height:1370}},step4Sources.monte,'Předmodernizační dvoumístné kupé popsané výrobcem; nikoli roadster, závodní Popular Sport ani modernizované provedení s delším rozvorem.');
  if(card.lineSlug==='felicia'){
   const v={'1.3 BMM 40 kW – hatchback':6.9,'1.3 MPI 50 kW – hatchback':6.7,'1.6 MPI 55 kW – hatchback':6.9,'1.9 D 47 kW – hatchback':5.8}[t.name];
   if(v)assign(t,{consumptionL100:v,consumptionCycle:'93/116/ES combined'},step4Sources.felicia,'Spotřeba podle tabulky konkrétních motorů s poznámkou 93/116 ES, kombinovaný režim; nikoli starší třetinový Euromix.');
   if(t.name.startsWith('1.3 BMM'))assign(t,{dimensionsMm:{length:3855}},step4Sources.felicia,'Délka předmodernizačního hatchbacku BMM; nejde o pozdější karoserii po faceliftu 1998.');
  }
  if(card.lineSlug==='felicia-fun'&&t.name==='Fun 1.6 MPI'){
   assign(t,{dimensionsMm:{length:4245,width:1680,height:1465},acceleration0to100s:12.5,massBasis:'manufacturer historical empty weight; not the 1999 brochure kerb weight including 75 kg driver'},step4Sources.funBrochure,'Německý prospekt 03/1999: rozměry a zrychlení 1,6 MPI. Hmotnost 1035 kg je ponechána podle historického popisu výrobce; prospekt uvádí odlišnou veličinu 1110–1185 kg včetně řidiče 75 kg podle výbavy.');
   t.fieldSources.massBasis=[urls.fun,step4Sources.funBrochure];
   t.specificationScope.market='Europe; 1999 German brochure dimensions/performance';
  }
  if(card.lineSlug==='felicia-fun'&&t.consumptionL100!==null)assign(t,{consumptionCycle:'93/116/EU combined'},urls.fun,'Cyklus spotřeby výslovně zachován z dobového údaje výrobce.');
  if(card.lineSlug==='fabia'&&index===0&&t.name.startsWith('RS '))assign(t,{consumptionCycle:'historical combined; directive not established'},specSources.fabia,'Kombinovaný dobový údaj; konkrétní předpis měření není v tomto záznamu doložen.');
 }
 for(const conflict of step4Conflicts.filter(x=>x.lineSlug===card.lineSlug))if(!card.needsReview.some(r=>r.reason===conflict.reason))card.needsReview.push({field:'scope',reason:conflict.reason});
}
