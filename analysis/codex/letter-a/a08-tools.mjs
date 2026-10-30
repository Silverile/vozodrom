import fs from 'node:fs';
import sharp from 'sharp';
const root='analysis/codex/letter-a';
const [mode,...args]=process.argv.slice(2);
if(mode==='files')for(const name of args){const h=await(await fetch('https://commons.wikimedia.org/wiki/'+name)).text();console.log(name,[...new Set([...h.matchAll(/href="\/wiki\/File:([^"]+)"/g)].map(x=>decodeURIComponent(x[1])))].join('\n'));}
if(mode==='fetch')for(const file of args){
 const referencePage='https://commons.wikimedia.org/wiki/File:'+file.replaceAll(' ','_');
 const h=await(await fetch(referencePage)).text(),plain=h.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ');
 const image=h.match(/class="fullImageLink"[^>]*>\s*<a href="([^"]+)"/)?.[1]?.replaceAll('&amp;','&').split('?')[0];
 if(!image){console.log('NO IMAGE',file);continue;}
 const r={file,referencePage,image,credit:plain.match(/Author\s+(.{1,180}?)(?: Permission| Licensing| Camera location| Other versions|\bThis file)/)?.[1]?.trim()||'See source'};
 console.log(file,plain.match(/Summary \[ edit \].{0,900}/)?.[0]);
 const local=root+'/raw/a08-'+file.replaceAll(/[<>:"/\\|?*]/g,'_');fs.mkdirSync(root+'/raw',{recursive:true});
 let resp=await fetch(image,{signal:AbortSignal.timeout(25000)});
 if(resp.status===429){await new Promise(t=>setTimeout(t,Math.max(5,Number(resp.headers.get('retry-after')||5))*1000));const u=new URL(image),p=u.pathname.split('/');p.splice(3,0,'thumb');u.pathname=p.join('/')+'/1280px-'+p.at(-1);resp=await fetch(u,{signal:AbortSignal.timeout(25000)});}
 if(resp.ok){fs.writeFileSync(local,Buffer.from(await resp.arrayBuffer()));Object.assign(r,{local,width:(await sharp(local).metadata()).width});}else r.error='HTTP '+resp.status;
 const db=root+'/a08-sources.json',rows=fs.existsSync(db)?JSON.parse(fs.readFileSync(db)):[];rows.push(r);fs.writeFileSync(db,JSON.stringify(rows,null,2));console.log(JSON.stringify(r));
 await new Promise(t=>setTimeout(t,5100));
}
if(mode==='inspect')for(const url of args){const h=await(await fetch(url)).text();console.log(url,h.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').slice(-26000),[...h.matchAll(/(?:src|href|content)="([^" ]+\.(?:jpg|png|jpeg)[^" ]*)"/gi)].map(x=>x[1]));}
