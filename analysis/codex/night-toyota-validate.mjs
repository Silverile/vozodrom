import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(fs.readFileSync(p)));
const cards=read('src/data/catalog/model-cards/toyota.json'),prior=read('src/data/model-cards/toyota.json'),report=read('analysis/codex/night-toyota-report.json');
const old=new Set(prior.map(c=>c.lineSlug)),seen=new Set(),bodies=new Set(['hatchback','kombi','sedan','suv','mpv','kupe','kabriolet','pickup','dodavka']);
let generations=0,versions=0,fullDimensions=0,masses=0;
function sourced(record){for(const [path,urls]of Object.entries(record.fieldSources||{})){const v=path.split('.').reduce((a,k)=>a?.[k],record);assert(v!==null&&v!==undefined,'orphan field source '+path);assert(urls.length>0);assert(urls.every(u=>record.sources.includes(u)),'field source missing in record.sources '+path);}}
for(const [i,c]of cards.entries()){
 assert.equal(c.makeSlug,'toyota');assert(!old.has(c.lineSlug),'duplicate Claude line');assert(!seen.has(c.lineSlug));seen.add(c.lineSlug);if(i)assert(cards[i-1].lineSlug.localeCompare(c.lineSlug,'en')<0);
 assert.equal(c.coverage,'pilot-partial');assert(c.summaryCs.length>70);assert(c.summaryCs.split(/[.!?](?:\s|$)/).filter(s=>s.trim()).length>=2);assert(c.sources.length);
 assert(report.proposedLines.some(l=>l.slug===c.lineSlug)||!c.isAddition);
 for(const g of c.generations){generations++;assert(g.bodyTypes?.every(b=>bodies.has(b)));assert(g.sources.length);assert(['ended','unknown','current'].includes(g.productionStatus));if(g.to!==null)assert(g.from<=g.to);assert.equal(g.photo,null,'unreviewed photo must stay null');sourced(g);
  for(const k of ['code','name','from','to','productionStatus','facelift','bodyTypes','engines','engineCoverage','drivetrains','transmissions','dimensionsMm','specificationScope','trunkL','markets','marketNotesCs','photo','sources','trims'])assert(Object.hasOwn(g,k),'missing generation '+k);
  for(const t of g.trims||[]){versions++;assert.equal(t.kind,'technical-version');assert(bodies.has(t.bodyType));assert(t.specificationScope.market);assert(t.sources.length);sourced(t);for(const k of ['name','kind','from','to','bodyType','engine','transmission','drive','dimensionsMm','massKg','massBasis','topSpeedKmh','acceleration0to100s','consumptionL100','consumptionCycle','consumptionKwh100','rangeKm','rangeCycle','specificationScope','sources'])assert(Object.hasOwn(t,k),'missing trim '+k);
   for(const v of Object.values(t.dimensionsMm))assert(v===null||Number.isInteger(v)&&v>500&&v<7000);if(Object.values(t.dimensionsMm).every(v=>v!==null))fullDimensions++;if(t.massKg!==null){masses++;assert(t.massBasis);assert(t.massKg>0);}assert(t.consumptionL100===null||t.consumptionCycle);assert(t.rangeKm===null||t.rangeCycle);assert.equal(t.engine.powerKw,null,'do not silently convert PS');
  }
 }
 function nulls(v,p){if(v===null){assert(c.needsReview.some(r=>r.field===p&&typeof r.reason==='string'),'unmarked null '+c.lineSlug+' '+p);}else if(Array.isArray(v))v.forEach((x,i)=>nulls(x,p+'['+i+']'));else if(typeof v==='object')for(const[k,x]of Object.entries(v))nulls(x,p?p+'.'+k:k);}
 nulls({segment:c.segment,summaryCs:c.summaryCs,generations:c.generations},'');
}
assert.equal(cards.length,report.counts.newCards);assert.equal(generations,report.counts.generations);assert.equal(versions,report.counts.technicalVersions);
for(const slug of ['crown','corona','publica','cressida','masterline']){const l=report.proposedLines.find(l=>l.slug===slug);assert.equal(l.to,null);assert.equal(l.productionStatus,'unknown');}
console.log(`PASS: ${cards.length} cards, ${generations} scoped generations, ${versions} versions; ${fullDimensions} complete dimensions, ${masses} sourced curb masses. No overlap with ${prior.length} Claude cards. All nulls reviewed, no unreviewed photos, no PS-to-kW conversion.`);
