const titles=['Škoda Octavia','BMW 3 Series','Volkswagen ID.4'];
const url='https://en.wikipedia.org/w/api.php?'+new URLSearchParams({action:'query',format:'json',formatversion:'2',redirects:'1',prop:'revisions',rvprop:'ids|timestamp|content',rvslots:'main',titles:titles.join('|')});
try {const r=await fetch(url,{signal:AbortSignal.timeout(45000),headers:{'User-Agent':'VozodromCatalogueResearch/1.0'}});const text=await r.text();console.log(r.status,text.slice(0,1400));}catch(e){console.log(e.message);}
