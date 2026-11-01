"""Documented global Mazda badges; American-only badges stay outside this family."""
import sys
sys.path.insert(0,'scripts/stats')
from match import Matcher
m=Matcher()
for badge,year,index in [('B2000',1988,3),('B 2200',1992,3),('B2500',2000,4),('B 2500',2004,4),('B2600i',1991,3),('B-2600',2001,4),('MAZDA B2500 DOUBLE CAB',2003,4)]:
 assert m.line('mazda',badge,year)=='b-series',(badge,year)
 assert m.generation('mazda','b-series',year,badge)==index,(badge,index)
for badge in ['B2300','B3000','B4000','B25000','BT-50']:
 assert m.line('mazda',badge,2000)!='b-series',badge
assert m.line('mazda','B2500',2012) is None
assert m.line('mazda','B2500',1950) is None
assert m.generation('mazda','b-series',1998,'UF')==3
assert m.generation('mazda','b-series',1998,'UN')==4
print('PASS: Mazda badge spacing/suffixes, American-only exclusions, bounds and explicit transition chassis')
