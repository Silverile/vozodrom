import fs from 'node:fs';
const d='analysis/sweep/codex/',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const b=read(d+'DEPTH-BACKLOG.json'),makes=['ds-automobiles','aixam','baic','infiniti','hummer','leapmotor','dongfeng'],counts=[];
for(const make of makes){
 const old=read(d+`round9-baseline-${make}-report.json`),r=read(d+make+'.json'),cards=read('src/data/catalog/model-cards/'+make+'.json');
 const fixes=r.cardFixesApplied.slice(old.cardFixesApplied.length),lines=[...new Set(fixes.map(f=>f.lineSlug))],m=b.makes.find(m=>m.make===make);
 m.cards=cards.map(c=>({lineSlug:c.lineSlug,generationRows:c.generations.length,trimEntries:c.generations.reduce((s,g)=>s+(g.trims?.length??0),0),gaps:{generationCode:c.generations.filter(g=>g.code==null).length,generationStart:c.generations.filter(g=>g.from==null).length,unknownProductionStatus:c.generations.filter(g=>g.productionStatus==='unknown').length,unreviewedFacelift:c.generations.filter(g=>g.facelift==null).length,unknownEngineRange:c.generations.filter(g=>g.engineCoverage==='unknown').length,noPhoto:c.generations.filter(g=>g.photo==null).length},depthComplete:false}));
 m.lastDepthIncrement={date:'2026-10-29',round:9,status:'partial',modelLines:lines,loggedAuditEntries:fixes.length,note:'Selected generation chronology/status/facelifts and metadata; no full make/model completion or fresh visual certification.'};
 counts.push({make,cardLines:cards.length,generationRows:cards.reduce((s,c)=>s+c.generations.length,0),auditEntries:fixes.length,changedLines:lines});
 const progressPath=d+'PROGRESS.md',progress=fs.readFileSync(progressPath,'utf8'),line=`2026-10-29 DEPTH round9 ${make} — ${fixes.length} appended audit operations; ${lines.length} selected model lines changed; make remains depth incomplete.`;
 const previous=new RegExp(`^2026-10-29 DEPTH round9 ${make} .*?$`,'m');
 fs.writeFileSync(progressPath,previous.test(progress)?progress.replace(previous,line):progress+line+'\n');
}
fs.writeFileSync(d+'DEPTH-BACKLOG.json',JSON.stringify(b,null,2)+'\n');
const result={round:9,makes:counts,totalAuditEntries:counts.reduce((s,c)=>s+c.auditEntries,0),changedModelLines:counts.reduce((s,c)=>s+c.changedLines.length,0),newVisualCertifications:0,photoReplacements:0,missingModelProposals:1,allDepthIncomplete:true};
fs.writeFileSync(d+'TURN-9-COUNTS.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
console.log('Next fleet-ranked makes after Dongfeng: '+b.makes.slice(b.makes.findIndex(m=>m.make==='dongfeng')+1).slice(0,15).map(m=>m.make).join(', '));
