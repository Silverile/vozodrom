import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
const root='analysis/codex/letter-a',db=root+'/a-07-results.json',rows=JSON.parse(fs.readFileSync(db));
const generated={
'adler--standard-6--1':[24.759,'exec-f8316f79-f073-4b69-970d-5842ecac3c69.png'],
'adler--trumpf--0':[16.408,'exec-fbfad26c-cd83-4298-aba1-478da14d5db1.png'],
'adler--trumpf-junior--0':[16.354,'exec-70b7dbea-087c-45fc-9b9b-357b6c479908.png'],
'adler--trumpf-junior--1':[14.813,'exec-95867681-884e-4c42-adf8-f828bfd9a68b.png'],
'adler--trumpf-junior--2':[16.514,'exec-80940d4a-711b-4951-a022-6ecd53c2563c.png'],
'adler--trumpf--2':[13.053,'exec-d33082cf-af9c-49e1-b16d-f7a4ae64e4ca.png']};
const generatedRoot='C:/Users/Sevedge Anywhere/.codex/generated_images/01a18a68-fac0-7383-8644-518292c0518c';
for(const r of rows){
 if(!generated[r.id])continue;
 const [seconds,name]=generated[r.id],image=r.folder+'/'+r.id+'.png';
 const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
 if(hash(image)!==hash(generatedRoot+'/'+name))throw Error('Altered image '+r.id);
 const m=await sharp(image).metadata();if(m.width!==1536||m.height!==1024||m.format!=='png')throw Error('Dimensions '+r.id);
 const info=fs.readFileSync(r.folder+'/info.txt','utf8');if(!info.includes('Generace: '+r.generation+'\n')||r.evidence.length<2)throw Error('Metadata '+r.id);
 r.status='done';r.genSeconds=seconds;r.attempts=1;r.review='pending Claude independent review';r.notes='One built-in image_gen call; unedited PNG. Visually inspected: correct front layout, empty glass, blank plate, both mirrors, no wipers or large add-ons. Minor grille/lamp details retained per acceptance.'+(r.id==='adler--trumpf--2'?' Source photo licence not stated; 640px original.':r.id==='adler--standard-6--1'?' Source original only 751px wide.':'');
 console.log(r.id,'done',m.width+'x'+m.height,'SHA256 matches built-in output');
}
fs.writeFileSync(db,JSON.stringify(rows,null,2));
// Remove only this batch's temporary reference copies and contact sheets.
for(const s of JSON.parse(fs.readFileSync(root+'/a07-sources.json'))){const p=path.resolve(s.local);if(!p.startsWith(path.resolve(root+'/raw')+path.sep)||!path.basename(p).startsWith('a07-'))throw Error('Unexpected cleanup path');if(fs.existsSync(p))fs.unlinkSync(p);}
for(const rel of ['a07-contact.jpg','a07-contact-2.jpg','raw/a07-standard8-candidate.jpg','raw/a07-ev-candidate.jpg'])if(fs.existsSync(root+'/'+rel))fs.unlinkSync(root+'/'+rel);
console.log('Results:',rows.length,'rows,',rows.filter(r=>r.status==='done').length,'done,',rows.filter(r=>r.status==='no-reference').length,'no-reference');
