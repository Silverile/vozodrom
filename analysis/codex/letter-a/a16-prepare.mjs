import fs from 'node:fs';
const root='analysis/codex/letter-a',sources=JSON.parse(fs.readFileSync(root+'/a16-sources.json'));
const specs=[
['b8',1,'B8 Gran Coupé — samostatná rodina řady8','2021–?','2022_Alpina_B8_Gran_Coupe_FOS22_Front_G16.jpg','G16 B8 Gran Coupe, original front, 2022',27005],
['b9',0,'B9 3.5 — sedan','1981–1985','1984_Alpina_B9_3.5_1_FOS25.jpg','E28 B9 3.5 sedan, 1984',174],
['b9',1,'B9 3.5 Coupé — souběžná kupé rodina','1982–1985','1984_Alpina_B9_3.5_BS_A26.jpg','E24 B9 3.5 coupe, 1984',213],
['c1',0,'C1 2.3','1980–1983','BMW_Alpina_C1_at_Legendy_2019_in_Prague.jpg','E21 C1 2.3 two-door sedan',45],
['c1',1,'C1 2.3/2.5','1983–?','1984_Alpina_C1_2.3-1.jpg','E30 C1 2.3/1 two-door sedan, 1984, original front',48],
['c2',0,'C2 2.5/2.7','1985–?','1988_BMW_Alpina_C2_2.7.jpg','E30 C2 2.7 four-door sedan',50],
['d3',0,'D3 / D3 Bi-Turbo','2005–2013','2007_Alpina_D3_2.0_Front.jpg','E90 D3 sedan, 2007, original front',168],
['d3',1,'D3 Bi-Turbo','2013–2018','BMW_ALPINA_D3_BITURBO_LIMOUSINE_(F30)_front.jpg','F30 D3 BiTurbo sedan, original front',16738],
['d3',2,'D3 S','2020–2025','BMW_Alpina_3CA-3U40_D3_S_Touring_(No.16)_(24052609330).jpg','G21 D3 S Touring, 2022, original front; omit rally stickers',25795],
['d4',0,'D4 Bi-Turbo','2014–2018','2015_Alpina_D4_BiTurbo_Auto.jpg','F32 D4 BiTurbo coupe, 2015, original front',38],
['d4',1,'D4 S Gran Coupé','2022–2025','2024_BMW_Alpina_D4S_Gran_Coupe_Auto_fj25zpc.jpg','G26 D4 S Gran Coupe, later front with updated lamps; source labels car 2024',38],
['d5',0,'D5 Bi-Turbo','2011–2016','D5-launch-1.jpg','F10 D5 BiTurbo sedan, 2011 launch, original front',16749]
];
const db=root+'/a-16-results.json',old=fs.existsSync(db)?JSON.parse(fs.readFileSync(db)):[];
const rows=specs.map(([model,n,generation,years,file,variant,ev])=>{
 const id=`alpina--${model}--${n}`,prev=old.find(x=>x.id===id);if(prev?.status==='done')return prev;
 const s=sources.findLast(x=>x.file===file&&x.local),folder=s?`${root}/staged/alpina/${id} ${generation.replace(/[<>:"/\\|?*]/g,'-')}`:null;
 const cc0=(model==='c1'&&n===1)||(model==='d3'&&n===2);
 const r={id,make:'Alpina',model:model.toUpperCase(),generation,years,status:'failed',folder,referencePage:s?.referencePage||null,image:s?.image,credit:s?.credit,licence:cc0?'CC0 1.0':'CC BY-SA 4.0',licenceUrl:cc0?'https://creativecommons.org/publicdomain/zero/1.0/':'https://creativecommons.org/licenses/by-sa/4.0/',evidence:s?[s.referencePage,`https://www.alpina-archive.com/?page_id=${ev}`]:[],variant,view:'Front three-quarter; full grille, both headlamp assemblies, bumper corners and bonnet visible. Omit wipers, antenna, plates, decals and glass contents; retain factory Alpina spoiler.',genSeconds:0,notes:'Pending reference gate.',promptSuffix:`Alpina ${generation} (${years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`};
 if(model==='c2'){r.licence='CC BY 4.0';r.licenceUrl='https://creativecommons.org/licenses/by/4.0/';}
 if(model==='d4')r.evidence[1]='https://www.alpina-archive.com/?cat='+(n===0?701:772);
 if(model==='d5'){r.licence='Not stated; copyrighted reference, no open licence found';r.licenceUrl='Not stated on source page';}
 if(s){fs.mkdirSync(folder,{recursive:true});fs.copyFileSync(s.local,folder+'/reference.jpg');fs.writeFileSync(folder+'/info.txt',`ID: ${id}\nZnačka: Alpina\nModel: ${r.model}\nGenerace: ${generation}\nRoky: ${years}\nPage: ${s.referencePage}\nImage: ${s.image}\nCredit: ${s.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${variant}\n`);}return r;
});fs.writeFileSync(db,JSON.stringify(rows,null,2));console.log(rows.map(x=>[x.id,!!x.folder]));

