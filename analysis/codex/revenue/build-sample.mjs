import fs from 'node:fs';
import crypto from 'node:crypto';
import cp from 'node:child_process';
const root='analysis/codex/revenue';
fs.mkdirSync(root,{recursive:true});
const load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const cards=load('src/data/model-cards-index.json');
const listing=load('src/data/listing-stats.json');
const sourceFiles=['src/data/stats/skoda.json','src/data/stats/volkswagen.json','src/data/model-cards-index.json','src/data/listing-stats.json'];
const buckets=[[0,4],[5,9],[10,14],[15,19],[20,24],[25,29],[30,30]];
const notes=[
  'Ukázka pro odborné posouzení. Data jsou agregace českého registru a pravidelných technických prohlídek; nejde o ocenění vozidla, individuální VIN historii ani pravděpodobnost budoucí poruchy.',
  'Generace přiřazuje stávající matcher podle značky, modelu, roku a dostupného typového označení. Nejde o nezávisle ověřenou VIN klasifikaci; souběžné generace a karoserie mohou být přiřazeny chybně. Před placenou dodávkou ověřit vzorek přiřazení.',
  'Výsledek 2 nebo 3 znamená nevyhovující výsledek prohlídky. Jednotkou jsou prohlídky, nikoli unikátní vozidla. Souhrnný výsledek není měřením všech servisních poruch.',
  'Věk = kalendářní rok prohlídky minus rok první registrace; pipeline omezuje věk na 30, proto 30 znamená 30 a více let. Nejde o přesný věk v den prohlídky.',
  'Věkové skupiny jsou vážené počtem prohlídek ze zveřejněných řádků byAge. Míry vstupují zaokrouhlené na 4 desetinná místa: výsledek skupiny je aproximace, nikoli podíl z přesných původních počtů neúspěchů. Nezveřejněné malé/neurčené věkové skupiny nejsou dopočítávány.',
  'Kvartily nájezdu jsou středy 10 000km intervalů. Počty platných odečtů pro konkrétní věk nejsou ve finálním agregátu uchovány; uvádíme null. Kvartily různých věků neslučujeme, nelze z nich vypočítat kvartil věkové skupiny.',
  'Top závady jsou převzaty ze stávajícího agregátu. Podíl je počet výskytů kombinace kód/závažnost na prohlídku: při témže třímístném kódu ve více závažnostech se může prohlídka započítat vícekrát. Neoznačovat jako procento unikátních vozů s vadou.',
  'Datum built u registru je datum sestavení agregátu, nikoli prokázané datum referenčního výpisu. Referenční datum registru zůstává neověřeno. Žádné osobní údaje ani jednotlivá VIN nejsou součástí ukázky.',
  'Nesrovnávat hrubé míry různě starých generací jako žebříček spolehlivosti. Nejmladší vozy s časnou pravidelnou prohlídkou mohou být zvláštní, nereprezentativní skupinou.'
];
const out={schemaVersion:1,title:'Výkupní přehled ojetin — ukázka podle generací',createdOn:'2026-10-31',status:'review-sample-not-production-certified',currency:null,provenance:{gitRevision:cp.execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),sourceFiles:sourceFiles.map(path=>({path,sha256:sha(path)})),inspectionSource:'IS TP / Ministerstvo dopravy ČR — pravidelné technické prohlídky',inspectionDocumentation:'https://istp.data.md.gov.cz/resources/istp/opendata/documentation/istp-opendata-schemas-ProhlidkaSeznam-v1.pdf',registerSource:'Registr silničních vozidel / Ministerstvo dopravy ČR — provozovaná vozidla',registerPortal:'https://www.dataovozidlech.cz/',methods:['scripts/stats/istp-stats.py','scripts/stats/rsv-stats.py','scripts/stats/match.py','scripts/stats/build-stats.py']},methodologyCs:notes,lines:[]};
for(const [make,line]of [['skoda','octavia'],['skoda','fabia'],['volkswagen','golf']]){
 const file=load(`src/data/stats/${make}.json`),stats=file[line],card=cards[make][line];
 const row={makeSlug:make,lineSlug:line,name:card.name,sourceMeta:file.meta,registerSnapshotDate:null,generations:[]};
 card.generations.forEach((g,index)=>{
  const s=stats.gens?.[index],stk=s?.stk;
  const years=(s?.fleet?.years??[]).map(([y])=>y);
  const gen={index,generationId:g.code??`${g.from??'?'}–${g.to??'?'}`,name:g.name,code:g.code,from:g.from,to:g.to,assignment:'existing-year-and-type-matcher-unvalidated',fleetCount:s?.fleet?.n??null,observedFleetYearRange:years.length?[Math.min(...years),Math.max(...years)]:null,inspectionCount:stk?.inspections??null,overallFailureShare:stk?.failRate??null,overallUnfitShare:stk?.unfitRate??null,ageBuckets:buckets.map(([from,to])=>{
   const ageRows=(stk?.byAge??[]).filter(([age])=>age>=from&&age<=to),n=ageRows.reduce((v,[,count])=>v+count,0);
   return {label:from===30?'30+':`${from}–${to}`,fromAge:from,toAge:from===30?null:to,inspectionCount:n||null,failureShareApprox:n?Number((ageRows.reduce((v,[,count,rate])=>v+count*rate,0)/n).toFixed(6)):null,method:'weighted-mean-of-rounded-age-rates',inputRoundingErrorBound:0.00005,coveredAges:ageRows.map(([age])=>age)};
  }),failureByExactAge:(stk?.byAge??[]).map(([age,n,failureShare])=>({age,ageMeans30Plus:age===30,inspectionCount:n,failureShare})),mileageByExactAge:(stk?.km??[]).map(([age,p25Km,medianKm,p75Km])=>({age,ageMeans30Plus:age===30,p25Km,medianKm,p75Km,validOdometerReadingCount:null,binWidthKm:10000})),topDefects:(stk?.defects??[]).slice(0,5).map(d=>({code:d.code,label:d.label??d.code,occurrencesPerInspection:d.share,unit:'code-severity-occurrences-per-inspection',scope:'all-ages-in-this-generation'})),warnings:[]};
  if((stk?.km??[]).some(([age])=>age===30))gen.warnings.push('Řádek věku 30 zahrnuje i všechna starší vozidla.');
  if(years.some(y=>g.from!=null&&y<g.from||g.to!=null&&y>g.to))gen.warnings.push('Pozor: přiřazené roky registru přesahují aktuální interval karty; nutný audit historického přiřazení.');
  if(!stk)gen.warnings.push('STK agregát pro tuto generaci chybí; absence není nula.');
  if(gen.topDefects.length<5)gen.warnings.push(`Zveřejněný agregát obsahuje jen ${gen.topDefects.length} kódy závad nad minimálním počtem; chybějící pořadí nedoplňujeme.`);
  const ls=listing.makes[make]?.[line]?.gens?.[index];
  if(ls?.n!==gen.fleetCount)throw new Error(`Listing fleet mismatch ${make}/${line}/${index}`);
  row.generations.push(gen);
 });
 out.lines.push(row);
}
fs.writeFileSync(`${root}/sample-vykupni-prehled.json`,JSON.stringify(out,null,2)+'\n');
const fmt=n=>n==null?'—':n.toLocaleString('cs-CZ');
const pct=n=>n==null?'—':`${(n*100).toFixed(2).replace('.',',')} %`;
const md=[`# ${out.title}`,'','Pracovní ukázka k posouzení; neposílat jako certifikovaný podklad pro ocenění či pojistnou sazbu. Žádný údaj není odhadem budoucích nákladů na opravy.','',`Zdroj: IS TP + registr silničních vozidel (Ministerstvo dopravy ČR). Prohlídky ${out.lines[0].sourceMeta.stk.from} až ${out.lines[0].sourceMeta.stk.to}; agregát registru sestaven ${out.lines[0].sourceMeta.register.built}, referenční datum výpisu neověřeno.`,`[Dokumentace IS TP](${out.provenance.inspectionDocumentation}) · [Registr](${out.provenance.registerPortal})`,'', 'JSON obsahuje všechny dostupné věky a top 5 závad každé generace. Nájezd níže vybírá věk nejbližší 10 letům (při shodě mladší); jde o kvartily odečtů při prohlídkách.',''];
for(const line of out.lines){
 md.push(`## ${line.name}`,'','| Generace | Období karty | Vozů v provozu* | Prohlídek | Nájezd: věk / p25 / medián / p75 km |','|---|---|---:|---:|---|');
 for(const g of line.generations){const km=[...g.mileageByExactAge].sort((a,b)=>Math.abs(a.age-10)-Math.abs(b.age-10)||a.age-b.age)[0];md.push(`| ${g.name} (${g.code}) | ${g.from??'?'}–${g.to??'…'} | ${fmt(g.fleetCount)} | ${fmt(g.inspectionCount)} | ${km?`${km.age===30?'30+':km.age} / ${fmt(km.p25Km)} / ${fmt(km.medianKm)} / ${fmt(km.p75Km)}`:'nedostatek dat'} |`);}
 md.push('','*Počty podle stávajícího modelového přiřazení; nezaručují přesnou VIN identifikaci.','', '| Generace | 0–4 | 5–9 | 10–14 | 15–19 | 20–24 | 25–29 | 30+ |','|---|---:|---:|---:|---:|---:|---:|---:|');
 for(const g of line.generations)md.push(`| ${g.name} | ${g.ageBuckets.map(b=>b.inspectionCount?`${pct(b.failureShareApprox)} (n=${fmt(b.inspectionCount)})`:'—').join(' | ')} |`);
 md.push('','Míry nevyhovujících prohlídek (výsledek 2/3); vážená aproximace ze zaokrouhlených vstupů. „—“ znamená chybějící vzorek.','', 'Top závady — výskyty kódu/závažnosti na 100 prohlídek; všechny věky dané generace:','');
 for(const g of line.generations)md.push(`- **${g.name}:** ${g.topDefects.map(d=>`${d.code} ${d.label} (${pct(d.occurrencesPerInspection)})`).join('; ')||'nedostatek dat'}.${g.warnings.length?' '+g.warnings.join(' '):''}`);
 md.push('');
}
md.push('## Metodika a omezení','',...notes.map(n=>`- ${n}`),'','Před placenou dodávkou: audit generačního přiřazení, sjednocení závad na unikátní prohlídku, ověření referenčního data registru a dohoda o použití s odběratelem.');
fs.writeFileSync(`${root}/sample-vykupni-prehled.md`,md.join('\n')+'\n');
console.log(JSON.stringify({lines:out.lines.length,generations:out.lines.reduce((s,l)=>s+l.generations.length,0),warnings:out.lines.flatMap(l=>l.generations.filter(g=>g.warnings.length).map(g=>({line:l.lineSlug,generation:g.name,warnings:g.warnings})))}));
