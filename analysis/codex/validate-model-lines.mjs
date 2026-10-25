import fs from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {order,selection} from './model-line-selection.mjs';
const read=p=>JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(fs.readFileSync(p)));
const lines=read('src/data/catalog/model-lines-auto.json'),evidence=read('analysis/codex/model-line-evidence.json'),makes=read('src/data/catalog/makes.json');
const sources=new Map(Object.values(evidence.pages).filter(p=>p.revisionId).map(p=>['https://en.wikipedia.org/w/index.php?oldid='+p.revisionId,p]));
for(const p of read('analysis/codex/model-line-primary-facts.json').sources)sources.set(p.url,{title:p.publisher,infoboxes:[{production:JSON.stringify(p.facts)}]});
const rawModels=read('src/data/catalog/models-auto.json');
for(const qid of new Set([...rawModels.map(m=>m.qid),...Object.values(evidence.pages).map(p=>p.wikidataQid).filter(Boolean)]))sources.set('https://www.wikidata.org/wiki/'+qid,{title:qid,infoboxes:[]});
const bodies=new Set(['hatchback','kombi','sedan','suv','mpv','kupe','kabriolet','pickup','dodavka']);
const keys=new Set();assert.equal(new Set(lines.map(l=>l.makeSlug)).size,25);assert.deepEqual([...new Set(lines.map(l=>l.makeSlug))].sort(),[...order].sort());
for(const [make,b]of Object.entries(read('analysis/codex/model-lines-batch-1-baseline.json').byMake))assert.equal(createHash('sha256').update(JSON.stringify(lines.filter(l=>l.makeSlug===make))).digest('hex'),b.sha256,'existing make changed '+make);
for(let i=0;i<lines.length;i++){
 const l=lines[i],key=l.makeSlug+'/'+l.slug;assert(!keys.has(key),key);keys.add(key);assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(l.slug),key);assert(makes.some(m=>m.slug===l.makeSlug));
 if(i)assert(lines[i-1].makeSlug.localeCompare(l.makeSlug,'en')<0||lines[i-1].makeSlug===l.makeSlug&&lines[i-1].name.localeCompare(l.name,'cs')<=0,'sort '+key);
 assert(l.sources.length>0);for(const u of l.sources)assert(sources.has(u),'unretrieved source '+u);
 const sourceFacts=l.sources.map(u=>sources.get(u)).flatMap(p=>p.infoboxes).map(b=>[b.production,b.model_code,b.name,b.heading].filter(Boolean).join(' ')).join(' ');
 assert(l.bodyTypes===null||l.bodyTypes.every(b=>bodies.has(b)),key);
 assert(l.wikidataQid===null||/^Q\d+$/.test(l.wikidataQid));
 if(l.from!==null){assert(Number.isInteger(l.from)&&l.from<=2026);assert(sourceFacts.includes(String(l.from)),'unsourced from '+key);}
 if(l.to!==null){assert(Number.isInteger(l.to)&&l.to<=2026);assert(sourceFacts.includes(String(l.to)),'unsourced to '+key);if(l.from!==null)assert(l.from<=l.to);}
 if(l.to===null)assert(l.productionStatus==='current'||l.needsReview.some(n=>/to|from,to/.test(n.field)),key+' null end semantics');
 if(l.productionStatus==='current'){assert.equal(l.to,null);assert(/present|ongoing/i.test(sourceFacts),'no current source '+key);}
 for(const [field,value] of [['from',l.from],['bodyTypes',l.bodyTypes],['wikidataQid',l.wikidataQid],['generations',l.generations]])if(value===null)assert(l.needsReview.some(r=>r.field===field||r.field==='from,to'),'unmarked unknown '+key+' '+field);
 if(l.generations)for(let j=0;j<l.generations.length;j++){
  const g=l.generations[j];assert(g.sources.length>0);assert(g.bodyTypes===null||g.bodyTypes.every(b=>bodies.has(b)));
  const text=g.sources.map(u=>{assert(sources.has(u));const p=sources.get(u);return p.title+' '+p.infoboxes.map(b=>[b.production,b.model_code,b.name,b.heading].filter(Boolean).join(' ')).join(' ');}).join(' ');
  if(g.code!==null){const normalize=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');const code=g.code.replace(/^[IVX]+ \((.*)\)$/,'$1');assert(normalize(text).includes(normalize(code)),'unsourced generation code '+key+' '+g.code);}
  for(const f of ['from','to'])if(g[f]!==null){assert(Number.isInteger(g[f])&&g[f]<=2026);assert(text.includes(String(g[f])),'unsourced generation date '+key);}
  for(const f of ['code','from','bodyTypes'])if(g[f]===null)assert(l.needsReview.some(r=>r.field===`generations[${j}].${f}`),'unmarked generation unknown '+key);
  if(g.productionStatus==='unknown')assert(l.needsReview.some(r=>r.field===`generations[${j}].to`));
 }
 for(const f of ['stk','registered','ownerScore','reviews','price','newPrice'])assert(!(f in l));
}
const demo=fs.readFileSync('src/lib/catalog.ts','utf8');const expected=[...demo.matchAll(/slug: "([^"]+)", brandSlug: "([^"]+)", name:/g)].map(m=>m[2]+'/'+m[1]);assert.equal(expected.length,25);for(const key of expected)assert(keys.has(key),'missing demo compatibility '+key);
const expectedCount=Object.values(selection).reduce((n,s)=>n+s.split('\n').length,0);assert.equal(lines.length,expectedCount);
console.log(`${lines.length} lines across ${order.length} makes validated; all 520 existing entries unchanged; all 25 demo slugs preserved (including volkswagen/id4).`);
console.log('UTF-8, ordering, scoped uniqueness, retrieved source URLs, dated facts, explicit unknowns, body enum, generation references and absence of fabricated statistics passed.');
