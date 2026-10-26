import fs from 'node:fs';
const p='analysis/codex/skoda-step9-baseline.json';
if(fs.existsSync(p))throw Error('Baseline already exists');
const cards=JSON.parse(fs.readFileSync('src/data/catalog/model-cards/skoda.json','utf8'));
fs.writeFileSync(p,JSON.stringify({startedAt:'2026-10-26T22:28:51Z',cards},null,2)+'\n');
