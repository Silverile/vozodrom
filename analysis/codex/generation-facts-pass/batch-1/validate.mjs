import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {stripTypeScriptTypes} from 'node:module';
const root='analysis/codex/generation-facts-pass/batch-1',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),base=JSON.parse(zlib.gunzipSync(fs.readFileSync(root+'/baseline.json.gz'))),selection=read(root+'/selection.json'),facts=read(root+'/body-facts.json'),queue=read('analysis/codex/generation-facts-pass/queue.json'),remaining=read(root+'/remaining-queue.json'),changes=read(root+'/changes.json');
const key=r=>(r.id??r.make+'/'+r.line)+'/'+r.index,targets=new Set(selection.map(key)),rowsFor=k=>facts.filter(r=>key(r)===k),bodies=new Set(['hatchback','sedan','liftback','kombi','suv','mpv','dodavka','kupe','kabriolet','pickup']);
assert.deepEqual(selection,queue.bodyQueue.slice(0,80));assert.deepEqual(remaining.nextBodyTypes,queue.bodyQueue.slice(80));assert.deepEqual(remaining.nextBodyTypes,read(root+'/untouched-queue.json'));assert.equal(remaining.deferred.length,0);assert.equal(remaining.scalarFactsStarted,false);
assert.equal(targets.size,80);assert.equal(facts.length,134);assert(facts.every(r=>targets.has(key(r))));
let sourceCards=0,changedGenerations=0;
const sourceIndex={};
function sameSources(old,now,rows,label){assert.deepEqual([...new Set(now)].sort(),[...new Set([...(old??[]),...rows.map(r=>r.source)])].sort(),label);}
function compareCard(old,now,id,publicIndex=false){
 const touched=old.generations.map((_,i)=>i).filter(i=>targets.has(id+'/'+i));
 if(!touched.length){assert.deepEqual(now,old,id);return;}
 assert.equal(now.generations.length,old.generations.length);
 const allRows=touched.flatMap(i=>rowsFor(id+'/'+i));sameSources(old.sources,now.sources,allRows,id+' sources');
 if(!publicIndex)assert.deepEqual(now.needsReview,(old.needsReview??[]).filter(r=>!touched.some(i=>r.field===`generations[${i}].bodyTypes`)),id+' review notes');
 const a=structuredClone(old),b=structuredClone(now);for(const c of[a,b]){delete c.sources;delete c.needsReview;}
 for(const i of touched){const before=a.generations[i],after=b.generations[i],rows=rowsFor(id+'/'+i),expected=rows.map(r=>r.value).sort();
  assert(!(before.bodyTypes?.length),id+'/'+i+' was already populated');assert(rows.length>0);assert.equal(new Set(after.bodyTypes).size,after.bodyTypes.length);assert.deepEqual([...after.bodyTypes].sort(),expected);assert(after.bodyTypes.every(v=>bodies.has(v)));
  sameSources(before.sources,after.sources,rows,id+'/'+i+' sources');
  for(const r of rows){assert.equal(r.field,'bodyTypes');assert(r.source.startsWith('https://'));assert(r.method&&r.anchor&&r.note);if(r.technicalVersionProof){const proof=r.technicalVersionProof,t=before.trims.find(t=>t.name===proof.name&&t.bodyType===r.value&&t.sources.includes(proof.source));assert(t,'Missing original technical version '+id+'/'+i);assert.equal(crypto.createHash('sha256').update(JSON.stringify(t)).digest('hex'),proof.sha256);}}
  if(!publicIndex){assert.equal(after.bodyTypeCoverage,'documented-variants-only');assert.equal(after.bodyTypeEvidence.length,rows.length);assert.deepEqual(after.bodyTypeEvidence.map(e=>e.bodyType),after.bodyTypes);for(const e of after.bodyTypeEvidence){const r=rows.find(r=>r.value===e.bodyType);assert.deepEqual(e.sources,[r.source]);assert.equal(e.method,r.method);assert.equal(e.anchor,r.anchor);assert.equal(e.noteCs,r.note);assert.deepEqual(e.technicalVersionProof,r.technicalVersionProof);}changedGenerations++;}
  for(const g of[before,after])for(const f of['bodyTypes','sources','bodyTypeCoverage','bodyTypeEvidence'])delete g[f];
 }
 assert.deepEqual(b,a,'Unrelated facts changed '+id);
}
for(const[p,old]of Object.entries(base)){const now=read(p);if(/^src\/data\/(?:catalog\/)?model-cards\//.test(p)){assert.equal(now.length,old.length);for(let i=0;i<old.length;i++){const id=old[i].makeSlug+'/'+old[i].lineSlug;compareCard(old[i],now[i],id);sourceIndex[id]=now[i];sourceCards++;}}else if(p==='src/data/model-cards-index.json'){assert.deepEqual(Object.keys(now),Object.keys(old));for(const[make,lines]of Object.entries(old)){assert.deepEqual(Object.keys(now[make]),Object.keys(lines));for(const[line,c]of Object.entries(lines))compareCard(c,now[make][line],make+'/'+line,true);}}else assert.deepEqual(now,old,p+' must remain unchanged');}
assert.equal(sourceCards,4753);assert.equal(changedGenerations,80);assert.equal(changes.generations,80);assert.equal(changes.bodyFacts,134);assert.equal(changes.sourceFiles.length,7);assert.deepEqual(changes.completed,remaining.completed);assert.deepEqual(new Set(changes.completed.map(key)),targets);
const index=read('src/data/model-cards-index.json');let engineRows=0;for(const lines of Object.values(index))for(const c of Object.values(lines))for(const g of c.generations)engineRows+=g.engines.length;assert.equal(engineRows,12686);
// Exercise the actual form's taxonomy and generation matching, without changing UI code.
const listingCode=stripTypeScriptTypes(fs.readFileSync('src/lib/listing-catalog.ts','utf8'));
const listing=await import('data:text/javascript;base64,'+Buffer.from(listingCode).toString('base64'));
for(const r of selection){const c=index[r.make][r.line],api=c.generations.filter(g=>g.code||g.name).map(g=>({...g,code:g.code??g.name,bodies:g.bodyTypes})),raw=c.generations[r.index],g=api.find(g=>g.name===raw.name&&g.from===raw.from&&g.to===raw.to);assert(g,key(r)+' API record');assert.equal(listing.cardGeneration(g,api),g,key(r));assert.deepEqual(g.bodies,raw.bodyTypes);for(const body of g.bodies){assert(listing.BODY_KEYS[body]);assert(['hatchback','sedan','kombi','suv','mpv'].includes(listing.pictogramBody(body)));}}
const body=(m,l,i)=>index[m][l].generations[i].bodyTypes;
assert.deepEqual(body('audi','100',1),['hatchback','sedan']);assert(!body('audi','100',1).includes('kombi'));
assert.deepEqual(body('mercedes-benz','cla',0),['sedan','kombi']);assert.deepEqual(body('mercedes-benz','cla',1),['sedan','kombi']);
assert.deepEqual(body('fiat','500',2),['hatchback','kabriolet']);assert.deepEqual(body('fiat','126',0),['hatchback','sedan']);
assert.deepEqual(body('fiat','doblo',2),['mpv','dodavka']);assert.deepEqual(body('mitsubishi','lancer',4),['hatchback','sedan']);
assert.deepEqual(body('mazda','323',2),['hatchback','sedan']);assert.deepEqual(body('mazda','323',5),['hatchback','sedan']);
assert.deepEqual(body('skoda','1203',0),['dodavka','mpv']);assert.deepEqual(body('fiat','125',0),['sedan']);
const byMake=[...new Set(selection.map(r=>r.make))].map(make=>({make,generations:selection.filter(r=>r.make===make).length,bodyFacts:facts.filter(r=>r.id.startsWith(make+'/')).length}));
const result={result:'PASS',baselineFiles:Object.keys(base).length,sourceCards,generationsFilled:changedGenerations,bodyFacts:facts.length,linesFilled:new Set(facts.map(r=>r.id)).size,sourceFiles:changes.sourceFiles.length,nextBodyTypes:remaining.nextBodyTypes.length,nextBodyTypesHigh:remaining.nextBodyTypes.filter(r=>r.lineFleet>=1000).length,nextBodyTypesLow:remaining.nextBodyTypes.filter(r=>r.lineFleet<1000).length,engineRowsUnchanged:engineRows,allOtherFactsStatsAliasesDrawingsUnchanged:true,listingConsumerChecks:'PASS',byMake};
fs.writeFileSync(root+'/validation.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
