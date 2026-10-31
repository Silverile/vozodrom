// Manufacturer-document snapshots, not inferred continuous production intervals.
// Run from repository root, then node scripts/model-cards-index.mjs --make=skoda.
import {readFileSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const file='src/data/catalog/model-cards/skoda.json';
const cards=JSON.parse(readFileSync(file,'utf8'));
const card=cards.find(c=>c.lineSlug==='kodiaq');
assert.equal(card.generations.length,2,'Do not reorder drawing generation identities');
const [g1,g2]=card.generations;
const S={
 launch:'https://cdn.skoda-storyboard.com/2016/08/TD-KODIAQ-en.pdf',
 mid:'https://cdn.skoda-storyboard.com/2019/03/Skoda_Kodiaq_technickeudaje.pdf',
 rs1:'https://cdn.skoda-storyboard.com/2018/10/TD-KODIAQ-RS-diesel-cz.pdf',
 facelift:'https://cdn.skoda-storyboard.com/2021/06/TD_KODIAQ_en.pdf',
 rsFl:'https://cdn.skoda-storyboard.com/2021/06/TD_KODIAQ_RS_en.pdf',
 second:'https://cdn.skoda-storyboard.com/2024/11/TD-Kodiaq-en_83435dd3.pdf',
 newCZ:'https://autos.skoda-auto.cz/novinky/nabidku-modelu-skoda-kodiaq-rozsiruji-nove-vybavove-verze-top-selection,-laurin-klement-a-plug-in',
 newDE:'https://www.skoda-media.de/press/detail/4692/',
 newGlobal:'https://www.skoda-storyboard.com/en/models/kodiaq/kodiaq-celebrates-10-years-with-laurin-klement-version-and-more-powerful-plug-in-hybrid/',
 firstCZ:'https://www.skoda-storyboard.com/cs/tiskove-zpravy-archiv/nova-skoda-kodiaq-prodej-v-ceske-republice-zahajen/',
 sportline:'https://www.skoda-storyboard.com/en/press-releases/skoda-kodiaq-sportline-sporty-dynamic-appearance-want-stand/',
 scout:'https://www.skoda-storyboard.com/cs/tiskove-zpravy-archiv/skoda-kodiaq-scout-robustni-vzhled-podtrhuje-jizdni-vlastnosti-v-terenu/',
 lk:'https://www.skoda-storyboard.com/en/press-releases/skoda-kodiaq-lk-top-version-large-suv-celebrates-world-premiere-geneva/',
 flLines:'https://www.skoda-storyboard.com/en/press-kits/the-new-skoda-kodiaq-dynamic-press-launch-press-kit/skoda-kodiaq-the-successful-suv-gets-an-update/',
 gen2Lines:'https://www.skoda-storyboard.com/en/press-kits/skoda-kodiaq-press-kit/exterior-powerful-appearance-and-first-elements-of-the-new-modern-solid-design-language/',
 gen2RS:'https://www.skoda-storyboard.com/en/press-kits/skoda-kodiaq-press-kit/kodiaq-rs-sports-variant-offers-even-more-dynamic-performance-in-its-second-generation/',
 topDiesel:'https://www.skoda-storyboard.com/de/pressemitteilungen-archive/modelljahr-2021-bringt-zahlreiche-neuerungen-fuer-die-skoda-modellpalette/',
};
const note='Doložená nabídka podle data pramene, nikoli úplný výrobní interval. Rok v názvu označuje technický list; nezačleňuje automaticky všechny trhy, výbavy ani počty sedadel.';
// Only remove rows from a previous application of this pilot. Preserve richer old rows.
for(const g of [g1,g2]) g.trims=(g.trims??[]).filter(t=>!t.id?.startsWith('kodiaq-pilot-'));
const originalG1=[...g1.trims];
const originalG2=[...g2.trims];
const snapshotCounts={};
function version(g,{key,date,stage,fuel,cc,power,torque,type='dual-clutch',gears,drive,source,engineName,rs=false,markets=['Europe'],extra={}}){
  const transmissionName=type==='manual'?`${gears}st. manuál`:gears?`${gears}st. DSG`:'DSG';
  const label=`${engineName} ${power} kW ${transmissionName}${drive==='awd'?' 4×4':drive==='fwd'?' – přední pohon':''} (${date.slice(0,4)})`;
  const base={id:`kodiaq-pilot-${key}`,name:label,kind:'technical-version',from:null,to:null,bodyType:'suv',
    engine:{fuel,displacementCc:cc??null,cylinders:4,powerKw:power,torqueNm:torque??null},transmission:{type,gears:gears??null},drive:drive??null,
    specificationScope:{market:markets.join(' / '),modelYear:Number(date.slice(0,4)),noteCs:note},
    availabilityEvidence:[{date,stage,markets,sources:[source]}],sources:[source],...extra};
  if(rs)base.equipmentLineIds=[g===g1?(stage==='facelift-2021'?'g1-rs-fl':'g1-rs'):'g2-rs'];
  base.fieldSources={};
  for(const field of ['bodyType','engine.fuel','engine.cylinders','engine.powerKw','transmission.type'])base.fieldSources[field]=[source];
  if(cc!=null)base.fieldSources['engine.displacementCc']=[source];
  if(torque!=null)base.fieldSources['engine.torqueNm']=[source];
  if(gears!=null)base.fieldSources['transmission.gears']=[source];
  if(drive!=null)base.fieldSources.drive=[source];
  for(const field of ['topSpeedKmh','acceleration0to100s','engine.combustionPowerKw','engine.electricPowerKw','engine.powerBasis'])if(field.split('.').reduce((o,k)=>o?.[k],base)!=null)base.fieldSources[field]=[source];
  // Match exactly the two existing 2017 rows and the existing 2024 mHEV row.
  const old=(g===g1?originalG1:originalG2).find(t=>date===(g===g1?'2017-05-29':'2024-10-24')&&t.engine?.fuel===fuel&&t.engine?.displacementCc===cc&&t.engine?.powerKw===power&&t.transmission?.type===type&&t.transmission?.gears===gears&&t.drive===drive);
  if(old){
    Object.assign(old,{availabilityEvidence:base.availabilityEvidence});
    // Keep its established measurements, names, scope and field provenance.
  }else g.trims.push(base);
  snapshotCounts[date]=(snapshotCounts[date]??0)+1;
  return old??base;
}
const row=(g,date,stage,source,values)=>{
  const [key,engineName,fuel,cc,power,torque,type,gears,drive,speed,accel,rs]=values;
  return version(g,{key,date,stage,source,engineName,fuel,cc,power,torque,type,gears,drive,rs,
    extra:{...(speed!=null?{topSpeedKmh:speed}:{}),...(accel!=null?{acceleration0to100s:accel}:{})}});
};
for(const r of [
 ['17-14-92-m6','1.4 TSI','petrol',1395,92,200,'manual',6,'fwd',190,10.5],
 ['17-14-110-m6-awd','1.4 TSI ACT','petrol',1395,110,250,'manual',6,'awd',197,9.8],
 ['17-14-110-d6','1.4 TSI ACT','petrol',1395,110,250,'dual-clutch',6,'fwd',198,9.6],
 ['17-14-110-d6-awd','1.4 TSI','petrol',1395,110,250,'dual-clutch',6,'awd',194,9.9],
 ['17-20-132-d7-awd','2.0 TSI','petrol',1984,132,320,'dual-clutch',7,'awd',207,8.0],
 ['17-tdi-110-d7','2.0 TDI','diesel',1968,110,340,'dual-clutch',7,'fwd',199,10.1],
 ['17-tdi-110-m6-awd','2.0 TDI','diesel',1968,110,340,'manual',6,'awd',197,9.7],
 ['17-tdi-110-d7-awd','2.0 TDI','diesel',1968,110,340,'dual-clutch',7,'awd',194,9.9],
 ['17-tdi-140-d7-awd','2.0 TDI','diesel',1968,140,400,'dual-clutch',7,'awd',210,8.6],
])row(g1,'2017-05-29','original',S.launch,r);
for(const r of [
 ['19-15-110-m6','1.5 TSI','petrol',1498,110,250,'manual',6,'fwd'],
 ['19-15-110-d7','1.5 TSI','petrol',1498,110,250,'dual-clutch',7,'fwd'],
 ['19-20-140-d7-awd','2.0 TSI','petrol',1984,140,320,'dual-clutch',7,'awd'],
 ['19-tdi-110-d7','2.0 TDI','diesel',1968,110,340,'dual-clutch',7,'fwd'],
 ['19-tdi-110-m6-awd','2.0 TDI','diesel',1968,110,340,'manual',6,'awd'],
 ['19-tdi-110-d7-awd','2.0 TDI','diesel',1968,110,360,'dual-clutch',7,'awd'],
 ['19-tdi-140-d7-awd','2.0 TDI','diesel',1968,140,400,'dual-clutch',7,'awd'],
])row(g1,'2019-03','original',S.mid,r); // PDF has several equipment tables: avoid mixing their performance/mass values.
row(g1,'2018-10-01','original',S.rs1,['18-rs-tdi-176','RS 2.0 BiTDI','diesel',1968,176,500,'dual-clutch',7,'awd',null,null,true]);
for(const r of [
 ['21-15-110-m6','1.5 TSI ACT','petrol',1498,110,250,'manual',6,'fwd',206,9.8],
 ['21-15-110-d7','1.5 TSI ACT','petrol',1498,110,250,'dual-clutch',7,'fwd',205,9.7],
 ['21-20-140-d7-awd','2.0 TSI','petrol',1984,140,320,'dual-clutch',7,'awd',216,7.5],
 ['21-tdi-110-d7','2.0 TDI','diesel',1968,110,360,'dual-clutch',7,'fwd',204,9.6],
 ['21-tdi-110-d7-awd','2.0 TDI','diesel',1968,110,360,'dual-clutch',7,'awd',200,9.6],
 ['21-tdi-147-d7-awd','2.0 TDI','diesel',1968,147,400,'dual-clutch',7,'awd',218,7.7],
])row(g1,'2021-06-28','facelift-2021',S.facelift,r);
row(g1,'2021-06-28','facelift-2021',S.rsFl,['21-rs-tsi-180','RS 2.0 TSI','petrol',1984,180,370,'dual-clutch',7,'awd',234,6.5,true]);
for(const r of [
 ['24-mhev-110','1.5 TSI mHEV','petrol-mhev',1498,110,250,'dual-clutch',7,'fwd',207,9.7],
 ['24-tsi-150-awd','2.0 TSI','petrol',1984,150,320,'dual-clutch',7,'awd',226,7.4],
 ['24-rs-tsi-195','RS 2.0 TSI','petrol',1984,195,400,'dual-clutch',7,'awd',231,6.3,true],
 ['24-tdi-110','2.0 TDI','diesel',1968,110,360,'dual-clutch',7,'fwd',205,9.6],
 ['24-tdi-142-awd','2.0 TDI','diesel',1968,142,400,'dual-clutch',7,'awd',220,7.8],
])row(g2,'2024-10-24','original',S.second,r);
version(g2,{key:'24-iv-150',date:'2024-10-24',stage:'original',source:S.second,engineName:'1.5 TSI iV – systémový výkon',fuel:'petrol-phev',cc:1498,power:150,torque:350,gears:6,drive:'fwd',extra:{
  engine:{fuel:'petrol-phev',displacementCc:1498,cylinders:4,powerKw:150,powerBasis:'system',combustionPowerKw:110,electricPowerKw:85,torqueNm:350},
  topSpeedKmh:210,acceleration0to100s:8.4,
  specificationScope:{market:'Europe',modelYear:2024,noteCs:`${note} Pouze pětimístná verze Selection; 150 kW a 350 Nm jsou systémové hodnoty, spalovací motor má 110 kW a elektromotor 85 kW.`}}});
version(g2,{key:'26-mhev-118-de',date:'2026-10-26',stage:'original',source:S.newDE,engineName:'1.5 TSI mHEV',fuel:'petrol-mhev',power:118,markets:['DE'],extra:{
  transmission:{type:'dual-clutch',gears:null},
  specificationScope:{market:'DE',modelYear:2026,noteCs:`${note} Nová německá nabídka 118 kW pro Selection a Sportline. Přesný počet stupňů, objem v cm³ a poháněná náprava nebyly pro novou verzi v tomto prameni uvedeny; nepřebíráme je ze starší verze 110 kW.`},
  equipmentLineIds:['g2-selection','g2-sportline']}});
version(g2,{key:'26-iv-200-cz',date:'2026-10-22',stage:'original',source:S.newCZ,engineName:'1.5 TSI iV – systémový výkon',fuel:'petrol-phev',power:200,torque:400,drive:'fwd',markets:['CZ'],extra:{
  engine:{fuel:'petrol-phev',cylinders:4,powerKw:200,powerBasis:'system',combustionPowerKw:130,electricPowerKw:85,torqueNm:400},
  transmission:null,equipmentLineIds:['g2-lk'],sources:[S.newCZ,S.newGlobal],
  specificationScope:{market:'CZ',modelYear:2026,noteCs:`${note} Nabídka 200 kW je potvrzena pro L&K; přední pohon a systémový moment 400 Nm potvrzuje mezinárodní zpráva ze stejného dne. Přesné převodové stupně a objem v cm³ zde zůstávají neověřené.`}}});
version(g2,{key:'26-rs-iv-200-de',date:'2026-10-26',stage:'original',source:S.newDE,engineName:'RS 1.5 TSI PHEV – systémový výkon',fuel:'petrol-phev',power:200,torque:400,rs:true,markets:['DE'],extra:{
  engine:{fuel:'petrol-phev',cylinders:4,powerKw:200,powerBasis:'system',combustionPowerKw:130,electricPowerKw:85,torqueNm:400},
  topSpeedKmh:215,acceleration0to100s:7.5,
  specificationScope:{market:'DE',modelYear:2026,noteCs:`${note} Německý pramen označuje tuto variantu RS a uvádí DSG, ale ne počet stupňů. Označení RS pro český trh z tohoto německého údaje nevyvozujeme.`}}});
// Correct provenance for multi-source fields rather than assigning every field to one document.
const cz200=g2.trims.find(t=>t.id==='kodiaq-pilot-26-iv-200-cz');
cz200.fieldSources.drive=[S.newGlobal];cz200.fieldSources['engine.torqueNm']=[S.newGlobal];
delete cz200.fieldSources['transmission.type'];
// These new 2026 variants do not inherit unconfirmed details from old engines.
const new118=g2.trims.find(t=>t.id==='kodiaq-pilot-26-mhev-118-de');
delete new118.engine.cylinders;delete new118.fieldSources['engine.cylinders'];
const de200=g2.trims.find(t=>t.id==='kodiaq-pilot-26-rs-iv-200-de');
de200.drive='fwd';de200.sources.push(S.newGlobal);de200.fieldSources.drive=[S.newGlobal];
// All new performance figures above are for the manufacturer's basic five-seat table.
for(const g of [g1,g2])for(const t of g.trims)if(t.id?.startsWith('kodiaq-pilot-')&&t.topSpeedKmh!=null&&t.availabilityEvidence[0].date!=='2026-10-26')t.specificationScope.noteCs+=' Dynamické údaje patří základní pětimístné verzi; sedmimístné hodnoty se mohou lišit.';
function family(fuel,cc,litres,powers,variant,sources,powerBasis){return {fuel,displacementCc:cc,displacementLitresNominal:litres,powerKwMin:Math.min(...powers),powerKwMax:Math.max(...powers),availablePowerKw:powers,variant,sources,...(powerBasis?{powerBasis}:{})};}
g1.engines=[
 family('petrol',1395,1.4,[92,110],'1.4 TSI; ACT podle konkrétní verze',[S.launch]),
 family('petrol',1498,1.5,[110],'1.5 TSI ACT',[S.mid,S.facelift]),
 family('petrol',1984,2,[132,140,180],'2.0 TSI; 180 kW pouze RS po modernizaci 2021',[S.launch,S.mid,S.rsFl]),
 family('diesel',1968,2,[110,140,147,176],'2.0 TDI; 176 kW BiTDI pouze původní RS',[S.launch,S.mid,S.facelift,S.rs1,S.topDiesel]),
];
g2.engines=[
 family('petrol-mhev',null,1.5,[110,118],'1.5 TSI mHEV; 118 kW doloženo pro DE od října 2026',[S.second,S.newDE]),
 family('petrol',1984,2,[150,195],'2.0 TSI; 195 kW RS',[S.second]),
 family('petrol-phev',null,1.5,[150,200],'1.5 TSI iV; systémový výkon, spalovací motor 110 / 130 kW',[S.second,S.newCZ,S.newDE],'system'),
 family('diesel',1968,2,[110,142],'2.0 TDI',[S.second]),
];
function equipment(g,id,name,year,stage,source,markets=['Europe'],kind='equipment-line',extra={}){
  (g.equipmentLines??=[]).push({id,name,kind,from:null,to:null,
    availabilityEvidence:[{date:String(year),stage,markets,sources:[source]}],sources:[source],
    noteCs:'Rok označuje doloženou nabídku nebo představení, nikoli potvrzený začátek a konec výroby této výbavy.',...extra});
}
g1.equipmentLines=[];g2.equipmentLines=[];
for(const name of ['Active','Ambition','Style'])equipment(g1,`g1-${name.toLowerCase()}`,name,2016,'original',S.firstCZ,['CZ']);
equipment(g1,'g1-sportline','Sportline',2017,'original',S.sportline);
equipment(g1,'g1-scout','Scout',2017,'original',S.scout,['CZ']);
equipment(g1,'g1-lk','Laurin & Klement',2018,'original',S.lk);
equipment(g1,'g1-rs','RS',2018,'original',S.rs1,['Europe'],'performance-line');
for(const name of ['Active','Ambition','Style','Sportline','Laurin & Klement','RS'])equipment(g1,`g1-${name==='RS'?'rs':name.toLowerCase().replaceAll(' ','-')}-fl`,name,2021,'facelift-2021',S.flLines,['Europe'],name==='RS'?'performance-line':'equipment-line');
equipment(g1,'g1-clever-fl','Clever',2021,'facelift-2021','https://www.skoda-media.de/press/detail/3716/',['DE'],'special-edition');
equipment(g2,'g2-selection','Selection',2024,'original',S.gen2Lines);
equipment(g2,'g2-sportline','Sportline',2024,'original',S.gen2Lines);
equipment(g2,'g2-rs','RS',2024,'original',S.gen2RS,['Europe'],'performance-line');
equipment(g2,'g2-top-selection','Top Selection',2026,'original',S.newCZ,['CZ']);
equipment(g2,'g2-lk','Laurin & Klement',2026,'original',S.newCZ,['CZ']);
equipment(g2,'g2-drive-pl','Drive',2025,'original','https://www.skoda.pl/news/skoda-aktualnosci/rozgosc-sie-w-skodzie-w-specjalnej-wersji-drive',['PL'],'special-edition');
for(const g of [g1,g2]){
 g.engineCoverage='partial';
 g.specificationScope={...g.specificationScope,market:'CZ / European manufacturer document snapshots',noteCs:'Dvě konstrukční generace; modernizace 2021 patří do první generace. Výbavové řady jsou odděleny od technických verzí. Soupis vychází z datovaných pramenů výrobce; přesné výrobní intervaly, nabídka mimo Evropu a všechny akční edice nejsou úplně ověřeny.'};
 g.sources=[...new Set([...g.sources,...g.engines.flatMap(e=>e.sources),...g.trims.flatMap(t=>t.sources),...g.equipmentLines.flatMap(e=>e.sources)])];
}
g1.facelift[0].sources=[...new Set([...g1.facelift[0].sources,S.flLines,S.facelift])];
card.sources=[...new Set([...card.sources,...g1.sources,...g2.sources,S.newCZ])];
card.needsReview=card.needsReview.filter(r=>!/^generations\[[01]\]\.engines\[/.test(r.field)&&!['generations.trims.availabilityEvidence','generations.equipmentLines'].includes(r.field));
card.needsReview.push({field:'generations.trims.availabilityEvidence',reason:'Datované nabídky nejsou výrobní intervaly. Ještě ověřit měsíce uvedení a ukončení jednotlivých kombinací, počty sedadel a trhy.'},{field:'generations.equipmentLines',reason:'Výbavy a vybrané akční edice jsou doloženy po etapách; seznam všech národních edic není prohlášen za úplný.'});
writeFileSync(file,JSON.stringify(cards,null,2)+'\n');
writeFileSync('analysis/codex/kodiaq-pilot-review.json',JSON.stringify({asOf:'2026-10-31',scope:'CZ and European manufacturer-source snapshots; not a worldwide/year-by-year completeness certification',generations:2,facelifts:1,engineFamilies:[g1.engines.length,g2.engines.length],technicalVersionRows:[g1.trims.length,g2.trims.length],equipmentLineRows:[g1.equipmentLines.length,g2.equipmentLines.length],snapshotCounts,sources:S,
 remaining:['Exact production start/end months for each technical combination remain unknown; availabilityEvidence supplies dated observations instead.', 'Seven-seat, equipment-dependent mass/performance combinations are not exhaustively expanded.', '2026 mHEV 118 kW: DE confirmed, Czech availability/precise gearbox and drive not independently confirmed.', '200 kW PHEV: CZ L&K confirmed; DE RS confirmed separately. New gearbox gear count and exact displacement not copied from the older 150 kW version.', 'Regional special editions and engines outside Europe require a separate rollout; Kodiaq GT remains its existing separate model identity.', 'Web PDF screenshot calls returned no viewable image payload and local Poppler/Python were unavailable; column mappings were checked against extracted tables and manufacturer prose.'],
 equipmentSchema:{field:'generations[].equipmentLines[]',fields:['id','name','kind','from','to','availabilityEvidence[{date,stage,markets,sources}]','sources','noteCs'],dateRule:'from/to are optional confirmed production endpoints; absence means unknown. availabilityEvidence is a source-dated offer/announcement, never a continuous interval.',rsRule:'RS is a performance-line linked via trims[].equipmentLineIds to documented technical configurations, not a generation.'}},null,2)+'\n');
console.log(JSON.stringify({technicalVersionRows:[g1.trims.length,g2.trims.length],equipmentLineRows:[g1.equipmentLines.length,g2.equipmentLines.length],snapshotCounts}));
