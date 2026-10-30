import fs from 'node:fs';
const d='analysis/codex/photo-backfill-78',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const patches=fs.readdirSync(d).filter(f=>/^batch-\d+\.json$/.test(f)).flatMap(f=>read(d+'/'+f));
const counts=cs=>({cards:cs.length,generations:cs.reduce((n,c)=>n+c.generations.length,0),versions:cs.reduce((n,c)=>n+c.generations.reduce((n,g)=>n+(g.trims||[]).length,0),0),photos:cs.reduce((n,c)=>n+c.generations.filter(g=>g.photo).length,0)});
if(fs.existsSync('analysis/codex/mazda-photos-78/batch001.json'))patches.push(...read('analysis/codex/mazda-photos-78/batch001.json'));const coverage={};for(const[make,suffix]of [['mercedes-benz','mercedes'],['mazda','mazda']]){
 const cards=read(`src/data/catalog/model-cards/${make}.json`),before=counts(read(d+'/before-'+suffix+'.json')),after=counts(cards),path=`analysis/codex/night-${make}-report.json`,report=read(path);
 coverage[make]={before,after,missingPhotos:after.generations-after.photos};Object.assign(report,after,{counts:after});
 report.rootBackfill78={photoCount:patches.filter(p=>p.makeSlug===make).length,patches:patches.filter(p=>p.makeSlug===make).map(p=>({lineSlug:p.lineSlug,generationIndex:p.generationIndex,generation:p.expectedGenerationName,file:p.photo.file})),note:'Whole-vehicle Commons illustrations inspected individually; scope and angle exceptions annotated; no version facts changed.'};
 report.sources=[...new Set([...(report.sources||[]),...patches.filter(p=>p.makeSlug===make).flatMap(p=>p.photo.sources)])];fs.writeFileSync(path,JSON.stringify(report,null,2)+'\n');
}
const selected=patches.map(p=>({make:p.makeSlug,line:p.lineSlug,generation:p.expectedGenerationName,file:p.photo.file,url:p.photo.url}));
fs.writeFileSync(d+'/report.json',JSON.stringify({selected,coverage,scope:'Bounded category/subcategory and cached middle-candidate search; not exhaustion of Commons.'},null,2)+'\n');
fs.writeFileSync(d+'/README.md','# Turn78 photo backfill\n\n'+patches.length+' inspected whole-car references, preferred aspect1.4?1.7. Framing and regional/appearance limits annotated per photo. R172/GL exceptions from prior batches are preserved separately. Vito has advertising wrap; GLK is a China-market illustration; EQE SUV elevated view; W113 is an archival monochrome image. Source photos illustrate generations, not exact Czech trim/year specifications. No image editing or product binaries. Mazda MX6 candidate108 was rejected because photographer metadata is blank (PD-user-en release names a rights holder); candidate106 rejected for tight framing. Bounded searches are not exhaustion of Commons. Rebuild with merge-photo-patches-78.mjs, then this finalizer.\n\n'+JSON.stringify(coverage,null,2)+'\n');
console.log(JSON.stringify({selected:patches.length,coverage}));
