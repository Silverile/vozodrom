import fs from 'node:fs';
for(const u of process.argv.slice(2)){
 const r=await fetch(u,{signal:AbortSignal.timeout(30000)}),h=await r.text();
 console.log('\nURL',u,r.status);
 if(u.endsWith('robots.txt')){console.log(h.slice(0,9000));continue;}
 console.log(h.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').slice(0,15000));
 console.log('IMAGES',[...new Set([...h.matchAll(/(?:https?:)?\/\/[^\s"<>]+\.(?:jpg|webp)[^\s"<>]*/g)].map(x=>x[0]))].slice(0,55));
 console.log('LINKS',[...new Set([...h.matchAll(/<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].filter(x=>/4-series|B4 BiTurbo|B4 Gran Coupe/i.test(x[2])).map(x=>[x[1],x[2]]))]);
}
