import fs from 'node:fs';import cp from 'node:child_process';import assert from 'node:assert/strict';
import {compactEngineRows} from './short-engine-labels.mjs';
import {evidenceProblem,rejectEngine,balancedBrackets,normalizeVariant} from './engine-throughput-policy.mjs';
const root=process.argv.find(a=>a.startsWith('--root='))?.slice(7)??'analysis/codex/wave-3-missing-cards';assert(/^analysis\/codex\/wave-3-missing-cards(?:-\d+)?$/.test(root));
const {plans,duplicateTargets,nonModelProposals,exclusionEvidence={}}=await import('./'+root.split('/').pop()+'/plan.mjs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
const survey=read(root+'/survey.json'),baselineRevision=survey.baselineRevision,git=p=>JSON.parse(cp.execFileSync('git',['show',baselineRevision+':'+p],{maxBuffer:80e6})),before=git('src/data/model-cards-index.json');
assert(survey.complete,'Finish or explicitly defer the entire survey queue before materialization.');
const sourceFiles=['src/data/catalog/model-lines-auto.json','src/data/catalog/model-line-additions.json'],lineSources=sourceFiles.map(file=>({file,rows:read(file)})),all=lineSources.flatMap(x=>x.rows);
const engineCandidates=process.argv.includes('--with-engines')?read(root+'/engine-candidates.json'):null;
if(engineCandidates){assert(engineCandidates.complete);assert.equal(engineCandidates.baselineRevision,baselineRevision);}
const findings=[],added=[],removed=[],engineEvidence=[],engineExcluded=[],cardFiles=new Map(),id=l=>l.makeSlug+'/'+l.slug;
const bodies=text=>[...new Set([[/saloon|sedan/i,'sedan'],[/hatchback/i,'hatchback'],[/estate|station wagon/i,'kombi'],[/coup[eé]/i,'kupe'],[/convertible|cabriolet/i,'kabriolet'],[/SUV/i,'suv'],[/pickup|pick-up|truck/i,'pickup'],[/\bvan(?![a-z])/i,'dodavka'],[/minivan|MPV|LAV/i,'mpv']].flatMap(([r,b])=>r.test(text)?[b]:[]))];
function period(raw,plan){
 assert(raw,'missing Production field');
 const clean=raw.replace(/\[[^\]]*\]/g,'');
 const ys=(clean.match(/(?:18|19|20)\d{2}/g)??[]).map(Number).filter(y=>y<=2026);
 assert(ys.length,'no production year');
 if(plan.productionQuote)assert(clean.includes(plan.productionQuote));
 if(plan.from!=null)return {from:plan.from,to:plan.to??null,current:plan.to==null&&/present|seit/i.test(clean)};
 if(plan.mainPeriod){const first=clean.match(/((?:18|19|20)\d{2})\s*[–-]\s*((?:18|19|20)\d{2})/);assert(first);return {from:+first[1],to:+first[2],current:false};}
 return {from:Math.min(...ys),to:/present/i.test(clean)?null:Math.max(...ys),current:/present/i.test(clean)};
}
function electricEngines(box,url){
 const r=box.rows;if(!r['Electric motor']||r.Engine||!r['Power output'])return [];
 const values=[...r['Power output'].matchAll(/(\d+(?:\.\d+)?(?:\s*(?:or|[–,-])\s*\d+(?:\.\d+)?)*)\s*kW\b/g)].flatMap(m=>(m[1].match(/\d+(?:\.\d+)?/g)??[]).map(Number));
 return [...new Set(values)].filter(n=>n>0&&n<3000).map(n=>({fuel:'electric',variant:'Elektromotor '+n+' kW',powerKwMin:n,powerKwMax:n,availablePowerKw:[n],powerRangeCoverage:'documented-versions-only',sources:[url]}));
}
for(const plan of plans){
 const item=survey.lines.find(x=>x.id===plan.id);assert(item,plan.id);
 const [make,line]=plan.id.split('/');assert(!before[make]?.[line],'existing card cannot be overwritten');
 const article=plan.source?{url:plan.source,title:plan.name}:plan.article?item.articles.find(a=>a.title===plan.article):item.articles[0];assert(article,plan.id+' article missing');
 const lineRecord=all.find(l=>id(l)===plan.id);assert(lineRecord);
 const name=plan.name??lineRecord.name;
 const proof=structuredClone(plan.evidence??[]);
 const gs=plan.generations??plan.boxes.map((bi,i)=>{
  const box=article.boxes[bi];assert(box,plan.id+' infobox '+bi);const raw=box.rows[plan.productionField??'Production'];const override=plan.periodByBox?.[bi];const effective=override?{...plan,from:override.from,to:override.to,productionQuote:override.quote}:plan;const dates=period(raw,effective);
  assert(!/prototype/i.test(raw),'prototype is not series production');
  const body=plan.bodyByBox?.[bi]??plan.body??bodies(box.rows['Body style']??article.boxes[0].rows['Body style']??'');assert(body.length,plan.id+' body unsupported');
  const g={name:plan.names?.[i]??(plan.boxes.length===1?name:box.caption),code:plan.codes?.[i]??null,from:dates.from,to:dates.to,productionStatus:plan.announcement?'announced':dates.current?'current':'ended',bodyTypes:body,engines:electricEngines(box,article.url).filter(e=>!plan.excludePowerKw?.includes(e.powerKwMin)),sources:[article.url]};
  if(plan.faceliftsByBox?.[bi])g.facelift=plan.faceliftsByBox[bi];
  if(plan.announcement){g.dateBasis='announcement';g.productionStatus='announced';g.to=null;g.specificationScope={noteCs:'Oznámený model; datum zahájení sériové výroby není tímto záznamem potvrzeno.'};}
  proof.push({generationIndex:i,articleTitle:article.title,url:article.url,boxIndex:bi,boxCaption:box.caption,headings:box.headings,modelCode:box.rows['Model code']??null,production:raw,body:box.rows['Body style']??article.boxes[0].rows['Body style']??box.rows.Type??null,class:box.rows.Class??article.boxes[0].rows.Class??null,powerOutput:box.rows['Power output']??null,explicitOverrides:effective.productionQuote??null,faceliftEvidence:plan.faceliftEvidence??null});
  return g;
 });
 for(const [i,g]of gs.entries()){
  const candidate=engineCandidates?.generations.find(r=>r.make===make&&r.line===line&&r.generationIndex===i);if(!candidate?.engines.length)continue;
  assert.equal(candidate.from,g.from);assert.equal(candidate.to,g.to);
  for(const original of candidate.engines){const e=compactEngineRows([original])[0];
   const firstYear=original.sourceScope?.variantYears?.match(/(?:19|20)\d{2}/)?.[0];if(firstYear&&Number(firstYear)>2026){engineExcluded.push({id:plan.id,index:i,variant:original.variant,reason:'Variant source period starts after the research year 2026.'});continue;}
   if(e?.fuel==='electric'&&/\bkWh\b/.test(e.variant))e.variant='Elektromotor '+e.powerKwMin+' kW';
   if(make==='volkswagen'&&line.startsWith('golf-plus-line-')&&e?.variant==='1.4 TSI'&&e.powerKwMin===59){engineExcluded.push({id:plan.id,index:i,variant:e.variant,reason:'Source table labels BLG as 59 kW, conflicting with the known TSI specification; omitted rather than guessed.'});continue;}
   const reason=e?(rejectEngine(make,line,e)||evidenceProblem(g,i,e)||(!balancedBrackets(e.variant)||normalizeVariant(e.variant)!==e.variant||e.variant.length>40?'Malformed/long variant':null)):'Header/non-European row';
   if(reason){engineExcluded.push({id:plan.id,index:i,variant:original.variant,reason});continue;}
   if(g.engines.some(x=>x.variant===e.variant&&x.powerKwMin===e.powerKwMin))continue;
   const published=Object.fromEntries(['fuel','displacementCc','displacementLitresNominal','powerKwMin','powerKwMax','availablePowerKw','powerRangeCoverage','variant','sources'].filter(k=>Object.hasOwn(e,k)).map(k=>[k,e[k]]));
   g.engines.push(published);engineEvidence.push({id:plan.id,index:i,engine:published,sourceScope:e.sourceScope});
  }
 }
 const card={makeSlug:make,lineSlug:line,name,isAddition:true,coverage:'source-partial',...(plan.summaryCs?{summaryCs:plan.summaryCs}:{}),...(plan.vehicleCategory?{vehicleCategory:plan.vehicleCategory}:{}),generations:gs,sources:[...new Set(gs.flatMap(g=>g.sources))]};
 const file='src/data/catalog/model-cards/'+make+'.json';if(!cardFiles.has(file))cardFiles.set(file,fs.existsSync(file)?read(file):[]);const cards=cardFiles.get(file);
 const old=cards.findIndex(c=>c.lineSlug===line);if(old>=0){assert(!before[make]?.[line]);cards[old]=card;}else cards.push(card);
 lineRecord.name=name;lineRecord.generations=gs.map(g=>({code:g.code,from:g.from,to:g.to,bodyTypes:g.bodyTypes,productionStatus:g.productionStatus,sources:g.sources,...(g.dateBasis?{dateBasis:g.dateBasis}:{})}));
 const starts=gs.map(g=>g.from).filter(Number.isFinite),ends=gs.map(g=>g.to).filter(Number.isFinite);
 lineRecord.from=starts.length?Math.min(...starts):null;lineRecord.to=gs.some(g=>g.to==null)||!ends.length?null:Math.max(...ends);lineRecord.productionStatus=gs.every(g=>g.productionStatus==='announced')?'announced':gs.some(g=>g.productionStatus==='current')?'current':gs.every(g=>g.productionStatus==='ended')?'ended':'unknown';lineRecord.productionPeriods=lineRecord.productionStatus==='announced'||lineRecord.from==null?null:[{from:lineRecord.from,to:lineRecord.to}];lineRecord.bodyTypes=[...new Set(gs.flatMap(g=>g.bodyTypes))];lineRecord.sources=[...new Set([...(lineRecord.sources??[]),...card.sources])];
 added.push({id:plan.id,name,file,generations:gs.length,engines:gs.reduce((n,g)=>n+g.engines.length,0),facelifts:gs.reduce((n,g)=>n+(g.facelift?.length??0),0),proof});
}
const remove=new Set([...Object.keys(duplicateTargets),...nonModelProposals]);
for(const oldId of remove){
 const [make,line]=oldId.split('/');assert(!before[make]?.[line]);
 const targets=duplicateTargets[oldId]??[];
 for(const target of targets){const [m,l]=target.split('/');assert(before[m]?.[l],target+' target missing');}
 const statsFile='src/data/stats/'+make+'.json';assert(!fs.existsSync(statsFile)||!read(statsFile)[line],'cannot remove a line with published statistics');
 removed.push({id:oldId,targets,reason:targets.length?'Duplicate audit proposal; canonical card already contains this model/generation.':exclusionEvidence[oldId]?.reason??'Audit instruction, not a vehicle model.',...(exclusionEvidence[oldId]?{evidence:exclusionEvidence[oldId]}:{}),targetGenerations:targets.map(target=>{const[m,l]=target.split('/');return {id:target,generations:before[m][l].generations.map(g=>({name:g.name,code:g.code,from:g.from,to:g.to}))};})});
}
for(const [file,cards]of cardFiles)write(file,cards);
for(const s of lineSources){const rows=s.rows.filter(l=>!remove.has(id(l)));if(JSON.stringify(rows)!==JSON.stringify(read(s.file)))write(s.file,rows);}
const resolved=new Set([...added.map(x=>x.id),...remove]);
for(const item of survey.lines.filter(x=>!resolved.has(x.id))){const limited=!item.articles.length&&item.attempts.some(a=>/429|Deferred/.test(a.error??''));findings.push({id:item.id,status:limited?'source-fetch-deferred':'needs-model-specific-source-or-scope-review',attempts:item.attempts,reason:item.articles.length?'Model-specific badge/generation/market review still pending; fetched article retained for the next pass, no parent-family dates copied automatically.':'No usable model-specific infobox yet; source availability is not disproved.'});}
write(root+'/report.json',{baselineRevision,phase:'wave-3 missing-card batch '+(root.match(/-(\d+)$/)?.[1]??1),addedCards:added.length,addedGenerations:added.reduce((n,x)=>n+x.generations,0),addedEngineRows:added.reduce((n,x)=>n+x.engines,0),addedFaceliftStages:added.reduce((n,x)=>n+x.facelifts,0),duplicateProposalsRemoved:Object.keys(duplicateTargets).length,nonModelProposalsRemoved:nonModelProposals.length,oldToNewGenerationRemaps:[],coupledAssets:'No existing card changed; no generation-index remaps. No published stats or drawings on removed proposal lines.',added,removed,remaining:findings});
if(engineCandidates)write(root+'/engine-evidence.json',{baselineRevision,rows:engineEvidence,excluded:engineExcluded});
cp.execFileSync('node',['scripts/model-cards-index.mjs'],{stdio:'inherit'});cp.execFileSync('node',['scripts/model-lines-index.mjs'],{stdio:'inherit'});
console.log(JSON.stringify({addedCards:added.length,addedGenerations:added.reduce((n,x)=>n+x.generations,0),removed:removed.length,remaining:findings.length}));
