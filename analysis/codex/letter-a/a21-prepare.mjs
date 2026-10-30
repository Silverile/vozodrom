import fs from 'node:fs';
const root='analysis/codex/letter-a', sources=JSON.parse(fs.readFileSync(root+'/a21-sources.json'));
const specs=[
['arcfox--kaola--0','Arcfox','Kaola / Kaola S','Kaola','2023–?','2024_Arcfox_Kaola_-_front.jpg','CC0 1.0','https://autonews.gasgoo.com/articles/news/arcfoxs-kaola-s-hits-market-starting-at-109800-yuan-70034137','2024 original four-seat Kaola MPV; original rounded front'],
['arcfox--kaola--1','Arcfox','Kaola / Kaola S','Kaola S – varianta nabídky','2024–?','Arcfox_Kaola_S_001.jpg','CC0 1.0','https://www.arcfox.com.cn/kaolaS/index.html','2025 photographed Kaola S five-seat offering, same original front family'],
['arcfox--lite--0','Arcfox','Lite','Lite','2017–2020','BJEV_Arcfox_Lite,_front_8.11.18.jpg','CC BY-SA 4.0','https://www.baicgroup.com.cn/baicgroup/News/NewsShort/2026/1/I1457793775995715584.html','2018 original Lite two-door hatchback; blank the factory message display'],
['arcfox--s3--0','Arcfox','Beta S3','Beta S3','?–?','Arcfox_βS3_007.jpg','CC0 1.0','https://www.arcfox.com.cn/S3/index.html','2026 original Beta S3 sedan; standard production nose, photographed outdoors September 2026'],
['arcfox--t1--0','Arcfox','T1 / Beta T1','T1 / Beta T1','2025–?','Arcfox_T1_001.jpg','CC0 1.0','https://www.arcfox.com.cn/T1/index.html','2025 original T1 hatchback, Shanghai show; factory original nose'],
['arcfox--wendao-v9--0','Arcfox','Wendao V9','Wendao V9','?–?','Arcfox_Wendao_V9_003.jpg','CC0 1.0','https://www.arcfox.com.cn/V9/index.html','2026 original Wendao V9 MPV'],
['ariel--atom--0','Ariel','Atom','Atom – Rover','2000–?','Ariel_Atom_Atom1_(1_of_1)_(5629555629).jpg','CC BY 2.0','https://www.arielmotor.co.uk/our-history/','First generation Rover K-series Atom; identity pending visual comparison'],
['ariel--atom--1','Ariel','Atom','Atom 2','2003–?','2004_Ariel_Atom_2_(31803587666).jpg','CC BY 2.0','https://www.arielmotor.co.uk/our-history/','2004 Honda-powered Atom 2; standard round headlamps, small front indicators; no front spoiler'],
['ariel--atom--2','Ariel','Atom','Atom 3','2007–?','Ariel_Atom_3_2009_HeadOnt_FOSSP_7April2013_(14607096693).jpg','CC BY 2.0','https://www.arielmotor.co.uk/our-history/','2009 Atom 3; original pre-3.5 nose'],
['ariel--atom--3','Ariel','Atom','Atom 4','2018–?','2020_Ariel_Atom_4_1.jpg','CC BY-SA 4.0','https://www.arielmotor.co.uk/our-history/','2020 standard Atom 4, not 4R; factory triple lamps and no aero wings']
];
const db=root+'/a-21-results.json',old=fs.existsSync(db)?JSON.parse(fs.readFileSync(db)):[];
const rows=specs.map(([id,make,model,generation,years,file,licence,ev,variant])=>{
 const prev=old.find(r=>r.id===id);if(prev?.status==='done')return prev;
 const s=sources.find(r=>r.file===file),folder=root+'/staged/'+make.toLowerCase()+'/'+id+' '+generation.replace(/[<>:"/\\|?*]/g,'-');
 const licenceUrl=licence==='CC0 1.0'?'https://creativecommons.org/publicdomain/zero/1.0/':`https://creativecommons.org/licenses/${licence.includes('BY-SA')?'by-sa':'by'}/${licence.endsWith('2.0')?'2.0':'4.0'}/`;
 const r={id,make,model,generation,years,status:'failed',folder,referencePage:s?.referencePage||'https://commons.wikimedia.org/wiki/File:'+file,image:s?.image,credit:s?.credit,licence,licenceUrl,evidence:[s?.referencePage||'https://commons.wikimedia.org/wiki/File:'+file,ev],variant,view:'Front three-quarter; complete front, both headlamps, bumper corners and bonnet visible. Remove wipers, plates, stickers, glass contents and accessories.',genSeconds:0,notes:'Reference gate pending',referenceGate:'pending'};
 if(s?.local){fs.mkdirSync(folder,{recursive:true});fs.copyFileSync(s.local,folder+'/reference.jpg');fs.writeFileSync(folder+'/info.txt',`ID: ${id}\nZnačka: ${make}\nModel: ${model}\nGenerace: ${generation}\nRoky: ${years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${licence}\nLicence URL: ${licenceUrl}\n${r.evidence.map(u=>'Evidence: '+u).join('\n')}\nView: ${r.view}\nVariant: ${variant}\n`);}return r;
});
for(const [id,generation,model,years,ev,notes] of [
 ['ariel--10-hp--0','První automobil','10 hp (1902)','1902–?',['https://www.arielmotor.co.uk/our-history/','https://arielnorthamerica.org/mot_hist2.htm'],'Searched Ariel 1902 10 hp front photographs, Commons Ariel automobiles and manufacturer history. Located 1901 quadricycle and 1903/1904 cars, no complete-front photograph confirmed as 1902 10 hp by two independent sources.'],
 ['ariel--nine--0','Nine – neúplně vymezená rodina','Nine','?–?',['https://graces-guide-s3-live.s3.amazonaws.com/gracesguide/2/2e/LightCar19230119.pdf','https://www.motorsportmagazine.com/archive/article/october-1992/66/the-ariel/'],'Searched Ariel Nine 1922/1923/1925 front photographs and Commons Ariel automobiles. Period advertisement is a side-view illustration, not an eligible front photograph; no two-source-confirmed complete-front photo located.']
])rows.push({id,make:'Ariel',model,generation,years,status:'no-reference',folder:null,referencePage:null,licence:null,evidence:ev,variant:null,view:null,genSeconds:0,notes});
fs.writeFileSync(db,JSON.stringify(rows,null,2));console.log(rows.map(r=>[r.id,r.status,r.folder]));
