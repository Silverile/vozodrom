import fs from 'node:fs';
const d='analysis/sweep/codex/',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const b=read(d+'DEPTH-BACKLOG.json');
const baseline=Object.assign({},...['di','jf','gb'].map(t=>read(d+`round7-${t}-baseline.json`)));
const counts=[];
for(const [make,old]of Object.entries(baseline)){
 const report=read(d+make+'.json'),changes=report.cardFixesApplied.slice(old.report.cardFixesApplied.length),cards=read('src/data/catalog/model-cards/'+make+'.json');
 const lines=[...new Set(changes.map(x=>x.lineSlug))];
 const m=b.makes.find(m=>m.make===make);
 m.cards=cards.map(c=>({lineSlug:c.lineSlug,generationRows:c.generations.length,trimEntries:c.generations.reduce((s,g)=>s+(g.trims?.length??0),0),gaps:{generationCode:c.generations.filter(g=>g.code==null).length,generationStart:c.generations.filter(g=>g.from==null).length,unknownProductionStatus:c.generations.filter(g=>g.productionStatus==='unknown').length,unreviewedFacelift:c.generations.filter(g=>g.facelift==null).length,unknownEngineRange:c.generations.filter(g=>g.engineCoverage==='unknown').length,noPhoto:c.generations.filter(g=>g.photo==null).length},depthComplete:false}));
 m.lastDepthIncrement={date:'2026-10-29',round:7,status:'partial',modelLines:lines,loggedAuditEntries:changes.length,note:'Selected fields only; full model and make depth remains incomplete.'};
 counts.push({make,lines,auditEntries:changes.length});
}
fs.writeFileSync(d+'DEPTH-BACKLOG.json',JSON.stringify(b,null,2)+'\n');
fs.writeFileSync(d+'TURN-7-COUNTS.json',JSON.stringify({round:7,makes:counts,totalAuditEntries:counts.reduce((s,m)=>s+m.auditEntries,0),updatedModelLines:counts.reduce((s,m)=>s+m.lines.length,0),additionalAudiYearReviews:2,closedPriorYearDispositions:1,allDepthIncomplete:true},null,2)+'\n');
for(const c of counts)fs.appendFileSync(d+'PROGRESS.md',`2026-10-29 DEPTH round7 ${c.make} — ${c.auditEntries} appended audit entries; selected lines ${c.lines.join(', ')}; make depth incomplete.\n`);
fs.appendFileSync(d+'PROGRESS.md','2026-10-29 DEPTH round7 audi — two appended year reviews; A3 8V 2012 year disposition closed, A4 exact full-vehicle SOP remains open; no card mutation.\n');
console.log(JSON.stringify(counts));
