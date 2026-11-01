"""Hash every deterministic Matcher constructor field; contains model metadata only."""
import sys,json,hashlib
from pathlib import Path
sys.path.insert(0,'scripts/stats')
from match import Matcher
def plain(x):
 if isinstance(x,dict):return {str(k):plain(v) for k,v in sorted(x.items(),key=lambda z:str(z[0]))}
 if isinstance(x,set):return sorted(plain(v) for v in x)
 if isinstance(x,(list,tuple)):return [plain(v) for v in x]
 return x
m=plain(Matcher().__dict__)
data=json.dumps(m,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
result={'sha256':hashlib.sha256(data).hexdigest(),'scope':'All deterministic fields of a fresh Matcher constructor, including line aliases, dates, generation identities and chassis routing. Empty lookup cache.'}
Path('analysis/codex/single-generation-pass/batch-6/matching-'+sys.argv[1]+'.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print(result)
