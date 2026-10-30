import fs from 'node:fs';
for(const p of process.argv.slice(2)){
 const url=p.startsWith('http')?p:'https://commons.wikimedia.org/wiki/'+p;
 const h=await(await fetch(url)).text();
 console.log(url,h.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').match(/(?:Description|Beschreibung|Der Adler).{0,1300}/)?.[0]);
 console.log([...new Set([...h.matchAll(/href="([^"]+)"/g)].map(x=>x[1]).filter(x=>/commons|File:|Datei:/.test(x)))].join('\n'));
}
