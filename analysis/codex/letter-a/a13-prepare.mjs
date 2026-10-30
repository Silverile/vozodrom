import fs from 'node:fs';
const root='analysis/codex/letter-a',db=root+'/a-13-results.json',sources=JSON.parse(fs.readFileSync(root+'/a13-sources.json'));
const es30='https://www.media.stellantis.com/de-de/alfa-romeo/press/30-jahre-alfa-romeo-sz-runder-geburtstag-fr-projekt-es30';
const specs=[
['alfa-romeo','Alfa Romeo','rz',0,'RZ','RZ','1992–1994','The_frontview_of_Alfa_Romeo_RZ.JPG','RZ standard roadster with factory soft top raised',es30,'CC0'],
['alfa-romeo','Alfa Romeo','spider',0,'Spider','Spider','?–?','Alfa_Romeo_Spider_2000_Veloce.JPG','Series 2 2000 Veloce with soft top lowered; most numerous 105/115 Spider series','https://www.media.stellantis.com/uk-en/alfa-romeo/press/alfa-romeo-spider-duetto-celebrates-its-60th-anniversary','by-sa/2.5'],
['alfa-romeo','Alfa Romeo','sz',0,'SZ','SZ','1989–?','1990_Alfa_Romeo_SZ_3.0_Front.jpg','1990 standard ES30 production coupe',es30,'by-sa/4.0'],
['alfa-romeo','Alfa Romeo','tonale',0,'Tonale','Tonale','2022–?','2022_Alfa_Romeo_Tonale_Speciale_in_Verde_Montreal,_front_left_(NYIAS_2022).jpg','2022 Speciale European-spec, original pre-facelift front','https://www.media.stellantis.com/em-en/alfa-romeo/press/tonale-makes-its-debut-in-france-at-the-le-mans-classic-2022','by-sa/3.0'],
['alpina','Alpina','b10',0,'B10','B10 3.5 — sedan','1985–1987','Alpina_B10_(E28)_1X7A6617.jpg','E28 B10 3.5 sedan, factory Alpina front spoiler','https://www.alpina-archive.com/?page_id=39','by-sa/4.0'],
['alpina','Alpina','b10',1,'B10','B10 3.5 Coupé — souběžná rodina','1985–1987','HSG-1986-B10-E24.jpg','1986 E24 B10 3.5 coupe, factory Alpina spoiler; closed bonnet','https://www.alpina-archive.com/?page_id=215','Copyright'],
['alpina','Alpina','b10',2,'B10','B10 E34','1988–1996','BMW_Alpina_B10_3.5_E34_(12141305196).jpg','E34 B10 3.5/1 sedan, original narrow kidney grille','https://www.alpina-archive.com/?page_id=39','by/2.0'],
['alpina','Alpina','b10',3,'B10','B10 E39','?–2003','ALPINA_B10_3.2_(E39)_front.jpg','E39 B10 3.2 sedan, photographed later-style headlamps; omit nonstandard mesh wheels','https://www.alpina-archive.com/?page_id=39','by-sa/4.0'],
['alpina','Alpina','b11',0,'B11','B11 3.5 / 4.0','1987–1994','Alpina_B11_Front.JPG','E32 B11 sedan, photographed broad-grille appearance; displacement not specified by photo source','https://www.alpina-archive.com/?page_id=41','by-sa/3.0'],
['alpina','Alpina','b12',0,'B12','B12 5.0 — sedan','1988–1994','BMW_Alpina_B12_5.0_E32_(14222693342).jpg','E32 B12 5.0 sedan, as photographed','https://www.alpina-archive.com/?page_id=41','by/2.0'],
['alpina','Alpina','b12',1,'B12','B12 5.0/5.7 — souběžná kupé rodina','1990–1996','Alpina_B12_5.0_(E31).jpg','E31 B12 5.0 coupe with popup headlamps closed','https://www.alpina-archive.com/?page_id=42','by-sa/4.0'],
['alpina','Alpina','b12',2,'B12','B12 5.7/6.0 — sedan','1995–2001','BMW_Alpina_B12_5.7_E38_(14311800601).jpg','E38 B12 5.7 sedan, original pre-facelift front','https://www.alpina-archive.com/?page_id=41','by/2.0']
];
const old=fs.existsSync(db)?JSON.parse(fs.readFileSync(db)):[];
const rows=specs.map(([slug,make,line,n,model,generation,years,file,variant,ev,lic])=>{
 const id=`${slug}--${line}--${n}`,prev=old.find(x=>x.id===id);if(prev?.status==='done')return prev;
 const t=sources.findLast(x=>x.file===file&&x.local),folder=t?`${root}/staged/${slug}/${id} ${generation.replace(/[<>:"/\\|?*]/g,'-')}`:null;
 const r={id,make,model,generation,years,status:'failed',folder,referencePage:t?.referencePage||null,image:t?.image,credit:t?.credit,licence:lic==='CC0'?'CC0 1.0':'CC '+lic.toUpperCase().replace('/',' '),licenceUrl:lic==='CC0'?'https://creativecommons.org/publicdomain/zero/1.0/':`https://creativecommons.org/licenses/${lic}/`,evidence:t?[t.referencePage,ev]:[],variant,view:'Front three-quarter; complete front, both headlamp assemblies, bumper corners and bonnet visible. Omit wipers, antenna, number plates and stickers.',genSeconds:0,notes:'Pending visual gate.',promptSuffix:`${make} ${generation} (${years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`};
 if(lic==='Copyright'){r.licence='Copyright; no open licence stated';r.licenceUrl=r.referencePage;}
 if(folder){fs.mkdirSync(folder,{recursive:true});if(t.local!==folder+'/reference.jpg')fs.copyFileSync(t.local,folder+'/reference.jpg');fs.writeFileSync(folder+'/info.txt',`ID: ${id}\nZnačka: ${make}\nModel: ${model}\nGenerace: ${generation}\nRoky: ${years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${variant}\n`);}return r;
});fs.writeFileSync(db,JSON.stringify(rows,null,2));console.log(rows.map(x=>({id:x.id,folder:x.folder})));


