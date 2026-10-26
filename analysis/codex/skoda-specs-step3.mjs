// Selected independently structured facts. No article prose or source tables reproduced.
import {trim,urls as earlierSources} from './skoda-trim-facts.mjs';
export const specSources={
 s100:'https://cs.wikipedia.org/w/index.php?oldid=26216420',
 s742:'https://cs.wikipedia.org/w/index.php?oldid=26245159',
 favorit:'https://cs.wikipedia.org/w/index.php?oldid=26255881',
 felicia:'https://cs.wikipedia.org/w/index.php?oldid=26136151',
 octavia:'https://cs.wikipedia.org/w/index.php?oldid=26326808',
 fabia:'https://cs.wikipedia.org/w/index.php?oldid=26215791',
 favoritOem:'https://www.skoda-storyboard.com/en/press-kits/classic-days-2026-press-kit/skoda-favorit-136-l-1988-1994/',
 formanOem:'https://www.skoda-storyboard.com/en/skoda-world/heritage/happy-birthday-dear-favorit/',
 feliciaOem:'https://www.skoda-storyboard.com/en/press-releases/celebrating-30-years-of-the-skoda-felicia-the-brands-first-model-under-the-vw-groups-wing/',
 octaviaOem:'https://cdn.skoda-storyboard.com/2016/09/160905-Series-production-of-best-selling-%C5%A0KODA-OCTAVIA-began-20-years-ago.pdf',
 octavia1959:'https://www.skoda-storyboard.com/en/press-kits/classic-days-2026-press-kit/skoda-octavia-1959-1964/',
 felicia1959:'https://www.skoda-storyboard.com/en/press-kits/classic-days-2026-press-kit/skoda-felicia-1959-1964/',
 mbx:'https://www.skoda-storyboard.com/en/press-kits/classic-days-2026-press-kit/skoda-1100-mbx-1967-1969/',
 tudor:'https://www.skoda-storyboard.com/en/press-kits/classic-days-2026-press-kit/the-skoda-1101-tudor-celebrates-its-80th-anniversary/',
 monteCarlo:'https://www.skoda-storyboard.com/en/press-kits/classic-days-2026-press-kit/skoda-popular-monte-carlo-1936-1939/',
 superb3000:'https://www.skoda-storyboard.com/en/press-kits/classic-days-2026-press-kit/skoda-superb-3000-ohv-1938-1949/'
 ,s440:'https://cs.wikipedia.org/w/index.php?oldid=26165769'
 ,s1202:'https://cs.wikipedia.org/w/index.php?oldid=25452147'
 ,felicia59Wiki:'https://cs.wikipedia.org/w/index.php?oldid=25082854'
 ,mb1964:'https://www.skoda-storyboard.com/en/press-releases/55-years-of-the-skoda-1000-mb-the-first-czech-mass-produced-car-celebrates-its-anniversary/'
 ,mbWiki:'https://cs.wikipedia.org/w/index.php?oldid=26215787'
 ,felicia61:'https://www.skoda-storyboard.com/cs/tiskove-zpravy-archiv/veterany-na-upati-alp-vozy-skoda-na-startu-rally-bodensee-klassik/'
 ,octavia60:'https://webapps.skoda-auto.sk/Magazin/skoda_magazin_leto_2013.pdf'
 ,octaviaLaunch:'https://www.skoda-storyboard.com/en/press-releases/20-years-of-skoda-octavia-jubilee-for-the-heart-of-the-brand/'
 ,elroq2025:'https://cdn.skoda-storyboard.com/2025/06/Skoda_Elroq_Technical_data_d5686460.pdf'
};
const E=(fuel,cc,cyl,kw,nm,powerStandard=null)=>({fuel,displacementCc:cc,cylinders:cyl,powerKw:kw,torqueNm:nm,powerStandard});
const D=(length,width,height,wheelbase)=>({length,width,height,wheelbase});
const M=gears=>({type:'manual',gears});
function fields(value,path='',out={}){for(const[k,v]of Object.entries(value)){const key=path?path+'.'+k:k;if(v!==null&&typeof v==='object'&&!Array.isArray(v))fields(v,key,out);else if(v!==null&&!['name','kind','sources','specificationScope','fieldSources'].includes(k))out[key]=true;}return out;}
const named=(name,source,values,noteCs)=>{const t=trim(name,source,values);t.specificationScope={market:'Europe / source historical specification',modelYear:null,noteCs};t.fieldSources=Object.fromEntries(Object.keys(fields(values)).map(k=>[k,[source]]));return t;};
const overrides=new Map(),generationPatches=new Map();
const set=(slug,records,index=0)=>overrides.set(slug+'/'+index,records);
// The power and torque columns explicitly select ISO, never SAE or ČSN gross figures.
set('100-110',[
 ['100',988,30.2,69,805,125,null],['100 L',988,30.2,69,820,125,null],
 ['110 L',1107,34.3,81,825,135,20],['110 LS',1107,38.3,83,840,145,18.5]
].map(([name,cc,kw,nm,mass,speed,acc])=>named(name,specSources.s100,{bodyType:'sedan',engine:E('petrol',cc,4,kw,nm,'ISO'),transmission:M(4),drive:'rr',dimensionsMm:D(4155,1620,1380,2400),massKg:mass,topSpeedKmh:speed,acceleration0to100s:acc},'Historický sedan; výkon a moment podle ISO. Pohotovostní hmotnost podle zdroje, bez převodu na dnešní metodiku EU. U 100/100 L se zrychlení 24 a 29 s liší podle testu, proto zůstává null.')));
// Restrict the M-era dimensional sample to model year 1985; do not assign it to pre-1983 cars.
set('105-120-125',[
 ['105 S',1046,33.1,72.8,4,null,null,1985],
 ['105 L',1046,33.1,72.8,4,null,null,1985],
 ['120 L',1174,36.7,82,4,null,20,1985],
 ['120 GLS',1174,40.5,85.5,null,null,18,1985],
 ['125 L',1174,36.7,82,5,null,20,1989]
].map(([name,cc,kw,nm,gears,speed,acc,year])=>{const t=named(name,specSources.s742,{bodyType:'sedan',engine:E('petrol',cc,4,kw,nm,'ISO'),transmission:{type:'manual',gears},drive:'rr',dimensionsMm:D(4200,1610,1400,2400),topSpeedKmh:speed,acceleration0to100s:acc},'Rozměry provedení M po modernizaci 1983, nikoli celé výrobní období. Výkon a moment ISO. Hmotnost není přiřazena konkrétní výbavě; interval rychlostí nebo zrychlení není převeden na jeden údaj. U GLS zdroje nesjednocují přechod 4/5 stupňů.');t.specificationScope.modelYear=year;return t;}));
set('130-135-136',[
 ['130 L',43,97,150,15],['130 GL',43,97,150,15],['135 L',43,94,148,15],['135 GL',43,94,148,15],['136 L',46,100,153,14],['136 GL',46,100,153,14]
].map(([name,kw,nm,speed,acc])=>named(name,specSources.s742,{bodyType:'sedan',engine:E('petrol',1289,4,kw,nm,'ISO'),transmission:M(5),drive:'rr',dimensionsMm:D(4200,1610,1400,2400),topSpeedKmh:speed,acceleration0to100s:acc},'Sériový sedan s motorem vzadu, nikoli soutěžní LR/RS nebo kupé Rapid. ISO; přesná hmotnost konkrétní výbavy není doložena. Zrychlení přebírá český zdroj; u 130 existuje odlišný údaj v jiných přehledech a musí být dále ověřeno.')));
// Conflicting 130 acceleration values were observed (15 versus 17 s): do not choose either.
for(const t of overrides.get('130-135-136/0'))if(t.name.startsWith('130 ')){t.acceleration0to100s=null;delete t.fieldSources.acceleration0to100s;}
const favDimensions=D(3815,1620,1415,2450);
set('favorit',[
 named('135 L',specSources.favorit,{bodyType:'hatchback',engine:E('petrol',1289,4,43,94),transmission:M(5),drive:'fwd',dimensionsMm:favDimensions},'Karburátorová motorizace 135, výbava L doložená výrobcem. Hmotnostní interval není přiřazen konkrétní výbavě.'),
 named('136 L',specSources.favorit,{bodyType:'hatchback',engine:E('petrol',1289,4,null,100),transmission:M(5),drive:'fwd',dimensionsMm:favDimensions},'Výkon zůstává null: český technický přehled uvádí pro 136 46 kW, tisková mapa výrobce 2026 pod názvem 136 L uvádí 58 hp. Nelze bezpečně ztotožnit konkrétní motor a ročník.'),
 ...['135 Le','135 LSe'].map(n=>named(n,specSources.favorit,{from:1991,to:1992,bodyType:'hatchback',engine:E('petrol',1289,4,40,90),transmission:M(5),drive:'fwd',dimensionsMm:favDimensions},'Exportní verze Ecotronic s řízeným karburátorem; neplést s pozdějším jednobodovým vstřikováním.'))
]);
overrides.get('favorit/0')[0].sources.push(specSources.formanOem);
overrides.get('favorit/0')[1].sources.push(specSources.favoritOem);
set('forman',[named('135 GLX – karburátor',specSources.formanOem,{bodyType:'kombi',engine:E('petrol',1289,4,43,null),transmission:M(5),drive:'fwd',dimensionsMm:D(4160,1620,1425,2450)},'Výrobcem popsané provedení GLX modelového roku 1993; rozměry kombi z českého přehledu. Hmotnost není převzata z hatchbacku.')]);
const forman=overrides.get('forman/0')[0];forman.specificationScope.modelYear=1993;forman.sources.push(specSources.favorit);for(const k of Object.keys(forman.dimensionsMm))forman.fieldSources['dimensionsMm.'+k]=[specSources.favorit];
// Body and injection system are named explicitly, so later MPI data do not leak into BMM versions.
set('felicia',[
 ['1.3 BMM 40 kW',1289,'petrol',40,94,145,17],
 ['1.3 MPI 50 kW',1289,'petrol',50,106,162,13.5],
 ['1.6 MPI 55 kW',1598,'petrol',55,135,170,12],
 ['1.9 D 47 kW',1896,'diesel',47,125,156,16.5]
].map(([name,cc,fuel,kw,nm,speed,acc])=>named(name+' – hatchback',specSources.felicia,{bodyType:'hatchback',engine:E(fuel,cc,4,kw,nm),transmission:M(5),drive:'fwd',dimensionsMm:D(null,1635,1415,2450),topSpeedKmh:speed,acceleration0to100s:acc},'Hatchback; karoserie před modernizací má jinou délku než po roce 1998. Délka i hmotnost zůstávají null bez přesné kombinace ročníku a výbavy. U BMM a MPI nejsou směšovány momenty ani dynamické údaje.')));
// Manufacturer confirms bodies and boot sizes; generation overview deliberately selects hatchback.
generationPatches.set('felicia/0',{dimensionsMm:D(null,1635,1415,2450),trunkL:272,body:'hatchback',source:specSources.feliciaOem,dimSource:specSources.felicia,note:'Přehled se vztahuje k hatchbacku. Délka 3855/3883 mm podle modernizace není sloučena; kombi má zavazadlový prostor 447 l.'});
generationPatches.set('favorit/0',{dimensionsMm:favDimensions,trunkL:null,body:'hatchback',source:specSources.favorit,note:'Favorit hatchback; ne rozměry Formanu nebo Pick-upu. Objem kufru 251/257 l není sjednocen.'});
generationPatches.set('forman/0',{dimensionsMm:D(4160,1620,1425,2450),trunkL:null,body:'kombi',source:specSources.favorit,note:'Rozměry kombi podle českého přehledu; kufr zůstává neověřený.'});
generationPatches.set('octavia/0',{dimensionsMm:D(4511,1731,1429,2512),trunkL:528,body:'hatchback',source:specSources.octaviaOem,dimSource:specSources.octavia,note:'Octavia I liftback – rozměrový vzorek ze zdroje; délka se měnila modernizací. Objem 528 l platí pro liftback, nikoli kombi.'});
generationPatches.set('fabia/0',{dimensionsMm:D(3960,1646,1451,2462),trunkL:260,body:'hatchback',source:specSources.fabia,note:'Fabia I hatchback; ne kombi nebo sedan. Rozměrový vzorek není univerzální pro všechny nárazníky/výbavy.'});
set('1101-1102',[named('1101 Tudor',specSources.tudor,{bodyType:'sedan',engine:E('petrol',1089,4,23.5,null),drive:'rwd',dimensionsMm:D(4050,1500,1520,2485)},'Dvoudveřový Tudor; rozměry ze zdrojové modelové stránky, nikoli užitkových nebo otevřených variant.')]);
// The dimensions have a separate permanent source already retained by the earlier snapshot.
// Permanent dimension references are resolved from the local evidence before application.
set('octavia-1959',[
 named('Octavia 1.1 – sedan',specSources.octavia1959,{bodyType:'sedan',engine:E('petrol',1089,4,29,68.6),transmission:M(4),drive:'rwd',dimensionsMm:D(4065,1600,1430,null),topSpeedKmh:110},'Historická Octavia sedan. Rozvor 2390 mm v tiskové mapě a 2400 mm v encyklopedickém přehledu nejsou sjednoceny; hmotnost je pouze přibližná, proto null.'),
 named('Octavia Super 1.2 – sedan',specSources.octavia1959,{bodyType:'sedan',engine:E('petrol',1221,4,33,null),transmission:M(4),drive:'rwd'},'Super má jinou motorizaci; technická data základní Octavie nejsou automaticky přiřazena všem verzím.')
]);
set('felicia-1959',[
 named('Felicia 1.1',specSources.felicia1959,{from:1959,to:1964,bodyType:'kabriolet',engine:E('petrol',1089,4,null,null),topSpeedKmh:120},'Zdroj uvádí výkon pouze v hp; bez jisté normy není přepočítáván na kW.'),
 named('Felicia Super 1.2',specSources.felicia1959,{from:1962,to:1964,bodyType:'kabriolet',engine:E('petrol',null,4,null,null),topSpeedKmh:135},'Provedení Super doloženo od roku 1962; nominální 1.2 l není převáděno na přesné cm³.')
]);
set('1000-1100-mb',[named('1100 MBX De Luxe',specSources.mbx,{from:1967,to:1969,bodyType:'kupe',engine:E('petrol',1107,4,38,81.4),transmission:M(4)},'Samostatně doložená dvoudveřová verze MBX. Rozměry, hmotnost a zrychlení sedanů 1000 MB na ni nejsou přenášeny.')]);
set('popular',[
 ...['kupé','roadster'].map((body,i)=>named('Popular Monte Carlo – '+body,specSources.monteCarlo,{from:1936,to:1939,bodyType:i?'kabriolet':'kupe',engine:E('petrol',1386,4,null,null),transmission:M(3)},'Civilní série Monte Carlo; výkon v hp není přepočítán bez jasné normy. Rychlostní interval 110–125 km/h není přiřazen jednotlivým karoseriím.'))
]);
set('superb-1934',[named('Superb 3000 OHV',specSources.superb3000,{from:1938,to:1949,engine:E('petrol',3137,6,null,null),transmission:M(4),topSpeedKmh:125},'Výrobní meze zahrnují válečné přerušení, nikoli souvislou výrobu. Zdroj nerozlišuje všechny karoserie a výkon uvádí pouze v hp.')]);
set('440-445-450',[
 ['440',1955,1089,29.4,'sedan',1430,null,110],['445',1957,1221,33,'sedan',1430,null,115],['450',1957,1089,36.8,'kabriolet',1380,900,null]
].map(([name,from,cc,kw,body,height,mass,speed])=>named(name,specSources.s440,{from,to:1959,bodyType:body,engine:E('petrol',cc,4,kw,null,'SAE'),dimensionsMm:D(4065,1600,height,2400),massKg:mass,topSpeedKmh:speed},'Dobové výkonové údaje SAE nejsou ISO. Hmotnost 440/445 je pouze interval 900–930 kg; rychlost 450 se ve zdrojích liší 128/130 km/h, proto příslušné skaláry zůstávají null.')));
set('1202',[
 ['STW','kombi',1580,1100,1973],['dodávka','dodavka',1580,1080,1968],['Pick-up','pickup',null,1015,1968]
].map(([name,body,height,mass,to])=>named('1202 '+name+' – série 67–97',specSources.s1202,{bodyType:body,engine:E('petrol',1221,4,34.6,85.3,'SAE'),dimensionsMm:D(4485,1700,height,2685),massKg:mass,topSpeedKmh:100},'Výkon a moment rané série 67–97 podle SAE; pozdější motor 37.5 kW není směšován. Hmotnost rozlišena podle karoserie. Přesné kalendářní meze této motorové série nejsou doloženy. Výška pick-upu 1700 mm patří provedení s plachtou, na běžnou korbu není přiřazena.')));
const mbEarly=named('1000 MB – rané provedení',specSources.mb1964,{bodyType:'sedan',engine:E('petrol',988,4,27,null),drive:'rr',massKg:755,topSpeedKmh:120,dimensionsMm:D(4170,1620,1390,2400)},'Výkon, hmotnost a rychlost původního provedení podle výrobce. Rozměry z českého přehledu; pozdější motory a dvoudveřové MBX mají jiné specifikace.');
mbEarly.sources.push(specSources.mbWiki);for(const k of Object.keys(mbEarly.dimensionsMm))mbEarly.fieldSources['dimensionsMm.'+k]=[specSources.mbWiki];
overrides.get('1000-1100-mb/0').unshift(mbEarly);
generationPatches.set('1000-1100-mb/0',{dimensionsMm:D(4170,1620,1390,2400),trunkL:340,body:'sedan',source:specSources.mbWiki,note:'Rozměry a zavazadlový prostor pro sedan 1000 MB. Původní souhrnná anglická stránka uváděla 4200/1610/1400; rozporné rozměry zůstávají k ověření.'});
// Do not resolve inconsistent dimensional sources merely by preferring a language version.
generationPatches.get('1000-1100-mb/0').dimensionsMm=D(null,null,null,2400);
mbEarly.dimensionsMm=D(null,null,null,2400);for(const k of ['length','width','height'])delete mbEarly.fieldSources['dimensionsMm.'+k];
for(const [i,t]of overrides.get('felicia-1959/0').entries()){
 t.engine.powerKw=i?40.4:36.8;if(i)t.engine.displacementCc=1221;
 t.dimensionsMm=D(4065,1600,1380,2390);t.sources.push(specSources.felicia59Wiki);for(const k of Object.keys(t.dimensionsMm))t.fieldSources['dimensionsMm.'+k]=[specSources.felicia59Wiki];t.fieldSources['engine.powerKw']=[specSources.felicia59Wiki];if(i)t.fieldSources['engine.displacementCc']=[specSources.felicia59Wiki];
 if(i===0){t.topSpeedKmh=null;delete t.fieldSources.topSpeedKmh;}
 if(i===0){t.to=1962;t.fieldSources.to=[specSources.felicia59Wiki];}
 t.specificationScope.noteCs='Kabriolet; rozměry a kW z českého technického přehledu. Hmotnost je interval; základní rychlost 120/130 km/h se mezi výrobními materiály liší, proto null. Přesná norma výkonu není doložena.';
}
const f61=named('Felicia 1.1 – muzejní provedení 1961',specSources.felicia61,{bodyType:'kabriolet',engine:E('petrol',1089,4,36.8,null),dimensionsMm:D(4065,1600,1380,2390),massKg:930},'Konkrétní muzejní vůz roku 1961 popsaný výrobcem, nikoli univerzální hmotnost všech Felicií. Rozměry ze zdroje modelové řady; zrychlení neověřeno.');f61.specificationScope.modelYear=1961;f61.sources.push(specSources.felicia59Wiki);for(const k of Object.keys(f61.dimensionsMm))f61.fieldSources['dimensionsMm.'+k]=[specSources.felicia59Wiki];overrides.get('felicia-1959/0').push(f61);
generationPatches.set('felicia-1959/0',{dimensionsMm:D(4065,1600,1380,2390),trunkL:null,body:'kabriolet',source:specSources.felicia59Wiki,note:'Kabriolet podle českého přehledu; ne celková délka/rozvor odlišných předchůdců.'});
const o60=overrides.get('octavia-1959/0')[0];o60.name='Octavia 1.1 – sedan (1960)';o60.massKg=920;o60.sources.push(specSources.octavia60);o60.fieldSources.massKg=[specSources.octavia60];o60.specificationScope.modelYear=1960;o60.specificationScope.noteCs+=' Hmotnost 920 kg je přesný údaj technického panelu oficiálního magazínu, nikoli převod přibližného údaje novější tiskové mapy.';
set('octavia',[
 ['1.6 MPI',55,'petrol'],['1.8 20V',92,'petrol'],['1.9 TDI',66,'diesel']
].map(([name,kw,fuel])=>{const t=named(name+' – liftback (1996)',specSources.octaviaLaunch,{bodyType:'hatchback',engine:E(fuel,null,4,kw,null),dimensionsMm:D(4511,1731,1429,2512)},'První nabídka modelového roku 1996. Rozměry liftbacku 1996–2000 ze zdrojové generační stránky; převodovka, přesný objem, hmotnost a dynamika konkrétní varianty nejsou dovozovány z pozdějšího Tour.');t.specificationScope.modelYear=1996;return t;}));
set('fabia',[
 named('RS 1.9 TDI-PD 96 kW',specSources.fabia,{from:2003,to:2007,bodyType:'hatchback',engine:E('diesel',1896,4,96,310),transmission:M(6),drive:'fwd',dimensionsMm:D(4002,1646,1441,2462),topSpeedKmh:204,acceleration0to100s:9.5,consumptionL100:5.4},'Fabia I RS hatchback. Hmotnost 1245–1315 kg nelze převést na jeden skalár. Dobová kombinovaná spotřeba, nikoli WLTP; rozvor ze společné generační specifikace.'),
 named('Junior 1.0 MPI 37 kW',specSources.fabia,{bodyType:'hatchback',engine:E('petrol',null,4,37,null),dimensionsMm:D(3960,null,null,2462)},'Doložená výbava Junior s motorem 1.0 MPI. Přesný objem není dopočítán z litrového označení; výška a šířka základního hatchbacku nejsou sjednoceny mezi jazykovými zdroji.')
]);
generationPatches.get('fabia/0').dimensionsMm=D(3960,null,null,2462);
generationPatches.get('fabia/0').note='Základní hatchback Fabia I. Šířka 1646/1650 mm a výška 1451/1450 mm nejsou mezi zdroji sjednoceny, proto null. RS má vlastní rozměry a nesdílí výšku základní verze.';

export const conflicts=[
 {lineSlug:'100-110',field:'100 / 100 L acceleration0to100s',reason:'24 s versus measured 29 s; no common protocol established.',sources:[specSources.s100]},
 {lineSlug:'100-110',field:'trunkL',reason:'370 l combined versus manual 400 l (280+120); compartment conventions differ.',sources:[specSources.s100]},
 {lineSlug:'105-120-125',field:'120 GLS transmission.gears',reason:'Sources disagree whether 5-speed introduction belongs to 1984 or 1985.',sources:[specSources.s742]},
 {lineSlug:'130-135-136',field:'130 acceleration0to100s',reason:'15 s versus 17 s in consulted summaries; withheld pending original documentation.',sources:[specSources.s742]},
 {lineSlug:'favorit',field:'136 L engine.powerKw',reason:'Czech source: 46 kW; manufacturer Classic Days text labels 136 L but gives 58 hp. Version/engine identity unresolved.',sources:[specSources.favorit,specSources.favoritOem]},
 {lineSlug:'favorit',field:'massKg / trunkL',reason:'Mass ranges and conflicting boot volumes are not assigned to named trims.',sources:[specSources.favorit]},
 {lineSlug:'octavia-1959',field:'dimensionsMm.wheelbase / massKg',reason:'Manufacturer 2390 mm versus encyclopaedia 2400 mm; manufacturer mass is approximate.',sources:[specSources.octavia1959]},
 {lineSlug:'felicia',field:'dimensionsMm.length / massKg',reason:'Length changes with facelift; body/engine/equipment-specific mass unresolved.',sources:[specSources.felicia]}
];

export function enrichGeneration(card,g,index,evidence){
 const key=card.lineSlug+'/'+index;
 if(overrides.has(key))g.trims=structuredClone(overrides.get(key));
 if(card.lineSlug==='1101-1102'){
  const source=evidence.pages['Škoda 1101/1102'].source;
  for(const t of g.trims){t.sources.push(source);for(const k of Object.keys(t.dimensionsMm))t.fieldSources['dimensionsMm.'+k]=[source];}
 }
 const p=generationPatches.get(key);
 if(p){g.dimensionsMm=structuredClone(p.dimensionsMm);g.trunkL=p.trunkL;g.specificationScope={market:'Europe / historical',modelYear:null,variant:'Scoped body reference',bodyType:p.body,noteCs:p.note};g.fieldSources={};for(const k of Object.keys(g.dimensionsMm))if(g.dimensionsMm[k]!==null)g.fieldSources['dimensionsMm.'+k]=[p.dimSource||p.source];if(p.trunkL!==null)g.fieldSources.trunkL=[p.source];g.sources.push(p.source,...p.dimSource?[p.dimSource]:[]);}
 if(card.lineSlug==='octavia-1959'){g.dimensionsMm.wheelbase=null;g.specificationScope.noteCs+=' Rozvor ponechán null kvůli rozdílu 2390/2400 mm.';const source=evidence.pages['Škoda Octavia (1959)'].source;for(const t of g.trims){t.sources.push(source);t.fieldSources['engine.displacementCc']=[source];}}
 if(card.lineSlug==='110-r'){
  g.dimensionsMm.wheelbase=2400;g.sources.push(specSources.s100);
  if(g.trims?.[0]){g.trims[0].dimensionsMm.wheelbase=2400;g.trims[0].acceleration0to100s=18.5;g.trims[0].sources.push(specSources.s100);g.trims[0].fieldSources={...g.trims[0].fieldSources,'dimensionsMm.wheelbase':[specSources.s100],acceleration0to100s:[specSources.s100]};}
  g.trunkL=370;g.specificationScope.noteCs+=' Objem 370 l je souhrn zavazadlových prostorů, nikoli pouze přední kufr.';g.fieldSources={...g.fieldSources,trunkL:[specSources.s100]};
 }
 if(card.lineSlug==='garde'){
  const source=evidence.pages['Škoda Garde/Rapid'].source;
  g.dimensionsMm=D(4175,1610,1380,2400);g.specificationScope={market:'Europe / historical',modelYear:null,variant:'Garde, not Rapid',bodyType:'kupe',noteCs:'Délka 4175 mm podle výrobce se vztahuje na Garde; údaj 4200 mm ze sdílené stránky patří rodině s Rapidem. Rozvor je ze společné konstrukce.'};
  g.fieldSources={'dimensionsMm.length':[earlierSources.garde],'dimensionsMm.width':[earlierSources.garde],'dimensionsMm.height':[earlierSources.garde],'dimensionsMm.wheelbase':[source]};
  g.sources.push(source);if(g.trims?.[0]){g.trims[0].dimensionsMm.wheelbase=2400;g.trims[0].sources.push(source);g.trims[0].fieldSources={...g.trims[0].fieldSources,'dimensionsMm.wheelbase':[source]};}
 }
 if(card.lineSlug==='octavia'&&index===0){
  const source=evidence.pages['Škoda Octavia'].source;
  g.specificationScope.modelYear=1996;g.specificationScope.variant='1996–2000 liftback';
  for(const t of g.trims){t.sources.push(source);for(const k of Object.keys(t.dimensionsMm))t.fieldSources['dimensionsMm.'+k]=[source];t.fieldSources['engine.cylinders']=[source];}
 }
 if(card.lineSlug==='elroq'){
  const rows={'Elroq 50':[160,9],'Elroq 60':[160,8],'Elroq 85':[180,6.6],'Elroq RS':[180,5.4]};
  for(const t of g.trims||[]){const row=rows[t.name];if(!row)continue;t.topSpeedKmh=row[0];t.acceleration0to100s=row[1];t.engine.powerStandard='UN-GTR.21';t.fieldSources={...t.fieldSources,topSpeedKmh:[specSources.elroq2025],acceleration0to100s:[specSources.elroq2025],'engine.powerStandard':[specSources.elroq2025]};if(t.name==='Elroq RS'){t.dimensionsMm.length=4488;t.fieldSources['dimensionsMm.length']=[specSources.elroq2025];}t.specificationScope.noteCs+=' Dynamické údaje dle listu 5. 5. 2025; Elroq 60 má v tomto listu 8.0 s. List neplatí pro Sportline. Hmotnost zahrnuje řidiče 75 kg a je uvedena pouze intervalem, proto massKg zůstává null.';}
 }
 // Remove stale generic null warnings only for fields that were actually filled.
 const valueAt=path=>path.replace(/\[(\d+)\]/g,'.$1').split('.').reduce((v,k)=>v?.[k],card);
 card.needsReview=card.needsReview.filter(r=>!(/Value not established|Not established for this exact/.test(r.reason)&&valueAt(r.field)!==null&&valueAt(r.field)!==undefined));
 for(const conflict of conflicts.filter(c=>c.lineSlug===card.lineSlug))if(!card.needsReview.some(r=>r.reason===conflict.reason))card.needsReview.push({field:'scope',reason:conflict.reason});
}

export const versionFacts=[...overrides].map(([key,records])=>({key,records}));
export const generationFacts=[...generationPatches].map(([key,values])=>({key,...values}));
