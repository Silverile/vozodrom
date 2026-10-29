const fs = require('fs');
const base = 'src/data/catalog/model-cards/';
const audit = 'analysis/sweep/codex/';
const primaryCupra = 'https://www.seat-cupra-mediacenter.com/CUPRA-Brand/cupra-news/2024/Production-of-the-new-CUPRA-Formentor-and-CUPRA-Leon-begins-in-Martorell-as-the-next-step-in-the-factory-s-historic-transformation';
const bornPrimary = 'https://www.seat-cupra-mediacenter.com/CUPRA-Brand/presskits/new-cupra-born/press-release';
const adacBorn = 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/cupra/born/1generation-facelift/350015/';
const brochure = 'https://www.crossfire-garage.fr/documentation/commerciale/DE/AM_2007_-_Donnees_Techniques_Allemande.pdf';
const adac = 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/chrysler/crossfire/1generation/998483/';
const wiki = 'https://de.wikipedia.org/wiki/Chrysler_Crossfire';
const sop = 'https://www.autointell.com/News-2003/February-2003/Feb-2003-1/Feb-05-03-p9.htm';
for (const make of ['cupra', 'chrysler']) {
  const cards = JSON.parse(fs.readFileSync(base + make + '.json', 'utf8'));
  const report = JSON.parse(fs.readFileSync(audit + make + '.json', 'utf8'));
  let count = 0;
  const set = (card, path, value, sources, note) => {
    const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
    let parent = card;
    for (const key of keys.slice(0, -1)) parent = parent[key];
    const key = keys.at(-1), old = parent[key];
    if (JSON.stringify(old) === JSON.stringify(value)) return;
    report.cardFixesApplied.push({ lineSlug: card.lineSlug, path, from: old ?? null, to: value, sources, confidence: 'high', round: 6, ...(note ? {note} : {}) });
    parent[key] = value; count++;
  };
  if (make === 'cupra') {
    for (const [slug, year, sources, note] of [
      ['formentor', 2024, [primaryCupra, 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/cupra/cupra-formentor/'], 'Modernizace přídě, zadních světel a infotainmentu; výrobce potvrdil zahájení výroby 27. června 2024.'],
      ['leon', 2024, [primaryCupra, 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/cupra/leon/1generation-facelift/337436/'], 'Modernizace hatchbacku i Sportstoureru; sériová výroba modernizované podoby začala v červnu 2024, nikoli nová konstrukční generace.'],
      ['born', 2026, [bornPrimary, adacBorn], 'Modernizace odhalená v březnu 2026; výrobce oznámil výrobu od druhého čtvrtletí, ADAC eviduje modernizovanou řadu od června 2026.']
    ]) {
      const card = cards.find(c => c.lineSlug === slug);
      set(card, 'generations[0].facelift', [{year, productionYear: year, note, sources}], sources);
      set(card, 'generations[0].sources', [...new Set([...card.generations[0].sources, ...sources])], sources);
      set(card, 'sources', [...new Set([...card.sources, ...sources])], sources);
      set(card, 'needsReview', card.needsReview.filter(r => r.field !== 'generations[0].facelift'), sources, 'Remove stale null-field review after sourcing facelift.');
    }
    report.openQuestions.push('DEPTH round6: 3 facelift fields verified using OEM and ADAC; none is a new platform generation. Existing Cupra dates were not changed in earlier Codex sweep reports (0 prior card fixes). Full seven-line engine/photos/current-status audit remains open; Tavascan 2023 versus 2024 SOP needs explicit series-production reconciliation, so its null start stays null.');
  } else {
    const card = cards.find(c => c.lineSlug === 'crossfire');
    const technical = [brochure, adac];
    set(card, 'generations[0].code', 'ZH', [adac, wiki]);
    set(card, 'generations[0].from', 2003, [sop, wiki], 'Series-production coupe SOP 3 February 2003; MY2004 is not the calendar production start.');
    set(card, 'generations[0].to', 2007, [adac, wiki], 'Calendar production ended December2007; MY2008 cars do not extend series production into2008.');
    set(card, 'generations[0].productionStatus', 'ended', [adac, wiki]);
    set(card, 'generations[0].bodyTypes', ['kupe', 'kabriolet'], [brochure, wiki]);
    set(card, 'generations[0].drivetrains', ['rwd'], technical);
    const trim = {
      name: 'Roadster 3.2 V6 160 kW Automatic — Germany 04/2007', kind: 'technical-version', from: null, to: null, bodyType: 'kabriolet',
      engine: {fuel: 'petrol', displacementCc: 3199, cylinders: 6, powerKw: 160, powerStandard: null, torqueNm: 310},
      transmission: {type: 'automatic', gears: 5}, drive: 'rwd', dimensionsMm: {length: 4058, width: 1766, height: 1303, wheelbase: 2400},
      massKg: null, massBasis: null, topSpeedKmh: 250, acceleration0to100s: 6.9,
      consumptionL100: 10.1, consumptionCycle: 'NEDC combined', consumptionKwh100: null, rangeKm: null, rangeCycle: null,
      specificationScope: {market: 'Germany', modelYear: null, noteCs: 'Německý ceník platný od 04/2007 a ADAC: roadster s pětistupňovým automatem, nikoli kupé nebo SRT-6. Hmotnost zůstává null: výrobce uvádí rozsah 1495–1520 kg pro automat, ADAC 1495 kg; přesná shodná konfigurace nebyla stanovena.'},
      sources: technical
    };
    set(card, 'generations[0].trims', [trim], technical, 'One scoped European technical row; does not claim complete engine/equipment coverage.');
    set(card, 'generations[0].sources', [...new Set([...card.generations[0].sources, ...technical, sop, wiki])], [...technical, sop, wiki]);
    set(card, 'sources', [...new Set([...card.sources, ...technical, sop, wiki])], [...technical, sop, wiki]);
    set(card, 'needsReview', card.needsReview.filter(r => !['generations[0].code', 'generations[0].from', 'generations[0].to', 'generations[0].drivetrains', 'generations[0].trims'].includes(r.field)), [...technical, sop, wiki]);
    report.conflicts.push({where: 'Crossfire selected Roadster automatic massKg', values: {'German OEM brochure 04/2007': '1495–1520 kg', ADAC: '1495 kg'}, kept: null, sources: technical, note: 'No invented midpoint or minimum; mass remains unknown for exact row.'});
    report.openQuestions.push('DEPTH round6: Crossfire series-production chronology/code/body/RWD and one German Roadster automatic row verified. Coupe/manual/SRT-6 rows, photos, remaining 44 Chrysler lines still require depth. Pacifica minivan generation[1].from=2016 rechecked and retained: OEM April27,2016 manufacturing story explicitly says production began Feb29 and reports dealer inventory; this is series production, not MY2017 or pre-series. Independent SOP corroboration was not established in this round.');
    report.reviewedSources ??= [];
    for (const url of [...technical, sop, wiki, 'https://blog.stellantisnorthamerica.com/2016/04/27/new-chrysler-pacifica-minivans-hit-the-road-to-dealerships/']) if (!report.reviewedSources.includes(url)) report.reviewedSources.push(url);
  }
  fs.writeFileSync(base + make + '.json', JSON.stringify(cards, null, 2) + '\n');
  fs.writeFileSync(audit + make + '.json', JSON.stringify(report, null, 2) + '\n');
  console.log(make + ': ' + count + ' exact audit operations appended');
}
