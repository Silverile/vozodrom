import fs from 'node:fs';
const read=n=>JSON.parse(fs.readFileSync('analysis/codex/raw/'+n+'.json')).results.bindings;
if(process.argv[2]==='props') {for(const r of read('model-schema-sample')) console.log(r.itemLabel.value,r.p.value.split('/').at(-1),r.vLabel.value);}
else {const rows=read('makes-direct'); const a=[...new Map(rows.map(r=>[r.item.value,r])).values()]; console.log('unique',a.length); console.log(a.filter(r=>!/Q\d+$/.test(r.itemLabel.value)).map(r=>r.item.value.split('/').at(-1)+' '+r.itemLabel.value).join('\n'));}
