const fs = require('fs');
const root = 'analysis/sweep/codex/';
const read = p => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
const save = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + '\n');
const stats = {};
for (const make of ['baic','dongfeng']) {
 const path = `src/data/catalog/model-cards/${make}.json`;
 const cards = read(path), report = read(root + make + '.json');
 const beforeCount = report.cardFixesApplied.length;
 const log = (c, p, old, val, sources) => report.cardFixesApplied.push({lineSlug:c.lineSlug,path:p,from:old,to:val,sources,pass:'round9-depth',confidence:'high'});
 const set = (c, p, val, sources) => {
  const parts=p.replace(/\[(\d+)\]/g,'.$1').split('.'); let obj=c;
  for (const part of parts.slice(0,-1)) obj=obj[part];
  const key=parts.at(-1), old=structuredClone(obj[key]);
  if(JSON.stringify(old)===JSON.stringify(val)) return;
  obj[key]=val; log(c,p,old,val,sources);
 };
 const source = (c,i,urls) => {set(c,`generations[${i}].sources`,[...new Set([...c.generations[i].sources,...urls])],urls);set(c,'sources',[...new Set([...c.sources,...urls])],urls);};
 let selected=[]; let notes=[];
 if(make==='baic') {
  const primary='https://www.baicgroup.com.cn/baicgroup/News/NewsShort/2026/1/I1457793775144271874.html';
  const secondary='https://de.wikipedia.org/wiki/Beijing_BJ30';
  const oldSecondary='https://en.wikipedia.org/w/index.php?title=Beijing_BJ30&oldid=1380533983';
  const sources=[primary,secondary,oldSecondary];
  const c=cards.find(x=>x.lineSlug==='bj30');
  const old=structuredClone(c.generations);
  c.generations[0].name='BJ30 I (modernizovaný BJ20)';
  c.generations[0].productionStatus='ended';
  c.generations[0].marketNotesCs='První BJ30 navazuje na BJ20. Předprodej začal v listopadu 2020, oficiální uvedení proběhlo 16. dubna 2021. Prameny se rozcházejí v konci výroby (2023 nebo 2024); přesné výrobní hranice zůstávají neuzavřené.';
  c.generations[0].sources=[...new Set([...c.generations[0].sources,'https://www.baicgroup.com.cn/baicgroup/News/Media/2026/1/I1457793975506173952.html',...sources])];
  const g=structuredClone(old[0]);
  g.name='BJ30 II';g.from=2024;
  g.dimensionsMm={length:4730,width:1910,height:1790,wheelbase:2820};
  g.specificationScope={market:'China',modelYear:2024,variant:'BJ30 II – čínské uvedení',bodyType:'suv',noteCs:'Rozměry druhé generace při čínském uvedení v roce 2024; nejde o evropskou specifikaci všech verzí.'};
  g.marketNotesCs='Druhá generace byla představena v březnu 2024 a uvedena na čínský trh 22. května 2024. V nabídce byly benzinové i hybridní verze. Současná výroba v říjnu 2026 nebyla samostatně ověřena.';
  g.sources=[primary,secondary,oldSecondary,'https://www.baicgroup.com.cn/baicgroup/News/NewsShort/2026/1/I1457793775177826304.html'];
  c.generations.push(g);
  log(c,'generations',old,c.generations,sources.concat(g.sources));
  set(c,'summaryCs','BJ30 je SUV značky Beijing v rámci skupiny BAIC. První provedení vychází z modernizovaného BJ20; druhá generace přišla v roce 2024 a nabídla benzinový i hybridní pohon.',sources);
  source(c,1,g.sources);
  report.conflicts.push({where:'round9 BJ30 I production end / series-production start',values:{'English Wikipedia':'2020–2023','German Wikipedia':'2020–2024','BAIC official':'pre-sale November 2020; market launch 16 April 2021'},kept:null,note:'Boundary fields retained null; generation identity separated. Launch is not treated as a precise SOP date.'});
  const x=cards.find(x=>x.lineSlug==='x7');
  const xs=['https://www.baicmotor.com/Uploads/file/20200924/20200924220240_87450.pdf','https://de.wikipedia.org/w/index.php?title=Beijing_X7&oldid=255982173','https://www.baicglobal.com/news/newsRelease/detail/147'];
  set(x,'generations[0].name','X7',xs);
  set(x,'generations[0].from',2020,xs.slice(0,2));
  set(x,'generations[0].facelift',[{year:2023,productionYear:2023,name:'New X7',note:'Modernizace původní řady uvedená v roce 2023; nejde o samostatnou novou generaci.',sources:xs.slice(1)}],xs.slice(1));
  set(x,'summaryCs','X7 je SUV značky Beijing vyráběné od roku 2020. V roce 2023 prošlo modernizací; na některých exportních trzích se modernizované provedení označuje X75. Údaje motorů a rozměrů je nutné vztahovat ke konkrétnímu trhu a provedení.',xs);
  source(x,0,xs);
  selected=['bj30','x7','bj80'];
  notes=['All 19 pre-pass generations inventoried; no BAIC generation photos populated, so no Commons swaps needed.','BJ80 official off-road history puts improved Warrior production at end 2015 while civilian BJ80 secondary sources give 2016; no civilian production boundary inferred from military chronology.','BJ30 I exact end conflicts 2023 vs 2024; retained null. Unknown codes and current October 2026 status left unknown.'];
  report.openQuestions.push('Round9: BJ80 civilian SOP needs separation from military improved Warrior put into production at end 2015 (https://www.baicglobal.com/offRoad/); civilian secondary source uses 2016 (https://en.wikipedia.org/wiki/Beijing_BJ80). No from value changed.');
 } else {
  for(const [slug,wiki,primary] of [
   ['007','https://en.wikipedia.org/w/index.php?title=Dongfeng_e%CF%80_007&oldid=1381439293','https://www.dfmc.com.cn/news/company/news_20240717_0912.html'],
   ['008','https://en.wikipedia.org/w/index.php?title=Dongfeng_e%CF%80_008&oldid=1381441145','https://www.dfmc.com.cn/news/company/news_20240717_0912.html'],
   ['box','https://en.wikipedia.org/w/index.php?title=Nammi_01&oldid=1358538448','https://www.dfmc.com.cn/news/company/news_20240108_1025.html']]) {
    const c=cards.find(x=>x.lineSlug===slug), sources=[primary,wiki];
    set(c,'generations[0].from',2024,sources);
    set(c,'generations[0].marketNotesCs',slug==='box'?'Výroba Nammi 01 začala v lednu 2024 v čínském Siang-jangu. Na exportních trzích se vůz prodává jako Dongfeng Box nebo Nammi Box; exportní uvedení neurčuje začátek výroby.':'Sériová výroba eπ '+slug+' je doložena v roce 2024 v závodě Wuhan II. Čínské uvedení proběhlo '+(slug==='007'?'v březnu':'v červnu')+' 2024. Samotné historické výrobní zprávy nepotvrzují stav výroby v říjnu 2026.',sources);
    source(c,0,sources);
   }
  selected=['007','008','box','ax7','s30'];
  notes=['All 24 pre-pass generations inventoried; 3 existing photo references inspected for retrievability.','Box Commons description, categories, author Peżot and CC BY-SA 4.0 match its card; retained unchanged. Metadata-only identity check, no new visual-review claim.','AX7 II exact file description inaccessible via web tool; S30 exact file inaccessible but listed in correct Commons model category. Existing photos retained, no negative identity evidence.','October 2026 production status, generation codes, full facelifts and European trim data remain unresolved; no speculative values filled.'];
  report.openQuestions.push('Round9 photo audit: exact AX7 II and S30 file-description fetches failed; complete these and visual verification later. Box identity/author/licence verified from https://commons.wikimedia.org/wiki/File:Dongfeng_Box_Pozna%C5%84_Motor_Show_2026.jpg; S30 filename occurs in https://commons.wikimedia.org/wiki/Category:Dongfeng_Fengshen_S30.');
 }
 report.depthPasses??=[];
 report.depthPasses.push({pass:'round9-depth',checkedAt:'2026-10-29',status:'partial',selectedModels:selected,notes});
 for(const c of cards) {
  // Clear only stale unknown-field markers that this pass actually resolved.
  const entries=report.cardFixesApplied.slice(beforeCount).filter(e=>e.lineSlug===c.lineSlug);
  const resolved=new Set(entries.map(e=>e.path));
  if(c.lineSlug==='bj30'&&make==='baic') resolved.add('generations[0].productionStatus');
  c.needsReview=c.needsReview.filter(n=>!resolved.has(n.field));
  if(make==='baic'&&c.lineSlug==='bj30') c.needsReview.push({field:'generations[1]',reason:'Druhá generace oddělena v průchodu round9; evropské technické verze, generační kód, facelifty a stav výroby k říjnu 2026 zůstávají neověřené.'});
 }
 save(path,cards);save(root+make+'.json',report);
 stats[make]={selectedModels:selected.length,cardFixEntriesAdded:report.cardFixesApplied.length-beforeCount,cards:cards.length,generations:cards.reduce((n,c)=>n+c.generations.length,0)};
}
save(root+'round9-baic-dongfeng-result.json',stats);console.log(JSON.stringify(stats,null,2));
