import fs from 'node:fs';
const base='analysis/codex/night-panhard-photo-';
const headers={'User-Agent':'VozodromCatalogResearch/1.0 (historic car catalogue; Wikimedia attribution and image review)'};
const nap=()=>new Promise(r=>setTimeout(r,1100));
async function api(args){await nap();const u=new URL('https://commons.wikimedia.org/w/api.php');for(const[k,v]of Object.entries({action:'query',format:'json',maxlag:'5',...args}))u.searchParams.set(k,v);const r=await fetch(u,{headers});if(!r.ok)throw Error(r.status);return r.json();}
const searches={'4-hp':'Panhard Levassor 1895','6-cs':'Panhard 6 CS Panoramique','dynamic':'Panhard Dynamic','dyna-x':'Panhard Dyna X','dyna-junior':'Panhard Junior','dyna-z':'Panhard Dyna Z','pl-17':'Panhard PL 17','cd':'Panhard CD','24':'Panhard 24'};
const candidates=[];
for(const[slug,q]of Object.entries(searches)){const x=await api({list:'search',srnamespace:'6',srlimit:'5',srsearch:q});for(const s of x.query?.search||[])candidates.push({slug,title:s.title});console.log(slug,x.query?.search?.length||0);}
const meta=await api({prop:'imageinfo',titles:[...new Set(candidates.map(x=>x.title))].join('|'),iiprop:'url|size|extmetadata',iiurlwidth:'700'});
for(const p of Object.values(meta.query.pages))for(const c of candidates.filter(c=>c.title===p.title))c.ii=p.imageinfo?.[0];
fs.writeFileSync(base+'candidates.json',JSON.stringify(candidates,null,2)+'\n');
for(const slug of Object.keys(searches)){const c=candidates.find(c=>c.slug===slug&&c.ii&&c.ii.width/c.ii.height>=1.4&&c.ii.width/c.ii.height<=1.75);if(!c)continue;await nap();const r=await fetch(c.ii.thumburl,{headers});if(!r.ok)continue;fs.writeFileSync(base+slug+'.jpg',Buffer.from(await r.arrayBuffer()));console.log('PREVIEW',slug,c.title);}
