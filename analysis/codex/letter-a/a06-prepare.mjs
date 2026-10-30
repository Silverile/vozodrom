import fs from 'node:fs';
const root='analysis/codex/letter-a';
const specs=[
['2-5-liter--0','2,5 Liter (Autobahn)','2,5 Liter','1937–1940','2.5 Liter','Adler 2.5 Liter Autobahn Limousine at Bremen Classic Motorshow 2010.jpg','Four-door Typ 10 saloon, later production with wing lamps','https://globetrotter-fotos.de/technik/kraftfahrzeuge/oldtimer/adler-automobile','CC BY-SA 2.0','https://creativecommons.org/licenses/by-sa/2.0/','Front three-quarter; complete front, both headlamps and bumper corners visible; thin display rope crosses lower front. Antenna is accessory to omit.'],
['2-5-liter--1','2,5 Liter (Autobahn)','2,5 Liter Sport','1938–1939','2.5 Liter Sport','Adler Autobahn Coupe Glaser (8609973148).jpg','Gläser two-door Sport fastback, 1938–1939','https://globetrotter-fotos.de/technik/kraftfahrzeuge/oldtimer/adler-automobile','CC BY 2.0','https://creativecommons.org/licenses/by/2.0/','Front three-quarter; bonnet, both headlights and bumper corners visible; display chain and sign overlap lower plate area.'],
['2-liter--0','2 Liter','2 Liter EV','1938–1940','2 Liter EV','Adler 2 EV Cabrio vl.jpg','Karmann four-seat EV cabriolet, roof lowered','https://de.wikipedia.org/wiki/Adler_2_Liter','CC BY-SA 3.0','https://creativecommons.org/licenses/by-sa/3.0/','Front three-quarter; full front and both bumper ends visible. Windscreen sign and interior to omit.'],
['6-25-ps--0','6/25 PS','6/25 PS','1925–1928','6-25 PS'],
['9-24-ps--0','9/24 PS / 9/30 PS','9/24 a 9/30 – provedení po první světové válce','1921–?','9-24 PS'],
['diplomat--0','Diplomat','Diplomat','1934–1935','Diplomat early'],
['diplomat--1','Diplomat','Diplomat – přepracované provedení','1935–1938','Diplomat revised','Adler Diplomat Cabriolet von Papler 1935 Front.JPG','1935 Papler cabriolet, revised projecting grille and rounded wings','https://globetrotter-fotos.de/technik/kraftfahrzeuge/oldtimer/adler-automobile','CC BY-SA 3.0 DE','https://creativecommons.org/licenses/by-sa/3.0/de/','Near head-on; complete front. Auxiliary lamps, badges, wing-mounted spares and later indicators are accessories to omit.'],
['favorit--0','Favorit','Favorit','?–1933','Favorit 8J','Adler Favorit.jpg','1930 8J four-door saloon, original tall-body family','https://planetcars-le.de/fahrzeuge/adler-favorit','CC BY-SA 3.0','https://creativecommons.org/licenses/by-sa/3.0/','Front three-quarter; grille, headlights, bonnet and both bumper ends visible. Rally badges and later indicators to omit.'],
['favorit--1','Favorit','Favorit','1933–1934','Favorit 2U'],
['primus--0','Primus','Primus A 1,5 / 1,65 Liter','1932–1936','Primus A','Adler Primus (7526059888).jpg','1934 Primus 1,7 A two-door saloon, tall-body A generation','https://de.wikipedia.org/wiki/Adler_Primus','CC BY 2.0','https://creativecommons.org/licenses/by/2.0/','Front three-quarter; full front and both bumper corners visible. Rally plate, flag poles and later indicators to omit.'],
['primus--1','Primus','Primus E 1,65 Liter','1937–1938','Primus E'],
['standard-6--0','Standard 6','Standard 6','1927–1930','Standard 6 10N']
];
const sources=JSON.parse(fs.readFileSync(root+'/a06-sources.json'));
const rows=specs.map(([slug,model,generation,years,short,file,variant,evidence,licence,licenceUrl,view])=>{
 const id='adler--'+slug,r={id,make:'Adler',model,generation,years,status:file?'failed':'no-reference',folder:file?root+'/staged/adler/'+id+' '+short:null,referencePage:null,licence:licence||null,evidence:[],variant:variant||null,view:view||null,genSeconds:0,notes:file?'Generation pending.':'Reference gate not met; see search notes.'};
 if(file){const s=sources.find(x=>x.file===file);Object.assign(r,s,{licence,licenceUrl,evidence:[s.referencePage,evidence],referenceWidth:s.width,notes:'Reference visually checked; generation pending.',promptBase:'analysis/codex/abarth-drawings/prompt.txt',promptSuffix:`Adler ${generation} (${years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`});fs.mkdirSync(r.folder,{recursive:true});if(s.local!==r.folder+'/reference.jpg')fs.copyFileSync(s.local,r.folder+'/reference.jpg');writeInfo(r);}
 return r;
});
fs.writeFileSync(root+'/a-06-results.json',JSON.stringify(rows,null,2));
function writeInfo(r){fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: Adler\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\nNotes: ${r.notes}\n`);}
