import fs from 'node:fs';
const dir='analysis/codex/photo-backfill-46';
const rows=[['c4',1,'Citroen C4 II.JPG'],['c5',0,'Citroën C5 2.0 HDi (2002) (54731465672).jpg'],['c5',0,'Citroën C5 2.0i 16V (2007) (54831761752).jpg'],['c5',1,'Citroën C5 Tourer 2.0 HDi (2012) (54850528590).jpg'],['c5',1,'Citroën C5 Tourer 3.0 HDi (2008) (54723707991).jpg'],['berlingo',1,'Citroën Berlingo II front.JPG'],['berlingo',1,'Citroën Berlingo II in Belgium.JPG'],['berlingo',1,'Citroën Berlingo II Kastenwagen front.jpg'],['berlingo',1,'Citroën Berlingo II Multispace front.jpg'],['berlingo',1,'Citroen Berlingo II (2008) front.jpg'],['berlingo',1,'Citroen Berlingo II en Valencia.jpg'],['berlingo',1,'Citroen Berlingo II en Valencia 02.jpg']];
const p=new URLSearchParams({action:'query',format:'json',titles:rows.map(x=>'File:'+x[2]).join('|'),prop:'imageinfo',iiprop:'url|size|extmetadata',iiurlwidth:'600'});
const r=await fetch('https://commons.wikimedia.org/w/api.php?'+p);console.log(r.status);if(!r.ok)process.exit();
const data=await r.json();let all=[];
for(const row of rows){const x=Object.values(data.query?.pages||{}).find(x=>x.title==='File:'+row[2]);const ii=x?.imageinfo?.[0];if(!ii){console.log('missing',row[2]);continue;}const id=all.length;all.push({id,makeSlug:'citroen',lineSlug:row[0],generationIndex:row[1],title:x.title,ii});const im=await fetch(ii.thumburl);if(im.ok)fs.writeFileSync(`${dir}/candidate-${id}.jpg`,Buffer.from(await im.arrayBuffer()));}
fs.writeFileSync(dir+'/candidates.json',JSON.stringify(all,null,2));console.log(all.map(x=>[x.id,x.title,x.ii.width/x.ii.height]));
