import fs from 'node:fs';
import crypto from 'node:crypto';
import sharp from 'sharp';
const root='analysis/codex/letter-a',db=root+'/a-29-results.json',rows=JSON.parse(fs.readFileSync(db));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const extra={
 'audi--q3--2':'https://www.audi.com/en/audi-q3-56',
 'audi--q5--2':'https://www.audi.com/en/press-releases/the-new-audi-q5-suv-proven-concept-in-its-third-generation-16232',
 'audi--q7--2':'https://www.audi.com/en/press-releases/third-generation-of-the-successful-suv-new-audi-q7-combines-versatility-and-performance-18004',
 'audi--q8-e-tron--0':'https://www.audi.com/en/the-audi-q8-e-tron-until-2025-15069/increased-efficiency-and-range-sharpened-design-the-new-audi-q8-e-tron-15070'
};
const drawings=[],refs=[];
for(const [i,r] of rows.entries()){
 const png=r.folder+'/'+r.id+'.png',m=await sharp(png).metadata(),ref=await sharp(r.folder+'/reference.jpg').metadata();
 if(r.status!=='done'||r.referenceGate!=='pass'||m.width!==1536||m.height!==1024||m.format!=='png'||ref.width<1000||hash(png)!==hash(r.generatedSource)||r.evidence.length<2||r.genSeconds<=0)throw Error(r.id);
 Object.assign(r,{referenceWidth:ref.width,tool:'built-in image_gen',promptFile:'analysis/codex/abarth-drawings/prompt.txt',promptSuffix:`${r.make} ${r.generation} (${r.years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`});
 if(extra[r.id])r.evidence=[...new Set([...r.evidence,extra[r.id]])];
 if(r.id==='audi--front-uw-220--0')r.variant='1934 UW220 two-door Cabriolet with fabric roof raised; separate round lamps and narrow vertical grille';
 if(r.id==='audi--quattro--0'){r.licence='CC0 1.0';r.licenceUrl='https://creativecommons.org/publicdomain/zero/1.0/';}
 if(r.id==='audi--q8-e-tron--0')r.notes+=' Original download returned HTTP 429 with Retry-After 600; waited 600 seconds once, then downloaded 1280px thumbnail. Chosen renamed 2023 facelift within unsplit 2018–2025 catalogue family.';
 if(r.id==='audi--front-uw-220--0')r.notes+=' Side-mounted spare tyres are factory body equipment; retained in front silhouette.';
 fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(u=>'Evidence: '+u).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\nNotes: ${r.notes}\n`);
 drawings.push({input:await sharp(png).resize(512,342).toBuffer(),left:i%3*512,top:Math.floor(i/3)*342});
 refs.push({input:await sharp(r.folder+'/reference.jpg').resize(512,342,{fit:'contain',background:'white'}).toBuffer(),left:i%3*512,top:Math.floor(i/3)*342});
 console.log(r.id,ref.width+'px reference; PNG 1536x1024; SHA256 matches original');
}
await sharp({create:{width:1536,height:Math.ceil(rows.length/3)*342,channels:3,background:'white'}}).composite(drawings).png().toFile(root+'/raw/a29-drawing-check.png');
await sharp({create:{width:1536,height:Math.ceil(rows.length/3)*342,channels:3,background:'white'}}).composite(refs).png().toFile(root+'/raw/a29-reference-sheet.png');
fs.writeFileSync(db,JSON.stringify(rows,null,2));
console.log(rows.length+' done; '+rows.reduce((s,r)=>s+r.genSeconds,0).toFixed(3)+' generation seconds.');
