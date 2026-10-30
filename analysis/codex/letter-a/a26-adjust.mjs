import fs from 'node:fs';
const db='analysis/codex/letter-a/a-26-results.json',rows=JSON.parse(fs.readFileSync(db)),r=rows.find(x=>x.id==='aston-martin--vanquish--2');
Object.assign(r,{attempts:2,discardedSource:process.argv[2],genSeconds:Number(process.argv[3]),notes:'Reference passed visual gate. Two built-in image_gen calls with verbatim Abarth prompt and required suffix. First output had tiny badge lettering; second selected with clean emblem outline. Final PNG copied unedited and SHA256 verified. Drawing visually checked against batch acceptance rules.',review:'pending Claude independent review'});
rows.find(x=>x.id==='aston-martin--vantage--1').credit='Rudolf Stricker; brightness adjustment by Thomas doerfer';
fs.writeFileSync(db,JSON.stringify(rows,null,2));console.log('Recorded Vanquish retry and VH Vantage source credit.');
