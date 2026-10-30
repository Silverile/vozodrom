import fs from 'node:fs';
const d='analysis/codex/photo-backfill-56',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const groups=read(d+'/metadata-groups.json'),cs=read(d+'/candidates.json');
const wanted=new Set(['doblo','bravo','ulysse','ducato']);
for(const g of groups.filter(g=>wanted.has(g.lineSlug))){
 const cards=read(`src/data/catalog/model-cards/${g.makeSlug}.json`);if(cards.find(c=>c.lineSlug===g.lineSlug).generations[g.generationIndex].photo)continue;
 const pages=g.pages.filter(p=>!cs.some(c=>c.title===p.title&&c.lineSlug===g.lineSlug&&c.generationIndex===g.generationIndex)&&/fiat|dobl/i.test(p.title)&&!/interior|dashboard|heck|rear|crash|cockpit|taxi|ambulance|police|camper|navi|003/i.test(p.title)).slice(0,6);
 for(const p of pages){const ii=p.imageinfo[0],id=cs.length,im=await fetch(ii.thumburl.split('?')[0],{headers:{'User-Agent':'VozodromCatalogResearch/0.1 (+https://vozodrom.cz; factual catalogue curation)'}});console.log(id,g.lineSlug,p.title,im.status);if(im.status===429){fs.writeFileSync(d+'/more-stopped.json',JSON.stringify({status:429,url:ii.thumburl}));process.exit(0);}cs.push({id,makeSlug:g.makeSlug,lineSlug:g.lineSlug,generationIndex:g.generationIndex,title:p.title,ii,metadataMethod:'Reused50-filepacedCommonsimageinfo batch; no repeatedmetadataquery.'});fs.writeFileSync(d+'/candidates.json',JSON.stringify(cs,null,2)+'\n');if(im.ok)fs.writeFileSync(d+'/candidate-'+id+'.jpg',Buffer.from(await im.arrayBuffer()));await new Promise(r=>setTimeout(r,1100));}
}
