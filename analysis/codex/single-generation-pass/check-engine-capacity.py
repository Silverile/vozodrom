import importlib.util
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e)
for code in ['E38','E65','F01']:
 t,c,err=e.fetch('https://en.wikipedia.org/wiki/BMW_7_Series_('+code+')');print(code,err)
 for tb in t.xpath('//table'):
  txt=e.clean(tb.text_content())
  if 'kW' in txt and ('Years' in txt or 'years' in txt) and len(txt)<14000:print(txt)
