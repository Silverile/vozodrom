import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
const root='analysis/codex/letter-a',db=root+'/a-16-results.json',rows=JSON.parse(fs.readFileSync(db));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const r of rows){
 if(r.id==='alpina--b9--1')r.variant='E24/1 B9 3.5 Coupe/1, 1984, within the 1982–1985 coupe family';
 if(r.id==='alpina--c1--0')r.notes+=' E21 front and factory spoiler retained; small bumper/grille simplifications accepted.';
 if(r.id==='alpina--c1--1')r.notes+=' Early C1 2.3/1 selected for combined 2.3/2.5 family.';
 if(r.id==='alpina--c2--0')r.notes+=' C2 2.7 four-door sedan selected for combined 2.5/2.7 family; open-bonnet alternative rejected.';
 if(r.id==='alpina--d3--2')r.notes+=' Original 2022 G21 Touring selected; rally decals omitted. Minor grille and lamp-element simplifications accepted.';
 if(r.id==='alpina--d4--1')r.notes+=' Later front selected from source labelled 2024; small lamp-element simplification retained under batch acceptance tolerance.';
 if(r.id==='alpina--d5--0')r.notes+=' Commons F10/F11 candidates rejected for rear/side or far-headlamp occlusion. BMWCoop launch photograph passes geometry gate. Photograph licence and photographer are not stated; no open licence claimed. Reference is copyrighted material, for reference use.';
 const info=`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\n`;
 fs.writeFileSync(r.folder+'/info.txt',info);
 const file=r.folder+'/'+r.id+'.png',m=await sharp(file).metadata(),ref=await sharp(r.folder+'/reference.jpg').metadata();
 if(r.status!=='done'||m.format!=='png'||m.width!==1536||m.height!==1024||hash(file)!==hash(r.generatedSource)||r.evidence.length!==2||ref.width<1000||!info.includes('Generace: '+r.generation+'\n'))throw Error(r.id+' validation failed');
 console.log(r.id,'done',m.width+'x'+m.height,'reference',ref.width,'SHA256 matches original',r.licence);
}
fs.writeFileSync(db,JSON.stringify(rows,null,2));
const sourceDb=root+'/a16-sources.json',sources=JSON.parse(fs.readFileSync(sourceDb));
for(const s of sources){const r=rows.find(x=>x.referencePage===s.referencePage);if(r){s.local=r.folder+'/reference.jpg';s.gate='pass';}else {delete s.local;s.gate=s.error?'download failed after retry':/1988_Alpina_C2_2.7/.test(s.file)?'reject: open bonnet':/BMW_Alpina_C1.jpg|C1_2.3.jpg|6832191761|6832191799|6832191805|8544402247|8433112777|Touring_Auto.jpg|BiTurbo_Auto_1.jpg|09342|Coupe_Auto_1/.test(s.file)?'reject: rear view':/09331/.test(s.file)?'reject: cropped detail':'unused: less frontal or far headlamp obscured';}}
fs.writeFileSync(sourceDb,JSON.stringify(sources,null,2));
const raw=path.resolve(root,'raw'),workspace=path.resolve(process.cwd());if(!raw.startsWith(workspace+path.sep))throw Error('Outside workspace');
for(const name of fs.readdirSync(raw)){if(name.startsWith('a16-'))fs.unlinkSync(path.join(raw,name));}
console.log('TOTAL',rows.length,'done; one attempt each; generation seconds',rows.reduce((n,r)=>n+r.genSeconds,0));
console.log('FILES',JSON.stringify([...fs.readdirSync(root).filter(f=>/^a16-|^a-16-/.test(f)).map(f=>root+'/'+f),...rows.flatMap(r=>[r.folder+'/reference.jpg',r.folder+'/'+r.id+'.png',r.folder+'/info.txt'])]));
