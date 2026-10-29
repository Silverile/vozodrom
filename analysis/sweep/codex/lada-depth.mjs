import fs from 'node:fs';
import assert from 'node:assert/strict';
const root='analysis/sweep/codex/';
const cardPath='src/data/catalog/model-cards/lada.json';
const reportPath=root+'lada.json';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,d)=>fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');
if(process.argv.includes('--verify')) {
 const b=read(root+'LADA-DEPTH-BASELINE.json'),r=read(reportPath),cards=read(cardPath);
 for(const [key,value] of Object.entries(b.report))if(Array.isArray(value))assert.deepEqual(r[key].slice(0,value.length),value,'Old report changed: '+key);
 const replay=structuredClone(b.cards),changes=r.cardFixesApplied.slice(b.report.cardFixesApplied.length);
 for(const c of changes){assert(c.sources.length>=2);const card=replay.find(x=>x.lineSlug===c.lineSlug);let obj=card;const keys=c.path.replace(/\[(\d+)\]/g,'.$1').split('.');for(const k of keys.slice(0,-1))obj=obj[k];const key=keys.at(-1);assert.deepEqual(obj[key]??null,c.from);obj[key]=structuredClone(c.to);}
 assert.deepEqual(cards,replay,'Unlogged card change');
 const n=cards.find(x=>x.lineSlug==='niva').generations[0];
 assert.equal(n.trims.length,b.cards.find(x=>x.lineSlug==='niva').generations[0].trims.length+1);
 assert.equal(n.trims.at(-1).topSpeedKmh,142);assert.equal(n.trims.at(-1).dimensionsMm.wheelbase,null);
 assert.equal(cards.find(x=>x.lineSlug==='2101').generations[0].to,1988);
 console.log(`PASS Lada: ${changes.length} replayed logged changes; old report arrays preserved; Niva trim and 2101 chronology assertions pass.`);
 process.exit(0);
}
assert(!fs.existsSync(root+'LADA-DEPTH-BASELINE.json'),'Baseline already exists; use --verify');
const cards=read(cardPath),report=read(reportPath);
write(root+'LADA-DEPTH-BASELINE.json',{cards,report});
const originalCount=report.cardFixesApplied.length;
function set(slug,path,value,sources,reason){const card=cards.find(x=>x.lineSlug===slug);let obj=card;const keys=path.replace(/\[(\d+)\]/g,'.$1').split('.');for(const k of keys.slice(0,-1))obj=obj[k];const key=keys.at(-1),from=obj[key]??null;if(JSON.stringify(from)===JSON.stringify(value))return;obj[key]=value;report.cardFixesApplied.push({lineSlug:slug,path,from,to:value,sources,reason});}
const history=['https://www.lada-image.ru/about/for_press/news/lada_50_let_istorii_/','https://en.wikipedia.org/w/index.php?title=VAZ-2101&oldid=1380727946'];
const classic=cards.find(x=>x.lineSlug==='2101');
set('2101','generations[0].to',1988,history,'Family endpoint includes derived variants; not an assertion that the unchanged base 2101 continued until 1988.');
set('2101','generations[0].productionStatus','ended',history,'Historical production family ended in 1988.');
set('2101','generations[0].specificationScope.variant','2101 včetně odvozených verzí',history,'Explicit family scope prevents confusing the 1988 family endpoint with the earlier end of the base variant.');
set('2101','summaryCs',classic.summaryCs+' Rodina včetně odvozených verzí se vyráběla v letech 1970–1988; konec výroby základního provedení 2101 je dřívější.',history,'Distinguish base model and whole-family production interval.');
for(const path of ['sources','generations[0].sources']){const arr=path==='sources'?classic.sources:classic.generations[0].sources;set('2101',path,[...new Set([...arr,...history])],history,'Attach manufacturer-group history and independent revision evidence.');}
set('2101','needsReview',classic.needsReview.filter(x=>x.field!=='generations[0].to'),history,'Remove resolved unknown endpoint review; retain unrelated unknowns.');
const primary='https://lada-export.com/wp-content/uploads/2025/12/niva-legend-th-1.pdf';
const independent='https://auto.ru/catalog/cars/vaz/niva_legend/22796942/22797020/specifications/';
const brochure='https://static.lada.ru/files/brochures/models_pdf/2022/LADA_Niva_Legend-brochures.pdf';
const tech=[primary,independent,brochure];
const trim={name:'Niva Legend 1.7 5MT – třídveřová exportní technická verze',kind:'technical-version',from:null,to:null,bodyType:'suv',engine:{fuel:'petrol',displacementCc:1690,cylinders:4,powerKw:61,powerStandard:null,torqueNm:129},transmission:{type:'manual',gears:5},drive:'awd',dimensionsMm:{length:null,width:1680,height:1640,wheelbase:null},massKg:1285,massBasis:'Pohotovostní hmotnost / curb weight podle exportní technické tabulky; započtení řidiče není uvedeno.',topSpeedKmh:142,acceleration0to100s:17,consumptionL100:9.9,consumptionCycle:'GOST R 41.101–99 / UNECE R101, kombinovaný cyklus podle exportního technického listu.',consumptionKwh100:null,rangeKm:null,rangeCycle:null,specificationScope:{market:'Export / Russia; conventional 3-door Legend 1.7',modelYear:null,noteCs:'Vybraná technická verze 1.7 z exportního listu ©2025, ověřená s nezávislým katalogem. Rok dokumentu není ověřený modelový rok. Nejde o Bronto ani modernizaci 1.8 z roku 2026. Délka 3640–3740 mm závisí na provedení; rozvor exportní list uvádí 2220 mm, nezávislý katalog a starší brožura 2200 mm, proto obojí zůstává null.'},sources:tech};
trim.fieldSources=Object.fromEntries(['engine.fuel','engine.displacementCc','engine.cylinders','engine.powerKw','engine.torqueNm','transmission.type','transmission.gears','drive','dimensionsMm.width','dimensionsMm.height','massKg','massBasis','topSpeedKmh','acceleration0to100s','consumptionL100','consumptionCycle'].map(k=>[k,[primary,independent]]));
const niva=cards.find(x=>x.lineSlug==='niva');
set('niva','generations[0].trims',[...niva.generations[0].trims,trim],tech,'Add ordinary Legend technical version separately from pre-existing Bronto; two-source agreement on populated technical fields.');
const newReview=['from','to','engine.powerStandard','dimensionsMm.length','dimensionsMm.wheelbase','specificationScope.modelYear'].map(field=>({field:'generations[0].trims[1].'+field,reason:'Neověřený nebo rozporný údaj pro tuto přesnou exportní technickou verzi; viz technický rozsah a prameny.'}));
set('niva','needsReview',[...niva.needsReview,...newReview],tech,'Record unresolved production bounds, source conflicts and power/model-year conventions for the new technical version.');
for(const path of ['sources','generations[0].sources']){const arr=path==='sources'?niva.sources:niva.generations[0].sources;set('niva',path,[...new Set([...arr,...tech])],tech,'Attach checked technical sources.');}
report.conflicts.push({where:'niva.generations[0].trims[1].dimensionsMm.wheelbase',values:{[primary]:2220,[independent]:2200,[brochure]:2200},kept:null,reason:'Conflicting exact technical sheet; do not silently correct the source or mix years.'});
report.openQuestions.push('DEPTH round 5: only 2101 family chronology and a conventional Niva Legend 1.7 technical version were deepened. Other Lada models, generation/facelift splits, European market engine ranges and all photo matching remain unreviewed. 2102 1971–1986 found in independent histories, but no checked vehicle-manufacturer primary chronology in this pass; left unchanged.');
report.openQuestions.push('Niva Legend export technical sheet gives wheelbase 2220 mm versus 2200 mm in independent catalogue and older manufacturer brochure. New technical trim keeps wheelbase null; document copyright year is not treated as model year.');
write(cardPath,cards);write(reportPath,report);
console.log(`Applied ${report.cardFixesApplied.length-originalCount} logged changes to two Lada lines; one technical trim added. Baseline retained.`);
