import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
const urls = [
 ['fabia3','https://upload.wikimedia.org/wikipedia/commons/9/9a/%C5%A0koda_Fabia_III_%282017%29_%2853944974616%29.jpg'],
 ['fabia4','https://upload.wikimedia.org/wikipedia/commons/f/f9/%C5%A0koda_Fabia_IV_1X7A7110.jpg'],
 ['karoq','https://upload.wikimedia.org/wikipedia/commons/9/93/Skoda_Karoq%2C_Berlin_%281X7A3943%29.jpg'],
 ['kodiaq2','https://upload.wikimedia.org/wikipedia/commons/5/5a/%C5%A0koda_Kodiaq_II_IMG_9428.jpg']
];
for(const [key,url] of urls){
 const r=await fetch(url,{headers:{'User-Agent':'VozodromPhotoAudit/1.0'}});
 if(!r.ok){console.log(JSON.stringify({key,status:r.status,retryAfter:r.headers.get('retry-after')})); if(r.status===429)break;continue;}
 const b=Buffer.from(await r.arrayBuffer()); const file=path.join(os.tmpdir(),'wide-modern-'+key+'.jpg');fs.writeFileSync(file,b);
 console.log(JSON.stringify({key,file,sha1:crypto.createHash('sha1').update(b).digest('hex'),bytes:b.length,url}));
}
