import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
const root='analysis/codex/letter-a',db=root+'/a-19-results.json',rows=JSON.parse(fs.readFileSync(db));
for(const r of rows){
 if(r.status==='no-reference'){
  Object.assign(r,{referenceGate:'reject',notes:'Searched Wikimedia VAM Gremlin category and named files, web queries VAM Gremlin front/frente, Club Rambler Mexico history and VAM Gremlin history. Mexico/RalfR photo is rear three-quarter; Mazatlan file explicitly has uncertain AMC Spirit versus VAM identity; club 1974 photo is side-on; 1976 brochure image is only 211px wide and does not resolve both headlamps and bumper corners. No image generated.',searched:['https://commons.wikimedia.org/wiki/Category:VAM_Gremlin','https://commons.wikimedia.org/wiki/File:15-07-16-Straszenszenen-Mexico-RalfR-WMA_1074.jpg','https://commons.wikimedia.org/wiki/File:VAM_Gremlin_in_Mazatlan.jpg','https://clubramblermexico.org/historia-vam/','https://clubramblermexico.org/wp-content/uploads/club-rambler/images/historia/29.jpg','https://clubramblermexico.org/wp-content/uploads/club-rambler/images/historia/31.jpg','https://vamramblermexico.foroactivo.mx/t11-historia-del-vam-gremlin-y-gremlin-x-1974-a-1983']});continue;
 }
 if(r.status!=='done')throw Error('Incomplete '+r.id);
 const png=r.folder+'/'+r.id+'.png',m=await sharp(png).metadata(),refPath=r.folder+'/reference.jpg';
 let ref=await sharp(refPath).metadata();
 if(ref.format!=='jpeg'){const b=await sharp(refPath).jpeg({quality:95}).toBuffer();fs.writeFileSync(refPath,b);ref=await sharp(refPath).metadata();r.notes+=' Reference PNG encoded as JPEG without cropping for required reference.jpg filename; drawing untouched.';}
 if(m.width!==1536||m.height!==1024||m.format!=='png'||ref.width<1000)throw Error('Dimensions '+r.id);
 const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');if(hash(png)!==hash(r.generatedSource))throw Error('Edited drawing '+r.id);
 Object.assign(r,{referenceGate:'pass',referenceWidth:ref.width,view:(r.id==='amc--eagle--0'?'Head-on':'Front three-quarter')+'; complete front, both headlights, bumper corners and bonnet visible. Omit wipers, antenna, plates, show cards, auxiliary bumper lights and glass contents. Factory trim retained.'});
 if(r.id==='amc--hornet--0')r.variant='Early 1970–1972 Hornet four-door sedan; small round integrated grille lamps. Exact individual model year not claimed; selected early appearance within catalogue family.';
 if(r.id==='amc--marlin--1'){r.variant='1967 Marlin red fastback at right in two-car photograph; larger Ambassador-based body. Both photographed cars have the same generation front; factory integrated grille rally lamps retained.';r.notes+=' Reference includes two same-generation cars; output contains one car.';}
 if(r.id==='amc--eagle--0'||r.id==='amc--gremlin--0')r.notes+=' Small factory roof rails retained under explicit batch tolerance.';
 if(r.id==='amc--javelin--1'||r.id==='amc--matador--0')r.notes+=' Wikimedia rate limits encountered; final CC BY 2.0 photo downloaded from photographer Flickr original page at 1024px.';
 const info=`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\n`;
 fs.writeFileSync(r.folder+'/info.txt',info);
 if(r.evidence.length!==2||!info.includes('Generace: '+r.generation))throw Error('Metadata '+r.id);
}
const sourceDb=root+'/a19-sources.json',sources=JSON.parse(fs.readFileSync(sourceDb));
const allowed=path.resolve(root+'/raw')+path.sep;
for(const s of sources){
 if(s.local){const p=path.resolve(s.local);if(!p.startsWith(allowed))throw Error('Unsafe cleanup '+p);if(fs.existsSync(p))fs.unlinkSync(p);}
 const chosen=rows.find(r=>r.referencePage===s.referencePage);
 if(chosen){s.local=chosen.folder+'/reference.jpg';s.gate='pass';}else{delete s.local;s.gate=s.error?'download failed: '+s.error:s.file.includes('1074')?'reject: rear view':s.file.includes('660_4-d')?'reject: doll obscures front corner':'reject: raised bonnet';}
}
for(const name of ['a19-reference-sheet.png','a19-evidence-sheet.png']){const p=path.resolve(root+'/raw/'+name);if(!p.startsWith(allowed))throw Error('Unsafe');if(fs.existsSync(p))fs.unlinkSync(p);}
fs.writeFileSync(sourceDb,JSON.stringify(sources,null,2));fs.writeFileSync(db,JSON.stringify(rows,null,2));
console.log(JSON.stringify({done:rows.filter(x=>x.status==='done').length,noReference:rows.filter(x=>x.status==='no-reference').length,generationSeconds:rows.reduce((n,r)=>n+r.genSeconds,0),verification:'11 PNGs 1536x1024, SHA256 matches unedited tool output; 11 JPEG references >=1000px; exact generation strings and two evidence URLs present',changedFiles:[db,sourceDb,...['tools','prepare','save','external','finalize'].map(x=>root+'/a19-'+x+'.mjs'),...rows.filter(r=>r.status==='done').flatMap(r=>[r.folder+'/reference.jpg',r.folder+'/'+r.id+'.png',r.folder+'/info.txt'])]},null,2));
