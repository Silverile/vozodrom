import fs from 'node:fs';
import assert from 'node:assert/strict';
import { applyPerformance } from './audi-catalog-audit/performance.mjs';

// Run from the repository root. Only Audi rows are changed; the first-run snapshot
// is retained for review/rollback. Unknown generations are empty, never invented.
const dir = 'analysis/codex/audi-catalog-audit';
fs.mkdirSync(dir, { recursive: true });
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const write = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + '\n');
const cp = 'src/data/catalog/model-cards/audi.json';
const lp = 'src/data/catalog/model-lines-auto.json';
const ap = 'src/data/catalog/model-line-additions.json';
const cards = read(cp), lines = read(lp), additions = read(ap);
const baselinePath = `${dir}/before.json`;
if (!fs.existsSync(baselinePath)) write(baselinePath, { cards, lines: lines.filter(l => l.makeSlug === 'audi'), additions: additions.filter(l => l.makeSlug === 'audi') });
const before = read(baselinePath);
const rescue = 'https://www.audi.com/en/information-on-accident-rescue-17123';
const types = 'https://emea-dam.audi.com/adobe/assets/urn%3Aaaid%3Aaem%3A2c86ef17-e470-4619-9f60-f11c758a8d79/original/as/Typenliste_Audi_i_Size_online.pdf';
const factory = 'https://emea-dam.audi.com/adobe/assets/urn%3Aaaid%3Aaem%3Ae5d2fa6a-e1cf-41ba-97f8-4fe38e98a743/original/as/audi-quarterly-update-Q3-2022.pdf';
const gt = 'https://www.audi.com/en/press-releases/the-new-audi-e-tron-gtan-electrifying-masterpiece-16054';
const electric = 'https://www.volkswagen-group.com/en/publications/more/audi-ag-annual-and-sustainability-report-2025-3227/download?disposition=attachment';
const a4Source = 'https://www.audi.pl/pl/stories/styl-zycia/30-lecie-audi-a4-kultowego-modelu-lat-90/';
const entries = [
  ['s1','S1','a1',['hatchback'],'https://nieuws.audi.nl/dynamiek-in-compacte-topvorm-audi-s1-en-s1-sportback/'],
  ['s3','S3','a3',[],rescue], ['s4','S4',null,[],factory],
  ['s5','S5','a5',[],factory], ['s6','S6','a6',[],types],
  ['s7','S7','a7',[],types], ['s8','S8','a8',[],types],
  ['rs2','RS 2 Avant','80',['kombi'],'https://www.audi.com/de/fotos/detail/audi-avant-rs-2-b4-baujahr-1994-37228'],
  ['rs3','RS 3','a3',[],rescue], ['rs4','RS 4','a4',[],factory],
  ['rs5','RS 5','a5',[],factory], ['rs6','RS 6','a6',[],types],
  ['rs7','RS 7','a7',[],types], ['sq2','SQ2','q2',['suv'],factory],
  ['sq5','SQ5','q5',['suv'],types], ['sq7','SQ7','q7',['suv'],factory],
  ['sq8','SQ8','q8',['suv'],factory], ['rs-q3','RS Q3','q3',['suv'],types],
  ['rs-q8','RS Q8','q8',['suv'],factory],
  ['tts','TTS','tt',[],rescue], ['tt-rs','TT RS','tt',[],rescue],
  ['s6-e-tron','S6 e-tron','a6-e-tron',[],electric],
  ['sq6-e-tron','SQ6 e-tron','q6-e-tron',['suv'],electric],
  ['sq8-e-tron','SQ8 e-tron','q8-e-tron',['suv'],'https://www.audi.com/en/audi-sq8-e-tron-until-2025-14991'],
  ['s-e-tron-gt','S e-tron GT','e-tron-gt',[],gt],
  ['rs-e-tron-gt','RS e-tron GT','e-tron-gt',[],gt],
  ['a4-allroad','A4 allroad quattro','a4',['kombi'],types],
  ['a6-allroad','A6 allroad quattro','a6',['kombi'],types],
];
const issues = [];
for (const [slug, name, parent, bodyTypes, source] of entries) {
  const aliases = [...new Set([name.replaceAll(' ', ''), ...(slug === 'rs6' ? ['RS6 Avant','RS 6 Avant'] : [])])];
  if (!cards.some(c => c.lineSlug === slug)) cards.push({
    makeSlug:'audi', lineSlug:slug, name, isAddition:true, segment:null,
    summaryCs:`${name} je samostatně pojmenovaný model Audi. Přehled generací, roků a motorizací se ověřuje; označení S line není totožné s modelem S.`,
    coverage:'identity-only', generations:[], sources:[source], aliases,
    familyLineSlug:parent, imageStatus:'missing', verifiedAt:'2026-10-30',
    needsReview:[{field:'generations',reason:'Existence modelu doložena; generace a jejich vlastní roky nejsou převzaty z výchozího modelu.'}, {field:'market',reason:'Samostatně ověřit dostupnost CZ/EU a dovoz; existence modelu nepotvrzuje aktuální prodej.'}],
  });
  if (![...lines,...additions].some(l=>l.makeSlug==='audi'&&l.slug===slug)) additions.push({
    makeSlug:'audi',slug,name,aliases,bodyTypes,from:null,to:null,productionStatus:'unknown',
    generations:[],sources:[source],familyLineSlug:parent,verifiedAt:'2026-10-30',
    needsReview:[{field:'generations',reason:'Model identity verified only; dates and generations require model-specific evidence.'}],
  });
  issues.push({issue_type:'missing_model',existing_entity_id:null,candidate_model:name,candidate_generation:null,market:'needs_review',severity:'critical',status:'identity_added_generations_pending',proposed_action:'verify_derivative_generations_and_market',evidence_urls:[source],confidence:'high'});
}
const a4Codes = ['B5 (8D)','B6 (8E/8H)','B7 (8E/8H)','B8 (8K)','B9 (8W)'];
for (const g of cards.find(c=>c.lineSlug==='a4').generations.entries()) {
  const [i, gen] = g; gen.code=a4Codes[i]; gen.name=`A4 ${a4Codes[i]}`;
  gen.sources=[...new Set([...gen.sources,a4Source])];
}
const a4Line = lines.find(l=>l.makeSlug==='audi'&&l.slug==='a4');
a4Line.generations.forEach((g,i)=>{ g.code=a4Codes[i]; g.sources=[...new Set([...g.sources,a4Source])]; });
// Source card already has 2007; align index source to it without changing image IDs.
a4Line.generations[3].from=2007;
const splits = {
  '80': [['B1',1972,1978],['B2',1978,1986],['B3',1986,1991],['B4',1991,1996]],
  '100': [['C1',1968,1976],['C2',1976,1982],['C3',1982,1991],['C4',1990,1994]],
  '200': [['C2',1979,1982],['C3',1983,1991]],
  'r8': [['Type 42',2006,2016],['Type 4S',2015,2024]],
  'a7': [['C7 (4G)',2010,2018],['C8 (4K)',2018,2025]],
};
for (const [slug, specs] of Object.entries(splits)) {
  const source=`https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/audi/${slug}/`;
  const card=cards.find(c=>c.lineSlug===slug), line=lines.find(l=>l.makeSlug==='audi'&&l.slug===slug);
  const sources=[source,...(['r8','a7'].includes(slug)?[rescue]:[])];
  if(slug==='r8') sources.push('https://www.audi.com/en/press-releases/the-audi-r8-a-captivating-legend-16374');
  card.generations=specs.map(([code,from,to])=>({
    code,name:`${card.name} ${code}`,from,to,productionStatus:'ended',facelift:null,
    bodyTypes:null,engines:null,engineCoverage:'unknown',drivetrains:null,transmissions:null,
    dimensionsMm:null,trunkL:null,markets:['EU'],photo:null,trims:null,
    specificationScope:{market:'European generation envelope',modelYear:null,variant:null,bodyType:null,noteCs:'Rozmezí generace může zahrnovat překryv karoserií; nejde o roky každé motorizace. R8: premiéra 2006, Coupé od 2007; první Spyder v záchranářských listech až do 2016.'},
    sources, imageStatus:'pending_review',verifiedAt:'2026-10-30',
  }));
  card.sources=[...new Set([...card.sources,...sources])];
  card.summaryCs=`Audi ${card.name}: přehled ${specs.length} konstrukčních generací. Karoserie, motorizace a přesné výrobní intervaly jednotlivých verzí se dále ověřují.`;
  card.needsReview=[{field:'generations',reason:'Generation envelopes verified; body-specific dates, engines, facelifts and drawings still require review.'}];
  if(line){line.generations=card.generations.map(({code,from,to,productionStatus,sources})=>({code,from,to,productionStatus,sources}));line.from=Math.min(...specs.map(x=>x[1]));line.to=Math.max(...specs.map(x=>x[2]));line.productionStatus='ended';line.productionPeriods=[{from:line.from,to:line.to}];line.sources=[...new Set([...line.sources,...sources])];}
  issues.push({issue_type:'missing_generation',candidate_model:card.name,status:'generation_structure_corrected',evidence_urls:sources,note:'Old aggregate retained in before.json; no old artwork assigned to a newly split generation.'});
}
for (const c of cards.filter(c=>c.lineSlug==='f103')) c.name='F103';
for (const l of lines.filter(l=>l.makeSlug==='audi'&&l.slug==='f103'&&l.name!=='F103')) { l.aliases=[...new Set([...(l.aliases??[]),l.name])]; l.name='F103'; }
issues.push({issue_type:'incorrect_name',candidate_model:'A4',status:'corrected_labels',evidence_urls:[a4Source],note:'Preserved all five generation positions and artwork IDs. Body/market-specific end years still require reconciliation.'});
issues.push({issue_type:'incorrect_name',candidate_model:'F103',status:'corrected_duplicate_make_prefix',evidence_urls:cards.find(c=>c.lineSlug==='f103').sources});
for (const slug of ['a6','q8-e-tron','920','s2','s6-plus','q5-e-tron','100-coupe-s']) issues.push({issue_type:cards.some(c=>c.lineSlug===slug)?'missing_generation':'missing_model',candidate_model:slug,status:'needs_review',severity:'high',evidence_urls:[],proposed_action:'verify_dates_bodies_lineage_before_replacing_existing_records'});
issues.push({issue_type:'unknown',candidate_model:'Q7',status:'third_generation_confirmed_dates_pending',evidence_urls:['https://www.audi.com/en/press-releases/third-generation-of-the-successful-suv-new-audi-q7-combines-versatility-and-performance-18004']});
for (const c of cards) {
  if (!c.imageStatus) c.imageStatus='pending_review';
  if (!c.generations.length) continue;
  issues.push({issue_type:'image_mismatch',candidate_model:c.name,status:'pending_visual_review',evidence_urls:[],proposed_action:'inspect_each_generation_and_facelift_artwork',confidence:'unknown'});
}
applyPerformance({cards,lines,additions,issues});
cards.sort((a,b)=>a.lineSlug.localeCompare(b.lineSlug,'en'));
assert(before.cards.every(c=>cards.some(x=>x.lineSlug===c.lineSlug)));
write(cp,cards); write(lp,lines); write(ap,additions);
const inventory = cards.map(c=>({slug:c.lineSlug,name:c.name,family:c.familyLineSlug??null,generations:c.generations.map(g=>({code:g.code,from:g.from,to:g.to,bodyTypes:g.bodyTypes,markets:g.markets})),image_status:c.imageStatus,sources:c.sources}));
write(`${dir}/inventory.json`,inventory);
write(`${dir}/audi_catalog_gap_report.json`,{manufacturer:'Audi',as_of:'2026-10-30',market_priority:['CZ','EU','other'],status:'partial_verified_corrections',counts:{before:before.cards.length,after:cards.length,created:cards.length-before.cards.length,merged:0,deleted:0},issues});
console.log(`Audi: ${before.cards.length} -> ${cards.length} identities. Existing slugs retained; generation and artwork review remains explicit.`);
