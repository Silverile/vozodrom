import {spawnSync}from'node:child_process';
import path from'node:path';import {fileURLToPath}from'node:url';
import {ORIGIN,PacedClient,audit}from'./common.mjs';import{itemImages}from'./crawl.mjs';
const python=process.argv[2];if(!python)throw Error('Usage: node smoke.mjs <python executable> [existing cv2 dependency directory]');
const here=path.dirname(fileURLToPath(import.meta.url));const c=new PacedClient();await audit(c);
let count=0;
for(const item of ['/blueprints/alfa/alfa_romeo_145','/blueprints/bmw/3_series_e30','/blueprints/bmw/2002_turbo_1972']){
  const page=await c.get(ORIGIN+item);const image=itemImages(page.body,page.url)[0];if(!image)throw Error('Missing full image');
  const bytes=await c.get(image,{binary:true});
  const result=spawnSync(python,['-B',path.join(here,'smoke.py'),...(process.argv[3]?[path.resolve(process.argv[3])]:[])],{input:bytes.body,encoding:'utf8',maxBuffer:1024*1024,env:{...process.env,PYTHONDONTWRITEBYTECODE:'1'}});
  if(result.status!==0)throw Error(result.stderr||String(result.error));
  console.log(JSON.stringify({sample:++count,...JSON.parse(result.stdout)}));
}
console.log('In-memory samples:',count,'requests:',c.requests,'No images saved or displayed.');
