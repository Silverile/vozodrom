import fs from 'node:fs';
import crypto from 'node:crypto';
import sharp from 'sharp';
const root='analysis/codex/letter-a',db=root+'/a-13-results.json',rows=JSON.parse(fs.readFileSync(db));
for(const r of rows){
 if(r.status!=='done')throw Error('Incomplete '+r.id);
 if(r.id==='alpina--b10--1'){
  r.licence='Copyright; no open licence stated';r.licenceUrl=r.referencePage;
  r.notes+=' Commons candidates rejected before generation (side view/open bonnet/engine detail); closed-bonnet HSG specialist-dealer photo used. No open licence is stated.';
 }
 if(r.id==='alfa-romeo--spider--0')r.notes+=' Undated catalogue family represented by Series 2 2000 Veloce, the highest-production classic Spider series, top lowered. Catalogue years remain ?–?.';
 if(r.id==='alpina--b11--0')r.notes+=' Photo source confirms B11 but does not identify displacement; no 3.5/4.0 engine assertion made.';
 if(r.id==='alpina--b10--3'){
  r.variant='E39 B10 3.2 sedan, photographed later-style headlamps; omit nonstandard mesh wheels';
  r.notes+=' Reference has mesh wheels and later-style headlamps; catalogue E39 family spans both front appearances. Drawing uses front tyre outlines and no visible mesh wheels.';
 }
 if(r.id==='alpina--b12--0')r.notes+=' First source rejected for side view; replaced by complete front three-quarter photograph.';
 if(r.id==='alpina--b12--2')r.notes+=' First E38 candidate replaced because a foreground pole overlapped the bumper corner.';
 r.referenceGate={status:'pass',identity:'Saved photo-source description and independent manufacturer history or Alpina Archive registry',view:'Complete front three-quarter, grille, both headlamp assemblies, both front corners and bonnet visible',reviewedBeforeGeneration:true};
 const png=r.folder+'/'+r.id+'.png',m=await sharp(png).metadata(),ref=await sharp(r.folder+'/reference.jpg').metadata();
 if(m.width!==1536||m.height!==1024||m.format!=='png'||ref.width<1000)throw Error('Dimensions '+r.id);
 const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
 if(hash(png)!==hash(r.generatedSource))throw Error('Edited image '+r.id);
 if(r.evidence.length<2)throw Error('Evidence '+r.id);
 fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\n`);
 console.log(r.id+' | done | '+ref.width+'px reference | 1536x1024 PNG | SHA256 unchanged');
}
fs.writeFileSync(db,JSON.stringify(rows,null,2));
const sources=JSON.parse(fs.readFileSync(root+'/a13-sources.json'));
fs.writeFileSync(root+'/a13-sources.json',JSON.stringify(rows.map(r=>({...sources.findLast(s=>s.referencePage===r.referencePage&&s.local),local:r.folder+'/reference.jpg'})),null,2));
const raw=root+'/raw',prefix=fs.realpathSync(raw);
for(const name of fs.readdirSync(raw).filter(n=>n.startsWith('a13-'))){
 const path=raw+'/'+name;
 if(!fs.realpathSync(path).startsWith(prefix+String.fromCharCode(92)))throw Error('Cleanup outside raw directory');
 if(fs.statSync(path).isFile())fs.unlinkSync(path);
}
console.log('TOTAL '+rows.length+' done; generation seconds '+rows.reduce((s,r)=>s+r.genSeconds,0).toFixed(3));
