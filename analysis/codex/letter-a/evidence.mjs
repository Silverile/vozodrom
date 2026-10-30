import fs from 'node:fs';
const urls=process.argv.slice(2);
fs.mkdirSync('analysis/codex/letter-a/evidence',{recursive:true});
for(const url of urls){
 const r=await fetch(url); const s=await r.text();
 fs.writeFileSync('analysis/codex/letter-a/evidence/'+(new URL(url).hostname+new URL(url).pathname).replace(/[^a-zA-Z0-9._-]/g,'_')+'.html',s);
 console.log(JSON.stringify({url,status:r.status,text:s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').slice(0,16000)}));
}
