import fs from 'node:fs';
import {trim} from './skoda-trim-facts.mjs';
const source='https://cdn.skoda-storyboard.com/2024/05/Octavia_technical_data_EN_842ba18d.pdf';
const basis='Pohotovostní hmotnost včetně řidiče 75 kg; publikované minimum rozsahu. Přesná výbava a kola nejsou určeny.';
const patches=[{lineSlug:'octavia',generationIndex:3,trimName:'1.5 TSI 110 kW – liftback',sources:[source],fields:{massKg:1353,massRangeKg:{min:1353,max:1511},massReference:'published-minimum',massBasis:basis},noteCs:'Hmotnost 1353 kg je minimum publikovaného rozsahu 1353–1511 kg pro liftback s manuální převodovkou po faceliftu 2024, nikoli hmotnost každé výbavy. Spotřeba WLTP nadále zůstává intervalem.'}];
const rows=[['1.5 TSI 85 kW – liftback 6MT (2024)','petrol',1498,85,220,'manual',6,1351,1504,203,10.4,'5,2–5,7'],['1.5 TSI mHEV 110 kW – liftback DSG7 (2024)','petrol-mhev',1498,110,250,'dual-clutch',7,1387,1542,229,8.5,'4,9–5,4'],['2.0 TDI 110 kW – liftback DSG7 (2024)','diesel',1968,110,360,'dual-clutch',7,1465,1623,228,8.5,'4,4–4,9']];
const additions=rows.map(([name,fuel,cc,kw,nm,type,gears,min,max,speed,acc,cons])=>{
 const t=trim(name,source,{bodyType:'hatchback',engine:{fuel,displacementCc:cc,cylinders:4,powerKw:kw,torqueNm:nm},transmission:{type,gears},drive:'fwd',dimensionsMm:{length:4698,width:1829,height:1470,wheelbase:2686},massKg:min,massRangeKg:{min,max},massReference:'published-minimum',massBasis:basis,topSpeedKmh:speed,acceleration0to100s:acc,consumptionCycle:'WLTP combined',specificationScope:{market:'Europe',modelYear:2024,noteCs:`Technický list po faceliftu 2024, liftback Essence/Selection/Sportline, nikoli Combi. Hmotnost je minimum rozsahu ${min}–${max} kg včetně řidiče 75 kg. Výbava a kola nejsou určeny; spotřeba ${cons} l/100 km WLTP zůstává intervalem, nikoli odhadem.`}});
 const map=(o,path='',out={})=>{for(const[k,v]of Object.entries(o)){const p=path?path+'.'+k:k;if(v!==null&&typeof v==='object'&&!Array.isArray(v))map(v,p,out);else if(v!==null&&!['name','kind','sources','specificationScope'].includes(k))out[p]=[source];}return out;};
 t.fieldSources=map({bodyType:t.bodyType,engine:t.engine,transmission:t.transmission,drive:t.drive,dimensionsMm:t.dimensionsMm,massKg:min,massRangeKg:t.massRangeKg,massReference:t.massReference,massBasis:basis,topSpeedKmh:speed,acceleration0to100s:acc,consumptionCycle:t.consumptionCycle});
 return {lineSlug:'octavia',generationIndex:3,trim:t};
});
fs.writeFileSync('analysis/codex/worker-step6-octavia-current.json',JSON.stringify({retrievedAt:'2026-10-26',patches,additions,needsReview:[]},null,2)+'\n');
