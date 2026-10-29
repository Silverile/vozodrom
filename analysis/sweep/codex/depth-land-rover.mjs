import fs from 'node:fs';
import assert from 'node:assert/strict';
const base='analysis/sweep/codex/', path='src/data/catalog/model-cards/land-rover.json';
const cards=JSON.parse(fs.readFileSync(path,'utf8')), report=JSON.parse(fs.readFileSync(base+'land-rover.json','utf8'));
const baselinePath=base+'LAND-ROVER-DEPTH-BASELINE.json';
assert(!fs.existsSync(baselinePath),'Do not rerun an applied depth increment');
fs.writeFileSync(baselinePath,JSON.stringify({cards,report},null,2)+'\n');
const oemDiscovery='https://www.landrover.co.uk/vehicles/discovery-1-4.html';
const adacDiscovery='https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/land-rover/discovery//';
const oemSport='https://media.jlr.com/discovery/en-gb/news/2019/05/new-discovery-sport-enhanced-every-family-adventure';
const adacSport='https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/land-rover/discovery-sport/1generation-facelift/341879/';
const oemCodes='https://www.landrover.fr/ownership/vin-recall.html';
const oemVelar='https://media.jlr.com/range-rover/en-gb/news/2023/02/enhanced-range-rover-velar-sophisticated-elegance-and-exquisite-details';
const adacVelar='https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/land-rover/range-rover-velar/1generation-facelift/342208/';
const velarCodes='https://www.landroverusa.com/ownership/software-update/index.html';
const changes=[];
function set(slug,path,to,sources){
 const c=cards.find(c=>c.lineSlug===slug),keys=path.replace(/\[(\d+)\]/g,'.$1').split('.');let p=c;
 for(const k of keys.slice(0,-1))p=p[k];const key=keys.at(-1),from=p[key]??null;
 if(JSON.stringify(from)===JSON.stringify(to))return;
 changes.push({lineSlug:slug,path,from,to:structuredClone(to),sources,passType:'DEPTH',round:5});p[key]=to;
}
set('discovery','generations[2].to',2009,[oemDiscovery,adacDiscovery]);
set('discovery-sport','generations[0].code','L550',[oemCodes,adacSport]);
set('discovery-sport','generations[0].facelift',[{year:2019,productionYear:null,name:'Modernizace 2019',code:null,note:'Představení v květnu 2019: změněná světla LED, maska a nárazníky, přechod na architekturu PTA. ADAC vymezuje německou nabídku modernizované řady od září 2019; začátek výroby není tímto potvrzen.',sources:[oemSport,adacSport]}],[oemSport,adacSport]);
set('range-rover-velar','generations[0].code','L560',[velarCodes,adacVelar]);
set('range-rover-velar','generations[0].facelift',[{year:2023,productionYear:null,name:'Modernizace 2023',code:null,note:'Úprava masky, světel a zadního nárazníku představená v únoru 2023. ADAC od února 2023 odděluje modernizovanou řadu; přesný začátek výroby z těchto zdrojů nevyplývá.',sources:[oemVelar,adacVelar]}],[oemVelar,adacVelar]);
for(const [slug,index,sources] of [['discovery',2,[oemDiscovery,adacDiscovery]],['discovery-sport',0,[oemCodes,oemSport,adacSport]],['range-rover-velar',0,[velarCodes,oemVelar,adacVelar]]]){
 const c=cards.find(c=>c.lineSlug===slug),g=c.generations[index];
 const fieldSources={...(g.fieldSources??{})};
 for(const e of changes.filter(x=>x.lineSlug===slug&&x.path.startsWith(`generations[${index}].`)))fieldSources[e.path.split('].')[1]]=e.sources;
 set(slug,`generations[${index}].fieldSources`,fieldSources,sources);
 set(slug,`generations[${index}].sources`,[...new Set([...g.sources,...sources])],sources);
 set(slug,'sources',[...new Set([...c.sources,...sources])],sources);
 const resolved=new Set(changes.filter(x=>x.lineSlug===slug).map(x=>x.path));
 let reviews=c.needsReview.filter(r=>!resolved.has(r.field));
 if(slug!=='discovery')reviews.push({field:`generations[${index}].facelift`,reason:'Zapsána jedna doložená vnější modernizace; úplnost dalších změn a jejich výrobních termínů není potvrzena.'});
 set(slug,'needsReview',reviews,sources);
}
report.cardFixesApplied.push(...changes);
report.openQuestions.push('DEPTH round5: Discovery I/II official heritage model-year dates (1989–1999 / 1999–2004) differ from ADAC series cycles (to1998 / from1998). Retained existing production dates; do not silently substitute model years.', 'DEPTH round5: Land Rover selected cards have no photos; no Commons replacement or pixel review performed. All engine ranges, full chronology/status and other generations remain incomplete.');
report.coverage.depthRound5={status:'partial',sourceCheckedModels:['discovery','discovery-sport','range-rover-velar'],generationRowsChecked:3,substantiveFieldsChanged:5,loggedChanges:changes.length,limitations:'Selected chronology/code/exterior-facelift checks only. No complete make, production-status, engine/trim or photo review. Velar release indexed text retrieved; direct page fetch timed out.'};
fs.writeFileSync(path,JSON.stringify(cards,null,2)+'\n');
fs.writeFileSync(base+'land-rover.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({changes:changes.length,substantive:5,cardsChanged:3}));
