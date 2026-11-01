import fs from 'node:fs';import assert from 'node:assert/strict';
const root='analysis/codex/rare-engines-pass',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n'),q=read(root+'/queue.json');
const de=t=>'https://de.wikipedia.org/wiki/'+t;
// Admission is per model/generation. A European marque alone does not admit its regional derivatives.
const proof=[
 ['skoda/enyaq-coupe','https://www.skoda.ie/_doc/7fb0747c-5a56-4093-b0ca-81d5a63c0554','Irish Enyaq Coupe product guide, own European model.'],
 ['mercedes-benz/amg-one','https://www.mercedes-amg.com/en/amg-one','European road-car model, manufacturer describes plug-in hybrid and European emissions.'],
 ['mercedes-benz/eqe-suv','https://media.mercedes-benz.pl/mercedes-eqe-suv-juz-dostepny-w-sprzedazy-w-polsce/','Manufacturer explicitly announces Polish sales, December 2022.'],
 ['mercedes-benz/tn-t1',de('Mercedes-Benz_T_1'),'Own European commercial-model history and technical table, production through 1995.'],
 ['toyota/corolla-cross','https://scene7.toyota.eu/is/content/toyotaeurope/toyota/nmsc/ireland/guides/Corolla-Cross-PDF-Guide-v2.pdf','Irish Toyota product guide for the actual Corolla Cross.'],
 ['citroen/ami','https://www.media.stellantis.com/be-fr/citroen/press/la-nouvelle-citroen-ami-effectue-ses-premiers-pas-dans-la-capitale-de-l-europe','Manufacturer explicitly describes Belgian availability of the 2020 electric Ami.'],
 ['citroen/c35',de('Citroën_C35'),'Own French/European commercial model; do not copy an arbitrary Fiat 242 engine.'],
 ['opel/arena',de('Opel_Arena_(Kleintransporter)'),'Own Opel European van; Vauxhall and other rebadges distinguished.'],
 ['fiat/albea','https://www.media.stellantis.com/em-en/fiat/press/the-new-fiat-albea-has-arrived-in-poland-and-turkey','Manufacturer explicitly documents Polish sales in 2002.'],
 ['fiat/marengo',de('Fiat_Marengo'),'Italian commercial derivative family; European eligibility does not resolve its internal generation structure.'],
 ['audi/a6-e-tron','https://www.audi.ch/content/dam/nemo/ch/preislisten/mj25/Audi_A6_e-tron_Preisliste_MJ25_ab_24.10.2024_DE.pdf','Swiss manufacturer price list, October 2024.'],
 ['audi/q4-e-tron','https://www.mynewsdesk.com/dk/audi-danmark/pressreleases/verdenspremiere-paa-audi-q4-e-tron-3090626','Audi Denmark explicitly announces Danish sales, June 2021.'],
 ['audi/rs2','https://www.audi-mediacenter.com/en/publications/more/audi-tradition-anniversary-dates-2024-1484/download','Manufacturer history documents the German-market RS2 and 1994 customer deliveries.'],
 ['audi/s2','https://www.audi-mediacenter.com/en/press-releases/40-years-of-audi-five-cylinder-engines-6616/download','Manufacturer history identifies the own S2 production model.'],
 ['dacia/1320','https://en.wikipedia.org/wiki/Dacia_1320','Romanian domestic model, source redirects to the wider 1310 family; engine attribution still requires review.'],
 ['dacia/1325','https://en.wikipedia.org/wiki/Dacia_1325','Own model source explicitly records exports to Eastern Europe and Greece.'],
 ['dacia/500',de('Dacia_500'),'Own Romanian domestic model produced through 1991.'],
 ['dacia/nova',de('Dacia_Nova'),'Own Romanian-market production model, 1995–2000.'],
 ['dacia/supernova',de('Dacia_SuperNova'),'Own Romanian-market production model, 2000–2003.'],
 ['kia/joice',de('Kia_Joice'),'Own model source distinguishes European-market Joice from other regional badges.']
];
const fleet={};for(const f of fs.readdirSync('src/data/stats').filter(f=>f.endsWith('.json'))){const x=read('src/data/stats/'+f);fleet[f.slice(0,-5)]=Object.values(x).reduce((n,r)=>n+(r?.fleet?.n??0),0);}
const compare=(a,b)=>b.makeMatchedFleet-a.makeMatchedFleet||a.make.localeCompare(b.make)||a.line.localeCompare(b.line)||a.index-b.index,proofs=new Map(proof.map(([id,url,note])=>[id,{url,note}]));
const ranked=q.zeroModernCandidates.map(r=>({...r,makeMatchedFleet:fleet[r.make]??0})).sort(compare),confirmed=[],pending=[];
for(const r of ranked){const p=proofs.get(r.make+'/'+r.line);(p?confirmed:pending).push(p?{...r,europeanMarketStatus:'reviewed-european-model',marketEvidence:p}: {...r,europeanMarketStatus:'requires-generation-specific-source-review'});}
assert.equal(confirmed.length,20);assert.equal(confirmed.length+pending.length,1238);
const result={ranking:'Descending sum of published fleet.n across matched model lines of each make; ties by make, line, generation index.',periodRule:'Series production overlaps 1990 or later, including models introduced earlier and still produced after 1990. Undated records are not admitted.',counts:{datedPool:1238,marketConfirmed:confirmed.length,marketReviewPending:pending.length,dateUnconfirmedHeld:679},confirmed,pending};
write(root+'/zero-market-queue.json',result);
const registered=read(root+'/batch-1/remaining-queue.json').nextRegistered1To99;write(root+'/batch-2/selection.json',registered.concat(confirmed.map(r=>({...r,queueGroup:'zero-matched-fleet-european'}))));
write(root+'/batch-2/registered-selection.json',registered);write(root+'/batch-2/zero-selection.json',confirmed);console.log(result.counts);
