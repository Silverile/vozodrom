import fs from 'node:fs';
import crypto from 'node:crypto';
import sharp from 'sharp';
const root='analysis/codex/letter-a',db=root+'/a-27-results.json',rows=JSON.parse(fs.readFileSync(db));
const names=['50','90','200','920','A1 — konstrukční etapa 1','A1 — konstrukční etapa 2','A2','A3 — konstrukční etapa 3','A3 — konstrukční etapa 4','A5 — konstrukční etapa 3','A6 — konstrukční etapa 1','A6 — konstrukční etapa 3'];
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),items=[],refs=[];
if(rows.length!==12)throw Error('Expected twelve');
for(const [i,r] of rows.entries()){
 if(r.generation!==names[i]||r.status!=='done'||r.referenceGate!=='pass')throw Error('Entry '+r.id);
 const png=r.folder+'/'+r.id+'.png',m=await sharp(png).metadata(),ref=await sharp(r.folder+'/reference.jpg').metadata();
 if(m.width!==1536||m.height!==1024||m.format!=='png'||ref.width<(r.id==='audi--a6--2'?973:1000))throw Error('Dimensions '+r.id);
 if(hash(png)!==hash(r.generatedSource))throw Error('Edited output '+r.id);
 if(r.evidence.length<2||!r.credit||!r.licence||!r.image||r.genSeconds<=0)throw Error('Metadata '+r.id);
 Object.assign(r,{referenceWidth:ref.width,tool:'built-in image_gen',promptFile:'analysis/codex/abarth-drawings/prompt.txt',promptSuffix:`${r.make} ${r.generation} (${r.years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`});
 r.view=['audi--200--0','audi--a2--0','audi--a6--2'].includes(r.id)?'Head-on; full front, both headlights, grille, bumper corners and bonnet visible':'Front three-quarter; full front, both headlights, grille, bumper corners and bonnet visible';
 if(r.id==='audi--50--0')r.credit='Michael Höcker';
 if(r.id==='audi--90--0')r.notes+=' Representative 1989 B3 quattro 20V chosen for catalogue family spanning several 90 looks.';
 if(r.id==='audi--200--0')r.notes+=' Representative European late C3 20V chosen for unsplit 200 family. Chinese-market facelift candidate rejected before generation.';
 if(r.id==='audi--920--0')r.notes+=' 1939 Cabriolet, hood lowered. Oblique saloon candidate rejected; factory bumper overriders and wing markers retained; both mirrors added per prompt.';
 if(r.id==='audi--a2--0'){r.credit='Image by Renée Kools via Wikimedia Commons, CC-BY-4.0';r.notes+=' Earlier oblique A2 candidates rejected before generation; head-on replacement used.';}
 if(r.id==='audi--a3--2')r.notes+=' Initial 2016 oblique photo rejected before generation; 2012 launch Sportback used. Display door closed in drawing; roof rails retained under acceptance rules.';
 if(r.id==='audi--a3--3')r.notes+=' Oblique candidates rejected before generation; clearer Damian B Oh 8Y S line photo used.';
 if(r.id==='audi--a5--2')r.notes+=' Initial oblique candidates rejected before generation; Japanese-market CC0 front three-quarter reference used; Japanese plate proportions retained.';
 if(r.id==='audi--a6--2'){r.notes+=' Oblique candidates rejected before generation. Selected head-on source largest available original is 973x730; kept unscaled. Factory S line badge rendered blank.';r.licenceUrl='https://commons.wikimedia.org/wiki/Template:PD-author';}
 if(r.id==='audi--90--0')r.licenceUrl='https://commons.wikimedia.org/wiki/Template:PD-author';
 fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(u=>'Evidence: '+u).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\nNotes: ${r.notes}\n`);
 const info=fs.readFileSync(r.folder+'/info.txt','utf8');if(!info.includes('Generace: '+names[i]+'\n'))throw Error('Catalogue name');
 items.push({input:await sharp(png).resize(512,342).toBuffer(),left:i%3*512,top:Math.floor(i/3)*342});
 refs.push({input:await sharp(r.folder+'/reference.jpg').resize(512,342,{fit:'contain',background:'white'}).toBuffer(),left:i%3*512,top:Math.floor(i/3)*342});
 console.log(r.id,ref.width+'px reference; 1536x1024 PNG; original SHA256 matches');
}
await sharp({create:{width:1536,height:1368,channels:3,background:'white'}}).composite(items).png().toFile(root+'/raw/a27-drawing-check.png');
await sharp({create:{width:1536,height:1368,channels:3,background:'white'}}).composite(refs).png().toFile(root+'/raw/a27-reference-sheet.png');
fs.writeFileSync(db,JSON.stringify(rows,null,2));console.log('12 done; 12 first attempts; '+rows.reduce((s,r)=>s+r.genSeconds,0)+' generation seconds.');
