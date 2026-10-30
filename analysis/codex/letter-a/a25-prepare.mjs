import fs from 'node:fs';
const root='analysis/codex/letter-a',sources=JSON.parse(fs.readFileSync(root+'/a25-sources.json'));
const eb='https://ecuriebertelli.com/history/history-of-aston-martin-cars/';
const specs=[
['mark-ii','Mark II','1934–?','1934_Aston_Martin_Mark_II.jpg','1934 short-chassis 2/4-seat tourer; thermostatic radiator shutters','CC BY 4.0','by/4.0',eb+'bertelli-1934-1935/mark-ii'],
['one-77','One-77','2010–2012','2012_Aston_Martin_One-77_7.3_Front.jpg','2012 production coupe, not 2009 mockup','CC BY-SA 4.0','by-sa/4.0','https://media.astonmartin.com/one-77/?lang=eng'],
['rapide','Rapide','2010–?','Aston_Martin_Rapide_front.JPG','Original 2010–2012 production look, split upper/lower grille; not Rapide S','CC0 1.0','CC0','https://www.astonmartin.com/en-gb/models/past-models/rapide'],
['short-chassis-volante','Short Chassis Volante','1965–1966','Paris_-_Retromobile_2014_-_Aston_Martin_DB6_Short_Chassis_Volante_-_1966_-_001.jpg','1966 short-chassis convertible, hood down; split bumpers; not long-chassis DB6 Volante','CC BY-SA 3.0','by-sa/3.0','https://astonmartins.com/car/short-chassis-volante/'],
['sports-model','Sports Model','?–?','Paris_-_Bonhams_2017_-_Aston_Martin_1½-Litre_standard_sports_model_-_1928_-_006.jpg','1928 Bertelli first-series Sports Model, fixed touring wings; not 1921–1925 Bamford & Martin Standard Sports','CC BY-SA 4.0','by-sa/4.0',eb+'bertelli-1927-1931/sports-model'],
['standard-sports','Standard Sports','1921–1925','1923_Aston_Martin_Cloverleaf_1.5.jpg','1923 Bamford & Martin side-valve long-chassis Cloverleaf tourer, restored original three-seat body; representative surviving early production variant','CC BY-SA 4.0','by-sa/4.0','https://media.astonmartin.com/rare-and-historic-aston-martin-known-as-cloverleaf-runs-up-aston-hill-to-celebrate-the-sports-cars-95th-anniversary/?lang=eng'],
['ulster','Ulster','1934–1936','1935_Aston_Martin_Ulster.jpg','1935 Ulster two-seat sports; cycle wings and aero screens; stone guards and extra lamps noted','CC BY-SA 4.0','by-sa/4.0',eb+'bertelli-1934-1935/ulster'],
['v12-speedster','V12 Speedster','?–?','Aston_Martin_V12_Speedster_1.jpg','2021 production V12 Speedster, factory DBR1 specification; no roof or windscreen; racing roundels omitted','CC BY-SA 4.0','by-sa/4.0','https://media.astonmartin.com/thrilling-new-optional-bespoke-specification-revealed-for-limited-edition-aston-martin-v12-speedster/?lang=eng'],
['v12-zagato','V12 Zagato','2011–2012','2013_Aston_Martin_V12_Zagato.jpg','Production road coupe, standard 2012–2013 body; not racing Corsa or later Heritage Twins','CC BY-SA 4.0','by-sa/4.0','https://media.astonmartin.com/v12-zagato/?lang=eng'],
['v8','V8','1972–1989','1977_Aston_Martin_V8.jpg','1977 Series 3 carburettor saloon/coupe; open bonnet scoop, standard grille and chrome bumpers','CC BY-SA 4.0','by-sa/4.0','https://www.astonmartin.com/en-gb/models/past-models/amv8'],
['v8-coupe','V8 Coupé','1996–2000','1996_Aston_Martin_V8.jpg','1996 naturally aspirated V8 Coupe; mesh grille, smooth bonnet and round lower driving lamps; not supercharged Vantage','CC0 1.0','CC0','https://media.astonmartin.com/v8-coupe/?lang=eng']
];
const rows=[];
for(const [slug,generation,years,file,variant,licence,lic,second] of specs){
const s=sources.find(s=>s.file===file&&s.local);if(!s)throw Error('Missing '+file);
const id=`aston-martin--${slug}--0`,folder=`${root}/staged/aston-martin/${id} ${generation}`;
fs.mkdirSync(folder,{recursive:true});fs.copyFileSync(s.local,folder+'/reference.jpg');
const r={id,status:'failed',make:'Aston Martin',model:generation,generation,years,folder,referencePage:s.referencePage,image:s.image,credit:s.credit==='See source'?(slug==='rapide'?'Tokumeigakarinoaoshima':'Thesupermat'):s.credit,licence,licenceUrl:lic==='CC0'?'https://creativecommons.org/publicdomain/zero/1.0/':`https://creativecommons.org/licenses/${lic}/`,evidence:[s.referencePage,second],variant,view:'Front three-quarter; full front, both headlights, grille, bonnet and front corners visible',referenceGate:'pass',genSeconds:null,notes:'Reference visually inspected. Extra lamps, horns, rally/show stickers and plaques to be excluded. Generation pending.'};
if(slug==='v12-zagato')r.notes+=' Catalogue dates 2011–2012 retained verbatim; manufacturer dates production road model 2012–2013. Photo is labelled 2013, same production family.';
if(slug==='short-chassis-volante')r.evidence.push('https://www.historicclassics.com/23/road-cars/1966-aston-martin-sc-volante-for-sale');
if(slug==='standard-sports')r.evidence.push('https://www.tradeuniquecars.com.au/history-of-aston-martin');
rows.push(r);
}
rows.splice(6,0,{id:'aston-martin--t-type--0',status:'no-reference',make:'Aston Martin',model:'T Type',generation:'T Type',years:'1928–1929',folder:null,referencePage:null,licence:null,evidence:[eb+'bertelli-1927-1931/t-type','https://astonmartins.com/car/t-type-saloon-and-tourer/'],variant:'Four-door tourer T14 sought; saloon alternative researched',view:null,genSeconds:null,notes:'Searched Wikimedia Commons T Type/T-type/T14/CC8433, AstonMartins T14 article, Ecurie Bertelli history and Revs Institute T-Type. Ecurie history has no car photograph; AstonMartins source image HTTP 403 (no challenge bypass); Revs image requires purchase. No downloadable front photograph passed reference gate; no generation.'});
for(const r of rows.filter(r=>r.folder))fs.writeFileSync(r.folder+'/info.txt',`ID: ${r.id}\nZnačka: ${r.make}\nModel: ${r.model}\nGenerace: ${r.generation}\nRoky: ${r.years}\nPage: ${r.referencePage}\nImage: ${r.image}\nCredit: ${r.credit}\nLicence: ${r.licence}\nLicence URL: ${r.licenceUrl}\n${r.evidence.map(u=>'Evidence: '+u).join('\n')}\nView: ${r.view}\nVariant: ${r.variant}\nNotes: ${r.notes}\n`);
fs.writeFileSync(root+'/a-25-results.json',JSON.stringify(rows,null,2));console.log('Staged',rows.filter(r=>r.folder).length,'references; 1 no-reference');
