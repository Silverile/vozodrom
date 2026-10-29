import fs from 'node:fs';
import assert from 'node:assert/strict';
const base = 'analysis/sweep/codex/';
const cardPath = 'src/data/catalog/model-cards/audi.json';
const reportPath = base + 'audi.json';
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const cards = read(cardPath), report = read(reportPath);
assert(!fs.existsSync(base + 'AUDI-DEPTH-BASELINE.json'), 'One-shot script; baseline already exists');
fs.writeFileSync(base + 'AUDI-DEPTH-BASELINE.json', JSON.stringify({cards, report}, null, 2) + '\n');
const src = {
 a3: 'https://www.audi.com/en/press-releases/30-years-of-the-audi-a3-three-decades-of-vorsprung-in-the-premium-compact-segment-18368',
 adacA3: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/audi/a3/',
 a3fl: 'https://audi.hu/en/news/details/460_audi_hungaria_the_most_popular_gyor_models_audi_a3_limousine_and/',
 a3fl24: 'https://www.audi.com/en/press-releases/in-top-form-the-audi-a3-and-new-a3-allstreet-15917',
 a3fl26: 'https://www.audi.com/en/press-releases/upgrade-for-audi-a3-models-18028',
 types: 'https://emea-dam.audi.com/adobe/assets/urn%3Aaaid%3Aaem%3A2c86ef17-e470-4619-9f60-f11c758a8d79/original/as/Typenliste_Audi_i_Size_online.pdf',
 adacA4: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/audi/a4/?filter=NONE',
 a4: 'https://www.audi.com/en/audi-a4-23',
 q6: 'https://www.audi.com/en/the-audi-q6-e-tron-electric-mobility-on-a-new-level-15929/the-facts-15948',
 q6data: 'https://emea-dam.audi.com/adobe/assets/urn%3Aaaid%3Aaem%3A9c01dbf7-acf4-4a26-a96a-63e986a650f4/original/as/Q6-e-tron.pdf',
 adacQ6: 'https://assets.adac.de/image/upload/Autodatenbank/Autotest/at6477-audi-q6-e-tron-performance/audi-q6-e-tron-performance.pdf',
 q6prod: 'https://www.audi-mediacenter.com/en/press-releases/sustainable-and-flexible-production-of-the-audi-q6-e-tron-series-in-ingolstadt-15928/download',
 q6current: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/audi/audi-q6-e-tron-langzeittest/'
};
let count = 0;
function change(slug, path, to, sources, reason) {
 const c = cards.find(c => c.lineSlug === slug);
 const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
 let p = c;
 for (const k of keys.slice(0, -1)) p = p[k];
 const key = keys.at(-1), from = p[key] ?? null;
 if (JSON.stringify(from) === JSON.stringify(to)) return;
 report.cardFixesApplied.push({lineSlug:slug,path,from:structuredClone(from),to:structuredClone(to),sources,reason,pass:'DEPTH-2026-10-29'});
 p[key] = structuredClone(to); count++;
}
function provenance(slug, i, fields, sources) {
 const c = cards.find(c => c.lineSlug === slug), g = c.generations[i];
 const fieldSources = {...g.fieldSources};
 for (const field of fields) fieldSources[field] = sources;
 change(slug, `generations[${i}].fieldSources`, fieldSources, sources, 'Field-level provenance for this depth pass.');
 change(slug, `generations[${i}].sources`, [...new Set([...g.sources, ...sources])], sources, 'Append checked primary and independent sources.');
 change(slug, 'sources', [...new Set([...c.sources, ...sources])], sources, 'Append checked sources without discarding earlier citations.');
}
const a3Sources = [src.a3,src.adacA3];
for (const [field,value] of Object.entries({from:2012,to:2020,productionStatus:'ended'}))
 change('a3',`generations[2].${field}`,value,a3Sources,'Audi anniversary chronology and ADAC agree on European 8V cycle.');
change('a3','generations[2].facelift',[{year:2016,productionYear:2016,note:'Modernizace světel a infotainmentu, volitelný Audi virtual cockpit; evropské uvedení v roce 2016.',sources:[src.a3fl,src.adacA3]}],[src.a3fl,src.adacA3],'Manufacturer release and independent generation catalogue agree.');
provenance('a3',2,['from','to','productionStatus'],a3Sources);
change('a3','generations[3].productionStatus','current',a3Sources,'October 2026 Audi anniversary release describes the current 8Y generation; ADAC lists the facelift as ongoing.');
change('a3','generations[3].facelift',[{year:2024,productionYear:2024,note:'Modernizace designu, denního svícení a výbavy; přibyla varianta allstreet.',sources:[src.a3fl24,src.adacA3]}],[src.a3fl24,src.adacA3],'OEM and ADAC corroborate the 2024 exterior facelift; not a new generation.');
provenance('a3',3,['productionStatus'],a3Sources);
change('a3','summaryCs','Audi A3 má čtyři konstrukční generace: 8L (1996–2003 v Evropě), 8P (2003–2013), 8V (2012–2020) a 8Y od roku 2020. Jednotlivé karoserie byly uváděny postupně; jejich technické údaje nejsou zaměnitelné.',a3Sources,'Replace generic placeholder with corroborated European generation chronology.');
change('a4','generations[3].from',2007,[src.types,src.adacA4],'B8 sedan began in 2007; 2008 is the Avant start/model-year convention. Retain 2016 end because allroad overlaps successor.');
provenance('a4',3,['from'],[src.types,src.adacA4]);
report.conflicts.push({where:'a4 generations[4].to',values:{'Audi European model archive':2024,'existing source-production card / fixed Wikipedia revision':2025},kept:2025,sources:[src.a4,src.adacA4,cards.find(c=>c.lineSlug==='a4').generations[4].sources[0]],reason:'Do not silently replace broader production chronology with European sales/end date. Requires explicit market/body reconciliation.',pass:'DEPTH-2026-10-29'});
report.conflicts.push({where:'a4 generations[1].to',values:{'Audi body-specific rescue cycles and ADAC':2005,'existing broader card chronology':2006},kept:2006,sources:[src.adacA4,'https://emea-dam.audi.com/adobe/assets/urn%3Aaaid%3Aaem%3A0b71b57b-3010-4e70-b08f-745cea343727/original/as/Audi_Modells_upto_2006_EN.pdf'],reason:'B6 Cabriolet transition/market scope must be reconciled; do not turn sales years into universal production cutoffs.',pass:'DEPTH-2026-10-29'});
const qSources = [src.q6data,src.adacQ6];
const trim = {
 name:'Q6 e-tron performance — 225 kW (bez Launch Control)',kind:'technical-version',from:null,to:null,bodyType:'suv',
 engine:{fuel:'electric',displacementCc:null,cylinders:null,powerKw:225,torqueNm:485,powerStandard:'Maximální výkon bez Launch Control; krátkodobě 240 kW s Launch Control.'},
 transmission:{type:'single-speed',gears:1},drive:'rwd',
 dimensionsMm:{length:null,width:null,height:null,wheelbase:null},massKg:null,massBasis:null,
 topSpeedKmh:210,acceleration0to100s:6.7,consumptionL100:null,consumptionCycle:null,consumptionKwh100:null,rangeKm:null,rangeCycle:null,
 specificationScope:{market:'Europe / Germany; manufacturer technical sheet cross-checked with ADAC April 2025 test',modelYear:null,noteCs:'Technická varianta bez Launch Control: 225 kW a 0–100 km/h za 6,7 s. Launch Control zvyšuje výkon na 240 kW a zkracuje čas na 6,6 s; nejde o druhý motor. Hmotnost a spotřeba ponechány null kvůli odlišné metodice či specifikaci. Datace konkrétní varianty není stanovena.'},sources:qSources
};
trim.fieldSources = Object.fromEntries(['engine.fuel','engine.powerKw','engine.torqueNm','transmission.type','transmission.gears','drive','topSpeedKmh','acceleration0to100s'].map(k=>[k,qSources]));
change('q6-e-tron','generations[0].trims',[trim],qSources,'Populate one exact technical version using manufacturer non-boost data and ADAC matching non-boost figures; keep uncorroborated data null.');
change('q6-e-tron','generations[0].engines',[{fuel:'electric',displacementCc:null,displacementLitresNominal:null,powerKwMin:225,powerKwMax:225,variant:'Q6 e-tron performance; bez Launch Control, krátkodobě 240 kW s Launch Control.'}],qSources,'Selected version only; not the whole generation power range.');
change('q6-e-tron','generations[0].engineCoverage','partial',qSources,'One selected corroborated electric variant; other variants remain open.');
change('q6-e-tron','generations[0].specificationScope',{market:'Europe / Germany',modelYear:null,variant:'Q6 e-tron performance (selected technical version)',bodyType:'suv',noteCs:'Ověřena jedna technická varianta podle výrobce a testu ADAC. Souhrn motorizací je částečný; celá modelová řada není jednou shodnou specifikací.'},qSources,'Scope the newly populated engine data.');
change('q6-e-tron','summaryCs','Audi Q6 e-tron je elektrické SUV na platformě PPE, vyráběné v Ingolstadtu od konce roku 2023. Evropské uvedení následovalo v roce 2024. Zde je technicky rozpracována pouze vybraná zadokolka performance; její hodnoty nelze přenášet na quattro, SQ6 ani Sportback.',[src.q6prod,src.q6,src.adacQ6],'Distinguish start of production from market introduction and scope selected technical version.');
provenance('q6-e-tron',0,['trims','engines'],qSources);
provenance('q6-e-tron',0,['from'],[src.q6prod]);
report.conflicts.push({where:'q6-e-tron performance power and acceleration conventions',values:{'non-boost maximum':{powerKw:225,acceleration0to100s:6.7},'Launch Control':{powerKw:240,acceleration0to100s:6.6}},kept:'225 kW / 6.7 s non-boost trim; launch-control alternative explicitly noted',sources:qSources,reason:'Do not combine boosted power with non-boost acceleration or continuous type-approval power (120 kW).',pass:'DEPTH-2026-10-29'});
report.conflicts.push({where:'q6-e-tron quattro torque',values:{'older Italy OEM table':535,'ADAC total':855,'January 2026 Singapore OEM sheet':'rear 580 / front 275'},kept:null,sources:[src.adacQ6,'https://asset.moto.it/pricelist/auto/a44962d7baff79badd4a1af0b9c6eb2a/listino-mar-25.pdf','https://emea-dam.audi.com/adobe/assets/urn%3Aaaid%3Aaem%3Aa289879f-63a5-4a95-a945-e3fee9f21965/original/as/Audi_Q6_e-tron_Spec_Sheet_Jan_2026.pdf'],reason:'Axle torque and combined catalogue figure are not interchangeable; no scalar quattro torque populated.',pass:'DEPTH-2026-10-29'});
const resolved = new Set(report.cardFixesApplied.filter(x=>x.pass==='DEPTH-2026-10-29').map(x=>x.lineSlug+'|'+x.path));
for (const c of cards) {
 const reviews = c.needsReview.filter(r=>!resolved.has(c.lineSlug+'|'+r.field));
 if (reviews.length!==c.needsReview.length) change(c.lineSlug,'needsReview',reviews,c.sources,'Remove only exact review fields resolved in this pass; partial engines and trims still require expansion.');
}
// Partial arrays remain partial: retain explicit expansion review tasks.
const q = cards.find(c=>c.lineSlug==='q6-e-tron');
change('q6-e-tron','needsReview',[...q.needsReview,{field:'generations[0].trims',reason:'Ověřena pouze varianta performance bez Launch Control; další varianty, motory a výbavy zůstávají otevřené.'}],qSources,'Keep partial technical coverage visible.');
report.depthPasses ??= [];
report.depthPasses.push({checkedAt:'2026-10-29',status:'partial',lines:['a3','a4','q6-e-tron'],generationRowsInScope:10,loggedChanges:count,technicalVariantsAdded:1,sources:Object.values(src),remaining:'All other Audi lines; complete engines/trims; facelift checks outside A3 8V/8Y; full Commons description/category and visual review; A4 regional end dates; Q6 current status needs two-source production evidence.'});
report.openQuestions.push('DEPTH: Audi A3 8Y June-2026 interior/DRL update documented by OEM; not added as an exterior facelift stage until independent corroboration.','DEPTH: A3 8V Paris-2012 and A4 B9 Commons file pages failed to fetch; no new visual verification claimed. A3 8Y and A4 B8 descriptions match model generation; photos unchanged.','DEPTH: Q6 production from late 2023 is directly OEM-supported; independent second start-of-production source still required. Current production status remains unknown pending explicit corroboration.');
fs.writeFileSync(cardPath,JSON.stringify(cards,null,2)+'\n');
fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({cardPath,reportPath,loggedChanges:count,technicalVariantsAdded:1}));
