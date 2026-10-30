import fs from 'node:fs';
import assert from 'node:assert/strict';
import {markUnknowns} from '../night-card-helpers.mjs';
const dir='analysis/codex/night-izh-photos';
const patches=fs.readdirSync(dir).filter(x=>/^batch-\d+\.json$/.test(x)).sort().flatMap(x=>JSON.parse(fs.readFileSync(dir+'/'+x)));
const pickup=patches.find(x=>x.photo.file==='1993 Izh-271516-013-01 purple front.jpg');
if(pickup){pickup.generationIndex=1;pickup.expectedGenerationName=JSON.parse(fs.readFileSync('src/data/catalog/model-cards/izh.json')).find(x=>x.lineSlug==='2715').generations[1].name;}
for(const make of ['izh','jaguar']){
 const path=`src/data/catalog/model-cards/${make}.json`,cards=JSON.parse(fs.readFileSync(path));
 for(const p of patches.filter(p=>p.makeSlug===make)){const c=cards.find(c=>c.lineSlug===p.lineSlug),g=c.generations[p.generationIndex];assert.equal(g.name,p.expectedGenerationName);assert.equal(g.photo,null);g.photo=p.photo;}
 for(const c of cards){c.needsReview=c.needsReview.filter(r=>!/^generations\[\d+\]\.photo$/.test(r.field)||c.generations[Number(r.field.match(/\d+/)[0])].photo===null);markUnknowns(c);}
 fs.writeFileSync(path,JSON.stringify(cards,null,2)+'\n');
 const rp=`analysis/codex/night-${make}-report.json`,r=JSON.parse(fs.readFileSync(rp));r.photos=cards.flatMap(c=>c.generations).filter(g=>g.photo).length;r.photoScope='Inspected Commons photographs; exact imageinfo credits preserved. Only selected categories searched; remaining nulls do not establish absence of suitable photographs.';r.gaps+=' Photographs remain partial; unsearched categories and unsuitable initial category candidates require another photo pass.';fs.writeFileSync(rp,JSON.stringify(r,null,2)+'\n');console.log(make,cards.length,cards.flatMap(c=>c.generations).length,r.photos);
}
