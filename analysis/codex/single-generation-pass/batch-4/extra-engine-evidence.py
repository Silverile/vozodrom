import pathlib,importlib.util,json,concurrent.futures,re
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e);urls=['https://www.opel-infos.de/modelle/combo_b.html','https://www.opel-infos.de/modelle/combo_a.html','https://www.opel-infos.de/modelle/kadett_e.html','https://de.wikipedia.org/wiki/Nissan_Pulsar_(Europa)','https://de.wikipedia.org/wiki/BMW_E32']
def work(u):
 t,c,err=e.fetch(u);return {'url':u,'error':err,'text':e.clean(t.text_content()) if t is not None else ''}
r=list(concurrent.futures.ThreadPoolExecutor(max_workers=5).map(work,urls));e.write('analysis/codex/single-generation-pass/batch-4/extra-engine-evidence.json',r)
for x in r:print(x['url'],x['error'],x['text'][:80])
