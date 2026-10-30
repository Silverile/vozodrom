import fs from 'node:fs';
import {version,saveCards} from './night-card-helpers.mjs';
const cs=JSON.parse(fs.readFileSync('src/data/catalog/model-cards/morris.json','utf8'));
const museum=id=>'https://www.britishmotormuseum.co.uk/online-collections/details-page?row_id='+id;
function row(slug,index,name,year,id,cc,cyl,speed,body,dims,printed){const c=cs.find(c=>c.lineSlug===slug),g=c.generations[index],source=museum(id);g.trims??=[];g.trims=g.trims.filter(t=>t.name!==name);g.trims.push(version(name,[source],{bodyType:body,engine:{fuel:'petrol',displacementCc:cc,cylinders:cyl,powerKw:null,powerStandard:null,torqueNm:null},topSpeedKmh:speed,...(dims?{dimensionsMm:{length:dims[0],width:dims[1],height:dims[2],wheelbase:null}}:{}),specificationScope:{market:'GB – muzejní exemplář',modelYear:year,noteCs:`Údaje katalogu British Motor Museum pro konkrétní vystavený vůz z roku ${year}, nikoli všechny karoserie a ročníky. ${printed} Dobový výkon v bhp se nepřepočítává na kW. Převodovka, hmotnost, zrychlení a měřicí cyklus nejsou touto položkou doloženy. U rychlosti byl převzat přímo zveřejněný metrický údaj.`}}));g.sources=[...new Set([...g.sources,source])];c.sources=[...new Set([...c.sources,source])];}
row('oxford',0,'Tourer 1913 – muzejní exemplář',1913,'76417800294',1018,4,72,'kabriolet',[3230,1189,1249],'Katalog tiskne 16 bhp.');
row('cowley',1,'Saloon 1931 – muzejní exemplář',1931,'76417800299',null,4,88,'sedan',null,'Katalog tiskne 1550 cm³ a 12 bhp; přesný objem a povaha označení výkonu nebyly potvrzeny.');
row('eight',0,'Series I Saloon 1936 – muzejní exemplář',1936,'76417800300',918,4,93,'sedan',null,'Katalog tiskne 23 bhp. Podezřelá katalogová délka nebyla převzata bez další kontroly.');
row('minor',1,'MM Saloon 1948 – první výrobní exemplář',1948,'76417800303',918,4,100,'sedan',[3779,1554,1524],'Katalog tiskne 27 bhp.');
row('oxford',2,'MO Saloon 1952 – muzejní exemplář',1952,'76417800304',1476,4,116,'sedan',null,'Katalog tiskne 41 bhp; rozměry jsou ponechány k nezávislé kontrole.');
row('minor',3,'1000 Tourer 1960 – muzejní exemplář',1960,'76417800306',948,4,117,'kabriolet',[3779,1554,1524],'Katalog tiskne 37 bhp.');
row('minor',3,'1000 Traveller 1969 – muzejní exemplář',1969,'76417800309',1098,4,117,'kombi',[3759,1520,1511],'Katalog tiskne 48 bhp. Rozměry Travelleru nejsou přeneseny na sedan.');
row('marina',0,'1.3 Deluxe Saloon 1971 – muzejní exemplář',1971,'76417800311',1275,4,132,'sedan',[4235,1626,1426],'Katalog tiskne 57 bhp.');
row('ital',0,'Estate 1983 – poslední muzejní exemplář',1983,'76417800314',null,4,158,'kombi',[4290,1638,1419],'Katalog tiskne 77 bhp a 1695 cm³; přesný objem proti údajům aplikačních katalogů nebyl sjednocen.');
const ital=cs.find(c=>c.lineSlug==='ital');ital.generations[0].to=null;ital.generations[0].productionStatus='ended';
ital.generations[0].marketNotesCs='Muzeum uvádí poslední vůz a konec v roce 1983, Morris Register uvádí 1984; konec celé rodiny je do vyjasnění null. Nejde o pokračující výrobu.';
cs.find(c=>c.lineSlug==='oxford').generations[4].from=null;
saveCards('morris',cs);console.log('9 museum-exhibit scoped technical rows; no bhp conversion.');
