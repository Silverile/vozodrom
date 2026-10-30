import fs from 'node:fs';
import sharp from 'sharp';
const root='analysis/codex/letter-a';
for(const n of [4,1,2,3]){
 const url=`https://www.bmwcoop.com/wp-content/images/2011/09/Alpina-D5-BiTurbo-${n}.jpg`,r=await fetch(url);
 if(!r.ok){console.log(url,r.status);continue;}
 const local=`${root}/raw/a16-D5-launch-${n}.jpg`;fs.writeFileSync(local,Buffer.from(await r.arrayBuffer()));console.log(local,await sharp(local).metadata());
}
const db=root+'/a16-sources.json',rows=JSON.parse(fs.readFileSync(db));
if(!rows.some(x=>x.file==='D5-launch-1.jpg'))rows.push({file:'D5-launch-1.jpg',referencePage:'https://www.bmwcoop.com/2011/09/14/alpina-d5-biturbo-officially-introduced/',image:'https://www.bmwcoop.com/wp-content/images/2011/09/Alpina-D5-BiTurbo-1.jpg',credit:'Photographer not stated; BMWCoop launch gallery',licences:[],local:root+'/raw/a16-D5-launch-1.jpg',width:1280});
fs.writeFileSync(db,JSON.stringify(rows,null,2));
