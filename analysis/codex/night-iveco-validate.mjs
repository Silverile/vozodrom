import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import os from 'node:os';
import {execFileSync} from 'node:child_process';
const cards=JSON.parse(fs.readFileSync('src/data/catalog/model-cards/iveco.json','utf8'));
const report=JSON.parse(fs.readFileSync('analysis/codex/night-iveco-report.json','utf8'));
assert.equal(new Set(cards.map(c=>c.lineSlug)).size,cards.length);
for(const c of cards){assert.equal(c.makeSlug,'iveco');assert.ok(c.sources.length);for(const g of c.generations){assert.ok(g.from===null||g.to===null||g.from<=g.to);if(g.photo){assert.equal(g.photo.visualReview,'reviewed');assert.ok(g.photo.author&&g.photo.licence&&g.photo.filePageUrl);}}function walk(v,p){if(v===null)assert.ok(c.needsReview.some(r=>r.field===p),'Missing review '+c.lineSlug+':'+p);else if(Array.isArray(v))v.forEach((x,i)=>walk(x,p+'['+i+']'));else if(typeof v==='object')for(const[k,x]of Object.entries(v))walk(x,p?p+'.'+k:k);}walk({segment:c.segment,summaryCs:c.summaryCs,generations:c.generations},'');}
const file=path.join(os.tmpdir(),'night-iveco-check-'+process.pid+'.ts');
const typePath=path.resolve('src/data/catalog/types').replaceAll('\\','/');
const text='import type {CatalogModelCard,CatalogModelLine} from '+JSON.stringify(typePath)+';const cards:CatalogModelCard[]='+JSON.stringify(cards)+';const lines:CatalogModelLine[]='+JSON.stringify(report.proposedLines)+';';
fs.writeFileSync(file,text);
try{execFileSync(process.execPath,['node_modules/typescript/bin/tsc',file,'--ignoreConfig','--noEmit','--strict','--skipLibCheck','--target','es2022','--moduleResolution','bundler','--module','esnext'],{stdio:'inherit'});}finally{fs.unlinkSync(file);}
report.validation={status:'passed',checks:['Strict TypeScript CatalogModelCard[] and CatalogModelLine[] assignment','Unique slugs, source URLs, chronological bounds, all null fields indexed in needsReview'],command:'node analysis/codex/night-iveco-validate.mjs'};
fs.writeFileSync('analysis/codex/night-iveco-report.json',JSON.stringify(report,null,2)+'\n');
console.log('PASS '+cards.length+' iveco cards; strict types and indexed null reviews');

