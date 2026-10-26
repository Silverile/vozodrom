import fs from'node:fs';
const review=JSON.parse(fs.readFileSync('analysis/codex/skoda-step10-photo-review.json','utf8'));
const evidence=JSON.parse(fs.readFileSync('analysis/codex/skoda-card-photo-evidence.json','utf8'));
const clean=s=>s?.replace(/<[^>]*>/g,'').replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").trim()??null;
export function replaceWidePhoto(c,g,i){
 const d=review.decisions.find(d=>d.lineSlug===c.lineSlug&&d.generationIndex===i);if(!d)return;
 if(g.photo?.file!==d.oldFile)throw Error('Wide replacement original differs '+c.lineSlug+'/'+i);
 const p=evidence.files[d.file];if(!p||!p.authorHtml||!/^CC BY|^CC0|^Public domain/.test(p.licence))throw Error('Missing free photo evidence '+d.file);
 const author=clean(p.authorHtml);
 g.photo={source:'commons',file:p.file,url:p.url.split('?')[0],filePageUrl:p.filePageUrl,author,licence:p.licence,licenceUrl:p.licenceUrl,credit:author+' / Wikimedia Commons / '+p.licence,depicts:'generation',visualReview:'reviewed',reviewedAt:review.reviewedAt,reviewNoteCs:d.noteCs,sources:[p.filePageUrl]};
 g.sources.push(p.filePageUrl);c.sources.push(p.filePageUrl);c.needsReview=c.needsReview.filter(x=>!x.field.startsWith(`generations[${i}].photo`));
}
