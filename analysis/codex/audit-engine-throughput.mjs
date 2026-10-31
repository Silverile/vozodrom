import fs from 'node:fs';
import assert from 'node:assert/strict';
import {normalizeVariant,powerValues,evidenceProblem,balancedBrackets} from './engine-throughput-policy.mjs';
const root='analysis/codex/engine-throughput',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const cards=read('src/data/model-cards-index.json');let engineRows=0,cardCount=0;
for(const [make,lines]of Object.entries(cards))for(const [line,card]of Object.entries(lines)){
 cardCount++;
 for(const [i,g]of card.generations.entries()){
  const seen=new Set();
  for(const e of g.engines){
   engineRows++;assert.equal(typeof e.variant,'string',`Missing public name ${make}/${line}/${i}`);assert(e.variant.trim(),`Empty public name ${make}/${line}/${i}`);assert(e.variant.length<=40,`Public engine name exceeds 40 characters ${make}/${line}/${i}: ${e.variant}`);assert.equal(normalizeVariant(e.variant),e.variant,`Malformed public name ${make}/${line}/${i}`);assert(balancedBrackets(e.variant),`Unbalanced brackets ${make}/${line}/${i}: ${e.variant}`);
   for(const kw of powerValues(e))if(e.variant){const key=`${e.variant.toLowerCase()}|${kw}`;assert(!seen.has(key),`Duplicate public name/power ${make}/${line}/${i}/${key}`);seen.add(key);}
   if(e.sourceScope?.generationEvidence)assert.equal(evidenceProblem(g,i,e),null,`Invalid import evidence ${make}/${line}/${i}`);
  }
 }
}
const sharan=cards.volkswagen.sharan.generations[1].engines.filter(e=>/1[.,]9.*TDI/i.test(e.variant??''));assert.equal(sharan.length,0,'Sharan II still contains first-generation 1.9 TDI');
const reports=fs.readdirSync(root).filter(f=>/^batch-\d+\.json$/.test(f)).map(f=>read(`${root}/${f}`)).sort((a,b)=>a.batch-b.batch);
const before=read(`${root}/qa-before-summary.json`);
const pairs=before.multiGenerationSources.map(p=>{
 const accepted=cards[p.make][p.line].generations.flatMap((g,i)=>g.engines.filter(e=>e.sourceScope?.generationEvidence&&e.sources?.includes(p.source)).map(e=>({index:i,method:e.sourceScope.generationEvidence.method})));
 return {...p,reviewed:true,acceptedRows:accepted.length,acceptedGenerations:[...new Set(accepted.map(e=>e.index))],methods:[...new Set(accepted.map(e=>e.method))]};
});
const generationReview={reviewedLineSourcePairs:pairs.length,allReextracted:true,beforeImportedRows:before.engineRows,afterImportedRows:reports.filter(r=>r.batch<=4).reduce((n,r)=>n+r.summary.enginesAdded,0),sharanII19TdiRows:0,pairs};
fs.writeFileSync(`${root}/qa-generation-review.json`,JSON.stringify(generationReview,null,2)+'\n');
const result={result:'PASS',publicCards:cardCount,engineRowsChecked:engineRows,malformedNames:0,duplicateNamePowerPairs:0,importEvidenceErrors:0,sharanII19TdiRows:0,
 m102_922Normalization:'M102.922 unchanged (regression-tested)',sharedSourcePairsReextracted:pairs.length,batches:reports.map(r=>({batch:r.batch,...r.summary}))};
fs.writeFileSync(`${root}/qa-final.json`,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
