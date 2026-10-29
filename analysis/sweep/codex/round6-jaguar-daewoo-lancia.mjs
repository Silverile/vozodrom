import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const base='analysis/sweep/codex/';
const makes=['jaguar','daewoo','lancia'];
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const snapshots={};
assert(!fs.existsSync(base+'ROUND6-JDL-BASELINE.json'),'One-shot edit helper: baseline already exists; do not overwrite later work.');
for(const m of makes)snapshots[m]={cards:read(`src/data/catalog/model-cards/${m}.json`),report:read(`${base}${m}.json`)};
fs.writeFileSync(base+'ROUND6-JDL-BASELINE.json',JSON.stringify(snapshots,null,2)+'\n');
const counts={};
for(const m of makes){
 const cards=structuredClone(snapshots[m].cards),report=structuredClone(snapshots[m].report);let n=0;
 const audit=(lineSlug,result,sources)=>{(report.depthAudits??=[]).push({pass:'TURN-6-DEPTH',lineSlug,result,sources});};
 const change=(slug,path,to,sources,reason)=>{
  const c=cards.find(x=>x.lineSlug===slug),keys=path.replace(/\[(\d+)\]/g,'.$1').split('.');let p=c;
  for(const k of keys.slice(0,-1))p=p[k];const key=keys.at(-1),from=structuredClone(p[key]??null);
  if(JSON.stringify(from)===JSON.stringify(to))return;
  p[key]=structuredClone(to);report.cardFixesApplied.push({lineSlug:slug,path,from,to,sources,reason,pass:'TURN-6-DEPTH'});n++;
 };
 const addSources=(slug,gi,urls)=>{
  const c=cards.find(x=>x.lineSlug===slug),g=c.generations[gi];
  change(slug,`generations[${gi}].sources`,[...new Set([...g.sources,...urls])],urls,'Sources checked in this depth pass.');
  change(slug,'sources',[...new Set([...c.sources,...urls])],urls,'Sources checked in this depth pass.');
 };
 if(m==='jaguar'){
  const e=['https://www.jaguarheritage.com/jdht/wp-content/uploads/RG001F-Jaguar-E-type-v.3-25-01-2023-1.pdf',"https://www.jcna.com/sites/default/files/01_Draft_Series_1_E-Type_Judges_Guide_Intro-Exterior.pdf"];
  change('e-type','generations[2].from',null,e,'1965 documents the first numbered builds, not an independently established start of series production; JCNA dates the 2+2 chassis sequence to March 1966. Null pending reconciliation under the human series-production convention.');
  const c=cards.find(x=>x.lineSlug==='e-type');
  change('e-type','needsReview',[...c.needsReview,{field:'generations[2].from',reason:'První číslované vozy 2+2 jsou doloženy v roce 1965, veřejné uvedení a údaj JCNA v roce 1966. Začátek sériové výroby není oddělen od prvních kusů; do vyřešení null.'}],e,'Explicit unresolved series-production boundary.');
  addSources('e-type',2,e);
  (report.conflicts??=[]).push({where:'e-type.generations[2].from',values:{'JDHT first numbered builds':1965,'JCNA chassis sequence / public launch':1966},kept:null,reason:'First-build and series-production dates must not be conflated.',sources:e});
  const annual='https://www.sec.gov/Archives/edgar/data/926042/000119312518271030/d619010d6k.htm';
  audit('xe','Rechecked XEL from=2017: manufacturer regulatory filing confirms actual production and December 2017 sales, not just a reveal. Retained. Calendar end/status remain unresolved.',[annual,'https://www.cheryjaguarlandrover.com/en/2338/']);
  audit('xf','Rechecked X260 Sportbrake from=2017 and XFL from=2016: actual sales in those calendar years corroborate series manufacture. Retained. This does not verify current XFL end/status.',[annual,'https://media.jlr.com/corporate/news/2017/06/new-jaguar-xf-sportbrake','https://media.jlr.com/archive-jaguar/news/2016/04/all-new-jaguar-xfl-good-be-driven-it-drive']);
  audit('xk','Potential unresolved first-build/series distinction: Heritage identifies first official X150 production convertible completed 20 December 2005, while annual report calls XK launched in 2006. Existing 2005 retained pending evidence specifically separating series production from first car.', ['https://www.jaguarheritage.com/vehicle-collection/2006-jaguar-xk-convertble-first-production-xk-convertible-x150/','https://media.production.jlrms.com/alf/docs/2019-06/b8e31c59-896e-4180-92a1-f1ee60740627/20102011annualreport.pdf']);
 }
 if(m==='lancia'){
  const ly=['https://de.wikipedia.org/w/index.php?oldid=258766342&title=Lancia_Lybra','https://www.media.stellantis.com/it-it/lancia/press/guidare-lancia-raccontare-lybra','https://www.tcs.ch/mam/Digital-Media/PDF/Booklets/Fahren-mit-Licht-am-Tag-Fahrzeugliste-Ausruestungsmerkmale.pdf'];
  change('lybra','generations[0].from',1999,ly,'Series production convention: German production period and TCS Produktion ab both 1999; contemporary manufacturer launch 1999. English infobox 1998 not adopted.');addSources('lybra',0,ly);
  const yp=['https://www.media.stellantis.com/em-en/lancia/press/lancia-ypsilon-4','https://de.wikipedia.org/wiki/Lancia_Ypsilon_(843)','https://www.sbricambi.it/ProductsResources/11830/EPS-EPS23-E_it_sch.pdf?1756908774='];
  change('ypsilon','generations[0].from',2003,yp,'Type843 series-production start is 2003, not English infobox first-build year2002.');
  change('ypsilon','generations[0].engines',[
   {fuel:'petrol',displacementCc:1242,displacementLitresNominal:1.2,powerKwMin:44,powerKwMax:44,variant:'1.2 8V 60 PS – nabídka při uvedení 2003'},
   {fuel:'petrol',displacementCc:1242,displacementLitresNominal:1.2,powerKwMin:59,powerKwMax:59,variant:'1.2 16V 80 PS – nabídka při uvedení 2003'},
   {fuel:'petrol',displacementCc:1368,displacementLitresNominal:1.4,powerKwMin:70,powerKwMax:70,variant:'1.4 16V 95 PS – nabídka při uvedení 2003'},
   {fuel:'diesel',displacementCc:1248,displacementLitresNominal:1.3,powerKwMin:51,powerKwMax:51,variant:'1.3 Multijet 70 PS – nabídka při uvedení 2003'}
  ],yp,'Launch engine selection corroborated by manufacturer launch, supplier application table and generation history; later powertrains not claimed complete.');
  change('ypsilon','generations[0].engineCoverage','partial',yp,'Only four launch engines covered; not whole generation.');addSources('ypsilon',0,yp);
  audit('aprilia','Series-production recheck passed: retained1937. Stellantis explicitly distinguishes October1936 presentation from1937 production, independently corroborated by museum production history.', ['https://www.stellantisheritage.com/en-uk/heritage/stories/lancia-aprilia-first-series','https://www.fmm.co.za/collection-in-action-lancia-aprilia/']);
  audit('ypsilon','Scope remains partial: no comprehensive 846/L21 powertrain, facelift or photo revalidation in this bounded round. 843 photo is null; no invented replacement.',yp);
 }
 if(m==='daewoo'){
  const k=['https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/daewoo/kalos/1generation/995334/','https://www.anwb.nl/auto/informatie/daewoo/kalos/i/eddf42c4-25e8-df11-a731-000c29d2a1e4'];
  change('kalos','generations[0].trims',[{name:'1.4 8V 61 kW – evropský hatchback 5MT',kind:'technical-version',from:null,to:null,bodyType:'hatchback',engine:{fuel:'petrol',displacementCc:1399,cylinders:4,powerKw:61,powerStandard:null,torqueNm:123},transmission:{type:'manual',gears:5},drive:'fwd',dimensionsMm:{length:null,width:null,height:null,wheelbase:null},massKg:null,massBasis:null,topSpeedKmh:170,acceleration0to100s:null,consumptionL100:7.5,consumptionCycle:'Dobový kombinovaný údaj výrobce podle ADAC a ANWB; přesná norma zde neověřena.',consumptionKwh100:null,rangeKm:null,rangeCycle:null,specificationScope:{market:'Evropa; německá a nizozemská specifikace',modelYear:null,noteCs:'Vybrané společné technické údaje varianty 1.4 8V 61 kW. Není tvrzena shodná výbava SE/Style ani globální délka výroby. Rozměry, hmotnost a zrychlení zůstávají neověřené.'},sources:k}],k,'Matching displacement, power, torque, cylinder count, manual5, front drive, top speed and combined consumption independently compared; trim names differ by market.');
  addSources('kalos',0,k);
  audit('kalos','Existing photo description and Commons categories agree with a Daewoo Kalos hatchback; retained existing credit and pending visualReview. Family end stays null to avoid assigning Chevrolet/Gentra dates to Daewoo.', ['https://commons.wikimedia.org/w/index.php?title=File:Daewoo_Kalos_front_20070913.jpg&oldid=1283173150']);
  audit('leganza','Technical conflict detected: current UK brochure trim torque185Nm versus German generation table184Nm for nominally similar 98kW engine. Did not combine markets or overwrite; further UK corroboration needed.', ['http://www.darewnoo.pl/GTA/naforum/pros/u/d/211.jpg','https://de.wikipedia.org/w/index.php?title=Daewoo_Leganza&oldid=266126516']);
 }
 counts[m]=n;
 fs.writeFileSync(`src/data/catalog/model-cards/${m}.json`,JSON.stringify(cards,null,2)+'\n');
 fs.writeFileSync(`${base}${m}.json`,JSON.stringify(report,null,2)+'\n');
}
for(const m of makes){
 const report=read(base+m+'.json'),cards=read(`src/data/catalog/model-cards/${m}.json`),before=snapshots[m],replay=structuredClone(before.cards);
 for(const [key,v] of Object.entries(before.report))if(Array.isArray(v))assert.deepEqual(report[key].slice(0,v.length),v);
 for(const x of report.cardFixesApplied.slice(before.report.cardFixesApplied.length)){
  assert(x.sources.length>=2);const c=replay.find(c=>c.lineSlug===x.lineSlug),keys=x.path.replace(/\[(\d+)\]/g,'.$1').split('.');let p=c;
  for(const k of keys.slice(0,-1))p=p[k];assert.deepEqual(p[keys.at(-1)]??null,x.from);p[keys.at(-1)]=structuredClone(x.to);
 }
 assert.deepEqual(cards,replay,'Unlogged changes '+m);
}
const tmp=base+'round6-jdl-typecheck.ts';
fs.writeFileSync(tmp,"import type {CatalogModelCard} from '../../../src/data/catalog/types';\n"+makes.map((m,i)=>`const cards${i}:CatalogModelCard[]=${JSON.stringify(read(`src/data/catalog/model-cards/${m}.json`))};`).join('\n'));
try{const r=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','--ignoreConfig','--noEmit','--strict','--skipLibCheck','--target','ES2022','--moduleResolution','bundler','--module','esnext',tmp],{encoding:'utf8'});process.stdout.write(r.stdout||'');process.stderr.write(r.stderr||'');assert.equal(r.status,0);}finally{fs.unlinkSync(tmp);}
console.log(JSON.stringify({counts,reportArraysPreserved:true,allChangesReplayed:true,strictTypes:true}));
