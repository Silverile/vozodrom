import fs from 'node:fs';
const root='analysis/codex/';
export const step6Evidence=fs.readdirSync(root).filter(f=>/^worker-step6-.*\.json$/.test(f)).sort().map(file=>({file,...JSON.parse(fs.readFileSync(root+file,'utf8'))}));
export const step6Sources=[...new Set(step6Evidence.flatMap(w=>[...(w.patches||[]).flatMap(p=>p.sources||[]),...(w.additions||[]).flatMap(a=>a.trim.sources||[])]))];
export const photoReview6=JSON.parse(fs.readFileSync(root+'skoda-step6-photo-review.json','utf8'));
const defaults={massBasis:null,consumptionL100:null,consumptionKwh100:null,consumptionCycle:null,rangeKm:null,rangeCycle:null};
const allowed=/^(?:engine\.(?:fuel|torqueNm|displacementCc|cylinders|powerKw|powerStandard)|transmission\.(?:type|gears)|dimensionsMm\.(?:length|width|height|wheelbase)|massRangeKg(?:\.(?:min|max))?|massReference|bodyType|drive|massKg|massBasis|acceleration0to100s|topSpeedKmh|consumptionL100|consumptionKwh100|consumptionCycle|rangeKm|rangeCycle)$/;
function normalize(t){for(const[k,v]of Object.entries(defaults))if(t[k]===undefined)t[k]=v;return t;}
function updateMassNote(s){return s
 .replace(/hmotnost je interval a nelze ji převést na jeden údaj/g,'hmotnost je publikována intervalem')
 .replace(/proto massKg zůstává null/g,'zobrazená hmotnost nyní označuje publikované minimum')
 .replace(/Hmotnost je pouze interval podle konfigurace; nevolí se dolní mez\./g,'Hmotnostní rozsah závisí na konfiguraci.')
 .replace(/Hmotnostní interval není převeden na skalár\./g,'Zobrazená hmotnost představuje minimum zachovaného intervalu.')
 .replace(/Délka i hmotnost zůstávají null bez přesné kombinace ročníku a výbavy\./g,'Rozměry a hmotnost jsou omezeny níže popsanou referenční konfigurací.')
 .replace(/Oba skaláry null|oba skaláry zůstávají null/gi,'spotřeba zůstává intervalem; hmotnost je publikované minimum')
 .replace(/skaláry (?:zůstávají )?null/gi,'spotřeba zůstává intervalem; hmotnost je publikované minimum')
 .replace(/Hmotnost a WLTP spotřeba jsou intervaly, proto skalár zůstává null\./g,'Hmotnost a spotřeba jsou publikovány intervalem; zobrazená hmotnost je minimum.')
 .replace(/a pohotovostní hmotnost včetně řidiče 75 kg [^.]*?jsou intervaly[^.]*\./g,'je uvedena intervalem.')
 .replace(/Nahrazuje [^.]*?null[^.]*\./g,'');}
export function enrichStep6(c,g,index){
 for(const w of step6Evidence){
  for(const a of w.additions||[])if(a.lineSlug===c.lineSlug&&a.generationIndex===index){g.trims??=[];if(g.trims.some(t=>t.name===a.trim.name))throw Error('Duplicate step6 trim '+a.trim.name);g.trims.push(normalize(structuredClone(a.trim)));}
  for(const p of w.patches||[]){
   if(p.lineSlug!==c.lineSlug||p.generationIndex!==index)continue;
   const t=g.trims?.find(t=>t.name===p.trimName);if(!t)throw Error('Missing step6 trim '+p.trimName);normalize(t);t.fieldSources??={};
   for(const [field,v]of Object.entries(p.fields)){
    if(!allowed.test(field))throw Error('Unreviewed step6 field '+field);
    const ks=field.split('.'),k=ks.pop(),o=ks.reduce((o,k)=>o[k]??=( {} ),t);o[k]=v;
    if(v===null)delete t.fieldSources[field];else t.fieldSources[field]=p.fieldSources?.[field]||p.sources;
   }
   if(p.fields.massRangeKg){for(const k of ['min','max'])t.fieldSources['massRangeKg.'+k]=p.fieldSources?.['massRangeKg.'+k]||p.sources;}
   if(p.modelYear!==undefined)t.specificationScope.modelYear=p.modelYear;
   t.sources=[...new Set([...t.sources,...p.sources])];t.specificationScope.noteCs+=' '+(p.noteCs||'');
   if(t.massReference==='published-minimum')t.specificationScope.noteCs=updateMassNote(t.specificationScope.noteCs);
  }
  for(const r of w.needsReview||[])if(r.lineSlug===c.lineSlug&&!c.needsReview.some(x=>x.reason===r.reason))c.needsReview.push({field:'scope',reason:r.reason});
 }
 if(c.lineSlug==='felicia'){
  const bmm=g.trims?.find(t=>t.name==='1.3 BMM 40 kW – hatchback');if(bmm)bmm.specificationScope.noteCs=bmm.specificationScope.noteCs.replace('Délka i hmotnost zůstávají null bez přesné kombinace ročníku a výbavy.','Hmotnost není bezpečně přiřazena této předmodernizační verzi.');
  const t=g.trims?.find(t=>t.name==='1.9 D 47 kW – hatchback');
  if(t){t.engine.torqueNm=null;delete t.fieldSources?.['engine.torqueNm'];if(!c.needsReview.some(r=>r.reason.includes('124/125 Nm')))c.needsReview.push({field:'scope',reason:'Felicia 1.9 D torque conflict: manufacturer manual 124 Nm versus previous summary 125 Nm. Retained null pending year/engine-code reconciliation.'});}
 }
 for(const t of g.trims||[])t.specificationScope.noteCs=t.specificationScope.noteCs.replace('Vybrané manuální verze po modernizaci; DSG varianty zatím nedoplněny.','Vybraná manuální verze po modernizaci.');
 const r=photoReview6.decisions.find(r=>r.lineSlug===c.lineSlug&&r.generationIndex===index);
 if(r){if(g.photo?.file!==r.file)throw Error('Step6 photo/file mismatch '+c.lineSlug);c.needsReview=c.needsReview.filter(x=>!x.field.startsWith(`generations[${index}].photo`));if(r.decision==='rejected'){g.photo=null;c.needsReview.push({field:'scope',reason:r.noteCs});}else {g.photo.visualReview='reviewed';g.photo.reviewedAt=photoReview6.reviewedAt;g.photo.reviewNoteCs=r.noteCs;}}
}
