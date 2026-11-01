"""Regression checks for the eight formerly whole-line generation aggregates."""
from match import Matcher
m=Matcher()
cases={'x1':[(2011,0,'E84'),(2018,1,'F48'),(2024,2,'U11')], 'x6':[(2010,0,'E71'),(2016,1,'F16'),(2024,2,'G06')], 'rada-8':[(1995,0,'E31'),(2021,1,'G15')]}
for line,rows in cases.items():
 for year,index,code in rows:
  assert m.generation('bmw',line,year,code)==index,(line,year,code)
for make,line,rows in [('opel','vivaro',[(2006,0),(2016,1),(2023,2)]),('opel','movano',[(2005,0),(2016,1),(2023,2)]),('opel','combo',[(1990,0),(1998,1),(2008,2),(2014,3),(2023,4)]),('opel','omega',[(1990,0),(2000,1)]),('citroen','jumpy',[(2000,0),(2010,1),(2023,2)])]:
 for year,index in rows:assert m.generation(make,line,year,line)==index,(make,line,year)
assert m.generation('bmw','rada-8',2005,'840i') is None
assert m.generation('bmw','x6',2007,'X6') is None
assert m.generation('citroen','jumpy',1994,'JUMPY') is None
print('PASS: 24 generation-year cases, BMW chassis codes, 8-Series hiatus, pre-production X6/Jumpy rejected')
