const urls=process.argv.slice(2);
for(const url of urls){
try{
 const r=await fetch(url,{headers:{'User-Agent':'vozodrom-research/0.1 (https://vozodrom.cz)'},signal:AbortSignal.timeout(15000)}),t=await r.text();
 const links=[...t.matchAll(/href=["']([^"']+)["']/g)].map(m=>m[1]).filter(x=>/term|licen|copyright|privacy/i.test(x)).slice(0,30);
 console.log(JSON.stringify({url,status:r.status,headers:Object.fromEntries([...r.headers].filter(([k])=>/robot|content-signal|tdm|server|content-type/i.test(k))),text:url.endsWith('robots.txt')?t.slice(0,24000):t.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(-14000),links}));
}catch(e){console.log(JSON.stringify({url,error:e.message}));}
await new Promise(r=>setTimeout(r,1100));
}
