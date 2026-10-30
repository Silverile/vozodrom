import fs from 'node:fs';
const root='analysis/codex/letter-a',s=JSON.parse(fs.readFileSync(root+'/a19-sources.json'));
const specs=[
['classic',1,'Rambler Classic','Classic II','1963–1964','1963_Rambler_Classic_660_four_door_sedan_AMO_2015_meet_1of4.jpg','1963 Classic 660 four-door sedan','63rc/63rc.html','by-sa/4.0'],
['classic',2,'Rambler Classic','Classic III','1965–1966','1965_Rambler_Classic_770_Cross_Country,_front_right.jpg','1965 Classic 770 Cross Country wagon','65r/65r.html','by-sa/3.0'],
['concord',0,'Concord','Concord – rodinaMY1978–1983','1977–1983','1981_AMC_Concord_4-door_beige_PAfr.jpg','1981 Concord sedan; representative later quad-headlamp front','81con/81con.html','Public domain'],
['eagle',0,'Eagle','Eagle – rodinaMY1980–1988','1979–1987','1981_AMC_Eagle_Sport_station_wagon_in_blue_metallic_at_2021_PA_meet_03of14.jpg','1981 Eagle Sport wagon; factory roof rails retained, auxiliary bumper lights omitted','80amc/80amc.html','zero'],
['gremlin',0,'Gremlin','Gremlin – původní USA/Kanada','1970–1978','1974_AMC_Gremlin_in_Trans-Am_Red,_front_left.jpg','1974 US Gremlin base hatchback; middle-period front','amcf72/amcf72.html','by-sa/3.0'],
['gremlin',1,'Gremlin','VAM Gremlin – mexické modelové jméno','1974–1983',null,'No selected variant',null,null],
['hornet',0,'Hornet','Hornet – základní rodinaMY1970–1977','1969–1977','70-77_hornet_front_6-17-23.png','1971 Hornet four-door sedan; original grille with small integrated lamps','amcf72/amcf72.html','zero'],
['javelin',0,'Javelin','Javelin I – MY1968–1970','1967–1970','1968_AMC_Javelin.JPG','1968 Javelin coupe, original first-generation front','68ar/68ar.html','by-sa/4.0'],
['javelin',1,'Javelin','Javelin II – MY1971–1974','1970–1974','1972_AMC_Javelin_-_Flickr_-_dave_7.jpg','1972 Javelin second-generation coupe, standard closed hood; aftermarket wheels omitted','amcf72/amcf72.html','by/2.0'],
['marlin',0,'Marlin','Marlin – původní základClassic','1965–1966','1965_AMC_Marlin_white-6_NJ_front.JPG','1965 Rambler Marlin six-cylinder fastback, Classic-based body','65mar/65mar.html','Public domain'],
['marlin',1,'Marlin','Marlin – větší řada proMY1967','1966–1967','1967_two_AMC_Marlins_front-view.jpg','1967 AMC Marlin red fastback, larger Ambassador-based body','67amc/67amc.html','Public domain'],
['matador',0,'Matador','Matador – první rodinaMY1971–1973','1970–1973','1972_AMC_Matador_(4548228023).jpg','1972 Matador two-door hardtop, early body with quad round lamps','amcf72/amcf72.html','by/2.0']
];
const db=root+'/a-19-results.json',old=fs.existsSync(db)?JSON.parse(fs.readFileSync(db)):[];
const rows=specs.map(([line,n,model,generation,years,file,variant,ev,lic])=>{const id=`amc--${line}--${n}`,prev=old.find(x=>x.id===id);if(prev?.status==='done')return prev;const src=s.findLast(x=>x.file===file&&x.local);const folder=src?`${root}/staged/amc/${id} ${generation.replace(/[<>:"/\\|?*]/g,'-')}`:null;
const licence=lic==='zero'?'CC0 1.0':lic?.includes('/')?'CC '+lic.replace('by-sa','BY-SA').replace('by','BY').replace('/',' '):lic;
const licenceUrl=lic==='zero'?'https://creativecommons.org/publicdomain/zero/1.0/':lic==='Public domain'?src?.referencePage:lic?`https://creativecommons.org/licenses/${lic}/`:null;
const r={id,make:'AMC',model,generation,years,status:line==='gremlin'&&n===1?'no-reference':'failed',folder,referencePage:src?.referencePage??null,image:src?.image,credit:['javelin'].includes(line)&&n===0?'Crwpitman':line==='gremlin'&&n===0?'Mr.choppers':src?.credit,licence,licenceUrl,evidence:src?[src.referencePage,'https://www.lov2xlr8.no/brochures/amc/'+ev]:[],variant,view:(['eagle','matador'].includes(line)||line==='javelin'&&n===1?'Head-on':'Front three-quarter')+'; complete front, both headlights and bumper corners visible. Remove wipers, antenna, plates, stickers, show cards, auxiliary lamps and glass contents.',genSeconds:0,notes:'Reference gate pending',promptSuffix:`AMC ${generation} (${years}). Remember: no wipers, no antenna, empty glass, no letters, both mirrors, no accessories.`};
if(r.credit?.includes('CZmarlin')||r.credit==='See source')r.credit='Christopher Ziemnowicz (CZmarlin)';
if(src){fs.mkdirSync(folder,{recursive:true});fs.copyFileSync(src.local,folder+'/reference.jpg');fs.writeFileSync(folder+'/info.txt',`ID: ${id}\nZnačka: AMC\nModel: ${model}\nGenerace: ${generation}\nRoky: ${years}\nPage: ${src.referencePage}\nImage: ${src.image}\nCredit: ${r.credit}\nLicence: ${licence}\nLicence URL: ${licenceUrl}\n${r.evidence.map(x=>'Evidence: '+x).join('\n')}\nView: ${r.view}\nVariant: ${variant}\n`);}return r;});
fs.writeFileSync(db,JSON.stringify(rows,null,2));console.log(rows.map(x=>[x.id,!!x.folder]));
