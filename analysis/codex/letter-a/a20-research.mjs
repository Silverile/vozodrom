import fs from 'node:fs';
const mode=process.argv[2];
for(const url of process.argv.slice(3)){
 const r=await fetch(url,{signal:AbortSignal.timeout(30000)}),h=await r.text();
 if(mode==='assets') console.log(url,r.status,[...new Set([...h.matchAll(/(?:src|data-src)=["']([^"']+)/g)].map(x=>x[1]))].slice(0,110));
 if(mode==='text') console.log(url,r.status,h.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').slice(0,12000));
}
