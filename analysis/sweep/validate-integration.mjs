import fs from 'node:fs';
import assert from 'node:assert/strict';
import {applySelectorExclusions} from './selector-exclusions.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const issues=[],add=(file,key,claim)=>issues.push({file,key,claim});
const bodies=new Set(['hatchback','liftback','kombi','sedan','suv','mpv','kupe','kabriolet','pickup','dodavka']);
const fuels=new Set(['petrol','diesel','petrol-cng','petrol-lpg','petrol-mhev','petrol-hev','petrol-phev','diesel-mhev','electric','hydrogen']);
const transmissions=new Set(['manual','automated-manual','automatic','dual-clutch','single-speed','cvt','e-cvt']);
const makes=new Set(read('src/data/catalog/makes.json').map(m=>m.slug));
const keys=new Set();
const lineMap=new Map();
for(const name of ['model-lines-auto','model-line-additions','models-auto']){
 const file=`src/data/catalog/${name}.json`,rows=read(file),seen=new Set();
 assert.equal(applySelectorExclusions(name,rows).length,rows.length,`excluded identity resurfaced in ${name}`);
 for(const row of rows){const key=`${row.makeSlug}/${row.slug}`;
  if(seen.has(key))add(file,key,'duplicate identity');seen.add(key);
  if(!makes.has(row.makeSlug))add(file,key,'make reference missing');
  if(name!=='models-auto'){keys.add(key);lineMap.set(key,row);}
  const all=[row,...(row.generations??[])];
  for(const [i,g]of all.entries()){
   if(Array.isArray(g.bodyTypes))for(const b of g.bodyTypes)if(!bodies.has(b))add(file,key,`unknown body ${b}`);
   if(Number.isInteger(g.from)&&Number.isInteger(g.to)&&g.from>g.to)add(file,key,`reversed years at record ${i}: ${g.from}>${g.to}`);
   if(name!=='models-auto')for(const k of ['from','to','productionStatus'])if(!(k in g))add(file,key,`required key missing ${k} at record ${i}`);
  }
 }
}
const orphanCards=[],unknownValues={};
for(const dir of ['src/data/catalog/model-cards','src/data/model-cards'])for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.json'))){
 const file=dir+'/'+f;
 for(const c of read(file)){
  const key=c.makeSlug+'/'+c.lineSlug;
  if(!keys.has(key))orphanCards.push({file,key,isAddition:c.isAddition,sources:c.sources});
  for(const [i,g]of (c.generations??[]).entries()){
   for(const b of g.bodyTypes??[])if(!bodies.has(b))add(file,key,`unknown generation body ${b}`);
   if(Number.isInteger(g.from)&&Number.isInteger(g.to)&&g.from>g.to)add(file,key,`reversed generation years ${i}`);
   for(const e of g.engines??[])if(e.fuel!==null&&!fuels.has(e.fuel))add(file,key,`unknown engine fuel ${e.fuel}`);
   for(const t of g.transmissions??[])if(!transmissions.has(t.type))add(file,key,`unknown transmission ${t.type}`);
   for(const t of g.trims??[]){
    if(!['technical-version','engine-version'].includes(t.kind))add(file,key,`unknown trim kind ${t.kind}`);
    if(t.engine?.fuel!=null&&!fuels.has(t.engine.fuel))add(file,key,`unknown trim fuel ${t.engine.fuel}`);
    if(t.transmission?.type!=null&&!transmissions.has(t.transmission.type))add(file,key,`unknown trim transmission ${t.transmission.type}`);
   }
  }
 }
}
const newMakes=new Set(['renault','seat','saab','rolls-royce','rover','smart','ssangyong-kgm','simca','saturn','roewe','scion','rivian','spyker','rimac','salmson','saic-motor','santana-motor','seres','sono-motors']);
const newOrphans=orphanCards.filter(c=>newMakes.has(c.key.split('/')[0]));
const report={issues,orphanCards,newOrphans,counts:{issues:issues.length,orphanCards:orphanCards.length,newOrphans:newOrphans.length,lines:keys.size}};
fs.writeFileSync('analysis/sweep/integration-validation.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({counts:report.counts,issues,newOrphans},null,2));
if(issues.length)process.exitCode=1;
