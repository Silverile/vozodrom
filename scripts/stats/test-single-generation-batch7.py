"""Parallel vans/trucks/EVs, carried-over bodies and prototype-year exclusion."""
from match import Matcher
m=Matcher()
cases=[
 ('isuzu','como',2012,'E25',0),('isuzu','como',2012,'E26',1),
 ('isuzu','panther',2010,'TBR54',0),('isuzu','panther',2010,'TBR541',1),
 ('isuzu','fargo',1995,'WFR',0),('isuzu','fargo',1995,'E24',1),
 ('mazda','cosmo',1974,'',None),('mazda','cosmo',1981,'CD',1),('mazda','cosmo',1981,'HB',2),('mazda','cosmo',1990,'JC',3),
 ('mitsubishi','minica',1979,'A106V',1),('mitsubishi','minica',1979,'A106A',3),
 ('mitsubishi','minica',1998,'H32V',6),('mitsubishi','minica',1998,'H42V',7),
 ('mitsubishi','minicab',1973,'LT30',0),('mitsubishi','minicab',1973,'T131',1),
 ('mitsubishi','minicab',2014,'U61T',5),('mitsubishi','minicab',2018,'U68V',5),
 ('mitsubishi','minicab',2018,'DS16T',6),('mitsubishi','minicab',2018,'DS17V',7),('mitsubishi','minicab',2026,'DS18V',7),
 ('toyota','publica',1967,'UP20',0),('toyota','publica',1969,'UP20',0),('toyota','publica',1969,'P30',1),('toyota','publica',1985,'',1),
 ('pontiac','grand-am',1976,'',None),('pontiac','grand-am',1982,'',None),('pontiac','grand-am',1984,'',2),
 ('mercedes-benz','600',1963,'W100',None),('mercedes-benz','600',1964,'W100',0),
 ('skoda','860',1929,'',None),('skoda','superb-1934',1934,'',None),('skoda','superb-1934',1935,'',0),
 ('nash','single-six',1930,'450',None),('packard','light-eight',1932,'900',None),
]
for make,line,year,code,expected in cases:
 actual=m.generation(make,line,year,code)
 assert actual==expected,(make,line,year,code,actual,expected)
print(f'PASS: {len(cases)} parallel-body/EV, prototype and unknown-production-date cases')
