import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
const root='analysis/codex/letter-a',db=root+'/a-21-results.json',rows=JSON.parse(fs.readFileSync(db));
const a3=rows.find(r=>r.id==='ariel--atom--2');a3.attempts=2;a3.genSeconds=29.291;
a3.notes='Two built-in image_gen attempts, exact Abarth prompt plus required suffix. Both retained optional front aero wing. First attempt selected as cleaner; marked done with explicit caveat per instruction to keep better of two imperfect attempts. Claude review required.';
const v=rows.find(r=>r.id==='arcfox--wendao-v9--0');
v.variant='2026 production Wendao V9, original grille and lamps, dark paint; discovery labels 1330 Ultra+ (trim unverified)';
v.notes='One built-in image_gen call. Clear head-on Yiche photograph downloaded and inspected; manufacturer and independent Commons photographer corroborate generation/design. Original Yiche gallery returned blank/unavailable HTML; precise trim is unverified. No open licence stated; no claim of reuse permission.';
for(const r of rows.filter(r=>r.status==='done')){
 if(r.referenceGate!=='pass')throw Error('Missing gate '+r.id);
 const png=r.folder+'/'+r.id+'.png',m=await sharp(png).metadata(),ref=await sharp(r.folder+'/reference.jpg').metadata();
 if(m.width!==1536||m.height!==1024||m.format!=='png')throw Error('Bad drawing '+r.id);
 const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
 if(hash(png)!==hash(r.generatedSource))throw Error('Drawing changed '+r.id);
 if(ref.width<1000)throw Error('Small reference '+r.id);
 fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(u=>'Evidence: '+u).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\nNotes: ${r.notes}\n`);
 console.log(r.id,ref.width+'px reference',m.width+'x'+m.height,'SHA256 matches');
}
fs.writeFileSync(db,JSON.stringify(rows,null,2));
// Remove only this turn's rejected scratch references and its rejected Atom 1 folder.
const absRoot=path.resolve(root),rejected=path.resolve(root+'/staged/ariel/ariel--atom--0 Atom – Rover');
if(!rejected.startsWith(absRoot+path.sep))throw Error('Unsafe cleanup');
if(fs.existsSync(rejected))fs.rmSync(rejected,{recursive:true});
const sources=JSON.parse(fs.readFileSync(root+'/a21-sources.json'));
for(const s of sources){const r=rows.find(r=>r.status==='done'&&r.referencePage===s.referencePage);s.local=r?r.folder+'/reference.jpg':null;s.disposition=r?'selected':'rejected or superseded';}
fs.writeFileSync(root+'/a21-sources.json',JSON.stringify(sources,null,2));
const rawDir=path.resolve(root+'/raw');if(!rawDir.startsWith(absRoot+path.sep))throw Error('Unsafe raw directory');
for(const name of fs.readdirSync(rawDir).filter(n=>n.startsWith('a21-'))){const p=path.resolve(rawDir,name);if(path.dirname(p)!==rawDir)throw Error('Unsafe scratch path');fs.rmSync(p);}
console.log('TOTAL',rows.filter(r=>r.status==='done').length,'done;',rows.filter(r=>r.status==='no-reference').length,'no-reference;',rows.filter(r=>r.status==='failed').length,'failed');
console.log('FILES',JSON.stringify([db,...fs.readdirSync(root).filter(n=>n.startsWith('a21-')).map(n=>root+'/'+n),...rows.filter(r=>r.status==='done').flatMap(r=>['reference.jpg','info.txt',r.id+'.png'].map(n=>r.folder+'/'+n))],null,2));
