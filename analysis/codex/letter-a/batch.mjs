import fs from 'node:fs';
export const root='analysis/codex/letter-a';
export const cars=[
 ['ac-cars--428--0','428 Frua','428 / Frua','428 / Frua – rodina','?–1973'],
 ['ac-cars--10-hp--0','10 hp','10 hp / Ten','10 hp / Light Car – raná rodina','1913–?'],
 ['ac-cars--12-hp--0','12 hp','12 hp','12 hp – čtyřválcová rodina','1920–1927'],
 ['ac-cars--2-litre--0','2 Litre','2-Litre','2-Litre – poválečná rodina','1947–?'],
 ['ac-cars--3000me--0','3000ME','3000ME','3000ME – sériová rodina, Anglie/Skotsko','1979–1985'],
 ['ac-cars--ace--0','Ace','Ace (1953–1963)','Ace – původní roadster1953–1963','1953–1963'],
 ['ac-cars--aceca--0','Aceca','Aceca','Aceca – původní kupé','1954–1963'],
 ['ac-cars--auto-carrier--0','Auto Carrier','Auto-Carrier','Auto-Carrier – užitková rodina','1904–?'],
 ['ac-cars--brooklands-ace--0','Brooklands Ace','Brooklands Ace / Ace V8','Brooklands Ace – první série','1993–1996'],
 ['ac-cars--brooklands-ace--1','Ace V8','Brooklands Ace / Ace V8','AceV8 – modernizované pokračování','1997–2000'],
 ['ac-cars--cobra--0','Cobra MkI','Cobra','Cobra MkI','1962–1963'],
 ['ac-cars--cobra--1','Cobra MkII','Cobra','Cobra MkII','1963–1965']
].map(([id,short,model,generation,years])=>({id,short,model,generation,years,folder:`${root}/staged/ac-cars/${id} ${short}`}));
if(process.argv[2]==='download'){
 const c=cars.find(c=>c.id===process.argv[3]);const page=process.argv[4];
 fs.mkdirSync(c.folder,{recursive:true});
 const r=await fetch(page);if(!r.ok)throw Error(r.status);const html=await r.text();
 const url=process.argv[5] || html.match(/class="fullImageLink"[^>]*>\s*<a href="([^"]+)"/)[1].replaceAll('&amp;','&');
 const img=await fetch(url);if(!img.ok)throw Error(img.status);
 fs.writeFileSync(c.folder+'/reference.jpg',Buffer.from(await img.arrayBuffer()));
 fs.writeFileSync(c.folder+'/source-page.html',html);
 fs.writeFileSync(c.folder+'/download.json',JSON.stringify({page,url},null,2));
 console.log(JSON.stringify({id:c.id,url,metadata:html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').match(/Summary[\s\S]{0,2500}/)?.[0]}));
}
