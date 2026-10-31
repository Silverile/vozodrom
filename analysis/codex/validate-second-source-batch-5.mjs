import fs from 'node:fs';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {isDeepStrictEqual as equal} from 'node:util';
const root='analysis/codex/second-source-engines',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex'),fileHash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const batch=read(root+'/batch-5.json'),baseline=batch.baselineRevision,old=p=>JSON.parse(cp.execFileSync('git',['show',baseline+':'+p],{maxBuffer:80e6})),migration=read(root+'/bmw-series/migration.json'),migrated=new Map(migration.lines.map(r=>[r.id,r])),touched=new Set(batch.results.filter(r=>r.enginesAdded).map(r=>r.make+'/'+r.line)),byGen=new Map(batch.results.map(r=>[`${r.make}/${r.line}/${r.index}`,r]));
assert.equal(read(root+'/validation-5.json').result,'PASS');let unchanged=0,checked=0,rows=0;
for(const dir of ['src/data/catalog/model-cards','src/data/model-cards']){
 const names=fs.readdirSync(dir).filter(f=>f.endsWith('.json')).sort(),priorNames=cp.execFileSync('git',['ls-tree','--name-only',baseline+':'+dir],{encoding:'utf8'}).trim().split(/\r?\n/).filter(f=>f.endsWith('.json')).sort();assert.deepEqual(names,priorNames);
 for(const f of names){const p=dir+'/'+f,before=old(p),after=read(p);assert.equal(after.length,before.length);for(let j=0;j<before.length;j++){
  const a=after[j],b=before[j],id=b.makeSlug+'/'+b.lineSlug;checked++;assert.equal(a.makeSlug+'/'+a.lineSlug,id);
  if(migrated.has(id)){const r=migrated.get(id);assert.equal(hash(b),r.beforeHash);assert.equal(hash(a),r.afterHash);const defs=read(root+'/bmw-series/research.json').generations.filter(d=>d.line===b.lineSlug);assert.deepEqual(a.generations.map(g=>[g.code,g.from,g.to]),defs.map(d=>[d.code,d.from,d.to]));continue;}
  if(!touched.has(id)){assert(equal(a,b),`Untouched source card changed ${id}`);unchanged++;continue;}
  const restored=structuredClone(a);restored.sources=b.sources;assert.equal(a.generations.length,b.generations.length);
  for(let i=0;i<b.generations.length;i++){const r=byGen.get(`${id}/${i}`);if(!r?.enginesAdded){assert(equal(a.generations[i],b.generations[i]));continue;}assert.equal(hash(b.generations[i]),r.beforeHash);assert.equal(hash(a.generations[i]),r.afterHash);rows+=r.enginesAdded;for(const k of ['engines','engineCoverage','sources'])if(Object.hasOwn(b.generations[i],k))restored.generations[i][k]=b.generations[i][k];else delete restored.generations[i][k];}
  assert(equal(restored,b),`Non-engine card facts changed ${id}`);
 }}
}
assert.equal(rows,batch.summary.enginesAdded);const cards=read('src/data/model-cards-index.json'),priorCards=old('src/data/model-cards-index.json');for(const [make,ls]of Object.entries(priorCards))for(const [line,b]of Object.entries(ls)){const id=make+'/'+line;if(!touched.has(id)&&!migrated.has(id))assert(equal(cards[make][line],b),`Untouched public card ${id}`);}
const indexHash=fileHash('src/data/model-cards-index.json');cp.execFileSync('node',['scripts/model-cards-index.mjs']);assert.equal(fileHash('src/data/model-cards-index.json'),indexHash);
const priorLines=old('src/data/model-lines-index.json'),lines=read('src/data/model-lines-index.json');for(const make of Object.keys(priorLines))for(const l of priorLines[make]){const id=make+'/'+l.slug,current=lines[make].find(x=>x.slug===l.slug);if(!migrated.has(id))assert.deepEqual(current,l);else assert.deepEqual(current.generations,cards[make][l.slug].generations.map(g=>({code:g.code,from:g.from,to:g.to})));}
const auto=read('src/data/catalog/model-lines-auto.json'),priorAuto=old('src/data/catalog/model-lines-auto.json');assert.equal(auto.length,priorAuto.length);for(let i=0;i<auto.length;i++)if(!migrated.has(auto[i].makeSlug+'/'+auto[i].slug))assert.deepEqual(auto[i],priorAuto[i]);
const oldDraw=old('src/data/front-drawings.json');for(const id of migrated.keys())delete oldDraw[id.replace('/','--')];assert.deepEqual(read('src/data/front-drawings.json'),oldDraw);assert.deepEqual(read('src/data/front-drawing-review.json'),old('src/data/front-drawing-review.json'));assert.equal(cp.execFileSync('git',['diff','--name-only',baseline,'--','public/front'],{encoding:'utf8'}).trim(),'');
for(const [id,entries]of Object.entries(oldDraw)){const k=id.indexOf('--'),make=id.slice(0,k),line=id.slice(k+2);for(const [i]of entries){assert(fs.existsSync(`public/front/${id}--${i}.webp`));if(cards[make]?.[line])assert(cards[make][line].generations[i]);}}
let statsChecked=false;if(!process.argv.includes('--cards-only')){
 const stats=read(root+'/bmw-series/statistics.json'),inputs=read(root+'/bmw-series/rebuild-inputs.json');assert.equal(stats.status,'complete');for(const [p,sha]of Object.entries(inputs.sha256))assert.equal(fileHash(p),sha);for(const [p,sha]of Object.entries(stats.outputSha256))assert.equal(fileHash(p),sha);
 for(const p of ['src/data/stats/index.json','src/data/listing-stats.json']){const a=read(p),b=old(p);assert.deepEqual(a.meta,b.meta);for(const make of Object.keys(b.makes))if(make!=='bmw')assert.deepEqual(a.makes[make],b.makes[make]);}
 assert(cp.execFileSync('git',['diff','--name-only',baseline,'--','src/data/stats'],{encoding:'utf8'}).trim().split(/\r?\n/).every(p=>['src/data/stats/bmw.json','src/data/stats/index.json'].includes(p)));statsChecked=true;
}
const result={result:'PASS',baseline,sourceCardsChecked:checked,untouchedSourceAndPublicCards:unchanged,batchEngineRows:rows,bmwLinesMigrated:migrated.size,bmwGenerationsAdded:migration.generationsAdded,faceliftsAdded:migration.faceliftsAdded,statisticsChecked:statsChecked};if(statsChecked)fs.writeFileSync(root+'/validation-final-5.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
