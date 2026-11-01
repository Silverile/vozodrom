import fs from 'node:fs';
import assert from 'node:assert/strict';
const root='analysis/codex/generation-facts-pass/batch-1',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),facts=read(root+'/body-facts.json'),selected=read(root+'/selection.json'),key=r=>(r.id??r.make+'/'+r.line)+'/'+r.index;
const targets=new Set(selected.map(key)),byGeneration=new Map(),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
for(const r of facts){assert(targets.has(key(r)));const rows=byGeneration.get(key(r))??[];rows.push(r);byGeneration.set(key(r),rows);}
assert.equal(byGeneration.size,80);
const bodyOrder=['hatchback','sedan','kombi','suv','mpv','dodavka','kupe','kabriolet','pickup','liftback'];
const files=[...new Set(selected.map(r=>'src/data/catalog/model-cards/'+r.make+'.json'))],done=[];
for(const path of files){const cards=read(path);let changed=false;for(const c of cards){for(const[i,g]of c.generations.entries()){
 const id=c.makeSlug+'/'+c.lineSlug,rows=byGeneration.get(id+'/'+i);if(!rows)continue;assert(!(g.bodyTypes?.length),id+'/'+i+' already populated');
 const order=['skoda/1203','skoda/praktik','fiat/scudo','fiat/fiorino'].includes(id)?['dodavka',...bodyOrder.filter(b=>b!=='dodavka')]:bodyOrder;
 g.bodyTypes=rows.map(r=>r.value).sort((a,b)=>order.indexOf(a)-order.indexOf(b));assert.equal(new Set(g.bodyTypes).size,g.bodyTypes.length);
 g.bodyTypeCoverage='documented-variants-only';
 g.bodyTypeEvidence=g.bodyTypes.map(body=>{const r=rows.find(r=>r.value===body);return {bodyType:body,sources:[r.source],method:r.method,anchor:r.anchor,noteCs:r.note,...(r.technicalVersionProof?{technicalVersionProof:r.technicalVersionProof}:{})};});
 for(const source of rows.map(r=>r.source)){g.sources??=[];c.sources??=[];if(!g.sources.includes(source))g.sources.push(source);if(!c.sources.includes(source))c.sources.push(source);}
 if(c.needsReview)c.needsReview=c.needsReview.filter(r=>r.field!==`generations[${i}].bodyTypes`);
 done.push({...selected.find(r=>key(r)===id+'/'+i),bodyTypes:g.bodyTypes,bodyFacts:rows.length});changed=true;
 }}if(changed)write(path,cards);}
assert.equal(done.length,80);const remaining=read(root+'/untouched-queue.json');
write(root+'/changes.json',{generations:done.length,bodyFacts:facts.length,completed:done,sourceFiles:files});
write(root+'/remaining-queue.json',{completed:done,deferred:[],nextBodyTypes:remaining,scalarFactsStarted:false});
console.log({generations:done.length,bodyFacts:facts.length,sourceFiles:files.length,nextBodyTypes:remaining.length});
