import fs from 'node:fs';
const dir = 'analysis/sweep/codex/';
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const write = (p, value) => fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n');
const raw = read('src/data/catalog/models-auto.json');
const exclusions = [
  ['cadillac', 'cien', 'https://www.gm.com/heritage/collection/cadillac/2002-cadillac-cien', 'GM Heritage explicitly identifies the 2002 Cien as a concept; raw inceptionYear 2005 is also inconsistent. Exclude from ordinary production-model selection or classify separately as a concept.'],
  ['cadillac', 'sixteen', 'https://news.gm.com/home.detail.html/Pages/topic/us/en/2025/jun/0910-retro-rides-the-cadillac-sixteen-concept-oozing-power-and-luxury.html', 'GM explicitly says the 2003 Sixteen concept never entered production. This raw Q1025245 identity is distinct from the historical production V-16/Series 90. Exclude the concept, preserving those production families.'],
  ['cadillac', 'provoq', 'https://media.gm.com/Pages/galleries/intl/en/cadillac/vehicles/concepts-cars/provoq.html', 'GM places Provoq in its ConceptCars gallery, not the production SRX family. Exclude from ordinary production-model selection or retain only in a separate concept section.'],
  ['cadillac', 'urban-luxury-concept', 'https://www.prnewswire.com/news-releases/cadillac-urban-luxury-concept-a-study-of-efficient-and-intelligent-design-for-a-new-luxury-customer-108569884.html', 'Original General Motors release dated 16 November 2010 explicitly introduces a design study. Exclude from ordinary production-model selection or classify separately as a concept.'],
  ['de-tomaso', 'p900', 'https://www.detomaso-automobili.com/news/de-tomaso-automobili-confirms-final-p900-v12-specification-and-announces-collaboration-with-italtecnica', 'Manufacturer 24 February 2026 statement explicitly configures P900 exclusively for track use at this time. Exclude from the ordinary road-car model selector; preserve a separate track-programme identity. Future road evolution is only conditional.'],
  ['fisker-automotive', 'fisker-atlantic', 'https://oversight.house.gov/wp-content/uploads/2013/04/FISKER-Testimony.pdf', 'Founder testimony dated 24 April 2013 states Atlantic had not entered production; original manufacturer release describes a design prototype. Exclude from production-model selection, preserving the prototype record separately.'],
];
for (const [make, slug, source, reason] of exclusions) {
  const row = raw.find(x => x.makeSlug === make && x.slug === slug);
  if (!row) throw Error('Missing raw identity ' + make + '/' + slug);
  const report = read(dir + make + '.json');
  const sources = [source];
  if (slug === 'fisker-atlantic') sources.push('https://allcarcentral.com/Fisker_pdf/Fisker_Atlantic_2013.pdf');
  if (!report.removeModels.some(x => x.file === 'models-auto' && x.slug === slug)) {
    report.removeModels.push({ file: 'models-auto', slug, qid: row.qid, reason, sources });
    report.reviewScope.externalChecks.push({ scope: 'Independent root raw-model eligibility review: ' + slug, sources, result: reason });
    report.summary += ' Root independently proposes excluding ' + slug + ' from ordinary production-model selection.';
  }
  write(dir + make + '.json', report);
}
{
  const report = read(dir + 'fisker.json');
  const source = 'https://www.deb.uscourts.gov/sites/deb/files/opinions/fah-fisker-warn-act-combined_0.pdf';
  const row = raw.find(x => x.makeSlug === 'fisker' && x.slug === 'karma');
  if (!row) throw Error('Missing Fisker Karma raw identity');
  if (!report.modelFixes.some(x => x.file === 'models-auto' && x.slug === 'karma' && x.field === 'makeSlug')) {
    report.modelFixes.push({ file: 'models-auto', slug: 'karma', field: 'makeSlug', from: 'fisker', to: 'fisker-automotive', sources: [source, 'https://oversight.house.gov/wp-content/uploads/2013/04/FISKER-Testimony.pdf'], confidence: 'high', reason: 'Court findings and founder testimony assign the original 2011–2012 Karma to the company formed in 2007. Current fisker display identity is the 2016 Fisker Inc company. Curated Karma line/card already belongs to fisker-automotive; align the raw row without moving the correct card. Canonical Wikidata company-QID mapping also requires separate review.' });
    report.reviewScope.externalChecks.push({ scope: 'Independent root Karma manufacturer attribution', sources: [source], result: 'Original Karma belongs to the 2007 Fisker Automotive entity; raw assignment disagrees with the already correct curated line/card.' });
    report.summary += ' Root proposes moving the raw Karma attribution to Fisker Automotive, matching the correct curated card.';
  }
  write(dir + 'fisker.json', report);
}
{
  const report = read(dir + 'fisker-automotive.json');
  const check = report.reviewScope.externalChecks.find(x => x.scope?.includes('fisker-atlantic'));
  if (check && !check.sources.includes('https://www.deb.uscourts.gov/sites/deb/files/opinions/fah-fisker-warn-act-combined_0.pdf')) {
    check.sources.push('https://www.deb.uscourts.gov/sites/deb/files/opinions/fah-fisker-warn-act-combined_0.pdf');
  }
  write(dir + 'fisker-automotive.json', report);
}
console.log('Independent root review: six raw eligibility exclusions and one Karma attribution proposal; no shared files changed.');
