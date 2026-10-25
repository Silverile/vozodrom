import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {batchOrder,batchGenerationSkip} from './model-line-batch-1.mjs';
import {batch2Order,batch2GenerationSkip,batch2ReviewNotes} from './model-line-batch-2.mjs';
import {batch3Order,batch3GenerationSkip,batch3ReviewNotes} from './model-line-batch-3.mjs';
import {batch4Order,batch4GenerationSkip,batch4ReviewNotes} from './model-line-batch-4.mjs';
const curatedBatchOrder=[...batchOrder,...batch2Order,...batch3Order,...batch4Order];
import {selection,order,additionalPages,aliases} from './model-line-selection.mjs';
import {dateChoices,forceUnknownDates,generationFamilies,exactGenerationCodes,combinedNames,badgeSpecificSources,manualExclusions,generationDateChoices} from './model-line-decisions.mjs';
const evidence=JSON.parse(fs.readFileSync('analysis/codex/model-line-evidence.json'));
const snapshot=JSON.parse(fs.readFileSync('src/data/catalog/models-auto.json'));
const makes=JSON.parse(fs.readFileSync('src/data/catalog/makes.json'));
const primary=JSON.parse(fs.readFileSync('analysis/codex/model-line-primary-facts.json'));
const bodyCodes={h:'hatchback',k:'kombi',s:'sedan',u:'suv',m:'mpv',c:'kupe',r:'kabriolet',p:'pickup',v:'dodavka'};
export const slug=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const norm=s=>slug(s||'').replace(/-/g,'');
function page(title){const seen=new Set();while(evidence.redirects[title]&&!seen.has(title)){seen.add(title);title=evidence.redirects[title];}return evidence.pages[title];}
function periods(text=''){
 const rs=[];const re=/\b((?:18|19|20)\d{2})\s*(?:–|—|−|-|to)\s*(?:(?:[A-Za-z]+|\d{1,2})\s+){0,2}((?:18|19|20)\d{2}|present|ongoing)\b/gi;let m;
 while((m=re.exec(text))){const from=+m[1],to=/present|ongoing/i.test(m[2])?null:+m[2];if(from>2026||to!==null&&to<from)continue;rs.push({from,to,label:text.slice(re.lastIndex).split(';')[0].trim()});}return rs;
}
function dates(text,choice={}){
 let ps=periods(text);if(choice.ranges)ps=choice.ranges.map(i=>ps[i]).filter(Boolean);
 if(!ps.length)return {from:null,to:null,productionStatus:'unknown',productionPeriods:null};
 const unique=[...new Set(ps.map(p=>p.from+'/'+p.to))];
 if(unique.length>1&&!choice.combine)return {from:null,to:null,productionStatus:'unknown',productionPeriods:null};
 return {from:choice.from??Math.min(...ps.map(p=>p.from)),to:ps.some(p=>p.to===null)?null:Math.max(...ps.map(p=>p.to)),productionStatus:ps.some(p=>p.to===null)?'current':'ended',productionPeriods:ps.map(({from,to})=>({from,to}))};
}
function bodies(text=''){
 const found=[];for(const [pattern,value] of [[/hatchback|liftback|fastback/i,'hatchback'],[/estate|wagon|shooting.brake|avant/i,'kombi'],[/sedan|saloon/i,'sedan'],[/\bSUV\b|crossover|off.road/i,'suv'],[/\bMPV\b|minivan|people.carrier/i,'mpv'],[/coup[eé]/i,'kupe'],[/convertible|cabriolet|roadster|targa/i,'kabriolet'],[/pick.?up/i,'pickup'],[/\bvan\b|panel.van/i,'dodavka']])if(pattern.test(text))found.push(value);return found;
}
const lines=[],audit=[];const sort=(a,b)=>a.makeSlug.localeCompare(b.makeSlug,'en')||a.name.localeCompare(b.name,'cs');
for(const makeSlug of order){for(const row of selection[makeSlug].split('\n')){
 const [name,title,body,fixedSlug]=row.split('|');const lineSlug=fixedSlug||slug(name),key=makeSlug+'/'+lineSlug;
 const requested=[title,...(additionalPages[key]||[])];const ps=[...new Map(requested.map(t=>page(t)).filter(p=>p&&!p.missing).map(p=>[p.title,p])).values()];
 if(!ps.length)throw Error('No retrieved article for '+key+' '+title);
 const sources=ps.map(p=>'https://en.wikipedia.org/w/index.php?oldid='+p.revisionId);
 for(const id of primary.augment.find(x=>x.key===key)?.sourceIds||[])sources.push(primary.sources.find(x=>x.id===id).url);
 const needsReview=[];const review=(field,reason)=>{if(!needsReview.some(r=>r.field===field&&r.reason===reason))needsReview.push({field,reason});};
 const expected=body?[...new Set([...body].map(c=>bodyCodes[c]))]:null;
 const factualText=ps.flatMap(p=>p.infoboxes.map(b=>[b.body_style,b.class].filter(Boolean).join('; '))).join('; ');
 const supported=bodies(factualText);let bodyTypes=expected;
 if(batch3Order.includes(makeSlug)&&/\b4x4\b|offroader/i.test(factualText)&&!supported.includes('suv'))supported.push('suv');
 if(expected&&expected.some(b=>!supported.includes(b))){bodyTypes=null;review('bodyTypes','European editorial body selection needs model-specific corroboration; generic/shared source body facts do not confirm every selected style.');}
 if(!expected)review('bodyTypes','Quadricycle/body style does not fit the passenger-car enum; do not label it a hatchback.');
 const choice={...(dateChoices[key]||{}),...(badgeSpecificSources[key]||{})};
 const box=choice.boxIndex!==undefined?ps[0].infoboxes[choice.boxIndex]:choice.box?ps[0].infoboxes.find(b=>((b.name||'')+' '+(b.heading||'')).includes(choice.box)):ps[0].infoboxes[0];
 let chronology=dates(box?.production,choice);
 const requestedNorm=norm(title.replace(/\([^)]*\)/g,'')),actualNorm=norm(ps[0].title.replace(/\([^)]*\)/g,''));
 const shared=actualNorm!==requestedNorm;
 if(shared&&!dateChoices[key]&&!badgeSpecificSources[key]){chronology=dates();review('from,to','Source redirects to a parent/shared platform or another badge; production interval for this exact European name is not established.');}
 if(combinedNames.has(key)&&!forceUnknownDates.has(key)){
  const candidatePeriods=ps.filter((p,index)=>!(index===0&&shared)&&!p.missing&&p.infoboxes[0]?.production).flatMap(p=>periods(p.infoboxes[0].production));
  if(candidatePeriods.length>1){chronology={from:Math.min(...candidatePeriods.map(p=>p.from)),to:candidatePeriods.some(p=>p.to===null)?null:Math.max(...candidatePeriods.map(p=>p.to)),productionStatus:candidatePeriods.some(p=>p.to===null)?'current':'ended',productionPeriods:candidatePeriods.map(({from,to})=>({from,to}))};review('productionPeriods','Reused/renamed badge or multiple production runs; periods are not a claim of continuous production or generation equivalence.');}
 }
 if(forceUnknownDates.has(key)){chronology=dates();review('from,to','Badge-specific European production chronology is unresolved; a shared/global/renamed article must not supply another model’s dates.');}
 if(key==='alfa-romeo/mito'){chronology.to=null;chronology.productionStatus='unknown';chronology.productionPeriods=null;}
 if(chronology.from===null)review('from','No single defensible production interval for the selected line in the retained facts.');
 if(chronology.productionStatus==='unknown')review('to','End year/current production not established. Null here does not confirm ongoing production.');
 let wikidataQid=null;
 if(!shared&&!/^Eurovans$/.test(ps[0].title)&&ps[0].infoboxes.some(b=>!b.parseError))wikidataQid=ps[0].wikidataQid;
 const matching=snapshot.filter(m=>m.makeSlug===makeSlug&&norm(m.name)===norm(name));
 if(matching.length===1)wikidataQid=matching[0].qid;
 if(combinedNames.has(key)&&new Set(ps.map(p=>p.wikidataQid).filter(Boolean)).size>1&&!matching.some(m=>m.kind==='series'))wikidataQid=null;
 if(['audi/90','audi/200','citroen/ds3','citroen/ds4','citroen/ds5','volvo/440','volvo/460','volvo/740','volvo/760','volvo/780','volvo/940','volvo/960'].includes(key))wikidataQid=matching.length===1?matching[0].qid:null;
 if(!wikidataQid)review('wikidataQid','No unique line-level match; a family/shared-platform QID is not substituted.');
 if(['mg/im5','mg/im6','mg/mgs9-phev','mg/mg4-urban','alfa-romeo/spider'].includes(key)){wikidataQid=null;review('wikidataQid','No unique whole-line identity established for the combined or rebadged selection; a donor or single-era QID is not substituted.');}
 if(key==='ssangyong-kgm/actyon'){wikidataQid=null;review('wikidataQid','Old SsangYong Actyon and revived KGM Actyon have distinct source identities; a single-era QID is not assigned to the merged sales name.');}
 if(wikidataQid)sources.push('https://www.wikidata.org/wiki/'+wikidataQid);
 const gs=[];
 if(generationFamilies.has(key)){
  for(const p of ps){for(let index=0;index<p.infoboxes.length;index++){
   const b=p.infoboxes[index],label=[b.name,b.heading].filter(Boolean).join(' — ');
   if(batchGenerationSkip[key]?.test(label))continue;
   if(batch2GenerationSkip[key]?.test(label))continue;
   if(batch3GenerationSkip[key]?.test(label))continue;
   if(batch4GenerationSkip[key]?.test(label))continue;
   const dedicated=/\bMk\d|\((?:E\d{2,3}|F\d{2,3}|G\d{2,3}|B\d|XP\d{2,3}|E\d{2,3})\)|\((?:first|second|third|fourth|fifth|sixth).*generation/i.test(p.title);
   const passat=key==='volkswagen/passat'&&/\bB[3-9]\b/.test(label);
   const batchDedicated=curatedBatchOrder.includes(makeSlug)&&/\((?:NA|NB|NC|ND|first generation|second generation|third generation|fourth generation|fifth generation|sixth generation)\)/i.test(p.title)&&index===0;
   const corvetteDedicated=key==='chevrolet/corvette'&&/\(C[4-8]\)/.test(p.title)&&index===0;
   const saabClassic=key==='saab/900'&&index>0;
   const batch3Code=batch3Order.includes(makeSlug)&&index===0?p.title.match(/\((964|993|996|997|991|992|986|987|981|982|XJ40|X300|X308|X350|X351|X100|X150|X250|X260|L663)\)/)?.[1]:null;
   const batch3Heading=(key==='land-rover/discovery'&&/Discovery Series I|Discovery Series II|Discovery 3|Discovery 4/.test(b.heading||''))||(key==='land-rover/freelander'&&/Freelander 2/.test(b.heading||''))||(key==='land-rover/defender'&&b.heading==='Defender')||(key==='jaguar/xj'&&/Series 3/.test(b.heading||''));
   const batch4Code=batch4Order.includes(makeSlug)&&index===0?p.title.match(/\((XJ|KJ|KK|KL|ZJ|WJ|WK|WK2|WL|YJ|TJ|JK|JL)\)/)?.[1]:null;
   if(!/generation|\bMk\s*[1-8IVX]+\b/i.test(label)&&!passat&&!(dedicated&&index===0)&&!batchDedicated&&!saabClassic&&!corvetteDedicated&&!batch3Code&&!batch3Heading&&!batch4Code)continue;
   if(/North America|Latin America|China.only|India.only|fifth generation.*2022|eighth generation.*2027/i.test(label)&&['ford/focus','bmw/rada-3','ford/mondeo'].includes(key))continue;
   const articleCode=p.title.match(/\b(Mk[1-8])\b|\((E\d{2,3}|F\d{2,3}|G\d{2,3}|B\d|XP\d{2,3})\)/i);
   const headingCode=b.heading?.match(/\((?:Typ\s+)?([^;()]+);\s*(?:19|20)\d{2}/i)?.[1];
   const bCode=key==='volkswagen/passat'?label.match(/\bB([3-9])\b/)?.[0]:null;
   let code=(makeSlug==='skoda'?b.model_code?.replace(/^(?:Typ|Type)\s+/i,''):null)||articleCode?.[1]||articleCode?.[2]||bCode||headingCode||b.model_code||b.modelcode||null;
   if(!code){const mk=(p.title+' '+label).match(/\bMk\s*([1-8])\b/i);if(mk)code='Mk'+mk[1];else{const c=p.title.match(/\((E\d{2,3}|F\d{2,3}|G\d{2,3}|B\d|XP\d{2,3})\)/);if(c)code=c[1];else{const c2=label.match(/\b(?:Typ\s+)?((?:[A-Z]{1,3}\d{1,3}[A-Z]?|\d[A-Z])(?:\s*\/\s*[A-Z]?\d{1,3}[A-Z]?)*)\s*[;)]/);if(c2)code=c2[1];}}}
   const ordinal=label.match(/\b(First|Second|Third|Fourth|Fifth|Sixth|Seventh|Eighth) generation\b/i)?.[1]?.toLowerCase();
   const roman={first:'I',second:'II',third:'III',fourth:'IV',fifth:'V',sixth:'VI',seventh:'VII',eighth:'VIII'}[ordinal];
   if(batch3Code)code=batch3Code;
   if(batch4Code)code=batch4Code;
   const dateCode=code;
   if(curatedBatchOrder.includes(makeSlug)&&code&&/;|\(|China|Australia|\bBY\b|\bGZ\b|^;/.test(code))code=null;
   if(batchDedicated&&/^Mazda MX-5/.test(p.title))code=p.title.match(/\((NA|NB|NC|ND)\)/)?.[1]||null;
   if(corvetteDedicated)code=p.title.match(/\((C[4-8])\)/)[1];
   if(code&&roman&&makeSlug==='skoda')code=roman+' ('+code+')';
   if(code&&/China|Russia|LWB|India|Subaru|Scion|long.?wheelbase|Grand i10/i.test(code)){code=null;}
   if(key==='toyota/corolla'&&/E140|E170/.test(code||''))code=null; // European E150/E180 boundary needs explicit reconciliation.
   if(key==='skoda/kodiaq')code=null; // Retrieved code list mixes variants; PS/NS are not guessed from demo objects.
   const dateChoice=generationDateChoices[key]?.[dateCode]||generationDateChoices[key]?.[ordinal]||{};
   const d=dates(b.production,dateChoice);
   if(batch3Order.includes(makeSlug)&&dateChoice.unresolved){d.from=null;d.to=null;d.productionStatus='unknown';d.productionPeriods=null;}
   const override=primary.generationOverrides.find(o=>o.key===key&&o.code===code);
   if(override){d.from=override.from;d.to=override.to;d.productionStatus=override.to===null?'current':'ended';}
   if(/2027|2028|2029|2030/.test(b.production||'')&&d.from===null)continue;
   if(d.to!==null&&d.to<1990)continue;
   if(d.from!==null&&d.from>=2026){review('generations','A source mentions a generation starting in 2026 or later; actual production/European availability needs corroboration before inclusion.');continue;}
   const bs=bodies(b.body_style||'').filter(t=>expected?.includes(t));
   const signature=[code,label,d.from,d.to].join('|');if(gs.some(g=>g._signature===signature))continue;
   const generationSources=['https://en.wikipedia.org/w/index.php?oldid='+p.revisionId];
   if(override)generationSources.push(primary.sources.find(x=>x.id===override.sourceId).url);
   if(key==='bmw/rada-3'&&['F30','G20'].includes(code)){d.to=null;d.productionStatus='unknown';review('generations','F30/G20 family end dates need European body/market reconciliation; global full-plant dates and source closed ranges are not interchangeable.');}
   gs.push({code,from:d.from,to:d.to,productionStatus:d.productionStatus,bodyTypes:bs.length?bs:null,sources:generationSources,_label:label,_signature:signature});
  }}
 }
 if(exactGenerationCodes[key])gs.push({code:exactGenerationCodes[key],from:chronology.from,to:chronology.to,productionStatus:chronology.productionStatus,bodyTypes:expected,sources,_label:'Source model code',_signature:'single-code'});
 if(batch4Order.includes(makeSlug))for(let i=gs.length-1;i>=0;i--){const g=gs[i];const prior=gs.slice(0,i).find(p=>g.code!==null&&p.code===g.code&&p.from===g.from&&p.to===g.to&&p.productionStatus===g.productionStatus);if(prior){prior.sources=[...new Set([...prior.sources,...g.sources])];if(prior.bodyTypes&&g.bodyTypes)prior.bodyTypes=[...new Set([...prior.bodyTypes,...g.bodyTypes])];gs.splice(i,1);}}
 if(!gs.length)review('generations','Generation boundaries/codes have not been reconciled for European variants; see factual candidates in model-line-evidence.json. Facelifts are not invented as generations.');
 if(curatedBatchOrder.includes(makeSlug))gs.sort((a,b)=>(a.from??Infinity)-(b.from??Infinity));
 if(curatedBatchOrder.includes(makeSlug)){
  review('scope','European-market name selection; source-production bounds can include global production. Regional successors and badge phases are not certified for Czech availability.');
  if(gs.length)review('generations','Partial reviewed source sequence; European launch/end dates and omitted regional/body variants still need reconciliation.');
  if(key==='saab/9-5')review('to','Parent source ends in 2012 but retained generation facts end in 2011; source-production bound requires reconciliation.');
  if(['mitsubishi/grandis','mitsubishi/asx','mitsubishi/eclipse-cross','honda/insight'].includes(key))review('scope','Name reuse/new European programme requires badge-specific chronology; donor-platform dates or a global current flag must not imply one continuous European generation.');
 }
 if(gs.length&&chronology.productionStatus==='current'&&!gs.some(g=>g.productionStatus==='current'))review('generations','The source-current model line has no reviewed current generation; the sequence is incomplete.');
 for(const [field,reason]of batch2ReviewNotes[key]||[])review(field,reason);
 for(const [field,reason]of batch3ReviewNotes[key]||[])review(field,reason);
 for(const [field,reason]of batch4ReviewNotes[key]||[])review(field,reason);
 if(key==='bmw/i3')review('scope','This entry is the I01 city hatchback; newer/regional i3 name reuse is not asserted to be its next generation.');
 for(let i=0;i<gs.length;i++){const g=gs[i];if(g.code===null)review('generations['+i+'].code','Source does not establish one unambiguous European code; ordinal/name and regional codes are not guessed.');if(g.from===null)review('generations['+i+'].from','Production dates are absent or contain unresolved region/body-specific ranges.');if(g.productionStatus==='unknown')review('generations['+i+'].to','End/current status unresolved; null does not assert current production.');if(g.bodyTypes===null)review('generations['+i+'].bodyTypes','No explicit generation-specific body mapping.');}
 const sourceProduction=box?.production??null;
 const model={slug:lineSlug,name,makeSlug,aliases:aliases[key]||[],bodyTypes,...chronology,dateScope:choice.scope||'source-production',generations:gs.length?gs.map(({_label,_signature,...g})=>g):null,wikidataQid,sources,needsReview};
 lines.push(model);audit.push({key,requestedTitles:requested,resolvedTitles:ps.map(p=>p.title),sourceProduction,selectedDateChoice:choice,generationEvidence:gs.map(g=>({code:g.code,label:g._label,sources:g.sources})),reviewedAsOf:'2026-10-25'});
}}
lines.sort(sort);
for(const file of ['analysis/codex/model-lines-batch-1-baseline.json','analysis/codex/model-lines-batch-2-baseline.json','analysis/codex/model-lines-batch-3-baseline.json','analysis/codex/model-lines-batch-4-baseline.json',...(fs.existsSync('analysis/codex/model-cards-pilot-baseline.json')?['analysis/codex/model-cards-pilot-baseline.json']:[])]){
const baseline=JSON.parse(fs.readFileSync(file));
for(const [m,b]of Object.entries(baseline.byMake)){
 const selected=lines.filter(l=>l.makeSlug===m);
 if(selected.length!==b.count||createHash('sha256').update(JSON.stringify(selected)).digest('hex')!==b.sha256)throw Error('Existing make changed: '+m);
}
}
if(fs.existsSync('src/data/catalog/model-line-additions.json')){
 for(const {additionReason,...line}of JSON.parse(fs.readFileSync('src/data/catalog/model-line-additions.json'))){
  if(lines.some(l=>l.makeSlug===line.makeSlug&&l.slug===line.slug))throw Error('Duplicate approved addition '+line.slug);
  lines.push(line);
 }
 lines.sort(sort);
}
fs.writeFileSync('src/data/catalog/model-lines-auto.json',JSON.stringify(lines,null,2)+'\n');
fs.writeFileSync('analysis/codex/model-line-decisions.json',JSON.stringify(audit,null,2)+'\n');
const exclusions={scope:'Editorial decisions; not a claim that grey imports never occur.',byMake:Object.fromEntries(order.map(m=>[m,manualExclusions[m].map(([name,reason])=>({name,decision:/merged|under .*famil|derivative|facelift|retained as.*alias/i.test(reason)?'merged':/deferred|not admitted|verification|needsReview|not.*corroborat|not.*confirmed|without.*evidence/i.test(reason)?'deferred':'excluded',reason}))]))};
fs.writeFileSync('analysis/codex/model-line-exclusions.json',JSON.stringify(exclusions,null,2)+'\n');
console.log(JSON.stringify({makes:new Set(lines.map(l=>l.makeSlug)).size,lines:lines.length,generations:lines.reduce((s,l)=>s+(l.generations?.length||0),0),unknownDates:lines.filter(l=>l.productionStatus==='unknown').length,needsReview:lines.reduce((s,l)=>s+l.needsReview.length,0),byMake:Object.fromEntries(order.map(m=>[m,lines.filter(l=>l.makeSlug===m).length]))},null,2));
