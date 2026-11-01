import pathlib,importlib.util,re,urllib.parse,time
s=importlib.util.spec_from_file_location('e','analysis/codex/spec-site-engines.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e);root=pathlib.Path('analysis/codex/single-generation-pass/batch-4');url='https://www.ultimatespecs.com/car-specs/Nissan/M1117/Sunny-N14';t,c,err=e.r.t.fetch(url);out=[];attempts=[{'url':url,'error':err}]
if t is not None:
 title=e.r.t.clean(t.xpath('string(//h1)'));span=e.production(t);links=[]
 for tb in t.xpath('//table'):
  if 'Horsepower' in tb.text_content():links.extend(u for u,label in e.links(tb) if re.search('/Nissan/\\d+/',u))
 for u in dict.fromkeys(links):
  time.sleep(1.5);dt,dc,de=e.r.t.fetch(u);attempts.append({'url':u,'error':de})
  if de:
   if '429' in de:break
   continue
  engine,why=e.detail(dt,u,{'make':'nissan','line':'sunny','generationIndex':7},title,span,url)
  if engine:out.append({'id':'nissan/sunny','index':7,'engine':engine})
  else:attempts[-1]['rejection']=why
 e.r.t.write(str(root/'sunny-corrected-engines.json'),out);e.r.t.write(str(root/'sunny-spec-attempts.json'),attempts);print(title,span,len(out))
