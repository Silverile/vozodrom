import pathlib,importlib.util,concurrent.futures,re
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e);root=pathlib.Path('analysis/codex/single-generation-pass/batch-4');text=pathlib.Path('analysis/codex/single-generation-pass/batch-3/research.py').read_text(encoding='utf-8-sig');exec(text[text.index('def fetch(item):'):text.index('r=list(')])
titles=['Nissan_Silvia','Nissan_Sylphy','Nissan_AD','Nissan_Liberty','Chevrolet_Silverado_(first_generation)','Chevrolet_Silverado_(second_generation)','Chevrolet_C/K_(fourth_generation)','Nissan_Sunny_(B10)','Nissan_Almera','GAZelle_Business','Lada_Samara','Nissan_Bluebird_(T12)']
r=list(concurrent.futures.ThreadPoolExecutor(max_workers=6).map(fetch,[({},t) for t in titles]));e.write(str(root/'supplementary.json'),r)
for x in r:
 print(x['title'],x['error'])
 for b in x['boxes']:
  if b['facts'].get('Production'):print(' ',b['heading'],b['facts']['Production'])
