import fs from 'node:fs';
import crypto from 'node:crypto';
import sharp from 'sharp';
const root='analysis/codex/letter-a',db=root+'/a-24-results.json',rows=JSON.parse(fs.readFileSync(db));
if(process.argv[2]==='sheet'){
 const ready=rows.filter(r=>r.status==='done'),items=[];
 for(let i=0;i<ready.length;i++)items.push({input:await sharp(ready[i].folder+'/'+ready[i].id+'.png').resize(512,342).toBuffer(),left:i%3*512,top:Math.floor(i/3)*342});
 await sharp({create:{width:1536,height:Math.ceil(ready.length/3)*342,channels:3,background:'white'}}).composite(items).png().toFile(root+'/raw/a24-drawing-check.png');
 process.exit(0);
}
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const r of rows){
 if(r.status!=='done'||r.referenceGate!=='pass')throw Error('Incomplete '+r.id);
 const png=r.folder+'/'+r.id+'.png',m=await sharp(png).metadata(),ref=await sharp(r.folder+'/reference.jpg').metadata();
 if(m.width!==1536||m.height!==1024||m.format!=='png')throw Error('Bad drawing '+r.id);
 if(hash(png)!==hash(r.generatedSource))throw Error('Edited output '+r.id);
 if(ref.width<1000&&r.id!=='aston-martin--international-le-mans--0')throw Error('Low resolution reference '+r.id);
 r.referenceWidth=ref.width;r.tool='built-in image_gen';r.promptFile='analysis/codex/abarth-drawings/prompt.txt';
 r.promptSuffix=`${r.make} ${r.generation} (${r.years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`;
 if(r.id==='aston-martin--international-le-mans--0'){
  r.years='1932–1932';r.promptSuffix=`${r.make} ${r.generation} (${r.years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`;
  if(!r.notes.includes('906px wide'))r.notes+=' Reference is 906px wide; source offers no larger verified version. Copyright reference; no open licence stated.';
 }
 if(r.id==='aston-martin--le-mans--0'&&!r.notes.includes('stone guards'))r.notes+=' Drawing retains period headlamp/radiator stone guards and small horns; flag for Claude review as minor details.';
 fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(u=>'Evidence: '+u).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\nNotes: ${r.notes}\n`);
 console.log(r.id,ref.width+'px reference',m.width+'x'+m.height,'SHA256 matches');
}
fs.writeFileSync(db,JSON.stringify(rows,null,2));
console.log('TOTAL',rows.length,'done');
