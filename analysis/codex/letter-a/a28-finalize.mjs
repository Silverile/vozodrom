import fs from 'node:fs';
import crypto from 'node:crypto';
import sharp from 'sharp';
const root='analysis/codex/letter-a',db=root+'/a-28-results.json',rows=JSON.parse(fs.readFileSync(db));
const names={'audi--a6--3':'A6 — konstrukční etapa 4','audi--a6--4':'A6 — konstrukční etapa 5','audi--a6--5':'A6 — konstrukční etapa 6','audi--a6-e-tron--0':'A6 e-tron','audi--a7--0':'A7','audi--a8--0':'A8 — konstrukční etapa 1','audi--a8--2':'A8 — konstrukční etapa 3','audi--a8--3':'A8 — konstrukční etapa 4','audi--cabriolet--0':'Cabriolet','audi--coupe--0':'Coupé','audi--e-tron-gt--0':'e-tron GT','audi--f103--0':'Audi F103'};
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),items=[],refs=[];
if(rows.length!==12||new Set(rows.map(x=>x.id)).size!==12)throw Error('Expected twelve unique IDs');
for(const [i,r] of rows.entries()){
 const png=r.folder+'/'+r.id+'.png',m=await sharp(png).metadata(),ref=await sharp(r.folder+'/reference.jpg').metadata();
 if(r.generation!==names[r.id]||r.status!=='done'||r.referenceGate!=='pass'||m.width!==1536||m.height!==1024||m.format!=='png'||ref.width<(r.id==='audi--coupe--0'?974:1000)||hash(png)!==hash(r.generatedSource)||r.evidence.length<2||r.genSeconds<=0)throw Error(r.id);
 Object.assign(r,{referenceWidth:ref.width,tool:'built-in image_gen',promptFile:'analysis/codex/abarth-drawings/prompt.txt',promptSuffix:`${r.make} ${r.generation} (${r.years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`});
 if(r.id==='audi--coupe--0')r.notes+=' Original reference maximum width is 974px; retained without upscaling, converted from PNG to JPEG for reference.jpg. Chosen early B3 look within unsplit B2/B3 catalogue family.';
 if(r.id==='audi--a8--2')r.notes+=' Commons description says A6 in error; the photograph display placard reads Audi A8, and filename and visible D4 front agree. Original pre-facelift nose used.';
 if(r.id==='audi--a6--5')r.notes+=' Catalogue code 4L appears inconsistent; the sixth A6 generation is C9. Selected by generation order and 2025 launch, preserving exact catalogue name and years.';
 if(r.id==='audi--a6--3')r.notes+=' Factory roof rails retained under batch acceptance rules.';
 if(r.id==='audi--f103--0'){r.evidence.push('https://www.audi.com/en/press-releases/a-new-era-for-the-four-rings-60-years-since-the-first-post-war-audi-16734');r.evidence=[...new Set(r.evidence)];r.view='Head-on; full front, both headlights, grille, both bumper corners and bonnet visible';}
 fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(u=>'Evidence: '+u).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\nNotes: ${r.notes}\n`);
 if(!fs.readFileSync(r.folder+'/info.txt','utf8').includes('Generace: '+names[r.id]+'\n'))throw Error('Name');
 items.push({input:await sharp(png).resize(512,342).toBuffer(),left:i%3*512,top:Math.floor(i/3)*342});
 refs.push({input:await sharp(r.folder+'/reference.jpg').resize(512,342,{fit:'contain',background:'white'}).toBuffer(),left:i%3*512,top:Math.floor(i/3)*342});
 console.log(r.id,ref.width+'px reference, PNG 1536x1024, SHA256 matches original');
}
await sharp({create:{width:1536,height:1368,channels:3,background:'white'}}).composite(items).png().toFile(root+'/raw/a28-drawing-check.png');
await sharp({create:{width:1536,height:1368,channels:3,background:'white'}}).composite(refs).png().toFile(root+'/raw/a28-reference-sheet.png');
fs.writeFileSync(db,JSON.stringify(rows,null,2));console.log('12 done; 12 first attempts; '+rows.reduce((s,r)=>s+r.genSeconds,0).toFixed(3)+' generation seconds.');
