import fs from 'node:fs';
const root='analysis/codex/letter-a',db=root+'/a-12-results.json',sources=JSON.parse(fs.readFileSync(root+'/a12-sources.json'));
const history='https://www.media.stellantis.com/uk-en/alfa-romeo/press/alfa-romeo-celebrates-its-100th-anniversary-today';
const specs=[
['alfetta-gt',0,'Alfetta GT / GTV','Alfetta GT / GTV','1974–1986','1979 Alfa Romeo Alfetta 2000 GTV front.jpg','1979 2000 GTV, original chrome-bumper coupe','https://www.museoalfaromeo.com/en-us/news/Pages/Eventi-2023/Backstage-2023.aspx','by/2.0'],
['brera',0,'Brera','Brera','2005–2010','The frontview of Alfa Romeo Brera 2.2 JTS.JPG','2.2 JTS production coupe','https://www.media.stellantis.com/uk-en/alfa-romeo/press/alfa-romeo-wins-autocar-design-award','CC0'],
['giulia',0,'Giulia','Giulia Berlina','1962–1978','1965 Alfa Romeo Giulia TI (9350691975).jpg','1965 Giulia TI, original four-headlamp sedan','https://www.media.stellantis.com/uk-en/alfa-romeo/press/the-alfa-romeo-giulia','by/2.0'],
['giulia',1,'Giulia','Giulia moderní sedan','2015–?','2018 Alfa Romeo Giulia Speciale TD Automatic 2.1 Front.jpg','2018 Speciale diesel sedan, pre-facelift lamps','https://www.media.stellantis.com/uk-en/alfa-romeo/press/the-alfa-romeo-giulia','by-sa/4.0'],
['giulietta',0,'Giulietta','Giulietta původní rodina','1954–?','1957 Alfa Romeo Giulietta Berlina Normale 1.3 Front.jpg','1957 Berlina Normale sedan; mass-production body representing the 750/101 family','https://www.museoalfaromeo.com/en-us/collezione/Pages/Giulietta.aspx','by-sa/4.0'],
['giulietta',1,'Giulietta','Giulietta transaxle','1977–?','Alfa-Romeo Giulietta-1,8 Front-view.JPG','1.8 Type 116 sedan, early narrow-bumper appearance','https://www.museoalfaromeo.com/en-us/news/Pages/FCAMilanoAutoClassica2016.aspx','PD'],
['gt',0,'GT','GT','2003–2010','Alfa GT 20090801 front.JPG','Standard production coupe, original front; replacement shows both headlamp assemblies',history,'Attribution'],
['gtv',0,'GTV','GTV','1994–2005','1998-2003 Alfa Romeo GTV Twin Spark coupe 01.jpg','2001 Type 916 Twin Spark coupe, phase 2',history,'PD'],
['junior',0,'Junior','Junior','2024–?','Alfa Romeo Junior Ibrida DSC 7219.jpg','2024 Ibrida Speciale crossover, original Leggenda grille','https://www.media.stellantis.com/em-en/alfa-romeo/press/junior-ibrida-debuts-at-all-european-dealerships-a-true-alfa-romeo-in-urban-outfit','by-sa/4.0'],
['mito',0,'MiTo','MiTo','2008–?','Alfa Romeo MiTo 20090603 front.JPG','Original 2008-series hatchback before facelifts',history,'PD'],
['rl',0,'RL','RL','1922–1927','Arese Museo Storico Alfa Romeo 1925 RL Super Sport.jpg','1925 RL Super Sport Castagna open tourer; omit horn, extra small lamps, side spare wheels and mascot','https://www.museoalfaromeo.com/en-us/news/Pages/due-auto-del-Museo-a-Essen.aspx','by-sa/4.0'],
['rm',0,'RM','RM','1923–1925','Alfa Romeo RM Sport Castagna.jpg','1924 RM Sport Castagna cabriolet, museum car','https://automotivemasterpieces.com/file/80kgNlLy10','by-sa/2.0']
];
const old=fs.existsSync(db)?JSON.parse(fs.readFileSync(db)):[];
const rows=specs.map(([slug,n,model,generation,years,file,variant,ev,lic])=>{
 const id=`alfa-romeo--${slug}--${n}`,prev=old.find(x=>x.id===id);if(prev?.status==='done')return prev;
 const t=sources.find(x=>x.file===file),folder=t?.local?root+'/staged/alfa-romeo/'+id+' '+generation.replace(/[<>:"/\\|?*]/g,'-'):null;
 const r={id,make:'Alfa Romeo',model,generation,years,status:'failed',folder,referencePage:t?.referencePage||null,image:t?.image,credit:t?.credit,licence:lic==='PD'?'Public domain':lic==='CC0'?'CC0 1.0':'CC '+lic.toUpperCase().replace('/',' '),licenceUrl:lic==='PD'?t?.referencePage:lic==='CC0'?'https://creativecommons.org/publicdomain/zero/1.0/':`https://creativecommons.org/licenses/${lic}/`,evidence:t?[t.referencePage,ev]:[],variant,view:'Front three-quarter; grille, both headlamps, both front bumper corners and bonnet visible. Omit plates, wipers, antenna and show accessories.',genSeconds:0,notes:'Reference pending individual visual gate.',promptSuffix:`Alfa Romeo ${generation} (${years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`};
 if(lic==='Attribution'){r.licence='Attribution-only licence';r.licenceUrl=t?.referencePage;}
 if(folder){fs.mkdirSync(folder,{recursive:true});fs.copyFileSync(t.local,folder+'/reference.jpg');fs.writeFileSync(folder+'/info.txt',`ID: ${id}\nZnačka: Alfa Romeo\nModel: ${model}\nGenerace: ${generation}\nRoky: ${years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${variant}\n`);}return r;
});fs.writeFileSync(db,JSON.stringify(rows,null,2));console.log(rows.map(x=>({id:x.id,folder:x.folder})));
