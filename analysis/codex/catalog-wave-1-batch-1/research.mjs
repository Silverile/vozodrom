// Selected factual rows transcribed from the linked sources on 2026-10-31.
// Engine tables are representative documented variants, never an inferred full range.
export const wiki={
 ducato:'https://en.wikipedia.org/wiki/Fiat_Ducato',
 ducatoDe:'https://de.wikipedia.org/wiki/Fiat_Ducato',
 expert:'https://de.wikipedia.org/wiki/Peugeot_Expert',
 expertEn:'https://en.wikipedia.org/wiki/Citro%C3%ABn_Jumpy',
 expertIdentification:'https://www.ipi.ba/wp-content/uploads/2021/06/IDENTIFIKACIJA-MOTORNIH-VOZILA_IPI_2010_2-izdanje-za-web.pdf',
 expertCurrent:'https://www.peugeot.fr/content/dam/peugeot/france/b2c/documentation/brochures/EXPERT-COMBI_BROCHURE.pdf',
 boxer2014:'https://www.media.stellantis.com/at-de/peugeot/press/der-neue-peugeot-boxer-neue-qualitaten-im-dienst-der-businesskunden',
 boxer2024:'https://www.media.stellantis.com/em-en/peugeot/press/new-peugeot-boxer-with-at8-automatic-gearbox-more-comfort-and-efficiency-for-professionals',
 p206:'https://en.wikipedia.org/wiki/Peugeot_206',
 p307:'https://en.wikipedia.org/wiki/Peugeot_307',
 p308:'https://en.wikipedia.org/wiki/Peugeot_308',
 p308i:'https://de.wikipedia.org/wiki/Peugeot_308_I',
 p308ii:'https://de.wikipedia.org/wiki/Peugeot_308_II',
 p308iii:'https://de.wikipedia.org/wiki/Peugeot_308_III',
 p2008i:'https://de.wikipedia.org/wiki/Peugeot_2008_I',
 p2008ii:'https://de.wikipedia.org/wiki/Peugeot_2008_II',
 berlingo:'https://en.wikipedia.org/wiki/Citro%C3%ABn_Berlingo',
 berlingoDe:'https://de.wikipedia.org/wiki/Citro%C3%ABn_Berlingo',
 sandero:'https://en.wikipedia.org/wiki/Dacia_Sandero',
 duster:'https://en.wikipedia.org/wiki/Dacia_Duster',
 dusterProduction:'https://media.dacia.com/dacia-develops-its-industral-plan-and-goes-on-the-offensive-in-the-c-segment/'
};
// compact engine tuple: variant, fuel, exact cc (null for EV), nominal litres,
// explicitly documented kW values, source key, optional power basis.
const e=(variant,fuel,cc,litres,kw,source,powerBasis)=>({variant,fuel,displacementCc:cc,displacementLitresNominal:litres,
 powerKwMin:Math.min(...kw),powerKwMax:Math.max(...kw),availablePowerKw:kw,powerRangeCoverage:'documented-versions-only',
 sources:[wiki[source]],fieldSources:Object.fromEntries(['variant','fuel','displacementCc','displacementLitresNominal','powerKwMin','powerKwMax','availablePowerKw'].map(k=>[k,[wiki[source]]])),
 specificationScope:'Vybrané doložené historické motorizace; dostupnost závisí na trhu, karoserii a roku. Nejde o současný český ceník.',...(powerBasis?{powerBasis}:{})});
const p=(name,cc,l,kw,s)=>e(name,'petrol',cc,l,kw,s);
const d=(name,cc,l,kw,s)=>e(name,'diesel',cc,l,kw,s);
const ev=(name,kw,s)=>e(name,'electric',null,null,kw,s);
const f=(year,name,source,note)=>({year,name,sources:[wiki[source]],note:note??`Doložená modernizace; zdroj: ${wiki[source]}`});
export const changes=[
 {make:'peugeot',line:'boxer',create:true,name:'Boxer',segment:'LCV',summaryCs:'Velká užitková dodávka Peugeot vyráběná od roku 1994. Dvě základní konstrukční generace zahrnují také pozdější modernizace a elektrický pohon.',source:'ducatoDe',generations:[
  {name:'Boxer I',code:'I (230/244)',from:1994,to:2006,bodyTypes:['dodavka'],source:'ducatoDe',facelifts:[f(2002,'Modernizace 2002','ducato')],engines:[p('2.0 i.e.',1998,2,[81],'ducato'),d('1.9 D (PSA)',1905,1.9,[51],'ducato'),d('2.0 HDi',1997,2,[62],'ducato'),d('2.2 HDi',2179,2.2,[74],'ducato'),d('2.8 HDi',2800,2.8,[94],'ducato')]},
  {name:'Boxer II',code:'II (250)',from:2006,to:null,bodyTypes:['dodavka'],source:'ducatoDe',facelifts:[f(2014,'Modernizace 2014','boxer2014'),f(2024,'Modernizace 2024','boxer2024')],engines:[d('2.2 HDi (původní nabídka)',2198,2.2,[74,88],'ducatoDe'),d('2.2 HDi (nabídka 2014)',null,2.2,[81,96,110],'boxer2014'),d('3.0 HDi (nabídka 2014)',null,3,[130],'boxer2014'),d('2.2 BlueHDi (2019)',2179,2.2,[88,103,121],'ducatoDe'),ev('E-Boxer (modernizace 2024)',[200],'boxer2024')]}
 ]},
 {make:'peugeot',line:'expert',create:true,name:'Expert',segment:'LCV',summaryCs:'Středně velká užitková řada Peugeot vyráběná od roku 1995. Vedle skříňové dodávky zahrnuje také osobní a kombinovaná provedení; od třetí generace existuje elektrický e-Expert.',source:'expert',generations:[
  {name:'Expert I',code:'I',from:1995,to:2006,bodyTypes:['dodavka','mpv'],source:'expert',facelifts:[f(2004,'Modernizace 2004','expertEn')],engines:[p('1.6',1580,1.6,[58],'expertIdentification'),p('2.0 16V',null,2,[100],'expertIdentification'),d('1.9 D',null,1.9,[51],'expertIdentification'),d('1.9 Turbo D',null,1.9,[68],'expertIdentification'),d('2.0 HDi',null,2,[80],'expertIdentification')]},
  {name:'Expert II',code:'II (G9)',from:2007,to:2016,bodyTypes:['dodavka','mpv'],source:'expert',facelifts:[f(2012,'Modernizace 2012','expert')],engines:[p('2.0 16V',1997,2,[103],'expertEn'),d('1.6 HDi 90',1560,1.6,[66],'expertEn'),d('2.0 HDi',1997,2,[88,100,120],'expert')]},
  {name:'Expert III',code:'III (K0)',from:2016,to:null,bodyTypes:['dodavka','mpv'],source:'expertEn',facelifts:[f(2024,'Modernizace 2024','expert','Představeno v říjnu 2023; provedení modelového roku 2024. Zdroj: '+wiki.expert)],engines:[d('BlueHDi 120 (Expert Combi)',null,1.5,[88],'expertCurrent'),d('BlueHDi 145 (Expert Combi)',null,2,[106],'expertCurrent'),ev('e-Expert',[100],'expertCurrent')]}
 ]},
 {make:'fiat',line:'ducato',source:'ducatoDe',generations:[
  {index:0,bodyTypes:['dodavka'],facelifts:[f(1989,'Modernizace 290','ducatoDe','Typ 290 uveden při modernizaci v roce 1989, od července 1990 výhradně v nabídce. Zdroj: '+wiki.ducatoDe)],engines:[p('1.8',1796,1.8,[51],'ducato'),p('2.0',1971,2,[55,57,62,63],'ducato'),d('1.9 D',1929,1.9,[51],'ducato'),d('1.9 TD',1929,1.9,[60],'ducato'),d('2.5 D',2500,2.5,[55],'ducato')]},
  {index:1,bodyTypes:['dodavka'],facelifts:[f(2002,'Modernizace 244','ducato')],engines:[p('2.0 i.e.',1998,2,[81],'ducato'),d('1.9 D (Fiat)',1929,1.9,[51],'ducato'),d('2.0 JTD',1997,2,[62],'ducato'),d('2.3 JTD',2286,2.3,[81],'ducato'),d('2.8 JTD',2800,2.8,[94],'ducato')]},
  {index:2,bodyTypes:['dodavka'],engines:[d('2.3 Multijet2 (2019)',2287,2.3,[88,103,117,130],'ducatoDe'),e('3.0 Natural Power','petrol-cng',2999,3,[100],'ducatoDe'),ev('E-Ducato (původní elektrická verze)',[90],'ducatoDe')]}
 ]},
 {make:'citroen',line:'berlingo',source:'berlingoDe',generations:[
  {index:0,engines:[p('1.4i',1360,1.4,[55],'berlingo'),p('1.6i 16V',1587,1.6,[80],'berlingo'),p('1.8i',1761,1.8,[66],'berlingo'),d('1.9 D (XUD)',1905,1.9,[52],'berlingo'),d('2.0 HDi',1997,2,[66],'berlingo'),ev('Berlingo Electrique',[28],'berlingo')]},
  {index:1,facelifts:[f(2012,'Modernizace 2012','berlingoDe')],engines:[p('1.6i 16V',1587,1.6,[66,80],'berlingoDe'),p('1.6 VTi',1598,1.6,[72,88],'berlingoDe'),p('1.2 PureTech',1199,1.2,[81],'berlingoDe'),d('1.6 HDi / e-HDi / BlueHDi',1560,1.6,[55,66,68,73,80,82,84,88],'berlingoDe'),ev('Berlingo Electric',[49],'berlingo')]},
  {index:2,engines:[ev('ë-Berlingo',[100],'berlingoDe')]}
 ]},
 {make:'peugeot',line:'206',source:'p206',generations:[{index:0,engines:[p('1.1',1124,1.1,[44],'p206'),p('1.4 8V / 16V',1360,1.4,[55,66],'p206'),p('1.6 8V / 16V',1587,1.6,[66,81],'p206'),d('1.9 D',1868,1.9,[51],'p206'),d('1.4 HDi',1398,1.4,[50],'p206'),d('1.6 HDi',1560,1.6,[80],'p206'),d('2.0 HDi',1997,2,[66],'p206')]}]},
 {make:'peugeot',line:'307',source:'p307',generations:[{index:0,engines:[p('1.4 8V / 16V',1360,1.4,[55,66],'p307'),p('1.6 16V',1587,1.6,[81],'p307'),p('2.0 16V',1997,2,[100,103,130],'p307'),d('1.4 HDi',1398,1.4,[50],'p307'),d('1.6 HDi',1560,1.6,[66,80],'p307'),d('2.0 HDi',1997,2,[66,79,100],'p307')]}]},
 {make:'peugeot',line:'308',source:'p308',generations:[
  {index:0,to:2015,dateNote:'Evropský hatchback skončil v roce 2013; SW a CC této generace pokračovaly déle, CC do března 2015. Mimoevropské pokračování není součástí tohoto evropského intervalu.',source:'p308i',engines:[p('1.4 VTi',1397,1.4,[70,72],'p308i'),p('1.6 VTi',1598,1.6,[88],'p308i'),p('1.6 THP / GTi',1598,1.6,[103,110,115,128,147],'p308i'),d('1.6 HDi',1560,1.6,[66,68,80,82],'p308i'),d('2.0 HDi',1997,2,[100,103,110,120],'p308i')]},
  {index:1,source:'p308ii',engines:[p('1.2 PureTech',1199,1.2,[60,81,96],'p308ii'),p('1.6 THP / PureTech / GTi',1598,1.6,[92,115,151,165,193,200],'p308ii'),d('1.6 HDi / BlueHDi',1560,1.6,[68,73,85,88],'p308ii'),d('1.5 BlueHDi',1499,1.5,[75,96],'p308ii'),d('2.0 BlueHDi',1997,2,[110,130,133],'p308ii')]},
  {index:2,source:'p308iii',engines:[p('1.2 PureTech',1199,1.2,[81,96],'p308iii'),e('1.2 Hybrid 136 / 145','petrol-mhev',1199,1.2,[100,107],'p308iii','system'),e('1.6 Plug-in Hybrid','petrol-phev',1598,1.6,[132,143,165],'p308iii','system'),d('1.5 BlueHDi',1499,1.5,[96],'p308iii'),ev('e-308',[115],'p308iii')]}
 ]},
 {make:'peugeot',line:'2008',source:'p2008i',generations:[
  {index:0,engines:[p('1.2 VTi / PureTech',1199,1.2,[60,61,81,84,96],'p2008i'),p('1.6 VTi',1598,1.6,[88],'p2008i'),d('1.4 HDi',1398,1.4,[50],'p2008i'),d('1.5 BlueHDi',1499,1.5,[75,88],'p2008i'),d('1.6 e-HDi / BlueHDi',1560,1.6,[68,73,84,88],'p2008i')]},
  {index:1,source:'p2008ii',engines:[p('1.2 PureTech',1199,1.2,[74,96,114],'p2008ii'),e('1.2 Hybrid','petrol-mhev',1199,1.2,[81,100,107],'p2008ii','system'),d('1.5 BlueHDi',1499,1.5,[74,75,81,96],'p2008ii'),ev('e-2008',[100,115],'p2008ii')]}
 ]},
 {make:'dacia',line:'sandero',source:'sandero',generations:[
  {index:0,engines:[p('1.2 16V',1149,1.2,[55],'sandero'),p('1.4 8V',1390,1.4,[55],'sandero'),p('1.6 16V',1598,1.6,[77],'sandero'),e('1.4 LPG','petrol-lpg',1390,1.4,[53],'sandero'),d('1.5 dCi',1461,1.5,[55,66],'sandero')]},
  {index:1,facelifts:[f(2016,'Modernizace 2016','sandero')],engines:[p('0.9 TCe',898,0.9,[66],'sandero'),p('1.0 SCe',999,1,[54],'sandero'),p('1.2 16V',1149,1.2,[55],'sandero'),e('1.2 LPG','petrol-lpg',1149,1.2,[53],'sandero'),d('1.5 dCi',1461,1.5,[55,66],'sandero')]},
  {index:2,facelifts:[f(2022,'Nová identita Dacia','sandero'),f(2025,'Modernizace 2025','sandero')],engines:[p('1.0 SCe 65',999,1,[48],'sandero'),p('1.0 TCe 90',999,1,[66],'sandero'),e('1.0 ECO-G 100','petrol-lpg',999,1,[74],'sandero'),e('1.2 ECO-G 120 (benzin / LPG)','petrol-lpg',1199,1.2,[85,88],'sandero')]}
 ]},
 {make:'dacia',line:'duster',source:'duster',generations:[
  {index:0,engines:[p('1.6 16V',1598,1.6,[77],'duster'),p('1.2 TCe',1197,1.2,[92],'duster'),e('1.6 LPG','petrol-lpg',1598,1.6,[75],'duster'),d('1.5 dCi 110',1461,1.5,[79,81],'duster')]},
  {index:1,facelifts:[f(2022,'Nová identita Dacia','duster')],engines:[e('1.0 ECO-G 100','petrol-lpg',999,1,[74],'duster'),d('1.5 dCi / Blue dCi',1461,1.5,[66,70,80,85],'duster')]},
  {index:2,from:2024,source:'dusterProduction',dateNote:'Sériová výroba generace od roku 2024 podle výrobního plánu Dacia. Představení v listopadu 2023 není počátkem sériové výroby.'}
 ]}
];
