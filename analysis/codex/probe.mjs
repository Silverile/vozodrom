const q = 'SELECT ?item ?itemLabel WHERE { VALUES ?item { wd:Q29637 wd:Q190464 } SERVICE wikibase:label { bd:serviceParam wikibase:language "cs,en". } }';
for (const url of ['https://query.wikidata.org/sparql?format=json&query='+encodeURIComponent(q), 'https://www.wikidata.org/wiki/Special:EntityData/Q29637.json']) {
 try { const r=await fetch(url,{signal:AbortSignal.timeout(40000),headers:{'User-Agent':'VozodromCatalogResearch/1.0','Accept':'application/sparql-results+json'}}); console.log(r.status,(await r.text()).slice(0,2000)); } catch(e) {console.log(e,e.cause);}
}
