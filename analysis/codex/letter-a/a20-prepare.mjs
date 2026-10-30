import fs from 'node:fs';
const root='analysis/codex/letter-a',sources=JSON.parse(fs.readFileSync(root+'/a20-sources.json'));
const specs=[
['amc','matador',1,'Matador','Matador – modernizované sedany a kombiMY1974–1978','?–1978',0,'1974 base four-door sedan, Golden Tan, original restyled sedan nose','https://www.lov2xlr8.no/brochures/amc/amcf74/amcf74.html','CC BY-SA 4.0'],
['amc','matador',2,'Matador','Matador Coupe – nová karoserieMY1974–1978','?–1978',1,'1976 Brougham coupe with factory vinyl roof; dedicated 1974–1978 coupe body','https://www.lov2xlr8.no/brochures/amc/amcf74/amcf74.html','Public domain'],
['amc','pacer',0,'Pacer','Pacer – společná rodina, hatchback a kombi','1975–1979',2,'1975 base two-door hatchback; original low grille, before raised 1978 nose','https://www.lov2xlr8.no/brochures/amc/75pac/75pac.html','Public domain'],
['amc','rebel',0,'Rebel','Rambler / AMC Rebel – samostatná řada','1967–1970',3,'1967 Rambler Rebel 770 four-door sedan; early family front','https://www.lov2xlr8.no/brochures/amc/67amc/67amc.html','Public domain'],
['amc','spirit',0,'Spirit','Spirit – rodinaMY1979–1983','1978–1983',4,'1979 Spirit D/L liftback, Cameo Blue; original quad rectangular headlamp front','https://www.lov2xlr8.no/brochures/amc/79asp/79asp.html','Public domain'],
['arcfox','alpha-s',0,'Alpha S / Alpha S6','Alpha S','2021–2025',5,'2023 standard Alpha S liftback; original bumper, not HI version','https://www.baicgroup.com.cn/baicgroup-en/Innovation/InnoStrategy/A161005001Gone1.html','CC BY-SA 4.0'],
['arcfox','alpha-s',1,'Alpha S / Alpha S6','Alpha S6 – přejmenovaná nabídka','2025–?',null,'2025 Alpha S6 735MAX, standard non-HI front; renamed offering','https://www.autohome.com.cn/news/202504/1305079.html','Manufacturer publicity image; no open licence stated'],
['arcfox','alpha-s5',0,'Alpha S5','Alpha S5','2024–?',7,'2024 original Alpha S5 sedan, before later refresh','https://www.baicglobal.com/news/newsRelease/detail/260','CC BY 4.0'],
['arcfox','alpha-t',0,'Alpha T / Alpha T6','Alpha T','2020–2025',6,'Original Alpha T electric SUV, photographed 2022','https://www.arcfox.com.cn/pagehtml/news2021-07-04-15-59-59.html','CC BY-SA 4.0'],
['arcfox','alpha-t',1,'Alpha T / Alpha T6','Alpha T6 – přejmenovaná nabídka','2025–?',null,'2025 Alpha T6 688MAX SUV; renamed offering','https://www.autohome.com.cn/news/202504/1305079.html','Manufacturer publicity image; no open licence stated'],
['arcfox','alpha-t5',0,'Alpha T5','Alpha T5 – původní nabídka','2023–?',10,'2024 original 4690 mm Alpha T5 electric SUV; pre-facelift','https://arcfoxuae.com/alpha-t5/','CC BY 4.0'],
['arcfox','alpha-t5',1,'Alpha T5','New Alpha T5 – prodloužená nabídka','?–?',9,'2025-on facelift, extended 4760 mm Alpha T5 SUV; BEV closed upper front','https://www.arcfox.com.cn/T5/index.html','CC0 1.0']
];
const db=root+'/a-20-results.json',old=fs.existsSync(db)?JSON.parse(fs.readFileSync(db)):[];
const rows=specs.map(([make,line,n,model,generation,years,ix,variant,ev,licence])=>{
 const id=`${make}--${line}--${n}`,prev=old.find(x=>x.id===id);if(prev?.status==='done')return prev;
 let s=ix===null?null:sources[ix];
 if(ix===null){const isS=line==='alpha-s',kind=isS?'S6':'T6';s={referencePage:`https://www.arcfox.com.cn/${kind}/index.html`,image:`https://www.arcfox.com.cn/static/web/img2022/home/${isS?'s':'t'}6_kv_2.jpg`,local:root+`/raw/a20-ev-${isS?18:20}.jpg`,credit:'ARCFOX / BAIC'};}
 const folder=`${root}/staged/${make}/${id} ${generation.replace(/[<>:"/\\|?*]/g,'-')}`;
 const licenceUrl=licence==='Public domain'?s.referencePage:licence==='CC0 1.0'?'https://creativecommons.org/publicdomain/zero/1.0/':licence.startsWith('CC ')?`https://creativecommons.org/licenses/${licence.includes('BY-SA')?'by-sa':'by'}/4.0/`:s.referencePage;
 const r={id,make:make==='amc'?'AMC':'Arcfox',model,generation,years,status:'failed',folder,referencePage:s.referencePage,image:s.image,credit:make==='amc'?'Christopher Ziemnowicz (CZmarlin)':s.credit,licence,licenceUrl,evidence:[s.referencePage,ev],variant,view:'Front three-quarter; complete front, both headlights, bumper corners and bonnet visible. Remove wipers, antenna, plates, stickers and glass contents; retain factory trim.',referenceGate:'pending',genSeconds:0,notes:'Reference gate pending',promptSuffix:`${make==='amc'?'AMC':'Arcfox'} ${generation} (${years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`};
 fs.mkdirSync(folder,{recursive:true});fs.copyFileSync(s.local,folder+'/reference.jpg');
 fs.writeFileSync(folder+'/info.txt',`ID: ${id}\nZnačka: ${r.make}\nModel: ${model}\nGenerace: ${generation}\nRoky: ${years}\nPage: ${s.referencePage}\nImage: ${s.image}\nCredit: ${r.credit}\nLicence: ${licence}\nLicence URL: ${licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${variant}\n`);return r;
});fs.writeFileSync(db,JSON.stringify(rows,null,2));console.log(rows.map(x=>[x.id,x.folder]));
