import json,hashlib
from pathlib import Path
root=Path('analysis/codex/single-generation-pass/batch-7')
for name in ['supplementary.json','follow-up.json']:
 p=root/name;rows=json.loads(p.read_text(encoding='utf-8-sig'))
 for row in rows:
  if 'text' not in row:continue
  txt=row.pop('text');row['textSha256']=hashlib.sha256(txt.encode('utf-8')).hexdigest();row['textCharacters']=len(txt)
  if 'wikipedia.org' not in row['url']:row['prose']=[];row['note']='Full webpage omitted; model facts are represented in the plan/engine records and source URLs.'
 p.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
