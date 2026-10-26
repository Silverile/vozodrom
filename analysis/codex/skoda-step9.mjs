import fs from 'node:fs';
const root='analysis/codex/';
export const step9Evidence=fs.readdirSync(root).filter(f=>/^worker-step9-.*\.json$/.test(f)).sort().map(file=>({file,...JSON.parse(fs.readFileSync(root+file,'utf8'))}));
export const step9Sources=[...new Set(step9Evidence.flatMap(w=>[...[...(w.patches||[]),...(w.generationPatches||[])].flatMap(p=>p.sources||[]),...(w.additions||[]).flatMap(a=>a.trim.sources||[])]))];
export function enrichStep9(c,g,i){
 for(const w of step9Evidence){
  for(const a of w.additions||[])if(a.lineSlug===c.lineSlug&&a.generationIndex===i){if(g.trims.some(t=>t.name===a.trim.name))throw Error('Duplicate addition');g.trims.push(structuredClone(a.trim));}
  for(const p of w.patches||[]){
   if(p.lineSlug!==c.lineSlug||p.generationIndex!==i)continue;
   const t=g.trims?.find(t=>t.name===p.trimName);if(!t)throw Error('Missing step9 trim '+p.trimName);t.fieldSources??={};
   for(const [field,value]of Object.entries(p.fields)){
    if(!/^(?:engine\.(?:fuel|displacementCc|cylinders|powerKw|torqueNm|powerStandard)|transmission\.(?:type|gears)|drive|dimensionsMm\.(?:length|width|height|wheelbase)|massKg|massBasis|topSpeedKmh|acceleration0to100s|consumptionL100|consumptionCycle)$/.test(field))throw Error('Unexpected field '+field);
    const ks=field.split('.'),last=ks.pop(),o=ks.reduce((o,k)=>o[k]??={},t);o[last]=value;
    if(value===null)delete t.fieldSources[field];else t.fieldSources[field]=p.fieldSources?.[field]||p.sources;
   }
   t.sources=[...new Set([...t.sources,...p.sources])];if(p.noteCs)t.specificationScope.noteCs+=' '+p.noteCs;
  }
  for(const p of w.generationPatches||[])if(p.lineSlug===c.lineSlug&&p.generationIndex===i){g.fieldSources??={};for(const [k,v]of Object.entries(p.fields)){if(!['productionUnits','drivetrains'].includes(k))throw Error('Unexpected generationfield '+k);g[k]=v;g.fieldSources[k]=p.sources;}g.sources.push(...p.sources);g.specificationScope.noteCs+=' '+p.noteCs;}
 }
}
