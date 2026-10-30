import fs from 'node:fs';
const h=await(await fetch('https://www.chilterngreen.de/bildarchiv/')).text();
let n=0;for(const m of h.matchAll(/<img[^>]+>/g)){if(!/International Le Mans/.test(m[0]))continue;const url=m[0].match(/src="([^"]+)"/)[1],local=`analysis/codex/letter-a/raw/a24-ilm-${n++}.jpg`;const r=await fetch(url);fs.writeFileSync(local,Buffer.from(await r.arrayBuffer()));console.log(local,url);await new Promise(t=>setTimeout(t,5100));}
