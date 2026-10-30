import fs from 'node:fs';
import sharp from 'sharp';
const [mode,...args]=process.argv.slice(2);
if(mode==='snippet')for(const url of args){const h=await(await fetch(url)).text();console.log(h.split('\n').filter(x=>/thumb|bilder|jpg|4723|popupjpeg|script /i.test(x)).join('\n'));}
if(mode==='links')for(const url of args){const h=await(await fetch(url)).text();console.log(url,[...h.matchAll(/(?:href|src|background-image|window\.open)\s*[=(]\s*["']([^"']+)["']/gi)].map(x=>x[1]).filter(x=>/jpg|4723|detail|bild/.test(x)));}
if(mode==='get')for(let i=0;i<args.length;i+=2){const [url,name]=args.slice(i,i+2);const r=await fetch(url,{signal:AbortSignal.timeout(20000)});if(!r.ok){console.log(url,r.status,r.headers.get('retry-after'));continue;}const p='analysis/codex/letter-a/raw/a10-'+name;fs.writeFileSync(p,Buffer.from(await r.arrayBuffer()));const m=await sharp(p).metadata();console.log(p,m.width,m.height);}
