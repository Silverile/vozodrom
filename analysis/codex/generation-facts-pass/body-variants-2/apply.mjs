import fs from 'node:fs';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const root='analysis/codex/generation-facts-pass/body-variants-2';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const base=JSON.parse(zlib.gunzipSync(fs.readFileSync(root+'/baseline.json.gz'))),rows=read(root+'/variants.json');
export const fields=['dimensionsMm.length','dimensionsMm.width','dimensionsMm.height','dimensionsMm.wheelbase','trunkL'];
export const get=(g,f)=>f.split('.').reduce((o,k)=>o?.[k],g);
export const union=(a,b)=>[...new Set([...(a??[]),...b].filter(Boolean))];
export function publicVariant(v){
 const sources=union(v.source?[v.source]:[],Object.values(v.fieldSources??{}));
 return {bodyType:v.bodyType,label:v.label,dimensionsMm:v.dimensionsMm,trunkL:v.trunkL,noteCs:v.noteCs,...(sources.length?{sources}:{} )};
}
export function evidenceFor(variants){
 return variants.flatMap((v,variantIndex)=>fields.filter(f=>get(v,f)!=null).map(field=>({variantIndex,field,value:get(v,field),sources:[v.fieldSources?.[field]??v.source],anchor:v.fieldAnchors?.[field]??v.anchor,method:'Reviewed original manufacturer brochure/manual/press release; named body/layout reference',scope:v.label})));
}
export function transformGeneration(old,row){
 const g=structuredClone(old);
 assert(!g.bodyVariants?.length,'Already migrated; refuse an unreviewed replacement');
 g.dimensionsMm=null;g.trunkL=null;
 g.bodyVariants=row.variants.map(publicVariant);
 g.sources=union(g.sources,g.bodyVariants.flatMap(v=>v.sources??[]));
 g.bodyVariantEvidence=evidenceFor(row.variants);
 g.bodyVariantMigration={previousDimensionsMm:old.dimensionsMm??null,previousTrunkL:old.trunkL??null,reasonCs:'Rozměry a kufr jsou nyní vedeny u výslovně určených karoserií a provedení. Původní nespecifikované hodnoty se uchovávají zde pro audit; nejsou automaticky přeneseny do jiné verze.',previousGenerationFactCoverage:old.generationFactCoverage??null};
 g.bodyVariantCoverage={scope:'documented-reference-variants-only',notExhaustive:true,variants:row.variants.map((v,variantIndex)=>({variantIndex,label:v.label,unconfirmed:fields.filter(f=>get(v,f)==null).map(field=>({field,reason:v.nullReasons?.[field]??'Not confirmed for this named reference; no inference from another body.'}))}))};
 if(g.generationFactCoverage)g.generationFactCoverage={...g.generationFactCoverage,...Object.fromEntries(Object.keys(g.generationFactCoverage).filter(f=>fields.includes(f)).map(f=>[f,'moved-to-body-variant-references']))};
 return g;
}
if(process.argv[1]?.replaceAll('\\','/').endsWith('/apply.mjs')){
 const sourceFiles=Object.keys(base).filter(p=>/^src\/data\/(?:catalog\/)?model-cards\//.test(p));
 const originals=Object.fromEntries(sourceFiles.map(p=>[p,read(p)]));
 // Guard against stale baselines and preserve any concurrent/unrelated edits.
 const approved=fs.existsSync(root+'/approved-file-hashes.json')?read(root+'/approved-file-hashes.json'):{};
 const checked=new Set();
 for(const row of rows){const candidates=sourceFiles.filter(p=>originals[p].some(c=>c.makeSlug===row.make&&c.lineSlug===row.line));assert.equal(candidates.length,1);const p=candidates[0];if(checked.has(p))continue;checked.add(p);if(JSON.stringify(originals[p])!==JSON.stringify(base[p]))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),approved[p],'Changed file must match last successful validation: '+p);}
 // Rebuild only the reviewed cards from the snapshot; the guard above excludes concurrent writes.
 for(const row of rows){const p=sourceFiles.find(p=>originals[p].some(c=>c.makeSlug===row.make&&c.lineSlug===row.line)),i=originals[p].findIndex(c=>c.makeSlug===row.make&&c.lineSlug===row.line);originals[p][i]=structuredClone(base[p][i]);}
 const changed=new Set(),migrations=[];
 for(const row of rows){const p=sourceFiles.find(p=>originals[p].some(c=>c.makeSlug===row.make&&c.lineSlug===row.line)),card=originals[p].find(c=>c.makeSlug===row.make&&c.lineSlug===row.line),old=card.generations[row.index];assert(old);const g=transformGeneration(old,row);card.generations[row.index]=g;card.sources=union(card.sources,g.bodyVariants.flatMap(v=>v.sources??[]));changed.add(p);migrations.push({make:row.make,line:row.line,index:row.index,generation:old.name,previousDimensionsMm:old.dimensionsMm??null,previousTrunkL:old.trunkL??null,oldScalarDisposition:fields.filter(f=>get(old,f)!=null).map(field=>({field,value:get(old,field),sameValueInDocumentedVariant:g.bodyVariants.some(v=>get(v,field)===get(old,field)),disposition:g.bodyVariants.some(v=>get(v,field)===get(old,field))?'represented-by-reviewed-variant':'archived-unscoped-reference-not-copied'}))});}
 for(const p of changed)write(p,originals[p]);
 write(root+'/migrations.json',migrations);
 write(root+'/changes.json',{generationsChanged:rows.length,variants:rows.reduce((n,r)=>n+r.variants.length,0),figures:rows.reduce((n,r)=>n+evidenceFor(r.variants).length,0),sourceFiles:[...changed].sort(),statsRebuilt:false,structureUnchanged:true});
 console.log(fs.readFileSync(root+'/changes.json','utf8'));
}
