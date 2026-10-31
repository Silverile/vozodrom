// Additive, repeatable batch. Run at repository root, then regenerate --make=skoda.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const file='src/data/catalog/model-cards/skoda.json';
const reportFile='analysis/codex/popular-batch1-review.json';
const targets=['octavia','fabia','superb','105-120-125','felicia'];
const requested=[['skoda','octavia'],['skoda','fabia'],['volkswagen','golf'],['skoda','superb'],['volkswagen','passat'],['skoda','105-120-125'],['ford','focus'],['hyundai','i30'],['skoda','felicia'],['volkswagen','transporter']];
const ref=fs.existsSync(reportFile)?read(reportFile).baselineCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const head=p=>execFileSync('git',['show',`${ref}:${p}`],{encoding:'utf8',maxBuffer:64*1024*1024});
const original=JSON.parse(head(file));
const beforeIndex=JSON.parse(head('src/data/model-cards-index.json'));
const cards=read(file);
// A lexical scan permits replacement of selected cards without changing a byte in unrelated cards.
export function objects(raw){
 let quote=false,escape=false,depth=0,start=-1;const found=[];
 for(let i=0;i<raw.length;i++){
  const c=raw[i];if(quote){if(escape)escape=false;else if(c==='\\')escape=true;else if(c==='"')quote=false;continue;}
  if(c==='"'){quote=true;continue;}if(c==='{'){if(depth++===0)start=i;}else if(c==='}'&&--depth===0)found.push({start,end:i+1,raw:raw.slice(start,i+1),value:JSON.parse(raw.slice(start,i+1))});
 }return found;
}
const S={
 fabia2:'https://www.allcarcentral.com/Skoda_pdf/Skoda_Fabia_Catalogue_ENG_2008.pdf',
 fabia3:'https://cdn.skoda-storyboard.com/2018/08/TD-FABIA-petrol_EN.pdf',
 superb3:'https://cdn.skoda-storyboard.com/2016/05/TD-SUPERB-en.pdf',
 superb4:'https://www.skoda-storyboard.com/en/press-kits/the-all-skoda-superb-press-kit-2/powertrains-debut-of-mild-hybrid-plug-in-hybrid-with-up-to-120-kilometres-of-electric-range/',
 superbCZ:'https://www.skoda-auto.cz/novinky/novinky-detail/2024-02-20-nova-skoda-superb-ma-cesky-cenik',
 superbPHEV:'https://www.skoda-auto.cz/novinky/novinky-detail/2024-04-16-skoda-superb-nyni-dostupna-s-dalsimi-pohonnymi-jednotkami-vcetne-noveho-plug-in-hybridu',
 octavia4:'https://cdn.skoda-storyboard.com/2025/06/TD-Octavia-en_3066a520.pdf',
 octaviaCZ:'https://www.skoda-auto.cz/novinky/novinky-detail/2024-07-18-modernizovana-skoda-octavia-ma-kompletni-cesky-cenik-na-trh-vstupuje-sportovni-varianta-rs',
 fabiaCZ:'https://autos.skoda-auto.cz/modely/fabia',
 fabiaTour:'https://www.skoda-auto.cz/_doc/b0aa0eb4-90e0-4637-b3d5-d97d978cecca',
 felicia:'https://www.skoda-storyboard.com/en/press-releases/celebrating-30-years-of-the-skoda-felicia-the-brands-first-model-under-the-vw-groups-wing/',
 fabiaHistory:'https://www.skoda-storyboard.com/cs/tiskove-zpravy-archiv/skoda-auto-vyrobila-jiz-5-milionu-vozu-rady-fabia-sveho-zakladniho-modelu/',
 fabiaLaunch:'https://www.skoda-storyboard.com/cs/tiskove-mapy/skoda-fabia-tiskova-mapa/nova-skoda-fabia-je-vetsi-uspornejsi-a-bezpecnejsi/',
 fabia130:'https://www.skoda-storyboard.com/cs/tiskove-zpravy-archiv/na-cesky-trh-vstupuje-historicky-nejrychlejsi-skoda-fabia-inspirovana-motorsportem/',
 fabia130TD:'https://webapps.skoda-auto.sk/Cenniky-a-katalogy/techdata/Skoda_Fabia-130_technickeudaje.pdf?202604081017=',
 superb4TD:'https://skoda.metrotehnica.ro/files/3117/1222/0129/TD-Superb-en_87b42ad4.pdf',
 octavia3:'https://cdn.skoda-storyboard.com/2017/03/170307-Geneva-2017-Press-Kit.pdf',
 octavia2:'https://www.aastaauto.ee/files/modelfiles/Octavia_kataloog_2011_ENG.pdf',
 superb2:'https://static.cream.sk/araver.sk/webroots/www/content/mediagallery/araver_system/file/article/file/11172.pdf',
};
const get=(slug,gi)=>cards.find(c=>c.lineSlug===slug).generations[gi];
const changes=[];
// Idempotence: start each target from its reviewed baseline, never erase intervening edits silently.
if(fs.existsSync(reportFile))for(const slug of [...targets,'kodiaq']){
 const current=cards.find(c=>c.lineSlug===slug);
 assert.equal(createHash('sha256').update(JSON.stringify(current)).digest('hex'),read(reportFile).resultHashes[slug],`Intervening edit: ${slug}; review before replay`);
}
for(const slug of [...targets,'kodiaq'])cards[cards.findIndex(c=>c.lineSlug===slug)]=structuredClone(original.find(c=>c.lineSlug===slug));
function evidence(date,stage,markets,source,observed=false){return {...(date?{date}:{}),...(observed?{observedAt:'2026-10-31'}:{}),stage,markets,sources:[source]};}
function version(slug,gi,date,stage,source,{name,fuel,cc,power,type,gears,drive,body='hatchback',cylinders=4,markets=['Europe'],extra={}}){
 const g=get(slug,gi);const id=`popular-batch1-${slug}-${gi}-${date}-${g.trims.length}`;
 const t={id,name:`${name} ${power} kW – ${gears}st. ${type==='manual'?'manuál':type==='dual-clutch'?'DSG':'automat'}${drive==='awd'?' 4×4':''} (${date})`,kind:'technical-version',from:null,to:null,bodyType:body,
  engine:{fuel,displacementCc:cc,cylinders,powerKw:power,...extra},transmission:{type,gears},drive,
  specificationScope:{market:markets.join(' / '),modelYear:Number(date.slice(0,4)),noteCs:'Doložená konfigurace k datu pramene, nikoli úplný výrobní interval. Rozsah trhu podle pramene; celoevropský list nepotvrzuje každou českou výbavu.'},
  availabilityEvidence:[evidence(date,stage,markets,source)],sources:[source],fieldSources:{}};
 for(const k of ['bodyType','engine.fuel','engine.displacementCc','engine.cylinders','engine.powerKw','transmission.type','transmission.gears','drive',...Object.keys(extra).map(k=>`engine.${k}`)])t.fieldSources[k]=[source];
 // Keep established rows; attach dated evidence instead of duplicating a configuration.
 const old=g.trims.find(t=>t.bodyType===body&&t.engine?.fuel===fuel&&t.engine?.displacementCc===cc&&t.engine?.powerKw===power&&t.transmission?.type===type&&t.transmission?.gears===gears&&t.drive===drive);
 if(old){(old.availabilityEvidence??=[]).push(...t.availabilityEvidence);return old;}
 g.trims.push(t);return t;
}
function equipment(slug,gi,names,date,stage,source,markets=['CZ'],observed=false,note=''){
 const g=get(slug,gi);g.equipmentLines??=[];
 for(const name of names)g.equipmentLines.push({id:`batch1-g${gi}-${name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`,name,from:null,to:null,markets,
  noteCs:note||'Doloženo pramenem; úplný interval dostupnosti není z tohoto záznamu odvozován.',
  availabilityEvidence:[evidence(date,stage,markets,source,observed)],sources:[source]});
}
// Fabia II: English manufacturer brochure printed 04/2009, pp. 32–33, not the host filename's 2008.
for(const body of ['hatchback','kombi'])for(const [name,fuel,cc,power,cylinders] of [
 ['1.2 HTP','petrol',1198,44,3],['1.2 HTP 12V','petrol',1198,51,3],['1.4 16V','petrol',1390,63,4],['1.6 16V','petrol',1598,77,4],['1.4 TDI PD','diesel',1422,51,3],['1.4 TDI PD','diesel',1422,59,3],['1.9 TDI PD','diesel',1896,77,4]]){
 version('fabia',1,'2009-04','original',S.fabia2,{name,fuel,cc,power,cylinders,type:'manual',gears:5,drive:'fwd',body});
 if(cc===1598)version('fabia',1,'2009-04','original',S.fabia2,{name,fuel,cc,power,cylinders,type:'automatic',gears:6,drive:'fwd',body});
}
for(const body of ['hatchback','kombi'])for(const [name,power,type,gears] of [['1.0 MPI',55,'manual',5],['1.0 TSI',70,'manual',5],['1.0 TSI',81,'manual',6],['1.0 TSI',81,'dual-clutch',7]])
 version('fabia',2,'2018-08-09','facelift-2018',S.fabia3,{name,fuel:'petrol',cc:999,power,cylinders:3,type,gears,drive:'fwd',body});
equipment('fabia',2,['Active','Ambition','Black'],null,'facelift-2018',S.fabiaTour,['CZ'],true,'Český ceník Fabia Combi Tour pouze pro skladové vozy. Nejde o doklad aktuální výroby ani nabídky hatchbacku; datum vydání není doloženo.');
equipment('fabia',3,['Ambition','Style'],'2021-05-04','original',S.fabiaLaunch);
equipment('fabia',3,['Easy','Selection','Top Selection','Monte Carlo','Fabia 130'],null,'original',S.fabiaCZ,['CZ'],true,'Nabídka na české modelové stránce při kontrole 31. 10. 2026; nejde o počátek prodeje.');
const fabia130=version('fabia',3,'2025-10-09','original',S.fabia130,{name:'Fabia 130 1.5 TSI',fuel:'petrol',cc:1498,power:130,type:'dual-clutch',gears:7,drive:'fwd',markets:['CZ']});
fabia130.sources.push(S.fabia130TD);
for(const field of ['engine.displacementCc','engine.cylinders','drive'])fabia130.fieldSources[field]=[S.fabia130TD];
fabia130.equipmentLineIds=[get('fabia',3).equipmentLines.find(e=>e.name==='Fabia 130').id];
fabia130.specificationScope.noteCs+=' Česká objednávková nabídka od října 2025; tisková zpráva předpokládá první dodávky začátkem roku 2026. Technické údaje doplněny slovenským továrním listem.';
// Superb III liftback: manufacturer sheet dated 29 May 2017, FWD tables only.
for(const [cc,power,type,gears] of [[1598,88,'manual',6],[1598,88,'dual-clutch',7],[1968,110,'manual',6],[1968,110,'dual-clutch',6],[1968,140,'manual',6],[1968,140,'dual-clutch',6]])
 version('superb',2,'2017-05-29','original',S.superb3,{name:`${cc===1598?'1.6':'2.0'} TDI`,fuel:'diesel',cc,power,type,gears,drive:'fwd'});
for(const [cc,power,type,gears] of [[1395,92,'manual',6],[1395,110,'manual',6],[1395,110,'dual-clutch',7],[1798,132,'manual',6],[1798,132,'dual-clutch',7],[1984,162,'dual-clutch',6]])
 version('superb',2,'2017-05-29','original',S.superb3,{name:`${cc===1395?'1.4':cc===1798?'1.8':'2.0'} TSI`,fuel:'petrol',cc,power,type,gears,drive:'fwd'});
// Czech launch confirms both body styles and transmission/drive of these three engines.
for(const body of ['hatchback','kombi'])for(const [name,fuel,cc,power,drive] of [['1.5 TSI mHEV','petrol-mhev',1498,110,'fwd'],['2.0 TDI','diesel',1968,110,'fwd'],['2.0 TDI','diesel',1968,142,'awd']])
 version('superb',3,'2024-02-20','original',S.superbCZ,{name,fuel,cc,power,type:'dual-clutch',gears:7,drive,body,markets:['CZ']});
version('superb',3,'2024-08-28','original',S.superb4,{name:'1.5 TSI iV',fuel:'petrol-phev',cc:1498,power:150,type:'dual-clutch',gears:6,drive:'fwd',body:'kombi',extra:{powerBasis:'system',combustionPowerKw:110}});
version('superb',3,'2024-03-08','original',S.superb4TD,{name:'2.0 TSI',fuel:'petrol',cc:1984,power:195,type:'dual-clutch',gears:7,drive:'awd'});
for(const t of get('superb',3).trims.filter(t=>t.id?.startsWith('popular-batch1-'))){
 t.sources=[...new Set([...t.sources,S.superb4TD])];
 for(const field of ['engine.displacementCc','engine.cylinders'])t.fieldSources[field]=[S.superb4TD];
}
equipment('superb',3,['Selection'],'2024-02-20','original',S.superbCZ);
equipment('superb',3,['Laurin & Klement'],'2024-04-16','original',S.superbPHEV);
// Octavia IV facelift, primary technical tables dated 23 June 2025 (liftback and estate).
for(const body of ['hatchback','kombi'])for(const [name,fuel,cc,power,type,gears,drive] of [
 ['1.5 TSI','petrol',1498,85,'manual',6,'fwd'],['1.5 TSI mHEV','petrol-mhev',1498,85,'dual-clutch',7,'fwd'],
 ['1.5 TSI','petrol',1498,110,'manual',6,'fwd'],['1.5 TSI mHEV','petrol-mhev',1498,110,'dual-clutch',7,'fwd'],
 ['2.0 TSI','petrol',1984,150,'dual-clutch',7,'awd'],['2.0 TDI','diesel',1968,85,'manual',6,'fwd'],['2.0 TDI','diesel',1968,110,'dual-clutch',7,'fwd']])
 version('octavia',3,'2025-06-23','facelift-2024',S.octavia4,{name,fuel,cc,power,type,gears,drive,body});
equipment('octavia',3,['Essence','Selection','Exclusive Selection','Sportline','RS'],'2024-07-18','facelift-2024',S.octaviaCZ);
for(const body of ['hatchback','kombi']){
 const t=version('octavia',3,'2024-07-18','facelift-2024',S.octaviaCZ,{name:'RS 2.0 TSI',fuel:'petrol',cc:1984,power:195,type:'dual-clutch',gears:7,drive:'fwd',body,markets:['CZ']});
 t.equipmentLineIds=[get('octavia',3).equipmentLines.find(e=>e.name==='RS').id];
 t.sources.push(S.octavia4);for(const field of ['engine.displacementCc','engine.cylinders'])t.fieldSources[field]=[S.octavia4];
}
// Octavia III: selected FWD facelift launch tables, 7 March 2017; G-TEC table is Combi only.
for(const [name,cc,power,type,gears,cylinders] of [['1.2 TSI',1197,63,'manual',5,4],['1.0 TSI',999,85,'manual',6,3],['1.0 TSI',999,85,'dual-clutch',7,3],['1.4 TSI',1395,110,'manual',6,4],['1.4 TSI',1395,110,'dual-clutch',7,4],['1.8 TSI',1798,132,'manual',6,4],['1.8 TSI',1798,132,'dual-clutch',7,4]])
 version('octavia',2,'2017-03-07','facelift-2017',S.octavia3,{name,fuel:'petrol',cc,power,type,gears,cylinders,drive:'fwd'});
for(const [cc,power,type,gears] of [[1598,66,'manual',5],[1598,85,'manual',5],[1598,85,'dual-clutch',7],[1968,110,'manual',6],[1968,110,'dual-clutch',6]])
 version('octavia',2,'2017-03-07','facelift-2017',S.octavia3,{name:`${cc===1598?'1.6':'2.0'} TDI`,fuel:'diesel',cc,power,type,gears,drive:'fwd'});
for(const [fuel,cc,power,type,drive] of [['petrol',1984,169,'manual','fwd'],['petrol',1984,169,'dual-clutch','fwd'],['diesel',1968,135,'manual','fwd'],['diesel',1968,135,'dual-clutch','fwd'],['diesel',1968,135,'dual-clutch','awd']])
 version('octavia',2,'2017-03-07','facelift-2017',S.octavia3,{name:`RS 2.0 ${fuel==='diesel'?'TDI':'TSI'}`,fuel,cc,power,type,gears:6,drive});
for(const [type,gears] of [['manual',6],['dual-clutch',7]])version('octavia',2,'2017-03-07','facelift-2017',S.octavia3,{name:'1.4 TSI G-TEC',fuel:'petrol-cng',cc:1395,power:81,type,gears,drive:'fwd',body:'kombi'});
// Sourced engine-family observations. Ranges are deliberately NOT advertised as all-time limits.
for(const slug of targets)for(const [gi,g] of cards.find(c=>c.lineSlug===slug).generations.entries()){
 const groups=new Map();
 for(const t of g.trims??[]){const e=t.engine;if(!e?.powerKw||!e.displacementCc)continue;
  const nominal=Math.round(e.displacementCc/100)/10;const key=`${e.fuel}|${nominal}`;
  const group=groups.get(key)??{fuel:e.fuel,nominal,rows:[]};group.rows.push(t);groups.set(key,group);
 }
 // Primary brochure family observations do not invent gearbox/drive/date combinations.
 const observations=slug==='octavia'&&gi===1?[
  ['petrol',1.4,[59,90],S.octavia2],['petrol',1.6,[75],S.octavia2],['petrol',1.8,[118],S.octavia2],
 ]:slug==='superb'&&gi===1?[
  ['petrol',1.8,[118],S.superb2],['petrol',2,[147],S.superb2],['petrol',3.6,[191],S.superb2],['diesel',1.6,[77],S.superb2],['diesel',2,[103,125],S.superb2],
 ]:[];
 for(const [fuel,nominal,powers,source] of observations){
  const key=`${fuel}|${nominal}`,group=groups.get(key)??{fuel,nominal,rows:[]};
  group.rows.push(...powers.map(powerKw=>({engine:{powerKw},sources:[source]})));groups.set(key,group);
 }
 g.engines??=[];
 for(const {fuel,nominal,rows} of groups.values()){
  let e=g.engines.find(e=>e.fuel===fuel&&(e.displacementLitresNominal===nominal||Math.abs((e.displacementCc??0)/1000-nominal)<0.05));
  if(!e){e={fuel,displacementCc:null,displacementLitresNominal:nominal,powerKwMin:null,powerKwMax:null,variant:null};g.engines.push(e);}
  if(e.powerKwMin!=null||e.powerKwMax!=null){
   // Existing 2.0 TSI 4x4 family is specifically AWD: do not claim the FWD RS belongs to it.
   if(slug==='octavia'&&gi===3&&fuel==='petrol'&&nominal===2){
    const rs=rows.find(t=>t.engine.powerKw===195);g.engines.push({fuel,displacementCc:1984,displacementLitresNominal:2,powerKwMin:195,powerKwMax:195,variant:'RS 2.0 TSI – přední pohon',availablePowerKw:[195],powerRangeCoverage:'documented-versions-only',sources:rs.sources,fieldSources:{powerKwMin:rs.sources,powerKwMax:rs.sources}});
   }continue;
  }
  const powers=[...new Set(rows.map(t=>t.engine.powerKw))].sort((a,b)=>a-b);
  const sources=[...new Set(rows.flatMap(t=>t.fieldSources?.['engine.powerKw']??t.sources??[]))];
  Object.assign(e,{powerKwMin:powers[0],powerKwMax:powers.at(-1),availablePowerKw:powers,powerRangeCoverage:'documented-versions-only',
   variant:`${nominal.toFixed(1).replace('.',',')} ${({'petrol':'benzin','diesel':'nafta','petrol-cng':'benzin/CNG','petrol-mhev':'benzin mHEV','petrol-phev':'benzin PHEV'})[fuel]??fuel}; doložené verze: ${powers.join(' / ')} kW, nejde o úplný historický rozsah.`,sources,
   fieldSources:{powerKwMin:sources,powerKwMax:sources,availablePowerKw:sources}});
  if(rows.every(t=>t.engine.powerStandard==='ISO'))e.powerStandard='ISO';
  if(fuel==='petrol-phev')e.powerBasis='system';
 }
}
// Felicia all three production engine families independently confirmed by factory retrospective.
for(const [nominal,powers] of [[1.3,[40,50]],[1.6,[55]],[1.9,[47]]]){
 const e=get('felicia',0).engines.find(e=>e.displacementLitresNominal===nominal);
 Object.assign(e,{powerKwMin:powers[0],powerKwMax:powers.at(-1),availablePowerKw:powers,powerRangeCoverage:'manufacturer-retrospective',
  variant:`${nominal.toFixed(1).replace('.',',')} ${e.fuel==='diesel'?'nafta':'benzin'}; sériové motory podle výrobcova přehledu Felicia 1994–2001.`,sources:[S.felicia],fieldSources:{powerKwMin:[S.felicia],powerKwMax:[S.felicia],availablePowerKw:[S.felicia]}});
}
equipment('felicia',0,['Laurin & Klement'],'1995','original',S.felicia,['Europe'],false,'Tovární historický přehled uvádí zavedení v roce 1995; český trh ani úplný interval nepotvrzuje.');
const f=get('felicia',0).facelift.find(f=>f.year===1998);
const oldNote=f.note;f.note=(oldNote?`${oldNote} `:'')+'V únoru 1998 se změnil vzhled podle soudobé Octavie; délka vzrostla o 28 mm, u kombi o 32 mm.';
f.sources=[...new Set([...(f.sources??[]),S.felicia])];
changes.push({slug:'felicia',path:'generations.0.facelift.0.note',before:oldNote,after:f.note,sources:[S.felicia],reason:'Doplnění výrobce a měsíce faceliftu; původní text zachován.'});
get('kodiaq',0).drawingStage=0; // Human explicitly confirmed the existing drawing shows pre-facelift.
const counts=c=>({generations:c.generations.length,facelifts:c.generations.reduce((n,g)=>n+(g.facelift??g.facelifts??[]).length,0),engines:c.generations.reduce((n,g)=>n+(g.engines??[]).length,0),enginesWithPower:c.generations.reduce((n,g)=>n+(g.engines??[]).filter(e=>e.powerKwMin!=null&&e.powerKwMax!=null).length,0),versions:c.generations.reduce((n,g)=>n+(g.trims??[]).length,0),equipmentLines:c.generations.reduce((n,g)=>n+(g.equipmentLines??[]).length,0)});
let raw=fs.readFileSync(file,'utf8');
for(const o of objects(raw).reverse())if([...targets,'kodiaq'].includes(o.value.lineSlug)){
 const c=cards.find(c=>c.lineSlug===o.value.lineSlug);const pretty=JSON.stringify(c,null,2).replace(/\n/g,'\n  ');
 raw=raw.slice(0,o.start)+pretty+raw.slice(o.end);
}
fs.writeFileSync(file,raw);
const report={baselineCommit:ref,reviewedAt:'2026-10-31',status:'partial',ownedTargets:targets,
 sourceDocuments:S,changes,
 resultHashes:Object.fromEntries([...targets,'kodiaq'].map(slug=>[slug,createHash('sha256').update(JSON.stringify(cards.find(c=>c.lineSlug===slug))).digest('hex')])),
 lines:requested.map(([make,slug])=>({make,slug,status:make==='skoda'?'partial-sourced-enrichment':'deferred-ownership',before:counts(beforeIndex[make][slug]),after:counts(make==='skoda'?cards.find(c=>c.lineSlug===slug):beforeIndex[make][slug])})),
 gaps:[],
 generationReview:[{make:'skoda',slug:'fabia',generation:0,path:'generations.0.to',existing:2009,manufacturer:2008,sources:[S.fabiaHistory],action:'Preserved pending review; any boundary change also needs statistics/date semantics review.'}],
 uiIntegration:['Claude: powerSummary in src/app/katalog/[brand]/[model]/page.tsx should treat powerRangeCoverage=documented-versions-only as sample=true, even when engine min/max are set. Add this optional field to CardEngine. Source range is an observed subset, not a proved historical minimum/maximum. Engine variant notes already make the limitation visible in the engine table.'],
 limitations:['Not an exhaustive historical engine/gearbox/CZ equipment inventory. Only documented snapshots added; null production intervals retained.','International brochure data do not establish CZ equipment availability. Felicia L&K marked Europe, not CZ.','105/120/125 facelift chronology and historical equipment still need a primary-source audit.','Five model lines in three files under src/data/model-cards/ are outside granted ownership; no shadow copies created.','Superb IV 150 kW TSI was only announced for later in the 2024 source; no continuous availability inferred. Historical Octavia/Fabia/Superb engines still require follow-up.','No drawing look inferred from model year. Only human-confirmed Kodiaq I drawingStage=0.']};
for(const slug of targets)for(const [generation,g] of cards.find(c=>c.lineSlug===slug).generations.entries())report.gaps.push({make:'skoda',slug,generation,enginesWithoutPower:(g.engines??[]).filter(e=>e.powerKwMin==null||e.powerKwMax==null).map(e=>({fuel:e.fuel,litres:e.displacementLitresNominal})),noEquipmentLines:!g.equipmentLines?.length,faceliftCompleteness:'not-exhaustively-verified'});
fs.writeFileSync(reportFile,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.lines,null,2));
