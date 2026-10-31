export function build({get,date,merge,source}){
 const stage=(id,index,year,name,note='Modernizace podle uvedeného zdroje.')=>get(id).stages.push({index,year,name,note});
 const added=(id,name,from,to,bodyTypes,code=null,note='',url=source(id))=>({name,from,to,bodyTypes,code,source:url,note});
 merge('mclaren/600lt',{1:0},'600LT');date('mclaren/600lt',0,2018,2021,'Rodina kupé/Spider podle výrobního infoboxu; jednotlivé karoserie mají kratší období.','https://de.wikipedia.org/wiki/McLaren_600LT');
 merge('mclaren/720s',{1:0},'720S');date('mclaren/720s',0,2017,2023,'Kupé a Spider patří do stejné generace; 750S je veden zvlášť.');
 merge('mclaren/artura',{1:0},'Artura');
 date('mg/mg5',2,2019,null,'Exportní MG5 odvozený z Roewe i5 není čínská generace MG5 II ani samostatně vedené MG5 EV.','https://en.wikipedia.org/wiki/MG5_(automobile)');
 merge('microcar/rj49',{1:0},'RJ49 / RJ125 / DX125');get('microcar/rj49').source='https://www.lanemotormuseum.org/collection/cars/item/microcar-rj-49e-1985/';
 date('nash/advanced-six',0,1925,1929,'První rodina Advanced Six.','https://de.wikipedia.org/wiki/Nash_Advanced_Six');date('nash/advanced-six',1,1935,1935,'Jméno Advanced Six použito znovu pouze v roce 1935.','https://de.wikipedia.org/wiki/Nash_Advanced_Six');
 date('nsu/6-10-6-18',1,1907,1909,'Podle výrobního infoboxu 6/12 PS.','https://de.wikipedia.org/wiki/NSU_6/12_PS');date('nsu/6-10-6-18',2,1910,1911,'Podle výrobního infoboxu; text článku zmiňuje 1909, začátek série zde podle infoboxu.','https://de.wikipedia.org/wiki/NSU_6/14_PS');date('nsu/6-10-6-18',3,1911,1914);
 merge('omoda/5',{1:0},'Omoda 5 / C5 / E5');stage('omoda/5',0,2024,'Facelift MY2025','Modernizace poprvé uvedena v září 2024 pro následující modelový rok.');stage('omoda/5',0,2025,'Facelift MY2026','Modernizace představena v říjnu 2025.');
 merge('pagani/utopia',{1:0},'Utopia');date('pagani/utopia',0,2023,null,'Premiéra a prototypy 2022; zákaznické vozy od 2023 podle části Production.');
 merge('polestar/4',{1:0},'Polestar 4');
 // The empty family placeholder carries no versions; replace it with actual periods.
 get('pontiac/grand-prix').replaceFirst=added('pontiac/grand-prix','Grand Prix I',1962,1964,['coupe']);
 get('pontiac/grand-prix').insertAfterFirst=[
 added('pontiac/grand-prix','Grand Prix II',1964,1968,['coupe','cabriolet'],null,'Hranice 1964 odvozena od uvedení modelového roku 1965; přesný měsíc výroby neověřen.'),
 added('pontiac/grand-prix','Grand Prix III',1968,1972,['coupe']),
 added('pontiac/grand-prix','Grand Prix IV',1972,1977,['coupe']),
 added('pontiac/grand-prix','Grand Prix V',1977,1987,['coupe']),
 added('pontiac/grand-prix','Grand Prix VI',1987,1996,['coupe','sedan'],null,'Kupé od října 1987, sedan od září 1989.'),
 added('pontiac/grand-prix','Grand Prix VII',1996,2003,['coupe','sedan'])];get('pontiac/grand-prix').rename[1]='Grand Prix VIII';
 date('pontiac/vibe',0,2002,2008,'První generace do února 2008; sériová výroba, nikoli MY2003–2008.');get('pontiac/vibe').rename[0]='Vibe I';get('pontiac/vibe').rename[1]='Vibe II';
 date('ram/700',0,2014,2020,'Období označení Ram 700; starší výroba Fiat Strada nezačíná výrobu pod značkou Ram. Hranice 2020 podle uvedení nástupce.','https://www.media.stellantis.com/br-es/ram/press/con-la-nueva-700-ram-reinventa-el-segmento-de-las-pickups-pequenas','successor-boundary');date('ram/700',1,2020,null,'Nová Ram 700 výrobní a prodejní rodina uvedena 2020.','https://www.media.stellantis.com/br-es/ram/press/con-la-nueva-700-ram-reinventa-el-segmento-de-las-pickups-pequenas');
 get('roewe/rx5').insertAfterFirst=[added('roewe/rx5','RX5 Max / eMax',2019,2023,['suv'],'AS28','Souběžná větší rodina; první RX5 / RX5 Plus tím nekončí.')];stage('roewe/rx5',0,2020,'RX5 Plus');
 date('spyker/c8',1,2009,2018,'Rodinné období včetně závěrečné LM85 podle generačního přehledu; základní Aileron uváděn do 2016.');date('spyker/c8',2,2016,null,'Představení Preliator 2016; zahájení sériové výroby zde nepotvrzeno.',null,'announcement');date('spyker/c8',3,2026,null,'XXV představen 14. srpna 2026; výroba omezené série je oznámena, začátek série nepotvrzen.','https://www.prnewswire.com/news-releases/spyker-c8-preliator-xxv-coupe-146-years-in-the-making-a-new-era-begins-302851324.html','announcement');
 date('tvr/griffith',1,1990,2002,'Podle výrobního infoboxu; obchodní modely často uváděny od 1991.','https://en.wikipedia.org/wiki/TVR_Griffith');date('tvr/griffith',2,2017,null,'Představen v září 2017; sériová výroba nepotvrzena.','https://en.wikipedia.org/wiki/TVR_Griffith','announcement');
 merge('volkswagen/karmann-ghia',{1:0},'Karmann Ghia (Typ 14)');
 merge('wanderer/w11',{1:0},'W 11 10/50 PS');date('wanderer/w11',0,1928,1933,'Období osobních vozů; vojenský W 11/I 1933–1941 není zaměněn za pokračování osobních karoserií.');stage('wanderer/w11',0,1930,'Modernizace 1930');
 merge('wolseley-motors/1100-1300',{1:0},'1100 / 1300 (ADO16)');date('wolseley-motors/1100-1300',0,1965,1973);stage('wolseley-motors/1100-1300',0,1968,'1300 Mk II');
 merge('wolseley-motors/hornet',{2:1,3:1},'Hornet (ADO15)');date('wolseley-motors/hornet',1,1961,1969);stage('wolseley-motors/hornet',1,1963,'Mk II');stage('wolseley-motors/hornet',1,1966,'Mk III');
 stage('wuling-motors/hongguang-mini-ev',1,2026,'Facelift 2026');
 // Rongguang infobox calls this MY2026, but prose explicitly dates series production.
 date('wuling-motors/rongguang',1,2025,null,'Výroba druhé generace od října 2025; modelový rok 2026.');
 // Known Indian starts and exact CJ4 end; unknown ends are not labelled current.
 const museum='https://mahindramuseum.in/';
 date('mahindra/cj',0,1949,1950,'Hranice podle indického nástupce CJ3A; nejde o americké období Willys.',museum+'2021/02/21/cj-2a/','successor-boundary');
 date('mahindra/cj',1,1950,1953,'Hranice podle indického nástupce CJ3B.',museum+'2021/02/26/cj-3a/','successor-boundary');
 date('mahindra/cj',2,1953,null,'Indický CJ3B do počátku 90. let; přesný konec není zveřejněn.',museum+'2021/02/27/cj-3b/');
 date('mahindra/cj',3,1967,null,'CJ4 1967–1974; od 1974 CJ4A do konce 90. let, přesný konec nezjištěn.',museum+'2021/06/13/cj-4/');stage('mahindra/cj',3,1974,'CJ4A');get('mahindra/cj').source=museum+'2021/06/29/cj-4a/';get('mahindra/cj').unknownEndIndexes=[2,3];
}
