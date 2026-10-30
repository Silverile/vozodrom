import assert from'node:assert/strict';
import {Client,Missing,Stop,args,aiReservation,decodeHtml,outputRoot,passenger,robotAllows,REPO}from'./crawl_shared.mjs';
import{narod}from'./crawl_narod_adapters.mjs';import{nuxt}from'./nuxt_literal.mjs';import{source as find}from'./crawl_findblueprints.mjs';
assert.equal(REPO.replaceAll('\\','/'),'C:/Workspace/Projects/CF/vozodrom');
assert.throws(()=>outputRoot('analysis/codex/blueprints/raw'),/inside/);
assert.equal(aiReservation('Content-signal: search=yes, ai-train=no'),'Content-signal ai-train denial');
assert.equal(aiReservation('User-agent: GPTBot\nDisallow: /'),'Named AI crawler restriction');
assert.equal(aiReservation('User-agent: *\nAllow: /'),null);
assert.equal(robotAllows('https://example.test/a?x=1',[{allow:false,pattern:'/*?'}]),false);
assert.equal(decodeHtml(Buffer.from('<meta charset="windows-1251">Легковые автомобили'),{'content-type':'text/html; charset=UTF-8'}).includes('Легковые'),true);
for(const name of ['Heavy Truck','bus','motorcycle','aircraft','ship','Ford F-350','ЛуАЗ-967 ТПК'])assert.equal(passenger(name),false,name);
assert.equal(passenger('GAZ-21 Volga','gaz'),true);assert.equal(passenger('GAZ-53','gaz'),false);
assert.equal(passenger('ZIL-130','zil'),false);assert.equal(passenger('ZIL-111','zil'),true);
assert.throws(()=>args(['--max-minutes','21'],find));assert.equal(args(['--limit','2500'],find).limit,2500);
assert.throws(()=>args(['--limit','2501'],find));
const literal=nuxt('window.__NUXT__=(function(a,b){return {state:{name:a,price:b}}}("Car",0));</script>');assert.equal(literal.state.name,'Car');
globalThis.untrustedExecuted=false;
assert.throws(()=>nuxt('window.__NUXT__=(function(){return globalThis.untrustedExecuted=true}());</script>'));
assert.equal(globalThis.untrustedExecuted,false);
const cb=narod('carblueprints'),bk=narod('bakkirill');
let parsed=await cb.parse({url:cb.origin+'/gaz.htm',body:'<a href="images/gaz/gaz-21.gif">GAZ 21</a><a href="images/gaz/gaz-53.gif">GAZ 53</a><a href="https://ads.test/a.jpg">Ad</a>'});assert.equal(parsed.images.length,1);
parsed=await cb.parse({url:cb.origin+'/mg.htm',body:'<img src="images/mg/mg-b.gif"><img src="images/mg/thumb.gif">'});assert.equal(parsed.images.length,1);
parsed=await bk.parse({url:bk.origin+'/Draw_zaz.html',body:'<a href="luaz969.gif">ЛуАЗ-969</a><a href="luaz967.gif">ЛуАЗ-967 ТПК</a>'});assert.equal(parsed.images.length,1);assert.equal(parsed.images[0].make,'luaz');
const fetch0=globalThis.fetch,starts=[];let mode='ok';
const fake={origin:'https://unit.test',allowedHost:h=>h==='unit.test'};
globalThis.fetch=async url=>{starts.push(Date.now());if(url.endsWith('/robots.txt'))return new Response('User-agent: *\nAllow: /',{headers:{'content-type':'text/plain'}});if(mode==='captcha')return new Response('<title>Are you not a robot?</title>',{headers:{'content-type':'text/html'}});return new Response('ok',{status:mode==='ok'?200:Number(mode),headers:{'content-type':'text/plain'}});};
try{
 const client=new Client(fake,{maxMinutes:1});await client.get('https://unit.test/a');assert.ok(starts[1]-starts[0]>=1050);
 for(const code of ['404','403','429','500']){mode=code;await assert.rejects(()=>client.get('https://unit.test/a'),code==='404'?Missing:Stop);}
 mode='captcha';await assert.rejects(()=>client.get('https://unit.test/a'),/CAPTCHA/);
}finally{globalThis.fetch=fetch0;}
console.log('Source crawler tests PASS: guard, policy, pacing, refusals, safe Nuxt and passenger adapters');
