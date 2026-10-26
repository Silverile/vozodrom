import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const docs=[['favorit','https://skoda120.inetbox.sk/_temp/favorit_andrt_malina.pdf'],['felicia','https://docar.cz/navody-k-obsluze/Skoda/navod-k-obsluze-skoda-felicia.pdf']];
for(const [name,url]of docs){try{const p=path.join(os.tmpdir(),'vozodrom-step8-'+name+'.pdf'),txt=p+'.txt';const r=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('HTTP '+r.status);fs.writeFileSync(p,Buffer.from(await r.arrayBuffer()));execFileSync('C:/Program Files/Git/mingw64/bin/pdftotext.exe',['-layout',p,txt]);const s=fs.readFileSync(txt,'utf8'),pages=s.split('\f');console.log(name,'pages',pages.length);const matches=pages.map((s,i)=>({s,i})).filter(x=>name==='favorit'?/zrychlen|rychlen/i.test(x.s)&&/100/.test(x.s):/93\/116/.test(x.s));for(const x of matches.slice(0,8))console.log('PDF PAGE',x.i+1,x.s.slice(0,15000));}catch(e){console.log(name,e.message);}}
