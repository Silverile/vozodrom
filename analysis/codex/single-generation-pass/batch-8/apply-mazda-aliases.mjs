import fs from 'node:fs';import assert from 'node:assert/strict';import cp from 'node:child_process';
const root='analysis/codex/single-generation-pass/batch-8',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
const aliases=read(root+'/mazda-measurement.json').aliases;
const url='https://dba.com.au/wp-content/uploads/2022/07/DBA-Off-Road-AWD-Catalogue-2021.pdf';
const changes=[];
for(const file of ['src/data/catalog/model-lines-auto.json','src/data/catalog/model-line-additions.json','src/data/catalog/model-cards/mazda.json']){
 const data=read(file),row=data.find(x=>(x.makeSlug==='mazda')&&(x.lineSlug??x.slug)==='b-series');if(!row)continue;
 const before=structuredClone(row);row.aliases=[...new Set([...(row.aliases??[]),...aliases])];row.sources=[...new Set([...(row.sources??[]),url])];
 assert.deepEqual(row.generations,before.generations);write(file,data);changes.push({file,beforeAliases:before.aliases??[],afterAliases:row.aliases});
}
for(const script of ['scripts/model-cards-index.mjs','scripts/model-lines-index.mjs'])cp.execFileSync('node',[script,'--make=mazda'],{stdio:'inherit'});
write(root+'/alias-evidence.json',{aliases,source:url,fact:'DBA groups B2000/B2200/B2500/B2600 under Mazda B Series. Fitment dates are not used as production boundaries.',europeanScopeSource:'https://newsroom.mazda.com/en/publicity/release/1999/9912/991203e.html',americanBadgeSource:'https://xr793.com/wp-content/uploads/2020/05/2001-Mazda-B-Series.pdf',scope:'Mazda-built global B-Series; B2300/B3000/B4000 Ford-built American badges deliberately excluded. B2500 also existed in America; the measured new Czech fleet has 95 diesel B2500 and no North-American WMI among all 98 affected vehicles. This does not prove that all future bare B2500 records are non-American.',changes});
console.log('Applied eight documented compact/spaced badge aliases; generation metadata unchanged.');
