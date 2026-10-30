import fs from 'node:fs';
const d='analysis/codex/photo-backfill-76',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
let candidates=read(d+'/candidates.json'),log=[];
for(const p of read(d+'/'+(process.argv[2]||'extra-pages.json'))){
 if(candidates.some(c=>c.title===p.title))continue;
 await new Promise(r=>setTimeout(r,1100));const ii=p.imageinfo[0];
 const r=await fetch(ii.thumburl.split('?')[0],{headers:{'User-Agent':'VozodromCatalogResearch/0.1 (+https://vozodrom.cz; factual catalogue curation)'}});
 log.push({title:p.title,status:r.status});if(r.status===429)break;if(!r.ok)continue;
 const id=candidates.length;candidates.push({id,makeSlug:p.makeSlug,lineSlug:p.lineSlug,generationIndex:p.generationIndex,title:p.title,ii,metadataMethod:'Previously retained exact Commons category imageinfo; additional middle-of-category candidates, 1.1-second pacing.'});
 fs.writeFileSync(`${d}/candidate-${id}.jpg`,Buffer.from(await r.arrayBuffer()));
 fs.writeFileSync(d+'/candidates.json',JSON.stringify(candidates,null,2)+'\n');
}
fs.writeFileSync(d+'/extra-log-'+(process.argv[2]||'extra-pages.json'),JSON.stringify(log,null,2)+'\n');console.log(candidates.length);
