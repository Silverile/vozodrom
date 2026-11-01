import fs from 'node:fs';import cp from 'node:child_process';import assert from 'node:assert/strict';
import {normalizeEngineRows,enginePresentation,evidenceProblem,rejectEngine}from '../../engine-throughput-policy.mjs';
const root='analysis/codex/rare-engines-pass/batch-1',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n'),selection=read(root+'/selection.json'),targets=new Set(selection.map(r=>r.make+'/'+r.line+'/'+r.index));
const previous=process.argv.includes('--supplement')?read(root+'/engine-changes.json'):null;assert(previous||!fs.existsSync(root+'/engine-changes.json'),'Already applied');const curated=read(root+'/curated-engines.json'),manual=new Set(curated.map(r=>r.id+'/'+r.index)),input=[...curated],held=[],skippedAlreadyCurated=[];
for(const r of read(root+'/trim-candidates.json').rows){
 if(manual.has(r.id+'/'+r.index))continue;
 const engine=structuredClone(r.engine);
 if(r.id==='dongfeng/box')engine.variant='Box EV';
 if(r.id==='leapmotor/t03')engine.variant='T03';
 if(r.id==='dongfeng/mage')engine.variant='1.5T';
 if(r.id==='dongfeng/shine')engine.variant='1.5';
 if(r.id==='microcar/m-go')engine.variant=engine.variant.includes('Yanmar')?'Yanmar 2TNE68':engine.variant.includes('Progress')?'Progress ACT':'DCI Revolution';
 if(r.id==='pontiac/fiero')engine.variant='2.8 V6';
 input.push({...r,engine});
}
for(const r of read(root+'/spec-candidates.json'))for(const engine of r.engines??[]){
 const id=r.make+'/'+r.line,key=id+'/'+r.index;
 if(id==='infiniti/g'&&r.index===2){held.push({id,index:r.index,engine,reason:'US V35 specification; European-market applicability not established.'});continue;}
 if(manual.has(key)){skippedAlreadyCurated.push({id,index:r.index,variant:engine.variant});continue;}
 if(/^\d+$/.test(engine.variant)){held.push({id,index:r.index,engine,reason:'Numeric column placeholder is not an engine name.'});continue;}
 if(id==='citroen/visa'){
  if(/1000 Pistes|Cabriolet/i.test(engine.variant)){held.push({id,index:r.index,engine,reason:'Separate body/homologation version excluded from representative hatchback engine range.'});continue;}
  engine.variant=engine.variant.replace(/^Visa\s+/,'');
 }
 input.push({id,index:r.index,engine});
}
const files=new Map(),buckets=new Map();
for(const r of input){if(previous?.changes.some(c=>c.id===r.id&&c.index===r.index))continue;const key=r.id+'/'+r.index;assert(targets.has(key),'Outside selected group '+key);const[m,l]=r.id.split('/');let path;
 for(const dir of ['src/data/catalog/model-cards','src/data/model-cards']){const candidate=dir+'/'+m+'.json';if(fs.existsSync(candidate)&&read(candidate).some(c=>c.lineSlug===l))path=candidate;}
 assert(path,key);if(!files.has(path))files.set(path,read(path));const c=files.get(path).find(c=>c.lineSlug===l),g=c.generations[r.index];assert(!(g.engines?.length),'Target no longer empty '+key);
 const e=enginePresentation(r.engine);if(!e){held.push({...r,reason:'No usable engine label'});continue;}
 if(r.id==='honda/civic'&&/i-CDTi/.test(e.variant))e.variant=e.variant.replace('i-CDTi','i-CTDi');
 const reason=e.variant.length>40?'Name exceeds 40 characters':evidenceProblem(g,r.index,e)??rejectEngine(m,l,e);
 if(reason){held.push({...r,reason});continue;}assert(e.sources?.length===1,key);buckets.set(key,[...(buckets.get(key)??[]),e]);
}
const changes=[];
for(const[key,rows]of buckets){const[make,line,indexString]=key.split('/'),index=+indexString,path=[...files.keys()].find(p=>files.get(p).some(c=>c.makeSlug===make&&c.lineSlug===line)),c=files.get(path).find(c=>c.lineSlug===line),g=c.generations[index];
 const score=e=>Number(e.displacementCc!=null)*2+Number(e.powerKwMin!=null);rows.sort((a,b)=>score(b)-score(a));g.engines=normalizeEngineRows(rows);g.engineCoverage='representative-documented-versions';g.sources=[...new Set([...g.sources,...g.engines.flatMap(e=>e.sources)])];c.sources=[...new Set([...c.sources,...g.engines.flatMap(e=>e.sources)])];
 c.needsReview=(c.needsReview??[]).filter(x=>x.field!==`generations[${index}].engines`);for(const[j,e]of g.engines.entries())for(const field of['displacementCc','displacementLitresNominal','powerKwMin','powerKwMax'])if(e[field]===null&&!(e.fuel==='electric'&&field.startsWith('displacement')))c.needsReview.push({field:`generations[${index}].engines[${j}].${field}`,reason:'Tato hodnota nebyla pro konkrétní provedení ověřena; bez přepočtu a bez přenášení z jiné generace.'});
 changes.push({id:make+'/'+line,index,engines:g.engines});
}
for(const[path,cards]of files)if(changes.some(r=>cards.some(c=>c.makeSlug+'/'+c.lineSlug===r.id)))write(path,cards);
const combined=[...(previous?.changes??[]),...changes];write(root+'/engine-changes.json',{generations:combined.length,rows:combined.reduce((n,r)=>n+r.engines.length,0),changes:combined,held,skippedAlreadyCurated});cp.execFileSync('node',['scripts/model-cards-index.mjs'],{stdio:'inherit'});console.log({generations:changes.length,rows:changes.reduce((n,r)=>n+r.engines.length,0),held:held.length});
