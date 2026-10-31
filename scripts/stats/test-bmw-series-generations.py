"""BMW sports-series splits and dedicated GT/Tourer routing (synthetic inputs)."""
from match import Matcher
m=Matcher()
cases=[('Z4',2005,'z4',0),('Z4 E89',2010,'z4',1),('Z4',2024,'z4',2),('635CSI',1985,'rada-6',0),('645CI',2006,'rada-6',1),('640D',2015,'rada-6',2),('630D',2020,'rada-6-gran-turismo',0),('G32',2018,'rada-6-gran-turismo',0),('F06 640D',2018,'rada-6',2),('220D',2013,'rada-2',0),('220I',2023,'rada-2',1),('218I ACTIVE TOURER',2017,'rada-2-active-tourer',0),('218I GRAN TOURER',2019,'rada-2-gran-tourer',None)]
for model,year,line,gen in cases:
 assert m.line('bmw',model,year)==line,(model,year,line)
 assert m.generation('bmw',line,year,model)==gen,(model,year,gen)
assert m.line('bmw','Z4',2017) is None
assert m.line('bmw','630',1995) is None
print(f'PASS: {len(cases)} BMW series cases plus two documented production gaps')
