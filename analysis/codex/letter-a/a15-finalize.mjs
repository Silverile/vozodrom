import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
const root='analysis/codex/letter-a', db=root+'/a-15-results.json', rows=JSON.parse(fs.readFileSync(db));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const r of rows){
 if(r.id==='alpina--b6--3'){r.evidence[1]='https://www.alpina-archive.com/?page_id=197';r.notes+=' Factory B6 S bonnet vents retained.';}
 if(r.id==='alpina--b7--0')r.notes+=' Catalogue years remain unknown as supplied; reference is E65 facelift. Folded mirrors reconstructed symmetrically.';
 if(r.id==='alpina--b7--2')r.notes+=' Source description calls it G11; file title and category identify G12, corroborated by Alpina Archive G12 B7 family.';
 if(r.id==='alpina--b7-turbo--0')r.notes+=' Minor lower-bumper lamp/opening simplification retained under batch acceptance tolerance.';
 const info=`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\n`;
 fs.writeFileSync(r.folder+'/info.txt',info);
 const file=r.folder+'/'+r.id+'.png',m=await sharp(file).metadata(),ref=await sharp(r.folder+'/reference.jpg').metadata();
 if(r.status!=='done'||m.format!=='png'||m.width!==1536||m.height!==1024||hash(file)!==hash(r.generatedSource)||r.evidence.length!==2||ref.width<1000||!info.includes('Generace: '+r.generation+'\n'))throw Error(r.id+' validation failed');
 console.log(r.id,'done',m.width+'x'+m.height,'reference',ref.width,'SHA256 matches original',r.licence);
}
fs.writeFileSync(db,JSON.stringify(rows,null,2));
const sourceDb=root+'/a15-sources.json',sources=JSON.parse(fs.readFileSync(sourceDb));
for(const s of sources){const r=rows.find(x=>x.referencePage===s.referencePage);if(r){s.local=r.folder+'/reference.jpg';s.gate='pass';}else {delete s.local;s.gate=/1X7A6667|Tokyo|DSC_7641|Washington_DC/.test(s.file)?'reject: rear view':s.file==='BMW_Alpina_B6_2.4.18.jpg'?'reject: too side-on':s.file==='Alpina_B7_Bi-Turbo_Langversion_IMG_0831.jpg'?'reject: far headlamp hidden at low angle':'unused alternative';}}
fs.writeFileSync(sourceDb,JSON.stringify(sources,null,2));
const raw=path.resolve(root,'raw'),workspace=path.resolve(process.cwd());if(!raw.startsWith(workspace+path.sep))throw Error('Outside workspace');
for(const name of fs.readdirSync(raw)){if(name.startsWith('a15-'))fs.unlinkSync(path.join(raw,name));}
console.log('TOTAL',rows.length,'done; generation seconds',rows.reduce((n,r)=>n+r.genSeconds,0));
console.log('FILES',JSON.stringify([...fs.readdirSync(root).filter(f=>/^a15-|^a-15-/.test(f)).map(f=>root+'/'+f),...rows.flatMap(r=>[r.folder+'/reference.jpg',r.folder+'/'+r.id+'.png',r.folder+'/info.txt'])]));
