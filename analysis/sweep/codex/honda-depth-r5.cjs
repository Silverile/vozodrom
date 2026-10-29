const fs = require('node:fs');
const assert = require('node:assert/strict');
const cardPath = 'src/data/catalog/model-cards/honda.json';
const reportPath = 'analysis/sweep/codex/honda.json';
const cards = JSON.parse(fs.readFileSync(cardPath, 'utf8'));
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const prior = structuredClone(report.cardFixesApplied);
const source = {
  civic: 'https://hondanews.eu/gb/en/cars/media/pressreleases/541358/dynamic-exterior-upgrade-headlines-refreshed-honda-civic-ehev',
  civicAdac: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/honda/civic/?filter=NONE',
  jazz: 'https://hondanews.eu/gb/en/cars/media/pressreleases/434833/2023-honda-jazz-and-jazz-crosstar-facelift-full-press-kit',
  jazzAdac: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/honda/jazz/?filter=NONE',
  crv: 'https://hondanews.eu/at/de/cars/media/pressreleases/446805/2023-honda-cr-v-pressemappe',
  crvAdac: 'https://assets.adac.de/image/upload/Autodatenbank/Autotest/AT6399_honda-cr-v-20-i-mmd-ehev-advance-awd-e-cvt/honda-cr-v-20-i-mmd-ehev-advance-awd-e-cvt.pdf',
  civicCapacityHonda: 'https://hondanews.eu/gb/en/media/pressreleases/60499/2015-civic-and-civic-tourer-uk-press-kit',
  civicCapacityAdac: 'https://assets.adac.de/Autodatenbank/GWInfo/gw0327-honda-civic-2012-2017-bericht.pdf'
};
const fixes = [];
function clearReview(c, field, sources) {
  const before = structuredClone(c.needsReview);
  c.needsReview = c.needsReview.filter(r=>r.field!==field);
  fixes.push({lineSlug:c.lineSlug,path:'needsReview',from:before,to:structuredClone(c.needsReview),sources,pass:'DEPTH-R5-2026-10-29'});
}
function set(c, gi, key, value, sources) {
  const g = c.generations[gi];
  const path = `generations[${gi}].${key}`;
  fixes.push({lineSlug:c.lineSlug,path,from:structuredClone(g[key]),to:structuredClone(value),sources,pass:'DEPTH-R5-2026-10-29'});
  g[key] = value;
}
for (const [slug,gi,year,urls,note] of [
  ['civic',10,2025,[source.civic,source.civicAdac],'Evropská modernizace e:HEV: upravená maska a nárazník, změny výbavy; datum není začátkem celé světové generace.'],
  ['jazz',3,2023,[source.jazz,source.jazzAdac],'Evropská modernizace Jazz a Crosstar: upravené nárazníky, výbava Advance Sport a výkonnější hybridní pohon.']
]) {
  const c = cards.find(c=>c.lineSlug===slug);
  assert.equal(c.generations[gi].facelift,null);
  set(c,gi,'facelift',[{year,productionYear:year,name:`Evropská modernizace ${year}`,note,sources:urls}],urls);
  set(c,gi,'sources',[...new Set([...c.generations[gi].sources,...urls])],urls);
  clearReview(c,`generations[${gi}].facelift`,urls);
}
const c = cards.find(c=>c.lineSlug==='cr-v');
const g = c.generations[5];
assert.equal(g.trims,null);
const urls = [source.crv,source.crvAdac];
const trims = [
  ['2.0 e:HEV Elegance 2WD','petrol-hev','fwd',194,9],
  ['2.0 e:HEV Advance AWD','petrol-hev','awd',187,9.5],
  ['2.0 e:PHEV Advance Tech 2WD','petrol-phev','fwd',195,9.4]
].map(([name,fuel,drive,topSpeedKmh,acceleration0to100s])=>({
  name,kind:'technical-version',from:null,to:null,bodyType:'suv',
  engine:{fuel,displacementCc:1993,cylinders:4,powerKw:135,powerStandard:'Electric traction motor output and torque; separate petrol engine 109 kW / 189 Nm. Outputs are not added.',torqueNm:335},
  transmission:{type:'automatic',gears:null},drive,
  dimensionsMm:{length:null,width:null,height:null,wheelbase:null},
  massKg:null,massBasis:null,topSpeedKmh,acceleration0to100s,
  consumptionL100:null,consumptionCycle:null,consumptionKwh100:null,rangeKm:null,rangeCycle:null,
  specificationScope:{market:'Europe (Austrian launch specification, corroborated by German ADAC)',modelYear:2023,noteCs:'Vybraná evropská verze při uvedení v roce 2023; nejde o kompletní nabídku ani ověření celé doby výroby. Výkon 135 kW a moment 335 Nm patří trakčnímu elektromotoru, nikoli samotnému benzinovému motoru. Počet fyzických převodových stupňů není zjednodušen na hodnotu CVT. Hmotnost a rozměry zůstávají null kvůli rozdílům mezi prameny nebo chybějícímu potvrzení přesné verze.'},
  sources:urls
}));
set(c,5,'trims',trims,urls);
set(c,5,'engineCoverage','partial',urls);
set(c,5,'sources',[...new Set([...g.sources,...urls])],urls);
clearReview(c,'generations[5].trims',urls);
report.cardFixesApplied.push(...fixes);
report.conflicts.push({where:'DEPTH-R5 Civic IX 1.8 i-VTEC displacementCc',values:{[source.civicCapacityHonda]:1798,[source.civicCapacityAdac]:1799},kept:1798,reason:'Retain explicit Honda specification; independent ADAC table also has inconsistent power/top-speed entries, so do not silently substitute its capacity.'});
report.conflicts.push({where:'DEPTH-R5 CR-V VI Advance AWD massKg',values:{[source.crv]:1821,[source.crvAdac]:1875},kept:null,reason:'Austrian minimum mass includes 75 kg driver/luggage; ADAC lists different manufacturer mass and measured 1820 kg. Different configuration/mass basis cannot be reconciled by averaging.'});
report.openQuestions.push('DEPTH-R5: Civic/Jazz facelift years and selected CR-V VI launch powertrains only. Older generation codes, full engine ranges, production status as of October 2026, and all Commons photographs remain unchecked this pass. No existing photo review was repeated.');
report.depthPasses ??= [];
report.depthPasses.push({date:'2026-10-29',pass:'round-5',status:'partial',models:['civic','cr-v','jazz'],substantiveChanges:4,faceliftEvents:2,technicalVersionsAdded:3,engineNumericFills:12,performanceNumericFills:6,provenanceChanges:3,loggedChanges:fixes.length,limitations:'No complete make or generation audit. Search-index excerpts used for Honda press kits because direct opens returned HTTP 403; ADAC CR-V PDF opened in full. No production-status or photo changes.'});
assert.deepEqual(report.cardFixesApplied.slice(0,prior.length),prior);
fs.writeFileSync(cardPath,JSON.stringify(cards,null,2)+'\n','utf8');
fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n','utf8');
console.log(JSON.stringify({loggedChanges:fixes.length,substantiveChanges:4,technicalVersionsAdded:3,engineNumericFills:12,performanceNumericFills:6,priorEntriesPreserved:prior.length}));
