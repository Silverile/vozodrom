import pathlib,json,gzip,sys,hashlib
sys.stdout.reconfigure(encoding='utf8')
root=pathlib.Path('analysis/codex/popular-engines-pass/batch-4');root.mkdir(exist_ok=True)
read=lambda p:json.loads(pathlib.Path(p).read_text(encoding='utf8'))
queue=read(root.parent/'batch-3/remaining-queue.json')['nextFleet100To999'];selected=queue[:90]
index=read('src/data/model-cards-index.json')
assert len(queue)==80 and all(not index[r['make']][r['line']]['generations'][r['index']]['engines'] for r in selected)
paths=[*pathlib.Path('src/data/catalog/model-cards').glob('*.json'),*pathlib.Path('src/data/model-cards').glob('*.json'),*pathlib.Path('src/data/stats').glob('*.json'),*[pathlib.Path(p) for p in ['src/data/model-cards-index.json','src/data/model-lines-index.json','src/data/catalog/model-lines-auto.json','src/data/catalog/model-line-additions.json','src/data/catalog/generation-id-aliases.json','src/data/front-drawings.json','src/data/front-drawing-review.json','src/data/listing-stats.json']]]
assert not (root/'baseline.json.gz').exists()
baseline={p.as_posix():read(p) for p in paths};(root/'baseline.json.gz').write_bytes(gzip.compress(json.dumps(baseline,ensure_ascii=False).encode(),compresslevel=6))
for file,data in [('selection.json',selected),('untouched-queue.json',queue[90:]),('target-candidates.json',[{**r,'status':'needs-research','engines':[],'attempts':[]} for r in selected])]:
 (root/file).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print({'selected':len(selected),'remainingUntouched':len(queue)-len(selected),'baselineFiles':len(baseline)})
