import fs from 'node:fs';
const path='analysis/codex/skoda-card-photo-evidence.json',saved=JSON.parse(fs.readFileSync(path,'utf8'));
const candidates=[];
async function get(p){const r=await fetch('https://commons.wikimedia.org/w/api.php?'+new URLSearchParams({action:'query',format:'json',formatversion:'2',...p}),{headers:{'User-Agent':'VozodromCatalogueResearch/1.0 (photo licence metadata)'},signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error('HTTP '+r.status);return r.json();}
for(const [slug,category]of [['1201','Škoda 1201'],['422','Škoda 422'],['110-1925','Škoda 110'],['1203','Škoda 1203'],['4r','Škoda 4R']]){
 try{
  const q=await get({list:'categorymembers',cmtitle:'Category:'+category,cmnamespace:'6',cmlimit:'8'});let files=(q.query?.categorymembers||[]).map(p=>p.title).filter(f=>/\.(?:jpe?g|png)$/i.test(f));
  if(!files.length){await new Promise(r=>setTimeout(r,1100));const s=await get({list:'search',srsearch:category,srnamespace:'6',srlimit:'5'});files=(s.query?.search||[]).map(p=>p.title).filter(f=>/\.(?:jpe?g|png)$/i.test(f));}
  candidates.push({lineSlug:slug,category,files});saved.requests.push({retrievedAt:new Date().toISOString(),category,files,scope:'Step7 whole-car replacement candidates; metadata only, not visual approval'});
  if(files.length){await new Promise(r=>setTimeout(r,1100));const m=await get({prop:'imageinfo',iiprop:'url|extmetadata|size|sha1',titles:files.join('|')});for(const p of m.query.pages){const i=p.imageinfo?.[0];if(!i)continue;const x=i.extmetadata||{};saved.files[p.title]={file:p.title,url:i.url,filePageUrl:i.descriptionurl,sha1:i.sha1,width:i.width,height:i.height,authorHtml:x.Artist?.value??null,licence:x.LicenseShortName?.value??null,licenceUrl:x.LicenseUrl?.value??null,attributionRequired:x.AttributionRequired?.value??null,copyrighted:x.Copyrighted?.value??null,creditHtml:x.Credit?.value??null,descriptionHtml:x.ImageDescription?.value??null,objectName:x.ObjectName?.value??null,researchCategory:category};}}
 }catch(e){candidates.push({lineSlug:slug,error:e.message});saved.requests.push({retrievedAt:new Date().toISOString(),category,error:e.message});}
 fs.writeFileSync(path,JSON.stringify(saved,null,2)+'\n');fs.writeFileSync('analysis/codex/skoda-step7-photo-candidates.json',JSON.stringify(candidates,null,2)+'\n');await new Promise(r=>setTimeout(r,1100));
}
console.log(JSON.stringify(candidates,null,2));
