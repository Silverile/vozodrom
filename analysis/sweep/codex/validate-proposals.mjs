import fs from 'node:fs';
import assert from 'node:assert/strict';
const dir='analysis/sweep/codex/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const values={};
for(const n of ['model-lines-auto','model-line-additions','models-auto'])values[n]=read(`src/data/catalog/${n}.json`);
const get=(o,path)=>path.replace(/\[(\d+)\]/g,'.$1').split('.').reduce((a,k)=>a?.[k],o);
let checked=0;const mappingWarnings=[];
for(const name of fs.readdirSync(dir).filter(f=>/^[a-z-]+\.json$/.test(f))){
 const r=read(dir+name);if(!r.make)continue;
 const cards=read(`src/data/catalog/model-cards/${r.make}.json`);
 for(const x of r.modelFixes??[]){
  if(x.file?.startsWith('src/data/model-cards/')){
   const cs=read(x.file),c=cs.find(c=>c.lineSlug===x.slug);
   assert(c,`${r.make}/${x.slug}: winning card exists`);
   assert.deepEqual(get(c,x.field),x.from,`${r.make}/${x.slug}/${x.field}: winning before value`);checked++;continue;
  }
  if(!values[x.file])continue;
  const matches=values[x.file].filter(v=>v.makeSlug===r.make&&v.slug===x.slug);
  assert.equal(matches.length,1,`${r.make}/${x.slug}: exact shared identity`);
  assert.deepEqual(get(matches[0],x.field),x.from,`${r.make}/${x.slug}/${x.field}: shared before value`);checked++;
  const idx=x.field.match(/^generations\[(\d+)\]/);
  if(idx){
   const c=cards.find(c=>c.lineSlug===x.slug),g=matches[0].generations?.[+idx[1]],cg=c?.generations[+idx[1]];
   if(!g||!cg||c.generations.length!==matches[0].generations.length)mappingWarnings.push({make:r.make,slug:x.slug,field:x.field,reason:'generation counts/index not equivalent'});
   else {
    const originalCode=(r.cardFixesApplied??[]).find(f=>f.lineSlug===x.slug&&f.path===`generations[${idx[1]}].code`)?.from??cg.code;
    if(g.code&&originalCode&&g.code!==originalCode)mappingWarnings.push({make:r.make,slug:x.slug,field:x.field,reason:'generation code differs before corrections',shared:g.code,card:originalCode});
   }
  }
 }
 for(const x of r.cardFixesProposed??[]){
  assert(x.file?.startsWith('src/data/model-cards/'));
  const c=read(x.file).find(c=>c.lineSlug===x.lineSlug);
  assert(c);assert.deepEqual(get(c,x.path),x.from,`${r.make}/${x.lineSlug}/${x.path}: proposed card before value`);checked++;
 }
 for(const x of r.makeFixes??[]){
  const m=read('src/data/catalog/makes.json').find(m=>m.slug===r.make);
  assert.deepEqual(get(m,x.field),x.from,`${r.make}/${x.field}: make before value`);checked++;
 }
}
console.log(JSON.stringify({checkedBeforeValues:checked,generationMappingWarnings:mappingWarnings},null,2));
assert.equal(mappingWarnings.length,0,'Resolve generation mapping warnings before integration');
