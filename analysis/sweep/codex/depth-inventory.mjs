import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const dir='analysis/sweep/codex/';
const makes=read('src/data/catalog/makes.json').filter(m=>m.sections.includes('auto')&&/^[a-l]/.test(m.slug));
const inventory=makes.map(m=>{
 const cardPath=`src/data/${['ford','hyundai'].includes(m.slug)?'model-cards':'catalog/model-cards'}/${m.slug}.json`;
 const cards=fs.existsSync(cardPath)?read(cardPath):[];
 const statsPath=`src/data/stats/${m.slug}.json`;
 const fleet=fs.existsSync(statsPath)?Object.values(read(statsPath)).reduce((s,x)=>s+(x?.fleet?.n??0),0):0;
 return {make:m.slug,registeredFleetSum: fleet,cardPath,depthStatus:'incomplete',cards:cards.map(c=>({lineSlug:c.lineSlug,generationRows:c.generations.length,trimEntries:c.generations.reduce((s,g)=>s+(g.trims?.length??0),0),gaps:{generationCode:c.generations.filter(g=>g.code===null).length,generationStart:c.generations.filter(g=>g.from===null).length,unknownProductionStatus:c.generations.filter(g=>g.productionStatus==='unknown').length,unreviewedFacelift:c.generations.filter(g=>g.facelift===null).length,unknownEngineRange:c.generations.filter(g=>g.engines===null).length,noPhoto:c.generations.filter(g=>g.photo===null).length},depthComplete:false}))};
}).sort((a,b)=>b.registeredFleetSum-a.registeredFleetSum||a.make.localeCompare(b.make));
fs.writeFileSync(dir+'DEPTH-BACKLOG.json',JSON.stringify({checkedAt:'2026-10-29',method:'Registered fleet = sum of top-level per-model fleet.n from src/data/stats. Missing stats = 0, not verified absence. Inventory gaps do not establish factual correctness. No full-make or full-model depth completion claimed.',makes:inventory},null,2)+'\n');
console.log(JSON.stringify({makes:inventory.length,cards:inventory.reduce((s,m)=>s+m.cards.length,0),topMakes:inventory.slice(0,12).map(({make,registeredFleetSum,cards})=>({make,registeredFleetSum,cards:cards.length}))},null,2));
