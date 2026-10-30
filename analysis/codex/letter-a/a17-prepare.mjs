import fs from 'node:fs';
const root='analysis/codex/letter-a',sources=JSON.parse(fs.readFileSync(root+'/a17-sources.json'));
const alpine='https://media.alpinecars.com/alpine-celebrates-its-60th-anniversary-at-frances-retromobile/?lang=en';
const specs=[
['alpina','d5',1,'D5','D5 S','2017–2024','2018_Alpina_D5_S_3.0_Front.jpg','G30 D5 S sedan, 2018, original front',20418,'by-sa/4.0'],
['alpina','roadster-limited-edition',0,'Roadster Limited Edition','Roadster Limited Edition (RLE)','1990–1991','1989_BMW_Z1_Alpina_RLE.jpg','Z1 RLE roadster, roof down; source filename says 1989, catalogue years retained',212,'zero'],
['alpina','roadster-s',0,'Roadster S','Roadster S — základ Z4','?–?','2005_Alpina_Roadster_3.4S_Lux_1.jpg','E85 Roadster S 3.4 Lux, 2005, roof down',211,'by/4.0'],
['alpina','roadster-v8',0,'Roadster V8','Roadster V8 — základ Z8','2002–2003','2002_Alpina_V8_Roadster_Silver.jpg','E52 Roadster V8, 2002, roof down',43,'by-sa/4.0'],
['alpina','xb7',0,'XB7','XB7','2020–?','Alpina_XB7_Auto_Zuerich_2021_IMG_0069.jpg','G07 XB7, original 2020–2022 front',25797,'by-sa/4.0'],
['alpina','xd3',0,'XD3','XD3 Bi-Turbo','2013–2017','2014_BMW_Alpina_XD3_Auto.jpg','F25 XD3 BiTurbo, 2014 facelift; headlamps meet kidney grilles',16741,'by/4.0'],
['alpina','xd3',1,'XD3','XD3','2018–2025','Alpina_XD3_(G01)_1X7A6085.jpg','G01 XD3, original front, photographed 2022',21642,'by-sa/4.0'],
['alpina','xd4',0,'XD4','XD4','2018–2025','bmw-alpina-xd4-6.jpg','G02 XD4, 2018 original front; left front-facing car in ALPINA launch photograph',21642,'by-sa/4.0'],
['alpine','a106',0,'A106','A106 – modelová rodina','1955–?','1958_Alpine_A106_front.jpg','A106 Coach, 1958; modern Gordini wheels, stickers and auxiliary lamp omitted',alpine,'by-sa/3.0'],
['alpine','a108',0,'A108','A108 – francouzská rodina','1958–1965','Alpine_A108_Coupé_01.jpg','French A108 Coupe Sport, covered headlights; representative coupe within varied family',alpine,'by-sa/4.0'],
['alpine','a110',0,'A110','A110 – původní francouzská berlinetta','1962–1977','1973_Alpine_A110_1600S_VC_in_White,_front_left.jpg','French A110 1600S VC berlinetta, 1973; competition decals and nonstandard exhaust omitted',alpine,'by-sa/3.0'],
['alpine','a110',1,'A110','A110 – novodobé kupé','2017–2026','ALPINE_A110_GT_(7BA-DFM5P4)_front.jpg','Modern A110 GT, 2023, standard road body, no aero kit','https://www.media.alpinecars.com/new-alpine-a110-range-three-philosophies-and-that-many-sensations/?lang=fra','by-sa/4.0']
];
const db=root+'/a-17-results.json',old=fs.existsSync(db)?JSON.parse(fs.readFileSync(db)):[];
const rows=specs.map(([make,slug,n,model,generation,years,file,variant,ev,license])=>{
 const id=`${make}--${slug}--${n}`,prev=old.find(x=>x.id===id);if(prev?.status==='done')return prev;
 const s=sources.findLast(x=>x.file===file&&x.local),folder=s?`${root}/staged/${make}/${id} ${generation.replace(/[<>:"/\\|?*]/g,'-')}`:null;
 const licence=license==='zero'?'CC0 1.0':'CC '+license.replace('by-sa','BY-SA').replace('by','BY').replace('/',' '),licenceUrl=license==='zero'?'https://creativecommons.org/publicdomain/zero/1.0/':`https://creativecommons.org/licenses/${license}/`;
 const r={id,make:make==='alpina'?'Alpina':'Alpine',model,generation,years,status:'failed',folder,referencePage:s?.referencePage??null,image:s?.image,credit:s?.credit,licence,licenceUrl,evidence:s?[s.referencePage,typeof ev==='number'?`https://www.alpina-archive.com/?page_id=${ev}`:ev]:[],variant,view:'Front three-quarter; complete front including both headlights, bumper corners and bonnet visible. Omit wipers, antenna, plates, decals and glass contents; retain factory trim.',genSeconds:0,notes:'Pending visual reference gate.',promptSuffix:`${make==='alpina'?'Alpina':'Alpine'} ${generation} (${years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`};
 if(s){fs.mkdirSync(folder,{recursive:true});fs.copyFileSync(s.local,folder+'/reference.jpg');fs.writeFileSync(folder+'/info.txt',`ID: ${id}\nZnačka: ${r.make}\nModel: ${model}\nGenerace: ${generation}\nRoky: ${years}\nPage: ${s.referencePage}\nImage: ${s.image}\nCredit: ${s.credit}\nLicence: ${licence}\nLicence URL: ${licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${variant}\n`);}return r;
});
fs.writeFileSync(db,JSON.stringify(rows,null,2));console.log(rows.map(x=>[x.id,!!x.folder]));
