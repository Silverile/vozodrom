import fs from 'node:fs';
import sharp from 'sharp';
const out='analysis/codex/letter-a/a-05-results.json',rows=JSON.parse(fs.readFileSync(out));
for(const r of rows){
 if(process.argv[2]&&r.id!==process.argv[2])continue;
 const h=await(await fetch(r.referencePage)).text(),plain=h.replace(/<[^>]*>/g,' ').replace(/\s+/g,' '),lic=plain.split('Licensing [ edit ]')[1]?.split('File history')[0]||'';
 r.image=h.match(/class="fullImageLink"[^>]*>\s*<a href="([^"]+)"/)?.[1]?.replaceAll('&amp;','&').split('?')[0];
 r.credit=plain.match(/Author\s+(.{1,180}?)(?: Permission| Licensing| Camera location| Other versions|\bThis file)/)?.[1]?.trim()||'See source page';
 r.licence=/CC0|CC-Zero/.test(lic)?'CC0 1.0':/Attribution-Share Alike 4.0/.test(lic)?'CC BY-SA 4.0':/Attribution-Share Alike 3.0/.test(lic)?'CC BY-SA 3.0':/Attribution-Share Alike 2.0/.test(lic)?'CC BY-SA 2.0':/Attribution 2.0/.test(lic)?'CC BY 2.0':/public domain/i.test(lic)?'Public domain':null;
 r.licenceUrl=r.licence==='CC0 1.0'?'https://creativecommons.org/publicdomain/zero/1.0/':r.licence?.startsWith('CC BY-SA')?'https://creativecommons.org/licenses/by-sa/'+r.licence.split(' ').at(-1)+'/':r.licence==='CC BY 2.0'?'https://creativecommons.org/licenses/by/2.0/':r.credit==='IFCAR'||r.credit==='Bull-Doser'?'https://commons.wikimedia.org/wiki/Template:PD-self':r.referencePage;
 console.log(r.id,r.credit,r.licence,plain.match(/Description\s+(.{1,270})/)?.[1]);
 fs.mkdirSync(r.folder,{recursive:true});
 if(r.image){
  const u=new URL(r.image),parts=u.pathname.split('/');parts.splice(3,0,'thumb');u.pathname=parts.join('/')+'/1280px-'+parts.at(-1);r.downloadUrl=u.href;
  try {let resp=await fetch(process.env.A05_THUMB?u:r.image,{signal:AbortSignal.timeout(25000)});if(resp.status===429){const sec=Math.max(5,Number(resp.headers.get('retry-after')||5));console.log('429 wait',sec);await new Promise(t=>setTimeout(t,sec*1000));resp=await fetch(u,{signal:AbortSignal.timeout(25000)});}if(!resp.ok)throw Error('HTTP '+resp.status);fs.writeFileSync(r.folder+'/reference.jpg',Buffer.from(await resp.arrayBuffer()));r.referenceWidth=(await sharp(r.folder+'/reference.jpg').metadata()).width;console.log('saved',r.referenceWidth);}catch(e){r.notes=String(e);console.log(r.notes);}
 }
 const current=JSON.parse(fs.readFileSync(out));Object.assign(current.find(x=>x.id===r.id),r);fs.writeFileSync(out,JSON.stringify(current,null,2));await new Promise(t=>setTimeout(t,5100));
}
