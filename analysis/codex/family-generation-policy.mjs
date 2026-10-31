import assert from 'node:assert/strict';
export const publicEngine=e=>Object.fromEntries(['fuel','displacementCc','displacementLitresNominal','powerKwMin','powerKwMax','availablePowerKw','powerRangeCoverage','variant','sources'].filter(k=>Object.hasOwn(e,k)).map(k=>[k,e[k]]));
export function buildFamilyCard(before,definitions,assignment){
 assert.equal(before.generations.length,1);const c=structuredClone(before),old=before.generations[0];
 c.generations=definitions.map(d=>{
  const g=structuredClone(old);Object.assign(g,{code:d.code,name:`${c.name} (${d.code})`,from:d.from,to:d.to,productionStatus:d.to===null?'current':'ended',bodyTypes:d.bodyTypes,drawingStage:0,photo:null,trims:null,drivetrains:null,transmissions:null,trunkL:null,dimensionsMm:{length:null,width:null,height:null,wheelbase:null},markets:d.markets??['source-production']});
  g.facelift=d.facelifts.length?d.facelifts.map(year=>({year,to:d.to,name:'Facelift',sources:d.sources,photo:d.make==='bmw'&&d.code==='G08'&&year===2021?structuredClone(old.photo):null})):null;
  g.specificationScope={market:d.markets?.join(' / ')??'source-production',modelYear:null,variant:null,bodyType:null,noteCs:d.note??'Sériová výroba a vybrané doložené motorizace podle uvedených pramenů.'};g.marketNotesCs=d.note??'Doložené výrobní období neznamená potvrzenou současnou českou nabídku.';
  g.engines=d.index===assignment?structuredClone(old.engines??[]):[];
  for(const raw of d.newEngines){const e=publicEngine(raw);if(!g.engines.some(x=>x.fuel===e.fuel&&x.displacementLitresNominal===e.displacementLitresNominal&&x.powerKwMin===e.powerKwMin))g.engines.push(e);}
  g.engineCoverage=g.engines.length?'representative-documented-versions':'unknown';g.sources=[...new Set([...d.sources,...g.engines.flatMap(e=>e.sources)])];return g;
 });
 c.sources=[...new Set([...(c.sources??[]),...c.generations.flatMap(g=>g.sources)])];
 const descriptions={'fiat/palio':'Palio má generaci 178 (hatchback 1996–2016, Weekend 1997–2020) a regionální generaci 326 (2011–2018, Brazílie a Argentina). Evropské motorizace nejsou automaticky přiřazovány jihoamerickému nástupci.','cadillac/escalade':'Escalade: GMT400, GMT800, GMT900, GMTK2XX a GMTT1XX. Roky znamenají sériovou výrobu; ESV je prodloužená karoserie a EXT patří k odpovídajícím generacím GMT800/GMT900.','bmw/ix3':'Elektrické iX3: G08 (2020–2025, modernizace 2021) a NA5 (sériová výroba od října 2025). Rok uvedení na evropský trh se může lišit od začátku výroby.'};c.summaryCs=descriptions[c.makeSlug+'/'+c.lineSlug];
 c.needsReview=(c.needsReview??[]).filter(r=>!/^generations(?:\[|$)/.test(r.field));return c;
}
export function buildFamilyLine(before,card){
 const l=structuredClone(before),gs=card.generations;l.from=Math.min(...gs.map(g=>g.from));l.to=gs.some(g=>g.to===null)?null:Math.max(...gs.map(g=>g.to));l.productionStatus=l.to===null?'current':'ended';l.bodyTypes=[...new Set(gs.flatMap(g=>g.bodyTypes))];l.productionPeriods=gs.map(g=>({from:g.from,to:g.to}));l.generations=gs.map(g=>({code:g.code,from:g.from,to:g.to,productionStatus:g.productionStatus,bodyTypes:g.bodyTypes,sources:g.sources}));l.sources=[...new Set([...(l.sources??[]),...card.sources])];l.needsReview=(l.needsReview??[]).filter(r=>r.field!=='generations');return l;
}
