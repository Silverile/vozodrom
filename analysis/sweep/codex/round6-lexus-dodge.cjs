const fs = require('fs');
const ctSources = ['https://media.lexus.co.uk/wp-content/uploads/sites/3/2021/06/1612176799210129MCTTechSpec.pdf','https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/lexus/ct/a10-facelift/240421/','https://l1-movies.lexus-europe.com/media/downloads/ct-brochure.pdf'];
const dodgeSources = ['https://s3.amazonaws.com/chryslermedia.iconicweb.com/mediasite/specs/dodge_caliber_specificationsONA.pdf','https://www.mit-pferden-reisen.de/files/Zugfahrzeuge_ADACliste_ab400.pdf'];
const lcSources = ['https://lexus.jp/models/lc/','https://www.roadandtrack.com/news/a70202730/lexus-lc-500-production-ends-august-2026/','https://lexus.jp/news/info/delivery/'];
for (const m of ['lexus','dodge']) {
 const path = 'src/data/catalog/model-cards/'+m+'.json', rp='analysis/sweep/codex/'+m+'.json';
 const data=JSON.parse(fs.readFileSync(path)), report=JSON.parse(fs.readFileSync(rp)), edits=[];
 function set(c,i,k,v,sources,kind='data') {
  const obj=i===null?c:c.generations[i], from=Object.hasOwn(obj,k)?structuredClone(obj[k]):null;
  if(JSON.stringify(from)===JSON.stringify(v))return;
  obj[k]=v; edits.push({lineSlug:c.lineSlug,path:(i===null?'':`generations[${i}].`)+k,from,to:v,sources,kind,round:'depth-6'});
 }
 if(m==='lexus') {
  const c=data.find(c=>c.lineSlug==='ct'),g=c.generations[0];
  const trim={name:'CT 200h e-CVT (European powertrain)',kind:'technical-version',from:null,to:null,bodyType:'hatchback',engine:{fuel:'petrol-hev',displacementCc:1798,cylinders:4,powerKw:73,torqueNm:142,powerStandard:'Combustion-engine output; combined hybrid system output is 100 kW'},transmission:{type:'automatic',gears:null},drive:'fwd',dimensionsMm:{length:null,width:null,height:null,wheelbase:null},massKg:null,massBasis:null,topSpeedKmh:180,acceleration0to100s:10.3,consumptionL100:null,consumptionCycle:null,consumptionKwh100:null,rangeKm:null,rangeCycle:null,specificationScope:{market:'Europe',modelYear:null,noteCs:'Výkon a točivý moment motoru patří spalovacímu motoru 2ZR-FXE; hybridní soustava má 100 kW. e-CVT nemá pevné převodové stupně. Rozměry, hmotnost a spotřeba se liší podle modernizace, trhu a výbavy; nejsou zde sloučeny.'},sources:ctSources};
  trim.fieldSources=Object.fromEntries(['engine.fuel','engine.displacementCc','engine.cylinders','engine.powerKw','engine.torqueNm','transmission.type','drive','topSpeedKmh','acceleration0to100s'].map(k=>[k,ctSources]));
  set(c,0,'trims',[trim],ctSources);
  set(c,0,'engines',[{fuel:'petrol-hev',displacementCc:1798,displacementLitresNominal:1.8,powerKwMin:100,powerKwMax:100,variant:'CT 200h; hybrid system 100 kW; 2ZR-FXE combustion engine 73 kW'}],ctSources);
  set(c,0,'engineCoverage','partial',ctSources);set(c,0,'drivetrains',['fwd'],ctSources);
  set(c,0,'fieldSources',{...(g.fieldSources||{}),engines:ctSources,trims:ctSources,drivetrains:ctSources},ctSources,'maintenance');
  set(c,0,'sources',[...new Set([...g.sources,...ctSources])],ctSources,'maintenance');set(c,null,'sources',[...new Set([...c.sources,...ctSources])],ctSources,'maintenance');
  const lc=data.find(c=>c.lineSlug==='lc');
  for(let i=0;i<lc.generations.length;i++) {
   set(lc,i,'to',2026,lcSources);set(lc,i,'productionStatus','ended',lcSources);
   set(lc,i,'sources',[...new Set([...lc.generations[i].sources,...lcSources])],lcSources,'maintenance');
   set(lc,i,'fieldSources',{...(lc.generations[i].fieldSources||{}),to:lcSources,productionStatus:lcSources},lcSources,'maintenance');
  }
  set(lc,null,'sources',[...new Set([...lc.sources,...lcSources])],lcSources,'maintenance');
  report.yearConventionRechecks=[...(report.yearConventionRechecks||[]),
   {lineSlug:'is',generationIndex:1,field:'from',kept:2001,verdict:'Retained: contemporary OEM September2001 press pack documents normal retail October2001; Toyota Gita lineage starts July2001. Exact Lexus factory start month not established.',sources:['https://media.lexus.co.uk/lexus-is300-and-sportcross-redefining-compact-luxury-saloons/','https://www.toyota-global.com/company/history_of_toyota/75years/vehicle_lineage/car/id60000183/index.html']},
   {lineSlug:'lc',generationIndex:1,field:'from',kept:2020,verdict:'OEM manual index explicitly says Convertible production begins June2020; Japanese sales begin July2020. 2019 was prototype/reveal.',sources:['https://manual.lexus.jp/lc/','https://global.toyota/jp/newsroom/lexus/32732194.html']},
   {lineSlug:'rx',generationIndex:4,field:'from',kept:2017,verdict:'RX450hL launched December7,2017 in Japan; OEM manual index December2017 production period. UK2018 launch is market-specific. Earlier NHTSA URL inaccessible this pass.',sources:['https://global.toyota/jp/newsroom/lexus/20116694.html','https://manual.lexus.jp/rx/','https://toyota.jp/ucar/catalog/brand-LEXUS/car-RX/201712/10113193/']}];
  report.conflicts.push({where:'CT 200h European specification scope',values:{OEM2021Length:4355,ADAC2014Length:4350,OEM2021Kerb:'1410–1465kg',ADAC2014EUWeight:1485},kept:null,note:'No universal generation length/weight filled: facelift, specification and weight conventions differ. 73kW engine and100kW system distinguished.'});
 } else {
  const c=data.find(c=>c.lineSlug==='caliber'),g=c.generations[0];
  set(c,0,'engines',g.trims.map(t=>({fuel:t.engine.fuel,displacementCc:t.engine.displacementCc,displacementLitresNominal:t.engine.displacementCc===1798?1.8:2,powerKwMin:t.engine.powerKw,powerKwMax:t.engine.powerKw,variant:t.name})),dodgeSources);
  set(c,0,'engineCoverage','partial',dodgeSources);
  for(let i=0;i<g.trims.length;i++) {
   const t=g.trims[i],from=structuredClone(t);
   for(const k of ['engine.fuel','engine.displacementCc','engine.powerKw','engine.torqueNm','transmission.type','drive'])t.fieldSources[k]=[...new Set([...t.fieldSources[k],dodgeSources[1]])];
   t.sources=[...new Set([...t.sources,dodgeSources[1]])];
   edits.push({lineSlug:'caliber',path:`generations[0].trims[${i}]`,from,to:t,sources:dodgeSources,kind:'maintenance',round:'depth-6'});
  }
  set(c,0,'fieldSources',{...(g.fieldSources||{}),engines:dodgeSources},dodgeSources,'maintenance');set(c,0,'sources',[...new Set([...g.sources,...dodgeSources])],dodgeSources,'maintenance');set(c,null,'sources',[...new Set([...c.sources,...dodgeSources])],dodgeSources,'maintenance');
 }
 report.cardFixesApplied.push(...edits);
 report.depthRounds=[...(report.depthRounds||[]),{round:6,checkedAt:'2026-10-29',lines:m==='lexus'?['ct','lc','is','rx']:['caliber'],newTechnicalRows:m==='lexus'?1:0,newEngineSummaryRows:m==='lexus'?1:3,appliedEntries:edits.length,scope:'Bounded partial depth; no whole-make completion claimed.',photoReview:m==='lexus'?'CT Commons description, February2011 date, Autoviva and CC BY2.0 verified. Prior visual review retained, not re-reviewed; LC images null.':'Caliber Commons description, Cutlass and CC0 verified: normal 2008 Caliber in Pennsylvania; same international body generation. European trim identity not inferred; prior visual review retained.'}];
 report.openQuestions.push(m==='lexus'?'Depth6 partial: 18 of19 Lexus lines have no new technical row here. IS SportCross exact factory start month unverified. CT facelifts/code/end and other images not fully reconciled. LC2026 end follows OEM dealer schedule plus official sales-ended page, not last-unit certificate.':'Depth6 partial: Caliber three existing engine/fuel/drive/transmission-type rows independently corroborated. Weight/performance retain OEM-only support; later2.2CRD/SRT4 and remaining81 Dodge lines need depth.');
 fs.writeFileSync(path,JSON.stringify(data,null,2)+'\n');fs.writeFileSync(rp,JSON.stringify(report,null,2)+'\n');
 console.log(m,JSON.stringify({applied:edits.length,data:edits.filter(e=>e.kind==='data').length,maintenance:edits.filter(e=>e.kind==='maintenance').length}));
}
