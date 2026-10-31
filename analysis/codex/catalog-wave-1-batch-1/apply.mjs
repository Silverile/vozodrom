import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {changes,wiki} from './research.mjs';
const root='analysis/codex/catalog-wave-1-batch-1';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=o=>crypto.createHash('sha256').update(JSON.stringify(o)).digest('hex');
const baseline=read(`${root}/baseline.json`),files=new Map(),report=[];
const lines=read('src/data/catalog/model-lines-auto.json');
const drawings=read('src/data/front-drawings.json');
const union=(a,b)=>[...new Set([...(a??[]),...(b??[])])];
for(const change of changes){
 const file=`src/data/catalog/model-cards/${change.make}.json`;
 if(!files.has(file))files.set(file,read(file));
 const cards=files.get(file),before=cards.find(c=>c.lineSlug===change.line);
 if(before)assert.equal(hash(before),baseline.sourceCards[`${file}#${change.make}/${change.line}`]);
 else assert(change.create,`Unexpected missing card ${change.line}`);
 const card=before??{makeSlug:change.make,lineSlug:change.line,name:change.name,isAddition:false,segment:change.segment,
  summaryCs:change.summaryCs,coverage:'researched-core-variants',generations:[],sources:[],needsReview:[]};
 const prior=structuredClone(card);
 for(const edit of change.generations){
  const index=change.create?card.generations.length:edit.index;
  const g=change.create?{code:edit.code,name:edit.name,from:edit.from,to:edit.to,
   productionStatus:edit.to==null?'current':'ended',dateBasis:'series-production',facelift:[],bodyTypes:edit.bodyTypes,
   engines:[],engineCoverage:'representative-documented-versions',drivetrains:null,transmissions:null,
   dimensionsMm:{length:null,width:null,height:null,wheelbase:null},trunkL:null,markets:[],photo:null,trims:null,sources:[],
   specificationScope:{market:'European-production',modelYear:null,variant:null,bodyType:null,noteCs:'Evropská výroba a vybrané doložené motorizace. Nejde o potvrzení současné české nabídky.'}}:card.generations[index];
  assert(g);
  const oldFacelifts=g.facelift??[],oldStage=g.drawingStage??0,stageYear=oldStage>0?oldFacelifts[oldStage-1]?.year:null;
  if(edit.from!==undefined)g.from=edit.from;
  if(edit.to!==undefined)g.to=edit.to;
  if(edit.bodyTypes)g.bodyTypes=edit.bodyTypes;
  if(edit.dateNote){g.dateBasis='series-production';g.specificationScope??={};g.specificationScope.noteCs=edit.dateNote;}
  if(edit.engines?.length){g.engines=[...(g.engines??[]),...edit.engines];g.engineCoverage='representative-documented-versions';}
  g.facelift=[...oldFacelifts,...(edit.facelifts??[]).filter(f=>!oldFacelifts.some(x=>x.year===f.year))].sort((a,b)=>a.year-b.year);
  if(stageYear!=null){assert(g.facelift.some(f=>f.year===stageYear));g.drawingStage=g.facelift.findIndex(f=>f.year===stageYear)+1;}
  g.sources=union(g.sources,[wiki[edit.source??change.source],...(edit.engines??[]).flatMap(e=>e.sources),...(edit.facelifts??[]).flatMap(f=>f.sources)]);
  g.fieldSources??={};
  for(const field of ['from','to','bodyTypes'])if(edit[field]!==undefined)g.fieldSources[field]=[wiki[edit.source??change.source]];
  if(change.create){g.fieldSources.name=[wiki[edit.source??change.source]];g.fieldSources.code=[wiki[edit.source??change.source]];card.generations.push(g);}
  // Remove only stale review flags for facts actually supplied by this batch.
  const filled=new Set(['engines','engineCoverage','sources','fieldSources',...(edit.bodyTypes?['bodyTypes']:[]),...(edit.facelifts?.length?['facelift']:[]),...(edit.from!==undefined?['from']:[]),...(edit.to!==undefined?['to']:[])]);
  card.needsReview=(card.needsReview??[]).filter(r=>![...filled].some(f=>r.field===`generations[${index}].${f}`));
 }
 card.sources=union(card.sources,card.generations.flatMap(g=>g.sources));
 for(const [i,g]of card.generations.entries()){
  if(!(g.engines?.length))continue;
  // Retain explicit unknowns instead of creating dimensions, transmissions or gearbox variants.
  if(change.create)for(const field of ['drivetrains','transmissions','dimensionsMm','trunkL','photo','trims'])card.needsReview.push({field:`generations[${i}].${field}`,reason:'V této rešerši nedoplněno; neznámé hodnoty nejsou odhadovány.'});
 }
 if(!before)cards.push(card);
 const source=lines.find(l=>l.makeSlug===change.make&&l.slug===change.line);assert(source);
 if(change.create||change.generations.some(g=>g.from!==undefined||g.to!==undefined)&&!change.create){
  // Keep existing public listing ids when only dates change.
  source.generations=card.generations.map((g,i)=>({...source.generations?.[i],code:g.code,from:g.from,to:g.to,bodyTypes:g.bodyTypes,sources:g.sources}));
  source.from=Math.min(...card.generations.map(g=>g.from).filter(Number.isFinite));
  source.to=card.generations.some(g=>g.productionStatus==='current')?null:Math.max(...card.generations.map(g=>g.to).filter(Number.isFinite));
  source.productionStatus=card.generations.some(g=>g.productionStatus==='current')?'current':'ended';
  source.bodyTypes=union([],card.generations.flatMap(g=>g.bodyTypes??[]));
  source.sources=union(source.sources,card.sources);
  source.dateScope='model-specific-generation-envelope';
  source.needsReview=(source.needsReview??[]).filter(r=>!['from','to','from,to','generations'].includes(r.field));
 }
 const key=`${change.make}--${change.line}`;
 for(const row of drawings[key]??[]){const g=card.generations[row[0]];assert(g);row[1]=g.from;row[2]=g.to;}
 report.push({make:change.make,line:change.line,created:!before,enginesAdded:card.generations.reduce((n,g)=>n+(g.engines?.length??0),0)-prior.generations.reduce((n,g)=>n+(g.engines?.length??0),0),
  faceliftsAdded:card.generations.reduce((n,g)=>n+(g.facelift?.length??0),0)-prior.generations.reduce((n,g)=>n+(g.facelift?.length??0),0),
  generationsBefore:prior.generations.map((g,i)=>({index:i,code:g.code,from:g.from,to:g.to})),generationsAfter:card.generations.map((g,i)=>({index:i,code:g.code,from:g.from,to:g.to})),
  indexMapping:prior.generations.map((g,i)=>({old:i,new:i})),listingIdChanges:[],drawingMoves:[],statsMoves:[],
  drawingStageChanges:card.generations.flatMap((g,i)=>(g.drawingStage??0)!==(prior.generations[i]?.drawingStage??0)?[{index:i,before:prior.generations[i]?.drawingStage??0,after:g.drawingStage}]:[]),
  remainingGaps:['Engine rows are selected documented variants, not an exhaustive market/year/body/gearbox matrix.','Technical versions, dimensions, transmissions and equipment were not fabricated; existing unknowns remain.'],
  sourceUrls:union([wiki[change.source]],change.generations.flatMap(g=>[wiki[g.source??change.source],...(g.engines??[]).flatMap(e=>e.sources),...(g.facelifts??[]).flatMap(f=>f.sources)]))});
}
for(const [file,cards]of files)fs.writeFileSync(file,JSON.stringify(cards,null,2)+'\n');
fs.writeFileSync('src/data/catalog/model-lines-auto.json',JSON.stringify(lines,null,2)+'\n');
let drawingText=fs.readFileSync('src/data/front-drawings.json','utf8');
for(const c of changes){const k=`${c.make}--${c.line}`;if(drawings[k])drawingText=drawingText.replace(new RegExp(`^"${k}":.*$`,'m'),`"${k}": ${JSON.stringify(drawings[k]).replaceAll(',',', ')},`);}
fs.writeFileSync('src/data/front-drawings.json',drawingText);
fs.writeFileSync(`${root}/report.json`,JSON.stringify({batch:1,wave:1,baselineRevision:baseline.baselineRevision,lines:report},null,2)+'\n');
console.log(JSON.stringify({lines:report.length,newCards:report.filter(x=>x.created).length,enginesAdded:report.reduce((n,r)=>n+r.enginesAdded,0),faceliftsAdded:report.reduce((n,r)=>n+r.faceliftsAdded,0)}));
