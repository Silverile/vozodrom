import fs from 'node:fs';
const dir='analysis/codex/photo-root-42';fs.mkdirSync(dir,{recursive:true});
const queries=[['k70',0,'Volkswagen K70'],['karmann-ghia',0,'Volkswagen Karmann Ghia coupe'],['karmann-ghia-typ-34',0,'Volkswagen Type 34'],['kuebelwagen',0,'Volkswagen Type 82'],['schwimmwagen',0,'Volkswagen Schwimmwagen'],['typ-181',0,'Volkswagen Type 181'],['type-3',0,'Volkswagen Type 3'],['kaefer',0,'KdF Wagen 1938'],['kaefer',1,'Volkswagen 1100 1950'],['kaefer',2,'Volkswagen 1200 1965'],['kaefer',3,'Volkswagen 1302'],['kaefer',4,'Volkswagen 1303'],['kaefer',5,'Volkswagen 1600i Mexico']];
const all=[];
for(const [lineSlug,generationIndex,q]of queries){
 await new Promise(r=>setTimeout(r,1800));
 const u=new URL('https://commons.wikimedia.org/w/api.php');Object.entries({action:'query',format:'json',generator:'search',gsrsearch:q,gsrnamespace:6,gsrlimit:18,prop:'imageinfo',iiprop:'url|size|extmetadata',iiurlwidth:420}).forEach(([k,v])=>u.searchParams.set(k,v));
 try{const r=await fetch(u);if(!r.ok){console.log(q,r.status);continue;}const data=await r.json();
 for(const p of Object.values(data.query?.pages||{}).sort((a,b)=>a.index-b.index).filter(p=>{const i=p.imageinfo?.[0];return i&&i.width/i.height>=1.4&&i.width/i.height<=1.7&&!/interior|engine|rear|dashboard|logo|badge|steering/i.test(p.title);}).slice(0,3)){
 const ii=p.imageinfo[0],id=all.length,local=`${dir}/candidate-${id}.jpg`;const rr=await fetch(ii.thumburl);if(!rr.ok)continue;fs.writeFileSync(local,Buffer.from(await rr.arrayBuffer()));all.push({id,makeSlug:'volkswagen',lineSlug,generationIndex,q,title:p.title,ii,local});}
 fs.writeFileSync(dir+'/candidates.json',JSON.stringify(all,null,2)+'\n');console.log(q,all.length);
 }catch(e){console.log(q,String(e));}
}
