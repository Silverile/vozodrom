import assert from 'node:assert/strict';
import {imageCandidates,bindOfficialModel} from './crawl_front_manufacturer.mjs';
import {catalog} from './front_catalog.mjs';
import {Client} from './front_source_client.mjs';
const all=catalog({wave:1});
assert.equal(bindOfficialModel('Fabia',all,'skoda').match.id,'skoda--fabia--3');
assert.equal(bindOfficialModel('Fabia',all,'skoda',{archive:true}).match,null);
assert.equal(bindOfficialModel('Fabia I 6Y 2000',all,'skoda',{archive:true}).match.id,'skoda--fabia--0');
assert.equal(bindOfficialModel('Fabia 1950',all,'skoda').match,null,'Explicit conflicting years must not fall back to current generation');
assert.equal(bindOfficialModel('Corolla Cross',all,'toyota').match,null);
const html='<div data-config="{&quot;ImageUrl&quot;:&quot;https://cdn.example.org/front.jpg&quot;,&quot;altText&quot;:&quot;Fabia front&quot;}"></div><img src="https://cdn.example.org/interior.jpg" alt="Volant a dotykový displej"><img src="https://cdn.example.org/logo.svg">';
const images=imageCandidates(html,'https://example.org/');assert.equal(images.length,1);assert.equal(images[0].rank,100);assert.equal(images[0].extraction,'embedded-json');
assert.equal(imageCandidates('<img src="https://images.example.org/asset:%7Bviewport%7D.jpg">','https://example.org/').length,0,'Unexpanded asset templates must never be requested');
const original=globalThis.fetch;try{globalThis.fetch=async()=>new Response('unavailable',{status:400});const c=new Client({hosts:['example.org']});const policy=await c.policy('https://example.org');assert.equal(policy.status,400);assert.equal(policy.rules.length,0);}finally{globalThis.fetch=original;}
console.log('PASS: current/archived official model binding, explicit generation identity, embedded JSON images, interior/SVG rejection, robots 400 unavailable');
