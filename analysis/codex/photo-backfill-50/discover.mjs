import fs from'node:fs';
const cats=['Citroën C1','Citroën C3','Citroën C6 (2005)','Daihatsu Charmant','Daihatsu Compagno','Daihatsu Move','Daihatsu Opti','Daihatsu Midget','BMW 02','BMW E3','BMW E9','BMW M1'];const out=[];
for(const cat of cats){const url='https://commons.wikimedia.org/wiki/Category:'+encodeURIComponent(cat),r=await fetch(url);if(!r.ok){out.push({cat,status:r.status});continue;}const h=await r.text(),all=[...new Set([...h.matchAll(/href="\/wiki\/Category:([^"]+)"/g)].map(m=>decodeURIComponent(m[1]).replaceAll('_',' ').replaceAll('&amp;','&')))];out.push({cat,url,subcategories:all.filter(x=>x.startsWith(cat))});}
fs.writeFileSync('analysis/codex/photo-backfill-50/discovered.json',JSON.stringify(out,null,2)+'\n');console.log(out);
