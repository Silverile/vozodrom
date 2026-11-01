import assert from 'node:assert/strict';
import {evidenceProblem,rejectEngine} from './engine-throughput-policy.mjs';
const source='https://www.ultimatespecs.com/car-specs/BMW/127916/BMW-iX-xDrive40.html';
const g={name:'iX',code:null,from:2021,to:null};
const e={variant:'xDrive40',fuel:'electric',powerKwMin:240,powerKwMax:240,availablePowerKw:[240],sources:[source],sourceScope:{originalVariant:'BMW iX xDrive40',generationEvidence:{method:'specification-page',anchor:'iX 1st Gen. (i20)',fromYear:2021,toYear:null,generationIndex:0,rowFromYear:2021,rowToYear:2025},specificationPage:{url:source,title:'BMW iX xDrive40 Specs',modelAliases:['IX'],generation:'iX 1st Gen. (i20)',generationFieldPresent:true,generationProductionFrom:2021,generationProductionTo:null,powerLabel:'TOTAL ELECTRIC POWER',powerText:'326 PS / 322 HP / 240 kW',fuelText:'Electric'}}};
assert.equal(evidenceProblem(g,0,e),null);
for(const [field,value]of [['powerText','326 PS'],['powerText','190 kW + 200 kW'],['title','BMW iX3 xDrive40 Specs'],['fuelText','Hybrid Electric'],['url','https://example.com/spec.html']]){const changed=structuredClone(e);changed.sourceScope.specificationPage[field]=value;assert(evidenceProblem(g,0,changed),`Accepted invalid ${field}`);}
assert(evidenceProblem({...g,to:2020},0,e));
assert(rejectEngine('opel','adam',{variant:'1.6 Ecotec 16V',sourceScope:{tableSection:'Motorsport / Rally'}}));
assert(rejectEngine('mercedes-benz','slc-c107',{variant:'350 SL'}));assert.equal(rejectEngine('mercedes-benz','slc-c107',{variant:'350 SLC'}),null);
console.log('PASS: specification source, kW and model identity proof; HP/component/hybrid/date rejection');
const f103Source='https://www.ultimatespecs.com/car-specs/Audi/18530/Audi-75-(F103)-L.html',f103={name:'F103',code:'F103',from:1965,to:1972};
const f103Engine={variant:'1.7 benzin',fuel:'petrol',powerKwMin:55,powerKwMax:55,sources:[f103Source],sourceScope:{generationEvidence:{method:'specification-page',anchor:'75 (F103)',fromYear:1968,toYear:1972,generationIndex:0,rowFromYear:1968,rowToYear:1972},specificationPage:{url:f103Source,title:'Audi 75 (F103) L Specs',modelAliases:['F103'],generation:'75 (F103)',generationFieldPresent:true,generationFieldText:'75',generationAttribution:'linked-generation-page',generationPageTitle:'75 (F103)',generationPageUrl:'https://www.ultimatespecs.com/car-specs/Audi/M7511/75-(F103)',linkedFromGenerationEngineTable:true,generationProductionFrom:1968,generationProductionTo:1972,powerLabel:'HORSEPOWER',powerText:'75 PS / 55 kW',fuelText:'Petrol'}}};
assert.equal(evidenceProblem(f103,0,f103Engine),null);
for(const[field,value]of [['generationFieldText','80 (B4)'],['linkedFromGenerationEngineTable',false],['title','Audi 75 (B4) L Specs']]){const changed=structuredClone(f103Engine);changed.sourceScope.specificationPage[field]=value;assert(evidenceProblem(f103,0,changed));}
console.log('PASS: abbreviated generation-field proof is tied to the parent table and chassis code');
