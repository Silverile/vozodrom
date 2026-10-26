import fs from 'node:fs';
const path='analysis/codex/skoda-card-photo-evidence.json',saved=JSON.parse(fs.readFileSync(path,'utf8'));
async function get(p){const r=await fetch('https://commons.wikimedia.org/w/api.php?'+new URLSearchParams({action:'query',format:'json',formatversion:'2',...p}),{headers:{'User-Agent':'VozodromCatalogueResearch/1.0 (licence metadata only)'},signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error('HTTP '+r.status);return r.json();}
for(const term of ['Škoda 1203','Škoda 4R']){
 try{const d=await get({list:'categorymembers',cmtitle:'Category:'+term,cmnamespace:'6',cmlimit:'20'}),files=term==='Škoda 1203'?['File:ŠKODA 1203.JPG']:d.query.categorymembers.map(p=>p.title).filter(t=>/\.(?:jpe?g|png)$/i.test(t));saved.requests.push({retrievedAt:new Date().toISOString(),category:term,files});console.log(term,files);
 if(!files.length)continue;await new Promise(r=>setTimeout(r,1100));const m=await get({prop:'imageinfo',iiprop:'url|extmetadata|size|sha1',titles:files.join('|')});
 for(const p of m.query.pages){const info=p.imageinfo?.[0];if(!info)continue;const x=info.extmetadata||{};saved.files[p.title]={file:p.title,url:info.url,filePageUrl:info.descriptionurl,sha1:info.sha1,width:info.width,height:info.height,authorHtml:x.Artist?.value??null,licence:x.LicenseShortName?.value??null,licenceUrl:x.LicenseUrl?.value??null,attributionRequired:x.AttributionRequired?.value??null,copyrighted:x.Copyrighted?.value??null,creditHtml:x.Credit?.value??null,descriptionHtml:x.ImageDescription?.value??null,objectName:x.ObjectName?.value??null,researchCategory:term};}
 }catch(e){saved.requests.push({retrievedAt:new Date().toISOString(),category:term,error:e.message});console.log(term,e.message);}
 fs.writeFileSync(path,JSON.stringify(saved,null,2)+'\n');await new Promise(r=>setTimeout(r,1100));
}
