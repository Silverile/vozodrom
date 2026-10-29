import fs from 'node:fs';
import assert from 'node:assert/strict';
const base='analysis/sweep/codex/', path='src/data/catalog/model-cards/jeep.json';
const cards=JSON.parse(fs.readFileSync(path,'utf8')),report=JSON.parse(fs.readFileSync(base+'jeep.json','utf8'));
assert(!fs.existsSync(base+'JEEP-DEPTH-BASELINE.json'),'Already applied');
fs.writeFileSync(base+'JEEP-DEPTH-BASELINE.json',JSON.stringify({cards,report},null,2)+'\n');
const renOem='https://www.media.stellantis.com/uk-en/jeep/press/uk-pricing-announced-for-new-jeep-renegade';
const renAdac='https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/jeep/renegade/bu-facelift/308431/';
const compassOem='https://www.media.stellantis.com/uk-en/jeep/press/new-jeep-compass-press-kit';
const compassAdac='https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/jeep/compass/';
const engineOem='https://www.media.stellantis.com/de-de/jeep/press/jeep-compass-made-in-europe-mit-neuer-benzinmotoren-generation';
const techOem='https://www.media.stellantis.com/uploads/fr/model-document/tarifpublicjeeprcompassmy202021a4janvier2021-6006a2379eeaa.pdf';
const techAdac='https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/jeep/compass/mx/313860/';
const changes=[];
function set(slug,path,to,sources){const c=cards.find(c=>c.lineSlug===slug),keys=path.replace(/\[(\d+)\]/g,'.$1').split('.');let p=c;for(const k of keys.slice(0,-1))p=p[k];const key=keys.at(-1),from=p[key]??null;if(JSON.stringify(from)===JSON.stringify(to))return;changes.push({lineSlug:slug,path,from,to:structuredClone(to),sources,passType:'DEPTH',round:5});p[key]=to;}
set('renegade','generations[0].facelift',[{year:2018,productionYear:null,name:'Modernizace pro modelový rok 2019',code:null,note:'Změněná přední část a dostupná světla LED. Tovární zpráva z 16. srpna 2018 uvádí britský příchod v září; ADAC modernizovanou evropskou řadu eviduje od září 2018. Termín prodeje neurčuje přesný začátek výroby.',sources:[renOem,renAdac]}],[renOem,renAdac]);
set('compass','generations[1].facelift',[{year:2021,productionYear:null,name:'Evropská modernizace 2021',code:null,note:'Přepracovaná příď, osvětlení a interiér; zdroje rozlišují modernizaci od původní druhé generace. Přesný výrobní termín není doložen.',sources:[compassOem,compassAdac]}],[compassOem,compassAdac]);
const technicalFields={'engine.displacementCc':1332,'engine.cylinders':4,'transmission.gears':6,'dimensionsMm.length':4394,'dimensionsMm.height':1629,'dimensionsMm.wheelbase':2636,topSpeedKmh:192,acceleration0to100s:10.3};
for(const [field,value] of Object.entries(technicalFields))set('compass','generations[1].trims[0].'+field,value,[(field==='engine.cylinders'||field==='transmission.gears')?engineOem:techOem,techAdac]);
const c=cards.find(c=>c.lineSlug==='compass'), t=c.generations[1].trims[0];
set('compass','generations[1].trims[0].fieldSources',Object.fromEntries(Object.keys(technicalFields).map(field=>[field,changes.find(x=>x.path==='generations[1].trims[0].'+field).sources])),[engineOem,techOem,techAdac]);
set('compass','generations[1].trims[0].specificationScope.noteCs','Evropská verze pro modelový rok 2020, 1.3 T-GDi 130 se šestistupňovou manuální převodovkou. Tovární německá zpráva a francouzský technický ceník jsou porovnány s německým ADAC. Šířka zůstává null: ADAC uvádí karoserii bez zrcátek, francouzský ceník šířku se sklopenými zrcátky. Hmotnost nebyla doplněna bez shody její konvence.',[engineOem,techOem,techAdac]);
set('compass','generations[1].trims[0].sources',[...new Set([...t.sources,techOem,techAdac])],[engineOem,techOem,techAdac]);
for(const [slug,index,sources] of [['renegade',0,[renOem,renAdac]],['compass',1,[compassOem,compassAdac,engineOem,techOem,techAdac]]]){
 const c=cards.find(c=>c.lineSlug===slug),g=c.generations[index];
 set(slug,`generations[${index}].fieldSources`,{...(g.fieldSources??{}),facelift:changes.find(x=>x.lineSlug===slug&&x.path===`generations[${index}].facelift`).sources},sources);
 set(slug,`generations[${index}].sources`,[...new Set([...g.sources,...sources])],sources);
 set(slug,'sources',[...new Set([...c.sources,...sources])],sources);
 const resolved=new Set(changes.filter(x=>x.lineSlug===slug).map(x=>x.path));
 set(slug,'needsReview',[...c.needsReview.filter(r=>!resolved.has(r.field)),{field:`generations[${index}].facelift`,reason:'Zapsána vybraná evropská modernizace; další trhy, výrobní termíny a úplnost změn zůstávají k ověření.'}],sources);
}
report.cardFixesApplied.push(...changes);
report.conflicts.push({where:'Compass MY2020 130 manual width',values:{'ADAC body excluding mirrors':1819,'OEM French folded-mirror width':1874},kept:null,sources:[techOem,techAdac],note:'Different measurement conventions, not contradictory body widths. Do not copy folded-mirror width into body width.'});
report.openQuestions.push('DEPTH round5: Renegade Commons description/category identifies 2015 Italy-built US Latitude 2.4 / 9AT, credit Mr.choppers CC BY-SA3.0 matches. Same generation body; does not certify European trim. No pixels reviewed and no photo change.', 'DEPTH round5: Compass150 DDCT MY2020 remains without displacement/cylinders/gears pending exact independent MY2020 corroboration; facelift MY2021 evidence was not silently transferred. All complete generation/status/engine/photo checks remain open.');
report.coverage.depthRound5={status:'partial',sourceCheckedModels:['renegade','compass'],substantiveFieldsChanged:10,loggedChanges:changes.length,limitations:'Two exterior facelift records and selected eight technical null fills for one MY2020 trim. French OEM technical sheet retrieved as indexed text, not a fully rendered PDF.'};
fs.writeFileSync(path,JSON.stringify(cards,null,2)+'\n');fs.writeFileSync(base+'jeep.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({changes:changes.length,substantive:10,cardsChanged:2}));
