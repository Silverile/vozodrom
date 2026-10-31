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
assert synthetic(1999,{'only':(2000,2010)}) is None
assert synthetic(2011,{'only':(2000,2010)}) is None
assert synthetic(2005,{'only':(2000,2010)})=='only'
assert synthetic(2026,{'only':(2000,None)})=='only'
assert synthetic(2026,{'only':(None,None)})=='only'
m=Matcher()
assert m.line('mercedes-benz','300',1985) is None
assert m.line('mercedes-benz','350',2005) is None
assert m.line('mercedes-benz','300',1926)=='300-350-predvalecne'
assert m.generation('mercedes-benz','300-350-predvalecne',1985) is None
assert m.line('jeep','GLADIATOR',1970)=='gladiator'
assert m.line('jeep','COMMANDER',2023)=='commander'
assert m.line('kia','CERATO',2018)=='cerato'
assert m.line('maruti-suzuki','BALENO',1998)=='baleno'
code="import sys;sys.path.insert(0,'scripts/stats');from match import Matcher;print(Matcher().line('mercedes-benz','380',1935))"
answers=[]
for seed in [0,1,8,9,12,21]:
    env=dict(os.environ,PYTHONHASHSEED=str(seed))
    answers.append(subprocess.check_output([sys.executable,'-B','-c',code],env=env,text=True).strip())
assert set(answers)=={'380-500k-540k'},answers
print('PASS: single-candidate date rejection, generation-first stale-line bounds, undated fallback, stable ambiguity ordering, six hash seeds')
