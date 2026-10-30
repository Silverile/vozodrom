import fs from 'node:fs';
import crypto from 'node:crypto';
import sharp from 'sharp';
const root='analysis/codex/letter-a',db=root+'/a-25-results.json',rows=JSON.parse(fs.readFileSync(db));
const names=['Mark II','One-77','Rapide','Short Chassis Volante','Sports Model','Standard Sports','T Type','Ulster','V12 Speedster','V12 Zagato','V8','V8 Coupé'];
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
if(rows.length!==12)throw Error('Expected 12 entries');
const items=[];
let index=0;
for(const [i,r] of rows.entries()){
 if(r.generation!==names[i])throw Error('Catalogue generation mismatch '+r.id);
 if(r.status==='no-reference'){if(r.folder!==null||r.genSeconds!==null)throw Error('Unexpected no-reference output');continue;}
 if(r.status!=='done'||r.referenceGate!=='pass')throw Error('Incomplete '+r.id);
 const png=r.folder+'/'+r.id+'.png',m=await sharp(png).metadata(),ref=await sharp(r.folder+'/reference.jpg').metadata();
 if(m.width!==1536||m.height!==1024||m.format!=='png')throw Error('Bad PNG '+r.id);
 if(ref.width<1000)throw Error('Reference too small '+r.id);
 if(hash(png)!==hash(r.generatedSource))throw Error('Edited image '+r.id);
 if(r.evidence.length<2||!r.licence||!r.image||!r.credit)throw Error('Incomplete evidence '+r.id);
 Object.assign(r,{referenceWidth:ref.width,tool:'built-in image_gen',promptFile:'analysis/codex/abarth-drawings/prompt.txt',promptSuffix:`${r.make} ${r.generation} (${r.years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`});
 if(r.generation==='Mark II')r.notes+=' Retains small period horns/lamps; accepted under minor-detail rule for Claude review.';
 if(r.generation==='Ulster')r.notes+=' Retains small lower lamps and headlamp/radiator stone guards; accepted under minor-detail rule for Claude review.';
 if(r.generation==='V12 Zagato')r.notes+=' Catalogue dates 2011–2012 retained verbatim; manufacturer dates road production 2012–2013. Photo labelled 2013, same production family.';
 if(r.generation==='V8')r.notes+=' Standard Series 3 reference selected after rejecting the 1977 Vantage-styled candidate before generation. Small grille club badge remains as an abstract symbol; no readable lettering.';
 if(r.generation==='V8 Coupé')r.notes+=' Minor extra bonnet contour outlines retained; factory mesh grille and round lower lamps match the naturally aspirated Coupe.';
 fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(u=>'Evidence: '+u).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\nNotes: ${r.notes}\n`);
 items.push({input:await sharp(png).resize(512,342).toBuffer(),left:index%3*512,top:Math.floor(index/3)*342});index++;
 console.log(r.id,ref.width+'px reference',m.width+'x'+m.height,'SHA256 matches');
}
await sharp({create:{width:1536,height:Math.ceil(index/3)*342,channels:3,background:'white'}}).composite(items).png().toFile(root+'/raw/a25-drawing-check.png');
fs.writeFileSync(db,JSON.stringify(rows,null,2));
console.log('TOTAL',index,'done;',rows.filter(r=>r.status==='no-reference').length,'no-reference; no retries');
