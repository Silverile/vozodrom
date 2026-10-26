import fs from 'node:fs';
import crypto from 'node:crypto';
const baseline=JSON.parse(fs.readFileSync('analysis/codex/skoda-wide-photos-baseline.json','utf8')).targets;
const replacements=[];
const candidates=[
 ['yeti',0,'Skoda Yeti – Frontansicht, 14. Juni 2011, Mettmann.jpg',2253,1473,'M 93','CC BY-SA 3.0 de','https://creativecommons.org/licenses/by-sa/3.0/de/','Yeti před modernizací. Celý vůz včetně kol a antény je vidět, bez překrytí. Náhled 960 × 628 px: vlevo přibližně 55 px, vpravo 53 px, dole 40 px; nahoře přes 60 px.'],
 ['rapid',0,'2013 Skoda Rapid S TSi.jpg',2040,1404,'Calreyn88','CC BY-SA 4.0','https://creativecommons.org/licenses/by-sa/4.0/','Evropský Rapid liftback NH, nikoli čínský sedan nebo Spaceback. Celý vůz ze tří čtvrtin zepředu. Náhled 960 × 661 px: vlevo přes 80 px, vpravo přes 75 px, nahoře přes 75 px, dole přes 90 px. Kapota je černá.'],
 ['octavia',3,'2022 Skoda Octavia SE TSi.jpg',1842,1214,'Calreyn88','CC BY-SA 4.0','https://creativecommons.org/licenses/by-sa/4.0/','Octavia IV před modernizací; celé auto ze tří čtvrtin zepředu. Náhled 960 × 633 px: vlevo přibližně 64 px, vpravo 90 px, nahoře 60 px, dole 100 px. POZOR: Combi, zatímco původní fotografie byla liftback; generace je stejná.']
];
for(const [lineSlug,generationIndex,file,width,height,authorHtml,licence,licenceUrl,reviewNoteCs]of candidates){
 const old=baseline.find(t=>t.lineSlug===lineSlug&&t.generationIndex===generationIndex),fn=file.replaceAll(' ','_'),h=crypto.createHash('md5').update(fn).digest('hex');
 const path=h[0]+'/'+h.slice(0,2)+'/'+encodeURIComponent(fn),url='https://upload.wikimedia.org/wikipedia/commons/'+path;
 replacements.push({lineSlug,generationIndex,oldFile:old.file,oldAspect:old.aspect,newAspect:width/height,photoEvidence:{file:'File:'+file,url,filePageUrl:'https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(fn),sha1:null,width,height,authorHtml,licence,licenceUrl,attributionRequired:'true',copyrighted:'True',creditHtml:'Own work',descriptionHtml:null,objectName:file.replace(/\.(jpg|JPG)$/,'')},reviewNoteCs,visualReview:'approved',reviewMethod:'Visual inspection of published Commons proportional 960px preview, no crop or editing',reviewedPreviewUrl:'https://thumb.wikimedia.org/wikipedia/commons/thumb/'+path+'/960px-'+encodeURIComponent(fn)});
}
const attempts=[
 ['octavia',0,'1998 Skoda Octavia GLX 1.9 TDi (15622468551).jpg','Viewed 960px: rear three-quarter rather than front.'],
 ['octavia',0,'Škoda Octavia GLXI 1,6.jpg','Viewed 960px: stripped headlights, discarded car with wheels/clutter in foreground.'],
 ['octavia',0,'Skodaoctavia99.jpg','Second pass under expanded1.3–1.75 allowance: viewed960px; left~20px/960, right~36px/960, both <5%. Ratio acceptable; reject only margins.'],
 ['octavia',0,'Skoda Octavia 20110508 2.jpg','Second pass: viewed960px; rear view of fire-service car, side margins~20px/960 <5%. Ratio1.707 acceptable under expanded allowance.'],
 ['octavia',0,'Skoda Octavia 20110508.jpg','Second pass viewed960px: front three-quarter fire-service car, both side margins~30px/960 <5%, aspect1.805 also exceeds expanded1.75.'],
 ['octavia',0,'Škoda Octavia I.JPG','Second pass viewed960px: acceptable4:3-type fallback ratio1.346, but left~16px/960 <5%; antenna almost touches top.'],
 ['octavia',0,'Skoda Octavia 1.9 TDi Ambiente 2002 (12759416904).jpg','Second pass viewed960px: 4:3, left/right~30px/960 <5%.'],
 ['octavia',0,'Skoda Octavia 1.9 TDi Ambiente 2004 (14305660567).jpg','Second pass viewed960px: 4:3, car nearly touches both side edges <5%.'],
 ['octavia',0,'Skoda Octavia 2.0 Ambiente 2003 (9466534853).jpg','Second pass viewed960px: 4:3, both side edges<5%; kerb obscures tyre bottoms.'],
 ['octavia',2,'Skoda Octavia 2014 (14890454679).jpg','Second pass viewed960px: 4:3, left~20px/960 <5%; wheel clamp partly covers front wheel.'],
 ['octavia',2,'Škoda Octavia III 1.4 TSI (2016) (52090174844).jpg','Second pass viewed960px: whole car distant from rear, not three-quarter front; retain current front view.'],
 ['octavia',2,'Skoda Octavia GTEC (14277040003).jpg','Second pass viewed960px: lower front bumper and wheel cut off at bottom.'],
 ['octavia',2,'Skoda Octavia GTEC (14070210608).jpg','Second pass viewed960px: close-up of wiper stalk, not whole car.'],
 ['octavia',2,'Skoda Octavia 1.6 TDi Elegance 2015 (45756164244).jpg','Viewed960px: vehicle nearly touches left edge; <5% margin.'],
 ['octavia',2,'Skoda Octavia Diesel 1598cc registered May 2013.JPG','Viewed960px: left~20px and right~40px at width960; <5%.'],
 ['octavia',2,'Skoda Octavia GTEC (14070203179).jpg','Viewed960px: information board, not whole car.'],
 ['octavia',2,'Skoda Octavia III TDI Front.JPG','Viewed960px: left~33px/960 <5%.'],
 ['octavia',2,'Skoda Octavia III 01 2013-06-15.jpg','Viewed960px: right~33px/960 <5%.'],
 ['octavia',3,'Skoda Octavia IV liftback 1.jpg','Upload thumbnail HTTP429, not viewed; no retry.'],
 ['rapid',0,'2014 Skoda Rapid SE TDi CR.jpg','Viewed960px: rear Spaceback, not target liftback front.'],
 ['superb',1,'Skoda Superb II 20090329 front.jpg','Viewed960px: left~45px/960 and top~30px/644 <5%.'],
 ['superb',1,'Skoda Superb II front 20100529.jpg','Viewed960px: side margins20–30px/960 <5%.'],
 ['superb',1,'Skoda Superb II Ambition TSI Brilliantsilber.JPG','Viewed960px: side margins<5%, people next to front corner.'],
 ['superb',1,'Skoda Superb II 20090611 front.JPG','Viewed960px: left~30px/960 and right~45px/960 <5%.'],
 ['superb',2,'Skoda Superb B8 front view.jpg','Viewed ORIGINAL3348x2143: front wheel/lower bumper cut off at bottom; reject.'],
 ['superb',2,'Skoda Superb 2.jpg','Viewed960px: right~40px/960 <5%; support livery/beacons.'],
 ['superb',2,'Skoda Superb 2.0 TDi Elegance 2017 (34024009082).jpg','Viewed960px: vehicle nearly touches both sides; <5%.']
].map(([lineSlug,generationIndex,file,result])=>({lineSlug,generationIndex,file:'File:'+file,result}));
const kept=[['octavia',0],['octavia',2],['superb',1],['superb',2]].map(([lineSlug,generationIndex])=>{const old=baseline.find(t=>t.lineSlug===lineSlug&&t.generationIndex===generationIndex);return {lineSlug,generationIndex,oldFile:old.file,oldAspect:old.aspect,reasonCs:'Původní fotografie ponechána: prověřené alternativy nesplnily 5% rezervu nebo nebyly vhodným reprezentativním čelním pohledem. Ponechání není nové schválení původní fotografie.',attempts:attempts.filter(t=>t.lineSlug===lineSlug&&t.generationIndex===generationIndex)};});
const out={reviewedAt:'2026-10-26',replacements,kept,attempts,limitations:['Shared Commons API429: API stopped; no retry loop. Several original/upload-host thumbnails429; thumb.wikimedia.org published previews worked.','No image downloads into repository, no crop or editing. Images viewed in memory.','Margins are conservative visual estimates on proportional previews, not automated segmentation.','SHA1 null: API stopped; exact author/licence/dimensions verified from Commons cached filepage text or HTML.']};
fs.writeFileSync('analysis/codex/worker-wide-largecars.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({replacements:replacements.length,kept:kept.length,attempts:attempts.length}));
