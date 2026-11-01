import importlib.util,concurrent.futures
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e)
urls=['https://www.citroenet.org.uk/utilities/jumpy-2016/jumpy-2.html','https://en.wikipedia.org/wiki/Nissan_Pathfinder','https://en.wikipedia.org/wiki/Mazda_MPV']
r=[]
for u in urls:
 t,c,err=e.fetch(u);r.append({'url':u,'error':err,'text':e.clean(t.text_content()) if t is not None else ''})
e.write('analysis/codex/single-generation-pass/batch-4/prose-engines.json',r)
print('Fetched',len(r))
