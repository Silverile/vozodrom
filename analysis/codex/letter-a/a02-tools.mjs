import fs from 'node:fs';
import sharp from 'sharp';
const [mode,...args]=process.argv.slice(2);
if(mode==='page') for(const url of args){const r=await fetch(url);const h=await r.text();console.log(JSON.stringify({url,status:r.status,image:h.match(/class="fullImageLink"[^>]*>\s*<a href="([^"]+)"/)?.[1],text:h.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').match(/Summary[\s\S]{0,3200}/)?.[0]}));}
if(mode==='download') {const [url,dest]=args;const r=await fetch(url);if(!r.ok)throw Error(`${r.status}; Retry-After ${r.headers.get('retry-after')}`);const b=Buffer.from(await r.arrayBuffer());fs.mkdirSync(dest.slice(0,dest.lastIndexOf('/')),{recursive:true});const m=await sharp(b).metadata();fs.writeFileSync(dest,m.format==='jpeg'?b:await sharp(b).jpeg({quality:100}).toBuffer());console.log(JSON.stringify({url,dest,width:m.width,height:m.height}));}
