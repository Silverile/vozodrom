import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
export function sweep(make){
 const base='src/data/catalog/';
 const file=base+'model-cards/'+make+'.json';
 const reportFile=`analysis/sweep/codex/${make}.json`;
 if(fs.existsSync(reportFile))throw Error(`Existing report ${make}; review before overwrite`);
 const cards=read(file),fixes=[],checked=[];
 const report={make,checkedAt:'2026-10-29',by:'codex',makeFixes:[],modelFixes:[],removeModels:[],missingModels:[],cardFixesApplied:fixes,cardsAdded:[],conflicts:[],openQuestions:[],summary:''};
 const makeEntry=read(base+'makes.json').find(x=>x.slug===make);
 const raw=read(base+'models-auto.json').filter(x=>x.makeSlug===make);
 const lines=read(base+'model-lines-auto.json').filter(x=>x.makeSlug===make);
 const additions=read(base+'model-line-additions.json').filter(x=>x.makeSlug===make);
 const used=new Map();
 const set=(slug,path,value,sources,reason)=>{
  const c=cards.find(c=>c.lineSlug===slug);if(!c)throw Error(`Missing ${make}/${slug}`);
  const keys=path.replace(/\[(\d+)\]/g,'.$1').split('.');let p=c;
  for(const k of keys.slice(0,-1))p=p[k];const k=keys.at(-1),before=p[k]??null;
  if(JSON.stringify(before)===JSON.stringify(value))return;
  fixes.push({lineSlug:slug,path,from:structuredClone(before),to:structuredClone(value),sources,reason});p[k]=value;
  if(!used.has(slug))used.set(slug,new Map());
  used.get(slug).set(path,sources);
 };
 const proposal=(slug,field,to,sources,reason)=>{
  for(const [name,items] of [['model-lines-auto',lines],['model-line-additions',additions]]){
   const line=items.find(x=>x.slug===slug);if(!line)continue;
   const keys=field.replace(/\[(\d+)\]/g,'.$1').split('.');const from=keys.reduce((a,k)=>a?.[k],line);
   if(from!==undefined&&JSON.stringify(from)!==JSON.stringify(to))report.modelFixes.push({file:name,slug,field,from,to,sources,confidence:'high',reason});
  }
 };
 const makeFix=(field,to,sources,reason)=>{if(JSON.stringify(makeEntry[field])!==JSON.stringify(to))report.makeFixes.push({field,from:makeEntry[field],to,sources,confidence:'high',reason});};
 const finish=summary=>{
  for(const [slug,paths] of used){
   const c=cards.find(c=>c.lineSlug===slug);const sources=[...new Set([...paths.values()].flat())];
   set(slug,'sources',[...new Set([...c.sources,...sources])],sources,'Attach checked evidence.');
   for(const [i,g] of c.generations.entries()){
    const gs=[...new Set([...paths].filter(([p])=>p.startsWith(`generations[${i}].`)).flatMap(([,s])=>s))];
    if(gs.length)set(slug,`generations[${i}].sources`,[...new Set([...g.sources,...gs])],gs,'Attach checked generation evidence.');
   }
   const resolved=new Set([...paths.keys()].filter(p=>!p.endsWith('.sources')&&!p.includes('marketNotes')));
   const remaining=c.needsReview.filter(x=>!resolved.has(x.field));
   if(remaining.length!==c.needsReview.length)set(slug,'needsReview',remaining,sources,'Remove only exact resolved field flags.');
  }
  report.reviewScope={status:'partial',makeEntryInspected:true,rawModelsInventoried:raw.length,modelLinesInventoried:lines.length,additionsInventoried:additions.length,catalogCardsInventoried:cards.length,generationRowsInventoried:cards.reduce((n,c)=>n+c.generations.length,0),externalChecks:checked,limitations:'Breadth-first evidence pass. All local identities and generation rows inventoried; only listed checks externally verified. Remaining histories, specs, photos, duplicate attribution and current statuses are unresolved.'};
  report.summary=summary;
  if(fixes.length)fs.writeFileSync(file,JSON.stringify(cards,null,2)+'\n');
  fs.writeFileSync(reportFile,JSON.stringify(report,null,2)+'\n');
  console.log(`${make}: ${cards.length} cards; ${fixes.length} logged changes; ${report.makeFixes.length+report.modelFixes.length} shared-field proposals`);
 };
 return {makeEntry,raw,lines,additions,cards,report,checked,set,proposal,makeFix,finish};
}
