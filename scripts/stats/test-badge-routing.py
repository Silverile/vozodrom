"""Synthetic public model badges only; no raw vehicle records or identifiers."""
import json,os,subprocess,sys
sys.path.insert(0,os.path.dirname(__file__))
from match import Matcher
m=Matcher()
cases=[]
def check(make,text,year,want):
    got=m.line(make,text,year)
    assert got==want,(make,text,year,want,got)
    cases.append([make,text,year,want])
for badge in ['316','318','320','323','325','328','330','335','340']:
    for suffix in ['', 'D', ' I', 'e']:
        check('bmw',badge+suffix,2018,'rada-3')
for badge,series,year in [('118D',1,2015),('218i',2,2018),('420D',4,2020),('530D',5,2010),('640D',6,2015),('750i',7,2010),('840D',8,2020)]:check('bmw',badge,year,'rada-'+str(series))
for badge,year,want in [('320',1937,'320'),('328',1938,'328'),('335',1940,'335'),('501',1958,'501'),('507',1959,'507'),('600',1958,'600'),('700',1961,'700'),('M1',1979,'m1'),('M2',2020,'rada-2'),('M3',2001,'rada-3'),('M5',2015,'rada-5'),('M135i',2017,'rada-1'),('M550D',2020,'rada-5'),('X 5',2010,'x5'),('X5 M50D',2018,'x5'),('Z 3',2000,'z3'),('Z4 SDRIVE',2010,'z4'),('i3 94AH',2017,'i3'),('i4',2023,'i4'),('iX3',2022,'ix3'),('IX 1',2023,'ix1'),('XM',2024,'xm'),('BMW320D',2015,'rada-3'),('218I ACTIVE TOURER',2017,'rada-2-active-tourer'),('640D GT',2020,'rada-6-gran-turismo'),('E46 320D',2004,'rada-3')]:check('bmw',badge,year,want)
check('bmw','320',1950,None)
assert m.line('bmw','2002',1972)!='rada-2'
check('bmw','X5',1990,None)
assert m.generation('bmw','rada-3',2004,'E46')==3
assert m.generation('bmw','rada-3',2004,'E90')==4
for text,year,want in [('C200',2010,'trida-c'),('C 200 CDI',2010,'trida-c'),('E220 CDI',2015,'trida-e'),('AMG C63',2015,'trida-c'),('CLA200',2016,'cla'),('GLA180',2020,'gla'),('ML270 CDI',2003,'gle'),('GL350',2015,'gls'),('S500',2005,'trida-s'),('190E',1988,'190'),('190 E',1988,'190'),('300',1926,'300-350-predvalecne'),('300',1958,'300'),('300',1985,None),('220',1953,'220-w187'),('220',2003,None),('W220',2003,'trida-s'),('W220',1975,None),('W204',2010,'trida-c'),('EQA250',2023,'eqa'),('EQS450 SUV',2024,'eqs-suv')]:check('mercedes-benz',text,year,want)
for text,year,want in [('A 4',2010,'a4'),('A3',2000,'a3'),('RS6',2010,'rs6'),('100',1985,'100'),('200',1988,'200'),('50',1976,'50'),('A4',1960,None)]:check('audi',text,year,want)
for text,year,want in [('144',1970,'140-series'),('142',1970,'140-series'),('245',1985,'240'),('264',1980,'260'),('XC 90',2010,'xc90'),('C30',2010,'c30'),('S90',1997,'s90'),('S90',2020,'s90'),('240',1960,None)]:check('volvo',text,year,want)
for text,year,want in [('301',1934,'301'),('301',2015,'301'),('3008',2018,'3008'),('2008',2018,'2008'),('5008',2020,'5008'),('308',2010,'308'),('3008',1990,None),('30',2018,None)]:check('peugeot',text,year,want)
for text,year,want in [('93',1958,'93'),('93',2010,'9-3'),('9-3',2010,'9-3'),('95 V4',1970,'95'),('95',2005,'9-5'),('92X',2005,'9-2x'),('9000',1995,'9000'),('900',1990,'900'),('93',1980,None)]:check('saab',text,year,want)
# Reuse one cache in reversed date order: routing must never cache a year-specific answer.
for text,year,want in [('190SL',1958,'190-sl'),('190SL',1988,None),('300SL',1958,'300-sl'),('300SL',1990,'sl'),('500SEL',1990,'trida-s'),('500SEC',1990,'trida-s'),('500SEC',1994,'cl'),('300E',1990,'trida-e'),('230TE',1990,'trida-e')]:check('mercedes-benz',text,year,want)
check('bmw','320D',2015,'rada-3');check('bmw','320D',1937,'320');check('bmw','320D',2015,'rada-3')
for text,year,want in [('CL500',2005,'cl'),('T180',2023,'trida-t'),('W447',2020,'vito'),('W638',2000,'vito'),('X164',2010,'gls'),('W164',2010,'gle'),('450SLC',1975,'slc-c107'),('SLC300',2017,'slk')]:check('mercedes-benz',text,year,want)
for text,year,want in [('A160',2005,'trida-a'),('B200',2010,'trida-b'),('G500',2000,'trida-g'),('R320',2010,'trida-r'),('V220',2020,'trida-v'),('X250',2018,'trida-x'),('CLC200',2010,'clc'),('CLE300',2024,'cle'),('CLK200',2000,'clk'),('CLS350',2015,'cls'),('GLB200',2020,'glb'),('GLC250',2018,'glc'),('GLE350',2020,'gle'),('GLK220',2012,'glk'),('GLS450',2020,'gls'),('SL500',2010,'sl'),('SLK350',2010,'slk'),('EQB250',2023,'eqb'),('EQC400',2020,'eqc'),('EQE300',2023,'eqe'),('EQS450',2023,'eqs'),('EQV300',2022,'eqv')]:check('mercedes-benz',text,year,want)
code="import sys,json;sys.path.insert(0,'scripts/stats');from match import Matcher;m=Matcher();print(json.dumps([m.line('bmw','320D',2015),m.line('bmw','320',1937),m.line('mercedes-benz','300',1958),m.line('saab','93',2010)]))"
answers=[subprocess.check_output([sys.executable,'-B','-c',code],env=dict(os.environ,PYTHONHASHSEED=str(seed)),text=True).strip() for seed in [0,1,8,21]]
assert len(set(answers))==1,answers
print(json.dumps({'result':'PASS','syntheticCases':len(cases),'hashSeeds':4,'yearAwareCache':True}))
