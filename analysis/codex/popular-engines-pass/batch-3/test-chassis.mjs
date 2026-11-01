import fs from 'node:fs';import assert from 'node:assert/strict';import{evidenceProblem}from '../../engine-throughput-policy.mjs';
const root='analysis/codex/popular-engines-pass/batch-3',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),index=read('src/data/model-cards-index.json');
const bad=read(root+'/spec-candidates.json').find(r=>r.make==='nissan'&&r.line==='bluebird'&&r.index===8).engines[0],g=index.nissan.bluebird.generations[8];assert.equal(g.code,'U12');assert(bad.sourceScope.generationEvidence.anchor.includes('T12'));assert.equal(evidenceProblem(g,8,bad),'Specification chassis contradicts catalogue generation');
const repair=read(root+'/gle-repair.json'),gle=index['mercedes-benz'].gle.generations[5];assert.equal(evidenceProblem(gle,5,repair.removed[0]),'Specification chassis contradicts catalogue generation');assert.equal(evidenceProblem(gle,5,gle.engines[0]),null);assert.equal(gle.engines[0].fuel,'petrol-mhev');assert.equal(gle.engines[0].powerKwMin,null);
let checked=0,rawDateChecked=0;
for(const[make,lines]of Object.entries(index))for(const[line,c]of Object.entries(lines))for(const[i,g]of c.generations.entries())for(const e of g.engines??[]){
 const scope=e.sourceScope??{},ev=scope.generationEvidence;
 if(ev?.method==='specification-page'){assert.equal(evidenceProblem(g,i,e),null,make+'/'+line+'/'+i+'/'+e.variant);checked++;}
 const years=[...String(scope.variantYears??'').matchAll(/\b(?:19|20)\d{2}\b/g)].map(m=>+m[0]);if(years.length){assert(Math.max(...years)>=g.from&&Math.min(...years)<=(g.to??2026),make+'/'+line+'/'+i);rawDateChecked++;}
}
const sprinter=index['mercedes-benz'].sprinter.generations[2],alias=sprinter.engines.find(e=>e.sourceScope?.generationEvidence?.anchor.includes('VS30'));assert(alias);assert.equal(evidenceProblem(sprinter,2,alias),null);
const result={result:'PASS',wrongChassisRejected:2,glePowerNotSummed:true,allPublicSpecificationEvidenceChecked:checked,rawSourceYearRowsChecked:rawDateChecked,rawDateNonoverlaps:0,sprinterAliasRetained:true};fs.writeFileSync(root+'/chassis-validation.json',JSON.stringify(result,null,2)+'\n');console.log(result);
