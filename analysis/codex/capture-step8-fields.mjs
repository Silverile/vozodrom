import fs from 'node:fs';
if(fs.existsSync('analysis/codex/skoda-step8-field-transitions.json')){console.log('Existing baseline transitions retained; capture is a one-time pre-build operation.');process.exit(0);}
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const cards=read('src/data/catalog/model-cards/skoda.json');
const workers=fs.readdirSync('analysis/codex').filter(f=>/^worker-step8-.*\.json$/.test(f)).map(f=>read('analysis/codex/'+f));
const changes=workers.flatMap(w=>w.patches.flatMap(p=>{const t=cards.find(c=>c.lineSlug===p.lineSlug).generations[p.generationIndex].trims.find(t=>t.name===p.trimName);if(!t)throw Error('Missing original '+p.trimName);return Object.entries(p.fields).map(([field,after])=>({lineSlug:p.lineSlug,generationIndex:p.generationIndex,trimName:p.trimName,field,before:field.split('.').reduce((v,k)=>v?.[k],t)??null,after}));}));
if(new Set(changes.map(c=>[c.lineSlug,c.generationIndex,c.trimName,c.field].join('/'))).size!==changes.length)throw Error('Duplicate patch field');
fs.writeFileSync('analysis/codex/skoda-step8-field-transitions.json',JSON.stringify(changes,null,2)+'\n');
console.log(changes.length,'assignments;',changes.filter(c=>c.before===null&&c.after!==null).length,'null-to-populated fields');
