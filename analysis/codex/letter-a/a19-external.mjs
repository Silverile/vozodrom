import fs from 'node:fs';
import sharp from 'sharp';
const root='analysis/codex/letter-a',db=root+'/a19-sources.json',rows=JSON.parse(fs.readFileSync(db));
for(const [file,page,image] of [
['1972_AMC_Javelin_-_Flickr_-_dave_7.jpg','https://www.flickr.com/photos/daveseven/28163216915/','https://live.staticflickr.com/7347/28163216915_f5de6d3683_b.jpg'],
['1972_AMC_Matador_(4548228023).jpg','https://www.flickr.com/photos/daveseven/4548228023/','https://live.staticflickr.com/4048/4548228023_f18ddef220_b.jpg']
]){const res=await fetch(image,{headers:{'User-Agent':'ChatGPT-User'},signal:AbortSignal.timeout(30000)});if(!res.ok)throw Error(res.status+' '+image);const local=root+'/raw/a19-'+file;fs.writeFileSync(local,Buffer.from(await res.arrayBuffer()));rows.push({file,referencePage:'https://commons.wikimedia.org/wiki/File:'+file,originalPage:page,image,credit:'dave_7',licences:['https://creativecommons.org/licenses/by/2.0/'],local,width:(await sharp(local).metadata()).width});console.log(file,(await sharp(local).metadata()).width);}
fs.writeFileSync(db,JSON.stringify(rows,null,2));
