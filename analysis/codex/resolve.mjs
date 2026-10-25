import fs from 'node:fs';
import {rawNames,readRaw} from './raw-data.mjs';
import {sections,overrides,excluded} from './selection.mjs';
const raw=rawNames().filter(n=>n.startsWith('selected-labels-')||n.startsWith('selected-aliases-')||n.startsWith('selected-defaults-')||n.startsWith('selected-search-')||n==='followup-labels.json'||n==='search-moto.json').flatMap(n=>readRaw(n).results.bindings);
const candidates=readRaw('makes-auto').results.bindings.concat(readRaw('makes-direct').results.bindings);
const qid=r=>r.item.value.split('/').at(-1);
const out=[]; const missing=[];
for(const name of [...new Set(Object.values(sections).flat())]) {
 if(excluded.has(name))continue;
 let matches=raw.filter(r=>r.seed.value.toLowerCase()===name.toLowerCase());
 matches=matches.concat(candidates.filter(r=>r.itemLabel.value.toLowerCase()===name.toLowerCase()));
 let ids=[...new Set(matches.map(qid))];
 const types=new Set(['Q786820','Q15081030','Q108460239','Q4380190','Q20032039','Q10429667']);
 const scored=ids.map(id=>{const rs=matches.filter(r=>qid(r)===id);const d=rs.find(r=>r.description)?.description.value||'';return {id,d,score:(rs.some(r=>types.has(r.class?.value.split('/').at(-1)))?5:0)+(/company|manufactur|marque|brand|automaker|automotive|tire|tyre|machinery|tractors|motorcycles|industrial group/i.test(d)?3:0)-(/disambiguation|family name|given name|model |car model|film|album|sports club|ship |village|city|town |racing team|chassis constructor|series of|bicycle/i.test(d)?20:0)};}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||Number(a.id.slice(1))-Number(b.id.slice(1)));
 let id=overrides[name] || scored[0]?.id;
 if(!id) missing.push({name,candidates:ids.map(id=>({id,description:matches.find(r=>qid(r)===id)?.description?.value,label:matches.find(r=>qid(r)===id)?.itemLabel?.value}))});
 else out.push({seed:name,qid:id,sections:Object.entries(sections).filter(([s,ns])=>ns.includes(name)).map(([s])=>s),relatedQids:scored.filter(x=>x.id!==id&&/automobile|automotive|car brand|motorcycle|motor vehicle/i.test(x.d)).map(x=>x.id)});
}
fs.writeFileSync('analysis/codex/resolved.json',JSON.stringify(out,null,2)+'\n'); fs.writeFileSync('analysis/codex/unresolved.json',JSON.stringify(missing,null,2)+'\n');console.log('resolved',out.length,'unresolved',missing.length);console.log('MISSING',missing.map(x=>x.name).join('|'));for(const r of out) console.log(r.seed,r.qid,raw.find(x=>qid(x)===r.qid)?.description?.value||candidates.find(x=>qid(x)===r.qid)?.itemLabel?.value);
