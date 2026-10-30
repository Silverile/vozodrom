import fs from 'node:fs';
import sharp from 'sharp';
const root='analysis/codex/letter-a',db=root+'/a15-sources.json';
const [mode,...args]=process.argv.slice(2);
if(mode==='sheet'){
 const rows=JSON.parse(fs.readFileSync(db)).filter(x=>x.local),items=[];
 for(let i=0;i<rows.length;i++){const buf=await sharp(rows[i].local).resize(500,330,{fit:'contain',background:'#ffffff'}).toBuffer();items.push({input:buf,left:(i%3)*500,top:Math.floor(i/3)*360});const label=Buffer.from(`<svg width="500" height="30"><text x="8" y="22" font-size="17">${i+1}: ${rows[i].file.replaceAll('&','&amp;').slice(0,48)}</text></svg>`);items.push({input:label,left:(i%3)*500,top:Math.floor(i/3)*360+330});}
 await sharp({create:{width:1500,height:Math.ceil(rows.length/3)*360,channels:3,background:'white'}}).composite(items).png().toFile(root+'/raw/a15-reference-sheet.png');process.exit(0);
}
for(const name of args){
 const url=name.startsWith('http')?name:'https://commons.wikimedia.org/wiki/'+name;
 const h=await(await fetch(url,{signal:AbortSignal.timeout(30000)})).text(),plain=h.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ');
 if(mode==='read'){console.log(url,plain.slice(0,14000));continue;}
 if(mode==='meta'){const start=plain.indexOf('Description ',plain.indexOf('Original file'));console.log(url,plain.slice(start,start+2600));continue;}
 if(mode==='wiki'){console.log(url,[...h.matchAll(/(?:resource|href)="([^" ]*File:[^" ]+)"/g)].map(x=>decodeURIComponent(x[1])).slice(0,45));continue;}
 if(mode==='links'){console.log(url,[...new Set([...h.matchAll(/href="(?:\/wiki\/)?((?:File|Category):[^"]+)"/g)].map(x=>decodeURIComponent(x[1])))].join('\n'));continue;}
 if(mode==='fetch'||mode==='fetchthumb'){
 let image=h.match(/class="fullImageLink"[^>]*>\s*<a href="([^"]+)"/)?.[1]?.replaceAll('&amp;','&').split('?')[0];
 if(!image){console.log('NO IMAGE',url);continue;}
 const credit=plain.match(/Author\s+(.{1,180}?)(?: Permission| Licensing| Camera location| Other versions|\bThis file)/)?.[1]?.trim()||'See source';
 const licences=[...new Set([...h.matchAll(/https?:\/\/creativecommons.org\/(?:licenses|publicdomain)\/[^"<> ]+/g)].map(x=>x[0]))];
 const local=root+'/raw/a15-'+decodeURIComponent(name.replace(/^File:/,'')).replaceAll(/[<>:"/\\|?*]/g,'_');
 if(mode==='fetchthumb'){const u=new URL(image),p=u.pathname.split('/');p.splice(3,0,'thumb');u.pathname=p.join('/')+'/1280px-'+p.at(-1);image=u.href;}
 let response=await fetch(image,{signal:AbortSignal.timeout(30000)});console.log('DOWNLOAD',response.status,image,'Retry-After',response.headers.get('retry-after'));
 if(response.status===429){await new Promise(t=>setTimeout(t,Math.max(5,Number(response.headers.get('retry-after')||5))*1000));const u=new URL(image),p=u.pathname.split('/');if(p.includes('thumb')){p.splice(p.indexOf('thumb'),1);p.pop();u.pathname=p.join('/');}else{p.splice(3,0,'thumb');u.pathname=p.join('/')+'/1280px-'+p.at(-1);}image=u.href;response=await fetch(u,{signal:AbortSignal.timeout(30000)});}
 const r={file:name.replace(/^File:/,''),referencePage:url,image,credit,licences};
 if(response.ok){fs.writeFileSync(local,Buffer.from(await response.arrayBuffer()));Object.assign(r,{local,width:(await sharp(local).metadata()).width});}else r.error='HTTP '+response.status;
 const rows=fs.existsSync(db)?JSON.parse(fs.readFileSync(db)):[];rows.push(r);fs.writeFileSync(db,JSON.stringify(rows,null,2));console.log(JSON.stringify(r),plain.match(/Summary \[ edit \].{0,650}/)?.[0]);
 await new Promise(t=>setTimeout(t,5100));
 }
}




