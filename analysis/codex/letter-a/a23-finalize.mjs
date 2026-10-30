import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import sharp from 'sharp';
const root='analysis/codex/letter-a',db=root+'/a-23-results.json',rows=JSON.parse(fs.readFileSync(db));
const extra={
 '15-98':'Reference and drawing retain small low-mounted period lamps/horns; flag for Claude review.',
 '2-litre-speed':'Drawing retains headlamp tape crosses and small auxiliary lamps. Accepted as minor details under batch threshold; flag for Claude review.',
 'db2':'Selected reference is an open drophead coupe, not a saloon. Drawing simplifies the split windscreen centre into the required centre line.',
 'db2-4':'Reference has a thin rope across the lower bumper and auxiliary lamps; both headlights, grille, bonnet and bumper corners remain visible. Drawing removes rope but retains auxiliary lamps; flag for Claude review.',
 'db12':'Engine-bay and distant side-view candidates rejected. Storm Purple download returned HTTP 429 even after Retry-After and alternate URL; selected open-licensed replacement. Drawing closes open doors.',
 'db4':'Initial Series II candidate rejected for rear-side view; replaced by 1959 Series I front three-quarter.',
 'db4-gt-zagato':'Initial Rex Gray source returned HTTP 429 after Retry-After and alternate original URL; replaced with MrWalkr open-licensed photograph.',
 'db5':'1280px thumbnail returned HTTP 429; Retry-After observed and original 2560px download succeeded.'
};
for(const r of rows){
 if(r.status!=='done'||r.referenceGate!=='pass')throw Error('Incomplete '+r.id);
 if(r.id==='aston-martin--db2--0')r.variant='Later single-grille DB2 drophead coupe, roof down; split windscreen';
 const png=r.folder+'/'+r.id+'.png',m=await sharp(png).metadata(),ref=await sharp(r.folder+'/reference.jpg').metadata();
 if(m.width!==1536||m.height!==1024||m.format!=='png')throw Error('Bad drawing '+r.id);
 const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');if(hash(png)!==hash(r.generatedSource))throw Error('Edited output '+r.id);
 if(ref.width<1000)throw Error('Low resolution reference '+r.id);
 const slug=r.id.split('--')[1];r.notes+=' '+(extra[slug]||'No material acceptance issue observed.');
 r.referenceWidth=ref.width;r.tool='built-in image_gen';r.promptFile='analysis/codex/abarth-drawings/prompt.txt';r.promptSuffix=`${r.make} ${r.generation} (${r.years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`;
 fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(u=>'Evidence: '+u).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\nNotes: ${r.notes}\n`);
 console.log(r.id,ref.width+'px reference',m.width+'x'+m.height,'SHA256 matches');
}
fs.writeFileSync(db,JSON.stringify(rows,null,2));
fs.writeFileSync(root+'/a23-sources.json',JSON.stringify(rows.map(r=>({id:r.id,referencePage:r.referencePage,image:r.image,credit:r.credit,licence:r.licence,licenceUrl:r.licenceUrl,local:r.folder+'/reference.jpg',width:r.referenceWidth})),null,2));
const raw=path.resolve(root,'raw');for(const name of fs.readdirSync(raw).filter(n=>n.startsWith('a23-'))){const p=path.resolve(raw,name);if(path.dirname(p)!==raw)throw Error('Unsafe cleanup');fs.rmSync(p);}
for(const name of ['a23-prepare.mjs','a23-adjust.mjs']){const p=path.resolve(root,name);if(path.dirname(p)!==path.resolve(root))throw Error('Unsafe cleanup');fs.rmSync(p);}
console.log('TOTAL',rows.length,'done;',rows.reduce((s,r)=>s+r.attempts,0),'built-in calls');
console.log('FILES',JSON.stringify([db,root+'/a23-sources.json',root+'/a23-tools.mjs',root+'/a23-save.mjs',root+'/a23-finalize.mjs',...rows.flatMap(r=>['reference.jpg','info.txt',r.id+'.png'].map(n=>r.folder+'/'+n))],null,2));
