// Explicit, sourced migrations projected onto the immutable engine-sweep baseline.
// This keeps untouched-card checks strict across generation-index migrations.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const file='analysis/codex/engine-throughput/catalogue-overlays.json';
export const overlayManifest=()=>fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):null;
export const fileHash=p=>fs.existsSync(p)?crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'):null;
export function projectCatalogueBaseline(path,data){
 const manifest=overlayManifest();if(!manifest)return data;
 const generated=path==='src/data/model-cards-index.json';
 if(!generated&&!/^src\/data\/(?:catalog\/)?model-cards\//.test(path))return data;
 for(const op of manifest.operations){
  const c=generated?data[op.make]?.[op.line]:data.find(c=>c.makeSlug===op.make&&c.lineSlug===op.line);
  if(!c||(!generated&&path!==op.sourceFile))continue;
  if(op.insertGeneration&&c.generations[0]?.code!==op.insertGeneration.code){
   c.generations.unshift(structuredClone(generated?op.publicGeneration:op.insertGeneration));
   if(c.needsReview)c.needsReview=c.needsReview.map(r=>({...r,field:r.field.replace(/generations\[(\d+)\]/g,(_,i)=>`generations[${Number(i)+1}]`)}));
  }
  for(const addition of op.engineAdditions??[]){
   const g=c.generations[addition.generation];assert.equal(g.code,addition.code);
   const current=g.engines??[];
   const rows=addition.rows.filter(e=>!current.some(x=>x.variant===e.variant&&x.powerKwMin===e.powerKwMin));
   g.engines=[...current,...structuredClone(rows)];
   if(!generated)g.engineCoverage='representative-documented-versions';
   g.sources=[...new Set([...(g.sources??[]),...addition.rows.flatMap(e=>e.sources)])];
   c.sources=[...new Set([...(c.sources??[]),...addition.rows.flatMap(e=>e.sources)])];
   if(c.needsReview)c.needsReview=c.needsReview.filter(r=>r.field!==`generations[${addition.generation}].engines`);
  }
 }
 return data;
}
export function validateOverlayFiles(){
 const m=overlayManifest();if(!m)return [];
 for(const [path,hash]of Object.entries(m.protectedAfterHashes))assert.equal(fileHash(path),hash,`Migration-coupled file changed: ${path}`);
 return Object.keys(m.protectedAfterHashes);
}
