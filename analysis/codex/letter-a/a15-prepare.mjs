import fs from 'node:fs';
const root='analysis/codex/letter-a', sources=JSON.parse(fs.readFileSync(root+'/a15-sources.json'));
const specs=[
['b6',0,'B6 2.8 — základ řady3','1978–1983','1982_Alpina_B6_2.8_BS_A24.jpg','E21 B6 2.8 two-door sedan, 1982','38','4.0'],
['b6',1,'B6 2.8/3.5 — základ řady3','1984–1990','1986_Alpina_B6_3.5_FOS25.jpg','E30 B6 3.5 two-door sedan, 1986, standard narrow body','38','4.0'],
['b6',2,'B6 2.8 — základ řady3','1992–1993','BMW_Alpina_B6_2.8_(3790559730).jpg','E36 B6 2.8/2 sedan, original front','56','2.0'],
['b6',3,'B6 a B6 S — samostatná rodina řady6','2006–2010','E63_Alpina_B6_S.jpg','E63 B6 S coupe, facelift','40','4.0'],
['b6',4,'B6 Bi-Turbo — rodina řady6','2012–2018','B6クーペ.JPG','F13 B6 Bi-Turbo coupe, original front','40','3.0'],
['b7',0,'B7 — řada7 E65/E66','?–?','White_Alpina_B7_(E65)_fr.jpg','E65 B7 sedan, facelift','41','3.0'],
['b7',1,'B7 Bi-Turbo — řada7 F01/F02','2009–2015','Orange_Alpina_B7_(F01)_fr.jpg','F01 B7 Bi-Turbo sedan, original front','41','3.0'],
['b7',2,'B7 Bi-Turbo — řada7 G12','2016–2022','BMW_Alpina_B7_Biturbo_G12.jpg','G12 B7 Bi-Turbo long-wheelbase sedan, original front','41','2.0'],
['b7-turbo',0,'B7 Turbo / B7 S Turbo — sedan','1978–1982','Alpina_B7_Front.jpg','E12 B7 Turbo sedan','39','3.0'],
['b7-turbo',1,'B7 Turbo Coupé — samostatná kupé rodina','1978–1988','1986_Alpina_B7_Turbo_FOS25.jpg','E24 B7 Turbo coupe, 1986 later front','40','4.0'],
['b7-turbo',2,'B7 Turbo /1 — sedan','1984–1987','1985_Alpina_B7_Turbo_fr.jpg','E28 B7 Turbo/1 sedan, 1985','39','3.0'],
['b8',0,'B8 4.6 — původní rodina řady3','?–1998','Alpina_B8_4.6_Retro_Classics_2025_DSC_7645.jpg','E36 B8 4.6 coupe, original front','38','4.0']
];
const db=root+'/a-15-results.json',old=fs.existsSync(db)?JSON.parse(fs.readFileSync(db)):[];
const rows=specs.map(([line,n,generation,years,file,variant,ev,lic])=>{
 const id=`alpina--${line}--${n}`,prev=old.find(x=>x.id===id);if(prev?.status==='done')return prev;
 const s=sources.findLast(x=>x.file===file&&x.local),folder=s?`${root}/staged/alpina/${id} ${generation.replace(/[<>:"/\\|?*]/g,'-')}`:null;
 const r={id,make:'Alpina',model:line==='b7-turbo'?'B7 Turbo':line.toUpperCase(),generation,years,status:'failed',folder,referencePage:s?.referencePage||null,image:s?.image,credit:s?.credit?.replace(' &#160;',''),licence:'CC BY-SA '+lic,licenceUrl:`https://creativecommons.org/licenses/by-sa/${lic}/`,evidence:s?[s.referencePage,`https://www.alpina-archive.com/?page_id=${ev}`]:[],variant,view:'Front three-quarter; complete grille, both headlamp assemblies, bumper corners and bonnet visible. Omit wipers, antenna, plates, decals and glass contents; retain factory Alpina front spoiler.',genSeconds:0,notes:'Pending visual reference gate.',promptSuffix:`Alpina ${generation} (${years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`};
 if(id==='alpina--b6--2'){r.licence='CC BY 2.0';r.licenceUrl='https://creativecommons.org/licenses/by/2.0/';}
 if(folder){fs.mkdirSync(folder,{recursive:true});fs.copyFileSync(s.local,folder+'/reference.jpg');writeInfo(r);}return r;
});
function writeInfo(r){fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: Alpina\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\n`);}
fs.writeFileSync(db,JSON.stringify(rows,null,2));console.log(rows.map(x=>({id:x.id,folder:x.folder})));
