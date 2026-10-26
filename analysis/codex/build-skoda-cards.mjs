import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const evidence=read('analysis/codex/skoda-card-evidence.json'),photos=read('analysis/codex/skoda-card-photo-evidence.json');
const lines=read('src/data/catalog/model-lines-auto.json').filter(l=>l.makeSlug==='skoda');
const additions=read('src/data/catalog/model-line-additions.json');
const primary=read('analysis/codex/model-line-primary-facts.json');
const clean=s=>s?.replace(/<[^>]*>/g,'').replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").trim()??null;
const description={
 octavia:['C','Novodobá Octavia je rodinný vůz s karoserií liftback nebo kombi. Řada se vyrábí od roku 1996 a dosud zahrnuje čtyři generace.'],
 fabia:['B','Fabia patří mezi malé vozy a v jednotlivých generacích nabízela hatchback, kombi nebo sedan. Čtvrtá generace má karoserii hatchback.'],
 superb:['D','Superb je větší osobní vůz nabízený podle generace jako sedan, liftback nebo kombi. Novodobá řada navazuje na historické jméno a vyrábí se od roku 2001.'],
 kodiaq:[null,'Kodiaq je rodinné SUV, jehož první generace vstoupila do výroby v roce 2016. Druhá generace se vyrábí od roku 2024.'],
 karoq:['C-SUV','Karoq je kompaktní SUV vyráběné od roku 2017. Nabídka zahrnuje verze s pohonem předních i všech kol.'],
 kamiq:['B-SUV','Evropský Kamiq je menší SUV vyráběné od roku 2019. Tato karta se nevztahuje na odlišný model stejného jména určený pro Čínu.'],
 scala:['C','Scala je pětidveřový hatchback vyráběný od roku 2019. V roce 2023 byla představena modernizovaná verze, jejíž výroba začala v lednu 2024.'],
 enyaq:['D-SUV','Enyaq je elektrické SUV vyráběné od roku 2020. Vedle základní karoserie existuje také provedení Coupé, které zde patří do stejné modelové řady.'],
 elroq:['C-SUV','Elroq je elektrické SUV, jehož výroba začala v lednu 2025. Technické údaje se liší podle verze akumulátoru, výkonu a pohonu.'],
 favorit:['B','Favorit je vůz s motorem vpředu a pohonem předních kol z konce osmdesátých let. Do této rodiny řadíme také kombi Forman a odvozený Pick-up.'],
 felicia:['B','Felicia z let 1994 až 2001 nabízela hatchback, kombi a užitkové varianty. V roce 1998 prošla modernizací přední části karoserie.'],
 citigo:['A','Citigo je malý městský vůz vyráběný v letech 2011 až 2020. Vedle spalovacích provedení vznikla také elektrická verze Citigo-e iV.'],
 rapid:['C','Evropský Rapid této karty zahrnuje liftback a kratší pětidveřový Spaceback. Nejde o historické kupé ani o odlišné asijské nebo pozdější regionální verze stejného jména.'],
 roomster:['M','Roomster je kompaktní víceúčelový vůz vyráběný v letech 2006 až 2015. Řada zahrnovala také užitkové provedení Praktik.'],
 yeti:['C-SUV','Yeti je kompaktní SUV vyráběné v letech 2009 až 2017. Nabízelo se s pohonem předních nebo všech kol.'],
 epiq:['B-SUV','Epiq je malé elektrické SUV, jehož výroba podle zdrojů začala v roce 2026. Přesná specifikace se může lišit podle bateriové a výkonové verze.'],
 peaq:['E-SUV','Peaq je sedmimístné elektrické SUV. Sériová výroba začala v Mladé Boleslavi v srpnu 2026.']
};
const oem={
 elroq:'https://cdn.skoda-storyboard.com/2025/06/Skoda_Elroq_Technical_data_d5686460.pdf',
 octavia:'https://cdn.skoda-storyboard.com/2025/06/TD-Octavia-en_3066a520.pdf',
 octaviaRefresh:'https://www.skoda-storyboard.com/en/press-kits/skoda-octavia-media-launch-press-kit/skoda-octavia-refreshing-the-brands-best-seller/',
 scalaKamiq:'https://www.skoda-storyboard.com/en/press-kits/skoda-scala-and-skoda-kamiq-press-kit/skoda-scala-and-kamiq-comprehensive-update-for-the-successful-compact-models/',
 scalaKamiqProduction:'https://www.skoda-storyboard.com/en/press-releases/skoda-auto-launches-production-of-upgraded-scala-and-kamiq/',
 favorit:'https://cdn.skoda-storyboard.com/2017/09/170915-%C5%A0KODA-FAVORIT-Entering-an-era-of-success-30-years-ago.pdf',
 felicia:'https://cdn.skoda-storyboard.com/2019/10/191015-Anniversary-25-years-of-the-%C5%A0KODA-FELICIA.pdf'
};
const photoChoices={
 'fabia/1':'Skoda Fabia vRS (7914423470) (cropped).jpg',
 'fabia/2':'2009 Skoda Fabia silver front.jpg',
 'octavia/2':'Škoda Octavia II Facelift Liftback front - PSM 2009.jpg',
 'roomster/1':'Škoda Roomster front 20070918.jpg',
 'citigo/1':'2014 Škoda Citigo 5-door, front right.jpg',
 'epiq/1':'2026 Skoda Epiq, white (1).jpg'
};
function page(title){const seen=new Set();while(evidence.redirects[title]&&!seen.has(title)){seen.add(title);title=evidence.redirects[title];}return evidence.pages[title];}
function photo(file){const p=photos.files['File:'+file.replace(/^File:/,'')];if(!p||!p.authorHtml||!p.licence||(!/^CC BY|^CC0|^Public domain/.test(p.licence))||/showcar|concept|prototype|Volkswagen/i.test(p.file))return null;return {source:'commons',file:p.file,url:p.url.split('?')[0],filePageUrl:p.filePageUrl,author:clean(p.authorHtml),licence:p.licence,licenceUrl:p.licenceUrl,credit:clean(p.authorHtml)+' / Wikimedia Commons / '+p.licence,depicts:'generation',visualReview:'pending',sources:[p.filePageUrl]};}
function transmissions(text=''){
 const result=[];for(const part of text.split(';')){const m=part.match(/(\d)(?:\/(\d))?-speed/i);if(!m)continue;const kind=/DSG|dual.clutch|DCT/i.test(part)?'dual-clutch':/automated manual|ASG/i.test(part)?'automated-manual':/manual/i.test(part)?'manual':/automatic|tiptronic/i.test(part)?'automatic':/fixed|single/i.test(part)?'single-speed':null;if(!kind)continue;for(const n of [m[1],m[2]].filter(Boolean))if(!result.some(r=>r.type===kind&&r.gears===+n))result.push({type:kind,gears:+n});}return result.length?result:null;
}
function drives(text=''){
 const out=[];if(/front.wheel.drive/i.test(text))out.push('fwd');if(/rear.wheel.drive|\bFR layout\b|\bRR layout\b/i.test(text))out.push('rwd');if(/all.wheel.drive|four.wheel.drive|4x4/i.test(text))out.push('awd');return out.length?out:null;
}
function engines(text=''){
 let baseFuel=null;const out=[];for(const part of text.split(';')){
  if(/petrol.*(?:plug.in|PHEV)/i.test(part))baseFuel='petrol-phev';else if(/petrol.*mild/i.test(part))baseFuel='petrol-mhev';else if(/petrol.*CNG/i.test(part))baseFuel='petrol-cng';else if(/diesel/i.test(part))baseFuel='diesel';else if(/petrol/i.test(part))baseFuel='petrol';
  const fuel=/mild hybrid/i.test(part)?'petrol-mhev':baseFuel;
  if(/China|Russia|Egypt|India|Kodiaq GT/i.test(part))continue;
  const l=part.match(/\b(\d\.\d)\s*L\b/i),cc=part.match(/\b([\d,]+)\s*cc\b/i);if(!l&&!cc)continue;
  const exact=cc?+cc[1].replaceAll(',',''):null,nominal=l?+l[1]:null;
  if(!out.some(e=>e.fuel===fuel&&e.displacementCc===exact&&e.displacementLitresNominal===nominal))out.push({fuel,displacementCc:exact,displacementLitresNominal:nominal,powerKwMin:null,powerKwMax:null,variant:null});
 }return out.length?out:null;
}
function dimension(text=''){if(!/^\d{3,5}; mm\b/.test(text)||text.match(/\bmm\b/g)?.length!==1)return null;return +text.split(';')[0];}
function facelift(slug,index){
 const f=(year,note,sources,productionYear=null)=>({year,productionYear,note,sources});
 if(slug==='octavia'&&index===3)return [f(2024,'Modernizace čtvrté generace, úpravy vzhledu a výbavy.',[oem.octaviaRefresh])];
 if(['scala','kamiq'].includes(slug))return [f(2023,'Představení modernizace; sériová výroba upravené verze od ledna 2024.',[oem.scalaKamiq,oem.scalaKamiqProduction],2024)];
 if(slug==='favorit')return [f(1991,'První modernizace vzhledu a techniky.',[oem.favorit]),f(1993,'Rozsáhlejší soubor výrobních a technických úprav.',[oem.favorit])];
 if(slug==='felicia')return [f(1998,'Úprava světlometů a masky chladiče.',[oem.felicia])];
 return null;
}
const engine=(fuel,cc,nominal,min,max,variant)=>({fuel,displacementCc:cc,displacementLitresNominal:nominal,powerKwMin:min,powerKwMax:max,variant});
const cards=[];
for(const line of lines){
 if(!description[line.slug])continue; // Expansion cards are generated by expand-skoda-cards.mjs.
 const title='Škoda '+(line.slug==='rapid'?'Rapid (2012)':line.name);const p=page(title);if(!p||p.missing)throw Error('No factual page '+title);
 const review=[];const note=(field,reason)=>review.push({field,reason});
 const rawGenerations=line.generations||[{code:p.infoboxes[0]?.model_code||null,from:line.from,to:line.to,productionStatus:line.productionStatus,bodyTypes:line.bodyTypes,sources:line.sources}];
 const hasMultiple=rawGenerations.length>1;
 const generations=rawGenerations.map((g,i)=>{
  const b=p.infoboxes[hasMultiple?i+1:0]||{};const scopeShared=p.title!==title;
  let es=scopeShared?null:engines(b.engine),ts=scopeShared?null:transmissions(b.transmission),ds=scopeShared?null:drives(b.layout||p.infoboxes[0]?.layout);
  let dims=scopeShared?{length:null,width:null,height:null,wheelbase:null}:{length:dimension(b.length),width:dimension(b.width),height:dimension(b.height),wheelbase:dimension(b.wheelbase)};
  let specificationScope={market:'source-production',modelYear:null,variant:null,bodyType:null,noteCs:'Souhrn ze zdroje pro generaci. Regionální verze, výbavy a roky nejsou úplně rozlišeny; nejde o úplný seznam kombinací.'};
  let trunk=null;const sources=[...new Set([...(g.sources||[]),p.source])];
  if(['citigo','karoq'].includes(line.slug)){es=null;ts=null;note(`generations[${i}].specificationScope`,'Shared/regional source specifications require European badge/variant reconciliation.');}
  if(['enyaq','elroq','epiq','peaq'].includes(line.slug)){es=[engine('electric',null,null,null,null,null)];}
  if(line.slug==='elroq'){
   es=[engine('electric',null,null,125,125,'50'),engine('electric',null,null,150,150,'60'),engine('electric',null,null,210,210,'85'),engine('electric',null,null,250,250,'RS')];
   dims={length:4488,width:1884,height:1625,wheelbase:2765};trunk=470;ds=['rwd','awd'];ts=[{type:'single-speed',gears:1}];
   specificationScope={market:'Europe',modelYear:2025,variant:'Elroq 50/60/85; rozměry bez RS a Sportline',bodyType:'suv',noteCs:'Technický list z 5. května 2025. Motory zahrnují i RS, rozměry odpovídají běžným verzím. Nejvyšší výkon závisí na nabití a teplotě akumulátoru.'};sources.push(oem.elroq);
  }
  if(line.slug==='octavia'&&i===3){
   es=[engine('petrol',1498,1.5,85,110,'1.5 TSI'),engine('petrol-mhev',1498,1.5,85,110,'1.5 TSI mHEV'),engine('petrol',1984,2.0,150,150,'2.0 TSI 4×4')];
   ts=[{type:'manual',gears:6},{type:'dual-clutch',gears:7}];ds=['fwd','awd'];dims={length:null,width:null,height:null,wheelbase:null};
   specificationScope={market:'Europe',modelYear:2025,variant:'Vybrané benzinové verze po modernizaci; neúplná nabídka',bodyType:null,noteCs:'Výběr potvrzených motorů z technického listu. Nezahrnuje všechny starší motory, diesely ani provedení RS.'};sources.push(oem.octavia);
  }
  const fl=facelift(line.slug,i);if(fl)for(const f of fl)sources.push(...f.sources);
  const file=photoChoices[line.slug+'/'+(i+1)]||b.image;const ph=file?photo(file):null;if(ph)sources.push(ph.filePageUrl);
  const cardBody=line.slug==='rapid'?['hatchback']:line.slug==='favorit'?['hatchback','kombi','pickup']:g.bodyTypes||line.bodyTypes;
  const gen={code:g.code,name:hasMultiple?`${line.name} ${['I','II','III','IV'][i]||i+1}`:`${line.name} — základní řada`,from:g.from,to:g.to,productionStatus:g.productionStatus,facelift:fl,bodyTypes:cardBody,engines:es,engineCoverage:es?'partial':'unknown',drivetrains:ds,transmissions:ts,dimensionsMm:dims,specificationScope,trunkL:trunk,markets:['Europe'],marketNotesCs:line.slug==='kamiq'?'Evropský Kamiq; čínský vůz stejného jména je odlišný.':line.slug==='rapid'?'Evropský liftback a Spaceback; ruská a čínská provedení vyžadují samostatné posouzení.':'Evropská modelová řada. Některé zdrojové technické údaje zahrnují i jiné trhy.',photo:ph,sources:[...new Set(sources)]};
  if(line.slug==='superb'&&i===1)note(`generations[${i}].bodyTypes`,'Source labels TwinDoor as sedan; hatchback/liftback mapping for search needs explicit editorial reconciliation.');
  if(ph)note(`generations[${i}].photo.visualReview`,'Commons identity and licence metadata checked; composition, trim and facelift correspondence still require visual review.');
  return gen;
 });
 const card={makeSlug:'skoda',lineSlug:line.slug,name:line.name,isAddition:additions.some(a=>a.makeSlug==='skoda'&&a.slug===line.slug),segment:description[line.slug]?.[0]||null,summaryCs:description[line.slug]?.[1]||null,coverage:'pilot-partial',generations,sources:[...new Set([...line.sources,...generations.flatMap(g=>g.sources)])],needsReview:review};
 function unknowns(value,path){if(value===null){if(path.endsWith('.to')&&generations[+path.match(/\[(\d+)\]/)?.[1]]?.productionStatus==='current')return;if(/engines\[\d+\]\.displacementCc$|engines\[\d+\]\.displacementLitresNominal$/.test(path)){const m=path.match(/generations\[(\d+)\]\.engines\[(\d+)\]/);if(m&&generations[+m[1]].engines[+m[2]].fuel==='electric')return;}note(path,'Value not established for this field/scope; null does not mean zero or no available variant.');return;}if(Array.isArray(value))value.forEach((v,i)=>unknowns(v,path+'['+i+']'));else if(typeof value==='object')for(const[k,v]of Object.entries(value))unknowns(v,path?path+'.'+k:k);}
 unknowns({segment:card.segment,summaryCs:card.summaryCs,generations},'');cards.push(card);
}
cards.sort((a,b)=>a.lineSlug.localeCompare(b.lineSlug,'en'));
fs.mkdirSync('src/data/catalog/model-cards',{recursive:true});fs.writeFileSync('src/data/catalog/model-cards/skoda.json',JSON.stringify(cards,null,2)+'\n');
const scope={startedAt:'2026-10-25T22:52:55Z',generatedAt:new Date().toISOString(),checklist:{url:'https://www.drom.ru/catalog/skoda/',use:'One manually viewed make page; checklist only, not a factual specification/photo/prose source.'},completedLines:cards.map(c=>c.lineSlug),addedLines:['peaq'],deferred:[{names:['100','1000/1100 MB','1101/1102','1201','1202','440/445/450','Popular','Garde'],reason:'Historic lines outside the current approximately 1990-onward pilot; require a separate historic scope pass.'},{names:['105/120/125','130','Rapid/Garde historic','1203'],reason:'Late historic/technical vehicle families overlapping the used market need separate line and badge decisions; not represented as complete in this pilot.'},{names:['Kushaq','Slavia','Kylaq','Kodiaq GT','Kamiq China'],reason:'Regional non-European products deferred; no claim that grey imports never occur.'},{names:['Forman','Pick-up','Enyaq Coupé'],reason:'Grouped body/derivative names under Favorit/Felicia/Enyaq; body-specific generation/photos/specifications need additional work.'}],coverage:{cards:cards.length,generations:cards.reduce((n,c)=>n+c.generations.length,0),photos:cards.reduce((n,c)=>n+c.generations.filter(g=>g.photo).length,0),engines:'Partial nominal displacement/fuel lists; exact cc and power remain null unless explicitly sourced. Selected Octavia IV and Elroq 2025 manufacturer specifications are scoped examples.',facelifts:'Only manufacturer-corroborated events populated; other generations remain null, not an assertion of no facelift.',photosNote:'No image binaries downloaded. File/licence/author metadata checked; all composition/facelift matching still pending visual review.'}};
fs.writeFileSync('analysis/codex/skoda-card-scope-review.json',JSON.stringify(scope,null,2)+'\n');console.log(JSON.stringify(scope.coverage,null,2));
// Keep the public build entry point complete after the historic-range extension.
if(!process.argv.includes('--pilot-only'))await import('./expand-skoda-cards.mjs');
