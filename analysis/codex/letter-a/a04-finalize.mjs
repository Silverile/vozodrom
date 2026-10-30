import fs from 'node:fs';
import sharp from 'sharp';
import crypto from 'node:crypto';
const out='analysis/codex/letter-a/a-04-results.json',rows=JSON.parse(fs.readFileSync(out,'utf8'));
const base='C:/Users/Sevedge Anywhere/.codex/generated_images/01a18a38-0327-77f3-85b5-918b1c7ad7d1/';
const decisions=JSON.parse(fs.readFileSync('analysis/codex/letter-a/a04-decisions.json','utf8'));
for(const r of rows) {
 if(r.id==='acura--nsx--1'){
  r.variant='2015 unveiling of MY2017 production-version coupe; original 2017–2021 non-Type-S front';
  for(const url of ['https://acuranews.com/en-US/releases/2022-acura-nsx-revealed-at-monterey-car-week','https://acuranews.com/en-US/releases/release-dc0d55cd428842ffa817f23141ce5a60-2017-acura-nsx-press-kit-interior-and-exterior'])if(!r.evidence.includes(url))r.evidence.push(url);
 }
 const d=decisions[r.id];if(!d)continue;
 Object.assign(r,d,{review:'pending Claude independent review',referenceGate:'passed; Claude independent review pending',promptBase:'analysis/codex/abarth-drawings/prompt.txt',promptSuffix:`Acura ${r.generation} (${r.years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`});
 r.view='front three-quarter; grille, both headlights, both bumper corners and bonnet visible';
 if(r.status==='done'){r.originalOutput=base+d.output;const dest=r.folder+'/'+r.id+'.png';fs.copyFileSync(r.originalOutput,dest);const m=await sharp(dest).metadata(),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');console.log(JSON.stringify({id:r.id,width:m.width,height:m.height,unedited:hash(dest)===hash(r.originalOutput)}));}
 fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\nNotes: ${r.notes}\n`);
}
fs.writeFileSync(out,JSON.stringify(rows,null,2));
