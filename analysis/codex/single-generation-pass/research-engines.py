import importlib.util,json,pathlib
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e)
p=pathlib.Path('analysis/codex/single-generation-pass/bmw7-research.json');results=json.loads(p.read_text('utf8'))
for i in [2,3,4]:
 r=results[i];url='https://de.wikipedia.org/wiki/BMW_'+r['code'];tree,c,error=e.fetch(url);r['engineUrl']=url;r['engineError']=error
 if tree is not None:
  card={'name':'BMW 7','generations':[{'code':x['code'],'from':1977 if j==0 else [0,1986,1994,2001,2008,2015,2022][j],'to':[1986,1994,2001,2008,2015,2022,None][j]} for j,x in enumerate(results)]}
  r['rows']=[{'generation':j,'engine':v} for j,v in e.page_rows(tree,url,card)]
  r['engineTables']=[e.clean(t.text_content())[:18000] for t in tree.xpath('//table') if 'kW' in t.text_content() and len(t.text_content())<60000]
 print(r['code'],error,len(r['rows']),flush=True)
e.write(str(p),results)

