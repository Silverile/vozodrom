import fs from 'node:fs';
const base='https://www.fueleconomy.gov/ws/rest/vehicle/';
const evidence={source:base,years:{},vehicles:[],errors:[]};
async function get(s){const r=await fetch(base+s,{headers:{Accept:'application/json','User-Agent':'VozodromCatalogResearch/1.0'}});if(!r.ok)throw Error(r.status);return r.json();}
for(let y=1984;y<=2001;y++){try{const j=await get('menu/model?year='+y+'&make=Plymouth');evidence.years[y]=[].concat(j.menuItem||[]).map(x=>x.value);}catch(e){evidence.errors.push({year:y,error:String(e)});}}
const groups={};
for(const[y,models]of Object.entries(evidence.years))for(const model of models){if(/Truck|Van|Scamp Pickup|Arrow Pickup|Trail ?Duster/i.test(model))continue;const family=model.replace(/ Wagon$/,'').replace(/ 2WD| 4WD| AWD/g,'').replace(/^Grand Voyager$/,'Voyager').replace(/^Voyager\/Grand Voyager$/,'Voyager');(groups[family]??=[]).push({year:+y,model});}
for(const[family,rows]of Object.entries(groups)){const selected=[rows[0],rows[Math.floor(rows.length/2)],rows.at(-1)].filter((r,i,a)=>a.findIndex(x=>x.year===r.year&&x.model===r.model)===i);for(const row of selected){try{const q='menu/options?year='+row.year+'&make=Plymouth&model='+encodeURIComponent(row.model);const j=await get(q);const ids=[].concat(j.menuItem||[]).slice(0,3);for(const item of ids){const vehicle=await get(item.value);evidence.vehicles.push({family,request:row,source:base+item.value,data:vehicle});}}catch(e){evidence.errors.push({family,row,error:String(e)});}}console.log(family,selected.map(r=>r.year).join(','));fs.writeFileSync('analysis/codex/night-plymouth-epa-evidence.json',JSON.stringify(evidence,null,2)+'\n');}
console.log(JSON.stringify({families:Object.keys(groups),vehicles:evidence.vehicles.length,errors:evidence.errors}));
