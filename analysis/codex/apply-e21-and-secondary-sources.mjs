import fs from 'node:fs';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {projectCatalogueBaseline,fileHash} from './catalogue-overlays.mjs';
const root='analysis/codex/engine-throughput',manifestPath=`${root}/catalogue-overlays.json`;
assert(!fs.existsSync(manifestPath),'Already applied; do not apply twice');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const sourceIndex=new Map();
for(const d of ['src/data/catalog/model-cards','src/data/model-cards'])for(const f of fs.readdirSync(d).filter(f=>f.endsWith('.json')))for(const c of read(`${d}/${f}`))sourceIndex.set(`${c.makeSlug}/${c.lineSlug}`,`${d}/${f}`);
const url={e21:'https://en.wikipedia.org/wiki/BMW_3_Series_(E21)',ceed:'https://de.wikipedia.org/wiki/Kia_cee%E2%80%99d_(ED)',astra:'https://en.wikipedia.org/wiki/Opel_Astra',e12:'https://en.wikipedia.org/wiki/BMW_5_Series_(E12)'};
const engine=(variant,fuel,cc,litres,kw,source,section)=>({variant,fuel,displacementCc:cc,displacementLitresNominal:litres,powerKwMin:kw,powerKwMax:kw,availablePowerKw:[kw],powerRangeCoverage:'documented-versions-only',sources:[source],sourceScope:{evidenceType:'manually-read-generation-prose-or-table',section,reviewedOn:'2026-10-31'}});
const op=(make,line,engineAdditions)=>({make,line,sourceFile:sourceIndex.get(`${make}/${line}`),engineAdditions});
const e21={code:'E21',name:'\u0158ada 3 (E21)',from:1975,to:1983,productionStatus:'ended',drawingStage:0,facelift:[],bodyTypes:['sedan','kabriolet'],engines:[],engineCoverage:'unknown',drivetrains:null,transmissions:null,dimensionsMm:null,trunkL:null,markets:[],photo:null,trims:null,sources:[url.e21],specificationScope:{market:'Europe',noteCs:'S\u00e9riov\u00e1 v\u00fdroba 06/1975\u201312/1983. Dvoudve\u0159ov\u00fd sedan; kabriolet Baur je karos\u00e1\u0159sk\u00e1 p\u0159estavba. Dolo\u017een\u00fd v\u00fdb\u011br evropsk\u00fdch motor\u016f.'}};
const publicGeneration={code:e21.code,name:e21.name,from:1975,to:1983,current:false,drawingStage:0,facelifts:[],bodyTypes:e21.bodyTypes,engines:[],drivetrains:[],transmissions:[],dimensionsMm:null,trunkL:null,markets:[],trims:[],photo:null,sources:e21.sources};
const bmw=op('bmw','rada-3',[{generation:0,code:'E21',rows:[['315',1573,1.6,55],['316 (1.6)',1573,1.6,66],['316 (1.8)',1766,1.8,66],['318',1766,1.8,72],['318i',1766,1.8,77],['320',1990,2,80],['320/6',1991,2,90],['320i',1990,2,92],['323i',2315,2.3,105]].map(([v,cc,l,kw])=>engine(v,'petrol',cc,l,kw,url.e21,'Engines: European rows; US/Canada rows excluded'))}]);
bmw.insertGeneration=e21;bmw.publicGeneration=publicGeneration;
const ceed=op('kia','ceed',[{generation:0,code:'ED',rows:[...[[66,1396,1.4,'1.4 CVVT'],[77,1396,1.4,'1.4 CVVT'],[80,1396,1.4,'1.4 CVVT'],[90,1591,1.6,'1.6 CVVT'],[92,1591,1.6,'1.6 CVVT'],[93,1591,1.6,'1.6 CVVT'],[105,1975,2,'2.0 CVVT']].map(([kw,cc,l,v])=>engine(v,'petrol',cc,l,kw,url.ceed,'Technik / Ottomotoren; individual bullet points')),...[[66,1582,1.6,'1.6 CRDi'],[85,1582,1.6,'1.6 CRDi'],[94,1582,1.6,'1.6 CRDi'],[103,1991,2,'2.0 CRDi']].map(([kw,cc,l,v])=>engine(v,'diesel',cc,l,kw,url.ceed,'Technik / Dieselmotoren; individual bullet points'))]}]);
const astra=op('opel','astra',[{generation:0,code:'Astra F \u2013 T91',rows:[['C14NZ',1389,44],['C14SE',1389,60],['C20NE',1998,85],['C20XE',1998,110]].map(([v,cc,kw])=>engine(v,'petrol',cc,null,kw,url.astra,'First generation / Engines; European engine codes; South African and experimental rows excluded'))}]);
const e12=op('bmw','rada-5',[{generation:0,code:'E12',rows:[['518',1.8,66],['520',2,85],['520i',2,96],['520i',2,92],['520/6',2,90],['525',2.5,107],['525',2.5,110],['528',2.8,121],['528',2.8,125]].map(([v,l,kw])=>engine(v,'petrol',null,l,kw,url.e12,'Engines; European standard models; explicit foreign-only and M sibling rows excluded'))}]);
const operations=[bmw,ceed,astra,e12];
// Enrich only genuinely empty generations, so supplemental rows cannot overwrite prior work.
for(const o of operations){const c=read(o.sourceFile).find(c=>c.makeSlug===o.make&&c.lineSlug===o.line);for(const a of o.engineAdditions)if(!o.insertGeneration)assert.equal(c.generations[a.generation].engines?.length??0,0);}
const frontPath='src/data/front-drawings.json',reviewPath='src/data/front-drawing-review.json',statsPath='src/data/stats/bmw.json',linePath='src/data/model-lines-index.json',listingPath='src/data/listing-stats.json';
const before={front:read(frontPath),review:read(reviewPath),stats:read(statsPath),lines:read(linePath),listing:read(listingPath)};
const oldCard=read(bmw.sourceFile).find(c=>c.lineSlug==='rada-3');assert.equal(oldCard.generations.length,10);assert.equal(oldCard.generations[0].code,'E30');
const drawingMoves=before.front['bmw--rada-3'].map(([i])=>({from:`public/front/bmw--rada-3--${i}.webp`,to:`public/front/bmw--rada-3--${i+1}.webp`,sha256:fileHash(`public/front/bmw--rada-3--${i}.webp`)}));
const manifest={schemaVersion:1,researchedOn:'2026-10-31',operations,protectedAfterHashes:{},migration:{line:'bmw/rada-3',oldToNew:Object.fromEntries(oldCard.generations.map((_,i)=>[i,i+1])),drawingMoves,statsKeyMoves:Object.fromEntries(Object.keys(before.stats['rada-3'].gens).map(i=>[i,Number(i)+1])),listingIdChanges:[],newListingId:'E21',retainedDuplicates:'Technical-sheet duplicates retained; merging them is a separate migration.',statisticsPolicy:'Existing generation aggregates rekeyed unchanged. E21 statistics remain absent until a raw-data rebuild; no invented population or STK values.'},secondarySourcePass:{policy:'Fleet-ordered empty-generation follow-up; one generation-specific source is sufficient. This is a first slice, not a completed second pass.',lines:[{make:'hyundai',line:'tucson',status:'deferred-announced-generation',reason:'Only empty generation is announced NX5; no engine specifications inferred.'},{make:'kia',line:'ceed',status:'engines-added',source:url.ceed,rows:11,note:'Source includes ED body variants into 2013; existing generation years left unchanged per protected-line instruction.'},{make:'opel',line:'astra',status:'engines-added',source:url.astra,rows:4,remaining:'Astra G still requires a generation-specific source.'},{make:'renault',line:'clio',status:'pending',reason:'Clio VI source research queued.'},{make:'bmw',line:'rada-5',status:'engines-added',source:url.e12,rows:9,remaining:'Other empty chassis generations remain queued.'}],additionalMigrationRows:9}};
write(manifestPath,manifest);
for(const source of new Set(operations.map(o=>o.sourceFile)))write(source,projectCatalogueBaseline(source,read(source)));
const front=structuredClone(before.front);front['bmw--rada-3']=front['bmw--rada-3'].map(([i,...rest])=>[i+1,...rest]);write(frontPath,front);
for(const move of [...drawingMoves].reverse()){assert(!fs.existsSync(move.to),'Drawing destination occupied');fs.renameSync(move.from,move.to);}
const review=Object.fromEntries(Object.entries(before.review).map(([k,v])=>[k.replace(/^bmw--rada-3--(\d+)$/,(_,i)=>`bmw--rada-3--${Number(i)+1}`),v]));
if(JSON.stringify(review)!==JSON.stringify(before.review))write(reviewPath,review);
const stats=structuredClone(before.stats);stats['rada-3'].gens=Object.fromEntries(Object.entries(stats['rada-3'].gens).map(([i,v])=>[Number(i)+1,v]));write(statsPath,stats);
const lineSourcePath='src/data/catalog/model-lines-auto.json',lineSources=read(lineSourcePath),lineSource=lineSources.find(c=>c.makeSlug==='bmw'&&c.slug==='rada-3');
lineSource.generations.unshift({code:'E21',from:1975,to:1983,productionStatus:'ended',bodyTypes:e21.bodyTypes,sources:e21.sources});lineSource.sources=[...new Set([...lineSource.sources,...e21.sources])];lineSource.needsReview=lineSource.needsReview.map(r=>({...r,field:r.field.replace(/generations\[(\d+)\]/g,(_,i)=>`generations[${Number(i)+1}]`)}));write(lineSourcePath,lineSources);
for(const script of ['scripts/model-cards-index.mjs','scripts/model-lines-index.mjs','scripts/listing-stats-index.mjs'])cp.execFileSync('node',[script],{stdio:'inherit'});
const index=read('src/data/model-cards-index.json');assert.deepEqual(index.bmw['rada-3'].generations[0],projectCatalogueBaseline('src/data/model-cards-index.json',{bmw:{'rada-3':{generations:[],sources:[]}}}).bmw['rada-3'].generations[0]);
// Verify the coupling against pre-migration values, not just valid index ranges.
assert.deepEqual(read(statsPath)['rada-3'].gens,stats['rada-3'].gens);
const lines=read(linePath),oldLine=before.lines.bmw.find(l=>l.slug==='rada-3'),newLine=lines.bmw.find(l=>l.slug==='rada-3');assert.deepEqual(newLine.generations.filter(g=>g.code!=='E21'),oldLine.generations);
assert.equal(newLine.generations[0].code,'E21');
const slim=read(listingPath),oldGens=before.listing.makes.bmw['rada-3'].gens;assert.deepEqual(slim.makes.bmw['rada-3'].gens,Object.fromEntries(Object.entries(oldGens).map(([i,v])=>[Number(i)+1,v])));
for(const p of [frontPath,statsPath,linePath,lineSourcePath,listingPath,...drawingMoves.flatMap(m=>[m.from,m.to])])manifest.protectedAfterHashes[p]=fileHash(p);
for(const move of drawingMoves)assert.equal(fileHash(move.to),move.sha256);
// Normalizer checks every report's concurrency fingerprint before touching it.
for(const f of fs.readdirSync(root).filter(f=>/^batch-\d+\.json$/.test(f))){const report=read(`${root}/${f}`);for(const r of report.lines)if(operations.some(o=>o.make===r.make&&o.line===r.line)){const c=read(r.sourceFile).find(c=>c.makeSlug===r.make&&c.lineSlug===r.line);r.afterHash=hash(c);}write(`${root}/${f}`,report);}
write(manifestPath,manifest);console.log(JSON.stringify({generationsAdded:1,engineRowsAdded:33,drawingMoves:drawingMoves.length,statsKeysMoved:Object.keys(oldGens).length,listingIdChanges:0}));

