import fs from 'node:fs';
const root='analysis/codex/';
export const step8Evidence=fs.readdirSync(root).filter(f=>/^worker-step8-.*\.json$/.test(f)).sort().map(file=>({file,...JSON.parse(fs.readFileSync(root+file,'utf8'))}));
export const step8Sources=[...new Set(step8Evidence.flatMap(w=>(w.patches||[]).flatMap(p=>p.sources||[])))];
export const photoReview8=JSON.parse(fs.readFileSync(root+'skoda-step8-photo-review.json','utf8'));
export function enrichStep8(c,g,i){
 for(const w of step8Evidence)for(const p of w.patches||[]){
  if(p.lineSlug!==c.lineSlug||p.generationIndex!==i)continue;
  const t=g.trims?.find(t=>t.name===p.trimName);if(!t)throw Error('Missing step8 trim '+p.trimName);
  t.fieldSources??={};
  for(const [field,value]of Object.entries(p.fields)){
   if(!/^(?:engine\.(?:fuel|displacementCc|cylinders|powerKw|torqueNm|powerStandard)|transmission\.(?:type|gears)|drive|dimensionsMm\.(?:length|width|height|wheelbase)|massKg|massBasis|topSpeedKmh|acceleration0to100s|consumptionL100|consumptionCycle)$/.test(field))throw Error('Unexpected field '+field);
   const ks=field.split('.'),last=ks.pop(),o=ks.reduce((o,k)=>o[k]??={},t);o[last]=value;
   if(value===null)delete t.fieldSources[field];else t.fieldSources[field]=p.fieldSources?.[field]||p.sources;
  }
  t.sources=[...new Set([...t.sources,...p.sources])];
  if(p.modelYear!==undefined)t.specificationScope.modelYear=p.modelYear;
  if(c.lineSlug==='fabia'&&p.trimName==='Junior 1.0 MPI 37 kW'){
   t.specificationScope.noteCs=t.specificationScope.noteCs.replace('Přesný objem není dopočítán z litrového označení; ','').replace('Objem motoru není převzat: článek uvádí 966 cm³, jiné podklady 997 cm³. ','');
   for(const r of c.needsReview)if(r.reason.includes('states 966 cm³'))r.reason='Junior mass remains unresolved (1010/1035 kg and driver convention). Displacement conflict is resolved by the manufacturer SSP32: 997 cm³; the secondary period-test 966 cm³ figure is not retained.';
  }
  if(c.lineSlug==='fabia'&&p.trimName==='RS 1.9 TDI-PD 96 kW Euro IV (UK 05/2006)')t.specificationScope.noteCs=t.specificationScope.noteCs.replace('Z tohoto technickeho prehledu nejsou bez dalsi kontroly preneseny rozmery, presna hmotnost ani pocet prevodovych stupnu. ','');
  if(p.noteCs)t.specificationScope.noteCs+=' '+p.noteCs;
 }
 const r=photoReview8.decisions.find(r=>r.lineSlug===c.lineSlug&&r.generationIndex===i);
 if(r){if(g.photo?.file!==r.file)throw Error('Step8 photo mismatch');c.needsReview=c.needsReview.filter(x=>!x.field.startsWith(`generations[${i}].photo`));if(r.decision==='rejected'){g.photo=null;c.needsReview.push({field:'scope',reason:r.noteCs});}else{g.photo.visualReview='reviewed';g.photo.reviewedAt=photoReview8.reviewedAt;g.photo.reviewNoteCs=r.noteCs;}}
}
