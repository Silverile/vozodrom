import fs from 'node:fs';
import sharp from 'sharp';
const out='analysis/codex/letter-a/a-04-results.json',rows=JSON.parse(fs.readFileSync(out,'utf8'));
for(const id of (process.argv.slice(2).length?process.argv.slice(2):['acura--nsx--0','acura--nsx--1','acura--rl--1','acura--rlx--0','acura--rsx--0'])) {
 if(id==='acura--nsx--1'&&process.env.A04_NSX_FILE){const r=rows.find(x=>x.id===id);r.file=process.env.A04_NSX_FILE;r.referencePage='https://commons.wikimedia.org/wiki/File:'+r.file.replaceAll(' ','_');r.evidence[0]=r.referencePage;}
 const r=rows.find(x=>x.id===id),h=await(await fetch(r.referencePage,{signal:AbortSignal.timeout(20000)})).text();
 r.image=h.match(/class="fullImageLink"[^>]*>\s*<a href="([^"]+)"/)?.[1]?.replaceAll('&amp;','&').split('?')[0];
 const plain=h.replace(/<[^>]*>/g,' ').replace(/\s+/g,' '),lic=plain.split('Licensing [ edit ]')[1]?.split('File history')[0]||'';
 r.credit=plain.match(/Author\s+(.{1,180}?)(?: Permission| Licensing| Camera location| Other versions|\bThis file)/)?.[1]?.trim()||'See source page';
 r.licence=/CC0/.test(lic)?'CC0 1.0':/Attribution-Share Alike 4.0/.test(lic)?'CC BY-SA 4.0':/Attribution-Share Alike 3.0/.test(lic)?'CC BY-SA 3.0':/Attribution-Share Alike 2.0/.test(lic)?'CC BY-SA 2.0':/Attribution 2.0/.test(lic)?'CC BY 2.0':/public domain/i.test(lic)?'Public domain':null;
 r.licenceUrl=r.licence==='CC0 1.0'?'https://creativecommons.org/publicdomain/zero/1.0/':r.licence==='CC BY-SA 4.0'?'https://creativecommons.org/licenses/by-sa/4.0/':r.licence==='CC BY-SA 3.0'?'https://creativecommons.org/licenses/by-sa/3.0/':r.licence==='CC BY-SA 2.0'?'https://creativecommons.org/licenses/by-sa/2.0/':r.credit==='IFCAR'?'https://commons.wikimedia.org/wiki/Template:PD-self':'https://commons.wikimedia.org/wiki/Template:PD-USGov';
 if(r.licence==='CC BY 2.0')r.licenceUrl='https://creativecommons.org/licenses/by/2.0/';
 if(process.env.A04_META){fs.writeFileSync(out,JSON.stringify(rows,null,2));console.log(id,r.licence,r.credit);continue;}
 fs.mkdirSync(r.folder,{recursive:true});
 const u=new URL(r.image),parts=u.pathname.split('/');parts.splice(3,0,'thumb');u.pathname=parts.join('/')+'/1280px-'+parts.at(-1);r.downloadUrl=u.href;
 try{const resp=await fetch(u,{signal:AbortSignal.timeout(20000)});console.log(id,'thumbnail HTTP',resp.status,'retry-after',resp.headers.get('retry-after'));if(!resp.ok)throw Error('HTTP '+resp.status);fs.writeFileSync(r.folder+'/reference.jpg',Buffer.from(await resp.arrayBuffer()));r.referenceWidth=(await sharp(r.folder+'/reference.jpg').metadata()).width;console.log(id,r.referenceWidth,r.licence,r.credit);}catch(e){r.notes=String(e);console.log(id,r.notes);}
 fs.writeFileSync(out,JSON.stringify(rows,null,2));await new Promise(t=>setTimeout(t,5100));
}
