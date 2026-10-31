"""Synthetic routing checks for the X5/X3 family splits, including overlap years."""
from match import Matcher
m=Matcher()
cases=[('x5',2000,'X5',0),('x5',2008,'X5',1),('x5',2015,'X5',2),('x5',2021,'X5',3),('x5',2026,'X5',4),('x5',2026,'X5 G05',3),('x5',2026,'X5 G65',4),('x3',2005,'X3',0),('x3',2013,'X3',1),('x3',2017,'X3 F25',1),('x3',2021,'X3',2),('x3',2024,'X3 G01',2),('x3',2025,'X3',3)]
for line,year,name,index in cases:
    assert m.line('bmw',name,year)==line,(line,year,name,'line')
    assert m.generation('bmw',line,year,name)==index,(line,year,name,index)
assert m.generation('bmw','x5',None,'X5') is None
print(f'PASS: {len(cases)} BMW X5/X3 generation cases and unknown-year exclusion')
