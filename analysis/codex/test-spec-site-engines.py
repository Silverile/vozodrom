"""No-network regression fixtures for explicit kW and generation/body boundaries."""
import importlib.util
s=importlib.util.spec_from_file_location('spec','analysis/codex/spec-site-engines.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
item={'make':'bmw','line':'ix','generationIndex':0}
m.r.INDEX={'bmw':{'ix':{'name':'iX','generations':[{'name':'iX','code':None,'from':2021,'to':None,'bodyTypes':['suv']}]}}}
html='''<html><div><h1>BMW iX xDrive40 Specs</h1><b>(2021 - 2025)</b></div><table>
<tr><td>Generation :</td><td>iX 1st Gen. (i20) - 2021 New Model</td></tr>
<tr><td>Body :</td><td>SUV / TT</td></tr><tr><td>Engine Type :</td><td>Electric</td></tr>
<tr><td>Total electric power :</td><td>326 PS / 322 HP / 240 kW</td></tr>
<tr><td>Front Axle Electric Engine Power :</td><td>190 kW</td></tr><tr><td>Rear Axle Electric Engine Power :</td><td>200 kW</td></tr>
</table></html>'''
tree=m.r.t.lxml.html.fromstring(html);url='https://www.ultimatespecs.com/car-specs/BMW/127916/BMW-iX-xDrive40.html'
e,why=m.detail(tree,url,item,'iX',(2021,None));assert why is None;assert e['variant']=='xDrive40';assert e['fuel']=='electric';assert e['powerKwMin']==240
assert e['sourceScope']['specificationPage']['powerLabel']=='TOTAL ELECTRIC POWER'
assert m.detail(m.r.t.lxml.html.fromstring(html.replace('240 kW','326 PS')),url,item,'iX',(2021,None))[0] is None
assert m.detail(m.r.t.lxml.html.fromstring(html.replace('Electric</td>','Hybrid</td>')),url,item,'iX',(2021,None))[0] is None
assert m.detail(tree,url,item,'iX',(2030,None))[0] is None
assert m.detail(m.r.t.lxml.html.fromstring(html.replace('BMW iX xDrive40','BMW iX3 xDrive40')),url,item,'iX',(2021,None))[0] is None
without_generation=html.replace('<tr><td>Generation :</td><td>iX 1st Gen. (i20) - 2021 New Model</td></tr>','')
assert m.detail(m.r.t.lxml.html.fromstring(without_generation),url,item,'iX',(2021,None))[0] is None
assert m.detail(m.r.t.lxml.html.fromstring(without_generation),url,item,'iX',(2021,None),'https://www.ultimatespecs.com/car-specs/BMW/M11969/iX')[0] is not None
assert m.production(m.r.t.lxml.html.fromstring('<p>Production years: 2005</p>'))==(2005,None)
m.r.INDEX['bmw']['ix']['generations'][0]['bodyTypes']=['convertible'];assert m.detail(tree,url,item,'iX',(2021,None))[0] is None
print('PASS: vehicle-level electric kW, no component sum/HP conversion, hybrid rejection, production/body/model boundaries and explicit generation-index linkage')
