import fs from 'node:fs';
import {markUnknowns} from './night-card-helpers.mjs';
const builder='analysis/codex/night-citroen-build.mjs';
let s=fs.readFileSync(builder,'utf8');
s=s.replaceAll("consumptionCycle:cons===null?null:'WLTP combined',consumptionKwh100:kwh","consumptionCycle:cons===null&&kwh===null?null:'WLTP combined',consumptionKwh100:kwh");
fs.writeFileSync(builder,s);
const path='src/data/catalog/model-cards/citroen.json',cards=JSON.parse(fs.readFileSync(path));let n=0;
for(const c of cards){for(const g of c.generations)for(const t of g.trims||[])if(t.consumptionKwh100!==null&&!t.consumptionCycle){t.consumptionCycle='WLTP combined';n++;}markUnknowns(c);}
fs.writeFileSync(path,JSON.stringify(cards,null,2)+'\n');
console.log(n+' EV consumption cycles explicitly indexed from the same WLTP technical sheets.');
