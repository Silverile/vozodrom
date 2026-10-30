import fs from 'node:fs';import sharp from 'sharp';
const root='analysis/codex/letter-a';
for(const file of process.argv.slice(2)){
 const referencePage='https://commons.wikimedia.org/wiki/File:'+file.replaceAll(' ','_'),h=await(await fetch(referencePage)).text(),plain=h.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ');
 const original=h.match(/class="fullImageLink"[^>]*>\s*<a href="([^"]+)"/)?.[1]?.replaceAll('&amp;','&').split('?')[0];if(!original){console.log('NO IMAGE',file);continue;}
 const u=new URL(original),p=u.pathname.split('/');p.splice(3,0,'thumb');u.pathname=p.join('/')+'/1280px-'+p.at(-1);u.hostname='upload.wikimedia.org';
 const resp=await fetch(u,{signal:AbortSignal.timeout(20000)});console.log(file,resp.status,plain.match(/(?:This file is licensed under|made available under).{0,160}/)?.[0]);
 if(resp.ok){const local=root+'/raw/a11-'+file.replace(/[<>:"/\\|?*]/g,'_');fs.writeFileSync(local,Buffer.from(await resp.arrayBuffer()));const r={file,referencePage,image:u.href,credit:plain.match(/Author\s+(.{1,180}?)(?: Permission| Licensing| Camera location| Other versions|\bThis file)/)?.[1]?.trim()||'See source',local,width:(await sharp(local).metadata()).width};const db=root+'/a11-sources.json',a=JSON.parse(fs.readFileSync(db));a.push(r);fs.writeFileSync(db,JSON.stringify(a,null,2));}
 await new Promise(t=>setTimeout(t,5100));
}
