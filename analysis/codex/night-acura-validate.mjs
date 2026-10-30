import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>JSON.parse(new TextDecoder('utf8',{fatal:true}).decode(fs.readFileSync(p)));
const cards=read('src/data/catalog/model-cards/acura.json'),report=read('analysis/codex/night-acura-report.json');
const prior=fs.existsSync('src/data/model-cards/acura.json')?read('src/data/model-cards/acura.json'):[];
const seen=new Set(),bodies=new Set(['hatchback','kombi','sedan','suv','mpv','kupe','kabriolet','pickup','dodavka']);
let generations=0,versions=0,dims=0,masses=0;
for(const [i,c]of cards.entries()){
 assert.equal(c.makeSlug,'acura');assert.equal(c.isAddition,true);assert(!seen.has(c.lineSlug));seen.add(c.lineSlug);assert(!prior.some(p=>p.lineSlug===c.lineSlug));if(i)assert(cards[i-1].lineSlug.localeCompare(c.lineSlug,'en')<0);
 assert.equal(c.coverage,'pilot-partial');assert(c.summaryCs.length>70);assert(c.summaryCs.split(/[.!?](?:\s|$)/).filter(s=>s.trim()).length>=2);assert(c.sources.length);assert(report.proposedLines.some(l=>l.slug===c.lineSlug));
 for(const g of c.generations){generations++;assert(g.bodyTypes.every(b=>bodies.has(b)));assert(g.markets.length>0);assert(g.specificationScope.market);assert(g.sources.length);assert.equal(g.photo,null);assert(g.to!==null||g.productionStatus==='unknown'||g.productionStatus==='current');if(g.from!==null&&g.to!==null)assert(g.from<=g.to);
  for(const key of ['code','name','from','to','productionStatus','facelift','bodyTypes','engines','engineCoverage','drivetrains','transmissions','dimensionsMm','specificationScope','trunkL','markets','marketNotesCs','photo','sources','trims'])assert(Object.hasOwn(g,key));
  for(const t of g.trims||[]){versions++;assert.equal(t.kind,'technical-version');assert(bodies.has(t.bodyType));assert(t.specificationScope.market&&t.specificationScope.modelYear);assert(t.sources.every(u=>/^https:\/\/(?:acuranews\.com|global\.honda)\//.test(u)),'nonprimary technical source');
   for(const key of ['name','kind','from','to','bodyType','engine','transmission','drive','dimensionsMm','massKg','massBasis','topSpeedKmh','acceleration0to100s','consumptionL100','consumptionCycle','consumptionKwh100','rangeKm','rangeCycle','specificationScope','sources'])assert(Object.hasOwn(t,key),'missing trim '+key);
   for(const [field,urls]of Object.entries(t.fieldSources||{})){const value=field.split('.').reduce((o,k)=>o?.[k],t);assert(value!==null&&value!==undefined,'orphan source '+field);assert(urls.length&&urls.every(u=>t.sources.includes(u)));}
   if(Object.values(t.dimensionsMm).every(v=>v!==null))dims++;if(t.massKg!==null){masses++;assert(t.massBasis);}assert(t.consumptionL100===null||t.consumptionCycle);assert(t.rangeKm===null||t.rangeCycle);assert.equal(t.engine.powerKw,null,'No implicit hp conversion');
  }
 }
 function walk(v,path){if(v===null)assert(c.needsReview.some(r=>r.field===path&&typeof r.reason==='string'),'unreviewed null '+c.lineSlug+' '+path);else if(Array.isArray(v))v.forEach((x,i)=>walk(x,path+'['+i+']'));else if(typeof v==='object')for(const[k,x]of Object.entries(v))walk(x,path?path+'.'+k:k);}
 walk({segment:c.segment,summaryCs:c.summaryCs,generations:c.generations},'');
}
assert.equal(cards.length,20);assert.equal(report.counts.cards,cards.length);assert.equal(report.counts.generations,generations);assert.equal(report.counts.technicalVersions,versions);assert.equal(cards.find(c=>c.lineSlug==='cl').generations[0].trims[1].massKg,null);assert.equal(cards.find(c=>c.lineSlug==='adx').generations[0].trims[0].transmission.type,null);assert.equal(cards.find(c=>c.lineSlug==='nsx').generations[1].trims[0].engine.fuel,null);
console.log(`PASS: ${cards.length} Acura cards,${generations} generation/family records,${versions} primary-source versions,${dims} full metric dimension sets,${masses} sourced curb masses,0 unreviewed photos. All20 proposed lines,unique slugs,UTF8,null reviews,market/model-year scopes and conflict safeguards checked.`);
