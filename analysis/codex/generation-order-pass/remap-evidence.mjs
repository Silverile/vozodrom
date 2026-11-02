import fs from 'node:fs';import assert from 'node:assert/strict';
const root='analysis/codex/generation-order-pass',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),changes=read(root+'/changes.json'),files=new Map();
let references=0,changedReferences=0;
for(const r of changes.mappings){if(!files.has(r.file))files.set(r.file,read(r.file));const card=files.get(r.file).find(c=>c.makeSlug===r.make&&c.lineSlug===r.line);
 const scan=(o,oldIndex,newIndex)=>{if(!o||typeof o!=='object')return;for(const[k,v]of Object.entries(o)){if(/^(genIndex|generationIndex|generation_index|generationIdx|gen_index)$/.test(k)&&Number.isInteger(v)){assert.equal(v,oldIndex,'Expected unmigrated engine evidence in '+r.make+'/'+r.line);o[k]=newIndex;references++;if(v!==newIndex)changedReferences++;}else scan(v,oldIndex,newIndex);}};
 card.generations.forEach((g,newIndex)=>scan(g,r.newToOld[newIndex],newIndex));
}
for(const[p,x]of files)fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
fs.writeFileSync(root+'/evidence-remap.json',JSON.stringify({references,changedReferences,scope:'Nested generationIndex values; numeric engine facts and source URLs unchanged'},null,2)+'\n');console.log(JSON.stringify({references,changedReferences}));
