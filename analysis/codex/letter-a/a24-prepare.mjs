import fs from 'node:fs';
const root='analysis/codex/letter-a',sources=JSON.parse(fs.readFileSync(root+'/a24-sources.json'));
const specs=[
['db6',0,'DB6','1965–1970','Aston_Martin_DB6_Coupé_(1967)_(52856609651).jpg','1967 Mk I coupe','CC BY 2.0','by/2.0'],
['db7',0,'DB7','1994–2003','1997_Aston_Martin_DB7_Auto_2.jpg','1997 six-cylinder coupe, original look','CC BY-SA 4.0','by-sa/4.0'],
['db7-zagato',0,'DB7 Zagato','2003–2003','2003_Aston_Martin_DB7_Vantage_Zagato.jpg','2003 Zagato coupe','CC BY-SA 4.0','by-sa/4.0'],
['db9',0,'DB9','2004–2016','2006_Aston_Martin_DB9_Auto.jpg','2006 coupe, original pre-facelift look','CC BY-SA 4.0','by-sa/4.0'],
['dbs',0,'DBS','1967–1972','AstonMartinDB-S-1969-avant.jpg','1969 six-cylinder coupe, four headlights','Public domain (PD-self)','PD'],
['dbs',1,'DBS V12 — nová konstrukční rodina','2007–2012','2009_Aston_Martin_DBS_Auto_2.jpg','2009 V12 coupe','CC BY-SA 4.0','by-sa/4.0'],
['dbs',2,'DBS Superleggera','2018–?','The_frontview_of_Aston_Martin_DBS_Superleggera.jpg','2019 Superleggera coupe, original look','CC BY-SA 4.0','by-sa/4.0'],
['dbx',0,'DBX','2020–?','The_frontview_of_Aston_Martin_DBX_V8.jpg','Standard DBX V8, original bumper; not DBX707','CC BY-SA 4.0','by-sa/4.0'],
['international',0,'International','1929–1932','1930_Aston_Martin_International.jpg','1930 first-series open International; rally stickers and badges excluded','CC BY-SA 3.0','by-sa/3.0'],
['lagonda',0,'Lagonda','1974–1990','1984_Aston_Martin_Lagonda_Series_II_(Red),_front_right.jpg','1984 Series II wedge saloon, pop-up lamps closed; common wedge family look','CC BY-SA 3.0','by-sa/3.0'],
['le-mans',0,'Le Mans','1932–1934','1933_Aston_Martin_Le_Mans.JPG','1933 second-series short-chassis Le Mans, hood raised; stone guards and horns noted','CC BY-SA 3.0','by-sa/3.0']
];
const official='https://www.astonmartin.com/en/models/past-models';
const evidence={dbx:'https://media.astonmartin.com/aston-martin-unveils-dbx-an-suv-with-the-soul-of-a-sports-car-3/?lang=eng',international:'https://ecuriebertelli.com/history/history-of-aston-martin-cars/bertelli-1927-1931/international',lagonda:'https://media.astonmartin.com/lagonda-series-2/?lang=eng','le-mans':'https://ecuriebertelli.com/history/history-of-aston-martin-cars/bertelli-1932-1933/le-mans'};
const rows=[];for(const [slug,index,generation,years,file,variant,licence,lic] of specs){
const s=sources.find(s=>s.file===file&&s.local);if(!s)throw Error('Missing '+file);
const id=`aston-martin--${slug}--${index}`,folder=`${root}/staged/aston-martin/${id} ${index===1?'DBS V12':generation}`;
fs.mkdirSync(folder,{recursive:true});fs.copyFileSync(s.local,folder+'/reference.jpg');
const r={id,status:'failed',make:'Aston Martin',model:slug==='dbs'?'DBS':generation,generation,years,folder,referencePage:s.referencePage,image:s.image,credit:s.credit.split(' Object location')[0].replace(' ( talk )',''),licence,licenceUrl:lic==='PD'?'https://commons.wikimedia.org/wiki/Template:PD-self':`https://creativecommons.org/licenses/${lic}/`,evidence:[s.referencePage,index===2?'https://media.astonmartin.com/strongaston-martin-at-the-2018-goodwood-festival-of-speedstrongbr/?lang=eng':evidence[slug]||official],variant,view:'Front three-quarter; both headlights, grille, bonnet and front corners visible',referenceGate:'pass',genSeconds:null,notes:'Reference visually inspected; accessories to be removed. Generation pending.'};
rows.push(r);writeInfo(r);
}
function writeInfo(r){fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(u=>'Evidence: '+u).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\nNotes: ${r.notes}\n`);}
fs.writeFileSync(root+'/a-24-results.json',JSON.stringify(rows,null,2));
console.log('Staged',rows.length,'references and info.txt files');
