import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const path='analysis/codex/catalog-sweep-progress.json',progress=read(path),root='analysis/codex/engine-throughput';
const reports=fs.readdirSync(root).filter(f=>/^batch-\d+\.json$/.test(f)).map(f=>read(`${root}/${f}`));
for(const report of reports){
 const id=`engine-throughput-batch-${report.batch}`;
 for(const line of report.lines){const row=progress.rows.find(r=>r.makeSlug===line.make&&r.lineSlug===line.line);if(!row)throw Error('Unknown line');row.batch=id;row.status=line.status;row.remainingGaps=line.remainingGaps;}
 if(!progress.batches.some(b=>b.id===id))progress.batches.push({id,report:`${root}/batch-${report.batch}.json`,validation:`${root}/validation.json`});
}
const audit=read('analysis/codex/catalog-completeness-audit.json');
for(const r of audit.lines){const row=progress.rows.find(x=>x.makeSlug===r.makeSlug&&x.lineSlug===r.lineSlug);row.generationsWithoutEngines=r.generations.filter(g=>!g.engineRows).map(g=>g.index);row.generationsWithEnginePowerGaps=r.generations.filter(g=>g.engineRowsWithoutPower.length).map(g=>g.index);}
progress.counts={...progress.counts,linesVisited:progress.rows.filter(r=>r.batch).length,linesEnriched:progress.rows.filter(r=>r.status==='engines-added'||r.status==='core-fields-enriched-followups-recorded').length,
 unvisited:progress.rows.filter(r=>!r.batch).length,byWave:[1,2,3].map(wave=>({wave,lines:progress.rows.filter(r=>r.wave===wave).length,visited:progress.rows.filter(r=>r.wave===wave&&r.batch).length}))};
progress.nextDataTargets=progress.rows.filter(r=>r.wave===1&&!r.batch).slice(0,30).map(({makeSlug,lineSlug,fleetN})=>({makeSlug,lineSlug,fleetN}));
fs.writeFileSync(path,JSON.stringify(progress,null,2)+'\n');console.log(JSON.stringify(progress.counts));
