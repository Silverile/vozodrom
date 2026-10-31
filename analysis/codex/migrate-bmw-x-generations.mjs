import fs from 'node:fs';
import cp from 'node:child_process';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {compactEngineRows} from './short-engine-labels.mjs';
import {evidenceProblem} from './engine-throughput-policy.mjs';
const root='analysis/codex/second-source-engines/bmw-x',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n'),hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
assert(!fs.existsSync(root+'/migration.json'),'BMW migration already applied');
const research=read(root+'/research.json'),path='src/data/catalog/model-cards/bmw.json',cards=read(path),lines=read('src/data/catalog/model-lines-auto.json'),drawings=read('src/data/front-drawings.json'),holds=read('src/data/front-drawing-review.json'),stats=read('src/data/stats/bmw.json');
const report={lines:[],newGenerations:7,faceliftsAdded:6,enginesAdded:0,statsStatus:'pending raw rebuild',expectedSourceCardHashes:{}};
for(const line of ['x5','x3']){
 const card=cards.find(c=>c.lineSlug===line),before=structuredClone(card),old=card.generations[0],defs=research.generations.filter(g=>g.line===line);assert.equal(card.generations.length,1);
 card.generations=defs.map(d=>{
  const g=structuredClone(old);g.code=d.code;g.name=`${line.toUpperCase()} (${d.code})`;g.from=d.from;g.to=d.to;g.productionStatus=d.to===null?'current':'ended';g.drawingStage=0;g.photo=null;g.trims=null;
  g.sources=[...new Set([...(old.sources??[]),...d.sources])];g.engineCoverage='unknown';g.engines=[];g.facelift=null;
  g.dimensionsMm={length:null,width:null,height:null,wheelbase:null};g.trunkL=null;g.drivetrains=null;g.transmissions=null;
  g.specificationScope={market:'Europe',modelYear:null,variant:null,bodyType:'suv',noteCs:'Generace vymezena podle sériové výroby. Motorizace jsou vybraný doložený přehled, nikoli úplný český ceník.'};
  g.marketNotesCs='Historický výrobní interval nepotvrzuje současnou českou dostupnost.';
  if(d.code==='G01'){g.sources.push('https://www.press.bmwgroup.com/south-africa/article/attachment/T0445392EN/622721');g.specificationScope.noteCs+=' Evropské vymezení končí rokem 2024; čínská prodloužená varianta G08 pokračovala déle.';}
  if(d.code==='G65'){g.sources.push(research.newX5Source,research.g65ProductionSource);g.specificationScope.noteCs+=' Sériová výroba G65 od srpna 2026; modelový rok 2027 není použit jako rok zahájení výroby. iX5 je odlišné označení pohonu a jeho výkon se nepřipisuje spalovacím verzím X5.';}
  if(d.facelift)g.facelift=[{year:d.facelift,to:d.to,name:'Facelift',sources:d.sources,photo:null}];
  const candidates=d.index===0?(old.engines??[]):d.engineCandidates.filter(e=>!/^M$|^iX5\b/i.test(e.variant));
  const seen=new Set();for(const e of compactEngineRows(candidates)){
   assert.equal(evidenceProblem(g,d.index,e),null,`${line}/${d.code}/${e.variant}`);
   const key=`${e.fuel}|${e.displacementCc??e.displacementLitresNominal}|${e.powerKwMin}`;if(seen.has(key))continue;seen.add(key);g.engines.push(e);
  }
  if(g.engines.length)g.engineCoverage='representative-documented-versions';
  return g;
 });
 // Existing photo filenames explicitly identify F15 and facelifted F25, not E53/E83.
 if(line==='x5')card.generations[2].photo=old.photo;
 else card.generations[1].facelift[0].photo=old.photo;
 card.summaryCs=`${line.toUpperCase()} je řada SUV BMW. Přehled rozlišuje generace ${defs.map(d=>d.code).join(', ')} a jejich modernizace; technické údaje se vztahují k doloženým verzím.`;
 card.sources=[...new Set([...(card.sources??[]),...card.generations.flatMap(g=>g.sources)])];
 card.needsReview=(card.needsReview??[]).filter(r=>!/^generations(?:\[|$)/.test(r.field));
 const l=lines.find(l=>l.makeSlug==='bmw'&&l.slug===line);assert(l);l.generations=card.generations.map(g=>({code:g.code,from:g.from,to:g.to,productionStatus:g.productionStatus,bodyTypes:g.bodyTypes,sources:g.sources}));l.needsReview=(l.needsReview??[]).filter(r=>r.field!=='generations');
 const id='bmw--'+line,oldDraw=drawings[id];delete drawings[id];for(const key of Object.keys(holds))if(key.startsWith(id+'--'))delete holds[key];
 // An unattributed legacy family mask must not become a first-generation drawing.
 // Retain its file on disk for later visual review, without a live generation entry.
 if(stats[line])delete stats[line].gens;
 const added=card.generations.reduce((n,g)=>n+g.engines.length,0)-(old.engines??[]).length;report.enginesAdded+=added;
 report.lines.push({id:'bmw/'+line,beforeHash:hash(before),afterHash:hash(card),oldToNew:{0:defs.map(d=>d.index)},before:[{index:0,code:old.code,from:old.from,to:old.to}],after:card.generations.map((g,index)=>({index,code:g.code,from:g.from,to:g.to,engines:g.engines.length,faceliftYears:(g.facelift??[]).map(f=>f.year)})),enginesAdded:added,photoMove:line==='x5'?{from:0,to:2,code:'F15'}:{from:0,to:1,code:'F25',stage:1},drawing:{oldEntries:oldDraw,action:'Unattributed family entry retired; white alpha mask retained on disk, no first-generation hold created.',file:`public/front/${id}--0.webp`},stats:'Old broad generation 0 dropped; rebuild all BMW raw cohorts.',listingId:{from:`${old.from}–?`,to:defs.map(d=>({code:d.code,from:d.from,to:d.to})),policy:'One-to-many; use explicit chassis/year fallback, never blanket rewrite.'}});
 report.expectedSourceCardHashes[line]=hash(card);
}
write(path,cards);write('src/data/catalog/model-lines-auto.json',lines);write('src/data/front-drawings.json',drawings);write('src/data/front-drawing-review.json',holds);write('src/data/stats/bmw.json',stats);
cp.execFileSync('node',['scripts/model-cards-index.mjs'],{stdio:'inherit'});cp.execFileSync('node',['scripts/model-lines-index.mjs','--make=bmw'],{stdio:'inherit'});write(root+'/migration.json',report);console.log(JSON.stringify({newGenerations:report.newGenerations,faceliftsAdded:report.faceliftsAdded,enginesAdded:report.enginesAdded,statsStatus:report.statsStatus}));
