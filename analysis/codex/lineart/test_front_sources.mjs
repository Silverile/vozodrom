import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import {robots,allowed,reservation,Client,Stop} from './front_source_client.mjs';
import {productionYears,matchGeneration,catalog} from './front_catalog.mjs';
import {run as carswp} from './crawl_front_carswp.mjs';
import {modelYears,run as ultimate} from './crawl_front_ultimatespecs.mjs';

assert.deepEqual(productionYears("Borgward BX5 '03.2017–21"),{from:2017,to:2021});
assert.deepEqual(productionYears('Borgward Isabella 1958–61 (1024 x 768)'),{from:1958,to:1961});
assert.deepEqual(productionYears('Toyota e6 2009–present'),{from:2009,to:null});
assert.equal(modelYears('Production years: from 2009 to 2014'), '2009–2014');
assert.equal(catalog().filter(g=>g.eligible).length,500);
assert.equal(catalog({wave:1}).filter(g=>g.eligible).length,100);
const base={make:'Toyota',makeSlug:'toyota',makeAliases:[],aliases:['Corolla'],eligible:true,from:2010,to:2018,line:'Corolla'};
const all=[{...base,id:'old'},{...base,id:'new',from:2018,to:2022,eligible:false},{...base,id:'cross',line:'Corolla Cross',aliases:['Corolla Cross'],from:2020,to:null}];
assert.equal(matchGeneration('Toyota Corolla 2017',all).match.id,'old');
assert.equal(matchGeneration('Toyota Corolla 2018',all).reason,'ambiguous-generation-or-facelift');
assert.equal(matchGeneration('Toyota Corolla 2019',all).reason,'outside-target-list');
assert.equal(matchGeneration('Toyota Corolla 2015–2020',all).match,null);
assert.equal(matchGeneration('Toyota Corolla Cross 2021',all).match.id,'cross');
assert.equal(matchGeneration('Fiat Corolla 2017',all,'toyota').match,null);
assert.equal(matchGeneration('Toyota Corolla interior 2017',all).match,null);
const policy=robots('User-agent: *\nCrawl-delay: 30\nDisallow: /private\n\nUser-agent: *\nAllow: /private/public\n');
assert.equal(policy.delay,30000);assert.equal(allowed('https://example.org/private/x',policy.rules),false);assert.equal(allowed('https://example.org/private/public',policy.rules),true);
assert.equal(robots('User-agent: GPTBot\nDisallow: /').aiDenied,true);
assert.equal(allowed('https://example.org/images/a.jpg',robots('User-agent: GPTBot\nDisallow: /images/').aiRules[0]),false);
assert.equal(reservation('Content-signal: search=yes, ai-input=no'),'Content-Signal ai-input=no');
assert.equal(reservation('Content-signal: ai-train=no'),null,'No model training is performed by these crawlers');
assert.equal(reservation('<meta name="robots" content="noimageai">'),'AI/TDM reservation');
const originalFetch=globalThis.fetch;
try{
 for(const status of [403,429]){let calls=0;globalThis.fetch=async()=>{calls++;return new Response('denied',{status});};const c=new Client({hosts:['example.org']});await assert.rejects(c.raw('https://example.org/robots.txt'),/no retry/);await assert.rejects(c.raw('https://example.org/robots.txt'),/already stopped/);assert.equal(calls,1);}
 globalThis.fetch=async()=>new Response('<title>Just a moment</title>cf-chl-test',{headers:{'Content-Type':'text/html'}});
 await assert.rejects(new Client({hosts:['example.org']}).raw('https://example.org/robots.txt'),/CAPTCHA/);
}finally{globalThis.fetch=originalFetch;}

// Exercise real queue/index/download/resume logic against a tiny deterministic source.
const parent=path.join(path.dirname(fileURLToPath(import.meta.url)),'test-out');fs.mkdirSync(parent,{recursive:true});
const dir=fs.mkdtempSync(path.join(parent,'fixture-'));
const jpeg=await sharp({create:{width:1200,height:800,channels:3,background:'#abc'}}).jpeg().toBuffer();
const urls=[];
globalThis.fetch=async url=>{
 const u=new URL(url);urls.push(u.href);
 if(u.pathname==='/robots.txt')return new Response('User-agent: *\nAllow: /',{headers:{'Content-Type':'text/plain'}});
 if(u.pathname==='/privacy')return new Response('No automated access restriction in this fixture.',{headers:{'Content-Type':'text/html'}});
 if(u.pathname==='/fixture')return new Response('<h1>Skoda Fabia I 6Y 2000</h1><a href="/fixture.htm">Original (1200x800)</a>',{headers:{'Content-Type':'text/html'}});
 if(u.pathname==='/fixture.htm')return new Response('<h1>Skoda Fabia I 6Y 2000</h1><img width="1200" height="800" alt="Skoda Fabia I 6Y 2000" src="https://img.carswp.com/test.jpg">',{headers:{'Content-Type':'text/html'}});
 if(u.pathname==='/test.jpg')return new Response(jpeg,{headers:{'Content-Type':'image/jpeg'}});
 throw Error('Unexpected fixture URL '+u.href);
};
const args=['--out',dir,'--seed','https://www.carswp.com/fixture','--only','^skoda--fabia--0$','--pages','3','--max-images','1'];
try{
 await carswp(args);let rows=JSON.parse(fs.readFileSync(path.join(dir,'candidates.json')));assert.equal(rows[0].files.length,1);const image=path.join(dir,rows[0].files[0].local);assert.ok(fs.existsSync(image));
 const requests=urls.length;await carswp(args);assert.equal(urls.slice(requests).some(u=>u.endsWith('/test.jpg')),false,'Resume must not redownload completed URL');
 // Explicitly missing local images must be requeued, rather than skipped forever.
 fs.unlinkSync(image);const again=urls.length;await carswp(args);assert.equal(urls.slice(again).some(u=>u.endsWith('/test.jpg')),true);assert.ok(fs.existsSync(image));
 globalThis.fetch=async url=>{
  const u=new URL(url);
  if(u.pathname==='/robots.txt')return new Response('User-agent: *\nAllow: /',{headers:{'Content-Type':'text/plain'}});
  if(u.pathname==='/privacy-policy')return new Response('Fixture policy',{headers:{'Content-Type':'text/html'}});
  if(u.pathname==='/model')return new Response('<h1>Skoda Fabia I 6Y Specs</h1>Production years: from 1999 to 2006<a href="/gallery/Skoda/1">Photos</a>',{headers:{'Content-Type':'text/html'}});
  if(u.pathname==='/gallery/Skoda/1')return new Response('<h1>Skoda Fabia I 6Y Images</h1><img src="/cargallery/test.jpg" width="745" alt="Skoda Fabia I 6Y">',{headers:{'Content-Type':'text/html'}});
  if(u.pathname==='/cargallery/test.jpg')return new Response(jpeg,{headers:{'Content-Type':'image/jpeg'}});
  throw Error('Unexpected UltimateSpecs fixture '+u.href);
 };
 const ultimateDir=path.join(dir,'ultimate');
 await ultimate(['--out',ultimateDir,'--seed','https://www.ultimatespecs.com/model','--only','^skoda--fabia--0$','--pages','3','--max-images','1']);
 const ultimateRows=JSON.parse(fs.readFileSync(path.join(ultimateDir,'candidates.json')));assert.equal(ultimateRows[0].id,'skoda--fabia--0');assert.equal(ultimateRows[0].files.length,1);assert.equal(ultimateRows[0].files[0].width,1200);
 const broken=path.join(dir,'broken');fs.mkdirSync(broken);const corrupt='{not JSON';fs.writeFileSync(path.join(broken,'candidates.json'),corrupt);
 const previousExit=process.exitCode;
 await carswp(['--out',broken,'--pages','1']);assert.equal(fs.readFileSync(path.join(broken,'candidates.json'),'utf8'),corrupt);assert.equal(fs.existsSync(path.join(broken,'.crawl.lock')),false);process.exitCode=previousExit;
 console.log('PASS: generation/facelift boundaries; make/model identity; robots merging/delay; 403/429/challenge stops; real crawl/download/resume; missing-image recovery; UltimateSpecs gallery extraction and download');
}finally{
 globalThis.fetch=originalFetch;
 // Only remove this exact fixture tree, and use non-recursive filesystem calls.
 function clean(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())clean(p);else fs.unlinkSync(p);}fs.rmdirSync(dir);}clean(dir);
}
