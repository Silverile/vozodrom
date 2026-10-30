import fs from 'node:fs';import sharp from 'sharp';
const root='analysis/codex/letter-a',db=root+'/a-20-results.json',rows=JSON.parse(fs.readFileSync(db));
for(const [id,page,image,variant] of [
['arcfox--alpha-s--1','https://www.autohome.com.cn/cars/imgs-8053-72144-1-8211/11243949.html','https://car2.autoimg.cn/cardfs/product/g31/M0B/CA/A3/autohomecar__ChxoHmf7nmWAeiXqADDcCxJxaFE975.jpg','2025 Alpha S6 735MAX 160 kW, white showroom car; standard non-HI front'],
['arcfox--alpha-t--1','https://www.autohome.com.cn/cars/imgs-8056-72155-1-8211/11226119.html','https://car3.autoimg.cn/cardfs/product/g32/M03/AD/01/autohomecar__ChxkPmfzp7iAOCDBADpOMyxI8qI968.jpg','2025 Alpha T6 688MAX 160 kW, white showroom SUV'],
]){
const r=rows.find(x=>x.id===id),res=await fetch(image,{signal:AbortSignal.timeout(30000)});if(!res.ok)throw Error(res.status+' '+image);const b=Buffer.from(await res.arrayBuffer());fs.writeFileSync(r.folder+'/reference.jpg',b);
Object.assign(r,{referencePage:page,image,credit:'Autohome (汽车之家), showroom photography; see source gallery',licence:'Copyright Autohome; no open licence stated',licenceUrl:page,evidence:[page,`https://www.arcfox.com.cn/${id.includes('alpha-s')?'S6':'T6'}/index.html`],variant,referenceGate:'pending visual inspection',notes:'Official publicity render rejected; selected actual showroom photograph with exact 2025 trim caption. Source gallery and independent manufacturer model page verify identity.'});console.log(id,(await sharp(b).metadata()).width);
}
fs.writeFileSync(db,JSON.stringify(rows,null,2));
