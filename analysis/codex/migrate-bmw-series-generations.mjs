import fs from 'node:fs';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {compactEngineRows} from './short-engine-labels.mjs';
import {evidenceProblem} from './engine-throughput-policy.mjs';
const root='analysis/codex/second-source-engines/bmw-series',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n'),hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
assert(!fs.existsSync(root+'/migration.json'),'Migration already applied');
const research=read(root+'/research.json'),path='src/data/catalog/model-cards/bmw.json',cards=read(path),lines=read('src/data/catalog/model-lines-auto.json'),draw=read('src/data/front-drawings.json'),holds=read('src/data/front-drawing-review.json'),stats=read('src/data/stats/bmw.json'),proofs=[];
const report={decision:research.decision,lines:[],generationsAdded:0,faceliftsAdded:0,faceliftStagesAfter:0,enginesAdded:0,statsStatus:'pending raw rebuild'};
const publicEngine=e=>Object.fromEntries(['fuel','displacementCc','displacementLitresNominal','powerKwMin','powerKwMax','availablePowerKw','powerRangeCoverage','variant','sources'].filter(k=>Object.hasOwn(e,k)).map(k=>[k,e[k]]));
for(const line of ['z4','rada-6','rada-6-gran-turismo','rada-2']){
 const c=cards.find(c=>c.lineSlug===line),before=structuredClone(c),old=c.generations[0],defs=research.generations.filter(d=>d.line===line);assert.equal(c.generations.length,1);
 c.generations=defs.map(d=>{
  const g=structuredClone(old);g.code=d.code;g.name=`${c.name} (${d.code})`;g.from=d.from;g.to=d.to;g.productionStatus=d.to===null?'current':'ended';g.drawingStage=0;g.bodyTypes=d.bodyTypes;g.photo=line==='z4'&&d.index===0?old.photo:null;g.trims=null;g.dimensionsMm={length:null,width:null,height:null,wheelbase:null};g.trunkL=null;g.drivetrains=null;g.transmissions=null;
  g.specificationScope={market:'Europe',modelYear:null,variant:null,bodyType:null,noteCs:'Sériová výroba; vybrané doložené motorizace, nikoli úplný český ceník.'};g.sources=[...new Set([...(old.sources??[]),...d.sources])];
  if(d.code==='E24')g.specificationScope.noteCs+=' Od roku 1976 dle BMW Classic; rok 1975 v některých přehledech zahrnuje předvýrobní období.';
  if(d.code==='G29')g.specificationScope.noteCs+=' Výroba od roku 2018; maloobchodní uvedení v roce 2019 není začátkem výroby. Modernizace od listopadu 2022 odpovídá modelovému roku 2023.';
  if(d.code==='G32')g.specificationScope.noteCs+=' G32 zůstává na samostatné linii Gran Turismo. Doložené motorizace jsou před modernizací 2020; mild-hybridní výkony nejsou dopočítávány.';
  g.facelift=d.facelifts.length?d.facelifts.map(year=>({year,to:d.to,name:'Facelift',sources:d.sources,photo:null})):null;report.faceliftStagesAfter+=d.facelifts.length;
  const oldEngines=d.index===0&&(old.engines??[]).length?(old.engines??[]):null;
  if(oldEngines)g.engines=structuredClone(oldEngines);
  else{
   g.engines=[];const seen=new Set();
   for(const e of compactEngineRows(d.engineCandidates)){
    if(evidenceProblem(g,d.index,e)!==null)continue;
    const key=`${e.fuel}|${e.displacementCc??e.displacementLitresNominal}|${e.powerKwMin}`;if(seen.has(key))continue;seen.add(key);
    const published=publicEngine(e);g.engines.push(published);proofs.push({make:'bmw',line,index:d.index,variant:published.variant,kw:published.powerKwMin,publicEngineHash:hash(published),sourceScope:e.sourceScope,annotation:e.noteCs??null});
   }
  }
  g.engineCoverage=g.engines.length?'representative-documented-versions':'unknown';return g;
 });
 c.sources=[...new Set([...(c.sources??[]),...c.generations.flatMap(g=>g.sources)])];c.summaryCs=`${c.name}: generace ${defs.map(d=>d.code).join(', ')} podle sériové výroby. Motorizace jsou vybraný doložený přehled.`;
 if(line==='rada-6')c.summaryCs+=' G32 má samostatnou kartu Řada 6 Gran Turismo.';
 c.needsReview=(c.needsReview??[]).filter(r=>!/^generations(?:\[|$)/.test(r.field));
 const l=lines.find(l=>l.makeSlug==='bmw'&&l.slug===line);assert(l);l.from=Math.min(...defs.map(d=>d.from));l.to=defs.some(d=>d.to===null)?null:Math.max(...defs.map(d=>d.to));l.productionStatus=l.to===null?'current':'ended';l.productionPeriods=defs.map(d=>({from:d.from,to:d.to}));l.generations=c.generations.map(g=>({code:g.code,from:g.from,to:g.to,productionStatus:g.productionStatus,bodyTypes:g.bodyTypes,sources:g.sources}));l.needsReview=(l.needsReview??[]).filter(r=>r.field!=='generations');
 const id='bmw--'+line,oldDraw=draw[id]??null;delete draw[id];for(const key of Object.keys(holds))if(key.startsWith(id+'--'))delete holds[key];if(stats[line])delete stats[line].gens;
 const added=c.generations.reduce((n,g)=>n+g.engines.length,0)-(old.engines??[]).length;report.enginesAdded+=added;report.generationsAdded+=defs.length-1;report.faceliftsAdded+=c.generations.reduce((n,g)=>n+(g.facelift??[]).length,0)-(old.facelift??[]).length;
 report.lines.push({id:'bmw/'+line,beforeHash:hash(before),afterHash:hash(c),oldToNew:{0:defs.map(d=>d.index)},before:[{index:0,code:old.code,from:old.from,to:old.to}],after:c.generations.map((g,index)=>({index,code:g.code,from:g.from,to:g.to,engines:g.engines.length,facelifts:(g.facelift??[]).map(f=>f.year)})),enginesAdded:added,drawing:{oldEntries:oldDraw,action:oldDraw?'Retired unattributed family entry; files unchanged on disk.':'No old drawing entry.'},listingId:{from:`${old.from}–${old.to??'?'}`,to:defs.map(d=>({code:d.code,from:d.from,to:d.to})),policy:'Use chassis/year fallback; no blanket rewrite.'}});
}
write(path,cards);write('src/data/catalog/model-lines-auto.json',lines);write('src/data/front-drawings.json',draw);write('src/data/front-drawing-review.json',holds);write('src/data/stats/bmw.json',stats);
write('analysis/codex/second-source-engines/evidence-bmw-series.json',{baselineRevision:research.baselineRevision,rows:proofs});write(root+'/migration.json',report);
cp.execFileSync('node',['scripts/model-cards-index.mjs'],{stdio:'inherit'});cp.execFileSync('node',['scripts/model-lines-index.mjs','--make=bmw'],{stdio:'inherit'});console.log(JSON.stringify({generationsAdded:report.generationsAdded,faceliftsAdded:report.faceliftsAdded,enginesAdded:report.enginesAdded,decision:report.decision}));
