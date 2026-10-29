// Run from repository root. No network requests; sources are the reviewed sweep evidence.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const root='analysis/sweep/', read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const cache=new Map(), original=new Map(), events=[];
const load=p=>{if(!cache.has(p)){const s=fs.readFileSync(p,'utf8');original.set(p,s);cache.set(p,JSON.parse(s));}return cache.get(p);};
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const save=(p,x)=>{cache.set(p,x);};
const log=(status,file,make,entry,reason)=>events.push({status,file,make,entry,reason});
const fileOf=f=>f.startsWith('src/')?f:`src/data/catalog/${f}.json`;
const sourcesOf=x=>[...new Set((x.sources??[]).filter(s=>typeof s==='string'&&/^https?:\/\//.test(s)))];
const reasonExcluded=x=>/rejected|reverted|withdrawn/i.test(x.verify??'')?'rejected/reverted/withdrawn verification':x.action==='withdraw'?'withdrawn':!sourcesOf(x).length?'no source URL':x.confidence==='low'&&new Set(sourcesOf(x).map(s=>new URL(s).hostname.replace(/^(en|de|fr|cs|ja|zh|es|it)\.(wikipedia\.org)$/,'$2'))).size<2?'low confidence without independent second source':null;
const countries={Q183:'Německo',Q148:'Čína',Q145:'Spojené království',Q884:'Jižní Korea',Q38:'Itálie',Q668:'Indie',Q142:'Francie',Q30:'Spojené státy americké',Q833:'Malajsie'};
const countryQid=s=>Object.keys(countries).find(q=>countries[q]===s)||({Malaysia:'Q833','United States':'Q30','??na':'Q148'})[s]||s.match(/\bQ\d+\b/)?.[0];
const makes=load(fileOf('makes'));
const proposals=[];
for(const who of ['codex','claude'])for(const name of fs.readdirSync(root+who).filter(n=>n.endsWith('.json')).sort()){
 const p=read(root+who+'/'+name);if(typeof p.make==='string'&&name===`${p.make}.json`&&makes.some(m=>m.slug===p.make))proposals.push({...p,proposalFile:root+who+'/'+name});
}
const tokens=path=>path.replace(/\[(\d+)\]/g,'.$1').split('.');
const get=(o,p)=>tokens(p).reduce((v,k)=>v?.[k],o);
function put(o,p,v){const ks=tokens(p),key=ks.pop();let parent=o;for(const k of ks){if(parent?.[k]==null)return false;parent=parent[k];}if(parent==null)return false;parent[key]=structuredClone(v);return true;}
function fieldsOf(field){
 let f=field.trim();
 // Explicit numeric generation annotations are editorial context, not paths.
 f=f.replace(/^(generations\[\d+\]) \([^)]+\) /,'$1.');
 if(!/^[\w.\[\] /-]+$/.test(f))return null;
 if(!f.includes('/'))return /^[a-zA-Z]\w*(?:\[\d+\])?(?:\.\w+(?:\[\d+\])?)*$/.test(f)?[f]:null;
 let parts=f.split('/').map(s=>s.trim());
 if(parts.some(s=>!s))return null;
 if(/^generations\[\d+\]\./.test(parts[0])){const prefix=parts[0].slice(0,parts[0].lastIndexOf('.')+1);parts=parts.map((s,i)=>i&&!s.includes('.')?prefix+s:s);}
 return parts.every(s=>/^[a-zA-Z]\w*(?:\[\d+\])?(?:\.\w+(?:\[\d+\])?)*$/.test(s))?parts:null;
}
const normalizeList=v=>Array.isArray(v)?v.map(c=>typeof c==='string'?{qid:c,name:countries[c]??null}:{...c,name:countries[c.qid]??c.name}):v;
function validValue(field,value,isRaw){
 const end=field.split('.').at(-1);
 if(['from','to','productionStart','productionEnd','inceptionYear','discontinuedYear','foundedYear','dissolvedYear'].includes(end))return value===null||Number.isInteger(value);
 if(end==='productionStatus')return ['current','ended','unknown'].includes(value);
 if(end==='status')return value===null||value==='defunct';
 if(isRaw&&['aliases','note','mapping'].includes(end))return false;
 return true;
}
function applyFix(p,x,file,isMake=false){
 if(p.make==='jaguar'&&x.slug==='e-type'&&x.to===1965)return log('excluded',file,p.make,x,'withdrawn E-type 2+2 1965 proposal');
 const excluded=reasonExcluded(x);if(excluded)return log('excluded',file,p.make,x,excluded);
 if(!fs.existsSync(file))return log('skipped',file,p.make,x,'target file absent');
 const arr=load(file),record=arr.find(r=>isMake?r.slug===p.make:r.makeSlug===p.make&&(r.slug===x.slug||r.lineSlug===x.slug));
 if(!record)return log('skipped',file,p.make,x,'target record absent');
 let field=x.field;
 // Resolve a single source generation code only when it identifies exactly one record.
 field=field.replace(/generations\[([^\d\]][^\]]*)\]/g,(all,code)=>{const hits=(record.generations??[]).map((g,i)=>g.code===code?i:-1).filter(i=>i>=0);return hits.length===1?`generations[${hits[0]}]`:all;});
 const fields=fieldsOf(field);if(!fields)return log('excluded',file,p.make,x,'prose/ambiguous field; human decision');
 if(fields.some(f=>f==='slug'))return log('excluded',file,p.make,x,'slug rename deferred: URL/registry migration requires human decision');
 if(isMake&&['qid','status'].some(k=>fields.includes(k))&&(/reviv|incarnation|demerger|Passenger|caveat/i.test((x.note??'')+' '+(x.verify??''))))return log('excluded',file,p.make,x,'canonical company/brand identity decision');
 let before=x.from,after=x.to;
 if(fields.length>1){
  if(typeof before==='string'&&before.includes('/'))before=before.split('/').map(s=>s.trim()==='null'?null:s.trim()==='unknown'?'unknown':/^\d+$/.test(s.trim())?Number(s):s.trim());
  if(typeof after==='string'&&after.includes('/'))after=after.split('/').map(s=>s.trim()==='null'?null:/^\d+$/.test(s.trim())?Number(s):s.trim());
  if(before===null)before=fields.map(()=>null);
  if(!Array.isArray(before)&&!Array.isArray(after)){before=fields.map(()=>x.from);after=fields.map(()=>x.to);}
  if(!Array.isArray(before)||!Array.isArray(after)||before.length!==fields.length||after.length!==fields.length)return log('excluded',file,p.make,x,'compound values require explicit per-field mapping');
 }else{before=[before];after=[after];}
 for(let i=0;i<fields.length;i++){
  const f=fields[i];
  if(isMake&&f==='country'){const q=countryQid(after[i]);if(!q||!countries[q])return log('excluded',file,p.make,x,'country normalization unresolved');after[i]=countries[q];}
  if(isMake&&f==='countries'){before[i]=normalizeList(before[i]);after[i]=normalizeList(after[i]);}
  if(f==='generations'&&Array.isArray(after[i]))after[i]=after[i].map(g=>({code:null,from:null,to:null,productionStatus:g.to!=null?'ended':'unknown',bodyTypes:null,sources:sourcesOf(x),...g}));
  if(!validValue(f,after[i],file.endsWith('/models-auto.json')))return log('excluded',file,p.make,x,'value not supported by schema');
 }
 const current=fields.map(f=>get(record,f));
 if(equal(current,after))return log('skipped',file,p.make,x,'already applied');
 // Only optional card fields absent on disk may use a null before-value.
 if(!current.every((v,i)=>equal(v,before[i])||(v===undefined&&before[i]===null&&file.includes('/model-cards/'))))return log('skipped',file,p.make,x,'before-value mismatch: '+JSON.stringify(current));
 const trial=structuredClone(record);
 for(let i=0;i<fields.length;i++)if(!put(trial,fields[i],after[i]))return log('skipped',file,p.make,x,'parent path absent');
 Object.assign(record,trial);
 if(Array.isArray(record.sources))record.sources=[...new Set([...record.sources,...sourcesOf(x)])];
 if(file.includes('/model-cards/')){record.sources=[...new Set([...(record.sources??[]),...sourcesOf(x)])];for(const f of fields){const m=f.match(/^generations\[(\d+)\]/);if(m){const g=record.generations[+m[1]];g.sources=[...new Set([...(g.sources??[]),...sourcesOf(x)])];(g.fieldSources??={})[f.replace(/^generations\[\d+\]\./,'')]=sourcesOf(x);}}}
 if(isMake&&fields.includes('country')){const q=countryQid(record.country);if(record.countryQid===null||record.countryQid===q){record.countryQid=q;if(!record.countries.length)record.countries=[{qid:q,name:countries[q]}];}}
 log('applied',file,p.make,x,'before-value matched');
}
for(const p of proposals){
 for(const x of p.makeFixes??[])applyFix(p,x,fileOf('makes'),true);
 for(const x of p.modelFixes??[])for(const file of x.file.split('|')){
  const path=fileOf(file);if(!/^src\/data\/(catalog\/(models-auto|model-lines-auto|model-line-additions)\.json|model-cards\/(ford|hyundai)\.json)$/.test(path)){log('excluded',path,p.make,x,'unsupported target');continue;}
  applyFix(p,x,path);
 }
}
// Changing a Wikidata identity also changes its derived source link, but never an
// independently supplied source URL. This runs after already-applied fixes too.
for(const p of proposals)for(const x of p.modelFixes??[]){
 if(x.field!=='qid'||reasonExcluded(x))continue;
 const file=fileOf(x.file);if(!cache.has(file))continue;
 const r=load(file).find(r=>r.makeSlug===p.make&&r.slug===x.slug);
 if(r?.qid===x.to&&r.sourceUrl===`https://www.wikidata.org/wiki/${x.from}`){r.sourceUrl=`https://www.wikidata.org/wiki/${x.to}`;log('applied',file,p.make,x,'derived source URL aligned with corrected QID');}
}
// Persist exclusions independently of source-generation output, which is overwritten by rebuilds.
const exclusionPath=root+'selector-exclusions.json';
if(!fs.existsSync(exclusionPath))original.set(exclusionPath,null);
const exclusions=fs.existsSync(exclusionPath)?load(exclusionPath):[];save(exclusionPath,exclusions);
for(const p of proposals)for(const x of p.removeModels??[]){
 const file=fileOf(x.file),exc=reasonExcluded(x);
 if(exc){log('excluded',file,p.make,x,exc);continue;}
 if(!['models-auto','model-lines-auto','model-line-additions'].includes(x.file)){log('excluded',file,p.make,x,'unsupported removal target');continue;}
 const arr=load(file),matches=arr.filter(r=>r.makeSlug===p.make&&r.slug===x.slug);
 if(matches.length!==1){log('skipped',file,p.make,x,matches.length?'ambiguous identity':'record already absent');continue;}
 const record=matches[0];if(x.qid&&record.qid!==x.qid){log('skipped',file,p.make,x,'before-value QID mismatch');continue;}
 const existing=exclusions.find(e=>e.file===x.file&&e.makeSlug===p.make&&e.slug===x.slug);
 if(!existing)exclusions.push({file:x.file,makeSlug:p.make,slug:x.slug,qid:record.qid??null,reason:x.reason,sources:sourcesOf(x),before:structuredClone(record)});
 save(file,arr.filter(r=>r!==record));log('applied',file,p.make,x,'removed with durable identity exclusion and before snapshot');
}
const slug=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const additions=load(fileOf('model-line-additions')),lines=load(fileOf('model-lines-auto'));
function addLine(make,x,origin){
 const file=fileOf('model-line-additions'),excluded=reasonExcluded(x);
 if(make==='sono-motors')return log('excluded',file,make,x,'Sion never entered series production');
 if(excluded)return log('excluded',file,make,x,excluded);
 const id=x.lineSlug??x.slug??slug(x.name??'');
 if(!id||!x.name||!makes.some(m=>m.slug===make))return log('excluded',file,make,x,'missing make/name/slug');
 if([...lines,...additions].some(l=>l.makeSlug===make&&l.slug===id))return log('skipped',file,make,x,'line already present');
 if(exclusions.some(e=>e.makeSlug===make&&e.slug===id)||/concept|prototype|pre.series|předseri|not.*production/i.test(x.note??''))return log('excluded',file,make,x,'excluded/non-series identity requires decision');
 if(![x.from,x.to].every(v=>v===null||v===undefined||Number.isInteger(v)))return log('excluded',file,make,x,'invalid series dates');
 const from=x.from??null,to=x.to??null,status=x.productionStatus??(to!==null?'ended':'unknown');
 const line={slug:id,name:x.name,makeSlug:make,aliases:x.aliases??[],bodyTypes:x.bodyTypes??null,from,to,productionStatus:status,dateScope:'source-production',productionPeriods:from!==null?[{from,to}]:null,generations:x.generations??null,wikidataQid:null,sources:sourcesOf(x),needsReview:status==='unknown'?[{field:'to',reason:'Null end does not assert current series production.'}]:[],additionReason:origin};
 additions.push(line);log('applied',file,make,x,'sourced addition');
}
// Card identities first: retain the researched lineSlug rather than inventing a second slug from its label.
const newMakes=['renault','seat','saab','rolls-royce','rover','smart','ssangyong-kgm','simca','saturn','roewe','scion','rivian','spyker','rimac','salmson','saic-motor','santana-motor','seres','sono-motors'];
for(const make of newMakes)for(const card of load(`src/data/model-cards/${make}.json`)){
 if([...lines,...additions].some(l=>l.makeSlug===make&&l.slug===card.lineSlug))continue;
 const gs=card.generations??[],froms=gs.map(g=>g.from).filter(Number.isInteger),tos=gs.map(g=>g.to).filter(Number.isInteger);
 const status=gs.some(g=>g.productionStatus==='current')?'current':gs.length&&gs.every(g=>g.productionStatus==='ended')?'ended':'unknown';
 const p=proposals.find(p=>p.make===make),proposal=(p?.missingModels??[]).find(x=>(x.lineSlug??x.slug)===card.lineSlug||x.name===card.name);
 const proposalRejection=proposal&&reasonExcluded(proposal);
 // "Already present in models-auto" rejects a missing RAW model proposal. It
 // does not supply the separate model-line identity needed by this sourced card.
 if(proposalRejection&&!/already in models-auto|not missing/i.test(proposal.verify??'')){log('excluded',fileOf('model-line-additions'),make,proposal,proposalRejection);continue;}
 // A discontinued preproduction programme is retained as a card, never admitted as a series-production line.
 if(make==='sono-motors'){log('excluded',fileOf('model-line-additions'),make,{lineSlug:card.lineSlug},'Sion never entered series production; card retained for review');continue;}
 addLine(make,{...(!proposalRejection?proposal??{}:{}),lineSlug:card.lineSlug,name:card.name,from:froms.length?Math.min(...froms):null,to:status==='ended'&&tos.length?Math.max(...tos):null,productionStatus:status,bodyTypes:[...new Set(gs.flatMap(g=>g.bodyTypes??[]))],generations:gs.map(g=>({code:g.code??null,from:g.from??null,to:g.to??null,productionStatus:g.productionStatus,bodyTypes:g.bodyTypes??null,sources:g.sources??[]})),sources:[...new Set([...(card.sources??[]),...gs.flatMap(g=>g.sources??[])])]},'Sweep: sourced card identity');
}
for(const p of proposals)for(const x of p.missingModels??[]){
 const cardPath=`src/data/model-cards/${p.make}.json`;
 const cards=fs.existsSync(cardPath)?load(cardPath):[];
 const card=cards.find(c=>c.name.toLowerCase()===String(x.name).toLowerCase());
 addLine(p.make,card?{...x,lineSlug:card.lineSlug}:x,'Sweep: reviewed missing-model proposal');
}
// Existing types already cover these values at runtime; canonicalize the legacy trim spelling.
for(const dir of ['src/data/catalog/model-cards','src/data/model-cards'])for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.json'))){const file=dir+'/'+f;for(const c of load(file))for(const g of c.generations??[])for(const t of g.trims??[])if(t.kind==='version'){t.kind='technical-version';log('applied',file,c.makeSlug,{lineSlug:c.lineSlug,trim:t.name},'kind version normalized to technical-version');}}
const changed=[];for(const [file,data]of cache){const s=JSON.stringify(data,null,2)+'\n';if(original.get(file)!==s&&JSON.stringify(original.get(file)===null?null:JSON.parse(original.get(file)))!==JSON.stringify(data)){fs.writeFileSync(file,s);changed.push(file);}}
const report={proposalFiles:proposals.length,counts:events.reduce((a,e)=>(a[e.status]=(a[e.status]??0)+1,a),{}),byFile:{},changedFiles:changed,events};
for(const e of events){const counts=report.byFile[e.file]??={applied:0,skipped:0,excluded:0};counts[e.status]++;}
const hash=createHash('sha256').update(JSON.stringify(report)).digest('hex').slice(0,12);
const reportFile=root+`apply-log-${hash}.json`;if(!fs.existsSync(reportFile))fs.writeFileSync(reportFile,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({reportFile,proposalFiles:proposals.length,counts:report.counts,changedFiles:changed},null,2));
