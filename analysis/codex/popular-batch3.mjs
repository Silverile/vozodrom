// Run from repo root; then regenerate only the makes listed in the review report.
// Dates are document dates. Access dates never become offer dates.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const reportPath='analysis/codex/popular-batch3-review.json';
const targets=[["volkswagen","tiguan"],["skoda","kamiq"],["citroen","berlingo"],["dacia","duster"],["opel","astra"],["skoda","130-135-136"],["skoda","yeti"],["renault","clio"],["skoda","100-110"],["skoda","roomster"],["volkswagen","polo"],["toyota","yaris"],["fiat","ducato"],["audi","a4"],["ford","fiesta"],["toyota","corolla"],["audi","a6"],["peugeot","206"],["bmw","rada-5"]];
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
 tiguan:'https://www.volkswagen.cz/dam/files/download/32bfc9b39dd35ea324ac276d8c1a487bdca47fdf/2085e1a7f231e9282047f91b509a9bde/ae37c3bc-3fd1-4d27-b0f6-6177717dccbc/Tiguan_cenik_2025_06',
 kamiq:'https://cdn.skoda-storyboard.com/2024/02/TD-Kamiq-en_2ef3e24e.pdf',
 kamiqCZ:'https://www.skoda-auto.cz/novinky/novinky-detail/2024-01-29-skoda-auto-zahajila-vyrobu-modernizovanych-modelu-scala-a-kamiq',
 berlingo:'https://www.media.stellantis.com/cz-cs/citroen/press/univerzalni-a-chytrejsi-novy-citroen-berlingo-je-nyni-k-objednani',
 duster:'https://cdn.group.renault.com/dac/cz/pdf/pricelists/duster-cenik.pdf.asset.pdf/3a0dbcfd7a.pdf',
 astra:'https://www.opel24.cz/download/cenik-astra.pdf',
 yetiHistory:'https://www.skoda-storyboard.com/en/press-releases/skoda-yeti-2009-2018-first-member-of-skodas-popular-suv-family/',
 clio:'https://cdn.group.renault.com/ren/cz/pdf/pricelists/clio-price.pdf.asset.pdf/728d8d5e3c.pdf',
 polo:'https://www.volkswagen.cz/dam/files/download/ff54c4b651dd10c07a0414166f5a5b54de6b9246/ad2fff36e542e4ef99e1887e998ec204/270122c3-8ff1-4de1-82c8-8c0a0d04b863/Cenik_Polo_People_2026_04',
 yaris:'https://pdf.sites.toyota.cz/cenik_novy_yaris_2025.pdf',
 yarisPower:'https://www.toyota-media.de/blog/toyota-modelle/artikel/der-uberarbeitete-toyota-yaris/text',
 ducato:'https://www.fiatcz.com/content/dam/fiat2023/cz/ceniky/2026/04/professional/sklad_FiatPro_Ducato_Van_MY25_01-04-2026.pdf',
 a4:'https://www.audi.com/en/the-audi-a4-major-upgrade-for-the-bestseller-2019-11884/the-facts-11887',
 a4FL:'https://nieuws.audi.nl/vernieuwde-audi-a4-leverbaar-vanaf-februari-2012/',
 fiesta:'https://weudealerimagesprd.blob.core.windows.net/cz11/siteassets/PL-ford_new_fiesta.pdf',
 corolla:'https://pdf.sites.toyota.cz/cenik_corolla_sedan_2025.pdf',
 a6:'https://www.audi.com/en/press-releases/business-class-at-its-most-elegant-the-new-a6-sedan-16602',
 peugeot:'https://xr793.com/wp-content/uploads/2023/07/2006-Peugeot-206-206-CC-AUS.pdf',
 bmw:'https://www.bmw.cz/content/dam/bmw/marketCZ/bmw_cz/all-models/ceniky-2025/G60_G90_0725_CZ_online.pdf',
};

const evidence=(date,stage,source,markets=['CZ'])=>({...date?{date}:{},observedAt:'2026-10-31',stage,markets,sources:[source]});
const changes=[],rangeReview=[];
function equipment(key,gi,names,date,stage,source,markets=['CZ'],note=''){
 const g=gen(key,gi);g.equipmentLines??=[];
 for(const name of names){const old=g.equipmentLines.find(e=>e.name===name);if(old){(old.availabilityEvidence??=[]).push(evidence(date,stage,source,markets));continue;}
  g.equipmentLines.push({id:`batch3-${gi}-${name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`,name,from:null,to:null,markets,
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
 const modelYear=new Map([[S.tiguan,2026],[S.ducato,2025],[S.corolla,2025]]).get(source)??null;
 const t={id:`popular-batch3-${key.replace('/','-')}-${gi}-${g.trims.length}`,name:`${name} ${power} kW – ${gears?`${gears}st. `:''}${type==='manual'?'manuál':type==='dual-clutch'?'dvouspojkový automat':type==='e-cvt'?'e-CVT':'automat'}${drive==='awd'?' 4×4':''}${date?` (${date})`:''}`,kind:'technical-version',from:null,to:null,bodyType:body,
  engine:{fuel,displacementCc:cc??null,cylinders:cylinders??null,powerKw:power,...extra},transmission:{type,gears},drive,
  specificationScope:{market:markets.join(' / '),modelYear,noteCs:'Doložená konfigurace v dokumentu; datum je datum nabídky/listu, nikoli začátek výroby ani automaticky modelový rok. Bez doložení konkrétního rozvoru, výšky či výbavy nejsou další parametry doplňovány.'},
  availabilityEvidence:[obs],sources:[source],fieldSources:{}};
 for(const f of ['bodyType','engine.fuel','engine.powerKw','transmission.type',...gears!=null?['transmission.gears']:[],...drive!=null?['drive']:[],...cc!=null?['engine.displacementCc']:[],...cylinders!=null?['engine.cylinders']:[],...Object.keys(extra).map(k=>`engine.${k}`)])t.fieldSources[f]=[source];
 if(equipmentNames.length){t.equipmentLineIds=equipmentNames.map(name=>{const e=g.equipmentLines?.find(e=>e.name===name);assert(e,`Unknown equipment ${key}/${gi}/${name}`);return e.id;});t.fieldSources.equipmentLineIds=[source];}
 g.trims.push(t);return t;
}
function facelift(key,gi,year,note,source){const g=gen(key,gi);g.facelift??=[];
 const old=g.facelift.find(f=>f.year===year);if(old){old.sources=[...new Set([...(old.sources??[]),source])];return;}
 assert(!g.facelift.length||year>g.facelift.at(-1).year,'Append only: facelift stage numbering is stable');
 g.facelift.push({year,to:null,name:`Modernizace ${year}`,code:null,note,sources:[source],photo:null});
}
// Dated offers are snapshots, never inferred production intervals or model years.
equipment('volkswagen/tiguan',2,['Limited','Tiguan','Life','R-Line'],'2025-05-28','original',S.tiguan);
for(const [power,eq] of [[96,['Limited','Tiguan','Life']],[110,['Life']]])version('volkswagen/tiguan',2,'2025-05-28','original',S.tiguan,['1.5 eTSI','petrol-mhev',null,null,power,'dual-clutch',7,null,'suv',eq]);
version('volkswagen/tiguan',2,'2025-05-28','original',S.tiguan,['2.0 TDI','diesel',null,null,110,'dual-clutch',7,null,'suv',['Life']]);
equipment('skoda/kamiq',0,['Selection','Top Selection','Monte Carlo'],'2024-01-29','facelift-2023',S.kamiqCZ);
for(const row of [['1.0 TSI','petrol',999,3,70,'manual',5,'fwd','suv'],['1.0 TSI','petrol',999,3,85,'manual',6,'fwd','suv'],['1.0 TSI','petrol',999,3,85,'dual-clutch',7,'fwd','suv'],['1.5 TSI','petrol',1498,4,110,'manual',6,'fwd','suv'],['1.5 TSI','petrol',1498,4,110,'dual-clutch',7,'fwd','suv']])version('skoda/kamiq',0,'2024-01-09','facelift-2023',S.kamiq,row);
equipment('citroen/berlingo',2,['PLUS','MAX'],'2024-03-14','facelift-2024',S.berlingo,['CZ'],'Osobní Berlingo M/XL; PROFI a délky karoserie nejsou výbavové linie.');
equipment('dacia/duster',2,['Essential','Expression','Journey','Extreme'],null,'original',S.duster);
version('dacia/duster',2,null,'original',S.duster,['mild hybrid 140','petrol-mhev',1199,3,103,'manual',6,null,'suv']);
version('dacia/duster',2,null,'original',S.duster,['hybrid 155','petrol-hev',1789,4,116,'automatic',null,null,'suv',[],{powerBasis:'system'}]);
equipment('opel/astra',5,['Edition','GS'],'2025-09-07','original',S.astra);
for(const [name,fuel,cc,cyl,power,type,gears,extra] of [['1.2 Turbo','petrol',1199,3,96,'manual',6,{}],['1.2 Turbo','petrol',1199,3,96,'automatic',8,{}],['Hybrid 1.2 Turbo','petrol-hev',1199,3,107,'dual-clutch',6,{powerBasis:'system'}],['1.5 CDTI','diesel',1498,4,96,'automatic',8,{}]])version('opel/astra',5,'2025-09-07','original',S.astra,[name,fuel,cc,cyl,power,type,gears,null,'hatchback',['Edition','GS'],extra]);
equipment('renault/clio',4,['Evolution','Techno','Esprit Alpine'],'2025-04-01','facelift-2023',S.clio);
version('renault/clio',4,'2025-04-01','facelift-2023',S.clio,['TCe 90','petrol',999,3,67,'manual',6,null]);
version('renault/clio',4,'2025-04-01','facelift-2023',S.clio,['TCe 90 X-Tronic','petrol',999,3,67,'automatic',null,null]);
version('renault/clio',4,'2025-04-01','facelift-2023',S.clio,['E-Tech full hybrid 145','petrol-hev',1598,4,105,'automatic',null,null,'hatchback',[],{powerBasis:'system'}]);
equipment('volkswagen/polo',5,['People'],'2026-04-01','facelift-2021',S.polo);
for(const [power,type,gears] of [[70,'manual',5],[70,'dual-clutch',7],[85,'dual-clutch',7]])version('volkswagen/polo',5,'2026-04-01','facelift-2021',S.polo,['1.0 TSI','petrol',999,3,power,type,gears,'fwd','hatchback',['People']]);
equipment('toyota/yaris',3,['Active','Comfort','Style','Executive','GR SPORT'],'2025-10-01','technical-update-2024',S.yaris);
for(const [power,eq] of [[85,['Active','Comfort','Style']],[96,['Executive','GR SPORT']]]){
 const t=version('toyota/yaris',3,'2025-10-01','technical-update-2024',S.yaris,['1.5 Hybrid','petrol-hev',null,null,power,'e-cvt',null,null,'hatchback',eq,{powerBasis:'system'}]);
 t.sources.push(S.yarisPower);t.fieldSources['engine.powerKw']=[S.yarisPower];t.fieldSources['engine.powerBasis']=[S.yarisPower];
 t.specificationScope.noteCs+=' Český ceník má na titulní straně MY2025, ale u tabulky cen MY2024; modelový rok proto není odvozen. Výkony soustavy 85/96 kW potvrzuje Toyota DE.';
}
for(const [power,type,gears] of [[88,'manual',6],[103,'manual',6],[103,'automatic',8],[132,'manual',6],[132,'automatic',8]]){
 const t=version('fiat/ducato',2,'2026-04-01','technical-offer-MY2025',S.ducato,['2.2 MTJ EVO','diesel',2184,null,power,type,gears,null,'dodavka']);
 t.specificationScope.noteCs+=' Ceník pro skladové vozy Van MY25; konkrétní délka/výška ani trvalá dostupnost nejsou odvozeny.';
}
facelift('audi/a4',3,2011,'Modernizace oznámena v říjnu 2011: upravená maska, světla a nárazníky. Nizozemské dodávky od února 2012; nejde o změnu indexu generace.',S.a4FL);
facelift('audi/a4',4,2019,'Výrazná úprava exteriéru s nižší maskou Singleframe a novými světlomety, dotykové MMI. Historický tovární přehled pro modernizaci 2019.',S.a4);
equipment('audi/a4',4,['basic','advanced','S line'],null,'facelift-2019',S.a4,['DE'],'Německý tovární přehled A4 2019; česká nabídka zde samostatně nepotvrzena. Datum migrace webu 2026 není datem nabídky.');
equipment('ford/fiesta',6,['Trend','Titanium','ST-Line','Vignale','Active','Active Plus'],'2018-09-26','original',S.fiesta);
for(const [name,fuel,power,type,gears,eq] of [['1.1 Ti-VCT','petrol',52,'manual',5,['Trend']],['1.1 Ti-VCT','petrol',63,'manual',5,['Trend']],['1.0 EcoBoost','petrol',74,'manual',6,['Trend']],['1.0 EcoBoost','petrol',74,'automatic',6,['Trend']],['1.5 TDCi','diesel',63,'manual',6,['Trend']],['1.0 EcoBoost','petrol',92,'manual',6,['ST-Line']],['1.0 EcoBoost','petrol',103,'manual',6,['Vignale']]]){
 const t=version('ford/fiesta',6,'2018-09-26','original',S.fiesta,[name,fuel,null,null,power,type,gears,null,'hatchback',eq]);t.specificationScope.noteCs+=' Doložená pětidveřová nabídka; nikoli automaticky třídveřová verze.';
}
equipment('toyota/corolla',11,['Active','Comfort','Style','GR SPORT','Executive'],'2025-09-01','facelift-2022',S.corolla,['CZ'],'Pouze sedan; výbavy se nepřenášejí na hatchback ani Touring Sports.');
version('toyota/corolla',11,'2025-09-01','facelift-2022',S.corolla,['1.8 Hybrid 140','petrol-hev',null,null,103,'e-cvt',null,null,'sedan',['Active','Comfort','Style','GR SPORT','Executive'],{powerBasis:'system'}]);
// Source maps this configuration explicitly; other A6 powertrains are not cross-multiplied with gearboxes.
version('audi/a6',5,'2025-04-15','original-2025',S.a6,['2.0 TFSI','petrol',1984,4,150,'dual-clutch',7,'fwd','sedan',[],{},['Europe']]);
equipment('peugeot/206',0,['XR','XT','C','GTi 180'], '2006-04','facelift-2003',S.peugeot,['AU'],'Tovární australský prospekt, stav duben 2006. Nedokládá české výbavy; C označuje třídveřovou verzi s panoramatickou střechou.');
version('peugeot/206',0,'2006-04','facelift-2003',S.peugeot,['2.0 16V CC','petrol',null,null,100,'manual',5,null,'kabriolet',[],{},['AU']]);
for(const [name,fuel,cc,cyl,power,drive,extra] of [['520d xDrive','diesel-mhev',1995,4,145,'awd',{}],['540d xDrive','diesel-mhev',2993,6,223,'awd',{}],['530e','petrol-phev',1998,4,220,null,{powerBasis:'system'}],['530e xDrive','petrol-phev',1998,4,220,'awd',{powerBasis:'system'}],['550e xDrive','petrol-phev',2998,6,360,'awd',{powerBasis:'system'}]])version('bmw/rada-5',1,'2025-07-01','original',S.bmw,[name,fuel,cc,cyl,power,'automatic',8,drive,'sedan',[],extra]);
// A family snapshot is scoped to its source, not an exhaustive historic range.
function family(key,gi,fuel,litres,powers,source,note,powerBasis){
 const g=gen(key,gi);g.engines??=[];const sources=[source],markets=key==='audi/a4'?['DE']:['AU'];g.engines.push({fuel,displacementCc:null,displacementLitresNominal:litres,powerKwMin:Math.min(...powers),powerKwMax:Math.max(...powers),availablePowerKw:powers,powerRangeCoverage:'documented-versions-only',...powerBasis?{powerBasis}:{},variant:note,sources,fieldSources:{powerKwMin:sources,powerKwMax:sources},powerObservations:[{observedAt:'2026-10-31',markets,noteCs:note,sources}]});
}
family('audi/a4',4,'petrol-mhev',2,[110,140,180],S.a4,'Evropská tovární nabídka A4 2019: 2.0 TFSI s 12V MHEV; doložený výběr.');
family('audi/a4',4,'diesel-mhev',2,[100,120],S.a4,'Evropská tovární nabídka A4 2019: 2.0 TDI s 12V MHEV; doložený výběr.');
family('audi/a4',4,'diesel',2,[140],S.a4,'Evropská tovární nabídka A4 2019: 2.0 TDI; doložený výběr.');
family('audi/a4',4,'diesel',3,[170],S.a4,'Evropská tovární nabídka A4 2019: 3.0 TDI; doložený výběr.');
family('peugeot/206',0,'petrol',1.6,[80],S.peugeot,'Australský prospekt duben 2006: 206 CC 1.6; česká nabídka nepotvrzena.');
family('peugeot/206',0,'petrol',2,[100,130],S.peugeot,'Australský prospekt duben 2006: CC 2.0 (100 kW) a GTi 180 (130 kW); česká nabídka nepotvrzena.');

// Fill null family bounds only from matching, sourced existing/new versions.
// Do not broaden already populated variant-specific bounds by guessing identity.
for(const [make,slug] of targets){const key=`${make}/${slug}`;for(const [gi,g] of card(key).generations.entries()){
 const groups=new Map();for(const t of g.trims??[]){const e=t.engine;if(e?.powerKw==null||!e.displacementCc)continue;const nominal=Math.round(e.displacementCc/100)/10,k=`${e.fuel}|${nominal}|${e.powerBasis??'engine'}`;const gr=groups.get(k)??{fuel:e.fuel,nominal,rows:[]};gr.rows.push(t);groups.set(k,gr);}
 for(const {fuel,nominal,rows} of groups.values()){
  g.engines??=[];let e=g.engines.find(e=>e.fuel===fuel&&(e.displacementLitresNominal===nominal||e.displacementCc===rows[0].engine.displacementCc));
  const powers=[...new Set(rows.map(t=>t.engine.powerKw))].sort((a,b)=>a-b),sources=key==='skoda/kamiq'?[S.kamiq]:[...new Set(rows.flatMap(t=>t.fieldSources?.['engine.powerKw']??t.sources??[]))];
  if(e?.powerKwMin!=null||e?.powerKwMax!=null){if(powers.some(p=>p<e.powerKwMin||p>e.powerKwMax))rangeReview.push({key,generation:gi,variant:e.variant,existing:[e.powerKwMin,e.powerKwMax],documented:powers,sources,action:'Preserved existing variant-specific range; review identity before widening.'});continue;}
  if(!e){e={fuel,displacementCc:rows.every(t=>t.engine.displacementCc===rows[0].engine.displacementCc)?rows[0].engine.displacementCc:null,displacementLitresNominal:nominal,powerKwMin:null,powerKwMax:null,variant:null};g.engines.push(e);}
  Object.assign(e,{powerKwMin:powers[0],powerKwMax:powers.at(-1),availablePowerKw:powers,powerRangeCoverage:'documented-versions-only',sources,fieldSources:{...(e.fieldSources??{}),powerKwMin:sources,powerKwMax:sources}});
  if(!e.variant)e.variant=`${nominal.toFixed(1).replace('.',',')} ${{petrol:'benzin',diesel:'nafta','petrol-mhev':'benzin mHEV','diesel-mhev':'nafta mHEV','petrol-hev':'benzin HEV','petrol-phev':'benzin PHEV','petrol-cng':'benzin/CNG'}[fuel]??fuel}; doložené verze, nikoli úplný historický rozsah.`;
  if(rows.every(t=>t.engine.powerBasis==='system'))e.powerBasis='system';
  const standards=[...new Set(rows.map(t=>t.engine.powerStandard).filter(Boolean))];if(standards.length===1)e.powerStandard=standards[0];
 }
}}
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
const report={baselineCommit:ref,reviewedAt:'2026-10-31',status:'partial',targets,sourceFiles:[...new Set(locations.values())],sourceLineEndings:Object.fromEntries([...files].map(([p,f])=>[p,f.raw.includes('\r\n')?'CRLF':'LF'])),touchedMakes:[...new Set(changedKeys.map(k=>k.split('/')[0]))].sort(),sourceDocuments:S,changes,rangeReview,
 resultHashes:Object.fromEntries(targets.map(([m,s])=>[`${m}/${s}`,hash(card(`${m}/${s}`))])),
 lines:targets.map(([make,slug])=>({make,slug,sourceFile:locations.get(`${make}/${slug}`),status:'partial-sourced-enrichment',before:count(baselineIndex[make][slug]),after:count(card(`${make}/${slug}`))})),
 generationReview:[
  {key:'bmw/rada-5',issue:'Generic family from 1972 is stored alongside G60 and undated F10. Earlier E12/E28/E34/E39/E60/F10/G30 generations are not represented as an ordered historical generation list.',action:'Preserved every entry/index/date; requires migration mapped to drawings and register statistics.'},
  {key:'audi/a6',issue:'Six construction-stage entries have mostly unknown dates; 2025 entry has code 4L, which has not been verified as an A6 generation code.',action:'Preserved identity. 2025 sedan snapshot attaches by year only; code/date migration needs primary evidence.'},
  {key:'skoda/yeti',generation:0,issue:'Stored end 2017; factory retrospective explicitly titles Yeti 2009–2018. Regional production scope must be resolved.',sources:[S.yetiHistory],action:'End date preserved; human review required.'},
  {key:'toyota/yaris',generation:3,issue:'CZ price list cover says MY2025, pricing table says MY2024; 2024 hybrid technical update does not by itself prove a new exterior facelift.',sources:[S.yaris,S.yarisPower],action:'New snapshot modelYear remains null; no invented exterior stage.'},
  {key:'audi/a4',generation:3,issue:'Facelift announced October 2011, Netherlands delivery February 2012. Facelift year uses announcement; market delivery year is documented in note.',sources:[S.a4FL],action:'Generation dates unchanged.'},
 ],
 limitations:['Enrichment pass, not exhaustive historical completeness certification. Every generation/facelift is not yet independently verified.','All original generation/drawing identities retained; no drawing or hold modified.','Old version-derived power observations retain their existing sources; they were not all independently re-researched.','Unknown dates/drive/gears/capacity remain absent or null; no gear count inferred from multimode hybrid ratios.','UK/Australian/European source scopes are explicit and do not establish CZ availability.','Many older generations remain without documented configurations and equipment lines; see machine-readable gaps.','Duster direct asset is undated; observedAt is not the offer date.','BMW 520i combustion 140 kW is not mixed with a later 153 kW system rating. M5 G90 is not inserted into G60.'],gaps:[]};
report.sourceReview=[{key:'skoda/kamiq',legacyUrl:'https://cdn.skoda-storyboard.com/2024/01/TD-Kamiq-en_e3841ce1.pdf',issue:'Legacy URL currently redirects to a Scala sheet. Existing citations retained for history; new power-family fields cite the verified Kamiq February asset only.',replacement:S.kamiq}];
for(const [make,slug] of targets)for(const [generation,g] of card(`${make}/${slug}`).generations.entries())report.gaps.push({make,slug,generation,name:g.name,from:g.from,to:g.to,enginesWithoutPower:(g.engines??[]).filter(e=>e.powerKwMin==null||e.powerKwMax==null).map(e=>({fuel:e.fuel,cc:e.displacementCc,litres:e.displacementLitresNominal})),noEngineFamilies:!g.engines?.length,noVersions:!g.trims?.length,noEquipment:!g.equipmentLines?.length,faceliftYears:(g.facelift??[]).map(f=>f.year),faceliftCompleteness:'not-exhaustively-verified'});
fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.lines));
