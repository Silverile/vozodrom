import fs from 'node:fs';
import {range} from './skoda-range-definitions.mjs';
import {facts,urls,trim} from './skoda-trim-facts.mjs';
import {enrichGeneration,specSources,conflicts} from './skoda-specs-step3.mjs';
import {enrichStep4,step4Sources,step4Conflicts} from './skoda-specs-step4.mjs';
import {applyWorkerPatches,workerSources} from './skoda-step4-workers.mjs';
import {enrichStep5,step5Sources} from './skoda-step5.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,d)=>fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');
const e=read('analysis/codex/skoda-card-evidence.json'),photos=read('analysis/codex/skoda-card-photo-evidence.json');
const additions=read('src/data/catalog/model-line-additions.json').filter(a=>!(a.makeSlug==='skoda'&&range.some(r=>r[0]===a.slug)));
const cards=read('src/data/catalog/model-cards/skoda.json').filter(c=>!range.some(r=>r[0]===c.lineSlug));
const clean=s=>s?.replace(/<[^>]*>/g,'').replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").trim()??null;
function page(t){const seen=new Set();while(e.redirects[t]&&!seen.has(t)){seen.add(t);t=e.redirects[t];}return e.pages[t];}
const cs=new Set(['422','430','645','650','860','hispano-suiza','pickup','praktik']);
const forced={forman:[1990,1995],garde:[1981,1984],'rapid-1984':[1984,1990],'enyaq-coupe':[2022,null],'1203':[1968,1981],'420-standard':[1933,null],'4r':[1928,1930],'110-1925':[1925,1929],vos:[null,1952],'rapid-india':[2011,2021],'422':[null,1932],'860':[1929,null]};
const unknownScopes=new Set(['110-1925','4r','6r','130-135-136','kodiaq-gt','felicia-fun']);
function photo(file){const p=photos.files['File:'+file?.replace(/^File:/,'')];if(!p||!p.authorHtml||!p.licence||!/^CC BY|^CC0|^Public domain/.test(p.licence)||/TAZ|showcar|concept|prototype|Volkswagen/i.test(p.file))return null;return {source:'commons',file:p.file,url:p.url.split('?')[0],filePageUrl:p.filePageUrl,author:clean(p.authorHtml),licence:p.licence,licenceUrl:p.licenceUrl,credit:clean(p.authorHtml)+' / Wikimedia Commons / '+p.licence,depicts:'generation',visualReview:'pending',sources:[p.filePageUrl]};}
function dimension(t=''){const m=t.match(/^(\d{3,5})(?:; mm\b|\s*mm$|$)/);return m?+m[1]:null;}
function dates(b){const text=b.production||'',years=[...text.matchAll(/\b(?:19|20)\d{2}\b/g)].map(m=>+m[0]);return years.length?[Math.min(...years),/present/i.test(text)?null:Math.max(...years)]:[null,null];}
const deferred=[];
for(const [slug,name,title,requestedBodies,summary,market='Europe']of range){
 if(slug==='6r'){deferred.push({slug,reason:'No source page or manufacturer checklist match established; do not create an unverified line.'});continue;}
 const p=page(slug==='pickup'?'cs:Škoda Pick-up':cs.has(slug)?'cs:'+title:title),shared=unknownScopes.has(slug)||['forman','enyaq-coupe'].includes(slug);
 const b=p?.infoboxes?.[0]||{};
 const sources=[...(p?.source&&!unknownScopes.has(slug)?[p.source]:[]),...(['110-1925','4r'].includes(slug)?[urls.timeline]:[])];
 if(slug==='garde'||slug==='rapid-1984')sources.push(urls.garde);
 if(slug==='1203')sources.push(urls.van);
 if(slug==='felicia-fun')sources.push(urls.fun);
 if(slug==='420-standard')sources.push(urls.standard);
 if(['110-1925','422','860'].includes(slug))sources.push(urls.early);
 if(slug==='4r')sources.push(urls.fourR);
 if(slug==='rapid-india')sources.push(urls.rapidIndia);
 if(!sources.length&&p?.source)sources.push(p.source);
 if(!sources.length){deferred.push({slug,reason:'No acceptable factual source established.'});continue;}
 let [from,to]=shared?[null,null]:dates(b);if(forced[slug])[from,to]=forced[slug];
 let status=to!==null?'ended':from!==null&&/present/.test(b.production||'')&&!['1203','420-standard'].includes(slug)?'current':'unknown';
 if(slug==='enyaq-coupe')status='current';
 const bodyTypes=slug==='100-110'?['sedan']:slug==='1200'?['sedan','kombi']:(!b.body_style&&!['forman','enyaq-coupe','130-135-136','kodiaq-gt','felicia-fun','420-standard'].includes(slug)?null:requestedBodies);
 const line={slug,name,makeSlug:'skoda',aliases:[],bodyTypes,from,to,productionStatus:status,dateScope:'source-production',productionPeriods:null,generations:null,wikidataQid:shared?null:p?.wikidataQid||null,sources:[...new Set(sources)],needsReview:[],additionReason:'Step 2: historic, regional or separately requested body/LCV line; source scope remains explicit.'};
 const gs=slug==='pickup'?p.infoboxes.slice(1):[b];
 const generations=gs.map((box,i)=>{
  const [gf,gt]=slug==='pickup'?dates(box):[from,to];let ph=shared?null:photo(box.image);
  const searchKey={'garde':'Garde','130-135-136':'130','forman':'Forman','enyaq-coupe':'Enyaq Coupe','felicia-fun':'Felicia Fun','kodiaq-gt':'Kodiaq GT','110-1925':'110 1925','4r':'4R','420-standard':'420 Standard','1203':'1203'}[slug];
  if(searchKey){const chosen={garde:'Škoda Garde, WAW.jpg','enyaq-coupe':'Škoda Enyaq Coupé RS 1X7A6919.jpg',forman:'MHV Skoda Forman 01.jpg','felicia-fun':'Skoda Felicia Fun (10890304994).jpg','kodiaq-gt':'Skoda Kodiaq GT 001.jpg','110-1925':'Laurin & Klement - Škoda 110.JPG','420-standard':'Škoda 420 Standard vr.jpg'}[slug];ph=chosen?photo(chosen):null;}
  if(slug==='440-445-450')ph=photo('Škoda-440 Studenec-WP20170826151026.jpg');
  if(slug==='popular')ph=photo('Škoda Popular (1939).jpg');
  if(slug==='637')ph=photo('Škoda 637 (1934) 02.jpg');
  if(slug==='130-135-136')ph=photo('ŠKODA 130 GL.JPG');
  if(slug==='1203')ph=photo('ŠKODA 1203.JPG');
  const ds=shared?null:/front.wheel.drive/i.test(box.layout||'')?['fwd']:/rear.wheel.drive|\b[FR]R layout\b/i.test(box.layout||'')?['rwd']:null;
  const dims=shared?{length:null,width:null,height:null,wheelbase:null}:Object.fromEntries(['length','width','height','wheelbase'].map(k=>[k,dimension(box[k])]));
  if(['rapid-india','vos'].includes(slug))for(const k of Object.keys(dims))dims[k]=null; // Conflicting/shared badge or armoured-only specifications.
  return {code:null,name:gs.length>1?`${name} – ${i+1}. generace`:`${name} – modelová rodina`,from:gf,to:gt,productionStatus:gt!==null?'ended':status,facelift:null,bodyTypes,engines:null,engineCoverage:'unknown',drivetrains:ds,transmissions:null,dimensionsMm:dims,specificationScope:{market,modelYear:null,variant:null,bodyType:bodyTypes?.length===1?bodyTypes[0]:null,noteCs:'Souhrnná karta; rozměry a roky konkrétních verzí nejsou automaticky přebírány ze sdílené rodinné stránky. Krajní roky samy nepotvrzují nepřerušenou výrobu.'},trunkL:null,markets:[market],marketNotesCs:market==='Europe'?'Historická nebo evropská řada; dostupnost v ČR není doložena počtem inzerátů.':`Regionální model: ${market}. Nejde o běžnou evropskou nabídku.`,photo:ph,trims:null,sources:[...new Set([...sources,...ph?[ph.filePageUrl]:[]])]};
 });
 additions.push(line);cards.push({makeSlug:'skoda',lineSlug:slug,name,isAddition:true,segment:null,summaryCs:summary,coverage:'pilot-partial',generations,sources:[...new Set(generations.flatMap(g=>g.sources))],needsReview:[]});
}
// Preserve established card fields; add scoped technical-version records only.
for(const c of cards){for(const [i,g]of c.generations.entries()){
 g.trims=facts[c.lineSlug+'/'+i]||facts[c.lineSlug]||null;
 if(['enyaq','epiq'].includes(c.lineSlug)){
  const p=page('Škoda '+c.name);const versions=c.lineSlug==='enyaq'?[['50',109,'rwd'],['60',132,'rwd'],['80',150,'rwd'],['85',210,'rwd'],['RS (2024–)',250,'awd']]:[['35',85,'fwd'],['40',99,'fwd'],['55',155,'fwd']];
  g.trims=versions.map(([n,kw,d])=>trim(`${c.name} ${n}`,p.source,{bodyType:'suv',engine:{fuel:'electric',displacementCc:null,cylinders:null,powerKw:kw,torqueNm:null},drive:d,specificationScope:{market:'Europe',modelYear:null,noteCs:'Výkonová varianta ze zdrojové stránky; nejde o úplnou výbavu ani automatické potvrzení současné dostupnosti.'}}));
 }
 if(['favorit','forman'].includes(c.lineSlug)){const p=page('Škoda Favorit');g.trims=[trim('Motor 1289 cm³ – výbava neurčena',p.source,{kind:'engine-version',bodyType:c.lineSlug==='forman'?'kombi':'hatchback',engine:{fuel:'petrol',displacementCc:1289,cylinders:4,powerKw:null,torqueNm:null},transmission:{type:'manual',gears:5},drive:'fwd'})];}
 if(c.lineSlug==='pickup'){const p=page('cs:Škoda Pick-up');g.trims=(i===0?[[1289,'petrol']]:[[1289,'petrol'],[1598,'petrol'],[1896,'diesel']]).map(([cc,fuel])=>trim(`Motor ${cc} cm³ – výbava neurčena`,p.source,{kind:'engine-version',bodyType:'pickup',engine:{fuel,displacementCc:cc,cylinders:4,powerKw:null,torqueNm:null},transmission:{type:'manual',gears:5}}));}
 if(c.lineSlug==='felicia'){const p=page('Škoda Felicia');g.trims=[['1.3','petrol'],['1.6','petrol'],['1.9','diesel']].map(([n,fuel])=>trim(`Motor ${n} l – výbava neurčena`,p.source,{kind:'engine-version',engine:{fuel,displacementCc:null,cylinders:4,powerKw:null,torqueNm:null},transmission:{type:'manual',gears:5},drive:'fwd'}));}
 if(c.lineSlug==='praktik'){const p=page('cs:Škoda Praktik');g.trims=[['1.2 HTP',51,'petrol'],['1.2 TSI',63,'petrol'],['1.6 TDI',66,'diesel']].map(([n,kw,fuel])=>trim(n,p.source,{kind:'engine-version',bodyType:'dodavka',engine:{fuel,displacementCc:null,cylinders:null,powerKw:kw,torqueNm:null}}));}
 if(!g.trims&&c.isAddition&&!unknownScopes.has(c.lineSlug)&&!['forman','enyaq-coupe','pickup'].includes(c.lineSlug)){
  const r=range.find(r=>r[0]===c.lineSlug),p=page(cs.has(c.lineSlug)?'cs:'+r?.[2]:r?.[2]),b=p?.infoboxes?.[0];
  // Exact engine sizes define engine versions, not an invented named equipment level.
  const capacities=[...new Set([...(b?.engine||'').matchAll(/(?<![\d.–-])\b(\d{3,4}|\d,\d{3})\s*cc\b/g)].map(m=>+m[1].replace(',','')))];
  if(capacities.length)g.trims=capacities.filter(cc=>c.lineSlug!=='105-120-125'||cc!==1289).map(cc=>trim(`Motor ${cc} cm³ – výbava neurčena`,p.source,{kind:'engine-version',bodyType:g.bodyTypes?.length===1?g.bodyTypes[0]:null,engine:{fuel:null,displacementCc:cc,cylinders:null,powerKw:null,torqueNm:null}}));
  if(!g.trims&&b?.engine){const sizes=[...new Set([...(b.engine).matchAll(/\b(\d\.\d)\s*L\b/g)].map(m=>m[1]))];if(sizes.length)g.trims=sizes.map(n=>trim(`Motor ${n} l – výbava neurčena`,p.source,{kind:'engine-version',bodyType:g.bodyTypes?.length===1?g.bodyTypes[0]:null}));}
 }
 enrichGeneration(c,g,i,e);
 enrichStep4(c,g,i);
 applyWorkerPatches(c,g,i);
 enrichStep5(c,g,i);
 if(g.trims)for(const t of g.trims){g.sources.push(...t.sources);c.sources.push(...t.sources);}
 g.sources=[...new Set(g.sources)];
 }
 c.sources=[...new Set([...c.sources,...c.generations.flatMap(g=>g.sources)])];
 c.needsReview=c.needsReview.filter(r=>!r.field.startsWith('generations')||!r.field.includes('.trims'));
 function unknown(v,path){if(v===null){if(!c.needsReview.some(r=>r.field===path))c.needsReview.push({field:path,reason:'Not established for this exact version/scope. Null is not zero, no equipment or confirmed continued production.'});return;}if(Array.isArray(v))v.forEach((x,i)=>unknown(x,path+'['+i+']'));else if(typeof v==='object')for(const[k,x]of Object.entries(v))unknown(x,path?path+'.'+k:k);}
 unknown({segment:c.segment,summaryCs:c.summaryCs,generations:c.generations},'');
 const scopeIssues={
  'rapid-india':'Wikipedia infobox mixes a 2009 related-model start and implausible 5467 mm length. Start is corrected to 2011 using the manufacturer annual report; all dimensions withheld.',
  'vos':'Manufacturer describes 1950–1952, Wikipedia 1949–1952. Start remains null. Armoured-only dimensions are not assigned to the whole family.',
  'felicia-fun':'Manufacturer sources differ on start (1995, 1996, 1997); production interval remains unresolved. 7.3 l/100 km uses historic 93/116/EU, not WLTP.',
  '422':'Wikipedia lists production from 1929; official importer timeline says 1930. Start remains null.',
  '860':'Wikipedia ends in 1932; official importer timeline says 1933. End remains null and does not imply current production.',
  '130-135-136':'Shared Type 742 dates and 105 photo must not be assigned to this subset. Family-subset production dates require separate confirmation.',
  '1203':'Date bounds cover original AZNP Vrchlabí production only, not all later TAZ/OMP manufacture; no TAZ badge photo substituted.'
  ,'1200':'Displacement conflict: Wikipedia 1213 cc versus official importer magazine 1221 cc; exact trim capacity is withheld.'
 };
 if(scopeIssues[c.lineSlug])c.needsReview.push({field:'scope',reason:scopeIssues[c.lineSlug]});
 for(const[i,g]of c.generations.entries())if(g.photo?.visualReview==='pending'&&!c.needsReview.some(r=>r.field===`generations[${i}].photo.visualReview`))c.needsReview.push({field:`generations[${i}].photo.visualReview`,reason:'Identity/licence metadata retained; composition and exact variant correspondence require visual review.'});
}
for(const l of additions){for(const[k,v]of Object.entries(l))if(v===null&&!l.needsReview.some(r=>r.field===k))l.needsReview.push({field:k,reason:'Unknown or shared family value; needs a model-specific source.'});}
cards.sort((a,b)=>a.lineSlug.localeCompare(b.lineSlug,'en'));write('src/data/catalog/model-cards/skoda.json',cards);write('src/data/catalog/model-line-additions.json',additions);
const primary=read('analysis/codex/model-line-primary-facts.json');
for(const url of [...workerSources,...step5Sources])if(!primary.sources.some(s=>s.url===url))primary.sources.push({url,publisher:'Manufacturer / period press / technical reference (see worker evidence)',retrievedDate:'2026-10-26',facts:{scope:'Selected independently researched worker facts; exact version and uncertainty in worker evidence JSON.'}});
const book=primary.sources.find(s=>s.url===step4Sources.favoritBook);if(book)book.publisher='Andrt/Malina — maintenance and repair manual (mirrored copy)';
for(const url of [...Object.values(step4Sources),...step4Conflicts.flatMap(x=>x.sources)])if(!primary.sources.some(s=>s.url===url))primary.sources.push({url,publisher:url.includes('wikipedia.org')?'Wikipedia factual revision':'Škoda Auto',retrievedDate:'2026-10-26',facts:{scope:'Selected step-4 facts with field-level provenance, explicit consumption cycles and version/body scopes.'}});
for(const url of Object.values(specSources))if(!primary.sources.some(s=>s.url===url))primary.sources.push({url,publisher:url.includes('wikipedia.org')?'Wikipedia factual revision':'Škoda Auto',retrievedDate:'2026-10-26',facts:{scope:'Selected named-version facts retained in skoda-specs-step3.mjs; source standards and body scopes explicit.'}});
write('analysis/codex/skoda-specs-step3-evidence.json',{startedAt:'2026-10-26T20:18:03Z',generatedAt:new Date().toISOString(),sources:specSources,versionFacts:cards.flatMap(c=>c.generations.flatMap((g,i)=>(g.trims||[]).filter(t=>t.fieldSources).map(t=>({lineSlug:c.lineSlug,generationIndex:i,...t})))),generationFacts:cards.flatMap(c=>c.generations.map((g,i)=>({lineSlug:c.lineSlug,generationIndex:i,dimensionsMm:g.dimensionsMm,trunkL:g.trunkL,specificationScope:g.specificationScope,fieldSources:g.fieldSources})).filter(g=>g.fieldSources)),conflicts,scope:'Selected factual records only. No source prose, whole tables or image binaries retained.'});
for(const url of Object.values(urls))if(!primary.sources.some(s=>s.url===url))primary.sources.push({url,publisher:'Škoda Auto / official importer',retrievedDate:'2026-10-26',facts:{scope:'Selected step-2 factual references; structured version facts in skoda-trim-facts.mjs',production:url===urls.garde?'Garde 1981–1984; Rapid 1984–1990':url===urls.van?'1203 AZNP 1968–1981':url===urls.standard?'420 Standard 1933':''}});
write('analysis/codex/model-line-primary-facts.json',primary);
const coverage={startedAt:'2026-10-26T19:55:51Z',generatedAt:new Date().toISOString(),cards:cards.length,addedLines:additions.length-1,generations:cards.reduce((n,c)=>n+c.generations.length,0),photos:cards.flatMap(c=>c.generations).filter(g=>g.photo).length,trims:cards.flatMap(c=>c.generations).flatMap(g=>g.trims||[]).length,deferred,perLine:cards.map(c=>({slug:c.lineSlug,generations:c.generations.length,trims:c.generations.reduce((n,g)=>n+(g.trims?.length||0),0),missingPhotos:c.generations.filter(g=>!g.photo).length,unknowns:c.needsReview.length}))};
write('analysis/codex/skoda-range-review.json',coverage);console.log(`Expanded Škoda: ${coverage.cards} cards, ${coverage.generations} generation/family records, ${coverage.photos} Commons references, ${coverage.trims} selected versions.`);
