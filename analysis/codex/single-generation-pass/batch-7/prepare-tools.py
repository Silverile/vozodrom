from pathlib import Path
root=Path('analysis/codex/single-generation-pass/batch-7');prior=root.parent/'batch-6'
def template(name):return (prior/name).read_text(encoding='utf-8-sig').replace('/batch-6','/batch-7')
text=template('apply.mjs')
text=text.replace("Object.values(old.dimensionsMm??{}).every(x=>x===null)&&old.trunkL===null", "(Number.isInteger(p.technicalIndex)||(Object.values(old.dimensionsMm??{}).every(x=>x===null)&&old.trunkL===null))")
text=text.replace('p.generations.map(g=>({...structuredClone(old),','p.generations.map((g,index)=>({...structuredClone(old),dimensionsMm:split&&index!==p.technicalIndex?Object.fromEntries(Object.keys(old.dimensionsMm??{}).map(k=>[k,null])):old.dimensionsMm,trunkL:split&&index!==p.technicalIndex?null:old.trunkL,')
text=text.replace('specificationScope:{...old.specificationScope,noteCs:g.note}',"specificationScope:{...old.specificationScope,...(split&&index!==p.technicalIndex?{modelYear:null,variant:g.code,bodyType:g.bodyTypes?.length===1?g.bodyTypes[0]:null}:{}),noteCs:g.note}")
(root/'apply.mjs').write_text(text,encoding='utf-8')
for name in ['apply-engines.mjs','rebuild.mjs','run-engine-audit.mjs','matching-projection.py','validate.mjs']:
 text=template(name)
 if name=='apply-engines.mjs':
  text=text.replace("(x.variant===e.variant||x.displacementCc&&x.displacementCc===e.displacementCc||x.displacementLitresNominal===e.displacementLitresNominal)","x.variant===e.variant")
 if name=='validate.mjs':
  text=text.replace("assert(stats.relatedHeld.includes('citroen/c6'));assert.deepEqual(read('src/data/stats/citroen.json').c6,base['src/data/stats/citroen.json'].c6,'Modern C6 hold must preserve published baseline');",'')
  text=text.replace('if(old.photo)assert.deepEqual(c.generations[p.photoIndex??0].photo,old.photo);','if(old.photo)assert.deepEqual(p.photoFaceliftYear?c.generations[0].facelift.find(f=>f.year===p.photoFaceliftYear)?.photo:c.generations[p.photoIndex??0].photo,old.photo);')
  marker="for(const file of['src/data/catalog/model-lines-auto.json'"
  offset=text.index(marker)
  check="for(const p of plan){if(p.technicalIndex===undefined)continue;const path='src/data/catalog/model-cards/'+p.make+'.json',old=base[path].find(c=>c.lineSlug===p.line).generations[0],now=read(path).find(c=>c.lineSlug===p.line);for(const[i,g]of now.generations.entries())if(i===p.technicalIndex){assert.deepEqual(g.dimensionsMm,old.dimensionsMm);assert.equal(g.trunkL,old.trunkL);}else{assert(Object.values(g.dimensionsMm??{}).every(v=>v===null));assert.equal(g.trunkL,null);}}\n"
  text=text[:offset]+check+text[offset:]
 (root/name).write_text(text,encoding='utf-8')
# Scoped promotion starts from the earlier generic implementation. Related
# cohorts are inspected before promotion, rather than inheriting the C6 hold.
text=(root.parent/'batch-5/finalize-stats.mjs').read_text(encoding='utf-8-sig').replace('/batch-5','/batch-7')
(root/'finalize-stats.mjs').write_text(text,encoding='utf-8')
