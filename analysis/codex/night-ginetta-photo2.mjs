import fs from 'node:fs';
const dir='analysis/codex/ginetta-photos';fs.mkdirSync(dir,{recursive:true});
const files=['Classic Car show 2005 (2600943077).jpg','Ginetta G15 - Flickr - exfordy.jpg','Ginetta G32 (7264968690).jpg'];
const headers={'User-Agent':'VozodromCatalogResearch/1.0 (vehicle catalogue factual research; Commons attribution audit)'};
const api=new URL('https://commons.wikimedia.org/w/api.php');api.search=new URLSearchParams({action:'query',format:'json',titles:files.map(x=>'File:'+x).join('|'),prop:'imageinfo',iiprop:'url|size|extmetadata',iiurlwidth:'960',maxlag:'5'});
const r=await fetch(api,{headers});console.log('api',r.status);let records=[];
if(r.ok){const data=await r.json();for(const p of Object.values(data.query?.pages||{})){if(p.imageinfo)records.push({file:p.title.slice(5),ii:p.imageinfo[0]});}}else if(r.status===429){fs.writeFileSync(dir+'/api-status.json',JSON.stringify({status:429,at:new Date().toISOString()}));}
fs.writeFileSync(dir+'/candidates2.json',JSON.stringify(records,null,2));
for(let i=0;i<records.length;i++){await new Promise(r=>setTimeout(r,1100));const z=await fetch(records[i].ii.thumburl,{headers});console.log(i,records[i].file,z.status);if(z.ok)fs.writeFileSync(dir+'/b'+i+'.jpg',Buffer.from(await z.arrayBuffer()));if(z.status===429)break;}
