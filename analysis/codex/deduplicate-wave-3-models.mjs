import fs from 'node:fs';import cp from 'node:child_process';import assert from 'node:assert/strict';import crypto from 'node:crypto';
const root='analysis/codex/wave-3-missing-cards-3',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
const baseline=read(root+'/report.json').baselineRevision,old=p=>JSON.parse(cp.execFileSync('git',['show',baseline+':'+p],{maxBuffer:80e6}));
const pairs={
 'maruti-suzuki/alto-alto-800-alto-k10':'maruti-suzuki/alto','maruti-suzuki/swift-dzire-dzire':'maruti-suzuki/dzire','maruti-suzuki/vitara-brezza-brezza':'maruti-suzuki/brezza','maruti-suzuki/esteem':'maruti-suzuki/1000-esteem','maruti-suzuki/kizashi-import':'maruti-suzuki/kizashi','maruti-suzuki/zen-estilo-estilo':'maruti-suzuki/estilo',
 'omoda/omoda-5-c5-vc-e5-5-ev':'omoda/5','omoda/omoda-7-c7':'omoda/7',
 'studebaker/champ-pickup':'studebaker/champ','studebaker/2r-3r-truck':'studebaker/r-series-truck','venturi/coupe-transcup-200-210-260':'venturi/coupe',
 'uaz/hunter-315195':'uaz/hunter','uaz/pickup-23632':'uaz/pickup','uaz/profi-2360':'uaz/profi','uaz/uaz-69-gaz-69-built-in-ulyanovsk':'uaz/uaz-69',
 'vinfast/limo-green-vf-mpv-7':'vinfast/limo-green','vinfast/minio-green-vf-2':'vinfast/minio-green',
 'wuling-motors/wuling-binguo-plus':'wuling-motors/binguo-plus','wuling-motors/wuling-starlight-560-eksion':'wuling-motors/starlight-560','wuling-motors/wuling-hongguang-s1-confero':'wuling-motors/hongguang-s1','wuling-motors/wuling-almaz':'wuling-motors/almaz','wuling-motors/wuling-cloud-ev':'wuling-motors/cloud-ev','wuling-motors/wuling-cortez':'wuling-motors/cortez','wuling-motors/wuling-sunshine-zhiguang':'wuling-motors/sunshine',
 'tata-motors/tata-yodha-alias-of-xenon':'tata-motors/xenon','tata-motors/tata-spacio':'tata-motors/sumo',
};
const sources=new Map(),locations=new Map();for(const dir of ['src/data/catalog/model-cards','src/data/model-cards'])for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.json'))){const p=dir+'/'+f,rows=read(p);sources.set(p,rows);for(const c of rows)locations.set(c.makeSlug+'/'+c.lineSlug,{p,c});}
const union=(a,b)=>[...new Map([...(a??[]),...(b??[])].map(v=>[JSON.stringify(v),v])).values()],changes=[],modified=new Set(),proofMoves=[];
const drawings=read('src/data/front-drawings.json'),holds=read('src/data/front-drawing-review.json');
for(const id of [...Object.keys(pairs),'microcar/m-go','maruti-suzuki/1000-esteem'])assert(!drawings[id.replace('/','--')]&&!Object.keys(holds).some(k=>k.startsWith(id.replace('/','--')+'--')),'Manual drawing attribution required for '+id);
const gid=g=>g.code??`${g.from??'?'}–${g.to??'?'}`;
const values=e=>[...new Set((e.availablePowerKw?.length?e.availablePowerKw:[e.powerKwMin,e.powerKwMax]).filter(Number.isFinite))];
const covered=(a,b)=>a.variant?.toLowerCase()===b.variant?.toLowerCase()&&values(b).every(n=>values(a).includes(n))||a.fuel===b.fuel&&values(b).length&&values(b).every(n=>values(a).includes(n))&&(a.fuel==='electric'||a.displacementCc&&a.displacementCc===b.displacementCc||a.displacementLitresNominal&&a.displacementLitresNominal===b.displacementLitresNominal);
for(const [from,to]of Object.entries(pairs)){
 const a=locations.get(from),b=locations.get(to);assert(a&&b,from+' -> '+to);const source=structuredClone(a.c),before=structuredClone(b.c),[make,line]=from.split('/');const sf='src/data/stats/'+make+'.json';assert(!fs.existsSync(sf)||!read(sf)[line],'Duplicate has published statistics: '+from);
 let map=Object.fromEntries(source.generations.map((g,i)=>[i,i]));if(from==='wuling-motors/wuling-cortez')map={0:1};else assert.equal(source.generations.length,b.c.generations.length,from+' structure needs explicit mapping');
 if(from==='maruti-suzuki/esteem'){
  const g=b.c.generations[0];assert(!g.engines?.length&&!g.trims?.length&&!g.photo,'1000 family has scoped facts requiring attribution');
  b.c.generations=[{...g,name:'1000',from:1990,to:2000,productionStatus:'ended',sources:union(g.sources,['https://en.wikipedia.org/wiki/Suzuki_Cultus'])},structuredClone(source.generations[0])];map={0:1};
 }
 for(const [i,g]of source.generations.entries()){
  const target=b.c.generations[map[i]];assert(target);
  for(const e of g.engines??[]){let existing=(target.engines??[]).find(x=>covered(x,e));if(!existing){target.engines=[...(target.engines??[]),structuredClone(e)];existing=target.engines.at(-1);}proofMoves.push({from,index:i,to,targetIndex:map[i],sourceEngine:e,targetEngine:existing});}
  target.sources=union(target.sources,g.sources);target.bodyTypes=union(target.bodyTypes,g.bodyTypes);
 }
 b.c.sources=union(b.c.sources,source.sources);
 if(from==='maruti-suzuki/swift-dzire-dzire'){b.c.generations[1].from=2011;b.c.generations[1].sources=union(b.c.generations[1].sources,['https://en.wikipedia.org/wiki/Suzuki_Dzire']);}
 if(from==='maruti-suzuki/kizashi-import'){const g=b.c.generations[0];g.from=2009;g.to=2015;g.productionStatus='ended';g.name='Kizashi';}
 if(from==='uaz/uaz-69-gaz-69-built-in-ulyanovsk'){const g=b.c.generations[0];g.from=1954;g.to=1973;g.productionStatus='ended';}
 if(from==='studebaker/2r-3r-truck'){b.c.generations[0].from=1948;}
 if(from==='tata-motors/tata-spacio'){const g=b.c.generations[0];g.facelift=union(g.facelift,[{year:2000,name:'Sumo Spacio',note:'Souběžná levnější varianta Spacio uvedená v roce 2000; nikoli nová podvozková generace.'}]).sort((x,y)=>x.year-y.year);}
 const beforeIds=before.generations.map(gid),afterIds=b.c.generations.map(gid);
 changes.push({from,to,oldToCanonicalGenerationIndex:map,canonicalBefore:before.generations.map(g=>({name:g.name,code:g.code??null,from:g.from??null,to:g.to??null})),canonicalAfter:b.c.generations.map(g=>({name:g.name,code:g.code??null,from:g.from??null,to:g.to??null})),canonicalGenerationIdChanges:beforeIds.flatMap((id,i)=>id===afterIds[i]?[]:[{index:i,from:id,to:afterIds[i]}]),note:from==='maruti-suzuki/esteem'?'Original undated combined 1000/Esteem entry split into concurrent named model streams. Old family ID needs year/engine disambiguation, not blind replacement.':from==='maruti-suzuki/zen-estilo-estilo'?'Kept canonical 2013 end from its source; duplicate source gives 2012, retained in archived research as an unresolved boundary discrepancy.':from==='wuling-motors/wuling-sunshine-zhiguang'?'Kept canonical continuing Classic period; duplicate used main-model sales end 2013. Concurrent production source remains on canonical card.':'Canonical identity retained; duplicate facts merged without shortening scope to a regional badge period.'});
 modified.add(a.p);modified.add(b.p);sources.set(a.p,sources.get(a.p).filter(c=>c!==a.c));locations.delete(from);
}
for(const p of modified)write(p,sources.get(p));
const removed=new Set(Object.keys(pairs));
for(const file of ['src/data/catalog/model-lines-auto.json','src/data/catalog/model-line-additions.json']){
 const rows=read(file).filter(l=>!removed.has(l.makeSlug+'/'+l.slug));for(const l of rows){const id=l.makeSlug+'/'+l.slug;if(!changes.some(c=>c.to===id))continue;const c=locations.get(id).c,gs=c.generations;l.generations=gs.map(g=>({code:g.code??null,from:g.from??null,to:g.to??null,productionStatus:g.productionStatus,bodyTypes:g.bodyTypes??[],sources:g.sources??[]}));l.from=Math.min(...gs.map(g=>g.from).filter(Number.isFinite));l.to=gs.some(g=>g.to==null)?null:Math.max(...gs.map(g=>g.to));l.productionStatus=gs.some(g=>g.productionStatus==='current')?'current':gs.every(g=>g.productionStatus==='ended')?'ended':'unknown';l.bodyTypes=[...new Set(gs.flatMap(g=>g.bodyTypes??[]))];}write(file,rows);
}
cp.execFileSync('node',['scripts/model-cards-index.mjs'],{stdio:'inherit'});cp.execFileSync('node',['scripts/model-lines-index.mjs'],{stdio:'inherit'});
write(root+'/deduplication.json',{baselineRevision:baseline,retiredPreviouslyCreatedCards:Object.keys(pairs).length,pairs,changes,engineProofMoves:proofMoves,statisticsStatus:'pending',requiredRebuildMakes:['maruti-suzuki','uaz'],sourcePolicy:'Only explicit same-name/rebadged counterparts are merged; separately identified new badge families remain separate. No existing canonical engine or trim is removed. No drawings or holds exist for the retired aliases or generation splits.'});
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const makes=['maruti-suzuki','uaz'];write(root+'/rebuild-inputs.json',{baselineRevision:baseline,makes,sha256:Object.fromEntries(['scripts/stats/match.py','scripts/stats/istp-stats.py','scripts/stats/rsv-stats.py','scripts/stats/build-stats.py','src/data/model-cards-index.json','src/data/model-lines-index.json','src/data/catalog/model-lines-auto.json'].map(p=>[p,hash(p)]))});
console.log(JSON.stringify({retiredDuplicateCards:removed.size,canonicalCards:changes.length,rebuildMakes:makes}));
