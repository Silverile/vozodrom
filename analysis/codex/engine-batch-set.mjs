import fs from 'node:fs';import assert from 'node:assert/strict';
export function loadEngineBatchSet(root,argv=process.argv){
 const selected=argv.find(a=>a.startsWith('--batches=')),single=argv.find(a=>a.startsWith('--batch='));
 const numbers=selected?selected.slice(10).split(',').map(Number):[Number(single?.slice(8)??6)];assert(numbers.length&&numbers.every(n=>Number.isInteger(n)&&n>0));assert.equal(new Set(numbers).size,numbers.length);
 const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),parts=numbers.map(n=>read(root+`/batch-${n}.json`)),baseline=parts[0].baselineRevision;assert(parts.every(p=>p.baselineRevision===baseline),'Batch set must share a baseline');
 const results=parts.flatMap(p=>p.results),keys=results.map(r=>r.make+'/'+r.line+'/'+r.index);assert.equal(new Set(keys).size,keys.length,'Generation repeated across batches');
 const summary={generationsVisited:results.length,generationsFilled:results.filter(r=>r.enginesAdded).length,enginesAdded:results.reduce((n,r)=>n+r.enginesAdded,0),linesTouched:new Set(results.filter(r=>r.enginesAdded).map(r=>r.make+'/'+r.line)).size,generationsAdded:0,generationsRemoved:0,faceliftsAdded:0,statsRebuildRequired:false};
 const label=numbers.join('-'),evidence=parts.flatMap(p=>read(p.evidenceFile).rows),batch={...parts[0],summary,results,batchNumbers:numbers,evidenceFiles:parts.map(p=>p.evidenceFile)};
 return {numbers,label,number:Math.max(...numbers),batch,evidence,parts};
}
