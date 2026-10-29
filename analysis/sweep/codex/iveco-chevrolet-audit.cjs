const fs=require('fs'), cp=require('child_process'),assert=require('assert');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const equal=require('util').isDeepStrictEqual;
function access(o,path){const ps=path.replace(/\[(\d+)\]/g,'.$1').split('.');for(const p of ps.slice(0,-1))o=o[p];return [o,ps.at(-1)];}
function apply(cards,f){const c=cards.find(c=>c.lineSlug===f.lineSlug),[o,k]=access(c,f.path);assert(equal(o[k],f.from)||equal(o[k],f.to)||(!Object.hasOwn(o,k)&&f.from===null),`Cannot reconcile ${f.lineSlug}.${f.path}`);if(f.toPresent===false)delete o[k];else o[k]=structuredClone(f.to);}
function differences(a,b,path=''){if(equal(a,b))return [];if(a===undefined||b===undefined||a===null||b===null||Array.isArray(a)||Array.isArray(b)||typeof a!=='object'||typeof b!=='object')return [{path,from:a===undefined?null:a,to:b===undefined?null:b,...(a===undefined?{fromPresent:false}:{}),...(b===undefined?{toPresent:false}:{})}];return [...new Set([...Object.keys(a),...Object.keys(b)])].flatMap(k=>differences(a[k],b[k],path?path+'.'+k:k));}
for(const make of ['iveco','chevrolet']){
 const p=`src/data/catalog/model-cards/${make}.json`,rp=`analysis/sweep/codex/${make}.json`,cards=read(p),r=read(rp);
 // HEAD is only a reconstruction seed; replay ALL pre-existing report entries,
 // including the other worker's uncommitted Chevrolet changes, before comparing.
 const replay=JSON.parse(cp.execFileSync('git',['show',`HEAD:${p}`],{encoding:'utf8'}));
 for(const f of r.cardFixesApplied)apply(replay,f);
 const additions=[];
 for(const slug of make==='iveco'?['massif','emoovy']:['volt']){
  const c=cards.find(c=>c.lineSlug===slug),b=replay.find(c=>c.lineSlug===slug);
  for(const f of differences(b,c)){
   const sources=c.sources;
   const entry={lineSlug:slug,...f,sources,note:'Audit completion: exact before value reconstructed from HEAD plus all existing report entries; omitted source/note/review metadata mutation from depth helper.'};
   additions.push(entry);apply(replay,entry);
  }
 }
 r.cardFixesApplied.push(...additions);
 if(make==='iveco'){
  const c=cards.find(c=>c.lineSlug==='emoovy');
  if(c.generations[0].productionStatus!=='unknown'){
   const f={lineSlug:'emoovy',path:'generations[0].productionStatus',from:c.generations[0].productionStatus,to:'unknown',sources:['https://www.iveco.com/uk/eMoovy/eMoovy','https://www.klimafreundliche-nutzfahrzeuge.de/fahrzeugdatenbank/iveco-emoovy/'],note:'Reversal: live product marketing and serial availability establish market availability, not independently documented ongoing factory production in October 2026.'};
   apply(cards,f);apply(replay,f);r.cardFixesApplied.push(f);
  }
  const q='Audit follow-up: eMoovy productionStatus restored to unknown: live offer and serial availability do not prove ongoing factory production in October 2026. Exact metadata mutations fully logged by HEAD plus prior-report reconstruction; no fieldSources added.';
  if(!r.openQuestions.includes(q))r.openQuestions.push(q);
 }
 assert(equal(cards,replay),`${make}: report replay does not reproduce complete current card file`);
 write(p,cards);write(rp,r);
 console.log(JSON.stringify({make,auditEntriesAdded:additions.length,totalAppliedEntries:r.cardFixesApplied.length,fullFileReplay:'PASS'}));
}
