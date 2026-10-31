export function build({get,date,merge,source}){
 const stage=(id,index,year,name,note='Modernizace podle uvedeného zdroje.')=>get(id).stages.push({index,year,name,note});
 const added=(id,name,from,to,bodyTypes,code=null,url=source(id),note='Výrobní období podle generačního článku.')=>({name,from,to,bodyTypes,code,source:url,note});
 // Regional/body/engine variants stay scoped in specificationReferences when merged.
 merge('estrima/biro',{1:0},'Birò');stage('estrima/biro',0,2022,'Birò B2211','Obnovená verze představená v listopadu 2022; přesný začátek sériové výroby nedoložen.');get('estrima/biro').source='https://green.lulop.com/it_it/post/show/253391/biro-gets-a-brand-new-look-at-.html';
 merge('exeed/et',{1:0},'Sterra ET / Exlantix ET');stage('exeed/et',0,2026,'EX7','Modernizace EX7 evidovaná v původním zdrojovaném záznamu; není samostatnou generací.');
 merge('forthing/leiting',{1:0},'Leiting / Friday EV');stage('forthing/leiting',0,2025,'Xinghai X5');
 date('geely/boyue',0,2016,2024,'Původní Boyue skončil na čínském trhu v roce 2024; období exportních přeznačených vozů se liší.');date('geely/boyue',1,2019,2025,'NL-3B: Čína do 2022, globální období podle infoboxu do 2025.');
 get('geely/boyue').append=[added('geely/boyue','Boyue Cool / Boyue (G426)',2023,null,['suv'],'G426')];
 merge('geely/emgrand',{2:1},'Emgrand (FE-3)');date('geely/emgrand',1,2014,2021,'Stejná FE-3 platforma, aktualizace 2018 vedena jako modernizace.');stage('geely/emgrand',1,2016,'Facelift 2016');stage('geely/emgrand',1,2018,'Facelift 2018');stage('geely/emgrand',1,2020,'Emgrand Up','Modernizace pro modelový rok 2021 uvedená v prosinci 2020.');
 merge('geely/geometry-a',{1:0},'Geometry A / G6');stage('geely/geometry-a',0,2021,'Geometry A Pro');stage('geely/geometry-a',0,2022,'Geometry G6');
 date('geely/okavango',1,2023,null,'Výrobní infobox Haoyue L uvádí 2023; premiéra/prodejní uvedení v prosinci 2022.');
 merge('geely/starray',{1:0},'Boyue L / Starray (FX11)');stage('geely/starray',0,2025,'Boyue L 2025');
 date('gmc/acadia',2,2024,null,'Sériová výroba od března 2024, nikoli premiéra v roce 2023.');
 date('gmc/canyon',2,2023,null,'Sériová výroba třetí rodiny od ledna 2023; premiéra v roce 2022.');
 date('gmc/terrain',2,2024,null,'Výroba 2024; modelový rok 2025.');
 merge('great-wall/coolbear',{1:0},'Coolbear / Haval M2');date('great-wall/coolbear',0,2009,2015,'Rodina včetně zvýšené odvozené M2; dílčí varianty mohou mít kratší období.');
 merge('great-wall/peri',{1:0},'Peri / Haval M1');
 merge('great-wall/voleex-c10',{1:0},'Voleex C10 / C20R');date('great-wall/voleex-c10',0,2010,2014,'Rodinné období podle infoboxu; text článku pro C10 uvádí konec 2013.');
 merge('grecav/sonique',{1:0},'Sonique');date('grecav/sonique',0,2009,2012,'Období výroby podle italského infoboxu; motor DCI je verze stejné rodiny.');
 merge('haval/f7',{1:0},'F7 / F7x I');get('haval/f7').append=[added('haval/f7','F7 II',2024,null,['suv'],null,source('haval/f7'),'Výroba pod označením F7 II v Rusku od srpna 2024; příbuzný čínský Shenshou od 2021.')];stage('haval/f7',0,2022,'Facelift 2022');
 date('haval/h1',0,2012,2014,'První H1/M4 podle generačního výrobního infoboxu.');
 date('haval/h6',0,2011,2020);merge('haval/h6',{3:2},'H6 III / H6S / H6 GT');
 merge('haval/h7',{1:0},'H7 / H7L');date('haval/h7',0,2016,2021,'Premiéra 2015, sériová výroba původního H7 od 2016; pozdější opětovné použití jména H7 označuje Big Dog/Dargo, vedený zvlášť.');
 merge('hongqi/ca770',{1:0,2:0},'CA770 / CA771 / CA773');
 merge('hongqi/h9',{1:0},'H9 / H9+');
 get('hongqi/h9').append=[{...added('hongqi/h9','H9 II',2026,null,['sedan'],null,source('hongqi/h9'),'Ohlášená druhá generace; zdroj uvádí výrobu jako dosud nezahájenou.'),dateBasis:'announcement',productionStatus:'announced'}];
 // HS7 and Big Dog explicitly have parallel export production. Do not invent end dates.
 merge('infiniti/qx50',{1:0},'QX50 (J50)');date('infiniti/qx50',0,2013,2017,'Krátká a prodloužená karoserie patří do jedné generace J50.');
 merge('izh/2715',{1:0,2:0},'2715 / 27151 / 27156');date('izh/2715',0,1972,2001,'Výrobní období celé rodiny; jednotlivé užitkové karoserie měly kratší období.');
 date('jeep/cj',3,1954,1983,'CJ-5: zahájení výroby 1954, modelový rok 1955.');date('jeep/cj',7,1981,1985,'CJ-10 podle výrobního infoboxu; prototypy CJ-1/2/4 nejsou přidány jako sériové generace.');
 date('jeep/forward-control',0,1956,1965,'FC-150 výroba od 1956; modelový rok 1957.');date('jeep/forward-control',1,1957,1965,'FC-170 podle příslušné části článku.');
 merge('jetour/dashing',{1:0},'Dashing / Shanhai L6');merge('jetour/t1',{1:0},'Shanhai T1 / Freedom / T1');merge('jetour/t2',{1:0},'T2 / Traveller / Shanhai T2');
 merge('jetour/x70',{2:1},'X70 Plus / Shanhai L7');stage('jetour/x70',0,2019,'Facelift 2019');stage('jetour/x70',1,2024,'Facelift 2024');
 merge('jetour/x90',{1:0},'X90 / X90 Plus / Shanhai L9');
 merge('kia/k3',{1:0},'K3 (BL7)');
 date('koenigsegg/agera',0,2010,2018,'Celkové období rodiny Agera; R/S/RS jsou souběžné varianty, nikoli nástupnické generace.');
 date('lancia/flavia',0,1961,1971,'Premiéra na podzim 1960, série od 1961.');date('lancia/flavia',1,2012,2014,'Novodobý kabriolet je samostatná rodina.', 'https://www.convertiblecarmagazine.com/buyers_guide/lancia-flavia/');
 date('land-rover/forward-control',0,1962,1966,'Series IIA Forward Control podle příslušné části článku.');
 merge('ligier/x-too',{1:0},'X-Too / Max / R / S');
 // Modern Lincoln placeholder expands to all dated production families.
 merge('lincoln/continental',{1:0},'Continental I');date('lincoln/continental',0,1939,1948,'Výrobní přerušení 1942–1946; zachované původní dílčí záznamy ve specificationReferences.');
 get('lincoln/continental').splitAt={2:[
 added('lincoln/continental','Continental II / Mark II',1955,1957,['coupe'],null,'https://www.thehenryford.org/collections/explore/artifact/368705','Sériový vůz pro modelové roky 1956–1957 prodáván od 1955.'),
 added('lincoln/continental','Continental III / Mark III–V',1958,1960,['sedan','coupe','cabriolet'],null,source('lincoln/continental'),'Výrobní hranice podle dostupného generačního přehledu; přesný začátek před modelovým rokem 1958 neověřen.'),
 added('lincoln/continental','Continental IV',1960,1969,['sedan','coupe','cabriolet']),
 added('lincoln/continental','Continental V',1969,1979,['sedan','coupe'],null,'https://www.automobile-catalog.com/car/1970/1411070/lincoln_continental_sedan.html','Sériová nabídka od září 1969 pro modelový rok 1970.'),
 added('lincoln/continental','Continental VI',1979,1980,['sedan','coupe'],null,source('lincoln/continental'),'Hranice 1979 odvozena od uvedení modelového roku 1980; v roce 1981 přejmenován Town Car.'),
 added('lincoln/continental','Continental VII',1981,1987,['sedan'],null,source('lincoln/continental'),'Hranice 1981 odvozena od uvedení modelového roku 1982; nikoli přesný měsíc zahájení výroby.'),
 added('lincoln/continental','Continental VIII',1987,1994,['sedan']),
 added('lincoln/continental','Continental IX',1994,2002,['sedan'])]};get('lincoln/continental').rename[3]='Continental X';
 date('lotus/esprit',0,1976,1978);date('lotus/esprit',1,1978,1982,'S2 včetně S2.2 podle infoboxu.');
 date('lotus/europa',3,1972,1975,'Europa Special do konce původní rodiny 1975.');
 date('mahindra/armada',0,1993,2001,'Armada Grand souběžná karosářská varianta, ne nástupce.');
 // Bolero Neo Plus and Lynk EV/PHEV are parallel families, not evidence of discontinuation.
 date('maruti-suzuki/alto',1,2012,2022,'Alto 800 do 2021, příbuzný K10 2014–2022; rodinná hranice zahrnuje obě větve.');
 date('maruti-suzuki/baleno',0,1998,2007,'Indické období podle výrobního infoboxu Cultus Crescent; některé trhy uvádějí obchodní uvedení 1999.','https://en.wikipedia.org/wiki/Suzuki_Cultus_Crescent');
 date('maruti-suzuki/swift',1,2011,2018,'Indická druhá generace skončila při uvedení následující rodiny v roce 2018; hranice dle nástupce.',null,'successor-boundary');date('maruti-suzuki/swift',2,2018,2024,'Indické uvedení třetí generace v únoru 2018.','https://www.marutisuzuki.com/corporate/media/press-releases/2018/february/maruti-suzuki-s-allnewswift-arrives-to-a-grand-reception-at-auto-expo-2018');
 date('maybach/sw',0,1935,1936,'SW35 podle přehledu muzea; SW38 je nástupce v roce 1936.','https://www.automuseum-maybach.de/en/maybach-story/maybach-automobiles', 'successor-boundary');
 date('abarth/1000',2,1961,1965,'Monomille výroba 1961–1965 podle specializovaného historického přehledu.','https://www.abarth-germany.de/en/translate-to-englisch-die-abarths/translate-to-englisch-abarth-monomille');
 date('bertone/freeclimber',0,1989,1992);date('bertone/freeclimber',1,1992,1993,'Podle italského článku Freeclimber 2; jiné sekundární katalogy mají pozdější konec.','https://it.wikipedia.org/wiki/Bertone_Freeclimber_2');
 date('delage/type-co',0,1916,1917,'CO E nabízen přibližně do 1917; konec není přesně doložen.','https://de.wikipedia.org/wiki/Delage_Type_CO','approximate-production');
 date('dodge/custom',0,1940,1941,'D19 od září 1940 pro modelový rok 1941.','https://fr.wikipedia.org/wiki/Dodge_Custom');date('dodge/custom',1,1941,1942,'D22 od září 1941 do zastavení civilní výroby počátkem 1942.','https://fr.wikipedia.org/wiki/Dodge_Custom');
}
