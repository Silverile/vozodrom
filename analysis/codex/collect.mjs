import {query} from './fetch-wikidata.mjs';
await query('makes-direct',`SELECT DISTINCT ?item ?itemLabel ?class ?country ?countryLabel ?founded ?dissolved WHERE {
 VALUES ?class { wd:Q786820 wd:Q15081030 wd:Q108460239 wd:Q4380190 wd:Q20032039 wd:Q10429667 }
 ?item wdt:P31 ?class. OPTIONAL { ?item wdt:P17 ?country. } OPTIONAL { ?item wdt:P571 ?founded. } OPTIONAL { ?item wdt:P576 ?dissolved. }
 SERVICE wikibase:label { bd:serviceParam wikibase:language "cs,en". }
} ORDER BY ?item`);
await query('model-schema-sample',`SELECT ?item ?itemLabel ?p ?v ?vLabel WHERE { VALUES ?item {wd:Q223696 wd:Q9008} ?item ?p ?v. FILTER(STRSTARTS(STR(?p),STR(wdt:))) SERVICE wikibase:label {bd:serviceParam wikibase:language "en".} }`);
await query('models-auto',`SELECT DISTINCT ?item ?itemLabel ?class ?make ?brand ?series ?body ?bodyLabel ?start ?end ?code WHERE {
 VALUES ?class {wd:Q3231690 wd:Q59773381} ?item wdt:P31 ?class.
 OPTIONAL { ?item wdt:P176 ?make. } OPTIONAL { ?item wdt:P1716 ?brand. } OPTIONAL { ?item wdt:P179 ?series. }
 OPTIONAL { ?item wdt:P279 ?body. } OPTIONAL { ?item wdt:P2754 ?start. } OPTIONAL { ?item wdt:P2669 ?end. } OPTIONAL { ?item wdt:P528 ?code. }
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item`);
await query('models-moto',`SELECT DISTINCT ?item ?itemLabel ?class ?make ?brand ?series ?body ?bodyLabel ?start ?end ?code WHERE {
 VALUES ?class {wd:Q23866334 wd:Q71310524} ?item wdt:P31 ?class.
 OPTIONAL { ?item wdt:P176 ?make. } OPTIONAL { ?item wdt:P1716 ?brand. } OPTIONAL { ?item wdt:P179 ?series. }
 OPTIONAL { ?item wdt:P279 ?body. } OPTIONAL { ?item wdt:P2754 ?start. } OPTIONAL { ?item wdt:P2669 ?end. } OPTIONAL { ?item wdt:P528 ?code. }
 SERVICE wikibase:label {bd:serviceParam wikibase:language "cs,en".}
} ORDER BY ?item`);
