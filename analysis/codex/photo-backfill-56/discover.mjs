import fs from 'node:fs';
const roots=['Fiat Bravo','Fiat Ulysse','Fiat Ducato','Fiat 500','Fiat Multipla','Fiat 124','Fiat 850','Fiat 127','Fiat 128'];
const out=[];
for(const name of roots){
 const p=new URLSearchParams({action:'query',format:'json',maxlag:'5',list:'categorymembers',cmtitle:'Category:'+name,cmtype:'subcat',cmlimit:'50'}),url='https://commons.wikimedia.org/w/api.php?'+p;
 const r=await fetch(url,{headers:{'User-Agent':'VozodromCatalogResearch/0.1 (+https://vozodrom.cz; factual catalogue curation)'}});
 if(r.status===429){out.push({name,status:r.status});break;}
 const data=await r.json(),categories=(data.query?.categorymembers||[]).map(x=>x.title);
 out.push({name,url,status:r.status,categories});console.log(name,categories);
 fs.writeFileSync('analysis/codex/photo-backfill-56/discovery.json',JSON.stringify(out,null,2)+'\n');
 await new Promise(r=>setTimeout(r,1100));
}
