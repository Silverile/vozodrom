import fs from 'node:fs';
const d='analysis/codex/photo-backfill-82',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const patches=fs.readdirSync(d).filter(f=>/^batch-\d+\.json$/.test(f)).flatMap(f=>read(d+'/'+f));
const counts=cs=>({cards:cs.length,generations:cs.reduce((n,c)=>n+c.generations.length,0),versions:cs.reduce((n,c)=>n+c.generations.reduce((n,g)=>n+(g.trims||[]).length,0),0),photos:cs.reduce((n,c)=>n+c.generations.filter(g=>g.photo).length,0)});
const coverage={};for(const[make,suffix]of [['opel','opel']]){
 const cards=read(`src/data/catalog/model-cards/${make}.json`),before=counts(read(d+'/before-'+suffix+'.json')),after=counts(cards),path=`analysis/codex/night-${make}-report.json`,report=read(path);
 coverage[make]={before,after,missingPhotos:after.generations-after.photos};Object.assign(report,after,{counts:after});
 report.rootBackfill82={photoCount:patches.filter(p=>p.makeSlug===make).length,patches:patches.filter(p=>p.makeSlug===make).map(p=>({lineSlug:p.lineSlug,generationIndex:p.generationIndex,generation:p.expectedGenerationName,file:p.photo.file})),note:'Whole-vehicle Commons illustrations inspected individually; scope and angle exceptions annotated; no version facts changed.'};
 report.sources=[...new Set([...(report.sources||[]),...patches.filter(p=>p.makeSlug===make).flatMap(p=>p.photo.sources)])];fs.writeFileSync(path,JSON.stringify(report,null,2)+'\n');
}
const selected=patches.map(p=>({make:p.makeSlug,line:p.lineSlug,generation:p.expectedGenerationName,file:p.photo.file,url:p.photo.url}));
fs.writeFileSync(d+'/report.json',JSON.stringify({selected,coverage,scope:'Bounded category/subcategory and cached middle-candidate search; not exhaustion of Commons.'},null,2)+'\n');
fs.writeFileSync(d+'/README.md','# Turn82 photo backfill\n\nWhole-car Commons illustrations inspected individually. Aspect1.4?1.7. Zafira C shows a China-market example; the photograph does not prove Czech trim specifications. Zafira B uses an exact file-page custom attribution grant. Bounded search, not Commons exhaustion. No image editing or product binaries.\n\n'+JSON.stringify(coverage,null,2)+'\n');
console.log(JSON.stringify({selected:patches.length,coverage}));
