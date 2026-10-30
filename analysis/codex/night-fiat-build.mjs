import fs from'node:fs';import{card,generation,version,markUnknowns,proposedLine,saveCards}from'./night-card-helpers.mjs';
if(fs.existsSync('src/data/model-cards/fiat.json'))throw Error('External Claude file exists');fs.mkdirSync('analysis/codex/fiat-evidence',{recursive:true});
const W=n=>'https://en.wikipedia.org/wiki/Fiat_'+n.replaceAll(' ','_');const rows=[];
const existing=JSON.parse(fs.readFileSync('src/data/catalog/model-lines-auto.json')).filter(c=>c.makeSlug==='fiat');
const overrides={'bravo':'Bravo_and_Brava','coupe':'Coupé','doblo':'Doblò','124-spider':'124_Spider_(2016)','600':'600','500':'500','topolino':'500_"Topolino"','tipo':'Tipo','panda':'Panda','punto':'Punto'};
for(const c of existing)rows.push({slug:c.slug,name:c.name,page:overrides[c.slug]||c.name.split(' / ')[0]});
const historical=`4-hp|4 HP|4 HP
6-hp|6 HP|6 HP
8-hp|8 HP|8 HP
10-hp|10 HP|10 HP
12-hp|12 HP|12 HP
16-20-hp|16–20 HP|16-20 HP
24-32-hp|24–32 HP|24-32 HP
60-hp|60 HP|60 HP
brevetti|Brevetti|Brevetti
1|1|1
2|2 / 2B|2B
zero|Zero|Zero
70|70|70
501|501|501
505|505|505
510|510|510
520|520 / Superfiat|520
502|502|502
519|519|519
509|509|509
503|503|503
507|507|507
512|512|512
521|521|521
525|525|525
514|514|514
515|515|515
522|522|522
524|524|524
508|508 Balilla|508
518|518 Ardita|518
527|527 Ardita|527
1500|1500|1500_(1935)
1100|1100|1100
2800|2800|2800
1400|1400 / 1900|1400
campagnola|Campagnola|Campagnola
8v|8V|8V
1200|1200|1200
cabriolet|1200 / 1500 / 1600 Cabriolet|Pininfarina_Cabriolet
1800|1800 / 2100|1800_and_2100
1300|1300 / 1500|1300_and_1500
2300|2300|2300
850|850|850
124|124|124
124-sport-coupe|124 Sport Coupé|124_Sport_Coupé
dino|Dino|Dino
125|125|125
128|128|128
130|130|130
127|127|127
126|126|126
132|132|132
x1-9|X1/9|X1/9
131|131|131
133|133|133
147|147|147
ritmo|Ritmo|Ritmo
argenta|Argenta|Argenta
regata|Regata|Regata
duna|Duna / Prêmio / Elba|Duna
oggi|Oggi|Oggi
panorama|Panorama|Panorama
viaggio|Viaggio / Ottimo|Viaggio
argo|Argo|Argo
cronos|Cronos|Cronos
mobi|Mobi|Mobi
pulse|Pulse|Pulse
fastback|Fastback|Fastback
toro|Toro|Toro
titano|Titano|Titano
1100-t|1100 T|1100_T
238|238|238
241|241|241
242|242|242
900t|900T / 900E|900T
daily|Daily|Daily
marengo|Marengo|Marengo`;
for(const l of historical.split('\n')){const[slug,name,page]=l.split('|');rows.push({slug,name,page});}
const clean=s=>s.replace(/<sup[\s\S]*?<\/sup>/g,'').replace(/<[^>]+>/g,' ').replaceAll('&nbsp;',' ').replaceAll('&#160;',' ').replaceAll('&amp;','&').replace(/\s+/g,' ').trim();const evidence=[];
for(let i=0;i<rows.length;i+=6)await Promise.all(rows.slice(i,i+6).map(async r=>{const url=W(r.page);try{const f=await fetch(url),s=await f.text();const prod=clean(s.match(/<th[^>]*>Production<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/)?.[1]||'');const body=clean(s.match(/<th[^>]*>Body style<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/)?.[1]||'');evidence.push({...r,url,status:f.status,production:prod.slice(0,700),body:body.slice(0,400)});}catch(e){evidence.push({...r,url,status:0,error:String(e)});}}));
fs.writeFileSync('analysis/codex/fiat-evidence/identities.json',JSON.stringify(evidence,null,2));
const cards=[];const layouts={panda:[['I (141)',1980,2003,'Panda'],['II (169)',2003,2012,'Panda'],['III (319)',2011,null,'Panda']],punto:[['I (176)',1993,1999,'Punto'],['II (188)',1999,2010,'Punto'],['III (199) / Grande Punto / Punto Evo',2005,2018,'Grande_Punto']],bravo:[['Bravo / Brava (182)',1995,2001,'Bravo_and_Brava'],['Bravo (198)',2007,2014,'Bravo_(2007)']],croma:[['I (154)',1985,1996,'Croma'],['II (194)',2005,2010,'Croma']],tipo:[['I (160)',1988,1995,'Tipo_(1988)'],['II (356)',2015,null,'Tipo_(2015)']],500:[['Nuova 500 (110)',1957,1975,'500'],['500 (312)',2007,2024,'500_(2007)'],['New 500 electric (332)',2020,null,'New_500']],600:[['600 (100)',1955,1969,'600'],['600 / 600e (F364)',2023,null,'600_(2023)']],topolino:[['500 Topolino',1936,1955,'500_"Topolino"'],['Topolino electric quadricycle',2023,null,'Topolino_(2023)']],1100:[['508 C / 1100',1937,1953,'1100_(1937)'],['1100 / 103',1953,1969,'1100']],1500:[['1500 pre-war',1935,1950,'1500_(1935)']],520:[['520 Superfiat',1921,1923,'520'],['520 six-cylinder',1927,1930,'520']], '124-spider':[['124 Sport Spider',1966,1985,'124_Sport_Spider'],['124 Spider (348)',2016,2020,'124_Spider_(2016)']],doblo:[['I (223)',2000,2010,'Doblò'],['II (263)',2009,2022,'Doblò'],['III (K9)',2022,null,'Doblò']],ducato:[['I (280 / 290)',1981,1994,'Ducato'],['II (230 / 244)',1994,2006,'Ducato'],['III (250 / 290)',2006,null,'Ducato']],scudo:[['I',1996,2007,'Scudo'],['II',2007,2016,'Scudo'],['III',2022,null,'Scudo']],ulysse:[['I',1994,2002,'Ulysse'],['II',2002,2010,'Ulysse'],['III / E-Ulysse',2022,null,'Ulysse']],fiorino:[['I',1977,1988,'Fiorino'],['II',1988,2013,'Fiorino'],['III Europe (225)',2007,2024,'Fiorino'],['III Brazil (327)',2013,null,'Fiorino']],uno:[['I (146)',1983,null,'Uno'],['II Brazil (327)',2010,2021,'Uno']],talento:[['Ducato-derived short van',1989,1994,'Talento'],['Renault-derived van',2016,2020,'Talento']]};
function bodies(s){const o=[];for(const[re,b]of [[/hatchback/i,'hatchback'],[/estate|station wagon/i,'kombi'],[/sedan|saloon/i,'sedan'],[/coup[eé]/i,'kupe'],[/cabriolet|convertible|roadster|spider/i,'kabriolet'],[/SUV|crossover/i,'suv'],[/MPV|minivan/i,'mpv'],[/panel van|van|LCV/i,'dodavka'],[/pick.?up/i,'pickup']])if(re.test(s))o.push(b);return o.length?o:null;}
for(const r of rows){const e=evidence.find(e=>e.slug===r.slug),source=e.url;let defs=layouts[r.slug];if(!defs){const m=e.production?.match(/^(\d{4})\s*[–−-]\s*(\d{4}|present)/);defs=[[r.name,m?+m[1]:null,m&&m[2]!=='present'?+m[2]:null,r.page]];}const gs=defs.map(([name,from,to,page])=>generation(name,from,to,[W(page)],{bodyTypes:bodies(e.body||''),markets:['Europe / source-specific global production'],marketNotesCs:'Rozsah výroby se liší podle trhu; evropský konec není automaticky globálním koncem. Technické verze jsou omezeny na uvedený rok a trh.'}));if(r.slug==='topolino')gs[1].bodyTypes=null;const text=`Řada ${r.name} je zde vedena jako samostatná výrobní rodina značky Fiat. Přehled rozlišuje doložené výrobní etapy; výbavy, regionální nabídka a technické verze zatím nejsou vyčerpávající.`;cards.push(card('fiat',r.slug,r.name,text,gs,[source],{isAddition:!existing.some(c=>c.slug===r.slug)}));saveCards('fiat',cards);}
fs.writeFileSync('analysis/codex/night-fiat-report.json',JSON.stringify({makeSlug:'fiat',retrievedAt:new Date().toISOString(),counts:{cards:cards.length,generationRecords:cards.flatMap(c=>c.generations).length,versions:0,photos:0},proposedLines:cards.filter(c=>c.isAddition).map(proposedLine),gaps:['Early checkpoint; version and photograph research pending.','Global production histories and regional rebadges are partial. Dates not present in checked infoboxes remain null.'],validation:{status:'pending'}},null,2)+'\n');console.log('Saved Fiat',cards.length);
