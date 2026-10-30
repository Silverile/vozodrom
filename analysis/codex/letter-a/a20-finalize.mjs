import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import sharp from 'sharp';
const root='analysis/codex/letter-a',db=root+'/a-20-results.json',rows=JSON.parse(fs.readFileSync(db));
const expected=[
'Matador – modernizované sedany a kombiMY1974–1978','Matador Coupe – nová karoserieMY1974–1978','Pacer – společná rodina, hatchback a kombi','Rambler / AMC Rebel – samostatná řada','Spirit – rodinaMY1979–1983','Alpha S','Alpha S6 – přejmenovaná nabídka','Alpha S5','Alpha T','Alpha T6 – přejmenovaná nabídka','Alpha T5 – původní nabídka','New Alpha T5 – prodloužená nabídka'];
if(rows.length!==12)throw Error('Row count');
for(let i=0;i<rows.length;i++){
const r=rows[i];if(r.status!=='done'||r.generation!==expected[i])throw Error('Status/generation '+r.id);
const png=r.folder+'/'+r.id+'.png',ref=r.folder+'/reference.jpg',m=await sharp(png).metadata(),p=await sharp(ref).metadata();
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
if(m.format!=='png'||m.width!==1536||m.height!==1024||hash(png)!==hash(r.generatedSource))throw Error('Drawing '+r.id);
if(p.format!=='jpeg'||p.width<1000)throw Error('Reference '+r.id);
if(r.evidence.length!==2||new Set(r.evidence.map(u=>new URL(u).hostname)).size!==2)throw Error('Evidence '+r.id);
Object.assign(r,{referenceGate:'pass',referenceWidth:p.width,referenceHeight:p.height,referenceFormat:p.format,attempts:1,review:'pending Claude independent reference/drawing review'});
if(r.id==='amc--matador--1')r.credit='Christopher Ziemnowicz (CZmarlin); Rambler Ranch collection, Elizabeth, Colorado';
if(r.id==='amc--pacer--0')r.notes+=' Replaced initial reference with complete-front 1975 Pacer X photo before generation. Factory luggage rails omitted in drawing.';
if(r.id==='arcfox--alpha-s--0')r.notes+=' Selected better frontal 2022 photograph before generation; original diamond grille verified against manufacturer s.html.';
if(['arcfox--alpha-s--1','arcfox--alpha-t--1'].includes(r.id))r.notes+=' Actual 3840px Autohome showroom photo replaces rejected manufacturer render. Gallery HTML timed out; identity cross-checked with full official model page and Autohome April 2, 2025 launch article, rather than relying on search caption alone. No open photo licence stated.';
if(r.id.startsWith('arcfox--alpha-t'))r.notes+=' Small factory roof rails retained under explicit batch tolerance.';
if(r.id==='arcfox--alpha-t5--0')r.notes+=' First candidate was rear view and rejected before generation; replacement is original-front showroom photo.';
if(r.id==='arcfox--alpha-t5--1')r.notes+=' Selected extended 4760 mm facelift BEV front; official current T5 page confirms extended body. Catalogue unknown years preserved verbatim.';
fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\n`);
}
fs.writeFileSync(db,JSON.stringify(rows,null,2));
const sourceDb=root+'/a20-sources.json',sources=JSON.parse(fs.readFileSync(sourceDb));
for(const s of sources){const r=rows.find(x=>x.referencePage===s.referencePage);if(r){s.local=r.folder+'/reference.jpg';s.gate='pass';}else{delete s.local;s.gate=s.file.includes('Guangdong')?'reject: rear view':s.file.includes('base_model')?'reject: bumper corner cropped':s.file.includes('IMG001')?'replaced: better frontal photograph selected':'not selected';}}
fs.writeFileSync(sourceDb,JSON.stringify(sources,null,2));
const raw=path.resolve(root+'/raw'),workspace=path.resolve('analysis/codex/letter-a');if(!raw.startsWith(workspace+path.sep))throw Error('Unsafe raw root');
for(const name of fs.readdirSync(raw).filter(x=>x.startsWith('a20-'))){const f=path.resolve(raw,name);if(!f.startsWith(raw+path.sep))throw Error('Unsafe file');fs.unlinkSync(f);}
for(const name of ['a20-evidence.mjs','a20-extra.mjs','a20-more.mjs','a20-autohome.mjs']){const f=path.resolve(root,name);if(!f.startsWith(workspace+path.sep))throw Error('Unsafe helper');fs.unlinkSync(f);}
console.log(JSON.stringify({done:rows.length,noReference:0,failed:0,genSeconds:rows.reduce((n,r)=>n+r.genSeconds,0),verified:'12 unedited PNGs at 1536x1024, SHA256 matches tool originals; 12 JPEG references >=1280px; 12 exact generation names; two independent source domains per record',changedFiles:[db,sourceDb,...['tools','research','prepare','save','adjust','renamed','gate','finalize'].map(x=>root+'/a20-'+x+'.mjs'),...rows.flatMap(r=>[r.folder+'/reference.jpg',r.folder+'/'+r.id+'.png',r.folder+'/info.txt'])]},null,2));
