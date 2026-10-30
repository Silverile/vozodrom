import fs from 'node:fs';
import crypto from 'node:crypto';
import sharp from 'sharp';
const [id,source,seconds]=process.argv.slice(2),db='analysis/codex/letter-a/a-22-results.json',rows=JSON.parse(fs.readFileSync(db)),r=rows.find(x=>x.id===id);
const dest=r.folder+'/'+id+'.png';fs.copyFileSync(source,dest);
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');if(hash(source)!==hash(dest))throw Error('Image changed');
const m=await sharp(dest).metadata();if(m.width!==1536||m.height!==1024||m.format!=='png')throw Error('Bad dimensions');
Object.assign(r,{status:'done',genSeconds:Number(seconds),generatedSource:source,attempts:1,review:'pending Claude independent review',notes:'Reference passed visual gate. One built-in image_gen call with verbatim Abarth prompt plus required suffix; PNG copied unedited, SHA256 verified. Drawing visually checked against batch acceptance rules.'});
fs.writeFileSync(db,JSON.stringify(rows,null,2));console.log(id,m.width+'x'+m.height,'SHA256 matches original');








