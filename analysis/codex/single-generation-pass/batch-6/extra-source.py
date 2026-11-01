import pathlib,importlib.util,concurrent.futures,re
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e)
root=pathlib.Path('analysis/codex/single-generation-pass/batch-6')
text=(root/'supplementary.py').read_text(encoding='utf-8-sig');exec(text[text.index('def fetch(item):'):text.index('r=list(')])
urls={'https://en.wikipedia.org/wiki/Chevrolet_Colorado':['chevrolet/s-10'],'https://en.wikipedia.org/wiki/Honda_Ridgeline_(first_generation)':['honda/ridgeline'],'https://en.wikipedia.org/wiki/Honda_Ridgeline_(second_generation)':['honda/ridgeline'],'https://en.wikipedia.org/wiki/Ginetta':['ginetta/g11','ginetta/g2','ginetta/grs-tora'],'https://global.honda/jp/tech/engine/car/S07B_nbox_vtec/':['honda/n-box'],'https://global.honda/en/newsroom/news/2024/4240627eng-freed.html':['honda/freed']}
r=list(concurrent.futures.ThreadPoolExecutor(max_workers=8).map(fetch,urls.items()));e.write(str(root/'extra-source.json'),r)
for x in r:
 print(x['url'],x['error'],flush=True)
 for b in x['boxes']:print(b['heading'],{k:v for k,v in b['facts'].items() if k in ['Engine','Production']},flush=True)
