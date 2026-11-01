import assert from 'node:assert/strict';
import {evidenceProblem,rejectEngine,normalizeImportedVariant} from './engine-throughput-policy.mjs';
const source='https://www.ultimatespecs.com/car-specs/BMW/127916/BMW-iX-xDrive40.html';
const g={name:'iX',code:null,from:2021,to:null};
const e={variant:'xDrive40',fuel:'electric',powerKwMin:240,powerKwMax:240,availablePowerKw:[240],sources:[source],sourceScope:{originalVariant:'BMW iX xDrive40',generationEvidence:{method:'specification-page',anchor:'iX 1st Gen. (i20)',fromYear:2021,toYear:null,generationIndex:0,rowFromYear:2021,rowToYear:2025},specificationPage:{url:source,title:'BMW iX xDrive40 Specs',modelAliases:['IX'],generation:'iX 1st Gen. (i20)',generationFieldPresent:true,generationProductionFrom:2021,generationProductionTo:null,powerLabel:'TOTAL ELECTRIC POWER',powerText:'326 PS / 322 HP / 240 kW',fuelText:'Electric'}}};
assert.equal(evidenceProblem(g,0,e),null);
const bodyEngine=structuredClone(e);bodyEngine.sourceScope.specificationPage.bodyText='SUV / TT';
assert(evidenceProblem({...g,bodyTypes:['kabriolet']},0,bodyEngine));assert(evidenceProblem({...g,bodyTypes:['kupe']},0,bodyEngine));
bodyEngine.sourceScope.specificationPage.bodyText='Coupé';assert.equal(evidenceProblem({...g,bodyTypes:['kupe']},0,bodyEngine),null);
bodyEngine.sourceScope.specificationPage.bodyText='-';assert.equal(evidenceProblem({...g,bodyTypes:['kupe']},0,bodyEngine),null);
for(const [field,value]of [['powerText','326 PS'],['powerText','190 kW + 200 kW'],['title','BMW iX3 xDrive40 Specs'],['fuelText','Hybrid Electric'],['url','https://example.com/spec.html']]){const changed=structuredClone(e);changed.sourceScope.specificationPage[field]=value;assert(evidenceProblem(g,0,changed),`Accepted invalid ${field}`);}
assert(evidenceProblem({...g,to:2020},0,e));
assert(rejectEngine('opel','adam',{variant:'1.6 Ecotec 16V',sourceScope:{tableSection:'Motorsport / Rally'}}));
assert(rejectEngine('mercedes-benz','slc-c107',{variant:'350 SL'}));assert.equal(rejectEngine('mercedes-benz','slc-c107',{variant:'350 SLC'}),null);
const sx4={variant:'2.0 DDiS',sources:['https://en.wikipedia.org/wiki/Suzuki_SX4'],sourceScope:{tableSection:'First generation / Engines'}};
assert(rejectEngine('maruti-suzuki','sx4',sx4));
assert.equal(rejectEngine('suzuki','sx4',sx4),null);
sx4.sourceScope.tableSection='First generation / Maruti Suzuki version';assert.equal(rejectEngine('maruti-suzuki','sx4',sx4),null);
console.log('PASS: specification source, kW and model identity proof; HP/component/hybrid/date rejection');
const f103Source='https://www.ultimatespecs.com/car-specs/Audi/18530/Audi-75-(F103)-L.html',f103={name:'F103',code:'F103',from:1965,to:1972};
const f103Engine={variant:'1.7 benzin',fuel:'petrol',powerKwMin:55,powerKwMax:55,sources:[f103Source],sourceScope:{generationEvidence:{method:'specification-page',anchor:'75 (F103)',fromYear:1968,toYear:1972,generationIndex:0,rowFromYear:1968,rowToYear:1972},specificationPage:{url:f103Source,title:'Audi 75 (F103) L Specs',modelAliases:['F103'],generation:'75 (F103)',generationFieldPresent:true,generationFieldText:'75',generationAttribution:'linked-generation-page',generationPageTitle:'75 (F103)',generationPageUrl:'https://www.ultimatespecs.com/car-specs/Audi/M7511/75-(F103)',linkedFromGenerationEngineTable:true,generationProductionFrom:1968,generationProductionTo:1972,powerLabel:'HORSEPOWER',powerText:'75 PS / 55 kW',fuelText:'Petrol'}}};
assert.equal(evidenceProblem(f103,0,f103Engine),null);
for(const[field,value]of [['generationFieldText','80 (B4)'],['linkedFromGenerationEngineTable',false],['title','Audi 75 (B4) L Specs']]){const changed=structuredClone(f103Engine);changed.sourceScope.specificationPage[field]=value;assert(evidenceProblem(f103,0,changed));}
console.log('PASS: abbreviated generation-field proof is tied to the parent table and chassis code');

assert.equal(normalizeImportedVariant("mg","zr",{variant:"1.8 120 Steptronic"}),"1.8 120");
assert.equal(normalizeImportedVariant("mercedes-benz","w114-w115",{variant:"230.6 Long"}),"230");
assert.equal(normalizeImportedVariant("mercedes-benz","w114-w115",{variant:"280 CE"}),"280 E");
assert.equal(normalizeImportedVariant("bmw","x3",{variant:"M102.922"}),"M102.922");
assert.equal(normalizeImportedVariant("mercedes-benz","w114-w115",{variant:"250 CE"}),"250 CE");
