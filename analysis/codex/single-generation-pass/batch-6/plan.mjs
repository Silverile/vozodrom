import fs from 'node:fs';import assert from 'node:assert/strict';
const root='analysis/codex/single-generation-pass/batch-6',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n'),research=read(root+'/research.json'),selection=read(root+'/selection.json'),plan=[];
const en=t=>'https://en.wikipedia.org/wiki/'+t,de=t=>'https://de.wikipedia.org/wiki/'+t;
function add(id,rows,note='',url=null,extra={}){const[make,line]=id.split('/'),r=research.find(x=>x.make===make&&x.line===line);assert(r);url??=r.url;plan.push({make,line,action:rows.length>1?'split':'single',...extra,generations:rows.map(([code,from,to,bodyTypes,detail=''])=>({code,from,to,bodyTypes,url,productionStatus:to===null?'unknown':'ended',note:[note,detail,to===null?'Prázdný konec neprokazuje dnešní výrobu.':''].filter(Boolean).join(' ')}))});}
add('buick/enclave',[['GMT967',2007,2017,['suv']],['C1XX',2017,2025,['suv'],'Čína 2019–2025 a severní Amerika 2017–2024: regionální varianty téže generace.'],['C1XX-2',2024,null,['suv']]]);
add('buick/gl8',[['GMT200 / GMT201',1999,2016,['mpv']],['SGM258',2010,2025,['mpv']],['SGM358',2016,null,['mpv']],['SGM458',2022,null,['mpv'],'GL8 Century; souběžná vyšší varianta.']],'Původní, Legacy, ES a GL8 Century se vyráběly souběžně; nejde o navazující modelové roky. Electra Encasa bez doloženého označení GL8 není přidána.');
add('buick/skyhawk',[['H-body',1974,1979,['hatchback']],['J-body',1981,1989,['sedan','kupe','hatchback','kombi']]],'Kalendářní výroba dle pole Production; modelové roky 1975–1980 a 1982–1989 nejsou výrobními hranicemi.');
add('byd/e6',[['I',2009,2021,['mpv']],['II',2021,null,['mpv']]],'I/II jsou pořadová označení generací podle pramene, nikoli doložený tovární typový kód.');
add('changan/alsvin',[[null,2009,2017,['sedan','hatchback'],'Původní Alsvin 2009–2013 a souběžná modernizace V5 2012–2017 tvoří jednu konstrukční rodinu.'],[null,2017,null,['sedan'],'Čína do roku 2021; zahraniční výroba pokračovala později.']],'Pramen V5 označuje i jako druhou generaci, ale výslovně jej popisuje jako facelift původního Alsvinu. Proto jsou rozlišeny dvě konstrukční rodiny, nikoli tři marketingové názvy. Tovární typové kódy nedoloženy. Pákistánské technické verze náleží pouze nové konstrukci od roku 2017.',null,{trimIndex:1});
add('chevrolet/equinox',[['GMT191',2004,2009,['suv']],['GMT172',2009,2017,['suv']],['D2XX',2017,2024,['suv']],['VSS-S (D2XX)',2024,null,['suv']]],'Equinox EV je samostatný model, není prodloužením spalovací generace.');
add('chevrolet/s-10',[['GMT325 I',1981,1993,['pickup']],['GMT325 II',1993,2012,['pickup'],'Severní Amerika do 2004, Brazílie do 2012.'],['II Colorado (S-10)',2012,null,['pickup'],'Brazilské označení S-10 na druhé generaci Colorado.']],'I/II rozlišují dvě konstrukce GMT325, nejde o odlišné tovární kódy.');
add('fiat/siena',[['178',1996,2016,['sedan']],['326',2012,2021,['sedan']]],'Dvě souběžné konstrukce; Palio Weekend není automaticky karoserií Siena.');
add('gmc/sonoma',[['GMT325 I',1981,1993,['pickup']],['GMT325 II',1993,2004,['pickup']]],'GMC S-15/Sonoma; brazilské Chevrolet S-10 ani Colorado po 2012 nejsou prodloužením výroby GMC. I/II odlišují konstrukční generace platformy GMT325.');
add('gmc/jimmy-s15',[['GMT330 I',1982,1994,['suv']],['GMT330 II',1994,2005,['suv']]],'Kompaktní S-15 Jimmy, nikoli velký Jimmy. Brazilský Chevrolet Blazer po 2005 není prodloužením výroby GMC. I/II odlišují konstrukční generace.');
add('honda/acty',[['TA / TB / TC / VD / VH',1977,1988,['pickup','dodavka']],['HA1–5 / HH1–4',1988,1999,['pickup','dodavka']],['HA6 / HA7 / HH5 / HH6',1999,2018,['pickup','dodavka'],'Pick-up do prosince 2009, van do dubna 2018.'],['HA8 / HA9',2009,2021,['pickup']]],'Street není prodloužením výrobního období Acty. Souběh vanu a novějšího pick-upu nelze spolehlivě rozlišit jen rokem.');
add('honda/brio',[['I (DD1 / DD2)',2011,2020,['hatchback']],['II (DD1)',2018,null,['hatchback']]],'DD1 se používá v obou generacích; pořadové I/II odlišuje konstrukci. Samotný kód DD1 nebo rok souběhu neurčuje konkrétní generaci.');
add('honda/elysion',[['RR1–RR6',2004,2015,['mpv'],'Japonsko do 2013, Čína 2012–2015.'],['RC1 / RC2',2015,null,['mpv']]]);
add('honda/freed',[['GB3 / GB4 / GP3',2008,2016,['mpv']],['GB5–GB8',2016,2024,['mpv']],['GT1–GT8',2024,null,['mpv']]]);
add('honda/n-box',[['JF1 / JF2',2011,2020,['mpv','hatchback'],'N-Box/N-Box+ do 2017; odvozený Slash se stejnou konstrukční generací do února 2020.'],['JF3 / JF4',2017,2023,['mpv']],['JF5 / JF6',2023,null,['mpv']]],'Karosářská varianta Slash není samostatnou konstrukční generací. Překryv let s JF3/JF4 je skutečný.');
add('honda/ridgeline',[['YK1',2004,2015,['pickup']],['YK2 / YK3',2016,null,['pickup']]],'Kalendářní výroba první generace od konce 2004 do začátku 2015; modelový rok 2006 není počátkem výroby.');
plan.at(-1).generations[0].url=en('Honda_Ridgeline_(first_generation)');
plan.at(-1).generations[1].url=en('Honda_Ridgeline_(second_generation)');
add('honda/stepwgn',[['RF1 / RF2',1996,2001,['mpv']],['RF3–RF8',2001,2005,['mpv']],['RG',2005,2009,['mpv']],['RK',2009,2015,['mpv']],['RP1–RP5',2015,2022,['mpv']],['RP6–RP8',2022,null,['mpv']]]);
// One continuing construction: a new badge, engine or body update is not a new generation.
add('chery/tiggo-3',[['T11',2005,2023,['suv']]],'Tiggo 3 je modernizací původního T11; Tiggo 3x je jiný model.');
add('citroen/ami-6-8',[[null,1961,1978,['sedan','kombi']]],'Ami 8 (1969) je modernizace konstrukční rodiny Ami 6/8.');
add('citroen/c35',[['C35',1974,1992,['dodavka']]],'Výroba Citroënu: Fiat do 1987, poté Chausson do 1992. Doba příbuzného Fiat 242 se nepřebírá.');
add('citroen/c6-1928',[['C6',1928,1932,['sedan','kupe','kabriolet']]],'Historický šestiválec C6; moderní C6 není součástí této řady.',de('Citroën_C6_(1928)'));
add('citroen/mehari',[[null,1968,1987,['kabriolet']]],'Jedna původní konstrukce; elektrický E-Méhari je samostatný model. Výrobní období podle výrobce.','https://www.media.stellantis.com/em-en/citroen/press/citroen-mehari-55-years-and-still-inspiring');
add('citroen/traction-avant',[[null,1934,1957,['sedan','kupe','kabriolet','kombi']]],'7/11/15-Six a prodloužené karoserie tvoří konstrukční rodinu; různé rozvory se nedělí na generace.');
add('dacia/pick-up',[[null,1975,2006,['pickup']]],'1302/1304/1305/1307/1309: průběžný vývoj rodiny, různé kabiny a rozvory nejsou samostatné generace.');
add('daewoo/damas',[[null,1991,2021,['dodavka','mpv']]],'Jedna konstrukce Damas, s přerušením korejské výroby 2013–2014. Novější uzbecké vozy Chevrolet nejsou novou generací Daewoo.');
add('daewoo/labo',[[null,1991,2021,['pickup']]],'Pick-up odvozený od původní konstrukce Damas; pozdější Chevrolet není prodloužení korejské výroby Daewoo.');
add('daewoo/lacetti',[['J200',2002,null,['sedan','hatchback','kombi']]],'Původní Lacetti J200; J300 Lacetti Premiere má vlastní kartu. Přesný konec pod značkou Daewoo není doložen; konec všech Chevroletů se nepřebírá.');
add('daewoo/lacetti-premiere',[['J300',2008,2011,['sedan']]],'Lacetti Premiere: původní korejské jméno Cruze; pozdější Chevrolet Cruze ani J400 nejsou novou generací Daewoo.');
add('daewoo/lublin',[[null,1993,2013,['dodavka','pickup']]],'Lublin I/II/III: postupné modernizace původního užitkového podvozku. Výroba více společností, přerušení 2007–2011.');
add('daewoo/winstorm',[['C100',2006,2011,['suv']]],'Winstorm přejmenován při přechodu korejské nabídky na Chevrolet v roce 2011; globální Captiva není prodloužením výroby značky Daewoo.');
add('daihatsu/gran-max',[[null,2007,null,['dodavka','pickup']]],'Od října 2007; změny motorů a modernizace karoserie nemění základní konstrukci.');
add('daihatsu/luxio',[['S402M',2009,null,['mpv']]],'Jedna konstrukční rodina Luxio od února 2009.');
add('daimler-company/dr450',[['DR450',1961,1968,['sedan']]]);
add('daimler-company/ds420',[['DS420',1968,1992,['sedan']]],'Dlouhá limuzína a zakázkové nástavby nejsou další generace.');
add('de-tomaso/longchamp',[[null,1972,1989,['kupe','kabriolet']]],'Jedna konstrukční rodina, včetně odvozené otevřené karoserie.');
add('de-tomaso/pantera',[[null,1971,1992,['kupe']]],'Průběžný vývoj původního podvozku; Si z roku 1990 je modernizace. Pozdější dokončení přestaveb samo neprodlužuje sériovou výrobu.');
add('delage/type-am',[['AM',1914,1919,['sedan','kabriolet']]],'Jedna konstrukce s karosářskými variantami.',de('Delage_Type_AM'));
add('delage/type-do',[['DO',1920,1922,['kabriolet']]],'Jedna konstrukce s otevřenými karosářskými variantami.',de('Delage_Type_DO'));
add('delahaye/type-135',[['135',1935,1952,['sedan','kupe','kabriolet']]],'Zakázkové karoserie a výkonnostní varianty 135/135M/135MS nejsou oddělené generace.',de('Delahaye_Type_135'));
add('delahaye/type-148',[['148',1936,1953,['sedan','kupe','kabriolet']]],'Prodloužená rodina odvozená od 135, nikoli několik generací podle karosárny.',de('Delahaye_Type_148'));
add('donkervoort/d8',[['D8',1992,2012,['kabriolet']]],'Průběžně modernizovaný původní D8; D8 GT a GTO jsou oddělené řady.');
add('donkervoort/d8-gt',[['D8 GT',null,null,['kupe']]],'Jedna uzavřená konstrukce D8 GT. Prezentace 2007 sama nedokládá počátek sériové výroby; přesné výrobní hranice zůstávají prázdné.');
add('duesenberg/model-a',[['A',1921,1926,['sedan','kupe','kabriolet']]],'Různé zakázkové karoserie na původním podvozku nejsou generace.');
add('estrima/biro',[[null,2009,null,[]]],'Modernizace vzhledu 2022 sama neprokazuje novou konstrukční generaci. Zachována jednotlivá ověřená provedení a jejich rozsah; přesná karosářská kategorie není stanovena.');
add('fiat/1500',[[null,1935,1950,['sedan','kabriolet']]],'Předválečná řada 1500 A/B/C/D/E; model 1300/1500 z roku 1961 je jiná řada.');
add('fiat/238',[['238',1967,1983,['dodavka']]],'Sériový Fiat 238 od roku 1967; rok 1965 v souhrnném seznamu není převzat.');
add('force-motors/trax',[[null,1988,null,['suv','dodavka','pickup','kombi']]],'Různé rozvory a účelové nástavby původní rodiny. Pozdější samostatný Gurkha není novou generací Trax.');
add('ford/model-t',[['T',1908,1927,['sedan','kupe','kabriolet','pickup','dodavka']]],'Průběžný vývoj jedné konstrukce; karosářské a modelové roky se nedělí na generace.');
add('fso/125p',[['125p',1967,1991,['sedan','kombi','pickup']]],'Polski Fiat → FSO v roce 1983 je změna značky, nikoli generace.');
add('fso/syrena',[[null,1957,1972,['sedan']]],'Původní konstrukce 100–105. Pozdější výroba u FSM má vlastní kartu a neprodlužuje období FSO.');
add('fso/warszawa',[[null,1951,1973,['sedan','kombi','pickup']]],'M20/200/201/202/203/204: vývoj jedné konstrukce. Tříprostorová karoserie 1964 není nový podvozek.');
add('gaz/gaz-13',[['13',1959,1981,['sedan','kabriolet','kombi']]],'Původní Čajka včetně odvozených karoserií; 14 má vlastní kartu.');
add('gaz/gaz-24',[['24 / 24-10',1970,1992,['sedan','kombi']]],'24-10 a odvozené kombi jsou modernizace základní rodiny 24, nikoli nová konstrukční generace.');
add('gaz/gaz-3102',[['3102',1982,null,['sedan']]],'Jedna původní konstrukce. Přesný konec série není zaměněn s dokončením posledních rozpracovaných vozů.');
add('geely/vision',[['FC / FC2 / FC3',2006,2021,['sedan']]],'Pramen výslovně popisuje FC2 a FC3 jako modernizace na nezměněné platformě FC. Marketingové II/III proto nejsou samostatné konstrukční generace.');
add('ginetta/g11',[['G11',null,null,['kupe']]],'Jedna silniční konstrukce odvozená od G10; vyrobeno jen několik kusů. Kalendářní hranice výroby nedoloženy.',en('Ginetta'));
add('ginetta/g2',[['G2',null,null,['kabriolet']]],'Původní malá série/kit G2, nikoli celá historie Ginetty. Přesné hranice nejsou doloženy.');
add('ginetta/g26',[['G26',1984,null,['kupe']]],'G26 je původní konstrukce kupé. Společný konec širší rodiny G26/G28/G30/G31 v roce 1992 neurčuje samostatný konec G26.');
add('ginetta/g27',[['G27',1985,null,['kabriolet']]],'Samostatná otevřená konstrukce G27; období příbuzných G33/G34 se nepřebírá.');
add('ginetta/g40r',[['G40R',null,null,['kupe']]],'Silniční G40R, nikoli závodní G40 od 2008. Představení nebo plánované prodeje samy nedokládají přesný výrobní interval.');
add('ginetta/grs-tora',[['GRS Tora',1983,1988,['kombi','pickup']]],'Mark II (dodávky od srpna 1984) upravuje zadní část stejné konstrukce; oba typy nabízely souběžně.',en('Ginetta_G2'));
add('gmc/vandura',[[null,1970,1996,['dodavka','mpv']]],'Vandura/Rally jsou třetí konstrukce řady G. Handi-Van před 1970 a Savana od 1996 mají vlastní řady.');
add('great-wall/deer',[[null,1996,2013,['pickup']]],'G1–G5 označují provedení kabiny a rozvoru původní konstrukce, nikoli doložených pět konstrukčních generací.');
add('great-wall/hover-h5',[[null,2010,2020,['suv']]],'Původní Hover H5. Nová konstrukce Haval H5 od 2023 je v samostatné kartě značky Haval.');
add('hindustan-motors/contessa',[[null,1984,2002,['sedan']]],'Jedna karoserie odvozená od Victor FE; změna motoru Isuzu neznamená novou generaci.');
add('hongqi/ca72',[['CA72',1959,null,['sedan']]],'Rok 1958 patří prototypu; sériová výroba od 1959. Dostupný pramen uvádí rozporný konec 1965/1967, proto zůstává prázdný.');
add('hongqi/ca770',[['CA770 / CA771 / CA773',1966,1981,['sedan']]],'Jedna konstrukce s rozdílným rozvorem. Pozdější odlišná označení jako CA7225LH a retro HQE/L5 nejsou pokračováním této řady.');
const reasons={
 'buick/electra':'Шесть конструктивных поколений; ранние границы в доступном тексте — модельные годы, а не подтверждённые календарные даты производства.',
 'buick/model-f-g':'Нужны отдельные периоды именно F/G; общий период Buick Model B не подходит.',
 'byd/f3':'Второе семейство связано с Surui/F3 Plus; необходимо отделить собственные F3 от соплатформенных Qin/e5 и проверить сферу фото/мотора.',
 'cadillac/deville':'Восемь поколений, но ранние границы и рестайлинг 1989 требуют разделения модельных и производственных лет.',
 'cadillac/fleetwood':'Fleetwood Brougham, переднеприводный C-body и заднеприводный D-body перекрываются; необходимы точные периоды маркировки и производства.',
 'cadillac/model-f':'Общая статья Cadillac Model A не устанавливает производственный период конкретного Model F.',
 'cadillac/series-70-75':'Нельзя автоматически считать каждую группу модельных лет отдельной конструкцией; также требуется отделить Fleetwood Limousine 1977–1984.',
 'casalini/kore-500':'Период именно Kore 500 и его отношение к поздним Casalini недостаточно документированы.',
 'changan/benben':'Параллельный BenBen Mini не является последовательным поколением BenBen; требуется собственная карта либо явная карта семейств.',
 'changan/star':'Номера Star 2/3/5/7/9 могут обозначать параллельные модели; нужна модельная карта и разграничение Karvaan.',
 'chevrolet/bel-air':'Отдельные кузова очевидны, но расходятся производственные сроки канадских последних серий и общая дата окончания.',
 'chrysler/valiant':'Много кодов RV/SV/AP/VC/VE/VF/VG/VH/…; необходимо отделить конструктивные смены от рестайлингов.',
 'dacia/2000':'Расходятся периоды Dacia и Renault 20; общий срок Renault не доказывает выпуск Dacia.',
 'dacia/d6':'Нужен собственный период румынской D6, не французского Renault Estafette.',
 'derways/land-crown':'Анонс 2006 не подтверждает фактический серийный выпуск и его границы.',
 'derways/plutus':'Нужны производственные даты конкретной модели, не общая история компании.',
 'derways/saladin':'Анонс и прототип недостаточны для периода серийного выпуска.',
 'dkw/f3':'Не установлено разграничение прототипов и серии; F3 нельзя датировать общей историей DKW.',
 'dodge/attitude':'Четыре различных донора; найденные месяцы относятся к продажам, необходимо подтвердить даты выпуска под Dodge.',
 'dodge/kingsway':'Многолетняя экспортная маркировка разных Plymouth; требуется карта конкретных конструкций и календарных производственных границ.',
 'dodge/senior-six':'Нужны заводские таблицы дат по сериям; модельный год недостаточен.',
 'dodge/standard-six':'Нужны заводские таблицы дат по сериям; модельный год недостаточен.',
 'dodge/victory-six':'Нужны заводские таблицы дат по сериям; модельный год недостаточен.',
 'dongfeng/a60':'Необходимо отделить A60/eA60 от E70 и подтвердить фактический конец выпуска каждого обозначения.',
 'fiat/marengo':'Четыре разных базовых универсала; точные календарные границы ещё не подтверждены по каждой конструкции.',
 'force-motors/viking':'Коммерческий автобус: требуется подтвердить класс кузова и собственный выпуск, не общую историю производителя.',
 'forthing/lingzhi':'Lingzhi M3/M5 и Lingzhi Plus могут быть параллельными семействами; имеющийся размер нельзя перенести на все версии.',
 'ginetta/f400':'Источники расходятся по окончанию краткого выпуска под Ginetta; нельзя использовать весь период Farboud/Farbio.',
 'gmc/c-k-series':'Необходимо отделить ранние C/K от GMT400/Sierra с собственной картой; ранние годы часто модельные.',
 'gmc/suburban':'Нужно проверить отдельную маркировку GMC и ближневосточное продолжение GMT800; даты Chevrolet не равны датам GMC.',
 'great-wall/cc513':'1984 относится к основанию компании; фактический выпуск именно CC513 ещё не установлен.',
 'hongqi/century-star':'Нужно отделить Century Star от общей CA7200/Mingshi и установить собственные даты.'
 ,'hindustan-motors/veer':'Страница производителя недоступна, доступная копия новости не содержит полного текста. Точные производственные даты не подтверждены.'
};
// Every chassis must remain searchable as a complete token. A display range such
// as RR1–RR6 hides RR2/RR3/RR4/RR5 from the existing registration matcher.
for(const p of plan)for(const g of p.generations)if(g.code)g.code=g.code.replace(/\b([A-Z]+)(\d+)–(?:[A-Z]+)?(\d+)\b/g,(_,prefix,a,b)=>Array.from({length:Number(b)-Number(a)+1},(_,i)=>prefix+(Number(a)+i)).join(' / '));
const done=new Set(plan.map(p=>p.make+'/'+p.line)),deferred=selection.filter(x=>!done.has(x.make+'/'+x.line)).map(x=>({...x,reason:reasons[x.make+'/'+x.line]}));assert(deferred.every(x=>x.reason));assert.equal(plan.length+deferred.length,100);write(root+'/plan.json',plan);write(root+'/deferred.json',deferred);console.log({updated:plan.length,split:plan.filter(p=>p.action==='split').length,deferred:deferred.length,generations:plan.reduce((s,p)=>s+p.generations.length,0)});
