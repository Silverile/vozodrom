import fs from 'node:fs';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import path from 'node:path';
import assert from 'node:assert/strict';
import {isDeepStrictEqual as equal} from 'node:util';
const root='analysis/codex/structure-pass-2',baseline='52685b1',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
const oldCache=new Map(),old=p=>{if(!oldCache.has(p))oldCache.set(p,JSON.parse(cp.execFileSync('git',['show',`${baseline}:${p}`],{maxBuffer:60e6})));return structuredClone(oldCache.get(p));};
const union=(a,b)=>[...new Map([...(a??[]),...(b??[])].map(x=>[JSON.stringify(x),x])).values()];
const sources=read(`${root}/research.json`),source=id=>sources.find(r=>`${r.make}/${r.line}`===id)?.url;
const plans=new Map(),get=id=>{if(!plans.has(id))plans.set(id,{id,source:source(id),dates:[],merges:{},rename:{},stages:[]});return plans.get(id);};
const date=(id,index,from,to,note='',url=null,basis='production')=>get(id).dates.push({index,from,to,note,url:url??source(id),basis});
const approximate=(id,index,from,to)=>date(id,index,from,to,'Přibližná hranice hlavní evropské řady podle příchodu nástupce; jiné karoserie a trhy mohou pokračovat déle.',null,'successor-boundary');
date('renault/clio',4,2019,2025,'Přibližný evropský konec podle nástupce X60; globální výroba může pokračovat.',null,'successor-boundary');
approximate('hyundai/i20',2,2020,2026);
date('dacia/logan',0,2004,2012,'Hlavní rumunská řada; mimoevropské a užitkové odvozené verze pokračovaly déle.');date('dacia/logan',1,2012,2020,'Hlavní evropská řada Dacia, nikoli pozdější Renault pro jiné trhy.');
date('mercedes-benz/gle',3,2015,2019,'Coupé C292.','https://de.wikipedia.org/wiki/Mercedes-Benz_C_292');date('mercedes-benz/gle',5,2019,null,'Coupé C167.','https://de.wikipedia.org/wiki/Mercedes-Benz_C_167');
approximate('mitsubishi/asx',0,2010,2023);date('ford/escort',3,1986,1992,'Infobox Mk IV; souběžné karoserie se překrývají s Mk V.');date('ford/escort',4,1990,1997,'Výroba podle infoboxu Mk V.');
date('mercedes-benz/trida-v',0,1996,2003,'Evropská rodina W638.','https://de.wikipedia.org/wiki/Mercedes-Benz_W_638');date('mercedes-benz/trida-v',1,2003,2014,'Evropská výroba W639 ve Španělsku; jiné trhy pokračovaly déle.');
date('audi/q7',2,2026,null,'Ohlášená G8; zdroj uvádí výrobu teprve plánovanou pro rok 2026.',null,'announcement');
date('citroen/c5',1,2008,2019,'Evropský rozsah podle infoboxu druhé generace; čínská výroba do 2021.');
approximate('toyota/hilux',7,2015,2025);approximate('nissan/micra',3,2010,2016);
date('volkswagen/t-roc',0,2017,2025,'Hlavní SUV do listopadu 2025; kabriolet podle zdroje do 2027.');
date('fiat/uno',0,1983,2002,'Evropská výroba včetně Polska do 2002; hlavní italská výroba skončila 1995 a další trhy pokračovaly déle.');approximate('mercedes-benz/gla',1,2019,2026);
date('nissan/navara',1,2014,2021,'Evropská španělská výroba do 2021; mimo Evropu generace pokračuje.');
date('mg/hs',0,2018,2024,'Evropské hlavní motorizace končí 07/2024; jiné trhy mohou pokračovat.','https://de.wikipedia.org/wiki/MG_HS');
date('daewoo/matiz',0,1998,2008,'Evropské montáže zahrnují Rumunsko do 2008; jiné trhy později.');date('daewoo/matiz',1,2005,2009,'Hlavní korejská výroba M200; licenční výroba na jiných trzích později.');date('daewoo/matiz',2,2009,2015,'Hlavní korejská výroba M300; jiné trhy pokračovaly déle.');
approximate('mitsubishi/eclipse-cross',0,2017,2025);
date('mercedes-benz/trida-g',0,1979,1991);date('mercedes-benz/trida-g',1,1985,2022,'W461: civilní verze do 2019, vojenské do 2022.');
for(const [i,a,b]of [[0,1926,1927],[1,1927,1928],[2,1929,1930]])date('mercedes-benz/300-350-predvalecne',i,a,b,'Datované podkapitoly W03/W04/W05.','https://en.wikipedia.org/wiki/Mercedes-Benz_W03');
date('barkas/b1000',0,1961,1990,'Dvoudobý B1000 podle německého infoboxu; B1000-1 je veden samostatně.','https://de.wikipedia.org/wiki/Barkas_B_1000');
date('dacia/spring',1,2026,null,'Samostatná druhá generace na nové platformě; představení 08.09.2026, sériový začátek není tímto datem potvrzen.','https://media.dacia.com/new-dacia-spring-100-per-cent-electric-100-per-cent-dacia/?lang=eng','announcement');
date('mercedes-benz/amg-gt',0,2014,2022,'Hlavní sériová řada do září 2022; limitovaná Black Series podle zdroje do 2023.');
date('audi/rs6',2,2013,2018);date('audi/rs6',3,2019,2025);date('audi/rs3',0,2011,2012,'Rozsah RS3, nikoli celé rodiny A3.','https://de.wikipedia.org/wiki/Audi_RS3');
date('chrysler/pacifica',0,2003,2007,'Původní crossover je odlišný od pozdějšího minivanu.','https://en.wikipedia.org/wiki/Chrysler_Pacifica_(crossover)');
date('jaguar/xj',1,1973,1979,'Hlavní evropská řada; jihoafrická montáž do 1981.');date('dodge/caravan',3,2000,2007,'Hlavní severoamerická řada; čínská montáž pokračovala do 2011.');
date('daewoo/nubira',0,1997,2008,'Rodina J100/J150; evropská rumunská výroba do 2008.');date('daewoo/nubira',2,2002,2009,'Hlavní korejská výroba J200/Lacetti; jiné montáže pokračovaly déle.','https://en.wikipedia.org/wiki/Daewoo_Lacetti');
date('audi/rs5',0,2010,2015,'Rozsah RS5 podle generace.','https://de.wikipedia.org/wiki/Audi_RS5');date('audi/rs5',1,2017,2024,'Rozsah RS5 podle generace.','https://de.wikipedia.org/wiki/Audi_RS5');
const merge=(id,map,name=null)=>{const p=get(id);p.merges=map;if(name)p.rename[Object.values(map)[0]]=name;};
merge('land-rover/defender',{5:4,6:4},'Defender (L663)');get('land-rover/defender').source='https://en.wikipedia.org/wiki/Land_Rover_Defender_(L663)';
merge('land-rover/range-rover',{4:3,6:5});get('land-rover/range-rover').rename={3:'Range Rover (L405)',5:'Range Rover (L460)'};
merge('jaguar/xj',{9:8},'XJ (X351)');
merge('kia/k4',{1:0},'K4 (CL4)');merge('kia/optima',{4:3},'Optima (JF)');
merge('byd/seal-u',{1:0},'Seal U');merge('lynk-co/01',{1:0},'01');
merge('ligier/js50',{1:0},'JS50');get('ligier/js50').source='https://www.ligier.fr/tout-savoir/actualites/nouvelle-js50-style-et-design/';get('ligier/js50').stages=[{index:0,year:2023,name:'modernizace',note:'Nový vzhled podle výrobce pro rok 2023.'}];
merge('daewoo/nubira',{1:0},'Nubira (J100/J150)');get('daewoo/nubira').stages=[{index:0,year:1999,name:'J150',note:'Modernizace J100, nikoli samostatná generace.'}];
merge('chevrolet/cruze',{1:0,2:0},'Cruze (J300)');date('chevrolet/cruze',0,2008,2016,'První generace J300; druhá J400 je samostatná.');get('chevrolet/cruze').replaceFirst={code:'J300',name:'Cruze (J300)',from:2008,to:2016,bodyTypes:['sedan','hatchback','kombi'],source:source('chevrolet/cruze')};get('chevrolet/cruze').append=[{code:'J400',name:'Cruze (J400)',from:2016,to:2019,bodyTypes:['sedan','hatchback'],source:source('chevrolet/cruze'),note:'Hlavní severoamerická výroba do 2019; Argentina do 2023.'}];
const bmw=get('bmw/rada-1');bmw.replaceFirst={code:'E81/E82/E87/E88',name:'Řada 1 (E81/E82/E87/E88)',from:2004,to:2013,bodyTypes:['hatchback','kupe','kabriolet'],source:'https://en.wikipedia.org/wiki/BMW_1_Series_(E87)'};bmw.insertAfterFirst=[{code:'F20/F21',name:'Řada 1 (F20/F21)',from:2011,to:2019,bodyTypes:['hatchback'],source:'https://en.wikipedia.org/wiki/BMW_1_Series_(F20)'},{code:'F40',name:'Řada 1 (F40)',from:2019,to:2024,bodyTypes:['hatchback'],source:'https://en.wikipedia.org/wiki/BMW_1_Series_(F40)'}];
const concurrent=new Set(['hyundai/tucson','citroen/c3','mg/zs','mini/cooper','toyota/land-cruiser','porsche/cayenne','volkswagen/tayron','kia/niro','ford/explorer','jaguar/xf','ssangyong-kgm/torres']);
const generation=d=>({code:d.code,name:d.name,from:d.from,to:d.to,productionStatus:d.to?'ended':'current',dateBasis:'production',drawingStage:0,bodyTypes:d.bodyTypes,engines:[],trims:[],sources:[d.source],photo:null,facelift:[],specificationScope:{noteCs:d.note??'Výrobní období podle uvedeného generačního článku.'}});
export function transform(card){
 const p=plans.get(`${card.makeSlug}/${card.lineSlug}`);if(!p)return structuredClone(card);
 const c=structuredClone(card),original=structuredClone(c.generations),map={};
 for(const e of p.dates){const g=c.generations[e.index];g.from=e.from;g.to=e.to;g.dateBasis=e.basis;g.productionStatus=e.basis==='announcement'?'announced':e.to?'ended':'current';g.sources=union(g.sources,[e.url]);g.specificationScope={...g.specificationScope,noteCs:[g.specificationScope?.noteCs,e.note||'Výrobní období podle generačního článku.'].filter(Boolean).join('\n')};if(e.basis==='announcement'&&c.lineSlug==='spring')g.availabilityEvidence={date:'2026-09-08',source:e.url};}
 if(p.replaceFirst){const before=c.generations[0];c.generations[0]={...before,...generation(p.replaceFirst),specificationReferences:[before]};assert(!(before.engines?.length||before.trims?.length),'Generic family has scoped versions; manual attribution required');}
 for(const [from,target]of Object.entries(p.merges)){const a=c.generations[from],b=c.generations[target];for(const k of ['engines','trims','equipmentLines','sources','bodyTypes','drivetrains','transmissions','markets'])b[k]=union(b[k],a[k]);b.specificationReferences=union(b.specificationReferences,[Object.fromEntries(Object.entries(a).filter(([k])=>!['engines','trims','equipmentLines','sources','bodyTypes','drivetrains','transmissions','markets'].includes(k)))]);}
 for(const [i,name]of Object.entries(p.rename))c.generations[i].name=name;
 for(const stage of p.stages){const g=c.generations[stage.index];g.facelift=union(g.facelift,[{year:stage.year,name:stage.name,note:stage.note,sources:[p.source]}]);g.sources=union(g.sources,[p.source]);}
 const survivors=c.generations.map((g,i)=>({g,i})).filter(({i})=>!Object.hasOwn(p.merges,i));c.generations=[];
 for(const {g,i}of survivors){map[i]=c.generations.length;c.generations.push(g);if(i===0)for(const d of p.insertAfterFirst??[])c.generations.push(generation(d));}
 for(const [from,target]of Object.entries(p.merges))map[from]=map[target];for(const d of p.append??[])c.generations.push(generation(d));
 for(const [i,g]of c.generations.entries())for(const e of g.engines??[])if(e.sourceScope?.generationEvidence)e.sourceScope.generationEvidence.generationIndex=i;
 if(p.id==='mercedes-benz/trida-g'){
  const g=c.generations[0],move=(g.engines??[]).filter(e=>e.variant==='G 300 CDI Professional');
  for(const e of move){assert(e.sourceScope.tableSection.includes('W461'));e.sourceScope.generationEvidence.generationIndex=1;}
  g.engines=(g.engines??[]).filter(e=>!move.includes(e));if(!g.engines.length)g.engineCoverage='unknown';
  c.generations[1].engines=union(c.generations[1].engines,move);c.generations[1].sources=union(c.generations[1].sources,move.flatMap(e=>e.sources));if(move.length)c.generations[1].engineCoverage='representative-documented-versions';
 }
 if(c.needsReview)c.needsReview=c.needsReview.map(r=>({...r,field:r.field.replace(/generations\[(\d+)\]/g,(_,i)=>`generations[${map[i]??i}]`)}));
 // Public listing IDs may already be better than the card's code (e.g. GB/IB vs GB).
 // Preserve those codes rather than replacing them with card-only spelling or year IDs.
 const [make,line]=p.id.split('/'),catalogue=old('src/data/catalog/model-lines-auto.json').find(l=>l.makeSlug===make&&l.slug===line);
 const canonical=s=>(s??'').toUpperCase().replace(/[^A-Z0-9]/g,''),tokens=s=>(s??'').toUpperCase().match(/[A-Z0-9]{2,}/g)??[];
 for(const g of c.generations){const known=(catalogue?.generations??[]).filter(x=>x.code);let match=known.find(x=>g.code&&canonical(x.code)===canonical(g.code));if(!match){const ids=tokens(`${g.code??''} ${g.name??''}`);match=known.find(x=>tokens(x.code).some(t=>ids.includes(t)));}if(!match)match=known.find(x=>x.from===g.from&&x.to===g.to);if(match)g.code=match.code;}
 c.sources=union(c.sources,c.generations.flatMap(g=>g.sources??[]));return {card:c,map};
}
const expected=c=>{const r=transform(c);return r.card??r;},gid=g=>g.code??`${g.from??'?'}–${g.to??'?'}`;
if(process.argv[2]==='--apply'){
 assert(!fs.existsSync(`${root}/report.json`),'Batch already applied');
 const report={baseline,policy:'One source; main body/European end; successor boundary explicitly labelled; real parallel families retained when source says ongoing.',lines:[],pendingStatistics:[],listingIdChanges:[],drawingMoves:[],retiredDrawings:[],removedGenerations:0,addedGenerations:0};
 const oldFront=old('src/data/front-drawings.json'),front=structuredClone(oldFront),oldHolds=old('src/data/front-drawing-review.json'),holds={...oldHolds},newCards=new Map();
 for(const dir of ['src/data/catalog/model-cards','src/data/model-cards'])for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.json'))){const file=`${dir}/${f}`,cards=read(file);let dirty=false;for(let i=0;i<cards.length;i++){const before=cards[i],id=`${before.makeSlug}/${before.lineSlug}`,p=plans.get(id);if(!p)continue;const {card:after,map}=transform(before);if(equal(before,after))continue;cards[i]=after;dirty=true;newCards.set(id,after);report.removedGenerations+=Object.keys(p.merges).length;report.addedGenerations+=(p.insertAfterFirst?.length??0)+(p.append?.length??0);const listingChanges=before.generations.map((g,index)=>({oldIndex:index,newIndex:map[index],from:gid(g),to:gid(after.generations[map[index]])})).filter(r=>r.from!==r.to);report.listingIdChanges.push(...listingChanges.map(r=>({id,...r})));report.lines.push({id,sourceFile:file,status:'changed',oldToNew:map,before:before.generations.map(g=>({code:g.code,name:g.name,from:g.from,to:g.to})),after:after.generations.map(g=>({code:g.code,name:g.name,from:g.from,to:g.to})),plan:p});report.pendingStatistics.push(id);
 const key=`${before.makeSlug}--${before.lineSlug}`,rows=oldFront[key]??[],buffers=rows.map(([j])=>({j,file:`public/front/${key}--${j}.webp`,bytes:fs.readFileSync(`public/front/${key}--${j}.webp`)})),winners=new Map(),writes=[];
 for(const b of buffers){const target=map[b.j];if(p.replaceFirst&&b.j===0){report.retiredDrawings.push({id,oldIndex:b.j,path:b.file,reason:'Unattributed generic family drawing; file retained without front-index entry.'});continue;}if(winners.has(target)){const retired=`public/front/${key}--retired-${b.j}.webp`;assert(!fs.existsSync(retired));writes.push({path:retired,bytes:b.bytes});report.retiredDrawings.push({id,oldIndex:b.j,path:retired,reason:'Another drawing already represents merged generation.'});continue;}winners.set(target,b);const dest=`public/front/${key}--${target}.webp`;writes.push({path:dest,bytes:b.bytes});if(dest!==b.file)report.drawingMoves.push({from:b.file,to:dest,sha256:crypto.createHash('sha256').update(b.bytes).digest('hex')});}
 const targets=new Set(writes.map(w=>w.path));for(const w of writes)fs.writeFileSync(w.path,w.bytes);for(const b of buffers)if(!targets.has(b.file)&&!report.retiredDrawings.some(r=>r.path===b.file)){assert(path.resolve(b.file).startsWith(path.resolve('public/front')+path.sep));fs.unlinkSync(b.file);}
 if(rows.length){const next=[...winners].map(([j])=>[j,after.generations[j].from,after.generations[j].to]);if(next.length)front[key]=next;else delete front[key];}
 for(const [h,value]of Object.entries(oldHolds))if(h.startsWith(key+'--')){delete holds[h];const j=Number(h.slice(key.length+2));if(p.replaceFirst&&j===0)continue;holds[`${key}--${map[j]??j}`]=value;}
 }if(dirty)write(file,cards);}
 for(const row of read(`${root}/queue.json`).selected)if(!report.lines.some(r=>r.id===`${row.make}/${row.line}`))report.lines.push({id:`${row.make}/${row.line}`,status:concurrent.has(`${row.make}/${row.line}`)?'verified-parallel-or-announced':'identified-source-no-structural-change',source:source(`${row.make}/${row.line}`),reason:'Source identifies distinct ongoing regional, body, derivative or powertrain family; not an unidentified pseudo-generation.'});
 write('src/data/front-drawings.json',front);write('src/data/front-drawing-review.json',holds);
 const linePath='src/data/catalog/model-lines-auto.json',ls=read(linePath);for(const [id,c]of newCards){const l=ls.find(l=>`${l.makeSlug}/${l.slug}`===id);if(l)l.generations=c.generations.map(g=>({code:g.code??null,from:g.from??null,to:g.to??null,productionStatus:g.productionStatus,bodyTypes:g.bodyTypes??[],sources:g.sources??[]}));}write(linePath,ls);
 // Drop stale per-generation figures until the one end-of-pass raw rebuild. Line/make totals stay.
 for(const make of new Set(report.pendingStatistics.map(id=>id.split('/')[0]))){const file=`src/data/stats/${make}.json`;if(!fs.existsSync(file))continue;const stats=read(file);for(const id of report.pendingStatistics.filter(id=>id.startsWith(make+'/'))){const line=id.split('/')[1];if(stats[line])stats[line].gens={};}fs.writeFileSync(file,JSON.stringify(stats));}
 write(`${root}/report.json`,report);for(const script of ['scripts/model-cards-index.mjs','scripts/model-lines-index.mjs','scripts/listing-stats-index.mjs'])cp.execFileSync('node',[script],{stdio:'inherit'});console.log(JSON.stringify({changed:report.pendingStatistics.length,reviewed:report.lines.length,added:report.addedGenerations,removed:report.removedGenerations,listingIdChanges:report.listingIdChanges.length,drawingMoves:report.drawingMoves.length}));
}
if(process.argv[2]==='--validate'){
 const r=read(`${root}/report.json`);let untouched=0,touched=0;
 for(const dir of ['src/data/catalog/model-cards','src/data/model-cards'])for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.json'))){const file=`${dir}/${f}`,before=old(file),after=read(file);assert.equal(before.length,after.length);for(let i=0;i<before.length;i++){const want=expected(before[i]);assert(equal(after[i],want),`Unexpected source edit ${file}/${i}`);if(equal(want,before[i]))untouched++;else touched++;}}
 const index=read('src/data/model-cards-index.json'),oldIndex=old('src/data/model-cards-index.json');for(const [make,lines]of Object.entries(oldIndex))for(const [line,c]of Object.entries(lines))if(!r.pendingStatistics.includes(`${make}/${line}`))assert(equal(index[make][line],c));
 const oldListing=old('src/data/model-lines-index.json'),listing=read('src/data/model-lines-index.json');for(const id of r.pendingStatistics){const [make,line]=id.split('/'),before=oldListing[make].find(l=>l.slug===line),after=listing[make].find(l=>l.slug===line);for(const g of before.generations??[])if(g.code)assert(after.generations.some(x=>x.code===g.code),`Existing code ID lost ${id}/${g.code}`);}
 for(const id of r.pendingStatistics){const [make,line]=id.split('/'),p=`src/data/stats/${make}.json`;if(!fs.existsSync(p))continue;const before=old(p),after=read(p);if(after[line])assert.deepEqual(after[line].gens,{});for(const key of Object.keys(before))if(key===line){const a={...after[key],gens:before[key].gens};assert(equal(a,before[key]));}else if(!r.pendingStatistics.includes(`${make}/${key}`))assert(equal(after[key],before[key]));}
 const front=read('src/data/front-drawings.json');let drawings=0;for(const [key,rows]of Object.entries(front))for(const [i]of rows){const [make,line]=key.split('--');assert(index[make][line].generations[i]);assert(fs.existsSync(`public/front/${key}--${i}.webp`));drawings++;}for(const move of r.drawingMoves)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(move.to)).digest('hex'),move.sha256);
 for(const key of Object.keys(read('src/data/front-drawing-review.json'))){const [make,line,i]=key.split('--');assert(index[make]?.[line]?.generations[Number(i)],`Hold points outside generations: ${key}`);}
 const result={result:'PASS',untouchedSourceCards:untouched,changedSourceCards:touched,untouchedPublicCardsUnchanged:true,drawings,stats:'Affected line generation aggregates intentionally absent pending end-of-pass rebuild; all other aggregates unchanged',listingIdChanges:r.listingIdChanges};write(`${root}/validation.json`,result);console.log(JSON.stringify({...result,listingIdChanges:result.listingIdChanges.length}));
}
