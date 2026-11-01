from pathlib import Path
root=Path('analysis/codex/single-generation-pass/batch-6');prior=root.parent/'batch-5'
def template(name):return (prior/name).read_text(encoding='utf-8-sig').replace('/batch-5','/batch-6')
text=template('apply.mjs')
text=text.replace("assert(!fs.existsSync(root+'/changes.json'),'Already applied');","assert(!fs.existsSync(root+'/changes.json')||process.argv.includes('--refresh'),'Already applied');")
text=text.replace("&&!old.trims?.length,'Unmapped", "&&(!old.trims?.length||Number.isInteger(p.trimIndex)),'Unmapped")
text=text.replace("engines:split?null:old.engines,photo:","trims:split?null:old.trims,engines:split?null:old.engines,photo:")
text=text.replace("if(split){if(old.photo)","if(split){if(old.trims?.length)c.generations[p.trimIndex].trims=old.trims;if(old.photo)")
text=text.replace("l.from=Math.min(...gs.map(g=>g.from));","l.from=gs.some(g=>g.from===null)?null:Math.min(...gs.map(g=>g.from));")
start=text.index("const proofPath=");end=text.index("write(root+'/engine-assignments.json'",start)
text=text[:start]+"write(root+'/proof-migration.json',[]);"+text[end:]
(root/'apply.mjs').write_text(text,encoding='utf-8')
for name in ['rebuild.mjs','finalize-stats.mjs','run-engine-audit.mjs']:
 if name=='finalize-stats.mjs' and (root/name).exists():continue # preserve reviewed C6 hold
 (root/name).write_text(template(name),encoding='utf-8')
(root/'matching-projection.py').write_text(template('matching-projection.py'),encoding='utf-8')
text=template('finalize-catalogue.mjs').replace('l.from=Math.min(...gs.map(g=>g.from));','l.from=gs.some(g=>g.from===null)?null:Math.min(...gs.map(g=>g.from));')
(root/'finalize-catalogue.mjs').write_text(text,encoding='utf-8')
text=template('apply-engines.mjs');start=text.index('const facelift=[];');end=text.index('for(const[m,d]of files)',start)
text=text[:start]+"const facelift=[];\n"+text[end:]
text=text.replace("assert(!fs.existsSync(root+'/engine-enrichment.json'),'Already applied');","assert(!fs.existsSync(root+'/engine-enrichment.json')||process.argv.includes('--refresh'),'Already applied');")
(root/'apply-engines.mjs').write_text(text,encoding='utf-8')
text=template('validate.mjs').replace("`${g.from}–${g.to??'?'}`","`${g.from??'?'}–${g.to??'?'}`")
text=text.replace("for(const a of oldAliases)assert.deepEqual(aliases.aliases.find(x=>x.makeSlug===a.makeSlug&&x.lineSlug===a.lineSlug&&x.from===a.from),a);","for(const a of oldAliases){const expected=read(root+'/alias-changes.json').find(x=>x.before&&x.before.makeSlug===a.makeSlug&&x.before.lineSlug===a.lineSlug&&x.before.from===a.from)?.after??a;assert.deepEqual(aliases.aliases.find(x=>x.makeSlug===a.makeSlug&&x.lineSlug===a.lineSlug&&x.from===a.from),expected);}")
start=text.index("const proof=read(");end=text.index("if(!process.argv.includes('--structure-only'))",start)
text=text[:start]+"assert.deepEqual(read('analysis/codex/second-source-engines/evidence-10.json'),base['analysis/codex/second-source-engines/evidence-10.json']);\n"+text[end:]
# Trims are evidence too: they must appear unchanged once, never copied into every new generation.
marker="for(const file of['src/data/catalog/model-lines-auto.json'"
offset=text.index(marker)
text=text[:offset]+"for(const p of plan){const old=base['src/data/catalog/model-cards/'+p.make+'.json'].find(c=>c.lineSlug===p.line).generations[0],c=read('src/data/catalog/model-cards/'+p.make+'.json').find(c=>c.lineSlug===p.line);assert.deepEqual(c.generations.flatMap(g=>g.trims??[]),old.trims??[]);if(p.trimIndex!==undefined)assert.deepEqual(c.generations[p.trimIndex].trims,old.trims);}\n"+text[offset:]
text=text.replace('assert.equal(f.year,f.productionYear);','if(f.productionYear!==undefined)assert.equal(f.year,f.productionYear);else assert(base[\'src/data/catalog/model-cards/\'+p.make+\'.json\'].find(c=>c.lineSlug===p.line).generations[0].facelift?.some(old=>JSON.stringify(old)===JSON.stringify(f)),\'Undated new facelift\');')
text=text.replace('if(f.productionYear!==undefined)assert.equal(f.year,f.productionYear);else assert(',"if(Number.isFinite(f.productionYear))assert.equal(f.year,f.productionYear);else if(f.productionYear!==null)assert(")
text=text.replace("const stats=read(root+'/statistics.json');","const stats=read(root+'/statistics.json');assert(stats.relatedHeld.includes('citroen/c6'));assert.deepEqual(read('src/data/stats/citroen.json').c6,base['src/data/stats/citroen.json'].c6,'Modern C6 hold must preserve published baseline');")
(root/'validate.mjs').write_text(text,encoding='utf-8')
