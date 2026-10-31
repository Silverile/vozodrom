import fs from 'node:fs';
import assert from 'node:assert/strict';

// One-shot migration. Refuse a second application to avoid remapping migrated indexes.
const reportPath = 'analysis/codex/generation-migration-2026-10-31.json';
assert(!fs.existsSync(reportPath), 'Migration already applied; inspect the report instead.');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const write = (p, v) => fs.writeFileSync(p, `${JSON.stringify(v, null, 2)}\n`);
const clone = v => structuredClone(v);
const unique = a => [...new Set(a)];
const targets = {hyundai:'tucson', kia:'ceed', volkswagen:'caddy', bmw:'rada-5', audi:'a6'};
const docs = new Map();
const cards = {};
for (const dir of ['src/data/catalog/model-cards', 'src/data/model-cards']) {
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) {
    const p = `${dir}/${f}`, data = read(p);
    docs.set(p, {data, before:JSON.stringify(data)});
    for (const c of data) if (targets[c.makeSlug] === c.lineSlug) {
      assert(!cards[c.makeSlug], `Duplicate target ${c.makeSlug}`);
      cards[c.makeSlug] = c;
    }
  }
}
const linesPath = 'src/data/catalog/model-lines-auto.json';
const lines = read(linesPath);
const oldIndex = read('src/data/model-lines-index.json');
const report = {date:'2026-10-31', lines:{}, renamed:[], notes:[]};
const outline = gens => gens.map((g,index) => ({index,code:g.code,name:g.name,from:g.from,to:g.to,status:g.productionStatus}));
for (const [m,l] of Object.entries(targets)) report.lines[`${m}/${l}`] = {
  before:outline(cards[m].generations), beforeSelector:oldIndex[m].find(x=>x.slug===l).generations,
  // Retain all source content, including superseded photos/notes, for review.
  beforeCard:clone(cards[m]), mapping:{}, drawingMoves:[], statsMoves:[], listingIdChanges:[]
};
const addSource = (g, ...urls) => {g.sources=unique([...(g.sources??[]),...urls]);};
const setDates = (g,from,to) => Object.assign(g,{from,to,productionStatus:to==null?'current':'ended'});
const blank = (code,name,from,to,bodyTypes,sources) => ({
  code,name,from,to,productionStatus:to==null?'current':'ended',facelift:null,bodyTypes,
  engines:null,engineCoverage:'unknown',drivetrains:null,transmissions:null,
  dimensionsMm:{length:null,width:null,height:null,wheelbase:null},
  specificationScope:{market:'Europe',modelYear:null,variant:null,bodyType:null,noteCs:'Historické vymezení generace; údaje jednotlivých verzí nejsou úplné.'},
  trunkL:null,markets:['Europe'],marketNotesCs:'Historická výroba není potvrzením současné české nabídky.',photo:null,trims:null,sources
});

// Tucson: V is officially announced in 2026, so the requested conditional removal does not apply.
const h = cards.hyundai;
h.summaryCs=h.summaryCs.replace('třetí, čtvrté a páté generace','třetí a čtvrté generace');
const hHistory='https://www.hyundai.com/kr/ko/brand/brandstory/model/tucson-history';
const hV='https://www.hyundaimotorgroup.com/ko/news/hyundai-motor-company-all-new-tucson-debut';
const hVEn='https://www.hyundai.news/uk/articles/press-releases/all-new-hyundai-tucson-october-2026.html';
addSource(h.generations[0],hV,hVEn);
h.generations[0].productionStatus='unknown';
h.generations[0].dateBasis='announcement';
h.generations[0].dimensionsMm={length:null,width:null,height:null,wheelbase:null};
h.generations[0].marketNotesCs='Pátá generace byla oficiálně představena v září 2026; česká dostupnost a datum zahájení sériové výroby nejsou ověřeny.';
h.generations[0].specificationScope.noteCs='Pátá generace představena v září 2026, evropské představení v říjnu 2026. Rok označuje představení; zahájení sériové výroby a český prodej nejsou tímto záznamem potvrzeny.';
setDates(h.generations[2],2015,2021);
h.generations[2].facelift[0].to=2021;
for(const g of h.generations.slice(1)) addSource(g,hHistory);
h.generations[1].drawingStage=0;
h.generations[2].drawingStage=1;
h.generations[4].drawingStage=0;
report.lines['hyundai/tucson'].mapping={0:0,1:1,2:2,3:3,4:4};
report.notes.push('Tucson V retained: official Hyundai 2026 announcements meet the explicit exception. Production and Czech availability remain unverified; NX4 end remains unknown. Drop old NX5 statistics: registration years alone do not prove a newly announced generation.');

// Ceed: consolidate the three body branches; all technical versions retain their body type.
const k=cards.kia, oldK=k.generations;
k.generations=[0,3,6].map((start,i)=>{
  const group=oldK.slice(start,start+3), g=clone(group[0]);
  g.name=['Ceed I (ED)','Ceed II (JD)','Ceed III (CD)'][i];
  g.bodyTypes=unique(group.flatMap(x=>x.bodyTypes??[]));
  g.trims=group.flatMap(x=>x.trims??[]);
  g.engines=unique(group.flatMap(x=>x.engines??[]).map(JSON.stringify)).map(JSON.parse);
  g.engineCoverage=g.engines.length?'partial':'unknown';
  g.sources=unique(group.flatMap(x=>x.sources??[]));
  g.specificationScope.noteCs += ' Jedna generace zahrnuje hatchback, SW a pro_cee’d (ED/JD), případně ProCeed shooting brake (CD); karoserie konkrétních technických verzí jsou zachovány.';
  g.drawingStage=i<2?1:0;
  return g;
});
k.summaryCs='Tři generace ED, JD a CD zahrnují hatchback, kombi SW a sportovní karosářské verze pro_cee’d / ProCeed. XCeed má vlastní kartu. Konkrétní technické verze rozlišují karoserii.';
k.needsReview=(k.needsReview??[]).filter(x=>!/^generations\[/.test(x.field));
report.lines['kia/ceed'].mapping={0:0,1:0,2:0,3:1,4:1,5:1,6:2,7:2,8:2};
report.notes.push('Ceed CD retains the existing 2026 end rather than asserting ongoing production in October 2026; K4 replacement is documented. Merged generation statistics are dropped without summing cohorts. Archived beforeCard retains alternate body photographs and body-specific end dates.');

// Caddy: follow the manufacturer's five-generation convention; 2010 stays a facelift.
const v=cards.volkswagen, oldV=clone(v.generations);
const vSrc='https://www.volkswagen-comerciales.es/comunicacion/2021/02/05/el-nuevo-caddy-presenta-la-gama-mas-completa-para-uso-profesional-y-de-ocio-e-introduce-asistentes-a-la-conduccion-ineditos-en-su-segmento/';
const vFirst='https://www.volkswagen-newsroom.com/en/caddy-i-19821992-19678';
const iv=blank('IV (Typ SA)','Caddy IV',2015,2020,clone(oldV[2].bodyTypes),[...oldV[2].sources,vSrc]);
iv.photo=clone(oldV[2].facelift.find(f=>f.year===2015).photo);
iv.trims=oldV[2].trims.filter(t=>t.from>=2015);
iv.engineCoverage='partial';
iv.specificationScope.noteCs='Typ SA je rozsáhlá modernizace konstrukce 2K, výrobcem označovaná jako čtvrtá generace. Technické údaje jsou vedeny u konkrétních verzí.';
v.generations=[oldV[0],oldV[1],oldV[2],iv,oldV[3]];
setDates(v.generations[0],1982,1992);
v.generations[0].specificationScope.noteCs += ' Evropský Caddy: 1982–1992. Americký Rabbit Pick-up byl uveden v roce 1979; jihoafrická výroba první generace pokračovala do roku 2007. Tyto regionální údaje nerozšiřují evropský interval.';
addSource(v.generations[0],vFirst,vSrc);
setDates(v.generations[2],2003,2015);
v.generations[2].name='Caddy III';
// Preserve the existing listing code; its historic SA suffix is explained, not silently changed.
v.generations[2].specificationScope.noteCs += ' Generace III zde končí v roce 2015; Typ SA je samostatně jako Caddy IV. Historický identifikátor s / SA je zachován kvůli uloženým inzerátům.';
v.generations[2].facelift=v.generations[2].facelift.filter(f=>f.year<2015);
v.generations[2].trims=v.generations[2].trims.filter(t=>t.from<2015);
// The old engine aggregates spanned both III and IV; derive them only from retained versions.
for(const g of [v.generations[2],iv]) {
  g.engines=null;g.engineCoverage='partial';
  delete g.fieldSources;
  addSource(g,vSrc);
}
v.generations[2].drawingStage=0;
v.generations[4].drawingStage=0;
v.needsReview=(v.needsReview??[]).filter(x=>!['generations[0].to','generations[1].from,to','generations[2].to','generations[2]'].includes(x.field)).map(x=>({...x,field:x.field.replace(/^generations\[3\]/,'generations[4]')}));
report.lines['volkswagen/caddy'].mapping={0:0,1:1,2:[2,3],3:4};
report.notes.push('Caddy III listing id III (Typ 2K / SA) deliberately remains byte-identical; display name is Caddy III and scope explains legacy SA suffix. Splitting this old listing id into III/IV requires vehicle year/body evidence, never a blanket id rewrite. Caddy I/III statistics dropped because narrowed/split periods cannot be recovered from aggregates.');

// BMW: retain F10 and G60 ids, replace the broad family placeholder with real generations.
const b=cards.bmw,oldB=clone(b.generations);
const bSrc='https://www.bmw.co.uk/content/bmw/marketGB/bmw_co_uk/en/all-models/bmw-5-series-overview.html';
const bCz='https://cs.wikipedia.org/wiki/BMW_%C5%99ady_5';
const bHistory='https://www.press.bmwgroup.com/slovenia/article/attachment/T0264861SL/373560';
const defs=[['E12',1972,1981],['E28',1981,1988],['E34',1988,1996],['E39',1995,2004],['E60/E61',2003,2010],['F10',2010,2017],['G30/G31',2017,2023],['G60',2023,null]];
b.generations=defs.map(([code,from,to],i)=>{
  const g=i===5?clone(oldB[2]):i===7?clone(oldB[1]):blank(code,code,from,to,i<2?['sedan']:['sedan','kombi'],[bSrc,bCz]);
  setDates(g,from,to);
  g.name=['E12','E28','E34','E39','E60 / E61','F10 / F11','G30 / G31','G60 / G61'][i];
  g.bodyTypes=i<2?['sedan']:['sedan','kombi'];
  addSource(g,bSrc,bCz);
  if(i===1){addSource(g,bHistory);g.specificationScope.noteCs+=' E28: výroba od roku 1981 do června 1988 podle historického materiálu BMW; jiný přehled BMW zjednodušeně končí rokem 1987.';}
  if(i===5||i===7)g.specificationScope.noteCs+=' Technické verze a souhrnné rozměry z původního listu platí pro sedan, nikoli automaticky pro Touring; název generace zahrnuje obě karoserie.';
  if(i===6)g.specificationScope.noteCs+=' Přehled používá roky 2017–2023 dle českého přehledu; konkrétní konec výroby G31 Touring vyžaduje další ověření.';
  const fy={3:2000,4:2007,5:2013,6:2020}[i];
  if(fy)g.facelift=[{year:fy,productionYear:null,note:'Modernizace v rámci téže generace; rok podle historického přehledu BMW.',sources:[bSrc]}];
  return g;
});
b.needsReview=[{field:'generations[6].to',reason:'2017–2023 dle přehledu; přesný konec kombi G31 je třeba odděleně ověřit.'},{field:'generations[*].engines',reason:'Historické generace doplněny strukturálně; neověřené technické údaje zůstávají prázdné.'}];
report.lines['bmw/rada-5'].mapping={0:null,1:7,2:5};

// A6: stable type identifiers; readable C-series names. C5 retains the Avant envelope to 2005.
const a=cards.audi;
const aSrc='https://www.audi.pl/pl/stories/technologia/audi-a6-rozwoj-i-ewolucja-kultowego-modelu/';
const aCz='https://cs.wikipedia.org/wiki/Audi_A6';
const aCodes='https://en.wikipedia.org/wiki/Audi_A6';
const aType='https://www.servicesolutions.mahle.com/media/service-solutions-eu/product-lines/topnews/topnews-mahle_en-4.pdf';
const aBounds=[[1994,1997],[1997,2005],[2004,2011],[2011,2018],[2018,2025],[2025,null]];
a.generations.forEach((g,i)=>{setDates(g,...aBounds[i]);g.name=`A6 C${i+4} (${g.code})`;g.bodyTypes=['sedan','kombi'];addSource(g,aSrc,aCz,aCodes);});
a.generations[1].specificationScope.noteCs+=' C5: rok 2005 zachovává přesah výroby Avant; zjednodušená tabulka Audi uvádí 2004.';
a.generations[5].specificationScope.noteCs+=' C9 / 4L je A6 na spalovací platformě PPC; A6 e-tron má samostatnou modelovou řadu.';
addSource(a.generations[5],aType);
a.needsReview=(a.needsReview??[]).filter(x=>!/^generations\[\d+\]\.(from|to|bodyTypes)$/.test(x.field));
report.lines['audi/a6'].mapping={0:0,1:1,2:2,3:3,4:4,5:5};

// Cosmetic cleanup only: preserve the removed research qualifier inside the existing scope note.
for(const [p,{data}] of docs)for(const c of data)for(const [i,g]of c.generations.entries()) {
  if(!/základní řada|dosavadní katalogová rodina|konstrukční etapa|vybrané verze listu|technické listy/.test(g.name))continue;
  const old=g.name;
  g.name=g.code?`${c.name} (${g.code})`:c.name;
  if(g.specificationScope)g.specificationScope.noteCs += ` Původní interní označení podkladu: ${old}.`;
  report.renamed.push({file:p,line:c.lineSlug,index:i,before:old,after:g.name});
}
for (const [p,{data,before}] of docs)if(JSON.stringify(data)!==before)write(p,data);

// Reconcile selector source with card identity/order, retaining all existing durable codes.
for(const [m,l]of Object.entries(targets)){
  const card=cards[m],line=lines.find(x=>x.makeSlug===m&&x.slug===l);
  line.generations=card.generations.map(g=>({code:g.code,from:g.from,to:g.to,productionStatus:g.productionStatus,bodyTypes:g.bodyTypes,sources:g.sources}));
  line.from=Math.min(...card.generations.map(g=>g.from).filter(Number.isFinite));
  line.productionStatus=card.generations.some(g=>g.productionStatus==='current')?'current':'ended';
  line.to=line.productionStatus==='current'?null:Math.max(...card.generations.map(g=>g.to).filter(Number.isFinite));
  line.bodyTypes=unique(card.generations.flatMap(g=>g.bodyTypes??[]));
  line.productionPeriods=[{from:line.from,to:line.to}];
  line.sources=unique([...line.sources,...card.generations.flatMap(g=>g.sources)]);
  line.needsReview=m==='hyundai'?[{field:'generations[0]',reason:'V představena v roce 2026; zahájení výroby a česká dostupnost neověřeny.'}]:m==='bmw'?[{field:'generations[6].to',reason:'Přesný konec výroby G31 Touring vyžaduje samostatné ověření.'}]:[];
  report.lines[`${m}/${l}`].after=outline(card.generations);
  report.lines[`${m}/${l}`].afterSelector=line.generations.map(({code,from,to})=>({code,from,to}));
  const genId=g=>g.code??`${g.from??'?'}–${g.to??'?'}`;
  const newIds=new Set(line.generations.map(genId));
  for(const g of report.lines[`${m}/${l}`].beforeSelector)assert(newIds.has(genId(g)),`Unexpected retired listing id ${m}/${l}/${genId(g)}`);
  report.lines[`${m}/${l}`].newListingIds=[...newIds].filter(id=>!report.lines[`${m}/${l}`].beforeSelector.some(g=>genId(g)===id));
  card.sources=unique([...card.sources,...card.generations.flatMap(g=>g.sources)]);
}
// Persist card-level source additions made while reconciling the selector.
for (const [p,{data,before}] of docs)if(JSON.stringify(data)!==before)write(p,data);
write(linesPath,lines);

const drawings=read('src/data/front-drawings.json');
const review=read('src/data/front-drawing-review.json');
for(const [m,l]of Object.entries(targets)){
  const key=`${m}--${l}`, r=report.lines[`${m}/${l}`],oldRows=drawings[key]??[];
  const buffers=new Map(oldRows.map(([i])=>[i,fs.readFileSync(`public/front/${key}--${i}.webp`)]));
  const rows=[];
  for(const [i]of oldRows){
    const dest=m==='bmw'?null:m==='volkswagen'?(i===3?4:2):r.mapping[i];
    if(dest===null){delete review[`${key}--${i}`];r.drawingMoves.push({from:i,to:null,action:'retire-unattributed',reason:'Family-placeholder drawing: exact generation cannot be attributed confidently. Keep file on disk without an active entry or review key, since its old index now belongs to E12.'});continue;}
    const g=cards[m].generations[dest];
    rows.push([dest,g.from,g.to]);
    if(i!==dest)fs.writeFileSync(`public/front/${key}--${dest}.webp`,buffers.get(i));
    r.drawingMoves.push({from:i,to:dest,stage:g.drawingStage??'unresolved'});
  }
  for(const [i]of oldRows)if(!rows.some(([j])=>j===i)&&m!=='bmw')fs.unlinkSync(`public/front/${key}--${i}.webp`);
  drawings[key]=rows;
  // Move existing review keys using the same map, preserving unrelated holds.
  for(const [i]of oldRows){if(m==='bmw')continue;const dest=m==='volkswagen'?(i===3?4:2):r.mapping[i];const oldKey=`${key}--${i}`;if(i!==dest&&review[oldKey]){review[`${key}--${dest}`]=review[oldKey];delete review[oldKey];}}
}
write('src/data/front-drawings.json',drawings);
write('src/data/front-drawing-review.json',review);

for(const [m,l]of Object.entries(targets)){
  const p=`src/data/stats/${m}.json`,s=read(p),r=report.lines[`${m}/${l}`],next={};
  for(const [old,value]of Object.entries(s[l].gens??{})){
    const i=Number(old);
    const drop=m==='kia'||(m==='bmw'&&i===0)||(m==='volkswagen'&&(i===0||i===2))||(m==='hyundai'&&i===0);
    const dest=drop?null:m==='volkswagen'&&i===3?4:r.mapping[i];
    assert(dest===null||Number.isInteger(dest));
    if(dest!==null)next[dest]=value;
    r.statsMoves.push({from:i,to:dest,action:dest===null?'drop':'preserve'});
  }
  s[l].gens=next;
  fs.writeFileSync(p,JSON.stringify(s));
}
write(reportPath,report);
console.log(`Migrated five lines; cleaned ${report.renamed.length} internal generation names. See ${reportPath}`);
