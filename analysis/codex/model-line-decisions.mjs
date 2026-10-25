// These choices were made after inspecting the retrieved factual infobox values.
import {batchExclusions,batchDateChoices,batchUnknownDates,batchGenerationFamilies,batchGenerationDateChoices} from './model-line-batch-1.mjs';
import {batch2Exclusions,batch2DateChoices,batch2UnknownDates,batch2GenerationFamilies,batch2GenerationDateChoices,batch2ExactGenerationCodes} from './model-line-batch-2.mjs';
// A shared-platform article never supplies the whole range of a rebadged line by default.
export const dateChoices={
 'skoda/favorit':{combine:true},'skoda/felicia':{combine:true},'skoda/rapid':{ranges:[0],scope:'europe'},
 'skoda/citigo':{ranges:[1]},'skoda/karoq':{ranges:[0]},
 'volkswagen/up':{ranges:[0]},'volkswagen/fox':{ranges:[1],scope:'europe'},
 'volkswagen/scirocco':{combine:true},'volkswagen/cc':{ranges:[0]},'volkswagen/arteon':{ranges:[0,1],combine:true},'volkswagen/touran':{ranges:[0]},
 'hyundai/atos':{ranges:[0]},'hyundai/getz':{ranges:[0]},'hyundai/matrix':{combine:true},'hyundai/terracan':{ranges:[0]},
 'kia/cerato':{ranges:[0],scope:'europe'},'kia/ceed':{box:'Third generation',ranges:[0,1],combine:true,from:2006},
 'toyota/verso':{ranges:[0],scope:'europe'},'toyota/iq':{ranges:[0]},
 'toyota/gt86':{box:'First generation',ranges:[0]},'toyota/gr86':{box:'Second generation',ranges:[1]},
 'ford/mondeo':{ranges:[0],scope:'europe'},'ford/cougar':{ranges:[0]},'ford/bronco':{combine:true},'ford/gt':{combine:true},
 'dacia/lodgy':{ranges:[0]},'dacia/dokker':{ranges:[0]},
 'bmw/rada-6':{combine:true},'bmw/rada-8':{combine:true},
 'renault/laguna':{ranges:[0]},'renault/talisman':{ranges:[0]},'renault/fluence':{ranges:[0],scope:'europe'},'renault/vel-satis':{combine:true},'renault/kadjar':{ranges:[0]},
 'peugeot/206':{ranges:[0,1],combine:true},'peugeot/307':{ranges:[0]},'peugeot/309':{ranges:[0]},'peugeot/405':{ranges:[0],scope:'europe'},'peugeot/406':{ranges:[0,2],combine:true},'peugeot/607':{combine:true},'peugeot/508':{ranges:[0]},
 'citroen/c3-aircross':{ranges:[1],scope:'europe'},'citroen/c4-cactus':{ranges:[0]},'citroen/c5':{ranges:[0],scope:'europe'},'citroen/c5-x':{ranges:[2],scope:'europe'},'citroen/c6':{ranges:[0,1],combine:true},'citroen/xantia':{ranges:[0]},'citroen/zx':{ranges:[0]},'citroen/xsara-picasso':{ranges:[0,2],combine:true},
 'opel/corsa':{ranges:[0],scope:'europe'},'opel/tigra':{combine:true},'opel/kadett':{ranges:[1]},
 'fiat/500':{ranges:[0]},'fiat/tempra':{ranges:[0]},'fiat/croma':{combine:true},'fiat/bravo':{ranges:[0]},'fiat/marea':{ranges:[0]},'fiat/stilo':{ranges:[0]},'fiat/idea':{ranges:[0]},'fiat/multipla':{ranges:[0]},'fiat/sedici':{ranges:[0]},
 'seat/toledo':{combine:true},'seat/mii':{ranges:[2]},'seat/marbella':{ranges:[1]},
 'mini/coupe':{ranges:[0]},'mini/roadster':{ranges:[1]},
 'volvo/740':{box:'Volvo 740'},'volvo/760':{box:'Volvo 760'},'volvo/780':{box:'Volvo 780'},'volvo/940':{box:'Volvo 940'},'volvo/960':{box:'Volvo 960'},
 'volvo/s60':{ranges:[0]},'volvo/s90':{ranges:[1]},'volvo/xc40':{ranges:[0]},'volvo/ec40':{ranges:[1]}
};
// These aliases are valid model identities but the shared article does not establish
// a badge-specific production interval. Do not inherit a parent's chronology.
export const forceUnknownDates=new Set([
 'volkswagen/multivan','volkswagen/tayron','volkswagen/taigo',
 'hyundai/inster','kia/xceed','toyota/aygo','toyota/verso-s','toyota/urban-cruiser',
 'toyota/proace','toyota/proace-city','toyota/proace-max','toyota/picnic',
 'bmw/rada-2-gran-tourer','bmw/i5','bmw/i7','bmw/ix1','bmw/ix2',
 'audi/90','audi/200','audi/cabriolet','mercedes-benz/clc','mercedes-benz/trida-v','mercedes-benz/trida-t',
 'peugeot/partner','peugeot/rifter','peugeot/bipper','peugeot/expert','peugeot/traveller','peugeot/boxer',
 'citroen/c4-x','citroen/nemo','citroen/spacetourer','citroen/jumper','citroen/c25','citroen/ds3','citroen/ds4','citroen/ds5',
 'opel/zafira-life','opel/movano','opel/monterey','opel/ampera','opel/ampera-e',
 'fiat/qubo','fiat/scudo','fiat/freemont','fiat/topolino','seat/terra','cupra/leon','cupra/ateca',
 'volvo/xc70'
]);
forceUnknownDates.add('volvo/v40');
for(const key of ['dacia/1300','bmw/ix3','volvo/s90','volvo/v90'])forceUnknownDates.add(key);
forceUnknownDates.add('renault/twingo');
dateChoices['skoda/enyaq']={combine:true};
dateChoices['toyota/supra']={combine:true};
export const generationDateChoices={
 'skoda/octavia':{'1U':{ranges:[0]},'1Z':{},'5E':{ranges:[0]},NX:{ranges:[0]}},
 'skoda/fabia':{'6Y':{ranges:[0,1,2],combine:true}},
 'skoda/superb':{'3V':{ranges:[0]}},
 'skoda/kodiaq':{'first':{ranges:[0]}},
 'volkswagen/tiguan':{'5N':{ranges:[0]},'AD/BW':{ranges:[0]}},
 'volkswagen/passat':{B8:{ranges:[0,1],combine:true}},
 'hyundai/i30':{GD:{ranges:[0]}},
 'hyundai/tucson':{JM:{ranges:[0]},LM:{ranges:[0]},TL:{ranges:[0]},NX4:{ranges:[0]}},
 'kia/ceed':{CD:{ranges:[0,1],combine:true}},
 'kia/sportage':{SL:{ranges:[0]},QL:{ranges:[0]}},
 'toyota/rav4':{XA10:{ranges:[0]},XA30:{ranges:[0]},XA40:{ranges:[0]},XA50:{ranges:[0]}},
 'toyota/yaris':{'XP10/XP20':{ranges:[1]},XP90:{ranges:[1]},XP130:{ranges:[1]}},
 'ford/kuga':{C520:{ranges:[0]},C482:{ranges:[1]}}
};
// Scope-reviewed generation families. Others deliberately retain generations=null.
export const generationFamilies=new Set([
 'skoda/fabia','skoda/octavia','skoda/superb','skoda/kodiaq','skoda/karoq','skoda/enyaq','skoda/yeti','skoda/roomster',
 'volkswagen/polo','volkswagen/golf','volkswagen/passat','volkswagen/tiguan','volkswagen/touran','volkswagen/sharan',
 'hyundai/i10','hyundai/i20','hyundai/i30','hyundai/tucson','hyundai/santa-fe',
 'kia/ceed','kia/sportage','kia/sorento','kia/picanto','kia/niro',
 'toyota/corolla','toyota/yaris','toyota/rav4','toyota/avensis','toyota/auris',
 'ford/focus','ford/kuga','ford/fiesta','ford/mondeo','ford/c-max','ford/s-max','ford/galaxy',
 'dacia/sandero','dacia/duster','dacia/logan',
 'bmw/rada-3','renault/clio','renault/megane','renault/captur','renault/scenic','renault/espace',
 'audi/a1','audi/a2','audi/a3','audi/a4','audi/a5','audi/a6','audi/a8','audi/tt','audi/q3','audi/q5','audi/q7',
 'mercedes-benz/trida-a','mercedes-benz/trida-b','mercedes-benz/trida-c','mercedes-benz/cla','mercedes-benz/clk','mercedes-benz/cls','mercedes-benz/slk','mercedes-benz/gla','mercedes-benz/glb',
 'peugeot/208','peugeot/308','peugeot/2008','peugeot/3008','peugeot/5008',
 'citroen/c1','citroen/c3','citroen/c4-picasso','citroen/c5',
 'opel/corsa','opel/astra','opel/meriva','opel/zafira','opel/mokka',
 'fiat/panda','fiat/punto',
 'seat/ibiza','seat/leon','seat/toledo','seat/alhambra',
 'mini/cooper','mini/countryman','volvo/s40','volvo/s60','volvo/v60','volvo/v70','volvo/s80','volvo/c70','volvo/xc60','volvo/xc90'
]);
export const exactGenerationCodes={'volkswagen/id4':'E21','skoda/karoq':'NU7'};
export const combinedNames=new Set(['volkswagen/beetle','ford/puma','renault/4','renault/5','renault/scenic','fiat/500','fiat/tipo','fiat/bravo','fiat/punto','bmw/z4','toyota/urban-cruiser','volvo/v40']);
export const badgeSpecificSources={
 'peugeot/806':{box:'First generation'},'peugeot/807':{box:'Second generation',ranges:[0]},
 'citroen/evasion':{box:'First generation'},'citroen/c8':{box:'Second generation',ranges:[0]}
};
export const manualExclusions={
 skoda:[['Octavia RS / Scout','trim or performance/body derivative; merged into Octavia'],['Octavia (1959)','pre-1990 historical line, distinct from modern Octavia'],['Vision concepts','concept vehicles']],
 volkswagen:[['Golf GTI / R / GTE / Alltrack','performance, drivetrain or equipment derivatives; merged into Golf'],['Tiguan Allspace','long-wheelbase derivative; merged into Tiguan'],['Lavida / Lamando / Sagitar / Phideon / ID.6','regional-market lines outside the selected Europe-focused inventory'],['Gol / Saveiro / Virtus / Tera','regional-market lines outside this pass'],['Tayron I','Chinese-market first generation; European range/date boundary remains in needsReview']],
 hyundai:[['i30 N / N Line','performance/equipment derivatives; merged into i30'],['Tucson ix35','European renamed generation; merged into Tucson'],['Creta / Alcazar / Venue / Mufasa / Custo','regional-market lines outside the reviewed European selection'],['Genesis sedan / Genesis Coupe','historical Hyundai/Genesis badge assignment deferred; not silently merged with the Genesis make']],
 kia:[['GT / GT-Line','performance/equipment derivatives'],['ProCeed','Ceed hatchback/shooting-brake derivative; merged into Ceed with alias'],['K3 / K5 / K7 / K8 / K9 / Telluride / Sonet / Seltos','regional model/badge ranges not admitted without European variant review']],
 toyota:[['GR Yaris / GR Corolla','performance derivatives; Yaris retained; regional GR Corolla not admitted'],['RAV4 EV','regional powertrain derivative'],['Yaris Cross AC200','regional design distinct from European XP210'],['Urban Cruiser (2020/2023) / Taisor','India/other regional badge usages; not merged into the European XP110/BEV selection'],['Corolla Axio / Fielder / Altis / Levin','regional names/variants; not separate European lines']],
 ford:[['ST / RS / Vignale','performance/equipment derivatives'],['Orion / Ka+','name/body derivatives retained as Escort/Ka aliases'],['F-150 / Taurus / Crown Victoria','grey-import/regional ranges outside this Europe-focused pass'],['Explorer regional generations','no unreviewed global generation is asserted European; chronology needsReview']],
 dacia:[['Stepway','equipment/crossover-look derivative; merged into Sandero'],['1100','production ended before the target window'],['500 Lăstun','rare historical microcar outside the ordinary-market selection; scope omission acknowledged']],
 bmw:[['M2 / M3 / M4 / M5 / M6 / M8 / Competition / CS','performance derivatives of numbered lines; XM is a separately marketed model'],['3 GT / 5 GT','body derivatives under corresponding numbered line; 6 GT retained as independently named successor'],['i3 NA0 / G28','new/reused or regional i3 identities are not conflated with the I01 city hatchback'],['future G50 3 Series','future generation, not a production generation in this pass']],
 tesla:[['Cybertruck','not admitted to the Europe-focused ordinary-market range'],['Roadster (second generation)','announced/future vehicle; no verified production interval'],['Highland / Juniper / Plaid / Performance','facelifts or performance derivatives, not invented generations']],
 renault:[['RS / Gordini / GT','performance/equipment derivatives'],['Grand Scénic / Grand Modus / Grand Espace','length/body derivatives merged into base families'],['Kwid / Kiger / Triber / Duster Renault regional badge','regional model/badge ranges outside this pass'],['18','European production ended before 1990; kept only if later source scope explicitly warrants it']],
 audi:[['S / RS variants','performance derivatives merged into numbered/Q lines'],['allroad / Sportback','body/drive derivatives, not separate lines'],['A4L / A6L / Q5L / Q6 China','regional long-wheelbase or unrelated Chinese-market products'],['AUDI E5','separate Chinese AUDI brand; not silently merged with Audi']],
 'mercedes-benz':[['AMG engine variants / Maybach trims','performance/luxury derivatives; AMG GT standalone retained'],['GLK / ML / GL / SLC','renamed families retained as GLC/GLE/GLS/SLK aliases'],['EQV / eVito','powertrain derivatives of V-Class/Vito'],['Vision concepts / Project One','concept or exceptional limited-production hypercar outside ordinary-market selection']],
 peugeot:[['GT / GTi / SW / CC derivatives','equipment, performance or body variants merged into families'],['206+','facelift derivative'],['408 Chinese saloon','not the European crossover selected here'],['Landtrek / Pick Up','regional-market pickups outside this pass']],
 citroen:[['Grand C4 Picasso / Grand SpaceTourer','length variants merged into C4 Picasso / SpaceTourer'],['Fukang / Chinese C-Elysée ZX / C6 China','regional variants not conflated with the European cars'],['DS3/DS4/DS5 badge migration','lines retained but dates/QIDs require historic Citroën versus DS verification']],
 opel:[['OPC / GSi / Line trims','performance/equipment variants'],['Vauxhall names','separate make identities, not additional Opel lines'],['Frontera regional generations','new European crossover and older 4x4 require separate source windows; not blindly treated as one generation']],
 fiat:[['Abarth 500 / 595 / 695 / 124','separate Abarth badge; not ordinary Fiat trims'],['Punto Evo / Grande Punto','renamed/facelift family under Punto'],['Egea','regional Tipo name'],['Toro / Cronos / Argo / Pulse / Fastback / Mobi','regional-market lines outside this pass']],
 seat:[['Cupra performance trims before marque separation','merged into base SEAT family; independent Cupra make handled separately'],['Ronda / Fura','production ended before the target period'],['Altea XL / Freetrack','length/equipment derivatives under Altea']],
 cupra:[['GT / VZ / VZ5','powertrain/equipment variants'],['Raval / DarkRebel / UrbanRebel / Tindaya','not admitted without verified production-market evidence; concepts/future programmes remain outside this pass']],
 mini:[['John Cooper Works / Cooper S / SE / One','equipment/performance/powertrain derivatives'],['Convertible','body derivative merged into Cooper'],['Vision concepts','concepts']],
 volvo:[['Cross Country variants of V40/V60/V90','body/equipment derivatives; XC70 historic name retained'],['EX40','electric XC40 rename retained as alias'],['XC70 (2025) / EM90 / S80L / S90L','regional-only or regional long-wheelbase variants not admitted to this Europe-focused pass'],['Polestar 1/2/3/4','separate make'],['EX60','not admitted without a separately checked current production source in this pass']]
};

Object.assign(manualExclusions,batchExclusions);
Object.assign(dateChoices,batchDateChoices);
for(const key of batchUnknownDates)forceUnknownDates.add(key);
for(const key of batchGenerationFamilies)generationFamilies.add(key);
Object.assign(generationDateChoices,batchGenerationDateChoices);
Object.assign(manualExclusions,batch2Exclusions);
Object.assign(dateChoices,batch2DateChoices);
for(const key of batch2UnknownDates)forceUnknownDates.add(key);
for(const key of batch2GenerationFamilies)generationFamilies.add(key);
Object.assign(generationDateChoices,batch2GenerationDateChoices);
Object.assign(exactGenerationCodes,batch2ExactGenerationCodes);

import {batch3Exclusions,batch3DateChoices,batch3UnknownDates,batch3GenerationFamilies,batch3GenerationDateChoices,batch3ExactGenerationCodes} from './model-line-batch-3.mjs';
Object.assign(manualExclusions,batch3Exclusions);
Object.assign(dateChoices,batch3DateChoices);
for(const key of batch3UnknownDates)forceUnknownDates.add(key);
for(const key of batch3GenerationFamilies)generationFamilies.add(key);
Object.assign(generationDateChoices,batch3GenerationDateChoices);
Object.assign(exactGenerationCodes,batch3ExactGenerationCodes);
combinedNames.add('jaguar/xf');

import {batch4Exclusions,batch4DateChoices,batch4UnknownDates,batch4GenerationFamilies,batch4GenerationDateChoices,batch4ExactGenerationCodes} from './model-line-batch-4.mjs';
Object.assign(manualExclusions,batch4Exclusions);
Object.assign(dateChoices,batch4DateChoices);
for(const key of batch4UnknownDates)forceUnknownDates.add(key);
for(const key of batch4GenerationFamilies)generationFamilies.add(key);
Object.assign(generationDateChoices,batch4GenerationDateChoices);
Object.assign(exactGenerationCodes,batch4ExactGenerationCodes);
