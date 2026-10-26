import fs from 'node:fs';
const path='analysis/codex/skoda-card-photo-evidence.json',saved=JSON.parse(fs.readFileSync(path,'utf8'));
for(const term of ['130','4R','1203','637','Popular']){
 const query={'130':'intitle:"Škoda 130" -LR -RS -Rapid -rally','4R':'intitle:"Škoda 4R"','1203':'intitle:"Škoda 1203" -TAZ','637':'intitle:"Škoda 637"','Popular':'intitle:"Škoda Popular" -Standard'}[term];
 const url='https://commons.wikimedia.org/w/api.php?'+new URLSearchParams({action:'query',format:'json',formatversion:'2',generator:'search',gsrnamespace:'6',gsrsearch:query,gsrlimit:'8',prop:'imageinfo',iiprop:'url|extmetadata|size|sha1'});
 try{const r=await fetch(url,{headers:{'User-Agent':'VozodromCatalogueResearch/1.0 (metadata only)'},signal:AbortSignal.timeout(15000)});saved.requests.push({retrievedAt:new Date().toISOString(),search:term,query,status:r.status});if(!r.ok)throw Error('HTTP '+r.status);const d=await r.json();for(const p of d.query?.pages||[]){const info=p.imageinfo?.[0];if(!info||! /\.(?:jpg|jpeg|png|webp)$/i.test(p.title))continue;const m=info.extmetadata||{};saved.files[p.title]={file:p.title,url:info.url,filePageUrl:info.descriptionurl,sha1:info.sha1,width:info.width,height:info.height,authorHtml:m.Artist?.value??null,licence:m.LicenseShortName?.value??null,licenceUrl:m.LicenseUrl?.value??null,attributionRequired:m.AttributionRequired?.value??null,copyrighted:m.Copyrighted?.value??null,creditHtml:m.Credit?.value??null,descriptionHtml:m.ImageDescription?.value??null,objectName:m.ObjectName?.value??null,researchSearch:term};}}catch(e){console.log(term,e.message);}
 fs.writeFileSync(path,JSON.stringify(saved,null,2)+'\n');
 await new Promise(r=>setTimeout(r,1000));
}
console.log('Photo metadata only; visual review remains pending.');
