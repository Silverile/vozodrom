/** One optional in-memory visual check. No image files, logs or manifests written. */
import {spawnSync}from'node:child_process';
import {Client}from'./crawl_shared.mjs';import{narod}from'./crawl_narod_adapters.mjs';import{source as find}from'./crawl_findblueprints.mjs';
const id=process.argv[2],show=process.argv.includes('--show');const source=id==='findblueprints'?find:narod(id);
const c=new Client(source,{maxMinutes:1});
const urls={carblueprints:'https://carblueprints.narod.ru/images/gaz/gaz-12-zim-1948.gif',bakkirill:'https://bakkirill.narod.ru/VAZ-2107.gif',findblueprints:'https://findblueprints.com/api/files/1107/download'};
try{
 const r=await c.get(urls[id]);
 const code="import sys,io,json,base64;from PIL import Image;im=Image.open(io.BytesIO(sys.stdin.buffer.read()));size=im.size;im.convert('RGB').thumbnail((1200,900));im=im.convert('RGB');im.thumbnail((1200,900));out=io.BytesIO();im.save(out,format='PNG');print(json.dumps({'size':size,'base64':base64.b64encode(out.getvalue()).decode()}))";
 const p=spawnSync('C:/Program Files/FreeCAD 1.0/bin/python.exe',['-B','-c',code],{input:r.data,encoding:'utf8',maxBuffer:8*1024*1024});if(p.status!==0)throw Error(p.stderr||String(p.error));const result=JSON.parse(p.stdout);
 console.log(JSON.stringify({source:id,status:200,size:result.size,bytes:r.size,...(show?{base64:result.base64}:{})}));
}catch(e){console.log(JSON.stringify({source:id,stopped:e.message}));process.exitCode=1;}
