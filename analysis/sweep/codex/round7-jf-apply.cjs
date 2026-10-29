const fs=require('fs');
const baseline=JSON.parse(fs.readFileSync('analysis/sweep/codex/round7-jf-baseline.json'));
const sources={
 ferrari:['https://www.ferrari.com/content/dam/ferrari-fcom/old/pdf/CS_Ferrari_GTO_Legacy_Tour_2024_gbr.pdf','https://backoffice.rmsothebys.com/auctions/pa26/lots/r0071-1985-ferrari-288-gto/'],
 jaecoo:['https://omoda-jaecoo.cz/jaecoo/jaecoo-j7-phev','https://www.sauto.cz/katalog-modelu/352-jaecoo/3608-7/10437-7/53992-shs-15-tgdi-plug-in-hybrid-dht','https://cars-data.com/cs/jaecoo/7/2025/shs-exclusive--110779']
};
for(const make of ['jaecoo','ferrari']) {
 const {cards,report}=structuredClone(baseline[make]);
 const card=cards.find(c=>c.lineSlug===(make==='ferrari'?'288-gto':'j7'));
 const log=(path,to,kind='data')=>{let o=card;const keys=path.replace(/\[(\d+)\]/g,'.$1').split('.');for(const k of keys.slice(0,-1))o=o[k];const key=keys.at(-1),from=structuredClone(o[key]??null);o[key]=structuredClone(to);report.cardFixesApplied.push({lineSlug:card.lineSlug,path,from,to:structuredClone(to),sources:sources[make],round:'depth-7',kind});};
 if(make==='ferrari') {
  for(const [field,value] of Object.entries({'engine.torqueNm':496,topSpeedKmh:305,acceleration0to100s:4.9}))log('generations[0].trims[0].'+field,value);
  log('needsReview',card.needsReview.filter(r=>!['generations[0].trims[0].engine.torqueNm','generations[0].trims[0].topSpeedKmh','generations[0].trims[0].acceleration0to100s'].includes(r.field)),'maintenance');
  report.conflicts.push({where:'288-gto generations[0].to',values:{'Autozine production table':1986,'Ultimatecarpage production table':1986,'Italpassion production table':1987},kept:null,sources:['https://www.autozine.org/Archive/Ferrari/classic/288GTO.html','https://www.ultimatecarpage.com/spec/169/Ferrari-288-GTO.html','https://www.italpassion.fr/en/cars/ferrari-288-gto/'],round:'depth-7',reason:'Two compilation sites agree on 1986 but conflict with other histories. No manufacturer series-production endpoint retrieved; no automatic majority vote.'});
 } else {
  const t=structuredClone(card.generations[0].trims[0]);
  Object.assign(t,{name:'SHS-P Exclusive 1.5 TGDI – česká specifikace',from:null,to:null,engine:{fuel:'petrol-phev',displacementCc:1499,cylinders:4,powerKw:105,powerStandard:'Výkon spalovacího motoru; nejde o kombinovaný výkon hybridní soustavy.',torqueNm:215},transmission:{type:'automatic',gears:null},drive:'fwd',dimensionsMm:{length:4500,width:1865,height:1670,wheelbase:2672},massKg:1795,massBasis:'Pohotovostní hmotnost podle českého zastoupení a Sauto; zahrnutí řidiče není výslovně vymezeno.',topSpeedKmh:180,acceleration0to100s:8.5,consumptionL100:null,consumptionCycle:null,consumptionKwh100:null,rangeKm:null,rangeCycle:null,specificationScope:{market:'Czech Republic',modelYear:null,noteCs:'Vybrané společně doložené údaje SHS-P Exclusive. Výkon 105 kW a moment 215 Nm patří spalovací části. Spotřeba a dojezd zůstávají null, protože různé zdroje uvádějí odlišné cykly či hodnoty. Převodovka je automatická; počet převodových poměrů nebyl nezávisle potvrzen. Rok uvedení ani prodeje není začátek výroby.'},sources:sources[make]});
  t.fieldSources={};for(const f of ['engine.displacementCc','engine.powerKw','engine.torqueNm','dimensionsMm.length','dimensionsMm.width','dimensionsMm.height','dimensionsMm.wheelbase','massKg','topSpeedKmh','acceleration0to100s'])t.fieldSources[f]=sources[make].slice(0,2);
  for(const f of ['engine.cylinders','transmission.type','drive'])t.fieldSources[f]=[sources[make][0],sources[make][2]];
  log('generations[0].trims',[...card.generations[0].trims,t]);
  const extra=['from','to','transmission.gears','consumptionL100','consumptionCycle','consumptionKwh100','rangeKm','rangeCycle','specificationScope.modelYear'].map(f=>({field:'generations[0].trims[1].'+f,reason:'Pro tuto českou plug-in hybridní verzi nebyl údaj potvrzen dvěma nezávislými publikovateli.'}));
  log('needsReview',[...card.needsReview,...extra],'maintenance');
  report.openQuestions.push('Depth-7 J7 SHS-P: consumption/range values are not reconciled: manufacturer 2.4 l/100km and 91km EV range, Sauto 0.7–6 l/100km and no EV range, Cars-Data 90km and implausibly labelled 0.7 kWh/100km. New row leaves these null; no SOP date copied from Sauto family row.');
 }
 for(const target of ['sources','generations[0].sources',...(make==='ferrari'?['generations[0].trims[0].sources']:[])]){let o=card;for(const key of target.replace(/\[(\d+)\]/g,'.$1').split('.'))o=o[key];log(target,[...new Set([...o,...sources[make]])],'evidence');}
 report.reviewScope.externalChecks.push({round:'depth-7',scope:make==='ferrari'?'288 GTO selected torque/performance only':'J7 SHS-P selected Czech PHEV technical row',sources:sources[make],limitations:make==='ferrari'?'Ferrari PDF technical table available in search-index extract; direct open robot-blocked. Independent auction description retrieved. Production years/photos not certified.':'Sauto omits drive/gearbox/cylinder count; Cars-Data corroborates four cylinders, FWD and automatic. Consumption fields not adopted. Other Jaecoo models/photos not deeply verified.'});
 fs.writeFileSync('src/data/catalog/model-cards/'+make+'.json',JSON.stringify(cards,null,2)+'\n');
 fs.writeFileSync('analysis/sweep/codex/'+make+'.json',JSON.stringify(report,null,2)+'\n');
 console.log(make+' appended '+(report.cardFixesApplied.length-baseline[make].report.cardFixesApplied.length)+' audit entries');
}
