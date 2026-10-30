import assert from 'node:assert/strict';
import {toyotaFrameUrls,toyotaState,configuratorFrames} from './front_configurator.mjs';
import {Client} from './front_source_client.mjs';

const state={commonSettings:{ccisPath:'//images.toyota-europe.com',country:'cz',enableTokens:true,query:{},modelMap:{corolla:{id:'model',token:'token'}}},car:{id:'vehicle',model:{id:'model'},colour:{code:'040'}}};
const js='t.getCarImage=(e,t,n,r={},a={},l=o.ImageMode.Exterior) n,r=36,o)';
const frames=toyotaFrameUrls(state,js);assert.equal(frames.length,36);assert.equal(frames[0].url,'https://images.toyota-europe.com/cz/product-token/token/vehicle/vehicle/width/1140/height/426/scale-mode/1/padding/0/image-quality/75/day-exterior-0_040.jpg');assert.equal(frames[35].frame,35);
assert.throws(()=>toyotaFrameUrls(state,'changed builder'),/builder changed/);
assert.equal(toyotaState('<div id="fixture-data">'+JSON.stringify(state).replaceAll('"','&quot;')+'</div>').car.id,'vehicle');
const props={viewModel:{slug:'fabia',baseUrl:'https://visualizer.example.org',sourceUrl:'bundle.js'}};
const html='<div data-module="vizualizer2-module" data-props="'+JSON.stringify(props).replaceAll('"','&quot;')+'"></div><a href="https://clg.skoda-auto.com/api/link?tool=CC3&amp;bid=260&amp;culture=cs-CZ">Configure</a>';
const requested=[],publishedUrls=Array.from({length:36},(_,i)=>'https://images.example.org/published-'+i+'.jpg');
const client={hosts:new Set(),get:async url=>{requested.push(url);return{url,sha256:'fixture',body:url.endsWith('bundle.js')?'this.target,this.baseName,"api" uf("data",{slug:e}) uf("exteriorImages",e)':url.includes('/data?')?JSON.stringify({active:true,carName:'Fabia',frames:36,scene:'day',salesgroup:'60004',mbvCode:'PJ3',colors:[{prCode:'0B0B'}],wheels:[{prCode:'40M'}]}):JSON.stringify({src:publishedUrls})};}};
const found=await configuratorFrames(html,'https://www.skoda-auto.cz/modely/fabia/fabia',{makeSlug:'skoda',line:'Fabia',aliases:['Fabia']},client);
assert.equal(found[0].frame,33);assert.equal(found[0].url,publishedUrls[33]);assert.equal(found[0].frontTitled,false);assert.equal(requested.length,3);assert.ok(found.every(f=>publishedUrls.includes(f.url)));
const original=globalThis.fetch;
try{
 let cancelled=false;globalThis.fetch=async()=>new Response(new ReadableStream({cancel(){cancelled=true;}}),{headers:{'content-length':'40000000'}});
 await assert.rejects(new Client({hosts:['example.org']}).raw('https://example.org/image.jpg'),/limit 35000000.*example.org/);assert.equal(cancelled,true);
 globalThis.fetch=async()=>new Response(new ReadableStream({start(c){for(let i=0;i<10;i++)c.enqueue(new Uint8Array(4e6));c.close();}}),{headers:{'content-type':'application/octet-stream'}});
 const response=await new Client({hosts:['example.org'],maxResponseBytes:128e6}).raw('https://example.org/image.jpg');assert.equal(response.data.length,40e6);
 globalThis.fetch=async()=>new Response(new Uint8Array(2000));await assert.rejects(new Client({hosts:['example.org'],maxResponseBytes:1000}).raw('https://example.org/stream'),/limit 1000/);
}finally{globalThis.fetch=original;}
console.log('PASS: published Skoda frame list only, Toyota 36-frame SDK builder, builder-change rejection, numeric frames not front-titled, 40 MB streamed response accepted at 128 MB, overflow cancellation/limits');
