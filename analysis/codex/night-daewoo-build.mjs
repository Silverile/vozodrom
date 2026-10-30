import fs from 'node:fs';
import {card,generation,version,saveCards,proposedLine,markUnknowns} from './night-card-helpers.mjs';
const make='daewoo',cards=[],wiki=n=>'https://en.wikipedia.org/wiki/Daewoo_'+n;
const baselineIds=new Set(['espero','evanda','kalos','korando','lacetti','lanos','leganza','lublin','matiz','musso','nexia','nubira','tacuma','tico']);
const existing=JSON.parse(fs.readFileSync('src/data/catalog/model-lines-auto.json','utf8')).filter(c=>c.makeSlug===make&&baselineIds.has(c.slug));
function gen(name,from,to,url,body=null,market='source-specific'){return generation(name,from,to,[url],{bodyTypes:body,markets:[market],marketNotesCs:'Rozsah výrobní rodiny neznamená stejné období znaku Daewoo na všech trzích. Pokračování pod Chevrolet/FSO/ZAZ nebo jinou značkou není automaticky připsáno Daewoo.'});}
function add(slug,name,summary,gs,sources,aliases=[]){let c=card(make,slug,name,summary,gs,sources,{isAddition:!existing.some(l=>l.slug===slug),aliases});cards.push(c);saveCards(make,cards);return c;}
const base=[
['espero','Espero','Espero',1990,1999,['sedan'],'Espero byl středně velký sedan Daewoo s karoserií navrženou u Bertone. Jméno Aranos na některých trzích označuje stejnou základní rodinu.',['Aranos']],
['evanda','Evanda / Magnus','Magnus',2000,2006,['sedan'],'Evanda je evropské jméno sedanu známého v Koreji jako Magnus. Chevrolet Evanda nebo Suzuki Verona nejsou automaticky stejnou katalogovou značkou.',['Magnus']],
['kalos','Kalos / Gentra','Kalos',2002,null,['sedan','hatchback'],'Kalos zahrnoval sedan a hatchback s odlišnými místními názvy. Jméno Gentra z této rodiny se nesmí zaměnit za pozdější uzbecký sedan odvozený z Lacetti.',['Gentra (T250)','Gentra X']],
['korando','Korando','Korando',null,null,['suv'],'Daewoo prodávalo také terénní Korando původu SsangYong. Celá historie stejnojmenného SsangYongu není obdobím znaku Daewoo.',[]],
['lacetti','Lacetti','Lacetti',2002,null,['hatchback'],'Lacetti je zde vedeno především jako evropský hatchback rodiny J200. Příbuzný evropský sedan a kombi prodávané jako Nubira jsou rozlišeny v kartě Nubira.',[]],
['lanos','Lanos','Lanos',1997,null,['sedan','hatchback'],'Lanos byl malý osobní Daewoo vyráběný jako sedan a hatchback. Licenční pokračování pod FSO, ZAZ nebo Chevrolet se musí odlišit od období původního znaku.',[]],
['leganza','Leganza','Leganza',1997,null,['sedan'],'Leganza byl větší sedan navržený ve spolupráci s Italdesignem. Korejské a licenční výrobní období nejsou automaticky shodné.',[]],
['lublin','Lublin','Lublin',null,null,['dodavka'],'Lublin je polská užitková rodina, která část historie vznikala pod Daewoo. Výrobní období FSC, Andoria nebo Intrall není automaticky započteno jako Daewoo.',[]],
['matiz','Matiz','Matiz',1998,null,['hatchback'],'Matiz je malá pětidveřová rodina Daewoo s více konstrukčními generacemi. Pozdější označení Spark a změny značky se musí rozlišovat.',[]],
['musso','Musso','Musso',null,null,['suv'],'Daewoo nabízelo Musso jako přeznačený terénní vůz SsangYong. Pozdější pickupy Musso nejsou bez doloženého znaku přidány do řady Daewoo.',[]],
['nexia','Nexia / Cielo / LeMans','LeMans',1986,null,['sedan','hatchback'],'Rodina LeMans navazovala na technický základ Opelu Kadett E a později používala názvy Cielo a Nexia. Přejmenování a modernizace jsou vedeny společně, aby nevznikly duplicitní základní řady.',['LeMans','Racer','Cielo','Nexia']],
['nubira','Nubira','Nubira',1997,null,['sedan','hatchback','kombi'],'Původní Nubira zahrnovala sedan, hatchback a kombi. Pozdější evropský sedan a kombi J200 zachovaly jméno Nubira, zatímco příbuzný hatchback se prodával jako Lacetti.',[]],
['tacuma','Tacuma / Rezzo','Tacuma',2000,null,['mpv'],'Tacuma je rodinné MPV známé také jako Rezzo. Pozdější prodej pod Chevrolet neznamená pokračující použití znaku Daewoo.',['Rezzo']],
['tico','Tico','Tico',1991,2002,['hatchback'],'Tico byl malý pětidveřový automobil s technickým původem v Suzuki Alto. Korejská, polská a rumunská výroba končily v různých letech.',[]]
];
for(const [slug,name,page,from,to,body,summary,aliases]of base){let l=existing.find(l=>l.slug===slug),u=wiki(page);add(slug,name,summary,[gen(name+' – neúplně rozlišená rodina',from,to,u,body)],[...(l?.sources??[]),u],aliases);}
const history=[
['maepsy','Maepsy / Maepsy-Na','Maepsy',null,1989,['sedan','pickup'],'Maepsy pokračovala v kompaktní nabídce převzaté od Saehanu. Počátek celé konstrukční rodiny není bez dalšího vydáván za začátek značky Daewoo.'],
['royale','Royale','Royale',null,1993,['sedan'],'Royale byla rozsáhlá rodina velkých osobních vozů s původem před přejmenováním automobilky na Daewoo. Starší jména GM Korea a Saehan zůstávají odlišena od samotného znaku Daewoo.'],
['imperial','Imperial','Royale',1989,1993,['sedan'],'Imperial představoval vrcholnou šestiválcovou odvozeninu tradiční rodiny Royale. Je veden jako pojmenovaná výrobní řada, nikoli jako rekordní či koncepční automobil.'],
['prince','Prince / Brougham / Super Salon','Prince',1991,1999,['sedan'],'Prince navázal na tradiční zadokolkové sedany Daewoo. Luxusnější Brougham a Super Salon jsou zde označeny jako příbuzné větve; pozdní konec zahrnuje také taxi.'],
['arcadia','Arcadia','Arcadia',null,null,['sedan'],'Arcadia byla korejská nabídka odvozená od Hondy Legend. Celá výrobní historie Hondy Legend není vydávána za období modelu Daewoo.'],
['tosca','Tosca','Tosca',2006,2011,['sedan'],'Tosca navázala na větší sedany Daewoo a mimo Koreu se prodávala pod dalšími značkami. Čínské pokračování Chevrolet Epica se nezapočítává automaticky jako Daewoo.'],
['lacetti-premiere','Lacetti Premiere','Lacetti_Premiere',2008,null,['sedan'],'Lacetti Premiere bylo korejské jméno nové konstrukční rodiny známé také jako Chevrolet Cruze. Není pouhou výbavou staršího Lacetti J200.'],
['winstorm','Winstorm','Winstorm',2006,null,['suv'],'Winstorm je SUV Daewoo příbuzné prvnímu Chevroletu Captiva. Další generace Captivy pod jinou značkou nepředstavují pokračující Daewoo.'],
['winstorm-maxx','Winstorm MaXX','Winstorm',2008,null,['suv'],'Winstorm MaXX byl samostatně pojmenovanou kratší konstrukcí příbuznou Opelu Antara. Nejde pouze o výbavu většího Winstormu.'],
['g2x','G2X','G2X',null,null,['kabriolet'],'G2X byl dvoumístný roadster Daewoo z rodiny Kappa. Celé výrobní období Saturnu Sky či Opelu GT se nepřipisuje bez rozlišení korejské nabídce.'],
['statesman','Statesman','Statesman',null,null,['sedan'],'Statesman byl velký sedan dovezený pro Daewoo z australské výroby Holden. Nezahrnuje všechny dřívější ani pozdější Holdeny stejného jména.'],
['veritas','Veritas','Veritas',null,null,['sedan'],'Veritas navázal na australský základ velkých sedanů Holden. Samostatné místní označení není důvodem přenést celou globální historii Caprice na Daewoo.'],
['damas','Damas','Damas',1991,null,['dodavka','mpv'],'Damas je malý mikrobus z výrobní rodiny původně odvozené od Suzuki Carry. Přejmenování na Chevrolet v některých zemích vyžaduje odlišení značky a trhu.'],
['labo','Labo','Labo',1991,null,['pickup'],'Labo je malý užitkový pickup ze stejného technického okruhu jako Damas. Vlastní karoserie a nosnost nejsou přebírány z mikrobusu.'],
['chairman','Chairman','Chairman',null,2002,['sedan'],'Daewoo Chairman je část historie luxusního sedanu původně vytvořeného u SsangYongu. Pozdější Chairman H a W se bez doloženého označení Daewoo nepřidávají.'],
['istana','Istana','Istana',null,null,['dodavka','mpv'],'Istana se na některých trzích prodávala jako Daewoo místo SsangYongu. Výrobní období všech značkových a čínských odvozenin není obdobím této konkrétní nabídky.']
];
for(const [slug,name,page,from,to,body,summary]of history){let u=wiki(page);add(slug,name,summary,[gen(name+' – značkově omezená rodina',from,to,u,body)],[u]);}
cards.find(c=>c.lineSlug==='nubira').generations=[gen('Nubira J100',1997,1999,wiki('Nubira'),['sedan','hatchback','kombi'],'Europe'),gen('Nubira J150 – modernizace J100',1999,null,wiki('Nubira'),['sedan','kombi'],'Europe'),gen('Nubira J200 – evropský sedan a kombi',null,null,wiki('Lacetti'),['sedan','kombi'],'Europe')];
cards.find(c=>c.lineSlug==='matiz').generations=[gen('Matiz M100 / M150',1998,null,wiki('Matiz'),['hatchback']),gen('Matiz M200',null,null,wiki('Matiz'),['hatchback'],'South Korea (Daewoo badge)'),gen('Matiz Creative M300',null,null,wiki('Matiz'),['hatchback'],'South Korea (Daewoo badge)')];
saveCards(make,cards);
// Original Daewoo Cars Ltd UK technical releases; no mph-to-km/h conversions.
const archive=n=>'http://www.darewnoo.pl/GTA/naforum/pros/u/d/'+n+'.jpg';
function technical(g,name,body,cc,kw,nm,gears,automatic,litres,url,date=null){
  g.trims??=[];g.trims.push(version(name,[url],{bodyType:body,engine:{fuel:'petrol',displacementCc:cc,cylinders:4,powerKw:kw,powerStandard:null,torqueNm:nm},transmission:{type:automatic?'automatic':'manual',gears},drive:'fwd',consumptionL100:litres,consumptionCycle:'Combined – dobový městský/mimoměstský cyklus, norma listem neurčena',specificationScope:{market:'United Kingdom',modelYear:date,noteCs:'Původní technický list Daewoo Cars Ltd. Výkon je přímo v kW. List uvádí rychlost v mph a zrychlení 0–60 nebo 0–62 mph, nikoli přesné 0–100 km/h; tyto hodnoty nejsou převáděny. Rozměry a hmotnost na ověřené straně nejsou.'}}));
  g.sources=[...new Set([...g.sources,url])];
}
const nubira=cards.find(c=>c.lineSlug==='nubira');
for(const [body,label]of[['sedan','Saloon'],['kombi','Estate']]){
  technical(nubira.generations[0],'1.6 E-Tec '+label+' 5MT – původní UK list',body,1598,78,145,5,false,8.8,archive('209'));
  technical(nubira.generations[0],'2.0 E-Tec '+label+' 5MT – původní UK list',body,1998,98,184,5,false,body==='sedan'?9.5:9.1,archive('210'));
  technical(nubira.generations[0],'2.0 E-Tec '+label+' 4AT – původní UK list',body,1998,98,184,4,true,body==='sedan'?10.5:10.2,archive('210'));
  technical(nubira.generations[1],'1.6 SE '+label+' 5MT – 22. 7. 1999',body,1598,77.8,142,5,false,7.8,archive('008'),1999);
  technical(nubira.generations[1],'2.0 CDX '+label+' 5MT – 22. 7. 1999',body,1998,98,180,5,false,body==='sedan'?8.6:8.7,archive('009'),1999);
  technical(nubira.generations[1],'2.0 CDX '+label+' 4AT – 22. 7. 1999',body,1998,98,180,4,true,body==='sedan'?9.3:9.8,archive('009'),1999);
}
const leganza=cards.find(c=>c.lineSlug==='leganza');
technical(leganza.generations[0],'2.0 16V 5MT – UK tovární list','sedan',1998,98,185,5,false,9.2,archive('211'));
technical(leganza.generations[0],'2.0 16V 4AT – UK tovární list','sedan',1998,98,185,4,true,10.5,archive('211'));
const maxx=cards.find(c=>c.lineSlug==='winstorm-maxx');
if(maxx){const u='https://www.newswire.co.kr/newsRead.php?no=341984';maxx.sources=[u];maxx.generations[0].sources=[u];maxx.generations[0].from=null;maxx.generations[0].specificationScope.noteCs='Tisková zpráva GM Daewoo z 18. 6. 2008 potvrzuje uvedení Winstorm MAXX. Jde o kompaktní pětimístnou větev příbuznou Opelu Antara, nikoli pouhou výbavu většího Winstormu. Datum uvedení nenahrazuje ověřený počátek výroby.';}
const royale=cards.find(c=>c.lineSlug==='royale');royale.generations[0].to=null;royale.generations[0].productionStatus='unknown';
add('honker','Honker','Honker je polský terénní automobil vyráběný postupně několika podniky. Tato karta omezuje historii na období Daewoo Motor Polska, nikoli na celou produkci Tarpanu a pozdějších nástupců.',[gen('Daewoo Honker – polské období',1996,2001,'https://en.wikipedia.org/wiki/Tarpan_Honker',['suv'],'Poland')],['https://en.wikipedia.org/wiki/Tarpan_Honker','https://historia.interia.pl/prl/news-polska-terenowka-tarpan-honker%2CnId%2C1579134']);
const photoPages=JSON.parse(fs.readFileSync('analysis/codex/night-daewoo-photo-selected.json','utf8'));
function photo(page,note){const ii=page.imageinfo[0],m=ii.extmetadata,clean=s=>s.replace(/<[^>]*>/g,'').replaceAll('&amp;','&').trim(),author=clean(m.Artist.value),licence=m.LicenseShortName.value;return{source:'commons',file:page.title.slice(5),url:ii.url.split('?')[0],filePageUrl:ii.descriptionurl,author,licence,licenceUrl:m.LicenseUrl.value,credit:author+' / Wikimedia Commons / '+licence,depicts:'generation',visualReview:'reviewed',reviewedAt:'2026-10-27',reviewNoteCs:note,sources:[ii.descriptionurl]};}
leganza.generations[0].photo=photo(photoPages[2],'Celý bílý sedan V100, přední tříčtvrtinový pohled, přibližně 7 % nebo větší okraj na všech stranách. Poměr 3:2.');
cards.find(c=>c.lineSlug==='matiz').generations[0].photo=photo(photoPages[4],'Celý červený Matiz M100, přední tříčtvrtinový pohled, nejmenší okraj přibližně 5,5 %, poměr 1,698. Fotografie nedokládá modernizaci M150.');
const extraPhotos=JSON.parse(fs.readFileSync('analysis/codex/night-daewoo-photo-extra.json','utf8'));
cards.find(c=>c.lineSlug==='espero').generations[0].photo=photo(extraPhotos[0],'Celý béžový Espero, přední tříčtvrtinový pohled, přibližně 9 % vlevo, 15 % vpravo a alespoň 7 % dole; poměr 3:2. Vedlejší auto nezasahuje do siluety Espera.');
for(const c of cards){c.sources=[...new Set([...c.sources,...c.generations.flatMap(g=>g.sources),...c.generations.flatMap(g=>(g.trims||[]).flatMap(t=>t.sources))])];markUnknowns(c);}
saveCards(make,cards);
const report={makeSlug:make,retrievedAt:'2026-10-27',scope:'Částečná historie 31 výrobních rodin Daewoo včetně korejských, evropských a vybraných exportních přeznačení. Nejde o úplnou globální technickou tabulku. Původních 14 ID zachováno. Nubira J200 sedan/kombi a Lacetti J200 hatchback jsou pro evropský kontext odděleny; Magnus/Evanda a LeMans/Racer/Cielo/Nexia jsou naopak sloučeny.',counts:{cards:cards.length,generationRecords:cards.reduce((n,c)=>n+c.generations.length,0),technicalVersions:cards.reduce((n,c)=>n+c.generations.reduce((k,g)=>k+(g.trims?.length||0),0),0),photos:cards.reduce((n,c)=>n+c.generations.filter(g=>g.photo).length,0)},proposedLines:cards.map(proposedLine),sources:[...new Set(cards.flatMap(c=>c.sources))],gaps:['Technické kombinace doloženy jen pro evropskou Nubiru J100/J150 a Leganzu z původních UK listů. Lanos, Matiz, Nexia, Kalos, Lacetti a Tacuma dosud nemají ověřené úplné verze.','Dobové tovární listy na přečtených stranách neuvádějí hmotnost ani rozměry a uvádějí jen mph / 0–60 nebo 0–62 mph. Nejsou doplňovány přepočty.','Přesný začátek/konec znaku Daewoo na jednotlivých trzích není znám pro mnoho přeznačených rodin. Null neznamená současnou výrobu.','Commons vyhledávání a obrazové posouzení provedeno pro Lanos, Matiz, Nubiru, Leganzu a Espero. Příliš těsné snímky Nubiry a Espera odmítnuty; historické a další řady vyžadují další foto průzkum.'],excluded:['Samostatné Chevrolet/FSO/ZAZ pokračování nejsou automaticky přidána do let Daewoo.','BMW společný podnik, autobusy/nákladní vozy a samostatné značky Saehan/Shinjin/FSO nejsou dalšími řadami Daewoo bez doloženého přeznačení.','Koncepty a soutěžní úpravy nejsou produkčními modelovými řadami.'],notes:['Daewoo.sk history page rejected for technical evidence: it incorrectly describes Prince as Kadett-based, Leganza as Chevrolet Lanos and Tosca as Holden Captiva.','Nubira 1997 vs facelift 1999 torque differences retained as separately scoped specifications, not treated as a conflict within one version.','All photographed assets use exact Commons imageinfo/extmetadata licence and artist values, not the first HTML licence link.']};
fs.writeFileSync('analysis/codex/night-daewoo-report.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.counts));
