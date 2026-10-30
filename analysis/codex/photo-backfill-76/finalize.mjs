import fs from 'node:fs';
const d='analysis/codex/photo-backfill-76',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const patches=fs.readdirSync(d).filter(f=>/^batch-\d+\.json$/.test(f)).flatMap(f=>read(d+'/'+f));
const counts=cs=>({cards:cs.length,generations:cs.reduce((n,c)=>n+c.generations.length,0),versions:cs.reduce((n,c)=>n+c.generations.reduce((n,g)=>n+(g.trims||[]).length,0),0),photos:cs.reduce((n,c)=>n+c.generations.filter(g=>g.photo).length,0)});
const coverage={};for(const[make,suffix]of [['mercedes-benz','mercedes'],['mazda','mazda']]){
 const cards=read(`src/data/catalog/model-cards/${make}.json`),before=counts(read(d+'/before-'+suffix+'.json')),after=counts(cards),path=`analysis/codex/night-${make}-report.json`,report=read(path);
 coverage[make]={before,after,missingPhotos:after.generations-after.photos};Object.assign(report,after,{counts:after});
 report.rootBackfill76={photoCount:patches.filter(p=>p.makeSlug===make).length,patches:patches.filter(p=>p.makeSlug===make).map(p=>({lineSlug:p.lineSlug,generationIndex:p.generationIndex,generation:p.expectedGenerationName,file:p.photo.file})),note:'Whole-vehicle Commons illustrations inspected individually; scope and angle exceptions annotated; no version facts changed.'};
 report.sources=[...new Set([...(report.sources||[]),...patches.filter(p=>p.makeSlug===make).flatMap(p=>p.photo.sources)])];fs.writeFileSync(path,JSON.stringify(report,null,2)+'\n');
}
const selected=patches.map(p=>({make:p.makeSlug,line:p.lineSlug,generation:p.expectedGenerationName,file:p.photo.file,url:p.photo.url}));
fs.writeFileSync(d+'/report.json',JSON.stringify({selected,coverage,scope:'Bounded category/subcategory and cached middle-candidate search; not exhaustion of Commons.'},null,2)+'\n');
fs.writeFileSync(d+'/README.md','# Turn76 Commons photo backfill\n\n'+patches.length+' inspected whole-vehicle photographs, aspect1.4–1.7. Metadata and revision-specific permission evidence retained; temporary previews removed.\n\n'+JSON.stringify(coverage,null,2)+'\n\nGL X164 uses an explicitly labelled side-profile fallback with aftermarket wheels; R172 uses an elevated front three-quarter view. C219 minimum side margin approximately4–5%; Australian/US or modified vehicles illustrate generations, not exact Czech configurations. RX7FC has modified wheels. Trunk-open R172 candidate129 was replaced; tight GL X164 candidate273 rejected. Rebuild after make builders using merge-photo-patches-76.mjs, then this finalizer. Earlier root patches are included by the merge chain. Sources/permissions: exact Commons imageinfo and permissions.json. Searches remain incomplete.\n');
console.log(JSON.stringify({selected:patches.length,coverage}));
