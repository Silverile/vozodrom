import fs from 'node:fs';
import assert from 'node:assert/strict';
import {readRaw,rawNames} from './raw-data.mjs';
const load=n=>JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(fs.readFileSync(n)));
const root='src/data/catalog';
const makes=load(`${root}/makes.json`), coverage=load('analysis/codex/coverage.json');
const raw=n=>readRaw(n).results.bindings;
const v=(r,k)=>r[k]?.value??null;
const q=u=>u?.split('/').at(-1);
const validSlug=s=>/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);
const sorted=rs=>rs.every((r,i)=>i===0||rs[i-1].slug<=r.slug);
const unique=rs=>new Set(rs).size===rs.length;
// Corporate mergers and discontinued marques need not have Wikidata P576.
const statusEvidence=load('analysis/codex/catalog-status-evidence.json');
for(const e of statusEvidence){assert(makes.some(m=>m.slug===e.makeSlug&&m.qid===e.qid&&m.status===e.status));assert.equal(e.status,'defunct');assert(['company-merged','brand-production-ended'].includes(e.basis));assert(/^\d{4}-\d{2}-\d{2}$/.test(e.eventDate));assert(/^https:\/\//.test(e.source));assert(e.evidence.length>40);}
assert(unique(statusEvidence.map(e=>e.qid)));
const facts=rawNames().filter(n=>n.startsWith('selected-facts-')).flatMap(n=>readRaw(n).results.bindings);
const body=new Set(['hatchback','kombi','sedan','suv','mpv','kupe','kabriolet','pickup','dodavka']);
assert.equal(makes.length,coverage.makes);assert(sorted(makes));assert(unique(makes.map(m=>m.slug)));assert(unique(makes.map(m=>m.qid)));
for(const m of makes){assert(validSlug(m.slug));assert(/^Q\d+$/.test(m.qid));assert(['defunct',null].includes(m.status));assert(m.status!=='defunct'||(facts.some(r=>q(v(r,'item'))===m.qid&&v(r,'dissolved'))||statusEvidence.some(e=>e.qid===m.qid&&e.makeSlug===m.slug)));assert(m.sections.every(s=>['auto','moto','technika','pneu'].includes(s)));assert.equal(m.sourceUrl,'https://www.wikidata.org/wiki/'+m.qid);}
if(process.argv.includes('--makes-only')){console.log(`${makes.length} makes validated, including sourced merger/marque-production status evidence.`);process.exit(0);}
const gen=raw('explicit-generations');
for(const section of ['auto','moto']){
 const models=load(`${root}/models-${section}.json`),source=raw('models-'+section),dates=raw('dates-'+section);
 const excluded=load(`analysis/codex/excluded-models-${section}.json`);
 assert(sorted(models));assert(unique(models.map(m=>m.qid)));assert(unique(models.map(m=>m.makeSlug+'/'+m.slug)));
 assert.equal(models.length,coverage.models[section].included);assert.equal(models.length+excluded.length,new Set(source.map(r=>v(r,'item'))).size);
 for(const m of models){assert(validSlug(m.slug));const make=makes.find(x=>x.slug===m.makeSlug);assert(make?.sections.includes(section));assert(source.some(r=>q(v(r,'item'))===m.qid));assert(m.body===null||body.has(m.body));assert(m.bodyTypes===null||m.bodyTypes.every(b=>body.has(b)));assert.equal(m.sourceUrl,'https://www.wikidata.org/wiki/'+m.qid);
  for(const [key,p] of [['productionStart','P580'],['productionEnd','P582'],['inceptionYear','P571'],['discontinuedYear','P2669']])if(m[key]!==null){assert(Number.isInteger(m[key]));assert(dates.some(r=>q(v(r,'item'))===m.qid&&q(v(r,'property'))===p&&Number(v(r,'date')?.slice(0,4))===m[key]));}
  if(m.generations)for(const g of m.generations){assert(models.some(c=>c.qid===g.qid&&c.makeSlug===m.makeSlug&&c.seriesQids.includes(m.qid)));assert(gen.some(r=>q(v(r,'item'))===g.qid));}
  for(const forbidden of ['registered','stk','ownerScore','reviews','newPrice','price','failRate'])assert(!(forbidden in m));
 }
 console.log(`${section}: ${models.length} records, ${excluded.length} exclusions; source, references, slugs, dates, generation links and absence of demo statistics verified`);
}
for(const s of ['auto','moto','technika','pneu'])assert.equal(makes.filter(m=>m.sections.includes(s)).length,coverage.sections[s]);
console.log(`${makes.length} makes; all catalog validation checks passed`);
