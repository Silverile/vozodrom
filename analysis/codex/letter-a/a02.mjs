import fs from 'node:fs';
import sharp from 'sharp';
import crypto from 'node:crypto';
const root='analysis/codex/letter-a',results=root+'/a-02-results.json';
const specs=[
['ac-cars--cobra--2','AC Cars','Cobra','Cobra MkIII','1965–1967','Cobra MkIII'],
['ac-cars--cobra--3','AC Cars','Cobra','AC289 Sports – evropské provedení','?–1969','AC289 Sports'],
['ac-cars--cobra-gt-roadster--0','AC Cars','Cobra GT Roadster','CobraGT Roadster – moderní konstrukce','2024–present','CobraGT Roadster'],
['ac-cars--greyhound--0','AC Cars','Greyhound','Greyhound','1959–1963','Greyhound'],
['ac-cars--petite--0','AC Cars','Petite','Petite – původní provedení','1952–1955','Petite I'],
['ac-cars--petite--1','AC Cars','Petite','Petite Mark II','1955–?','Petite II'],
['ac-cars--six--0','AC Cars','Six','Six – rodina16/40,16/56,16/66','1920–1929','Six I'],
['ac-cars--six--1','AC Cars','Six','Six – rodina16/60,16/70,16/80,16/90','1932–1940','Six II'],
['ac-cars--sociable--0','AC Cars','Sociable','Sociable – osobní tříkolová rodina','1907–1915','Sociable'],
['acura--adx--0','Acura','ADX','ADX — od MY2025','2025–?','ADX'],
['acura--cdx--0','Acura','CDX','CDX','2016–2022','CDX'],
['acura--cl--0','Acura','CL','I — MY1997–1999','1996–1999','CL I']
].map(([id,make,model,generation,years,short])=>({id,make,model,generation,years,folder:`${root}/staged/${make==='Acura'?'acura':'ac-cars'}/${id} ${short}`,status:'failed',referencePage:null,licence:null,evidence:[],variant:null,view:null,genSeconds:null,notes:'Not processed yet.'}));
const rows=fs.existsSync(results)?JSON.parse(fs.readFileSync(results,'utf8')):specs;
const [mode,id,...args]=process.argv.slice(2),r=rows.find(x=>x.id===id);
if(mode==='init')fs.writeFileSync(results,JSON.stringify(rows,null,2));
if(mode==='reference'){
 Object.assign(r,JSON.parse(args[0])); fs.mkdirSync(r.folder,{recursive:true});
 fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\nNotes: ${r.notes}\n`);
 fs.writeFileSync(results,JSON.stringify(rows,null,2));
}
if(mode==='finish'){
 const [original,seconds,notes]=args;fs.copyFileSync(original,`${r.folder}/${r.id}.png`,fs.constants.COPYFILE_EXCL);Object.assign(r,{status:'done',originalOutput:original,genSeconds:Number(seconds),notes,review:'pending Claude independent review'});fs.writeFileSync(results,JSON.stringify(rows,null,2));
}
if(mode==='status'){Object.assign(r,JSON.parse(args[0]));fs.writeFileSync(results,JSON.stringify(rows,null,2));}
if(mode==='prompt')console.log(fs.readFileSync('analysis/codex/abarth-drawings/prompt.txt','utf8')+`\n${r.make} ${r.generation} (${r.years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`);
if(mode==='validate')for(const c of rows.filter(c=>c.status==='done')){const p=c.folder+'/'+c.id+'.png',m=await sharp(p).metadata(),ref=await sharp(c.folder+'/reference.jpg').metadata(),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');console.log(JSON.stringify({id:c.id,png:m.format==='png',width:m.width,height:m.height,unedited:hash(p)===hash(c.originalOutput),referenceWidth:ref.width,exactGeneration:fs.readFileSync(c.folder+'/info.txt','utf8').includes('Generace: '+c.generation),twoEvidence:c.evidence.length===2}));}
