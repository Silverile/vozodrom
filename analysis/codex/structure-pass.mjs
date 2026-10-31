import fs from 'node:fs';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {isDeepStrictEqual as equal} from 'node:util';
import {normalizeEngineRows,rejectEngine,nonEuropeanMarket} from './engine-throughput-policy.mjs';
const root='analysis/codex/structure-pass',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
fs.mkdirSync(root,{recursive:true});
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const baseline='4a6100b';
const oldCache=new Map();const old=p=>{if(!oldCache.has(p))oldCache.set(p,JSON.parse(cp.execFileSync('git',['show',`${baseline}:${p}`],{maxBuffer:50e6})));return structuredClone(oldCache.get(p));};
const edits=[
 ['bmw','rada-3',5,2011,2020,'BMW_3_Series_(F30)','Family includes F34 Gran Turismo through 2020; sedan-only infobox end 2018 is not the family endpoint.'],
 ['mercedes-benz','trida-e',4,2009,2017,'Mercedes-Benz_E-Class_(C207)','C207/A207 body family.'],
 ['mercedes-benz','trida-e',6,2016,2023,'Mercedes-Benz_E-Class_(C238)','Series production, not public launch year.'],
 ['audi','q5',1,2016,2025,'Audi_Q5','FY: September 2016; PHEV production ends April 2025.'],
 ['audi','q5',2,2024,null,'Audi_Q5','GU: production November 2024; 2025 is launch/model year.'],
 ['audi','a8',2,2009,2017,'Audi_A8','D4 production includes quattro through 2017.'],
 ['mercedes-benz','cls',0,2003,2010,'Mercedes-Benz_CLS-Class_(C219)','Production December 2003 to August 2010.'],
 ['mercedes-benz','cls',1,2011,2017,'Mercedes-Benz_CLS-Class_(C218)','Production January 2011 to December 2017.'],
 ['mercedes-benz','sl',5,2022,null,'Mercedes-Benz_SL-Class_(R232)','Production March 2022, not 2021 unveiling.'],
 ['alfa-romeo','giulietta',0,1954,1965,'Alfa_Romeo_Giulietta_(1954)','Historical family production.'],
 ['alfa-romeo','giulietta',1,1977,1985,'Alfa_Romeo_Giulietta_(1977)','Historical family production.'],
 ['hyundai','sonata',1,2014,2023,'Hyundai_Sonata','Global family: Korean production until 2023; not a European sales claim.'],
 ['hyundai','sonata',7,1985,1988,'Hyundai_Sonata','First-generation production.']
].map(([make,line,index,from,to,title,note])=>({make,line,index,from,to,source:`https://en.wikipedia.org/wiki/${title}`,note}));
const mergeMap={7:6,8:5,9:4,10:3};
const additions=read('analysis/codex/structure-bmw-research.json').flatMap((page,p)=>page.rows.map(r=>({index:p+1,engine:r.engine}))).filter(r=>!rejectEngine('bmw','rada-3',r.engine)&&!nonEuropeanMarket([r.engine.variant,r.engine.sourceScope.rowNotes].filter(Boolean).join(' '))&&!/SULEV|ZHP|Alpina/i.test(r.engine.variant));
// E30's combined fuel table has no parser-compatible heading. These values are explicit table rows.
for(const [variant,fuel,litres,kw]of [['316','petrol',1.8,66],['318i','petrol',1.8,83],['320i','petrol',2,95],['325i','petrol',2.5,125],['324d','diesel',2.4,63],['324td','diesel',2.4,85]])additions.push({index:1,engine:{variant,fuel,displacementCc:null,displacementLitresNominal:litres,powerKwMin:kw,powerKwMax:kw,availablePowerKw:[kw],powerRangeCoverage:'documented-versions-only',sources:['https://en.wikipedia.org/wiki/BMW_3_Series_(E30)'],sourceScope:{evidenceType:'manually-read-generation-engine-table',section:'European non-M3 petrol and diesel rows'}}});
const union=(a,b)=>[...new Map([...(a??[]),...(b??[])].map(x=>[JSON.stringify(x),x])).values()];
export function transform(card){
 const c=structuredClone(card),id=`${c.makeSlug}/${c.lineSlug}`;
 if(id==='bmw/rada-3'){
  for(const [from,to]of Object.entries(mergeMap)){
   const g=c.generations[to],pseudo=c.generations[from];assert.equal(g.code,pseudo.code);
   for(const key of ['engines','trims','equipmentLines','sources','bodyTypes','drivetrains','transmissions','markets'])g[key]=union(g[key],pseudo[key]);
   g.specificationReferences=union(g.specificationReferences,[Object.fromEntries(Object.entries(pseudo).filter(([k])=>!['engines','trims','equipmentLines','sources','bodyTypes','drivetrains','transmissions','markets'].includes(k)))]);
  }
  c.generations=c.generations.slice(0,7);
  c.needsReview=c.needsReview.map(r=>({...r,field:r.field.replace(/generations\[(\d+)\]/g,(_,i)=>`generations[${mergeMap[i]??i}]`)}));
  for(const a of additions){const g=c.generations[a.index],e=structuredClone(a.engine);if(['320e','330e'].includes(e.variant))e.fuel='petrol-phev';if(e.sourceScope?.generationEvidence)e.sourceScope.generationEvidence.generationIndex=a.index;g.engines=normalizeEngineRows([...(g.engines??[]),e]);g.sources=union(g.sources,e.sources);c.sources=union(c.sources,e.sources);g.engineCoverage='representative-documented-versions';}
  c.needsReview=c.needsReview.filter(r=>!/^generations\[\d+\]\.engines$/.test(r.field));
 }
 for(const e of edits.filter(e=>`${e.make}/${e.line}`===id)){const g=c.generations[e.index];g.from=e.from;g.to=e.to;g.productionStatus=e.to?'ended':'current';g.sources=union(g.sources,[e.source]);g.specificationScope={...g.specificationScope,noteCs:[g.specificationScope?.noteCs,e.note].filter(Boolean).join('\n')};}
 return c;
}
if(process.argv[2]==='--apply'){
 const candidates=read('analysis/codex/structure-pass-candidates.json');const report={baseline,selected:candidates.selected.map(r=>({...r,status:'deferred',reason:'No safe date/identity resolution in this batch; successor existence alone does not prove production ended.'})),edits,merge:{make:'bmw',line:'rada-3',oldToNew:Object.fromEntries(Array.from({length:11},(_,i)=>[i,mergeMap[i]??i])),listingIdChanges:[]},engineRowsAdded:0,sourceFiles:[],affectedMakes:[],stats:'pending'};
 for(const dir of ['src/data/catalog/model-cards','src/data/model-cards'])for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.json'))){const p=`${dir}/${f}`,cards=read(p);let changed=false;for(let i=0;i<cards.length;i++){const before=old(p)[i],after=transform(before);assert(equal(cards[i],before)||equal(cards[i],after),`Concurrent edit ${p}/${i}`);if(equal(before,after))continue;const r=report.selected.find(r=>r.make===before.makeSlug&&r.line===before.lineSlug);if(r){r.status='changed';r.reason='Sourced dates and/or exact-code technical-sheet merge applied.';}report.engineRowsAdded+=after.generations.reduce((n,g)=>n+(g.engines?.length??0),0)-before.generations.reduce((n,g)=>n+(g.engines?.length??0),0);cards[i]=after;changed=true;report.affectedMakes=union(report.affectedMakes,[before.makeSlug]);}if(changed){write(p,cards);report.sourceFiles.push(p);}}
 // Mapping 0..6 is identity; only pseudo-generation indexes disappear. No real-generation drawings move.
 const front=read('src/data/front-drawings.json');assert(front['bmw--rada-3'].every(([i])=>i<7));
 for(const e of edits){const row=front[`${e.make}--${e.line}`]?.find(r=>r[0]===e.index);if(row){row[1]=e.from;row[2]=e.to;}}write('src/data/front-drawings.json',front);
 const holdsPath='src/data/front-drawing-review.json',holds=read(holdsPath),newHolds={};for(const [k,v]of Object.entries(holds)){const next=k.replace(/^bmw--rada-3--(\d+)$/,(_,i)=>`bmw--rada-3--${mergeMap[i]??i}`);assert(!Object.hasOwn(newHolds,next));newHolds[next]=v;}if(!equal(holds,newHolds))write(holdsPath,newHolds);
 const sourcePath='src/data/catalog/model-lines-auto.json',source=read(sourcePath);for(const e of edits){const l=source.find(l=>l.makeSlug===e.make&&l.slug===e.line);if(!l)continue;const card=read(report.sourceFiles.find(p=>read(p).some(c=>c.makeSlug===e.make&&c.lineSlug===e.line))).find(c=>c.makeSlug===e.make&&c.lineSlug===e.line);const code=card.generations[e.index].code,g=(l.generations??[]).find(g=>g.code===code);if(g){g.from=e.from;g.to=e.to;g.productionStatus=e.to?'ended':'current';g.sources=union(g.sources,[e.source]);}}write(sourcePath,source);
 write(`${root}/batch-1.json`,report);console.log(JSON.stringify({changedLines:report.selected.filter(r=>r.status==='changed').length,affectedMakes:report.affectedMakes,engineRowsAdded:report.engineRowsAdded}));
}
if(process.argv[2]==='--validate'){
 const report=read(`${root}/batch-1.json`);let untouched=0,touched=0;
 for(const dir of ['src/data/catalog/model-cards','src/data/model-cards'])for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.json'))){const p=`${dir}/${f}`,before=old(p),after=read(p);assert.equal(before.length,after.length);for(let i=0;i<before.length;i++){const expected=transform(before[i]);assert(equal(after[i],expected),`Unexpected card edit ${p}/${i}`);if(equal(expected,before[i]))untouched++;else touched++;}}
 const index=read('src/data/model-cards-index.json'),beforeIndex=old('src/data/model-cards-index.json');for(const [make,ls]of Object.entries(beforeIndex))for(const [line,c]of Object.entries(ls)){if(!report.selected.some(r=>r.make===make&&r.line===line&&r.status==='changed'))assert(equal(index[make][line],c),`Untouched public card changed ${make}/${line}`);}
 const bmw=index.bmw['rada-3'];assert.equal(bmw.generations.length,7);assert(bmw.generations.every(g=>g.engines.length));
 const originalBmw=old('src/data/catalog/model-cards/bmw.json').find(c=>c.lineSlug==='rada-3');
 for(const [from,to]of Object.entries(mergeMap))for(const key of ['trims','engines','equipmentLines','sources'])for(const item of originalBmw.generations[from][key]??[])assert(bmw.generations[to][key]?.some(x=>equal(x,item)),`Merged ${key} lost from ${from} to ${to}`);
 assert.equal(cp.execFileSync('git',['diff','--name-only',baseline,'--','public/front'],{encoding:'utf8'}).trim(),'','Drawing bytes changed');
 const front=read('src/data/front-drawings.json'),expectedFront=old('src/data/front-drawings.json');for(const e of edits){const row=expectedFront[`${e.make}--${e.line}`]?.find(r=>r[0]===e.index);if(row){row[1]=e.from;row[2]=e.to;}}assert(equal(front,expectedFront));let drawings=0;for(const [k,rs]of Object.entries(front))for(const [i]of rs){assert(index[k.split('--')[0]][k.split('--')[1]].generations[i]);assert(fs.existsSync(`public/front/${k}--${i}.webp`));drawings++;}
 for(const make of report.affectedMakes){const stats=read(`src/data/stats/${make}.json`);for(const [line,v]of Object.entries(stats))if(line!=='meta'&&line!=='_')for(const i of Object.keys(v.gens??{}))assert(index[make]?.[line]?.generations[i],`Bad stats key ${make}/${line}/${i}`);}
 const result={result:'PASS',untouchedCards:untouched,changedCards:touched,drawingEntries:drawings,bmwGenerations:7,bmwEngines:bmw.generations.map(g=>({code:g.code,n:g.engines.length})),statisticsStatus:report.stats};write(`${root}/validation.json`,result);console.log(JSON.stringify(result));
}
