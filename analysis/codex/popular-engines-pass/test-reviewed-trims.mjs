import assert from 'node:assert/strict';
import fs from 'node:fs';
import {evidenceProblem} from '../engine-throughput-policy.mjs';
const index=JSON.parse(fs.readFileSync('src/data/model-cards-index.json','utf8'));
const rows=JSON.parse(fs.readFileSync('analysis/codex/popular-engines-pass/trim-candidates.json','utf8')).rows;
let accepted=0,held=[];
for(const r of rows){const[m,l]=r.id.split('/'),g=index[m][l].generations[r.index],e=r.engine,problem=evidenceProblem(g,r.index,e);if(problem){held.push({id:r.id,index:r.index,variant:e.variant,problem});continue;}accepted++;
 const changed=structuredClone(e);changed.displacementCc=(changed.displacementCc??0)+1;assert(evidenceProblem(g,r.index,changed));
 const power=structuredClone(e);power.powerKwMin=power.powerKwMax=(g.trims.find(t=>t.name===e.sourceScope.technicalVersionProof.name).engine.powerKw??0)+1;assert(evidenceProblem(g,r.index,power));
 const source=structuredClone(e);source.sources=['https://example.invalid'];assert(evidenceProblem(g,r.index,source));
 const noProof=structuredClone(e);delete noProof.sourceScope.technicalVersionProof;assert(evidenceProblem(g,r.index,noProof));
}
console.log(JSON.stringify({accepted,held,mutationRejections:accepted*4}));assert(accepted>100);
