import fs from 'node:fs';import zlib from 'node:zlib';import assert from 'node:assert/strict';import crypto from 'node:crypto';
const root='analysis/codex/generation-facts-pass/top-100',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n'),base=JSON.parse(zlib.gunzipSync(fs.readFileSync(root+'/baseline.json.gz'))),selection=read(root+'/selection.json');
const facts=[...read(root+'/array-facts.json'),...read(root+'/manual-facts.json')],key=r=>(r.id??r.make+'/'+r.line)+'/'+r.index;
const seen=new Set(),unique=facts.filter(r=>{const k=key(r)+'/'+r.field+'/'+JSON.stringify(r.value);if(seen.has(k))return false;seen.add(k);return true;});
write(root+'/facts.json',unique);
const origin=new Map(),documents=new Map();
for(const[p,cards]of Object.entries(base))if(/^src\/data\/(?:catalog\/)?model-cards\//.test(p)){documents.set(p,structuredClone(cards));for(const c of documents.get(p))origin.set(c.makeSlug+'/'+c.lineSlug,{c,path:p});}
const touched=new Set(),changed=[];
for(const r of selection){const id=r.make+'/'+r.line,{c,path}=origin.get(id),g=c.generations[r.index],rows=unique.filter(f=>key(f)===key(r));if(!rows.length)continue;
 const fields=[...new Set(rows.map(f=>f.field))];
 for(const field of fields){assert(r.missing.includes(field),key(r)+' overwrites a populated field '+field);const values=rows.filter(f=>f.field===field);if(['drivetrains','transmissions'].includes(field)){assert(!g[field]?.length);g[field]=values.map(f=>f.value);}else if(field.startsWith('dimensionsMm.')){g.dimensionsMm??={length:null,width:null,height:null,wheelbase:null};assert(g.dimensionsMm[field.split('.')[1]]==null);assert.equal(values.length,1);g.dimensionsMm[field.split('.')[1]]=values[0].value;}else{assert.equal(field,'trunkL');assert(g.trunkL==null);assert.equal(values.length,1);g.trunkL=values[0].value;}}
 g.generationFactEvidence=[...(g.generationFactEvidence??[]),...rows.map(f=>({field:f.field,value:f.value,sources:[f.source],method:f.method,anchor:f.anchor,noteCs:f.note,...(f.scope?{scope:f.scope}:{}),...(f.technicalVersionProof?{technicalVersionProof:f.technicalVersionProof}:{})}))];
 g.generationFactCoverage={...(g.generationFactCoverage??{}),...Object.fromEntries(fields.map(f=>[f,['drivetrains','transmissions'].includes(f)?'documented-variants-only':f==='dimensionsMm.width'&&rows.find(r=>r.field===f)?.scope?.bodyType.includes('/')?'common-body-component':'standard-body-reference']))};
 for(const f of rows)for(const o of[c,g]){o.sources??=[];if(!o.sources.includes(f.source))o.sources.push(f.source);}
 const remove=[...fields,...(g.dimensionsMm&&['length','width','height','wheelbase'].every(f=>g.dimensionsMm[f]!=null)?['dimensionsMm']:[])];
 if(c.needsReview)c.needsReview=c.needsReview.filter(n=>!remove.some(f=>n.field===`generations[${r.index}].${f}`));
 touched.add(path);changed.push({...r,fields});
}
const validatedHashes=fs.existsSync(root+'/approved-file-hashes.json')?read(root+'/approved-file-hashes.json'):{};
for(const p of touched){const current=read(p);if(JSON.stringify(current)!==JSON.stringify(base[p]))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),validatedHashes[p],'Concurrent/unvalidated data edit: '+p);write(p,documents.get(p));}
write(root+'/changes.json',{selected:selection.length,generationsChanged:changed.length,facts:unique.length,fieldSlotsFilled:changed.reduce((n,r)=>n+r.fields.length,0),sourceFiles:[...touched].sort(),changed});console.log({selected:selection.length,generationsChanged:changed.length,facts:unique.length,sourceFiles:touched.size});
