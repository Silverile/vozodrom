import fs from 'node:fs';
const base='analysis/codex/night-porsche-photo-';
const headers={'User-Agent':'VozodromCatalogResearch/1.0 (historic Porsche catalogue; attribution and visual framing review)'};
const nap=()=>new Promise(r=>setTimeout(r,3500));
async function api(args){await nap();const u=new URL('https://commons.wikimedia.org/w/api.php');for(const[k,v]of Object.entries({action:'query',format:'json',maxlag:'5',...args}))u.searchParams.set(k,v);const r=await fetch(u,{headers});if(r.status===429){await new Promise(res=>setTimeout(res,20000));const retry=await fetch(u,{headers});if(!retry.ok)throw Error(retry.status);return retry.json();}if(!r.ok)throw Error(r.status);return r.json();}
const targets=[['356','A','Porsche 356 A'],['911','964','Porsche 964'],['911','993','Porsche 993'],['911','996','Porsche 996'],['911','997','Porsche 997'],['911','991','Porsche 991'],['911','992','Porsche 992'],['boxster','986','Porsche Boxster 986'],['boxster','987','Porsche Boxster 987'],['boxster','981','Porsche Boxster 981'],['boxster','982','Porsche 718 Boxster'],['carrera-gt','980','Porsche Carrera GT'],['918-spyder','918','Porsche 918 Spyder'],['cayenne','E1','Porsche Cayenne 955'],['panamera','970','Porsche Panamera 970']];
const candidates=[];
for(const[slug,code,q]of targets){const x=await api({list:'search',srnamespace:'6',srlimit:'3',srsearch:q});for(const s of x.query?.search||[])candidates.push({slug,code,title:s.title});fs.writeFileSync(base+'candidates.json',JSON.stringify(candidates,null,2)+'\\n');}
const meta=await api({prop:'imageinfo',titles:[...new Set(candidates.map(x=>x.title))].join('|'),iiprop:'url|size|extmetadata',iiurlwidth:'700'});
for(const p of Object.values(meta.query.pages))for(const c of candidates.filter(c=>c.title===p.title))c.ii=p.imageinfo?.[0];
fs.writeFileSync(base+'candidates.json',JSON.stringify(candidates,null,2)+'\n');
for(const[slug,code]of targets){const c=candidates.find(c=>c.slug===slug&&c.code===code&&c.ii&&c.ii.width/c.ii.height>=1.44&&c.ii.width/c.ii.height<=1.75);if(!c)continue;await nap();const r=await fetch(c.ii.thumburl,{headers});if(!r.ok)continue;const index=candidates.indexOf(c);fs.writeFileSync(base+index+'.jpg',Buffer.from(await r.arrayBuffer()));console.log('PREVIEW',index,slug,code,c.title);}
