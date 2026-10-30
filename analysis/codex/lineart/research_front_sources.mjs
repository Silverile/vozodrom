import fs from 'node:fs';
const sources=[
 ['carsized','https://www.carsized.com'],['netcarshow','https://www.netcarshow.com'],['ultimatespecs','https://www.ultimatespecs.com'],
 ['openverse-api','https://api.openverse.org'],['openverse-docs','https://docs.openverse.org'],
 ['skoda','https://www.skoda-storyboard.com'],['mazda','https://newsroom.mazda.com'],['hyundai','https://www.hyundai.news'],
 ['toyota','https://global.toyota'],['volkswagen','https://www.volkswagen-newsroom.com'],['byd','https://www.bydglobal.com'],
 ['geely','https://global.geely.com'],['favcars','https://www.favcars.com'],['wheelsage','https://www.wheelsage.org'],
 ['caricos','https://www.caricos.com'],['autowp','https://www.autowp.ru'],['media-toyota','https://media.toyota.co.uk'],
 ['chinamobil','https://www.chinamobil.ru'],['cars-data','https://www.cars-data.com'],['automobiledimension','https://www.automobiledimension.com'],
 ['toyota-pressroom','https://pressroom.toyota.com'],['geely-newsroom','https://newsroom.geely.com']
];
const output='analysis/codex/lineart/source-policy-probes.json';
const rows=fs.existsSync(output)?JSON.parse(fs.readFileSync(output)):[];
for(const [source,origin] of sources){
 if(rows.some(r=>r.source===source))continue;
 await new Promise(r=>setTimeout(r,1100));
 const row={source,origin,url:origin+'/robots.txt',checkedAt:new Date().toISOString()};
 try{
  const r=await fetch(row.url,{headers:{'User-Agent':'VozodromFrontResearch/1.0 (Codex; https://vozodrom.cz)'},redirect:'manual',signal:AbortSignal.timeout(18000)});
  row.status=r.status;row.headers=Object.fromEntries([...r.headers].filter(([k])=>/content-type|content-signal|location|tdm|retry-after/i.test(k)));
  row.body=(await r.text()).slice(0,60000);
 }catch(e){row.error=e.message;row.cause=e.cause?.code;}
 rows.push(row);fs.writeFileSync(output,JSON.stringify(rows,null,2)+'\n');
 console.log(JSON.stringify({...row,body:row.body?.slice(0,1400)}));
}
