import fs from 'node:fs';
const root='analysis/codex/letter-a', db=root+'/a-10-results.json';
const sources=JSON.parse(fs.readFileSync(root+'/a10-sources.json'));
const history='https://www.media.stellantis.com/it-it/alfa-romeo/press/alfa-romeo-compie-90-anni-le-grandi-alfa';
const centenary='https://www.media.stellantis.com/em-en/alfa-romeo/press/alfa-romeo-celebrates-its-100th-anniversary-and-milan-stages-four-days-of-events';
const specs=[
['90','90','90','1984–?','Alfa Romeo 90 2.5 V6 Quadrifoglio Oro, SH-JR-71 (51248320475).jpg','1986 2.5 V6 Quadrifoglio Oro sedan',centenary,'CC BY 2.0','by/2.0'],
['145','145','145','1994–2000','Alfa 145 1996-1998 front.jpg','1996–1998 1.4 Twin Spark L three-door hatchback, original fascia',history,'CC BY-SA 3.0','by-sa/3.0'],
['146','146','146','1995–2000','1995 Alfa Romeo 146 (front).jpg','1995 five-door hatchback, original fascia',history,'CC BY-SA 4.0','by-sa/4.0'],
['155','155','155','1992–1998','The frontview of Alfa Romeo 155 2.5 V6.JPG','2.5 V6 sedan, original narrow-body fascia',centenary,'CC0 1.0','publicdomain/zero/1.0'],
['164','164','164','1987–1998','Alfa-Romeo-164-front.jpg','Early US-market 164 sedan, original broad headlamps and black bumpers',history,'Public domain','PD'],
['166','166','166','1998–2007','The frontview of Alfa Romeo 166 3.0 V6 24V.JPG','3.0 V6 24V sedan, original 1998–2003 small-headlamp fascia','https://www.media.stellantis.com/it-it/alfa-romeo/press/alfa-166-la-nuova-ammiraglia-alfa-romeo','CC0 1.0','publicdomain/zero/1.0'],
['1900','1900','1900 Berlina / Sprint / Super','1950–1959','Alfa Romeo 1900 berlina (front view).jpg','1900 Super Berlina, standard four-door body; not Sprint coupe','https://www.media.stellantis.com/uk-en/alfa-romeo/press/storie-alfa-romeo-episode-5-gazelles-and-panthers-roam-the-streets-of-italy-with-alfa-romeo-at-the-service-of-the-law','Public domain','PD'],
['2600','2600','2600','1962–?','2600 Sprint front.jpg','2600 Sprint (Tipo 106) Bertone coupe, most numerous 2600 body','https://www.museoalfaromeo.com/it-it/collezione/Pages/2600Sprint.aspx','Public domain','PD'],
['15-20-hp','15 HP / 15–20 HP','15 HP / 15–20 HP – neuzavřená rodina','?–?','Alfa 15 HP.jpg','1911 15 HP Corsa four-baquet museum body, brass main lamps and two cowl lanterns; chosen documented early member of unresolved family','https://www.museoalfaromeo.com/it-it/collezione/Pages/A.L.F.A%2015-HP-Corsa.aspx','CC BY-SA 2.0','by-sa/2.0'],
['20-30-hp','20/30 HP','20/30 HP / E','1914–?',null,null,null,null,null],
['20-30-hp','20/30 HP','20/30 ES','1921–1922','Alfa Romeo 20-30 ES.jpg','20/30 ES open four-seat touring body, rounded radiator; museum example','https://www.museoalfaromeo.com/en-us/news/Pages/EventArchive2020/2030-ES.aspx','CC BY-SA 2.0','by-sa/2.0'],
['2000-historic','2000 (Tipo 102)','2000','1958–1962','1960 Alfa Romeo 2000 Berlina front.jpg','1960 2000 Berlina (Tipo 102), standard four-door sedan','https://www.classic.com/m/alfa-romeo/2000/berlina/','CC BY-SA 3.0','by-sa/3.0']
];
const old=fs.existsSync(db)?JSON.parse(fs.readFileSync(db)):[];
const rows=specs.map(([slug,model,generation,years,file,variant,ev,licence,lic],i)=>{
 const id=`alfa-romeo--${slug}--${i===10?1:0}`;
 const previous=old.find(x=>x.id===id);if(previous?.status==='done')return previous;
 const s=sources.find(x=>x.file===file);
 const r={id,make:'Alfa Romeo',model,generation,years,status:'failed',folder:null,referencePage:s?.referencePage||null,licence,evidence:s?[s.referencePage,ev]:[],variant,view:'Front three-quarter; complete front, both headlamps, both bumper corners and bonnet visible. No major accessories; omit plates, stickers, wipers and antenna.',genSeconds:0,notes:'Reference pending final visual gate.'};
 if(s?.local&&fs.existsSync(s.local)){
  Object.assign(r,{folder:root+'/staged/alfa-romeo/'+id+' '+(i===10?'20-30 ES':slug==='2000-historic'?'2000 Tipo 102':slug),image:s.image,credit:s.credit,licenceUrl:lic==='PD'?'https://commons.wikimedia.org/wiki/Commons:Public_domain':`https://creativecommons.org/${lic.startsWith('publicdomain')?'':'licenses/'}${lic}/`,referenceWidth:s.width});
  if(slug==='2600')r.credit='Herranderssvensson';
  fs.mkdirSync(r.folder,{recursive:true});fs.copyFileSync(s.local,r.folder+'/reference.jpg');
  fs.writeFileSync(r.folder+'/info.txt',`ID: ${id}\nZnačka: Alfa Romeo\nModel: ${model}\nGenerace: ${generation}\nRoky: ${years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${variant}\n`);
 }
 r.promptSuffix=`Alfa Romeo ${generation} (${years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`;
 return r;
});fs.writeFileSync(db,JSON.stringify(rows,null,2));
console.log(rows.map(r=>({id:r.id,folder:r.folder,status:r.status})));
