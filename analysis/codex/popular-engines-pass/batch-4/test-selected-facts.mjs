import fs from 'node:fs';import assert from 'node:assert/strict';import{evidenceProblem}from '../../engine-throughput-policy.mjs';
const root='analysis/codex/popular-engines-pass/batch-4',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),cards=read('src/data/model-cards-index.json'),get=(id,i=0)=>{const[m,l]=id.split('/');return cards[m][l].generations[i];},powers=(id,i=0)=>[...new Set(get(id,i).engines.map(e=>e.powerKwMin).filter(x=>x!=null))].sort((a,b)=>a-b);
// Explicit system/traction output must survive competing component/charging figures.
assert.deepEqual(powers('honda/cr-z'),[91,101]);assert(!powers('honda/cr-z').includes(94));
assert.deepEqual(powers('honda/insight',1),[72]);assert.deepEqual(powers('bmw/i8'),[266,275]);
assert.deepEqual(powers('mazda/6e'),[180,190]);assert(get('mazda/6e').engines.every(e=>e.fuel==='electric'&&e.displacementCc===null&&e.sources[0].includes('mazda-press.com')));
assert.deepEqual(powers('mg/mg5-ev'),[115,130]);assert.deepEqual(powers('byd/seagull'),[65,115]);assert(get('byd/seagull').engines.every(e=>e.variant.includes('Surf')));
assert.deepEqual(powers('bmw/i7'),[335,400,485,500]);assert(get('bmw/i7').engines.every(e=>e.fuel==='electric'&&e.displacementCc===null));
assert.deepEqual(get('citroen/c15').engines.map(e=>e.displacementCc).sort((a,b)=>a-b),[1124,1769,1868]);assert.equal(get('citroen/c15').engines.find(e=>e.displacementCc===1868).powerKwMin,null);
assert.deepEqual(powers('peugeot/ion'),[49]);assert(get('peugeot/ion').engines.every(e=>e.sources[0].includes('peugeot-ion-ficha-tecnica.pdf')));
assert.deepEqual(powers('citroen/c-zero'),[49]);assert(get('citroen/c-zero').engines.every(e=>e.sources[0].includes('/citroen/')));
assert.deepEqual(powers('baic/x7'),[130]);assert.equal(get('baic/x7').engines[0].displacementCc,1498);assert.deepEqual(powers('baic/x55'),[138]);
assert.deepEqual(powers('aixam/400'),[4]);assert.equal(get('aixam/400').engines[0].displacementCc,400);
let proofRows=0,mutationsRejected=0,specRows=0,dateRows=0;
for(const r of read(root+'/engine-changes.json').changes){const g=get(r.id,r.index);for(const e of g.engines){if(e.sourceScope?.generationEvidence?.method!=='reviewed-technical-version')continue;proofRows++;assert.equal(evidenceProblem(g,r.index,e),null);for(const change of[
 x=>{x.powerKwMin=(x.powerKwMin??0)+1;x.powerKwMax=x.powerKwMin;},
 x=>{x.displacementCc=(x.displacementCc??0)+1;},
 x=>{x.sources=['https://example.invalid/not-the-reviewed-source'];},
 x=>{x.sourceScope.technicalVersionProof.engine.fuel='unverified';}
]){const bad=structuredClone(e);change(bad);assert(evidenceProblem(g,r.index,bad));mutationsRejected++;}}}
for(const[make,lines]of Object.entries(cards))for(const[line,c]of Object.entries(lines))for(const[i,g]of c.generations.entries())for(const e of g.engines??[]){
 if(e.sourceScope?.generationEvidence?.method==='specification-page'){assert.equal(evidenceProblem(g,i,e),null,make+'/'+line+'/'+i+'/'+e.variant);specRows++;}
 const years=[...String(e.sourceScope?.variantYears??'').matchAll(/\b(?:19|20)\d{2}\b/g)].map(m=>+m[0]);if(years.length){assert(Math.max(...years)>=g.from&&Math.min(...years)<=(g.to??2026),make+'/'+line+'/'+i);dateRows++;}
}
const result={result:'PASS',systemAndTractionFactsChecked:true,noVisaEnginesInC15:true,ownIonAndCZeroSources:true,baicModelsNotConfused:true,reviewedProofRows:proofRows,mutationRejections:mutationsRejected,allPublishedSpecificationRows:specRows,rawSourceYearRows:dateRows,nonoverlappingDates:0};fs.writeFileSync(root+'/fact-validation.json',JSON.stringify(result,null,2)+'\n');console.log(result);
