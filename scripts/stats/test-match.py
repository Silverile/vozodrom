"""Matcher ambiguity regressions: synthetic names only; no vehicle-level inputs."""
import os,subprocess,sys
sys.path.insert(0,os.path.dirname(__file__))
from match import Matcher

def synthetic(year,years):
    m=Matcher.__new__(Matcher)
    m._cache={('test','MODEL'):list(reversed(list(years)))}
    m.years={('test',slug):bounds for slug,bounds in years.items()}
    return m.line('test','MODEL',year)

assert synthetic(2005,{'a-undated':(None,None),'z-dated':(2000,2010)})=='z-dated'
assert synthetic(2020,{'a-undated':(None,None),'z-ended':(2000,2010)})=='a-undated'
assert synthetic(2005,{'z-older':(1990,2010),'a-newer':(2000,2020)})=='a-newer'
assert synthetic(2005,{'z-same':(2000,2010),'a-same':(2000,2010)})=='a-same'
code="import sys;sys.path.insert(0,'scripts/stats');from match import Matcher;print(Matcher().line('mercedes-benz','380',1935))"
answers=[]
for seed in [0,1,8,9,12,21]:
    env=dict(os.environ,PYTHONHASHSEED=str(seed))
    answers.append(subprocess.check_output([sys.executable,'-B','-c',code],env=env,text=True).strip())
assert set(answers)=={'380-500k-540k'},answers
print('PASS: dated bounds, undated fallback, latest applicable start, stable slug tie, six hash seeds')
