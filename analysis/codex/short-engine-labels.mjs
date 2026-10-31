import {normalizeVariant,labelFromStoredFacts,powerValues,nonEuropeanMarket} from './engine-throughput-policy.mjs';

export function explicitlyForeignEngine(e){
 const s=e.sourceScope??{};
 // Escort Mexico is a European performance badge, not a market restriction.
 const marketText=v=>typeof v==='string'&&/^1[.,]6\s+Mexico$/i.test(v.trim())?'':v;
 const text=[marketText(e.variant),marketText(s.originalVariant),s.variantYears,s.rowNotes].filter(Boolean).join(' ');
 return nonEuropeanMarket(text)||/Latin America|Latin American|latinskoamerick|jihoamerick/i.test(text);
}
export function shortEngineLabel(e){
 let name=normalizeVariant(e.variant);if(!name)return name;
 name=name.replace(/\b\d{2}°\s*/g,'');
 const shortV6=name.match(/^(\d\.\d)\s+Bi-Turbo\s+(V\d)$/i);if(shortV6)name=`${shortV6[1]} ${shortV6[2]} Bi-Turbo`;
 if(name.length<=40)return name;
 let v=name.replace(/\([^)]*\)/g,'').replace(/\s+[–—]\s+.*$/u,'').trim();
 v=v.replace(/\btwin[- ]turbocharged\b/ig,'Bi-Turbo').replace(/\bturbocharged\b/ig,'Turbo');
 v=v.replace(/\b(?:AT|MT)\d\b|\b\d{2}v\b|\b\d{2}°|"[^"]*"/ig,'');
 v=v.replace(/\bL\b/g,'').replace(/\bI4 GME MultiAir\b/g,'').replace(/\s+/g,' ').trim();
 const giulia=v.match(/^(\d\.\d)\s+(Bi-Turbo)\s+(V\d)/i);if(giulia)v=`${giulia[1]} ${giulia[3]} ${giulia[2]}`;
 const repeated=v.match(/^([A-Z]{1,3}\s+\d{2,3}\s+(?:AMG|CDI))\b/);if(repeated&&v.length>40)v=repeated[1];
 if(!v||v.length>40)v=labelFromStoredFacts(e);
 if(v?.length>40)v=[e.displacementLitresNominal?`${e.displacementLitresNominal} l`:null,e.fuel==='electric'?'Elektromotor':e.fuel==='diesel'?'diesel':'benzin',powerValues(e).length?`${Math.min(...powerValues(e))} kW`:null].filter(Boolean).join(' ');
 return v;
}
export function compactEngineRows(rows){
 if(!Array.isArray(rows))return rows;
 const out=[];
 for(const original of rows){
  if(explicitlyForeignEngine(original))continue;
  const e=structuredClone(original),name=shortEngineLabel(e);if(!name)continue;
  if(name!==e.variant)e.noteCs=[...new Set([e.noteCs,e.variant].filter(Boolean))].join('\n');e.variant=name;
  let values=powerValues(e),fresh=[...values];
  for(const target of out.filter(r=>r.variant.toLowerCase()===name.toLowerCase())){
   const overlap=fresh.filter(k=>powerValues(target).includes(k));if(!overlap.length)continue;
   target.sources=[...new Set([...(target.sources??[]),...(e.sources??[])])];
   if(e.noteCs)target.noteCs=[...new Set([target.noteCs,e.noteCs].filter(Boolean))].join('\n');
   fresh=fresh.filter(k=>!overlap.includes(k));
  }
  if(values.length&&!fresh.length)continue;
  if(fresh.length<values.length){e.availablePowerKw=fresh;e.powerKwMin=Math.min(...fresh);e.powerKwMax=Math.max(...fresh);}
  out.push(e);
 }
 return out;
}
