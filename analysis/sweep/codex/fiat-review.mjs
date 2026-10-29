import fs from 'node:fs';
const file='src/data/catalog/model-cards/fiat.json';
const cards=JSON.parse(fs.readFileSync(file,'utf8'));
const reportFile='analysis/sweep/codex/fiat.json';
if(fs.existsSync(reportFile))throw new Error('Report already exists; review before rerunning mutation.');
const freemont='https://www.sec.gov/Archives/edgar/data/1513153/000119312513374811/d564443ds1.htm';
const freemontPress='https://www.media.stellantis.com/em-en/fiat/press/fiat-freemont-international-debut';
const qubo='https://www.media.stellantis.com/em-en/fiat/press/qubo-fiat-s-new-free-space';
const quboL='https://www.media.stellantis.com/pl-pl/fiat/press/fiat-prezentuje-model-qubo-l-wszechstronny-samochod-rodzinny-dopasowany-do-wspolczesnego-stylu-zycia';
const fixes=[];
const set=(c,path,value,sources,reason)=>{
  const keys=path.replace(/\[(\d+)\]/g,'.$1').split('.');
  let p=c;for(const k of keys.slice(0,-1))p=p[k];const k=keys.at(-1);
  if(JSON.stringify(p[k])===JSON.stringify(value))return;
  fixes.push({lineSlug:c.lineSlug,path,from:p[k],to:value,sources,reason});p[k]=value;
};
for(const slug of ['freemont','qubo']){
  const c=cards.find(c=>c.lineSlug===slug),src=slug==='freemont'?[freemont,freemontPress]:[qubo];
  set(c,'generations[0].from',slug==='freemont'?2011:2008,src,'Badge-specific chronology replaces parent-model infobox date.');
  set(c,'generations[0].to',null,src,'Previous end came from a broader parent family. This pass has not established a badge-specific global production end. Null does not imply current production.');
  set(c,'generations[0].bodyTypes',[slug==='freemont'?'suv':'mpv'],src,'Manufacturer body description for this nameplate.');
  set(c,'summaryCs',slug==='freemont'?'Fiat Freemont je sedmimístné SUV odvozené z modelu Dodge Journey. Výroba pod značkou Fiat začala v mexické Toluce v červenci 2011; datum ukončení této konkrétní řady zde zůstává neověřené.':'Fiat Qubo byl uveden v roce 2008 jako kompaktní osobní víceúčelový vůz se dvěma bočními posuvnými dveřmi. Není totožný s celou rodinou užitkového Fiorina vyráběnou od roku 1977; datum ukončení původního Quba zde zůstává neověřené.',src,'Describe the badge rather than the parent family.');
  set(c,'sources',[...new Set([...c.sources,...src])],src,'Attach primary evidence.');
  set(c,'generations[0].sources',[...new Set([...c.generations[0].sources,...src])],src,'Attach primary evidence.');
  set(c,'generations[0].fieldSources',{...(c.generations[0].fieldSources??{}),from:src,bodyTypes:src},src,'Index the new positive facts; unknown end is not asserted as sourced.');
  set(c,'needsReview',[...c.needsReview.filter(r=>r.field!=='generations[0].bodyTypes'),{field:'generations[0].to',reason:'Konec výroby pod tímto konkrétním jménem není v tomto průchodu ověřen; datum širší rodiny nesmí být převzato automaticky.'}],src,'Remove resolved body flag and explicitly mark unknown end.');
}
const lines=JSON.parse(fs.readFileSync('src/data/catalog/model-lines-auto.json','utf8'));
const raw=JSON.parse(fs.readFileSync('src/data/catalog/models-auto.json','utf8'));
const report={make:'fiat',checkedAt:'2026-10-29',by:'codex',reviewScope:{status:'partial',catalogCardsInventoried:cards.length,rawModelsInventoried:raw.filter(x=>x.makeSlug==='fiat').length,externallyChecked:['Freemont badge-specific production start','Original Qubo introduction and body','2026 QUBO L missing nameplate'],notChecked:['Full make history and remaining model catalogue','Exact end dates of original Qubo and Freemont','All technical versions, dimensions and photos']},makeFixes:[],modelFixes:['freemont','qubo'].map(slug=>({file:'model-lines-auto',slug,field:'from',from:lines.find(x=>x.makeSlug==='fiat'&&x.slug===slug).from,to:slug==='freemont'?2011:2008,sources:slug==='freemont'?[freemont]:[qubo],confidence:'high'})),removeModels:[],missingModels:[{name:'QUBO L',slug:'qubo-l',from:2026,to:null,bodyTypes:['mpv'],sources:[quboL],note:'Manufacturer introduced May 2026; distinct modern 5/7-seat product, do not silently extend original Qubo dates.'}],cardFixesApplied:fixes,cardsAdded:[],conflicts:[],openQuestions:['Find primary last-production records for original Qubo and Freemont; end years cleared to null until badge-specific evidence is available.','UK Stellantis archive labels Qubo 2008–2019; that market-specific sales range is insufficient to assert a global production end.','2026 QUBO L and the Doblò passenger line need a naming/alias decision before adding a separate shared model line.'],summary:'Partial Fiat audit corrects parent-family dates on Freemont and Qubo, restores unknown badge-specific end years, fills manufacturer body descriptions and proposes missing QUBO L. Other Fiat models remain externally unchecked.'};
fs.writeFileSync(file,JSON.stringify(cards,null,2)+'\n');
fs.writeFileSync(reportFile,JSON.stringify(report,null,2)+'\n');
console.log(`Fiat: ${fixes.length} logged changes including 8 factual fields; 2 shared-line start proposals, 1 missing model proposal.`);
