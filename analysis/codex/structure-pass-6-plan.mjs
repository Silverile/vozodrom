export const updates=[];
const wiki=t=>'https://en.wikipedia.org/wiki/'+t;
const date=(id,index,from,to,source,proof,note='',name=null)=>updates.push({id,index,from,to,source,proof,note,name});
const titles={'land-rover/freelander':'Land_Rover_Freelander','hillman/minx':'Hillman_Minx','acura/legend':'Acura_Legend','adler/favorit':'Adler_Favorit','alfa-romeo/8c-historic':'Alfa_Romeo_8C','amc/matador':'AMC_Matador','auto-union/1000':'Auto_Union_1000','baic/senova-x55':'Senova_X55','baic/u5':'Senova_D50','chery/eastar':'Chery_Eastar','force-motors/gurkha':'Force_Gurkha','ginetta/g4':'Ginetta_G4','haval/h5':'Haval_H5','hindustan-motors/ambassador':'Hindustan_Ambassador','infiniti/i':'Nissan_Cefiro','infiniti/q60':'Infiniti_Q60','innocenti/mini-bertone':'Innocenti_Mini','jaguar/e-type':'Jaguar_E-Type','jeep/commando':'Jeepster_Commando','jeep/wagoneer':'Jeep_Wagoneer','lamborghini/countach':'Lamborghini_Countach','ligier/js4':'Ligier_JS4','lotus/evora':'Lotus_Evora','maruti-suzuki/800':'Maruti_800','wuling-motors/rongguang':'Wuling_Rongguang','ford/explorer':'Ford_Explorer'};
const d=(id,index,from,to,proof,note='',name=null)=>date(id,index,from,to,wiki(titles[id]),proof,note,name);
d('land-rover/freelander',1,1997,2006,'L314 production October 1997–November 2006; three-door and five-door bodies are concurrent.');
d('ford/explorer',1,1994,2003,'Four-door UN105 production ends December 2000; combined generation includes three-door Explorer Sport through July 2003.','Pětidveřová karoserie do roku 2000; třídveřový Explorer Sport pokračoval do roku 2003.');
d('ford/explorer',2,2000,2005,'U152 production November 2000–June 2005; 2002 is a model year.');
date('jaguar/xf',4,2016,2025,'https://www.jlr.com/annual-report-2025','JLR FY24/25 report schedules CJLR XF-L production end September 2025.','Čínský XFL: konec 2025 podle výrobního plánu JLR FY24/25; evropský XF skončil 2024.');
date('ram/1500',0,2008,2024,wiki('Ram_pickup'),'DS production September 2008–2024; distinct from MY2009 and concurrent DT.','Řada DS od září 2008 původně jako Dodge Ram; později Ram 1500 Classic.','DS – 1500 / Classic');
date('nissan/interstar',0,2002,2010,'https://www.nissan-global.com/EN/DOCUMENT/PDF/AR/2002/ar2002.pdf','Manufacturer chronology records European Interstar sales starting March 2002.','Pod značkou Nissan od 2002; dřívější roky Renaultu Master se nepřebírají.');
date('jaguar/f-type',1,2014,2024,'https://media.jlr.com/jaguar/en-gb/news/2014/04/jose-mourinho-takes-delivery-f-type-r-coupe-jaguar-launches-r-performance-network','April 2014 manufacturer release explicitly announces F-TYPE Coupe series production.');
d('hillman/minx',0,1931,1939,'Pre-war production October 1931–1939; 1932 is initial model year.');
d('hillman/minx',1,1945,1948,'Post-war Mark I–VIII production begins 1945; Mark III starts 1948.');
date('ds-automobiles/ds-4',0,2015,2018,'https://www.media.stellantis.com/uk-en/ds/press/new-ds-4-ds-4-crossback-on-sale-now-uk-pricing-specification','Standalone DS 4 and Crossback on sale November 2015.','Samostatná značka DS od 2015; základní Citroën DS4 se vyráběl již dříve.');
for(const id of ['ram/2500','ram/3500'])date(id,0,2009,2018,'https://www.autoweek.com/news/a2016781/chryslers-heavy-duty-ram-pickups-are-way-dealers/','October 20, 2009 report records new 2500/3500 production starting the previous week in Saltillo.','Heavy Duty: sériová výroba od října 2009 pro modelový rok 2010.');
date('ac-cars/cobra',3,1966,1969,'https://flymall.org/docs/AChistory/AChistory.pdf','AC Owners Club archivist history identifies AC 289 Sports built 1966–1969.');
d('acura/legend',0,1985,1990,'First-generation production 1985–1990, distinct from MY1986–1990.');
d('adler/favorit',0,1929,1933,'First-series production 1929–1933; 1933–1934 continuation retained separately.');
d('alfa-romeo/8c-historic',0,1931,1935,'Production-car history gives 8C 2300 1931–1935.');
d('alfa-romeo/8c-historic',1,1937,1938,'Road-going 2900B regular production: ten in 1937, twenty-two in 1938. Separate 1941 parts assembly excluded.','Silniční 2900B: řádná série 1937–1938; vůz sestavený z dílů 1941 není prodloužením série.','8C 2900B – silniční řada');
date('alpina/b10',3,1997,2003,'https://de.wikipedia.org/wiki/Alpina_B10','E39 B10 production January 1997–October 2003.');
date('alpina/b8',0,1995,1998,'https://www.alpina-archive.com/?page_id=59','Model archive explicitly states April 1995–1998 production; 1994 presentation prototype excluded.');
for(const index of [1,2])d('amc/matador',index,1973,1978,'Second-generation MY1974 line available from August 1973; coupe sales period explicitly begins August 1973.','Kalendářní začátek nabídky MY1974 v roce 1973; souběžný sedan/kombi a kupé zůstávají oddělené.');
d('auto-union/1000',0,1958,1963,'German 1000/1000S saloon production 1958–1963; 1000Sp sports continuation is separate.');
d('auto-union/1000',1,1960,1969,'Argentine licensed production 1960–1969.');
d('baic/senova-x55',1,2017,2025,'Second-generation production field starts 2017; heading uses model year 2018.');
d('baic/u5',0,2013,2017,'D50 first-generation production 2013–2017; heading starts MY2014.');
d('baic/u5',1,2017,null,'D50/U5 second-generation production field 2017–present; heading starts MY2018.');
date('brilliance/bs2',1,2009,2013,'https://model-copy.info/article_info.php?articles_id=418&language=en','Model-specific history distinguishes FRV hatch May 2008 and FSV sedan manufacture 2009; existing family end retained.');
date('brilliance/h230',2,2017,2020,'https://de.wikipedia.org/wiki/Brilliance_H230','Electric H230 available from February 2017; 2012 is the petrol sedan.');
date('bristol-cars/blenheim',0,1993,1997,'https://bristol-cars.co.uk/heritage/blenheim','Manufacturer heritage dates first Blenheim to 1993; Blenheim 2 begins 1998.');
d('chery/eastar',0,2004,2011,'B11 first-generation production 2004–2011.');
d('force-motors/gurkha',0,2008,2019,'Production field lists first three series 2008–2019; newer family starts 2021.');
date('geely/mk',1,2008,2017,'https://fr.wikipedia.org/wiki/Geely_Jinying','Dedicated Jinying hatchback article starts Chinese manufacture 2008; longer existing export end retained.');
d('ginetta/g4',0,1961,1969,'Prose distinguishes 1959 G3 from 1961 G4 and explicitly says original production stopped 1969.','Rok 1959 patří G3; G4 od 1961. Text uvádí ukončení původní série 1969.');
d('haval/h5',0,2010,2020,'First H5 production period 2010–2020; second starts 2023.');
d('hindustan-motors/ambassador',0,1957,1963,'Mark I production field 1957–1963.');
date('hudson/wasp',0,1952,1954,wiki('Hudson_Wasp'),'First-generation production infobox explicitly 1952–1954.','Začátek podle generačního výrobního infoboxu; souhrnný údaj rodiny uvádí také 1951.');
d('infiniti/i',0,1995,1999,'Infiniti A32 manufacturing begins June 27, 1995; successor supplied from 1999 as MY2000.','Infiniti I30, nikoli dřívější japonský Nissan Cefiro.');
date('infiniti/i',1,1999,2004,'https://www.automobile-catalog.com/curve/2000/2166290/infiniti_i30.html','North American A33 Infiniti I30 production/sales period starts mid-year 1999; Japanese Cefiro began earlier.');
date('infiniti/m30',1,1991,1992,'https://www.auto-forever.com/voitures/infiniti-m30-convertible/','History explicitly distinguishes 1989 presentation from ASC series manufacture starting 1991.');
for(const index of [0,1])d('infiniti/q60',index,2013,2015,'First Q60 generation identifies renamed V36 coupe and convertible from 2013, not earlier G-series.','Označení Q60 od 2013; původní karoserie Infiniti G se vyráběly dříve.');
date('infiniti/q70',1,2014,2019,'https://static.nhtsa.gov/odi/rcl/2024/RMISC-24V470-6303.pdf','Manufacturer recall chronology gives Q70L manufacture July 21, 2014–September 21, 2019 despite MY2015 designation.');
d('innocenti/mini-bertone',1,1982,1990,'Daihatsu engines and new suspension entered production April 1982; subsequent Minitre rename.');
date('izh/2126',1,2000,2005,'https://www.zr.ru/content/amp/articles/917832-izh-2126-polnaya-istoriya/','Factory 2126-060 declared serial product in 2000; earlier 1995 Norma-Avto development excluded.','Tovární 4x4 od 2000; předchozí vývoj a malosériové úpravy Norma-Avto nejsou zahrnuty.','2126-060/062 – tovární 4x4');
d('jaguar/e-type',2,1966,1968,'Series 1 2+2 body added 1966; not ordinary two-seat coupe start 1961.');
d('jeep/commando',0,1966,1971,'Jeepster Commando manufacture starts 1966; 1967 is initial model year.');
d('jeep/wagoneer',0,1962,1983,'Manufacture began 1962, MY1963; renamed Grand Wagoneer continuation remains separate.');
d('lamborghini/countach',0,1974,1990,'Countach production 1974–1990; 1971 prototype excluded.');
d('ligier/js4',1,1982,1987,'Grouped derivative family starts with JS8 1982; JS6 follows MY1984, JS10 late 1983, Serie 5 late 1986.','Skupina derivátů: JS8 od 1982, JS6 od MY1984, JS10 představen 1983, Série 5 od 1986.');
d('lotus/evora',0,2009,2015,'Family manufacture starts 2009; Evora S ended 2014 and original series replaced by Evora 400 in 2015.','Původní Evora do příchodu 400 v roce 2015; Evora S skončila již 2014.');
d('maruti-suzuki/800',0,1983,1986,'800 manufacture begins 1983; full model change explicitly 1986.');
d('maruti-suzuki/800',1,1986,2014,'Full model change 1986; final 800 manufacture 2014.');
d('wuling-motors/rongguang',1,2026,null,'Second-generation production field says 2026–present; 2025 was its introduction.','Výrobní začátek 2026 podle generačního infoboxu; předchozí rok označoval uvedení.');
date('geely/okavango',0,2020,2025,wiki('Geely_Haoyue'),'First-generation production field gives 2020–2025; continuing right-hand-drive Proton X90 production is a separately catalogued badge.','Původní Geely do 2025; pokračující Proton X90 se vede pod značkou Proton.');
export const unresolved={
 'abarth/1000':'Identified concurrent Bialbero/Zagato derivative; generic 850/1000 article does not establish its exact last series-production year.',
 'mahindra/cj':'Museum identifies overlapping CJ variants and starts, but exact ends of CJ3B/CJ4/CJ540DP/CJ640DP remain unconfirmed; no successor-year truncation.',
};
export const special={
 'mercedes-benz/trida-g':'W463 genuinely reused for 1990–2018 and 2018–2024 generations; preserve codes and year distinction.',
 'volkswagen/kaefer':'KdF entry explicitly describes pre-series history; no series start copied from 1938 prototype. Post-war series starts December 1945.',
 'geely/emgrand':'SS11/SS21 parallel production; FE-3 2014–2021 currently combines two Wikipedia-labelled evolutions, requiring a separate generation/facelift decision.',
 'bentley/batur':'Distinct limited-run coupe/convertible bodies. Official source establishes 18 coupes, not an end year; no forced successor boundary.',
};
