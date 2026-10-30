import fs from 'node:fs';
import sharp from 'sharp';
import crypto from 'node:crypto';
const root='analysis/codex/letter-a',db=root+'/a-09-results.json',rows=JSON.parse(fs.readFileSync(db));
const ev75='https://www.media.stellantis.com/de-de/alfa-romeo/press/alfa-romeo-feiert-40-jahre-alfetta-beginn-der-transaxle-ra';
for(const r of rows){
 if(r.id==='alfa-romeo--75--0'){r.evidence=[r.referencePage,ev75];r.variant='European 75 sedan, standard European bumper and fine-mesh grille, photographed 2007';}
 r.review='Codex reference and drawing visual checks passed; pending independent Claude review';r.referenceGate='pass';r.promptSource='analysis/codex/abarth-drawings/prompt.txt';r.promptSuffix=`${r.make} ${r.generation} (${r.years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`;
 r.notes='One built-in image_gen call; no retries or regenerations; unedited PNG. Visual acceptance passed: correct front body layout, no readable text, wipers or major add-ons. Minor badge symbols/lamp detail differences accepted under batch policy.';
 if(r.id==='aixam--mac--0')r.notes+=' Source original only 400px wide; promotional photo on graphic background; no open licence stated.';
 if(r.id==='alfa-romeo--33--0')r.notes+=' Source original only 745px wide; chosen late 1990–1994 body within catalogue family.';
 if(r.id==='alfa-romeo--75--0')r.notes+=' Used 1280px thumbnail following original HTTP 429; earlier 1987 candidate rejected for railing across bumper corner.';
 if(r.id==='aixam--coupe--0')r.notes+=' Used 1280px thumbnail. Rear-view GTI candidate and 2019 candidate with unseen far headlight rejected before generation.';
 if(r.id==='aixam--city--0')r.notes+=' Steep front three-quarter reference: far lamp narrow but visible; complete bumper contour visible. Chosen original 2008–2010 fascia.';
 if(r.id==='aixam--easy--0')r.notes+=' 2026 GT Electric factory trim confirmed on manufacturer homepage; small factory spoiler retained.';
 if(r.id==='aixam--roadline--0')r.notes+=' No open licence stated.';
 fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\n`);
 const file=r.folder+'/'+r.id+'.png',m=await sharp(file).metadata();if(m.width!==1536||m.height!==1024||m.format!=='png')throw Error(r.id+' dimensions');const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');if(hash(file)!==hash(r.generatedSource))throw Error(r.id+' modified image');if(r.evidence.length!==2||r.evidence.some(x=>!x?.startsWith('https://')))throw Error(r.id+' evidence');const ref=await sharp(r.folder+'/reference.jpg').metadata();r.referenceWidth=ref.width;console.log(r.id,r.status,'1536x1024','hash match','reference width '+ref.width);
}
fs.writeFileSync(db,JSON.stringify(rows,null,2));console.log('Total generation seconds',rows.reduce((n,r)=>n+r.genSeconds,0).toFixed(3));
