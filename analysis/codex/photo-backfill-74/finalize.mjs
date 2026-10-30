import fs from 'node:fs';
const d='analysis/codex/photo-backfill-74',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const patches=fs.readdirSync(d).filter(f=>/^batch-\d+\.json$/.test(f)).flatMap(f=>read(d+'/'+f));
const counts=cards=>({cards:cards.length,generations:cards.reduce((n,c)=>n+c.generations.length,0),versions:cards.reduce((n,c)=>n+c.generations.reduce((n,g)=>n+(g.trims||[]).length,0),0),photos:cards.reduce((n,c)=>n+c.generations.filter(g=>g.photo).length,0)});
const coverage={};for(const make of ['mercedes-benz','mazda']){
 const cards=read(`src/data/catalog/model-cards/${make}.json`),rpath=`analysis/codex/night-${make}-report.json`,report=read(rpath);
 const before=counts(read(d+'/before-'+(make==='mercedes-benz'?'mercedes':'mazda')+'.json')),after=counts(cards);
 coverage[make]={before,after,missingPhotos:after.generations-after.photos};
 report.counts=after;report.rootBackfill74={photoCount:patches.filter(p=>p.makeSlug===make).length,patches:patches.filter(p=>p.makeSlug===make).map(p=>({lineSlug:p.lineSlug,generationIndex:p.generationIndex,generation:p.expectedGenerationName,file:p.photo.file})),note:'Individually inspected full-vehicle Commons photographs, aspect1.4–1.7; family illustrations do not prove exact trim/year/market specifications.'};
 report.sources=[...new Set([...(report.sources||[]),...patches.filter(p=>p.makeSlug===make).flatMap(p=>p.photo.sources)])];
 fs.writeFileSync(rpath,JSON.stringify(report,null,2)+'\n');
}
const selected=patches.map(p=>({make:p.makeSlug,line:p.lineSlug,generation:p.expectedGenerationName,file:p.photo.file,url:p.photo.url}));
fs.writeFileSync(d+'/report.json',JSON.stringify({selected,coverage,scope:'Bounded category and subcategory search, not exhaustion of Commons. Rejected tight crops/rear/obscured/interior images; unknowns remain null.'},null,2)+'\n');
fs.writeFileSync(d+'/README.md','# Turn74 Commons photo backfill\n\nSelected '+patches.length+' individually viewed complete-vehicle photographs. Preferred front three-quarter view and aspect1.4–1.7. No crops or original images shipped; metadata and exact source credit retained.\n\n'+JSON.stringify(coverage,null,2)+'\n\nGLB advertising wrap and China/Malaysia-market illustrations are explicitly annotated. These photographs illustrate families, not exact version equipment or homologation. Candidate184 rejected because a foreground vehicle hides a rear wheel; many other candidates rejected for insufficient margin, rear view, interior, or unrelated subject. Category search is bounded, not exhausted. Rebuild with merge-photo-patches-74.mjs after earlier make builders/patches.\n');
console.log(JSON.stringify({selected:patches.length,coverage}));
