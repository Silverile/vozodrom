const fs = require('fs');
const base = 'analysis/sweep/codex/';
function review(make) {
  const file = `src/data/catalog/model-cards/${make}.json`;
  const cards = JSON.parse(fs.readFileSync(file, 'utf8'));
  const report = JSON.parse(fs.readFileSync(base + make + '.json', 'utf8'));
  const changes = [];
  function set(slug, gi, field, value, sources, note) {
    const card = cards.find(c => c.lineSlug === slug), g = card.generations[gi];
    if (JSON.stringify(g[field]) === JSON.stringify(value)) return;
    changes.push({lineSlug:slug,path:`generations[${gi}].${field}`,from:g[field],to:value,sources,confidence:'high',round:9,note});
    g[field] = value;
    g.sources = [...new Set([...g.sources, ...sources])];
    card.sources = [...new Set([...card.sources, ...sources])];
  }
  function done(notes) {
    report.cardFixesApplied.push(...changes);
    report.depthReviews ??= [];
    report.depthReviews.push({round:9,checkedAt:'2026-10-29',scope:'Selected generation dates/status/codes/facelifts and existing photo metadata; partial depth, no trim audit',changes:changes.length,...notes});
    fs.writeFileSync(file, JSON.stringify(cards,null,2)+'\n');
    fs.writeFileSync(base+make+'.json',JSON.stringify(report,null,2)+'\n');
    console.log(make, changes.length, 'field corrections;', cards.length, 'card lines inventoried');
  }
  return {cards,report,set,done};
}
const ds=review('ds-automobiles');
const ended=['https://www.largus.fr/pros/actualite-automobile/les-ds4-et-ds5-ne-sont-plus-produites-9232398.html','https://d2km96w3x5blkf.cloudfront.net/car-news/new-cars/ds-4-and-5-production-ends-part-drastic-line-changes'];
for(const slug of ['ds-4','ds-5']) {ds.set(slug,0,'to',2018,ended,'Two contemporary independent reports explicitly confirm factory production ended in May 2018; showroom stock is separate.');ds.set(slug,0,'productionStatus','ended',ended);}
const start3=['https://www.media.stellantis.com/em-en/psa-archive/press/groupe-psa-poissy-plant-to-produce-an-additional-vehicle','https://www.largus.fr/actualite-automobile/simca-peugeot-citroen-ds-tous-les-modeles-produits-dans-l-usine-de-poissy-depuis-1946-30035533.html'];
ds.set('ds-3',1,'from',2019,start3,'Production line operational in 2019; not the 2018 motor-show debut.');
const fl3=['https://www.media.stellantis.com/uk-en/ds/press/new-ds-3-the-art-of-refinement','https://www.dsautomobiles.de/ds-welt/entdecken/news/vorstellung-neuer.html'];
ds.set('ds-3',1,'facelift',[{year:2022,productionYear:null,note:'Modernizace představena v září 2022; označení Crossback vypuštěno. Dodávky modernizované verze v Evropě následovaly v roce 2023; přesný rok přechodu sériové výroby není potvrzen.',sources:fl3}],fl3);
const start4=['https://www.media.stellantis.com/de-de/ds/press/Made-in-Germany_Erster-DS-4-rollt-in-Ruesselsheim-vom-Band','https://en.wikipedia.org/wiki/DS_No._4'];
ds.set('ds-4',1,'from',2021,start4);
ds.set('ds-4',1,'code','D41',['https://service.citroen.com/DSddb/index.html','https://www.autovisie.nl/nieuws/volgende-generatie-ds-4-laat-van-zich-horen/']);
const fl4=['https://www.media.stellantis.com/uploads/uk/attachment/n4avantgardededicatedtoexcellence_dsautomobiles_stellantismedia-69aeee46183e9.pdf','https://www.autozeitung.de/ds-no4-2025-preis-ausstattung-197549.html'];
ds.set('ds-4',1,'facelift',[{year:2025,productionYear:2025,note:'Modernizace druhé generace DS 4 přinesla označení N°4, novou příď a elektrickou verzi. Nejde o samostatnou novou generaci.',sources:fl4}],fl4);
ds.set('ds-4',1,'productionStatus','current',['https://www.media.stellantis.com/em-en/ds/ds-n04','https://www.autobild.de/marken-modelle/ds-automobiles/no4/']);
ds.set('ds-7',0,'from',2017,['https://www.stellantis.com/content/dam/stellantis-corporate/archives/psa/financial-documents/2017/fr/Document-de-reference-2017-Groupe-PSA.pdf','https://www.dna.fr/edition-mulhouse-thann/2020/05/16/ds-propose-a-ses-acheteurs-un-sejour-a-mulhouse'],'Series production, not January 2018 retail launch or 2016 prototypes.');
const fl7=['https://www.media.stellantis.com/uk-en/ds/press/new-ds-7-open-for-orders-in-the-uk','https://fr.wikipedia.org/wiki/DS_7'];
ds.set('ds-7',0,'facelift',[{year:2022,productionYear:2022,note:'Modernizace s novou přídí, světly DS Pixel LED Vision 3.0 a označením DS 7 bez Crossback; první britské dodávky v listopadu 2022.',sources:fl7}],fl7);
const start8=['https://www.media.stellantis.com/it-it/ds/press/ds-n08-l-eleganza-francese-con-un-tocco-di-orgoglio-italiano','https://www.quattroruote.it/news/industria-finanza/2025/04/02/ds_n_8_la_prima_speranza_per_il_rilancio_di_melfi.gallery.html'];
ds.set('n-8',0,'from',2025,start8,'Manufacturer and factory-visit report confirm actual assembly in April 2025, not December 2024 presentation.');
ds.report.conflicts.push({where:'DEPTH round9 DS9 exact production interval',values:{'https://en.wikipedia.org/wiki/DS_9':'01/2020–12/2023','https://www.just-auto.com/features/ds-9-why-stellantis-sees-value-in-a-french-luxury-sedan/':'production started January 2021','https://www.largus.fr/actualite-automobile/nouvelles-ds-automobiles-le-calendrier-secret-des-futurs-modeles-30038549.html':'production ended late 2024'},kept:null});
ds.done({photoChecks:[{lineSlug:'ds-3',generation:1,result:'Commons description, category and structured depicts identify DS3 Crossback; author Rutger van der Maar and CC BY2.0 match. No replacement.',sources:['https://commons.wikimedia.org/w/index.php?title=File:2019_DS_3_Crossback.jpg&oldid=888692297']},{lineSlug:'ds-4',generation:1,result:'Commons category DS4(2021), description DS4 white and Calreyn88/CC BY-SA4.0 match. No replacement.',sources:['https://commons.wikimedia.org/w/index.php?title=File:2022_DS_4_Rivoli_Puretech_Auto.jpg&oldid=966709314']},{lineSlug:'ds-9',generation:0,result:'Commons DS9 category, description DS9 white, author Calreyn88 and CC BY-SA4.0 match. No replacement.',sources:['https://commons.wikimedia.org/w/index.php?title=File:2022_DS_9_Performance_Line_%2B_Puretech.jpg&oldid=1124501264']}],limitations:['Metadata identity checked; no new visual image review. Existing reviewed flags preserved, not re-certified.','DS3 legacy, DS4I and DS5 brand-scope starts remain null: launch dates do not alone prove series-production dates.','DS5LS/DS6 terminal years, DS9 disputed chronology, N7 production and exact 2026 status for other rows remain unresolved.','European engines/trims remain unverified; no unsupported numbers added.']});
const ax=review('aixam');
const axsrc=['https://www.aixam.com/en/french-brand/history/about-us','https://www.leblogauto.com/actualites/actualite/aixam-une-gamme-renouvelee/','https://gsanspermis.com/aixam-a721/'];
ax.set('a721',0,'productionStatus','ended',axsrc,'City replaced A721 in 2008; exact final assembly year left null because parts-application dates conflict.');
ax.set('a741',0,'productionStatus','ended',axsrc,'Contemporary source identifies Roadline as former A741; no inference that end of parts-fitment equals factory end.');
ax.report.conflicts.push({where:'DEPTH round9 A721 exact final assembly year',values:{'https://gsanspermis.com/aixam-a721/':2008,'https://www.leblogauto.com/actualites/actualite/aixam-une-gamme-renouvelee/':'City replaced A721 by May 2008','https://ouverture-fine.com/wp-content/uploads/2025/09/Lishis-2025-OFC.pdf':'key application 2004–2009'},kept:null});
ax.done({photoChecks:[{scope:'All 19 local model lines',result:'All photo fields null; no mismatched asset to replace.'}],verifiedExisting:[{scope:'A721/A741/A751 starts2004; Scouty2005, Crossline2006, City/Roadline2008 and MAC1998',sources:['https://www.aixam.ro/ressources/pages/presse/dpaixammegagb.pdf','https://www.aixam.com/ressources/pages/marque/DosPres_Aixam2010_FR_bd.pdf','https://archives-catalogues-automobiles.fr/laurentbunnik/0aix0001.html'],note:'Manufacturer launch chronology and dated brochure archive support existing years; exact assembly timing remains partially documented.'}],limitations:['19 model lines inventoried; only A721/A741 lifecycle researched in depth this round.','No exact series-production end dates, generation-code assignments or numeric trim values added.','City/Coupe/Crossover family cards still require true generation splits; no assertion of full depth completion.']});
