"""BMW 7 generation split: synthetic model names, years and explicit chassis codes."""
from match import Matcher
m=Matcher()
for i,(name,year,code) in enumerate([('728',1980,'E23'),('735i',1990,'E32'),('740i',1998,'E38'),('730d',2006,'E65'),('750i',2011,'F01'),('730d',2018,'G11'),('740d',2024,'G70')]):
 assert m.line('bmw',name,year)=='rada-7',(name,year)
 assert m.generation('bmw','rada-7',year,name)==i,(name,year,i)
 assert m.generation('bmw','rada-7',year,code)==i,(code,year,i)
for name,year,index in [('E66 730Ld',2006,3),('F02 750Li',2011,4),('G12 730Ld',2018,5),('G73',2024,6)]:
 assert m.generation('bmw','rada-7',year,name)==index,(name,year)
assert m.generation('bmw','rada-7',1970,'728') is None
print('PASS: seven BMW 7 cohorts, explicit chassis and four long-wheelbase/Protection codes; pre-production year rejected')
