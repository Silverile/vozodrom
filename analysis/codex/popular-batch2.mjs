// Run from repo root; then regenerate only the makes listed in the review report.
// Dates are document dates. Access dates never become offer dates.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const reportPath='analysis/codex/popular-batch2-review.json';
const targets=[['volkswagen','golf'],['volkswagen','passat'],['ford','focus'],['hyundai','i30'],['volkswagen','transporter'],['renault','megane'],['skoda','rapid'],['skoda','karoq'],['volkswagen','touran'],['ford','transit'],['hyundai','tucson'],['volkswagen','caddy'],['ford','mondeo'],['kia','ceed'],['skoda','scala']];
const ref=fs.existsSync(reportPath)?read(reportPath).baselineCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const head=p=>execFileSync('git',['show',`${ref}:${p}`],{encoding:'utf8',maxBuffer:64*1024*1024});
const hash=x=>createHash('sha256').update(typeof x==='string'?x:JSON.stringify(x)).digest('hex');
export function blocks(raw){let q=false,esc=false,depth=0,start;const out=[];for(let i=0;i<raw.length;i++){const c=raw[i];if(q){if(esc)esc=false;else if(c==='\\')esc=true;else if(c==='"')q=false;continue;}if(c==='"'){q=true;continue;}if(c==='{'){if(depth++===0)start=i;}else if(c==='}'&&--depth===0){const text=raw.slice(start,i+1);out.push({start,end:i+1,text,value:JSON.parse(text)});}}return out;}
const files=new Map(),locations=new Map();
for(const dir of ['src/data/catalog/model-cards','src/data/model-cards'])for(const [make,slug] of targets){
 const path=`${dir}/${make}.json`;if(!fs.existsSync(path))continue;
 if(!files.has(path))files.set(path,{raw:fs.readFileSync(path,'utf8'),cards:read(path),before:JSON.parse(head(path))});
 if(files.get(path).cards.some(c=>c.lineSlug===slug))locations.set(`${make}/${slug}`,path);
}
assert.equal(locations.size,targets.length);
const baselineIndex=JSON.parse(head('src/data/model-cards-index.json'));
const oldReport=fs.existsSync(reportPath)?read(reportPath):null;
for(const [key,path] of locations){const f=files.get(path),slug=key.split('/')[1],i=f.cards.findIndex(c=>c.lineSlug===slug);
 if(oldReport)assert.equal(hash(f.cards[i]),oldReport.resultHashes[key],`Intervening edit in ${key}; review before replay`);
 f.cards[i]=structuredClone(f.before.find(c=>c.lineSlug===slug));
}
const card=key=>files.get(locations.get(key)).cards.find(c=>c.lineSlug===key.split('/')[1]);
const gen=(key,i)=>card(key).generations[i];
const S={
 golf:'https://www.volkswagen.cz/dam/files/download/64c249f4ff83dc4e581c438c3161b9bd3d8083c5/3d1e4024e0664399cada370402bf89eb/7cdb4efa-82ef-4f70-8309-83e4da6c0343/20250605_Golf-HB_kompletni-cenik',
 passat:'https://www.volkswagen.cz/dam/files/download/591f15e05651f873f914a9b9b20730aae18ef6a9/bbecdf8495bffb8cf57bf9a17ef84f47/eb4b5250-8aeb-4252-8953-42013dd5cced/Cenik_Passat_R-Line_People_2026_01',
 focus:'https://www.ford.cz/content/dam/guxeu/cz/cs_cz/documents/pricelists/cars/Cenik_Ford_Focus.pdf',
 i30:'https://sub.hyundai.cz/files/download/model/i30-2017/cenik-i30-fl2-hatchback.pdf',
 i30Launch:'https://news.cision.com/hyundai-motor-company/r/new-generation-i30-to-make-world-debut-at-2011-frankfurt-international-motor-show,c9161022',
 transporter:'https://www.vw-uzitkove.cz/dam/files/34eab9236480731ca3ee286e4e0c3104cdc567b5/7856223fb9063935b26081c2464e709c/685adcc7-06d4-456f-8464-d31fc7833d6d/20250513-New_Transporter_kombi',
 meganeFL:'https://media.renault.com/new-renault-megane-a-complete-range-and-the-hybrid-available-for-sale-in-france/',
 meganeCZ:'https://cdn.group.renault.com/ren/cz/pdf/brochures/megane-rs-brochure.pdf.asset.pdf/0b3b8985b2.pdf',
 meganeSK:'https://cdn.group.renault.com/ren/sk/pdf/pricelists/megane-grandtour-price.pdf.asset.pdf/51fb8c1877.pdf',
 meganeIHistory:'https://presse.renault.de/vielfalt-ab-werk-1/?lang=deu',
 meganeII:'https://presse.renault.de/charaktertyp-mit-neuem-gesicht/?lang=deu',
 meganeIII:'https://media.renault.at/3/article/782',
 rapid:'https://cdn.skoda-storyboard.com/2016/05/RAPID-en.pdf',
 rapidFL:'https://www.skoda-storyboard.com/en/press-releases/skoda-rapid-skoda-rapid-spaceback-optimized-interior-exterior/',
 karoq:'https://cdn.skoda-storyboard.com/2022/03/TD-KAROQ-petrol-en.pdf',
 karoqDiesel:'https://cdn.skoda-storyboard.com/2022/03/TD-KAROQ-diesel-en.pdf',
 driveCZ:'https://www.skoda-auto.cz/novinky/novinky-detail/2024-04-02-skoda-auto-oslavuje-hokejove-mistrovstvi-sveta-v-cesku-akcnimi-modely-drive',
 touran:'https://www.volkswagen.cz/dam/files/download/cdfe2aa01f1aea10b0322a5001b7d5ea83f05e78/11de2f59b9e6bfda265e9560e240c5aa/cf40f793-03f1-4364-8578-d95d027e87c9/20250609_Touran_kompletni-cenik',
 transit:'https://www.ford.cz/content/dam/guxeu/cz/cs_cz/documents/pricelists/cvs/Cenik_Ford_Transit_Van_DCiV.pdf',
 transitUpdate:'https://www.mynewsdesk.com/cz/ford-czech-republic/pressreleases/ford-pro-predstavuje-nove-digitalni-funkce-a-vylepsene-technologie-ktere-prijdou-do-fordu-transit-v-roce-2024-3281816',
 tucson:'https://autoczech.hyundai.cz/files/download/model/tucson-hybrid-2021/cenik-tucson-fl-mr25.pdf',
 caddy:'https://www.vw-uzitkove.cz/dam/files/d53702c1b08b2677e2e978f896382dab044aa52b/2c7a689b9863300acc92a9a46bce5486/c454a118-a434-48ba-950e-0c35c0540279/20250908-Caddy_FINAL',
 mondeo:'https://www.ford.cz/content/dam/guxeu/cz/cs_cz/documents/pricelists/cars/PL-ford_New_Mondeo_2020.pdf',
 mondeoFL:'https://www.fordmedia.cz/pressreleases/vylepseny-ford-mondeo-prichazi-na-cesky-trh-i-s-unikatni-novou-variantou-mondeo-hybrid-kombi-2832340',
 ceed:'https://www.auto-horejsek.cz/images/modely-kia/ceed-2021/kia-ceed-cenik.pdf',
 ceedHistory:'https://www.kia-express.cz/tiskove-zpravy/13-let-s-rodinou-kia-ceed/',
 scala:'https://cdn.skoda-storyboard.com/2024/01/TD-Scala-en_8e7b3fcc.pdf',
 scalaCZ:'https://www.skoda-auto.cz/novinky/novinky-detail/2024-01-29-skoda-auto-zahajila-vyrobu-modernizovanych-modelu-scala-a-kamiq',
};
const evidence=(date,stage,source,markets=['CZ'])=>({...date?{date}:{},observedAt:'2026-10-31',stage,markets,sources:[source]});
const changes=[],rangeReview=[];
function equipment(key,gi,names,date,stage,source,markets=['CZ'],note=''){
 const g=gen(key,gi);g.equipmentLines??=[];
 for(const name of names){const old=g.equipmentLines.find(e=>e.name===name);if(old){(old.availabilityEvidence??=[]).push(evidence(date,stage,source,markets));continue;}
  g.equipmentLines.push({id:`batch2-${gi}-${name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`,name,from:null,to:null,markets,
   noteCs:note||'Doložená nabídka podle pramene; úplný výrobní interval není odvozen.',availabilityEvidence:[evidence(date,stage,source,markets)],sources:[source]});
 }
}
function version(key,gi,date,stage,source,row){
 const [name,fuel,cc,cylinders,power,type,gears,drive,body='hatchback',equipmentNames=[],extra={},marketsOverride]=row;
 const g=gen(key,gi);g.trims??=[];
 const markets=marketsOverride??(source.includes('skoda-storyboard.com/20')?['Europe']:['CZ']);
 const obs=evidence(date,stage,source,markets);
 const old=g.trims.find(t=>t.bodyType===body&&t.engine?.fuel===fuel&&t.engine?.displacementCc===(cc??null)&&t.engine?.powerKw===power&&t.transmission?.type===type&&t.transmission?.gears===gears&&t.drive===drive);
 if(old){
  (old.availabilityEvidence??=[]).push(obs);
  old.sources=[...new Set([...(old.sources??[]),source])];
  if(equipmentNames.length){old.equipmentLineIds=[...new Set([...(old.equipmentLineIds??[]),...equipmentNames.map(n=>g.equipmentLines.find(e=>e.name===n).id)])];(old.fieldSources??={}).equipmentLineIds=[...new Set([...(old.fieldSources?.equipmentLineIds??[]),source])];}
  return old;
 }
 const modelYear=new Map([[S.golf,2026],[S.touran,2026],[S.i30,2025],[S.tucson,2025],[S.ceed,2025]]).get(source)??null;
 const t={id:`popular-batch2-${key.replace('/','-')}-${gi}-${g.trims.length}`,name:`${name} ${power} kW – ${gears?`${gears}st. `:''}${type==='manual'?'manuál':type==='dual-clutch'?'dvouspojkový automat':type==='e-cvt'?'e-CVT':'automat'}${drive==='awd'?' 4×4':''}${date?` (${date})`:''}`,kind:'technical-version',from:null,to:null,bodyType:body,
  engine:{fuel,displacementCc:cc??null,cylinders:cylinders??null,powerKw:power,...extra},transmission:{type,gears},drive,
  specificationScope:{market:markets.join(' / '),modelYear,noteCs:'Doložená konfigurace v dokumentu; datum je datum nabídky/listu, nikoli začátek výroby ani automaticky modelový rok. Bez doložení konkrétního rozvoru, výšky či výbavy nejsou další parametry doplňovány.'},
  availabilityEvidence:[obs],sources:[source],fieldSources:{}};
 for(const f of ['bodyType','engine.fuel','engine.powerKw','transmission.type',...gears!=null?['transmission.gears']:[],...drive!=null?['drive']:[],...cc!=null?['engine.displacementCc']:[],...cylinders!=null?['engine.cylinders']:[],...Object.keys(extra).map(k=>`engine.${k}`)])t.fieldSources[f]=[source];
 if(equipmentNames.length)t.equipmentLineIds=equipmentNames.map(name=>{const e=g.equipmentLines?.find(e=>e.name===name);assert(e,`Unknown equipment ${key}/${gi}/${name}`);return e.id;});
 g.trims.push(t);return t;
}
function facelift(key,gi,year,note,source){const g=gen(key,gi);g.facelift??=[];
 const old=g.facelift.find(f=>f.year===year);if(old){old.sources=[...new Set([...(old.sources??[]),source])];return;}
 assert(!g.facelift.length||year>g.facelift.at(-1).year,'Append only: facelift stage numbering is stable');
 g.facelift.push({year,to:null,name:`Modernizace ${year}`,code:null,note,sources:[source],photo:null});
}
// The first five lines: dated CZ equipment and selected manufacturer price-list configurations.
equipment('volkswagen/golf',7,['Golf','Life','Style','R-Line','GTI','GTI Clubsport','GTE','R'],'2025-05-28','facelift-2024',S.golf);
for(const [name,power,type,gears,eq] of [['1.5 TSI',85,'manual',6,['Golf','Life']],['1.5 TSI',110,'manual',6,['Life','Style']],['1.5 eTSI mHEV',85,'dual-clutch',7,['Life','Style']],['1.5 eTSI mHEV',110,'dual-clutch',7,['Life','Style']],['2.0 TDI',85,'manual',6,['Life']],['2.0 TDI',110,'dual-clutch',7,['Style']]])
 version('volkswagen/golf',7,'2025-05-28','facelift-2024',S.golf,[name,name.includes('mHEV')?'petrol-mhev':name.includes('TDI')?'diesel':'petrol',null,null,power,type,gears,'fwd','hatchback',eq]);
equipment('volkswagen/passat',8,['R-Line People'],'2026-01-08','original',S.passat);
for(const [name,cc,power,drive] of [['2.0 TDI',1968,110,'fwd'],['2.0 TDI',1968,142,'awd'],['2.0 TSI',1984,150,'fwd'],['2.0 TSI',1984,195,'awd']])
 version('volkswagen/passat',8,'2026-01-08','original',S.passat,[name,name.includes('TDI')?'diesel':'petrol',cc,4,power,'dual-clutch',7,drive,'kombi',['R-Line People']]);
equipment('ford/focus',3,['Titanium','Titanium X','ST-Line X','Active X'],'2025-09-30','facelift-2022',S.focus,['CZ'],'Český ceník pouze pro skladové vozy; nelze z něj odvozovat aktuální výrobu.');
for(const body of ['hatchback','kombi'])for(const [name,fuel,power,type,gears,eq] of [['1.0 EcoBoost Hybrid','petrol-mhev',92,'manual',6,['Titanium','Titanium X']],['1.0 EcoBoost Hybrid','petrol-mhev',114,'dual-clutch',7,['Titanium','Titanium X','ST-Line X','Active X']],['1.5 EcoBlue','diesel',85,'automatic',8,['Titanium','Titanium X','ST-Line X','Active X']]])
 version('ford/focus',3,'2025-09-30','facelift-2022',S.focus,[name,fuel,null,null,power,type,gears,'fwd',body,eq]);
equipment('hyundai/i30',2,['Comfort','Smart','Style','Premium','GO Czech N Line!','N Line Premium'],'2026-02-01','facelift-2024',S.i30,['CZ'],'Český ceník MY2025 platný od února 2026, pouze pro skladové vozy.');
for(const [name,fuel,power,type,gears,eq] of [['1.5i CVVT','petrol',71,'manual',6,['Comfort','Smart','Style','GO Czech N Line!']],['1.0 T-GDI','petrol',74,'manual',6,['Comfort','Smart','Style','GO Czech N Line!']],['1.0 T-GDI','petrol',74,'dual-clutch',7,['Comfort','Smart','Style','GO Czech N Line!']],['1.5 T-GDI MHEV','petrol-mhev',103,'manual',6,['Comfort','Smart','Style','Premium','GO Czech N Line!','N Line Premium']],['1.5 T-GDI MHEV','petrol-mhev',103,'dual-clutch',7,['Comfort','Smart','Style','Premium','GO Czech N Line!','N Line Premium']]])
 version('hyundai/i30',2,'2026-02-01','facelift-2024',S.i30,[name,fuel,null,null,power,type,gears,'fwd','hatchback',eq]);
const i30Old=gen('hyundai/i30',1).trims.find(t=>t.engine?.displacementCc===1396&&t.engine.fuel==='petrol');
assert.equal(i30Old.engine.powerKw,null);i30Old.engine.powerKw=73.2;
(i30Old.sources??=[]).push(S.i30Launch);(i30Old.fieldSources??={})['engine.powerKw']=[S.i30Launch];
i30Old.availabilityEvidence=[evidence('2011-09-13','original',S.i30Launch,['Europe'])];
i30Old.specificationScope.noteCs+=' Výkon 73,2 kW je přímo údaj výrobcovy předběžné tiskové specifikace z 13. 9. 2011 (1396 cm³); nejde o přepočet z PS ani o motor Kappa 1368 cm³ po faceliftu.';
changes.push({key:'hyundai/i30',path:'generations.1.trims.0.specificationScope.noteCs',before:files.get(locations.get('hyundai/i30')).before.find(c=>c.lineSlug==='i30').generations[1].trims[0].specificationScope.noteCs,after:i30Old.specificationScope.noteCs,sources:[S.i30Launch],reason:'Append explicit manufacturer power scope.'});
// Transporter body/axle distinctions belong in technical versions, not equipment names.
for(const [power,type,gears] of [[81,'manual',6],[110,'manual',6],[110,'automatic',8]])version('volkswagen/transporter',6,'2025-05-13','original',S.transporter,['2.0 TDI Kombi – krátký rozvor','diesel',null,null,power,type,gears,'fwd','dodavka']);
// Missing facelift and real Czech equipment, with no inferred continuous production periods.
facelift('renault/megane',3,2020,'Nové nárazníky a maska, standardní LED osvětlení; modernizovaný interiér s Easy Link a digitálním přístrojovým štítem podle výbavy.',S.meganeFL);
equipment('renault/megane',3,['Life','Zen','Intens','R.S. Line'],'2020-10','facelift-2020',S.meganeCZ,['CZ'],'Česká brožura CZ 10/2020; nabídka podle výbavy, nikoli přesný interval prodeje. R.S. Line je výbava, nikoli motor R.S.');
// Slovak stock brochure: never equate its October 2020 date with a facelift-stage identity.
for(const [name,fuel,cc,power,type,gears] of [['1.3 TCe 115 GPF','petrol',1333,85,'manual',6],['1.3 TCe 140 GPF','petrol',1333,103,'manual',6],['1.3 TCe 140 GPF EDC','petrol',1333,103,'dual-clutch',7],['1.5 Blue dCi 115','diesel',1461,85,'manual',6],['1.5 Blue dCi 115 EDC','diesel',1461,85,'dual-clutch',7],['1.7 Blue dCi 150 EDC','diesel',1749,110,'dual-clutch',6]])
 version('renault/megane',3,'2020-10-01','unspecified',S.meganeSK,[name,fuel,cc,4,power,type,gears,null,'kombi',[],{},['SK']]);
facelift('skoda/rapid',0,2017,'Upravený spodní přední nárazník a mlhovky, zatmavené zadní svítilny; bi-xenonové světlomety a LED denní svícení podle provedení. Nové motory 1.0 TSI.',S.rapidFL);
for(const row of [
 ['1.0 TSI','petrol',999,3,70,'manual',5,'fwd'],['1.0 TSI','petrol',999,3,70,'dual-clutch',7,'fwd'],['1.0 TSI','petrol',999,3,81,'manual',6,'fwd'],['1.4 TSI','petrol',1395,4,92,'dual-clutch',7,'fwd'],
 ['1.4 TDI','diesel',1422,3,66,'manual',5,'fwd'],['1.4 TDI','diesel',1422,3,66,'dual-clutch',7,'fwd'],['1.6 TDI','diesel',1596,4,85,'manual',5,'fwd']])version('skoda/rapid',0,'2017-04-18','facelift-2017',S.rapid,row);
for(const row of [['1.0 TSI','petrol',999,3,81,'manual',6,'fwd','suv'],['1.5 TSI','petrol',1498,4,110,'manual',6,'fwd','suv'],['1.5 TSI','petrol',1498,4,110,'dual-clutch',7,'fwd','suv']])version('skoda/karoq',0,'2022-04-04','facelift-2021',S.karoq,row);
for(const [power,type,drive] of [[85,'manual','fwd'],[85,'dual-clutch','fwd'],[110,'manual','fwd'],[110,'dual-clutch','awd']])version('skoda/karoq',0,'2022-04-04','facelift-2021',S.karoqDiesel,['2.0 TDI','diesel',1968,4,power,type,type==='manual'?6:7,drive,'suv']);
equipment('skoda/karoq',0,['Selection','Drive'],'2024-04-02','facelift-2021',S.driveCZ);
equipment('volkswagen/touran',1,['Touran','Comfortline','Highline','R-Line'],'2025-05-28','original',S.touran);
// Only the base 1.5 TSI 6MT is transcribed until the rest of the engine table is checked.
version('volkswagen/touran',1,'2025-05-28','original',S.touran,['1.5 TSI','petrol',null,null,110,'manual',6,'fwd','mpv',['Touran','Comfortline']]);
equipment('ford/transit',3,['Base','Trend'],'2026-10-01','technical-update-2024',S.transit);
for(const [name,power,eq] of [['Van 310 L2 2.0 EcoBlue',77,['Base','Trend']],['Van 310 L2 2.0 EcoBlue',96,['Trend']]])version('ford/transit',3,'2026-10-01','technical-update-2024',S.transit,[name,'diesel',null,null,power,'manual',6,'fwd','dodavka',eq]);
version('ford/transit',3,'2026-10-01','technical-update-2024',S.transit,['Van 350 L2 2.0 EcoBlue','diesel',null,null,121,'automatic',8,'fwd','dodavka',['Trend']]);
equipment('hyundai/tucson',1,['Comfort','Smart','Style','Premium','N Line','N Line Style'],'2026-02-01','facelift-2024',S.tucson,['CZ'],'Ceník MY2025 platný od února 2026 pouze pro skladové vozy.');
for(const row of [
 ['1.6 T-GDI','petrol',null,null,118,'manual',6,'fwd','suv',['Comfort','Smart','Style','Premium','N Line','N Line Style']],
 ['1.6 T-GDI MHEV','petrol-mhev',null,null,118,'dual-clutch',7,'fwd','suv',['Smart','Style','Premium','N Line','N Line Style']],
 ['1.6 T-GDI MHEV','petrol-mhev',null,null,118,'dual-clutch',7,'awd','suv',['Style','Premium','N Line','N Line Style']],
 ['1.6 CRDi','diesel',null,null,85,'manual',6,'fwd','suv',['Smart','Style']],
 ['1.6 CRDi MHEV','diesel-mhev',null,null,100,'manual',6,'fwd','suv',['Style','Premium','N Line','N Line Style']],
 ['1.6 CRDi MHEV','diesel-mhev',null,null,100,'dual-clutch',7,'fwd','suv',['Style','Premium','N Line','N Line Style']],
 ['1.6 CRDi MHEV','diesel-mhev',null,null,100,'dual-clutch',7,'awd','suv',['Style','Premium','N Line','N Line Style']]])version('hyundai/tucson',1,'2026-02-01','facelift-2024',S.tucson,row);
equipment('volkswagen/caddy',3,['Caddy','Life','Style'],'2025-09-08','original',S.caddy,['CZ'],'Základní rozvor; Maxi je rozvorová varianta, nikoli další výbavový stupeň.');
for(const [name,fuel,power,type,gears,drive] of [['1.5 TSI','petrol',85,'manual',6,'fwd'],['1.5 TSI','petrol',85,'dual-clutch',7,'fwd'],['2.0 TDI','diesel',55,'manual',6,'fwd'],['2.0 TDI','diesel',75,'manual',6,'fwd'],['2.0 TDI','diesel',90,'dual-clutch',7,'fwd'],['2.0 TDI','diesel',90,'manual',6,'awd']])
 version('volkswagen/caddy',3,'2025-09-08','original',S.caddy,[name,fuel,null,null,power,type,gears,drive,'mpv',['Caddy']]);
equipment('ford/mondeo',4,['Trend','Titanium','ST-Line','Vignale'],'2021-07-01','facelift-2019',S.mondeo,['CZ'],'Ceník pouze pro skladové vozy: ceny platné od 1. 7. 2021, vydání 5. 8. 2021; rok 2020 v názvu souboru není datum nabídky.');
for(const body of ['hatchback','kombi'])for(const [power,type,gears,drive,eq] of [[110,'manual',6,'fwd',['Trend','Titanium']],[110,'automatic',8,'fwd',['Titanium']],[140,'automatic',8,'awd',['Titanium','ST-Line','Vignale']]])version('ford/mondeo',4,'2021-07-01','facelift-2019',S.mondeo,['2.0 EcoBlue','diesel',1997,null,power,type,gears,drive,body,eq]);
const mondeoHEV=version('ford/mondeo',4,'2021-07-01','facelift-2019',S.mondeo,['2.0 Duratec Hybrid','petrol-hev',null,null,138,'e-cvt',null,'fwd','kombi',['Trend','Titanium','ST-Line','Vignale'],{powerBasis:'system'}]);
mondeoHEV.sources=[...new Set([...mondeoHEV.sources,S.mondeoFL])];mondeoHEV.fieldSources['engine.powerBasis']=[S.mondeoFL];
facelift('kia/ceed',0,2009,'První facelift cee’d přinesl masku chladiče ve tvaru tygřího nosu. Záznam potvrzuje tovární český historický přehled; nelze jej automaticky přenést na pro_cee’d.',S.ceedHistory);
equipment('kia/ceed',6,['Comfort','SPIN','TOP','EDICE 30','GT-Line'],'2024-10-01','facelift-2021',S.ceed,['CZ'],'Český ceník hatchbacku MY25 platný 1.–31. 10. 2024; údaje nejsou přenášeny na SW nebo ProCeed.');
version('kia/ceed',6,'2024-10-01','facelift-2021',S.ceed,['1.5 T-GDI GPF','petrol',null,null,103,'dual-clutch',7,'fwd','hatchback',['SPIN','TOP','GT-Line']]);
equipment('skoda/scala',0,['Selection','Top Selection','Monte Carlo'],'2024-01-29','facelift-2023',S.scalaCZ);
equipment('skoda/scala',0,['Drive'],'2024-04-02','facelift-2023',S.driveCZ);
for(const row of [['1.0 TSI','petrol',999,3,70,'manual',5,'fwd'],['1.0 TSI','petrol',999,3,85,'manual',6,'fwd'],['1.0 TSI','petrol',999,3,85,'dual-clutch',7,'fwd'],['1.5 TSI','petrol',1498,4,110,'manual',6,'fwd'],['1.5 TSI','petrol',1498,4,110,'dual-clutch',7,'fwd']])version('skoda/scala',0,'2024-01-09','facelift-2023',S.scala,row);
// Fill null family bounds only from matching, sourced existing/new versions.
// Do not broaden already populated variant-specific bounds by guessing identity.
for(const [make,slug] of targets){const key=`${make}/${slug}`;for(const [gi,g] of card(key).generations.entries()){
 const groups=new Map();for(const t of g.trims??[]){const e=t.engine;if(e?.powerKw==null||!e.displacementCc)continue;const nominal=Math.round(e.displacementCc/100)/10,k=`${e.fuel}|${nominal}`;const gr=groups.get(k)??{fuel:e.fuel,nominal,rows:[]};gr.rows.push(t);groups.set(k,gr);}
 for(const {fuel,nominal,rows} of groups.values()){
  g.engines??=[];let e=g.engines.find(e=>e.fuel===fuel&&(e.displacementLitresNominal===nominal||e.displacementCc===rows[0].engine.displacementCc));
  const powers=[...new Set(rows.map(t=>t.engine.powerKw))].sort((a,b)=>a-b),sources=[...new Set(rows.flatMap(t=>t.fieldSources?.['engine.powerKw']??t.sources??[]))];
  if(e?.powerKwMin!=null||e?.powerKwMax!=null){if(powers.some(p=>p<e.powerKwMin||p>e.powerKwMax))rangeReview.push({key,generation:gi,variant:e.variant,existing:[e.powerKwMin,e.powerKwMax],documented:powers,sources,action:'Preserved existing variant-specific range; review identity before widening.'});continue;}
  if(!e){e={fuel,displacementCc:rows.every(t=>t.engine.displacementCc===rows[0].engine.displacementCc)?rows[0].engine.displacementCc:null,displacementLitresNominal:nominal,powerKwMin:null,powerKwMax:null,variant:null};g.engines.push(e);}
  Object.assign(e,{powerKwMin:powers[0],powerKwMax:powers.at(-1),availablePowerKw:powers,powerRangeCoverage:'documented-versions-only',sources,fieldSources:{...(e.fieldSources??{}),powerKwMin:sources,powerKwMax:sources}});
  if(!e.variant)e.variant=`${nominal.toFixed(1).replace('.',',')} ${{petrol:'benzin',diesel:'nafta','petrol-mhev':'benzin mHEV','diesel-mhev':'nafta mHEV','petrol-hev':'benzin HEV','petrol-phev':'benzin PHEV','petrol-cng':'benzin/CNG'}[fuel]??fuel}; doložené verze, nikoli úplný historický rozsah.`;
  if(fuel==='petrol-phev')e.powerBasis='system';
 }
}}
// The old Mégane entries aggregate all petrol/diesel engines, without known displacement.
// Retain that structure and scope the manufacturer's bounds instead of inventing capacities.
for(const [gi,date,source,petrol,diesel,note] of [
 [0,'2020-01-14',S.meganeIHistory,[51,108],[47,75],'Tovární retrospektiva evropské první generace; nikoli soupis všech světových trhů.'],
 [1,'2006-01-20',S.meganeII,[72,82,99,165],[63,78,81,96,110],'Doložená německá nabídka po faceliftu v lednu 2006; zahrnuje různé karoserie, 2.0 dCi 110 kW pouze Grandtour.'],
 [2,null,S.meganeIII,[74,103,132],[66,81,96],'Rakouská tisková informace k uvedení 2008; nejde o úplný historický rozsah. Diesel 81 kW byl ohlášen na konec 2008; pozdější motory 2009 nejsou do rozsahu přidány.'],
])for(const [fuel,powers] of [['petrol',petrol],['diesel',diesel]]){
 const e=gen('renault/megane',gi).engines.find(e=>e.fuel===fuel&&e.displacementCc==null&&e.displacementLitresNominal==null);
 assert(e&&e.powerKwMin==null&&e.powerKwMax==null);
 Object.assign(e,{powerKwMin:Math.min(...powers),powerKwMax:Math.max(...powers),availablePowerKw:powers,powerRangeCoverage:'documented-versions-only',
  variant:`${fuel==='petrol'?'Benzin':'Nafta'}; ${note}`,sources:[source],fieldSources:{powerKwMin:[source],powerKwMax:[source]},
  powerObservations:[{...date?{date}:{},observedAt:'2026-10-31',noteCs:note,sources:[source]}]});
}
const changedKeys=targets.map(t=>t.join('/')).filter(key=>{
 const original=files.get(locations.get(key)).before.find(c=>c.lineSlug===key.split('/')[1]);
 return JSON.stringify(card(key))!==JSON.stringify(original);
});
for(const [path,f] of files){let raw=f.raw;for(const b of blocks(raw).reverse()){
 const key=`${b.value.makeSlug}/${b.value.lineSlug}`;if(locations.get(key)!==path)continue;
 const now=card(key);if(JSON.stringify(now)===JSON.stringify(b.value))continue;
 const newline=b.text.includes('\r\n')?'\r\n':'\n';const pretty=JSON.stringify(now,null,2).replace(/\n/g,`${newline}  `);raw=raw.slice(0,b.start)+pretty+raw.slice(b.end);
 }if(raw!==f.raw)fs.writeFileSync(path,raw);}
const count=c=>({generations:c.generations.length,facelifts:c.generations.reduce((n,g)=>n+(g.facelift??g.facelifts??[]).length,0),engines:c.generations.reduce((n,g)=>n+(g.engines??[]).length,0),enginesWithPower:c.generations.reduce((n,g)=>n+(g.engines??[]).filter(e=>e.powerKwMin!=null&&e.powerKwMax!=null).length,0),versions:c.generations.reduce((n,g)=>n+(g.trims??[]).length,0),equipmentLines:c.generations.reduce((n,g)=>n+(g.equipmentLines??[]).length,0)});
const report={baselineCommit:ref,reviewedAt:'2026-10-31',status:'partial',targets,sourceFiles:[...new Set(locations.values())],touchedMakes:[...new Set(changedKeys.map(k=>k.split('/')[0]))].sort(),sourceDocuments:S,changes,rangeReview,
 resultHashes:Object.fromEntries(targets.map(([m,s])=>[`${m}/${s}`,hash(card(`${m}/${s}`))])),
 lines:targets.map(([make,slug])=>({make,slug,sourceFile:locations.get(`${make}/${slug}`),status:'partial-sourced-enrichment',before:count(baselineIndex[make][slug]),after:count(card(`${make}/${slug}`))})),
 generationReview:[
  {key:'hyundai/tucson',generation:0,issue:'Empty NX5 entry dated 2026 precedes NX4. No verified primary launch specification obtained; Czech MY25 offer belongs to NX4 index 1.',action:'Preserved index and empty values; needs source review/migration, no speculative fill.'},
  {key:'kia/ceed',issue:'Nine generation entries encode three body styles per ED/JD/CD series. Not nine historical generations; starts of several body entries unknown.',action:'No merge/reorder. Body-specific source evidence must be mapped individually.'},
  {key:'volkswagen/caddy',generation:2,issue:'2003–2020 entry includes the 2015 revision as facelift; generation IV is not a separate indexed entry.',action:'Preserved; splitting requires drawing/statistics migration.'},
  {key:'ford/transit',generation:3,issue:'Manufacturer confirms a 2024 technical update (SYNC4, connectivity, axle, automatic gearbox), not enough evidence here for a separate exterior facelift.',sources:[S.transitUpdate],action:'Snapshots labelled technical-update-2024; no fabricated look/facelift card.'},
  {key:'renault/megane',generation:0,issue:'Existing end 2003 differs from the factory retrospective: Europe ended 2002, Argentina continued to 2009.',sources:[S.meganeIHistory],action:'Preserved; resolve regional/body production scope before changing dates.'},
 ],
 limitations:['This batch is an enrichment pass, not exhaustive historical completeness certification.','No generation identities/dates or drawingStage changed. No drawings generated.','Unknown source dates stay absent; observedAt is access date only. Archived stock offers do not prove continued production.','Many newer Czech price lists specify nominal litres but no verified cubic capacity/cylinder count. Those version fields remain null.','No inferred PHEV system power from VW Czech price-list combustion-power columns.','Older Mégane generations and Ceed body-specific variants remain substantial gaps; see generation audit.','Power aggregation of pre-existing technical versions retains their original sources; those facts were not all independently re-researched.'],gaps:[]};
for(const [make,slug] of targets)for(const [generation,g] of card(`${make}/${slug}`).generations.entries())report.gaps.push({make,slug,generation,name:g.name,from:g.from,to:g.to,enginesWithoutPower:(g.engines??[]).filter(e=>e.powerKwMin==null||e.powerKwMax==null).map(e=>({fuel:e.fuel,cc:e.displacementCc,litres:e.displacementLitresNominal})),noEngineFamilies:!g.engines?.length,noVersions:!g.trims?.length,noEquipment:!g.equipmentLines?.length,faceliftYears:(g.facelift??[]).map(f=>f.year),faceliftCompleteness:'not-exhaustively-verified'});
fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.lines));
