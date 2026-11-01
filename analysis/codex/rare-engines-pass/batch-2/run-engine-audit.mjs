import fs from 'node:fs';
const original=fs.writeFileSync,root='analysis/codex/rare-engines-pass/batch-2',outputs=new Map([['analysis/codex/engine-throughput/qa-generation-review.json',root+'/qa-generation-review.json'],['analysis/codex/engine-throughput/qa-final.json',root+'/qa-final.json']]);
fs.writeFileSync=(path,...args)=>{if(!outputs.has(String(path)))throw Error('Unexpected audit output '+path);return original(outputs.get(String(path)),...args);};
try{await import('../../audit-engine-throughput.mjs');}finally{fs.writeFileSync=original;}
