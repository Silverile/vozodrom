import fs from 'node:fs';import crypto from 'node:crypto';
const root='analysis/codex/popular-engines-pass',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),index=read('src/data/model-cards-index.json'),rows=[],held=[];
for(const r of read(root+'/selection.json')){
 const g=index[r.make][r.line].generations[r.index];
 for(const t of g.trims??[]){const f=t.engine;if(!f?.fuel||!t.sources?.length)continue;
  const notes=t.specificationScope?.noteCs??'',m=t.name.match(/\b([0-9][.,][0-9])\b/),nominal=f.displacementCc?Math.round(f.displacementCc/100)/10:m?Number(m[1].replace(',','.')):null;
  if(f.fuel!=='electric'&&!f.displacementCc&&!nominal&&f.powerKw==null){held.push({id:r.make+'/'+r.line,index:r.index,name:t.name,reason:'Neither capacity nor power documented'});continue;}
  let name=t.name.split(/\s+[–—]\s+/)[0].replace(/\b\d+(?:[.,]\d+)?\s*(?:bhp|hp|PS)\b/ig,'').replace(/\b(?:MT|AT|[5-9]MT|[5-9]AT|FWD|AWD|RWD|4WD|9G-TRONIC)\b/ig,'').replace(/\s+/g,' ').trim();
  if(name.length>40)name=[nominal?nominal.toFixed(1):null,{'petrol':'benzin','diesel':'diesel','petrol-hev':'HEV','petrol-phev':'PHEV','petrol-mhev':'mHEV','electric':'elektromotor'}[f.fuel]].filter(Boolean).join(' ');
  if(r.make==='mg'&&r.line==='zs'&&r.index===1&&/^Hybrid\+ /.test(name))name='Hybrid+';
  let power=f.powerKw??null;const componentOnly=/spalovac[ií] motor|spalovac[ií]ho motoru|combustion engine|ICE.only|pouze.*spalovac/i.test(notes+' '+(f.powerStandard??''));
  if(/hev/.test(f.fuel)&&componentOnly)power=null;
  const e={variant:name,fuel:f.fuel,displacementCc:f.fuel==='electric'?null:f.displacementCc??null,displacementLitresNominal:f.fuel==='electric'?null:nominal,powerKwMin:power,powerKwMax:power,availablePowerKw:power===null?[]:[power],powerRangeCoverage:'documented-versions-only',sources:[t.sources[0]],sourceScope:{tableSection:'Existing reviewed technical version in the same catalogue generation',originalVariant:t.name,powerBasis:componentOnly?'Only combustion-engine power documented in the original technical version; vehicle system output left unknown.':'Unchanged power field from reviewed technical version; no conversion or component addition.',componentPowerKw:componentOnly?f.powerKw:null,technicalVersionProof:{name:t.name,source:t.sources[0],engine:f,sha256:crypto.createHash('sha256').update(JSON.stringify(t)).digest('hex')},generationEvidence:{method:'reviewed-technical-version',anchor:g.code??g.name,fromYear:g.from,toYear:g.to,generationIndex:r.index,rowFromYear:null,rowToYear:null},noteCs:notes}};
  rows.push({id:r.make+'/'+r.line,index:r.index,engine:e});
 }
}
fs.writeFileSync(root+'/trim-candidates.json',JSON.stringify({rows,held},null,2)+'\n');console.log(JSON.stringify({rows:rows.length,generations:new Set(rows.map(r=>r.id+'/'+r.index)).size,held:held.length}));
