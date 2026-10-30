import fs from 'node:fs';
import sharp from 'sharp';
import crypto from 'node:crypto';
const root='analysis/codex/letter-a',out=root+'/a-04-results.json';
const chrono='https://acuranews.com/en-US/releases/release-6cd08e1213f4f2aca52228004c34c087-acura-model-chronology';
const canada='https://global.honda/en/newsroom/worldnews/2007/4070214Acura-Canada.html';
const specs=[
  [
    "mdx--1",
    "MDX",
    "II — MY2007–2013",
    "2006–2013",
    "MDX II",
    "2008-2009 Acura MDX, front view.jpg",
    "2008–2009 YD2 SUV, original pre-facelift front",
    "https://acuranews.com/en-US/releases/release-6cd08e1213f4f2aca52228004c34c087-acura-model-chronology"
  ],
  [
    "mdx--2",
    "MDX",
    "III — MY2014–2020",
    "2013–2020",
    "MDX III",
    "2014 Acura MDX Greenwich.jpg",
    "2014–2016 SUV, pre-facelift shield grille",
    "https://acuranews.com/en-US/releases/release-2a4a937df0b943c284e14f6d469348af-press-kit-2014-acura-mdx"
  ],
  [
    "mdx--3",
    "MDX",
    "IV — od MY2022",
    "2021–?",
    "MDX IV",
    "2022 Acura MDX Technology, front 7.2.22.jpg",
    "2022 Technology SUV, original fourth-generation front",
    "https://acuranews.com/en-US/releases/release-0d4299c7fc28e9f9054be9d007166845-2022-acura-mdx-press-kit"
  ],
  [
    "nsx--0",
    "NSX",
    "I — MY1991–2005",
    "1990–2005",
    "NSX I",
    "1991 Acura NSX, front left (Huntington).jpg",
    "1991 NA1 coupe, pre-facelift with pop-up headlights closed",
    "https://acuranews.com/en-US/releases/release-6cd08e1213f4f2aca52228004c34c087-acura-model-chronology"
  ],
  [
    "nsx--1",
    "NSX",
    "II — MY2017–2022",
    "2016–2022",
    "NSX II",
    "Orange Acura NSX front side.JPG",
    "Second-generation production coupe, original non-Type-S front",
    "https://acuranews.com/en-US/releases/2017-acura-nsx-press-kit"
  ],
  [
    "rdx--0",
    "RDX",
    "I — MY2007–2012",
    "2006–2012",
    "RDX I",
    "2007 Acura RDX -- NHTSA.jpg",
    "2007 TB1 SUV, pre-facelift",
    "https://acuranews.com/en-US/releases/release-6cd08e1213f4f2aca52228004c34c087-acura-model-chronology"
  ],
  [
    "rdx--1",
    "RDX",
    "II — MY2013–2018",
    "2012–2018",
    "RDX II",
    "2013 Acura RDX -- 06-24-2012 1.JPG",
    "2013 TB3/TB4 SUV, pre-facelift",
    "https://acuranews.com/en-US/releases/release-6cd08e1213f4f2aca52228004c34c087-acura-model-chronology"
  ],
  [
    "rdx--2",
    "RDX",
    "III — MY2019–2026",
    "2018–?",
    "RDX III",
    "2019 Acura RDX front in red 4.20.19.jpg",
    "2019 SUV, original third-generation non-A-Spec front",
    "https://acuranews.com/en-US/releases/release-7446fd541c684a32b2ba191dd13ec14b-2019-acura-rdx-press-kit-overview"
  ],
  [
    "rl--0",
    "RL",
    "I — 3.5RL, MY1996–2004",
    "?–?",
    "RL I",
    "1997 Acura RL 3.5 front 5.18.19.jpg",
    "1997 KA9 3.5RL sedan, pre-facelift",
    "https://acuranews.com/en-US/releases/release-6cd08e1213f4f2aca52228004c34c087-acura-model-chronology"
  ],
  [
    "rl--1",
    "RL",
    "II — MY2005–2012",
    "?–?",
    "RL II",
    "2005 Acura RL -- NHTSA.jpg",
    "2005 KB1 sedan, pre-facelift",
    "https://acuranews.com/en-US/releases/release-6cd08e1213f4f2aca52228004c34c087-acura-model-chronology"
  ],
  [
    "rlx--0",
    "RLX",
    "RLX — od MY2014",
    "2013–?",
    "RLX",
    "2014 Acura RLX in black.jpg",
    "2014 sedan, original pre-facelift front",
    "https://acuranews.com/en-US/releases/2014-acura-rlx-press-kit"
  ],
  [
    "rsx--0",
    "RSX",
    "RSX — MY2002–2006",
    "?–?",
    "RSX",
    "2002-2004 Acura RSX -- 03-16-2012.JPG",
    "2002–2004 coupe, pre-facelift",
    "https://acuranews.com/en-US/releases/release-6cd08e1213f4f2aca52228004c34c087-acura-model-chronology"
  ]
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
 c.licence=/public domain/i.test(plain)?'Public domain':/Attribution-Share Alike 4.0/.test(plain)?'CC BY-SA 4.0':/Attribution-Share Alike 3.0/.test(plain)?'CC BY-SA 3.0':/Attribution-Share Alike 2.0/.test(plain)?'CC BY-SA 2.0':/Attribution 2.0/.test(plain)?'CC BY 2.0':null;
 c.licenceUrl=c.licence==='Public domain'?'https://commons.wikimedia.org/wiki/Template:PD-self':c.licence==='CC BY-SA 4.0'?'https://creativecommons.org/licenses/by-sa/4.0/':c.licence==='CC BY-SA 3.0'?'https://creativecommons.org/licenses/by-sa/3.0/':c.licence==='CC BY-SA 2.0'?'https://creativecommons.org/licenses/by-sa/2.0/':c.licence==='CC BY 2.0'?'https://creativecommons.org/licenses/by/2.0/':c.referencePage;
 console.log(JSON.stringify({id:c.id,image:c.image,credit:c.credit,licence:c.licence,description:plain.match(/Description\s+(.{1,400})/)?.[1]}));
 fs.mkdirSync(c.folder,{recursive:true});
 if(c.image){let resp=await fetch(c.image);if(resp.status===429){await new Promise(t=>setTimeout(t,Math.max(5000,Number(resp.headers.get('retry-after')||5)*1000)));const u=new URL(c.image),parts=u.pathname.split('/');parts.splice(3,0,'thumb');u.pathname=parts.join('/')+'/1280px-'+parts.at(-1);resp=await fetch(u);}if(resp.ok){fs.writeFileSync(c.folder+'/reference.jpg',Buffer.from(await resp.arrayBuffer()));c.referenceWidth=(await sharp(c.folder+'/reference.jpg').metadata()).width;}else c.notes='Reference download HTTP '+resp.status;}
 save();await new Promise(t=>setTimeout(t,5100));
}
if(mode==='gate'){Object.assign(r,{view:'front three-quarter; grille, both headlights, both bumper corners and bonnet visible',referenceGate:'passed; independent Claude review pending',notes:arg||'Factory exterior; remove wipers, lettering and interior. No visible add-on front accessories.'});fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\nNotes: ${r.notes}\n`);save();}
if(mode==='finish'){fs.copyFileSync(arg,r.folder+'/'+r.id+'.png',fs.constants.COPYFILE_EXCL);Object.assign(r,{status:'done',originalOutput:arg,genSeconds:Number(seconds),notes,review:'pending Claude independent review'});save();}
if(mode==='reject'){fs.mkdirSync(root+'/rejected',{recursive:true});r.attempts??=[];const dest=root+'/rejected/a04-'+r.id+'.'+(r.attempts.length?'retry':'first')+'.png';fs.copyFileSync(arg,dest,fs.constants.COPYFILE_EXCL);r.attempts.push({file:dest,seconds:Number(seconds)});Object.assign(r,{status:'failed',genSeconds:r.attempts.reduce((s,a)=>s+a.seconds,0),notes});save();}
if(mode==='status'){Object.assign(r,JSON.parse(arg));save();}
if(mode==='prompt')console.log(fs.readFileSync('analysis/codex/abarth-drawings/prompt.txt','utf8')+`\nAcura ${r.generation} (${r.years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`);
if(mode==='validate')for(const c of rows.filter(x=>x.status==='done')){const p=c.folder+'/'+c.id+'.png',m=await sharp(p).metadata(),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');console.log(JSON.stringify({id:c.id,format:m.format,width:m.width,height:m.height,referenceWidth:c.referenceWidth,unedited:hash(p)===hash(c.originalOutput),exactGeneration:fs.readFileSync(c.folder+'/info.txt','utf8').includes('Generace: '+c.generation),evidence:c.evidence.length}));}
