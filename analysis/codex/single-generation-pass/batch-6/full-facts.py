import pathlib,importlib.util,concurrent.futures,re
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e)
root=pathlib.Path('analysis/codex/single-generation-pass/batch-6')
src=(root/'supplementary.py').read_text(encoding='utf-8-sig');exec(src[src.index('def fetch(item):'):src.index('r=list(')])
rows=e.load(str(root/'research.json'))
ids={'buick/enclave','buick/gl8','buick/skyhawk','byd/e6','changan/alsvin','chevrolet/equinox','chevrolet/s-10','fiat/siena','honda/acty','honda/brio','honda/elysion','honda/freed','honda/n-box','honda/ridgeline','honda/stepwgn','gmc/sonoma','gmc/jimmy-s15'}
urls={x['url']:[x['make']+'/'+x['line']] for x in rows if x['make']+'/'+x['line'] in ids}
r=list(concurrent.futures.ThreadPoolExecutor(max_workers=8).map(fetch,urls.items()));e.write(str(root/'full-facts.json'),r)
for x in r:
 print(','.join(x['ids']),x['error'],flush=True)
 for b in x['boxes']:
  print(b['heading'],{k:v for k,v in b['facts'].items() if k in ['Engine','Power output','Platform','Model code','Production']},flush=True)
