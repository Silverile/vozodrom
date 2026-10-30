import fs from 'node:fs';
const db='analysis/codex/letter-a/a-14-results.json',rows=JSON.parse(fs.readFileSync(db)),r=rows.find(x=>x.id===process.argv[2]);
if(r.id==='alpina--b2--0'){r.evidence=[r.referencePage,'https://rmsothebys.com/auctions/pa23/lots/r0086-1976-bmw-alpina-b2/'];r.variant='1976 E12 528 B2 saloon, pre-facelift; archive original 716px. Auxiliary round bumper lamps, stickers and decals omitted; retain factory front spoiler.';}
r.notes='Reference passed visual gate; pending built-in ImageGen.';fs.writeFileSync(db,JSON.stringify(rows,null,2));
let info=fs.readFileSync(r.folder+'/info.txt','utf8');info=info.replace(/Evidence:.*\nEvidence:.*\n/,r.evidence.map(x=>'Evidence: '+x+'\n').join('')).replace(/Variant:.*\n/,'Variant: '+r.variant+'\n');fs.writeFileSync(r.folder+'/info.txt',info);
console.log(JSON.stringify({id:r.id,path:process.cwd()+'/'+r.folder+'/reference.jpg',prompt:fs.readFileSync('analysis/codex/abarth-drawings/prompt.txt','utf8').trimEnd()+'\n'+r.promptSuffix}));
