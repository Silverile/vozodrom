for(const p of process.argv.slice(2)){
 const h=await(await fetch('https://en.wikipedia.org/wiki/'+p)).text();
 console.log(p,[...new Set([...h.matchAll(/(?:resource|href)="([^" ]*File:[^" ]+)"/g)].map(x=>decodeURIComponent(x[1])))].filter(x=>!/(svg|Rear|rear|Heck|interior|Interior|Dashboard|engine|back)/.test(x)).join('\n'));
}
