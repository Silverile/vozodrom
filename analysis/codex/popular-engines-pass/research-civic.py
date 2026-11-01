"""The Civic tables label their power column kW, without the word Leistung."""
import pathlib,importlib.util,sys
sys.stdout.reconfigure(encoding='utf8')
s=importlib.util.spec_from_file_location('second','analysis/codex/second-source-engines.py');second=importlib.util.module_from_spec(s);s.loader.exec_module(second);e=second.t
s=importlib.util.spec_from_file_location('h','analysis/codex/popular-engines-pass/table-parser.py');h=importlib.util.module_from_spec(s);s.loader.exec_module(h);h.install(e);second.table_rows=e.parse_table
root=pathlib.Path('analysis/codex/popular-engines-pass');card=e.load('src/data/model-cards-index.json')['honda']['civic'];out=[]
for gi in [0,1,4,5,6,7]:
 url=f'https://de.wikipedia.org/wiki/Honda_Civic_{gi+1}._Generation';tree,canonical,error=e.fetch(url);rows=[]
 if tree is not None and second.owns_article(tree,card,'honda',gi):
  for el in tree.iter():
   if el.tail is not None:el.tail=' '+el.tail
   if el.tag=='br':el.tail=' '+(el.tail or '')
  rows=[row for i,row in second.page_rows(tree,url,card) if i==gi]
 out.append({'make':'honda','line':'civic','index':gi,'engines':rows,'url':url,'error':error});print(gi,len(rows),flush=True)
e.write(str(root/'civic-candidates.json'),out)
