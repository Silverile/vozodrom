import fs from 'node:fs';
import crypto from 'node:crypto';
import sharp from 'sharp';
const root='analysis/codex/letter-a',db=root+'/a-08-results.json',rows=JSON.parse(fs.readFileSync(db));
function info(r){fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\n`);}
if(process.argv[2]==='prepare500'){
 const r=rows.find(x=>x.id==='aixam--500--0');Object.assign(r,{folder:root+'/staged/aixam/aixam--500--0 500 SL',referencePage:'https://commons.wikimedia.org/wiki/File:Aixam_SL_500_Auto_Diesel_-_Flickr_-_mick_-_Lumix.jpg',image:'https://1h7pzy2cfanp1hpv.public.blob.vercel-storage.com/img/aixam-sl-500-green-uk-1600.2e7b85b9e5.jpg',credit:'Mick from Northamptonshire, England (mick / Lumix); licensed Commons photograph mirrored by microcarfan.com',licence:'CC BY-SA 2.0',licenceUrl:'https://creativecommons.org/licenses/by-sa/2.0/',evidence:['https://commons.wikimedia.org/wiki/File:Aixam_SL_500_Auto_Diesel_-_Flickr_-_mick_-_Lumix.jpg','https://archives-catalogues-automobiles.fr/laurentbunnik/0aix0001.html'],view:'Front three-quarter; both headlights, complete bonnet and both bumper ends visible. Remove windscreen card, side graphics, antenna and characters.',referenceMirrorPage:'https://microcarfan.com/aixam/',notes:'Commons original returned HTTP 429; fallback copy downloaded from openly accessible credited mirror, 1600px wide. Reference passed view gate.'});fs.mkdirSync(r.folder,{recursive:true});fs.copyFileSync(root+'/raw/a08-500-mirror.jpg',r.folder+'/reference.jpg');info(r);
 const car=rows.find(x=>x.id==='aixam--500--0');car.promptSuffix=`Aixam ${car.generation} (${car.years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`;
}else{
 for(const r of rows){
  if(r.status!=='done')continue;
  const file=r.folder+'/'+r.id+'.png',hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
  if(hash(file)!==hash(r.generatedSource))throw Error('Altered image '+r.id);
  const m=await sharp(file).metadata();if(m.width!==1536||m.height!==1024)throw Error('Dimensions');
  r.referenceWidth=(await sharp(r.folder+'/reference.jpg').metadata()).width;
  r.notes='One built-in image_gen call, no regeneration; unedited output. Visually inspected: correct front generation/body layout, no readable text or plates, no wipers, no big add-ons; empty glass for enclosed cars. Minor lamp/grille/emblem differences accepted.';
  if(r.id==='adler--vis-a-vis--1')r.notes+=' Factory open vis-a-vis seating and steering wheel remain because there is no glass; original car has no door mirrors. Source width 745px.';
  if(r.id==='aixam--500--0'){r.attempts=2;r.genSeconds=27.320;r.notes='Two built-in image_gen calls: initial call missed the generation suffix due to prompt assembly error; corrected second call used the exact required suffix and is retained. Both visually passed; retained PNG is unedited. First output archived at rejected/a08-500-missing-suffix.png. Commons download rate-limited; used credited 1600px mirror at '+r.referenceMirrorPage;}
  if(r.id==='aixam--325-d--0')r.view='Front three-quarter; both headlamps, full bonnet and bumper ends visible. No major accessories. Original only 800px wide.';
  info(r);const txt=fs.readFileSync(r.folder+'/info.txt','utf8');if(!txt.includes('Generace: '+r.generation+'\n')||r.evidence.length<2)throw Error('Metadata');
  console.log(r.id+' done '+r.referenceWidth+'px reference, 1536x1024 PNG, SHA256 matches original');
 }
 console.log('Counts',rows.reduce((a,r)=>(a[r.status]=(a[r.status]||0)+1,a),{}));
}
fs.writeFileSync(db,JSON.stringify(rows,null,2));
