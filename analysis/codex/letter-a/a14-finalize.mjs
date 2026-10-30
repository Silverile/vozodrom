import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import sharp from 'sharp';
const root='analysis/codex/letter-a',db=root+'/a-14-results.json',rows=JSON.parse(fs.readFileSync(db));
for(const r of rows){
 if(r.id==='alpina--b4--0')r.evidence[1]='https://www.alpina-archive.com/?page_id=16739';
 if(r.id==='alpina--b4--1')r.evidence[1]='https://www.press.bmwgroup.com/czech/article/detail/T0402971CS/nov%C3%A9-bmw-alpina-b4-gran-coup%C3%A9-na-%C4%8Desk%C3%A9m-trhu';
 if(r.id==='alpina--b2--0')r.notes+=' Source is copyright-protected (no open licence stated), original archive image is 716px wide; auxiliary lamps and decals omitted.';
 r.view='Front three-quarter; complete grille, both headlamp assemblies, bumper corners and bonnet visible. Omit wipers, antenna, plates, decals and glass contents; retain factory Alpina front spoiler.';
 const info=`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\n`;
 fs.writeFileSync(r.folder+'/info.txt',info);
 const p=r.folder+'/'+r.id+'.png',m=await sharp(p).metadata(),ref=await sharp(r.folder+'/reference.jpg').metadata();
 const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
 if(r.status!=='done'||m.format!=='png'||m.width!==1536||m.height!==1024||hash(p)!==hash(r.generatedSource)||r.evidence.length!==2||!info.includes('Generace: '+r.generation+'\n'))throw Error(r.id+' validation failed');
 console.log(r.id,'done',`${m.width}x${m.height}`,'reference',ref.width,'SHA256 matches original',r.licence);
}
fs.writeFileSync(db,JSON.stringify(rows,null,2));
const sources=JSON.parse(fs.readFileSync(root+'/a14-sources.json'));for(const s of sources){const r=rows.find(x=>x.referencePage===s.referencePage);if(r&&s.local)s.local=r.folder+'/reference.jpg';else delete s.local;}fs.writeFileSync(root+'/a14-sources.json',JSON.stringify(sources,null,2));
// Only unlink this turn's a14 raw intermediates inside the verified workspace.
const raw=path.resolve(root,'raw'),base=path.resolve(process.cwd());if(!raw.startsWith(base+path.sep))throw Error('Outside workspace');
for(const f of fs.readdirSync(raw)){if(f.startsWith('a14-'))fs.unlinkSync(path.join(raw,f));}
for(const f of ['a14-b2.mjs','a14-b2-gallery.mjs','a14-extra.mjs','a14-adjust.mjs'])fs.unlinkSync(path.join(root,f));
console.log('TOTAL',rows.length,'done; generation seconds',rows.reduce((n,r)=>n+r.genSeconds,0));
console.log('FILES',JSON.stringify([...fs.readdirSync(root).filter(f=>/^a14-|^a-14-/.test(f)).map(f=>root+'/'+f),...rows.flatMap(r=>[r.folder+'/reference.jpg',r.folder+'/'+r.id+'.png',r.folder+'/info.txt'])]));
