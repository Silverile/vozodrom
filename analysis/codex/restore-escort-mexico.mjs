import fs from 'node:fs';
import cp from 'node:child_process';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {compactEngineRows} from './short-engine-labels.mjs';
const root='analysis/codex/second-source-engines',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n'),hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex'),fileHash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const labels=read(root+'/labels-40.json'),entry=labels.changes.find(c=>c.id==='ford/escort');assert(entry,'Mexico badge correction already applied');
const inputs=read(root+'/bmw-x/rebuild-inputs.json'),indexPath='src/data/model-cards-index.json';assert.equal(fileHash(indexPath),inputs.sha256[indexPath]);
const projection=()=>Object.entries(read(indexPath)).flatMap(([make,lines])=>Object.entries(lines).map(([line,c])=>({make,line,name:c.name,generations:c.generations.map(g=>({code:g.code,name:g.name,from:g.from,to:g.to,dateBasis:g.dateBasis}))})));
const matcherBefore=hash(projection()),oldHash=fileHash(indexPath),baseline=JSON.parse(cp.execFileSync('git',['show',`${inputs.baselineRevision}:${entry.sourceFile}`],{maxBuffer:30e6})),data=read(entry.sourceFile),before=baseline.find(c=>c.makeSlug==='ford'&&c.lineSlug==='escort'),card=data.find(c=>c.makeSlug==='ford'&&c.lineSlug==='escort');
for(let i=0;i<before.generations.length;i++)if((before.generations[i].engines??[]).some(e=>e.variant==='1.6 Mexico')){
 const expected=compactEngineRows(before.generations[i].engines);assert.deepEqual(expected.filter(e=>e.variant!=='1.6 Mexico'),card.generations[i].engines);card.generations[i].engines=expected;
}
write(entry.sourceFile,data);labels.expectedSourceCardHashes[`${entry.sourceFile}#ford/escort`]=hash(card);labels.changes=labels.changes.filter(c=>c.id!=='ford/escort');labels.counts.explicitForeignRowsDropped--;labels.counts.rowsAfter++;labels.marketException={variant:'1.6 Mexico',id:'ford/escort',reason:'Mexico is the European performance badge, not a country restriction.',source:'https://en.wikipedia.org/wiki/Ford_Escort_(Europe)'};write(root+'/labels-40.json',labels);
cp.execFileSync('node',['scripts/model-cards-index.mjs'],{stdio:'inherit'});assert.equal(hash(projection()),matcherBefore,'Matching data changed during engine label correction');
inputs.sha256[indexPath]=fileHash(indexPath);inputs.engineOnlyRefresh={file:indexPath,beforeSha256:oldHash,afterSha256:inputs.sha256[indexPath],matcherProjectionSha256:matcherBefore,matcherProjectionUnchanged:true,reason:'Restored the European Escort Mexico badge; engine arrays do not participate in Matcher names/generation/date construction.'};write(root+'/bmw-x/rebuild-inputs.json',inputs);console.log(JSON.stringify({result:'PASS',foreignRowsDropped:labels.counts.explicitForeignRowsDropped,matcherProjectionUnchanged:true}));
