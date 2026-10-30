import fs from 'node:fs';
import assert from 'node:assert/strict';
const cards=JSON.parse(fs.readFileSync('src/data/catalog/model-cards/arcfox.json','utf8'));
const seen=new Set(), bodies=new Set(['hatchback','kombi','sedan','suv','mpv','kupe','kabriolet','pickup','dodavka']);
let gens=0,trims=0;
for(const c of cards){
 assert.equal(c.makeSlug,'arcfox');assert(!seen.has(c.lineSlug));seen.add(c.lineSlug);assert.equal(c.isAddition,true);assert(c.sources.length);assert(c.summaryCs.split(/[.!?](?:\s|$)/).filter(Boolean).length>=2);
 for(const g of c.generations){gens++;assert(g.from===null||g.to===null||g.from<=g.to);assert(g.bodyTypes===null||g.bodyTypes.every(b=>bodies.has(b)));assert(g.to!==null||g.productionStatus==='unknown');assert.equal(g.photo,null);
  for(const t of g.trims??[]){trims++;assert.equal(t.kind,'technical-version');assert(t.bodyType===null||bodies.has(t.bodyType));assert(t.sources.length);for(const[f,urls]of Object.entries(t.fieldSources??{})){assert(f.split('.').reduce((v,k)=>v?.[k],t)!=null,'orphan provenance '+f);assert(urls.length);}}
 }
 function walk(v,p){if(v===null)assert(c.needsReview.some(r=>r.field===p),'unreviewed null '+c.lineSlug+':'+p);else if(Array.isArray(v))v.forEach((x,i)=>walk(x,p+'['+i+']'));else if(typeof v==='object')for(const[k,x]of Object.entries(v))walk(x,p?p+'.'+k:k);}
 walk({segment:c.segment,summaryCs:c.summaryCs,generations:c.generations},'');
}
const p='analysis/codex/night-arcfox-report.json',r=JSON.parse(fs.readFileSync(p,'utf8'));assert.equal(r.counts.cards,cards.length);assert.equal(r.counts.generationOrFamilyRecords,gens);assert.equal(r.counts.technicalVersions,trims);assert.equal(r.proposedLines.length,cards.length);for(const l of r.proposedLines){assert(seen.has(l.slug));assert.equal(l.makeSlug,'arcfox');}
r.validation=`PASS: ${cards.length} unique cards, ${gens} generation/family records, ${trims} technical versions; all ${r.proposedLines.length} proposed lines match. Body enums, chronology, source paths, unknown-null review paths checked. Photos remain null; no current-production inference from null end years.`;
fs.writeFileSync(p,JSON.stringify(r,null,2)+'\n');console.log(r.validation);
