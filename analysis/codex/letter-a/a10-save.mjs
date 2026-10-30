import fs from 'node:fs';
import crypto from 'node:crypto';
import sharp from 'sharp';
const [id,source,seconds]=process.argv.slice(2),db='analysis/codex/letter-a/a-10-results.json',rows=JSON.parse(fs.readFileSync(db)),r=rows.find(x=>x.id===id);
const dest=r.folder+'/'+id+'.png';fs.copyFileSync(source,dest);
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
if(hash(source)!==hash(dest))throw Error('Image changed');
const m=await sharp(dest).metadata();if(m.width!==1536||m.height!==1024||m.format!=='png')throw Error('Bad dimensions');
r.status='done';r.genSeconds=Number(seconds);r.generatedSource=source;r.attempts=1;r.review='pending Claude independent review';r.notes='One built-in image_gen call with verbatim Abarth prompt plus required generation suffix; unedited PNG. Visual review required before handoff.';
fs.writeFileSync(db,JSON.stringify(rows,null,2));console.log(id,m.width+'x'+m.height,'SHA256 matches original');

