"""Synthetic and catalogue generation-routing regressions; no vehicle records."""
import os,sys
sys.path.insert(0,os.path.dirname(__file__))
from match import Matcher
m=Matcher()
assert m.generation('fiat','palio',2001)==0
assert m.generation('fiat','palio',2015)==0
assert m.generation('fiat','palio',2015,'178AX1')==0
assert m.generation('fiat','palio',2015,'326AX1')==1
assert m.generation('fiat','palio',2019)==0
assert m.generation('fiat','palio',2021) is None
assert m.generation('cadillac','escalade',1999)==0
assert m.generation('cadillac','escalade',2003)==1
assert m.generation('cadillac','escalade',2010)==2
assert m.generation('cadillac','escalade',2018)==3
assert m.generation('cadillac','escalade',2022)==4
assert m.generation('bmw','ix3',2022)==0
assert m.generation('bmw','ix3',2025,'G08')==0
assert m.generation('bmw','ix3',2025,'NA5')==1
assert m.generation('bmw','ix3',2026)==1
print('PASS: Palio regional explicit-code routing, five Escalade eras, iX3 overlap chassis tie-break')
