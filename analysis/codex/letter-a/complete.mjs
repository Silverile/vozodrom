import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import crypto from 'node:crypto';
import {cars,root} from './batch.mjs';
const generated='C:/Users/Sevedge Anywhere/.codex/generated_images/01a18a01-7435-7661-9c24-5285cb28f332/';
const rows=JSON.parse(fs.readFileSync(root+'/a-01-results.json','utf8'));
const get=id=>rows.find(r=>r.id===id);
const historical='https://www.historics.co.uk/auction/lot/lot-219---1952-ac-2-litre-saloon/?lot=11741';
const litre=get('ac-cars--2-litre--0');litre.evidence[1]=historical;
for(const file of ['reference-audit.json','info.txt']){
 const p=litre.folder+'/'+file;let s=fs.readFileSync(p,'utf8');s=s.replace('https://commons.wikimedia.org/wiki/File:1951_AC_2_litre_Saloon_(46476057224).jpg',historical);fs.writeFileSync(p,s);
}
const brook=get('ac-cars--brooklands-ace--0');
const retry='exec-8cf4511d-731b-4ad2-a270-18119fd24612.png';
const retryPath=root+'/raw/ac-cars--brooklands-ace--0.retry.png';
if(!fs.existsSync(retryPath))fs.copyFileSync(generated+retry,retryPath,fs.constants.COPYFILE_EXCL);
if(!fs.existsSync(brook.folder+'/ac-cars--brooklands-ace--0.retry.png'))fs.copyFileSync(generated+retry,brook.folder+'/ac-cars--brooklands-ace--0.retry.png',fs.constants.COPYFILE_EXCL);
brook.retryOutput=retryPath;brook.retryOriginalOutput=generated+retry;
brook.genSeconds=43.849;brook.notes='One regeneration because first output retained reflected arcs below headlights. Retry removes arcs but adds elongated lower-bumper contours absent from reference. Both are unedited; primary ID.png preserved without overwrite. Claude must choose or reject. First 16.949 s; retry approximately 26.9 s. Framing about 78%.';
const rejected=root+'/rejected';fs.mkdirSync(rejected,{recursive:true});
const attempts=[['ac-cars--10-hp--0.first.png','exec-ce4aa917-05b1-4be5-a767-2ce6d79e1a1c.png'],['ac-cars--10-hp--0.retry.png','exec-3b9cb534-7c29-4154-a8ca-a785f4a15746.png'],['ac-cars--cobra--1.first.png','exec-834d3192-894b-4631-a54d-edfffd4949f9.png']];
for(const [to,from] of attempts)if(!fs.existsSync(rejected+'/'+to))fs.copyFileSync(generated+from,rejected+'/'+to,fs.constants.COPYFILE_EXCL);
const incomplete=[
 ['ac-cars--10-hp--0','failed','https://commons.wikimedia.org/wiki/File:AC_Ten_horsepower_circa_1914.jpg','CC BY-SA 3.0',['https://commons.wikimedia.org/wiki/File:AC_Ten_horsepower_circa_1914.jpg','https://ac.cars/history/'],'Circa 1914 Ten open two-seater','front three-quarter',27.471,'Two ImageGen attempts rejected. First invents tall windscreen/front lamps; retry retains tall windscreen, adds filled reflective radiator area and omits separate mirrors. No accepted ID.png. Attempts archived under rejected/. Retry budget exhausted.'],
 ['ac-cars--12-hp--0','failed','https://commons.wikimedia.org/wiki/File:AC_Royal1926AnzaniKL.jpg',null,[],'1926 Royal Anzani candidate, not visually verified',null,null,'No generation. Commons image HTTP 429, Retry-After 600 seconds (last diagnostic 2026-10-29 23:48:42 UTC). Candidate metadata saved, reference not downloaded. Other candidate TU2852 rejected: Collecting Cars explicitly says front wings are not original. Search: AC 12hp / 1926 Royal Anzani; Commons category AC_12hp, Flickr XP5970, Collecting Cars TU2852, Bonhams TN4042. Resume reference gate after cooldown.'],
 ['ac-cars--auto-carrier--0','no-reference','https://rmsothebys.com/auctions/hf14/lots/r151-1912-autocarrier-delivery-box-van/',null,['https://rmsothebys.com/auctions/hf14/lots/r151-1912-autocarrier-delivery-box-van/','https://collection.sciencemuseumgroup.org.uk/people/ap25931/auto-carriers-1911-ltd'],'1912 delivery box van candidate, chassis 1683','side-biased front three-quarter (rejected)',null,'No generation. Commons EL3662 is a Sociable passenger tricar despite delivery-category caption, rejected. RM chassis1683 photographs inspected show only one clear front corner; not a complete front. Owner Flymall blocked by geographic firewall. Searched Auto-Carrier delivery 1904/1910/1912, Commons category, RM Hershey 2014, Bonhams Bothwell 2017, Science Museum, Flymall. No inspected photo passed full-front gate.'],
 ['ac-cars--brooklands-ace--1','no-reference','https://www.brooklandscarsltd.com/ac-brooklands-ace-prototype',null,['https://www.brooklandscarsltd.com/ac-brooklands-ace-prototype'],'1997 R200ACE prototype, rejected view','side view (rejected)',null,'No generation. Documented 1997 prototype photo is side view; red 1999 showcar/2010 registration photo is too side-biased with far headlamp hidden. Alternate Commons A.C._Ace_V8_(51235480092).jpg download returned 429. Searched Commons Brooklands Ace category, AC Owners Club, Brooklands Cars prototype, 1998 Ace V8 brochures and manufacturer/period model histories. No inspected reference passed.'],
 ['ac-cars--cobra--0','failed','https://commons.wikimedia.org/wiki/File:1962_Shelby_Cobra_260_HC26.jpg',null,[],'1962 260 candidate, pending download',null,null,'No generation. Desired street 260 reference download HTTP429, Retry-After600. Saved reference.jpg is an explicitly rejected earlier 1962 competition hardtop candidate, not the desired HC26 image. Do not generate from it. CSX2105 Commons MkII caption conflicts with primary auction evidence identifying MkI with steering conversion; rejected for MkII. Searched Commons Shelby Cobra/AC Cobra categories, Shelby American Collection, AC manufacturer history, Mecum CSX2105 and 1962 260 Heveningham reference. Resume full gate after cooldown.']
];
for(const [id,status,referencePage,licence,evidence,variant,view,genSeconds,notes] of incomplete){const c=cars.find(c=>c.id===id);rows.push({id,status,folder:c.folder,referencePage,licence,evidence,variant,view,genSeconds,notes});fs.mkdirSync(c.folder,{recursive:true});if(status!=='failed'||id!=='ac-cars--10-hp--0')fs.writeFileSync(c.folder+'/reference-audit.json',JSON.stringify({id,gate:'not passed',status,referencePage,evidence,variant,view,notes},null,2));}
for(const c of cars){const r=get(c.id);r.generation=c.generation;r.years=c.years;r.externalFolder=`C:/Workspace/Projects/CF/vozodrom-data/front-photos/ac-cars/${c.id} ${c.short}`;}
rows.sort((a,b)=>cars.findIndex(c=>c.id===a.id)-cars.findIndex(c=>c.id===b.id));
for(const [id,seconds] of [['ac-cars--3000me--0',13.563],['ac-cars--ace--0',20.001],['ac-cars--aceca--0',27.326],['ac-cars--2-litre--0',14.101],['ac-cars--cobra--1',37.079]])get(id).genSeconds=seconds;
fs.writeFileSync(root+'/a-01-results.json',JSON.stringify(rows,null,2));
const base=fs.readFileSync('analysis/codex/abarth-drawings/prompt.txt','utf8').trim();
fs.writeFileSync(root+'/prompt-set.json',JSON.stringify(rows.filter(r=>r.genSeconds!==null).map(r=>({id:r.id,prompt:base+`\nAC Cars ${r.generation} (${r.years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`})),null,2));
// Convert downloaded WebP candidates to actual JPEG; preserve source bytes. Drawings remain untouched.
for(const c of cars){const p=c.folder+'/reference.jpg';if(!fs.existsSync(p))continue;const b=fs.readFileSync(p);const m=await sharp(b).metadata();if(m.format==='webp'){if(!fs.existsSync(c.folder+'/reference-original.webp'))fs.writeFileSync(c.folder+'/reference-original.webp',b);fs.writeFileSync(p,await sharp(b).jpeg({quality:100}).toBuffer());}}
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const validation=[];
for(const r of rows){if(r.status!=='done')continue;const c=cars.find(c=>c.id===r.id),raw=root+'/raw/'+r.id+'.png';const image=await sharp(raw).metadata();const ref=await sharp(c.folder+'/reference.jpg').metadata();const info=fs.readFileSync(c.folder+'/info.txt','utf8');const checks={id:r.id,png:image.format==='png',size:image.width===1536&&image.height===1024,originalHashMatches:hash(raw)===hash(r.originalOutput),stagedHashMatches:hash(raw)===hash(c.folder+'/'+r.id+'.png'),referenceWidth:ref.width,referenceJpeg:ref.format==='jpeg',exactGeneration:info.includes('Generace: '+c.generation),twoEvidence:r.evidence.length===2};validation.push(checks);}
fs.writeFileSync(root+'/validation.json',JSON.stringify(validation,null,2));
console.log(JSON.stringify({counts:rows.reduce((a,r)=>(a[r.status]=(a[r.status]||0)+1,a),{}),validation},null,2));
