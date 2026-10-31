// Integration regression: resuming research after applying a batch must not
// forget its successful engine candidates or change any published data.
// Run on the active, unmodified batch before handoff, never over later edits.
import fs from 'node:fs';import cp from 'node:child_process';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const root=process.argv.find(a=>a.startsWith('--root='))?.slice(7);assert(root);
const paths=['src/data/model-cards-index.json','src/data/model-lines-index.json','src/data/catalog/model-line-additions.json','src/data/catalog/model-lines-auto.json'];
for(const dir of ['src/data/catalog/model-cards','src/data/model-cards'])for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.json')))paths.push(dir+'/'+f);
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),before=new Map(paths.map(p=>[p,hash(p)]));
cp.execFileSync('C:\\Program Files\\FreeCAD 1.0\\bin\\python.exe',['-B','analysis/codex/research-missing-card-engines.py','--root='+root],{stdio:'pipe'});
cp.execFileSync('node',['analysis/codex/materialize-missing-cards.mjs','--root='+root,'--with-engines'],{stdio:'pipe'});
for(const [p,digest]of before)assert.equal(hash(p),digest,'Resume changed published data: '+p);
const candidates=JSON.parse(fs.readFileSync(root+'/engine-candidates.json','utf8')),evidence=JSON.parse(fs.readFileSync(root+'/engine-evidence.json','utf8'));
assert(candidates.complete);for(const proof of evidence.rows){const [make,line]=proof.id.split('/'),g=candidates.generations.find(g=>g.make===make&&g.line===line&&g.generationIndex===proof.index);assert(g?.engines.some(e=>e.variant===proof.engine.variant&&e.powerKwMin===proof.engine.powerKwMin),'Candidate lost on resume: '+proof.id);}
console.log(JSON.stringify({result:'PASS',publicFilesUnchanged:paths.length,successfulEngineProofsPreserved:evidence.rows.length,scope:'Active batch research/materialization replay'}));
