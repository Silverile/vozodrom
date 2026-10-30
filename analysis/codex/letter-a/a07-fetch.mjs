import fs from 'node:fs';
import sharp from 'sharp';
const root='analysis/codex/letter-a';
for(const file of process.argv.slice(2)){
 const page='https://commons.wikimedia.org/wiki/File:'+file.replaceAll(' ','_');
 const h=await(await fetch(page)).text(), plain=h.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ');
 console.log(file,plain.match(/Summary \[ edit \].{0,1400}/)?.[0]);
 const image=h.match(/class="fullImageLink"[^>]*>\s*<a href="([^"]+)"/)?.[1]?.replaceAll('&amp;','&').split('?')[0];
 if(!image)continue;
 const lic=plain.split('Licensing [ edit ]')[1]?.split('File history')[0]||'';
 const credit=plain.match(/Author\s+(.{1,180}?)(?: Permission| Licensing| Camera location| Other versions|\bThis file)/)?.[1]?.trim()||'See source';
 const licences=[...new Set([...lic.matchAll(/https:\/\/creativecommons.org\/[^ ]+/g)].map(x=>x[0]))];
 let r={file,referencePage:page,image,credit,licences};
 const out=root+'/raw/a07-'+file.replaceAll(/[<>:"/\\|?*]/g,'_');fs.mkdirSync(root+'/raw',{recursive:true});
 const u=new URL(image),parts=u.pathname.split('/');parts.splice(3,0,'thumb');u.pathname=parts.join('/')+'/1280px-'+parts.at(-1);
 let resp=await fetch(image,{signal:AbortSignal.timeout(25000)});
 if(resp.status===429){const delay=Math.max(5,Number(resp.headers.get('retry-after')||5));console.log('429 wait',delay);await new Promise(t=>setTimeout(t,delay*1000));resp=await fetch(u,{signal:AbortSignal.timeout(25000)});}
 if(resp.ok){fs.writeFileSync(out,Buffer.from(await resp.arrayBuffer()));r.local=out;r.width=(await sharp(out).metadata()).width;console.log('saved',out,r.width);}else r.error='HTTP '+resp.status;
 const db=root+'/a07-sources.json',rows=fs.existsSync(db)?JSON.parse(fs.readFileSync(db)):[];rows.push(r);fs.writeFileSync(db,JSON.stringify(rows,null,2));
 await new Promise(t=>setTimeout(t,5100));
}

