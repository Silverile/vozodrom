import fs from 'node:fs';
const root='analysis/codex/';
export const step7Evidence=fs.readdirSync(root).filter(f=>/^worker-step7-.*\.json$/.test(f)).sort().map(file=>({file,...JSON.parse(fs.readFileSync(root+file,'utf8'))}));
export const step7Sources=[...new Set(step7Evidence.flatMap(w=>[...(w.patches||[]).flatMap(p=>p.sources||[]),...(w.additions||[]).flatMap(a=>a.trim.sources||[])]))];
export const photoReview7=JSON.parse(fs.readFileSync(root+'skoda-step7-photo-review.json','utf8'));
const photoEvidence=JSON.parse(fs.readFileSync(root+'skoda-card-photo-evidence.json','utf8'));
const clean=s=>s?.replace(/<[^>]*>/g,'').replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").trim()??null;
function makePhoto(file,noteCs){const p=photoEvidence.files[file];if(!p||!p.authorHtml||!/^CC BY|^CC0|^Public domain/.test(p.licence))throw Error('Unlicensed/unretrieved replacement '+file);return {source:'commons',file:p.file,url:p.url.split('?')[0],filePageUrl:p.filePageUrl,author:clean(p.authorHtml),licence:p.licence,licenceUrl:p.licenceUrl,credit:clean(p.authorHtml)+' / Wikimedia Commons / '+p.licence,depicts:'generation',visualReview:'reviewed',reviewedAt:photoReview7.reviewedAt,reviewNoteCs:noteCs,sources:[p.filePageUrl]};}
const allowed=/^(?:name|kind|specificationScope\.market|engine\.(?:fuel|torqueNm|displacementCc|cylinders|powerKw|powerStandard)|transmission\.(?:type|gears)|dimensionsMm\.(?:length|width|height|wheelbase)|massRangeKg(?:\.(?:min|max))?|massReference|bodyType|drive|massKg|massBasis|acceleration0to100s|topSpeedKmh|consumptionL100|consumptionKwh100|consumptionCycle|rangeKm|rangeCycle)$/;
export function enrichStep7(c,g,index){
 for(const w of step7Evidence){
  for(const a of w.additions||[])if(a.lineSlug===c.lineSlug&&a.generationIndex===index){g.trims??=[];if(g.trims.some(t=>t.name===a.trim.name))throw Error('Duplicate step7 trim '+a.trim.name);g.trims.push(structuredClone(a.trim));}
  for(const p of w.patches||[]){
   if(p.lineSlug!==c.lineSlug||p.generationIndex!==index)continue;
   const t=g.trims?.find(t=>t.name===p.trimName);if(!t)throw Error('Missing step7 trim '+p.trimName);t.fieldSources??={};
   for(const [field,v]of Object.entries(p.fields)){
    if(!allowed.test(field))throw Error('Unreviewed field '+field);
    const ks=field.split('.'),k=ks.pop(),o=ks.reduce((o,k)=>o[k]??=({}),t);o[k]=v;
    if(v===null)delete t.fieldSources[field];else t.fieldSources[field]=p.fieldSources?.[field]||p.sources;
   }
   if(p.modelYear!==undefined)t.specificationScope.modelYear=p.modelYear;
   t.sources=[...new Set([...t.sources,...p.sources])];
   t.specificationScope.noteCs=c.lineSlug==='praktik'?p.noteCs:t.specificationScope.noteCs+' '+(p.noteCs||'');
  }
  for(const r of [...w.needsReview||[],...w.helpWanted||[]]){const reason=typeof r==='string'?r:r.reason||r.note||JSON.stringify(r);const matches=typeof r==='object'&&(r.lineSlug===c.lineSlug||!r.lineSlug&&r.trimName&&g.trims?.some(t=>t.name===r.trimName));if(matches&&!c.needsReview.some(x=>x.reason===reason))c.needsReview.push({field:'scope',reason});}
 }
 const r=photoReview7.decisions.find(r=>r.lineSlug===c.lineSlug&&r.generationIndex===index);
 if(r){if(r.action==='review'&&g.photo?.file!==r.file)throw Error('Photo review mismatch '+c.lineSlug);g.photo=makePhoto(r.file,r.noteCs);g.sources.push(g.photo.filePageUrl);c.sources.push(g.photo.filePageUrl);const previousNotes=[5,6].flatMap(n=>JSON.parse(fs.readFileSync(root+`skoda-step${n}-photo-review.json`,'utf8')).decisions.filter(d=>d.lineSlug===c.lineSlug).map(d=>d.noteCs));c.needsReview=c.needsReview.filter(x=>!x.field.startsWith(`generations[${index}].photo`)&&!previousNotes.includes(x.reason));}
}
