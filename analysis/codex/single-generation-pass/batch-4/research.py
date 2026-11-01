import json,pathlib,importlib.util,re,concurrent.futures
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e);root=pathlib.Path('analysis/codex/single-generation-pass/batch-4')
q=e.load('analysis/codex/single-generation-pass/batch-3/remaining-queue.json')['lines'];q=[x for x in q if x['fleet']>=100];ids={(x['make'],x['line']) for x in q}
r=[x for x in e.load('analysis/codex/single-generation-pass/batch-3/research.json') if (x['make'],x['line']) in ids];assert len(r)==17;e.write(str(root/'research.json'),r);e.write(str(root/'selection.json'),q)
for x in r:
 print(x['make']+'/'+x['line'],x['error'])
 for b in x['boxes']:
  if b['facts'].get('Production'):print(' ',b['heading'],b['facts'].get('Production'),';',b['facts'].get('Body style',''))
text=pathlib.Path('analysis/codex/single-generation-pass/batch-3/research.py').read_text(encoding='utf-8-sig');exec(text[text.index('def fetch(item):'):text.index('r=list(')])
titles=['Nissan_Sunny','Lada_Samara','Daewoo_Nexia','Nissan_Pulsar','GAZelle','Nissan_Bluebird','Nissan_Vanette','Nissan_Tiida','Nissan_200SX','Nissan_Maxima','Chevrolet_Silverado','Chevrolet_Suburban','Chevrolet_Tahoe','Citroën_GS','GMC_Sierra','Nissan_Prairie','Nissan_Serena']
def de(item):
 row,title=item;out=fetch((row,title));url='https://de.wikipedia.org/wiki/'+title
 # Reuse extraction with a temporary fetch adapter, keeping threads independent via direct helper below.
 t,c,err=e.fetch(url);boxes=[];tables=[];prose=[];head={}
 if t is not None:
  for el in t.xpath('//style|//script'):el.drop_tree()
  for el in t.iter():
   tag=el.tag if isinstance(el.tag,str) else ''
   if re.fullmatch('h[2345]',tag):
    lev=int(tag[1]);head={k:v for k,v in head.items() if k<lev};head[lev]=e.clean(el.text_content())
   txt=e.clean(el.text_content()) if tag in ['table','p'] else ''
   if tag=='table' and not el.xpath('ancestor::table') and ('infobox' in el.get('class','') or 'kW' in txt):tables.append({'heading':' / '.join(head.values()),'text':txt})
   if tag=='p' and re.search('produc|produ|fertig|gebaut|facelift|modellpflege|kW',txt,re.I):prose.append({'heading':' / '.join(head.values()),'text':txt})
 return {**row,'url':url,'error':err,'tables':tables,'prose':prose}
r=list(concurrent.futures.ThreadPoolExecutor(max_workers=6).map(de,zip(q,titles)));e.write(str(root/'de-research.json'),r)
print('DE supplementary complete')
