from pathlib import Path
import json
HERE=Path(__file__).resolve().parent
def read(name,default):
    try:return json.loads((HERE/name).read_text(encoding='utf-8-sig'))
    except Exception:return default
out={}
for name in ('batch-1-qa.json','batch-2-qa.json'):
    rows=read(name,[])
    if isinstance(rows,dict): rows=rows.get('items',rows.get('results',[]))
    for row in rows:
        issues=row.get('issues',[])
        if isinstance(issues,str):issues=[issues]
        notes=[row.get(k) for k in ('notes','accuracy') if row.get(k)]
        status=row.get('status','needs-review')
        out[row['id']]={'status':'blocked' if status in ('redo-recommended','reject','blocked') else 'pass' if status=='pass' else 'review','selectedVersion':row.get('selectedVersion',''),'issues':notes+issues}
(HERE/'qa.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Consolidated QA: {len(out)} entries')
