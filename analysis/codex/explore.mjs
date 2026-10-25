import {query} from './fetch-wikidata.mjs';
import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync('analysis/codex/raw/makes-auto.json')).results.bindings;
const unique=[...new Map(data.map(x=>[x.item.value,x])).values()]; console.log('unique auto',unique.length); console.log(unique.map(x=>[x.item.value.split('/').at(-1),x.itemLabel.value]).filter(x=>/skoda|škoda|volkswagen|ford|lada|citro|toyota|tatra|trabant|wartburg|aro|mosk|bmw|mercedes|peugeot|lexus|audi|renault|honda/i.test(x[1])));
await query('sample-model-properties',`SELECT ?item ?itemLabel ?p ?v ?vLabel WHERE { VALUES ?make { wd:Q29637 } ?item wdt:P176 ?make. ?item ?p ?v. FILTER(STRSTARTS(STR(?p),STR(wdt:))) SERVICE wikibase:label { bd:serviceParam wikibase:language "cs,en". } } ORDER BY ?item LIMIT 300`);
await query('technical-classes',`SELECT ?item ?itemLabel WHERE { VALUES ?term { "tractor manufacturer"@en "agricultural machinery manufacturer"@en "construction equipment manufacturer"@en "trailer manufacturer"@en "automotive brand"@en "car brand"@en "body style"@en "production date"@en "production period"@en } ?item rdfs:label ?term. SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } }`);
