import fs from 'node:fs';
const root='analysis/codex/letter-a',db=root+'/a13-sources.json';
const sources=JSON.parse(fs.readFileSync(db));
if(!sources.some(x=>x.file==='HSG-1986-B10-E24.jpg'))sources.push({file:'HSG-1986-B10-E24.jpg',referencePage:'https://www.the-highwaystar.com/stock_car/entry-1003.html',image:'https://www.the-highwaystar.com/archives/001/201705/large-5929238600cce.jpg',credit:'HSG Highway Star GARAGE',licences:[],local:root+'/raw/a13-e24-candidate.jpg',width:1020});
fs.writeFileSync(db,JSON.stringify(sources,null,2));
let s=fs.readFileSync(root+'/a13-prepare.mjs','utf8').replace('BMW_Alpina_E-635_B10_3.5_Coupé_(24091413591).jpg','HSG-1986-B10-E24.jpg').replace("'E24 B10 3.5 coupe','https://www.alpina-archive.com/?page_id=40','CC0'","'1986 E24 B10 3.5 coupe, factory Alpina spoiler; closed bonnet','https://www.alpina-archive.com/?page_id=215','Copyright'");
fs.writeFileSync(root+'/a13-prepare.mjs',s);
