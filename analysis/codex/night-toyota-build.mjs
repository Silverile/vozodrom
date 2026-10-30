import fs from 'node:fs';
import {card,generation,version,proposedLine,saveCards,markUnknowns} from './night-card-helpers.mjs';
const base='https://www.toyota-global.com/company/history_of_toyota/75years/vehicle_lineage/car/';
const chart='https://www.toyota-global.com/company/history_of_toyota/75years/vehicle_lineage/pdf/vehiclelineage.pdf';
const existing=JSON.parse(fs.readFileSync('src/data/model-cards/toyota.json','utf8'));
const existingSlugs=new Set(existing.map(c=>c.lineSlug));
const lines=JSON.parse(fs.readFileSync('src/data/catalog/model-lines-auto.json','utf8')).filter(l=>l.makeSlug==='toyota');
const cards=[];
// Selected representative technical facts, not transcribed prose or a copy of the source tables.
const rows=[
 ['aa','AA','AA',1936,1942,'sedan','60011174',1500,4785,1730,1736,2850,3389,6,'A',65,'AA byl prvním sériově vyráběným osobním automobilem podniku, z něhož vznikla Toyota Motor. Velký šestiválcový sedan navazoval tvarem karoserie na tehdejší americké proudnicové vozy.'],
 ['ab','AB Phaeton','AB',1936,1938,'kabriolet','60011184',1500,4700,1750,1750,2850,3389,6,'A',65,'AB Phaeton byl otevřeným příbuzným sedanu AA se změněným uspořádáním dveří a sedadel. Většina vyrobených vozů sloužila japonské armádě, přesto šlo také o obchodně nabízený model.'],
 ['ac','AC','AC',1943,1948,'sedan','70000035',1550,4884,1734,1746,2850,3386,6,'B',75,'AC byl válečným pokračováním velkých předválečných sedanů Toyoty s upravenou přídí a děleným čelním sklem. Malá poválečná série sloužila zahraničním obchodním delegacím.'],
 ['ae','AE','AE',1941,1943,'sedan','70000036',1220,4500,1730,1635,2500,2258,4,'C',48,'AE byl menší čtyřválcový sedan připravený v období omezené japonské civilní automobilové výroby. Představení předcházelo skutečné sériové výrobě, která se rozběhla až v roce 1941.'],
 ['sa','SA','SA',1947,1952,'sedan','70000038',1170,3800,1590,1530,2400,995,4,'S',27,'Toyopet SA byl malý poválečný dvoudveřový sedan s nezávislým zavěšením všech kol. Jeho konstrukce směřovala k soukromým zákazníkům a odlišovala se od robustnějších vozů pro taxislužby.'],
 ['sb','SB','SB',1947,null,'pickup','60007245',1090,3800,1600,1785,2400,995,4,'S',27,'Toyopet SB byl malý poválečný užitkový automobil se samostatnou kabinou a ložnou plochou. Používal litrový čtyřválec S a rámový podvozek; další karosářská provedení zatím nemají samostatné technické záznamy.'],
 ['sd','SD','SD',1949,1952,'sedan','60011308',1150,4233,1590,1570,2413,995,4,'S',27,'Toyopet SD byl pětimístný sedan zaměřený především na taxislužbu. Využíval odolný základ malého užitkového vozu SB namísto technicky odlišné konstrukce SA.'],
 ['sf','SF','SF',1951,1953,'sedan','60011144',1525,4280,1590,1600,2500,995,4,'S',28,'SF rozšířil nabídku malých sedanů určených zejména pro taxislužbu. Karoserie dodávalo několik podniků a jednotlivá provedení se proto částečně lišila.'],
 ['sh','SH','SH',1953,1953,'sedan','70000039',1285,4280,1590,1600,2500,995,4,'S',28,'SH spojoval nový podvozek řady H s dosavadním litrovým motorem S. Šlo o krátce vyráběný přechodový model před nástupem silnějšího Toyopetu Super.'],
 ['super-rh','Super RH','RH',1953,1954,'sedan','60011151',1315,4280,1590,1600,2500,1453,4,'R',48,'Toyopet Super RH byl sedan s novým motorem řady R o objemu téměř jeden a půl litru. Robustní rámová konstrukce a různé dodavatelské karoserie odpovídaly jeho hlavnímu využití v taxislužbě.'],
 ['master','Master','RR',1955,1956,'sedan','60011155',1210,4275,1670,1550,2530,1453,4,'R',48,'Toyopet Master vznikl jako odolnější protějšek prvního Crownu určený pro taxislužbu. Z nabídky ustoupil poté, co se i Crown osvědčil při náročném každodenním provozu.'],
 ['publica','Publica','UP10',1961,null,'sedan','60011574',580,3520,1415,1380,2130,697,2,'U',28,'Publica byla malým dostupným automobilem s lehkou konstrukcí a vzduchem chlazeným dvouválcem. Tato karta zatím zachycuje pouze rané provedení UP10, nikoli celou pozdější modelovou rodinu.'],
 ['sports-800','Sports 800','UP15',1965,1969,'kupe','60009017',580,3580,1465,1175,2000,790,2,'U',45,'Sports 800 byl malý dvoumístný sportovní automobil s odnímatelným střešním panelem. Využíval základ modelu Publica a jeho nízká hmotnost byla podstatnou součástí konstrukce.'],
 ['2000gt','2000GT','MF10',1967,1970,'kupe','60012817',1120,4175,1600,1160,2330,1988,6,'3M',150,'2000GT byl dvoumístným sportovním kupé vyvinutým ve spolupráci Toyoty a Yamahy. Sériové provedení mělo řadový šestiválec a nezávislé zavěšení všech kol; filmové otevřené vozy byly upravenými prototypy.']
];
function url(id){return base+'id'+id+'/index.html';}
function technical(row,extra={}){
 const [slug,name,code,from,to,body,id,mass,length,width,height,wheelbase,cc,cyl,engine,ps]=row;
 const source=url(id),dimensionsMm={length,width,height,wheelbase};
 const trim=version(code+' — '+engine+' '+cc+' cm³',[source],{from,to:null,bodyType:body,engine:{fuel:'petrol',displacementCc:cc,cylinders:cyl,powerKw:null,powerStandard:null,torqueNm:null},dimensionsMm,massKg:mass,massBasis:'curb mass — údaj výrobce; další vymezení náplní a posádky neuvedeno',massRangeKg:null,massReference:null,specificationScope:{market:'Japan',modelYear:from,noteCs:`Reprezentativní provedení ${code} podle historického archivu Toyota; údaj není přenesen na všechny roky nebo dodavatelské karoserie. Zdroj udává ${ps} PS, nikoli číselný výkon v kW; výkon není přepočítán. Převodovka a pohon nejsou bez přesného dokladu doplněny.`},...extra});
 trim.fieldSources={};
 for(const key of ['engine.fuel','engine.displacementCc','engine.cylinders','massKg','massBasis','dimensionsMm.length','dimensionsMm.width','dimensionsMm.height','dimensionsMm.wheelbase'])trim.fieldSources[key]=[source];
 for(const key of ['topSpeedKmh','acceleration0to100s','drive'])if(trim[key]!=null)trim.fieldSources[key]=[source];
 if(trim.transmission.type)trim.fieldSources['transmission.type']=[source];
 if(trim.transmission.gears)trim.fieldSources['transmission.gears']=[source];
 const g=generation(name+' — '+code,from,to,[source,...(to!==null?[chart]:[])],{code,bodyTypes:[body],engines:[{fuel:'petrol',displacementCc:cc,displacementLitresNominal:null,powerKwMin:null,powerKwMax:null,variant:engine}],engineCoverage:'partial',dimensionsMm,markets:['Japan'],marketNotesCs:'Japonské historické provedení; současná dostupnost v Česku ani dobová evropská nabídka nejsou tímto záznamem potvrzeny.',specificationScope:{market:'Japan',modelYear:from,variant:code,bodyType:body,noteCs:trim.specificationScope.noteCs},trims:[trim]});
 g.fieldSources=Object.fromEntries(['dimensionsMm.length','dimensionsMm.width','dimensionsMm.height','dimensionsMm.wheelbase'].map(f=>[f,[source]]));
 return g;
}
function save(c){if(existingSlugs.has(c.lineSlug))throw Error('Duplicate existing card '+c.lineSlug);c.isAddition=!lines.some(l=>l.slug===c.lineSlug);cards.push(markUnknowns(c));saveCards('toyota',cards);}
for(const row of rows){
 const extra=row[0]==='ae'?{topSpeedKmh:100}:row[0]==='sa'||row[0]==='publica'?{drive:'rwd'}:row[0]==='sports-800'?{topSpeedKmh:155}:row[0]==='2000gt'?{topSpeedKmh:220,acceleration0to100s:8.6}:{};
 const g=technical(row,extra);if(row[0]==='sports-800')g.sources.push('https://mag.toyota.co.uk/toyota-sports-800-history/');
 if(row[0]==='sf'){
  const conflict='https://www.toyota-global.com/company/history_of_toyota/75years/text/taking_on_the_automotive_business/chapter2/section8/item1_f.html';
  g.sources.push(conflict);g.trims[0].sources.push(conflict);g.dimensionsMm.width=null;g.trims[0].dimensionsMm.width=null;g.trims[0].massKg=null;g.trims[0].massBasis=null;
  delete g.fieldSources['dimensionsMm.width'];delete g.trims[0].fieldSources['dimensionsMm.width'];delete g.trims[0].fieldSources.massKg;delete g.trims[0].fieldSources.massBasis;
  g.specificationScope.noteCs+=' Jiná kapitola téhož archivu uvádí pro SF roku 1952 hmotnost 1200 kg a šířku 1594 mm, zatímco přehled modelu uvádí 1525 kg a 1590 mm. Bez doloženého vysvětlení varianty zůstávají obě pole null.';
  g.trims[0].specificationScope.noteCs=g.specificationScope.noteCs;
 }
 const units={aa:1404,ab:353,ae:76,sa:215,sd:665,'sports-800':3131,'2000gt':337}[row[0]];
 if(units){g.productionUnits=units;g.fieldSources.productionUnits=[row[0]==='sports-800'?'https://mag.toyota.co.uk/toyota-sports-800-history/':url(row[6])];}
 save(card('toyota',row[0],row[1],row[16],[g],[url(row[6])],{needsReview:[{field:'scope',reason:'Vybrané japonské historické provedení; úplnost ročníků, výbav, karoserií a exportních verzí není deklarována.'}]}));
}
const baSource=url('70000036');
const baG=generation('BA — materiálově úsporné provedení',null,null,[baSource],{code:'BA',bodyTypes:['sedan'],productionUnits:17,fieldSources:{productionUnits:[baSource]},markets:['Japan'],marketNotesCs:'Malá vyrobená série; datum oznámení není automaticky začátkem sériové výroby.',specificationScope:{market:'Japan',modelYear:null,variant:'BA',bodyType:'sedan',noteCs:'Toyota uvádí oznámení v květnu 1940 a celkem 17 vyrobených vozů. Přesné výrobní mezníky a technické údaje BA nejsou v použitém zdroji uvedeny; specifikace AE nejsou automaticky přeneseny.'}});
save(card('toyota','ba','BA','BA byl materiálově úsporným odvozeným provedením modelu AE s řadou dřevěných součástí. Toyota uvádí malou sérii sedmnácti vozů, avšak zde použitý pramen nevymezuje přesnou dobu výroby ani samostatné technické specifikace.',[baG],[baSource]));
// Crown: only explicitly reviewed early generations; no invented end of the entire Crown line.
const crownRows=[
 ['crown','Crown I','RS',1955,1962,'sedan','60004580',1210,4285,1680,1525,2530,1453,4,'R',48],
 ['crown','Crown II Custom','RS46G',1962,1967,'kombi','60004734A',1350,4690,1695,1470,2690,1897,4,'3R',90],
 ['crown','Crown III Super Deluxe','MS50-F',1967,1971,'sedan','60004831',1310,4665,1690,1445,2690,1988,6,'M-D',110]
];
const crownGs=crownRows.map((r,i)=>technical(r,i===0?{transmission:{type:'manual',gears:3}}:{}));
for(const r of [
 ['crown','Crown II Deluxe','RS41',1962,1967,'sedan','60004715',1265,4610,1695,1460,2690,1897,4,'3R',90],
 ['crown','Crown II Standard','RS40',1962,1967,'sedan','60004715',1235,4610,1695,1460,2690,1897,4,'3R-B',80]
]){const t=technical(r).trims[0];t.name=r[2]+' '+r[1].replace('Crown II ','')+' — 1897 cm³';t.specificationScope.noteCs+=' Tabulka uvádí 3R/3R-B, popis 4R; kód motoru není prezentován jako vyřešený.';crownGs[1].trims.push(t);}
crownGs[1].bodyTypes=['kombi','sedan'];crownGs[1].sources.push(url('60004715'));crownGs[1].specificationScope.noteCs+=' Rozměry generace odpovídají výhradně Custom kombi RS46G, sedan má vlastní řádky.';
crownGs[1].engines[0].variant=null;
save(card('toyota','crown','Crown','Crown je dlouholetá modelová řada Toyoty, jejíž počátky sahají do roku 1955. Karta zatím popisuje pouze vybrané japonské verze prvních tří generací, včetně kombi Custom druhé generace.',crownGs,[...crownGs.flatMap(g=>g.sources),'https://global.toyota/en/mobility/toyota-brand/gallery/crown.html'],{needsReview:[{field:'scope',reason:'Pozdější generace nejsou touto kartou pokryty. Konec třetí generace v roce 1971 není ukončením modelové řady Crown.'},{field:'generations[1].engines[0].variant',reason:'Tabulky uvádějí 3R/3R-B a popis modelu 4R. Nutná kontrola dobového katalogu; přehled kódu motoru není nezávisle potvrzen.'}]}));
const coronaRows=[
 ['corona','Corona I','ST10',1957,1960,'sedan','60007281',960,3912,1470,1518,2400,995,4,'S',33],
 ['corona','Corona II','PT20',1960,1964,'sedan','60007295',940,3990,1490,1440,2400,997,4,'P',45],
 ['corona','Corona III — pětidveřová','RT56',1965,null,'hatchback','60007391',990,4110,1550,1420,2420,1490,4,'2R',70]
];
const coronaGs=coronaRows.map(r=>technical(r));
for(const i of [0,2]){coronaGs[i].engines[0].variant=null;coronaGs[i].trims[0].name=coronaRows[i][2]+' — '+coronaRows[i][12]+' cm³ (kód motoru nevyřešen)';}
save(card('toyota','corona','Corona','Corona začínala jako malý sedan odpovídající zejména poptávce japonských taxislužeb. Ve třetí generaci nabídla také neobvyklou pětidveřovou karoserii; tato karta zatím pokrývá jen vybraná raná provedení.',coronaGs,coronaGs.flatMap(g=>g.sources),{needsReview:[{field:'scope',reason:'Chybí čtyřdveřový sedan třetí generace, pozdější generace a exportní varianty. Rok 1965 u třetího záznamu je začátkem pětidveřové karoserie, nikoli celé třetí generace.'},{field:'generations[0].engines[0].variant',reason:'Historická tabulka Toyota uvádí P/995 cm³, ale doprovodný text popisuje S/995 cm³ a pozdější P/997 cm³. Kód motoru zůstává null.'},{field:'generations[2].engines[0].variant',reason:'Tabulka uvádí kód R, popis 2R. Kód motoru zůstává null; shodné údaje o objemu nejsou odvozeny z kódu.'}]}));
const masterRows=[['masterline','Masterline Van','RR17',1955,1959,'dodavka','60015663A',1235,4275,1670,1600,2530,1453,4,'R',55],['masterline','Masterline Pickup','RR16',1955,1959,'pickup','60015663B',1180,4275,1670,1600,2530,1453,4,'R',55],['masterline','Masterline Pickup Double Seat','RR19',1955,1959,'pickup','60015663B',1225,4285,1675,1630,2530,1453,4,'R',55]];
const masterG=technical(masterRows[0]);masterG.name='Masterline — původní provedení odvozené od Masteru';masterG.code=null;masterG.bodyTypes=['dodavka','pickup'];masterG.trims=masterRows.map(r=>technical(r).trims[0]);masterG.sources=[...new Set(masterRows.map(r=>url(r[6])))];masterG.specificationScope.noteCs='Rozměry na úrovni generace náleží výhradně RR17 Light Van; obě varianty pickupu mají vlastní řádky. Karta nepokrývá pozdější Masterline odvozené od Crownu.';
save(card('toyota','masterline','Masterline','Masterline sdružoval užitková provedení odvozená od osobních vozů Toyopet. Karta zatím zachycuje původní dodávku a dva pickupy na základu modelu Master před přechodem na základ Crownu v roce 1959.',[masterG],masterG.sources,{needsReview:[{field:'scope',reason:'Zpracována pouze první rodina 1955–1959; název Masterline pokračoval na dalších konstrukčních základech.'}]}));
const cr='https://mag.toyota.co.uk/do-you-remember-the-toyota-cressida/';
const cressidaGs=[generation('Cressida — první evropské provedení',1977,1980,[cr],{bodyTypes:['sedan'],drivetrains:['rwd'],engines:[{fuel:'petrol',displacementCc:null,displacementLitresNominal:2,powerKwMin:null,powerKwMax:null,variant:null}],engineCoverage:'partial',markets:['United Kingdom'],marketNotesCs:'Evropské uvedení v létě 1977; data jsou zde vymezena dobovou britskou nabídkou, nikoli globální výrobou Mark II.',specificationScope:{market:'United Kingdom',modelYear:1977,variant:null,bodyType:'sedan',noteCs:'Chronologie podle Toyota UK; uvedení a prodejní období nejsou globálními výrobními mezníky.'}}),generation('Cressida — druhé britské provedení',1980,null,[cr],{bodyTypes:['sedan'],drivetrains:['rwd'],markets:['United Kingdom'],marketNotesCs:'Druhá generace přišla do UK v roce 1980; prodej v UK skončil v roce 1983. Globální konec výroby z tohoto zdroje nevyplývá.',specificationScope:{market:'United Kingdom',modelYear:1980,variant:null,bodyType:'sedan',noteCs:'Bez technické verze: přesné motorizace, převodovky a rozměry nebyly ověřeny.'}})];
save(card('toyota','cressida','Cressida','Cressida byla v Evropě nabízena jako větší rodinný sedan s motorem vpředu a pohonem zadních kol. Karta zachycuje pouze první dvě britská provedení; jejich vztah k japonské řadě Mark II není důvodem k přebírání neověřených technických údajů.',cressidaGs,[cr],{needsReview:[{field:'scope',reason:'Doložena pouze britská nabídka 1977–1983. Další světové generace Cressidy, kombi a přesné technické verze zbývají.'}]}));
const sfCard=cards.find(c=>c.lineSlug==='sf');
for(const field of ['generations[0].dimensionsMm.width','generations[0].trims[0].dimensionsMm.width','generations[0].trims[0].massKg']){const review=sfCard.needsReview.find(r=>r.field===field);if(review)review.reason='Rozpor primárních zdrojů Toyota: přehled modelu SF uvádí 1525 kg /1590 mm, kapitola s dobovou specifikací SF1952 uvádí1200 kg /1594 mm. Rozdílná dodavatelská karoserie nebyla pro tyto údaje doložena; null do vyřešení.';}
saveCards('toyota',cards);
const proposed=cards.filter(c=>c.isAddition).map(c=>{const p=proposedLine(c);if(['crown','corona','publica','cressida','masterline'].includes(c.lineSlug)){p.to=null;p.productionStatus='unknown';p.needsReview.push({field:'to',reason:'Karta obsahuje pouze část historie, konec celé modelové řady není vymezen koncem poslední zpracované generace.'});}return p;});
const report={counts:{newCards:cards.length,generations:cards.reduce((n,c)=>n+c.generations.length,0),technicalVersions:cards.reduce((n,c)=>n+c.generations.reduce((m,g)=>m+(g.trims?.length||0),0),0),photos:0,existingClaudeCardsUntouched:existing.length},scope:'Historická Toyota, Toyoda a Toyopet: AA/AB/AC/AE, poválečné SA/SD/SF/SH/RH/Master, vybrané rané Crown/Corona/Publica a Sports800/2000GT; Cressida pouze raná UK nabídka. Fakta z primárních zdrojů přepsána do vlastního schématu; žádné fotografie/prospekty/prozaické tabulky z Toyota archivu nejsou kopírovány.',gaps:cards.map(c=>({lineSlug:c.lineSlug,needsReview:c.needsReview})),sources:[...new Set(cards.flatMap(c=>c.sources))],proposedLines:proposed,helpWanted:['Fotografie Commons všech nových historických generací: zatím žádná vizuálně schválená, photo=null.','Výkon v kW není přepočten z archivně uvedených PS; ověřit dobovou normu a přímo doložené kW.','Dynamika a měřená spotřeba s cyklem pro předválečné a časné poválečné verze chybí.','Zbývají pozdější Masterline, přesné specifikace BA a zbytek světové historie Crown, Corona, Publica a Cressida.']};
fs.writeFileSync('analysis/codex/night-toyota-report.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.counts));
