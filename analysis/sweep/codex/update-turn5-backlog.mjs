import fs from 'node:fs';
const base='analysis/sweep/codex/',p=base+'DEPTH-BACKLOG.json',b=JSON.parse(fs.readFileSync(p,'utf8'));
const lines={honda:['civic','jazz','cr-v'],lada:['2101','niva'],iveco:['massif','emoovy'],chevrolet:['volt'],'land-rover':['discovery','discovery-sport','range-rover-velar'],jeep:['renegade','compass'],'alfa-romeo':['147','156','giulietta']};
const prior={honda:9,lada:2,iveco:0,chevrolet:14,'land-rover':4,jeep:12,'alfa-romeo':6};
const stats=[];
for(const m of b.makes){if(!lines[m.make])continue;const cards=JSON.parse(fs.readFileSync(m.cardPath,'utf8')),r=JSON.parse(fs.readFileSync(base+m.make+'.json','utf8'));
 m.cards=cards.map(c=>({lineSlug:c.lineSlug,generationRows:c.generations.length,trimEntries:c.generations.reduce((n,g)=>n+(g.trims?.length??0),0),gaps:{generationCode:c.generations.filter(g=>g.code==null).length,generationStart:c.generations.filter(g=>g.from==null).length,unknownProductionStatus:c.generations.filter(g=>g.productionStatus==='unknown').length,unreviewedFacelift:c.generations.filter(g=>g.facelift==null).length,unknownEngineRange:c.generations.filter(g=>g.engineCoverage==='unknown').length,noPhoto:c.generations.filter(g=>g.photo==null).length},depthComplete:false}));
 m.lastDepthIncrement={date:'2026-10-29',round:5,status:'partial',modelLines:lines[m.make],loggedAuditEntries:r.cardFixesApplied.length-prior[m.make],note:'Bounded selected-field checks; no whole generation or card certified complete.'};
 stats.push({make:m.make,cardCount:cards.length,modelLines:lines[m.make],loggedAuditEntries:m.lastDepthIncrement.loggedAuditEntries});
}
fs.writeFileSync(p,JSON.stringify(b,null,2)+'\n');
fs.writeFileSync(base+'TURN-5-COUNTS.json',JSON.stringify({round:5,date:'2026-10-29',makes:stats,totalAuditEntries:stats.reduce((n,m)=>n+m.loggedAuditEntries,0),modelLines:stats.reduce((n,m)=>n+m.modelLines.length,0),allDepthIncomplete:true},null,2)+'\n');
console.log(JSON.stringify(stats));
