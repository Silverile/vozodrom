import fs from 'node:fs';
import cp from 'node:child_process';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {isDeepStrictEqual as equal} from 'node:util';
import {compactEngineRows} from './short-engine-labels.mjs';
const root='analysis/codex/second-source-engines',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex'),fileHash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const batch=read(root+'/batch-2.json'),baseline=batch.baselineRevision,old=p=>JSON.parse(cp.execFileSync('git',['show',`${baseline}:${p}`],{maxBuffer:80e6})),labels=read(root+'/labels-40.json'),migration=read(root+'/bmw-x/migration.json');
assert.equal(read(root+'/validation-2.json').result,'PASS','Engine phase did not pass before cleanup');
const byGen=new Map(batch.results.filter(r=>r.enginesAdded).map(r=>[`${r.make}/${r.line}/${r.index}`,r]));let exact=0,engineRows=0,checked=0;
const compare=(a,b,id)=>{
 const x=structuredClone(a),y=structuredClone(b);
 for(let i=0;i<y.generations.length;i++)for(let j=0;j<(y.generations[i].engines??[]).length;j++){
  const e=y.generations[i].engines[j],f=x.generations[i].engines[j];assert(f,`Missing engine ${id}/${i}/${j}`);if(e.noteCs)assert(f.noteCs?.includes(e.noteCs),`Lost annotation ${id}/${i}/${j}`);delete e.noteCs;delete f.noteCs;
 }
 assert(equal(x,y),`Unexpected source-card mutation ${id}`);
};
for(const dir of ['src/data/catalog/model-cards','src/data/model-cards']){
 const names=fs.readdirSync(dir).filter(f=>f.endsWith('.json')).sort(),oldNames=cp.execFileSync('git',['ls-tree','--name-only',`${baseline}:${dir}`],{encoding:'utf8'}).trim().split(/\r?\n/).filter(f=>f.endsWith('.json')).sort();assert.deepEqual(names,oldNames);
 for(const f of names){const p=dir+'/'+f,before=old(p),after=read(p);assert.equal(after.length,before.length);
  for(let j=0;j<before.length;j++){
   const b=before[j],a=after[j],id=`${b.makeSlug}/${b.lineSlug}`;assert.equal(`${a.makeSlug}/${a.lineSlug}`,id);checked++;
   const expected=structuredClone(b);for(const g of expected.generations)g.engines=compactEngineRows(g.engines);
   if(b.makeSlug==='bmw'&&['x5','x3'].includes(b.lineSlug)){
    const r=migration.lines.find(r=>r.id===id);assert.equal(hash(expected),r.beforeHash);assert.equal(hash(a),r.afterHash);
    const defs=read(root+'/bmw-x/research.json').generations.filter(g=>g.line===b.lineSlug);assert.deepEqual(a.generations.map(g=>[g.code,g.from,g.to]),defs.map(g=>[g.code,g.from,g.to]));continue;
   }
   for(let i=0;i<expected.generations.length;i++){
    const r=byGen.get(`${id}/${i}`);if(!r)continue;assert.equal(hash(b.generations[i]),r.beforeHash);assert.equal(a.generations[i].engines.length,r.enginesAdded);
    const g=expected.generations[i];g.engines=a.generations[i].engines;g.engineCoverage='representative-documented-versions';const union=[...new Set([...(g.sources??[]),...g.engines.flatMap(e=>e.sources??[])])];assert.deepEqual([...a.generations[i].sources].sort(),[...union].sort());g.sources=a.generations[i].sources;engineRows+=g.engines.length;
   }
   const cardUnion=[...new Set([...(b.sources??[]),...batch.results.filter(r=>r.enginesAdded&&`${r.make}/${r.line}`===id).flatMap(r=>a.generations[r.index].engines.flatMap(e=>e.sources??[]))])];assert.deepEqual([...new Set(a.sources??[])].sort(),cardUnion.sort());expected.sources=a.sources;
   compare(a,expected,id);assert.equal(hash(a),labels.expectedSourceCardHashes[`${p}#${id}`]);if(equal(a,b))exact++;
  }
 }
}
assert.equal(engineRows,batch.summary.enginesAdded);
const indexHash=fileHash('src/data/model-cards-index.json');cp.execFileSync('node',['scripts/model-cards-index.mjs']);assert.equal(fileHash('src/data/model-cards-index.json'),indexHash,'Generated card index was stale');
const beforeLines=old('src/data/model-lines-index.json'),lines=read('src/data/model-lines-index.json'),cards=read('src/data/model-cards-index.json');for(const make of Object.keys(beforeLines)){
 if(make!=='bmw'){assert.deepEqual(lines[make],beforeLines[make]);continue;}
 for(const l of beforeLines.bmw)if(!['x5','x3'].includes(l.slug))assert.deepEqual(lines.bmw.find(x=>x.slug===l.slug),l);
 for(const slug of ['x5','x3'])assert.deepEqual(lines.bmw.find(l=>l.slug===slug).generations,cards.bmw[slug].generations.map(g=>({code:g.code,from:g.from,to:g.to})));
}
const beforeAuto=old('src/data/catalog/model-lines-auto.json'),auto=read('src/data/catalog/model-lines-auto.json');assert.equal(auto.length,beforeAuto.length);for(let i=0;i<auto.length;i++)if(auto[i].makeSlug!=='bmw'||!['x5','x3'].includes(auto[i].slug))assert.deepEqual(auto[i],beforeAuto[i]);
const oldDraw=old('src/data/front-drawings.json'),draw=read('src/data/front-drawings.json');delete oldDraw['bmw--x5'];delete oldDraw['bmw--x3'];assert.deepEqual(draw,oldDraw);assert.deepEqual(read('src/data/front-drawing-review.json'),old('src/data/front-drawing-review.json'));assert.equal(cp.execFileSync('git',['diff','--name-only',baseline,'--','public/front'],{encoding:'utf8'}).trim(),'');
for(const [id,entries]of Object.entries(draw)){const split=id.indexOf('--'),make=id.slice(0,split),line=id.slice(split+2);for(const [i]of entries){assert(fs.existsSync(`public/front/${id}--${i}.webp`));if(cards[make]?.[line])assert(cards[make][line].generations[i]);}}
let statsChecked=false;
if(!process.argv.includes('--cards-only')){
 const stats=read(root+'/bmw-x/statistics.json'),inputs=read(root+'/bmw-x/rebuild-inputs.json');assert.equal(stats.status,'complete');for(const [p,sha]of Object.entries(stats.outputSha256))assert.equal(fileHash(p),sha);for(const [p,sha]of Object.entries(inputs.sha256))assert.equal(fileHash(p),sha,`Statistics input changed: ${p}`);
 const statIndex=read('src/data/stats/index.json'),oldStatIndex=old('src/data/stats/index.json'),listing=read('src/data/listing-stats.json'),oldListing=old('src/data/listing-stats.json');
 for(const make of Object.keys(oldStatIndex.makes))if(make!=='bmw')assert.deepEqual(statIndex.makes[make],oldStatIndex.makes[make]);for(const make of Object.keys(oldListing.makes))if(make!=='bmw')assert.deepEqual(listing.makes[make],oldListing.makes[make]);
 const statsDiff=cp.execFileSync('git',['diff','--name-only',baseline,'--','src/data/stats'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);assert(statsDiff.every(p=>['src/data/stats/bmw.json','src/data/stats/index.json'].includes(p)));statsChecked=true;
}
const result={result:'PASS',baseline,sourceCardsChecked:checked,sourceCardsExactlyUnchanged:exact,batch2EngineRows:engineRows,labelCap:40,bmwGenerationsAdded:7,faceliftsAdded:6,otherModelStructuresAndAssetsUnchanged:true,statisticsChecked:statsChecked};if(statsChecked)fs.writeFileSync(root+'/validation-final-2.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
