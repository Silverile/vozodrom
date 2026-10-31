import assert from 'node:assert/strict';
import {evidenceProblem,rejectEngine} from './engine-throughput-policy.mjs';
const source='https://www.ultimatespecs.com/car-specs/BMW/127916/BMW-iX-xDrive40.html';
const g={name:'iX',code:null,from:2021,to:null};
const e={variant:'xDrive40',fuel:'electric',powerKwMin:240,powerKwMax:240,availablePowerKw:[240],sources:[source],sourceScope:{originalVariant:'BMW iX xDrive40',generationEvidence:{method:'specification-page',anchor:'iX 1st Gen. (i20)',fromYear:2021,toYear:null,generationIndex:0,rowFromYear:2021,rowToYear:2025},specificationPage:{url:source,title:'BMW iX xDrive40 Specs',modelAliases:['IX'],generation:'iX 1st Gen. (i20)',generationFieldPresent:true,generationProductionFrom:2021,generationProductionTo:null,powerLabel:'TOTAL ELECTRIC POWER',powerText:'326 PS / 322 HP / 240 kW',fuelText:'Electric'}}};
assert.equal(evidenceProblem(g,0,e),null);
for(const [field,value]of [['powerText','326 PS'],['powerText','190 kW + 200 kW'],['title','BMW iX3 xDrive40 Specs'],['fuelText','Hybrid Electric'],['url','https://example.com/spec.html']]){const changed=structuredClone(e);changed.sourceScope.specificationPage[field]=value;assert(evidenceProblem(g,0,changed),`Accepted invalid ${field}`);}
assert(evidenceProblem({...g,to:2020},0,e));
assert(rejectEngine('opel','adam',{variant:'1.6 Ecotec 16V',sourceScope:{tableSection:'Motorsport / Rally'}}));
console.log('PASS: specification source, kW and model identity proof; HP/component/hybrid/date rejection');
