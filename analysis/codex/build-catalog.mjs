import fs from 'node:fs';
import {applySelectorExclusions} from '../sweep/selector-exclusions.mjs';
import {readRaw,rawNames} from './raw-data.mjs';
const root='analysis/codex', dest='src/data/catalog'; fs.mkdirSync(dest,{recursive:true});
const read=n=>readRaw(n).results.bindings;
const id=u=>u?.split('/').at(-1)??null;
const val=(r,k)=>r[k]?.value??null;
const uniq=a=>[...new Set(a.filter(x=>x!==null&&x!==undefined))];
const sorted=a=>a.sort((a,b)=>a.slug<b.slug?-1:a.slug>b.slug?1:0);
const slug=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/ł/gi,'l').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const year=s=>s&&/^\+?\d{4,}-/.test(s)?Number(s.match(/^\+?(\d+)-/)[1]):null;
const single=a=>uniq(a).length===1?uniq(a)[0]:null;
const write=(n,x)=>fs.writeFileSync(`${dest}/${n}.json`,JSON.stringify(x,null,2)+'\n');
const selected=JSON.parse(fs.readFileSync(`${root}/resolved.json`));
const registryPath=`${root}/slug-registry.json`;
const registry=fs.existsSync(registryPath)?JSON.parse(fs.readFileSync(registryPath)): {makes:{},auto:{},moto:{}};
const facts=rawNames().filter(n=>n.startsWith('selected-facts-')).flatMap(n=>readRaw(n).results.bindings);
const display={
 'Škoda':'Škoda','Ford Motor Company':'Ford','Hyundai Motor Company':'Hyundai','Vauxhall Motors':'Vauxhall','SEAT CUPRA':'Cupra','Mini':'MINI','Smart':'smart','Volvo Cars':'Volvo','Saab Automobile':'Saab','Tesla, Inc.':'Tesla','Mitsubishi Motors':'Mitsubishi','Suzuki Motor Corporation':'Suzuki','Daewoo Motors':'Daewoo','SsangYong Motor':'SsangYong / KGM','KGM':'SsangYong / KGM','Jaguar Cars':'Jaguar','Ram Trucks':'RAM','Lincoln Motor Company':'Lincoln','Saturn Corporation':'Saturn','AvtoVAZ':'Lada','Moskvitch':'Moskvič','Zastava Automobiles':'Zastava','MG Motor':'MG','Morris Motors':'Morris','Triumph Motor Company':'Triumph','Fisker Inc.':'Fisker','BYD Auto':'BYD','Geely Auto':'Geely','Great Wall Motor':'Great Wall','JAC Motors':'JAC','Dongfeng Motor Corporation':'Dongfeng','FAW Group':'FAW','BAIC Motor':'BAIC','Changan Automobile':'Changan','Nio Inc.':'NIO','XPeng':'XPeng','Brilliance Auto':'Brilliance','Lifan Group':'Lifan','Proton Holdings':'Proton','Mahindra & Mahindra':'Mahindra','Rolls-Royce Motor Cars':'Rolls-Royce','Lotus Cars':'Lotus','McLaren Automotive':'McLaren','Morgan Motor Company':'Morgan','Caterham Cars':'Caterham','Noble Automotive':'Noble','Ariel Motor Company':'Ariel','Ginetta Cars':'Ginetta','Spyker Cars':'Spyker','Rimac Automobili':'Rimac','NSU Motorenwerke':'NSU','Hudson Motor Car Company':'Hudson','Nash Motors':'Nash','DeLorean Motor Company':'DeLorean','Yamaha Motor Company':'Yamaha','Kawasaki Heavy Industries':'Kawasaki','Kawasaki Motors':'Kawasaki','Husqvarna Motorcycles':'Husqvarna','Indian Motorcycle':'Indian','Triumph Motorcycles Ltd':'Triumph Motorcycles','Česká zbrojovka Strakonice':'ČZ','MZ Motorrad- und Zweiradwerk':'MZ','Beta Motor':'Beta','Norton Motorcycle Company':'Norton','Jawa Moto':'Jawa','SYM Motors':'SYM','CFMoto':'CFMOTO','Qianjiang Motorcycle':'QJMotor','Polaris Inc.':'Polaris','Scania AB':'Scania','Caterpillar Inc.':'Caterpillar','Komatsu Limited':'Komatsu','Bobcat Company':'Bobcat','Goodyear Tire and Rubber Company':'Goodyear','Continental AG':'Continental','Toyo Tire Corporation':'Toyo','Yokohama Rubber Company':'Yokohama','Sumitomo Rubber Industries':'Sumitomo','Falken Tire':'Falken','Cooper Tire & Rubber Company':'Cooper','Firestone Tire and Rubber Company':'Firestone','Kenda Rubber Industrial Company':'Kenda','Nankang Rubber Tire':'Nankang','Balkrishna Industries':'BKT','MRF':'MRF','Cheng Shin Rubber':'Maxxis','Jungheinrich':'Jungheinrich','BSA Motorcycles':'BSA','New Holland Agriculture':'New Holland','Same':'SAME','Ural':'Ural','Hankook Tire':'Hankook'
};
const byQ=new Map();
for(const r of selected){if(!byQ.has(r.qid))byQ.set(r.qid,{...r,seeds:[],sections:[],relatedQids:[]});const x=byQ.get(r.qid);x.seeds.push(r.seed);x.sections=uniq([...x.sections,...r.sections.map(s=>s==='tyres'?'pneu':s)]).sort();x.relatedQids=uniq([...x.relatedQids,...r.relatedQids]);}
const makes=sorted([...byQ.values()].map(r=>{
 const rows=facts.filter(x=>id(val(x,'item'))===r.qid);if(!rows.length)throw Error('Missing source facts '+r.qid);
 const name=display[r.seed]||r.seed;
 const countries=uniq(rows.map(x=>val(x,'country'))).sort().map(u=>({qid:id(u),name:rows.find(x=>val(x,'country')===u)?.countryLabel?.value??null}));
 const foundedYears=uniq(rows.map(x=>year(val(x,'founded')))); const dissolutionYears=uniq(rows.map(x=>year(val(x,'dissolved'))));
 return {slug:slug(name)||r.qid.toLowerCase(),name,country:countries.length===1?countries[0].name:null,countryQid:countries.length===1?countries[0].qid:null,countries,qid:r.qid,relatedQids:r.relatedQids.filter(x=>x!==r.qid).sort(),status:dissolutionYears.length?'defunct':null,foundedYear:single(foundedYears),dissolvedYear:single(dissolutionYears),sections:r.sections,aliases:uniq([...r.seeds,...rows.map(x=>val(x,'itemLabel')),...rows.map(x=>val(x,'enLabel')),...(r.seed==='AvtoVAZ'?['VAZ','ВАЗ']:[])]).filter(x=>x!==name).sort(),sourceUrl:`https://www.wikidata.org/wiki/${r.qid}`};
}));
// Same-name entities in other industries/countries are not alternate identifiers.
const rejectedRelated=new Set(['Q4652565','Q132544044','Q2500933','Q18011762','Q13818978','Q2502005','Q230097','Q136087723']);
for(const m of makes)m.relatedQids=m.relatedQids.filter(q=>!rejectedRelated.has(q));
const brandLinks=[];
for(const r of read('model-brand-identities')){
 const q=id(val(r,'item'));if(rejectedRelated.has(q)||/disambiguation/i.test(val(r,'description')||'')||makes.some(m=>m.qid===q||m.relatedQids.includes(q)))continue;
 const labels=uniq([val(r,'itemLabel'),val(r,'enLabel')]).map(slug);
 const matching=makes.filter(m=>[m.name,...m.aliases].some(n=>labels.includes(slug(n))));
 if(matching.length===1){matching[0].relatedQids.push(q);matching[0].relatedQids.sort();brandLinks.push({makeSlug:matching[0].slug,qid:q,label:val(r,'itemLabel'),description:val(r,'description')});}
}
fs.writeFileSync(`${root}/brand-identity-mappings.json`,JSON.stringify(brandLinks,null,2)+'\n');
if(new Set(makes.map(x=>x.slug)).size!==makes.length)throw Error('make slug collision');
for(const m of makes){m.slug=registry.makes[m.qid]??m.slug;registry.makes[m.qid]=m.slug;}
sorted(makes);
write('makes',makes);
const owners=new Map();for(const m of makes)for(const q of [m.qid,...m.relatedQids]){if(!owners.has(q))owners.set(q,[]);owners.get(q).push(m);}
const generations=read('explicit-generations');
const audit={retrievedDate:'2026-10-25',makes:makes.length,sections:{},models:{}};
for(const s of ['auto','moto','technika','pneu'])audit.sections[s]=makes.filter(x=>x.sections.includes(s)).length;
for(const section of ['auto','moto']) {
 const rows=read('models-'+section);const dates=read('dates-'+section);const production=read('production-'+section);
 const grouped=new Map();for(const r of rows){const q=id(val(r,'item'));if(!grouped.has(q))grouped.set(q,[]);grouped.get(q).push(r);}
 const rejected=[];const models=[];
 for(const [qid,rs] of grouped){
  const nonRoad=new Set(['automobilový koncept','závodní vůz','formule 1','Grand Prix racing motorcycle','endurance racing motorcycles','prototyp','touring car']);
  if(rs.some(r=>nonRoad.has(val(r,'bodyLabel')))){rejected.push({qid,reason:'explicit-concept-or-competition-class'});continue;}
  const brands=uniq(rs.map(r=>id(val(r,'brand'))));const manufacturers=uniq(rs.map(r=>id(val(r,'make'))));
  const resolve=qs=>uniq(qs.flatMap(q=>owners.get(q)||[])).filter(m=>m.sections.includes(section));
  const matches=brands.length?resolve(brands):resolve(manufacturers);
  // If a brand is explicit but outside scope, do not silently replace it by its parent corporation.
  if(matches.length!==1){rejected.push({qid,reason:matches.length?'ambiguous-make':'unmapped-make',brandQids:brands,manufacturerQids:manufacturers});continue;}
  const make=matches[0];const sourceName=val(rs[0],'itemLabel');if(!sourceName||/^Q\d+$/.test(sourceName)){rejected.push({qid,reason:'no-cs-or-en-label'});continue;}
  const prefixes=makes.filter(m=>m.sections.includes(section)&&[m.name,...m.aliases].some(n=>sourceName.toLocaleLowerCase().startsWith(n.toLocaleLowerCase()+' ')));
  if(prefixes.length&&!prefixes.some(m=>m.slug===make.slug)&&!prefixes.some(m=>make.name.toLocaleLowerCase().startsWith(m.name.toLocaleLowerCase()+' '))){rejected.push({qid,reason:'label-make-conflict',sourceName,matchedMake:make.slug,labelMakes:prefixes.map(m=>m.slug)});continue;}
  const names=[make.name,...make.aliases].sort((a,b)=>b.length-a.length);let name=sourceName;
  for(const prefix of names)if(name.toLocaleLowerCase().startsWith(prefix.toLocaleLowerCase()+' ')){name=name.slice(prefix.length).trim();break;}
  const bodies=uniq(rs.map(r=>val(r,'bodyLabel')).map(b=>({hatchback:'hatchback',kombi:'kombi',sedan:'sedan',SUV:'suv',crossover:'suv',MPV:'mpv','mini MPV':'mpv','Kompaktné MPV':'mpv',kupé:'kupe',kabriolet:'kabriolet','pick-up':'pickup','dodávkový automobil':'dodavka','panel van':'dodavka'}[b]??null))).sort();
  const ds=dates.filter(r=>id(val(r,'item'))===qid);const ps=production.filter(r=>id(val(r,'item'))===qid&&manufacturers.includes(id(val(r,'make'))));
  const starts=uniq(ds.filter(r=>id(val(r,'property'))==='P580').map(r=>year(val(r,'date'))));
  const ends=uniq(ds.filter(r=>id(val(r,'property'))==='P582').map(r=>year(val(r,'date'))));
  const manufacturerPeriods=uniq(ps.map(r=>JSON.stringify({qid:id(val(r,'make')),from:year(val(r,'start')),to:year(val(r,'end'))}))).map(JSON.parse);
  models.push({slug:slug(name)||qid.toLowerCase(),name,makeSlug:make.slug,qid,kind:rs.some(r=>id(val(r,'class'))==='Q59773381'||id(val(r,'class'))==='Q71310524')?'series':'model',body:bodies.length===1?bodies[0]:null,bodyTypes:bodies.length?bodies:null,productionStart:single(starts),productionEnd:single(ends),inceptionYear:single(ds.filter(r=>id(val(r,'property'))==='P571').map(r=>year(val(r,'date')))),discontinuedYear:single(ds.filter(r=>id(val(r,'property'))==='P2669').map(r=>year(val(r,'date')))),manufacturerPeriods:manufacturerPeriods.length?manufacturerPeriods:null,codes:uniq(rs.map(r=>val(r,'code'))).sort(),seriesQids:uniq(rs.map(r=>id(val(r,'series')))).sort(),manufacturerQids:manufacturers.sort(),brandQids:brands.sort(),bodyClassQids:uniq(rs.map(r=>id(val(r,'body')))).sort(),generations:null,sourceUrl:`https://www.wikidata.org/wiki/${qid}`});
 }
 // A P179 link alone can describe a trim or subseries. Only source descriptions explicitly identifying a generation qualify.
 for(const m of models){const gs=models.filter(c=>c.qid!==m.qid&&c.makeSlug===m.makeSlug&&c.seriesQids.includes(m.qid)&&generations.some(r=>id(val(r,'item'))===c.qid));if(gs.length)m.generations=gs.map(c=>({qid:c.qid,name:c.name,code:single(c.codes),from:c.productionStart,to:c.productionEnd})).sort((a,b)=>a.qid.localeCompare(b.qid));}
 // Keep same-name records distinct, using a QID suffix stable across later imports.
 const counts=new Map();for(const m of models){const key=m.makeSlug+'/'+m.slug;counts.set(key,(counts.get(key)||0)+1);}for(const m of models)if(counts.get(m.makeSlug+'/'+m.slug)>1)m.slug+='-'+m.qid.toLowerCase();
 const used=new Set();for(const m of models){m.slug=registry[section][m.qid]??m.slug;let key=m.makeSlug+'/'+m.slug;if(used.has(key)){m.slug+='-'+m.qid.toLowerCase();key=m.makeSlug+'/'+m.slug;}if(used.has(key))throw Error('model slug collision '+key);used.add(key);registry[section][m.qid]=m.slug;}
 const retainedModels=applySelectorExclusions('models-'+section,models);
 for(const model of models)if(!retainedModels.includes(model))rejected.push({qid:model.qid,reason:'reviewed-sweep-exclusion',makeSlug:model.makeSlug,slug:model.slug});
 models.splice(0,models.length,...retainedModels);
 sorted(models);write('models-'+section,models);
 fs.writeFileSync(`${root}/excluded-models-${section}.json`,JSON.stringify(rejected,null,2)+'\n');
 audit.models[section]={sourceEntities:grouped.size,included:models.length,excluded:rejected.length,missingBody:models.filter(m=>m.body===null).length,missingProductionStart:models.filter(m=>m.productionStart===null).length,missingProductionEnd:models.filter(m=>m.productionEnd===null).length,missingGenerations:models.filter(m=>m.generations===null).length,withInception:models.filter(m=>m.inceptionYear!==null).length,byMake:Object.fromEntries(makes.filter(m=>m.sections.includes(section)).map(m=>[m.slug,models.filter(x=>x.makeSlug===m.slug).length]))};
}
fs.writeFileSync(`${root}/coverage.json`,JSON.stringify(audit,null,2)+'\n');console.log(JSON.stringify({...audit,models:Object.fromEntries(Object.entries(audit.models).map(([k,{byMake,...v}])=>[k,v]))},null,2));
fs.writeFileSync(registryPath,JSON.stringify(registry,null,2)+'\n');
