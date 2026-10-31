import fs from 'node:fs';
import cp from 'node:child_process';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const root='analysis/codex/second-source-engines/wave-2-structure',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
fs.mkdirSync(root,{recursive:true});
const baseline=cp.execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const fixes=[{make:'alfa-romeo',line:'mito',index:0,from:2008,to:2018,source:'https://de.wikipedia.org/wiki/Alfa_Romeo_MiTo',note:'Konec výroby 2018 podle německého přehledu; pozdější prodej skladových vozů není výrobní období.'},{make:'alfa-romeo',line:'166',index:0,beforeFrom:1996,beforeTo:2007,from:1998,to:2007,source:'https://de.wikipedia.org/wiki/Alfa_Romeo_166',note:'Sériová výroba 1998–2007 podle německého přehledu; uvedení na trh v říjnu 1998.'}];
const p='src/data/catalog/model-cards/alfa-romeo.json',cards=read(p),autoPath='src/data/catalog/model-lines-auto.json',lines=read(autoPath),drawingPath='src/data/front-drawings.json',drawings=read(drawingPath);
const previous=fs.existsSync(root+'/migration.json')?read(root+'/migration.json'):null,changes=[];
for(const f of fixes){
 const c=cards.find(c=>c.makeSlug===f.make&&c.lineSlug===f.line),g=c.generations[f.index],l=lines.find(l=>l.makeSlug===f.make&&l.slug===f.line);
 const prior=previous?.changes.find(c=>c.make===f.make&&c.line===f.line);if(prior){assert.equal(g.to,f.to);assert.equal(g.from,f.from);changes.push(prior);continue;}
 // 166's source card already used 1998; its selector alone was still at 1996.
 assert.equal(g.from,f.line==='166'?f.from:f.beforeFrom??f.from);assert.equal(g.to,f.beforeTo??null);assert.equal(l.generations.length,1);
 const sourceBefore={};for(const key of ['from','to','productionStatus','dateNote','sources'])sourceBefore[key]={exists:Object.hasOwn(g,key),value:g[key]??null};
 const cardSourcesBefore=structuredClone(c.sources),lineBefore=structuredClone(l),drawingBefore=structuredClone(drawings[f.make+'--'+f.line]);
 g.from=f.from;g.to=f.to;g.productionStatus='ended';g.dateNote=f.note;g.sources=[...new Set([...(g.sources??[]),f.source])];c.sources=[...new Set([...(c.sources??[]),f.source])];
 l.from=f.from;l.to=f.to;l.productionStatus='ended';l.productionPeriods=[{from:f.from,to:f.to}];l.sources=[...new Set([...(l.sources??[]),f.source])];l.generations[0].from=f.from;l.generations[0].to=f.to;l.generations[0].productionStatus='ended';l.generations[0].sources=[...new Set([...(l.generations[0].sources??[]),f.source])];
 for(const entry of drawings[f.make+'--'+f.line]??[])if(entry[0]===f.index){entry[1]=f.from;entry[2]=f.to;}
 changes.push({...f,sourceFile:p,sourceBefore,cardSourcesBefore,lineBefore,drawingBefore,indexMapping:{0:0},listingIdBefore:l.generations[0].code,listingIdAfter:l.generations[0].code});
}
write(p,cards);write(autoPath,lines);write(drawingPath,drawings);
cp.execFileSync('node',['scripts/model-cards-index.mjs'],{stdio:'inherit'});cp.execFileSync('node',['scripts/model-lines-index.mjs','--make=alfa-romeo'],{stdio:'inherit'});
write(root+'/migration.json',{baselineRevision:baseline,changes,statisticsStatus:'pending',generationsAdded:0,generationsRemoved:0,drawingFilesMoved:0,statsIndexMapping:{0:0}});
const inputs=['scripts/stats/match.py','scripts/stats/istp-stats.py','scripts/stats/rsv-stats.py','scripts/stats/build-stats.py','src/data/model-cards-index.json','src/data/model-lines-index.json','src/data/catalog/model-lines-auto.json'];
write(root+'/rebuild-inputs.json',{baselineRevision:baseline,makes:['alfa-romeo'],sha256:Object.fromEntries(inputs.map(p=>[p,crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')]))});
console.log(JSON.stringify({dateFixes:changes.map(f=>({id:f.make+'/'+f.line,from:f.from,to:f.to})),statsStatus:'pending'}));
