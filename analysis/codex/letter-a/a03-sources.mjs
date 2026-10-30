const url=process.argv[2]||'https://commons.wikimedia.org/wiki/Acura';
const h=await(await fetch(url)).text();
if(url.endsWith('/Acura')) console.log([...new Set(h.match(/href="\/wiki\/File:[^"]+/g))].slice(0,65).join('\n'));
else console.log(JSON.stringify({url,image:h.match(/class="fullImageLink"[^>]*>\s*<a href="([^"]+)"/)?.[1],summary:h.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').match(/Summary[\s\S]{0,2400}/)?.[0]}));
