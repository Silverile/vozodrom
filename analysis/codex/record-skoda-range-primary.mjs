import fs from 'node:fs';
import {urls} from './skoda-trim-facts.mjs';
const path='analysis/codex/model-line-primary-facts.json',d=JSON.parse(fs.readFileSync(path,'utf8'));
for(const[url,production]of [[urls.fourR,'4R 1928–1930'],[urls.early,'L&K Škoda 110 1925–1929; 422 1930–1932; 860 1929–1933'],[urls.rapidIndia,'Rapid India series production began October 2011']]){let s=d.sources.find(s=>s.url===url);if(!s){s={url,publisher:'Škoda Auto / official importer',retrievedDate:'2026-10-26',facts:{}};d.sources.push(s);}s.facts.production=production;}
fs.writeFileSync(path,JSON.stringify(d,null,2)+'\n');
