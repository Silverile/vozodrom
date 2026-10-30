import fs from 'node:fs';
const ua='VozodromCatalogResearch/0.1 (+https://vozodrom.cz; factual catalogue curation)';
const urls=['https://www.auto-brochures.com/pontiac.html','https://www.lov2xlr8.no/pontiac.html','https://www.lov2xlr8.no/brochures/pontiac/40po/40po.html'];
const out=[];
for(const u of urls){const r=await fetch(u,{headers:{'User-Agent':ua}});const h=await r.text();const links=[...h.matchAll(/<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map(m=>({url:new URL(m[1],u).href,text:m[2].replace(/<[^>]+>/g,'').trim()}));out.push({url:u,status:r.status,links});}
fs.writeFileSync('analysis/codex/night-pontiac-source-audit.json',JSON.stringify(out,null,2)+'\n');
for(const p of out)console.log(p.url,p.status,p.links.filter(l=>/Safari|SV6|Trans Sport|V8|Torpedo|1941|Chieftain|Grand Am|Grand Ville|Astre|Acadian|1000|2000|6000|Sunfire|Sunbird|Phoenix|Parisienne|Ventura/.test(l.text)).map(l=>[l.text,l.url]));
console.log(out[2].links.slice(0,20));
