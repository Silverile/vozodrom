import fs from 'node:fs';
const root='analysis/codex/letter-a',db=root+'/a-11-results.json',a=JSON.parse(fs.readFileSync(db)),s=JSON.parse(fs.readFileSync(root+'/a11-sources.json'));
for(const [id,file,lic] of [['alfa-romeo--8c-competizione--0','Alfa Romeo 8C 2008 Competizione HeadOn CECF 9April2011 (14600295832).jpg','by/2.0'],['alfa-romeo--8c-historic--1','1938 Alfa Romeo 8C 2900B Touring Spider - dark blue - fvl.jpg','by-sa/2.0'],['alfa-romeo--6c--4',"Alfa Romeo 6C 2500 Freccia d'Oro (1949) (52856367969).jpg",'by/2.0']]){
const r=a.find(x=>x.id===id),t=s.find(x=>x.file===file);if(r.status==='done')continue;if(!r.folder){r.folder=root+'/staged/alfa-romeo/'+id+' '+r.generation;fs.mkdirSync(r.folder,{recursive:true});r.evidence=[t.referencePage,'https://www.camet.org/wp-content/uploads/2011/01/Mostra_Alfa-_Catalogo_finale.pdf'];}Object.assign(r,{referencePage:t.referencePage,image:t.image,credit:t.credit,licence:'CC '+lic.toUpperCase().replace('/',' '),licenceUrl:`https://creativecommons.org/licenses/${lic}/`});r.evidence[0]=t.referencePage;fs.copyFileSync(t.local,r.folder+'/reference.jpg');}
a.find(x=>x.id==='alfa-romeo--6c--0').variant='Normale touring body with raised canvas hood, flat rectangular radiator';
Object.assign(a.find(x=>x.id==='alfa-romeo--6c--2'),{licence:'Public domain',licenceUrl:'https://commons.wikimedia.org/wiki/Commons:Public_domain'});
Object.assign(a.find(x=>x.id==='alfa-romeo--6c--3'),{licence:'CC BY-SA 2.0',licenceUrl:'https://creativecommons.org/licenses/by-sa/2.0/'});
a.find(x=>x.id==='alfa-romeo--8c-historic--0').evidence.push('https://www.racingsportscars.com/chassis/archive/2311234.html');
a.find(x=>x.id==='alfa-romeo--8c-historic--0').evidence=[...new Set(a.find(x=>x.id==='alfa-romeo--8c-historic--0').evidence)];
a.find(x=>x.id==='alfa-romeo--4c--0').evidence[1]='https://www.media.stellantis.com/em-en/alfa-romeo/press/world-premiere-alfa-romeo-4c';
a.find(x=>x.id==='alfa-romeo--6c--1').evidence[1]='https://www.camet.org/wp-content/uploads/2011/01/Mostra_Alfa-_Catalogo_finale.pdf';
for(const r of a.filter(x=>x.folder))fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: Alfa Romeo\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\n`);
fs.writeFileSync(db,JSON.stringify(a,null,2));
