import fs from 'node:fs';
const files=['worker-historic-step4.json','worker-octavia-step4.json','worker-fabia-step4.json'];
export const workerEvidence=files.filter(f=>fs.existsSync('analysis/codex/'+f)).map(f=>({file:f,...JSON.parse(fs.readFileSync('analysis/codex/'+f,'utf8'))}));
export const workerSources=[...new Set(workerEvidence.flatMap(w=>[...(w.patches||[]),...(w.conflicts||[])].flatMap(p=>p.sources||[])))];
export function applyWorkerPatches(c,g,index){
 if(c.lineSlug==='fabia'&&index===0){const rs=g.trims?.find(t=>t.name.startsWith('RS '));if(rs){rs.consumptionL100=null;rs.consumptionCycle=null;delete rs.fieldSources.consumptionL100;delete rs.fieldSources.consumptionCycle;rs.specificationScope.noteCs+=' Spotřeba 5,1/5,4 l se liší podle dobového podkladu; bez přiřazení roku a homologace zůstává skalár null.';}}
 for(const w of workerEvidence){
  for(const p of w.patches||[]){
   if(p.lineSlug!==c.lineSlug||p.generationIndex!==index)continue;
   const t=g.trims?.find(t=>t.name===p.trimName);if(!t)throw Error('Unknown worker trim '+p.trimName);
   t.fieldSources??={};
   for(const [field,value]of Object.entries(p.fields)){
    if(!/^(?:engine\.(?:torqueNm|displacementCc|cylinders|powerKw)|transmission\.(?:type|gears)|dimensionsMm\.(?:length|width|height|wheelbase)|drive|massKg|massBasis|acceleration0to100s|topSpeedKmh|consumptionL100|consumptionCycle)$/.test(field))throw Error('Unreviewed worker field '+field);
    const keys=field.split('.'),last=keys.pop(),obj=keys.reduce((v,k)=>v[k],t);obj[last]=value;
    if(value===null)delete t.fieldSources[field];else t.fieldSources[field]=p.fieldSources?.[field]||p.sources;
   }
   t.sources=[...new Set([...t.sources,...p.sources])];
   t.specificationScope.noteCs+=' '+(p.scopeNoteCs||p.noteCs||'');
   if(c.lineSlug==='octavia'&&index===0&&t.name.startsWith('1.6 MPI'))t.specificationScope.modelYear=1998;
  }
  for(const p of w.conflicts||[])if(p.lineSlug===c.lineSlug){const reason=p.reason||p.decision||'Worker source conflict; exact version unresolved.';if(!c.needsReview.some(r=>r.reason===reason))c.needsReview.push({field:'scope',reason});}
  for(const p of w.needsReview||[])if((!p.lineSlug||p.lineSlug===c.lineSlug)&&g.trims?.some(t=>t.name===p.trimName)&&!c.needsReview.some(r=>r.reason===p.reason))c.needsReview.push({field:'scope',reason:p.reason});
 }
}
