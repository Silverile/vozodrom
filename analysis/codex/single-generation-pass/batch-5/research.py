import json,pathlib,importlib.util,concurrent.futures,re
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e)
root=pathlib.Path('analysis/codex/single-generation-pass/batch-5');root.mkdir(exist_ok=True)
q=e.load('analysis/codex/single-generation-pass/batch-4/remaining-queue.json')['lines'][:80]
titles='Mazda_929|Porsche_928|GMC_Yukon|Audi_Coupé|Nissan_Silvia|Peugeot_504|Honda_Odyssey_(international)|Microcar_(brand)|BMW_3/20|Chevrolet_Express|Citroën_DS|Nissan_300ZX|Daewoo_Tacuma|Lada_110|Aixam|Aixam|Alfa_Romeo_90|Chevrolet_Astro|Nissan_Skyline|Peugeot_404|Nissan_Cube|Honda_Pilot|Chevrolet_Express|Aixam|Citroën_Dyane|GAZ_Sobol|Citroën_H_Van|Fiat_124_Sport_Spider|Abarth_500|Fiat_850|Fiat_850|Abarth_Punto|AC_Ten|AC_2-Litre|AC_Cars|Isuzu_Trooper|Adler_(cars_and_motorcycle)|Aixam|Aixam|Aixam|Aixam|Aixam|Aixam|Aixam|Aixam|Alfa_Romeo_24_HP|Alfa_Romeo_2600|Alfa_Romeo_SZ|Alpina_C2|AMC_Ambassador|Ariel_Motor_Company|Aston_Martin_Lagonda|Aston_Martin_Mark_II|Aston_Martin_V8|Audi_Front|Audi_Front|Audi_S6|Audi_Quattro|Audi_Type_P|Austin_Cambridge|Austin_Maestro|Austin_Montego|Austin_7|Austin_10|Austin_12|Autobianchi_A112|Avions_Voisin|Avions_Voisin|Avions_Voisin|Avions_Voisin|Avions_Voisin|Bentley_6½_Litre|Bentley_Continental_(1984)|Borgward_Hansa_2000|Borgward_Hansa_2300|Hansa_1100_(1934)|Bristol_Blenheim|Bristol_603|Bristol_603|Bugatti_Type_13'.split('|')
assert len(q)==len(titles)
text=pathlib.Path('analysis/codex/single-generation-pass/batch-3/research.py').read_text(encoding='utf-8-sig');exec(text[text.index('def fetch(item):'):text.index('r=list(')])
r=list(concurrent.futures.ThreadPoolExecutor(max_workers=8).map(fetch,zip(q,titles)))
e.write(str(root/'selection.json'),q);e.write(str(root/'research.json'),r)
for x in r:
 print(x['make']+'/'+x['line'],x['error'],flush=True)
 for b in x['boxes']:
  if b['facts'].get('Production'):print(' ',b['heading'],b['facts'].get('Production'),';',b['facts'].get('Body style',''),flush=True)
