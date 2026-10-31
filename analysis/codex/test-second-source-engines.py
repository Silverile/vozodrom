"""Regression fixtures for second-source table layouts and attribution boundaries."""
import importlib.util,sys
sys.stdout.reconfigure(encoding='utf8')
s=importlib.util.spec_from_file_location('research','analysis/codex/second-source-engines.py')
r=importlib.util.module_from_spec(s);s.loader.exec_module(r)
assert r.short_name('C 180')=='C 180'
assert r.short_name('E 200 E 200 T E 200 Coupé')=='E 200'
assert r.short_name('200 E 200 TE')=='200 E'
assert r.short_name('518.1')=='518'
assert r.short_name('M102.922')=='M102.922'
assert not r.t.foreign_market('1.6 Mexico')
assert r.t.foreign_market('1.6 (Mexico)')
table=r.t.lxml.html.fromstring('''<table><tr><th>Modell</th><th>518</th><th>524d</th><th>535is</th></tr>
<tr><th>Ausführung</th><td>DE</td><td>DE</td><td>US</td></tr>
<tr><th>Motortyp</th><td>BMW M10</td><td>BMW M21</td><td>BMW M30</td></tr>
<tr><th>Bauart</th><td>Reihenvierzylinder-Ottomotor</td><td>Reihensechszylinder-Dieselmotor</td><td>Ottomotor</td></tr>
<tr><th>Hubraum</th><td>1766 cm³</td><td>2443 cm³</td><td>3430 cm³</td></tr>
<tr><th>Nennleistung</th><td>66 kW</td><td>63 kW</td><td>135 kW</td></tr></table>''')
rows=r.table_rows(table,'Technische Daten','https://de.wikipedia.org/wiki/BMW_E28',2)
assert [(x['variant'],x['fuel'],x['powerKwMin']) for x in rows]==[('518','petrol',66),('524d','diesel',63)]
table=r.t.lxml.html.fromstring('''<table><tr><td colspan="4">Limousine</td></tr>
<tr><td>Modell</td><td>Hubraum</td><td>Leistung</td><td>Bauzeit</td></tr>
<tr><td colspan="4">Ottomotoren</td></tr><tr><td>C 180</td><td>1799 cm³</td><td>90 kW</td><td>1993–1997</td></tr>
<tr><td colspan="4">Dieselmotoren</td></tr><tr><td>C 220 CDI</td><td>2151 cm³</td><td>92 kW</td><td>1997–2000</td></tr></table>''')
rows=r.table_rows(table,'Technische Daten','https://de.wikipedia.org/wiki/Mercedes-Benz_Baureihe_202',2)
assert [(x['variant'],x['fuel']) for x in rows]==[('C 180','petrol'),('C 220 CDI','diesel')],rows
table=r.t.lxml.html.fromstring('''<table><tr><th>Modell</th><th>Hubraum</th><th>kW (PS)</th></tr>
<tr><td>1.3</td><td>1,3 l</td><td>55 (75)</td></tr><tr><td>1.4 (CRX)</td><td>1,4 l</td><td>66 (90)</td></tr></table>''')
rows=r.table_rows(table,'Ottomotoren','https://de.wikipedia.org/wiki/Honda_Civic_4._Generation',2)
assert len(rows)==1 and rows[0]['powerKwMin']==55 and rows[0]['displacementLitresNominal']==1.3
card={'name':'Example','generations':[{'code':'I','name':'Example I','from':1990,'to':2000},{'code':'II','name':'Example II','from':2000,'to':2010}]}
row={'sourceScope':{'variantYears':None}}
assert r.t.generation_attribution(card,'Example',[],row,None) is None
hybrid=r.t.lxml.html.fromstring('''<html><h1>BMW G45</h1><table><tr><th>Modell</th><th>20 xDrive</th><th>30 xDrive (1)</th><th>M50 xDrive</th></tr>
<tr><th>Bauzeitraum</th><td>seit 11/2024</td><td>seit 11/2024</td><td>ab 12/2026</td></tr>
<tr><th>Motorart</th><td>Ottomotor als Mild-Hybrid</td><td>Ottomotor als Mild-Hybrid</td><td>Ottomotor als Mild-Hybrid</td></tr>
<tr><th>Hubraum</th><td>1998 cm³</td><td>1998 cm³</td><td>2998 cm³</td></tr>
<tr><th>max. Leistung</th><td>140 kW + 13 kW</td><td>180 kW + 10 kW</td><td>313 kW + 13 kW</td></tr>
<tr><th>Systemleistung</th><td>150 kW</td><td>190 kW</td><td>326 kW</td></tr></table></html>''')
bmw={'name':'X3','generations':[{'name':'X3 (G45)','code':'G45','from':2024,'to':None}]}
out=r.bmw_hybrid_rows(hybrid,'https://de.wikipedia.org/wiki/BMW_G45',bmw,0)
assert [(e['variant'],e['fuel'],e['powerKwMin']) for e in out]==[('20 xDrive','petrol-mhev',150)]
hybrid.xpath('//h1')[0].text='BMW X3'
assert not r.bmw_hybrid_rows(hybrid,'https://de.wikipedia.org/wiki/BMW_X3',bmw,0)
overlap=r.t.lxml.html.fromstring('''<html><h1>Porsche 993</h1><table><tr><th>Produktionszeitraum</th><td>1993–1998</td></tr><tr><th>Motoren</th><td>Ottomotoren</td></tr></table>
<h2>Technische Daten</h2><table><tr><th>Modell</th><th>Hubraum</th><th>Leistung</th></tr><tr><td>Carrera</td><td>3600 cm³</td><td>200 kW</td></tr></table></html>''')
porsche={'name':'911','generations':[{'code':'993','name':'911 993','from':1994,'to':1998},{'code':'996','name':'911 996','from':1997,'to':2004}]}
assert [gi for gi,e in r.page_rows(overlap,'https://de.wikipedia.org/wiki/Porsche_993',porsche)]==[0]
print('PASS: transposed fuel evidence, foreign-market exclusion, embedded headers, spanning fuel categories, kW-only header, litre evidence, sibling exclusion and ambiguous-generation rejection')
print('PASS: explicit system power without component sum; regional/future revisions excluded; article identity required; overlapping numeric chassis article attributed uniquely')
