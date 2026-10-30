import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const dir='analysis/codex/facelift-skoda-86',input='src/data/catalog/model-cards/skoda.json';
fs.mkdirSync(dir,{recursive:true});
const raw=fs.readFileSync(input,'utf8'),cards=JSON.parse(raw),sha=crypto.createHash('sha256').update(raw).digest('hex');
const origin='https://www.skoda-storyboard.com/';
const sources={
 octHistory:'https://cdn.skoda-storyboard.com/2024/05/Octavia_History_a6eedf18.pdf',
 oct1:origin+'en/models/octavia/the-iconic-czech-estate-car-down-the-years/',
 oct2:origin+'en/models/octavia/first-sketches-of-the-innovated-octavia-take-a-look/',
 oct3:origin+'en/press-kits/skoda-octavia-bestseller-comprehensive-upgrade/',
 oct4:origin+'en/press-kits/skoda-octavia-media-launch-press-kit/exterior-visual-fine-tuning-as-well-as-advanced-headlight-design-and-technology/',
 fabHistory:'https://cdn.skoda-storyboard.com/2021/04/SKODA_FABIA_Historie_modelu.pdf',
 fab2:'https://www.skoda-auto.com/_doc/764cfeca-e933-425e-b1cd-dc0a2056fcfe',
 fab3:origin+'en/press-kits/design-and-technology-update-for-the-skoda-fabia/exterior-new-design-features-for-a-more-distinctive-appearance/',
 sup1:origin+'de/modelle-de/superb-de/rueckspiegel-20-jahre-skoda-superb/',
 sup2:origin+'en/skoda-world/a-beautiful-estate-and-a-unique-sedan-superb-ii-designers-look-back/',
 sup3:origin+'en/press-kits/skoda-superb-press-kit/design-even-more-exquisite-look-and-a-new-adventurer/',
 supTimeline:origin+'en/models/superb/king-of-space-and-long-distance-travel-skoda-superb-celebrates-25-years/',
 kod:origin+'en/press-kits/the-new-skoda-kodiaq-press-kit/exterior-redesigned-front-and-more-rugged-look/',
 kar:origin+'en/press-kits/the-new-skoda-karoq-world-premiere-press-kit/exterior-striking-front-profile-and-redesigned-lights/'
};
// year denotes the documented facelift presentation/history year. Never infer productionYear or end.
const facts=[
 ['octavia',0,'Octavia I',2000,'Modernizace přídě přinesla zaoblenější světlomety s čirou optikou a upravený nárazník. Tovární přehled uvádí modernizaci v září 2000; detailní popis se vztahuje ke Combi.',[sources.octHistory,sources.oct1]],
 ['octavia',1,'Octavia II',2008,'Modernizace přinesla větší a výraznější přední světlomety a upravenou příď. Rok 2008 je rok faceliftu v tovární historii, nikoli automaticky modelový nebo výrobní rok všech verzí.',[sources.octHistory,sources.oct2]],
 ['octavia',2,'Octavia III',2017,'Přepracovaná příď má širší masku a rozdělené přední světlomety se čtyřokým motivem; změněn byl také přední nárazník a grafika zadních LED svítilen.',[sources.octHistory,sources.oct3]],
 ['octavia',3,'Octavia IV',2024,'Modernizace čtvrté generace zahrnuje přepracované přední a zadní nárazníky, upravenou masku a nový světelný podpis světlometů. Volitelné Matrix LED světlomety používají prvky Crystallinium; změnily se také zadní LED svítilny.',[sources.oct4]],
 ['fabia',1,'Fabia II',2010,'Nová maska a přepracované prostorově tvarované přední světlomety změnily vzhled přídě. Rok 2010 a označení faceliftu potvrzuje tovární chronologie a výroční zpráva.',[sources.fabHistory,sources.fab2]],
 ['fabia',2,'Fabia III',2018,'Modernizace změnila masku, přední i zadní nárazník a přední i zadní svítilny. LED hlavní světlomety a LED zadní svítilny byly nabízeny jako volitelná výbava; nešlo o povinnou výbavu každého vozu.',[sources.fabHistory,sources.fab3]],
 ['superb',0,'Superb I',2006,'Modernizace změnila přední nárazník, masku a zadní svítilny s charakteristickým motivem písmene C. Současně přibyla vrcholná výbava Laurin & Klement; sama výbava nepředstavuje další facelift.',[sources.sup1,sources.supTimeline]],
 ['superb',1,'Superb II',2013,'Modernizace přinesla nový tvar předních světlometů s LED denním svícením a přepracované zadní svítilny s motivem tří pásů písmene C.',[sources.sup2,sources.supTimeline]],
 ['superb',2,'Superb III',2019,'Upravená příď má větší masku s dvojitými lamelami a nový nárazník; zadní část dostala nové LED svítilny, chromovanou příčnou lištu a nápis ŠKODA. Dostupnost Matrix LED světlometů závisí na konkrétní výbavě.',[sources.sup3,sources.supTimeline]],
 ['kodiaq',0,'Kodiaq I',2021,'Modernizace zvýraznila kapotu a vzpřímenější šestiúhelníkovou masku, zúžila přední světlomety a změnila polohu mlhovek. Upraveny byly také zadní svítilny a střešní spoiler; Matrix LED byly volitelné.',[sources.kod]],
 ['karoq',0,'Karoq — základní řada',2021,'Modernizace představená v listopadu 2021 přinesla širší šestiúhelníkovou masku, nový přední nárazník, užší světlomety a zadní svítilny a delší zadní spoiler. Matrix LED světlomety byly volitelné.',[sources.kar]]
];
const patches=[];
for(const [lineSlug,gi,expectedGenerationName,year,note,urls]of facts){
 const c=cards.find(c=>c.lineSlug===lineSlug),g=c.generations[gi];assert.equal(g.name,expectedGenerationName);
 const old=(g.facelift??[]).find(f=>f.year===year);
 const entry={...(old??{}),year,to:null,name:expectedGenerationName+' – modernizace '+year,code:null,productionYear:old?.productionYear??null,note:old?.note?old.note+' '+note:note,sources:[...new Set([...(old?.sources??[]),...urls])],photo:old?.photo??null};
 const ix=old?(g.facelift??[]).indexOf(old):(g.facelift??[]).length;
 const changes=Object.keys(entry).filter(k=>JSON.stringify(old?.[k])!==JSON.stringify(entry[k]));
 patches.push({makeSlug:'skoda',lineSlug,generationIndex:gi,expectedGenerationName,expectedGenerationCode:g.code,expectedFacelift:g.facelift,operation:'merge-entry-by-year-preserve-other-entries',entry,prospectiveFields:changes.map(k=>`generations[${gi}].facelift[${ix}].${k}`),needsReview:['to','code','productionYear','photo'].filter(k=>entry[k]===null).map(k=>({field:`generations[${gi}].facelift[${ix}].${k}`,reason:k==='photo'?'Fotografie konkrétního faceliftu nebyla ověřena; snímek celé generace není automaticky snímkem modernizace.':k==='code'?'Samostatný tovární kód faceliftu nebyl doložen; kód generace není bez ověření převzat.':'Přesný výrobní interval modernizovaného provedení nebyl ověřen; rok premiéry jej nenahrazuje.'}))});
}
const withheld=[{lineSlug:'fabia',generationIndex:0,expectedGenerationName:'Fabia I',year:2004,sources:[sources.fabHistory],reason:'Tovární časová osa výslovně dokládá facelift 2004, ale přesné viditelné změny nebyly v omezeném průzkumu samostatně popsány. Kandidát není součástí připravených aplikovatelných patchů.'}];
const report={scope:'Prepared only; protected Skoda card remains unchanged.',input,inputSha256:sha,counts:{lines:5,patches:patches.length,newEntries:patches.filter(p=>p.expectedFacelift===null).length,existingEntriesEnriched:patches.filter(p=>p.expectedFacelift!==null).length,photos:0,withheldCandidates:1},preservation:'Existing Octavia IV 2024 year, productionYear and source retained; sources unioned, note expanded. Other entries must be preserved if applying onto newer state.',gaps:['No Commons requests made (shared rate-limit pause). All facelift-specific photos unknown.','All facelift end bounds and actual production-start years remain null; neither generation end nor marketing/model year is substituted.','Fabia I 2004 withheld pending visible-change description or direct review of original brochure.','No additional facelift claimed for Fabia IV, Superb IV or Kodiaq II. Absence from this bounded research is not evidence of no update.','Editorial names describe the facelift; no independent factory facelift code is asserted.'],prospectiveChanges:patches.map(p=>({lineSlug:p.lineSlug,generationIndex:p.generationIndex,expectedGenerationName:p.expectedGenerationName,year:p.entry.year,fields:p.prospectiveFields})),withheld,sources};
fs.writeFileSync(dir+'/patches.json',JSON.stringify(patches,null,2)+'\n');
fs.writeFileSync(dir+'/report.json',JSON.stringify(report,null,2)+'\n');
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(input,'utf8')).digest('hex'),sha);
assert.equal(new Set(patches.map(p=>p.lineSlug+'/'+p.generationIndex+'/'+p.entry.year)).size,patches.length);
for(const p of patches){assert.ok(p.entry.sources.length);assert.equal(p.entry.to,null);assert.equal(p.entry.productionYear,null);assert.equal(p.entry.photo,null);}
console.log('PASS prepared '+patches.length+' keyed patches; Skoda SHA256 unchanged '+sha);
