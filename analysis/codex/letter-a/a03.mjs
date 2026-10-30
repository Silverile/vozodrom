import fs from 'node:fs';
import sharp from 'sharp';
import crypto from 'node:crypto';
const root='analysis/codex/letter-a',out=root+'/a-03-results.json';
const chrono='https://acuranews.com/en-US/releases/release-6cd08e1213f4f2aca52228004c34c087-acura-model-chronology';
const canada='https://global.honda/en/newsroom/worldnews/2007/4070214Acura-Canada.html';
const specs=[
['cl--1','CL','II — MY2001–2003','2000–2003','CL II','01-03 Acura CL.jpg','2001–2003 standard 3.2CL coupe, original front',chrono],
['csx--0','CSX','CSX — MY2006–2011','2005–2011','CSX',"\'07 Acura CSX.JPG",'2007 standard sedan, pre-facelift','https://hondanews.ca/en-CA/releases/release-519a23469582d80780152ae42308eed7-2006-csx-press-kit'],
['el--0','EL','I — 1.6EL','1997–2000','EL I','Acura EL (7242230212).jpg','First-generation 1.6EL sedan',canada],
['el--1','EL','II — 1.7EL','2001–2005','EL II','2002 Acura 1.7 EL Premium, Front Right, 07-13-2020.jpg','2002 1.7EL Premium sedan, pre-facelift',canada],
['ilx--0','ILX','ILX','2012–2022','ILX','2017 Acura ILX front 4.1.17.jpg','2017 sedan, middle 2016–2018 facelift; long-running family has three front designs',chrono],
['integra--0','Integra','I — MY1986–1989','?–?','Integra I','1st Acura Integra -- 03-31-2012.JPG','First-generation 3-door hatchback, retractable headlights closed',chrono],
['integra--1','Integra','II — MY1990–1993','?–?','Integra II','1990-91 Acura Integra RS 3-door, front right.jpg','1990–1991 RS 3-door hatchback, pre-facelift',chrono],
['integra--2','Integra','III — MY1994–2001','?–?','Integra III','3RD-Acura-Integra.jpg','Third-generation US-spec 3-door hatchback, four round headlights',chrono],
['integra--3','Integra','Obnovená řada — MY2023 a další','2022–?','Integra DE4','2023 Acura Integra, front 4.4.23.jpg','2023 standard liftback, original DE4 front','https://acuranews.com/en-US/releases/2023-acura-integra-press-kit'],
['legend--0','Legend','I — MY1986–1990','?–1990','Legend I','1986 Acura Legend LS 2017.7.24.jpg','1986 LS sedan, original front',chrono],
['legend--1','Legend','II — MY1991–1995','1990–1995','Legend II','2nd Acura Legend sedan -- 12-06-2011.jpg','Second-generation KA7 sedan',chrono],
['mdx--0','MDX','I — MY2001–2006','2000–2006','MDX I','Acura MDX 2003 (12397317724).jpg','2003 YD1 SUV, pre-facelift',chrono]
];
let rows=fs.existsSync(out)?JSON.parse(fs.readFileSync(out,'utf8')):specs.map(([key,model,generation,years,short,file,variant,evidence])=>({id:'acura--'+key,make:'Acura',model,generation,years,folder:`${root}/staged/acura/acura--${key} ${short}`,status:'failed',referencePage:'https://commons.wikimedia.org/wiki/File:'+file.replaceAll(' ','_'),licence:null,evidence:['https://commons.wikimedia.org/wiki/File:'+file.replaceAll(' ','_'),evidence],variant,view:'pending visual gate',genSeconds:null,notes:'Not generated',file}));
const save=()=>fs.writeFileSync(out,JSON.stringify(rows,null,2));
const [mode,key,arg,seconds,notes]=process.argv.slice(2),r=rows.find(x=>x.id===key);
if(mode==='init')save();
if(mode==='fetch')for(const c of rows){
 const h=await(await fetch(c.referencePage)).text();
 c.image=h.match(/class="fullImageLink"[^>]*>\s*<a href="([^"]+)"/)?.[1]?.replaceAll('&amp;','&').split('?')[0];
 const plain=h.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ');
 c.credit=plain.match(/Author\s+(.{1,180}?)(?: Permission| Licensing| Camera location| Other versions|\bThis file)/)?.[1]?.trim()||'See source page';
 c.licence=/public domain/i.test(plain)?'Public domain':/Attribution-Share Alike 4.0/.test(plain)?'CC BY-SA 4.0':/Attribution-Share Alike 3.0/.test(plain)?'CC BY-SA 3.0':/Attribution 2.0/.test(plain)?'CC BY 2.0':null;
 c.licenceUrl=c.licence==='Public domain'?'https://commons.wikimedia.org/wiki/Template:PD-self':c.licence==='CC BY-SA 4.0'?'https://creativecommons.org/licenses/by-sa/4.0/':c.licence==='CC BY-SA 3.0'?'https://creativecommons.org/licenses/by-sa/3.0/':c.licence==='CC BY 2.0'?'https://creativecommons.org/licenses/by/2.0/':c.referencePage;
 console.log(JSON.stringify({id:c.id,image:c.image,credit:c.credit,licence:c.licence,description:plain.match(/Description\s+(.{1,400})/)?.[1]}));
 fs.mkdirSync(c.folder,{recursive:true});
 if(c.image){let resp=await fetch(c.image);if(resp.status===429){await new Promise(t=>setTimeout(t,Math.max(5000,Number(resp.headers.get('retry-after')||5)*1000)));const u=new URL(c.image),parts=u.pathname.split('/');parts.splice(3,0,'thumb');u.pathname=parts.join('/')+'/1280px-'+parts.at(-1);resp=await fetch(u);}if(resp.ok){fs.writeFileSync(c.folder+'/reference.jpg',Buffer.from(await resp.arrayBuffer()));c.referenceWidth=(await sharp(c.folder+'/reference.jpg').metadata()).width;}else c.notes='Reference download HTTP '+resp.status;}
 save();await new Promise(t=>setTimeout(t,5100));
}
if(mode==='gate'){Object.assign(r,{view:'front three-quarter; grille, both headlights, both bumper corners and bonnet visible',referenceGate:'passed; independent Claude review pending',notes:arg||'Factory exterior; remove wipers, lettering and interior. No visible add-on front accessories.'});fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\nNotes: ${r.notes}\n`);save();}
if(mode==='finish'){fs.copyFileSync(arg,r.folder+'/'+r.id+'.png',fs.constants.COPYFILE_EXCL);Object.assign(r,{status:'done',originalOutput:arg,genSeconds:Number(seconds),notes,review:'pending Claude independent review'});save();}
if(mode==='reject'){fs.mkdirSync(root+'/rejected',{recursive:true});r.attempts??=[];const dest=root+'/rejected/a03-'+r.id+'.'+(r.attempts.length?'retry':'first')+'.png';fs.copyFileSync(arg,dest,fs.constants.COPYFILE_EXCL);r.attempts.push({file:dest,seconds:Number(seconds)});Object.assign(r,{status:'failed',genSeconds:r.attempts.reduce((s,a)=>s+a.seconds,0),notes});save();}
if(mode==='status'){Object.assign(r,JSON.parse(arg));save();}
if(mode==='prompt')console.log(fs.readFileSync('analysis/codex/abarth-drawings/prompt.txt','utf8')+`\nAcura ${r.generation} (${r.years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`);
if(mode==='validate')for(const c of rows.filter(x=>x.status==='done')){const p=c.folder+'/'+c.id+'.png',m=await sharp(p).metadata(),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');console.log(JSON.stringify({id:c.id,format:m.format,width:m.width,height:m.height,referenceWidth:c.referenceWidth,unedited:hash(p)===hash(c.originalOutput),exactGeneration:fs.readFileSync(c.folder+'/info.txt','utf8').includes('Generace: '+c.generation),evidence:c.evidence.length}));}
