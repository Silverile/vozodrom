for(const c of process.argv.slice(2)) {
 const h=await(await fetch('https://commons.wikimedia.org/wiki/Category:'+c)).text();
 console.log(c,[...new Set([...h.matchAll(/href="([^"]+)"/g)].map(m=>decodeURIComponent(m[1])).filter(x=>/Category:Acura|File:/.test(x)))].slice(-100).join('\n'));
}
