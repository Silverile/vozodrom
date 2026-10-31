import assert from 'node:assert/strict';
export const bodyGroups={
 'land-rover/freelander':[{members:[0,1],name:'Freelander I (L314)'},{members:[2]}],
 'jaguar/xf':[{members:[0,1],name:'XF I (X250)'},{members:[2,3,4],name:'XF II (X260 / XFL)'}],
 'jaguar/f-type':[{members:[0,1],name:'F-Type (X152)'}],
 'jaguar/e-type':[{members:[0,1,2],name:'E-Type Series 1'},{members:[3]},{members:[4]}],
 'infiniti/m30':[{members:[0,1],name:'M30 (F31)'}],
 'infiniti/q60':[{members:[0,1],name:'Q60 I (V36)'},{members:[2]}],
 'infiniti/q70':[{members:[0,1],name:'Q70 / Q70L (Y51)'}],
 'izh/2126':[{members:[0,1],name:'2126 Oda'}],
};
const union=(...arrays)=>[...new Map(arrays.flatMap(a=>a??[]).map(v=>[JSON.stringify(v),v])).values()];
export function mergeBodies(c){const groups=bodyGroups[c.makeSlug+'/'+c.lineSlug];if(!groups)return c;const original=c.generations;assert.equal(groups.flatMap(g=>g.members).length,original.length);c.generations=groups.map(({members,name},index)=>{const gs=members.map(i=>original[i]),g=structuredClone(gs[0]);if(members.length===1){for(const e of g.engines??[])if(e.sourceScope?.generationEvidence)e.sourceScope.generationEvidence.generationIndex=index;return g;}
 g.name=name;g.from=Math.min(...gs.map(g=>g.from).filter(Number.isFinite));g.to=gs.some(g=>g.to==null)?null:Math.max(...gs.map(g=>g.to));g.productionStatus=g.to==null?'current':'ended';g.dateBasis='production';
 for(const k of ['engines','trims','equipmentLines','bodyTypes','sources','drivetrains','transmissions','markets']){const values=union(...gs.map(g=>g[k]));if(values.length||gs.some(g=>Array.isArray(g[k])))g[k]=values;}
 // No member being folded into these parents contains additional engine rows.
 // Assert rather than silently dropping a body-scoped specification or power.
 const powers=new Set();for(const e of g.engines??[]){for(const kw of new Set(e.availablePowerKw?.length?e.availablePowerKw:[e.powerKwMin,e.powerKwMax].filter(Number.isFinite))){const key=e.variant+'/'+kw;assert(!powers.has(key),'Engine dedupe requires explicit review '+c.lineSlug+'/'+key);powers.add(key);}if(e.sourceScope?.generationEvidence)e.sourceScope.generationEvidence.generationIndex=index;}
 const stages=new Map();for(const s of gs.flatMap(g=>g.facelift??[]))if(!stages.has(s.year))stages.set(s.year,s);g.facelift=[...stages.values()].sort((a,b)=>a.year-b.year);
 g.bodyVariants=gs.map(x=>structuredClone(x));for(const v of g.bodyVariants){delete v.engines;delete v.trims;delete v.equipmentLines;}
 g.specificationScope={...g.specificationScope,noteCs:[g.specificationScope?.noteCs,'Souběžné karoserie a varianty společné podvozkové generace; dílčí období jsou zachována v podkladech.'].filter(Boolean).join('\n')};if(c.makeSlug==='jaguar'&&c.lineSlug==='xf'&&index===1)g.specificationScope.noteCs+=' Britská výroba skončila 2024, čínský XFL podle plánu JLR 2025.';
 return g;});return c;}
export const bodyIndexMap=id=>Object.fromEntries(bodyGroups[id].flatMap((g,i)=>g.members.map(j=>[j,i])));
