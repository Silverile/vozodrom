import pathlib,json,gzip,sys
sys.stdout.reconfigure(encoding='utf-8')
root=pathlib.Path('analysis/codex/single-generation-pass/batch-8');root.mkdir(exist_ok=True)
def load(p):return json.loads(pathlib.Path(p).read_text(encoding='utf-8-sig'))
def write(p,x):pathlib.Path(p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
q=load(root.parent/'batch-7/remaining-queue.json')
paths=['src/data/catalog/model-lines-auto.json','src/data/catalog/model-line-additions.json','src/data/catalog/generation-id-aliases.json','src/data/model-lines-index.json','src/data/model-cards-index.json','src/data/listing-stats.json','src/data/stats/index.json','src/data/stats/mazda.json','src/data/catalog/model-cards/mazda.json','src/data/front-drawings.json','src/data/front-drawing-review.json']
with gzip.open(root/'baseline.json.gz','wt',encoding='utf-8') as f:json.dump({p:load(p) for p in paths},f,ensure_ascii=False)
queries=[]
for row in q['reviewedPending']:
 cards=load('src/data/catalog/model-cards/'+row['make']+'.json')
 card=next(c for c in cards if c['lineSlug']==row['line'])
 name=row['make'].replace('-',' ')+' '+card['name']
 tail='production history manufacturer museum'
 if row['make'] in ['amc','buick','cadillac','chevrolet','dodge','gmc','hudson','mercury','oldsmobile','packard','plymouth','pontiac']:tail='factory production dates calendar year generations'
 if row['make']=='hotchkiss':tail='club histoire fabrication carrosserie'
 if row['make']=='aixam':tail='histoire generation production chassis'
 queries.append({**row,'name':name,'query':name+' '+tail,'previousSources':card.get('sources',[])})
write(root/'search-queries.json',queries)
print('Prepared',len(queries),'model-specific searches')
