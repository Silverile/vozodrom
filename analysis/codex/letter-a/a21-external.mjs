import fs from 'node:fs';
const root='analysis/codex/letter-a';
for(const name of ['banner','part1','part1_2-1','part1_3-1','part1_3-2']){
 const url=`https://www.arcfox.com.cn/V9/images/pc/${name}.jpg`,r=await fetch(url);
 console.log(name,r.status);if(r.ok)fs.writeFileSync(`${root}/raw/a21-v9-${name}.jpg`,Buffer.from(await r.arrayBuffer()));
}
