import fs from'node:fs';import{createHash}from'node:crypto';import{proposedLine}from'./night-card-helpers.mjs';
import {applyPhotoCreditEvidence} from './photo-credit-evidence-44.mjs';
const root='analysis/codex/',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n'),hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const lp='src/data/catalog/model-lines-auto.json',ap='src/data/catalog/model-line-additions.json',pp=root+'model-line-primary-facts.json',bp=root+'night-baseline.json';
const lines=read(lp),additions=read(ap),primary=read(pp),key=l=>l.makeSlug+'/'+l.slug;
if(!fs.existsSync(bp)){const protectedFiles=['src/data/catalog/model-cards/skoda.json',...['ford','toyota','hyundai','volkswagen'].map(m=>`src/data/model-cards/${m}.json`)];write(bp,{startedAt:'2026-10-26T23:59:11Z',lines:Object.fromEntries(lines.map(l=>[key(l),hash(l)])),additions:Object.fromEntries(additions.map(l=>[key(l),hash(l)])),protectedFiles:Object.fromEntries(protectedFiles.map(p=>[p,createHash('sha256').update(fs.readFileSync(p)).digest('hex')]))});}
const baseline=read(bp),originalKeys=new Set(Object.keys(baseline.lines)),additionKeys=new Set(additions.map(key)),lineKeys=new Set(lines.map(key));
const reports=fs.readdirSync(root).filter(f=>/^night-.*-report\.json$/.test(f));let cardsCount=0,newLines=0;
for(const file of reports){const make=file.replace(/^night-|\-report\.json$/g,''),p=`src/data/catalog/model-cards/${make}.json`;if(!fs.existsSync(p))throw Error('Missing completed make '+make);const cards=read(p),claudePath=`src/data/model-cards/${make}.json`,claude=fs.existsSync(claudePath)?new Set(read(claudePath).map(c=>c.lineSlug)):new Set();
 applyPhotoCreditEvidence(cards);
 for(const c of cards){if(claude.has(c.lineSlug))throw Error('Duplicate Claude card '+make+'/'+c.lineSlug);const k=make+'/'+c.lineSlug;c.isAddition=additionKeys.has(k)||!originalKeys.has(k);cardsCount++;
  if(!lineKeys.has(k)||!originalKeys.has(k)){const existed=lineKeys.has(k),suggested=read(root+file).proposedLines?.find(l=>l.makeSlug===make&&l.slug===c.lineSlug),l=suggested||proposedLine(c);l.needsReview??=[];
   function unknown(v,path){if(v===null){if(!l.needsReview.some(r=>r.field===path))l.needsReview.push({field:path,reason:'Neověřený údaj v dílčím historickém katalogu; null není pokračující výroba.'});}else if(Array.isArray(v))v.forEach((v,i)=>unknown(v,path+'['+i+']'));else if(typeof v==='object')for(const[k,vv]of Object.entries(v))unknown(vv,path?path+'.'+k:k);}
   unknown({from:l.from,to:l.to,bodyTypes:l.bodyTypes,wikidataQid:l.wikidataQid,generations:l.generations},'');if(existed){lines[lines.findIndex(x=>key(x)===k)]=l;const ai=additions.findIndex(x=>key(x)===k);if(ai<0)throw Error('Night line missing addition marker');additions[ai]=l;}else{lines.push(l);additions.push(l);newLines++;}lineKeys.add(k);additionKeys.add(k);
  }
  for(const url of [...c.sources,...c.generations.flatMap(g=>g.sources)]){let s=primary.sources.find(s=>s.url===url);if(!s){s={url,publisher:new URL(url).hostname,retrievedDate:'2026-10-27',facts:{}};primary.sources.push(s);}s.facts??={};s.facts.nightBackfill??={};const l=lines.find(l=>key(l)===k);s.facts.nightBackfill[k]={name:c.name,scope:'Selected independently structured facts. Line bounds are aggregates across the model source set, not a claim that this URL independently proves every boundary; per-generation URLs and per-make conflicts remain explicit.',lineBounds:l.sources.includes(url)?{from:l.from,to:l.to,productionPeriods:l.productionPeriods}:null,generations:c.generations.filter(g=>g.sources.includes(url)).map(g=>({code:g.code,from:g.from,to:g.to,status:g.productionStatus==='current'?'ongoing':g.productionStatus}))};}
 }
 write(p,cards);
}
for(const [k,digest]of Object.entries(baseline.lines)){const l=lines.find(l=>key(l)===k);if(!l||hash(l)!==digest)throw Error('Original line changed '+k);}
lines.sort((a,b)=>a.makeSlug.localeCompare(b.makeSlug,'en')||a.name.localeCompare(b.name,'cs'));
write(lp,lines);write(ap,additions);write(pp,primary);console.log(JSON.stringify({completedMakes:reports.length,cards:cardsCount,addedThisRun:newLines,totalLines:lines.length,totalAdditions:additions.length}));
