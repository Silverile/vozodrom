import fs from 'node:fs';
const root='analysis/codex/generation-facts-pass/body-variants-1';
const oldRoot='analysis/codex/generation-facts-pass/top-100';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const docs={...read(oldRoot+'/source-documents.json'),...read(root+'/source-documents.json')};
const records=[];
function variant(bodyType,label,dims,trunkL,source,anchor,noteCs,extra={}) {
 const dimensionsMm=dims?Object.fromEntries(['length','width','height','wheelbase'].map((k,i)=>[k,dims[i]])):null;
 return {bodyType,label,dimensionsMm,trunkL,noteCs,source:docs[source]??source,anchor,...extra};
}
const add=(make,line,index,variants)=>records.push({make,line,index,variants});
const manualFabia='https://www.manualslib.com/manual/375235/Skoda-Fabia-05-2007.html';
add('skoda','fabia',0,[
 variant('hatchback','po faceliftu (2006/2007)',[3970,1646,1451,2462],260,manualFabia,'Owner’s manual 05/2007, printed p.199 / viewer p.201, Dimensions: FABIA column','Běžný hatchback po faceliftu, nikoli RS. Rozměry podle návodu 05/2007; kufr se zadními sedadly vzpřímenými podle britského katalogu 05/2006.',{fieldSources:{trunkL:docs.fabia_2006},fieldAnchors:{trunkL:'PDF p.7, ŠkodaFabia Hatch, Luggage storage space, rear seat upright:260'}}),
 variant('kombi','po faceliftu (2006/2007)',[4232,1646,1452,2462],426,manualFabia,'Owner’s manual 05/2007, printed p.199 / viewer p.201, Dimensions: ESTATE CAR column','Běžné Combi po faceliftu. Rozměry podle návodu 05/2007; kufr se zadními sedadly vzpřímenými podle britského katalogu 05/2006.',{fieldSources:{trunkL:docs.fabia_2006},fieldAnchors:{trunkL:'PDF p.7, ŠkodaFabia Estate, Luggage storage space, rear seat upright:426'}}),
 variant('sedan','po faceliftu (2007)',[4232,1646,1449,2462],null,manualFabia,'Owner’s manual 05/2007, viewer p.201, Dimensions: SEDAN column','Rozměry sedanu podle návodu 05/2007. Kufr pro toto referenční provedení nebyl v použitém podkladu ověřen; údaj z tiskové zprávy k uvedení v roce2001 se sem nepřenáší.',{nullReasons:{trunkL:'Reference-specific luggage capacity not confirmed; the2001 launch release refers to a shorter4222mm car.'}})
]);
add('skoda','octavia',1,[
 variant('hatchback','Liftback (katalog 2011)',[4569,1769,1462,2578],585,'octavia_2011','PDF p.20, Octavia technical specifications and dimension drawing','Běžný liftback s předním pohonem, katalog2011. Kufr je základní uspořádání podle schématu katalogu; velikost se může lišit podle rezervního kola a palivové soustavy.'),
 variant('kombi','Combi (katalog 2011)',[4569,1769,1468,2578],605,'octavia_2011','PDF p.21, Octavia Combi technical specifications and FWD dimension drawing; p.7 basic luggage arrangement','Běžné Combi s předním pohonem, nikoli Scout či GreenLine. Základní kufr podle katalogu2011; rezervní kolo a palivová soustava mohou objem změnit.')
]);
add('skoda','octavia',2,[
 variant('hatchback','Liftback po faceliftu (2017)',[4670,1814,1461,2686],590,'geneva_2017','PDF p.38, ŠKODA OCTAVIA Diesel engines, Outside dimensions and Storage capacity','Běžný liftback po faceliftu, přední pohon, technický list7.3.2017. Nikoli RS, Scout, G-TEC ani4×4; zadní opěradla vzpřímená.'),
 variant('kombi','Combi po faceliftu (2017)',[4667,1814,1465,2686],610,'geneva_2017','PDF p.60, ŠKODA OCTAVIA COMBI Diesel engines, Outside dimensions and Storage capacity','Běžné Combi po faceliftu, přední pohon, technický list7.3.2017. Nikoli RS, Scout, G-TEC ani4×4; zadní opěradla vzpřímená.')
]);
add('skoda','fabia',1,[
 variant('hatchback','standardní podvozek (katalog 2009)',[3992,1642,1498,2462],315,'fabia_2009','PDF p.17 / printed pp.32–33, Fabia exterior dimensions and luggage storage','Běžný hatchback, nikoli RS nebo GreenLine. Výška při pohotovostní hmotnosti, šířka bez zrcátek, zadní opěradla vzpřímená; referencí je katalog04/2009.'),
 variant('kombi','standardní podvozek (katalog 2009)',[4239,1642,1498,2462],505,'fabia_2009','PDF p.17 / printed pp.32–33, Fabia Combi exterior dimensions and luggage storage','Běžné Combi, nikoli RS, Scout nebo GreenLine. Výška při pohotovostní hmotnosti, šířka bez zrcátek, zadní opěradla vzpřímená; katalog04/2009.')
]);
add('skoda','octavia',3,[
 variant('hatchback','Liftback po faceliftu (2024)',[4698,1829,1470,2686],600,'octavia_2024','PDF p.2, Octavia petrol engines; Essence, Selection and Sportline reference','Technický list05/2024 pro Essence, Selection a Sportline. Šířka bez zrcátek, výška při pohotovostní hmotnosti, základní kufr se vzpřímenými opěradly; nikoli RS, iV či G-TEC.'),
 variant('kombi','Combi po faceliftu (2024)',[4698,1829,1468,2686],640,'octavia_2024','PDF p.11, Octavia Combi petrol engines; Essence, Selection and Sportline reference','Technický list05/2024 pro Essence, Selection a Sportline. Šířka bez zrcátek, výška při pohotovostní hmotnosti, základní kufr se vzpřímenými opěradly; nikoli RS, iV či G-TEC.')
]);
add('skoda','fabia',2,[
 variant('hatchback','před faceliftem (2017)',[3992,1732,1467,2470],330,'geneva_2017','PDF p.99, ŠKODA FABIA Diesel engines, Outside dimensions and Storage capacity','Běžný hatchback před faceliftem, technický list7.3.2017. Šířka bez zrcátek a výška při pohotovostní hmotnosti; kufr se vzpřímenými opěradly.'),
 variant('kombi','před faceliftem (2017)',[4257,1732,1467,2470],530,'geneva_2017','PDF p.105, ŠKODA FABIA COMBI Diesel engines, Outside dimensions and Storage capacity','Běžné Combi před faceliftem, technický list7.3.2017. Šířka bez zrcátek a výška při pohotovostní hmotnosti; kufr se vzpřímenými opěradly.')
]);
add('skoda','felicia',0,[
 variant('hatchback','po faceliftu (pozdní návod)',[3883,1635,1415,2450],272,'felicia_cz','Printed p.146, TECHNICKÉ ÚDAJE, Rozměry, FELICIA column','Pozdní tovární návod: šířka bez zrcátek, přibližná výška prázdného vozidla; základní kufr. Údaje nejsou pro původní předfaceliftovou příď.'),
 variant('kombi','po faceliftu (pozdní návod)',[4237,1635,1420,2450],447,'felicia_cz','Printed p.146, TECHNICKÉ ÚDAJE, Rozměry, FELICIA COMBI column','Pozdní tovární návod: šířka bez zrcátek, přibližná výška prázdného vozidla; základní kufr. Údaje nejsou pro původní předfaceliftovou příď.'),
 variant('pickup','bez nástavby (pozdní návod)',[4115,1635,1440,2450],null,'felicia_cz','Printed p.146, TECHNICKÉ ÚDAJE, Rozměry, PICKUP column and footnotes1,3','Pick-up bez nástavby; výška prázdného vozidla. Objem nákladové korby do výše postranic se nevydává za osobní kufr.',{nullReasons:{trunkL:'Commercial open cargo-bed volume is not passenger luggage capacity.'}})
]);
add('skoda','rapid',0,[
 variant('hatchback','Liftback (2017)',[4483,1706,1461,2602],550,'geneva_2017','PDF p.87, ŠKODA RAPID Diesel engines, Outside dimensions and Storage capacity','Pětidveřový liftback, technický list7.3.2017. Šířka bez zrcátek, výška při pohotovostní hmotnosti, zadní opěradla vzpřímená.'),
 variant('hatchback','Spaceback (2017)',[4304,1706,1459,2602],415,'geneva_2017','PDF p.93, ŠKODA RAPID SPACEBACK Diesel engines, Outside dimensions and Storage capacity','Kratší Spaceback, technický list7.3.2017. Šířka bez zrcátek, výška při pohotovostní hmotnosti, zadní opěradla vzpřímená. Stejný klíč karoserie neznamená stejné rozměry.')
]);
add('skoda','superb',2,[
 variant('hatchback','Liftback před faceliftem (2016)',[4861,1864,1468,2841],625,'superb_2016','PDF p.2, ŠKODA SUPERB Diesel engines, Outside dimensions and Storage capacity','Běžný liftback podle továrního technického listu2016, nikoli SportLine nebo iV. Výška při pohotovostní hmotnosti, šířka bez zrcátek; zadní opěradla vzpřímená.'),
 variant('kombi','Combi před faceliftem (2016)',[4856,1864,1477,2841],660,'superb_combi_2016','PDF p.2, ŠKODA SUPERB COMBI Diesel engines, Outside dimensions and Storage capacity','Běžné Combi podle továrního technického listu2016, nikoli SportLine nebo iV. Výška při pohotovostní hmotnosti, šířka bez zrcátek; zadní opěradla vzpřímená.')
]);
add('skoda','superb',1,[
 variant('sedan','Twindoor po faceliftu (2013)',[4833,1817,1462,2761],595,'superb_2013','PDF pp.38–43, Technické údaje – Superb, Vonkajší rozměry and luggage capacity','Twindoor je v této kartě veden pod klíčem sedan. Běžný podvozek po faceliftu2013, nikoli GreenLine; kufr bez rezervního kola, zadní opěradla vzpřímená.'),
 variant('kombi','Combi po faceliftu (2013)',[4833,1817,1511,2761],633,'superb_2013','PDF pp.44–47, Technické údaje – Superb Combi, Vonkajší rozměry and luggage capacity','Běžné Combi po faceliftu2013, nikoli GreenLine; kufr bez rezervního kola, zadní opěradla vzpřímená. Rezervní kolo podle katalogu zmenšuje objem o30l.')
]);
add('volkswagen','golf',6,[
 variant('hatchback','běžný hatchback před faceliftem (2014)',[4255,1799,1452,2637],380,'https://manuals.plus/m/458e8c071804a91e8a7e130d2d3693f8dd8bcb0b3637538477750ee4582f0d80','Factory UK brochure2014, Dimensions, printed p.67: S, BlueMotion, Match, GT, R-Line','Běžný pětidveřový hatchback, nikoli GTI/GTD/R nebo e-Golf. Šířka bez zrcátek; kufr metodou VDA se zadními sedadly vzpřímenými.'),
 variant('kombi','Variant před faceliftem (2013)',[4562,1799,1481,2635],605,'https://www.volkswagen-newsroom.com/en/the-new-golf-estate-international-press-presentation-2977/the-new-golf-estate-overview-quick-facts-3002','Factory launch press kit, June2013, Vehicle dimensions and luggage capacity','Běžný Variant před faceliftem, nikoli Alltrack/GTD/R. Šířka bez zrcátek; výška včetně standardních střešních ližin; základní kufr se vzpřímenými zadními sedadly.')
]);
const focus2008='https://www.scribd.com/document/75321256/Focus-April-2008';
add('ford','focus',1,[
 variant('hatchback','běžný 3/5dveřový (katalog 2008)',[4337,1839,1497,null],null,focus2008,'Ford UK MY2008 brochure, printed p.52, Dimensions:3&5-door column','Běžný hatchback, nikoli ST/RS. Šířka bez zrcátek, výška bez střešního nosiče. Rozvor v použité tabulce není uveden; kufr se liší podle rezervy a nejasné přiřazení extrahovaných sloupců se neodhaduje.',{nullReasons:{'dimensionsMm.wheelbase':'Not stated in reviewed factory brochure table.',trunkL:'Spare-wheel configurations and misaligned extracted capacity columns; left unconfirmed.'}}),
 variant('sedan','4dveřový (katalog 2008)',[4481,1839,1497,null],null,focus2008,'Ford UK MY2008 brochure, printed p.52, Dimensions:4-door column','Sedan podle britského katalogu2008. Šířka bez zrcátek, výška bez střešního nosiče; rozvor a přiřazení konkrétního kufru k rezervě nebyly v tomto zdroji bezpečně ověřeny.',{nullReasons:{'dimensionsMm.wheelbase':'Not stated in reviewed factory brochure table.',trunkL:'Spare-wheel configurations and misaligned extracted capacity columns; left unconfirmed.'}}),
 variant('kombi','Estate (katalog 2008)',[4468,1839,1503,null],null,focus2008,'Ford UK MY2008 brochure, printed p.52, Dimensions:Estate column','Běžné kombi podle britského katalogu2008. Šířka bez zrcátek a výška bez střešního nosiče; rozvor a přiřazení konkrétního kufru k rezervě zůstávají neověřené.',{nullReasons:{'dimensionsMm.wheelbase':'Not stated in reviewed factory brochure table.',trunkL:'Spare-wheel configurations and misaligned extracted capacity columns; left unconfirmed.'}}),
 variant('kabriolet','Coupé-Cabriolet, střecha zavřená (2008)',[4509,1834,1448,2640],534,'https://manuals.plus/m/e74b5e031ab0f9bf9d7acaeda304765a6e359b0e2544d0a0f0719dcfcfca78ee','Original Ford UK2008 Coupé-Cabriolet brochure, Exterior dimensions and Stowable luggage','Dvoudveřový čtyřmístný Coupé-Cabriolet, šířka bez zrcátek, výška prázdného vozidla. Kufr s uzavřenou střechou metodou VDA: továrních0,534m³ převedeno přesně na534l.'),
 variant('kabriolet','Coupé-Cabriolet, střecha složená (2008)',[4509,1834,null,2640],248,'https://manuals.plus/m/e74b5e031ab0f9bf9d7acaeda304765a6e359b0e2544d0a0f0719dcfcfca78ee','Original Ford UK2008 Coupé-Cabriolet brochure, Exterior dimensions and Stowable luggage','Kufr s otevřenou střechou metodou VDA: továrních0,248m³ převedeno přesně na248l. Uvádí se čtyřmístné uspořádání; výška otevřeného provedení nebyla zvlášť potvrzena.',{nullReasons:{'dimensionsMm.height':'Closed-roof overall height is not transferred to the roof-retracted configuration.'}})
]);
add('skoda','roomster',0,[
 variant('mpv','po faceliftu, sedadla v R-bodě (2011)',[4214,1684,1607,2621],509,'roomster_2011','PDF p.15, Technické údaje, dimension drawing and luggage footnote****','Běžný osobní Roomster, katalog05/2011, nikoli Scout. Kufr bez rezervního kola, sedadlo v základním R-bodě, opěradlo23,5°, do výše zadního plata; posuv sedadel jinak mění objem na480–560l.'),
 variant('dodavka','Praktik po faceliftu (2011)',[4213,1684,1607,2620],null,'praktik_2011','PDF p.4, Czech factory brochure05/2011, Praktik exterior dimension drawing','Dvoumístný Praktik po faceliftu podle českého katalogu05/2011. Šířka bez zrcátek; ložný objem se nepřevádí na osobní kufr. Délka a rozvor jsou ověřeny pro Praktik, nikoli převzaty z osobního Roomsteru.',{nullReasons:{trunkL:'Two-seat commercial cargo compartment; passenger trunk not applicable.'}})
]);
add('volkswagen','golf',3,[
 variant('hatchback','běžný hatchback, přední pohon',[4149,1735,null,2511],null,'https://www.volkswagen-newsroom.com/en/vehicle-data-golf-4-profile-19478','Factory historical profile, Golf IV Saloon/Type1J, wheelbase and length/width/height','Tovární profil hatchbacku s předním pohonem. Šířka bez zrcátek; zdroj udává rozpětí výšky1439–1444mm bez přiřazení k jedné verzi, proto výška zůstává prázdná. Kufr nebyl v tomto podkladu potvrzen.',{nullReasons:{'dimensionsMm.height':'Manufacturer gives1439–1444mm range without identifying a single reference version.',trunkL:'Not stated in reviewed primary profile.'}}),
 variant('kombi','Variant, modelový rok 2003',[4397,1735,1473,2515],460,'https://manuals.plus/m/10027dd37d2c817f654124fd810913a86eb34a87305e4f0358cdcb1b73f611d6.pdf','Volkswagen UK factory brochure MY2003, printed pp.66–73 capacities and pp.76–77 exterior diagram','Běžný Variant s předním pohonem, nikoli sportovní snížený podvozek. Šířka bez zrcátek; kufr VDA se vzpřímenými zadními sedadly, měřený před montáží vyjímatelné schránky pod podlahou.')
]);
const vanBoot={trunkL:'Commercial cargo volume is not passenger luggage capacity.'};
add('volkswagen','transporter',4,[
 ...[['krátký rozvor, nízká střecha',4892,1990,3000],['krátký rozvor, střední střecha',4892,2176,3000],['dlouhý rozvor, nízká střecha',5292,1990,3400],['dlouhý rozvor, střední střecha',5292,2176,3400],['dlouhý rozvor, vysoká střecha',5292,2476,3400]].map(([label,l,h,wb])=>variant('dodavka',label+' (2015)',[l,1904,h,wb],null,'transporter_van_2015','PDF p.19 / printed pp.36–37, Panel van dimension drawings','T5 po faceliftu, katalog11/2014. Šířka bez zrcátek; výška podle schématu může dle výbavy kolísat o±50mm. Nákladový objem není osobní kufr.',{nullReasons:vanBoot})),
 variant('mpv','Shuttle S, krátký rozvor (2015)',[4892,1904,1990,3000],null,'transporter_shuttle_2015','PDF p.13 / printed pp.24–25, short-wheelbase Shuttle drawing; unbracketed S values','Shuttle S s krátkým rozvorem, katalog11/2014; nikoli nižší Shuttle SE. Šířka bez zrcátek, tolerance výšky podle výrobce±50mm. Kufr za obsazenými řadami sedadel není doložen.',{nullReasons:{trunkL:'Published load volume does not establish luggage capacity behind occupied passenger rows.'}}),
 variant('mpv','Shuttle S, dlouhý rozvor (2015)',[5292,1904,1990,3400],null,'transporter_shuttle_2015','PDF p.13 / printed pp.24–25, long-wheelbase Shuttle dimension drawing','Shuttle s dlouhým rozvorem, katalog11/2014. Šířka bez zrcátek, tolerance výšky podle výrobce±50mm. Kufr za obsazenými řadami sedadel není doložen.',{nullReasons:{trunkL:'Published load volume does not establish luggage capacity behind occupied passenger rows.'}}),
 variant('pickup','valník / nástavba',null,null,null,'Existing body classification retained; no figure asserted','Celkové rozměry závisí na kabině a nástavbě. Údaje skříňové dodávky se sem nepřenášejí.',{nullReasons:{'dimensionsMm.length':'Body-builder and cab dependent; not confirmed.','dimensionsMm.width':'Body-builder and cab dependent; not confirmed.','dimensionsMm.height':'Body-builder and cab dependent; not confirmed.','dimensionsMm.wheelbase':'Body-builder and cab dependent; not confirmed.',trunkL:'Cargo platform, not passenger trunk.'}})
]);
add('volkswagen','passat',6,[
 variant('sedan','běžný podvozek (2014)',[4769,1820,1470,2712],565,'passat_2014','PDF p.24 / printed pp.46–47, Exterior dimensions and VDA luggage table, Saloon column; black standard values','Běžný sedan B7 podle britského katalogu07/2014. Šířka bez zrcátek, nikoli snížené provedení BlueMotion; kufr VDA se zadními sedadly vzpřímenými.'),
 variant('kombi','Variant, běžný podvozek (2014)',[4771,1820,1516,2712],603,'passat_2014','PDF p.24 / printed pp.46–47, Exterior dimensions and VDA luggage table, Estate column; black standard values','Běžné kombi B7 podle britského katalogu07/2014. Šířka bez zrcátek, nikoli snížený BlueMotion nebo zvýšený Alltrack; kufr VDA se zadními sedadly vzpřímenými.'),
 variant('kombi','Alltrack (2014)',[4771,1820,1550,2710],588,'passat_2014','PDF p.24 / printed pp.46–47, Exterior dimensions and VDA luggage table, Alltrack column','Zvýšený Alltrack B7 podle britského katalogu07/2014. Šířka bez zrcátek, zadní sedadla vzpřímená; základní kufr podle VDA.')
]);
add('ford','transit',2,[
 ...[
  ['SWB, nízká střecha, FWD',4863,2933,21,'1997–2067'],
  ['SWB, střední střecha, FWD',4863,2933,21,'2313–2383'],
  ['MWB, nízká střecha, FWD',5230,3300,24,'1985–2056'],
  ['MWB, střední střecha, FWD',5230,3300,24,'2310–2371'],
  ['MWB, vysoká střecha, FWD',5230,3300,24,'2546–2601'],
  ['LWB, střední střecha, FWD',5680,3750,26,'2326–2381'],
  ['LWB, vysoká střecha, FWD',5680,3750,26,'2543–2599'],
  ['EL Jumbo, vysoká střecha, RWD SRW',6403,3750,28,'2608–2629'],
 ].map(([label,l,wb,p,range])=>variant('dodavka',label+' (2010)',[l,1974,null,wb],null,'transit_2010',`PDF p.${p}, Dimensions table: stated van layout; width without mirrors; excludes optional step and3.2L extended nose`,`Katalog2010, po modernizaci2006. Šířka bez zrcátek, délka bez přídavného schodu a bez delší přídě3.2TDCi. Výrobce uvádí výšku v intervalu${range}mm podle zatížení a nosnosti; jediná hodnota se nevybírá. Nákladový objem není osobní kufr.`,{nullReasons:{'dimensionsMm.height':'Factory table gives laden/unladen and payload-dependent range '+range+'mm; scalar reference not established.',...vanBoot}})),
 variant('pickup','valník / nástavba',null,null,null,'Existing body classification retained; no figure asserted','Celkové rozměry valníku závisí na kabině a nástavbě. Rozměry skříňové dodávky se nepřebírají.',{nullReasons:{'dimensionsMm.length':'Body-builder and cab dependent.','dimensionsMm.width':'Body-builder and cab dependent.','dimensionsMm.height':'Body-builder and cab dependent.','dimensionsMm.wheelbase':'Several chassis/cab configurations; reference not established.',trunkL:'Cargo platform, not passenger trunk.'}})
]);
add('volkswagen','passat',7,[
 variant('sedan','běžný podvozek (2016)',[4767,1832,1456,2791],586,'passat_2016','PDF p.34 / printed pp.66–67, Passat Saloon, dimension drawing and VDA luggage table','Běžný sedan B8 před faceliftem podle katalogu11/2016, nikoli GTE. Šířka bez zrcátek ze schématu; základní kufr VDA se zadními sedadly vzpřímenými.'),
 variant('kombi','Variant, běžný podvozek (2016)',[4767,1832,1477,2791],650,'passat_2016','PDF p.34 / printed pp.66–67, Passat Estate, dimension drawing and VDA luggage table','Běžný Variant B8 před faceliftem podle katalogu11/2016, nikoli GTE nebo Alltrack. Šířka bez zrcátek ze schématu; základní kufr VDA se zadními sedadly vzpřímenými.'),
 variant('kombi','Alltrack (2016)',[4777,null,1506,2789],639,'passat_2016','PDF p.34 / printed pp.66–67, Passat Alltrack column','Zvýšený Alltrack B8 podle katalogu11/2016. Šířka bez zrcátek nebyla v použité tabulce pro Alltrack zvlášť potvrzena; základní kufr VDA se zadními sedadly vzpřímenými.',{nullReasons:{'dimensionsMm.width':'Alltrack-specific body width not confirmed in the reviewed drawing; standard Estate width not transferred.'}})
]);
add('peugeot','206',0,[
 variant('hatchback','3/5dveřový (katalog 2006)',[3822,null,1433,2445],null,'p206_uk_2006','PDF p.15 / printed pp.28–29, Colours and dimensions,206 block','Referenční hatchback podle britského katalogu04/2006. Šířka je uvedena jen jako rozpětí1652–1673mm podle verze; jednotlivá hodnota a kufr nebyly potvrzeny.',{nullReasons:{'dimensionsMm.width':'Factory gives1652–1673mm model-dependent range; no model-to-width mapping confirmed.',trunkL:'Not established in reviewed factory brochure.'}}),
 variant('kombi','SW (katalog 2006)',[4028,null,1460,2442],313,'p206_uk_2006','PDF p.15 / printed pp.28–29,206SW dimensions; PDF p.7 / printed p.13, SW basic boot volume','Britský katalog04/2006, běžné SW. Šířka je uvedena jen jako rozpětí1652–1673mm podle verze; základní kufr je továrních313dm³, tedy313l.',{nullReasons:{'dimensionsMm.width':'Factory gives1652–1673mm model-dependent range; no model-to-width mapping confirmed.'}}),
 variant('kabriolet','CC, střecha zavřená (2006)',[3835,1673,1373,2442],410,'p206_cc_uk_2006','PDF p.11 / printed pp.20–21, Colours and dimensions; coupé configuration boot volume','206CC podle britského katalogu2006. Šířka bez zrcátek; zavřená střecha, objem kufru podle továrního údaje VDA.'),
 variant('kabriolet','CC, střecha složená (2006)',[3835,1673,null,2442],175,'p206_cc_uk_2006','PDF p.11 / printed pp.20–21, Colours and dimensions; cabriolet configuration boot volume','206CC s otevřenou střechou podle britského katalogu2006. Šířka bez zrcátek; objem kufru podle továrního údaje VDA. Výška otevřeného provedení není zvlášť potvrzena.',{nullReasons:{'dimensionsMm.height':'Closed-roof overall height not transferred to the roof-retracted configuration.'}}),
 variant('sedan','sedan',null,null,null,'Existing body classification retained; no figure asserted','Sedan není obsažen v použitých evropských katalozích206/SW a206CC. Rozměry ani kufr se nepřebírají z hatchbacku.',{nullReasons:{'dimensionsMm.length':'Regional sedan not covered by reviewed European factory brochures.','dimensionsMm.width':'Regional sedan not covered by reviewed European factory brochures.','dimensionsMm.height':'Regional sedan not covered by reviewed European factory brochures.','dimensionsMm.wheelbase':'Regional sedan not covered by reviewed European factory brochures.',trunkL:'Regional sedan not covered by reviewed European factory brochures.'}})
]);
add('volkswagen','caddy',2,[
 variant('dodavka','krátká dodávka, standardní podvozek (2012)',[4406,1794,1823,2681],null,'vw_vans_2012','PDF p.24 / printed pp.48–49, Caddy van diagram and standard height row','Krátká skříňová dodávka podle katalogu01/2012. Šířka bez zrcátek; výška pro standardní provedení, nikoli snížený BlueMotion nebo vyšší4MOTION. Nákladový objem není osobní kufr.',{nullReasons:vanBoot}),
 variant('dodavka','Maxi Window Van, standardní podvozek (2013)',[4876,1794,1831,3006],null,'caddy_2013','PDF p.23 / printed pp.44–45, Caddy Maxi Window Van diagram and standard height row','Prosklené užitkové Maxi podle katalogu01/2013. Šířka bez zrcátek; standardní podvozek, nikoli4MOTION. Nákladový objem se nevydává za osobní kufr.',{nullReasons:vanBoot}),
 variant('mpv','Maxi Life, standardní podvozek (2013)',[4876,1794,1831,3006],null,'caddy_2013','PDF p.22 / printed pp.42–43, Caddy Maxi Life diagram and standard height row','Osobní Maxi Life podle katalogu01/2013, standardní podvozek, nikoli4MOTION. Šířka bez zrcátek; kufr za obsazenou třetí řadou nebyl v použité tabulce potvrzen.',{nullReasons:{trunkL:'Passenger luggage capacity behind the occupied third row is not confirmed by the reviewed table.'}}),
 variant('mpv','krátké osobní provedení',null,null,null,'Existing multi-wheelbase family retained; no figure asserted','Krátké osobní provedení není v použitém britském katalogu Maxi Life rozměrově doloženo; údaje dlouhého Maxi se na něj nepřenášejí.',{nullReasons:{'dimensionsMm.length':'Short passenger body not covered by reviewed UK Maxi Life reference.','dimensionsMm.width':'Short passenger body not covered by reviewed UK Maxi Life reference.','dimensionsMm.height':'Short passenger body not covered by reviewed UK Maxi Life reference.','dimensionsMm.wheelbase':'Short passenger body not covered by reviewed UK Maxi Life reference.',trunkL:'Short passenger body not covered by reviewed UK Maxi Life reference.'}})
]);
// A visual review confirmed that the2006 brochure provides all four body dimensions.
for(const v of records[0].variants.slice(0,2)){
 v.source=docs.fabia_2006;v.anchor='PDF p.7, Measurements: standard '+(v.bodyType==='kombi'?'Estate':'Hatch')+' dimension diagram and upright-seat luggage table';
 v.label='po faceliftu (2006)';v.noteCs='Běžné provedení po faceliftu, nikoli RS. Rozměry a kufr se zadními sedadly vzpřímenými podle britského katalogu05/2006; šířka bez zrcátek.';
}
// Only newly authored notes are normalized; existing catalogue prose is untouched.
for(const r of records)for(const v of r.variants)v.noteCs=v.noteCs.replace(/(\p{L})(?=\d)/gu,'$1 ').replace(/(\d)(?=\p{L})/gu,'$1 ').replace(/(\d{1,2})\.(\d{1,2})\.(\d{4})/g,'$1. $2. $3').replace(/(\p{L})±/gu,'$1 ±');
const order=read(root+'/selection.json').map(r=>r.make+'/'+r.line+'/'+r.index);
records.sort((a,b)=>order.indexOf(a.make+'/'+a.line+'/'+a.index)-order.indexOf(b.make+'/'+b.line+'/'+b.index));
fs.writeFileSync(root+'/variants.json',JSON.stringify(records,null,2)+'\n');
console.log(JSON.stringify({generations:records.length,variants:records.reduce((n,r)=>n+r.variants.length,0)}));
