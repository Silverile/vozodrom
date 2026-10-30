import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import sharp from 'sharp';
const root='analysis/codex/letter-a',db=root+'/a-22-results.json',rows=JSON.parse(fs.readFileSync(db));
const a=rows.find(r=>r.id==='ariel--nomad--0');a.attempts=2;a.genSeconds=51.665;a.notes='Two built-in image_gen calls with verbatim Abarth prompt and required suffix. Both retain optional roof lamps despite no-accessories rule; cleaner second selected per explicit keep-better instruction. Claude must review this caveat.';
const b=rows.find(r=>r.id==='ariel--nomad--1');b.attempts=2;b.genSeconds=33.543;b.notes='Two built-in image_gen calls. First retained front nudge bar; second selected, with winch, roof lamps and nudge bar removed.';
const c=rows.find(r=>r.id==='aro--m461--1');c.attempts=2;c.genSeconds=39.499;c.notes='Two built-in image_gen attempts. Both retain added auxiliary lamps; cleaner second chosen per explicit keep-better instruction. Claude review required.';
for(const r of rows){
 if(r.status!=='done'||r.referenceGate!=='pass')throw Error('Incomplete '+r.id);
 const png=r.folder+'/'+r.id+'.png',m=await sharp(png).metadata(),ref=await sharp(r.folder+'/reference.jpg').metadata();
 if(m.width!==1536||m.height!==1024||m.format!=='png')throw Error('Bad drawing '+r.id);
 const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');if(hash(png)!==hash(r.generatedSource))throw Error('Edited output '+r.id);
 r.referenceWidth=ref.width;r.tool='built-in image_gen';r.promptFile='analysis/codex/abarth-drawings/prompt.txt';r.promptSuffix=`${r.make} ${r.generation} (${r.years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`;
 if(ref.width<1000)r.notes+=` Selected source is native ${ref.width}px wide; retained without upscaling.`;
 if(r.id==='ariel--ten--0')r.notes+=' Reference extracted from 26 September 1924 Light Car PDF page 37 (printed p539); only Ariel photograph cropped from rendered scan.';
 if(r.id==='aro--m59--0')r.credit='A. S. Diaconescu, period photograph hosted by ARO M461 Club Romania';
 if(r.id==='aro--m461--1')r.notes+=' Original Commons candidate rejected before generation because bull bar hides far headlamp. Selected 1970 Auta5P photograph shows factory optional fibreglass hardtop and rectangular indicators.';
 fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(u=>'Evidence: '+u).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\nNotes: ${r.notes}\n`);
 console.log(r.id,ref.width+'px reference',m.width+'x'+m.height,'SHA256 matches');
}
fs.writeFileSync(db,JSON.stringify(rows,null,2));
fs.writeFileSync(root+'/a22-sources.json',JSON.stringify(rows.map(r=>({id:r.id,file:r.id+'.jpg',referencePage:r.referencePage,image:r.image,credit:r.credit,licence:r.licence,licenceUrl:r.licenceUrl,local:r.folder+'/reference.jpg',width:r.referenceWidth})),null,2));
const absRoot=path.resolve(root);for(const name of ['a22-pdf-runtime','a22-npm-cache']){const p=path.resolve(root,name);if(path.dirname(p)!==absRoot)throw Error('Unsafe cleanup');if(fs.existsSync(p))fs.rmSync(p,{recursive:true});}
const keep=new Set(['a22-tools.mjs','a22-save.mjs','a22-finalize.mjs']);for(const name of fs.readdirSync(root).filter(n=>n.startsWith('a22-')&&n.endsWith('.mjs')&&!keep.has(n))){const p=path.resolve(root,name);if(path.dirname(p)!==absRoot)throw Error('Unsafe cleanup');fs.rmSync(p);}
const raw=path.resolve(root,'raw');if(path.dirname(raw)!==absRoot)throw Error('Unsafe raw');for(const name of fs.readdirSync(raw).filter(n=>n.startsWith('a22-'))){const p=path.resolve(raw,name);if(path.dirname(p)!==raw)throw Error('Unsafe scratch');fs.rmSync(p);}
console.log('TOTAL',rows.length,'done;',rows.reduce((s,r)=>s+r.attempts,0),'built-in calls');console.log('FILES',JSON.stringify([db,root+'/a22-sources.json',...keep].map(p=>p.startsWith('a22-')?root+'/'+p:p).concat(rows.flatMap(r=>['reference.jpg','info.txt',r.id+'.png'].map(n=>r.folder+'/'+n))),null,2));

