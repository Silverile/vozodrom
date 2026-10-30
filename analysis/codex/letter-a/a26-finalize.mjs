import fs from 'node:fs';
import crypto from 'node:crypto';
import sharp from 'sharp';
const root='analysis/codex/letter-a',db=root+'/a-26-results.json',rows=JSON.parse(fs.readFileSync(db));
const names=['V8 Vantage','V8 Volante','Valhalla','Valkyrie','Vanquish','Vanquish — druhá konstrukční rodina','Vanquish — třetí konstrukční rodina','Vantage','V8 / V12 Vantage — rodina VH','Vantage — novější rodina','Virage','Virage — nová konstrukční rodina'];
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),items=[];
if(rows.length!==12)throw Error('Expected twelve entries');
for(const [i,r] of rows.entries()){
 if(r.generation!==names[i])throw Error('Catalogue name '+r.id);
 if(r.status!=='done'||r.referenceGate!=='pass')throw Error('Incomplete '+r.id);
 const png=r.folder+'/'+r.id+'.png',m=await sharp(png).metadata(),ref=await sharp(r.folder+'/reference.jpg').metadata();
 if(m.width!==1536||m.height!==1024||m.format!=='png'||ref.width<1000)throw Error('Dimensions '+r.id);
 if(hash(png)!==hash(r.generatedSource))throw Error('Edited output '+r.id);
 if(r.evidence.length<2||!r.credit||!r.licence||!r.image)throw Error('Evidence '+r.id);
 Object.assign(r,{referenceWidth:ref.width,tool:'built-in image_gen',promptFile:'analysis/codex/abarth-drawings/prompt.txt',promptSuffix:`${r.make} ${r.generation} (${r.years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`});
 if(r.id==='aston-martin--valhalla--0')r.notes+=' Rejected 2021 display concept and earlier-look 2025 candidate before generation; 2026 production-design photo selected. Factory roof intake retained.';
 if(r.id==='aston-martin--valkyrie--0')r.notes+=' Roof-mounted filming equipment and display ropes excluded; factory aero and intake retained.';
 if(r.id==='aston-martin--vantage--0')r.notes+=' Early 1994 V550 rectangular-lamp variant explicitly selected.';
 if(r.id==='aston-martin--vantage--1')r.notes+=' Minor extra paired bonnet contours retained under batch acceptance rule. Reference has nonstandard wheels; front drawing has no visible wheel faces.';
 if(r.id==='aston-martin--virage--1')r.notes+=' Rear-view 2011 candidate rejected before generation; front-view replacement selected.';
 fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(u=>'Evidence: '+u).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\nNotes: ${r.notes}\n`);
 items.push({input:await sharp(png).resize(512,342).toBuffer(),left:i%3*512,top:Math.floor(i/3)*342});
 console.log(r.id,'1280px reference; 1536x1024 PNG; unedited SHA256 verified');
}
await sharp({create:{width:1536,height:1368,channels:3,background:'white'}}).composite(items).png().toFile(root+'/raw/a26-drawing-check.png');
fs.writeFileSync(db,JSON.stringify(rows,null,2));console.log('12 done; ready for Claude independent review.');
