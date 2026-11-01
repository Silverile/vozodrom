"""Prove presentation changes and correction of an inactive code cannot rematch data."""
import sys,json,subprocess,hashlib
from pathlib import Path
sys.path.insert(0,'scripts/stats')
from match import Matcher
root=Path('analysis/codex/single-generation-pass/batch-7')
def plain(x):
 if isinstance(x,dict):return {str(k):plain(v) for k,v in sorted(x.items(),key=lambda z:str(z[0]))}
 if isinstance(x,set):return sorted(plain(v) for v in x)
 if isinstance(x,(list,tuple)):return [plain(v) for v in x]
 return x
def digest(m):return hashlib.sha256(json.dumps(plain(m.__dict__),ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
before=Matcher();before_hash=digest(before)
assert before_hash==json.loads((root/'matching-before.json').read_text(encoding='utf-8-sig'))['sha256']
subprocess.run(['node',str(root/'finish-presentation.mjs')],check=True)
after=Matcher();after_hash=digest(after)
old=before.gens[('nash','single-six')][0];new=after.gens[('nash','single-six')][0]
assert old==(None,None,{'400'}) and new==(None,None,{'450'}),(old,new)
for year in range(1800,2101):
 for code in ['', '400', '450']:
  assert before.generation('nash','single-six',year,code) is None
  assert after.generation('nash','single-six',year,code) is None
assert before.generation('nash','single-six',None,'450') is None
assert after.generation('nash','single-six',None,'450') is None
before.gens[('nash','single-six')][0]=new
assert plain(before.__dict__)==plain(after.__dict__),'Unexpected matching change beyond inactive Nash code'
result={'result':'PASS','beforeSha256':before_hash,'afterSha256':after_hash,'scope':'Every deterministic Matcher constructor field compared. Only correction of an undated and therefore unassignable Nash generation code differs.','exception':{'id':'nash/single-six','codeBefore':'400','codeAfter':'450','from':None,'to':None,'source':'https://de.wikipedia.org/wiki/Nash_Single_Six','reason':'generation() requires a non-empty production start before considering type tokens; both versions have no start. Names, model bounds, line routing, every other generation and chassis route are identical.'},'sampleChecks':905}
(root/'matching-equivalence.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(root/'matching-after.json').write_text(json.dumps({'sha256':after_hash,'scope':result['scope']},indent=2)+'\n',encoding='utf-8')
print(result)
