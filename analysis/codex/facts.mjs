import fs from 'node:fs';
import {query} from './fetch-wikidata.mjs';
const ids=[...new Set(JSON.parse(fs.readFileSync('analysis/codex/resolved.json')).flatMap(x=>[x.qid,...x.relatedQids]))];
for(let i=0;i<ids.length;i+=100)await query('selected-facts-'+i/100,`SELECT DISTINCT ?item ?itemLabel ?enLabel ?description ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?item {${ids.slice(i,i+100).map(x=>'wd:'+x).join(' ')}}
 OPTIONAL {?item rdfs:label ?enLabel. FILTER(LANG(?enLabel)="en")} OPTIONAL {?item schema:description ?description. FILTER(LANG(?description)="en")}
 OPTIONAL {?item wdt:P17 ?country.} OPTIONAL {?item wdt:P571 ?founded.} OPTIONAL {?item wdt:P576 ?dissolved.}
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item`);
