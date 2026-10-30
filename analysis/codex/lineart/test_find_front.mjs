import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {scoreCategory, frontRank, freeLicence, generations, Client} from './find_front.mjs';

const g = (make,line,gen,body,from,to,siblings=2) => ({make,line,gen,body,from,to,siblings});
const cases = [
 ['Category:Infiniti G (V35) sedan', g('Infiniti','G','V35',['sedan'],2002,2007), true],
 ['Category:Infiniti G (V36) sedan', {...g('Infiniti','G','V35',['sedan'],2002,2007),otherCodes:['v36']}, false],
 ['Category:Infiniti G (V36) convertible',g('Infiniti','G','V36',['sedan'],2007,2015),false],
 ['Category:Jaguar XF (X250)',g('Jaguar','XF','X250',['sedan'],2007,2015),true],
 ['Category:Jaguar XF (X260)',g('Jaguar','XF','X250',['sedan'],2007,2015),false],
 ['Category:Ferrari 365 GT 2+2',g('Ferrari','365','365 GT 2+2',['kupe'],1967,1971),true],
 ['Category:Ferrari 365 California',g('Ferrari','365','365 GT 2+2',['kupe'],1967,1971),false],
 ['Category:Toyota Crown (S40)',g('Toyota','Crown','RS46G',['kombi'],1962,1967),true],
 ['Category:Toyota Crown (S50)',g('Toyota','Crown','RS46G',['kombi'],1962,1967),false],
 ['Category:Toyota Corolla Cross',g('Toyota','SA','SA',['sedan'],1947,1952,1),false],
 ['Category:Humvee',g('Haval','H7','H7',['suv'],2015,2020,1),false],
 ['Category:Jaguar D-Type',g('Jaguar','E-Type','Series I',['kupe'],1961,1968),false],
 ['Category:Jaguar D-Type',g('Jaguar','E-Type','E-Type',['kupe'],1961,1968,1),false],
 ['Category:Ferrari 365 GTB/4 Daytona',g('Ferrari','Daytona SP3','Daytona SP3',['kupe'],2022,null,1),false],
 ['Category:Ferrari Daytona SP3',g('Ferrari','Daytona SP3','Daytona SP3',['kupe'],2022,null,1),true],
 ['Category:Ferrari 412',g('Ferrari','400 / 412','412',['kupe'],1985,1989),true],
 ['Category:Ferrari 400 (1976-1985)',g('Ferrari','400 / 412','412',['kupe'],1985,1989),false],
 ['Category:Ferrari 365 GTB/4 Daytona',g('Ferrari','365 GTB/4 Daytona','365 GTB/4 Daytona',['kupe'],1968,1973,1),true],
 ['Category:Ferrari 4 Daytona',g('Ferrari','365 GTB/4 Daytona','365 GTB/4 Daytona',['kupe'],1968,1973,1),false],
 ['Category:Ariel Atom 4',g('Ariel','Atom','Atom 4',['kabriolet'],2018,null,4),true],
 ['Category:AC Cobra', {...g('AC Cars','Cobra','Cobra',['kabriolet'],1962,1967,1),makeAliases:['AC']},true],
];
for (const [title, gen, expected] of cases) assert.equal(Boolean(scoreCategory(title,gen)),expected,title);
for (const phrase of ['front','frontal','Front-Draufsicht','Frontansicht','vue de face','avant','anteriore','přední','вид спереди']) assert.ok(frontRank('File:Car '+phrase+'.jpg')>=100,phrase);
for (const phrase of ['front rear','front 3/4','front three-quarter','front side','front interior','front engine','front badge','front-left','right front']) assert.equal(frontRank(phrase),-1,phrase);
assert.equal(frontRank('File:Audi A6 Avant.jpg'),0);
assert.ok(frontRank('Car.jpg','A vue de face.')>0);
for (const licence of ['Public domain','PD','CC0','CC0 1.0','CC BY 4.0','CC BY-SA 3.0']) assert.equal(freeLicence(licence),true,licence);
for (const licence of ['CC BY-NC 4.0','CC BY-ND 4.0','CC BY-SA 4.0 noncommercial','Fair use','']) assert.equal(freeLicence(licence),false,licence);
const queue=generations();
assert.equal(new Set(queue.map(g=>g.id)).size,queue.length);
assert.equal(queue.length,500);
assert.deepEqual(queue.map(g=>g.rank),Array.from({length:500},(_,i)=>i+1));
const originalFetch=globalThis.fetch;
try {
  for(const status of [403,429]) {
    let calls=0; globalThis.fetch=async()=>{calls++;return new Response('blocked',{status});};
    await assert.rejects(new Client(Infinity).get('https://commons.wikimedia.org/w/api.php'),new RegExp('HTTP '+status));
    assert.equal(calls,1,'No retry after access/rate-limit denial');
  }
  globalThis.fetch=async()=>new Response('<html><title>CAPTCHA</title></html>');
  await assert.rejects(new Client(Infinity).get('https://commons.wikimedia.org/w/api.php'),/CAPTCHA/);
  globalThis.fetch=async url=>new URL(url).pathname==='/robots.txt'?new Response('User-agent: *\nAllow: /'):new Response(JSON.stringify({error:{code:'maxlag'}}));
  await assert.rejects(new Client(Infinity).api({list:'search'}),/maxlag/);
  let calls=0;
  globalThis.fetch=async url=>{
    const u=new URL(url);if(u.pathname==='/robots.txt')return new Response('User-agent: *\nAllow: /');assert.equal(u.searchParams.get('maxlag'),'5');calls++;
    if(calls===1)return new Response(JSON.stringify({continue:{continue:'-||',cmcontinue:'next'},query:{categorymembers:[{title:'first'}]}}));
    assert.equal(u.searchParams.get('cmcontinue'),'next');
    return new Response(JSON.stringify({query:{categorymembers:[{title:'second'}]}}));
  };
  const members=[];
  for await(const page of new Client(Infinity).pages({list:'categorymembers'}))members.push(...page.query.categorymembers);
  assert.deepEqual(members.map(x=>x.title),['first','second']);
  await assert.rejects(new Client(Date.now()-1).api({}),/checkpoint/i);
} finally {globalThis.fetch=originalFetch;}
const dir=fs.mkdtempSync(path.join(path.dirname(fileURLToPath(import.meta.url)),'resume-test-'));
try {
  const index=path.join(dir,'candidates.json');
  fs.writeFileSync(index,JSON.stringify([{id:queue[0].id,status:'done',collectorVersion:2,candidateLimit:20,category:null,files:[]}],null,2)+'\n');
  const before=fs.readFileSync(index,'utf8');
  const stdout=execFileSync(process.execPath,[fileURLToPath(new URL('./find_front.mjs',import.meta.url)),'--out',dir,'--only','^'+queue[0].id+'$'],{encoding:'utf8'});
  assert.equal(JSON.parse(stdout.trim()).requests,0,'Completed IDs skipped without network');
  assert.equal(fs.readFileSync(index,'utf8'),before,'Resume preserves completed record');
} finally {for(const name of fs.readdirSync(dir))fs.unlinkSync(path.join(dir,name));fs.rmdirSync(dir);}
console.log(`PASS: ${cases.length} category regressions; front/exclusion/licence rules; ${queue.length} unique prioritized generations; pagination; stop on 403/429/CAPTCHA/maxlag; resume skips completed IDs`);
