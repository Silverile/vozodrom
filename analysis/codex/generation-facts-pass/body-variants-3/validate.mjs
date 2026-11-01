import fs from 'node:fs';import zlib from 'node:zlib';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {stripTypeScriptTypes} from 'node:module';
import {fields,get,union,publicVariant,evidenceFor,transformGeneration} from './apply.mjs';
const root='analysis/codex/generation-facts-pass/body-variants-3',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n'),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const base=JSON.parse(zlib.gunzipSync(fs.readFileSync(root+'/baseline.json.gz'))),rows=read(root+'/variants.json'),queue=read(root+'/selection.json'),changed=read(root+'/changes.json'),index=read('src/data/model-cards-index.json');
const key=r=>r.make+'/'+r.line+'/'+r.index,keys=new Set(rows.map(key)),bodyKeys=new Set(['hatchback','liftback','sedan','kombi','suv','mpv','dodavka','pickup','kupe','kabriolet']);
assert.equal(keys.size,rows.length);assert.equal(queue.length,33);assert.equal(queue.reduce((n,r)=>n+r.targetFields.length,0),123);
assert.deepEqual(rows.map(key),queue.slice(0,rows.length).map(key),'Fleet order must use the frozen multi-body/wheelbase queue');
let evidenceCount=0,variantCount=0,cards=0,generations=0,engines=0;
for(const r of rows){const before=base['src/data/model-cards-index.json'][r.make][r.line].generations[r.index];assert(before);assert.equal(new Set(r.variants.map(v=>v.bodyType+'|'+v.label)).size,r.variants.length);assert.deepEqual([...new Set(r.variants.map(v=>v.bodyType))].sort(),[...new Set(before.bodyTypes)].sort(),'Every existing body needs a documented variant or explicit null placeholder');for(const v of r.variants){assert(bodyKeys.has(v.bodyType));assert(v.label&&v.noteCs&&v.anchor);for(const field of fields){const value=get(v,field);if(value==null){assert(v.nullReasons?.[field],'Null reason missing for '+key(r)+' '+v.label+' '+field);continue;}assert(Number.isFinite(value)&&value>0);assert(/^https:\/\//.test(v.fieldSources?.[field]??v.source));if(field==='dimensionsMm.width')assert(value<2300,'Width must exclude mirrors');}if(v.dimensionsMm)assert.deepEqual(Object.keys(v.dimensionsMm),['length','width','height','wheelbase']);variantCount++;}const evidence=evidenceFor(r.variants);for(const e of evidence)assert.equal(e.sources.length,1);evidenceCount+=evidence.length;}
const changedFiles=[];
for(const[p,old]of Object.entries(base)){
 const actual=read(p),expected=structuredClone(old);
 if(/^src\/data\/(?:catalog\/)?model-cards\//.test(p)){
  cards+=old.length;
  for(const card of expected)for(const r of rows.filter(r=>r.make===card.makeSlug&&r.line===card.lineSlug)){card.generations[r.index]=transformGeneration(card.generations[r.index],r);card.sources=union(card.sources,r.variants.flatMap(v=>publicVariant(v).sources??[]));generations++;}
 }else if(p==='src/data/model-cards-index.json'){
  for(const r of rows){const g=expected[r.make][r.line].generations[r.index];g.dimensionsMm=null;g.trunkL=null;g.bodyVariants=r.variants.map(publicVariant);g.sources=union(g.sources,g.bodyVariants.flatMap(v=>v.sources??[]));expected[r.make][r.line].sources=union(expected[r.make][r.line].sources,g.bodyVariants.flatMap(v=>v.sources??[]));}
 }
 assert.deepEqual(actual,expected,'Unexpected change to data/prose/structure/stats/drawings: '+p);
 if(JSON.stringify(actual)!==JSON.stringify(old))changedFiles.push(p);
}
assert.equal(generations,rows.length);assert.equal(cards,4753);assert.equal(variantCount,changed.variants);assert.equal(evidenceCount,changed.figures);assert.deepEqual(changedFiles.filter(p=>p!=='src/data/model-cards-index.json').sort(),changed.sourceFiles);
for(const makes of Object.values(index))for(const c of Object.values(makes))for(const g of c.generations)engines+=g.engines.length;
assert.equal(engines,Object.values(base['src/data/model-cards-index.json']).flatMap(Object.values).flatMap(c=>c.generations).reduce((n,g)=>n+g.engines.length,0));
// Exercise the actual newly committed consumer; imports are types-only, so native stripping suffices.
const consumerSource=fs.readFileSync('src/lib/modelCards.ts','utf8').replace('import cardIndex from "@/data/model-cards-index.json";','const cardIndex = {};');
assert(!consumerSource.includes('import cardIndex'),'Consumer test must replace exactly the known JSON alias import');
const mod=await import('data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(consumerSource)).toString('base64'));
for(const r of rows){const g=index[r.make][r.line].generations[r.index];assert.equal(g.dimensionsMm,null);assert.equal(g.trunkL,null);for(const body of [...new Set([...g.bodyTypes,'not-a-body'])]){const own=g.bodyVariants.filter(v=>v.bodyType===body),got=mod.sizeOf(g,body);if(own.length===1){assert.equal(got.variant,own[0]);assert.deepEqual(got.dimensionsMm,own[0].dimensionsMm);assert.equal(got.trunkL,own[0].trunkL);assert(mod.bodyVariantName(own[0]).includes(own[0].label));}else assert.deepEqual(got,{dimensionsMm:null,trunkL:null,variant:null},'Ambiguous/missing body must not receive another variant’s figures');}}
const rapid=index.skoda.rapid.generations[0];assert.equal(rapid.bodyVariants.filter(v=>v.bodyType==='hatchback').length,2);assert.deepEqual(mod.sizeOf(rapid,'hatchback'),{dimensionsMm:null,trunkL:null,variant:null});
const publicWithVariants=Object.values(index).flatMap(Object.values).flatMap(c=>c.generations).filter(g=>g.bodyVariants?.length);const beforeWithVariants=Object.values(base['src/data/model-cards-index.json']).flatMap(Object.values).flatMap(c=>c.generations).filter(g=>g.bodyVariants?.length).length;assert.equal(publicWithVariants.length,beforeWithVariants+rows.length,'Unreviewed legacy nested generations must not leak through the new whitelist');
let legacyOmitted=0;for(const[p,cards]of Object.entries(base))if(/^src\/data\/(?:catalog\/)?model-cards\//.test(p))for(const c of cards)for(const[i,g]of c.generations.entries())if(g.bodyVariants?.length&&g.bodyVariants.every(v=>!v.bodyType)){assert.equal(index[c.makeSlug][c.lineSlug].generations[i].bodyVariants,undefined);legacyOmitted++;}assert.equal(legacyOmitted,9);
const hashes=Object.fromEntries(changed.sourceFiles.map(p=>[p,hash(p)]));write(root+'/approved-file-hashes.json',hashes);
const result={result:'PASS',baselineFiles:Object.keys(base).length,sourceCards:cards,generationsChanged:generations,bodyVariants:variantCount,sourcedFigures:evidenceCount,oneSourcePerFigure:true,engineRowsUnchanged:engines,sourceFiles:changed.sourceFiles.length,indexPassThrough:'PASS',legacyNestedGenerationArraysOmitted:legacyOmitted,listingConsumer:'PASS: single, ambiguous and absent body variants',unchanged:'Every other field/prose/engine/trim/body/generation/date/market; all stats, aliases and drawings'};
write(root+'/validation.json',result);console.log(JSON.stringify(result,null,2));
