import json,importlib.util,pathlib
s=importlib.util.spec_from_file_location('e','analysis/codex/engine-throughput.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e)
urls=['https://faq2.nissan.co.jp/faq/show/9043?site_domain=default','https://www.media.stellantis.com/it-it/citroen/press/quarant-anni-fa-nacque-una-nuova-citroen-visa','https://www.mazda-qatar.com/vehicles/mazda-bt-50/grades/']
r=[]
for u in urls:
 t,c,err=e.fetch(u);txt=e.clean(t.text_content()) if t is not None else '';r.append({'url':u,'error':err,'text':txt});print(u,err,txt[:100])
e.write('analysis/codex/single-generation-pass/batch-3/primary-supplement.json',r)
from PIL import Image,ImageDraw
keys=['fiat--freemont','nissan--nv200','aro--24','aro--10'];out=Image.new('RGB',(1000,270),(40,40,40));d=ImageDraw.Draw(out)
for i,k in enumerate(keys):
 im=Image.open('public/front/'+k+'--0.webp').convert('RGBA');im.thumbnail((230,230));out.paste(im,(i*250,25),im);d.text((i*250+5,5),k,fill='white')
out.save('analysis/codex/single-generation-pass/batch-3/drawings.png')
