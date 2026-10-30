import fs from 'node:fs';
const root='analysis/codex/letter-a',sources=JSON.parse(fs.readFileSync(root+'/a29-sources.json'));
const specs=[
['front-uw-220',0,'Front UW220','Front UW220','1933–?','Audi_Front_UW_220_exhibited_at_Autostadt_in_Wolfsburg.JPG','1934 UW220 two-door Cabriolet with fabric roof raised; separate round lamps and narrow vertical grille','CC BY-SA 3.0','by-sa/3.0','Audi_Front'],
['front-uw-225',0,'Front UW225','Front UW225','1935–?','Audi_Front_225.JPG','UW225 Gläser Cabriolet, roof lowered; standard separate round lamps and swept wings','Public domain','PD','Audi_Front'],
['q2',0,'Q2','Q2','2016–2026','2017_Audi_Q2_Sport_TDi_1.6_Front.jpg','2017 Sport TDI 1.6, original pre-facelift standard-wheelbase SUV','CC BY-SA 4.0','by-sa/4.0','Audi_Q2'],
['q3',2,'Q3','Q3 — konstrukční etapa 3','2025–?','Audi_Q3_1.5_TFSI_e-hybrid_S_line_(FJ)_–_f_29032026.jpg','2026 FJ 1.5 TFSI e-hybrid S line SUV; launch third-generation split-lamp nose','CC BY-SA 3.0 DE','by-sa/3.0/de','Audi_Q3'],
['q4-e-tron',0,'Q4 e-tron','Q4 e-tron','2021–?','2021_Audi_Q4_e-tron_Sport_35.jpg','2021 Sport 35 regular SUV, original pre-2026-facelift nose; not Sportback','CC BY-SA 4.0','by-sa/4.0','Audi_Q4_e-tron'],
['q5',1,'Q5','Q5 — konstrukční etapa 2','?–?','2018_Audi_Q5_S_Line_TDi_Quattro_S-A_2.0_Front.jpg','2018 FY S line 2.0 TDI quattro SUV; original pre-facelift second-generation nose','CC BY-SA 4.0','by-sa/4.0','Audi_Q5'],
['q5',2,'Q5','Q5 — konstrukční etapa 3','?–?','Audi_Q5_2.0_TDI_quattro_S_line_(GU)_–_f_13102025.jpg','2025 GU 2.0 TDI quattro S line SUV; launch third-generation nose','CC BY-SA 3.0 DE','by-sa/3.0/de','Audi_Q5'],
['q6-e-tron',0,'Q6 e-tron','Q6 e-tron','2023–?','Audi_Q6_e-tron_DSC_7829.jpg','2025 production Q6 e-tron regular SUV with split lamps; not Q6 ICE, prototype or Sportback','CC BY-SA 4.0','by-sa/4.0','Audi_Q6_e-tron'],
['q7',2,'Q7','Q7 — konstrukční etapa 3','?–?','Audi_Q7_(G8)_IMG_7161.jpg','2026 G8 third-generation Q7 SUV; not 4M facelift','CC BY-SA 4.0','by-sa/4.0','Audi_Q7'],
['q8',0,'Q8','Q8','2018–?','2018_Audi_Q8_S_Line_50_TDi_Quattro_3.0_Front.jpg','2018 S line 50 TDI quattro SUV; original pre-2023-facelift combustion Q8','CC BY-SA 4.0','by-sa/4.0','Audi_Q8'],
['q8-e-tron',0,'Q8 e-tron','Q8 e-tron','2018–2025','Audi_Q8_e-tron_IAA_2023_1X7A0616.jpg','2023 renamed Q8 e-tron facelift, regular SUV; chosen named Q8 look within unsplit 2018–2025 e-tron family','CC BY-SA 4.0','by-sa/4.0','Audi_Q8_e-tron'],
['quattro',0,'quattro','quattro','1980–1991','1985_Audi_Quattro.jpg','1985 long-wheelbase Ur-quattro road coupe; facelift rectangular lamps, not short Sport quattro or rally car','CC0 1.0','CC0','Audi_Quattro']
];
const existing=fs.existsSync(root+'/a-29-results.json')?JSON.parse(fs.readFileSync(root+'/a-29-results.json')):[];
const rows=specs.map(([slug,n,model,generation,years,file,variant,licence,lic,wiki])=>{
 const s=sources.find(x=>x.file===file&&x.local);if(!s)return null;
 const id=`audi--${slug}--${n}`,folder=`${root}/staged/audi/${id} ${model}${n?' '+(n+1):''}`;
 if(existing.find(x=>x.id===id)?.status==='done')return existing.find(x=>x.id===id);
 fs.mkdirSync(folder,{recursive:true});fs.copyFileSync(s.local,folder+'/reference.jpg');
 const r={id,status:'failed',make:'Audi',model,generation,years,folder,referencePage:s.referencePage,image:s.image,credit:s.credit.replaceAll('&#160;','').trim(),licence,licenceUrl:lic==='PD'?'https://commons.wikimedia.org/wiki/Template:PD-user':lic==='CC0'?'https://creativecommons.org/publicdomain/zero/1.0/':`https://creativecommons.org/licenses/${lic}/`,evidence:[s.referencePage,'https://en.wikipedia.org/wiki/'+wiki],variant,view:'Front three-quarter; complete front, both headlights, grille, both bumper corners and bonnet visible',referenceGate:'pass',genSeconds:null,notes:'Reference visually inspected. Exclude plate text, wipers, antenna, interior and display accessories. Generation pending.'};
 fs.writeFileSync(folder+'/info.txt',info(r));return r;
}).filter(Boolean);
export function info(r){return `ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(u=>'Evidence: '+u).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\nNotes: ${r.notes}\n`;}
fs.writeFileSync(root+'/a-29-results.json',JSON.stringify(rows,null,2));console.log('Staged twelve references and metadata.');
