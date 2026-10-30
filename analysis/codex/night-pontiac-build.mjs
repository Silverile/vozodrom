import fs from 'node:fs';
import {card,generation,version,markUnknowns,saveCards,proposedLine} from './night-card-helpers.mjs';
const make='pontiac',cards=[];
if(fs.existsSync('src/data/model-cards/pontiac.json'))throw Error('Claude-owned Pontiac file exists; handoff required');
const B='https://www.auto-brochures.com/makes/Pontiac/',S={gm:'https://www.gm.com/heritage',p08:B+'Pontiac_US%20Full%20Line_2008.pdf',p84:B+'Pontiac_US%20Full%20Line_1984.pdf',p70:B+'Pontiac_US%20Full%20Line_1970.pdf',p93:B+'Pontiac_US%20Full%20Line_1993.pdf',g8:B+'Pontiac_US%20G8_2009.pdf',g3:B+'G3/Pontiac_US%20G3_Flyer_2009.pdf',vibe:B+'Vibe/Pontiac_US%20Vibe%202010.pdf',fiero:'https://tnmot.org/collection/pontiac-fiero-se/',solstice:'https://autoinfo.jp/release/MY07_Solstice.pdf',ad54:'https://princealbertlibrary.ca/padh/1953/December/Dec%2017%2C1953.pdf',parts:'https://pontiacsafari.com/MPC/Pages/page_0499-532_Group08.pdf'};
function add(slug,name,note,source,bodyTypes=null,data={}){cards.push(card(make,slug,name,`Pontiac ${name} je ${note}. Karta zatím nerozlišuje všechny výrobní generace, trhy a motorizace.`,[generation(`${name} – rodina, úplné členění neověřeno`,null,null,[source],{bodyTypes,markets:['United States'],marketNotesCs:'Historická nabídka podle uvedeného pramene; nikoli potvrzená distribuce v Česku.',...data})],[source],{isAddition:true}));saveCards(make,cards);}
add('six','Six / Series 6-27','raná šestiválcová rodina značky odlišná od souběžných vozů Oakland','https://www.poci.org/vehicle-stories/a-comprehensive-restoration-returned-this-1926-pontiac-to-its-glory-days',['kupe']);
add('big-six','Big Six','předválečná šestiválcová řada doložená dobovým prospektem pro rok 1930','https://www.lov2xlr8.no/brochures/pontiac/30pbig/30pbig.html');
add('v8-1932','V8 (1932)','raná osmiválcová řada doložená prospektem pro rok 1932','https://www.lov2xlr8.no/pontiac.html');
add('straight-eight','Straight Eight','předválečná řadová osmiválcová rodina doložená prospektem pro rok 1933','https://www.lov2xlr8.no/brochures/pontiac/33pse/33pse.html');
for(const [slug,name,note]of [['chieftain','Chieftain','poválečná osobní řada'],['star-chief','Star Chief','vyšší osobní řada představená v dobové reklamě jako novinka'],['pathfinder','Pathfinder','kanadská osobní řada s vlastní dobovou specifikací'],['laurentian','Laurentian','kanadská osobní řada odlišná od stejně starých amerických provedení']])add(slug,name,note,S.ad54,null,{markets:['Canada']});
add('super-chief','Super Chief','poválečné označení doložené originálním katalogem náhradních dílů pro rok 1957',S.parts);
add('bonneville','Bonneville','dlouhodobé jméno větších osobních automobilů s různými technickými základy',S.parts);
const gtoHistory='https://news.gm.com/home.detail.html/Pages/topic/us/en/2025/sep/0917-Retro-Rides-Muscling-future-1964-Pontiac-GTO.html';
add('gto','GTO','sportovní označení, které začalo jako provedení středně velkého automobilu',gtoHistory,null,{from:1963});
add('firebird','Firebird','sportovní osobní řada zavedená pro modelový rok 1967',S.gm);
add('grand-prix','Grand Prix','osobní řada zahrnující historická kupé i novější sedany',S.p70,['kupe']);
for(const [slug,name,note]of [['tempest','Tempest','historická rodina středně velkých osobních vozů'],['le-mans','LeMans','osobní jméno používané v různých historických obdobích'],['catalina','Catalina','velká osobní řada odlišná od staršího karosářského označení Catalina']])add(slug,name,note,S.p70);
add('safari','Safari','označení osobních kombi používané v různých částech nabídky',B+'Pontiac_US%20Safari_1974.pdf',['kombi']);
add('grand-ville','Grand Ville','větší osobní řada sedmdesátých let','https://www.lov2xlr8.no/pontiac.html');
add('grand-am','Grand Am','jméno několika konstrukčně odlišných osobních rodin','https://www.lov2xlr8.no/pontiac.html');
for(const [slug,name,body]of [['astre','Astre',null],['acadian','Acadian',null],['phoenix','Phoenix',null],['sunbird','Sunbird',null],['parisienne','Parisienne',null],['6000','6000',null],['1000','1000 / T1000',null],['2000','J2000 / 2000',null]])add(slug,name,'historická osobní rodina doložená dobovým katalogem',S.p84,body);
add('ventura','Ventura','osobní řada s historickými vazbami na výbavy větších modelů','https://www.lov2xlr8.no/pontiac.html');
add('fiero','Fiero','dvoumístné kupé s motorem uprostřed',S.fiero,['kupe'],{from:1983,to:1988,productionStatus:'ended'});
add('trans-sport','Trans Sport','osobní víceúčelová řada s variabilním interiérem',B+'Pontiac_US%20Trans%20Sport_1998.pdf',['mpv']);
add('sunfire','Sunfire','menší osobní řada doložená originálním prospektem','https://www.lov2xlr8.no/pontiac.html');
add('montana','Montana / SV6','osobní víceúčelová řada',B+'Pontiac_US%20SV6_2006.pdf',['mpv']);
for(const [slug,name,note,body]of [['g5','G5','menší osobní kupé',['kupe']],['g6','G6','osobní rodina se sedanem, kupé a skládací pevnou střechou',['sedan','kupe','kabriolet']],['g8','G8','velký sedan s pohonem zadních kol',['sedan']],['solstice','Solstice','dvoumístný sportovní roadster',['kabriolet']],['torrent','Torrent','rodinný crossover',['suv']],['vibe','Vibe','kompaktní praktický osobní vůz',['hatchback']]])add(slug,name,note,S.p08,body);
add('g3','G3','menší osobní vůz doložený americkým prospektem pro rok 2009',S.g3,['hatchback']);
add('aztek','Aztek','rodinný crossover s osobním interiérem','https://experience.gm.com/ownercenter/content/dam/gmownercenter/gmna/dynamic/manuals/2001/pontiac/aztek/2001_pontiac_aztek_owners.pdf',['suv']);
add('torpedo','Torpedo','předválečná osobní rodina uvedená v prospektu pro rok 1940 jako Torpedo Eight','https://www.lov2xlr8.no/brochures/pontiac/40po/bilder/2.jpg');
const get=s=>cards.find(c=>c.lineSlug===s),persist=()=>saveCards(make,cards);
const corrections={
 'v8-1932':'https://www.lov2xlr8.no/brochures/pontiac/32ptv/32ptv.html',
 safari:B+'Safari/Pontiac_US%20Safari_1974.pdf',
 montana:B+'SV6/Pontiac_US%20SV6_2006.pdf',
 'trans-sport':'https://www.lov2xlr8.no/brochures/pontiac/91tra/91tra.html',
 'grand-ville':'https://www.lov2xlr8.no/brochures/pontiac/74gv/74gv.html',
 'grand-am':'https://www.lov2xlr8.no/brochures/pontiac/73pga/73pga.html',
 astre:'https://www.lov2xlr8.no/brochures/pontiac/astre/astre.html',
 acadian:'https://www.lov2xlr8.no/brochures/pontiac/84ac/84ac.html',
 phoenix:'https://www.lov2xlr8.no/brochures/pontiac/84pho/84pho.html',
 sunbird:'https://www.lov2xlr8.no/brochures/pontiac/84sun/84sun.html',
 parisienne:'https://www.lov2xlr8.no/brochures/pontiac/84par/84par.html',
 '6000':'https://www.lov2xlr8.no/brochures/pontiac/84ste/84ste.html',
 '1000':'https://www.lov2xlr8.no/brochures/pontiac/84ac/84ac.html',
 '2000':'https://www.lov2xlr8.no/brochures/pontiac/82pj/82pj.html',
 ventura:'https://www.lov2xlr8.no/brochures/pontiac/71ven/71ven.html',
 sunfire:'https://www.lov2xlr8.no/brochures/pontiac/97sun/97sun.html'
};
for(const [slug,url]of Object.entries(corrections)){get(slug).sources=[url];get(slug).generations[0].sources=[url];}
for(const slug of ['acadian','1000']){const g=get(slug).generations[0];g.markets=['Canada'];g.specificationScope.market='Canada';g.specificationScope.noteCs='Rozsah je omezen na kanadský prospekt Acadian & 1000 pro modelový rok 1984; nejde o tvrzení stejného názvu ani specifikace na americkém trhu.';g.marketNotesCs='Tato karta dokládá kanadskou nabídku, nikoli automaticky americkou či českou distribuci.';get(slug).needsReview.push({field:'generations[0].markets',reason:'Použit kanadský dobový prospekt; ostatní trhy a přesné výrobní intervaly musí být ověřeny samostatně.'});}
get('gto').generations[0].specificationScope.noteCs='GM uvádí zahájení fyzické výroby na konci roku 1963 pro modelový rok 1964. Začátek 1963 neoznačuje samostatný model: GTO bylo nejprve paketem Tempestu, samostatným modelem se stalo roku 1966.';
// Different periods sharing a badge are separated without inventing transition dates.
get('gto').generations.push(generation('GTO – novodobé kupé podle prospektu 2004',null,null,[B+'GTO/Pontiac_US%20GTO_2004-specs.pdf'],{bodyTypes:['kupe'],markets:['United States']}));
get('grand-prix').generations.push(generation('Grand Prix – sedan podle prospektu 2008',null,null,[S.p08],{bodyTypes:['sedan'],markets:['United States']}));
get('vibe').generations.push(generation('Vibe – rodina podle prospektu 2010',null,null,[S.vibe],{bodyTypes:['hatchback'],markets:['United States']}));
function row(slug,gi,name,source,y,cy,type,gears,drive,kw=null,nm=null,note='',bodyType=null){const g=get(slug).generations[gi];g.trims??=[];g.trims.push(version(name,[source],{bodyType:bodyType??(g.bodyTypes?.length===1?g.bodyTypes[0]:null),engine:{fuel:'petrol',displacementCc:null,cylinders:cy,powerKw:kw,powerStandard:null,torqueNm:nm},transmission:{type,gears},drive,specificationScope:{market:'United States',modelYear:y,noteCs:'Doložený modelový rok není výrobní interval. Nominální litry, HP, lb-ft, palce, lb a 0–60 mph se bez dalšího nepřenášejí do přesných metrických polí. '+note}}));g.sources=[...new Set([...g.sources,source])];persist();}
row('fiero',0,'SE 2.8 V6 4MT – muzejní automobil',S.fiero,1986,6,'manual',4,'rwd',null,null,'Muzeum uvádí 2.8 l/173 ci a čtyřstupňovou Muncie; nejedná se o všechny verze Fiero.');
for(const [n,cy,type,gears]of [['GTO 5.7 V8 6MT',8,'manual',6],['GTO 5.7 V8 4AT',8,'automatic',4]])row('gto',1,n,B+'GTO/Pontiac_US%20GTO_2004-specs.pdf',2004,cy,type,gears,'rwd',null,null,'Motor LS1, publikováno 350 hp a 365 lb-ft; bez převodu.', 'kupe');
for(const [n,cy,type,gears,drive,body]of [['G5 2.2 5MT',4,'manual',5,null,'kupe'],['G5 GT 2.4 5MT',4,'manual',5,null,'kupe'],['G6 GT 3.5 V6 4AT',6,'automatic',4,null,'sedan'],['G6 GXP 3.6 V6 6AT',6,'automatic',6,null,'sedan'],['Grand Prix 3.8 V6 4AT',6,'automatic',4,'fwd','sedan'],['Grand Prix GXP 5.3 V8 4AT',8,'automatic',4,'fwd','sedan']]){const slug=n.startsWith('G5')?'g5':n.startsWith('G6')?'g6':'grand-prix';row(slug,slug==='grand-prix'?1:0,n,S.p08,2008,cy,type,gears,drive,null,null,'Výkon v původní americké tabulce je uveden pouze v HP.',body);}
for(const [n,type,gears]of [['G3 1.6 5MT','manual',5],['G3 1.6 4AT','automatic',4]])row('g3',0,n,S.g3,2009,4,type,gears,null,null,null,'Původní prospekt uvádí 106 hp.');
for(const [n,type,gears,drive]of [['Vibe 1.8 5MT','manual',5,null],['Vibe 1.8 4AT','automatic',4,null],['Vibe 2.4 5MT','manual',5,null],['Vibe 2.4 5AT','automatic',5,null],['Vibe AWD 2.4 4AT','automatic',4,'awd']])row('vibe',1,n,S.vibe,2010,4,type,gears,drive,null,null,'Tabulka rozlišuje motor 1.8/132 hp a 2.4/158 hp; převodovka AWD má čtyři stupně.');
for(const [n,type,kw,nm]of [['Solstice 2.4 5MT','manual',null,null],['Solstice 2.4 5AT','automatic',null,null],['Solstice GXP 2.0 Turbo 5MT','manual',194,353],['Solstice GXP 2.0 Turbo 5AT','automatic',194,353]])row('solstice',0,n,S.solstice,2007,4,type,5,'rwd',kw,nm,'Originální tisková zpráva GM z 1. srpna 2006, uložená na externím archivu; 194 kW a 353 Nm jsou přímo uvedené hodnoty, nikoli převod z HP.');
const g8release='https://www.motordesktop.com/pontiac/2009-pontiac-g8-gt/';
row('g8',0,'G8 3.6 V6 5AT – Canada GM release 31 July 2008',g8release,2009,6,'automatic',5,'rwd',190,335,'Kanadský tiskový text GM uvádí přímo 190 kW a 335 Nm. Hodnoty se nepřenášejí na všechny pozdější americké verze.','sedan');
get('g8').generations[0].trims.at(-1).specificationScope.market='Canada';
row('g8',0,'G8 GT 6.0 V8 6AT – Canada GM release 31 July 2008',g8release,2009,8,'automatic',6,'rwd',null,520,'Kanadský text GM uvádí 268 kW, ale redakční záhlaví stejné stránky uvádí 265 kW. Výkon zůstává null do ověření originálního tiskového dokumentu.','sedan');
get('g8').generations[0].trims.at(-1).specificationScope.market='Canada';
get('g8').needsReview.push({field:'generations[0].trims[1].engine.powerKw',reason:'Zrcadlo tiskového textu GM a jeho vlastní specifikační záhlaví uvádějí různé výkony GT; 268/265 kW není bez původního dokumentu sjednoceno.'});
for(const c of cards){for(const g of c.generations){g.bodyTypes??=null;}c.sources=[...new Set([...c.sources,...c.generations.flatMap(g=>g.sources),...c.generations.flatMap(g=>(g.trims??[]).flatMap(t=>t.sources))])];markUnknowns(c);c.needsReview.push({field:'coverage',reason:'Průběžný částečný soupis rodin. Úplné generace, chronologie a motorizace všech trhů nejsou dokončeny.'});}
persist();
const counts={cards:cards.length,generations:cards.flatMap(c=>c.generations).length,versions:cards.flatMap(c=>c.generations).reduce((n,g)=>n+(g.trims?.length??0),0),photos:0};
const report={makeSlug:make,counts,scope:'PARTIAL passenger-family catalogue, from early Six to final-era models. Museum/factory brochure snapshots; production bounds unknown except explicitly sourced.',proposedLines:cards.map(proposedLine),sources:[...new Set(cards.flatMap(c=>c.sources))],generationCoverage:cards.map(c=>({lineSlug:c.lineSlug,generations:c.generations.map(g=>({name:g.name,versions:g.trims?.length??0,hasPhoto:false}))})),gaps:['Most chronology and platform generations remain unverified; blank dates are not assertions of current manufacture.','All photographs pending Commons visual/licence review.','Historic Straight Eight and Six families need separate model/series numbers; Oakland predecessors are excluded.','Canadian Pathfinder/Laurentian and Acadian badge identity chronology requires deeper audit. Acadian is not automatically the independent GM Acadian marque.','Bonneville/Grand Am/Firebird/LeMans/Grand Prix multigeneration histories are not complete.','GTO begins as a performance package; initial card is not a claim of standalone model status in 1964.','Streamliner/Grand Safari/Executive/Custom S/Tempest regional reuses, Wave, Sunburst, Firefly, Pursuit and Matiz remain missing or unresolved.','No conversion of US HP or imperial units; most numeric power/mass/dimension/consumption fields remain null.','No exhaustive European/Czech import version tables.','Primary factory document mirrors are used; current mirrors are not manufacturer-hosted originals.'],excluded:['Oakland-branded predecessors, 1950s Firebird gas-turbine concepts and other show cars.','Trans Am, GXP, The Judge, SSEi and STE are not added as automatic separate model families.','Unproduced G8 ST sport truck.','Commercial trucks, race-only cars and customer identifiers.'],rebuildOrder:['node analysis/codex/night-pontiac-build.mjs','node analysis/codex/night-pontiac-validate.mjs']};
fs.writeFileSync('analysis/codex/night-pontiac-report.json',JSON.stringify(report,null,2)+'\n');console.log(counts);
