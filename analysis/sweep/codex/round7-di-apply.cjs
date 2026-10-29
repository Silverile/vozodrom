const fs=require('fs');
const base=JSON.parse(fs.readFileSync('analysis/sweep/codex/round7-di-baseline.json','utf8'));
const aw='https://www.autoweek.nl/autotests/artikel/daihatsu-copen-roadster-13-16v-dvvt-2006/',sw='https://www.rupteur.ch/fr/targa/1db139',an='https://www.anwb.nl/auto/informatie/daihatsu/copen/i/975753c4-25e8-df11-a731-000c29d2a1e4';
const press='https://isuzu-germany-newsroom.prezly.com/neuer-isuzu-d-max-mit-22-liter-mehr-leistung-fur-den-arbeitsalltag',adac='https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/isuzu/d-max/3generation-facelift-2/351003/';
for(const m of ['daihatsu','isuzu']){
 const cards=structuredClone(base[m].cards),r=structuredClone(base[m].report),c=cards.find(x=>x.lineSlug===(m==='daihatsu'?'copen':'d-max')),src=m==='daihatsu'?[aw,sw,an]:[press,adac];
 function set(path,to,reason,kind='fact') {
  let o=c,keys=path.replace(/\[(\d+)\]/g,'.$1').split('.');for(const k of keys.slice(0,-1))o=o[k];let k=keys.at(-1),from=structuredClone(o[k]??null);if(JSON.stringify(from)===JSON.stringify(to))return;
  o[k]=to;r.cardFixesApplied.push({lineSlug:c.lineSlug,path,from,to:structuredClone(to),sources:src,reason,round:'depth-7',kind});
 }
 if(m==='daihatsu'){
  const trim=structuredClone(c.generations[0].trims[0]);
  Object.assign(trim,{name:'1.3 16V DVVT 64 kW 5MT - Europe, 2006 test specification',engine:{fuel:'petrol',displacementCc:1298,cylinders:4,powerKw:64,powerStandard:null,torqueNm:120},dimensionsMm:{length:null,width:1475,height:1245,wheelbase:2225},topSpeedKmh:180,specificationScope:{market:'Europe / Netherlands test; Swiss homologation corroboration',modelYear:2006,noteCs:'Evropsky motor 1.3 je odlisen od japonskeho turba. Delka 3395/3440 mm a hmotnost 850/925-935 kg se v pramenech lisi, proto zustavaji null. AutoWeek rozlisuje namerenych 10,6 s a tovarnich 9,0 s; zrychleni neni slouceno do jedne hodnoty. Rok specifikace neni odvozenym zacatkem vyroby.'},sources:src});
  set('generations[0].trims',[...c.generations[0].trims,trim],'Add independently corroborated European 1.3 technical version; preserve Japanese versions.');
  r.conflicts.push({where:'copen.generations[0].European 1.3 trim length and mass',values:{AutoWeek:{length:3395,mass:850},SwissApproval1DB139:{length:3440,massRange:[925,935]}},kept:null,sources:[aw,sw],round:'depth-7',reason:'No conversion or market transfer; affected new trim fields retained null.'});
  r.openQuestions.push('DEPTH-7: Copen II SOP/end/status and full European Sirion/Terios generation splits remain unresolved. Copen 1.3 dates, acceleration and mass require exact market/basis reconciliation. Manufacturer brochure archive returned 403; not bypassed.');
 }else{
  for(let i=0;i<c.generations[2].trims.length;i++)set(`generations[2].trims[${i}].engine.cylinders`,4,'2026 European manufacturer release and ADAC agree on four-cylinder 2.2 diesel shared by eight existing variants.');
  r.openQuestions.push('DEPTH-7: D-Max 2WD drive axle remains null: ADAC says rear-wheel drive but manufacturer brochure only says 2WD. Single Cab 2WD 8AT consumption remains null because brochure internal 8.7/8.9 conflict is not resolved by ADAC agreement with one value. Trooper and earlier D-Max generations not depth-complete.');
 }
 const gi=m==='daihatsu'?0:2;
 set(`generations[${gi}].sources`,[...new Set([...c.generations[gi].sources,...src])],'Attach depth-7 evidence.','evidence');
 set('sources',[...new Set([...c.sources,...src])],'Attach depth-7 evidence.','evidence');
 const remove=m==='isuzu'?new Set(c.generations[2].trims.map((_,i)=>`generations[2].trims[${i}].engine.cylinders`)):new Set();
 set('needsReview',c.needsReview.filter(x=>!remove.has(x.field)),'Remove resolved null review markers.','maintenance');
 fs.writeFileSync(`src/data/catalog/model-cards/${m}.json`,JSON.stringify(cards,null,2)+'\n');
 fs.writeFileSync(`analysis/sweep/codex/${m}.json`,JSON.stringify(r,null,2)+'\n');
 console.log(m,r.cardFixesApplied.length-base[m].report.cardFixesApplied.length);
}
