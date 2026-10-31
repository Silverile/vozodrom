"""Select output makes after full-history VIN processing, never before it."""
import json,pathlib,sys,hashlib
root=pathlib.Path(next((a[7:] for a in sys.argv if a.startswith('--root=')),'analysis/codex/wave-3/batch-1'))
read=lambda p:json.loads(p.read_text(encoding='utf8'))
inputs=read(root/'rebuild-inputs.json');full=read(root/'staged/global-istp/istp-agg.json');target=root/'staged/aggregates/istp-agg.json';previous=read(target)
selected={'meta':full['meta'],'keys':{k:v for k,v in full['keys'].items() if k.split('|')[0] in inputs['makes']}}
changes=[]
for key in selected['keys'].keys()|previous['keys'].keys():
 a=previous['keys'].get(key,{}).get('rollback');b=selected['keys'].get(key,{}).get('rollback')
 if a!=b:changes.append({'key':key,'makeFilteredHistory':a,'fullHistory':b})
target.write_text(json.dumps(selected,ensure_ascii=False),encoding='utf8')
report={'fullHistoryProcessed':True,'globalAggregateSha256':hashlib.sha256((root/'staged/global-istp/istp-agg.json').read_bytes()).hexdigest(),'reason':'Early --makes filtering drops cross-make VIN readings, changing rollback denominators. Select aggregate keys only after processing all VIN histories. No per-vehicle data stored.','makes':inputs['makes'],'allAggregateKeys':len(full['keys']),'selectedAggregateKeys':len(selected['keys']),'rollbackDifferencesVersusEarlyFilter':changes}
(root/'full-history-selection.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps(report))
