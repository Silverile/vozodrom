"""Regression cases for review findings: label artefacts and Sharan generation leakage."""
import importlib.util
s=importlib.util.spec_from_file_location('bulk','analysis/codex/engine-throughput.py')
m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
for raw,want in [('Motor.1',None),('Engine',None),('1.2 ecoFLEX.1','1.2 ecoFLEX'),('1.0 MPI.3','1.0 MPI'),('M102.922','M102.922'),('1.0','1.0'),('Diesel 1.9 TDI.4','1.9 TDI'),('1.5 L 3E inline-four (petrol) - Van, 09/91-01/94','1.5 L 3E')]:
    assert m.variant_name(raw)==want,(raw,m.variant_name(raw),want)
card={'name':'Sharan','generations':[{'name':'Sharan I','code':'I (7M)','from':1995,'to':2010},{'name':'Sharan II','code':'II (7N)','from':2010,'to':2022}]}
def row(years):return {'sourceScope':{'variantYears':years}}
checks=[(['First generation (Typ 7M; 1995–2010)','Engines (1995–2010)'],row('1998–2005'),0),
 (['Second generation (Typ 7N; 2010–2022)','Engines'],row('1998–2005'),None),
 (['Engines'],row(None),None),(['Engines'],row('2012–2018'),1),
 (['First generation (Typ 7M; 1995–2010)','Engines'],row('2012–2018'),None)]
for context,r,want in checks:
    result=m.generation_attribution(card,'Volkswagen Sharan',context,r,[1995,2022])
    assert (result[0] if result else None)==want,(context,result,want)
assert m.foreign_market('AFM - Only in Thailand, for tax reasons')
assert not m.foreign_market('European version, not sold in Thailand')
print('PASS: 8 name cases, 5 generation cases, 2 market cases')
