import fs from 'node:fs';
const d='analysis/codex/photo-peugeot-historic-84',ua='VozodromCatalogResearch/0.1 (+https://vozodrom.cz; factual catalogue curation)';
let cs=JSON.parse(fs.readFileSync(d+'/candidates.json'));
for(const slug of ['201','301','302','304','402','403','404','504','601','604','bebe']){
 const f=d+'/search-peugeot-'+slug+'.json';if(!fs.existsSync(f))continue;
 const ps=Object.values(JSON.parse(fs.readFileSync(f)).query?.pages||{}).filter(p=>{const i=p.imageinfo?.[0];return i&&i.width/i.height>=1.4&&i.width/i.height<=1.75&&/\.jpe?g$/i.test(p.title)&&!/rear|heck|interior|engine|detail|badge|logo|frontpartie/i.test(p.title)&&!cs.some(c=>c.title===p.title)});
 for(const p of ps.slice(0,2)){await new Promise(r=>setTimeout(r,1100));const ii=p.imageinfo[0],r=await fetch(ii.thumburl,{headers:{'User-Agent':ua}});if(!r.ok)continue;const id=cs.length;fs.writeFileSync(`${d}/candidate-${id}.jpg`,Buffer.from(await r.arrayBuffer()));cs.push({id,makeSlug:'peugeot',lineSlug:slug,generationIndex:0,title:p.title,ii});fs.writeFileSync(d+'/candidates.json',JSON.stringify(cs,null,2));console.log(id,slug,p.title);}
}
