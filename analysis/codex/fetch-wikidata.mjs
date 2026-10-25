import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {archive} from './raw-data.mjs';
export const root='analysis/codex';
export async function query(name,sparql) {
 const cached=archive().queries[name];
 if(cached?.sparql.trim()===sparql.trim()&&cached.result)return cached.result;
 if(cached)name+='-'+createHash('sha256').update(sparql).digest('hex').slice(0,8);
 const renamed=archive().queries[name];
 if(renamed?.sparql.trim()===sparql.trim()&&renamed.result)return renamed.result;
 fs.mkdirSync(`${root}/queries`,{recursive:true}); fs.mkdirSync(`${root}/raw`,{recursive:true});
 const previous=`${root}/queries/${name}.sparql`;
 if(fs.existsSync(previous)&&fs.readFileSync(previous,'utf8')!==sparql+'\n') name+='-'+createHash('sha256').update(sparql).digest('hex').slice(0,8);
 fs.writeFileSync(`${root}/queries/${name}.sparql`,sparql+'\n');
 const path=`${root}/raw/${name}.json`; if(fs.existsSync(path)) return JSON.parse(fs.readFileSync(path));
 const url='https://query.wikidata.org/sparql?format=json&query='+encodeURIComponent(sparql);
 for(let attempt=0;attempt<3;attempt++) {
  const start=new Date().toISOString();
  try { const response=await fetch(url,{headers:{Accept:'application/sparql-results+json','User-Agent':'VozodromCatalogResearch/1.0 (noncommercial research)'},signal:AbortSignal.timeout(90000)}); const body=await response.text();
   fs.appendFileSync(`${root}/retrievals.jsonl`,JSON.stringify({name,start,status:response.status})+'\n');
   if(!response.ok) throw Error(body.slice(0,300)); const data=JSON.parse(body); fs.writeFileSync(path,JSON.stringify(data,null,2)+'\n'); console.log(name,data.results.bindings.length); return data;
  } catch(e) {console.error(name,attempt,e.message); if(attempt===2) throw e; await new Promise(r=>setTimeout(r,5000*(attempt+1)));}
 }
}
if(process.argv[2]==='makes') {
 const classes={auto:'Q786820',moto:'Q15081030',trucks:'Q108460239',buses:'Q4380190',tyres:'Q20032039'};
 for(const [section,cls] of Object.entries(classes)) await query('makes-'+section,`SELECT DISTINCT ?item ?itemLabel ?country ?countryLabel ?founded ?dissolved WHERE {
 ?item wdt:P31 wd:${cls}.
 OPTIONAL { ?item wdt:P17 ?country. } OPTIONAL { ?item wdt:P571 ?founded. } OPTIONAL { ?item wdt:P576 ?dissolved. }
 SERVICE wikibase:label { bd:serviceParam wikibase:language "cs,en". }
} ORDER BY ?item`);
}
