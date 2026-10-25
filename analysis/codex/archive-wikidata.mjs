import fs from 'node:fs';
import {gzipSync} from 'node:zlib';
import {archive} from './raw-data.mjs';
const root='analysis/codex';
const queries={...archive().queries};
for(const file of (fs.existsSync(`${root}/queries`)?fs.readdirSync(`${root}/queries`):[]).sort()){
 const name=file.replace(/\.sparql$/,'');const path=`${root}/raw/${name}.json`;
 queries[name]={sparql:fs.readFileSync(`${root}/queries/${file}`,'utf8'),result:fs.existsSync(path)?JSON.parse(fs.readFileSync(path)):null};
}
const snapshot={license:'CC0-1.0',endpoint:'https://query.wikidata.org/sparql',retrievals:fs.readFileSync(`${root}/retrievals.jsonl`,'utf8').trim().split('\n').map(JSON.parse),queries};
fs.writeFileSync(`${root}/wikidata-snapshot.json.gz`,gzipSync(JSON.stringify(snapshot),{level:9}));
const probes=[['connectivity-labels','SELECT ?item ?itemLabel WHERE { VALUES ?item { wd:Q29637 wd:Q190464 } SERVICE wikibase:label { bd:serviceParam wikibase:language "cs,en". } }'],['connectivity-item','SELECT ?x WHERE { VALUES ?x {wd:Q29637} }']];
fs.writeFileSync(`${root}/queries.md`,'# Exact Wikidata queries\n\nRetrieved 2026-10-25 UTC. The compressed snapshot contains matching JSON results and HTTP retrieval logs. Prefixes use the Wikidata Query Service defaults. Connectivity probes below were exploratory and are not catalogue evidence.\n\n'+probes.concat(Object.entries(queries).map(([n,v])=>[n,v.sparql])).map(([n,q])=>`## ${n}\n\n\`\`\`sparql\n${q.trim()}\n\`\`\`\n`).join('\n'));
console.log(Object.keys(queries).length+' queries/results archived; '+fs.statSync(`${root}/wikidata-snapshot.json.gz`).size+' bytes');
