import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root='analysis/codex/generation-order-pass',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,(p.startsWith('src/data/stats/')?JSON.stringify(x):JSON.stringify(x,null,2))+'\n');
const q=read(root+'/queue.json'),queue=[...q.reversed,...q.mixed];assert.equal(queue.length,28);
const sourceFiles=['src/data/catalog/model-cards','src/data/model-cards'].flatMap(d=>fs.readdirSync(d).filter(f=>f.endsWith('.json')).map(f=>d+'/'+f));
const dataFiles=[...sourceFiles,...fs.readdirSync('src/data').filter(f=>f.endsWith('.json')).map(f=>'src/data/'+f),...fs.readdirSync('src/data/catalog').filter(f=>f.endsWith('.json')).map(f=>'src/data/catalog/'+f),...fs.readdirSync('src/data/stats').filter(f=>f.endsWith('.json')).map(f=>'src/data/stats/'+f)];
const snapshot=root+'/baseline.json.gz';assert(!fs.existsSync(snapshot),'Already applied: do not overwrite the baseline');
const base=Object.fromEntries(dataFiles.map(p=>[p,read(p)]));
const drawings=Object.fromEntries(fs.readdirSync('public/front').filter(f=>queue.some(r=>f.startsWith(r.make+'--'+r.line+'--'))).map(f=>['public/front/'+f,fs.readFileSync('public/front/'+f).toString('base64')]));
fs.writeFileSync(snapshot,zlib.gzipSync(JSON.stringify({data:base,drawings}),{level:9}));
const files=new Map(sourceFiles.map(p=>[p,structuredClone(base[p])])),changed=new Set(),mappings=[];
const order=gens=>gens.map((g,i)=>({g,i})).sort((a,b)=>(a.g.from??-Infinity)-(b.g.from??-Infinity)||a.i-b.i).map(x=>x.i);
const ids=g=>g.code??`${g.from??'?'}–${g.to??'?'}`;
const remapFields=(obj,map)=>{if(Array.isArray(obj))return obj.map(v=>remapFields(v,map));if(!obj||typeof obj!=='object')return obj;return Object.fromEntries(Object.entries(obj).map(([k,v])=>[k,/^(genIndex|generationIndex|generation_index|generationIdx|gen_index)$/.test(k)&&Number.isInteger(v)?(map[v]??v):k==='field'&&typeof v==='string'?v.replace(/generations\[(\d+)\]/g,(s,i)=>`generations[${map[Number(i)]??i}]`):remapFields(v,map)]));};
for(const r of queue){const candidates=sourceFiles.filter(p=>files.get(p).some(c=>c.makeSlug===r.make&&c.lineSlug===r.line));assert.equal(candidates.length,1);const p=candidates[0],cs=files.get(p),i=cs.findIndex(c=>c.makeSlug===r.make&&c.lineSlug===r.line),c=cs[i],before=structuredClone(c.generations),newToOld=order(before),oldToNew=Object.fromEntries(newToOld.map((old,now)=>[old,now]));
 c.generations=newToOld.map(old=>before[old]);cs[i]=remapFields(c,oldToNew);changed.add(p);
 mappings.push({make:r.make,line:r.line,file:p,kind:q.reversed.includes(r)?'reversed':'mixed-parallel-branches',newToOld,oldToNew,generations:before.map((g,oldIndex)=>({oldIndex,newIndex:oldToNew[oldIndex],code:g.code??null,name:g.name,from:g.from,to:g.to,id:ids(g)})),decision:'Stable oldest-start-year first; parallel body/region/technical branches retained separately. Equal start years preserve their original order; unknown-start KdF prehistory remains first.'});
}
const hyundaiPath=sourceFiles.find(p=>files.get(p).some(c=>c.makeSlug==='hyundai'&&c.lineSlug==='terracan')),hyundai=files.get(hyundaiPath);
const terracan=hyundai.find(c=>c.lineSlug==='terracan'),tg=terracan.generations[0],terracanSource='https://www.hyundai.com/worldwide/en/footer/corporate/vehicle-history/2000/terracan';
tg.to=2006;tg.sources=[...new Set([...tg.sources,terracanSource])];tg.specificationScope={...tg.specificationScope,noteCs:tg.specificationScope.noteCs+' Sériová výroba Hyundai Terracan v Koreji 2001–2006 podle historického archivu výrobce; pozdější prodej či první registrace není rok výroby.'};terracan.sources=[...new Set([...terracan.sources,terracanSource])];changed.add(hyundaiPath);
const addSource=(line,code,url)=>{const c=hyundai.find(c=>c.lineSlug===line),g=c.generations.find(g=>g.code===code);g.sources=[...new Set([...g.sources,url])];c.sources=[...new Set([...c.sources,url])];};
const sonataHistory='https://www.hyundai.com/kr/ko/brand/heritage/model/sonata-history.html';
for(const code of ['Y','Y2','Y3','EF','NF','YF','LF','DN8'])addSource('sonata',code,sonataHistory);
addSource('sonata','YF','https://www.vehiclerecalls.gov.au/recalls/rec-000621');
addSource('nexo','NH2','https://www.hyundai.com/worldwide/en/newsroom/detail/0000000927');
addSource('nexo','NH2','https://www.hyundai.gr/wp-content/uploads/2025/11/hyundai_nexo__rescue-sheet-suv_2025_5d_fcev_el-1_last.pdf');
addSource('tucson','NX5','https://www.hyundaiusa.com/us/en/vehicles/2027-tucson');
for(const p of changed)write(p,files.get(p));
// Public model-line definitions may group several body branches together. Sort their own
// records without replacing their stable codes/year ids with the finer model-card branches.
const raw=structuredClone(base['src/data/catalog/model-lines-auto.json']),rawMappings=[];
for(const r of queue){const l=raw.find(l=>l.makeSlug===r.make&&l.slug===r.line);if(!l?.generations?.length)continue;const before=l.generations,newToOld=order(before),map=Object.fromEntries(newToOld.map((old,now)=>[old,now]));l.generations=newToOld.map(old=>before[old]);const at=raw.indexOf(l);raw[at]=remapFields(l,map);rawMappings.push({make:r.make,line:r.line,newToOld,oldToNew:map});}
const tl=raw.find(l=>l.makeSlug==='hyundai'&&l.slug==='terracan');tl.to=2006;tl.productionPeriods=[{from:2001,to:2006}];tl.sources=[...new Set([...tl.sources,terracanSource])];
write('src/data/catalog/model-lines-auto.json',raw);
// Stats are aggregate buckets: the entire payload follows its original generation.
const statsChanges=[];for(const make of [...new Set(queue.map(r=>r.make))]){const p='src/data/stats/'+make+'.json';if(!base[p])continue;const s=structuredClone(base[p]);let touched=false;for(const r of mappings.filter(r=>r.make===make)){const l=s[r.line];if(!l?.gens)continue;l.gens=Object.fromEntries(Object.entries(l.gens).map(([old,v])=>{assert(r.oldToNew[old]!=null);return [r.oldToNew[old],v];}));touched=true;statsChanges.push({make,line:r.line,buckets:Object.keys(l.gens).length});}if(touched)write(p,s);}
const front=structuredClone(base['src/data/front-drawings.json']),holds=structuredClone(base['src/data/front-drawing-review.json']),moves=[];
for(const r of mappings){const key=r.make+'--'+r.line;if(front[key])front[key]=front[key].map(([old,a,b])=>[r.oldToNew[old],a,b]).sort((a,b)=>a[0]-b[0]);for(const k of Object.keys(base['src/data/front-drawing-review.json']))if(k.startsWith(key+'--')){const old=Number(k.slice(key.length+2));if(Number.isInteger(old)&&r.oldToNew[old]!=null){delete holds[k];}}for(const[k,v]of Object.entries(base['src/data/front-drawing-review.json']))if(k.startsWith(key+'--')){const old=Number(k.slice(key.length+2));if(Number.isInteger(old)&&r.oldToNew[old]!=null)holds[key+'--'+r.oldToNew[old]]=v;}
 for(const[p,encoded]of Object.entries(drawings)){const m=p.match(new RegExp('^public/front/'+key+'--(\\d+)(.*)$'));if(!m)continue;const old=Number(m[1]);assert(r.oldToNew[old]!=null);const dest='public/front/'+key+'--'+r.oldToNew[old]+m[2];assert(!fs.existsSync(dest)||Object.hasOwn(drawings,dest),'Do not overwrite unrelated asset');moves.push({from:p,to:dest,sha256:crypto.createHash('sha256').update(Buffer.from(encoded,'base64')).digest('hex')});}
}
// Read every source before writing destinations: permutations can form rename cycles.
for(const m of moves)fs.writeFileSync(m.to,Buffer.from(drawings[m.from],'base64'));
const destinations=new Set(moves.map(m=>m.to));for(const m of moves)if(!destinations.has(m.from))fs.unlinkSync(m.from);
write('src/data/front-drawings.json',front);write('src/data/front-drawing-review.json',holds);
const edits=read(root+'/production-edits.json'),remapped=structuredClone(edits);let editCount=0;for(const e of remapped.edits){if(e.genIndex==null)continue;const r=mappings.find(r=>r.make===e.makeSlug&&r.line===e.lineSlug);if(!r)continue;assert(r.oldToNew[e.genIndex]!=null);if(e.genIndex!==r.oldToNew[e.genIndex])editCount++;e.genIndex=r.oldToNew[e.genIndex];}
write(root+'/production-edits-remapped.json',remapped);
write(root+'/changes.json',{cards:28,generations:mappings.reduce((n,r)=>n+r.newToOld.length,0),sourceFiles:[...changed],mappings,rawMappings,statsChanges,drawingMoves:moves,productionEditsRemapped:editCount,dateCorrection:{make:'hyundai',line:'terracan',from:2001,to:2006,source:terracanSource},stableAliasesUnchanged:true,photosAndFaceliftStagesMoveWithGeneration:true});
console.log(JSON.stringify({cards:28,sourceFiles:changed.size,drawings:moves.length,statsLines:statsChanges.length,remappedProductionEdits:editCount}));
