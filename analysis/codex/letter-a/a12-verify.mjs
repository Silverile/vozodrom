import fs from 'node:fs';
import crypto from 'node:crypto';
import sharp from 'sharp';
const root='analysis/codex/letter-a',rows=JSON.parse(fs.readFileSync(root+'/a-12-results.json'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
let count=0;
for(const r of rows){
 if(r.status!=='done'){console.log(r.id,r.status,r.notes);continue;}
 const info=fs.readFileSync(r.folder+'/info.txt','utf8'),drawing=r.folder+'/'+r.id+'.png';
 if(!info.includes('Generace: '+r.generation+'\n')||(info.match(/^Evidence: /gm)||[]).length!==2)throw Error('Metadata mismatch '+r.id);
 const ref=await sharp(r.folder+'/reference.jpg').metadata(),im=await sharp(drawing).metadata();
 if(ref.width<1000||im.width!==1536||im.height!==1024||im.format!=='png'||hash(drawing)!==hash(r.generatedSource))throw Error('Image mismatch '+r.id);
 console.log(r.id,'PASS',ref.width+'px reference',im.width+'x'+im.height,'PNG unchanged');count++;
}
console.log('Verified',count,'of',rows.length);
