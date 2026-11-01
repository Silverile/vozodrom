import fs from 'node:fs';
import zlib from 'node:zlib';
const root='analysis/codex/generation-facts-pass/body-variants-1';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
if(!fs.existsSync(root+'/baseline.json.gz')) {
 const keys=Object.keys(JSON.parse(zlib.gunzipSync(fs.readFileSync('analysis/codex/generation-facts-pass/top-100/baseline.json.gz'))));
 const baseline=Object.fromEntries(keys.map(p=>[p,read(p)]));
 fs.writeFileSync(root+'/baseline.json.gz',zlib.gzipSync(JSON.stringify(baseline)));
}
const queue=read('analysis/codex/generation-facts-pass/top-100/review.json').filter(r=>r.remaining.some(h=>['multiple-bodies','multiple-wheelbases-or-commercial-layouts'].includes(h.code))).map(r=>({...r,targetFields:r.remaining.filter(h=>['multiple-bodies','multiple-wheelbases-or-commercial-layouts'].includes(h.code)).map(h=>h.field)}));
write(root+'/selection.json',queue);
console.log(JSON.stringify({generations:queue.length,targetFieldGaps:queue.reduce((n,r)=>n+r.targetFields.length,0)}));
