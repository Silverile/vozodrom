import fs from 'node:fs';
const root='analysis/codex/letter-a',sources=JSON.parse(fs.readFileSync(root+'/a26-sources.json'));
const past='https://www.astonmartin.com/en/models/past-models';
const van='https://media.astonmartin.com/vanquish-at-25-three-generations-of-flagship-performance-and-engineering-excellence/?lang=eng';
const specs=[
['v8-vantage',0,'V8 Vantage','V8 Vantage','1977–1990','1985_Aston_Martin_Vantage_V8.jpg','1985 standard coupe, blanked grille and bonnet scoop; factory inset driving lamps','CC BY-SA 4.0','by-sa/4.0','https://www.astonmartin.com/en-gb/models/past-models/v8-vantage'],
['v8-volante',0,'V8 Volante','V8 Volante','1997–2000','1999_Aston_Martin_V8_Volante_LWB.jpg','1999 naturally aspirated LWB convertible, hood raised; mesh grille and round lower lamps, not earlier V8 Volante','CC0 1.0','CC0','https://astonmartins.com/car/v8-volante-lwb/'],
['valhalla',0,'Valhalla','Valhalla','?–?','2026_Aston_Martin_Valhalla.jpg','2026 production-design coupe; roof intake is factory equipment; not 2019 AM-RB003 or 2021 display concept','CC BY-SA 4.0','by-sa/4.0','https://media.astonmartin.com/valhalla-the-ultimate-drivers-supercar/?lang=eng'],
['valkyrie',0,'Valkyrie','Valkyrie','2021–?','2022_Aston_Martin_Valkyrie_SP24.jpg','2022 production road coupe; factory aero and camera mirrors; not AMR Pro or LM','CC BY-SA 4.0','by-sa/4.0','https://media.astonmartin.com/first-aston-martin-valkyrie-customer-car-complete/?lang=eng'],
['vanquish',0,'Vanquish','Vanquish','2001–2007','2001_Aston_Martin_Vanquish_6.0_Front.jpg','2001 original V12 Vanquish coupe, standard pre-S nose','CC BY-SA 4.0','by-sa/4.0',van],
['vanquish',1,'Vanquish','Vanquish — druhá konstrukční rodina','2012–2018','2013_Aston_Martin_Vanquish.jpg','2013 standard second-generation VH coupe, not later S or Zagato','CC0 1.0','CC0',van],
['vanquish',2,'Vanquish','Vanquish — třetí konstrukční rodina','2024–?','2025_Aston_Martin_Vanquish.jpg','2025 third-generation V12 coupe; large grille and vertical lower vanes','CC BY-SA 4.0','by-sa/4.0',van],
['vantage',0,'Vantage','Vantage','1993–2000','1994_Aston_Martin_Vantage_V550_in_Pentland_Green,_front_right.jpg','1994 V550 coupe, early rectangular lamps behind clear covers; not V600 Le Mans','CC BY-SA 3.0','by-sa/3.0','https://media.astonmartin.com/v8-vantage/?lang=eng'],
['vantage',1,'Vantage','V8 / V12 Vantage — rodina VH','2005–?','Aston_Martin_V8_Vantage_front_20081201.jpg','Standard early VH V8 coupe, photographed 2008; slatted grille and unvented bonnet, not V12','Attribution (Wikimedia custom licence)','Attribution','https://media.astonmartin.com/vantage-hyper-red-press-kit/?lang=eng'],
['vantage',2,'Vantage','Vantage — novější rodina','2018–?','2019_Aston_Martin_Vantage_V8_Automatic_4.0_Front.jpg','2019 standard V8 coupe, original 2018–2023 mesh hunter grille and narrow lamps; not 2024 facelift','CC BY-SA 4.0','by-sa/4.0','https://media.astonmartin.com/new-aston-martin-vantage-begins-production/?lang=eng'],
['virage',0,'Virage','Virage','1988–1996','1991_Aston_Martin_Virage_in_Cumberland_Grey,_front_right.jpg','1991 standard narrow-body V8 coupe with rectangular lamps; not 6.3 widebody or Vantage','CC BY 2.0','by/2.0','https://media.astonmartin.com/virage/?lang=eng'],
['virage',1,'Virage','Virage — nová konstrukční rodina','2011–2012','Aston_Martin_Virage_in_Ap_Lei_Chau_(Front)_1.jpg','2011–2012 VH coupe, Rapide-style lamps and five horizontal grille vanes','CC BY-SA 4.0','by-sa/4.0','https://astonmartins.com/car/virage-coupe/']
];
const rows=specs.map(([slug,n,model,generation,years,file,variant,licence,lic,second])=>{
 const s=sources.find(x=>x.file===file&&x.local);if(!s)throw Error(file);
 const id=`aston-martin--${slug}--${n}`,short=slug==='vantage'&&n===1?'Vantage VH':model+(n?' '+(n+1):''),folder=`${root}/staged/aston-martin/${id} ${short}`;
 fs.mkdirSync(folder,{recursive:true});fs.copyFileSync(s.local,folder+'/reference.jpg');
 const r={id,status:'failed',make:'Aston Martin',model,generation,years,folder,referencePage:s.referencePage,image:s.image,credit:slug==='virage'&&n===0?'Draco2008; crop by Mr.choppers':s.credit,licence,licenceUrl:lic==='CC0'?'https://creativecommons.org/publicdomain/zero/1.0/':lic==='Attribution'?'https://commons.wikimedia.org/wiki/Template:Attribution':`https://creativecommons.org/licenses/${lic}/`,evidence:[s.referencePage,second],variant,view:'Front three-quarter; full front, both lamps, grille, bumper corners and bonnet visible',referenceGate:'pass',genSeconds:null,notes:'Reference visually inspected. Show stickers, signs, plates, tow eye and background excluded; factory aero retained. Generation pending.'};
 if(slug==='v8-volante')r.evidence.push(past);
 if(slug==='valhalla')r.notes+=' Rejected 2021 display concept and earlier-look 2025 candidate before generation; selected 2026 production-design photograph.';
 if(slug==='vantage'&&n===0)r.notes+=' Early V550 rectangular headlamp variant explicitly selected; later triple-round lamps not substituted.';
 if(slug==='virage'&&n===1)r.notes+=' First 2011 candidate was rear view and rejected before generation.';
 fs.writeFileSync(folder+'/info.txt',info(r));return r;
});
function info(r){return `ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(u=>'Evidence: '+u).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\nNotes: ${r.notes}\n`;}
fs.writeFileSync(root+'/a-26-results.json',JSON.stringify(rows,null,2));console.log('Staged 12 references, identity evidence and licences.');
