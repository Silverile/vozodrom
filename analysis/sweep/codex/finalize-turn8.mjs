import fs from 'node:fs';
const d='analysis/sweep/codex/',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const cb=read(d+'round8-chery-baseline.json');
const baseline={chery:cb.chery??cb,...read(d+'round8-barkas-aro-baseline.json'),...read(d+'round8-cadillac-baseline.json'),...read(d+'round8-bentley-baseline.json')};
const b=read(d+'DEPTH-BACKLOG.json'),counts=[];
for(const [make,old]of Object.entries(baseline)){
 const r=read(d+make+'.json'),changes=r.cardFixesApplied.slice(old.report.cardFixesApplied.length),cards=read('src/data/catalog/model-cards/'+make+'.json');
 const lines=[...new Set(changes.map(x=>x.lineSlug))],m=b.makes.find(m=>m.make===make);
 m.cards=cards.map(c=>({lineSlug:c.lineSlug,generationRows:c.generations.length,trimEntries:c.generations.reduce((s,g)=>s+(g.trims?.length??0),0),gaps:{generationCode:c.generations.filter(g=>g.code==null).length,generationStart:c.generations.filter(g=>g.from==null).length,unknownProductionStatus:c.generations.filter(g=>g.productionStatus==='unknown').length,unreviewedFacelift:c.generations.filter(g=>g.facelift==null).length,unknownEngineRange:c.generations.filter(g=>g.engineCoverage==='unknown').length,noPhoto:c.generations.filter(g=>g.photo==null).length},depthComplete:false}));
 m.lastDepthIncrement={date:'2026-10-29',round:8,status:'partial',modelLines:lines,loggedAuditEntries:changes.length,note:'Selected specifications and photo metadata only; no complete make/model depth or fresh visual certification. Barkas has report-only findings.'};
 const photoEntries=[...(r.photoReviews??[]).slice(old.report.photoReviews?.length??0),...(r.photoChecks??[]).slice(old.report.photoChecks?.length??0).flatMap(x=>x.checks??[])];
 counts.push({make,changedLines:lines,auditEntries:changes.length,photoMetadataAttempts:photoEntries.length});
}
fs.writeFileSync(d+'DEPTH-BACKLOG.json',JSON.stringify(b,null,2)+'\n');
fs.writeFileSync(d+'TURN-8-COUNTS.json',JSON.stringify({round:8,makes:counts,totalAuditEntries:counts.reduce((s,c)=>s+c.auditEntries,0),changedModelLines:counts.reduce((s,c)=>s+c.changedLines.length,0),photoMetadataAttempts:16,photoMetadataRetrieved:11,photoMetadataRetrievalFailures:5,candidatePhotosNotInstalled:2,photosWithdrawnForUncertainty:1,newVisualCertifications:0,allDepthIncomplete:true},null,2)+'\n');
for(const c of counts)fs.appendFileSync(d+'PROGRESS.md',`2026-10-29 DEPTH round8 ${c.make} — ${c.auditEntries} appended card audit operations; ${c.photoMetadataAttempts} photo metadata attempts; partial selected depth, make remains incomplete.\n`);
console.log(JSON.stringify(counts));
