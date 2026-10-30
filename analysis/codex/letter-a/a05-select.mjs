import fs from 'node:fs';
const out='analysis/codex/letter-a/a-05-results.json',rows=JSON.parse(fs.readFileSync(out));
const [id,file,variant]=process.argv.slice(2),r=rows.find(x=>x.id===id);
r.file=file;r.referencePage='https://commons.wikimedia.org/wiki/File:'+file.replaceAll(' ','_');r.evidence[0]=r.referencePage;if(variant)r.variant=variant;r.view='pending visual gate';
fs.writeFileSync(out,JSON.stringify(rows,null,2));
