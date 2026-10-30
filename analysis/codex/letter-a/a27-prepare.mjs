import fs from 'node:fs';
const root='analysis/codex/letter-a',sources=JSON.parse(fs.readFileSync(root+'/a27-sources.json'));
const rescue='https://emea-dam.audi.com/adobe/assets/urn%3Aaaid%3Aaem%3A0b71b57b-3010-4e70-b08f-745cea343727/original/as/Audi_Modells_upto_2006_EN.pdf';
const a1='https://www.audi.com/en/press-releases/audi-a1-sportback-ideal-companion-for-an-urban-lifestyle-until-2026-10370';
const a3='https://media.audifrance.fr/30-ans-de-laudi-a3-trois-decennies-de-vorsprung-sur-le-segment-des-compactes-premium/';
const specs=[
['50',0,'50','50','1974–1978','Audi-50-GL.jpg','1974 GL 1.1 three-door hatchback; early standard round-lamp nose','CC BY-SA 2.0 DE','by-sa/2.0/de','https://www.audi.com/en/press-releases/germanys-first-small-car-was-launched-50-years-ago-the-audi-50-15979'],
['90',0,'90','90','?–?','Audi_90q20v.jpg','1989 B3 quattro 20V sedan; representative rounded B3 look within unsplit 90 family, not B2 or North American B4','Public domain','PD','https://www.audi-mediacenter.com/en/publications/more/audi-tradition-anniversary-dates-2026-1676/download'],
['200',0,'200','200','?–?','Audi_200_20_V_Frontansicht.jpg','Late C3 200 20V quattro sedan with factory projecting bumper; representative C3 look within unsplit 200 family, not C2 or Chinese facelift','CC BY-SA 4.0','by-sa/4.0',rescue],
['920',0,'920','920','1938–?','Audi_920_Cabriolet_(1939)_1X7A8074.jpg','1939 two-door Cabriolet, hood lowered; standard vertical grille and separate round lamps; not Audi Front','CC BY-SA 4.0','by-sa/4.0','https://www.audi.com/en/company-history-17227'],
['a1',0,'A1','A1 — konstrukční etapa 1','2010–2018','Audi_A1_1.4_TFSI_Ambition_–_Frontansicht,_26._Februar_2012,_Velbert.jpg','8X 1.4 TFSI Ambition three-door, original pre-2015 nose','CC BY-SA 3.0 DE','by-sa/3.0/de',a1],
['a1',1,'A1','A1 — konstrukční etapa 2','2018–2026','2019_Audi_A1_S_Line_30_TFSi_1.0_Front.jpg','2019 GB Sportback S line 30 TFSI, second-generation original nose','CC BY-SA 4.0','by-sa/4.0',a1],
['a2',0,'A2','A2','1999–2005','Gray_Audi_A2_front_view.jpg','Standard production 8Z hatchback, regular full-width cooling grille; not 3L or concept','CC BY 4.0','by/4.0','https://www.audi.com/de/pressemitteilungen/kleines-raumwunder-grosser-sparkuenstler-25-jahre-audi-a2-16857'],
['a3',2,'A3','A3 — konstrukční etapa 3','2012–2020','2016_Audi_A3_Sport_TDi_1.6_Front.jpg','2016 8V Sport TDI Sportback, facelift angular lamps; not 8P or 8Y','CC BY-SA 4.0','by-sa/4.0',a3],
['a3',3,'A3','A3 — konstrukční etapa 4','2020–present','2020_Audi_A3_S_Line_Edition_1_35_TD_2.0.jpg','2020 8Y Sportback S line Edition 1 35 TDI, original pre-2024 nose','CC BY-SA 4.0','by-sa/4.0',a3],
['a5',2,'A5','A5 — konstrukční etapa 3','2024–?','Audi_A5_B10_DSC_7314.jpg','B10 five-door liftback/sedan, launch 2024 standard nose; not F5 coupe or electric A6','CC BY-SA 4.0','by-sa/4.0','https://media.audi.com/is/content/audi/country/nl/assets/pdf/prijslijsten/Prijslijst-Audi-A5-2410a.pdf'],
['a6',0,'A6','A6 — konstrukční etapa 1','?–?','AudiA6C4.jpg','European C4/4A A6 sedan, 1994–1997 facelift of Audi 100; curved headlamps and body-colour bumper','CC0 1.0','CC0',rescue],
['a6',2,'A6','A6 — konstrukční etapa 3','?–?','Audi_A6_C6_3.2.jpg','2005–2008 C6/4F 3.2 sedan, North American markers; original pre-facelift Singleframe nose','Public domain','PD',rescue]
];
const rows=specs.map(([slug,n,model,generation,years,file,variant,licence,lic,second])=>{
const s=sources.find(x=>x.file===file&&x.local);if(!s)throw Error(file);
const id=`audi--${slug}--${n}`,folder=`${root}/staged/audi/${id} ${model}${n?' '+(n+1):''}`;
fs.mkdirSync(folder,{recursive:true});fs.copyFileSync(s.local,folder+'/reference.jpg');
const r={id,status:'failed',make:'Audi',model,generation,years,folder,referencePage:s.referencePage,image:s.image,credit:s.credit.replaceAll('&#160;','').trim(),licence,licenceUrl:lic==='PD'?'https://commons.wikimedia.org/wiki/Template:PD-self':lic==='CC0'?'https://creativecommons.org/publicdomain/zero/1.0/':lic==='Attribution'?'https://commons.wikimedia.org/wiki/Template:Attribution':`https://creativecommons.org/licenses/${lic}/`,evidence:[s.referencePage,second],variant,view:slug==='200'?'Head-on; complete front, both lamps and bumper corners visible':'Front three-quarter; complete front, both headlights, grille, bumper corners and bonnet visible',referenceGate:'pass',genSeconds:null,notes:'Reference visually inspected. Plates, wipers, antenna, interior, stickers and display equipment excluded. Generation pending.'};
if(['200','a6','90'].includes(slug))r.evidence.push('https://en.wikipedia.org/wiki/'+(slug==='200'?'Audi_100':slug==='90'?'Audi_80':'Audi_A6'));
fs.writeFileSync(folder+'/info.txt',info(r));return r;
});
function info(r){return `ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(u=>'Evidence: '+u).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\nNotes: ${r.notes}\n`;}
fs.writeFileSync(root+'/a-27-results.json',JSON.stringify(rows,null,2));console.log('Staged twelve references and metadata.');
