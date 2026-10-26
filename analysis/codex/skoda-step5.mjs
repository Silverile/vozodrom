import fs from 'node:fs';
const root='analysis/codex/';
export const step5Evidence=fs.readdirSync(root).filter(f=>/^worker-step5-.*\.json$/.test(f)).sort().map(file=>({file,...JSON.parse(fs.readFileSync(root+file,'utf8'))}));
export const step5Sources=[...new Set(step5Evidence.flatMap(w=>[...(w.patches||[]).flatMap(p=>p.sources||[]),...(w.additions||[]).flatMap(p=>p.trim.sources||[])]))];
export const photoReview=JSON.parse(fs.readFileSync(root+'skoda-step5-photo-review.json','utf8'));
const defaults={massBasis:null,consumptionL100:null,consumptionKwh100:null,consumptionCycle:null,rangeKm:null,rangeCycle:null};
function normalize(t){for(const[k,v]of Object.entries(defaults))if(t[k]===undefined)t[k]=v;return t;}
const allowed=/^(?:engine\.(?:fuel|torqueNm|displacementCc|cylinders|powerKw|powerStandard)|transmission\.(?:type|gears)|dimensionsMm\.(?:length|width|height|wheelbase)|bodyType|drive|massKg|massBasis|acceleration0to100s|topSpeedKmh|consumptionL100|consumptionKwh100|consumptionCycle|rangeKm|rangeCycle)$/;
export function enrichStep5(c,g,index){
 for(const w of step5Evidence){
  for(const a of w.additions||[])if(a.lineSlug===c.lineSlug&&a.generationIndex===index){
   g.trims??=[];if(g.trims.some(t=>t.name===a.trim.name))throw Error('Duplicate step5 version '+a.trim.name);
   g.trims.push(normalize(structuredClone(a.trim)));
  }
  for(const p of w.patches||[]){
   if(p.lineSlug!==c.lineSlug||p.generationIndex!==index)continue;
   const t=g.trims?.find(t=>t.name===p.trimName);if(!t)throw Error('Missing step5 trim '+p.trimName);normalize(t);t.fieldSources??={};
   for(const [field,v]of Object.entries(p.fields)){
    if(!allowed.test(field))throw Error('Unreviewed field '+field);
    const ks=field.split('.'),k=ks.pop(),o=ks.reduce((o,k)=>o[k],t);o[k]=v;
    if(v===null)delete t.fieldSources[field];else t.fieldSources[field]=p.fieldSources?.[field]||p.sources;
   }
   if(p.modelYear!==undefined)t.specificationScope.modelYear=p.modelYear;
   t.sources=[...new Set([...t.sources,...p.sources])];t.specificationScope.noteCs+=' '+(p.noteCs||'');
  }
  for(const r of w.needsReview||[])if(r.lineSlug===c.lineSlug&&!c.needsReview.some(x=>x.reason===r.reason))c.needsReview.push({field:'scope',reason:r.reason});
 }
 const review=photoReview.decisions.find(r=>r.lineSlug===c.lineSlug&&r.generationIndex===index);
 if(review){
  if(g.photo?.file!==review.file)throw Error('Photo review/file mismatch '+c.lineSlug);
  if(review.decision==='rejected'){g.photo=null;c.needsReview.push({field:'scope',reason:review.noteCs});}
  else {g.photo.visualReview='reviewed';g.photo.reviewedAt=photoReview.reviewedAt;g.photo.reviewNoteCs=review.noteCs;}
  c.needsReview=c.needsReview.filter(r=>!r.field.startsWith(`generations[${index}].photo`));
 }
}
