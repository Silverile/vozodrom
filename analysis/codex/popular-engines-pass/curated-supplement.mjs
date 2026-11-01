import fs from 'node:fs';const root='analysis/codex/popular-engines-pass',index=JSON.parse(fs.readFileSync('src/data/model-cards-index.json','utf8')),rows=[];
function add(id,i,url,variants,note=''){const[m,l]=id.split('/'),g=index[m][l].generations[i];for(const[v,fuel,cc,size,kw]of variants)rows.push({id,index:i,engine:{variant:v,fuel,displacementCc:cc,displacementLitresNominal:size,powerKwMin:kw,powerKwMax:kw,availablePowerKw:kw===null?[]:[kw],powerRangeCoverage:'documented-versions-only',sources:[url],sourceScope:{tableSection:'Manually checked own-model production engine specification',originalVariant:v,noteCs:note||'Vlastní doložené provedení; přesný neověřený objem zůstává prázdný. Bez převodu koní na kW.',generationEvidence:{method:'generation-heading',anchor:g.code??g.name,fromYear:g.from,toYear:g.to,generationIndex:i,rowFromYear:null,rowToYear:null}}}});}
add('lada/2101',0,'https://de.wikipedia.org/wiki/WAS-2101',[
 ['1.2 (2101, DIN)','petrol',1198,1.2,44],['1.3 (21011, DIN)','petrol',1294,1.3,48]],'Pouze sloupec DIN 70020. Hodnoty GOST a SAE nejsou smíchány s DIN ani přepočteny.');
add('mercedes-benz/trida-b',0,'https://de.wikipedia.org/wiki/Mercedes-Benz_T_245',[
 ['B 150','petrol',1498,1.5,70],['B 160','petrol',1498,1.5,70],['B 170','petrol',1699,1.7,85],['B 180','petrol',1699,1.7,85],['B 200','petrol',2034,2,100],['B 200 Turbo','petrol',2034,2,142],['B 170 NGT','petrol-cng',2034,2,85],['B 180 CDI','diesel',1991,2,80],['B 200 CDI','diesel',1991,2,103]]);
add('mercedes-benz/190',0,'https://de.wikipedia.org/wiki/Mercedes-Benz_W_201',[
 ['190 E 1.8','petrol',1797,1.8,80],['190 E 2.0','petrol',1996,2,90],['190 E 2.3','petrol',2298,2.3,100],['190 D','diesel',1997,2,53],['190 D','diesel',1997,2,55],['190 D 2.5','diesel',2497,2.5,66],['190 D 2.5','diesel',2497,2.5,69],['190 D 2.5 Turbo','diesel',2497,2.5,93]]);
add('mini/cooper',4,'https://www.press.bmwgroup.com/global/article/detail/T0439416EN/the-new-mini-cooper-with-petrol-engine%3A-the-new-mini-cooper-c-and-the-new-mini-cooper-s',[
 ['Cooper C','petrol',null,null,115],['Cooper S','petrol',null,null,150]],'Vlastní nové třídveřové spalovací C/S, nikoli elektrický J01. Objem není doplněn z jiné generace.');
add('mini/countryman',0,'https://www.press.bmwgroup.com/france/article/attachment/T0078158FR/115973',[
 ['One Countryman','petrol',null,null,72],['Cooper Countryman','petrol',null,null,90],['Cooper S Countryman','petrol',null,1.6,135],['One D Countryman','diesel',null,null,66],['Cooper D Countryman','diesel',null,null,82]]);
add('mini/countryman',1,'https://www.press.bmwgroup.com/slovenia/article/attachment/T0265289SL/371012',[
 ['Cooper Countryman','petrol',1499,1.5,100],['Cooper S Countryman','petrol',1998,2,141],['Cooper D Countryman','diesel',1995,2,110],['Cooper SD Countryman','diesel',1995,2,140],['Cooper S E Countryman ALL4','petrol-phev',1499,1.5,165]],'PHEV: výslovně uvedená systémová hodnota 165 kW, nikoli dopočtený součet komponent.');
add('honda/jazz',1,'https://www.honda.hu/content/dam/local/hungary/brochures/cars/jazz_modellkatalogus.pdf',[
 ['1.2 i-VTEC','petrol',1198,1.2,66],['1.4 i-VTEC','petrol',1339,1.4,73]],'Samostatné benzínové sloupce 1.2/1.4 v továrním katalogu; údaje IMA nejsou přeneseny na běžné verze.');
add('volkswagen/golf-sportsvan-line-models-auto-slug-golf-sportsvan-has-no-line-or-card',0,'https://www.volkswagen-newsroom.com/de/pressemitteilungen/der-golf-sportsvan-das-update-599',[
 ['1.0 TSI','petrol',null,1,63],['1.0 TSI','petrol',null,1,81],['1.5 TSI ACT','petrol',null,1.5,96],['1.5 TSI ACT','petrol',null,1.5,110]]);
add('dacia/1300',0,'https://de.wikipedia.org/wiki/Dacia_1300',[['1.3','petrol',1289,1.3,39.7]]);
add('moskvic/408',0,'https://de.wikipedia.org/wiki/Moskwitsch-408',[['1.36 benzin','petrol',null,1.36,37]]);
add('moskvic/2140',0,'https://de.wikipedia.org/wiki/Moskwitsch-2140',[['1.5 benzin','petrol',1478,1.5,55]]);
add('moskvic/412',0,'https://de.wikipedia.org/wiki/Moskwitsch-412',[['1.5 benzin','petrol',null,1.5,55]]);
add('moskvic/2138',0,'https://de.wikipedia.org/wiki/Moskwitsch-2138',[['1.36 benzin','petrol',null,1.36,37]]);
add('audi/80',2,'https://de.wikipedia.org/wiki/Audi_80_B3',[['2.0 E','petrol',1984,2,83],['1.8 benzin','petrol',null,1.8,null]],'Vlastní evropský 2.0 E/3A: 1984 cm³ a výslovných 83 kW v textu. U 1.8 nejsou čísla v PS převedena na kW.');
add('audi/100',0,'https://de.wikipedia.org/wiki/Audi_100_C1',[['1.8','petrol',1760,1.8,63],['1.8 LS','petrol',1760,1.8,74]],'Vlastní evropské čtyřdveřové modely, nikoli americké SAE verze ani jihoafrická místní výroba.');
add('audi/100',1,'https://de.wikipedia.org/wiki/Audi_100_C2',[
 ['1.6','petrol',1588,1.6,63],['2.0 S','petrol',1984,2,85],['1.9 (5)','petrol',1921,1.9,74],['2.1 (5S)','petrol',2144,2.1,85],['2.1 (5E)','petrol',2144,2.1,100],['2.0 (5D)','diesel',1986,2,51]],'Vlastní sériové evropské motory C2. Americký 2.0 Turbo-Diesel 64 kW, Wankel prototyp a motory samostatné Audi 200 nejsou přeneseny.');
add('audi/100',2,'https://de.wikipedia.org/wiki/Audi_100_C3',[
 ['2.3 (EG)','petrol',2309,2.3,98],['2.5 TDI','diesel',null,2.5,88]],'2.3: zvolen výkon 98 kW podle EG 80/1269, nikoli alternativní měření DIN 100 kW. 2.5 TDI: vlastní sériový evropský model od 1990, nikoli jen rekordní vůz.');
add('mercedes-benz/trida-r',0,'https://de.wikipedia.org/wiki/Mercedes-Benz_Baureihe_251',[
 ['3.5 V6 (M272)','petrol',3498,3.5,200],['5.0 V8 (M113)','petrol',4966,5,225],['5.5 V8 (M273)','petrol',5461,5.5,285],['6.2 V8 AMG','petrol',6208,6.2,375],['3.0 diesel','diesel',2987,3,140],['3.0 diesel','diesel',2987,3,155],['3.0 diesel','diesel',2987,3,165],['3.0 diesel','diesel',2987,3,195]],'Vybrané doložené evropské objemové/motorové varianty; pouze kW z tabulky, nikoli novější čínské 3.0 benzínové verze.');
add('mazda/323',1,'https://de.wikipedia.org/wiki/Mazda_323',[
 ['1000','petrol',985,1,33],['1300','petrol',1272,1.3,44],['1400 SP','petrol',1416,1.4,51.5]],'Pouze vlastní tabulka první 323 FA (1977–1980). Čísla kW jsou převzata z tabulky, nikoli zaokrouhlený souhrn v boxu.');
add('mazda/323',4,'https://de.wikipedia.org/wiki/Mazda_323',[['1.7 diesel','diesel',null,1.7,41]],'Vlastní diesel v generačním boxu BG (1989–1994), nikoli novější BA.');
add('mazda/323',5,'https://de.wikipedia.org/wiki/Mazda_323',[['1.7 diesel','diesel',null,1.7,60]],'Vlastní diesel v generačním boxu BA (1994–2000), nikoli starší BG. Přesné provedení a objem v cm³ zůstávají neověřené.');
add('fiat/600',0,'https://www.stellantisheritage.com/de-de/heritage/geschichten/fiat-600',[
 ['600 (633 cm³)','petrol',633,0.6,null],['600 D (767 cm³)','petrol',767,0.8,null]],'Vlastní klasický Fiat 600 a 600 D. Tovární historie uvádí výkon v PS; přepočet na kW není proveden. Multipla ani pozdější licenční varianty nejsou zdrojem těchto objemů.');
add('iveco/daily',2,'https://www.iveco.com/en-us/collections/pdfcollections/Documents/New%20Daily%202014/NewDaily_ENG.pdf',[
 ['2.3 diesel','diesel',null,2.3,null],['3.0 diesel','diesel',null,3,null]],'Vlastní třetí konstrukční rodina Daily 2014: doložené objemové rodiny. Tiskový materiál uvádí výkonové verze v HP; bez přepočtu na kW a bez domýšlení přesného cm³.');
const held=JSON.parse(fs.readFileSync(root+'/engine-changes.json','utf8')).held.find(r=>r.id==='kia/rio');
if(held){const r=structuredClone(held);delete r.reason;r.engine.variant='1.2 benzin';r.engine.sourceScope.trimIdentityEvidence={source:'https://preprod2-press.kia.com/es/es/home/notas-de-prensa/press-releases/2016/nuevo-kia-rio-2015.html',fact:'CONCEPT is a production trim level, explicitly distinguished from BASIC, DRIVE and EMOTION.'};r.engine.sourceScope.noteCs='Concept je doložený stupeň výbavy sériového Ria. Název motoru používá jen doložený objem a palivo; bez chybně přepsaného HPVT.';rows.push(r);}
fs.writeFileSync(root+'/supplement-engines.json',JSON.stringify(rows,null,2)+'\n');console.log({rows:rows.length,generations:new Set(rows.map(r=>r.id+'/'+r.index)).size});
