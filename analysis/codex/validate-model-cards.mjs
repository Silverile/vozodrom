import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(fs.readFileSync(p)));
const cards=read('src/data/catalog/model-cards/skoda.json'),lines=read('src/data/catalog/model-lines-auto.json').filter(l=>l.makeSlug==='skoda');
const evidence=read('analysis/codex/skoda-card-evidence.json'),photoEvidence=read('analysis/codex/skoda-card-photo-evidence.json');
const manufacturer=read('analysis/codex/skoda-card-manufacturer-facts.json');
const additions=read('src/data/catalog/model-line-additions.json');
const known=new Set([...Object.values(evidence.pages).map(p=>p.source).filter(Boolean),...Object.values(photoEvidence.files).map(p=>p.filePageUrl),...manufacturer.sources.map(p=>p.url),...read('analysis/codex/model-line-primary-facts.json').sources.map(p=>p.url),...lines.flatMap(l=>l.sources),...lines.flatMap(l=>(l.generations||[]).flatMap(g=>g.sources))]);
const bodies=new Set(['hatchback','kombi','sedan','suv','mpv','kupe','kabriolet','pickup','dodavka']);
const fuels=new Set(['petrol','diesel','petrol-cng','petrol-mhev','petrol-phev','electric']);
function validateFieldSources(record){for(const [field,urls]of Object.entries(record.fieldSources||{})){const value=field.split('.').reduce((v,k)=>v?.[k],record);assert(value!==null&&value!==undefined,'orphan field source '+field);assert(Array.isArray(urls)&&urls.length>0);for(const u of urls)assert(known.has(u),'unknown field-level source '+u);}}
assert.equal(cards.length,lines.length);const seen=new Set();let generations=0,photoCount=0,engines=0,trimCount=0;
for(let i=0;i<cards.length;i++){
 const c=cards[i];assert.equal(c.makeSlug,'skoda');assert(!seen.has(c.lineSlug));seen.add(c.lineSlug);assert(lines.some(l=>l.slug===c.lineSlug));if(i)assert(cards[i-1].lineSlug.localeCompare(c.lineSlug,'en')<0);
 assert(typeof c.summaryCs==='string'&&c.summaryCs.length>70);assert(!c.summaryCs.includes('�'));assert(c.summaryCs.split(/[.!?](?:\s|$)/).filter(s=>s.trim()).length>=2);assert(c.generations.length>0);assert.equal(c.isAddition,additions.some(a=>a.makeSlug===c.makeSlug&&a.slug===c.lineSlug));
 for(const u of c.sources)assert(known.has(u),'unknown source '+u);
 for(const [j,g]of c.generations.entries()){
  generations++;assert(g.bodyTypes===null||g.bodyTypes.every(b=>bodies.has(b)));assert(g.to!==null||g.productionStatus==='current'||c.needsReview.some(r=>r.field===`generations[${j}].to`));
  if(g.from!==null&&g.to!==null)assert(g.from<=g.to);for(const u of g.sources)assert(known.has(u),'unknown generation source '+u);
  for(const n of Object.values(g.dimensionsMm))assert(n===null||Number.isInteger(n)&&n>500&&n<7000);assert(g.trunkL===null||g.trunkL>0);
  if(g.engines)for(const e of g.engines){engines++;assert(e.fuel===null||fuels.has(e.fuel));assert(e.displacementCc===null||Number.isInteger(e.displacementCc)&&e.displacementCc>0);if(e.fuel==='electric')assert.equal(e.displacementCc,null);if(e.powerKwMin!==null&&e.powerKwMax!==null)assert(e.powerKwMin<=e.powerKwMax);if(e.displacementCc!==null)assert([1289,1498,1984].includes(e.displacementCc),'exact cc needs factual evidence');}
  assert(g.trims===null||Array.isArray(g.trims));
  trimCount+=g.trims?.length||0;
  for(const t of g.trims||[]){
   for(const k of ['consumptionCycle','rangeCycle','massBasis'])assert(t[k]===null||typeof t[k]==='string'&&t[k].length>0,'missing/invalid '+k);
   for(const k of ['consumptionKwh100','rangeKm'])assert(t[k]===null||typeof t[k]==='number'&&t[k]>0,'missing/invalid '+k);
   if(t.consumptionL100!==null||t.consumptionKwh100!==null)assert(t.consumptionCycle,'consumption without cycle/scope');
   if(t.rangeKm!==null)assert(t.rangeCycle,'range without cycle');
   if(t.engine.fuel!=='electric'&&t.engine.fuel!=='petrol-phev'){assert.equal(t.consumptionKwh100,null);assert.equal(t.rangeKm,null);}
  }
  validateFieldSources(g);for(const t of g.trims||[])validateFieldSources(t);
  for(const t of g.trims||[]){assert(['technical-version','engine-version'].includes(t.kind));assert(t.name);assert(t.bodyType===null||bodies.has(t.bodyType));assert(t.drive===null||['fwd','rwd','awd','rr'].includes(t.drive));assert(t.engine.fuel===null||fuels.has(t.engine.fuel));assert(t.sources.length>0);for(const u of t.sources)assert(known.has(u),'unknown trim source '+u);for(const n of Object.values(t.engine))if(typeof n==='number')assert(n>0);for(const n of Object.values(t.dimensionsMm))assert(n===null||Number.isInteger(n)&&n>500&&n<7000);for(const k of ['massKg','topSpeedKmh','acceleration0to100s','consumptionL100'])assert(t[k]===null||typeof t[k]==='number'&&t[k]>0);if(t.engine.fuel==='electric'){assert.equal(t.engine.displacementCc,null);assert.equal(t.consumptionL100,null);}if(t.from!==null&&t.to!==null)assert(t.from<=t.to);}
  if(g.photo){photoCount++;const p=g.photo,s=photoEvidence.files[p.file];assert(s,'unretrieved photo '+p.file);assert(/\.(?:jpe?g|png|webp)$/i.test(p.file),'photo must be a raster image');assert.equal(p.source,'commons');assert.equal(p.filePageUrl,s.filePageUrl);assert.equal(p.url,s.url.split('?')[0]);assert.equal(p.licence,s.licence);assert.equal(p.licenceUrl,s.licenceUrl);assert(p.author&&p.credit.includes(p.author));assert(/^CC BY|^CC0|^Public domain/.test(p.licence));assert(!/Showcar|concept|Volkswagen|prototype/i.test(p.file));assert(['pending','reviewed'].includes(p.visualReview));if(p.visualReview==='reviewed'){const review=read('analysis/codex/skoda-step5-photo-review.json');assert(review.decisions.some(r=>r.lineSlug===c.lineSlug&&r.generationIndex===j&&r.file===p.file&&r.decision==='passed'));assert.equal(p.reviewedAt,review.reviewedAt);assert(p.reviewNoteCs);}}
 }
 function check(v,path){if(v===null){const m=path.match(/^generations\[(\d+)\]/);const g=m?c.generations[+m[1]]:null;if(path.endsWith('.to')&&g?.productionStatus==='current')return;if(/engines\[\d+\]\.displacement(?:Cc|LitresNominal)$/.test(path)){const em=path.match(/engines\[(\d+)\]/);if(g?.engines?.[+em[1]].fuel==='electric')return;}assert(c.needsReview.some(r=>r.field===path),'unmarked null '+c.lineSlug+' '+path);return;}if(Array.isArray(v))v.forEach((x,k)=>check(x,path+'['+k+']'));else if(typeof v==='object')for(const[k,x]of Object.entries(v))check(x,path?path+'.'+k:k);}
 check({segment:c.segment,summaryCs:c.summaryCs,generations:c.generations},'');
}
assert.deepEqual([...seen].sort(),lines.map(l=>l.slug).sort());
const o=cards.find(c=>c.lineSlug==='octavia').generations[3];assert(o.engines.some(e=>e.displacementCc===1498&&e.powerKwMax===110));
const el=cards.find(c=>c.lineSlug==='elroq').generations[0];assert.equal(el.trunkL,470);assert.equal(el.specificationScope.modelYear,2025);
assert.deepEqual(el.trims.map(t=>[t.consumptionKwh100,t.rangeKm]),[[15.7,377],[15.7,430],[15.2,574],[16.2,549]]);
assert.equal(cards.find(c=>c.lineSlug==='110-r').generations[0].trims[0].acceleration0to100s,null,'unresolved 18.5/19 conflict');
const named100=cards.find(c=>c.lineSlug==='100-110').generations[0].trims;assert.deepEqual(named100.map(t=>t.name),['100','100 L','110 L','110 LS']);assert.equal(named100[0].engine.powerStandard,'ISO');assert.equal(named100[0].massKg,805);assert.equal(named100[0].acceleration0to100s,null);
assert.equal(cards.find(c=>c.lineSlug==='favorit').generations[0].trims.find(t=>t.name==='136 L').engine.powerKw,null,'conflicting Favorit power must remain null');
console.log(`${cards.length} cards, ${generations} generations/families, ${photoCount} Commons references, ${engines} partial engine records, ${trimCount} selected version records validated.`);
console.log('UTF-8, existing/addition slugs, explicit unknowns, source references, dimensions/engine units, photo metadata/licences and scoped OEM examples passed. Photos remain external references; reviewed originals were viewed from temporary storage.');
